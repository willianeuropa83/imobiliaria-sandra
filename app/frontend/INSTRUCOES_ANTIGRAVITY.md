# Instruções para o Antigravity — Frontend Imobiliária Sandra

## Objetivo
Testar e executar o frontend Next.js da Imobiliária Sandra.

## Pré-requisitos
- Node.js 18+ instalado
- imoveis-app a correr em localhost:8000 (opcional — funciona com dados mock sem ele)

## Passos

### 1. Instalar dependências
```
cd "C:\Users\Hot_D\Desktop\COWORK AI\IMOBILIARIA SANDRA\app\frontend"
npm install
```

### 2. Executar em modo desenvolvimento
```
npm run dev
```
Abre: http://localhost:3000

### 3. Testar o build de produção
```
npm run build
npm start
```

## Output esperado
- Página inicial com hero, barra de pesquisa, imóveis em destaque
- Página /imoveis com filtros e listagem
- Página /imoveis/[id] com detalhes do imóvel
- Dados mock aparecem mesmo sem o imoveis-app a correr

## Erros conhecidos
- Se `leaflet` der erro de window/document, é porque SSR — já deve estar tratado com dynamic import
- Se a API não responder, o frontend usa dados mock automaticamente
