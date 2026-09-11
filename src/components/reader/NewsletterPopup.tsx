/* ============================================================
   NewsletterPopup — exit-intent / 30s scroll popup.
   Dismissable; respects localStorage so it never re-prompts.
   ============================================================ */

'use client'

import { useEffect, useState } from 'react'
import { X, Envelope } from '@phosphor-icons/react'

const DISMISS_KEY = 'newsletter-popup-dismissed'
const SHOW_AFTER_MS = 30_000
const DISMISS_DAYS = 7

export function NewsletterPopup() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Show after 30s of dwell time, or on exit intent — whichever first.
  // Never show if user has dismissed within DISMISS_DAYS.
  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(DISMISS_KEY)
      if (dismissed) {
        const ts = Number(dismissed)
        if (Number.isFinite(ts) && Date.now() - ts < DISMISS_DAYS * 24 * 60 * 60 * 1000) {
          return
        }
      }
    } catch {}

    let timer: ReturnType<typeof setTimeout> | null = null
    const trigger = () => setOpen(true)

    timer = setTimeout(trigger, SHOW_AFTER_MS)

    const onMouseLeave = (e: MouseEvent) => {
      // Exit-intent: cursor leaves viewport from the top edge
      if (e.clientY <= 0) trigger()
    }
    document.addEventListener('mouseleave', onMouseLeave)

    return () => {
      if (timer) clearTimeout(timer)
      document.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  const close = (permanent = true) => {
    setOpen(false)
    if (permanent) {
      try { localStorage.setItem(DISMISS_KEY, String(Date.now())) } catch {}
    }
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/subscribe/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'popup' }),
      })
      if (!res.ok) throw new Error('Subscribe failed')
      setSubmitted(true)
      setTimeout(() => close(true), 2200)
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="newsletter-popup-heading"
    >
      <div className="relative w-full max-w-md rounded-[var(--radius-lg)] border border-[var(--color-border-light)] bg-[var(--color-surface-elevated)] p-8 shadow-[var(--shadow-dropdown)]">
        <button
          type="button"
          onClick={() => close(true)}
          className="absolute right-3 top-3 rounded p-1.5 text-[var(--color-text-tertiary)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]"
          aria-label="Close newsletter popup"
        >
          <X size={18} weight="bold" />
        </button>

        {submitted ? (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-brand-light)]">
              <Envelope size={20} className="text-[var(--color-brand)]" />
            </div>
            <h2 id="newsletter-popup-heading" className="mb-2 text-xl font-bold">
              You're in.
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Check your inbox to confirm. Thanks for subscribing.
            </p>
          </div>
        ) : (
          <>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-brand-light)]">
              <Envelope size={20} className="text-[var(--color-brand)]" />
            </div>
            <h2 id="newsletter-popup-heading" className="mb-2 text-center text-2xl font-bold">
              Don't miss the next story.
            </h2>
            <p className="mb-6 text-center text-sm text-[var(--color-text-secondary)]">
              Free daily briefing — top stories, in your inbox every morning.
            </p>
            <form onSubmit={onSubmit} className="space-y-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm focus:border-[var(--color-brand)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/15"
                disabled={submitting}
              />
              <button
                type="submit"
                disabled={submitting || !email}
                className="w-full rounded-[var(--radius-sm)] bg-[var(--color-brand)] px-4 py-3 text-sm font-semibold text-[var(--color-text-on-brand)] transition-all hover:bg-[var(--color-brand-hover)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? 'Subscribing…' : 'Subscribe free'}
              </button>
              {error && <p className="text-center text-xs text-[var(--color-brand)]">{error}</p>}
            </form>
            <button
              type="button"
              onClick={() => close(true)}
              className="mt-3 w-full text-center text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]"
            >
              No thanks
            </button>
          </>
        )}
      </div>
    </div>
  )
}
