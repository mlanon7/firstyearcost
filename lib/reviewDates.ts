// Single source of truth for per-route review dates.
//
// Used by:
//   - app/sitemap.ts          → <lastmod> per URL
//   - ArticleJsonLd / DatasetJsonLd → dateModified in structured data
//   - any visible "Last reviewed" badge
//
// Convention: when you change a page's data or copy, bump that route's date.
// When a 50-state CSV is updated (state_childcare.csv, state_leave.csv) bump
// the corresponding shared date once; per-state pages inherit it via
// reviewDateFor().

export const REVIEW_DATES = {
  '/':                                   '2026-05-18', // v3 hero + lead magnet
  '/childcare-calculator':               '2026-05-08',
  '/diaper-calculator':                  '2026-05-08',
  '/formula-vs-breastfeeding-calculator':'2026-05-08',
  '/baby-gear-budget':                   '2026-05-08',
  '/birth-insurance-planner':            '2026-05-08',
  '/childcare-subsidy-calculator':       '2026-05-19', // 2026 OBBBA values + step copy
  '/dependent-care-fsa-vs-tax-credit':   '2026-06-13', // new FSA-vs-CDCTC comparison page
  '/c-section-vs-vaginal-cost':          '2026-05-19',
  '/second-baby-cost':                   '2026-05-18',
  '/registry-essentials':                '2026-05-17',
  '/state-childcare-costs':              '2026-04-30', // state CSV last reviewed
  '/maternity-leave-by-state':           '2026-05-19', // state_leave CSV refresh
  '/monthly-baby-budget':                '2026-05-08',
  '/daycare-vs-nanny-cost':              '2026-05-08',
  '/methodology':                        '2026-05-21', // download table added
  '/faq':                                '2026-05-08',
  '/privacy':                            '2026-04-15',
  '/terms':                              '2026-04-15',
} as const;

export type ReviewedRoute = keyof typeof REVIEW_DATES;

const SITE_LAUNCH_FALLBACK = '2026-05-01';

/**
 * Review date (YYYY-MM-DD) for a route path. Per-state pages inherit their
 * hub's date: `/state-childcare-costs/california` → `/state-childcare-costs`,
 * `/maternity-leave-by-state/texas` → `/maternity-leave-by-state`.
 */
export function reviewDateFor(path: string): string {
  if (path in REVIEW_DATES) return REVIEW_DATES[path as ReviewedRoute];
  if (path.startsWith('/state-childcare-costs/')) return REVIEW_DATES['/state-childcare-costs'];
  if (path.startsWith('/maternity-leave-by-state/')) return REVIEW_DATES['/maternity-leave-by-state'];
  return SITE_LAUNCH_FALLBACK;
}
