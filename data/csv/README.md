# FirstYearCost — CSV data tables

Every numeric/tabular assumption in the project is stored as a CSV under
`public/data/`. Those CSVs are the **single source of truth** — no number is
duplicated in TypeScript. You can edit them in Google Sheets / Excel,
re-export to CSV, drop the file back into `public/data/`, and rebuild.

The files live under `public/data/` (not `data/csv/`) for two reasons:

1. **Served statically** at `/data/<file>.csv` — useful for client-side fetches
   and for letting users (or you) download a table as-is.
2. **Imported at build time** by the data modules in `data/*.ts` via webpack's
   `asset/source` loader (configured in `next.config.mjs`). The CSV's contents
   are inlined into the bundle as a string — no `fs` calls, works on both
   server and client.

If a CSV is missing or malformed at build time, **the build fails fast**. Any
required column with a missing or non-numeric value will throw an error from
the loader (`lib/csv.ts`).

This file (`data/csv/README.md`) lives in the repo as documentation; it's not
referenced by any code. If you move the CSVs out of `public/data/`, update
both the imports in `data/assumptions.ts` / `data/stateChildcare.ts` /
`data/presets.ts` and the descriptions below.

---

## Quick reference

| File | Rows | Consumed by | Notes |
|---|---|---|---|
| `diaper_usage_by_month.csv` | 12 | `data/assumptions.ts:diaperUsageByMonth` | One row per month of life (1–12) |
| `diaper_cost_per_unit.csv` | 3 | `data/assumptions.ts:diaperCostPerUnit` | Per-diaper price by brand tier |
| `wipes_cost.csv` | 3 | `data/assumptions.ts:wipesCostPerWipe` | Per-wipe price by brand tier |
| `cloth_diapers.csv` | 2 | `data/assumptions.ts:clothDiaperUpfront`, `clothDiaperWashing` | Upfront kit + monthly washing cost |
| `formula_cost_per_month.csv` | 4 | `data/assumptions.ts:formulaCostPerMonth` | Monthly formula cost by type |
| `breastfeeding_supplies.csv` | 6 | `data/assumptions.ts:breastfeedingSupplies` | First-year supplies, per item |
| `feeding_factors.csv` | 6 | `data/assumptions.ts:comboFeedingMultiplier`, `unsureFormulaShare`, `unsureSuppliesAllowance`, `wipesPerChange` | Free-form parameter table (`parameter,value,unit,notes`) |
| `gear.csv` | 20 | `data/assumptions.ts:gearCosts` + `gearItemMeta` | One row per gear item — prices AND metadata flags |
| `clothing_first_year.csv` | 4 | `data/assumptions.ts:clothingFirstYear` | First-year clothing by scenario |
| `registry_coverage.csv` | 3 | `data/assumptions.ts:registryCoverage` | Fraction of gear covered by registry/gifts |
| `birth_oop_ranges.csv` | 8 | `data/assumptions.ts:birthOOPRanges` | OOP for birth by insurance × delivery |
| `newborn_medical_oop.csv` | 4 | `data/assumptions.ts:newbornMedicalOOP` | First-year newborn medical OOP by insurance |
| `birth_billed_anchors.csv` | 2 | `data/assumptions.ts:birthBilledAnchors` | Anchored billed totals used by the birth-insurance planner |
| `birth_newborn_deductible_addons.csv` | 12 | `data/assumptions.ts:getNewbornDeductibleAddon()` | Add-on $ when newborn is on a separate deductible |
| `misc_monthly.csv` | 5 | `data/assumptions.ts:miscMonthly` | Misc recurring cost items, per month |
| `state_childcare.csv` | 51 | `data/stateChildcare.ts:stateChildcare` | All 50 states + DC |
| `childcare_care_type_factors.csv` | 4 | `data/stateChildcare.ts:careTypeFactors` + `applyCareTypeFactor()` | Multipliers for nanny / nanny-share / part-time / unsure |
| `presets.csv` | 6 | `data/presets.ts:presets` | Homepage scenario presets |

