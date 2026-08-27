/* ============================================================
   The Observer US — Root Layout
   ============================================================ */

import type { Metadata, Viewport } from 'next'
import { FontProvider } from '@/lib/fonts'
import { DEFAULT_METADATA } from '@/lib/seo'
import { Header } from '@/components/ui/Header'
import { Footer } from '@/components/ui/Footer'
import { WebVitals } from '@/components/analytics/WebVitals'
import { BreakingBanner } from '@/components/reader/BreakingBanner'
import { NewsletterPopup } from '@/components/reader/NewsletterPopup'
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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to external origins for performance */}
        <link rel="preconnect" href="https://picsum.photos" />
        <link rel="dns-prefetch" href="https://picsum.photos" />
        {/* Replace the href above with your production image CDN hostname:
             <link rel="preconnect" href="https://cdn.example.com" /> */}

        {/* Prevent FOUC for dark mode — checks localStorage before paint */}
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
          <NewsletterPopup />
        </FontProvider>
      </body>
    </html>
  )
}
