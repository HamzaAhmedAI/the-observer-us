/* ============================================================
   The Observer US — Featured Hero
   Large hero section for the top story on the homepage.
   ============================================================ */

import { ArticleCard } from './ArticleCard'
import type { Article } from '@/types/article'

interface FeaturedHeroProps {
  article: Article
}

export function FeaturedHero({ article }: FeaturedHeroProps) {
  return (
    <section aria-labelledby="featured-heading" className="mb-12">
      <h2 id="featured-heading" className="sr-only">
        Featured Story
      </h2>
      <ArticleCard article={article} variant="hero" priority />
    </section>
  )
}