All dollar values are USD. All percentages are stored as fractions (e.g.
`0.45`, not `45`).

---

## Schema details

All files are RFC 4180-style CSV with a header row. Quoted fields support
embedded commas; double-quotes are escaped as `""`. The parser is
`lib/csv.ts` — see that file for exact semantics.

### `diaper_usage_by_month.csv`

| column | type | description |
|---|---|---|
| `month` | int 1–12 | Month of life (1 = first month) |
| `per_day` | int | Average diapers per day this month |

### `diaper_cost_per_unit.csv`

| column | type | description |
|---|---|---|
| `brand_tier` | string (`budget`/`mainstream`/`premium`) | Tier key |
| `low_usd` | float | Per-diaper low end |
| `mid_usd` | float | Per-diaper mid |
| `high_usd` | float | Per-diaper high end |

### `wipes_cost.csv`

| column | type | description |
|---|---|---|
| `brand_tier` | string (`budget`/`mainstream`/`premium`) | Tier key |
| `cost_per_wipe_usd` | float | Per-wipe price |

### `cloth_diapers.csv`

| column | type | description |
|---|---|---|
| `item` | string (`upfront_kit`/`washing_per_month`) | Row key |
| `low_usd` / `mid_usd` / `high_usd` | float | Range. For `washing_per_month`, units are USD/month. For `upfront_kit`, units are USD (one-time). |

### `formula_cost_per_month.csv`

| column | type | description |
|---|---|---|
| `formula_type` | string | One of `standardPowder`, `sensitive`, `hypoallergenic`, `readyToFeed` |
| `low_usd` / `mid_usd` / `high_usd` | float | Monthly cost range |

### `breastfeeding_supplies.csv`

| column | type | description |
|---|---|---|
| `item` | string | One of `pumpOutOfPocket`, `bottlesAndStorage`, `pumpPartsReplacement`, `bras`, `pads`, `lactationConsultOOP` |
| `low_usd` / `mid_usd` / `high_usd` | float | First-year cost range |

### `feeding_factors.csv`

A flat key/value table for parameters that aren't naturally a low/mid/high
range.

| column | type | description |
|---|---|---|
| `parameter` | string | Parameter key |
| `value` | float | Value (units depend on parameter) |
| `unit` | string | One of `fraction`, `usd`, `wipes` |
| `notes` | string | Free-form note (optional) |

Required keys (loader throws if missing):
`combo_feeding_multiplier`, `unsure_formula_share`, `unsure_supplies_low`,
`unsure_supplies_mid`, `unsure_supplies_high`, `wipes_per_change`.

### `gear.csv`

One row per item. Combines pricing across tiers AND metadata flags used by
`GearCalculator`.

| column | type | description |
|---|---|---|
| `item_key` | string | Stable identifier (camelCase) — used as the lookup key in code |
| `label` | string | Display label |
| `budget_usd` / `standard_usd` / `premium_usd` | float | Price by gear tier |
| `must_have` | bool (`1`/`0`) | Required for the basic must-have-before-birth list |
| `safety_new` | bool | Should be bought new for safety reasons |
| `can_delay` | bool | Can be deferred — hidden in the "minimal" gear setup |
| `tag` | string | Category tag (`sleep`, `nursery`, `travel`, `feeding`, `play`, `bathing`, `health`, `misc`) |

### `clothing_first_year.csv`

| column | type | description |
|---|---|---|
| `scenario` | string | One of `mostlyGifts`, `budget`, `standard`, `premium` |
| `low_usd` / `mid_usd` / `high_usd` | float | First-year clothing cost |

### `registry_coverage.csv`

| column | type | description |
|---|---|---|
| `help_level` | string | One of `low`, `medium`, `high` |
| `coverage_fraction` | float | Fraction of gear covered (0–1) |

### `birth_oop_ranges.csv`

Compound key (`insurance` + `delivery`).

| column | type | description |
|---|---|---|
| `insurance` | string | One of `employer`, `marketplace`, `medicaid`, `uninsured` |
| `delivery` | string | One of `vaginal`, `csection` |
| `low_usd` / `mid_usd` / `high_usd` | float | Birth OOP range |

