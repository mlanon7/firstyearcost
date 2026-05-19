# FirstYearCost — Changes v2 (CSV refactor + local-server)

Date: 2026-05-08
Driven by: Part 1 of the two-part task — convert every "database of numbers" to CSV, drop in a `local-server.js` matching the Construction Calculator pattern.

This is companion to `docs/AUDIT_v2.md`. The first audit/changes pair (`docs/AUDIT.md`, `docs/CHANGES.md`) covered SEO/bug/source fixes; this one is the CSV/data-layer rewrite.

---

## What changed in one paragraph

Every numeric/tabular assumption — birth OOP ranges by insurance × delivery, state childcare costs, gear pricing AND metadata flags, diaper usage, formula tiers, breastfeeding supplies, registry coverage, misc monthly, scenario presets, and previously-hardcoded calculator multipliers — is now a CSV under `public/data/`. Those CSVs are the **single source of truth**. The TypeScript modules in `data/` import them at build time via webpack's `asset/source` loader (configured in `next.config.mjs`), parse them with a tiny zero-dep parser (`lib/csv.ts`), and re-export the same shapes the rest of the app already used — so no consumer needed to be rewritten beyond a few that were duplicating numbers (lib/calculator.ts, ChildcareCalculator.tsx, BirthInsuranceCalculator.tsx, GearCalculator.tsx, the per-state page). A `local-server.js` was added to the repo root: zero-dep, port 4173, MIME types for HTML/JS/CSS/CSV/JSON/SVG, permissive CORS for local dev. Schema docs for every CSV live in `data/csv/README.md`.

---

## CSVs created (18 files, all under `public/data/`)

| File | Rows × Cols | Replaces |
|---|---|---|
| `diaper_usage_by_month.csv` | 12 × 2 | `diaperUsageByMonth` literal |
| `diaper_cost_per_unit.csv` | 3 × 4 | `diaperCostPerUnit` |
| `wipes_cost.csv` | 3 × 2 | `wipesCostPerWipe` |
| `cloth_diapers.csv` | 2 × 4 | `clothDiaperUpfront` + `clothDiaperWashing` |
| `formula_cost_per_month.csv` | 4 × 4 | `formulaCostPerMonth` |
| `breastfeeding_supplies.csv` | 6 × 4 | `breastfeedingSupplies` |
| `feeding_factors.csv` | 6 × 4 | `comboFeedingMultiplier`, `wipesPerChange`, the previously-inline `0.7` and `range(200, 400, 700)` "unsure" feeding constants |
| `gear.csv` | 20 × 9 | `gearCosts` AND `itemMeta` from `GearCalculator.tsx` (one row per item, prices + metadata flags side-by-side) |
| `clothing_first_year.csv` | 4 × 4 | `clothingFirstYear` |
| `registry_coverage.csv` | 3 × 2 | `registryCoverage` |
| `birth_oop_ranges.csv` | 8 × 5 | `birthOOPRanges` |
| `newborn_medical_oop.csv` | 4 × 4 | `newbornMedicalOOP` |
| `birth_billed_anchors.csv` | 2 × 3 | the inline `28998` / `15712` literals in `BirthInsuranceCalculator.tsx` |
| `birth_newborn_deductible_addons.csv` | 12 × 3 | the inline `800/1200/300/450` newborn-on-separate-deductible add-ons in `BirthInsuranceCalculator.tsx` |
| `misc_monthly.csv` | 5 × 4 | `miscMonthly` |
| `state_childcare.csv` | 51 × 8 | `stateChildcare` |
| `childcare_care_type_factors.csv` | 4 × 6 | the duplicated `0.85/1.2`, `0.45/0.65`, `0.65/0.75`, `0.85/1.05` multipliers across `lib/calculator.ts`, `ChildcareCalculator.tsx`, and the per-state page |
| `presets.csv` | 6 × 12 | `presets` |

All dollar values USD. All percentages stored as fractions (e.g. `0.45`). Schema details in `data/csv/README.md`.

---

## What now reads from CSV

These call sites previously held copies of numbers. They are now thin consumers of CSV-backed exports:

