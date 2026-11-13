/* ============================================================
   The Observer US — 72-Hour Emergency Kit Calculator
   First tool in the long-term plan's tools/calculators lane
   (~25% of content) and the anchor page for the Off-Grid Life
   category. Quantities follow Ready.gov / CDC / Red Cross
   (US) with EU 72-hour guidance noted.
   ============================================================ */

import type { Metadata } from 'next'
import Link from 'next/link'
import { KitCalculator } from './KitCalculator'
import { SITE_NAME, SITE_URL } from '@/lib/seo'

export const metadata: Metadata = {
  title: '72-Hour Emergency Kit Calculator — How Much Water and Food to Store',
  description:
    'Work out exactly how much water and food your household needs for 72 hours — or 7, 10 or 14 days — from official guidance, then tick off the full kit checklist: radio, batteries, cash, documents and more.',
  alternates: { canonical: '/tools/72-hour-kit' },
  openGraph: {
    title: '72-Hour Emergency Kit Calculator',
    description:
      'How much water and food does your household need for 72 hours? Calculate it in seconds, then tick off the full kit checklist.',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export const revalidate = 86400

const FAQ = [
  {
    q: 'How much water do I need for 72 hours?',
    a: 'One gallon (3.8 litres) per person per day, for drinking and basic sanitation — so 3 gallons per person for three days, 12 gallons for a family of four. That is the Ready.gov, CDC and American Red Cross figure. In very hot weather, needs can double.',
  },
  {
    q: 'How much food should I store for 72 hours?',
    a: 'At least a three-day supply of non-perishable food per person — about 9 meals and roughly 2,000 calories a day. Choose foods your household already eats that need no refrigeration and little or no cooking: canned meals, peanut butter, crackers, granola bars, dried fruit and nuts.',
  },
  {
    q: 'Why do governments tell citizens to keep cash and a radio?',
    a: 'In March 2025 the European Commission asked households in all 27 member states to manage alone for at least 72 hours, listing cash, a battery radio, a flashlight and documents among the essentials. Cards and phones stop working when power and networks fail; cash and a radio do not.',
  },
  {
    q: 'How often should I rotate my emergency supplies?',
    a: 'Every six months. Commercially bottled water keeps longest; water you store yourself should be replaced every six months, and food should be eaten and replaced as part of your normal shopping — which is why the list sticks to foods you already eat.',
  },
  {
    q: 'Is 72 hours enough?',
    a: 'Three days is the minimum almost every government uses — the EU, Finland, the Netherlands and the US all start there. Sweden advises one week, Germany up to ten days, and the Red Cross suggests two weeks at home once the basics are covered. Use the calculator above to size any of those.',
  },
]

export default function EmergencyKitPage() {
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
        <span className="text-[var(--color-text-secondary)]">72-Hour Emergency Kit</span>
      </nav>

      <header className="mb-8 max-w-3xl">
        <p className="mb-2 text-sm font-bold uppercase tracking-wider text-[var(--color-off-grid-life)]">
          Off-Grid Life · Tool
        </p>
        <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
          72-Hour Emergency Kit Calculator
        </h1>
        <p className="text-lg leading-relaxed text-[var(--color-text-secondary)]">
          Governments on both sides of the Atlantic now tell households the same thing: keep
          enough food, water, cash and light to manage alone for at least three days. This
          calculator turns that advice into exact numbers for your household — then gives you
          the full checklist to pack it.
        </p>
      </header>

      <KitCalculator />

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
              href="https://www.ready.gov/kit"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-text-link)] hover:underline"
            >
              Ready.gov (FEMA) — Build a Kit
            </a>
          </li>
          <li className="text-[var(--color-text-secondary)]">
            CDC — water storage guidance: 1 gallon per person per day, 3-day minimum, 2-week
            supply if possible.
          </li>
          <li className="text-[var(--color-text-secondary)]">
            European Commission — Preparedness Union Strategy (March 2025): households
            self-sufficient for at least 72 hours.
          </li>
          <li className="text-[var(--color-text-secondary)]">
            Sweden (one week), Germany&apos;s BBK (up to ten days), Finland (72 hours) and the
            American Red Cross (two weeks at home) — national guidance summarized above.
          </li>
        </ul>
        <p className="mt-4 text-xs leading-relaxed text-[var(--color-text-tertiary)]">
          Last reviewed: November 13, 2026. Guidance changes — if an official link has moved,
          use the official source, not a copy of it. This tool gives general information, not
          professional emergency advice.
        </p>
      </section>
    </div>
  )
}
