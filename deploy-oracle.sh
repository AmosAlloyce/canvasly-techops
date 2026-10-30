#!/usr/bin/env bash
set -euo pipefail

# Deploy Canvasly TechOps Platform (Frontend + Express API + Real n8n + Ntfy) to Oracle Cloud Always Free VM
# Usage: ./deploy-oracle.sh <ubuntu@oracle-public-ip> [ssh-key-path]

REMOTE_TARGET="${1:-}"
SSH_KEY="${2:-$HOME/.ssh/id_ed25519}"

if [ -z "$REMOTE_TARGET" ]; then
  echo "Usage: ./deploy-oracle.sh <user@oracle-server-ip> [path-to-ssh-key]"
  exit 1
fi

echo "==> Building production frontend bundle locally..."
npm run build

echo "==> Syncing Canvasly TechOps Stack to Oracle Server ($REMOTE_TARGET)..."
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=accept-new "$REMOTE_TARGET" "mkdir -p ~/canvasly-techops"
rsync -avz --exclude 'node_modules' --exclude '.git' -e "ssh -i $SSH_KEY" ./ "$REMOTE_TARGET:~/canvasly-techops/"

echo "==> Launching Docker Compose stack (OpsOS App + n8n + Ntfy) on Oracle Server..."
ssh -i "$SSH_KEY" "$REMOTE_TARGET" "cd ~/canvasly-techops && docker compose up -d --build && docker exec canvasly-n8n n8n import:workflow --input=/workflows/wf_01_master_orchestrator.json || true"

echo "==> Deployment Complete!"
echo "    - Canvasly TechOps & Datadog UI: http://${REMOTE_TARGET#*@}:3000"
echo "    - Live Self-Hosted n8n Engine:   http://${REMOTE_TARGET#*@}:5678"
echo "    - Ntfy 24/7 P1 On-Call Pager:    http://${REMOTE_TARGET#*@}:8085"
