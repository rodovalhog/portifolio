# Case de Performance — Micro-frontend SSR de E-commerce

> Diagnóstico e otimização de performance em aplicação Next.js/React com
> renderização no servidor, conduzido com metodologia orientada a evidência.

---

## Índice

- [Contexto](#contexto)
- [Abordagem](#abordagem)
- [Frente 1 — Diagnóstico de event loop](#frente-1--diagnóstico-de-event-loop)
- [Frente 2 — Atribuição de CPU por função](#frente-2--atribuição-de-cpu-por-função)
- [Frente 3 — Decomposição do payload](#frente-3--decomposição-do-payload)
- [Frente 4 — CSS-in-JS](#frente-4--css-in-js)
- [Frente 5 — Vazamentos de temporizadores](#frente-5--vazamentos-de-temporizadores)
- [Frente 6 — Remoção de código morto](#frente-6--remoção-de-código-morto)
- [Frente 7 — Análise de bundle](#frente-7--análise-de-bundle)
- [Resultados consolidados](#resultados-consolidados)
- [Hipóteses refutadas](#hipóteses-refutadas)
- [Competências demonstradas](#competências-demonstradas)
- [Versão resumida para currículo](#versão-resumida-para-currículo)

---

## Contexto

Aplicação **Next.js 14 (Pages Router)** com **React 18** e **TypeScript**,
responsável pelas páginas de busca, categoria, departamento e coleção de três
bandeiras de varejo.

| Característica | Valor |
| -------------- | ----- |
| Arquitetura | Micro-frontend SSR |
| Tamanho de resposta | ~800 KB por requisição |
| Latência sob carga | `p99` próxima de 1,8 s |
| Design System | Baseado em Emotion |
| Estado global | Redux Toolkit com serialização SSR |

---

## Abordagem

O trabalho seguiu um princípio central: **medir antes de propor, validar depois
de implementar**. Nenhuma otimização foi aplicada sem dado que a justificasse.

**Ferramentas utilizadas:**

- **Clinic.js** (Doctor, Flame, Bubbleprof) — profiling de event loop, CPU e
  operações assíncronas
- **autocannon** — geração de carga controlada
- **Chrome DevTools Protocol** via Playwright — métricas de renderização e
  cobertura de CSS
- **Scripts próprios em Node** — agregação dos dados brutos dos profilers, já
  que a leitura visual dos relatórios se mostrou insuficiente e, em alguns
  casos, enganosa

---

## Frente 1 — Diagnóstico de event loop

Estabeleci um baseline com profiling sob carga e analisei as **amostras brutas**
em vez de confiar na interpretação visual dos gráficos.

### Achados que corrigiram o rumo da investigação

O perfil inicial apontava travamentos de até **6,6 s** no event loop. Ao
correlacionar cada travamento com CPU e heap, o quadro mudou:

| t (s) | Delay | CPU | Heap |
| ----- | ----- | --- | ---- |
| 4,2 | 4.191 ms | 11% | 241 MB |
| 18,8 | 6.663 ms | 13% | 433 MB |
| 25,2 | 3.437 ms | 15% | 406 MB |
| 37,4 | 4.638 ms | 10% | 621 MB |

Travamentos de vários segundos com **CPU entre 10% e 15%** descartam garbage
collection — que consome CPU intensamente — e apontam para I/O síncrono.

Duas descobertas adicionais invalidaram a medição inicial:

1. O profiling rodava em **modo de desenvolvimento**, com webpack ativo e React
   dev build
2. O `Dockerfile` executava `next start`, não o servidor Express — ou seja, **o
   alvo perfilado estava errado**

Refiz todo o diagnóstico contra o processo real de produção.

### Resultado

| Métrica | Modo dev | Produção |
| ------- | -------- | -------- |
| Latência `p50` | 1.062 ms | **690 ms** |

A distribuição do event loop era **bimodal** (`p50` de 0,7 ms, `p99` de 749 ms),
o que refutou a hipótese de que a renderização SSR bloqueava o loop de forma
sistemática.

---

## Frente 2 — Atribuição de CPU por função

Processei **5.276 amostras de stack** do Flame Graph com script próprio,
agregando *self time* por pacote e por função.

### O resultado contrariou a suposição da equipe

| Origem | CPU |
| ------ | --- |
| Carregamento de módulos | ~22% |
| `fnv1a52` (hash de ETag) | 4,9% |
| **`react-dom` (renderização)** | **2,1%** |
| **Código da aplicação** | **2,0%** |

A renderização React **não era o gargalo**. O custo concentrava-se em hash de
ETag sobre os 809 KB de cada resposta, além de serialização e encoding.

### Ação

Desativei a geração de ETag, já que o cache é feito por CDN e Redis:

```js
// next.config.js
generateEtags: false,
```

**Ganho:** eliminação de 4,9% de CPU por requisição, validado por inspeção do
header na resposta HTTP.

---

## Frente 3 — Decomposição do payload

Decompus a resposta HTTP de 809 KB por tipo de conteúdo:

| Conteúdo | Tamanho | % do HTML |
| -------- | ------- | --------- |
| **SVG inline** | 283,5 KB | **35,0%** |
| CSS-in-JS | 189,9 KB | 23,5% |
| Markup DOM | 191,4 KB | 23,7% |
| `__NEXT_DATA__` | 139,8 KB | 17,3% |

### Achado

Dos 233 SVGs presentes, apenas **45 eram únicos**. Um único ícone de estrela
repetia-se **170 vezes, somando 140,9 KB**. O total desperdiçado por duplicação
chegava a **154 KB**.

Rastreei a origem até o componente `Rating` do design system, que renderiza duas
camadas de cinco estrelas por avaliação, usado no filtro de avaliação (5
instâncias) e nos cards de produto (12 instâncias).

---

## Frente 4 — CSS-in-JS

Diagnostiquei que o projeto executava **dois runtimes simultâneos** — Emotion,
via design system, e styled-components — e que apenas o segundo possuía
extração SSR configurada.

### Medições

| Runtime | Tags `<style>` | Tamanho |
| ------- | -------------- | ------- |
| Emotion | 295 | 175,2 KB |
| styled-components | 1 | 14,3 KB |

- As 295 tags ficavam **no `<body>`**, espalhadas entre 2,5% e 82,3% do
  documento
- **88,7 KB eram blocos de CSS idênticos reemitidos** — o mesmo identificador
  repetido 33 vezes
- Cobertura de CSS medida via CDP: **0% de código não utilizado**

O dado de cobertura descartou PurgeCSS como solução e redirecionou o
diagnóstico de *"excesso de regras"* para *"repetição de regras"* — problema
que uma ferramenta de purge não resolveria.

### Experimento controlado

Chromium com 5 execuções por variante e recursos externos bloqueados para
isolar a variável:

| Métrica | Antes | Depois | Ganho |
| ------- | ----- | ------ | ----- |
| Recalc Style (CPU 4×) | 53,9 ms | 25,3 ms | **−53,1%** |
| Recalc Style (desktop) | 11,9 ms | 6,0 ms | −49,7% |
| Tamanho do HTML | 811,4 KB | 714,8 KB | **−96,6 KB** |

### Implementação

- Cache do Emotion **explícito e por requisição**, evitando vazamento entre
  requisições concorrentes
- `CacheProvider` compartilhado envolvendo a árvore de componentes
- Extração via `@emotion/server` no `_document`, com reemissão consolidada no
  `<head>` e remoção das tags inline do body

**Validação em rota real:** 295 tags no `<body>` → **0**.

### Distinção relevante

Medi também que o CSS comprimia de 189,5 KB para **15 KB em gzip**. Ou seja,
**não era gargalo de rede, e sim de CPU**. Essa distinção evitou que o time
priorizasse a frente errada.

---

## Frente 5 — Vazamentos de temporizadores

Auditei **43 ocorrências** de `setTimeout` e `setInterval`, corrigindo cinco
problemas reais:

| Problema | Impacto |
| -------- | ------- |
| Timer criado **durante o render** | Recriado a cada renderização; vazava no SSR |
| **Recursão infinita no servidor** | Função reagendava-se a cada 750 ms sem condição de parada |
| Estado de timer em escopo de módulo | **Compartilhado entre requisições concorrentes** |
| `setInterval` sem cleanup | Continuava após o desmonte, acessando DOM destacado |
| `setTimeout` sem cleanup | Disparava após o desmonte do componente |

Validação: **1.940 testes** e **74 snapshots** passando.

---

## Frente 6 — Remoção de código morto

Identifiquei que a camada de cache Redis estava morta por **dois motivos
independentes**:

1. Desabilitada por configuração em **todos** os ambientes e bandeiras
2. Pertencente a um servidor Express que **não executa em produção** — o
   container roda `next start`

**Removidos:** 15 arquivos, 4 dependências, variáveis de ambiente,
configuração de infraestrutura local e documentação associada.

Validação com verificação de tipos, lint e suíte completa de testes.

---

## Frente 7 — Análise de bundle

Analisei a composição do chunk `vendor` (258 KB gzip / 1.007 KB minificado)
extraindo os dados brutos do relatório do analyzer.

### Falso alarme esclarecido

O indicador *"First Load JS shared by all"* havia saltado de 191 KB para 327 KB,
sugerindo regressão. Demonstrei por subtração que **não havia regressão**:

| | Antes | Depois |
| --- | ----- | ------ |
| Total por rota | 332 KB | **335 KB** |
| Compartilhado | 191 KB | 327 KB |
| Específico da rota | 141 KB | 8 KB |

Os 141 KB de chunks por rota apenas **migraram** para um chunk compartilhado e
cacheável entre deploys. O carregamento real por rota variou apenas +0,9%.

### Achado real

Dos 47 pacotes analisados, **um único quebrava o tree-shaking**:

```json
"main": "src/index.ts",   // arquivo inexistente no pacote publicado
"module": ausente,         // sem entrada ESM
"sideEffects": ausente     // webpack assume efeitos colaterais
```

Impedia a eliminação de **81,2 KB**. Confirmei, por outro lado, que os imports
de barril do design system **não** eram problema, pois declaram ESM e
`sideEffects: false`.

---

## Resultados consolidados

| Entrega | Ganho | Status |
| ------- | ----- | ------ |
| ETag desativado | −4,9% CPU/requisição | Implementado e validado |
| CSS-in-JS: recálculo de estilo | −53% | Implementado e medido |
| CSS-in-JS: payload | −96,6 KB/resposta | Implementado |
| Vazamentos de temporizador | 5 correções | Implementado |
| Remoção do Redis | 15 arquivos, 4 deps | Concluído |
| Sprite de SVG | ~130 KB | Mapeado |
| Correção de tree-shaking | 81,2 KB | Diagnosticado |

---

## Hipóteses refutadas

Parte relevante do valor do trabalho esteve em **descartar caminhos errados
antes de investir esforço neles**:

| Hipótese inicial | Evidência que a refutou |
| ---------------- | ----------------------- |
| O SSR bloqueia o event loop | `react-dom` = 2,1% da CPU; `p95` de delay = 25 ms |
| O `__NEXT_DATA__` domina o payload | Representava 17,3%; SVG inline somava 35% |
| PurgeCSS reduziria o CSS | Cobertura media **0%** de CSS não utilizado |
| Imports de barril inflavam o bundle | Pacotes declaram ESM e `sideEffects: false` |
| O bundle regrediu 136 KB | Carga real por rota variou apenas +3 KB |

---

## Competências demonstradas

**Profiling de Node.js** — event loop, garbage collection, atribuição de CPU por
função, interpretação de flame graphs a partir de dados brutos em vez da
visualização.

**Performance web** — Core Web Vitals, recálculo de estilo, CSSOM, análise de
bundle, estratégias de cache e compressão.

**Rigor analítico** — cinco hipóteses refutadas com dados, incluindo o
reconhecimento de que o alvo inicial de medição estava errado, seguido da
refação do diagnóstico.

**Comunicação técnica** — separação consistente entre o comprovado e o
inconclusivo. O FCP, por exemplo, não apresentou melhora confiável, e isso foi
reportado como tal em vez de omitido.

---

## Versão resumida para currículo

> **Otimização de performance — plataforma de catálogo SSR (Next.js/React)**
>
> Conduzi diagnóstico de performance de micro-frontend SSR de e-commerce usando
> Clinic.js, autocannon e Chrome DevTools Protocol. Identifiquei por profiling
> que a renderização React representava apenas 2,1% da CPU, redirecionando o
> esforço para os gargalos reais: hash de ETag (−4,9% de CPU), duplicação de
> CSS-in-JS (−53% de recálculo de estilo, −96 KB por resposta) e 154 KB de SVG
> duplicado. Implementei extração SSR de CSS com Emotion, corrigi 5 vazamentos
> de temporizadores incluindo uma recursão infinita no servidor, e removi camada
> de cache Redis obsoleta. Validei cada hipótese com experimento controlado,
> refutando cinco suposições iniciais com dados.

---

## Notas de transparência

Pontos que devem ser apresentados com precisão em entrevista:

- A redução de **−96,6 KB** foi medida em experimento controlado; a confirmação
  final na rota de produção ficou pendente por indisponibilidade de uma API
  externa no momento da medição
- O **FCP não apresentou melhora estatisticamente confiável** no experimento
  isolado — o ganho comprovado é de tempo de recálculo de estilo
- O **sprite de SVG** foi mapeado e dimensionado, mas não implementado, por
  envolver decisão arquitetural sobre componente de design system
- A correção de **tree-shaking** depende de alteração em pacote mantido por
  outra equipe