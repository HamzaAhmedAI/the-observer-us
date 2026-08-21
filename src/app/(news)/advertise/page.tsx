/* ============================================================
   The Observer US — Advertise
   ============================================================ */

import type { Metadata } from 'next'
import { LegalPage, LegalSection, LegalList } from '@/components/reader/LegalPage'
import { SITE_NAME } from '@/lib/seo'

export const metadata: Metadata = {
  title: `Advertise — ${SITE_NAME}`,
  description:
    'Advertise with The Observer US. Reach an engaged US news audience with clearly-labeled, brand-safe placements.',
  alternates: { canonical: '/advertise' },
  robots: { index: true, follow: true },
}

export const revalidate = 86400

export default function AdvertisePage() {
  return (
    <LegalPage
      title="Advertise With Us"
      intro="Reach a growing, engaged US news audience through brand-safe, clearly-labeled advertising. We value reader trust over intrusive ads."
      lastUpdated="August 21, 2026"
    >
      <LegalSection title="Why The Observer US">
        <LegalList>
          <li>
            <strong className="text-[var(--color-text-primary)]">Engaged readers.</strong> Visitors
            come for breaking news and analysis across politics, technology, business, and more.
          </li>
          <li>
            <strong className="text-[var(--color-text-primary)]">Brand-safe environment.</strong> A
            credible, editorially-reviewed newsroom — no misinformation adjacency.
          </li>
          <li>
            <strong className="text-[var(--color-text-primary)]">Trust-first.</strong> Advertising is
            always clearly distinguished from editorial content. We never let advertisers influence
            coverage.
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="Advertising Options">
        <LegalList>
          <li>
            <strong className="text-[var(--color-text-primary)]">Display placements</strong> — native
            and banner slots on article and category pages.
          </li>
          <li>
            <strong className="text-[var(--color-text-primary)]">Newsletter sponsorships</strong> — a
            limited number of sponsor slots in our email digest.
          </li>
          <li>
            <strong className="text-[var(--color-text-primary)]">Sponsored content</strong> —
            clearly-labeled sponsored articles, written to editorial standards and disclosed as paid.
          </li>
          <li>
            <strong className="text-[var(--color-text-primary)]">Category or section sponsorships</strong>{' '}
            — align your brand with a vertical (e.g., Technology or Business).
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="Our Standards">
        <LegalList>
          <li>All advertising is labeled as &ldquo;Advertisement,&rdquo; &ldquo;Sponsored,&rdquo; or &ldquo;Partner,&rdquo; as applicable.</li>
          <li>We do not accept ads that are deceptive, illegal, or harmful.</li>
          <li>We do not sell or share personal user data to third-party advertisers.</li>
        </LegalList>
      </LegalSection>

      <LegalSection title="Get a Media Kit">
        <p>
          Rates, audience demographics, and available inventory are shared on request. Email our
          partnerships team at{' '}
          <a
            href="mailto:advertise@theobserverus.com"
            className="text-[var(--color-accent)] hover:underline"
          >
            advertise@theobserverus.com
          </a>{' '}
          with a brief description of your brand and goals, and we&apos;ll send the current media
          kit.
        </p>
      </LegalSection>

      <LegalSection title="Direct Partnerships">
        <p>
          For programmatic or agency inquiries, including approved demand partners, contact{' '}
          <a
            href="mailto:advertise@theobserverus.com"
            className="text-[var(--color-accent)] hover:underline"
          >
            advertise@theobserverus.com
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  )
}
