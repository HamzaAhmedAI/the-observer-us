'use client'

import { useState, useEffect, useCallback } from 'react'
import { Bookmark, BookmarkSimple } from '@phosphor-icons/react'

interface BookmarkButtonProps {
  slug: string
  title: string
  className?: string
}

const STORAGE_KEY = 'Observer-bookmarks'

export function BookmarkButton({ slug, title, className = '' }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const bookmarks = JSON.parse(stored) as Record<string, string>
        setIsBookmarked(!!bookmarks[slug])
      }
    } catch {
      // localStorage unavailable or corrupt — treat as not bookmarked
    }
  }, [slug])

  const toggleBookmark = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      const bookmarks = stored
        ? (JSON.parse(stored) as Record<string, string>)
        : {}

      if (bookmarks[slug]) {
        delete bookmarks[slug]
        setIsBookmarked(false)
      } else {
        bookmarks[slug] = title
        setIsBookmarked(true)
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks))
    } catch {
      // localStorage full or unavailable — silently fail
    }
  }, [slug, title])

  return (
    <button
      type="button"
      onClick={toggleBookmark}
      className={`group flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium
        transition-colors
        ${
          isBookmarked
            ? 'text-[var(--color-brand)]'
            : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]'
        }
        ${className}`}
      aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark this article'}
    >
      {isBookmarked ? (
        <Bookmark size={14} weight="fill" />
      ) : (
        <BookmarkSimple size={14} />
      )}
      <span className="hidden sm:inline">
        {isBookmarked ? 'Saved' : 'Save'}
      </span>
    </button>
  )
}
