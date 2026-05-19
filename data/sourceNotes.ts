// Source notes — every assumption block in the calculator should map to one of
// these. The list is loaded from public/data/source_registry.csv (the single
// source of truth, editable in Sheets). Each data CSV references an entry
// here via its `source_id` column; the validate-csv script checks that every
// reference resolves.

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
