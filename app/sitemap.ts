import type { MetadataRoute } from 'next';
import { stateChildcare, slugifyState } from '@/data/stateChildcare';
import { stateLeave } from '@/data/stateLeave';
import { REVIEW_DATES, reviewDateFor, type ReviewedRoute } from '@/lib/reviewDates';

const SITE = 'https://firstyearcost.com';

function d(s: string): Date { return new Date(s + 'T00:00:00Z'); }

// changeFrequency + priority per static route. Review dates come from the
// shared lib/reviewDates.ts map (also used by Article/Dataset JSON-LD).
const STATIC_META: { path: ReviewedRoute; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; priority: number }[] = [
  { path: '/',                                   changeFrequency: 'weekly',  priority: 1.0 },
  { path: '/childcare-calculator',               changeFrequency: 'weekly',  priority: 0.9 },
  { path: '/diaper-calculator',                  changeFrequency: 'monthly', priority: 0.8 },
  { path: '/formula-vs-breastfeeding-calculator',changeFrequency: 'monthly', priority: 0.8 },
  { path: '/baby-gear-budget',                   changeFrequency: 'monthly', priority: 0.8 },
  { path: '/birth-insurance-planner',            changeFrequency: 'monthly', priority: 0.8 },
  { path: '/childcare-subsidy-calculator',       changeFrequency: 'monthly', priority: 0.9 },
  { path: '/c-section-vs-vaginal-cost',          changeFrequency: 'monthly', priority: 0.8 },
  { path: '/second-baby-cost',                   changeFrequency: 'monthly', priority: 0.7 },
  { path: '/registry-essentials',                changeFrequency: 'monthly', priority: 0.8 },
  { path: '/state-childcare-costs',              changeFrequency: 'monthly', priority: 0.8 },
  { path: '/maternity-leave-by-state',           changeFrequency: 'monthly', priority: 0.8 },
  { path: '/monthly-baby-budget',                changeFrequency: 'monthly', priority: 0.7 },
  { path: '/daycare-vs-nanny-cost',              changeFrequency: 'monthly', priority: 0.7 },
  { path: '/methodology',                        changeFrequency: 'monthly', priority: 0.5 },
  { path: '/faq',                                changeFrequency: 'monthly', priority: 0.5 },
  { path: '/privacy',                            changeFrequency: 'yearly',  priority: 0.3 },
  { path: '/terms',                              changeFrequency: 'yearly',  priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = STATIC_META.map((m) => ({
    url: `${SITE}${m.path === '/' ? '/' : m.path}`,
    lastModified: d(REVIEW_DATES[m.path]),
    changeFrequency: m.changeFrequency,
    priority: m.priority,
  }));

  const childcareReviewed = d(reviewDateFor('/state-childcare-costs'));
  const childcareStatePages: MetadataRoute.Sitemap = stateChildcare.map((s) => ({
    url: `${SITE}/state-childcare-costs/${slugifyState(s.name)}`,
    lastModified: childcareReviewed,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const leaveReviewed = d(reviewDateFor('/maternity-leave-by-state'));
  const leaveStatePages: MetadataRoute.Sitemap = stateLeave.map((s) => ({
    url: `${SITE}/maternity-leave-by-state/${slugifyState(s.name)}`,
    lastModified: leaveReviewed,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticPages, ...childcareStatePages, ...leaveStatePages];
}
