/* ============================================================
   The Observer US — CMS Client
   ============================================================
   Generic headless CMS abstraction layer.
   Designed to support both Payload CMS and Headless WordPress.
   Swap the implementation details here — the rest of the app
   stays unchanged.
   ============================================================ */

import type { Article, Author, Category, Media, PaginatedResponse } from '@/types/article'
import {
  REVALIDATE_ARTICLE,
} from '@/lib/revalidate'
import { getPayload } from 'payload'
import config from '@payload-config'

// Payload 3.87.1's REST query-string `where` parser is broken for several
// field paths (e.g. `where[slug]`, `where[isFeatured]`, `where[category.slug]`
// all 400 / return empty). Use the LOCAL Payload API instead — it talks to the
// DB directly and doesn't go through the buggy REST parser. Cached per process.
let _payload: Awaited<ReturnType<typeof getPayload>> | null = null
type P = Awaited<ReturnType<typeof getPayload>>
async function getP(): Promise<P> {
  if (!_payload) _payload = await getPayload({ config })
  return _payload
}

// ─── Configuration ──────────────────────────────────────────
const CMS_API_URL = process.env.CMS_API_URL ?? ''
const CMS_API_KEY = process.env.CMS_API_KEY ?? ''

// ─── Helpers ─────────────────────────────────────────────────
function apiUrl(path: string): string {
  return `${CMS_API_URL}/api${path}`
}

