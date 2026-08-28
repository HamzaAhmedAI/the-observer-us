/* ============================================================
   The Observer US — JSON-LD Structured Data
   Injects NewsArticle schema for Google Discover & Search.
   Supports multiple @type blocks (e.g. NewsArticle + BreadcrumbList).
   ============================================================ */

interface JsonLdProps {
  title: string
  description: string
  url: string
  imageUrl: string
  imageWidth: number
  imageHeight: number
  datePublished: string
  dateModified: string
  authorName: string
  authorUrl: string
  publisherName: string
  isAccessibleForFree?: boolean
  breadcrumbs?: Array<{ name: string; url: string }>
}

export function JsonLd({
  title,
  description,
  url,
  imageUrl,
  imageWidth,
  imageHeight,
  datePublished,
  dateModified,
  authorName,
  authorUrl,
  publisherName,
  isAccessibleForFree = true,
  breadcrumbs,
}: JsonLdProps) {
  const newsArticle = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    headline: title,
    image: [
      {
        '@type': 'ImageObject',
        url: imageUrl,
        width: imageWidth,
        height: imageHeight,
      },
    ],
    datePublished,
    dateModified,
    author: {
      '@type': 'Person',
      name: authorName,
      url: authorUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: publisherName,
      logo: {
        '@type': 'ImageObject',
        url: `${url.split('/').slice(0, 3).join('/')}/logo-600x60.png`,
        width: 600,
        height: 60,
      },
    },
    description,
    isAccessibleForFree,
  }

  const breadcrumbList = breadcrumbs && breadcrumbs.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((crumb, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: crumb.name,
          item: crumb.url,
        })),
      }
    : null

  const blocks = [newsArticle, breadcrumbList].filter(Boolean)

  return (
    <>
      {blocks.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </>
  )
}

/* ============================================================
   Organization + WebSite schema (site-wide, inject in root layout)
   - Organization: tells Google the publisher identity
   - WebSite + SearchAction: enables sitelinks search box
   ============================================================ */

interface SiteJsonLdProps {
  siteUrl: string
  siteName: string
  siteDescription: string
  searchPath?: string
}

export function SiteJsonLd({
  siteUrl,
  siteName,
  siteDescription,
  searchPath = '/search',
}: SiteJsonLdProps) {
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    name: siteName,
    url: siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${siteUrl}/logo-600x60.png`,
      width: 600,
      height: 60,
    },
    sameAs: [
      'https://twitter.com/ObserverUS',
    ],
  }

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: siteUrl,
    description: siteDescription,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}${searchPath}?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  )
}
