/* ============================================================
   The Observer US — One-Click Unsubscribe Page
   Handles email unsubscribes with confirmation.
   ============================================================ */

'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense, useState, useCallback } from 'react'
import Link from 'next/link'
import { Check, X, ArrowLeft } from '@phosphor-icons/react'

type UnsubState = 'confirm' | 'loading' | 'done' | 'error'

function UnsubscribeForm() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') ?? ''
  const [state, setState] = useState<UnsubState>(email ? 'confirm' : 'done')
  const [errorMsg, setErrorMsg] = useState('')

  const handleUnsubscribe = useCallback(async () => {
    if (!email) return
    setState('loading')

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

      setState('done')
    } catch (error) {
      setErrorMsg(
        error instanceof Error ? error.message : 'Something went wrong.'
      )
      setState('error')
    }
  }, [email])

  return (
    <div className="mx-auto max-w-md text-center">
      {/* State: confirm */}
      {state === 'confirm' && (
        <div className="space-y-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-brand)]/10">
            <X size={24} className="text-[var(--color-brand)]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
            Unsubscribe from emails?
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            <strong className="text-[var(--color-text-primary)]">{email}</strong>
            {' '}will stop receiving breaking news alerts and the daily digest.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={handleUnsubscribe}
              className="rounded-md bg-[var(--color-brand)] px-5 py-2.5 text-sm font-semibold
                         text-[var(--color-text-on-brand)] transition-colors
                         hover:bg-[var(--color-brand-hover)]"
            >
              Yes, unsubscribe me
            </button>
            <Link
              href="/"
              className="rounded-md px-5 py-2.5 text-sm font-medium
                         text-[var(--color-text-tertiary)] transition-colors
                         hover:text-[var(--color-text-primary)]"
            >
              No, keep my subscription
            </Link>
          </div>
        </div>
      )}

      {/* State: loading */}
      {state === 'loading' && (
        <div className="space-y-4">
          <div className="mx-auto h-14 w-14 animate-pulse rounded-full bg-[var(--color-surface-hover)]" />
          <p className="text-sm text-[var(--color-text-secondary)]">
            Processing your request…
          </p>
        </div>
      )}

      {/* State: done */}
      {state === 'done' && (
        <div className="space-y-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10">
            <Check size={24} className="text-green-500" />
          </div>
          {email ? (
            <>
              <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
                You&apos;ve been unsubscribed
              </h1>
              <p className="text-sm text-[var(--color-text-secondary)]">
                <strong className="text-[var(--color-text-primary)]">{email}</strong>
                {' '}has been removed from our mailing list.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
                Unsubscribed
              </h1>
              <p className="text-sm text-[var(--color-text-secondary)]">
                You&apos;ve been removed from our mailing list.
              </p>
            </>
          )}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium
                       text-[var(--color-text-tertiary)] transition-colors
                       hover:text-[var(--color-text-primary)]"
          >
            <ArrowLeft size={14} />
            Back to homepage
          </Link>
        </div>
      )}

      {/* State: error */}
      {state === 'error' && (
        <div className="space-y-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-brand)]/10">
            <X size={24} className="text-[var(--color-brand)]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
            Something went wrong
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">{errorMsg}</p>
          <button
            onClick={handleUnsubscribe}
            className="rounded-md bg-[var(--color-brand)] px-5 py-2.5 text-sm font-semibold
                       text-[var(--color-text-on-brand)] transition-colors
                       hover:bg-[var(--color-brand-hover)]"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  )
}

export default function UnsubscribePage() {
  return (
    <main className="container-news flex min-h-[60dvh] items-center justify-center py-20">
      <Suspense
        fallback={
          <div className="text-center text-sm text-[var(--color-text-tertiary)]">
            Loading…
          </div>
        }
      >
        <UnsubscribeForm />
      </Suspense>
    </main>
  )
}
