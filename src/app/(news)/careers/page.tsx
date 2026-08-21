/* ============================================================
   The Observer US — Careers
   ============================================================ */

import type { Metadata } from 'next'
import { LegalPage, LegalSection, LegalList } from '@/components/reader/LegalPage'
import { SITE_NAME } from '@/lib/seo'

export const metadata: Metadata = {
  title: `Careers — ${SITE_NAME}`,
  description:
    'Join The Observer US. We are building an independent, AI-assisted newsroom and are always interested in talented editors, writers, and engineers.',
  alternates: { canonical: '/careers' },
  robots: { index: true, follow: true },
}

export const revalidate = 86400

export default function CareersPage() {
  return (
    <LegalPage
      title="Careers"
      intro="We're building an independent, AI-assisted newsroom. If you care about trustworthy, accessible journalism, we'd like to meet you."
      lastUpdated="August 21, 2026"
    >
      <LegalSection title="Our Team Culture">
        <p>
          The Observer US blends human editorial judgment with AI-assisted reporting. We value
          accuracy, speed, transparency, and reader trust above everything else.
        </p>
      </LegalSection>

      <LegalSection title="Open Roles">
        <p>
          We are a small, fast-moving team and hire as needs arise. Typical areas we look for:
        </p>
        <LegalList>
          <li>
            <strong className="text-[var(--color-text-primary)]">Editors</strong> — review
            AI-assisted drafts, verify facts, and uphold editorial standards.
          </li>
          <li>
            <strong className="text-[var(--color-text-primary)]">Writers &amp; Reporters</strong> —
            cover US politics, technology, business, and more.
          </li>
          <li>
            <strong className="text-[var(--color-text-primary)]">Engineering</strong> — build and
            maintain our Next.js + Payload CMS platform and automation pipelines.
          </li>
          <li>
            <strong className="text-[var(--color-text-primary)]">Product &amp; Growth</strong> —
            audience development, newsletters, and partnerships.
          </li>
        </LegalList>
        <p className="text-sm text-[var(--color-text-tertiary)]">
          Specific openings are posted here when available. Even if a role isn&apos;t listed, we
          welcome speculative applications.
        </p>
      </LegalSection>

      <LegalSection title="How to Apply">
        <LegalList>
          <li>
            Send your resume and a short note about why you&apos;re interested to{' '}
            <a
              href="mailto:careers@theobserverus.com"
              className="text-[var(--color-accent)] hover:underline"
            >
              careers@theobserverus.com
            </a>
            .
          </li>
          <li>
            For editorial roles, include 2–3 writing samples or a link to published work.
          </li>
          <li>
            For engineering roles, include a link to relevant code or a brief description of projects
            you&apos;ve shipped.
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="Equal Opportunity">
        <p>
          The Observer US is an equal-opportunity organization. We evaluate every applicant without
          regard to race, color, religion, sex, sexual orientation, gender identity, national origin,
          age, disability, or any other protected status.
        </p>
      </LegalSection>

      <LegalSection title="Internships &amp; Contributions">
        <p>
          We occasionally host contributors and interns. Students and early-career journalists
          interested in AI-assisted newsrooms are encouraged to reach out at{' '}
          <a
            href="mailto:careers@theobserverus.com"
            className="text-[var(--color-accent)] hover:underline"
          >
            careers@theobserverus.com
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  )
}
