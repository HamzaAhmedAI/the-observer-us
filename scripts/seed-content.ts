/* ============================================================
   The Observer US — Content Seeder
   Seeds the live CMS (Neon) from this machine via Payload's
   local API: 6 categories, the Hamza author, media uploads and
   the first articles. Idempotent — re-running skips anything
   that already exists (matched by slug / filename).

   Run:  CMS_API_URL=https://theobserverus.com npx tsx scripts/seed-content.ts
   Env:  .env.seed in the repo root (copied from the VM's
         /opt/observer/.env — DATABASE_URL, PAYLOAD_SECRET,
         REVALIDATION_SECRET). CMS_API_URL is overridden to the
         live site so the publish hook revalidates + notifies
         the real site, not localhost.
   Media: files are uploaded to this machine's public/media/
         (Payload generates card/featured/og sizes). Sync them
         to the VM afterwards:
         scp -F ~/.ssh/config public/media/featured-*.jpg \
           public/media/author-hamza-ahmed.jpg \
           opc@158.101.227.59:/opt/observer/the-observer-us/public/media/
   ============================================================ */

import fs from 'node:fs'
import path from 'node:path'
import { getPayload } from 'payload'
// NOTE: the config is imported dynamically inside main(), AFTER the env
// file is loaded — buildConfig reads PAYLOAD_SECRET at import time, and
// static imports are hoisted above the env loading.

// --- minimal .env parser (no dotenv dependency) ---
function loadEnvFile(file: string) {
  if (!fs.existsSync(file)) return
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)=(.*)$/)
    if (!m) continue
    let value = m[2].trim()
    if (
      (value.startsWith("'") && value.endsWith("'")) ||
      (value.startsWith('"') && value.endsWith('"'))
    ) {
      value = value.slice(1, -1)
    }
    if (process.env[m[1]] === undefined) process.env[m[1]] = value
  }
}
loadEnvFile(path.resolve(process.cwd(), '../.env.seed'))
process.env.CMS_API_URL = 'https://theobserverus.com'

const ASSETS = path.resolve(process.cwd(), '../assets')
const TODAY = '2026-11-13'

const CATEGORIES = [
  { name: 'Home Costs', slug: 'home-costs', color: '#2563eb', description: 'What it costs to own, run and repair a US home — and how to pay less for it.' },
  { name: 'Bills & Insurance', slug: 'bills-insurance', color: '#0891b2', description: 'Utility bills, home insurance and the paperwork that protects your household budget.' },
  { name: 'Recalls', slug: 'recalls', color: '#dc2626', description: 'Household product recalls — what was recalled, who is affected, and what to do.' },
  { name: 'Home Scams', slug: 'home-scams', color: '#ea580c', description: 'Scams aimed at homeowners and renters — how they work and how to spot them.' },
  { name: 'Breach Actions', slug: 'breach-actions', color: '#7c3aed', description: 'Data breaches that touch your household — and the exact steps to take.' },
  { name: 'Off-Grid Life', slug: 'off-grid-life', color: '#16a34a', description: 'Household resilience when the grid goes down: 72-hour kits, food and water storage, cash, radios and backup power — what governments actually advise.' },
]

