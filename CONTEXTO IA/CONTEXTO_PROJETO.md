# IMOBILIARIA SANDRA — Contexto Mestre do Projeto

> **Criado:** 18/07/2026 | **Agente:** 04 (Imobiliário) | **Versão:** 1.0
> Qualquer agente que assuma este projeto lê este ficheiro primeiro.

---

## 1. Visão Geral

**Nome do projeto:** Imobiliária Sandra
**Objetivo:** Desenvolver uma plataforma (site + app mobile) de busca de imóveis em Portugal, agregando anúncios de múltiplos portais imobiliários via scraping.
**Cliente:** Sandra (corretora imobiliária real — pessoa física)
**Mercado-alvo:** Portugal nacional
**Responsável técnico:** Deivid (desenvolvimento integral)

---

## 2. Decisões Tomadas (18/07/2026)

| Decisão | Resposta |
|---------|----------|
| Sandra é quem? | Pessoa real, corretora imobiliária |
| Tipo de produto | App mobile + Site |
| Mercado | Portugal nacional (expandido do plano original Coimbra 50km) |
| Fonte de imóveis | Scraping de portais (Idealista, Imovirtual, OLX, etc.) |
| Papel da Sandra | Só utiliza a plataforma — Deivid desenvolve tudo |
| Stack técnico | A definir (Deivid pediu orientação) |
| Prioridade | MVP web rápido → app depois |

## 2.1 Trabalho Já Realizado (pré-existente)

| Ficheiro/Pasta | Data | Descrição |
|----------------|------|-----------|
| `COWORK AI/PLANO_APP_IMOBILIARIA.md` | 11/03/2026 | Plano original com 3 opções de custo (A:0€, B:8-12€, C:25-35€), arquitetura, funcionalidades, prazo 9-13 sessões. Foco: Coimbra 50km. |
| `COWORK AI/PROSPECCAO_IMOVEIS_COIMBRA_50KM.xlsx` | 11/03/2026 | Planilha de prospecção de imóveis na zona de Coimbra |
| `COWORK AI/LEADS E PROSPECÇÃO/` | Fev-Mar 2026 | Gestão de leads da Sofisticada: modelo de pasta, clientes convertidos (DC, JC, KC, NM, SM) |
| `COWORK AI/MONITOR_CPF_SANDRA/` | Jun 2026 | Monitorização do CPF da Sandra (relatórios, scripts Antigravity) |
| `COWORK AI/PROCESSOS_SANDRA/` | Jun 2026 | Monitorização de processos judiciais da Sandra (4 processos: Fábio, Santander 1G/2G, Bradesco) |

**NOTA:** O plano original (`PLANO_APP_IMOBILIARIA.md`) foca Coimbra 50km e 3 utilizadores (Deivid, Sandra, Gracielle). Na sessão de 18/07/2026, o âmbito foi expandido para Portugal nacional e a Sandra como face pública (não co-gestora). O plano deve ser atualizado.

---

## 3. Arquitetura Recomendada

### 3.1 Stack Proposto

| Camada | Tecnologia | Justificação |
|--------|-----------|--------------|
| **Frontend Web** | **Next.js 14+ (React)** | SSR/SSG para SEO (crítico em imobiliário), App Router, rápido para MVP, grande ecossistema |
| **Backend/API** | **Next.js API Routes + Python (FastAPI)** | API Routes para lógica simples do site; FastAPI como microserviço de scraping (Python é rei no scraping) |
| **Scraping** | **Scrapy + Playwright** | Scrapy para portais com HTML estático; Playwright para portais com JS dinâmico (Idealista) |
| **Base de dados** | **PostgreSQL + PostGIS** | Queries geoespaciais nativas (busca por raio, zona, mapa), robusto, gratuito |
| **Cache** | **Redis** | Cache de pesquisas frequentes, rate limiting, filas de scraping |
| **Search Engine** | **Meilisearch** (ou Typesense) | Pesquisa instantânea com filtros (preço, tipologia, zona), typo-tolerant, leve |
| **Hosting Web** | **Vercel** (free tier para MVP) | Deploy automático do Next.js, CDN global, zero config |
| **Hosting Scraping** | **Hetzner** (servidor existente) | Já têm servidor; scraping precisa de IP dedicado e cron jobs |
| **App Mobile** | **React Native** (fase 2) | Partilha conhecimento React do web; Expo para desenvolvimento rápido |
| **Mapas** | **Mapbox** ou **Leaflet** (OSM) | Visualização de imóveis no mapa; Leaflet é gratuito |
| **Armazenamento imagens** | **Cloudflare R2** ou **S3** | Imagens dos imóveis scraped; R2 tem egress gratuito |

### 3.2 Diagrama de Arquitetura (simplificado)

