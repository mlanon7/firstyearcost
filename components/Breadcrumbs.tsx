// JSON-LD emitters + visible breadcrumb component.
//
// Use BreadcrumbsJsonLd on every non-home page (URLs must be absolute) for
// search engines. Use VisibleBreadcrumbs in the UI for users — typically
// rendered just below the page hero or above the calculator on deep pages.
//
// Schema.org refs:
//   https://schema.org/BreadcrumbList
//   https://schema.org/Article
//   https://schema.org/Dataset
//   https://schema.org/HowTo

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

type Crumb = { name: string; url: string };

export function BreadcrumbsJsonLd({ items }: { items: Crumb[] }) {
  const json = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

/**
 * Visible breadcrumb UI. Renders Home › Section › Page with subtle warm-taupe
 * styling. Use on guide and state pages just under the hero. Mirrors the same
 * trail used in BreadcrumbsJsonLd — keep them in sync.
 */
export function VisibleBreadcrumbs({ items }: { items: Crumb[] }) {
  if (items.length < 2) return null;
  return (
    <nav aria-label="Breadcrumb" className="container-pg pt-4 pb-2">
      <ol className="flex items-center flex-wrap gap-1 text-xs text-ink-500">
        {items.map((it, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={it.url} className="flex items-center gap-1">
              {isLast ? (
                <span aria-current="page" className="text-ink-700 font-medium">{it.name}</span>
              ) : (
                <Link href={pathOf(it.url)} className="hover:text-teal-700 hover:underline underline-offset-2">
                  {it.name}
                </Link>
              )}
              {!isLast && <ChevronRight className="w-3 h-3 text-ink-400" aria-hidden />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** Convert an absolute URL to a relative path for Next's <Link>. */
function pathOf(url: string): string {
  try {
    return new URL(url).pathname;
  } catch {
    return url;
  }
}

export function ArticleJsonLd({
  title,
  description,
  url,
  datePublished = '2026-01-01',
  dateModified,
}: {
  title: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
}) {
  const json = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: { '@type': 'Organization', name: 'FirstYearCost' },
    publisher: {
      '@type': 'Organization',
      name: 'FirstYearCost',
      logo: { '@type': 'ImageObject', url: 'https://firstyearcost.com/opengraph-image' },
    },
    datePublished,
    dateModified: dateModified ?? datePublished,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

type DatasetDistribution = { name: string; contentUrl: string; encodingFormat?: string };

export function DatasetJsonLd({
  name,
  description,
  url,
  keywords,
  distributions,
  datePublished = '2026-01-01',
  dateModified,
}: {
  name: string;
  description: string;
  url: string;
  keywords: string[];
  distributions: DatasetDistribution[];
  datePublished?: string;
  dateModified?: string;
}) {
  const json = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name,
    description,
    url,
    keywords: keywords.join(', '),
    creator: { '@type': 'Organization', name: 'FirstYearCost' },
    license: 'https://firstyearcost.com/terms',
    datePublished,
    dateModified: dateModified ?? datePublished,
    distribution: distributions.map((d) => ({
      '@type': 'DataDownload',
      name: d.name,
      contentUrl: d.contentUrl,
      encodingFormat: d.encodingFormat ?? 'text/csv',
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
