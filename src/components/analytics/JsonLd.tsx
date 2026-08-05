/* ============================================================
   The Observer US — JSON-LD Structured Data
   Injects NewsArticle schema for Google Discover & Search.
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
}: JsonLdProps) {
  const jsonLd = {
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

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
