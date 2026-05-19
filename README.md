# FirstYearCost.com

A calculator-first website that helps U.S. parents estimate what a baby may cost in the first 12 months — across childcare, feeding, diapers, gear, and birth/insurance out-of-pocket — using state-aware, source-backed planning ranges.

Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and Recharts.

## What's inside

- **Homepage with the main First-Year Baby Cost Calculator** (state, childcare, feeding, diapers, gear tier, registry help, insurance, delivery type, parental leave).
- **5 specialized calculators** at their own routes for Childcare, Diapers, Feeding, Gear, and Birth/Insurance.
- **All 50 states + DC** dynamic childcare cost pages auto-generated from `data/stateChildcare.ts`.
- **Content pages** — methodology with source notes, FAQ, monthly baby budget guide, daycare-vs-nanny comparison.
- **Monetization-ready** — `<AdSlot>` placeholders in proven high-CPM positions, cookie consent banner, privacy + terms pages, JSON-LD structured data (FAQ + WebApplication), sitemap.xml, robots.txt.
- **Print/PDF** — clean print stylesheet, "Print/save PDF" button on the main calculator.

## Quick start

```bash
npm install
npm run dev
```

The site runs at `http://localhost:3000`.

### Static-file dev server (`local-server.js`)

There's also a small zero-dependency static server in the repo root for
serving the project folder (or a built `out/` directory) without spinning up
Next.js — useful for previewing static exports, downloading the raw CSVs in
`public/data/`, or sharing a quick preview build:

```bash
node local-server.js              # serves project root on http://localhost:4173
node local-server.js out          # serves ./out on http://localhost:4173
PORT=8080 node local-server.js    # custom port
```

`local-server.js` uses only Node built-ins (`http`, `fs`, `path`) — no `npm
install` needed. It's not a replacement for `next dev`; use `next dev` for
real app development. The static server is only for serving prebuilt files
and CSV access.

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 14 (App Router) | Best SEO, static generation, dynamic routes for state pages |
| Language | TypeScript | Type-safe data layer and calculator logic |
| Styling | Tailwind CSS | Fast iteration, design system in `tailwind.config.ts` |
| Charts | Recharts | Composable, accessible, server-renderable |
| Icons | Lucide React | Consistent, tree-shakable |
| Data | Static TS modules | Easy to update assumptions; no DB needed for v1 |

## Project structure

```
app/
  page.tsx                              ← homepage with main calculator
  childcare-calculator/page.tsx
  diaper-calculator/page.tsx
  formula-vs-breastfeeding-calculator/page.tsx
  baby-gear-budget/page.tsx
  birth-insurance-planner/page.tsx
  state-childcare-costs/
    page.tsx                            ← all-states index
    [state]/page.tsx                    ← per-state dynamic page
  monthly-baby-budget/page.tsx
  daycare-vs-nanny-cost/page.tsx
  methodology/page.tsx
  faq/page.tsx
  privacy/page.tsx
  terms/page.tsx
  sitemap.ts                            ← dynamic sitemap.xml
  robots.ts                             ← dynamic robots.txt
  layout.tsx
  globals.css
  not-found.tsx

components/
  Header.tsx, Footer.tsx, CookieBanner.tsx
  MainCalculator.tsx                    ← main homepage calculator
  ChildcareCalculator.tsx, DiaperCalculator.tsx, ...
  AdSlot.tsx, Segmented.tsx, Slider.tsx, MonthlyChart.tsx, ...

lib/
  calculator.ts                         ← core cost computation
  format.ts

data/
  assumptions.ts                        ← parses public/data/*.csv → typed exports
  stateChildcare.ts                     ← parses state_childcare.csv + factors
  presets.ts                            ← parses presets.csv
  sourceNotes.ts                        ← source attribution (TS — citations, not numbers)
  csv/
    README.md                           ← CSV schema reference

public/data/                            ← SOURCE OF TRUTH for all numeric tables
  diaper_usage_by_month.csv
  diaper_cost_per_unit.csv
  wipes_cost.csv
  cloth_diapers.csv
  formula_cost_per_month.csv
  breastfeeding_supplies.csv
  feeding_factors.csv
  gear.csv
  clothing_first_year.csv
  registry_coverage.csv
  birth_oop_ranges.csv
  newborn_medical_oop.csv
  birth_billed_anchors.csv
  birth_newborn_deductible_addons.csv
  misc_monthly.csv
  state_childcare.csv
  childcare_care_type_factors.csv
  presets.csv

content/
  faqHome.tsx                           ← homepage FAQ items

lib/
  calculator.ts                         ← core cost computation
  csv.ts                                ← tiny CSV parser
  format.ts

local-server.js                         ← zero-dep static dev server (port 4173)
```

## Updating cost assumptions

All cost assumptions live as **CSV files in `public/data/`** — that's the
single source of truth. The TypeScript modules in `data/` import these CSVs
at build time via webpack's `asset/source` loader (configured in
`next.config.mjs`), parse them with a tiny zero-dep parser (`lib/csv.ts`),
and re-export the same shapes the rest of the app already used. No number is
duplicated in `.ts` files.

- **Schema reference for every CSV** → [`data/csv/README.md`](./data/csv/README.md)
- **Childcare ranges by state** → `public/data/state_childcare.csv`
- **Diaper / formula / gear / medical / etc.** → various files in `public/data/`
- **Care-type multipliers** (nanny / nanny-share / part-time / unsure) → `public/data/childcare_care_type_factors.csv`
- **Source attribution** (still TS, kept for `app/methodology/page.tsx`) → `data/sourceNotes.ts`

To edit a value: open the relevant CSV in Google Sheets / Excel, change the
number, save back as CSV in the same path, and rebuild. Missing CSVs or
malformed rows fail the build with a clear error from the loader.

Bump `lastReviewed` in `data/sourceNotes.ts` when you re-verify a source.

## Monetization plan

The `<AdSlot>` component (`components/AdSlot.tsx`) renders accessible placeholder boxes with `Advertisement` labels and reserved height (no CLS). To wire up Google AdSense:

1. Get an AdSense account approved (the privacy policy, terms, content depth, and HTTPS are already covered).
2. Add `NEXT_PUBLIC_ADSENSE_CLIENT` to `.env.local`.
3. Replace the `AdSlot` internals with the AdSense `<ins>` snippet, or drop the AdSense Auto Ads script into `app/layout.tsx`.

For affiliate links, wrap the `<a>` tag with `rel="sponsored noopener"` and add a one-line disclosure near each link cluster.

## Deploy to Vercel

When you're ready:

```bash
git init && git add . && git commit -m "Initial commit"
gh repo create firstyearcost --public --source=. --remote=origin --push
```

Then on Vercel: Import the GitHub repo, no environment variables required for the MVP. The build command (`next build`) and output directory are auto-detected.

## Roadmap (not implemented in v1)

- Email newsletter (only after traffic validates).
- Downloadable budget workbook (XLSX) generated from inputs.
- Multiples mode (twins, triplets).
- Localized currency / non-U.S. modes.
- Comparison saved-scenarios.

## License

Code: private. Content: © FirstYearCost. Source data attribution preserved in `data/sourceNotes.ts`.
