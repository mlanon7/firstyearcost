'use client';

import { useState, isValidElement, type ReactElement, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

export type FAQItem = { q: string; a: React.ReactNode | string };

export function FAQ({ items }: { items: FAQItem[] }) {
  return (
    <div className="card divide-y divide-ink-100">
      {items.map((item, i) => (
        <Row key={i} item={item} />
      ))}
    </div>
  );
}

function Row({ item }: { item: FAQItem }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-ink-50/50 transition"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="font-semibold text-ink-900">{item.q}</span>
        <ChevronDown className={`w-5 h-5 text-ink-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-5 pb-5 -mt-1 text-ink-700 text-sm leading-relaxed">
          {item.a}
        </div>
      )}
    </div>
  );
}

export function FAQSchema({ items }: { items: FAQItem[] }) {
  const text = (n: React.ReactNode | string): string =>
    typeof n === 'string' ? n : extractText(n);
  const json = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: text(it.a) },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

function extractText(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractText).join(' ');
  if (isValidElement(node)) {
    const el = node as ReactElement<{ children?: ReactNode }>;
    return extractText(el.props.children);
  }
  return '';
}
