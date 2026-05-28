import type { Metadata } from 'next';
import { FAQ, FAQSchema, type FAQItem } from '@/components/FAQ';
import { SectionHeader } from '@/components/SectionHeader';
import { BreadcrumbsJsonLd } from '@/components/Breadcrumbs';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Frequently Asked Questions',
  description:
    "Answers to the most common questions about first-year baby costs, our calculator's methodology, sources, monetization, and what it does and doesn't include.",
  path: '/faq',
  type: 'article',
});

const faq: FAQItem[] = [
  {
    q: 'How accurate is this calculator?',
    a: "It's a planning tool, not a quote. We model the major variables — state, childcare type, feeding plan, gear tier, registry help, insurance — using public data and current retail snapshots. The result is a realistic range, not a single dollar amount. Your actual cost can land anywhere inside that range based on your specific provider, hospital, and choices.",
  },
  {
    q: 'Why use ranges instead of a single estimate?',
    a: "Because that's how baby costs actually work. Two families in the same state with the same insurance can pay very different amounts. Forcing a single number creates false precision and misleads parents.",
  },
  {
    q: 'Is the data updated?',
    a: 'We review assumptions periodically and re-anchor to public data releases (CDC, KFF, Child Care Aware) and retail snapshots when available. Each data block carries a "last reviewed" date.',
  },
  {
    q: 'Do you sell my data?',
    a: "No. The calculators themselves require no signup — all calculations happen in your browser and no inputs are sent to any server. If you choose to submit your email address through the optional 'budget workbook' form, we store it only to email you the workbook and occasional data updates; every email has a one-click unsubscribe. We never sell, rent, or trade your data. We use lightweight analytics (page views) and may serve ads, both of which are disclosed in our privacy policy.",
  },
  {
    q: 'How do you make money?',
    a: 'Through ads and, eventually, affiliate links to baby-related products. Affiliate links are always disclosed and never affect what we recommend. We do not sell rankings or product placement.',
  },
  {
    q: 'Can I download the budget?',
    a: "Yes — use the Print / save PDF button in the calculator's results panel to save a snapshot of your estimate.",
  },
  {
    q: "Do you handle multiples (twins, triplets)?",
    a: 'Not yet — the current calculator assumes one baby. Twins typically run about 1.7–1.9× the first-year cost (you save on some gear and clothes, but daycare, diapers, and formula scale linearly). We may add a multiples mode in a future update.',
  },
  {
    q: 'Why is uninsured so much more expensive?',
    a: 'Uninsured families are typically billed full retail rates, which can be 3–5× what insurance plans negotiate. Many states automatically enroll pregnant individuals in Medicaid or CHIP if income qualifies — check before assuming uninsured costs.',
  },
  {
    q: 'Do you cover Canada or other countries?',
    a: 'Currently U.S. only. The childcare data, insurance categories, and birth costs are all U.S.-specific. We may add other countries in the future.',
  },
  {
    q: "Where can I see what changed in your assumptions?",
    a: 'The methodology page lists all data sources with a "last reviewed" date. Significant changes will eventually be tracked in a changelog.',
  },
];

export default function Page() {
  return (
    <>
      <FAQSchema items={faq} />
      <BreadcrumbsJsonLd
        items={[
          { name: 'Home', url: 'https://firstyearcost.com/' },
          { name: 'FAQ', url: 'https://firstyearcost.com/faq' },
        ]}
      />
      <section className="hero-bg">
        <div className="container-pg pt-12 pb-8 md:pt-16 md:pb-10">
          <div className="max-w-2xl">
            <p className="pill pill-teal mb-3">Help & FAQ</p>
            <h1 className="h1 text-ink-900">Frequently asked questions</h1>
            <p className="lede mt-4">
              Common questions about the calculator, our methodology, and how the site works.
            </p>
          </div>
        </div>
      </section>

      <section className="container-pg pb-16">
        <div className="max-w-3xl">
          <FAQ items={faq} />
        </div>
      </section>
    </>
  );
}
