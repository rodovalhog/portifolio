# ENGINEERING PORTFOLIO — AI CAREER PLATFORM

## 1. Visão do produto

Construir meu portfólio profissional como uma aplicação de software real, moderna e tecnicamente sofisticada.

O projeto não deve ser tratado como um simples "developer portfolio".

Ele deve funcionar simultaneamente como:

* Portfólio profissional
* Currículo interativo
* Engineering Case Study
* Architecture Playground
* AI Career Assistant
* AI Job Analyzer
* Cover Letter Generator
* MCP Server
* Application Assistant
* Base de conhecimento profissional
* Demonstração prática de engenharia de software

A principal ideia é:

> O próprio portfólio deve demonstrar a forma como eu penso e construo software.

Não quero somente afirmar:

"Tenho experiência com React, Next.js, arquitetura, IA e performance."

Quero que a própria aplicação demonstre essas competências.

---

# 2. Objetivos principais

O produto deve permitir que um visitante:

1. Conheça meu perfil.
2. Entenda minha experiência profissional.
3. Explore meus projetos.
4. Veja decisões arquiteturais.
5. Entenda problemas técnicos que resolvi.
6. Visualize arquiteturas de sistemas.
7. Conheça minhas skills.
8. Baixe meu currículo.
9. Consulte minhas cover letters.
10. Converse com uma IA sobre meu perfil.
11. Analise uma vaga.
12. Gere uma cover letter.
13. Prepare uma candidatura.
14. Revise uma candidatura antes do envio.

O sistema também deve demonstrar tecnicamente:

* Clean Architecture
* SOLID
* Clean Code
* Design Patterns
* Modular Monolith
* TypeScript
* Next.js
* React
* Node.js
* AI Agents
* MCP
* WebMCP
* Performance
* SEO
* Accessibility
* Testing
* Observability
* Security
* Cloud Architecture

---

# 3. Stack principal

Utilizar:

* Next.js com App Router
* React
* TypeScript
* Tailwind CSS
* Node.js
* PostgreSQL
* Zod
* Vitest ou Jest
* React Testing Library
* Playwright
* ESLint
* Prettier

Para MCP:

* Official Model Context Protocol TypeScript SDK
* linha estável atual
* utilizar schemas fortemente tipados
* utilizar transporte recomendado pela especificação atual
* não implementar manualmente JSON-RPC/MCP quando o SDK oficial resolver o problema

Para i18n:

* `pt-BR`
* `en-US`

Utilizar a estratégia de routing internacionalizado compatível com o App Router atual.

Não acoplar o domínio à biblioteca escolhida para i18n.

---

# 4. Monorepo

Utilizar monorepo somente porque existem fronteiras arquiteturais reais.

Estrutura inicial:

```text
apps/

  web/
    Next.js application

  mcp-server/
    MCP server

packages/

  domain/
  application/
  infrastructure/
  ai/
  ui/
  i18n/
  analytics/
  observability/
  config/
  shared/
```

Utilizar workspace do gerenciador de pacotes.

Não adicionar ferramentas como Turborepo apenas por estética.

Adicionar somente se existir benefício mensurável.

---

# 5. Arquitetura geral

A aplicação deve ser inicialmente um:

## Modular Monolith

Não implementar microservices sem necessidade.

Arquitetura:

```text
                         ┌────────────────────┐
                         │      Browser       │
                         └─────────┬──────────┘
                                   │
                                   ▼
                         ┌────────────────────┐
                         │      Next.js       │
                         │    Presentation    │
                         └─────────┬──────────┘
                                   │
                                   ▼
                         ┌────────────────────┐
                         │   Application      │
                         │     Use Cases      │
                         └─────────┬──────────┘
                                   │
                                   ▼
                         ┌────────────────────┐
                         │       Domain       │
                         │   Business Rules   │
                         └─────────┬──────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              ▼                    ▼                    ▼
       ┌────────────┐       ┌────────────┐       ┌────────────┐
       │ Profile    │       │ Career     │       │Application │
       │ Module     │       │ AI Module  │       │ Module     │
       └────────────┘       └─────┬──────┘       └─────┬──────┘
                                  │                     │
                                  ▼                     ▼
                           ┌────────────┐       ┌──────────────┐
                           │ AI Gateway │       │ Repositories │
                           └────────────┘       └──────────────┘
                                  │
                                  ▼
                           ┌────────────┐
                           │ MCP Server │
                           └─────┬──────┘
                                 │
                     ┌───────────┼────────────┐
                     ▼           ▼            ▼
                  Browser    Job APIs     External Apps
```

