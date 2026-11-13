/* ============================================================
   The Observer US — Cookie Policy
   (Linked from the footer "Legal" column.)
   ============================================================ */

import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPage, LegalSection } from '@/components/reader/LegalPage'
import { SITE_NAME } from '@/lib/seo'

export const metadata: Metadata = {
  title: `Cookie Policy — ${SITE_NAME}`,
  description:
    'How The Observer US uses cookies: first-party functional cookies, plus Google Analytics 4 cookies when analytics is enabled. No third-party advertising or cross-site tracking cookies.',
  alternates: { canonical: '/cookies' },
  robots: { index: true, follow: true },
}

export const revalidate = 86400

export default function CookiesPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      intro="This page explains the cookies The Observer US uses. In short: first-party functional cookies, plus Google Analytics 4 cookies when analytics is enabled — no third-party advertising or cross-site tracking cookies."
      lastUpdated="November 13, 2026"
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
          <strong className="text-[var(--color-text-primary)]">Google Analytics 4 (when enabled).</strong> We
          use Google Analytics 4 to understand aggregate traffic, with IP anonymization enabled.
          It sets its own cookies (_ga, _ga_*) and is not used for advertising. It is off until
          a measurement ID is configured; until then, no third-party analytics cookies are set.
        </p>
        <p>
          <strong className="text-[var(--color-text-primary)]">No third-party advertising.</strong> We do
          not load third-party advertising networks, social pixels, or cross-site advertising cookies
          (such as Meta Pixel). Because we don&apos;t use non-essential advertising cookies, no
          separate advertising-consent banner is required under the EU ePrivacy rules for our
          current setup.
        </p>
      </LegalSection>

      <LegalSection title="Managing Cookies">
        <p>
          You can control or delete cookies through your browser settings at any time. Disabling
          functional cookies may affect features such as saved category preferences or notification
          state. For our broader data practices, see the{' '}
          <Link href="/privacy" className="text-[var(--color-accent)] hover:underline">
            Privacy Policy
          </Link>
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
