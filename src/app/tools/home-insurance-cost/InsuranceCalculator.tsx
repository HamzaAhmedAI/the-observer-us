/* ============================================================
   The Observer US — Home Insurance Cost Calculator
   Client component: home details → estimated replacement cost
   (Coverage A) and an estimated annual premium RANGE.

   THE MODEL — every number is sourced, and the page says so:
   - Rebuild cost per sq ft: U.S. Census Bureau, Characteristics
     of New Housing, 2025 median contract price for new
     contractor-built single-family houses, land excluded:
     Northeast $179, Midwest $194, South $157, West $177;
     national median $172, average $198. NAHB's 2024 Cost of
     Constructing a Home survey: ~$162/sq ft.
   - Finish multipliers are planning estimates that land inside
     the published bands (standard homes $100–$200/sq ft,
     custom $200–$400/sq ft): Standard ×1.00, Upgraded ×1.35,
     Luxury ×1.80.
   - Base premium rate: $8.08 per $1,000 of dwelling coverage —
     Quadrant Information Services via Bankrate, Nov 2025:
     $2,424/year for $300,000 dwelling coverage, $1,000
     deductible. Cross-check: Insurify's March 2026 report puts
     the national average at $2,948/year (end of 2025) on a
     different dwelling base.
   - Deductible: Insurance Information Institute — raising a
     $500 deductible to $1,000 saves up to 25% (commonly
     10–25%); Insurance.com found $500 → $2,500 saves ~21%
     on a $300,000 dwelling policy. Factors: 1.00 / 0.85 / 0.78.
   - Home age: planning estimates. Published comparisons are
     wide — MoneyGeek (2026) found older homes averaging ~70%
     more than newer ones at the same coverage; Experian/
     Guardian Service put a 1980 home ~55% above a 2024 one;
     outdated-systems loadings of 15–30% are commonly cited.
     Factors used: 1.00 / 1.08 / 1.18 / 1.30.
   - Roof age: NO published standard factor exists — insurers
     scrutinize roofs at 10+ years and often move 20+ year
     roofs to actual-cash-value-only or require inspection.
     Factors used (labelled estimates): 1.00 / 1.08 / 1.18.
   - Construction: brick/masonry is cheaper to insure than
     wood frame (Alaska Division of Insurance; Wisconsin OCI;
     Checkbook: frame ~8% more than masonry with good fire
     protection, ~20% with poor). Factors: frame 1.00,
     brick/masonry 0.92, concrete/steel 0.88.
   - Claims: single-claim increases average ~5–10%
     (ValuePenguin/Quadrant ~9%; Hippo 9–20%); fire claims
     run higher (~29%, Insurance.com 2021 survey). Factors:
     none 1.00, one 1.10, two or more 1.25.
   - Coverage defaults: other structures 10% of Coverage A,
     personal property 50–70%, loss of use 20% (III / NAIC
     consumer guide; California DOI).
   - Output is a RANGE (midpoint ±25%) because quotes for
     identical coverage commonly vary by hundreds of dollars
     across carriers. This is an ESTIMATE, never a quote.
   ============================================================ */

'use client'

import { useMemo, useState } from 'react'

const BASE_RATE_PER_1K = 8.08 // $ per $1,000 of dwelling coverage (Quadrant/Bankrate, Nov 2025)
const RANGE_SPREAD = 0.25 // ±25% around the midpoint

type Region = { id: string; label: string; perSqFt: number }
const REGIONS: Region[] = [
  { id: 'northeast', label: 'Northeast', perSqFt: 179 },
  { id: 'midwest', label: 'Midwest', perSqFt: 194 },
  { id: 'south', label: 'South', perSqFt: 157 },
  { id: 'west', label: 'West', perSqFt: 177 },
]

type Option<T extends string | number> = { value: T; label: string; factor: number; note?: string }

const FINISH: Option<string>[] = [
  { value: 'standard', label: 'Standard finishes', factor: 1.0, note: 'Typical builder-grade home' },
  { value: 'upgraded', label: 'Upgraded finishes', factor: 1.35, note: 'Higher-end kitchen, baths, flooring' },
  { value: 'luxury', label: 'Luxury / custom', factor: 1.8, note: 'Custom build, premium materials' },
]