---

# 6. Regra de dependência

O domínio nunca deve depender diretamente de:

* React
* Next.js
* PostgreSQL
* ORM
* OpenAI
* Gemini
* Anthropic
* MCP
* Browser automation
* HTTP

Dependências devem apontar para dentro.

---

# 7. Organização dos módulos

Cada módulo deve possuir:

```text
domain/
application/
infrastructure/
presentation/
```

Exemplo:

```text
career-agent/

  domain/

    entities/
    value-objects/
    services/
    errors/

  application/

    use-cases/
    dto/
    ports/

  infrastructure/

    ai/
    repositories/
    mcp/

  presentation/

    components/
    controllers/
    schemas/
```

---

# 8. Perfil profissional como Source of Truth

Esta é uma das partes mais importantes da aplicação.

Todas as funcionalidades devem consumir um modelo central de perfil.

Criar:

```typescript
ProfessionalProfile
```

O perfil deverá conter:

```typescript
interface ProfessionalProfile {
  personal: PersonalInformation
  summary: LocalizedText
  experiences: Experience[]
  projects: Project[]
  skills: Skill[]
  education: Education[]
  certifications: Certification[]
  achievements: Achievement[]
  languages: Language[]
  links: ProfessionalLinks
  resumes: Resume[]
  coverLetters: CoverLetter[]
}
```

Nenhum componente deve possuir informações profissionais hardcoded.

---

# 9. Localized Content

Criar:

```typescript
interface LocalizedText {
  "pt-BR": string
  "en-US": string
}
```

Conteúdo profissional deve possuir traduções independentes.

Exemplo:

```typescript
interface Project {
  id: string

  title: LocalizedText
  description: LocalizedText
  context: LocalizedText
  problem: LocalizedText
  solution: LocalizedText
  architecture: LocalizedText
  impact: LocalizedText

  technologies: Technology[]
}
```

Tecnologias não devem ser duplicadas por idioma.

---

# 10. i18n

Suportar:

```text
pt-BR
en-US
```

Estrutura:

```text
app/
  [lang]/
```

As rotas devem ser localizadas.

Exemplo:

```text
/pt-BR
/pt-BR/about
/pt-BR/experience
/pt-BR/projects
/pt-BR/architecture
/pt-BR/resume
/pt-BR/career

/en-US
/en-US/about
/en-US/experience
/en-US/projects
/en-US/architecture
/en-US/resume
/en-US/career
```

Considerar URLs curtas como:

```text
/pt
/en
```

caso isso produza melhor UX/SEO.

A decisão deve ser registrada em ADR.

---

# 11. Locale context

Distinguir:

```typescript
uiLocale
jobLocale
outputLocale
```

Exemplo:

```text
UI:
pt-BR

Job:
en-US

Cover Letter:
en-US
```

O sistema deve suportar essa situação.

---

# 12. Language switcher

Trocar idioma preservando a página atual.

Exemplo:

```text
/pt-BR/projects/ecommerce
```

→

```text
/en-US/projects/ecommerce
```

Não voltar para home.

Considerar:

1. locale explícito na URL
2. preferência salva
3. browser locale
4. default `pt-BR`

Não sobrescrever uma escolha explícita do usuário.

---

# 13. UI translations

Todos os textos de interface devem estar separados do componente.

Não fazer:

```tsx
if (locale === "pt-BR") {
  return "Sobre mim"
}
```

Usar dicionários.

```text
src/i18n/messages/

pt-BR.json
en-US.json
```

Criar validação automática garantindo paridade das chaves.

---

# 14. Professional content versioning

Meu perfil profissional deve ser versionado.

Uma alteração futura no currículo não deve alterar retroativamente uma candidatura já enviada.

Exemplo:

```text
Profile Version 1
Profile Version 2
Profile Version 3
```

Cada candidatura deve guardar:

```text
profileVersion
resumeVersion
coverLetterVersion
```

usadas naquele momento.

---

# 15. Hybrid persistence strategy

Não armazenar tudo no banco.

Separar:

### Versioned content

Pode permanecer em arquivos versionados no Git:

```text
profile/
projects/
experiences/
```

### Mutable/private data

Banco PostgreSQL:

```text
applications
application_events
users
sessions
audit_logs
generated_documents
ai_runs
```

Essa decisão deve ser documentada em ADR.

---

# 16. PostgreSQL

Utilizar PostgreSQL para dados mutáveis.

Criar repositories:

```typescript
ProfileRepository
ApplicationRepository
AuditRepository
AIExecutionRepository
```

