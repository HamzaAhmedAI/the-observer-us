/* ============================================================
   The Observer US — Subscriber Preferences Page
   Client island: manage email, categories, and push settings.
   ============================================================ */

'use client'

import { useState, useCallback, useEffect } from 'react'
import { Bell, Envelope, Check, X, ArrowLeft } from '@phosphor-icons/react'
import Link from 'next/link'

const CATEGORIES = [
  { slug: 'politics', name: 'Politics', color: '#2563eb' },
  { slug: 'technology', name: 'Technology', color: '#059669' },
  { slug: 'business', name: 'Business', color: '#0891b2' },
  { slug: 'sports', name: 'Sports', color: '#ea580c' },
  { slug: 'entertainment', name: 'Entertainment', color: '#8b5cf6' },
  { slug: 'health', name: 'Health', color: '#e11d48' },
  { slug: 'science', name: 'Science', color: '#65a30d' },
  { slug: 'world', name: 'World', color: '#4f46e5' },
]

type PageState = 'email-input' | 'loading' | 'subscribed' | 'error'

export default function PreferencesPage() {
  const [email, setEmail] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [pageState, setPageState] = useState<PageState>('email-input')
  const [errorMsg, setErrorMsg] = useState('')
  const [pushStatus, setPushStatus] = useState<'unsupported' | 'default' | 'granted' | 'denied'>('default')

  // Check push permission on mount
  useEffect(() => {
    if (typeof Notification === 'undefined') {
      setPushStatus('unsupported')
    } else {
      setPushStatus(Notification.permission as 'default' | 'granted' | 'denied')
    }
  }, [])

  const toggleCategory = useCallback((slug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug]
    )
  }, [])

  const handleSubscribe = useCallback(async () => {
    if (!email) return

    setPageState('loading')
    setErrorMsg('')

    try {
      const response = await fetch('/api/subscribe/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, categories: selectedCategories }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error ?? 'Subscription failed')
      }

      setPageState('subscribed')
    } catch (error) {
      setErrorMsg(
        error instanceof Error ? error.message : 'Something went wrong.'
      )
      setPageState('error')
    }
  }, [email, selectedCategories])

  const handleUnsubscribe = useCallback(async () => {
    setPageState('loading')
    setErrorMsg('')

    try {
      const response = await fetch('/api/subscribe/email', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error ?? 'Failed to unsubscribe')
      }

      setEmail('')
      setSelectedCategories([])
      setPageState('email-input')
    } catch (error) {
      setErrorMsg(
        error instanceof Error ? error.message : 'Something went wrong.'
      )
      setPageState('error')
    }
  }, [email])

  const handleEnablePush = useCallback(async () => {
    try {
      const perm = await Notification.requestPermission()
      if (perm === 'granted') {
        const registration = await navigator.serviceWorker.register('/sw.js')
        await navigator.serviceWorker.ready

        const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
        if (vapidKey) {
          const sub = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(vapidKey) as BufferSource,
          })
          const subData = sub.toJSON()
          await fetch('/api/subscribe/push', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              subscription: { endpoint: subData.endpoint, keys: subData.keys },
            }),
          })
        }

        setPushStatus('granted')
      } else {
        setPushStatus('denied')
      }
    } catch {
      setErrorMsg('Could not enable push notifications.')
      setPageState('error')
    }
  }, [])

  return (
    <main className="container-news py-12 md:py-20">
      {/* Back link */}
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-[var(--color-text-tertiary)]
                   transition-colors hover:text-[var(--color-text-primary)]"
      >
        <ArrowLeft size={14} />
        Back to homepage
      </Link>

      <div className="mx-auto max-w-lg">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">
          Notification Preferences
        </h1>
        <p className="mt-2 text-[var(--color-text-secondary)]">
          Manage how you receive updates from The Observer US.
        </p>

        {/* Success state */}
        {pageState === 'subscribed' && (
          <div className="mt-8 space-y-6">
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-brand)]/10">
                <Check size={24} className="text-[var(--color-brand)]" />
              </div>
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
                You&apos;re all set!
              </h2>
              <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                {email} is subscribed. We&apos;ll send updates based on your
                preferences.
              </p>
              <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="/"
                  className="rounded-md bg-[var(--color-brand)] px-4 py-2 text-sm font-semibold
                             text-[var(--color-text-on-brand)] transition-colors
                             hover:bg-[var(--color-brand-hover)]"
                >
                  Browse Articles
                </Link>
                <button
                  onClick={handleUnsubscribe}
                  className="rounded-md px-4 py-2 text-sm font-medium
                             text-[var(--color-text-tertiary)] transition-colors
                             hover:text-[var(--color-text-primary)]"
                >
                  Unsubscribe
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Email input form */}
        {pageState !== 'subscribed' && (
          <div className="mt-8 space-y-8">
            {/* Email Section */}
            <section className="rounded-lg border border-[var(--color-border)] p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand)]/10">
                  <Envelope size={16} className="text-[var(--color-brand)]" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">
                    Email Newsletter
                  </h2>
                  <p className="text-xs text-[var(--color-text-tertiary)]">
                    Daily &amp; weekly digests tailored to your interests.
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="sub-email" className="sr-only">
                  Email address
                </label>
                <div className="flex gap-2">
                  <input
                    id="sub-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    disabled={pageState === 'loading'}
                    className="min-w-0 flex-1 rounded-md border border-[var(--color-border)]
                               bg-[var(--color-surface)] px-3 py-2 text-sm
                               text-[var(--color-text-primary)]
                               placeholder:text-[var(--color-text-tertiary)]
                               focus:border-[var(--color-brand)] focus:outline-none
                               disabled:opacity-50"
                  />
                  <button
                    onClick={handleSubscribe}
                    disabled={pageState === 'loading' || !email}
                    className="shrink-0 rounded-md bg-[var(--color-brand)] px-4 py-2 text-sm font-semibold
                               text-[var(--color-text-on-brand)] transition-colors
                               hover:bg-[var(--color-brand-hover)]
                               disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {pageState === 'loading' ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </div>
              </div>
            </section>

            {/* Category Preferences */}
            <section className="rounded-lg border border-[var(--color-border)] p-6">
              <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">
                Topics You Care About
              </h2>
              <p className="mt-0.5 text-xs text-[var(--color-text-tertiary)]">
                Select categories to receive relevant updates.
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategories.includes(cat.slug)
                  return (
                    <button
                      key={cat.slug}
                      type="button"
                      onClick={() => toggleCategory(cat.slug)}
                      disabled={pageState === 'loading'}
                      className={`group relative flex items-center gap-2 rounded-md border px-3 py-2.5 text-xs font-medium
                        transition-all
                        ${
                          isSelected
                            ? 'border-[var(--color-brand)] bg-[var(--color-brand)]/5'
                            : 'border-[var(--color-border)] bg-transparent hover:border-[var(--color-text-tertiary)]'
                        }
                        disabled:cursor-not-allowed disabled:opacity-50`}
                    >
                      {/* Color dot */}
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="text-[var(--color-text-primary)]">{cat.name}</span>
                      {isSelected && (
                        <Check
                          size={12}
                          className="ml-auto shrink-0 text-[var(--color-brand)]"
                        />
                      )}
                    </button>
                  )
                })}
              </div>
            </section>

            {/* Push Notifications */}
            <section className="rounded-lg border border-[var(--color-border)] p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand)]/10">
                  <Bell size={16} className="text-[var(--color-brand)]" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">
                    Push Notifications
                  </h2>
                  <p className="text-xs text-[var(--color-text-tertiary)]">
                    Get breaking news alerts sent directly to your browser.
                  </p>
                </div>
              </div>

              <div className="mt-4">
                {pushStatus === 'granted' ? (
                  <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                    <Check size={14} className="text-green-500" />
                    Notifications are enabled
                  </div>
                ) : pushStatus === 'denied' ? (
                  <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                    <X size={14} className="text-[var(--color-brand)]" />
                    Notifications are blocked
                    <span className="text-xs text-[var(--color-text-tertiary)]">
                      — update your browser settings to re-enable.
                    </span>
                  </div>
                ) : pushStatus === 'unsupported' ? (
                  <p className="text-sm text-[var(--color-text-tertiary)]">
                    Push notifications are not supported in your browser.
                  </p>
                ) : (
                  <button
                    onClick={handleEnablePush}
                    className="rounded-md bg-[var(--color-surface-alt)] px-3 py-1.5 text-xs font-medium
                               text-[var(--color-text-primary)] transition-colors
                               hover:bg-[var(--color-surface-hover)]"
                  >
                    Enable Notifications
                  </button>
                )}
              </div>
            </section>

            {/* Error message */}
            {pageState === 'error' && errorMsg && (
              <div
                className="rounded-md border border-[var(--color-brand)]/30 bg-[var(--color-brand)]/5 px-4 py-3 text-sm text-[var(--color-brand)]"
                role="alert"
              >
                {errorMsg}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}

// ─── Helper: base64 → Uint8Array for VAPID key ──────────────
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from({ length: rawData.length }, (_, i) =>
    rawData.charCodeAt(i)
  )
}
