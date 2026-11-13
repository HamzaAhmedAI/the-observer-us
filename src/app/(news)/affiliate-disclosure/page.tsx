/* ============================================================
   The Observer US — Affiliate Disclosure
   FTC-required plain-language disclosure for a site whose
   revenue model is affiliate actions first. Linked from the
   footer and from every article that contains affiliate links.
   ============================================================ */

import type { Metadata } from 'next'
import { LegalPage, LegalSection } from '@/components/reader/LegalPage'
import { SITE_NAME } from '@/lib/seo'

export const metadata: Metadata = {
  title: `Affiliate Disclosure — ${SITE_NAME}`,
  description:
    'How The Observer US earns money: some guides contain affiliate links. We may earn a commission if you buy through them, at no extra cost to you — and it never affects what we recommend.',
  alternates: { canonical: '/affiliate-disclosure' },
  robots: { index: true, follow: true },
}

export const revalidate = 86400

export default function AffiliateDisclosurePage() {
  return (
    <LegalPage
      title="Affiliate Disclosure"
      intro="The Observer US is reader-supported. Some of our guides contain affiliate links — here is exactly how that works, in plain language."
      lastUpdated="November 13, 2026"
    >
      <LegalSection title="1. What an affiliate link is">
        <p>
          Some links in our guides point to a company&apos;s website — for example, an
          identity-protection service or an insurance-quote provider. If you sign up or
          buy through that link, the company may pay us a commission. It costs you
          nothing extra: the price you pay is the same as going to the company
          directly.
        </p>
      </LegalSection>

      <LegalSection title="2. What we recommend — and what we don&apos;t">
        <p>
          A commission never decides what we recommend. In every guide, the free
          official action comes first — for example, freezing your credit directly
          with the three bureaus, which is free and takes about ten minutes. A paid
          service is listed only when it genuinely helps, and only after the free
          option.
        </p>
        <p>
          We do not publish &ldquo;best credit card&rdquo; lists, and we do not give
          personalised financial advice. Our guides explain the steps and the
          trade-offs; the decision is always yours.
        </p>
      </LegalSection>

      <LegalSection title="3. Which partners we work with">
        <p>
          Our affiliate partners may include identity-protection services (such as
          IdentityIQ) and insurance-quote providers. The exact partners can change
          over time; every article that contains affiliate links carries a disclosure
          at the end of the guide, next to its sources.
        </p>
      </LegalSection>

      <LegalSection title="4. Advertising">
        <p>
          We do not currently run third-party display advertising. If that changes,
          this page and our Privacy Policy will be updated first, and advertising will
          be clearly labelled as such.
        </p>
      </LegalSection>

      <LegalSection title="5. Questions">
        <p>
          If you have any question about how we earn money, contact us at{' '}
          <a
            href="mailto:privacy@theobserverus.com"
            className="text-[var(--color-accent)] hover:underline"
          >
            privacy@theobserverus.com
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  )
}
