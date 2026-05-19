import type { MetadataRoute } from 'next';
import { stateChildcare, slugifyState } from '@/data/stateChildcare';
import { stateLeave } from '@/data/stateLeave';

// Per-route review dates. Update when the underlying CSV / page content is
// reviewed and changed. Using real dates here is better than `new Date()` —
// crawlers down-weight sitemaps that report every URL as freshly updated
// every build.
//
// Convention: when you change a page's data or copy, bump that route's date.
// When a 50-state CSV is updated (state_childcare.csv, state_leave.csv) bump
// the corresponding shared date once; per-state pages inherit it.
const REVIEWED = {
  '/':                                  '2026-05-18', // v3 hero + lead magnet
  '/childcare-calculator':              '2026-05-08',
  '/diaper-calculator':                 '2026-05-08',
  '/formula-vs-breastfeeding-calculator':'2026-05-08',
  '/baby-gear-budget':                  '2026-05-08',
  '/birth-insurance-planner':           '2026-05-08',
  '/childcare-subsidy-calculator':      '2026-05-18', // 2026 OBBBA values applied
  '/c-section-vs-vaginal-cost':         '2026-05-18',
  '/second-baby-cost':                  '2026-05-18', // OBBBA FSA cap fix
  '/registry-essentials':               '2026-05-17',
  '/state-childcare-costs':             '2026-04-30', // state CSV last reviewed
  '/maternity-leave-by-state':          '2026-05-01', // state_leave CSV last reviewed
  '/monthly-baby-budget':               '2026-05-08',
  '/daycare-vs-nanny-cost':             '2026-05-08',
  '/methodology':                       '2026-05-18',
  '/faq':                               '2026-05-08',
  '/privacy':                           '2026-04-15',
  '/terms':                             '2026-04-15',
} as const;

const SITE = 'https://firstyearcost.com';

function d(s: string): Date { return new Date(s + 'T00:00:00Z'); }

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE}/`,                                    lastModified: d(REVIEWED['/']),                                    changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${SITE}/childcare-calculator`,                lastModified: d(REVIEWED['/childcare-calculator']),                changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${SITE}/diaper-calculator`,                   lastModified: d(REVIEWED['/diaper-calculator']),                   changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE}/formula-vs-breastfeeding-calculator`, lastModified: d(REVIEWED['/formula-vs-breastfeeding-calculator']), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE}/baby-gear-budget`,                    lastModified: d(REVIEWED['/baby-gear-budget']),                    changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE}/birth-insurance-planner`,             lastModified: d(REVIEWED['/birth-insurance-planner']),             changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE}/childcare-subsidy-calculator`,        lastModified: d(REVIEWED['/childcare-subsidy-calculator']),        changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE}/c-section-vs-vaginal-cost`,           lastModified: d(REVIEWED['/c-section-vs-vaginal-cost']),           changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE}/second-baby-cost`,                    lastModified: d(REVIEWED['/second-baby-cost']),                    changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE}/registry-essentials`,                 lastModified: d(REVIEWED['/registry-essentials']),                 changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE}/state-childcare-costs`,               lastModified: d(REVIEWED['/state-childcare-costs']),               changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE}/maternity-leave-by-state`,            lastModified: d(REVIEWED['/maternity-leave-by-state']),            changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE}/monthly-baby-budget`,                 lastModified: d(REVIEWED['/monthly-baby-budget']),                 changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE}/daycare-vs-nanny-cost`,               lastModified: d(REVIEWED['/daycare-vs-nanny-cost']),               changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE}/methodology`,                         lastModified: d(REVIEWED['/methodology']),                         changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE}/faq`,                                 lastModified: d(REVIEWED['/faq']),                                 changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE}/privacy`,                             lastModified: d(REVIEWED['/privacy']),                             changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${SITE}/terms`,                               lastModified: d(REVIEWED['/terms']),                               changeFrequency: 'yearly',  priority: 0.3 },
  ];

  const childcareReviewed = d(REVIEWED['/state-childcare-costs']);
  const childcareStatePages: MetadataRoute.Sitemap = stateChildcare.map((s) => ({
    url: `${SITE}/state-childcare-costs/${slugifyState(s.name)}`,
    lastModified: childcareReviewed,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const leaveReviewed = d(REVIEWED['/maternity-leave-by-state']);
  const leaveStatePages: MetadataRoute.Sitemap = stateLeave.map((s) => ({
    url: `${SITE}/maternity-leave-by-state/${slugifyState(s.name)}`,
    lastModified: leaveReviewed,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticPages, ...childcareStatePages, ...leaveStatePages];
}
