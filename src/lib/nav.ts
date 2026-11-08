/* ============================================================
   The Observer US — Navigation & positioning
   Single source of truth for the Home & Wallet Protection
   categories. Header, Footer and the About page all read
   from here so the nav can never drift from the CMS
   categories again. Slugs must match the Payload CMS
   category slugs (created in the CMS admin) and the
   --color-<slug> tokens in src/styles/tokens.css.
   ============================================================ */

export const SITE_TAGLINE = 'Protect your home. Protect your wallet.'

export const SITE_POSITIONING =
  'Practical US guides and news on home costs, bills, recalls, scams, and data breaches — what happened, who is affected, and what to do next.'

export interface NavCategory {
  label: string
  slug: string
  href: string
  description: string
}

export const NAV_CATEGORIES: NavCategory[] = [
  {
    label: 'Home Costs',
    slug: 'home-costs',
    href: '/home-costs',
    description: 'Home insurance, property tax, and what your home really costs.',
  },
  {
    label: 'Bills & Insurance',
    slug: 'bills-insurance',
    href: '/bills-insurance',
    description: 'Utility, auto and home insurance hikes — and how to push back.',
  },
  {
    label: 'Household Recalls',
    slug: 'recalls',
    href: '/recalls',
    description: 'CPSC and FDA recalls for products in your home — check your model.',
  },
  {
    label: 'Home Scams',
    slug: 'home-scams',
    href: '/home-scams',
    description: 'Contractor, utility-imposter, mortgage and title fraud — and how to spot it.',
  },
  {
    label: 'Breach Actions',
    slug: 'breach-actions',
    href: '/breach-actions',
    description: 'Data breaches that touch your household — and the exact steps to take.',
  },
]