O domínio não deve conhecer o ORM.

---

# 17. Authentication

Criar autenticação para:

```text
/admin
/career/applications
/private
```

A área pública não precisa de autenticação.

O usuário autenticado deve possuir permissões.

Exemplo:

```text
PUBLIC
OWNER
ADMIN
```

---

# 18. Admin

Criar um painel administrativo para editar:

* experiência
* skills
* projetos
* currículo
* links
* cover letters
* dados públicos
* dados privados
* traduções

Implementar:

```text
Draft
Published
Archived
```

Não permitir que uma alteração privada apareça acidentalmente na área pública.

---

# 19. Audit Log

Todas as ações sensíveis devem possuir auditoria.

Registrar:

```text
actor
action
resource
timestamp
requestId
result
```

Exemplo:

```text
USER APPROVED APPLICATION
USER GENERATED COVER LETTER
MCP TOOL EXECUTED
APPLICATION SUBMITTED
```

Nunca registrar secrets.

---

# 20. Public / Private / Restricted

Criar:

```typescript
enum DataVisibility {
  PUBLIC,
  PRIVATE,
  RESTRICTED
}
```

Exemplos:

PUBLIC:

* experiências
* projetos
* skills
* GitHub
* LinkedIn

PRIVATE:

* telefone
* endereço
* documentos

RESTRICTED:

* dados utilizados para candidaturas
* dados sensíveis para automação

Uma IA pública nunca deve acessar dados privados.

---

# 21. LGPD

Criar o sistema considerando:

* finalidade
* minimização de dados
* transparência
* segurança
* controle de acesso
* retenção
* exclusão
* exportação

Criar futuramente:

```text
Privacy Policy
Data Policy
AI Usage Policy
```

Não armazenar dados pessoais desnecessários.

---

# 22. Home

A home deve comunicar imediatamente:

Quem sou.

O que construo.

Como penso.

No que tenho experiência.

Não utilizar uma hero genérica.

Exemplo conceitual:

```text
Software Engineer

Building scalable products,
high-performance experiences
and AI-powered systems.
```

Adicionar:

```text
Explore my work
View resume
Talk to my AI
```

---

# 23. Engineering DNA

Criar uma seção visual mostrando minhas áreas de especialização.

Exemplos:

```text
Frontend Engineering
Architecture
Performance
AI Engineering
Backend
Cloud
DevOps
Testing
SEO
```

Cada skill deve abrir:

* experiências
* projetos
* decisões
* tecnologias
* cases

Não utilizar apenas barras de progresso.

---

# 24. Career Timeline

Mostrar:

```text
Company
Role
Period
Context
Problem
Decision
Implementation
Impact
```

A experiência profissional deve ser apresentada como engenharia, não como lista de tarefas.

---

# 25. Engineering Case Studies

Criar estudos de caso.

Modelo:

```text
Context
Problem
Constraints
Options
Decision
Trade-offs
Implementation
Impact
Lessons Learned
```

Sempre que possível, mostrar métricas reais.

Nunca inventar métricas.

---

# 26. Architecture Lab

Criar uma área:

```text
Architecture Lab
```

Arquiteturas:

* E-commerce
* Micro Frontends
* CDN
* Cache
* Redis
* SQS
* SNS
* Kafka
* Search
* API Gateway
* Load Balancer
* Observability
* AI Agents
* MCP

Diagramas devem ser interativos.

Clicar em um componente deve mostrar:

```text
Responsibility
Why exists
Trade-offs
Failure modes
Scaling strategy
```

---

# 27. Architecture simulation

Permitir simular uma requisição.

Exemplo:

```text
User
 ↓
CDN
 ↓
Load Balancer
 ↓
API Gateway
 ↓
Service
 ↓
Cache
 ↓
Database
```

Animar o fluxo.

Mostrar latency aproximada apenas quando for baseada em dados reais ou claramente identificada como simulação.

---

# 28. Interactive terminal

Adicionar como experiência complementar.

Comandos:

```text
about
skills
experience
projects
architecture
ai
resume
contact
```

Não permitir execução arbitrária de comandos no servidor.

O terminal deve ser apenas uma interface de interação.

---

# 29. Ask My Resume

Criar:

```text
Ask my Resume
```

Perguntas:

```text
Which projects demonstrate Next.js experience?

What experience do you have with architecture?

Have you worked with performance optimization?
```

A resposta deve utilizar somente informações públicas.

---

# 30. AI Career Agent

Criar um agente especializado no meu perfil.

Capacidades:

