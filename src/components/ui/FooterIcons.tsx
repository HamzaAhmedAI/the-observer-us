/* ============================================================
   The Observer US — Footer Icons
   Tiny client island for phosphor icons so Footer
   can remain a Server Component.
   ============================================================ */

'use client'

import { Copyright, Envelope } from '@phosphor-icons/react'
import Link from 'next/link'

export function FooterCopyright() {
  return (
    <p className="flex items-center gap-1">
      <Copyright size={14} /> {new Date().getFullYear()} The Observer US. All rights reserved.
    </p>
  )
}

export function FooterNewsletterLink() {
  return (
    <div className="flex items-center gap-3">
      <Envelope size={18} className="text-[var(--color-text-tertiary)]" />
      <span className="text-sm text-[var(--color-text-secondary)]">
        Stay informed —{' '}
        <Link
          href="/#subscribe"
          className="font-medium text-[var(--color-brand-text)] no-underline hover:underline"
        >
          subscribe to our newsletter
        </Link>
      </span>
    </div>
  )
}
