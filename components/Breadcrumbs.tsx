// JSON-LD emitters: BreadcrumbList, Article, Dataset, HowTo. Use on any
// non-home page. URLs should be absolute (https://firstyearcost.com/...).
//
// Schema.org refs:
//   https://schema.org/BreadcrumbList
//   https://schema.org/Article
//   https://schema.org/Dataset
//   https://schema.org/HowTo

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
}: {
  name: string;
  description: string;
  url: string;
  keywords: string[];
  distributions: DatasetDistribution[];
  datePublished?: string;
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