```text
get_profile
get_experience
get_projects
get_skills
analyze_job
match_profile
generate_resume
generate_cover_letter
prepare_application
```

A IA não deve inventar informações.

---

# 31. Structured AI outputs

Quando a resposta tiver estrutura, não retornar texto livre.

Exemplo:

```typescript
interface JobAnalysis {
  role: string
  company?: string
  requirements: JobRequirement[]
  responsibilities: string[]
  relevantExperience: ExperienceReference[]
  relevantProjects: ProjectReference[]
  potentialGaps: RequirementAnalysis[]
  suggestedResumeFocus: string[]
}
```

Utilizar JSON Schema/Zod para validação.

---

# 32. Evidence / Provenance

Todo conteúdo gerado pela IA que contenha afirmações sobre minha carreira deve possuir referências internas.

Exemplo:

```text
Claim:
"Led a performance optimization project."

Evidence:
experience.casas-bahia.project.performanceOptimization
```

A UI pode mostrar:

```text
Based on:
Casa Bahia → Search Performance Project
```

Isso reduz hallucination e demonstra engenharia de IA responsável.

---

# 33. AI hallucination protection

A IA deve seguir:

```text
Only use verified profile data.
```

Nunca inventar:

* empresas
* cargos
* tecnologias
* resultados
* números
* responsabilidades
* certificações

Quando não houver informação:

```text
Information not available in the professional profile.
```

---

# 34. AI Provider abstraction

Criar:

```typescript
interface AIProvider {
  generateText(...)
  generateStructured<T>(...)
}
```

Implementações possíveis:

```text
OpenAI
Gemini
Anthropic
```

O domínio não conhece fornecedores.

---

# 35. AI Gateway

Criar uma camada:

```text
AI Gateway
```

Responsável por:

* provider selection
* retries
* timeout
* rate limiting
* structured output
* telemetry
* token usage
* cost tracking

---

# 36. AI prompt versioning

Prompts importantes devem possuir versão.

Exemplo:

```text
career-agent-v1
job-analyzer-v2
cover-letter-v3
```

Uma execução de IA deve guardar:

```text
model
promptVersion
locale
inputHash
duration
tokenUsage
result
```

Nunca armazenar dados sensíveis desnecessariamente.

---

# 37. AI evaluation

Criar conjunto de testes para IA.

Exemplos:

```text
Does it invent experience?
Does it confuse companies?
Does it respect locale?
Does it expose private information?
Does it follow job-specific instructions safely?
```

Criar datasets de avaliação.

Executar no CI para prompts críticos.

---

# 38. Job Description Analyzer

Input:

```text
Job Description
```

Output estruturado:

```text
Role
Company
Seniority
Skills
Requirements
Responsibilities
Location
Language
Relevant Experience
Relevant Projects
Potential Gaps
```

Não apresentar uma "nota de fit" como verdade absoluta.

Mostrar evidências.

---

# 39. Job URL security

Nunca fazer fetch arbitrário de URLs sem proteção.

Considerar:

* allowlist
* SSRF protection
* private IP blocking
* protocol validation
* redirects validation
* timeout
* response size limit
* content type validation

Conteúdo externo nunca deve ganhar autoridade sobre as instruções do sistema.

---

# 40. Prompt Injection

Uma descrição de vaga é:

```text
UNTRUSTED DATA
```

Nunca:

```text
Job Description → System Instructions
```

Sempre:

```text
System Rules
+
Developer Rules
+
Trusted Profile
+
External Job Content
+
User Request
```

A vaga jamais poderá sobrescrever regras internas.

---

# 41. Career Cover Letter

Criar:

```text
/career/cover-letter
```

Fluxo:

```text
Job Description
 ↓
Analyze Job
 ↓
Retrieve Relevant Experience
 ↓
Generate Draft
 ↓
Evidence Validation
 ↓
Human Review
 ↓
Final Version
```

Suportar:

* Portuguese
* English
* diferentes tons
* edição manual
* download
* versionamento

---

# 42. Resume Generator

Gerar currículo a partir do mesmo modelo de domínio.

Não duplicar conteúdo manualmente.

Gerar:

```text
CV PT
CV EN
```

Possuir versões:

```text
general
frontend
fullstack
ai
architecture
```

mas sem inventar experiências.

---

# 43. PDF generation

O PDF deve usar os mesmos dados do domínio.

Não manter:

```text
website data
PDF data
CV data
```

como três fontes independentes.

Uma única fonte deve alimentar todos.

---

# 44. Application Domain

Criar entidade:

```typescript
Application
```

Estados:

```text
DRAFT
ANALYZING
READY_FOR_REVIEW
APPROVED
SUBMITTING
SUBMITTED
FAILED
CANCELLED
```

Criar transições válidas.

Não permitir:

```text
DRAFT → SUBMITTED
```

sem aprovação.

---

# 45. Human in the loop

Fluxo obrigatório:

```text
AI
 ↓
Prepare
 ↓
Validate
 ↓
Human Review
 ↓
Approve
 ↓
Execute
```

Nunca:

```text
AI → Submit
```

---

# 46. Application Preview

Antes de qualquer ação externa mostrar:

```text
Field
Value
Source
Confidence
```

Exemplo:

```text
Name
Guilherme Rodovalho
Source: profile.personal.name

Email
...
Source: profile.contact.email

Experience
...
Source: experience.casas-bahia
```

O usuário deve conseguir editar.

---

# 47. Application provider abstraction

Criar:

```typescript
interface JobApplicationProvider {
  analyze(): Promise<JobApplicationSchema>

  prepare(
    data: ApplicationData
  ): Promise<PreparedApplication>

  fill(
    data: ApplicationData
  ): Promise<FillResult>

  submit(): Promise<SubmissionResult>
}
```

Implementações futuras:

```text
LinkedInProvider
GreenhouseProvider
LeverProvider
WorkdayProvider
CustomProvider
```

Não acoplar o domínio aos fornecedores.

---

# 48. Browser automation

Browser automation deve ser um componente separado.

Pode utilizar:

```text
Playwright
Browser Extension
WebMCP
MCP Client
```

dependendo da plataforma e do fluxo.

O agente não deve possuir seletores CSS hardcoded dentro do domínio.

---

# 49. CAPTCHA / bot detection

Quando aparecer:

```text
CAPTCHA
Bot verification
Human verification
Suspicious activity
```

a automação deve parar.

O sistema deve pedir intervenção humana.

Nunca implementar mecanismos para burlar CAPTCHA ou controles anti-bot.

---

# 50. Idempotência

O envio de candidatura deve ser idempotente.

Criar:

```text
idempotencyKey
```

Evitar:

```text
Submit
Submit
Submit
```

gerar três candidaturas.

---

# 51. Retry strategy

Nunca fazer retry automático cego em ações de mutação.

Diferenciar:

```text
READ
SAFE RETRY

WRITE
IDEMPOTENT RETRY

SUBMIT
NO BLIND RETRY
```

---

# 52. MCP Architecture

Criar MCP Server separado.

Utilizar SDK oficial.

Ferramentas:

### Public/read-only

```text
get_profile
get_experience
get_projects
get_skills
get_resume
```

### Protected

```text
prepare_application
get_private_application_data
```

### Highly sensitive

```text
fill_application
submit_application
```

---

# 53. MCP authorization

Separar autorização por nível de risco.

Read tools:

```text
LOW RISK
```

Mutating tools:

```text
HIGH RISK
```

Ferramentas sensíveis exigem:

* authentication
* authorization
* scope
* audit log
* human approval quando necessário

Nunca confiar apenas no nome da ferramenta.

Validar autorização no servidor.

---

# 54. MCP tool schemas

Todas as tools devem ter:

* input schema
* output schema
* validation
* errors conhecidos
* auditability

Não utilizar argumentos arbitrários como:

```typescript
Record<string, any>
```

Preferir schemas tipados.

---

# 55. MCP Resources

Avaliar utilização de MCP Resources para:

```text
profile
resume
projects
architecture
case studies
```

Ferramentas devem executar ações.

Resources representam conhecimento/contexto.

Manter essa distinção quando fizer sentido.

---

# 56. MCP prompts

Avaliar MCP Prompts para:

```text
analyze-job
prepare-application
generate-cover-letter
interview-preparation
```

Não duplicar lógica entre prompt, AI Agent e application use case.

O domínio continua sendo a fonte de regras.

---

# 57. MCP auditability

Registrar:

```text
mcpRequestId
tool
actor
argumentsHash
result
duration
timestamp
approvalId
```

Nunca registrar secrets ou PII desnecessária.

---

# 58. Security boundaries

Criar separação explícita entre:

```text
Public Internet
   ↓
Next.js
   ↓
Application Layer
   ↓
Private Domain Data
   ↓
MCP
   ↓
External Platforms
```

Não permitir que uma ferramenta tenha acesso amplo ao sistema.

Princípio:

```text
Least Privilege
```

---

# 59. Secrets

Nunca colocar:

