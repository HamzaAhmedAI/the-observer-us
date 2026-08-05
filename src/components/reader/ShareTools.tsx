'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { ShareNetwork, Link, Check, X } from '@phosphor-icons/react'

interface ShareToolsProps {
  url: string
  title: string
  className?: string
}

export function ShareTools({ url, title, className = '' }: ShareToolsProps) {
  const [copied, setCopied] = useState(false)
  const [shareError, setShareError] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleShare = useCallback(async () => {
    setShareError(null)
    setMenuOpen(false)

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: url,
        })
        return
      } catch (err) {
        // AbortError = user cancelled — not an error
        if (err instanceof Error && err.name !== 'AbortError') {
          setShareError('Share failed — copied link instead.')
        }
        // Fall through to clipboard fallback
      }
    }

    // Fallback: copy link to clipboard
    await copyToClipboard(url)
  }, [url, title])

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      setShareError('Could not access clipboard. Try selecting and copying the URL manually.')
      setTimeout(() => setShareError(null), 4000)
    }
  }, [])

  const handleCopyLink = useCallback(() => {
    copyToClipboard(url)
    setMenuOpen(false)
  }, [url, copyToClipboard])

  const socialShareUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      {/* Main share button */}
      <button
        type="button"
        onClick={handleShare}
        className="group flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium
                   text-[var(--color-text-tertiary)] transition-colors
                   hover:text-[var(--color-text-primary)]"
        aria-label="Share this article"
      >
        {copied ? <Check size={14} /> : <ShareNetwork size={14} />}
        <span className="hidden sm:inline">{copied ? 'Copied!' : 'Share'}</span>
      </button>

      {/* Dropdown menu with more options */}
      {menuOpen && !copied && (
        <div className="absolute right-0 top-full z-40 mt-1 min-w-[180px] overflow-hidden
                        rounded-lg border border-[var(--color-border)]
                        bg-[var(--color-surface-elevated)] shadow-lg"
        >
          {/* Copy link */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-xs
                       text-[var(--color-text-primary)] transition-colors
                       hover:bg-[var(--color-surface-hover)]"
          >
            <Link size={14} className="text-[var(--color-text-tertiary)]" />
            Copy link
          </button>

          {/* Share on X / Twitter */}
          <a
            href={socialShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-xs
                       text-[var(--color-text-primary)] transition-colors
                       hover:bg-[var(--color-surface-hover)]"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5 fill-current text-[var(--color-text-tertiary)]"
              aria-hidden="true"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Share on X
          </a>
        </div>
      )}

      {/* More options trigger — only shown when native share is available */}
      {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="ml-0.5 rounded-md px-1 py-1 text-[var(--color-text-tertiary)]
                     transition-colors hover:text-[var(--color-text-primary)]"
          aria-label="More share options"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={12} /> : <span className="text-xs font-medium">▼</span>}
        </button>
      )}

      {/* Transient error tooltip */}
      {shareError && (
        <div className="absolute -top-2 left-1/2 z-50 -translate-x-1/2 -translate-y-full
                        whitespace-nowrap rounded bg-[var(--color-surface-elevated)]
                        px-2 py-1 text-xs text-[var(--color-text-primary)] shadow-lg
                        ring-1 ring-[var(--color-border)]"
          role="alert"
        >
          {shareError}
        </div>
      )}
    </div>
  )
}
