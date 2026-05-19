// Per-CSV manifest. Each row in data_manifest.csv maps a CSV file to its
// source_id (in source_registry.csv), last_reviewed date, review frequency,
// and methodology note. Used by:
//   - the validation script (scripts/validate-csv.mjs) to enforce that every
//     CSV resolves to a real source
//   - the methodology page's "Data tables" section
//   - downstream tools that want to display "last reviewed YYYY-MM-DD" badges

import { parseCsv } from '@/lib/csv';
import manifestCsv from '@/public/data/data_manifest.csv';

export type ReviewFrequency = 'quarterly' | 'annual' | 'biannual';

export type DataManifestEntry = {
  csvFile: string;
  sourceId: string;     // '' if self-referential (registry, manifest)
  lastReviewed: string; // YYYY-MM-DD
  reviewFrequency: ReviewFrequency;
  adjustedToYear: string;
  methodologyNote: string;
};

export const dataManifest: DataManifestEntry[] = parseCsv(manifestCsv).map((r) => ({
  csvFile: r.csv_file,
  sourceId: r.source_id || '',
  lastReviewed: r.last_reviewed,
  reviewFrequency: (r.review_frequency as ReviewFrequency) || 'annual',
  adjustedToYear: r.adjusted_to_year || '',
  methodologyNote: r.methodology_note || '',
}));

export const manifestByFile: Record<string, DataManifestEntry> = Object.fromEntries(
  dataManifest.map((m) => [m.csvFile, m]),
);