const HUB_CONTENT = `<p>If your personal information was exposed in a data breach, lost with a wallet, or used by someone else, this is the single strongest free step you can take: freeze your credit at all three bureaus.</p>
<p>A credit freeze blocks most new credit accounts from being opened in your name. It is free to place, free to lift, and it does not affect your credit score. It lasts until you lift it.</p>
<p>Recently: if you received a <a href="/breach-actions/got-a-greystar-letter-do-these-4-things">Greystar breach letter</a>, start there — it walks through the same freeze steps plus your enrollment deadline.</p>
<h2>Who should do this now</h2>
<p>Do it now if any of these apply:</p>
<ul><li>You received a data breach notice</li><li>Your Social Security number, wallet, or ID was lost or stolen</li><li>You see an account, inquiry, or charge you do not recognise</li><li>You simply want new accounts blocked before anything happens</li></ul>
<p>You do not need to be a victim of identity theft to freeze your credit. Anyone can do it, for any reason.</p>
<h2>The one mistake to avoid</h2>
<p>There is no single switch that freezes all three credit files.</p>
<p>You must contact <strong>Equifax, Experian, and TransUnion separately</strong>. Freezing only one leaves the other two open — and a thief only needs one open file.</p>
<h2>What to do, bureau by bureau</h2>
<p>Do these online if you can. It is the fastest route. You will be asked to create a free account and verify your identity at each bureau.</p>
<h3>1. Equifax</h3>
<p>Go to <a href="https://www.equifax.com/personal/credit-report-services/credit-freeze/">Equifax's official security freeze page</a> through your free myEquifax account, and place a security freeze. Save your login — you will need it to lift the freeze later.</p>
<h3>2. Experian</h3>
<p>Go to <a href="https://www.experian.com/freeze/center.html">Experian's official Freeze Center</a> through your free Experian account, and place a security freeze. You can freeze, unfreeze, or schedule a temporary lift there.</p>
<h3>3. TransUnion</h3>
<p>Go to <a href="https://www.transunion.com/credit-freeze">TransUnion's official credit freeze page</a>, create or sign into your free account, and place a credit freeze. You can remove it or temporarily lift it for dates you choose.</p>
<p><strong>After all three:</strong> confirm each one shows as frozen before you consider the job done. Save each login in a password manager, not in a note on your phone.</p>
<h2>How long it takes</h2>
<ul><li><strong>Online or by phone:</strong> a freeze must be placed within 1 business day</li><li><strong>By mail:</strong> within 3 business days of the bureau receiving your request</li><li><strong>Lifting a freeze online or by phone:</strong> within 1 hour</li></ul>
<p>Plan temporary lifts ahead of important applications. Do not wait until you are at the dealership or the bank counter.</p>
<h2>How to temporarily lift a freeze when you need credit</h2>
<ol><li>Ask the lender, landlord, or insurer which bureau they will check</li><li>Lift only that bureau's freeze — not all three</li><li>Set a temporary lift for a date range that covers the application and any follow-up checks</li><li>Put the freeze back when you are done</li></ol>
<p>A freeze does not stop you from applying for credit. It just means you open the door yourself, for a short time, on purpose.</p>
<h2>What a freeze does — and does not — do</h2>
<p><strong>It does:</strong></p>
<ul><li>Block most new credit cards, loans, and accounts opened in your name</li><li>Stay in place until you lift it</li><li>Cost nothing to place, lift, or remove</li></ul>
<p><strong>It does not:</strong></p>
<ul><li>Stop charges on credit cards you already have</li><li>Close your existing accounts or stop you using your existing cards</li><li>Stop a scammer using information they already have for other fraud, such as tax or medical identity theft</li><li>Replace checking your credit reports</li></ul>
<p>That last point matters. After a breach, also check your free credit reports at <a href="https://www.annualcreditreport.com">AnnualCreditReport.com</a> — the only federally authorised site for free reports — and look for accounts you do not recognise.</p>
<h2>Freeze vs. fraud alert vs. credit lock</h2>
<ul><li><strong>Credit freeze:</strong> Blocks access to your file for new-credit decisions. Free, backed by federal law, lasts until you lift it. Contact all three bureaus separately.</li><li><strong>Initial fraud alert:</strong> Free for one year. Asks lenders to verify your identity before granting new credit, but does not block access. You contact one bureau, and it must notify the other two.</li><li><strong>Credit lock:</strong> Similar protection in practice, but offered as a product — it may come with fees and different terms. A freeze gives you the core protection for free.</li></ul>
<p>If you are unsure, start with the freeze. Add a fraud alert if you suspect you may be affected but do not want a full freeze yet.</p>
<h2>If your identity was already stolen</h2>
<ol><li>Report it at <a href="https://www.identitytheft.gov">IdentityTheft.gov</a> — you will get a free, personal recovery plan</li><li>Freeze your credit at all three bureaus (above)</li><li>Check your reports at <a href="https://www.annualcreditreport.com">AnnualCreditReport.com</a> and dispute anything you do not recognise</li><li>Keep every confirmation, letter, and case number</li></ol>
<h2>Bottom line</h2>
<p>Three freezes, roughly 30 minutes online, free, reversible, and no score impact. It is the action step every breach story on this site will link back to — because a breach notice without a next step is just bad news.</p>
<p><em>This is general information only, not personal financial advice. Confirm the current steps on each bureau's official site, as account screens change.</em></p>`