```
┌─────────────────────────────────────────────────────────┐
│                    UTILIZADOR                           │
│              (Browser / App Mobile)                     │
└────────────────────┬────────────────────────────────────┘
                     │
         ┌───────────▼───────────┐
         │   Next.js (Vercel)    │
         │  - SSR/SSG pages      │
         │  - API Routes         │
         │  - Auth (NextAuth)    │
         └───────────┬───────────┘
                     │
        ┌────────────┼─────────────┐
        │            │             │
   ┌────▼────┐ ┌─────▼─────┐ ┌────▼────┐
   │ Postgres │ │ Meilisearch│ │  Redis  │
   │ +PostGIS │ │ (search)   │ │ (cache) │
   └────▲────┘ └─────▲─────┘ └─────────┘
        │            │
        └─────┬──────┘
              │
   ┌──────────▼──────────┐
   │  Scraping Service   │
   │  (FastAPI + Scrapy) │
   │  Hetzner Server     │
   │  - Cron jobs 2x/dia │
   │  - Playwright (JS)  │
   │  - Dedup + clean    │
   └─────────────────────┘
        │         │         │
   ┌────▼──┐ ┌───▼───┐ ┌───▼──┐
   │Idealista│ │Imovir-│ │ OLX  │ ...
   │        │ │ tual  │ │      │
   └────────┘ └───────┘ └──────┘
```

### 3.3 Porquê este stack (e não outro)

**Next.js em vez de Django/WordPress:**
- SEO nativo via SSR (páginas de imóveis indexadas pelo Google — essencial para tráfego orgânico)
- React é a base para React Native depois (app mobile), logo o conhecimento é reutilizado
- Vercel dá hosting gratuito no MVP
- WordPress seria rápido mas limitado em funcionalidade de busca avançada

**Python para scraping (não Node.js):**
- Scrapy é o framework de scraping mais maduro e robusto que existe
- Playwright em Python integra-se bem com Scrapy
- Bibliotecas de parsing (BeautifulSoup, lxml) muito superiores em Python
- O servidor Hetzner já tem Python disponível

**PostgreSQL + PostGIS (não MongoDB):**
- Imóveis têm estrutura relacional (endereço, tipologia, preço, coordenadas)
- PostGIS permite queries como "imóveis num raio de 5km de Coimbra" nativamente
- Joins eficientes entre imóveis, zonas, estatísticas

---

## 4. Portais-Alvo para Scraping (Portugal)

| Portal | URL | Tipo | Dificuldade | Notas |
|--------|-----|------|-------------|-------|
| **Idealista** | idealista.pt | JS dinâmico | Alta | Anti-bot agressivo; Playwright necessário; é o maior portal PT |
| **Imovirtual** | imovirtual.com | Misto | Média | Bom volume de anúncios |
| **OLX** | olx.pt (imobiliário) | API interna | Média | Muitos particulares; secção imobiliário |
| **Supercasa** | supercasa.pt | HTML | Baixa-Média | Portal profissional |
| **Casa Sapo** | casa.sapo.pt | HTML | Baixa | Portal histórico PT |
| **RE/MAX** | remax.pt | JS dinâmico | Média | Grandes imobiliárias |
| **ERA** | era.pt | JS | Média | Imobiliária com presença nacional |
| **CustoJusto** | custojusto.pt | HTML | Baixa | Classificados gerais com secção imobiliária |

**Estratégia de scraping:**
- Fase 1 (MVP): Idealista + Imovirtual + OLX (cobertura ~80% do mercado)
- Fase 2: Supercasa + Casa Sapo + CustoJusto
- Fase 3: RE/MAX + ERA + outros

**Frequência:** 2x/dia (06:00 e 18:00) — equilibra frescura dos dados vs carga nos portais.

**Deduplicação:** Hash por título+preço+localização+área para evitar duplicados entre portais.

---

## 5. Funcionalidades — MVP Web (Fase 1)

### Essenciais (must-have)
- Página inicial com barra de pesquisa (zona, tipologia, preço)
- Listagem de resultados com filtros (preço min/max, T0-T5+, área, distrito/concelho)
- Página de detalhe do imóvel (fotos, descrição, preço, mapa, link para portal original)
- Mapa interativo com pins dos imóveis
- Pesquisa por localização (distrito, concelho, freguesia)
- Marca/branding da Sandra (logo, cores, contacto)
- Página "Sobre" / contacto da Sandra
- Responsive design (mobile-first)
- SEO optimizado (meta tags, sitemap, schema.org/RealEstate)

### Desejáveis (nice-to-have para MVP)
- Alertas por email ("novos T2 em Coimbra até 150k")
- Favoritos (guardar imóveis)
- Comparação de imóveis lado a lado
- Histórico de preços (tracking de variações)
- Estatísticas de mercado por zona (preço médio/m², tendências)

---

## 6. Roadmap Faseado

### Fase 1 — MVP Web (4-6 semanas)
**Objetivo:** Site funcional com busca de imóveis, dados de 3 portais.

