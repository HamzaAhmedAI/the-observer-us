/* ============================================================
   The Observer US — Privacy Policy
   Reflects actual data practices: first-party analytics only,
   email + web push subscriptions, no third-party ad/tracking,
   no sale or sharing of personal data.
   ============================================================ */

import type { Metadata } from 'next'
import { LegalPage, LegalSection, LegalList } from '@/components/reader/LegalPage'
import { SITE_NAME } from '@/lib/seo'

export const metadata: Metadata = {
  title: `Privacy Policy — ${SITE_NAME}`,
  description:
    'How The Observer US collects, uses, and protects your data. First-party analytics only, no third-party ad tracking, and we never sell your data.',
  alternates: { canonical: '/privacy' },
  robots: { index: true, follow: true },
}

export const revalidate = 86400

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="This policy explains what information The Observer US collects, how we use it, and the choices you have. We keep it plain and honest."
      lastUpdated="August 21, 2026"
    >
      <LegalSection title="1. Who We Are">
        <p>
          <strong className="text-[var(--color-text-primary)]">The Observer US</strong> (&ldquo;we,&rdquo;
          &ldquo;us,&rdquo; &ldquo;the site&rdquo;) is an independent digital news publication. For
          privacy questions, contact{' '}
          <a
            href="mailto:privacy@theobserverus.com"
            className="text-[var(--color-accent)] hover:underline"
          >
            privacy@theobserverus.com
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="2. Information We Collect">
        <p>
          <strong className="text-[var(--color-text-primary)]">Information you give us:</strong>
        </p>
        <LegalList>
          <li>
            <strong className="text-[var(--color-text-primary)]">Email address</strong> — when you
            subscribe to newsletters or breaking-news alerts.
          </li>
          <li>
            <strong className="text-[var(--color-text-primary)]">Category preferences</strong> — the
            topics you choose to follow (e.g., politics, technology).
          </li>
          <li>
            <strong className="text-[var(--color-text-primary)]">Push subscription data</strong> — if
            you enable browser notifications, we store your browser&apos;s push endpoint and keys
            (provided by your browser, not your name or email).
          </li>
          <li>
            <strong className="text-[var(--color-text-primary)]">Messages you send us</strong> — via
            our contact form or email.
          </li>
        </LegalList>
        <p>
          <strong className="text-[var(--color-text-primary)]">
            Information collected automatically:
          </strong>
        </p>
        <LegalList>
          <li>
            <strong className="text-[var(--color-accent)]">First-party analytics only.</strong> We
            collect anonymous performance and usage metrics (such as page load times, which articles
            are read, and error reports) through our own servers. We do{' '}
            <strong className="text-[var(--color-text-primary)]">
              not
            </strong>{' '}
            load third-party advertising or cross-site tracking cookies (e.g., Google Analytics,
            Meta Pixel, or ad networks).
          </li>
          <li>
            <strong className="text-[var(--color-text-primary)]">Email engagement signals</strong> —
            when you open or click a link in our emails, we record that event to measure
            effectiveness and reduce spam.
          </li>
          <li>
            <strong className="text-[var(--color-text-primary)]">Standard server logs</strong> — IP
            address, browser type, and access time, retained briefly for security and debugging.
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="3. How We Use Information">
        <LegalList>
          <li>Send the newsletters, digests, and breaking-news alerts you requested.</li>
          <li>Deliver browser push notifications for the categories you selected.</li>
          <li>Improve site performance, reliability, and content quality.</li>
          <li>Respond to your messages, tips, and correction requests.</li>
          <li>Prevent abuse, fraud, and security incidents.</li>
        </LegalList>
      </LegalSection>

      <LegalSection title="4. We Do Not Sell or Share Your Data">
        <p>
          <strong className="text-[var(--color-text-primary)]">
            We do not sell, rent, or share your personal information with third parties for money or
            cross-context behavioral advertising.
          </strong>{' '}
          We do not use data brokers. The only disclosures are to vetted service providers who help
          us operate (such as our hosting and email-delivery infrastructure), and only as needed to
          provide the service.
        </p>
      </LegalSection>

      <LegalSection title="5. Cookies and Tracking">
        <p>
          We use a minimal set of first-party cookies to remember your preferences (such as category
          selections and notification settings). Because we do not use third-party advertising or
          cross-site tracking cookies, no advertising-consent banner is required under the EU
          ePrivacy rules for our current setup. If we ever add third-party analytics or advertising,
          we will update this policy and implement appropriate consent.
        </p>
      </LegalSection>

      <LegalSection title="6. Legal Bases (GDPR / UK)">
        <p>
          For visitors in the European Economic Area or United Kingdom, we rely on the following
          legal bases:
        </p>
        <LegalList>
          <li>
            <strong className="text-[var(--color-text-primary)]">Consent</strong> — for email
            subscriptions, push notifications, and optional analytics.
          </li>
          <li>
            <strong className="text-[var(--color-text-primary)]">Legitimate interests</strong> — for
            security logging, error reporting, and operating the site.
          </li>
        </LegalList>
        <p>
          You may withdraw consent at any time (see Section 8). For questions about EU/UK data
          processing, contact{' '}
          <a
            href="mailto:privacy@theobserverus.com"
            className="text-[var(--color-accent)] hover:underline"
          >
            privacy@theobserverus.com
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="7. California Privacy Rights (CCPA/CPRA)">
        <p>
          California residents have the right to know what personal information we collect, request
          deletion, and opt out of any &ldquo;sale&rdquo; or &ldquo;sharing&rdquo; of personal
          information. We do not sell or share personal information as those terms are defined under
          the California Consumer Privacy Act, as amended by the CPRA.
        </p>
        <p>
          To exercise your rights, email{' '}
          <a
            href="mailto:privacy@theobserverus.com"
            className="text-[var(--color-accent)] hover:underline"
          >
            privacy@theobserverus.com
          </a>
          . We will not discriminate against you for exercising your privacy rights.
        </p>
      </LegalSection>

      <LegalSection title="8. Your Choices and Rights">
        <LegalList>
          <li>
            <strong className="text-[var(--color-text-primary)]">Unsubscribe from email</strong> — use
            the link in any email, or visit{' '}
            <a href="/unsubscribe" className="text-[var(--color-accent)] hover:underline">
              /unsubscribe
            </a>
            .
          </li>
          <li>
            <strong className="text-[var(--color-text-primary)]">Disable push</strong> — use your
            browser&apos;s site settings to block or remove notifications.
          </li>
          <li>
            <strong className="text-[var(--color-text-primary)]">Access / delete / correct</strong> —
            email{' '}
            <a
              href="mailto:privacy@theobserverus.com"
              className="text-[var(--color-accent)] hover:underline"
            >
              privacy@theobserverus.com
            </a>{' '}
            and we will action verifiable requests within applicable timeframes (generally 30 days
            under CCPA, one month under GDPR).
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="9. Data Retention and Security">
        <p>
          We keep personal data only as long as necessary for the purposes above. Email and push
          subscriptions are retained until you unsubscribe. Server logs are retained briefly. We use
          reasonable technical and organizational measures to protect your data, but no online
          service can guarantee absolute security.
        </p>
      </LegalSection>

      <LegalSection title="10. Children">
        <p>
          The Observer US is not directed to children under 13, and we do not knowingly collect
          personal information from them.
        </p>
      </LegalSection>

      <LegalSection title="11. Changes to This Policy">
        <p>
          We may update this policy as our practices evolve. Material changes will be reflected by
          the &ldquo;Last updated&rdquo; date above. Continued use after changes constitutes
          acceptance of the revised policy.
        </p>
      </LegalSection>

      <LegalSection title="12. Contact">
        <p>
          Privacy questions or requests:{' '}
          <a
            href="mailto:privacy@theobserverus.com"
            className="text-[var(--color-accent)] hover:underline"
          >
            privacy@theobserverus.com
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  )
}
