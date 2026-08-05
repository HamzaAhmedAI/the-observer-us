High-Performance, Google Discover-Optimized Media Platform
Document Version: 1.1.0
Website Name: The Observer US

Target Stack: Next.js (App Router), Headless CMS (Payload CMS / Headless WordPress), Edge CDN (Vercel / Cloudflare), Web Push API, Resend / Mailchimp API

Primary Goal: Build a fast, scalable news media platform capable of handling 100,000+ articles, delivering sub-0.8s page loads, triggering Google Discover viral feeds, and driving immediate reader engagement via free push and email notifications.

1. System Architecture Overview
The system uses a Decoupled (Headless) Architecture. The frontend is isolated from the database and content management layer. Readers interact exclusively with pre-rendered, globally cached static edge pages, shielding the backend from traffic surges during breaking news events.

Plaintext
┌────────────────────────────────────────────────────────────────────────┐
│                        CONTENT CREATION LAYER                          │
│                                                                        │
│   Human Journalists  │  Automated AI Agents (e.g., OpenClaw API)       │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        HEADLESS BACKEND (CMS)                          │
│                                                                        │
│   Headless WordPress / Payload CMS (REST & GraphQL APIs)               │
│   - Article Management, Media Library, Categories, Webhooks            │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ Webhook (Instant Purge / Revalidate)
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND EDGE LAYER                             │
│                                                                        │
│   Next.js (App Router) on Vercel / Cloudflare Pages                    │
│   - Incremental Static Regeneration (ISR)                              │
│   - Edge Caching & Routing                                             │
│   - Auto JSON-LD Schema Generator & Image Optimizer                    │
└───────┬──────────────────────────┬──────────────────────────────┬──────┘
        │                          │                              │
        ▼                          ▼                              ▼
┌──────────────┐          ┌────────────────┐             ┌────────────────┐
│   READERS    │          │ GOOGLE DISCOVER│             │ FREE SUBSCRIBER│
│ Global Edge  │          │ Auto IndexNow  │             │   ENGAGEMENT   │
│  <0.8s LCP   │          │ News Sitemap   │             │ Push + Email   │
└──────────────┘          └────────────────┘             └────────────────┘
2. Core Frontend Technical Requirements (Next.js App Router)
2.1 Rendering & Caching Strategy
Incremental Static Regeneration (ISR):

Articles default revalidate time: 3600 seconds (1 hour).

Dynamic Revalidation: When an article is published or modified in the CMS, a secret-authenticated webhook triggers revalidatePath('/[category]/[slug]') to purge and update the cache in <500ms globally.

Historical Archives: Articles older than 30 days are generated on-demand (server-side rendered on first request, then cached at the Edge).

React Server Components (RSC):

100% of layout, main article text, headers, footers, and SEO metadata render via RSCs.

Zero client-side JavaScript overhead for reading articles.

Client Components Isolation:

Client JS ('use client') is strictly scoped to interactive elements: Free Newsletter Form, Web Push Opt-in Prompt, Bookmark button, and Sharing tools.

2.2 Performance Metrics (Target Thresholds)
Largest Contentful Paint (LCP): < 0.8 seconds (Mobile)

Cumulative Layout Shift (CLS): < 0.02

Interaction to Next Paint (INP): < 80ms

First Input Delay (FID): < 10ms

2.2 Image Optimization Rules
All article featured images must use next/image with explicit sizes and priority flags on primary hero imagery.

Aspect Ratio: Mandatory 16:9 ratio for primary article visuals.

Resolution: Minimum width 1200px (required for Google Discover large preview cards).

Formats: Automated WebP and AVIF conversion via Next.js image loader.

3. Google Discover & Fast Indexing Engine
Google Discover traffic relies on speed, large media previews, structured data, and instant engagement signals from existing readers.

3.1 Metadata & Meta Tags Specification
Every rendered page must automatically include the following <head> tag configurations:

HTML
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

<meta property="og:type" content="article" />
<meta property="og:title" content="[Article Title]" />
<meta property="og:description" content="[Article Summary]" />
<meta property="og:image" content="[1200x675 Image URL]" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="675" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@PublicationHandle" />
3.2 Structured Data (JSON-LD Schema)
Every article page must dynamically inject a standardized NewsArticle schema into the DOM:

JSON
{
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://yoursite.com/news/article-slug"
  },
  "headline": "Article Title Under 110 Characters",
  "image": [
    "https://yoursite.com/images/16x9/1200x675.jpg"
  ],
  "datePublished": "2026-07-25T10:00:00+00:00",
  "dateModified": "2026-07-25T10:15:00+00:00",
  "author": {
    "@type": "Person",
    "name": "Author Name",
    "url": "https://yoursite.com/authors/author-slug"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Publication Name",
    "logo": {
      "@type": "ImageObject",
      "url": "https://yoursite.com/assets/logo-600x60.png"
    }
  },
  "description": "Article summary for search previews.",
  "isAccessibleForFree": "True"
}
3.3 Automated Instant Indexing & Sitemaps
Google News XML Sitemap (/news-sitemap.xml):

Dynamically serves articles published within the last 48 hours.

Includes <news:publication>, <news:publication_date>, and <news:title>.

IndexNow Endpoint Integration:

Upon article publication, the CMS backend fires a background POST request to https://api.indexnow.org containing the newly created URL to notify search engines immediately.

Google Indexing API Trigger:

Automated ping sent to the Google Indexing API endpoint upon publication for rapid GoogleBot crawling.