async function fetchCMS<T>(path: string, options?: RequestInit, revalidate = 3600): Promise<T> {
  const url = apiUrl(path)

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(CMS_API_KEY ? { Authorization: `Bearer ${CMS_API_KEY}` } : {}),
    },
    next: { revalidate },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`CMS fetch failed: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

// ─── Cache Helpers ───────────────────────────────────────────
// When no CMS is configured, return mock data for development
const USE_MOCK = !CMS_API_URL

// ─── Article Operations ──────────────────────────────────────
export async function getArticles(options?: {
  category?: string
  limit?: number
  page?: number
  featured?: boolean
}): Promise<PaginatedResponse<Article>> {
  if (USE_MOCK) {
    return getMockArticles(options)
  }

  const where: Record<string, unknown> = { _status: { equals: 'published' } }
  if (options?.category) where['category.slug'] = { equals: options.category }
  if (options?.featured) where['isFeatured'] = { equals: true }

  const payload = await getP()
  const result = (await payload.find({
    collection: 'articles',
    where: where as import('payload').Where,
    depth: 2,
    sort: '-publishedAt',
    limit: options?.limit ?? 12,
    page: options?.page ?? 1,
  })) as unknown as {
    docs: Article[]
    totalDocs: number
    page: number
    limit: number
    hasNextPage: boolean
  }

  return {
    data: result.docs.map(normalizeTags),
    total: result.totalDocs,
    page: result.page,
    pageSize: result.limit,
    hasMore: result.hasNextPage,
  }
}

// Payload returns `tags` as [{ id, tag }] objects at depth>=1. The Article
// type (and the UI) expect string[]. Convert defensively.
function normalizeTags<T extends Article>(a: T): T {
  const tags = (a as Article).tags as unknown as Array<string | { tag?: string }> | undefined
  if (Array.isArray(tags)) {
    ;(a as Article).tags = tags
      .map((t) => (typeof t === 'string' ? t : (t as { tag?: string })?.tag ?? ''))
      .filter(Boolean) as string[]
  }
  return a
}

export async function getArticleBySlug(
  category: string,
  slug: string
): Promise<Article | null> {
  if (USE_MOCK) {
    return getMockArticleBySlug(category, slug)
  }

  try {
    const payload = await getP()
    const result = await payload.find({
      collection: 'articles',
      where: {
        slug: { equals: slug },
        'category.slug': { equals: category },
        _status: { equals: 'published' },
      } as import('payload').Where,
      depth: 2,
      limit: 1,
    })
    const doc = (result.docs as Article[])[0]
    return doc ? normalizeTags(doc) : null
  } catch {
    return null
  }
}

export async function getRelatedArticles(options: {
  category: string
  excludeId: string
  limit?: number
}): Promise<Article[]> {
  if (USE_MOCK) {
    const res = await getMockArticles({ category: options.category, limit: options.limit ?? 4 })
    return res.data.filter((a) => a.id !== options.excludeId)
  }
  try {
    const payload = await getP()
    const result = await payload.find({
      collection: 'articles',
      where: {
        'category.slug': { equals: options.category },
        id: { not_equals: options.excludeId },
        _status: { equals: 'published' },
      } as import('payload').Where,
      depth: 2,
      sort: '-publishedAt',
      limit: options.limit ?? 4,
    })
    return (result.docs as Article[]).map(normalizeTags)
  } catch {
    return []
  }
}

export async function getMostRead(options?: {
  category?: string
  excludeId?: string
  limit?: number
}): Promise<Article[]> {
  if (USE_MOCK) {
    const all = await getMockArticles({ limit: options?.limit ?? 5 })
    return all.data.filter((a) => a.id !== options?.excludeId)
  }
  try {
    const payload = await getP()
    const where: Record<string, unknown> = { _status: { equals: 'published' } }
    if (options?.category) where['category.slug'] = { equals: options.category }
    if (options?.excludeId) where['id'] = { not_equals: options.excludeId }
    const result = await payload.find({
      collection: 'articles',
      where: where as import('payload').Where,
      depth: 2,
      sort: '-viewCount',
      limit: options?.limit ?? 5,
    })
    return (result.docs as Article[]).map(normalizeTags)
  } catch {
    return []
  }
}

export async function getBreakingArticles(limit = 1): Promise<Article[]> {
  if (USE_MOCK) {
    const res = await getMockArticles({ limit })
    return res.data.filter((a) => a.isBreaking)
  }
  try {
    const payload = await getP()
    const result = await payload.find({
      collection: 'articles',
      where: {
        isBreaking: { equals: true },
        _status: { equals: 'published' },
      } as import('payload').Where,
      depth: 2,
      sort: '-publishedAt',
      limit,
    })
    return (result.docs as Article[]).map(normalizeTags)
  } catch {
    return []
  }
}

export async function getCategories(): Promise<Category[]> {
  if (USE_MOCK) {
    return getMockCategories()
  }

  try {
    const payload = await getP()
    const result = await payload.find({
      collection: 'categories',
      depth: 0,
      sort: 'name',
      limit: 100,
    })
    return result.docs as Category[]
  } catch {
    return []
  }
}

// ─── Author Operations ──────────────────────────────────────
export async function getAuthorBySlug(slug: string): Promise<Author | null> {
  if (USE_MOCK) {
    return MOCK_AUTHORS.find((a) => a.slug === slug) ?? null
  }

  try {
    const payload = await getP()
    const result = await payload.find({
      collection: 'authors',
      where: { slug: { equals: slug } } as import('payload').Where,
      depth: 1,
      limit: 1,
    })
    const doc = (result.docs as Author[])[0]
    if (!doc) return null
    // Normalize avatar: payload returns { id } when depth<2; fetch media if needed.
    if (doc.avatar && typeof doc.avatar === 'object' && !(doc.avatar as Media).url) {
      const mediaResult = await payload.findByID({
        collection: 'media',
        id: (doc.avatar as unknown as { id: string }).id,
      })
      doc.avatar = mediaResult as unknown as Media
    }
    return doc
  } catch {
    return null
  }
}

export async function getArticlesByAuthor(
  authorSlug: string,
  limit = 50,
): Promise<Article[]> {
  if (USE_MOCK) {
    return getMockArticles({ limit }).data.filter((a) => a.author.slug === authorSlug)
  }

  try {
    const payload = await getP()
    const result = await payload.find({
      collection: 'articles',
      where: {
        'author.slug': { equals: authorSlug },
        _status: { equals: 'published' },
      } as import('payload').Where,
      depth: 2,
      sort: '-publishedAt',
      limit,
    })
    return (result.docs as Article[]).map(normalizeTags)
  } catch {
    return []
  }
}

// ─── Mock Data for Development ───────────────────────────────
function getMockCategories(): Category[] {
  return [
    { id: '1', slug: 'politics', name: 'Politics', description: '', color: '#2563eb', articleCount: 12 },
    { id: '2', slug: 'technology', name: 'Technology', description: '', color: '#059669', articleCount: 8 },
    { id: '3', slug: 'business', name: 'Business', description: '', color: '#0891b2', articleCount: 6 },
    { id: '4', slug: 'sports', name: 'Sports', description: '', color: '#ea580c', articleCount: 10 },
    { id: '5', slug: 'entertainment', name: 'Entertainment', description: '', color: '#8b5cf6', articleCount: 7 },
    { id: '6', slug: 'health', name: 'Health', description: '', color: '#e11d48', articleCount: 5 },
    { id: '7', slug: 'science', name: 'Science', description: '', color: '#65a30d', articleCount: 4 },
    { id: '8', slug: 'world', name: 'World', description: '', color: '#4f46e5', articleCount: 9 },
  ]
}

const MOCK_AUTHORS = [
  { id: 'a1', slug: 'sarah-chen', name: 'Sarah Chen', avatar: { url: '/images/author-1.jpg', width: 100, height: 100, alt: 'Sarah Chen' }, bio: 'Senior political correspondent.', role: 'Senior Correspondent' },
  { id: 'a2', slug: 'marcus-williams', name: 'Marcus Williams', avatar: { url: '/images/author-2.jpg', width: 100, height: 100, alt: 'Marcus Williams' }, bio: 'Technology editor covering AI and startups.', role: 'Tech Editor' },
  { id: 'a3', slug: 'elena-rodriguez', name: 'Elena Rodriguez', avatar: { url: '/images/author-3.jpg', width: 100, height: 100, alt: 'Elena Rodriguez' }, bio: 'Global affairs correspondent.', role: 'World News Editor' },
  { id: 'hamza-ahmed', slug: 'hamza-ahmed', name: 'Hamza Ahmed', avatar: { url: '/media/hamza-ahmed.jpg', width: 1024, height: 1024, alt: 'Hamza Ahmed' }, bio: 'Founder and Editor-in-Chief of The Observer US.', role: 'Founder & Editor-in-Chief', linkedin: 'https://www.linkedin.com/in/hamza-ahmed', twitter: 'https://x.com/hamzaahmed', website: 'https://theobserverus.com' },
]

const MOCK_HEADLINES = [
  { title: 'Senate Passes Landmark Climate Bill in Historic Late-Night Session', category: 'politics', author: MOCK_AUTHORS[0] },
  { title: 'Revolutionary AI Chip Promises 10x Performance Leap for Data Centers', category: 'technology', author: MOCK_AUTHORS[1] },
  { title: 'Federal Reserve Signals Potential Rate Cut as Inflation Cools', category: 'business', author: MOCK_AUTHORS[0] },
  { title: 'Underdog Team Secures Championship Victory in Overtime Thriller', category: 'sports', author: MOCK_AUTHORS[2] },
  { title: 'Streaming Wars Heat Up as New Platform Announces Original Slate', category: 'entertainment', author: MOCK_AUTHORS[1] },
  { title: 'Breakthrough Gene Therapy Shows Promise in Clinical Trials', category: 'health', author: MOCK_AUTHORS[2] },
  { title: 'NASA Confirms Water Molecules on Sunlit Surface of the Moon', category: 'science', author: MOCK_AUTHORS[2] },
  { title: 'Global Summit Addresses Rising Tensions in Southeast Asia', category: 'world', author: MOCK_AUTHORS[0] },
  { title: 'New Study Reveals Exercise Timing Affects Sleep Quality', category: 'health', author: MOCK_AUTHORS[1] },
  { title: 'Electric Vehicle Sales Surge Past 40% Market Share for First Time', category: 'business', author: MOCK_AUTHORS[0] },
]

function getMockArticles(options?: {
  category?: string
  limit?: number
  page?: number
  featured?: boolean
}): PaginatedResponse<Article> {
  let articles = MOCK_HEADLINES.map((h, i) => ({
    id: String(i + 1),
    slug: h.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, ''),
    title: h.title,
    excerpt: `In a development that marks a significant shift, ${h.title.toLowerCase()} has captured the attention of experts and observers worldwide. This story continues to evolve as new information emerges.`,
    content: `<p>This is the full article content for: ${h.title}</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>`,
    featuredImage: {
      url: `https://picsum.photos/seed/${i + 1}/1200/675`,
      width: 1200,
      height: 675,
      alt: h.title,
    },
    category: getMockCategories().find((c) => c.slug === h.category) ?? getMockCategories()[0],
    author: h.author,
    tags: [],
    publishedAt: new Date(Date.now() - i * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - i * 3600000).toISOString(),
    isBreaking: i === 0,
    isFeatured: i === 0,
    readTime: Math.floor(Math.random() * 8) + 3,
    seo: {
      title: h.title,
      description: `Read the latest ${h.category} news: ${h.title}`,
    },
  }))

  if (options?.category) {
    articles = articles.filter((a) => a.category.slug === options.category)
  }

  if (options?.featured) {
    articles = articles.filter((a) => a.isFeatured)
  }

  const limit = options?.limit ?? 10
  const page = options?.page ?? 1
  const start = (page - 1) * limit

  return {
    data: articles.slice(start, start + limit),
    total: articles.length,
    page,
    pageSize: limit,
    hasMore: start + limit < articles.length,
  }
}

function getMockArticleBySlug(category: string, slug: string): Article | null {
  const result = getMockArticles({ category, limit: 50 })
  return result.data.find((a) => a.slug === slug) ?? null
}

function getMockAuthorBySlug(slug: string): Author | null {
  return MOCK_AUTHORS.find((a) => a.slug === slug) ?? null
}
