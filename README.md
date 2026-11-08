# The Observer US — Home & Wallet Protection

US home and wallet protection: home costs, bills and insurance, household
recalls, home scams, and data breaches. Every story answers: what happened,
who is affected, and what to do next — with the official source linked.

- **Site:** https://theobserverus.com
- **Stack:** Next.js 16 (App Router) + Payload CMS 3.87 + Neon Postgres,
  Resend email, web-push. See `deploy/oracle/README.md` for the server setup.
- **Deploy:** self-hosted on an Oracle Always Free VM — Cloudflare Tunnel →
  `next start` on port 3001. **Deploy branch is `main`** (`deploy.sh` pulls
  it). Do not deploy from `deploy-oracle`; it was merged into `main` in
  November 2026.
- **Env:** copy `.env.example` to `/opt/observer/.env` on the VM and fill in
  real values. Never commit a filled-in `.env`.

## Development

```bash
npm ci
npm run dev        # http://localhost:3000 (mock data when no CMS is configured)
npm run lint
npm run build      # production build; mock articles are disabled in production
```

## Content model

- **Categories** (`src/lib/nav.ts` is the single source of truth):
  Home Costs, Bills & Insurance, Household Recalls, Home Scams, Breach Actions.
- **Articles** have a content type — evergreen hub, news hook, or tool guide —
  plus linked official sources, a last-reviewed date, and an affiliate-links
  flag that renders a disclosure on the page.
- **Publishing** happens in the Payload admin (`/admin`), backed by the Neon
  database. Content lives in the database, not in this repo.
- **No general news.** Do not add politics/world/sports/entertainment
  categories or articles — that is the old model this site pivoted away from.

## Monetization (in order)

1. Affiliate actions in the evergreen hubs (identity protection, VPN,
   insurance quote leads) — the fastest path to the first $100.
2. Journey by Mediavine at 1,000 Tier-1 sessions / 30 days.
3. Raptive at 25,000 pageviews / month. AdSense as filler only.
4. Facebook is traffic-only for this site (Pakistan is Stars-only for
   Facebook Content Monetization) — never forecast Meta payouts.