4. Free Reader Subscription & Audience Retention Engine
To build a loyal audience and drive immediate initial traffic spikes on every published story, the platform features a 100% Free Subscription & Fast Alert Architecture.

4.1 Unrestricted Access Policy
Zero Paywalls: All content is 100% free for all users and search engine crawlers without restrictions.

Frictionless Onboarding: Readers subscribe using 1-click email input or 1-tap browser push notification permission prompts.

4.2 Subscriber Features Matrix
Feature	Anonymous Reader	Free Subscriber (Email & Push)
Article Access	100% Free & Unlimited	100% Free & Unlimited
Breaking News Alerts	Manual Site Visits	Instant Web Push Notification
Daily / Topic Digest	None	Automated Email Newsletter
Category Selection	Manual Navigation	Subscribed Category Filtering
4.3 Technical Stack for Free Subscriptions
Email Broadcast Engine: Resend API / Mailchimp API / ConvertKit.

Database Storage: Supabase / PostgreSQL / MongoDB (stores email address, category preferences, subscription timestamp, and push token).

Automated Trigger Webhook: When an article is marked Published, Next.js triggers an async background job via /api/subscribe/notify to send out email alerts and push broadcasts to opted-in readers.

5. Instant Reader Return Loop (Web Push & Email Velocity)
Google Discover requires initial engagement velocity (high click-through rate and long dwell time) within 10–20 minutes of publication to trigger global feed promotion.

Plaintext
Article Published in CMS
       │
       ├─► 1. IndexNow / Google API Ping (Crawler Trigger)
       │
       ├─► 2. Web Push Notification Blast (Browser Alerts)
       │         │
       │         ▼
       │     200+ Instant Readers Click & Arrive
       │
       └─► 3. Automated Free Email Dispatch (Resend / Mailchimp)
                 │
                 ▼
          High Dwell Time on Edge Next.js Site (<0.8s LCP)
                 │
                 ▼
         Google Discover Algorithm Triggered
5.1 Push & Email Alert Specifications
Browser Web Push Notifications:

Powered by Web Push API / FCM / OneSignal.

Prompts readers on article pages with a non-intrusive banner: "Get instant alerts when breaking news drops."

Payload sent on publish: 16:9 Thumbnail, Headline, 1-sentence summary, direct article URL.

Automated Free Newsletter Digest:

Instant Alerts: Dispatched immediately for articles tagged Breaking News.

Daily Roundup: Automated daily email summary sent at 8:00 AM local time containing top 5 trending articles.

6. Detailed Data Schema & File Structure
6.1 Directory Layout (Next.js App Router)
Plaintext
├── src/
│   ├── app/
│   │   ├── (news)/
│   │   │   ├── [category]/
│   │   │   │   ├── page.tsx            # Category Feed (ISR)
│   │   │   │   └── [slug]/
│   │   │   │       ├── page.tsx        # Article Detail Page (100% Free Access)
│   │   │   │       └── opengraph-image.tsx # Auto OG Image Gen
│   │   │   └── page.tsx                # Homepage (ISR)
│   │   ├── api/
│   │   │   ├── revalidate/route.ts     # CMS Cache Purge Webhook
│   │   │   ├── subscribe/
│   │   │   │   ├── email/route.ts      # Free Email Newsletter Opt-in
│   │   │   │   └── push/route.ts       # Push Notification Registration
│   │   │   └── notify/route.ts         # Publish Event Dispatcher (Push + Email)
│   │   ├── news-sitemap.xml/route.ts   # Dynamic News Sitemap
│   │   └── rss.xml/route.ts            # Dynamic RSS Feed
│   ├── components/
│   │   ├── ui/                         # Navigation, Headers, Footers
│   │   ├── reader/                     # Free Newsletter Subscription Box & Push Banner
│   │   └── analytics/                  # Core Web Vitals Tracking
│   ├── lib/
│   │   ├── cms.ts                      # Headless CMS Client
│   │   ├── email.ts                    # Resend / Mailchimp API Integration
│   │   └── push.ts                     # Web Push Notification Dispatcher
│   └── middleware.ts                   # Edge Headers & Geolocation Routing
7. Implementation Roadmap
Phase 1: Core Foundation (Week 1–2)
Setup Next.js App Router project with TailwindCSS and TypeScript.

Configure Headless CMS connection (Payload CMS or Headless WordPress).

Implement dynamic ISR route fetching (/[category]/[slug]).

Phase 2: Speed & Google Discover SEO Setup (Week 3)
Integrate JSON-LD NewsArticle schema generator component (isAccessibleForFree: true).

Configure <meta name="robots" content="max-image-preview:large" />.

Build dynamic /news-sitemap.xml and /rss.xml endpoints.

Connect IndexNow API ping script to CMS publish actions.

Phase 3: Free Web Push & Audience Capture (Week 4)
Integrate Service Worker for browser Web Push notifications.

Design non-intrusive email newsletter subscription widget & push opt-in banner.

Build subscriber database table (email, category choices, push token).

Phase 4: Instant Notification Velocity Pipeline (Week 5)
Build /api/notify endpoint triggered on new article creation.

Connect API to Resend / Mailchimp and Web Push dispatcher.

Test immediate distribution to registered free readers upon publishing breaking stories.

Phase 5: Production & Edge Deployment (Week 6)
Deploy frontend to Vercel / Cloudflare Pages.

Configure custom domain with DNS-level caching (Cloudflare CDN).

Perform Core Web Vitals performance tests (Lighthouse target score: 95+ Mobile).