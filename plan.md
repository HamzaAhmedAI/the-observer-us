# The Observer US — Implementation Plan

## Design Read

- **Page kind:** Editorial / News Media Platform
- **Audience:** General news readers, Google Discover traffic, email/push subscribers
- **Vibe:** Premium news publication — trustworthy, authoritative, fast
- **Aesthetic:** Clean editorial with typography-first hierarchy, high contrast, restrained motion
- **Design System:** Tailwind v4 + custom editorial tokens (no off-the-shelf UI kit)
- **Dial Settings:** `VARIANCE: 6` (offset/editorial asymmetry), `MOTION: 4` (fluid CSS transitions only), `DENSITY: 3` (airy, art-gallery-of-news spacing)
- **Palette direction:** Deep navy `#0f172a` / off-white `#f8fafc` with a singular accent (crimson red `#dc2626` for breaking news)
- **Typography:** Geist (sans display) + Geist Mono (code/data) via `next/font`

---

## Phase 0: Project Foundation & Design System

### User Stories
- **US-00-01:** As a developer, I want the Next.js project scaffolded with TypeScript and Tailwind v4 so I can start building immediately.
- **US-00-02:** As a designer, I want a design tokens system (colors, typography, spacing, shadows) so the site has a consistent visual language.
- **US-00-03:** As a developer, I want a shared layout (header, footer, navigation) so every page has the same chrome.

### Tasks
| # | Task | Description |
|---|------|-------------|
| 0.1 | Scaffold Next.js project | `npx create-next-app@latest` with App Router, TypeScript, Tailwind v4 |
| 0.2 | Install dependencies | `next`, `react`, `typescript`, `tailwindcss`, `@tailwindcss/postcss`, `next/font` |
| 0.3 | Create design tokens | `src/styles/tokens.css` — CSS custom properties for colors, typography, spacing, shadows, breakpoints |
| 0.4 | Set up typography | `src/lib/fonts.ts` — Configure Geist + Geist Mono via `next/font` |
| 0.5 | Build Global Header | `src/components/ui/Header.tsx` — Logo, nav links, dark mode toggle, mobile hamburger |
| 0.6 | Build Global Footer | `src/components/ui/Footer.tsx` — Links, copyright, newsletter signup stub |
| 0.7 | Build Navigation | `src/components/ui/Navigation.tsx` — Category nav, mobile drawer, active states |
| 0.8 | Create Root Layout | `src/app/layout.tsx` — Wire fonts, tokens, header, footer, metadata defaults |
| 0.9 | Create Middleware | `src/middleware.ts` — Edge headers (CSP, HSTS, security headers), geolocation routing |
| 0.10 | Install icon library | `@phosphor-icons/react` for all UI icons |

---

## Phase 1: Core Content Architecture (Week 1-2)

### User Stories
- **US-01-01:** As a reader, I want to browse articles by category so I can find news that interests me.
- **US-01-02:** As a reader, I want to read full articles with fast loading so I have a smooth experience.
- **US-01-03:** As a reader, I want to see the homepage with featured and latest stories so I know what's new.
- **US-01-04:** As an editor, I want a headless CMS connection so I can manage articles without touching code.

### Tasks
| # | Task | Description |
|---|------|-------------|
| 1.1 | Build CMS client | `src/lib/cms.ts` — Generic headless CMS client (abstraction layer for Payload/WordPress), fetch articles by category, slug, id |
| 1.2 | Create TypeScript types | `src/types/article.ts` — `Article`, `Category`, `Author`, `Media` interfaces |
| 1.3 | Build Homepage | `src/app/page.tsx` — Hero featured story, latest stories grid, category sections, trending sidebar |
| 1.4 | Build Category Feed | `src/app/(news)/[category]/page.tsx` — ISR category listing with pagination |
| 1.5 | Build Article Detail Page | `src/app/(news)/[category]/[slug]/page.tsx` — Full article with RSC rendering |
| 1.6 | Build Article Card Component | `src/components/reader/ArticleCard.tsx` — Reusable card with image, headline, date, category badge |
| 1.7 | Build Featured Hero Component | `src/components/reader/FeaturedHero.tsx` — Large hero for top story with 16:9 image |
| 1.8 | Build Category Sidebar | `src/components/reader/CategorySidebar.tsx` — Trending, related, category navigation |
| 1.9 | Build Pagination | `src/components/reader/Pagination.tsx` — Infinite scroll or numbered pagination for category feeds |
| 1.10 | Create empty/loading/error states | Skeleton loaders, empty state illustrations, error boundaries for all data-fetching components |

