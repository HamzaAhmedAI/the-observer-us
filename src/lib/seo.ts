import type { Metadata } from 'next'

export const SITE_NAME = 'The Observer US'
export const SITE_DESCRIPTION = 'Your trusted source for breaking news, in-depth analysis, and stories that matter.'
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
}
