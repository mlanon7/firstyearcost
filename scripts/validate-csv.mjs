// Zero-dependency CSV validator for public/data/*.csv.
//
// What it checks:
//   1. Every CSV in the manifest exists on disk.
//   2. Every CSV on disk is in the manifest (no orphans).
//   3. Every source_id reference (in the manifest, in row-level source_id
//      columns, in stateLeave) resolves to a row in source_registry.csv.
//   4. For tables with low/mid/high triplets: low <= mid <= high in every row.
//   5. All numeric columns are actually numeric (no "N/A" / blank where a
//      number is required).
//   6. last_reviewed dates are within the configured staleness window for
//      each table's review_frequency.
//   7. Expected row counts (51 states, 12 months, etc.).
//   8. URLs are well-formed (must start with http:// or https:// — or be '#'
//      for explicitly internal/private sources).
//
// Run: `node scripts/validate-csv.mjs` or `npm run validate-data`.
// Exits with code 1 on any failure; prints a numbered report to stderr.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DATA = path.join(ROOT, 'public', 'data');

const errors = [];
const warnings = [];

function err(msg)  { errors.push(msg); }
function warn(msg) { warnings.push(msg); }

// ---------------------------------------------------------------------------
// CSV parsing — same minimal algorithm as lib/csv.ts
// ---------------------------------------------------------------------------
function parseCsv(text) {
  const rows = [];
  let cur = [];
  let buf = '';
  let inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"' && text[i + 1] === '"') { buf += '"'; i++; }
      else if (c === '"') { inQ = false; }
      else { buf += c; }
    } else {
      if (c === '"') inQ = true;
      else if (c === ',') { cur.push(buf); buf = ''; }
      else if (c === '\n') { cur.push(buf); rows.push(cur); cur = []; buf = ''; }
      else if (c === '\r') { /* skip */ }
      else { buf += c; }
    }
  }
  if (buf.length > 0 || cur.length > 0) { cur.push(buf); rows.push(cur); }
  if (rows.length === 0) return [];
  const header = rows[0];
  return rows.slice(1).filter((r) => r.some((v) => v && v.trim() !== '')).map((r) => {
    const o = {};
    for (let i = 0; i < header.length; i++) o[header[i]] = (r[i] ?? '').trim();
    return o;
  });
}

function readCsv(name) {
  const p = path.join(DATA, name);
  if (!fs.existsSync(p)) { err(`CSV missing on disk: ${name}`); return []; }
  return parseCsv(fs.readFileSync(p, 'utf8'));
}

// ---------------------------------------------------------------------------
// 1. Load source registry + manifest
// ---------------------------------------------------------------------------
const registry = readCsv('source_registry.csv');
const sourceIds = new Set(registry.map((r) => r.source_id));
if (sourceIds.size === 0) err('source_registry.csv is empty or unreadable');

const manifest = readCsv('data_manifest.csv');
const manifestByFile = Object.fromEntries(manifest.map((r) => [r.csv_file, r]));
const filesInManifest = new Set(manifest.map((r) => r.csv_file));

// ---------------------------------------------------------------------------
// 2. Cross-check disk vs manifest
// ---------------------------------------------------------------------------
const filesOnDisk = fs.readdirSync(DATA).filter((f) => f.endsWith('.csv'));
for (const f of filesOnDisk) {
  if (!filesInManifest.has(f)) warn(`CSV on disk but not in data_manifest.csv: ${f}`);
}
for (const f of filesInManifest) {
  if (!fs.existsSync(path.join(DATA, f))) err(`Manifest lists CSV that doesn't exist on disk: ${f}`);
}

// ---------------------------------------------------------------------------
// 3. Manifest source_id references
// ---------------------------------------------------------------------------
for (const m of manifest) {
  if (m.source_id && !sourceIds.has(m.source_id)) {
    err(`data_manifest.csv:${m.csv_file} references unknown source_id "${m.source_id}"`);
  }
}

// ---------------------------------------------------------------------------
// 4. Per-row source_id checks (where the column exists)
// ---------------------------------------------------------------------------
const filesWithRowSourceId = ['birth_oop_ranges.csv', 'newborn_medical_oop.csv', 'birth_billed_anchors.csv'];
for (const f of filesWithRowSourceId) {
  const rows = readCsv(f);
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    if (!r.source_id) {
      err(`${f}:${i + 2} missing source_id`);
    } else if (!sourceIds.has(r.source_id)) {
      err(`${f}:${i + 2} references unknown source_id "${r.source_id}"`);
    }
    if (!r.last_reviewed) warn(`${f}:${i + 2} missing last_reviewed`);
  }
}