---

## Phase 2: Google Discover & SEO Engine (Week 3)

### User Stories
- **US-02-01:** As a search engine, I want JSON-LD structured data so my crawler understands article content.
- **US-02-02:** As Google Discover, I want large-image previews and fast pages so I can promote articles.
- **US-02-03:** As a search engine, I want a news sitemap so new articles are indexed quickly.
- **US-02-04:** As an RSS reader, I want an RSS feed so I can follow the publication in my feed reader.
- **US-02-05:** As an editor, I want automatic IndexNow pings so search engines discover articles immediately.

### Tasks
| # | Task | Description |
|---|------|-------------|
| 2.1 | Build JSON-LD Schema Component | `src/components/analytics/JsonLd.tsx` — Dynamic `NewsArticle` schema generator with all required fields |
| 2.2 | Build SEO Metadata Utility | `src/lib/seo.ts` — Generate metadata, OG tags, Twitter cards, robots meta for every page |
| 2.3 | Build OpenGraph Image Generator | `src/app/(news)/[category]/[slug]/opengraph-image.tsx` — Dynamic OG image generation with article title, image, publication name |
| 2.4 | Build News Sitemap | `src/app/news-sitemap.xml/route.ts` — Dynamic XML sitemap with `<news:news>` tags, last 48h articles |
| 2.5 | Build RSS Feed | `src/app/rss.xml/route.ts` — Dynamic RSS 2.0 feed with full article content |
| 2.6 | Build Robots Configuration | `src/app/robots.ts` — Robots.txt with sitemap reference, allow rules |
| 2.7 | Build Manifest | `src/app/manifest.ts` — PWA manifest for installable web app |
| 2.8 | Build IndexNow Integration | `src/lib/indexnow.ts` — POST to `api.indexnow.org` with article URL on publish |
| 2.9 | Build Cache Revalidation API | `src/app/api/revalidate/route.ts` — Secret-authenticated webhook for ISR cache purge |
| 2.10 | Image Optimization Setup | Configure `next/image` with 16:9 ratio enforcement, 1200px min width, WebP/AVIF |

---

## Phase 3: Reader Engagement & Subscriptions (Week 4)

### User Stories
- **US-03-01:** As a reader, I want to subscribe to the newsletter with just my email so I can get breaking news alerts.
- **US-03-02:** As a reader, I want to opt into browser push notifications so I never miss breaking stories.
- **US-03-03:** As a reader, I want to select my favorite categories so I only get alerts for topics I care about.
- **US-03-04:** As a publisher, I want subscriber data stored in a database so I can manage my audience.

### Tasks
| # | Task | Description |
|---|------|-------------|
| 3.1 | Build Subscriber Database | Supabase/PostgreSQL schema — `subscribers` table (email, push_token, category_prefs, created_at) |
| 3.2 | Build Email Opt-in Component | `src/components/reader/EmailSubscribe.tsx` — Non-intrusive email input with category selector |
| 3.3 | Build Push Opt-in Banner | `src/components/reader/PushBanner.tsx` — "Get instant alerts" banner with 1-tap opt-in |
| 3.4 | Build Email Subscribe API | `src/app/api/subscribe/email/route.ts` — Handle email subscription, store in DB, send confirmation |
| 3.5 | Build Push Subscribe API | `src/app/api/subscribe/push/route.ts` — Register push subscription, store token |
| 3.6 | Build Bookmark Button | `src/components/reader/BookmarkButton.tsx` — Client component for bookmarking articles |
| 3.7 | Build Share Tools | `src/components/reader/ShareTools.tsx` — Social share, copy link, native share API |
| 3.8 | Build Subscriber Preferences Page | `src/app/account/preferences/page.tsx` — Manage email, categories, push settings |
| 3.9 | Build Email Client | `src/lib/email.ts` — Resend/Mailchimp API integration for sending newsletters |
| 3.10 | Build Push Client | `src/lib/push.ts` — Web Push notification dispatcher using VAPID keys |

---

## Phase 4: Instant Notification Pipeline (Week 5)

### User Stories
- **US-04-01:** As a subscriber, I want instant push notifications when breaking news is published so I'm first to know.
- **US-04-02:** As a subscriber, I want a daily email digest so I catch up on top stories every morning.
- **US-04-03:** As a publisher, I want automated notification dispatch so readers engage within minutes of publication.
- **US-04-04:** As a publisher, I want Google Discover engagement velocity so articles get promoted in the feed.