| Semana | Entregável |
|--------|-----------|
| S1 | Setup projeto Next.js, design UI (Figma/direto), DB schema, branding Sandra |
| S2 | Scraping v1 (Idealista + Imovirtual), pipeline de ingestão na DB |
| S3 | Frontend: página inicial, listagem, filtros, página de detalhe |
| S4 | Mapa interativo, SEO, página de contacto, responsive |
| S5 | Scraping OLX, deduplicação entre portais, testes |
| S6 | Deploy Vercel + domínio, QA, lançamento soft |

### Fase 2 — Melhorias Web (semanas 7-10)
- Alertas por email (novos imóveis matching)
- Favoritos + conta de utilizador
- Mais portais (Supercasa, Casa Sapo)
- Estatísticas de mercado por zona
- Histórico de preços
- Performance e caching

### Fase 3 — App Mobile (semanas 11-16)
- React Native / Expo
- Funcionalidades core do web adaptadas a mobile
- Push notifications para alertas
- Geolocalização nativa ("imóveis perto de mim")
- Publicação nas stores (App Store + Google Play)

### Fase 4 — Escala (contínuo)
- Mais portais
- AI features (recomendações, avaliação automática de preço)
- Dashboard para Sandra (leads, analytics)
- Monetização (premium, publicidade, leads para agências)

---

## 7. Considerações Legais

**Scraping em Portugal:**
- A Lei de Proteção de Dados (RGPD) aplica-se — não recolher dados pessoais dos anunciantes (nomes, telefones) sem base legal.
- Respeitar robots.txt de cada portal.
- Linkar para o anúncio original (não copiar conteúdo integral).
- Modelo agregador (como o Trovit ou Nestoria) é legal se: credita a fonte, não replica todo o conteúdo, linka para o original.
- Termos de serviço dos portais podem restringir scraping — avaliar risco por portal.

**Recomendação:** Apresentar snippet (título, preço, localização, 1 foto) + link para anúncio completo no portal original. Minimiza risco legal e reduz carga de storage.

---

## 8. Custos Estimados (MVP)

| Item | Custo Mensal | Notas |
|------|-------------|-------|
| Vercel (hosting web) | 0 EUR | Free tier suficiente para MVP |
| Hetzner (scraping) | ~5 EUR | Já têm servidor; custo incremental mínimo |
| Domínio (.pt) | ~10 EUR/ano | Registo via dns.pt ou registar.pt |
| PostgreSQL (Supabase free) | 0 EUR | Free tier: 500 MB, suficiente para MVP |
| Meilisearch (cloud) | 0 EUR | Self-hosted no Hetzner |
| Cloudflare R2 (imagens) | ~0-2 EUR | 10 GB gratuitos |
| **Total MVP** | **~5-10 EUR/mês** | Infraestrutura mínima viável |

---

## 9. Próximos Passos Imediatos

1. [ ] Confirmar nome de domínio (imobiliariasandra.pt? sandra-imoveis.pt?)
2. [ ] Sandra tem logo/branding ou precisa de ser criado?
3. [ ] Iniciar setup do projeto Next.js
4. [ ] Criar schema da base de dados
5. [ ] Desenvolver primeiro scraper (Idealista — o mais difícil)
6. [ ] Design da interface (wireframes ou direto para código)

---

## 10. INFRAESTRUTURA EXISTENTE (imoveis-app)

**DESCOBERTA CRÍTICA (18/07/2026):** Existe um app funcional em `C:\Users\Hot_D\Desktop\COWORK AI\imoveis-app` que já resolve o problema de scraping:

| Item | Valor |
|------|-------|
| Stack | FastAPI + SQLAlchemy + SQLite |
| BD | ~1294 imóveis ativos, 444 inativos |
| Portais autónomos (9) | imovirtual, supercasa, olx, custojusto, remax, era, century21, caimoveis, caixaimobiliario |
| Servidor | localhost:8000 |
| Atualização | Diária às 07:00 (Task Scheduler Windows) |
| Idealista | Modo assistido (CAPTCHA manual) |
| Casafari | Credenciais inválidas (pendente) |

**IMPLICAÇÃO PARA O PROJETO:**
- NÃO construir scrapers do zero — reutilizar imoveis-app como fonte de dados
- O frontend Next.js (Imobiliária Sandra) consome a API FastAPI existente (localhost:8000)
- Para deploy público (Hetzner): migrar imoveis-app + frontend Next.js para o VPS
- Schema da BD SQLite existente deve ser respeitado (não criar schema novo)

**Skill de referência:** `imobiliario-prospeccao` — contém workflows, erros conhecidos por portal, scripts principais

---

## 11. Ficheiros do Projeto

| Ficheiro | Localização | Descrição |
|----------|-------------|-----------|
| CONTEXTO_PROJETO.md | IMOBILIARIA SANDRA/CONTEXTO IA/ | Este ficheiro (contexto mestre) |
| STATUS_ATUAL.md | IMOBILIARIA SANDRA/ | Estado corrente das tarefas |
| LOG_ACOES.md | IMOBILIARIA SANDRA/ | Histórico de ações por sessão |

---

*Última atualização: 18/07/2026 — Agente 04 (Imobiliário)*
