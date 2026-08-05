/* ============================================================
   The Observer US — Email Subscribe
   Premium newsletter signup with category preferences.
   Client component for interactivity.
   ============================================================ */

'use client'

import { useState, type FormEvent } from 'react'
import { PaperPlaneRight, CheckCircle, WarningCircle } from '@phosphor-icons/react'

const CATEGORIES = [
  'Politics',
  'Technology',
  'Business',
  'Sports',
  'Entertainment',
  'Health',
  'Science',
  'World',
]

type Status = 'idle' | 'loading' | 'success' | 'error'

export function EmailSubscribe() {
  const [email, setEmail] = useState('')
  const [selected, setSelected] = useState<string[]>([])
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')

  const toggleCategory = (name: string) => {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    )
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      const res = await fetch('/api/subscribe/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, categories: selected }),
      })

      const data = await res.json()

      if (res.ok) {
        setStatus('success')
        setMessage('You are subscribed! Check your inbox for confirmation.')
        setEmail('')
        setSelected([])
      } else {
        setStatus('error')
        setMessage(data.error ?? 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setMessage('Network error. Please try again later.')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center gap-3 rounded-[var(--radius-md)] bg-[var(--color-surface-elevated)] p-8 shadow-[var(--shadow-card)]">
        <CheckCircle size={36} className="text-green-500" weight="fill" />
        <p className="text-sm font-medium text-[var(--color-text-primary)]">{message}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Email Input */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
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
            <>
              Subscribe <PaperPlaneRight size={16} weight="bold" />
            </>
          )}
        </button>
      </div>

      {/* Category Preferences */}
      <div className="text-left">
        <p className="mb-3 text-xs font-medium text-[var(--color-text-secondary)]">
          Select topics you care about (optional):
        </p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => toggleCategory(cat)}
              className={`rounded-full px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.08em] transition-all duration-[var(--duration-fast)]
                ${
                  selected.includes(cat)
                    ? 'bg-[var(--color-brand)] text-[var(--color-text-on-brand)] shadow-sm'
                    : 'border border-[var(--color-border)] bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {status === 'error' && (
        <div className="flex items-center gap-2.5 rounded-[var(--radius-sm)] border border-red-200 bg-red-50 p-3.5 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
          <WarningCircle size={16} weight="fill" className="shrink-0" />
          {message}
        </div>
      )}
    </form>
  )
}
