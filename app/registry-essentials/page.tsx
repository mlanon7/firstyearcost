import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Clock, ShieldAlert } from 'lucide-react';
import { gearCosts, gearItemMeta } from '@/data/assumptions';
import { formatUSD } from '@/lib/format';
import { SectionHeader } from '@/components/SectionHeader';
import { AdSlot } from '@/components/AdSlot';
import { FAQ, FAQSchema, type FAQItem } from '@/components/FAQ';
import { Disclaimer } from '@/components/Disclaimer';
import { AffiliateLink, AffiliateDisclosure } from '@/components/AffiliateLink';
import { BreadcrumbsJsonLd, ArticleJsonLd } from '@/components/Breadcrumbs';

const URL = 'https://firstyearcost.com/registry-essentials';

export const metadata: Metadata = {
  title: 'Baby Registry Essentials Checklist (2026) — What to Actually Buy',
  description:
    "A practical baby registry checklist sorted into must-have-before-birth, safety-buy-new, and can-wait categories. Built around our gear cost data so the registry total matches reality.",
  alternates: { canonical: '/registry-essentials' },
  openGraph: {
    title: 'Baby Registry Essentials Checklist (2026)',
    description:
      "Must-have-before-birth, safety-buy-new, and can-wait — sorted with real cost ranges from our gear database.",
    url: '/registry-essentials',
    type: 'article',
  },
};

const faq: FAQItem[] = [
  {
    q: 'Do I need everything on a standard registry checklist?',
    a: "No. Most published registry checklists are 80+ items long and overcount. Realistically, ~14 items are 'must-have-before-birth' — and only about 6 of those need to be bought brand-new for safety reasons. The rest can wait, be hand-me-downs, or be skipped entirely.",
  },
  {
    q: 'What absolutely must be bought new?',
    a: 'Car seats (older than the expiration date or that have been in a crash are unsafe), crib mattresses (used mattresses are linked to higher SIDS risk per AAP studies), and bottle nipples (rubber breaks down). Cribs themselves must meet 2011+ CPSC standards; if you can verify that, secondhand is fine. Anything with motors, batteries, or fabric in contact with the baby that you can\'t verify is usually best bought new.',
  },
  {
    q: 'What can safely be secondhand?',
    a: 'Strollers, carriers, high chairs (check current recalls), bouncers, play mats, books, toys, clothing, bath gear, swaddles. Dressers, gliders, nightlights, and most "nice-to-have" items are excellent hand-me-down candidates.',
  },
  {
    q: 'When should we make the registry?',
    a: "Most parents finalize the registry around weeks 20–28. That gives shower-throwers time to coordinate, and avoids the impulse-add reflex that hits in the last month. Aim for the registry to be done by week 32.",
  },
  {
    q: 'Which registry platform is best?',
    a: "Babylist allows adding items from any retailer (Amazon, Target, small DTC brands, even cash funds), which is the killer feature for most parents. Amazon's registry is simpler but limited to Amazon SKUs. Target and Walmart registries each include a welcome box and completion discount but limit you to their own catalog.",
  },
];

type Tier = 'must' | 'wait' | 'safety';

function tierOf(key: string): Tier {
  const m = gearItemMeta[key];
  if (m?.safetyNew) return 'safety';
  if (m?.mustHave) return 'must';
  return 'wait';
}

