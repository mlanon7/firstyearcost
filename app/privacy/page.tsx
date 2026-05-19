import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'FirstYearCost.com privacy policy — what we collect, how we use it, and how to contact us.',
  alternates: { canonical: '/privacy' },
  robots: { index: false, follow: true },
  openGraph: {
    title: 'Privacy Policy — FirstYearCost',
    description: 'What FirstYearCost.com collects, how we use it, and how to contact us.',
    url: '/privacy',
    type: 'article',
  },
};

export default function Page() {
  return (
    <article className="container-pg py-12 max-w-3xl prose-custom">
      <h1 className="h1 text-ink-900 mb-4">Privacy Policy</h1>
      <p className="text-sm text-ink-500 mb-8">Last updated: 2026-04-30</p>

      <p>
        FirstYearCost.com ("we," "us," "our") respects your privacy. This page explains what data we
        collect, how we use it, and the choices you have.
      </p>

      <h2>What we collect</h2>
      <p>
        We collect very little. There is no account, no email signup, and no contact form on this site.
        Calculator inputs are processed entirely in your browser and are not sent to our servers.
      </p>
      <p>
        We may collect aggregated, non-identifying analytics — like which pages are most visited and which
        calculators are used — to improve the site. We do not link this data to your identity.
      </p>

      <h2>Cookies</h2>
      <p>
        We may use cookies for basic site functionality, to remember your cookie preferences, and to support
        third-party services like analytics or advertising. The first time you visit, we show a banner letting
        you accept or decline non-essential cookies.
      </p>

      <h2>Advertising</h2>
      <p>
        We may display advertisements served by third-party ad networks (such as Google AdSense). These
        networks may use cookies and similar technologies to serve ads based on your prior visits to this
        site or other sites. Google's use of advertising cookies enables it and its partners to serve ads to
        users based on their visit to this and other sites on the Internet. Users may opt out of personalized
        advertising by visiting{' '}
        <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
          Google Ads Settings
        </a>{' '}or{' '}
        <a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer">
          aboutads.info
        </a>.
      </p>

      <h2>Affiliate links</h2>
      <p>
        Some links on this site may be affiliate links, meaning we may earn a small commission when you click
        through and make a purchase on a partner site at no extra cost to you. We always mark affiliate links
        with a disclosure. Our editorial assumptions and recommendations are not influenced by commission rates.
      </p>

      <h2>Data we don't collect</h2>
      <ul>
        <li>We don't collect personally identifiable information (name, email, address) unless you choose to email us.</li>
        <li>We don't sell, rent, or trade your data.</li>
        <li>We don't store calculator inputs on our servers.</li>
        <li>We don't use behavioral profiling to determine the calculator's outputs.</li>
      </ul>

      <h2>Children</h2>
      <p>
        Our site is intended for adults planning for a baby. We do not knowingly collect personal information
        from children under 13.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this policy as the site evolves. The "last updated" date at the top of this page reflects
        the most recent change.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about privacy? Email <a href="mailto:hello@firstyearcost.com">hello@firstyearcost.com</a>.
      </p>
    </article>
  );
}
