/* ============================================================
   The Observer US — Contact Form (client island)
   Validates input and opens a pre-filled mailto as the
   reliable delivery path (no third-party form service).
   ============================================================ */

'use client'

import { useState } from 'react'

const TOPICS = [
  'General question',
  'News tip',
  'Correction',
  'Advertising',
  'Careers',
  'Legal notice',
]

export function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [topic, setTopic] = useState(TOPICS[0])
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent(`[${topic}] ${name || 'Contact'}`)
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nTopic: ${topic}\n\n${message}`,
    )
    const mailbox =
      topic === 'Advertising'
        ? 'advertise@theobserverus.com'
        : topic === 'Careers'
          ? 'careers@theobserverus.com'
          : topic === 'Correction'
            ? 'corrections@theobserverus.com'
            : 'newsroom@theobserverus.com'
    window.location.href = `mailto:${mailbox}?subject=${subject}&body=${body}`
    setSent(true)
  }

  if (sent) {
    return (
      <div className="rounded-lg border border-[var(--color-border-light)] bg-[var(--color-surface-elevated)] p-5">
        <p className="text-sm text-[var(--color-text-secondary)]">
          Your email app should now be open with your message pre-filled. If it didn&apos;t
          open, email us directly at{' '}
          <a
            href="mailto:newsroom@theobserverus.com"
            className="text-[var(--color-accent)] hover:underline"
          >
            newsroom@theobserverus.com
          </a>
          .
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="cf-name"
            className="mb-1.5 block text-sm font-medium text-[var(--color-text-primary)]"
          >
            Name
          </label>
          <input
            id="cf-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
            placeholder="Your name"
          />
        </div>
        <div>
          <label
            htmlFor="cf-email"
            className="mb-1.5 block text-sm font-medium text-[var(--color-text-primary)]"
          >
            Email
          </label>
          <input
            id="cf-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="cf-topic"
          className="mb-1.5 block text-sm font-medium text-[var(--color-text-primary)]"
        >
          Topic
        </label>
        <select
          id="cf-topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
        >
          {TOPICS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="cf-message"
          className="mb-1.5 block text-sm font-medium text-[var(--color-text-primary)]"
        >
          Message
        </label>
        <textarea
          id="cf-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={5}
          className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
          placeholder="How can we help?"
        />
      </div>

      <button
        type="submit"
        className="rounded-md bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        Send Message
      </button>
      <p className="text-xs text-[var(--color-text-tertiary)]">
        This opens your email app with the message pre-filled. We don&apos;t store form contents on
        our servers.
      </p>
    </form>
  )
}