### Tasks
| # | Task | Description |
|---|------|-------------|
| 4.1 | Build Service Worker | `public/sw.js` — Service worker for push event handling, notification display, click tracking |
| 4.2 | Build Notify API Endpoint | `src/app/api/notify/route.ts` — Publish event dispatcher that triggers push + email broadcasts |
| 4.3 | Build Push Dispatcher | `src/lib/notifications/push.ts` — Send web push notifications to all subscribed users for a given category |
| 4.4 | Build Email Dispatcher | `src/lib/notifications/email.ts` — Send instant breaking news email via Resend/Mailchimp |
| 4.5 | Build Daily Digest Cron | `src/app/api/cron/digest/route.ts` — Daily 8 AM email with top 5 trending articles |
| 4.6 | Build Category Filter for Alerts | Filter subscribers by category preference before dispatching |
| 4.7 | Build Notification Templates | Push notification payload builder (thumbnail, headline, summary, URL) |
| 4.8 | Build Email Templates | HTML email templates for instant alerts and daily digest |
| 4.9 | Build Unsubscribe Handler | Unsubscribe links with one-click, DB update, confirmation page |
| 4.10 | Build Notification Analytics | Track open rates, click-through, unsubscribe rates |

---

## Phase 5: Performance Optimization & Edge Deployment (Week 6)

### User Stories
- **US-05-01:** As a reader, I want pages to load in under 0.8s so I don't wait for content.
- **US-05-02:** As a reader, I want the site to work offline so I can read cached articles without connectivity.
- **US-05-03:** As a publisher, I want Core Web Vitals scores above 95 so Google rankings are optimal.
- **US-05-04:** As a publisher, I want edge CDN deployment so the site is fast globally.

### Tasks
| # | Task | Description |
|---|------|-------------|
| 5.1 | Implement ISR Strategy | Set `revalidate: 3600` for articles, on-demand revalidation via webhook, 30-day archive SSR fallback |
| 5.2 | Optimize Core Web Vitals | LCP (<0.8s), CLS (<0.02), INP (<80ms) — audit and fix all metrics |
| 5.3 | Configure Edge CDN | Deploy to Vercel/Cloudflare Pages with custom domain and DNS caching |
| 5.4 | Set Up Analytics | `src/components/analytics/WebVitals.tsx` — Core Web Vitals measurement and reporting |
| 5.5 | Performance Audit | Lighthouse score 95+ mobile, WebPageTest, GTmetrix |
| 5.6 | Build Error Tracking | Error boundaries for production, logging service integration |
| 5.7 | Build Monitoring Dashboard | Health checks for CMS connection, webhook, notification pipelines |
| 5.8 | Security Hardening | CSP headers, rate limiting on API routes, input validation, secret management |
| 5.9 | Load Testing | Simulate breaking news traffic surge, verify CDN shielding, measure edge response times |
| 5.10 | Production Cutover | DNS switch, SSL setup, CDN warm-up, monitoring go-live |

---

## System Architecture

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND                          │
│  Next.js (App Router) + TypeScript + Tailwind v4    │
│                                                      │
│  src/                                                │
│  ├── app/                                            │
│  │   ├── (news)/                                     │
│  │   │   ├── page.tsx          (Homepage, ISR)       │
│  │   │   ├── [category]/                              │
│  │   │   │   ├── page.tsx      (Category Feed, ISR)  │
│  │   │   │   └── [slug]/                              │
│  │   │   │       ├── page.tsx  (Article, RSC + ISR)  │
│  │   │   │       └── og-image  (OG Image Gen)        │
│  │   ├── api/                                         │
│  │   │   ├── revalidate/route.ts   (Webhook)          │
│  │   │   ├── subscribe/email/route.ts                 │
│  │   │   ├── subscribe/push/route.ts                  │
│  │   │   ├── notify/route.ts       (Publish dispatch) │
│  │   │   └── cron/digest/route.ts  (Daily digest)     │
│  │   ├── news-sitemap.xml/route.ts                    │
│  │   ├── rss.xml/route.ts                             │
│  │   ├── layout.tsx                                   │
│  │   └── middleware.ts         (Edge headers)         │
│  ├── components/                                      │
│  │   ├── ui/              (Header, Footer, Nav)       │
│  │   ├── reader/          (Cards, Subscribe, Push)    │
│  │   └── analytics/       (JsonLd, WebVitals)         │
│  └── lib/                                             │
│      ├── cms.ts           (CMS client)                │
│      ├── email.ts         (Email API)                 │
│      ├── push.ts          (Push dispatcher)           │
│      ├── seo.ts           (Meta tags)                 │
│      └── indexnow.ts      (IndexNow ping)             │
│                                                        │
├── public/                                              │
│   └── sw.js              (Service Worker)             │
│                                                        │
├── styles/                                              │
│   └── tokens.css         (Design tokens)              │
└─────────────────────────────────────────────────────┘
```

---

## Component Tree

```
<RootLayout>
  <html>
    <body>
      <ThemeProvider>            {/* Dark/light mode */}
        <Header>
          <Logo />
          <Navigation>
            <NavLink />*         {/* Categories */}
          </Navigation>
          <DarkModeToggle />
          <MobileMenu />         {/* Hamburger on < md */}
        </Header>

        <main>
          {children}             {/* Page content */}
        </main>

        <Footer>
          <FooterLinks />
          <NewsletterSignupStub />
          <SocialLinks />
          <Copyright />
        </Footer>
      </ThemeProvider>
    </body>
  </html>
