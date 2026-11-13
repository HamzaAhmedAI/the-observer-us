#!/usr/bin/env bash
# The Observer US — deploy to Oracle VM (Vercel-free)
# Usage: bash deploy/oracle/deploy.sh
# Run as opc (no sudo needed — sudo is used only for the service restart).
# If invoked via sudo, the app steps re-exec as opc: opc owns the checkout
# and holds the GitHub deploy key; root has neither, so a root-run git
# fetch fails with "Host key verification failed".
set -euo pipefail

APP_DIR="/opt/observer/the-observer-us"
REPO="https://github.com/HamzaAhmedAI/the-observer-us.git"
BRANCH="main"
ENV_FILE="/opt/observer/.env"

if [ "$(id -u)" -eq 0 ]; then
  exec sudo -u opc bash "$0" "$@"
fi

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

# Load production env for the build so static pages generate with real
# content (without this, the build renders empty pages and the homepage
# stays empty until ISR revalidates). DATABASE_URL is single-quoted in
# .env so `source` keeps the full value including its & query params;
# an unquoted value breaks on the first &.
if [ -f "$ENV_FILE" ]; then
  echo "==> Loading env for build"
  set -a; source "$ENV_FILE"; set +a
fi

echo "==> npm ci"
npm ci
echo "==> build"
npm run build
echo "==> restart service"
# Retry once: a restart issued immediately after a build can rarely fail
# with a transient polkit error ("Interactive authentication required").
if ! sudo systemctl restart the-observer; then
  echo "==> restart failed once — retrying in 3s"
  sleep 3
  sudo systemctl restart the-observer
fi
echo "==> done. Check: journalctl -u the-observer -f"

# NOTE: schema migrations are NOT run here yet. `payload migrate` cannot
# run on the VM today — the payload CLI fails to load payload.config.ts
# (tsx loader: "Cannot find module './collections/Users'"). Schema changes
# must be applied manually until that loader issue is fixed; see
# src/migrations/20261113_home_wallet_fields.ts (applied manually 2026-11-13).
