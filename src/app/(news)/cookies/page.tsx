/* ============================================================
   The Observer US — Cookie Policy
   (Linked from the footer "Legal" column.)
   ============================================================ */

import type { Metadata } from 'next'
import { LegalPage, LegalSection } from '@/components/reader/LegalPage'
import { SITE_NAME } from '@/lib/seo'

export const metadata: Metadata = {
  title: `Cookie Policy — ${SITE_NAME}`,
  description:
    'How The Observer US uses first-party cookies. We do not use third-party advertising or cross-site tracking cookies.',
  alternates: { canonical: '/cookies' },
  robots: { index: true, follow: true },
}

export const revalidate = 86400

export default function CookiesPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      intro="This page explains the cookies The Observer US uses. In short: we use only first-party, functional cookies — not third-party advertising or cross-site tracking cookies."
      lastUpdated="August 21, 2026"
    >
      <LegalSection title="What Are Cookies">
        <p>
          Cookies are small text files stored on your device by your browser. They help websites
          remember your preferences and understand how the site is used.
        </p>
      </LegalSection>

      <LegalSection title="Cookies We Use">
        <p>
          <strong className="text-[var(--color-text-primary)]">First-party functional cookies.</strong>{' '}
          We set cookies to remember your choices — such as category preferences, notification
          settings, and whether you&apos;ve dismissed a notice. These are essential to providing the
          service as you expect.
        </p>
        <p>
          <strong className="text-[var(--color-text-primary)]">No third-party tracking.</strong> We do
          not load third-party advertising networks, social pixels, or cross-site analytics cookies
          (such as Google Analytics or Meta Pixel). Because we don&apos;t use non-essential
          third-party cookies, no separate advertising-consent banner is required under the EU
          ePrivacy rules for our current setup.
        </p>
      </LegalSection>

      <LegalSection title="Managing Cookies">
        <p>
          You can control or delete cookies through your browser settings at any time. Disabling
          functional cookies may affect features such as saved category preferences or notification
          state. For our broader data practices, see the{' '}
          <a href="/privacy" className="text-[var(--color-accent)] hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="Changes">
        <p>
          If we add any non-essential third-party cookies in the future, we will update this policy
          and implement appropriate consent. The &ldquo;Last updated&rdquo; date reflects the latest
          revision.
        </p>
      </LegalSection>
    </LegalPage>
  )
}
