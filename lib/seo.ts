import type { Metadata } from 'next';

// Single source of truth for per-page metadata.
//
// Next.js 14 App Router REPLACES (not deep-merges) the `openGraph` and
// `twitter` objects when a child segment sets them. Before this helper,
// pages that overrode `openGraph` (e.g. every calculator + state page)
// silently dropped og:site_name, og:locale, og:image, twitter:image,
// twitter:title, and twitter:description from the layout's defaults —
// which is what Ahrefs flagged as "Open Graph tags incomplete" on 66
// pages. Pages now call `buildPageMetadata()` and get a complete OG +
// Twitter card without per-page boilerplate.
//
// Pages with their own dynamic OG image (the home page via
// app/opengraph-image.tsx and state-childcare-costs/[state] via
// app/state-childcare-costs/[state]/opengraph-image.tsx) keep their
// file-based generator — Next.js precedence rule means the file-based
// OG image wins over the metadata image at that segment.

const SITE_NAME = 'FirstYearCost';
const DEFAULT_OG_IMAGE = {
  url: '/opengraph-image',
  width: 1200,
  height: 630,
  alt: "Estimate your baby's first-year cost",
};

export type BuildMetaInput = {
  /** Page-specific title (the " | FirstYearCost" suffix is appended
   *  automatically by the template in app/layout.tsx). Target ≤ 44 chars
   *  so the rendered <title> stays under Google's ~60-char SERP cutoff. */
  title: string;
  /** Page-specific meta description. Target 130-155 chars. */
  description: string;
  /** Path including leading slash, e.g. "/childcare-calculator". */
  path: string;
  /** OpenGraph type. Default: 'website'. Use 'article' for guide pages. */
  type?: 'website' | 'article';
};

/**
 * Builds a complete Metadata object with consistent OG + Twitter tags.
 * Use in static page.tsx metadata exports and dynamic generateMetadata()
 * functions. Spread to add more fields when needed:
 *   export const metadata: Metadata = { ...buildPageMetadata({...}), ... };
 */
export function buildPageMetadata({
  title,
  description,
  path,
  type = 'website',
}: BuildMetaInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: 'en_US',
      type,
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [DEFAULT_OG_IMAGE.url],
    },
  };
}
