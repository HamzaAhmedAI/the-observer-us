/* ============================================================
   LiveBadge — small pulsing dot + "LIVE" label
   Shown when an article was published/updated within the last 2h.
   ============================================================ */

export function LiveBadge() {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-brand)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--color-text-on-brand)]"
      aria-label="Live coverage"
    >
      <span
        className="relative flex h-1.5 w-1.5"
        aria-hidden="true"
      >
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
      </span>
      Live
    </span>
  )
}