const GREYSTAR_CONTENT = `<p>If you rent from Greystar — the largest apartment operator in the US — and a letter about a data breach arrived in the mail, do not throw it away. It contains a deadline, and a free offer that expires on that deadline.</p>
<p>An unauthorized party accessed a Greystar employee email account between May 1 and May 18, 2026, and took files from it. That is confirmed in Greystar counsel's October 1, 2026 update letter to the Washington Attorney General, which this article was checked against directly.</p>
<h2>Who was affected</h2>
<p>Greystar notified Washington residents in two rounds: 333 people first, then 572 more on October 1, 2026 — 905 Washington residents in total. An Indiana Attorney General report lists 1,831 individuals including one Indiana resident. Do not add those two figures together into a national total — no national total has been established.</p>
<p>The information in the files, per the Washington filing, included names plus Social Security numbers, driver's licence or state ID numbers, banking/financial information, and full dates of birth. That combination is why the next steps matter: it is the information used to open new accounts in someone else's name.</p>
<h2>The one mistake to avoid</h2>
<p>Do not use a phone number, website, or link from a call, text, or email about this breach. Use only the enrollment site and phone number printed in your own letter. Unexpected calls or texts about the breach asking for your Social Security number or a login are not Greystar — treat them as scams.</p>
<h2>What to do — 4 steps</h2>
<h3>1. Keep the letter</h3>
<p>Keep the letter somewhere safe. It has your enrollment details and your deadline. The deadline printed in your letter is the one that applies to you.</p>
<ul><li>Letters sent in August: secondary summaries report an enrollment deadline of <strong>November 30, 2026</strong>. That date has not been confirmed from the original August filing, so go by your own letter.</li><li>Letters sent in October: the sample letter in the October 1 Washington filing requires enrollment by <strong>December 31, 2026</strong>.</li></ul>
<p>After November 30, only the October cohort's December 31 deadline remains.</p>
<h3>2. Enroll in the free monitoring before your deadline</h3>
<p>Greystar is offering 24 months of complimentary Experian IdentityWorks credit monitoring and identity restoration. Enroll using only the site and phone number printed in your letter, before the deadline printed in your letter. After the deadline, the free offer is no longer available to you.</p>
<h3>3. Freeze your credit at all three bureaus</h3>
<p>Monitoring tells you when something happens. A freeze stops most new accounts from being opened in your name in the first place. It is free, it does not affect your credit score, and it lasts until you lift it.</p>
<p>You must contact Equifax, Experian, and TransUnion separately — there is no single switch. The full step-by-step is in our hub: <a href="/breach-actions/how-to-freeze-your-credit-at-all-three-bureaus-free">How to Freeze Your Credit at All Three Bureaus (Free)</a>. Plan on roughly 30 minutes online for all three, and check your free reports at <a href="https://www.annualcreditreport.com">AnnualCreditReport.com</a> — the only federally authorised site for free reports — for accounts you do not recognise.</p>
<h3>4. Report any misuse</h3>
<p>If you see an account, inquiry, or charge you do not recognise, report it at <a href="https://www.identitytheft.gov">IdentityTheft.gov</a> — you will get a free, personal recovery plan — and keep every confirmation, letter, and case number.</p>
<h2>Bottom line</h2>
<p>Keep the letter, enroll before the deadline printed in it, freeze at all three bureaus, and report anything you do not recognise. Four steps, and the freeze is the one that keeps working after the monitoring ends.</p>
<p><em>This is general information only, not personal financial advice. No affiliate links are in this article.</em></p>`