```text
API_KEY
DATABASE_URL
OAuth secrets
MCP secrets
```

no client.

Utilizar secret management no ambiente de produção.

`.env.example` deve existir.

---

# 60. Security headers

Implementar:

* CSP
* HSTS
* X-Content-Type-Options
* Referrer-Policy
* Permissions-Policy
* frame protections

Evitar CSP permissiva apenas para fazer alguma biblioteca funcionar.

---

# 61. Rate limiting

Implementar rate limiting em:

```text
AI endpoints
contact
job analysis
cover letter generation
MCP
authentication
```

Não utilizar rate limiting somente no frontend.

---

# 62. Observability

Criar abstrações:

```text
Logger
Metrics
Tracer
```

Considerar OpenTelemetry.

Monitorar:

```text
request latency
AI latency
AI token usage
AI cost
MCP calls
application failures
external provider failures
```

Utilizar correlation IDs.

---

# 63. Error handling

Criar erros de domínio:

```text
ProfileNotFoundError
UnauthorizedError
ForbiddenError
JobAnalysisError
AIProviderError
InvalidApplicationStateError
ApplicationApprovalRequiredError
MCPToolExecutionError
ExternalProviderError
```

Não vazar stack trace para o usuário.

---

# 64. Resilience

Para serviços externos implementar:

* timeout
* retry quando seguro
* exponential backoff
* circuit breaker quando realmente necessário
* fallback

Não transformar uma falha da IA em indisponibilidade do portfolio.

---

# 65. Portfolio availability

Se:

```text
AI down
MCP down
Analytics down
GitHub down
```

o portfolio continua funcionando.

O conteúdo principal deve ser independente dessas integrações.

---

# 66. SEO

Implementar:

* metadata
* canonical
* hreflang
* sitemap
* robots
* Open Graph
* Twitter/X cards
* structured data
* Person
* ProfilePage
* Article quando necessário

As páginas privadas não devem ser indexadas.

---

# 67. International SEO

Cada idioma deve possuir:

```text
canonical
hreflang
metadata
localized content
localized title
localized description
```

Nunca tratar versões de idiomas como conteúdo duplicado sem diferenciação.

---

# 68. Performance

Objetivo:

Excellent Core Web Vitals.

Preferir:

* Server Components
* streaming
* static rendering
* image optimization
* font optimization
* dynamic imports
* cache
* minimal client JavaScript

Client Component somente quando houver necessidade real.

---

# 69. Performance budget

Definir budget.

Exemplo conceitual:

```text
Initial JS
Image payload
Font payload
LCP
INP
CLS
```

Integrar Lighthouse/PageSpeed ou equivalente ao CI quando possível.

O projeto deve demonstrar performance engineering.

---

# 70. Accessibility

Implementar:

* semantic HTML
* keyboard navigation
* screen reader support
* focus management
* contrast
* reduced motion
* form accessibility
* accessible dialogs

Testar automaticamente com ferramentas de accessibility.

---

# 71. Analytics

Criar:

```typescript
interface Analytics {
  track(event: AnalyticsEvent): void
}
```

Eventos:

```text
page_view
project_view
architecture_open
resume_download
career_agent_open
job_analysis
cover_letter_generated
application_prepared
application_approved
application_submitted
contact_clicked
```

Não enviar PII desnecessária para analytics.

---

# 72. GitHub

Preparar integração com GitHub.

Mostrar:

* repositories
* selected projects
* contribution information
* languages

GitHub não pode ser source of truth do portfolio.

Se GitHub estiver indisponível:

portfolio continua funcionando.

---

# 73. Contact

Criar formulário de contato.

Implementar:

* validation
* spam protection
* rate limiting
* server-side validation
* confirmation state
* error state

Nunca confiar somente na validação frontend.

---

# 74. Testing strategy

### Unit

* domain
* value objects
* use cases
* validation

### Integration

* repositories
* database
* AI gateway
* MCP tools

### E2E

* locale switch
* portfolio navigation
* resume download
* AI agent
* job analyzer
* cover letter
* application review
* approval
* protected routes

---

# 75. Contract testing

Criar testes de contrato para:

```text
AI structured output
MCP tools
Job application providers
```

Garantir que alterações não quebrem consumidores.

---

# 76. CI/CD

Pipeline:

```text
install
lint
typecheck
unit tests
integration tests
build
e2e
security checks
```

Não permitir deploy quando checks críticos falharem.

---

# 77. Dependency policy

Antes de adicionar uma dependência:

1. A plataforma já resolve?
2. Essa dependência é realmente necessária?
3. Qual seu impacto no bundle?
4. Qual o risco de manutenção?
5. Existe lock/versioning?

