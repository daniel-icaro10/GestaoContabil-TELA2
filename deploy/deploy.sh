#!/usr/bin/env bash
# Deploy na VPS: envia o código local para /opt/hubcontabil e reconstrói o container.
# Rodar no Git Bash, na raiz do projeto:  bash deploy/deploy.sh
# Não mexe no Easypanel nem nos outros sistemas da VPS; só no container "hubcontabil".
set -euo pipefail

ALVO="${ALVO:-root@31.97.90.77}"
CHAVE="${CHAVE:-$HOME/.ssh/premium_vps}"
PORTA=3400
SSH=(ssh -i "$CHAVE" -o IdentitiesOnly=yes "$ALVO")
PACOTE="$(mktemp -t hubcontabil-XXXXXX).tgz"

# Empacota o projeto (sem node_modules, dist, .git e as capturas de tela da raiz)
tar -czf "$PACOTE" \
  --exclude=node_modules --exclude=dist --exclude=.git \
  --exclude='*.tsbuildinfo' --exclude='./*.png' .

scp -i "$CHAVE" -o IdentitiesOnly=yes "$PACOTE" "$ALVO:/tmp/hubcontabil.tgz"
rm -f "$PACOTE"

"${SSH[@]}" "set -e
  mkdir -p /opt/hubcontabil
  find /opt/hubcontabil -mindepth 1 -delete
  tar --no-same-owner -xzf /tmp/hubcontabil.tgz -C /opt/hubcontabil
  rm -f /tmp/hubcontabil.tgz
  cd /opt/hubcontabil
  docker compose -f docker-compose.vps.yml up -d --build
  docker image prune -f >/dev/null
  sleep 2
  curl -fsS -o /dev/null -w 'Site respondeu HTTP %{http_code} na porta $PORTA\n' http://127.0.0.1:$PORTA/"
