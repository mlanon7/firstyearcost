// Tiny zero-dependency CSV parser used by data/*.ts modules to load tables
// from public/data/*.csv at build time (via webpack's asset/source loader,
// configured in next.config.mjs). The parser handles:
//   - quoted fields with embedded commas
//   - escaped double-quotes (`""` inside a quoted field)
//   - CRLF or LF line endings
//   - empty trailing lines
//
// We intentionally do NOT support multi-line quoted fields: none of our
// source CSVs need them, and skipping that keeps the parser ~30 lines.
//
// If you find yourself wanting more, swap in `papaparse` rather than growing
// this file.

export type CsvRow = Record<string, string>;

export function parseCsv(text: string): CsvRow[] {
  const lines = text.replace(/\r\n/g, '\n').split('\n').filter((l) => l.length > 0);
  if (lines.length === 0) return [];
  const headers = parseLine(lines[0]).map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const fields = parseLine(line);
    const row: CsvRow = {};
    headers.forEach((h, i) => {
      row[h] = (fields[i] ?? '').trim();
    });
    return row;
  });
}

function parseLine(line: string): string[] {
  const out: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cur += ch;
      }
    } else if (ch === ',') {
      out.push(cur);
      cur = '';
    } else if (ch === '"') {
      inQuotes = true;
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

/** Parse a CSV cell as a number. Empty / undefined → 0. */
export function num(v: string | undefined): number {
  if (v === undefined || v === '') return 0;
  const n = Number(v);
  if (Number.isNaN(n)) {
    throw new Error(`csv: expected number, got "${v}"`);
  }
  return n;
}

/** Parse a CSV cell as a boolean. Accepts 1/0, true/false, yes/no (case-insensitive). */
export function bool(v: string | undefined): boolean {
  if (v === undefined) return false;
  const s = v.trim().toLowerCase();
  return s === '1' || s === 'true' || s === 'yes';
}

/** Parse a CSV cell as a low/mid/high range. Throws if any column is missing. */
export function range(row: CsvRow, prefix = ''): { low: number; mid: number; high: number } {
  const lowKey = prefix ? `${prefix}_low` : 'low_usd';
  const midKey = prefix ? `${prefix}_mid` : 'mid_usd';
  const highKey = prefix ? `${prefix}_high` : 'high_usd';
  // Fall back to the unprefixed *_usd columns if a prefixed lookup misses.
  const low = row[lowKey] ?? row['low_usd'];
  const mid = row[midKey] ?? row['mid_usd'];
  const high = row[highKey] ?? row['high_usd'];
  return { low: num(low), mid: num(mid), high: num(high) };
}

/** Build a lookup from rows keyed by `keyCol`. Throws on duplicate keys. */
export function indexBy<T extends CsvRow>(rows: T[], keyCol: string): Record<string, T> {
  const out: Record<string, T> = {};
  for (const r of rows) {
    const k = r[keyCol];
    if (!k) throw new Error(`csv: row is missing key column "${keyCol}"`);
    if (k in out) throw new Error(`csv: duplicate key "${k}" in column "${keyCol}"`);
    out[k] = r;
  }
  return out;
}
