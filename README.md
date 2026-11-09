# HUBContábil Financial — Front-end (protótipo visual)

Plataforma SaaS de gestão contábil com 4 portais:

| Portal | Rota | Quem usa |
|---|---|---|
| Super Admin | `/admin` | Dono da plataforma (escritórios, usuários, planos, assinaturas) |
| Escritório Contábil | `/escritorio` | Escritório assinante (clientes, equipe, DP, tributos, white-label) |
| Cliente PJ | `/pj` | Empresas atendidas pelo escritório |
| Cliente PF | `/pf` | Pessoas físicas atendidas pelo escritório |

## Logins de demonstração

| Perfil | E-mail | Senha | Pode acessar |
|---|---|---|---|
| Super Admin | `admin@hubcontabil.com` | `admin123` | todos os portais |
| Escritório Contábil | `escritorio@hubcontabil.com` | `escritorio123` | Escritório, PJ e PF |
| Cliente PJ | `pj@hubcontabil.com` | `pj123` | só o portal PJ |
| Cliente PF | `pf@hubcontabil.com` | `pf123` | só o portal PF |

Os usuários ficam em `src/lib/auth.tsx`. Sem login (ou sem permissão), as rotas voltam para `/login`.
É uma proteção apenas visual (front-end); a autenticação real virá com o backend.

A tela `/login` também permite clicar no perfil para preencher o acesso. Todos os dados são fictícios e ficam em memória
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
