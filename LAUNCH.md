# FirstYearCost — Launch & Monetization Playbook

Last updated: 2026-05-17

This document is the operating manual for taking FirstYearCost.com from
"finished build" to "indexed + monetized." It assumes the v1 + v2 audits and
v3 content additions are done (see `docs/AUDIT.md`, `docs/AUDIT_v2.md`).

---

## Where the project is right now

- **Build:** 19 routes across calculators, comparison guides, and state pages.
  All assumption tables in CSV, downloadable at `/data/*.csv`.
- **New in v3 (this pass):**
  - `/childcare-subsidy-calculator` — CDCTC + dependent-care FSA estimator (2026 rules).
  - `/maternity-leave-by-state` + `/maternity-leave-by-state/[state]` — 50 state + DC PFML pages backed by `state_leave.csv`.
  - `/second-baby-cost` — long-tail content page.
  - `/registry-essentials` — affiliate-monetization target sorted by safety tier.
  - `/c-section-vs-vaginal-cost` — high-commercial-intent comparison page.
  - `BreadcrumbsJsonLd` + `ArticleJsonLd` + `DatasetJsonLd` schema helpers.
  - `AffiliateLink` + `AffiliateDisclosure` components.
  - `EmailCapture` lead-magnet component (newsletter / budget workbook).
  - `track()` analytics wrapper for GA4 / Plausible.
  - Removed duplicate `public/robots.txt`.
  - Slider thumb bumped to 24px for touch; muted text contrast raised.

