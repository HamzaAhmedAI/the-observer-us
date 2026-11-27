/* ============================================================
   The Observer US — Google Analytics 4 (optional)
   Loads only when NEXT_PUBLIC_GA_ID is set (e.g. G-XXXXXXXXXX).
   Until then this component renders nothing and the site stays
   first-party-analytics-only, as the Privacy/Cookie pages say.

   Uses the official gtag.js snippet via next/script. The stub
   MUST push real `arguments` objects: gtag.js only treats
   Arguments entries in the dataLayer as commands. The previous
   custom injector pushed plain arrays, which gtag.js silently
   ignored — the script loaded and the config sat in the queue
   but no hit was ever sent, so GA4 received zero data from
   2026-11-16 until this fix (diagnosed 2026-11-27).
   ============================================================ */

import Script from 'next/script'

export function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID
  if (!gaId) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="beforeInteractive"
      />
      <Script id="google-analytics" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  )
}
