/* ============================================================
   The Observer US — About Us
   ============================================================ */

import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPage, LegalSection } from '@/components/reader/LegalPage'
import { NAV_CATEGORIES } from '@/lib/nav'
import { SITE_NAME } from '@/lib/seo'

export const metadata: Metadata = {
  title: `About Us — ${SITE_NAME}`,
  description:
    'The Observer US is an independent, AI-assisted newsroom covering Home & Wallet Protection: US home costs, bills and insurance, household recalls, home scams, data breaches, and off-grid preparedness — what happened, who is affected, and what to do next.',
  alternates: { canonical: '/about' },
  robots: { index: true, follow: true },
}

export const revalidate = 86400

export default function AboutPage() {
  return (
    <LegalPage
      title="About Us"
      intro="The Observer US is an independent digital news publication built for US homeowners and households who want practical, clearly-sourced protection for their home and their wallet — not general news noise."
      lastUpdated="August 21, 2026"
    >
      <LegalSection title="Our Mission">
        <p>
          We exist to help US households protect what they own and what they earn. Our mission
          is to turn home costs, bills, recalls, scams, breaches, and off-grid preparedness into
          clear action: what happened, who is affected, and what to do next — with the official
          source linked, every time. No paywalls blocking the public from information that
          protects them.
        </p>
      </LegalSection>

      <LegalSection title="How We Work: AI-Assisted, Editor-Approved">
        <p>
          The Observer US uses an AI-assisted reporting pipeline to gather, summarize, and draft
          stories from public sources. We are transparent about this:{' '}
          <strong className="text-[var(--color-text-primary)]">
            automated drafts are never published without human editorial review.
          </strong>
        </p>
        <p>Every published article passes through the same editorial standard:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Stories are sourced from reputable public feeds and primary documents.</li>
          <li>A human editor reviews each draft for accuracy, fairness, and clarity before publication.</li>
          <li>Corrections are made promptly and noted on the article where relevant.</li>
        </ul>
        <p>
          AI helps us cover more, faster. Human judgment keeps us accountable. The combination is
          our newsroom model.
        </p>
      </LegalSection>

      <LegalSection title="What We Cover">
        <p>We cover one thing, properly — Home &amp; Wallet Protection:</p>
        <ul className="list-disc space-y-2 pl-6">
          {NAV_CATEGORIES.map((cat) => (
            <li key={cat.slug}>
              <Link href={cat.href} className="text-[var(--color-accent)] hover:underline">
                {cat.label}
              </Link>{' '}
              — {cat.description}
            </li>
          ))}
        </ul>
        <p>
          We do not publish general politics, world, sports, or entertainment news. Every story
          must answer a household question: does this cost me money, put my home at risk, or
          require me to act — and by when?
        </p>
      </LegalSection>

      <LegalSection title="Editorial Independence">
        <p>
          Our reporting is independent. We separate news from opinion, label analysis clearly, and
          do not accept payment to influence coverage. Advertising, where present, is clearly
          distinguished from editorial content.
        </p>
      </LegalSection>

      <LegalSection title="Leadership">
        <p>
          <strong className="text-[var(--color-text-primary)]">Hamza Ahmed</strong> — Founder &amp;
          Editor-in-Chief. Hamza sets the newsroom&apos;s editorial direction, reviews stories
          before publication, and oversees the site&apos;s AI-assisted reporting pipeline. Read his
          full profile and published work on the{' '}
          <Link href="/author/hamza-ahmed" className="text-[var(--color-accent)] hover:underline">
            author page
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="Get In Touch">
        <p>
          Questions, tips, or corrections? Reach the newsroom at{' '}
          <a
            href="mailto:newsroom@theobserverus.com"
            className="text-[var(--color-accent)] hover:underline"
          >
            newsroom@theobserverus.com
          </a>{' '}
          or visit our{' '}
          <Link href="/contact" className="text-[var(--color-accent)] hover:underline">
            Contact page
          </Link>
          .
        </p>
      </LegalSection>
    </LegalPage>
  )
}
