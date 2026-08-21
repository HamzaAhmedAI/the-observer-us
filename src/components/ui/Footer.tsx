/* ============================================================
   The Observer US — Footer
   Premium footer with refined typography and spacing.
   Server Component — phosphor icons are isolated in FooterIcons.
   ============================================================ */

import Link from 'next/link'
import { FooterCopyright, FooterNewsletterLink } from './FooterIcons'

const FOOTER_CATEGORIES = [
  { label: 'Politics', href: '/politics' },
  { label: 'Technology', href: '/technology' },
  { label: 'Business', href: '/business' },
  { label: 'Sports', href: '/sports' },
  { label: 'Entertainment', href: '/entertainment' },
  { label: 'Health', href: '/health' },
  { label: 'Science', href: '/science' },
  { label: 'World', href: '/world' },
]

const FOOTER_LINKS = [
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Advertise', href: '/advertise' },
  { label: 'Careers', href: '/careers' },
]

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border-light)] bg-[var(--color-surface-alt)]">
      <div className="container-news py-12 md:py-16">
        {/* Top Section — Logo + Newsletter */}
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              href="/"
              className="text-lg font-bold tracking-tight text-[var(--color-text-primary)] no-underline"
            >
              <span className="text-[var(--color-brand-text)]">The</span>{' '}
              Observer{' '}
              <span className="text-xs font-medium text-[var(--color-text-tertiary)]">US</span>
            </Link>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-[var(--color-text-secondary)]">
              Your trusted source for breaking news, in-depth analysis, and stories that matter.
            </p>
          </div>

          <FooterNewsletterLink />
        </div>

        {/* Links Grid */}
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          {/* Categories */}
          <div>
            <h3 className="mb-4 text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-text-tertiary)]">
              Categories
            </h3>
            <ul className="space-y-2.5">
              {FOOTER_CATEGORIES.map((cat) => (
                <li key={cat.href}>
                  <Link
                    href={cat.href}
                    className="text-sm text-[var(--color-text-secondary)] no-underline
                               transition-colors duration-[var(--duration-fast)]
                               hover:text-[var(--color-text-primary)]"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-4 text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-text-tertiary)]">
              Company
            </h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--color-text-secondary)] no-underline
                               transition-colors duration-[var(--duration-fast)]
                               hover:text-[var(--color-text-primary)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* RSS / Sitemap */}
          <div>
            <h3 className="mb-4 text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-text-tertiary)]">
              Follow
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/rss.xml"
                  className="text-sm text-[var(--color-text-secondary)] no-underline
                             transition-colors duration-[var(--duration-fast)]
                             hover:text-[var(--color-text-primary)]"
                >
                  RSS Feed
                </Link>
              </li>
              <li>
                <Link
                  href="/news-sitemap.xml"
                  className="text-sm text-[var(--color-text-secondary)] no-underline
                             transition-colors duration-[var(--duration-fast)]
                             hover:text-[var(--color-text-primary)]"
                >
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-text-tertiary)]">
              Legal
            </h3>
            <ul className="space-y-2.5">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-sm text-[var(--color-text-secondary)] no-underline
                               transition-colors duration-[var(--duration-fast)]
                               hover:text-[var(--color-text-primary)]"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[var(--color-border-light)] pt-6 text-xs text-[var(--color-text-tertiary)] md:flex-row">
          <FooterCopyright />
          <p className="text-[var(--color-text-tertiary)]">
            Independent journalism. Free for all.
          </p>
        </div>
      </div>
    </footer>
  )
}
