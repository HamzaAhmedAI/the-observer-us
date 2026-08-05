/* ============================================================
   The Observer US — Reading Time
   Tiny client island for the Clock icon so ArticleCard
   can remain a Server Component.
   ============================================================ */

'use client'

import { Clock } from '@phosphor-icons/react'

interface ReadingTimeProps {
  minutes: number
}

export function ReadingTime({ minutes }: ReadingTimeProps) {
  return (
    <span className="flex items-center gap-1">
      <Clock size={12} weight="bold" />
      {minutes} min read
    </span>
  )
}
