import type { MetadataRoute } from 'next';

// Single source of truth for robots.txt. The previous static `public/robots.txt`
// was removed — Next.js now generates this dynamically.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: 'https://firstyearcost.com/sitemap.xml',
    host: 'https://firstyearcost.com',
  };
}