Não utilizar biblioteca simplesmente porque ela é popular.

---

# 78. Documentation

Criar:

```text
README.md

docs/

  architecture.md
  security.md
  i18n.md
  ai.md
  mcp.md
  performance.md
  testing.md
  privacy.md
  deployment.md

  decisions/

    ADR-001-nextjs
    ADR-002-modular-monolith
    ADR-003-i18n
    ADR-004-ai-provider
    ADR-005-mcp
    ADR-006-profile-source-of-truth
    ADR-007-application-workflow
```

---

# 79. Architecture Decision Records

Cada decisão importante deve explicar:

```text
Context
Problem
Options
Decision
Trade-offs
Consequences
```

Não criar ADR para decisões triviais.

---

# 80. Design System

Criar componentes:

```text
Button
Card
Badge
Container
Section
Typography
Dialog
Drawer
Tabs
Timeline
SkillCard
ProjectCard
ArchitectureNode
ArchitectureEdge
LanguageSwitcher
AIChat
ApplicationPreview
```

Evitar duplicação.

---

# 81. Visual design

Estética:

* tecnológica
* sofisticada
* minimalista
* engineering-oriented

Inspirada em:

* Linear
* Vercel
* Stripe
* Raycast
* GitHub

Evitar:

* excesso de neon
* excesso de gradient
* código caindo na tela
* animações excessivas
* visual de portfólio genérico

---

# 82. Animations

Utilizar animações apenas quando agregarem:

* compreensão
* feedback
* hierarquia
* storytelling

Respeitar:

```text
prefers-reduced-motion
```

---

# 83. Mobile

Criar experiência mobile real.

Não simplesmente "encolher desktop".

Priorizar:

* navigation
* readability
* performance
* touch
* accessibility

---

# 84. Progressive enhancement

O sistema principal deve funcionar mesmo sem:

```text
JavaScript avançado
AI
MCP
Analytics
GitHub
```

Funcionalidades avançadas são enhancement.

---

# 85. Routes

Estrutura inicial:

```text
/[lang]

/[lang]/about
/[lang]/experience
/[lang]/skills
/[lang]/projects
/[lang]/projects/[slug]

/[lang]/architecture
/[lang]/architecture/[slug]

/[lang]/resume
/[lang]/career
/[lang]/career/job-analyzer
/[lang]/career/cover-letter

/[lang]/contact
```

Privadas:

```text
/admin
/private
```

---

# 86. Sitemap / indexing

Indexar somente conteúdo público.

Não indexar:

```text
/admin
/private
/api
/job-analyzer
/application
```

quando houver conteúdo privado ou individualizado.

---

# 87. Data architecture

Entidades:

```text
ProfessionalProfile
Experience
Project
Skill
Technology
Achievement
Education
Certification
Resume
CoverLetter
Job
JobRequirement
Application
ApplicationField
ApplicationEvent
AIExecution
MCPToolExecution
AuditLog
User
```

Value Objects:

```text
Email
URL
DateRange
Locale
JobLocation
SkillLevel
```

---

# 88. Application events

Registrar eventos de domínio:

```text
ApplicationCreated
JobAnalyzed
ApplicationPrepared
ApplicationReviewed
ApplicationApproved
ApplicationSubmitted
ApplicationSubmissionFailed
CoverLetterGenerated
```

Não introduzir event bus distribuído.

Inicialmente utilizar eventos internos do módulo.

---

# 89. Future scalability

Arquitetura deve permitir posteriormente separar:

```text
AI Agent
MCP Server
Application Worker
```

em serviços independentes.

Mas não implementar a separação antes de existir necessidade.

---

# 90. Background jobs

Se determinada operação tornar-se longa:

```text
document generation
AI processing
browser automation
application submission
```

preparar arquitetura para background jobs.

Não travar request HTTP durante operações longas.

---

# 91. Application dashboard

Criar futuramente:

```text
Applications
```

Mostrar:

```text
Company
Role
Date
Status
Resume Version
Cover Letter Version
Job Analysis
Application History
```

Estados:

```text
Draft
Ready
Approved
Submitted
Failed
Rejected
Archived
```

---

# 92. Interview preparation

Adicionar no futuro:

```text
Interview Preparation Agent
```

Ele poderá utilizar:

* Job Description
* Meu currículo
* Minha experiência
* Projetos

para gerar:

```text
Technical Questions
System Design Questions
Behavioral Questions
Topics to Review
Relevant Experiences
```

