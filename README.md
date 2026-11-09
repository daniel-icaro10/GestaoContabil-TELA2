# HUBContábil Financial — Front-end (protótipo visual)

Plataforma SaaS de gestão contábil com 4 portais:

| Portal | Rota | Quem usa |
|---|---|---|
| Super Admin | `/admin` | Dono da plataforma (escritórios, usuários, planos, assinaturas) |
| Escritório Contábil | `/escritorio` | Escritório assinante (clientes, equipe, DP, tributos, white-label) |
| Cliente PJ | `/pj` | Empresas atendidas pelo escritório |
| Cliente PF | `/pf` | Pessoas físicas atendidas pelo escritório |

## Acesso

Há um login por perfil (Super Admin, Escritório, Cliente PJ, Cliente PF). As credenciais **não ficam no código
nem neste README**: `src/lib/auth.tsx` guarda apenas o hash SHA-256 de `email:senha`. Peça os acessos ao responsável.
Sem login (ou sem permissão), as rotas voltam para `/login`.
É uma proteção apenas de front-end; a autenticação real virá com o backend.

Todos os dados são fictícios e ficam em memória
(arquivos `data.ts` de cada portal em `src/pages/<portal>/`). A cor da marca (white-label) é salva no navegador.

## Rodar localmente

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # gera ./dist
```

## Deploy no Render

O arquivo `render.yaml` já configura um **Static Site**:

1. Suba o projeto para um repositório no GitHub.
2. No Render: **New → Blueprint** e selecione o repositório (ou **New → Static Site** manualmente com
   Build Command `npm install && npm run build` e Publish Directory `dist`).
3. Se criar manualmente, adicione em *Redirects/Rewrites*: Source `/*` → Destination `/index.html` → Action `Rewrite`
   (necessário para as rotas do React funcionarem ao recarregar a página).

## Estrutura

```
src/
  components/   Layout dos portais, kit de UI, toasts, marca (white-label)
  portals.tsx   Menus e configuração de cada portal
  pages/
    admin/      Super Admin
    escritorio/ Portal do Escritório
    pj/         Portal Cliente PJ
    pf/         Portal Cliente PF
```
