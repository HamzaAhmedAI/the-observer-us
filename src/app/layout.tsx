/* ============================================================
   The Observer US — Root Layout
   ============================================================ */

import type { Metadata, Viewport } from 'next'
import { FontProvider } from '@/lib/fonts'
import { DEFAULT_METADATA, SITE_NAME, SITE_URL, SITE_DESCRIPTION } from '@/lib/seo'
import { Header } from '@/components/ui/Header'
import { Footer } from '@/components/ui/Footer'
import { WebVitals } from '@/components/analytics/WebVitals'
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics'
import { BreakingBanner } from '@/components/reader/BreakingBanner'
import { NewsletterPopup } from '@/components/reader/NewsletterPopup'
import { SiteJsonLd } from '@/components/analytics/JsonLd'
import './globals.css'

export const metadata: Metadata = DEFAULT_METADATA

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#dc2626',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-US" suppressHydrationWarning>
      <head>
        <SiteJsonLd
          siteUrl={SITE_URL}
          siteName={SITE_NAME}
          siteDescription={SITE_DESCRIPTION}
        />

        {/* Preconnect to external origins for performance (none needed —
            all images are served locally; do not re-add picsum here) */}

        {/* Prevent FOUC for dark mode — checks localStorage before paint.
            Allowed by the CSP's 'unsafe-inline' in script-src (see
            middleware.ts) — Next.js hydration needs inline scripts.
            This script runs before hydration and is essential for theme.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-[100dvh] bg-[var(--color-surface)] text-[var(--color-text-primary)] antialiased">
        <FontProvider>
          <div className="flex min-h-[100dvh] flex-col">
            <BreakingBanner />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <WebVitals />
          <GoogleAnalytics />
          <NewsletterPopup />
        </FontProvider>
      </body>
    </html>
  )
}