const HOME_AGE: Option<string>[] = [
  { value: 'new', label: '0–10 years', factor: 1.0 },
  { value: 'mid', label: '11–30 years', factor: 1.08 },
  { value: 'older', label: '31–60 years', factor: 1.18 },
  { value: 'old', label: 'Over 60 years', factor: 1.3 },
]

const ROOF_AGE: Option<string>[] = [
  { value: 'new', label: 'Under 10 years', factor: 1.0 },
  { value: 'mid', label: '10–20 years', factor: 1.08 },
  { value: 'old', label: 'Over 20 years', factor: 1.18 },
]

const CONSTRUCTION: Option<string>[] = [
  { value: 'frame', label: 'Wood frame', factor: 1.0 },
  { value: 'masonry', label: 'Brick or masonry', factor: 0.92 },
  { value: 'concrete', label: 'Concrete or steel', factor: 0.88 },
]

const DEDUCTIBLE: Option<number>[] = [
  { value: 500, label: '$500', factor: 1.0 },
  { value: 1000, label: '$1,000', factor: 0.85 },
  { value: 2500, label: '$2,500', factor: 0.78 },
]

const PERSONAL_PROPERTY: Option<number>[] = [
  { value: 50, label: '50% of dwelling', factor: 1 },
  { value: 70, label: '70% of dwelling', factor: 1 },
]

const LIABILITY: Option<number>[] = [
  { value: 100000, label: '$100,000', factor: 1 },
  { value: 300000, label: '$300,000', factor: 1 },
  { value: 500000, label: '$500,000', factor: 1 },
]

const CLAIMS: Option<string>[] = [
  { value: 'none', label: 'No claims in 5 years', factor: 1.0 },
  { value: 'one', label: 'One claim', factor: 1.1 },
  { value: 'two', label: 'Two or more claims', factor: 1.25 },
]

const fmt = (n: number) => '$' + Math.round(n).toLocaleString('en-US')

