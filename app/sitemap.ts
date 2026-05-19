import type { MetadataRoute } from 'next';
import { stateChildcare, slugifyState } from '@/data/stateChildcare';
import { stateLeave } from '@/data/stateLeave';

const SITE = 'https://firstyearcost.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE}/`,                                   lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${SITE}/childcare-calculator`,               lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${SITE}/diaper-calculator`,                  lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE}/formula-vs-breastfeeding-calculator`,lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE}/baby-gear-budget`,                   lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE}/birth-insurance-planner`,            lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE}/childcare-subsidy-calculator`,       lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE}/c-section-vs-vaginal-cost`,          lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE}/second-baby-cost`,                   lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE}/registry-essentials`,                lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE}/state-childcare-costs`,              lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE}/maternity-leave-by-state`,           lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE}/monthly-baby-budget`,                lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE}/daycare-vs-nanny-cost`,              lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE}/methodology`,                        lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE}/faq`,                                lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE}/privacy`,                            lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${SITE}/terms`,                              lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
  ];

  const childcareStatePages: MetadataRoute.Sitemap = stateChildcare.map((s) => ({
    url: `${SITE}/state-childcare-costs/${slugifyState(s.name)}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const leaveStatePages: MetadataRoute.Sitemap = stateLeave.map((s) => ({
    url: `${SITE}/maternity-leave-by-state/${slugifyState(s.name)}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticPages, ...childcareStatePages, ...leaveStatePages];
}