export default function Page() {
  const groups: Record<Tier, string[]> = { safety: [], must: [], wait: [] };
  for (const k of Object.keys(gearItemMeta)) groups[tierOf(k)].push(k);

  const standardTotal = Object.values(gearCosts).reduce((s, x) => s + x.standard, 0);
  const budgetTotal = Object.values(gearCosts).reduce((s, x) => s + x.budget, 0);

  return (
    <>
      <FAQSchema items={faq} />
      <ArticleJsonLd
        title="Baby Registry Essentials Checklist (2026)"
        description="A registry checklist sorted into must-have-before-birth, buy-new-for-safety, and can-wait."
        url={URL}
      />
      <BreadcrumbsJsonLd
        items={[
          { name: 'Home', url: 'https://firstyearcost.com/' },
          { name: 'Registry essentials', url: URL },
        ]}
      />

      <section className="hero-bg">
        <div className="container-pg pt-12 pb-8 md:pt-16 md:pb-10">
          <div className="max-w-3xl">
            <p className="pill pill-teal mb-3">Registry checklist</p>
            <h1 className="h1 text-ink-900">The registry checklist that doesn't oversell you.</h1>
            <p className="lede mt-4">
              Sorted into three buckets: <strong>must-have before birth</strong>,{' '}
              <strong>safety — buy new</strong>, and <strong>can wait</strong>.
              Cost ranges come from our gear database, so the total matches
              what you'll actually spend.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/baby-gear-budget" className="btn btn-accent">
                Open gear budget planner <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="#checklist" className="btn btn-ghost">
                Jump to checklist
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container-pg pb-10">
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="card p-5">
            <p className="text-xs uppercase tracking-wider text-ink-500 font-semibold">Budget-tier total</p>
            <p className="text-3xl font-extrabold mt-1 text-teal-700 tabular-nums">{formatUSD(budgetTotal)}</p>
            <p className="text-xs text-ink-500 mt-1">All 20 items, lowest tier each.</p>
          </div>
          <div className="card p-5">
            <p className="text-xs uppercase tracking-wider text-ink-500 font-semibold">Standard-tier total</p>
            <p className="text-3xl font-extrabold mt-1 text-ink-900 tabular-nums">{formatUSD(standardTotal)}</p>
            <p className="text-xs text-ink-500 mt-1">Mainstream brands across the board.</p>
          </div>
          <div className="card p-5">
            <p className="text-xs uppercase tracking-wider text-ink-500 font-semibold">Must-have count</p>
            <p className="text-3xl font-extrabold mt-1 text-coral-600 tabular-nums">
              {groups.must.length + groups.safety.length}
            </p>
            <p className="text-xs text-ink-500 mt-1">of 20 items rated must-have before birth.</p>
          </div>
        </div>
      </section>

      <section id="checklist" className="container-pg pb-12">
        <SectionHeader
          eyebrow="The list"
          title="What to actually put on the registry"
        />

        <Group
          title="Buy new for safety"
          icon={<ShieldAlert className="w-5 h-5" />}
          accent="coral"
          keys={groups.safety}
          subtitle="These items have safety or hygiene reasons to buy new — recall history, expiration dates, or materials that degrade."
        />

        <Group
          title="Must-have before birth"
          icon={<CheckCircle2 className="w-5 h-5" />}
          accent="teal"
          keys={groups.must}
          subtitle="You'll want these in the house before week 36. Secondhand is fine if verified working and within current safety guidance."
        />

        <Group
          title="Can wait or skip"
          icon={<Clock className="w-5 h-5" />}
          accent="sun"
          keys={groups.wait}
          subtitle="Add to the registry if guests want to give them, but you don't need them on day one. Some are nice-to-haves; some you may skip entirely."
        />

        <div className="mt-6">
          <AffiliateDisclosure />
        </div>
      </section>

      <div className="container-pg my-6">
        <AdSlot size="leaderboard" label="Sponsored" />
      </div>

      <section className="container-pg pb-12 max-w-3xl">
        <div className="prose-custom">
          <h2>Where to make the registry</h2>
          <p>
            We don't recommend a specific platform — they're roughly equivalent
            and the choice usually comes down to where your friends/family already
            shop. Quick guide:
          </p>
          <ul>
            <li>
              <strong>
                <AffiliateLink href="https://www.babylist.com" merchant="babylist" product="registry">
                  Babylist
                </AffiliateLink>
              </strong>{' '}
              — best for cross-retailer registries. Add items from anywhere, including small DTC brands, plus cash funds for daycare, diaper subscriptions, or postpartum care.
            </li>
            <li>
              <strong>Amazon Baby Registry</strong> — simplest interface; 15% completion discount; limited to Amazon SKUs.
            </li>
            <li>
              <strong>Target Baby Registry</strong> — welcome box, 15% completion discount, in-store returns.
            </li>
            <li>
              <strong>Walmart Baby Registry</strong> — welcome box, free shipping on most items.
            </li>
          </ul>

          <h2>What to do with the "can wait" list</h2>
          <p>
            Many parents register for everything, then realize 3 months in that
            half of it goes unused. A better pattern: keep the registry list
            tight to must-haves, and treat "can wait" items as month-3 or
            month-6 additions if and when you find you need them. Most baby
            registries allow editing post-birth.
          </p>

          <h2>Budget reality check</h2>
          <p>
            The standard-tier total above ({formatUSD(standardTotal)}) assumes
            you buy every item brand-new at mainstream brands. With registry
            help, hand-me-downs, and shower gifts, most parents end up paying
            <strong> 35–55%</strong> of this total out of pocket. Our{' '}
            <Link href="/baby-gear-budget">gear budget planner</Link> models
            that offset.
          </p>
        </div>
      </section>

      <section className="container-pg pb-16 max-w-3xl">
        <Disclaimer>
          <strong>Safety guidance is not medical or product advice.</strong>{' '}
          Always check current CPSC recalls and AAP safe-sleep guidance before
          using any product — new or secondhand. We do not recommend specific
          brands of car seats, cribs, or sleep products on this page.
        </Disclaimer>
      </section>

      <section className="container-pg pb-16">
        <SectionHeader title="Frequently asked questions" eyebrow="FAQ" />
        <div className="mt-6 max-w-3xl">
          <FAQ items={faq} />
        </div>
      </section>
    </>
  );
}

function Group({
  title,
  subtitle,
  icon,
  keys,
  accent,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  keys: string[];
  accent: 'teal' | 'coral' | 'sun';
}) {
  const dot =
    accent === 'teal' ? 'bg-teal-100 text-teal-700'
    : accent === 'coral' ? 'bg-coral-100 text-coral-700'
    : 'bg-sun-100 text-sun-800';
  return (
    <div className="mt-8">
      <div className="flex items-center gap-3">
        <span className={`inline-flex w-9 h-9 rounded-xl items-center justify-center ${dot}`}>{icon}</span>
        <div>
          <h3 className="h4 text-ink-900">{title}</h3>
          <p className="text-sm text-ink-600 mt-0.5">{subtitle}</p>
        </div>
      </div>
      <div className="mt-4 card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-ink-50 text-ink-600 text-xs uppercase tracking-wider">
              <tr>
                <th className="text-left font-semibold px-4 py-2.5">Item</th>
                <th className="text-right font-semibold px-4 py-2.5">Budget</th>
                <th className="text-right font-semibold px-4 py-2.5">Standard</th>
                <th className="text-right font-semibold px-4 py-2.5 hidden sm:table-cell">Premium</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {keys.map((k) => {
                const m = gearItemMeta[k];
                const c = gearCosts[k];
                return (
                  <tr key={k}>
                    <td className="px-4 py-2.5 font-medium text-ink-900">{m.label}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-ink-700">{formatUSD(c.budget)}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-ink-900 font-semibold">{formatUSD(c.standard)}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-ink-700 hidden sm:table-cell">{formatUSD(c.premium)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