function ButtonGroup<T extends string | number>({
  label,
  hint,
  options,
  value,
  onChange,
  formatLabel,
}: {
  label: string
  hint?: string
  options: Option<T>[]
  value: T
  onChange: (v: T) => void
  formatLabel?: (o: Option<T>) => string
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[var(--color-text-primary)]">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={String(o.value)}
            type="button"
            onClick={() => onChange(o.value)}
            aria-pressed={value === o.value}
            className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${
              value === o.value
                ? 'border-[var(--color-brand)] bg-[var(--color-brand)] text-[var(--color-text-on-brand)]'
                : 'border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)]'
            }`}
          >
            {formatLabel ? formatLabel(o) : o.label}
          </button>
        ))}
      </div>
      {hint && (
        <p className="mt-2 text-xs text-[var(--color-text-tertiary)]">{hint}</p>
      )}
    </div>
  )
}

export function InsuranceCalculator() {
  const [sqft, setSqft] = useState(2000)
  const [regionId, setRegionId] = useState('south')
  const [finish, setFinish] = useState('standard')
  const [homeAge, setHomeAge] = useState('mid')
  const [roofAge, setRoofAge] = useState('new')
  const [construction, setConstruction] = useState('frame')
  const [deductible, setDeductible] = useState(1000)
  const [personalPropertyPct, setPersonalPropertyPct] = useState(50)
  const [liability, setLiability] = useState(300000)
  const [claims, setClaims] = useState('none')

  const region = REGIONS.find((r) => r.id === regionId) ?? REGIONS[2]
  const finishOpt = FINISH.find((f) => f.value === finish) ?? FINISH[0]
  const homeAgeOpt = HOME_AGE.find((f) => f.value === homeAge) ?? HOME_AGE[1]
  const roofOpt = ROOF_AGE.find((f) => f.value === roofAge) ?? ROOF_AGE[0]
  const constructionOpt = CONSTRUCTION.find((f) => f.value === construction) ?? CONSTRUCTION[0]
  const deductibleOpt = DEDUCTIBLE.find((f) => f.value === deductible) ?? DEDUCTIBLE[1]
  const claimsOpt = CLAIMS.find((f) => f.value === claims) ?? CLAIMS[0]

  const result = useMemo(() => {
    const perSqFt = region.perSqFt * finishOpt.factor
    const replacementCost = sqft * perSqFt
    const coverageA = Math.round(replacementCost / 1000) * 1000
    const basePremium = (coverageA / 1000) * BASE_RATE_PER_1K
    const midpoint =
      basePremium *
      deductibleOpt.factor *
      homeAgeOpt.factor *
      roofOpt.factor *
      constructionOpt.factor *
      claimsOpt.factor
    const low = midpoint * (1 - RANGE_SPREAD)
    const high = midpoint * (1 + RANGE_SPREAD)
    return {
      perSqFt,
      replacementCost,
      coverageA,
      basePremium,
      midpoint,
      low,
      high,
      monthlyLow: low / 12,
      monthlyHigh: high / 12,
      coverageB: Math.round(coverageA * 0.1),
      coverageC: Math.round((coverageA * personalPropertyPct) / 100),
      coverageD: Math.round(coverageA * 0.2),
    }
  }, [sqft, region, finishOpt, deductibleOpt, homeAgeOpt, roofOpt, constructionOpt, claimsOpt, personalPropertyPct])

  const factors: { label: string; value: string }[] = [
    { label: 'Deductible', value: `${deductibleOpt.label} → ×${deductibleOpt.factor}` },
    { label: 'Home age', value: `${homeAgeOpt.label} → ×${homeAgeOpt.factor}` },
    { label: 'Roof age', value: `${roofOpt.label} → ×${roofOpt.factor}` },
    { label: 'Construction', value: `${constructionOpt.label} → ×${constructionOpt.factor}` },
    { label: 'Claims history', value: `${claimsOpt.label} → ×${claimsOpt.factor}` },
  ]

  return (
    <div>
      {/* Calculator */}
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Home size */}
          <div>
            <label
              htmlFor="sqft"
              className="mb-2 block text-sm font-medium text-[var(--color-text-primary)]"
            >
              Home size — <span className="font-bold">{sqft.toLocaleString('en-US')} sq ft</span>
            </label>
            <input
              id="sqft"
              type="range"
              min={500}
              max={6000}
              step={50}
              value={sqft}
              onChange={(e) => setSqft(Number(e.target.value))}
              className="w-full accent-[var(--color-brand)]"
            />
            <div className="mt-1 flex justify-between text-xs text-[var(--color-text-tertiary)]">
              <span>500 sq ft</span>
              <span>6,000 sq ft</span>
            </div>
            <p className="mt-2 text-xs text-[var(--color-text-tertiary)]">
              Finished living area only — not the lot, garage or basement unless finished.
            </p>
          </div>

          <ButtonGroup
            label="Region"
            hint="Rebuild cost per sq ft is the Census Bureau 2025 median for new contractor-built homes in your region, land excluded."
            options={REGIONS.map((r) => ({ value: r.id, label: `${r.label} — $${r.perSqFt}/sq ft`, factor: 1 }))}
            value={regionId}
            onChange={setRegionId}
          />

          <ButtonGroup
            label="Finish level"
            hint="Standard is the regional median. Upgraded and luxury are planning multipliers inside the published $200–$400/sq ft custom-build band."
            options={FINISH}
            value={finish}
            onChange={setFinish}
          />

          <ButtonGroup
            label="Home age"
            hint="Older homes cost more to insure — worn systems, outdated wiring and plumbing, costlier repairs. These are planning estimates; published comparisons range from 15% to 70%."
            options={HOME_AGE}
            value={homeAge}
            onChange={setHomeAge}
          />

          <ButtonGroup
            label="Roof age"
            hint="Insurers scrutinize roofs at 10+ years; a 20+ year roof is often covered at actual cash value only. No standard published factor exists — these are estimates."
            options={ROOF_AGE}
            value={roofAge}
            onChange={setRoofAge}
          />

          <ButtonGroup
            label="Construction type"
            hint="Brick and masonry resist fire and wind better than wood frame, so they usually cost less to insure. Brick veneer over a wood frame is rated as frame."
            options={CONSTRUCTION}
            value={construction}
            onChange={setConstruction}
          />

          <ButtonGroup
            label="Deductible"
            hint="The Insurance Information Institute: raising a $500 deductible to $1,000 saves up to 25% on your premium. Higher deductible, lower premium — but more out of pocket per claim."
            options={DEDUCTIBLE}
            value={deductible}
            onChange={setDeductible}
          />

          <ButtonGroup
            label="Personal property (Coverage C)"
            hint="Standard policies set this at 50–70% of your dwelling coverage. Pick 70% if you own a lot of expensive belongings."
            options={PERSONAL_PROPERTY}
            value={personalPropertyPct}
            onChange={setPersonalPropertyPct}
          />

          <ButtonGroup
            label="Liability (Coverage E)"
            hint="Pays if someone is hurt on your property or you damage someone else's property. The limit barely moves the premium — most of it is the dwelling."
            options={LIABILITY}
            value={liability}
            onChange={setLiability}
          />

          <ButtonGroup
            label="Claims in the last 5 years"
            hint="One claim typically lifts a premium ~5–10%; fire claims run higher (~29%). Claims stay on your CLUE report for up to 7 years."
            options={CLAIMS}
            value={claims}
            onChange={setClaims}
          />
        </div>

        {/* Results */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-[var(--color-surface)] p-5 text-center">
            <p className="text-3xl font-bold tabular-nums text-[var(--color-text-primary)]">
              {fmt(result.coverageA)}
            </p>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              estimated replacement cost (Coverage A)
            </p>
            <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">
              {sqft.toLocaleString('en-US')} sq ft × ${Math.round(result.perSqFt)}/sq ft — what it
              would cost to rebuild, not what the home would sell for
            </p>
          </div>
          <div className="rounded-lg bg-[var(--color-brand)] p-5 text-center">
            <p className="text-3xl font-bold tabular-nums text-[var(--color-text-on-brand)]">
              {fmt(result.low)} – {fmt(result.high)}
            </p>
            <p className="mt-1 text-sm text-[var(--color-text-on-brand)] opacity-90">
              estimated annual premium
            </p>
            <p className="mt-1 text-xs text-[var(--color-text-on-brand)] opacity-75">
              {fmt(result.monthlyLow)} – {fmt(result.monthlyHigh)} per month
            </p>
          </div>
          <div className="rounded-lg bg-[var(--color-surface)] p-5 text-center">
            <p className="text-3xl font-bold tabular-nums text-[var(--color-text-primary)]">
              {fmt(result.midpoint)}
            </p>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">midpoint of the range</p>
            <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">
              The range is ±25% — quotes for identical coverage commonly vary by hundreds of
              dollars across insurers
            </p>
          </div>
        </div>

        {/* How the math works */}
        <div className="mt-6 rounded-lg bg-[var(--color-surface)] p-5">
          <h3 className="mb-2 text-base font-bold">How the math works</h3>
          <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
            Base premium: {fmt(result.coverageA)} ÷ 1,000 × $8.08 = {fmt(result.basePremium)} per
            year (the national-average rate for a $300,000 dwelling policy, Quadrant/Bankrate
            2025). Then the factors below are applied, one at a time:
          </p>
          <ul className="mt-3 grid gap-1.5 text-sm sm:grid-cols-2">
            {factors.map((f) => (
              <li key={f.label} className="flex justify-between gap-2">
                <span className="text-[var(--color-text-secondary)]">{f.label}</span>
                <span className="font-semibold tabular-nums">{f.value}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs leading-relaxed text-[var(--color-text-tertiary)]">
            Base rate and deductible factors are published figures. Home age, roof age,
            construction and claims factors are planning estimates inside published ranges —
            insurers do not publish their exact rating tables. Your real quote also weighs
            your credit-based insurance score (where allowed), fire protection class, exact
            location and the insurer itself.
          </p>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-[var(--color-text-tertiary)]">
          <strong className="text-[var(--color-text-primary)]">
            This is an estimate, not a quote.
          </strong>{' '}
          It uses national-average pricing. If you live on a hurricane coast, in wildfire
          country or in tornado alley, real premiums run far higher — Florida averaged $8,292
          a year in 2025 while Vermont averaged $1,087 (Insurify). Flood and earthquake
          coverage are separate policies and are not included here. Get at least three real
          quotes before you buy or renew.
        </p>
      </div>

      {/* Coverage table */}
      <div className="mt-10">
        <h2 className="mb-4 text-2xl font-bold tracking-tight">
          What your policy would cover at these limits
        </h2>
        <div className="overflow-x-auto rounded-lg border border-[var(--color-border)]">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-alt)]">
                <th className="px-4 py-3 font-bold">Coverage</th>
                <th className="px-4 py-3 font-bold">What it pays for</th>
                <th className="px-4 py-3 text-right font-bold">Your limit</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[var(--color-border-light)]">
                <td className="px-4 py-3 font-semibold">A — Dwelling</td>
                <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                  The house itself and attached structures, rebuilt at today&apos;s prices
                </td>
                <td className="px-4 py-3 text-right font-bold tabular-nums">{fmt(result.coverageA)}</td>
              </tr>
              <tr className="border-b border-[var(--color-border-light)]">
                <td className="px-4 py-3 font-semibold">B — Other structures</td>
                <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                  Detached garage, fence, shed — usually 10% of Coverage A
                </td>
                <td className="px-4 py-3 text-right font-bold tabular-nums">{fmt(result.coverageB)}</td>
              </tr>
              <tr className="border-b border-[var(--color-border-light)]">
                <td className="px-4 py-3 font-semibold">C — Personal property</td>
                <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                  Your belongings — usually 50–70% of Coverage A
                </td>
                <td className="px-4 py-3 text-right font-bold tabular-nums">{fmt(result.coverageC)}</td>
              </tr>
              <tr className="border-b border-[var(--color-border-light)]">
                <td className="px-4 py-3 font-semibold">D — Loss of use</td>
                <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                  Rent and extra living costs while your home is uninhabitable — usually 20% of
                  Coverage A
                </td>
                <td className="px-4 py-3 text-right font-bold tabular-nums">{fmt(result.coverageD)}</td>
              </tr>
              <tr className="border-b border-[var(--color-border-light)]">
                <td className="px-4 py-3 font-semibold">E — Liability</td>
                <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                  Lawsuits and damages if someone is hurt on your property
                </td>
                <td className="px-4 py-3 text-right font-bold tabular-nums">{fmt(liability)}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold">F — Medical payments</td>
                <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                  Medical bills for guests hurt on your property, regardless of fault
                </td>
                <td className="px-4 py-3 text-right font-bold tabular-nums">$5,000</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-[var(--color-text-tertiary)]">
          Coverage B, C and D are the standard HO-3 defaults as percentages of Coverage A — the
          most common policy form, covering about 78% of owner-occupied homes (NAIC). Your own
          declarations page is the only authority on your actual limits.
        </p>
      </div>

      {/* What raises / lowers */}
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <section className="rounded-lg border border-[var(--color-border)] p-5">
          <h3 className="mb-3 text-base font-bold">What pushes your premium up</h3>
          <ul className="space-y-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
            <li>• A low deductible ($500) — you pay less per claim, the insurer charges more per year.</li>
            <li>• An old roof or old systems — a roof over 20 years is often covered at actual cash value only, not full replacement cost.</li>
            <li>• A recent claim — one claim typically adds ~5–10%; fire claims run higher, around 29%.</li>
            <li>• High-risk location — hurricane coast, wildfire zone or tornado alley can double or triple the national average.</li>
            <li>• Underinsuring the dwelling — a Coverage A below rebuild cost leaves you paying the gap after a big loss.</li>
          </ul>
        </section>
        <section className="rounded-lg border border-[var(--color-border)] p-5">
          <h3 className="mb-3 text-base font-bold">What brings it down</h3>
          <ul className="space-y-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
            <li>• Raising the deductible to $1,000 — up to 25% off, per the Insurance Information Institute.</li>
            <li>• A new roof — and Class 4 impact-resistant shingles can earn a further discount (5–30% in roofing-industry data).</li>
            <li>• Brick or masonry construction — more fire-resistant than wood frame.</li>
            <li>• Bundling home and auto with one insurer, and a monitored alarm system.</li>
            <li>• Comparing quotes — identical coverage commonly varies by hundreds of dollars between insurers.</li>
          </ul>
        </section>
      </div>
    </div>
  )
}
