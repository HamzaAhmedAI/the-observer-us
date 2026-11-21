/* ============================================================
   The Observer US — Checklist Opt-In
   In-article lead magnet for the printable Home & Wallet
   Protection Checklist. Client component for interactivity.
   Posts to the existing /api/subscribe/email endpoint and,
   on success, shows the PDF download link. No category
   picker — the article's own category is passed through
   (only if it is on the endpoint's whitelist).
   ============================================================ */

'use client'

import { useState, type FormEvent } from 'react'

const CHECKLIST_URL = '/downloads/home-wallet-protection-checklist.pdf'

// Must match the whitelist in /api/subscribe/email.
const KNOWN_CATEGORIES = ['home-costs', 'bills-insurance', 'recalls', 'home-scams', 'breach-actions']

type Status = 'idle' | 'loading' | 'success' | 'error'

export function ChecklistOptIn({ category }: { category: string }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      const res = await fetch('/api/subscribe/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          categories: KNOWN_CATEGORIES.includes(category) ? [category] : [],
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setStatus('success')
        setMessage('You are subscribed! Your checklist is ready below.')
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error ?? 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setMessage('Network error. Please try again later.')
    }
  }

  return (
    <aside
      aria-label="Get the free Home and Wallet Protection Checklist"
      className="mb-10 rounded-[var(--radius-md)] border-2 border-[var(--color-brand)] bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-card)]"
    >
      <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[var(--color-brand)]">
        Free printable
      </p>
      <h2 className="mb-2 text-xl font-bold text-[var(--color-text-primary)]">
        Get the Home &amp; Wallet Protection Checklist
      </h2>
      <p className="mb-4 text-sm leading-relaxed text-[var(--color-text-secondary)]">
        One page, printable — every check from our guides in one place: freeze your
        credit, handle a breach, review your insurance, build your 72-hour kit, and
        check for recalls. Enter your email and the download is yours.
      </p>

      {status === 'success' ? (
        <div>
          <p className="mb-4 text-sm font-medium text-[var(--color-text-primary)]">{message}</p>
          <a
            href={CHECKLIST_URL}
            download="home-wallet-protection-checklist.pdf"
            className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-[var(--color-brand)] px-6 py-3 text-sm font-semibold text-[var(--color-text-on-brand)] transition-all duration-[var(--duration-fast)] hover:bg-[var(--color-brand-hover)] active:scale-[0.97]"
          >
            Download the checklist (PDF)
          </a>
          <p className="mt-3 text-xs text-[var(--color-text-tertiary)]">
            Check your inbox for a confirmation email. No spam — unsubscribe anytime.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row">
            <label htmlFor="checklist-email" className="sr-only">
              Email address
            </label>
            <input
              id="checklist-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={status === 'loading'}
              className="flex-1 rounded-[var(--radius-sm)] border border-[var(--color-border)]
                         bg-[var(--color-surface-elevated)] px-4 py-3 text-sm
                         text-[var(--color-text-primary)]
                         placeholder:text-[var(--color-text-tertiary)]
                         transition-all duration-[var(--duration-fast)]
                         focus:border-[var(--color-brand)] focus:outline-none focus:ring-2
                         focus:ring-[var(--color-brand)]/15
                         disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={status === 'loading' || !email}
              className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-sm)]
                         bg-[var(--color-brand)] px-6 py-3 text-sm font-semibold
                         text-[var(--color-text-on-brand)]
                         transition-all duration-[var(--duration-fast)]
                         hover:bg-[var(--color-brand-hover)]
                         active:scale-[0.97]
                         disabled:cursor-not-allowed disabled:opacity-50
                         shadow-sm hover:shadow-[var(--shadow-elevated)]"
            >
              {status === 'loading' ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                'Send me the checklist'
              )}
            </button>
          </div>
          <p className="text-xs text-[var(--color-text-tertiary)]">
            No spam — unsubscribe anytime.
          </p>
          {status === 'error' && (
            <div className="rounded-[var(--radius-sm)] border border-red-200 bg-red-50 p-3.5 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
              {message}
            </div>
          )}
        </form>
      )}
    </aside>
  )
}