### `newborn_medical_oop.csv`

| column | type | description |
|---|---|---|
| `insurance` | string | One of `employer`, `marketplace`, `medicaid`, `uninsured` |
| `low_usd` / `mid_usd` / `high_usd` | float | First-year newborn medical OOP |

### `birth_billed_anchors.csv`

Anchored *billed* totals (not OOP) used by the birth-insurance planner to
model OOP from a user-entered deductible + coinsurance.

| column | type | description |
|---|---|---|
| `delivery` | string | One of `vaginal`, `csection` |
| `billed_total_usd` | int | Average total billed amount |
| `notes` | string | Source note (optional) |

### `birth_newborn_deductible_addons.csv`

Compound key (`insurance` + `on_separate`). Drives the "newborn on separate
deductible?" segmented control.

| column | type | description |
|---|---|---|
| `insurance` | string | One of `employer`, `marketplace`, `medicaid`, `uninsured` |
| `on_separate` | string | One of `yes`, `unsure`, `no` |
| `addon_usd` | int | Add-on amount (0 if not applicable) |

### `misc_monthly.csv`

| column | type | description |
|---|---|---|
| `item` | string | One of `babyToiletries`, `babyMedicine`, `laundryExtras`, `photos`, `childlife` |
| `low_usd` / `mid_usd` / `high_usd` | float | Per-month cost range |

### `state_childcare.csv`

| column | type | description |
|---|---|---|
| `code` | 2-letter string | USPS state code (`CA`, `DC`, etc.) |
| `name` | string | Display name |
| `center_low` / `center_high` | int | Annual center care range, USD |
| `home_low` / `home_high` | int | Annual home daycare range, USD |
| `nanny_mid` | int | Annual nanny mid (40 hr/wk), USD |
| `pct_median_income` | int | Approx % of state median household income (center care) |

Loader requires exactly 51 rows.

### `childcare_care_type_factors.csv`

Multipliers used to derive nanny / nanny-share / part-time / unsure ranges
from a state's center / home / nanny-mid baselines. Read by both the
homepage calculator (`lib/calculator.ts`) and `ChildcareCalculator.tsx`.

| column | type | description |
|---|---|---|
| `care_type` | string | One of `nanny`, `nannyShare`, `partTime`, `unsure` |
| `low_multiplier` | float | Multiplier applied to `low_basis` |
| `high_multiplier` | float | Multiplier applied to `high_basis` |
| `low_basis` | string | Column on the state row used for the low end (`centerLow`, `centerHigh`, `homeLow`, `homeHigh`, `nannyMid`) |
| `high_basis` | string | Column for the high end |
| `notes` | string | Free-form |

### `presets.csv`

Each row is a homepage scenario preset.

| column | type | description |
|---|---|---|
| `id` | string | Stable identifier |
| `name` | string | Display name |
| `blurb` | string | One-line description |
| `childcarePlan` | string (optional) | One of the `ChildcarePlan` values |
| `feedingPlan` | string (optional) | One of the `FeedingPlan` values |
| `formulaType` | string (optional) | One of the `FormulaType` values |
| `diaperPlan` | string (optional) | One of the `DiaperPlan` values |
| `gearTier` | string (optional) | `budget`/`standard`/`premium` |
| `gearUsed` | bool (optional) | `true`/`false` |
| `registryHelp` | string (optional) | `low`/`medium`/`high` |
| `childcareMonths` | int (optional) | 0–12 |
| `isFirstBaby` | bool (optional) | `true`/`false` |

Empty cells = "leave at the default."

---

## Editing in Google Sheets

1. Open the CSV file in Google Sheets (File → Import → Replace current sheet).
2. Edit any value. Don't rename columns or delete required rows.
3. File → Download → Comma-separated values (`.csv`).
4. Save back to `public/data/<same-filename>.csv`.
5. `npm run build` (or `next dev`) — if anything is malformed, the build will
   throw with a clear error.

The static-served copy at `https://<host>/data/<filename>.csv` updates with
the same deploy.