Sem inventar experiências.

---

# 93. AI context architecture

Não enviar todo o perfil para o modelo em toda requisição.

Utilizar retrieval contextual.

Exemplo:

```text
User Question
      ↓
Intent
      ↓
Relevant Profile Data
      ↓
AI Context
      ↓
LLM
```

Princípio:

```text
Minimum Necessary Context
```

Isso reduz:

* custo
* latência
* exposição de dados
* risco de hallucination

---

# 94. AI memory

Não persistir automaticamente toda conversa.

Separar:

```text
Conversation
Memory
Profile Data
Application Data
```

Memórias persistentes devem exigir justificativa e controle.

---

# 95. Rate and cost control

AI deve ter:

```text
token limits
request limits
model selection
cost tracking
timeout
```

Não permitir que um usuário gere milhares de requisições caras.

---

# 96. AI fallback

Caso o modelo principal falhe:

```text
Primary Provider
      ↓
Fallback Provider
```

somente quando fizer sentido.

A troca de provider deve ser invisível para o domínio.

---

# 97. Quality principle

O projeto deve seguir:

```text
Simple architecture
Strong boundaries
Explicit contracts
Observable behavior
Secure defaults
Testable code
Minimal unnecessary dependencies
```

---

# 98. Regra contra overengineering

Antes de adicionar:

* microservice
* queue
* Kafka
* Redis
* Kubernetes
* event bus
* vector database

perguntar:

> Qual problema real isso resolve?

Se não houver problema real:

não adicionar.

---

# 99. Roadmap

## Phase 1 — Foundation

* Next.js
* TypeScript
* Tailwind
* Design System
* i18n
* Profile Domain
* Home
* About
* Experience
* Projects
* Skills
* Resume
* SEO
* Accessibility
* Performance
* Testing

## Phase 2 — Engineering Experience

* Architecture Lab
* Case Studies
* Interactive diagrams
* Terminal
* GitHub
* Engineering decisions

## Phase 3 — AI

* AI Gateway
* Ask My Resume
* Career Agent
* Job Analyzer
* Cover Letter Generator
* Evidence / provenance
* AI evaluation

## Phase 4 — MCP

* MCP Server
* Profile resources
* Read-only tools
* Protected tools
* Authorization
* Audit

## Phase 5 — Application Automation

* Application domain
* Provider abstraction
* Application preview
* Human approval
* Browser automation
* WebMCP
* Application history

## Phase 6 — Advanced Platform

* Admin CMS
* Versioned profile
* Interview Agent
* AI evaluation dashboard
* Advanced observability
* Background jobs

---

# 100. Critério final de sucesso

O projeto estará correto quando eu conseguir apresentar o portfólio em uma entrevista e explicar:

### Produto

Por que o produto existe.

### Arquitetura

Por que cada camada existe.

### Domain

Quais são as regras de negócio.

### Frontend

Por que determinado componente é Server ou Client Component.

### Performance

Como o site foi otimizado.

### SEO

Como o conteúdo é indexado.

### i18n

Como o conteúdo é localizado.

### AI

Como o contexto é construído.

### AI Safety

Como prompt injection e hallucination são tratados.

### MCP

Como ferramentas, resources e authorization funcionam.

### Security

Como dados pessoais são protegidos.

### Automation

Como o agente pode preparar uma candidatura sem assumir o controle do usuário.

### Testing

Como garantimos qualidade.

### Observability

Como sabemos quando algo falha.

### Scalability

Como evoluiríamos a arquitetura sem adicionar complexidade prematuramente.

---

# 101. Regra final para o agente de desenvolvimento

Você está atuando como Staff/Principal Software Engineer responsável por este produto.

Não implemente apenas o que parece interessante.

Implemente o que tenha valor arquitetural, de produto ou de experiência.

Sempre priorize:

1. Clareza
2. Simplicidade
3. Segurança
4. Performance
5. Testabilidade
6. Observabilidade
7. Manutenibilidade
8. Escalabilidade

Antes de criar uma abstração:

> Existe uma razão real?

Antes de adicionar uma dependência:

> A plataforma já resolve?

Antes de adicionar um serviço:

> Existe uma fronteira real?

Antes de adicionar IA:

> IA realmente melhora essa experiência?

Antes de automatizar uma ação:

> Existe aprovação humana suficiente?

Antes de expor um dado:

> Esse dado deveria realmente estar disponível nesse contexto?

O resultado final deve ser um produto profissional que demonstre não somente minhas tecnologias, mas principalmente minha capacidade de tomar boas decisões de engenharia.
