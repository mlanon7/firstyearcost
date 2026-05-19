import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'FirstYearCost.com terms of use.',
  alternates: { canonical: '/terms' },
  robots: { index: false, follow: true },
  openGraph: {
    title: 'Terms of Use — FirstYearCost',
    description: 'FirstYearCost.com terms of use.',
    url: '/terms',
    type: 'article',
  },
};

export default function Page() {
  return (
    <article className="container-pg py-12 max-w-3xl prose-custom">
      <h1 className="h1 text-ink-900 mb-4">Terms of Use</h1>
      <p className="text-sm text-ink-500 mb-8">Last updated: 2026-04-30</p>

      <h2>Planning estimates only</h2>
      <p>
        FirstYearCost.com provides planning estimates for first-year baby costs in the United States. Nothing
        on this site is medical, financial, legal, or insurance advice. Costs vary widely by location, provider,
        plan, and family choices. We do not guarantee accuracy, completeness, or fitness for any purpose.
      </p>

      <h2>No professional advice</h2>
      <p>
        Decisions about pediatric care, infant feeding, formula selection, insurance enrollment, and financial
        planning should be made with appropriate professionals — your pediatrician, insurance representative, HR
        team, financial advisor, or attorney. The calculators here are educational tools, not substitutes for
        professional guidance.
      </p>

      <h2>Permitted use</h2>
      <p>
        You may use the site for personal, non-commercial planning purposes. You may not copy substantial portions
        of the site, scrape the data, or republish it without permission. You may screenshot or print your own
        estimate for personal use.
      </p>

      <h2>Third-party content & links</h2>
      <p>
        We link to third-party websites for source attribution and affiliate purposes. We are not responsible
        for the content or practices of third-party sites.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, FirstYearCost.com and its operators are not liable for any
        direct, indirect, incidental, or consequential losses arising from use of the site or reliance on its
        estimates.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these terms as the site evolves. The "last updated" date reflects the most recent change.
      </p>
    </article>
  );
}
