/* ============================================================
   The Observer US — Tools Index
   The long-term plan's tools/calculators lane (~25% of
   content). One tool at launch; more are added here as
   they ship (insurance cost, food storage, outage prep).
   ============================================================ */

import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_NAME } from '@/lib/seo'

export const metadata: Metadata = {
  title: `Tools & Calculators — ${SITE_NAME}`,
  description:
    'Practical tools for protecting your home and wallet: work out what your household needs, what it costs, and what to do next — with official sources behind every number.',
  alternates: { canonical: '/tools' },
  robots: { index: true, follow: true },
}

export const revalidate = 86400

const TOOLS = [
  {
    href: '/tools/72-hour-kit',
    title: '72-Hour Emergency Kit Calculator',
    category: 'Off-Grid Life',
    description:
      'How much water and food does your household need for 72 hours — or 7, 10 or 14 days? Calculate it in seconds, then tick off the full kit checklist: radio, batteries, cash, documents and more.',
  },
]

export default function ToolsPage() {
  return (
    <div className="container-news py-8 md:py-12">
      <header className="mb-8 max-w-3xl">
        <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
          Tools &amp; Calculators
        </h1>
        <p className="text-lg leading-relaxed text-[var(--color-text-secondary)]">
          Numbers, not guesses. Every tool on this page is built from official guidance and
          shows its sources — so you can check the math yourself.
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2">
        {TOOLS.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group rounded-lg border border-[var(--color-border)] p-6 no-underline transition-colors hover:border-[var(--color-accent)]"
          >
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--color-off-grid-life)]">
              {tool.category}
            </p>
            <h2 className="mb-2 text-xl font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] group-hover:underline">
              {tool.title}
            </h2>
            <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
              {tool.description}
            </p>
          </Link>
        ))}
      </div>

      <p className="mt-8 text-sm text-[var(--color-text-tertiary)]">
        More tools are coming — a home insurance cost calculator and a food-storage planner
        are next in the plan.
      </p>
    </div>
  )
}
