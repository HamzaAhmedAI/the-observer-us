/* ============================================================
   The Observer US — Food Storage Planner
   Second tool in the long-term plan's tools/calculators lane,
   after the 72-hour kit. Quantities follow Ready.gov / CDC /
   Red Cross (US) with the food-pounds rule from Utah State
   University Extension's one-year basic supply.
   ============================================================ */

import type { Metadata } from 'next'
import Link from 'next/link'
import { FoodStorageCalculator } from './FoodStorageCalculator'
import { SITE_NAME, SITE_URL } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Food Storage Planner — How Much Food and Water to Store at Home',
  description:
    'Work out exactly how much water, food and calories your household needs for 3, 7, 14 or 30 days — from Ready.gov, CDC and Utah State University Extension guidance — then tick off the shopping checklist.',
  alternates: { canonical: '/tools/food-storage-planner' },
  openGraph: {
    title: 'Food Storage Planner',
    description:
      'How much food and water does your household need for two weeks — or a month? Calculate it in seconds, then tick off the shopping checklist.',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export const revalidate = 86400

const FAQ = [
  {
    q: 'How much water should I store per person?',
    a: 'One gallon (3.8 litres) per person per day, for drinking and sanitation — so 3 gallons per person for three days and 14 gallons for two weeks at home. That is the Ready.gov, CDC and American Red Cross figure. In very hot weather, needs can double, and pets need their own water on top of yours.',
  },
  {
    q: 'How many pounds of food should I store per person?',
    a: 'Plan on about 1.5 lb of dry staples per person per day. That is a planning estimate from Utah State University Extension’s one-year basic supply: about 400 lb of grains, 60 lb of dry beans, 60 lb of sugar, 16 lb of powdered milk, 10 quarts of oil and 8 lb of salt per adult per year — roughly 544 lb a year, or about 1.5 lb a day. Canned food is mostly water, so it weighs more per calorie; the pounds figure counts dry staples only.',
  },
  {
    q: 'What food should I buy first?',
    a: 'The no-cook layer first: food that needs no refrigeration, no water and no cooking — ready-to-eat canned meats, fruits and vegetables, protein bars, dry cereal, peanut butter, dried fruit, canned juices and non-perishable milk, plus a manual can opener. That is Ready.gov’s list. Bulk staples like rice, beans and oats come second: they are cheap per calorie, but they need water and heat to cook, so add them only after your water supply is set.',
  },
  {
    q: 'How long does stored food keep?',
    a: 'Check it every six months and use the oldest first. Utah State University Extension gives these storage times at 70°F: canned beef about 30 months, canned vegetables and fruit about 24 months, white rice and dry pasta about 2 years, dry beans about 12 months. Replace stored water every six months, and throw out any can that is dented, bulging or rusted.',
  },
  {
    q: 'Where should I store food and water?',
    a: 'In a cool, dry place at 50–70°F, away from direct sunlight and off the floor — and away from gasoline, pesticides and other toxic substances. Use FDA-approved food-grade containers for water you store yourself, label each one “drinking water” with the date, and keep food in tightly closed plastic or metal containers to keep pests out.',
  },
  {
    q: 'How much does a two-week supply cost?',
    a: 'There is no single number — it depends on what your household eats. The honest way to build it is a little at a time on normal grocery trips: buy what you already eat, so you rotate it instead of throwing it away. Start with three days, then extend to two weeks. Most of a two-week supply is food that would be in your cupboard anyway.',
  },
  {
    q: 'Do I need to store food and water for pets?',
    a: 'Yes. Ready.gov and the Red Cross both list pet food and extra water for your pet as part of the kit. This planner counts each pet at the same 1 gallon of water per day as a person — add pet food to the checklist separately, sized to what your pet eats.',
  },
]

export default function FoodStoragePlannerPage() {
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
        <span className="text-[var(--color-text-secondary)]">Food Storage Planner</span>
      </nav>

      <header className="mb-8 max-w-3xl">
        <p className="mb-2 text-sm font-bold uppercase tracking-wider text-[var(--color-off-grid-life)]">
          Off-Grid Life · Tool
        </p>
        <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
          Food Storage Planner
        </h1>
        <p className="text-lg leading-relaxed text-[var(--color-text-secondary)]">
          One gallon of water per person per day, three days minimum and two weeks at home —
          that is the number Ready.gov, the Red Cross and the CDC all use. This planner turns
          it into exact numbers for your household: gallons of water, pounds of food, total
          calories — then the shopping list to build it, a little at a time.
        </p>
      </header>

      <FoodStorageCalculator />

      <section className="mt-12 max-w-3xl">
        <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
          The full guide behind these numbers is{' '}
          <Link
            href="/off-grid-life/how-much-food-and-water-to-store-at-home"
            className="text-[var(--color-text-link)] hover:underline"
          >
            How Much Food and Water to Store at Home
          </Link>
          . If you want the whole emergency kit — water, food, first aid and the rest, sized
          to your household — the{' '}
          <Link href="/tools/72-hour-kit" className="text-[var(--color-text-link)] hover:underline">
            72-hour kit calculator
          </Link>{' '}
          builds it in about a minute.
        </p>
      </section>

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
          <li>
            <a
              href="https://www.ready.gov/food"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-text-link)] hover:underline"
            >
              Ready.gov (FEMA) — Food
            </a>
          </li>
          <li>
            <a
              href="https://www.redcross.org/get-help/how-to-prepare-for-emergencies/survival-kit-supplies.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-text-link)] hover:underline"
            >
              American Red Cross — Survival Kit Supplies
            </a>
          </li>
          <li>
            <a
              href="https://www.cdc.gov/water-emergency/about/how-to-create-and-store-an-emergency-water-supply.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-text-link)] hover:underline"
            >
              CDC — How to Create an Emergency Water Supply
            </a>
          </li>
          <li>
            <a
              href="https://www.fda.gov/food/nutrition-facts-label/how-understand-and-use-nutrition-facts-label"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-text-link)] hover:underline"
            >
              FDA — How to Understand and Use the Nutrition Facts Label (2,000 calories a day)
            </a>
          </li>
          <li>
            <a
              href="https://ucanr.edu/sites/default/files/2020-03/322172.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-text-link)] hover:underline"
            >
              Utah State University Extension — Emergency Food Storage (PDF, FN/preservation/2013-01pr)
            </a>
          </li>
          <li>
            <a
              href="https://extension.usu.edu/news_sections/home_family_and_food/portable-food-storage"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-text-link)] hover:underline"
            >
              Utah State University Extension — Six Tips for Portable Emergency Food Storage
            </a>
          </li>
        </ul>
        <p className="mt-4 text-xs leading-relaxed text-[var(--color-text-tertiary)]">
          The 1.5 lb of dry staples per person per day is a planning estimate, not an official
          standard: it is Utah State University Extension&apos;s one-year basic supply
          (about 544 lb of dry food per adult per year) divided by 365. Last reviewed:
          November 23, 2026. Guidance changes — if an official link has moved, use the
          official source, not a copy of it. This tool gives general information, not
          professional emergency or nutrition advice.
        </p>
      </section>
    </div>
  )
}
