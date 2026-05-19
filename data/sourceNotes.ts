// Source notes — registry of public sources cited across the site.
//
// Loaded from public/data/source_registry.csv (the single source of truth,
// editable in Sheets). Two patterns reference this registry:
//
//   1. Per-CSV (file-level) provenance via public/data/data_manifest.csv —
//      used for tables where every row shares one source (e.g. all 51 state
//      childcare rows come from CCAOA's price-landscape report; all 20 gear
//      rows come from the retail snapshot). Adding a redundant `source_id`
//      column to those CSVs would be 51× the same value with no benefit.
//
//   2. Per-row provenance via a `source_id` column in the CSV itself — used
//      where rows are heterogeneous (birth_oop_ranges.csv has employer rows
//      sourced from KFF and marketplace rows from CMS, so the column is
//      necessary).
//
// The validate-csv script (`npm run validate-data`) checks that every
// referenced source_id — whether from the manifest or a row column —
// resolves to a row here.

import { parseCsv } from '@/lib/csv';
import sourceRegistryCsv from '@/public/data/source_registry.csv';

export type SourceNote = {
  id: string;
  title: string;
  org: string;
  url: string;
  dataYear: string;
  lastReviewed: string;
  confidence: 'high' | 'medium' | 'low';
  notes?: string;
};

export const sourceNotes: SourceNote[] = parseCsv(sourceRegistryCsv).map((r) => ({
  id: r.source_id,
  title: r.title,
  org: r.org,
  url: r.url,
  dataYear: r.data_year,
  lastReviewed: r.last_reviewed,
  confidence: (r.confidence as SourceNote['confidence']) || 'medium',
  notes: r.notes || undefined,
}));

export function getSource(id: string): SourceNote | undefined {
  return sourceNotes.find((s) => s.id === id);
}

export const sourceIds: ReadonlySet<string> = new Set(sourceNotes.map((s) => s.id));