- **`data/assumptions.ts`** — fully rewritten to import every CSV and re-export the same names (`diaperCostPerUnit`, `formulaCostPerMonth`, `breastfeedingSupplies`, `gearCosts`, `birthOOPRanges`, `newbornMedicalOOP`, `miscMonthly`, etc.). New exports added: `gearItemMeta`, `birthBilledAnchors`, `getNewbornDeductibleAddon`, `unsureFormulaShare`, `unsureSuppliesAllowance`.
- **`data/stateChildcare.ts`** — fully rewritten. New helper `applyCareTypeFactor(state, careType)` consolidates the nanny / nanny-share / part-time / unsure multipliers into one place backed by `childcare_care_type_factors.csv`.
- **`data/presets.ts`** — fully rewritten to parse `presets.csv`.
- **`lib/calculator.ts`** — `calcChildcare` now goes through `applyCareTypeFactor` (no more inline `0.85`, `0.45`, etc.). `calcFeeding`'s "unsure" branch uses `unsureFormulaShare` and `unsureSuppliesAllowance` from CSV.
- **`components/ChildcareCalculator.tsx`** — `result` and `compareRows` both go through `applyCareTypeFactor`. The `as any` cast on `setStateCode` from v1 is preserved (already fixed).
- **`components/BirthInsuranceCalculator.tsx`** — billed totals come from `birthBilledAnchors`; the newborn-on-separate-deductible add-on comes from `getNewbornDeductibleAddon(insurance, answer)`. The hardcoded `28998`, `15712`, `800`, `1200`, `300`, `450` constants are gone.
- **`components/GearCalculator.tsx`** — `itemMeta` is now `gearItemMeta` from `@/data/assumptions`. The 20-row inline `Record` is gone.
- **`app/state-childcare-costs/[state]/page.tsx`** — the nanny-range hero card now uses `applyCareTypeFactor(s, 'nanny')` instead of the inline `state.nannyMid * 0.85` / `* 1.2`.

---

## Files added

```
public/data/
├── diaper_usage_by_month.csv
├── diaper_cost_per_unit.csv
├── wipes_cost.csv
├── cloth_diapers.csv
├── formula_cost_per_month.csv
├── breastfeeding_supplies.csv
├── feeding_factors.csv
├── gear.csv
├── clothing_first_year.csv
├── registry_coverage.csv
├── birth_oop_ranges.csv
├── newborn_medical_oop.csv
├── birth_billed_anchors.csv
├── birth_newborn_deductible_addons.csv
├── misc_monthly.csv
├── state_childcare.csv
├── childcare_care_type_factors.csv
└── presets.csv

data/csv/
└── README.md                    (schema reference for every CSV)

lib/
└── csv.ts                       (zero-dep parser + num/bool/range/indexBy helpers)

types/
└── csv.d.ts                     (TS module declaration for *.csv imports)

local-server.js                  (zero-dep Node static server, port 4173)

docs/
├── AUDIT_v2.md                  (re-audit)
└── CHANGES_v2.md                (this file)
```

## Files modified

```
data/assumptions.ts              (full rewrite — now CSV-backed)
data/stateChildcare.ts           (full rewrite — now CSV-backed; new applyCareTypeFactor)
data/presets.ts                  (full rewrite — now CSV-backed)
lib/calculator.ts                (calcChildcare via applyCareTypeFactor; calcFeeding via CSV constants)
components/ChildcareCalculator.tsx        (applyCareTypeFactor)
components/BirthInsuranceCalculator.tsx   (CSV-backed billed anchors + add-ons)
components/GearCalculator.tsx             (itemMeta = gearItemMeta)
app/state-childcare-costs/[state]/page.tsx (nanny card via applyCareTypeFactor)
next.config.mjs                  (webpack rule: *.csv → asset/source)
README.md                        (CSV layer docs + local-server.js docs)
```

---

## How the CSV layer works (architecture decision)

**Constraint.** The data modules in `data/` are imported by both server components (`app/**/page.tsx`) and client components (`components/*.tsx` with `'use client'`). A naive `fs.readFileSync` would fail in the client bundle (no `fs` in browser).

**Solution.** Webpack's built-in `asset/source` loader (no extra dep) is configured in `next.config.mjs` to treat `.csv` files as raw strings:

```js
webpack(config) {
  config.module.rules.push({ test: /\.csv$/, type: 'asset/source' });
  return config;
}
```

Then in `data/assumptions.ts`:

```ts
import diaperUsageCsv from '@/public/data/diaper_usage_by_month.csv';
// `diaperUsageCsv` is a string at build time, in both server and client bundles.
const diaperUsageByMonth = parseCsv(diaperUsageCsv).map(...);
```

The CSVs ALSO live under `public/data/` so Next serves them statically at `/data/<name>.csv` — useful for client-side fetches, for downloading the raw data, and for round-tripping through Google Sheets. They're the same files; the static-served copy and the bundled copy are the same source.

