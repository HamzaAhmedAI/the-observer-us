/* ============================================================
   The Observer US — Contact
   ============================================================ */

import type { Metadata } from 'next'
import { LegalPage, LegalSection, LegalList } from '@/components/reader/LegalPage'
import { ContactForm } from './ContactForm'
import { SITE_NAME } from '@/lib/seo'

export const metadata: Metadata = {
  title: `Contact — ${SITE_NAME}`,
  description:
    'Contact The Observer US newsroom with tips, corrections, advertising inquiries, or general questions.',
  alternates: { canonical: '/contact' },
  robots: { index: true, follow: true },
}

export const revalidate = 86400

export default function ContactPage() {
  return (
    <LegalPage
      title="Contact Us"
      intro="We read every message. Use the form below or email us directly — whichever you prefer."
      lastUpdated="August 21, 2026"
    >
      <LegalSection title="Send a Message">
        <ContactForm />
      </LegalSection>

      <LegalSection title="Direct Email">
        <LegalList>
          <li>
            <strong className="text-[var(--color-text-primary)]">Newsroom &amp; tips:</strong>{' '}
            <a
              href="mailto:newsroom@theobserverus.com"
              className="text-[var(--color-accent)] hover:underline"
            >
              newsroom@theobserverus.com
            </a>
          </li>
          <li>
            <strong className="text-[var(--color-text-primary)]">Corrections:</strong>{' '}
            <a
              href="mailto:corrections@theobserverus.com"
              className="text-[var(--color-accent)] hover:underline"
            >
              corrections@theobserverus.com
            </a>
          </li>
          <li>
            <strong className="text-[var(--color-text-primary)]">Advertising:</strong>{' '}
            <a
              href="mailto:advertise@theobserverus.com"
              className="text-[var(--color-accent)] hover:underline"
            >
              advertise@theobserverus.com
            </a>
          </li>
          <li>
            <strong className="text-[var(--color-text-primary)]">Careers:</strong>{' '}
            <a
              href="mailto:careers@theobserverus.com"
              className="text-[var(--color-accent)] hover:underline"
            >
              careers@theobserverus.com
            </a>
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="Mailing Address">
        <p>
          The Observer US
          <br />
          Attn: Editorial Office
          <br />
          (Registered agent / mailing address on file with the State of Delaware)
        </p>
        <p className="text-sm text-[var(--color-text-tertiary)]">
          For legal notices, please use the email addresses above and mark your message
          &ldquo;Legal Notice.&rdquo;
        </p>
      </LegalSection>

      <LegalSection title="Response Time">
        <p>
          We aim to respond to newsroom tips and correction requests within 2 business days.
          Advertising and careers inquiries are typically answered within 3 business days.
        </p>
      </LegalSection>
    </LegalPage>
  )
}
