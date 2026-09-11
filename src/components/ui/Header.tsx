/* ============================================================
   The Observer US — Global Header
   Premium sticky nav with refined transparency, subtle
   bottom border treatment, and a clean mobile menu.
   Uses a CSS checkbox hack for reliable mobile toggling.
   ============================================================ */

'use client'

import Link from 'next/link'
import { useEffect, useState, useCallback } from 'react'
import { List, X, Moon, Sun } from '@phosphor-icons/react'

const NAV_LINKS = [
  { label: 'Politics', href: '/politics' },
  { label: 'Technology', href: '/technology' },
  { label: 'Business', href: '/business' },
  { label: 'Sports', href: '/sports' },
  { label: 'Entertainment', href: '/entertainment' },
  { label: 'Health', href: '/health' },
  { label: 'Science', href: '/science' },
  { label: 'World', href: '/world' },
]

/* Shared ID for the mobile-menu checkbox — unique enough since Header is a singleton */
const MENU_ID = 'obv-menu-toggle'

export function Header() {
  const [mounted, setMounted] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const stored = localStorage.getItem('theme')
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const dark = stored === 'dark' || (!stored && prefersDark)
      setIsDark(dark)
      document.documentElement.classList.toggle('dark', dark)
    } catch {}
  }, [])

  /* Sync React state with checkbox for icon swap */
  useEffect(() => {
    const cb = document.getElementById(MENU_ID) as HTMLInputElement | null
    if (!cb) return
    const handler = () => {
      setMenuOpen(cb.checked)
      document.body.style.overflow = cb.checked ? 'hidden' : ''
    }
    cb.addEventListener('change', handler)
    return () => {
      cb.removeEventListener('change', handler)
      document.body.style.overflow = ''
    }
  }, [])

  const closeMenu = useCallback(() => {
    const cb = document.getElementById(MENU_ID) as HTMLInputElement | null
    if (cb) {
      cb.checked = false
      setMenuOpen(false)
      document.body.style.overflow = ''
    }
  }, [])

  const toggleDark = useCallback(() => {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }, [isDark])

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border-light)] bg-[var(--color-surface)]/85 backdrop-blur-lg">
      {/* Hidden checkbox — visually hidden but NOT display:none so label clicks still toggle it */}
      <input type="checkbox" id={MENU_ID} className="absolute -inset-full opacity-0 pointer-events-none" autoComplete="off" aria-label="Toggle mobile menu" />

      <div className="container-news flex h-14 items-center justify-between gap-4 md:h-16">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold tracking-tight text-[var(--color-text-primary)] no-underline hover:opacity-80 transition-opacity duration-[var(--duration-fast)]"
        >
          <span className="text-[var(--color-brand-text)]">The</span>
          <span>Observer</span>
          <span className="inline text-xs font-medium text-[var(--color-text-tertiary)]">US</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-[var(--radius-sm)] px-3 py-1.5 text-sm font-medium text-[var(--color-text-secondary)] no-underline transition-all duration-[var(--duration-fast)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-1">
          {/* Dark Mode Toggle */}
          {mounted && (
            <button
              onClick={toggleDark}
              className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-text-tertiary)] transition-all duration-[var(--duration-fast)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun size={16} weight="bold" /> : <Moon size={16} weight="bold" />}
            </button>
          )}

          {/* Mobile Menu Hamburger — label toggles the checkbox.
              aria-label is prohibited on <label>; use visually hidden text instead. */}
          <label
            htmlFor={MENU_ID}
            className="flex h-11 w-11 cursor-pointer select-none items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-text-tertiary)] transition-all duration-[var(--duration-fast)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)] active:bg-[var(--color-surface-hover)] lg:hidden"
          >
            <span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
            {menuOpen ? <X size={20} weight="bold" aria-hidden="true" /> : <List size={20} weight="bold" aria-hidden="true" />}
          </label>
        </div>
      </div>

      {/* Mobile Menu — shown via CSS when checkbox is checked (header:has() selector) */}
      <div className="hidden [header:has(#obv-menu-toggle:checked)_&]:block">
        <nav
          className="border-t border-[var(--color-border-light)] bg-[var(--color-surface)] px-6 pb-6 pt-4 shadow-[var(--shadow-dropdown)]"
          aria-label="Mobile navigation"
        >
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="rounded-[var(--radius-md)] px-4 py-3 text-base font-medium text-[var(--color-text-secondary)] no-underline transition-all duration-[var(--duration-fast)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)] active:bg-[var(--color-surface-hover)]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  )
}