</RootLayout>

--- Homepage ---
<HomePage>
  <FeaturedHero>               {/* Top story, 16:9, priority image */}
    <ArticleCard hero variant />
  </FeaturedHero>

  <TrendingBar />              {/* Horizontal scroll of trending */}

  <LatestGrid>
    <SectionHeader title="Latest Stories" />
    <ArticleCard />*            {/* Grid of latest articles */}
  </LatestGrid>

  <CategorySections>
    <CategorySection category="Politics">
      <ArticleCard />*
    </CategorySection>
    <CategorySection category="Technology">
      <ArticleCard />*
    </CategorySection>
  </CategorySections>
</HomePage>

--- Category Feed ---
<CategoryPage>
  <CategoryHero />
  <ArticleGrid>
    <ArticleCard />*            {/* With pagination */}
  </ArticleGrid>
  <Pagination />
  <CategorySidebar />
</CategoryPage>

--- Article Detail ---
<ArticlePage>
  <JsonLd />                   {/* Structured data */}
  <ArticleHeader>
    <CategoryBreadcrumb />
    <h1>{title}</h1>
    <ArticleMeta>
      <Author /> <Date /> <ReadTime />
    </ArticleMeta>
  </ArticleHeader>

  <FeaturedImage />            {/* next/image, 16:9, 1200px, priority */}

  <ArticleBody>
    {/* RSC — zero client JS for content */}
  </ArticleBody>

  <EngagementBar>
    <BookmarkButton />          {/* Client island */}
    <ShareTools />              {/* Client island */}
  </EngagementBar>

  <PushBanner />               {/* Web push opt-in, client island */}
  <EmailSubscribe />           {/* Newsletter signup, client island */}

  <RelatedArticles>
    <ArticleCard />*
  </RelatedArticles>
</ArticlePage>
```

---

## Route Design

| Route | Type | Rendering | Cache |
|-------|------|-----------|-------|
| `/` | Homepage | ISR | `revalidate: 300` |
| `/[category]` | Category Feed | ISR | `revalidate: 600` |
| `/[category]/[slug]` | Article Detail | ISR (hot) / SSR (archived >30d) | `revalidate: 3600` |
| `/[category]/[slug]/opengraph-image` | OG Image | Dynamic | Edge cache |
| `/api/revalidate` | Cache Purge Webhook | Dynamic | No cache |
| `/api/subscribe/email` | Email Subscribe | Dynamic | No cache |
| `/api/subscribe/push` | Push Subscribe | Dynamic | No cache |
| `/api/notify` | Publish Dispatcher | Dynamic | No cache |
| `/api/cron/digest` | Daily Digest Cron | Dynamic | No cache |
| `/news-sitemap.xml` | News Sitemap | Dynamic | Edge cache |
| `/rss.xml` | RSS Feed | Dynamic | Edge cache |

---

## Notification Pipeline Flow

```
Article Published in CMS
        │
        ▼
Webhook → /api/revalidate (purge ISR cache)
        │
        ▼
/api/notify
        │
        ├──→ Google Indexing API ping
        ├──→ IndexNow ping (api.indexnow.org)
        ├──→ Web Push Dispatcher
        │       └──→ Filter subscribers by category
        │       └──→ Send push notifications (VAPID)
        └──→ Email Dispatcher
                └──→ Breaking news: instant alert
                └──→ Otherwise: queue for daily digest
