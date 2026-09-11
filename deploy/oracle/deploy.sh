#!/usr/bin/env bash
# The Observer US — deploy to Oracle VM (Vercel-free)
# Usage: sudo bash deploy/oracle/deploy.sh
set -euo pipefail

APP_DIR="/opt/observer/the-observer-us"
REPO="https://github.com/HamzaAhmedAI/the-observer-us.git"
BRANCH="deploy-oracle"
ENV_FILE="/opt/observer/.env"

echo "==> Deploying The Observer US to $APP_DIR"

if [ ! -d "$APP_DIR/.git" ]; then
  echo "==> Cloning repo (branch $BRANCH)"
  git clone --depth 1 --branch "$BRANCH" "$REPO" "$APP_DIR"
else
  echo "==> Pulling latest"
  git -C "$APP_DIR" fetch origin "$BRANCH"
  git -C "$APP_DIR" reset --hard "origin/$BRANCH"
fi

cd "$APP_DIR"
echo "==> npm ci"
npm ci
echo "==> build"
npm run build
echo "==> restart service"
systemctl restart the-observer || true
echo "==> done. Check: journalctl -u the-observer -f"
