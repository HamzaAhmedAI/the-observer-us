# The Observer US — Oracle VM Deployment (Vercel-free, $0)

This app now runs as a **standard Next.js + Payload** server on the Oracle
Always Free VM. No Vercel, no Cloudflare Workers. Only cost = the domain.

## Stack
- **App:** Next.js 16 + Payload 3.87 (`next start`, port 3000)
- **DB:** Neon free Postgres (real content) — via `DATABASE_URL`
- **Media:** local disk (`staticDir`) served at `/media/*`
- **Reverse proxy / HTTPS:** Caddy (automatic Let's Encrypt) OR Cloudflare Tunnel
- **Front:** Cloudflare DNS (orange-cloud) → CDN/WAF (free)

## Files in this folder
- `the-observer.service`       — systemd unit, runs `next start`
- `Caddyfile`                  — local HTTPS + proxy to :3000
- `cloudflared.service`        — Cloudflare Tunnel (no open ports, free SSL)
- `env.production.example`     — copy to `/opt/observer/.env`
- `deploy.sh`                  — one-shot install (idempotent-ish)

## Prereqs on the VM
- Node 22 (already present)
- `git`, `caddy`, `cloudflared` installed
- A `DATABASE_URL` (Neon free) pointing at your existing content
- `PAYLOAD_SECRET`, `CRON_SECRET`, `REVALIDATION_SECRET` set
- Domain `theobserverus.com` added to Cloudflare, NS pointed there

## Quick start
```bash
sudo cp deploy/oracle/the-observer.service /etc/systemd/system/
sudo cp deploy/oracle/Caddyfile /etc/caddy/
sudo systemctl daemon-reload
sudo systemctl enable --now the-observer
sudo systemctl restart caddy
```
Then (choose ONE ingress):
- **Option A (simple):** Caddy handles HTTPS directly. Point DNS A record to VM IP.
- **Option B (recommended, free, no open ports):** run `cloudflared` tunnel,
  orange-cloud the domain, no inbound firewall changes needed.

See `the-observer-deployment-plan.md` (workspace root) for the full rationale.
