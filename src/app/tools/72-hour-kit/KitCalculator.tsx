/* ============================================================
   The Observer US — 72-Hour Emergency Kit Calculator
   Client component: household size + days → water, food and
   checklist. Numbers follow official guidance:
   - Water: 1 gallon per person per day (Ready.gov / CDC / Red
     Cross, drinking + sanitation). EU guidance is 2–3 litres.
   - Food: ~2,000 calories per person per day, 3 meals a day.
   - Pets: 1 gallon per pet per day.
   Checklist state persists in localStorage; print via window.print().
   ============================================================ */

'use client'

import { useEffect, useMemo, useState } from 'react'

const GALLON_TO_LITRES = 3.785
const CALORIES_PER_PERSON_PER_DAY = 2000
const STORAGE_KEY = 'observer-72h-kit-checked'

type ChecklistGroup = {
  title: string
  note?: string
  items: string[]
}

const CHECKLIST: ChecklistGroup[] = [
  {
    title: 'Water & food',
    note: 'Quantities are calculated above for your household.',
    items: [
      'Water — the amount calculated above, in food-grade containers',
      'Non-perishable food — the meals calculated above, foods you already eat',
      'Manual can opener',
      'Pet food and water, if you have pets',
    ],
  },
  {
    title: 'Light & power',
    items: [
      'Flashlight (a headlamp keeps your hands free)',
      'Extra batteries — and check them every 6 months',
      'Portable phone charger / power bank, kept charged',
      'Candles and matches or a lighter',
    ],
  },
  {
    title: 'Communication & alerts',
    items: [
      'Battery-powered or hand-crank radio',
      'NOAA weather radio (US) for official alerts',
      'Whistle — to signal for help',
      'Paper local maps (phones die; maps do not)',
    ],
  },
  {
    title: 'Health & first aid',
    items: [
      'First aid kit',
      'Prescription medicines — at least a 3-day supply, ideally 7 days',
      'Extra glasses or contact lenses',
      'Dust mask',
      'Moist towelettes, garbage bags and ties (sanitation)',
    ],
  },
  {
    title: 'Documents & cash',
    note: 'Governments across Europe now advise this explicitly: cards stop working when the power and networks do.',
    items: [
      'Cash in small bills',
      'Copies of ID, insurance and medical records in a waterproof container',
      'Emergency contacts list on paper',
      'Wrench or pliers — to turn off utilities if instructed',
    ],
  },
  {
    title: 'Comfort & shelter',
    items: [
      'Sleeping bag or warm blanket per person',
      'Change of clothes and rain gear',
      'Books, cards or games',
      'Infant supplies — formula, diapers, wipes — if needed',
      'Feminine supplies',
    ],
  },
]

const ALL_ITEMS = CHECKLIST.flatMap((g) => g.items)
const TOTAL_ITEMS = ALL_ITEMS.length

function Stepper({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  onChange: (v: number) => void
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[var(--color-text-primary)]">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          onClick={() => onChange(Math.max(min, value - 1))}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--color-border)] text-lg font-bold text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-surface-hover)]"
        >
          −
        </button>
        <span className="w-10 text-center text-2xl font-bold tabular-nums">{value}</span>
        <button
          type="button"
          aria-label={`Increase ${label}`}
          onClick={() => onChange(Math.min(max, value + 1))}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--color-border)] text-lg font-bold text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-surface-hover)]"
        >
          +
        </button>
      </div>
    </div>
  )
}

