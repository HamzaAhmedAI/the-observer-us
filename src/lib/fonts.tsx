/* ============================================================
   Font Configuration — Outfit + JetBrains Mono via next/font
   ============================================================
   Outfit: modern sans-serif, similar character to Geist.
   JetBrains Mono: paired mono for code and data labels.
   Swap to Geist when font files are available (see notes below).
   ============================================================ */

import { Outfit, JetBrains_Mono } from 'next/font/google'
import type { ReactNode } from 'react'

/* Primary sans — Outfit (400, 500, 600, 700, 900)
   <<< SWAP TO GEIST >>>
   To switch to Geist:
   1. npm install geist
   2. Replace this with:
      import { Geist } from 'geist/font'
   3. Update variable name and className below
*/
const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
})

/* Mono — JetBrains Mono (400, 500, 700)
   <<< SWAP TO GEIST MONO >>>
   To switch to Geist Mono:
   1. npm install geist
   2. Replace this with:
      import { GeistMono } from 'geist/font'
   3. Update variable name and className below
*/
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  preload: true,
  fallback: ['SF Mono', 'Fira Code', 'monospace'],
})

/**
 * FontProvider — wraps the app with CSS variable classes
 * so Tailwind and CSS can reference them via var(--font-sans)
 */
export function FontProvider({ children }: { children: ReactNode }) {
  return (
    <div className={`${outfit.variable} ${jetbrainsMono.variable}`}>
      {children}
    </div>
  )
}

export { outfit, jetbrainsMono }
