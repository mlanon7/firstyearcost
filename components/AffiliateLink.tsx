'use client';

import { track } from '@/lib/analytics';
import { ExternalLink } from 'lucide-react';

// Standard affiliate link. Adds:
//   - rel="sponsored noopener nofollow" (Google guidance for affiliate links)
//   - target="_blank" so users don't lose their calculator state
//   - analytics event with merchant + product slug
//
// Use alongside <AffiliateDisclosure /> at least once per page that includes
// any affiliate link cluster.

type Props = {
  href: string;
  merchant: 'amazon' | 'babylist' | 'ethos' | 'policygenius' | 'fabric' | 'unest' | 'taking-cara-babies' | 'snoo' | 'other';
  product: string;
  children: React.ReactNode;
  className?: string;
};

export function AffiliateLink({ href, merchant, product, children, className = '' }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored noopener nofollow"
      className={`inline-flex items-center gap-1 font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800 ${className}`}
      onClick={() => track('affiliate_click', { merchant, product })}
    >
      {children}
      <ExternalLink className="w-3.5 h-3.5" />
    </a>
  );
}

export function AffiliateDisclosure({ className = '' }: { className?: string }) {
  return (
    <p className={`text-xs text-ink-500 leading-relaxed ${className}`}>
      <strong>Disclosure:</strong> Some links on this page are affiliate links —
      if you buy through them, we may earn a small commission at no extra cost
      to you. We only link to products that fit the spending plan the
      calculator suggests, and our rankings are never influenced by commission
      rates. See our{' '}
      <a href="/methodology" className="underline">methodology</a> for how we
      research recommendations.
    </p>
  );
}
