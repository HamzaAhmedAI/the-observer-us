import type { Metadata } from 'next'

export const SITE_NAME = 'The Observer US'
export const SITE_DESCRIPTION =
  'Protect your home. Protect your wallet. Practical US guides and news on home costs, bills, recalls, scams, data breaches, and off-grid preparedness — what happened, who is affected, and what to do next.'
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? 'https://theobserverus.com'
export const SITE_TWITTER = '@ObserverUS'

export const DEFAULT_METADATA: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    site: SITE_TWITTER,
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
  },
  // Pinterest domain verification for the business account
  // (The Observer US • @kalveenken) — added 2026-11-17.
  verification: {
    other: {
      'p:domain_verify': '0a6a7f074e4631710b8cc7be9b7b8921',
    },
  },
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': [
        { url: `${SITE_URL}/rss.xml`, title: `${SITE_NAME} — RSS Feed` },
      ],
    },
  },
}
