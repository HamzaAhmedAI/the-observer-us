/* ============================================================
   The Observer US — Push Notification Opt-in Banner
   Client island: service worker registration + VAPID subscribe.
   Uses useSyncExternalStore for React-18-compliant external state.
   ============================================================ */

'use client'

import { useCallback, useState, useSyncExternalStore } from 'react'
import { Bell, X, BellSlash } from '@phosphor-icons/react'

type PermissionState = 'idle' | 'loading' | 'granted' | 'denied' | 'error' | 'dismissed'

const DISMISS_KEY = 'push-banner-dismissed'
const PERMISSION_CHANGE_EVENT = 'observer-permission-change'

function getPermissionSnapshot(): PermissionState {
  if (typeof window === 'undefined') return 'idle'
  if (localStorage.getItem(DISMISS_KEY) === 'true') return 'dismissed'
  if (!('Notification' in window)) return 'dismissed'
  if (Notification.permission === 'granted') return 'granted'
  if (Notification.permission === 'denied') return 'denied'
  return 'idle'
}

function subscribeToPermissionChange(): () => void {
  if (typeof window === 'undefined') return () => {}
  const handleChange = () => window.dispatchEvent(new Event(PERMISSION_CHANGE_EVENT))
  window.addEventListener(PERMISSION_CHANGE_EVENT, handleChange)
  return () => window.removeEventListener(PERMISSION_CHANGE_EVENT, handleChange)
}

export function PushBanner() {
  const permission = useSyncExternalStore(
    subscribeToPermissionChange,
    getPermissionSnapshot,
    () => 'idle',
  )
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubscribe = useCallback(async () => {
    // Force re-read by dispatching event after async operations
    const notifyChange = () => window.dispatchEvent(new Event(PERMISSION_CHANGE_EVENT))

    // 1. Request notification permission
    const permResult = await Notification.requestPermission()
    if (permResult !== 'granted') {
      notifyChange()
      return
    }

    // 2. Register service worker
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    })
    await navigator.serviceWorker.ready

    // 3. Subscribe to push
    const vapidPublicKey =
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ??
      ''

    if (!vapidPublicKey) {
      console.warn('[PushBanner] VAPID public key not configured — skipping push subscription')
      notifyChange()
      return
    }

    const pushSubscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) as BufferSource,
    })

    // 4. Send subscription to our API
    const subData = pushSubscription.toJSON()
    const response = await fetch('/api/subscribe/push', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subscription: {
          endpoint: subData.endpoint,
          keys: subData.keys,
        },
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to register push subscription on server')
    }

    notifyChange()
  }, [])

  const handleDismiss = useCallback(() => {
    localStorage.setItem(DISMISS_KEY, 'true')
    window.dispatchEvent(new Event(PERMISSION_CHANGE_EVENT))
  }, [])

  // Don't render if granted, denied, dismissed, or unsupported
  if (
    permission === 'granted' ||
    permission === 'denied' ||
    permission === 'dismissed'
  ) {
    return null
  }

  // Don't render if browser doesn't support notifications or service workers
  if (typeof window !== 'undefined' && !('Notification' in window)) {
    return null
  }

  return (
    <div
      className="fixed bottom-4 right-4 z-50 max-w-sm animate-in slide-in-from-bottom-4"
      role="alert"
    >
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4 shadow-elevated">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand)]/10">
            {permission === 'error' ? (
              <BellSlash size={16} className="text-[var(--color-brand)]" />
            ) : (
              <Bell size={16} className="text-[var(--color-brand)]" />
            )}
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">
              {permission === 'error'
                ? 'Notification Setup Failed'
                : 'Stay Updated Instantly'}
            </p>
            <p className="mt-0.5 text-xs text-[var(--color-text-tertiary)]">
              {permission === 'error'
                ? errorMsg || 'Please try again or check browser settings.'
                : 'Get breaking news alerts delivered straight to your browser.'}
            </p>

            {/* Actions */}
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={handleSubscribe}
                disabled={permission === 'loading'}
                className="rounded-md bg-[var(--color-brand)] px-3 py-1.5 text-xs font-semibold
                           text-[var(--color-text-on-brand)] transition-colors
                           hover:bg-[var(--color-brand-hover)]
                           disabled:cursor-not-allowed disabled:opacity-50"
              >
                {permission === 'loading' ? (
                  <span className="flex items-center gap-1.5">
                    <svg
                      className="h-3 w-3 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Setting up...
                  </span>
                ) : permission === 'error' ? (
                  'Try Again'
                ) : (
                  'Enable Notifications'
                )}
              </button>
              <button
                onClick={handleDismiss}
                className="rounded-md px-2 py-1.5 text-xs font-medium
                           text-[var(--color-text-tertiary)] transition-colors
                           hover:text-[var(--color-text-primary)]"
              >
                Not now
              </button>
            </div>
          </div>

          {/* Close */}
          <button
            onClick={handleDismiss}
            className="-mr-1 -mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full
                       text-[var(--color-text-tertiary)] transition-colors hover:text-[var(--color-text-primary)]"
            aria-label="Dismiss"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Helper: base64 → Uint8Array for VAPID applicationServerKey ───
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from({ length: rawData.length }, (_, i) =>
    rawData.charCodeAt(i)
  )
}