**Type declarations.** `types/csv.d.ts` declares `*.csv` as a `string` module so TypeScript accepts the imports.

**Failure mode.** If a CSV is missing or malformed at build time, the build fails fast with a clear error from `lib/csv.ts` — e.g., `feeding_factors.csv missing parameter "combo_feeding_multiplier"`. No silent zeroing-out.

---

## `local-server.js`

Zero-dependency Node HTTP server in the repo root. Mirrors the Construction Calculator project's pattern.

```bash
node local-server.js              # serves project root on http://localhost:4173
node local-server.js out          # serves ./out
PORT=8080 node local-server.js    # custom port
```

Uses only `http`, `fs`, `path`, `url` from Node's standard library. No `npm install` required. Sets `Access-Control-Allow-Origin: *` and `Cache-Control: no-cache` so iteration is instant. MIME types include `.csv` (`text/csv; charset=utf-8`), `.html`, `.js`, `.mjs`, `.css`, `.json`, `.svg`, `.png`, `.jpg`, `.webp`, `.avif`, `.ico`, `.woff`/`woff2`/`ttf`, `.txt`, `.md`, `.xml`, `.pdf`. Path traversal blocked. Falls back to `<path>.html` and `<path>/index.html` for clean URLs.

This complements `next dev`, doesn't replace it. Use `next dev` for app development; use `local-server.js` for serving prebuilt output (`next build && next export → out/`), serving raw CSVs to a non-engineer who wants to download them, or sharing a quick preview build.

---

## Build/test notes

The sandbox running this pass could not reach the npm registry (`403 Forbidden` on `registry.npmjs.org`) and could not run `next build` / `next lint` directly. **Strongly recommend** running locally before deploy:

```
npm install
npm run lint
npm run build
```

What I *did* verify in the sandbox:

- Every CSV parses cleanly with the same algorithm `lib/csv.ts` uses, with the expected row/column counts (51 states, 12 months, 20 gear items, 8 birth-OOP combos, 12 newborn-addon rows, etc.).
- Every required key for every lookup resolves (smoke-tested by mirroring the lookup logic in `data/assumptions.ts` and `data/stateChildcare.ts`).
- All `import ... from '@/public/data/*.csv'` paths point to existing files.
- `local-server.js` uses only Node built-ins; no top-level await; valid ECMAScript.

What you should still verify on a connected machine:

- `npm install` resolves the existing dependencies (no new deps were added — the parser is in-tree).
- `npm run build` compiles. If it doesn't, the most likely cause is the new `webpack(config)` block not being picked up by Next 14 — which would manifest as `Module parse failed: Unexpected token` on a CSV import.
- The per-state OG image generator built in v1 still produces 51 images.
- Spot-check one calculator (e.g., the homepage's main calculator with default inputs) and confirm the totals match v1's outputs to the dollar — they should, because the CSV values mirror the previous TS literals exactly.

---

## Skipped (and why)

- **`data/sourceNotes.ts` was not converted to CSV.** Reason: it's citation metadata (URLs, last-reviewed dates, prose `notes` fields), not numeric data. CSV would lose the structured reference value and force quoting of every prose `notes` cell. The methodology page still reads it directly.
- **FAQ copy and prose strings (per scope).** Per the task brief: "FAQ text and copy strings stay where they are; we only care about numeric/data tables a non-engineer might want to edit in a spreadsheet."
- **Display-only thresholds** like `midRangeBucket()`'s `< 11000`, `< 15000`, `< 20000` in `app/state-childcare-costs/[state]/page.tsx` — these select prose phrasing, not numeric output. Promoting to CSV would create a second source of truth alongside the prose without benefit.
- **The `0.85` / `1.2` / `0.20` (default coinsurance) constants** in `BirthInsuranceCalculator.tsx`'s coinsurance fallback — single-use defaults adjacent to user-input handling. Promoting them to CSV would be net-negative readability.
- **Removing `public/robots.txt`** is still the manual `git rm` step from v1's CHANGES.md. Not in scope here.

---

## Outcomes for non-engineers

After this pass, a non-engineer can:

1. Open Google Sheets / Excel.
2. Import any file from `public/data/<name>.csv`.
3. Edit the numbers (or add/remove rows where supported — see `data/csv/README.md` for which files allow that).
4. Export back as CSV, save to `public/data/<same-name>.csv`.
5. `npm run build` (or `next dev`).

If a column is renamed, a required row removed, or a value made non-numeric, the build fails with a one-line error pointing at the file and key. There is no path to silently bad data.