```

---

## Key Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Styling** | Tailwind v4 + custom tokens | Fastest path to a unique editorial look without fighting a template |
| **Typography** | Geist + Geist Mono (next/font) | Modern, readable, great for editorial; avoids overused Inter |
| **Icons** | `@phosphor-icons/react` | Consistent, professional icon set |
| **Animation** | Motion (framer-motion) only for minimal client islands | Editorial sites don't need heavy animation; MOTION: 4 |
| **CMS Abstraction** | Generic CMS client in `lib/cms.ts` | Swap Payload/WordPress without rewriting frontend |
| **Database** | Supabase (PostgreSQL) | Free tier, real-time, edge-ready |
| **Email** | Resend API | Developer-friendly, reliable delivery |
| **Push** | Web Push API + VAPID | Free, no third-party dependency (no OneSignal) |
| **Deployment** | Vercel (default) / Cloudflare Pages (alternative) | Edge network, ISR support, middleware |
| **Dark Mode** | CSS variables + Tailwind `dark:` | System preference default, manual toggle available |

---

## Design Tokens (Initial Palette)

```css
:root {
  /* Brand */
  --color-brand: #dc2626;           /* Crimson red — breaking news accent */
  --color-brand-hover: #b91c1c;

  /* Surfaces */
  --color-surface: #ffffff;
  --color-surface-alt: #f8fafc;
  --color-surface-elevated: #ffffff;

  /* Text */
  --color-text-primary: #0f172a;
  --color-text-secondary: #475569;
  --color-text-tertiary: #94a3b8;

  /* Borders */
  --color-border: #e2e8f0;
  --color-border-light: #f1f5f9;

  /* Categories */
  --color-politics: #2563eb;
  --color-tech: #059669;
  --color-sports: #ea580c;
  --color-entertainment: #8b5cf6;
  --color-business: #0891b2;

  /* Typography */
  --font-sans: 'Geist', system-ui, sans-serif;
  --font-mono: 'Geist Mono', monospace;

  /* Spacing */
  --space-section: clamp(4rem, 8vw, 8rem);

  /* Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;

  /* Shadows */
  --shadow-card: 0 1px 3px 0 rgb(0 0 0 / 0.06);
  --shadow-elevated: 0 4px 12px rgb(0 0 0 / 0.08);
}
```

Dark mode tokens would invert surfaces (deep navy backgrounds, off-white text) while keeping the crimson brand accent.

---

## Quality Gates

### Per-Phase Review Checklist
- [ ] All components have loading, empty, error states
- [ ] TypeScript strict mode — no `any` types
- [ ] Every page passes Lighthouse >90
- [ ] Mobile-responsive at 320/768/1024/1440
- [ ] Dark mode renders correctly
- [ ] No hardcoded secrets or API keys
- [ ] Accessibility — keyboard nav, screen reader, focus states
- [ ] Performance budgets met (< 150kb JS per page)
- [ ] All API routes have rate limiting and validation

### Code Review Gates
- [ ] Use code-reviewer agent after each phase
- [ ] Use security-reviewer agent before Phase 5 deployment
- [ ] Use react-reviewer agent for all client components
- [ ] 80%+ test coverage minimum
- [ ] No console.log or debug statements

---

## Dependencies

```json
{
  "dependencies": {
    "next": "^15",
    "react": "^19",
    "react-dom": "^19",
    "@phosphor-icons/react": "^2",
    "motion": "^11",
    "@supabase/supabase-js": "^2",
    "resend": "^4",
    "web-push": "^3"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^22",
    "@types/react": "^19",
    "@types/web-push": "^3",
    "tailwindcss": "^4",
    "@tailwindcss/postcss": "^4",
    "prettier": "^3",
    "prettier-plugin-tailwindcss": "^0.6",
    "@eslint/js": "^9",
    "c8": "^10"
  }
}
```

---

## Summary of Effort

| Phase | Focus | Duration | Key Deliverables |
|-------|-------|----------|------------------|
| 0 | Foundation & Design System | 2 days | Scaffold, tokens, layout, header/footer, middleware |
| 1 | Core Content Architecture | 5 days | CMS client, homepage, category feed, article detail, cards |
| 2 | Google Discover & SEO | 3 days | JSON-LD, OG images, sitemaps, RSS, IndexNow, revalidation |
| 3 | Reader Engagement | 4 days | Email/push subscribe, database, bookmarks, share, preferences |
| 4 | Notification Pipeline | 4 days | Service worker, push dispatcher, email dispatcher, digest cron |
| 5 | Performance & Deploy | 3 days | ISR tuning, CWV audit, CDN deploy, security, monitoring |

**Total estimated: ~21 working days (6 weeks)**

Each phase should be code-reviewed before moving to the next. Phases 1-2 can partially overlap (the SEO layer depends on article pages existing, but JSON-LD can be built in parallel with article components).
