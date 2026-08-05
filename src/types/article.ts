// ============================================================
// Article Types — Core data shapes for the entire platform
// ============================================================

export interface Article {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  featuredImage: Media
  category: Category
  author: Author
  tags: string[]
  publishedAt: string
  updatedAt: string
  isBreaking: boolean
  isFeatured: boolean
  readTime: number // in minutes
  seo: SEO
}

export interface Category {
  id: string
  slug: string
  name: string
  description: string
  color: string
  articleCount: number
}

export interface Author {
  id: string
  slug: string
  name: string
  avatar: Media
  bio: string
  role: string
}

export interface Media {
  url: string
  width: number
  height: number
  alt: string
  caption?: string
  blurDataURL?: string
}

export interface SEO {
  title: string
  description: string
  ogImage?: Media
  canonical?: string
  noindex?: boolean
}

export interface Subscriber {
  id: string
  email: string
  pushToken?: string
  categories: string[] // category slugs
  subscribedAt: string
  isActive: boolean
}

export interface ArticleCardProps {
  article: Article
  variant?: 'hero' | 'featured' | 'standard' | 'compact'
  priority?: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}
