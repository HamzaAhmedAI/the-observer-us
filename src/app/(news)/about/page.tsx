/* ============================================================
   The Observer US — About Us
   ============================================================ */

import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPage, LegalSection } from '@/components/reader/LegalPage'
import { SITE_NAME } from '@/lib/seo'

export const metadata: Metadata = {
  title: `About Us — ${SITE_NAME}`,
  description:
    'The Observer US is an independent, AI-assisted newsroom delivering breaking news and analysis across US politics, technology, business, and more.',
  alternates: { canonical: '/about' },
  robots: { index: true, follow: true },
}

export const revalidate = 86400

export default function AboutPage() {
  return (
    <LegalPage
      title="About Us"
      intro="The Observer US is an independent digital news publication built for readers who want fast, accurate, and clearly-sourced coverage of the stories shaping the United States and the world."
      lastUpdated="August 21, 2026"
    >
      <LegalSection title="Our Mission">
        <p>
          We exist to make trustworthy news free and accessible to everyone. Our mission is to
          deliver breaking stories and in-depth analysis with speed, clarity, and editorial
          accountability — without paywalls blocking the public from information that matters.
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
        <p>We publish across the categories readers care about most:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <Link href="/politics" className="text-[var(--color-accent)] hover:underline">
              Politics
            </Link>{' '}
            — federal policy, elections, and government accountability.
          </li>
          <li>
            <Link href="/technology" className="text-[var(--color-accent)] hover:underline">
              Technology
            </Link>{' '}
            — AI, platforms, cybersecurity, and innovation.
          </li>
          <li>
            <Link href="/business" className="text-[var(--color-accent)] hover:underline">
              Business
            </Link>{' '}
            — markets, the economy, and industry.
          </li>
          <li>
            <Link href="/world" className="text-[var(--color-accent)] hover:underline">
              World
            </Link>{' '}
            — international affairs and global developments.
          </li>
          <li>
            <Link href="/health" className="text-[var(--color-accent)] hover:underline">
              Health
            </Link>
            ,{' '}
            <Link href="/science" className="text-[var(--color-accent)] hover:underline">
              Science
            </Link>
            ,{' '}
            <Link href="/sports" className="text-[var(--color-accent)] hover:underline">
              Sports
            </Link>
            , and{' '}
            <Link href="/entertainment" className="text-[var(--color-accent)] hover:underline">
              Entertainment
            </Link>
            .
          </li>
        </ul>
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