- **Not done (out of code's scope — humans only):** domain, deploy, Search
  Console, AdSense, affiliate programs, newsletter provider.

---

## Phase 1 — Ship it (1–3 days)

### 1.1 Verify the build locally
```bash
npm install
npm run lint
npm run build
npm run dev
```
- Walk every page in the browser.
- For each calculator: change every input, confirm totals update, confirm no console errors.
- Print-preview the main calculator (the print stylesheet is live).
- Confirm `/data/state_leave.csv` and `/data/state_childcare.csv` load directly.

### 1.2 Buy the domain
- Cloudflare Registrar or Porkbun. ~$10/yr `.com`.
- Don't register `.net`/`.io`/etc. yet — defensive registrations are a year-2 problem.

### 1.3 Push to GitHub + Vercel
```bash
git init
git add .
git commit -m "Initial commit: FirstYearCost v1"
gh repo create firstyearcost --public --source=. --remote=origin --push
```
- Vercel → Import repo. No env vars required for first deploy.
- Wire `firstyearcost.com` apex + `www` (Vercel handles certs).
- Deploy preview → manual smoke test → promote to production.

### 1.4 Add analytics
Pick **one** of:

**Plausible** (recommended — privacy-friendly, no cookie banner required):
```html
<!-- in app/layout.tsx, inside <body> -->
<script defer data-domain="firstyearcost.com" src="https://plausible.io/js/script.js"></script>
```
Then set `NEXT_PUBLIC_PLAUSIBLE_DOMAIN=firstyearcost.com` in Vercel env vars.

**GA4** (free, more analytical depth, cookie banner required — you already have CookieBanner):
```tsx
<Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
<Script id="ga" strategy="afterInteractive">{`
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${GA_ID}');
`}</Script>
```
Set `NEXT_PUBLIC_GA_ID=G-XXXXXXX`. `lib/analytics.ts` already routes to both.

### 1.5 Microsoft Clarity (heatmaps, free, no perf hit)
Add the Clarity snippet to `app/layout.tsx`. Watch the first 50 sessions to find
"users click here but nothing happens" bugs.

---

## Phase 2 — Index & instrument (week 1–2)

### 2.1 Search Console
- Verify both `https://firstyearcost.com` and `https://www.firstyearcost.com`.
- Submit sitemap: `https://firstyearcost.com/sitemap.xml`.
- Request indexing on the **8 highest-value URLs first** (don't waste the API quota on state pages):
  1. `/`
  2. `/childcare-calculator`
  3. `/birth-insurance-planner`
  4. `/c-section-vs-vaginal-cost`
  5. `/childcare-subsidy-calculator`
  6. `/maternity-leave-by-state`
  7. `/state-childcare-costs`
  8. `/registry-essentials`

### 2.2 Bing Webmaster Tools
- Same verification, same sitemap. Imports from GSC automatically.

### 2.3 Validate structured data
- Run `/`, `/methodology`, `/c-section-vs-vaginal-cost`, and a state page through:
  https://search.google.com/test/rich-results
- You should see: WebApplication (home), FAQPage (homepage + calc pages),
  BreadcrumbList (every non-home page), Article (guide pages), Dataset
  (methodology + state-cost index).

### 2.4 OG image overrides for the 6 calculator + 5 guide pages
The site has a default `opengraph-image.tsx`. Per-page OG images bump CTR
substantially on shared links. Each route can ship its own
`opengraph-image.tsx` in the route folder. Defer this until traffic justifies
it (month 2–3).

---

## Phase 3 — Monetization (week 2–6)

### 3.1 Apply to AdSense
- Privacy policy ✓, Terms ✓, content depth ✓, HTTPS ✓ — all the AdSense entry
  criteria are met.
- Apply via https://www.google.com/adsense/
- Once approved, set `NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXX` in Vercel.
  `AdSlot` already conditionally renders when this env var is set.
- Wire the `<ins>` snippet inside `AdSlot.tsx`:
  ```tsx
  <ins
    className="adsbygoogle"
    data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT}
    data-ad-slot="XXXXXXX"
    data-ad-format="auto"
    data-full-width-responsive="true"
  />
  ```
- Add the AdSense script tag to `app/layout.tsx` (once, async, in `<head>`).

### 3.2 Affiliate programs — apply now, even if approval lags

| Program | What to monetize | Apply at | Realistic rate |
|---|---|---|---|
| Babylist | Registry, gear pages | https://www.babylist.com/help/affiliate-program | 5–8% |
| Amazon Associates | Diapers, formula, gear | https://affiliate-program.amazon.com | 1–4% baby |
| Skimlinks | Auto-affiliates any retailer | https://skimlinks.com | varies, 70% of base |
| Ethos Life | Life insurance for new parents | https://www.ethoslife.com/partners | $40–150 / qualified lead |
| Fabric (Gerber Life) | Life insurance + 529s | apply via Impact.com | $30–80 / signup |
| UNest | 529 / baby investment | https://unest.co | $5–25 / signup |
| Taking Cara Babies | Sleep course | direct partner contact | 10–20% |

**Don't add affiliate links until approval.** Skimlinks is the exception —
auto-routes affiliate-capable links, no per-merchant approval needed.

### 3.3 Wire affiliate links
- Use `<AffiliateLink>` component (already built). Sets `rel="sponsored noopener nofollow"`, fires `affiliate_click` analytics event.
- Add `<AffiliateDisclosure />` near every cluster.
- **Highest-CTR placements**:
  - `/registry-essentials` page — Babylist link in the platform comparison
  - `/baby-gear-budget` — link out from the "buy new for safety" items to Babylist registry-add page
  - `/diaper-calculator` — Amazon links on Honest, Coterie, Millie Moon comparison cards (add a "shop this brand" callout)
  - `/birth-insurance-planner` and `/c-section-vs-vaginal-cost` — life insurance affiliate cluster (highest revenue per click in this niche)

### 3.4 Newsletter provider for the lead magnet
Pick one:
- **Buttondown** ($9/mo, dead simple, single-author friendly)
- **ConvertKit** (free under 1,000 subs, more automation)
- **Beehiiv** (free under 2,500 subs, growth features)

Then set `NEXT_PUBLIC_NEWSLETTER_ENDPOINT` in Vercel to the provider's form-post URL.
`EmailCapture.tsx` already POSTs JSON `{ email }`.

Build the **first lead magnet** (a downloadable XLSX budget workbook):
- Use the existing CSV data as the source of truth. Generate the XLSX from the
  CSVs in a small Node script. Host it on Vercel as a static asset.
- Auto-respond from the newsletter provider with the download link.

---

## Phase 4 — Compounding content & growth (month 2+)

### 4.1 Outreach for backlinks (the unique angle)
The downloadable-CSV story is the most distinct hook. Pitch:
> "Hi [author of recent baby-cost article] — I built FirstYearCost.com and
> publish all our underlying cost data as downloadable CSVs. If you'd find
> any of these useful (state childcare, state paid leave, gear, formula
> tiers, birth OOP), they're at firstyearcost.com/methodology and free to
> cite. Would love a link back if you do."

Target list (start here):
- Personal finance bloggers covering family/parent finance
- Pregnancy podcasts (Prenatal podcast, Pregnancy & Birth podcast, etc.)
- State-local mom blogs (for the per-state pages)
- Reddit `r/personalfinance`, `r/beyondthebump`, `r/Parenting` — share state
  pages where the data is locally relevant; flair as a creator if you stay long-term

### 4.2 Content cadence — what to write next
Ordered by SEO ROI:
1. **Per-state birth out-of-pocket pages** — `/birth-cost/[state]` (50 pages). Use Medicaid eligibility data + state hospital benchmark from CMS Hospital Compare.
2. **Twins / multiples calculator** — high search volume, low competition.
3. **NICU cost & insurance guide** — top-of-funnel for life insurance affiliate.
4. **Per-metro childcare pages** for the 50 priciest metros — drop in next CSV.
5. **Glossary** (deductible, OOP max, coinsurance, copay, FSA, HSA, dependent care) — these terms appear in calc inputs; users Google them.

### 4.3 Monetization checkpoints

| Monthly sessions | Move |
|---|---|
| 0–2,000 | AdSense live; Amazon + Skimlinks; track affiliate CTR |
| 2,000–10,000 | Apply to direct DTC affiliate programs (Bobbie, Coterie, Owlet, Lovevery) |
| 10,000–50,000 | Apply to Ezoic or Sortable to lift display RPM; A/B test ad layouts |
| 50,000+ | Apply to **Mediavine** (highest-RPM mid-market network in family niche) |
| 100,000+ | Apply to **Raptive** (the former AdThrive — premium tier, $25–50 RPM typical) |

### 4.4 Insurance lead-gen — the highest-leverage Year-2 play
The `/c-section-vs-vaginal-cost` and `/birth-insurance-planner` pages are
purpose-built to convert to life-insurance and supplemental-coverage affiliate
revenue. Realistic CPL is $40–150 per qualified lead at Ethos/Fabric/Ladder.
At 1% form-fill rate on a page that draws 5,000 monthly visits, that's
$2,000–7,500/mo from one product line — comparable to Mediavine ad revenue at
the same traffic level.

**Process:**
1. Get to ~5K sessions/mo on either of those two pages.
2. Apply to Ethos's affiliate partner program (now Bestow, Fabric, Ladder all work via Impact.com).
3. Build a soft-pitch widget on those pages: "New parents: most people need 10× annual income in term life. Get a 10-minute quote →" with their affiliate link.
4. Keep the affiliate disclosure honest. The link should be opt-in, not interruptive.

---

## What we deliberately don't do

- **No contact form in v1.** Email-only contact reduces spam, signals
  intent. Confirmed in the build brief.
- **No multi-currency / international.** First-year cost varies wildly across
  health systems; the calculator's value comes from U.S. specificity.
- **No gated calculators.** Every tool is free without signup. The newsletter
  is the only ask, and it's after the user has a number.
- **No clickbait gear "rankings."** We list categories and price tiers, never
  "the 10 best strollers" because the rankings would be commission-driven and
  would erode trust over time.

---

## Maintenance — what to update and when

- **Quarterly:** Review one CSV per month. Bump `lastReviewed` in
  `data/sourceNotes.ts`. Re-pull a price snapshot for diapers, formula, gear.
- **Annually (December):** Update tax-bracket proxy in `SubsidyCalculator.tsx`
  for the new tax year. Update FSA cap if Congress changes it.
- **Annually (January):** Update `state_leave.csv` — programs launch and
  benefit caps change. Check Delaware (2026 launch), Maine (May 2026),
  Maryland (July 2026), Minnesota (Jan 2026).
- **After each KFF release:** Update `birth_oop_ranges.csv` and
  `birth_billed_anchors.csv`. KFF publishes the maternity cost brief roughly
  annually in late summer.

---

## Quick reference — file map of what landed in v3

```
NEW
───
app/childcare-subsidy-calculator/page.tsx
app/maternity-leave-by-state/page.tsx
app/maternity-leave-by-state/[state]/page.tsx
app/second-baby-cost/page.tsx
app/registry-essentials/page.tsx
app/c-section-vs-vaginal-cost/page.tsx

components/SubsidyCalculator.tsx
components/AffiliateLink.tsx
components/EmailCapture.tsx

data/stateLeave.ts
public/data/state_leave.csv

lib/analytics.ts

LAUNCH.md (this file)


MODIFIED
────────
app/page.tsx                          (+ EmailCapture, + 6 new CalcLinks)
app/sitemap.ts                        (+ 6 routes + 51 leave-state pages)
app/robots.ts                         (cleaned comment + host directive)
app/layout.tsx                        (no changes required for v3)
app/globals.css                       (slider thumb sized for touch; contrast)
app/childcare-calculator/page.tsx     (+ BreadcrumbsJsonLd)
app/diaper-calculator/page.tsx        (+ BreadcrumbsJsonLd)
app/formula-vs-breastfeeding-calculator/page.tsx (+ BreadcrumbsJsonLd)
app/baby-gear-budget/page.tsx         (+ BreadcrumbsJsonLd)
app/birth-insurance-planner/page.tsx  (+ BreadcrumbsJsonLd)
app/monthly-baby-budget/page.tsx      (+ Article + BreadcrumbsJsonLd)
app/daycare-vs-nanny-cost/page.tsx    (+ Article + BreadcrumbsJsonLd)
app/methodology/page.tsx              (+ Breadcrumbs + Dataset JSON-LD)
app/faq/page.tsx                      (+ BreadcrumbsJsonLd)
app/state-childcare-costs/page.tsx    (+ Breadcrumbs + Dataset JSON-LD)
components/Header.tsx                 (+ 2 nav items)
components/Footer.tsx                 (+ 6 footer links)
components/Breadcrumbs.tsx            (+ ArticleJsonLd + DatasetJsonLd helpers)

REMOVED
───────
public/robots.txt    (dedup; app/robots.ts is the single source now)
```
