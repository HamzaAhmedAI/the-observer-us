/* ============================================================
   The Observer US — Terms of Service
   ============================================================ */

import type { Metadata } from 'next'
import { LegalPage, LegalSection, LegalList } from '@/components/reader/LegalPage'
import { SITE_NAME } from '@/lib/seo'

export const metadata: Metadata = {
  title: `Terms of Service — ${SITE_NAME}`,
  description:
    'The terms governing your use of The Observer US, including content rights, acceptable use, and disclaimers.',
  alternates: { canonical: '/terms' },
  robots: { index: true, follow: true },
}

export const revalidate = 86400

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      intro="These terms govern your use of The Observer US. By accessing the site, you agree to them."
      lastUpdated="August 21, 2026"
    >
      <LegalSection title="1. Acceptance of Terms">
        <p>
          By accessing or using <strong className="text-[var(--color-text-primary)]">The Observer
          US</strong> (the &ldquo;site&rdquo;), you agree to these Terms of Service. If you do not
          agree, please do not use the site.
        </p>
      </LegalSection>

      <LegalSection title="2. Content and Intellectual Property">
        <LegalList>
          <li>
            All articles, graphics, logos, and original content on the site are owned by The Observer
            US or its licensors and are protected by copyright and other laws.
          </li>
          <li>
            You may read and share links to our content freely. You may not reproduce, republish, or
            redistribute substantial portions of our content without prior written permission.
          </li>
          <li>
            Our name, logo, and mark (&ldquo;The Observer US&rdquo;) may not be used in a way that
            implies endorsement or affiliation without permission.
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="3. AI-Assisted Content">
        <p>
          Some content is produced with AI assistance and reviewed by human editors before
          publication. Content is provided for general informational purposes and may contain
          errors. Always verify critical information through primary sources.
        </p>
      </LegalSection>

      <LegalSection title="4. Acceptable Use">
        <p>You agree not to:</p>
        <LegalList>
          <li>Use the site for unlawful, fraudulent, or abusive purposes.</li>
          <li>Attempt to disrupt, overload, or gain unauthorized access to the site or its systems.</li>
          <li>Scrape, harvest, or systematically extract data beyond reasonable personal use.</li>
          <li>Impersonate others or misrepresent your affiliation with us.</li>
          <li>Infringe the intellectual property or privacy rights of others.</li>
        </LegalList>
      </LegalSection>

      <LegalSection title="5. Submissions and Tips">
        <p>
          If you submit information, tips, or corrections, you grant us a non-exclusive right to use,
          review, and (where appropriate) publish them, and you represent that you have the right to
          share that information. We are not obligated to publish submissions.
        </p>
      </LegalSection>

      <LegalSection title="6. Third-Party Links and Services">
        <p>
          The site may link to third-party websites or services (including social platforms and
          external sources referenced in articles). We are not responsible for their content,
          practices, or availability.
        </p>
      </LegalSection>

      <LegalSection title="7. Disclaimers">
        <LegalList>
          <li>
            The site and its content are provided &ldquo;as is&rdquo; without warranties of any kind,
            express or implied.
          </li>
          <li>
            We do not warrant that the site will be uninterrupted, error-free, or secure, or that
            content is complete or current.
          </li>
          <li>
            Nothing on the site constitutes legal, financial, medical, or professional advice. For
            such matters, consult a qualified professional.
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="8. Limitation of Liability">
        <p>
          To the maximum extent permitted by law, The Observer US and its operators shall not be
          liable for any indirect, incidental, or consequential damages arising from your use of, or
          inability to use, the site.
        </p>
      </LegalSection>

      <LegalSection title="9. Indemnification">
        <p>
          You agree to indemnify The Observer US against claims arising from your misuse of the site
          or violation of these terms.
        </p>
      </LegalSection>

      <LegalSection title="10. Termination">
        <p>
          We may suspend or block access to the site for conduct that violates these terms or
          applicable law, without prior notice where appropriate.
        </p>
      </LegalSection>

      <LegalSection title="11. Governing Law">
        <p>
          These terms are governed by the laws of the State of Delaware, USA, without regard to
          conflict-of-law principles. Disputes should first be raised with us at{' '}
          <a
            href="mailto:legal@theobserverus.com"
            className="text-[var(--color-accent)] hover:underline"
          >
            legal@theobserverus.com
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="12. Changes">
        <p>
          We may update these terms from time to time. Continued use after changes constitutes
          acceptance of the revised terms. The &ldquo;Last updated&rdquo; date reflects the latest
          revision.
        </p>
      </LegalSection>

      <LegalSection title="13. Contact">
        <p>
          Questions about these terms:{' '}
          <a
            href="mailto:legal@theobserverus.com"
            className="text-[var(--color-accent)] hover:underline"
          >
            legal@theobserverus.com
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  )
}
