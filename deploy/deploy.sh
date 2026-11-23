#!/usr/bin/env bash
# Deploy na VPS: envia o código local para /opt/hubcontabil e reconstrói os containers (app + Postgres).
# Rodar no Git Bash, na raiz do projeto:  bash deploy/deploy.sh
# Não mexe no Easypanel nem nos outros sistemas da VPS; só no projeto "hubcontabil".
# O banco fica no volume Docker "hubcontabil_hubcontabil-pg" e NÃO é apagado pelo deploy.
# Os segredos ficam em /opt/hubcontabil/.env.vps (só na VPS) e são preservados.
set -euo pipefail

ALVO="${ALVO:-root@31.97.90.77}"
CHAVE="${CHAVE:-$HOME/.ssh/premium_vps}"
PORTA=3400
SSH=(ssh -i "$CHAVE" -o IdentitiesOnly=yes "$ALVO")
PACOTE="$(mktemp -t hubcontabil-XXXXXX).tgz"

# Empacota o projeto (sem node_modules, dist, .git, .env e as capturas de tela da raiz)
tar -czf "$PACOTE" \
  --exclude=node_modules --exclude=dist --exclude=.git \
  --exclude='*.tsbuildinfo' --exclude='./*.png' --exclude='.env*' .

scp -i "$CHAVE" -o IdentitiesOnly=yes "$PACOTE" "$ALVO:/tmp/hubcontabil.tgz"
rm -f "$PACOTE"

"${SSH[@]}" "set -e
  mkdir -p /opt/hubcontabil
  if [ ! -f /opt/hubcontabil/.env.vps ]; then
    echo 'ERRO: falta /opt/hubcontabil/.env.vps (POSTGRES_PASSWORD, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD).'
    exit 1
  fi
  find /opt/hubcontabil -mindepth 1 -maxdepth 1 ! -name .env.vps -exec rm -rf {} +
  tar --no-same-owner -xzf /tmp/hubcontabil.tgz -C /opt/hubcontabil
  rm -f /tmp/hubcontabil.tgz
  cd /opt/hubcontabil
  docker compose --env-file .env.vps -f docker-compose.vps.yml up -d --build
  docker image prune -f >/dev/null
  for i in \$(seq 1 30); do
    curl -fsS -o /dev/null http://127.0.0.1:$PORTA/api/health && break
    sleep 2
  done
  curl -fsS -w '  <- /api/health HTTP %{http_code} na porta $PORTA\n' http://127.0.0.1:$PORTA/api/health"
