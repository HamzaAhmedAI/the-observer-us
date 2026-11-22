/* ============================================================
   The Observer US — Food Storage Planner
   Client component: household size + days → water, food
   (pounds), calories and meals, plus the shopping checklist.
   Numbers follow official guidance:
   - Water: 1 gallon per person per day (Ready.gov / CDC / Red
     Cross, drinking + sanitation). Pets count the same.
   - Food: 1.5 lb of dry staples per person per day — a planning
     estimate from Utah State University Extension's one-year
     basic supply (about 400 lb grains, 60 lb dry beans, 60 lb
     sugar, 16 lb powdered milk, 10 qt oil, 8 lb salt per adult
     per year ≈ 544 lb ≈ 1.5 lb a day). Canned food is mostly
     water, so it weighs more per calorie — the pounds figure
     counts dry staples only.
   - Calories: ~2,000 per person per day (FDA general guide).
   Checklist state persists in localStorage; print via window.print().
   ============================================================ */

'use client'

import { useEffect, useMemo, useState } from 'react'

const GALLON_TO_LITRES = 3.785
const CALORIES_PER_PERSON_PER_DAY = 2000
const POUNDS_PER_PERSON_PER_DAY = 1.5
const STORAGE_KEY = 'observer-food-storage-checked'

type ChecklistGroup = {
  title: string
  note?: string
  items: string[]
}

const CHECKLIST: ChecklistGroup[] = [
  {
    title: 'Water',
    note: 'Quantities are calculated above for your household.',
    items: [
      'Water — the amount calculated above, in food-grade containers',
      'Replace water you stored yourself every 6 months; check bottled water expiry dates',
      'Store water at 50–70°F, away from sunlight and away from gasoline or pesticides',
      'Label each container “drinking water” with the date you filled it',
    ],
  },
  {
    title: 'No-cook food first',
    note: 'Buy this layer first — food that needs no refrigeration, no water and no cooking. From Ready.gov’s list.',
    items: [
      'Ready-to-eat canned meats, fruits and vegetables',
      'Protein or fruit bars',
      'Dry cereal or granola',
      'Peanut butter and dried fruit',
      'Canned juices and non-perishable pasteurized milk',
      'Comfort and stress foods — the small things that make a bad week bearable',
      'Manual can opener — an electric one is useless in an outage',
    ],
  },
  {
    title: 'Bulk staples',
    note: 'The deep layer, from Utah State University Extension’s one-year basic supply. Cheap per calorie, but needs water and heat to cook.',
    items: [
      'White rice, dry pasta and oats',
      'Dry beans, peas and lentils',
      'Flour and cooking oil',
      'Sugar or honey, salt and powdered milk',
      'Food for infants and anyone with special dietary needs',
    ],
  },
  {
    title: 'Health, pets & the rest',
    items: [
      'Prescription medicines — at least a 7-day supply (Red Cross)',
      'Pet food and extra water for your pets',
      'Infant formula and diapers, if needed',
    ],
  },
  {
    title: 'Store it right, rotate it',
    note: 'A stockpile you never check is a guess, not a supply.',
    items: [
      'Keep food in a cool, dry place, off the floor and out of sunlight',
      'Use tightly closed plastic or metal containers to keep pests out',
      'Date everything and use the oldest first',
      'Check the whole stockpile every 6 months — spring and autumn',
      'Throw out any can that is dented, bulging or rusted',
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

export function FoodStorageCalculator() {
  const [people, setPeople] = useState(4)
  const [days, setDays] = useState(14)
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
  const foodPounds = useMemo(
    () => Math.round(people * days * POUNDS_PER_PERSON_PER_DAY * 10) / 10,
    [people, days]
  )
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
              Days to plan for
            </label>
            <div className="flex flex-wrap gap-2">
              {[3, 7, 14, 30].map((d) => (
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
              3 days is the minimum for evacuation. 14 days is the target at home. 30 days is
              a full month of cover.
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
              {foodPounds} lb
            </p>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              dry staples ({meals} meals)
            </p>
            <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">
              1.5 lb per person per day — planning estimate, see below
            </p>
          </div>
          <div className="rounded-lg bg-[var(--color-surface)] p-5 text-center">
            <p className="text-3xl font-bold tabular-nums text-[var(--color-text-primary)]">
              {calories.toLocaleString('en-US')}
            </p>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">calories total</p>
            <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">
              ~2,000 calories per person per day
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-lg bg-[var(--color-surface)] p-5">
          <h3 className="mb-2 text-sm font-bold text-[var(--color-text-primary)]">Your math</h3>
          <ul className="space-y-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">
            <li className="tabular-nums">
              Water: ({people} {people === 1 ? 'person' : 'people'} + {pets}{' '}
              {pets === 1 ? 'pet' : 'pets'}) × {days} days × 1 gallon = {waterGallons} gallons
            </li>
            <li className="tabular-nums">
              Food: {people} {people === 1 ? 'person' : 'people'} × {days} days × 1.5 lb ={' '}
              {foodPounds} lb of dry staples
            </li>
            <li className="tabular-nums">
              Calories: {people} {people === 1 ? 'person' : 'people'} × {days} days × 2,000 ={' '}
              {calories.toLocaleString('en-US')}
            </li>
          </ul>
          <p className="mt-3 text-xs leading-relaxed text-[var(--color-text-tertiary)]">
            The pounds figure counts dry staples — rice, beans, oats, pasta, flour. Canned food
            is mostly water, so it weighs more per calorie: add its weight on top of this
            number, don&apos;t swap it in. In very hot weather, water needs can double
            (Ready.gov). Children, nursing mothers and anyone who is ill may need more.
          </p>
        </div>
      </div>

      {/* Checklist */}
      <div className="mt-10">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-bold tracking-tight">Your food storage checklist</h2>
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
              {checkedCount} of {TOTAL_ITEMS} stored
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
            Your ticks are saved in this browser, so you can come back and finish the shopping later.
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