async function main() {
  const { default: config } = await import('../src/payload.config')
  const payload = await getPayload({ config })
  try {
    // --- Categories ---
    const categoryIds: Record<string, number> = {}
    for (const cat of CATEGORIES) {
      const found = await payload.find({
        collection: 'categories',
        where: { slug: { equals: cat.slug } },
        limit: 1,
      })
      if (found.docs.length > 0) {
        categoryIds[cat.slug] = found.docs[0].id as number
        console.log(`category exists: ${cat.slug}`)
      } else {
        const created = await payload.create({ collection: 'categories', data: cat })
        categoryIds[cat.slug] = created.id as number
        console.log(`category created: ${cat.slug}`)
      }
    }

    // --- Media ---
    async function uploadMedia(filename: string, alt: string) {
      const found = await payload.find({
        collection: 'media',
        where: { filename: { equals: filename } },
        limit: 1,
      })
      if (found.docs.length > 0) {
        console.log(`media exists: ${filename}`)
        return found.docs[0].id as number
      }
      const filePath = path.join(ASSETS, filename)
      const data = fs.readFileSync(filePath)
      const created = await payload.create({
        collection: 'media',
        data: { alt },
        file: { data, mimetype: 'image/jpeg', name: filename, size: data.length },
      })
      console.log(`media uploaded: ${filename} (id ${created.id})`)
      return created.id as number
    }

    const hubImage = await uploadMedia(
      'featured-credit-freeze-hub.jpg',
      'Freeze your credit at all three bureaus — free, about 30 minutes online'
    )
    const greystarImage = await uploadMedia(
      'featured-greystar-letter.jpg',
      'Got a Greystar breach letter? Four things to do before your deadline'
    )
    const avatarImage = await uploadMedia('author-hamza-ahmed.jpg', 'Hamza Ahmed, Founder & Editor-in-Chief of The Observer US')

    // --- Author ---
    let authorId: number
    const authorFound = await payload.find({
      collection: 'authors',
      where: { slug: { equals: 'hamza-ahmed' } },
      limit: 1,
    })
    if (authorFound.docs.length > 0) {
      authorId = authorFound.docs[0].id as number
      console.log('author exists: hamza-ahmed')
      // Attach the avatar if missing.
      if (!authorFound.docs[0].avatar) {
        await payload.update({ collection: 'authors', id: authorId, data: { avatar: avatarImage } })
        console.log('author avatar attached')
      }
    } else {
      const created = await payload.create({
        collection: 'authors',
        data: {
          name: 'Hamza Ahmed',
          slug: 'hamza-ahmed',
          role: 'Founder & Editor-in-Chief',
          bio: 'Founder and Editor-in-Chief of The Observer US. Covers home costs, bills, recalls, scams, breaches and off-grid preparedness — what happened, who is affected, and what to do next.',
          avatar: avatarImage,
        },
      })
      authorId = created.id as number
      console.log('author created: hamza-ahmed')
    }

    // --- Articles ---
    async function publishArticle(article: Record<string, unknown>) {
      const found = await payload.find({
        collection: 'articles',
        where: { slug: { equals: article.slug as string } },
        limit: 1,
      })
      if (found.docs.length > 0) {
        console.log(`article exists: ${article.slug} (skipped)`)
        return
      }
      const { categorySlug, ...data } = article
      const created = await payload.create({
        collection: 'articles',
        draft: false,
        data: { ...data, _status: 'published' },
      })
      console.log(`article PUBLISHED: /${categorySlug}/${article.slug} (id ${created.id})`)
    }

    await publishArticle({
      title: 'How to Freeze Your Credit at All Three Bureaus (Free)',
      slug: 'how-to-freeze-your-credit-at-all-three-bureaus-free',
      excerpt:
        'A credit freeze is the single strongest free step after a breach — and it takes about 30 minutes online. Here is how to do it at Equifax, Experian and TransUnion.',
      content: HUB_CONTENT,
      featuredImage: hubImage,
      category: categoryIds['breach-actions'],
      categorySlug: 'breach-actions',
      author: authorId,
      contentType: 'evergreen-hub',
      sources: [
        { label: 'FTC — Get a credit freeze to stop identity thieves', url: 'https://consumer.ftc.gov/' },
        { label: 'Equifax — Security Freeze', url: 'https://www.equifax.com/personal/credit-report-services/credit-freeze/' },
        { label: 'Experian — Freeze Center', url: 'https://www.experian.com/freeze/center.html' },
        { label: 'TransUnion — Credit Freeze', url: 'https://www.transunion.com/credit-freeze' },
        { label: 'AnnualCreditReport.com — Free credit reports', url: 'https://www.annualcreditreport.com' },
        { label: 'IdentityTheft.gov — Report identity theft', url: 'https://www.identitytheft.gov' },
      ],
      lastReviewed: TODAY,
      containsAffiliateLinks: false,
      readTime: 5,
      publishedAt: new Date().toISOString(),
      seo: {
        title: 'How to Freeze Your Credit at All Three Bureaus (Free)',
        description:
          'Freeze your credit at Equifax, Experian and TransUnion — free, in about 30 minutes online. Step-by-step for all three bureaus, plus fraud alerts vs locks.',
        ogImage: hubImage,
      },
    })

    await publishArticle({
      title: 'Got a Greystar Letter? Do These 4 Things Before the Deadline in Your Letter',
      slug: 'got-a-greystar-letter-do-these-4-things',
      excerpt:
        'Greystar’s breach exposed names, Social Security numbers and bank details. Your letter has a deadline — and a free 24-month monitoring offer that expires on it.',
      content: GREYSTAR_CONTENT,
      featuredImage: greystarImage,
      category: categoryIds['breach-actions'],
      categorySlug: 'breach-actions',
      author: authorId,
      contentType: 'news-hook',
      sources: [
        { label: 'Greystar counsel — Oct 1, 2026 update letter to the Washington Attorney General', url: 'https://agportal-s3bucket.s3.amazonaws.com/databreach/BreachA42570.pdf' },
        { label: 'IdentityTheft.gov — Report identity theft', url: 'https://www.identitytheft.gov' },
        { label: 'AnnualCreditReport.com — Free credit reports', url: 'https://www.annualcreditreport.com' },
      ],
      lastReviewed: TODAY,
      containsAffiliateLinks: false,
      readTime: 4,
      publishedAt: new Date().toISOString(),
      seo: {
        title: 'Got a Greystar Letter? Do These 4 Things Before Your Deadline',
        description:
          'Got a Greystar breach letter? Keep it, enroll in the free 24-month Experian monitoring before your deadline, freeze your credit, and report misuse.',
        ogImage: greystarImage,
      },
    })

    console.log('DONE.')
  } finally {
    await payload.destroy()
  }
}

main().catch((err) => {
  console.error('SEED FAILED:', err instanceof Error ? err.message : String(err))
  process.exit(1)
})
