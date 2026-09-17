# Planejai

Planejai é uma aplicação web para criar simulações financeiras pessoais, acompanhar metas e receber orientações de um educador financeiro com IA. O usuário informa renda, despesas, dívidas, objetivo, custo e prazo; o app calcula a economia mensal necessária, gera um diagnóstico personalizado e permite conversar com a IA sobre a simulação.

## Funcionalidades

- Formulário guiado para criação de simulações financeiras.
- Cálculo de economia mensal necessária para atingir a meta.
- Resultado detalhado com renda, custos, dívidas, prazo e custo do objetivo.
- Insight financeiro personalizado gerado por IA.
- Chat com o educador financeiro dentro do card de insight.
- Histórico completo de perguntas e respostas por simulação.
- Salvamento das simulações e conversas no `localStorage`.
- Tela de histórico para consultar ou remover simulações anteriores.
- Suporte a tema claro e escuro.

## Tecnologias

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide React
- Gemini API

## Pré-requisitos

- Node.js `20.19+` ou `22.12+`
- npm
- Uma chave da Gemini API

## Como Rodar

Instale as dependências:

```bash
npm install
```

Crie um arquivo `.env` na raiz do projeto e informe a chave da IA:

```env
VITE_GEMINI_API_KEY=sua_chave_aqui
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse a aplicação no endereço exibido pelo Vite, normalmente:

```txt
http://localhost:5173
```

## Scripts

```bash
npm run dev
```

Inicia o servidor local com hot reload.

```bash
npm run build
```

Executa a checagem TypeScript e gera a versão de produção.

```bash
npm run preview
```

Serve localmente os arquivos gerados pelo build.

```bash
npm run lint
```

Executa o ESLint no projeto.

```bash
npm run lint:fix
```

Corrige automaticamente problemas de lint quando possível.

```bash
npm run format
```

Formata os arquivos com Prettier.

```bash
npm run format:check
```

Verifica se os arquivos estão formatados.

## Estrutura

```txt
src/
  components/
    features/        Componentes das telas e fluxos principais
    layout/          Layout raiz da aplicação
    shared/          Componentes reutilizáveis
  context/           Contextos globais
  data/              Dados, tipos e prompts da IA
  hooks/             Hooks de tema, storage e insight
  pages/             Páginas da aplicação
  services/          Integração com a Gemini API
  styles/            Tokens de tema
  utils/             Funções de moeda e simulação
```

## IA e Persistência

O insight inicial e as respostas do chat são gerados pela Gemini API. As simulações, os insights retornados e todo o histórico de conversa ficam salvos no `localStorage` do navegador com a chave `simulation-data`.

Como variáveis prefixadas com `VITE_` ficam disponíveis no cliente, use uma chave adequada para desenvolvimento e evite expor credenciais sensíveis em produção sem uma camada segura de backend.

## Fluxo Principal

1. O usuário preenche os dados financeiros e a meta.
2. O app salva a simulação no `localStorage`.
3. A página de resultado calcula os valores principais.
4. A IA gera um diagnóstico financeiro personalizado.
5. O usuário pode fazer quantas perguntas quiser sobre aquela simulação.
6. Cada pergunta e resposta é anexada ao histórico da simulação.
