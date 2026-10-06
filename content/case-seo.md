# Case de SEO Técnico & Arquitetura — Casas Bahia

> Reestruturação arquitetural do padrão de URLs de departamento, categoria, subcategoria e coleção, engenharia de URLs canônicas e SEO técnico em plataforma de e-commerce com 19M+ usuários.

---

## Índice

- [Resumo Executivo](#resumo-executivo)
- [Evidências Oficiais — Google Search Console](#evidências-oficiais--google-search-console)
- [Contexto & Desafio Arquitetural](#contexto--desafio-arquitetural)
- [Frente 1 — Reestruturação do Padrão de URLs](#frente-1--reestruturação-do-padrão-de-urls)
- [Frente 2 — Engenharia de Canonicalização & Crawl Budget](#frente-2--engenharia-de-canonicalização--crawl-budget)
- [Frente 3 — Renderização SSR no Next.js & Schema.org](#frente-3--renderização-ssr-no-nextjs--schemaorg)
- [Frente 4 — Penetração na SERP & Top Queries](#frente-4--penetração-na-serp--top-queries)
- [Frente 5 — Diagnóstico de CTR & Próximos Passos](#frente-5--diagnóstico-de-ctr--próximos-passos)
- [Resultados Consolidados](#resultados-consolidados)
- [Performance por Categoria (Top Pages)](#performance-por-categoria-top-pages)
- [Competências Demonstradas](#competências-demonstradas)

---

## Resumo Executivo

- **Período de Comparação:** Últimos 3 meses vs. 3 meses anteriores ao deploy
- **Fonte Auditada:** Google Search Console (dados reais de produção)
- **Escala de Tráfego:** 19M+ usuários ativos e 1M+ acessos diários

| Métrica | Antes (3m anteriores) | Depois (Últimos 3m) | Variação Líquida |
| :--- | :--- | :--- | :--- |
| **Cliques Totais** | 12 | **92,6K** | **+7.717.167%** (▲) |
| **Impressões no Google** | 8,9K | **23,4M** | **+2.632.167%** (▲) |
| **Posição Média no Google** | 9 | **2** | **Melhora de 77%** (Top 2 nacional) |
| **CTR Médio** | 0,1% | **0,4%** | **+300%** (▲) |

---

## Evidências Oficiais — Google Search Console

### 1. Resumo Geral de Desempenho (3 Meses vs. Período Anterior)

![Google Search Console - Resumo de Performance 3 Meses](/images/evidence/dados-google-console.jpeg)

*Comprovação direta do salto de 12 para 92,6 mil cliques, 23,4 milhões de impressões e consolidação da posição média no topo da SERP (#2).*

---

### 2. Relatório de Top Páginas (URLs de Categorias e Departamentos)

![Google Search Console - Top Páginas por Cliques e Impressões](/images/evidence/dados-das-url-google-console.jpeg)

*Amostra das URLs que lideraram a escala a partir de uma linha de base zerada (0 cliques pré-reestruturação).*

---

## Contexto & Desafio Arquitetural

A plataforma de e-commerce enfrentava sérias deficiências de indexabilidade e ranqueamento orgânico em suas páginas de catálogo e busca:

1. **URLs Caóticas e Inconsistentes:** Páginas de produtos e categorias dependiam de query parameters dinâmicos desordenados (`/busca?cat=13&sort=...`), dificultando o entendimento da taxonomia pelo algoritmo do Googlebot.
2. **Desperdício de Crawl Budget:** A geração descontrolada de combinações de filtros faciais e ordenações sem tags canônicas fragmentava a autoridade de página (PageRank) em milhares de URLs duplicadas.
3. **Páginas Chave Inexistentes no Índice:** Como evidenciado pelo GSC ("Previous 3 months = 0"), categorias fundamentais (como Eletrodomésticos e Móveis) não possuíam tráfego orgânico relevante.
4. **Dependência Client-side:** Crawlers recebiam payloads que demandavam execução client-side de scripts para renderizar dados de catálogo.

---

## Frente 1 — Reestruturação do Padrão de URLs

Implementei uma arquitetura semântica e hierárquica padronizada em rotas RESTful no Next.js:

```
Padrão Antigo: /busca?q=geladeira&cat=14&page=1
Novo Padrão:   /c/[departamento]/[categoria]/[subcategoria]?filtro=categoria-c[id]
```

### Exemplos Reais em Produção:
- `/c/eletrodomesticos` (Departamento raiz)
- `/c/eletrodomesticos/refrigeradores` (Categoria)
- `/c/eletrodomesticos/refrigeradores/geladeira-2-portas` (Subcategoria de alta intenção comercial)
- `/c/eletrodomesticos/lavadoras/maquina-de-lavar-acima-de-10-kg` (Nicho de alta conversão)

**Impacto:** O Googlebot passou a rastrear uma árvore de diretórios lógica, reconhecendo a hierarquia da marca e distribuindo autoridade de domínio uniformemente.

---

## Frente 2 — Engenharia de Canonicalização & Crawl Budget

Estabeleci regras estritas de canonicalização no roteador da aplicação:

1. **Auto-Canonicalização em Páginas Raiz:** URLs puras de departamento, categoria e subcategoria possuem tag `<link rel="canonical">` auto-referencial absoluta e canônica.
2. **Consolidação de Facetas e Filtros:** Parâmetros de ordenação e filtros secundários (como faixa de preço e cor) apontam sua URL canônica para o nível de categoria imediatamente superior, impedindo a criação de páginas zumbis no índice do Google.
3. **Preservação de Crawl Budget:** O robô de busca concentra suas requisições nas páginas que convertem, sem desperdiçar ciclos de rastreamento em permutações infinitas de facetas.

```html
<!-- Exemplo de injeção automatizada via SSR -->
<link rel="canonical" href="https://www.casasbahia.com.br/c/eletrodomesticos/refrigeradores/geladeira-2-portas" />
```

---

## Frente 3 — Renderização SSR no Next.js & Schema.org

Para garantir que robôs de busca e assistentes de IA consumam dados sem fricção:

- **Server-Side Rendering (SSR):** Entrega imediata de HTML estruturado com tags Open Graph, títulos dinâmicos e meta descriptions exclusivas.
- **Injeção de JSON-LD Schema.org:**
  - `BreadcrumbList`: Habilitou sitelinks navegacionais diretamente na SERP.
  - `CollectionPage`: Mapeamento formal da coleção de produtos com contagem de itens.
  - `ItemList`: Metadados dos produtos pré-carregados no HTML inicial para suporte a Rich Snippets de preços e disponibilidade.

---

## Frente 4 — Penetração na SERP & Top Queries

A posição média subiu de **#9 para #2** (ganho de 77%), posicionando as Casas Bahia nas primeiras posições para termos de alta relevância comercial:

- **“casa bahia”** (Dominância de tráfego institucional e de marca)
- **“geladeira duas portas”** (Top 1 / Top 2 nacional)
- **“processador de alimentos”**
- **“maquina de lavar acima de 10 kg”**
- **“sofas” / “guarda roupas e roupeiros”**
- **“iphone”**

---

## Frente 5 — Diagnóstico de CTR & Próximos Passos

Com 23,4 milhões de impressões no Google, o CTR de 0,4% (mesmo tendo subido +300%) evidencia a principal oportunidade de expansão do canal:

1. **Testes A/B de Meta Títulos & Descriptions:** Inserção de gatilhos como parcelamento sem juros, frete rápido e descontos PIX nos snippets de busca.
2. **Sitemaps Dinâmicos Particionados:** Segmentação de arquivos XML de sitemap por departamento, com tags `lastmod` sincronizadas ao catálogo.
3. **Expansão para Combinações Long-Tail:** Identificação e abertura de novas rotas estáticas para termos com intenção transacional comprovada.

---

## Resultados Consolidados

| Categoria / URL | Cliques (Últimos 3m) | Impressões (Últimos 3m) | Variação de Cliques |
| :--- | :--- | :--- | :--- |
| `.../c/eletrodomesticos` | 34.634 | 6.991.788 | **+3.463.400%** |
| `.../c/moveis` | 31.636 | 7.421.874 | **+3.163.600%** |
| `.../c/telefones-e-celulares` | 5.894 | 4.033.621 | **+589.400%** |
| `.../c/tv-e-video` | 3.635 | 2.537.426 | **+363.500%** |
| `.../lavadoras/maquina-de-lavar-acima-de-10-kg` | 1.990 | 143.219 | **+199.000%** |
| `.../refrigeradores/geladeira-2-portas` | 1.198 | 318.590 | **+119.800%** |
| `.../refrigeradores` | 1.191 | 216.679 | **+119.100%** |
| `.../smartphones/iphone` | 1.027 | 95.997 | **+102.700%** |
| `.../sala-de-estar/sofas` | 844 | 94.093 | **+84.400%** |
| `.../quartos/guarda-roupas-e-roupeiros` | 744 | 141.519 | **+74.400%** |
| `.../colchoes/base-cama-box-queen` | 663 | 63.790 | **+66.300%** |
| `.../processador-de-alimentos` | 588 | 182.919 | **+58.800%** |
| `.../tanquinho` | 548 | 90.705 | **+54.800%** |

---

## Competências Demonstradas

- **Arquitetura de Roteamento de Alta Escala:** Desenho e sustentação de padrões de URLs para catálogo de milhões de SKUs.
- **Engenharia de SEO Técnico:** Canonicalização, Crawl Budget, SSR, Schema.org (JSON-LD) e Core Web Vitals.
- **Análise & Telemetria Orientada a Dados:** Extração e interpretação avançada de relatórios do Google Search Console.
- **Impacto Direto no Negócio:** Conversão de gargalos de indexação em milhões de acessos orgânicos qualificados.