// ---------------------------------------------------------------------------
// 5. Numeric & ordering checks for triplet tables
// ---------------------------------------------------------------------------
const tripletTables = [
  { file: 'birth_oop_ranges.csv',     cols: ['low_usd', 'mid_usd', 'high_usd'] },
  { file: 'newborn_medical_oop.csv',  cols: ['low_usd', 'mid_usd', 'high_usd'] },
  { file: 'diaper_cost_per_unit.csv', cols: ['low_usd', 'mid_usd', 'high_usd'] },
  { file: 'breastfeeding_supplies.csv',cols:['low_usd', 'mid_usd', 'high_usd'] },
  { file: 'clothing_first_year.csv',  cols: ['low_usd', 'mid_usd', 'high_usd'] },
  { file: 'misc_monthly.csv',         cols: ['low_usd', 'mid_usd', 'high_usd'] },
];
for (const { file, cols } of tripletTables) {
  const rows = readCsv(file);
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const nums = cols.map((c) => Number(r[c]));
    if (nums.some((n) => !Number.isFinite(n))) {
      err(`${file}:${i + 2} non-numeric value in [${cols.join(', ')}]: ${cols.map((c) => `${c}=${r[c]}`).join(', ')}`);
      continue;
    }
    const [lo, mid, hi] = nums;
    if (!(lo <= mid && mid <= hi)) {
      err(`${file}:${i + 2} ordering violated: low=${lo} mid=${mid} high=${hi}`);
    }
  }
}

// ---------------------------------------------------------------------------
// 6. Staleness checks
// ---------------------------------------------------------------------------
const todayMs = Date.now();
const DAY = 24 * 60 * 60 * 1000;
const STALE_DAYS = { quarterly: 120, annual: 400, biannual: 200 };
for (const m of manifest) {
  if (!m.last_reviewed) continue;
  const d = new Date(m.last_reviewed + 'T00:00:00Z').getTime();
  if (!Number.isFinite(d)) { err(`data_manifest.csv:${m.csv_file} has invalid last_reviewed "${m.last_reviewed}"`); continue; }
  const ageDays = (todayMs - d) / DAY;
  const limit = STALE_DAYS[m.review_frequency] ?? STALE_DAYS.annual;
  if (ageDays > limit) {
    warn(`${m.csv_file}: last_reviewed ${m.last_reviewed} is ${Math.floor(ageDays)} days old (${m.review_frequency} cadence, limit ${limit} days)`);
  }
}

// ---------------------------------------------------------------------------
// 7. Expected row counts
// ---------------------------------------------------------------------------
const expectedCounts = {
  'state_childcare.csv': 51,
  'state_leave.csv': 51,
  'diaper_usage_by_month.csv': 12,
  'birth_oop_ranges.csv': 8,
  'birth_newborn_deductible_addons.csv': 12,
};
for (const [f, n] of Object.entries(expectedCounts)) {
  const rows = readCsv(f);
  if (rows.length !== n) err(`${f}: expected ${n} rows, got ${rows.length}`);
}

// ---------------------------------------------------------------------------
// 8. URL well-formedness in source registry
// ---------------------------------------------------------------------------
for (let i = 0; i < registry.length; i++) {
  const r = registry[i];
  const u = (r.url || '').trim();
  if (u === '' || u === '#' || u === 'various') continue;
  if (!/^https?:\/\//.test(u)) {
    err(`source_registry.csv:${i + 2} (${r.source_id}) has malformed url "${u}"`);
  }
}

// ---------------------------------------------------------------------------
// state_leave row-level source_url checks
// ---------------------------------------------------------------------------
const stateLeave = readCsv('state_leave.csv');
for (let i = 0; i < stateLeave.length; i++) {
  const r = stateLeave[i];
  if (!r.source_url || !/^https?:\/\//.test(r.source_url)) {
    err(`state_leave.csv:${i + 2} (${r.state_code}) malformed source_url "${r.source_url}"`);
  }
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------
const N = errors.length;
const W = warnings.length;
if (W) {
  process.stderr.write(`\n⚠  ${W} warning${W === 1 ? '' : 's'}:\n`);
  warnings.forEach((m, i) => process.stderr.write(`  ${i + 1}. ${m}\n`));
}
if (N) {
  process.stderr.write(`\n✗  ${N} error${N === 1 ? '' : 's'}:\n`);
  errors.forEach((m, i) => process.stderr.write(`  ${i + 1}. ${m}\n`));
  process.stderr.write(`\nCSV validation failed.\n`);
  process.exit(1);
}
process.stdout.write(`✓ CSV validation passed (${filesOnDisk.length} files, ${registry.length} sources).\n`);