export function KitCalculator() {
  const [people, setPeople] = useState(4)
  const [days, setDays] = useState(3)
  const [pets, setPets] = useState(0)
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setChecked(JSON.parse(saved) as Record<string, boolean>)
    } catch {
      // localStorage unavailable — checklist just won't persist.
    }
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checked))
    } catch {
      // Ignore persistence failures.
    }
  }, [checked, loaded])

  const waterGallons = useMemo(() => (people + pets) * days * 1, [people, pets, days])
  const waterLitres = useMemo(() => Math.round(waterGallons * GALLON_TO_LITRES * 10) / 10, [waterGallons])
  const meals = useMemo(() => people * days * 3, [people, days])
  const calories = useMemo(() => people * days * CALORIES_PER_PERSON_PER_DAY, [people, days])

  const checkedCount = useMemo(
    () => ALL_ITEMS.filter((item) => checked[item]).length,
    [checked]
  )
  const progress = Math.round((checkedCount / TOTAL_ITEMS) * 100)

  const toggle = (item: string) =>
    setChecked((prev) => ({ ...prev, [item]: !prev[item] }))

  return (
    <div>
      {/* Calculator */}
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-6">
        <div className="grid gap-6 sm:grid-cols-3">
          <Stepper label="People in your household" value={people} min={1} max={12} onChange={setPeople} />
          <Stepper label="Pets" value={pets} min={0} max={4} onChange={setPets} />
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-text-primary)]">
              Days to cover
            </label>
            <div className="flex flex-wrap gap-2">
              {[3, 7, 10, 14].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDays(d)}
                  aria-pressed={days === d}
                  className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${
                    days === d
                      ? 'border-[var(--color-brand)] bg-[var(--color-brand)] text-[var(--color-text-on-brand)]'
                      : 'border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)]'
                  }`}
                >
                  {d} days
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-[var(--color-text-tertiary)]">
              3 days is the 72-hour standard. 7 days is Sweden&apos;s guidance, 10 days
              Germany&apos;s, 14 days the Red Cross at-home recommendation.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-[var(--color-surface)] p-5 text-center">
            <p className="text-3xl font-bold tabular-nums text-[var(--color-text-primary)]">
              {waterGallons} gal
            </p>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              water ({waterLitres} litres)
            </p>
            <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">
              1 gallon per person and pet, per day
            </p>
          </div>
          <div className="rounded-lg bg-[var(--color-surface)] p-5 text-center">
            <p className="text-3xl font-bold tabular-nums text-[var(--color-text-primary)]">
              {meals} meals
            </p>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              {calories.toLocaleString('en-US')} calories total
            </p>
            <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">
              3 meals a day, ~2,000 calories per person
            </p>
          </div>
          <div className="rounded-lg bg-[var(--color-surface)] p-5 text-center">
            <p className="text-3xl font-bold tabular-nums text-[var(--color-text-primary)]">
              {days * 24} hrs
            </p>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              of self-sufficiency
            </p>
            <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">
              Rotate stored water and food every 6 months
            </p>
          </div>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-[var(--color-text-tertiary)]">
          In very hot weather, water needs can double (Ready.gov). Children, nursing mothers
          and anyone who is ill may need more. Store water in food-grade containers, and keep
          food you already eat — so you rotate it instead of throwing it away.
        </p>
      </div>

      {/* Checklist */}
      <div className="mt-10">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-bold tracking-tight">Your 72-hour kit checklist</h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-lg bg-[var(--color-brand)] px-4 py-2 text-sm font-semibold text-[var(--color-text-on-brand)] transition-colors hover:bg-[var(--color-brand-hover)]"
            >
              Print checklist
            </button>
            <button
              type="button"
              onClick={() => setChecked({})}
              className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-surface-hover)]"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="mb-2 flex justify-between text-sm text-[var(--color-text-secondary)]">
            <span>
              {checkedCount} of {TOTAL_ITEMS} packed
            </span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[var(--color-surface-alt)]">
            <div
              className="h-full rounded-full bg-[var(--color-brand)] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-[var(--color-text-tertiary)]">
            Your ticks are saved in this browser, so you can come back and finish the kit later.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {CHECKLIST.map((group) => (
            <section
              key={group.title}
              className="rounded-lg border border-[var(--color-border)] p-5"
            >
              <h3 className="mb-1 text-base font-bold">{group.title}</h3>
              {group.note && (
                <p className="mb-3 text-xs leading-relaxed text-[var(--color-text-tertiary)]">
                  {group.note}
                </p>
              )}
              <ul className="space-y-2.5">
                {group.items.map((item) => (
                  <li key={item}>
                    <label className="flex cursor-pointer items-start gap-2.5 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                      <input
                        type="checkbox"
                        checked={!!checked[item]}
                        onChange={() => toggle(item)}
                        className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-brand)]"
                      />
                      <span className={checked[item] ? 'line-through opacity-60' : ''}>
                        {item}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
