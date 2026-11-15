/* ============================================================
   The Observer US — Home Insurance Cost Calculator
   Second tool in the tools/calculators lane. Estimates the
   replacement cost of a home and the annual premium range for
   a standard HO-3 policy, from published rates — Census
   rebuild costs, Quadrant/Bankrate base rate, III deductible
   guidance. An ESTIMATE, never a quote.
   ============================================================ */

import type { Metadata } from 'next'
import Link from 'next/link'
import { InsuranceCalculator } from './InsuranceCalculator'
import { SITE_NAME, SITE_URL } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Home Insurance Cost Calculator — Estimate Your Premium in 60 Seconds',
  description:
    'Estimate what home insurance should cost for your house: replacement cost, dwelling coverage, and an annual premium range — built from Census rebuild costs and published industry rates, with the math shown.',
  alternates: { canonical: '/tools/home-insurance-cost' },
  openGraph: {
    title: 'Home Insurance Cost Calculator',
    description:
      'What should home insurance cost for your house? Estimate your replacement cost and annual premium range from published rates — with the math shown.',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export const revalidate = 86400

const FAQ = [
  {
    q: 'How much does home insurance cost on average?',
    a: 'The national average was $2,948 a year at the end of 2025, projected to reach $3,057 by the end of 2026 (Insurify, March 2026). For a $300,000 dwelling policy with a $1,000 deductible, Quadrant Information Services put the average at $2,424 a year (November 2025). But the range is enormous: Florida averaged $8,292 while Vermont averaged $1,087.',
  },
  {
    q: 'Is this a quote?',
    a: 'No. This calculator estimates your premium from published national rates and the factors insurers publish or commonly use. A real quote weighs your exact address, credit-based insurance score (where allowed), fire protection class, and the insurer\'s own rating plan — only that quote is binding. Use this to know whether a quote you receive is in the right ballpark, and to compare options.',
  },
  {
    q: 'Why is the result a range instead of one number?',
    a: 'Because insurers price the same home differently. Quotes for identical coverage commonly vary by hundreds of dollars between carriers, and the rating factors for home age, roof age and construction are published as ranges, not fixed tables. The ±25% range is honest about that spread.',
  },
  {
    q: 'What is replacement cost, and why is it not my home\'s market value?',
    a: 'Replacement cost is what it would take to rebuild your house from the ground up at today\'s labor and material prices — land excluded, because land is not at risk. Market value includes the land and what buyers will pay, which has nothing to do with rebuilding. Coverage A should be set to replacement cost; set it to market value and you are either overpaying or underinsured.',
  },
  {
    q: 'How much does raising my deductible save?',
    a: 'Raising a $500 deductible to $1,000 can save up to 25% on your premium, according to the Insurance Information Institute — commonly 10–25%. Going to $2,500 saves more: Insurance.com found an average of about $512 a year on a $300,000 dwelling policy. The trade-off is real: you pay that much more out of pocket on every claim.',
  },
  {
    q: 'Does an old roof really raise my premium?',
    a: 'Yes, and it can cost you coverage, not just money. Many insurers scrutinize roofs at 10 years old, and a roof over 20 years is often covered at actual cash value only — replacement cost minus depreciation — or requires an inspection to keep coverage at all. A new roof, especially Class 4 impact-resistant shingles, can earn a discount on top of restoring full coverage.',
  },
  {
    q: 'What does home insurance not cover?',
    a: 'A standard HO-3 policy does not cover flood or earthquake damage — those are separate policies. It also excludes wear and tear, maintenance failures, and (usually) sewer backup unless you add it. Check your declarations page for the exclusions on your own policy.',
  },
]

export default function HomeInsuranceCostPage() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <div className="container-news py-8 md:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <nav className="mb-6 text-sm text-[var(--color-text-tertiary)]" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-[var(--color-text-primary)]">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/tools" className="hover:text-[var(--color-text-primary)]">
          Tools
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--color-text-secondary)]">Home Insurance Cost</span>
      </nav>

      <header className="mb-8 max-w-3xl">
        <p className="mb-2 text-sm font-bold uppercase tracking-wider text-[var(--color-bills-insurance)]">
          Bills &amp; Insurance · Tool
        </p>
        <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
          Home Insurance Cost Calculator
        </h1>
        <p className="text-lg leading-relaxed text-[var(--color-text-secondary)]">
          Most homeowners have no idea whether their premium is fair — because the number that
          matters, the cost to rebuild your house, is never on the quote. This calculator works
          it out from published rebuild costs, then estimates the annual premium range a
          standard policy should cost, with every factor shown. It is an estimate, not a
          quote — and that honesty is the point.
        </p>
      </header>

      <InsuranceCalculator />

      <section className="mt-12 max-w-3xl">
        <h2 className="mb-4 text-2xl font-bold tracking-tight">Frequently asked questions</h2>
        <div className="space-y-6">
          {FAQ.map((f) => (
            <div key={f.q}>
              <h3 className="mb-1 text-base font-bold">{f.q}</h3>
              <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        aria-label="Sources"
        className="mt-10 max-w-3xl rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-6"
      >
        <h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-[var(--color-text-tertiary)]">
          Sources
        </h2>
        <ul className="space-y-1.5 text-sm">
          <li>
            <a
              href="https://insurify.com/homeowners-insurance/report/home-insurance-price-projections/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-text-link)] hover:underline"
            >
              Insurify — Home Insurance Price Projections (March 2026)
            </a>
            <span className="text-[var(--color-text-secondary)]">
              {' '}
              — national average $2,948/year (end of 2025), projected $3,057 (end of 2026);
              Florida $8,292, Vermont $1,087.
            </span>
          </li>
          <li className="text-[var(--color-text-secondary)]">
            Quadrant Information Services via Bankrate (November 2025) — $2,424/year for
            $300,000 dwelling coverage with a $1,000 deductible; the base rate this calculator
            uses ($8.08 per $1,000 of dwelling coverage).
          </li>
          <li className="text-[var(--color-text-secondary)]">
            U.S. Census Bureau, Characteristics of New Housing (2025) — median contract price
            per square foot for new contractor-built single-family houses, land excluded:
            Northeast $179, Midwest $194, South $157, West $177; national median $172.
          </li>
          <li className="text-[var(--color-text-secondary)]">
            National Association of Home Builders, Cost of Constructing a Home (2024) — average
            construction cost about $162 per square foot.
          </li>
          <li className="text-[var(--color-text-secondary)]">
            Insurance Information Institute — raising a $500 deductible to $1,000 saves up to
            25% on your premium; Coverage B usually 10% of Coverage A, Coverage C usually
            50–70%, Coverage D usually 20%.
          </li>
          <li className="text-[var(--color-text-secondary)]">
            National Association of Insurance Commissioners — HO-3 is the most common policy
            form, about 78% of owner-occupied homes; new homes may qualify for discounts,
            older homes may need updated systems.
          </li>
          <li className="text-[var(--color-text-secondary)]">
            MoneyGeek 2026 analysis and Experian — older homes averaging roughly 55–70% more
            than new builds at the same coverage; outdated-systems loadings of 15–30% commonly
            cited.
          </li>
          <li className="text-[var(--color-text-secondary)]">
            ValuePenguin / Quadrant Information Services — a single property-damage claim lifts
            the annual premium by about 9% on average; Insurance.com 2021 survey — fire
            claims average about 29%.
          </li>
          <li className="text-[var(--color-text-secondary)]">
            Alaska Division of Insurance and Wisconsin Office of the Commissioner of Insurance
            — brick and masonry homes usually cost less to insure than wood frame; Checkbook —
            frame about 8% more than masonry with good fire protection, about 20% with poor.
          </li>
        </ul>
        <p className="mt-4 text-xs leading-relaxed text-[var(--color-text-tertiary)]">
          Last reviewed: November 15, 2026. Rates change — if a source has updated its figures,
          use the source, not this page. This tool gives general information, not insurance
          advice, and is not a quote. Flood and earthquake coverage are separate policies and
          are not included in the estimate.
        </p>
      </section>
    </div>
  )
}
