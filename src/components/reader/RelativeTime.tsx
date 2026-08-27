/* ============================================================
   RelativeTime — Server-renderable relative timestamp.
   No client JS; the formatter runs in the parent RSC.
   ============================================================ */

import { relativeTime } from '@/lib/relative-time'

interface RelativeTimeProps {
  date: string | number | Date
  /** Optional ISO/UTC fallback for machines */
  dateTime?: string
  className?: string
}

export function RelativeTime({ date, dateTime, className }: RelativeTimeProps) {
  const iso = dateTime ?? (date instanceof Date ? date.toISOString() : new Date(date).toISOString())
  return (
    <time dateTime={iso} className={className} title={iso}>
      {relativeTime(date)}
    </time>
  )
}
