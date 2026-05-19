# FirstYearCost Deployment Readiness Audit

Date: 2026-05-19  
Folder audited: `D:\claude projects\firstyearcost`  
Scope: deployment readiness, calculator accuracy, CSV/data structure, code structure, UI/navigation/buttons, SEO, monetization, content/source trust, and remaining fixes after the latest Claude updates.

I did not change application code, data, config, or styling in this pass. This file is the only artifact added by this audit.

## Bottom-line verdict

The site is much closer to launch than it was in the earlier audit. The biggest previously reported correctness issues are largely fixed: `isFirstBaby` is now used in the calculator, the state childcare calculator receives the current state on state pages, email capture no longer fakes success when no endpoint is configured, CSV validation is much stronger, and the federal CDCTC/FSA core math has been moved into a tested pure module.

I would not send paid or meaningful public traffic yet. The current blockers are narrower but still important:

1. The production verification gates are not cleanly proven in this local Windows environment.
2. The paid-leave hub has stale copy after the latest state-leave CSV refresh.
3. The childcare tax-credit page and component comments no longer match the exact step-function math now implemented in `lib/subsidy.ts`.
4. Analytics, ads, consent behavior, and newsletter delivery are not truly production-wired yet.

If the goal is monetization in the next few months, the best angle remains good: calculator-first, parent-budget planning, state pages, tax/FSA savings, paid leave, and downloadable data. The niche is useful and monetizable, but trust is the product. The remaining work should prioritize factual freshness, clear source provenance, and proof that deployment/tests pass on the host.

## Verification summary

| Check | Result | Deployment meaning |
|---|---:|---|
| `npm run validate-data` | Pass: 21 CSV files, 36 sources | Data-source references are structurally healthier now. |
| `npx tsc --noEmit --pretty false` | Pass | TypeScript currently checks cleanly. |
| `npm test` | Blocked locally by Vite/Rolldown `spawn EPERM` before tests run | Test suite exists, but it was not proven in this environment. Must pass in CI/Linux/Vercel before launch. |
| `npm run build` | Compilation reached success, then failed locally with `spawn EPERM` / webpack cache permission errors | Likely environment-specific, but production build is not proven until it passes on the target deployment system. |
| `npm run lint` | Interactive Next lint setup prompt | Lint is not a usable CI gate until ESLint config is committed or the script is replaced. |

## Official sources spot-checked

These current official or primary references were checked during this audit and are relevant to the remaining recommendations:

- IRS Publication 505, 2026: confirms the 2026 child/dependent care credit maximum rate increase to 50%.  
  https://www.irs.gov/publications/p505
- IRS Publication 15-B, 2026: confirms dependent care assistance exclusion up to $7,500, or $3,750 if married filing separately, and confirms HCE nondiscrimination limits can restrict exclusion.  
  https://www.irs.gov/pub/irs-prior/p15b--2026.pdf
- IRS Revenue Procedure 2025-32: confirms 2026 federal tax bracket thresholds used by the FSA savings proxy.  
  https://www.irs.gov/pub/irs-drop/rp-25-32.pdf
- Maryland Department of Labor: confirms Maryland FAMLI contributions/benefits were delayed, with benefits now beginning in 2028.  
  https://labor.maryland.gov/whatsnews/laborannouncestheextensionofthestartdateoffamlibenefits.shtml
- California EDD: current PFL/SDI contribution and benefit amount page used by the state leave data.  
  https://edd.ca.gov/en/disability/Contribution_Rates_and_Benefit_Amounts/
- HHS/CMS Marketplace Integrity and Affordability Final Rule: source for 2026 ACA cost-sharing limits.  
  https://www.federalregister.gov/documents/2025/06/25/2025-11606/patient-protection-and-affordable-care-act-marketplace-integrity-and-affordability
- Child Care Aware of America price landscape: source family for state childcare estimates.  
  https://www.childcareaware.org/price-landscape24/
- Peterson-KFF Health System Tracker pregnancy/childbirth cost data: source for delivery billed and out-of-pocket anchors.  
  https://www.healthsystemtracker.org/brief/health-costs-associated-with-pregnancy-childbirth-and-postpartum-care/

## Confirmed fixes since the older audits

These are important because they remove several earlier launch blockers:

- `components/ChildcareCalculator.tsx` now accepts `initialStateCode`; `app/state-childcare-costs/[state]/page.tsx` passes the current state code. The old "Texas page shows California calculator" bug is fixed.
- `lib/calculator.ts` now uses `isFirstBaby` in gear and clothing calculations. The old "first baby toggle does nothing" bug is fixed.
- `components/EmailCapture.tsx` now renders an honest "not collecting emails yet" state when `NEXT_PUBLIC_NEWSLETTER_ENDPOINT` is unset.
- Homepage cards no longer use generic `Open` CTAs; they now use specific action verbs.
- `lib/subsidy.ts` now implements 2026 CDCTC/FSA logic as pure functions, including a statutory step function and 2026 bracket proxy arrays.
- `scripts/validate-csv.mjs` now checks manifest/source registry relationships and the new `state_leave.csv` source IDs.
- `public/data/state_leave.csv` now includes row-level `source_id`, `source_url`, and tier fields for paid-leave formulas.
- `components/Breadcrumbs.tsx` includes a visible breadcrumb component, and visible breadcrumbs are now used on state childcare and paid-leave state pages.
- The c-section page now links the CMS/HHS final rule for 2026 ACA cost-sharing limits.
- `app/privacy/page.tsx` is updated to mention optional email signup, ads, affiliate links, and cookies.
- `app/methodology/page.tsx` now avoids the old false claim that the site does not touch FSAs/tax credits at all.

## P0 - Fix before deployment or serious traffic

### P0-1. Production build/test/lint gates are not deployment-ready

Evidence:

- `npm run validate-data` passes.
- `npx tsc --noEmit --pretty false` passes.
- `npm test` fails before tests execute because Vite/Rolldown hits `spawn EPERM`.
- `npm run build` compiles, then fails in this environment with `spawn EPERM` / webpack cache permission errors.
- `npm run lint` triggers the interactive Next lint setup prompt instead of running a deterministic lint check.

Why it matters:

The site has tax, insurance, paid-leave, and medical-cost-adjacent calculators. It needs a boring, repeatable deployment gate. Right now the data and type checks are proven locally, but the full build and test suite are not proven in this environment.

Recommendation:

- Run `npm test`, `npm run build`, and `npm run validate-data` on the actual target environment or a clean Linux CI runner before deployment.
- Add a committed ESLint config or remove/replace `npm run lint` as a required launch command. Do not leave a launch checklist that asks for an interactive prompt.
- Add a deployment checklist item that records the exact successful build environment, Node version, package-manager version, and command output.

### P0-2. Paid-leave hub has stale and contradictory copy after the CSV update

Evidence:

- `public/data/state_leave.csv` currently has 13 paid jurisdictions total: CA, CO, CT, DE, DC, ME, MA, MN, NJ, NY, OR, RI, WA. That is 12 states plus DC, not "13 states + DC."
- `app/maternity-leave-by-state/page.tsx` says: "13 states + DC currently run mandatory paid family-leave programs."
- The same page still says `Last reviewed 2026-05-01`, but `state_leave.csv` and `source_registry.csv` now show `2026-05-19` for the state leave refresh.
- The same page says "Delaware, Maine, Maryland, Minnesota launched payments in 2026." Maryland is now delayed, and the source registry correctly records benefits beginning in 2028.
- `app/sitemap.ts` still sets `/maternity-leave-by-state` to `2026-05-01`.

Why it matters:

This is a high-trust page. Paid leave rules are current-year, state-specific, and easy for readers to verify against official state pages. A stale headline undermines the stronger CSV work that was just added.

Recommendation:

- Change the hub language to "12 states plus DC" or "13 jurisdictions including DC."
- Update the footer note to `Last reviewed 2026-05-19`.
- Remove Maryland from the "launched payments in 2026" sentence; reword as "Delaware, Maine, and Minnesota launched benefits in 2026; Maryland is delayed until 2028."
- Update `app/sitemap.ts` review date for `/maternity-leave-by-state` to `2026-05-19`.
- On state leave pages and the hub table, replace the flat label `Wage replacement` with `Wage replacement, up to` or show the tiered formula where `low_tier_pct` and `upper_tier_pct` differ.

### P0-3. Childcare tax-credit page copy still describes a simplified schedule, while code now uses exact step logic

Evidence:

- `lib/subsidy.ts` now correctly models the CDCTC as a two-phase step function using `Math.ceil`.
- `components/SubsidyCalculator.tsx` comments still say the phase-out is modeled as a smooth linear glide and cite the wrong OBBBA section numbers.
- `app/childcare-subsidy-calculator/page.tsx` still says the CDCTC is "35% across a broad middle band" and then "phases down" above $103k / $206k. That is too simplified for a page whose core promise is 2026 tax-credit accuracy.
- The FAQ text includes literal Markdown emphasis in a string: `*reduce*`. The site renders FAQ strings as text, so this may display as asterisks instead of emphasis.

Why it matters:

The math is better than the copy now. That is a good problem, but still a problem. A tax calculator cannot have internal comments and public explanation disagreeing with the code.

Recommendation:

- Update the public explanation to describe the exact step schedule in plain language:
  - 50% up to $15,000 AGI, or $30,000 married filing jointly.
  - Then reduce by 1 percentage point per $2,000, or $4,000 married filing jointly, until the 35% floor.
  - Then hold at 35% until $75,000, or $150,000 married filing jointly.
  - Then reduce by 1 percentage point per same step until the 20% floor.
- Remove the "smooth linear glide" comment from `components/SubsidyCalculator.tsx`.
- Correct the OBBBA section references to match the current source registry and law text.
- Replace `*reduce*` with plain `reduce` or render FAQ answers as rich content intentionally.

### P0-4. Monetization scripts should not be enabled until ads, analytics, and consent are truly wired

Evidence:

- `components/AdSlot.tsx` returns `null` when `NEXT_PUBLIC_ADSENSE_CLIENT` is unset, which is good.
- If `NEXT_PUBLIC_ADSENSE_CLIENT` is set, `AdSlot` renders a dashed placeholder, not an AdSense `<ins class="adsbygoogle">` unit.
- `lib/analytics.ts` can send to `window.gtag` or `window.plausible`, but there is no loader script in `app/layout.tsx`.
- `components/CookieBanner.tsx` records accept/decline but does not gate any actual analytics/ad script loading yet.
- `next.config.mjs` expands CSP when env vars exist, but CSP allow-listing is not the same as loading those services.

Why it matters:

The site is positioned to monetize through ads, affiliates, and email. If environment variables are set too early, readers may see fake ad slots, analytics may still be absent, and cookie consent may imply control that is not connected to script loading.

Recommendation:

- Do not set `NEXT_PUBLIC_ADSENSE_CLIENT` until `AdSlot` is replaced with real AdSense units and the AdSense script is loaded properly.
- Choose one analytics provider for launch. Plausible is the cleanest fit for a simple content/calculator site.
- Make the cookie banner decision actually gate non-essential analytics/ad scripts, or change the banner language until that is true.
- Add a prelaunch browser check: accept cookies, decline cookies, reload, and verify which network calls fire in each case.

## P1 - Fix before SEO push, monetization, or affiliate outreach

### P1-1. Header/navigation needs a clearer information architecture

Current state:

- Header links are flat: Home, Childcare, Diapers, Feeding, Gear, Birth & Insurance, Tax credits, Leave, By State.
- `Home` is redundant because the logo already links home.
- `By State` is ambiguous.
- `Tax credits` undersells the page because the page is really "Tax & FSA."
- `Leave` should be "Paid Leave" for clarity and keyword fit.
- There is no active-state styling.
- At larger widths, the nav exposes too many similar calculator links at once.

Recommended launch header:

Desktop:

`Logo | Baby Cost | Childcare | Birth Costs | Tax & FSA | Paid Leave | More v | Start estimate`

Suggested `More` menu:

- Diapers
- Feeding
- Gear
- C-section vs vaginal
- Daycare vs nanny
- Registry essentials
- Second baby
- Methodology

Mobile:

- Start estimate
- Baby Cost
- Childcare
- Childcare by state
- Birth Costs
- Tax & FSA
- Paid Leave by state
- Diapers
- Feeding
- Gear
- Guides
- Methodology

Why this is better:

It puts the highest-intent money pages first: total baby cost, childcare, birth/insurance, tax/FSA, and paid leave. It keeps individual sub-calculators discoverable without making the header look like a utility drawer.

Implementation notes:

- Add `usePathname()` to highlight the current page or section.
- Remove `Home` from the nav.
- Rename `Birth & Insurance` to `Birth Costs`.
- Rename `Tax credits` to `Tax & FSA`.
- Rename `Leave` to `Paid Leave`.
- Rename `By State` to `Childcare by State`.
- Keep a dropdown lightweight. Two dropdowns are probably too much before traffic validates behavior.

### P1-2. Visible breadcrumbs are implemented but only used on two deep-page families

Evidence:

- `components/Breadcrumbs.tsx` includes `VisibleBreadcrumbs`.
- It is used on `app/state-childcare-costs/[state]/page.tsx`.
- It is used on `app/maternity-leave-by-state/[state]/page.tsx`.
- Most guide and calculator pages only emit JSON-LD breadcrumbs and do not show visible breadcrumbs.

Recommendation:

- Add visible breadcrumbs to all non-home content pages, especially:
  - `/childcare-subsidy-calculator`
  - `/c-section-vs-vaginal-cost`
  - `/registry-essentials`
  - `/second-baby-cost`
  - `/monthly-baby-budget`
  - `/daycare-vs-nanny-cost`
  - `/methodology`
- Keep the visible breadcrumb labels aligned with JSON-LD labels.

SEO benefit:

This helps users orient themselves, improves internal linking, and gives the site a more mature editorial feel.

### P1-3. State paid-leave pages should show tiered wage replacement, not just one percentage

Evidence:

- `public/data/state_leave.csv` now includes `low_tier_pct`, `upper_tier_pct`, and `low_tier_cap_pct`.
- The UI still mostly displays `Math.round(s.wageReplacementPct * 100)%`.
- For tiered programs like CA, CO, CT, MA, OR, and WA, a single percentage can mislead higher earners or lower earners depending on which tier was stored as the headline value.

Recommendation:

- On state pages, show:
  - `Up to 90%` as the headline when appropriate.
  - A smaller line explaining the tier: "90% on wages up to X threshold, then 70%/50% above, capped at $Y/week."
- Add a simple leave-income estimator:
  - State
  - Weekly wage or annual salary
  - Birth parent vs bonding leave
  - Estimated weekly benefit
  - Max weekly cap
  - Estimated total benefit over paid weeks

Monetization benefit:

This is a strong SEO and retention feature. A "paid maternity leave calculator by state" is more useful than another static state table, and it can internally link to childcare and baby-budget calculators.

### P1-4. The main calculator still lacks shareable URLs

Evidence:

- `components/MainCalculator.tsx` keeps calculator state in React state only.
- Copy and print exist, but inputs are not encoded in the URL.

Recommendation:

- Encode major inputs into query params or a compact hash:
  - state
  - childcare plan/months/hours
  - feeding plan/type
  - diaper plan/brand
  - gear tier/used/registry help
  - insurance/delivery
  - first baby/additional child
- Add `Copy share link`.
- On load, parse the query and hydrate the calculator.

SEO/user benefit:

Shareable estimates create natural backlinks, partner sharing, forum discussion, and "here is my scenario" behavior.

### P1-5. Monthly chart cash flow is still an approximation

Evidence:

- `lib/calculator.ts` still distributes feeding as `feeding.mid / 12`.
- Formula cost is not truly flat month by month in real life.
- Gear and medical are front-loaded, which is modeled partly, but feeding and some recurring categories are still simplified.

Recommendation:

- Use `formula_cost_per_month.csv` or a month curve for feeding on the monthly chart.
- Keep a tooltip: "Annual total is accurate to the selected assumptions; monthly view is a cash-flow estimate."
- Consider a toggle:
  - "Annual planning view"
  - "Cash-flow by month"

### P1-6. Docs and handoff files are stale relative to the current app

Evidence:

- `README.md` still says "5 specialized calculators," but the app now has more calculators and guide pages.
- `README.md` references `local-server.js`; that file was not present in the current file list.
- `README.md` says the site has AdSlot placeholders, but the current component returns `null` unless an ad env var is set.
- `LAUNCH.md` still references Maryland launch timing that no longer matches the updated CSV/source registry.
- `data/csv/README.md` does not fully document the new source registry, data manifest, `state_leave.csv`, or state-leave tier columns.

Recommendation:

- Update README after the next code fixes, not before.
- Make `LAUNCH.md` a true current checklist:
  - clean install
  - validate data
  - test
  - build
  - deploy preview
  - crawl preview
  - verify analytics/ad consent
  - submit sitemap
- Update `data/csv/README.md` so another maintainer can safely edit the CSVs without guessing.

### P1-7. Retail/internal source rows need stronger provenance before affiliate monetization

Evidence:

- `source_registry.csv` has `retail-q1-2026` with URL `#` and confidence `medium`.
- That internal source underpins diapers, wipes, formula, breastfeeding supplies, gear, clothing, registry coverage, misc monthly, and presets through `data_manifest.csv`.

Recommendation:

- Keep the internal retail snapshot, but add a reproducible evidence file:
  - sampled retailer
  - product/brand
  - package size
  - price
  - date checked
  - URL or archived screenshot/reference
  - normalized unit price
- For affiliate pages, do not imply product rankings are independent unless the price sample is documented and the affiliate relationship is disclosed nearby.
- Consider `public/data/retail_snapshot_q1_2026.csv` or a private `data/source_snapshots/` file if you do not want to expose retailer URLs publicly yet.

### P1-8. Affiliate experience is structurally safe but not yet revenue-ready

Evidence:

- `components/AffiliateLink.tsx` correctly uses `rel="sponsored noopener nofollow"`.
- `app/registry-essentials/page.tsx` includes an affiliate disclosure near the link cluster.
- The current Babylist link appears to be a plain non-affiliate link.

Recommendation:

- Add 2-3 affiliate clusters only where user intent is strongest:
  - Registry essentials
  - Baby gear budget
  - Diaper calculator
  - Formula/feeding calculator
- Do not scatter affiliate links across every page before trust is established.
- Make the affiliate block helpful:
  - "Where to compare registry prices"
  - "Questions to ask before buying"
  - "What to buy new vs used"
- Use affiliate links as a secondary action after the calculator result, not before.

### P1-9. Article JSON-LD dates should use real per-page review dates

Evidence:

- `ArticleJsonLd` defaults to `datePublished = '2026-01-01'`.
- Many pages do not pass `dateModified`.
- `app/sitemap.ts` already has a review-date table.

Recommendation:

- Export a route review-date map and reuse it for:
  - sitemap
  - article JSON-LD `dateModified`
  - visible "Last reviewed" notes where relevant
- Do not use one default date for every article.

### P1-10. State leave related-link block is too generic

Evidence:

- `app/maternity-leave-by-state/[state]/page.tsx` shows the first six other paid states after filtering, not the most relevant states for the current reader.
- The state childcare page already uses a better deterministic "closest cost" neighbor strategy.

Recommendation:

- Choose related paid-leave state links by:
  - same region where possible
  - similar paid weeks
  - similar wage replacement/cap
  - high-volume neighboring states
- Add a fallback list only if there are fewer than six relevant states.

## P2 - Improve after P0/P1, but useful for traffic growth

### P2-1. Homepage "No signup" should be more precise

Current homepage says `No signup`. The privacy/FAQ copy now correctly explains optional email signup. To avoid a minor trust mismatch, change the hero proof point to:

`No signup required to use calculators`

### P2-2. One old cool-teal literal remains in the homepage final CTA background

Evidence:

- `app/page.tsx` still uses `rgba(38,169,156,0.55)` in the final CTA background.

Recommendation:

- Replace the old teal literal with the current warm palette token or a softer warm neutral.

### P2-3. Sitewide schema can be stronger

Recommendation:

- Add sitewide `Organization` schema.
- Add `WebSite` schema.
- Add `SearchAction` only if you add real site search.
- Keep page-level FAQ schema only where FAQ content is truly visible on that page.

### P2-4. Per-page OG images are still thin

Current state:

- The site has general OG image handling, but most pages do not have distinct visual cards.

Recommendation:

- Add generated OG cards for the highest-value pages:
  - home calculator
  - childcare calculator
  - childcare by state
  - tax/FSA calculator
  - paid leave by state
  - birth insurance planner
  - registry essentials

Design direction:

- Use clean editorial cards, not stock baby photos.
- Include one strong number or concept per card.
- Keep the brand palette warm and consistent.

### P2-5. The site has no real photography, which is acceptable for launch but limits editorial warmth

For this niche, calculator-first is better than generic baby stock photos. Do not add random lifestyle images. If adding visuals, use:

- Simple cost breakdown illustrations.
- State-map style visuals for childcare/paid leave.
- Small icon-based category visuals for diaper, feeding, gear, medical.
- A downloadable spreadsheet preview image for the lead magnet once it exists.

Avoid:

- Generic smiling baby stock photos.
- Hospital stock photos that imply medical advice.
- Product photos unless they are tied to a clear affiliate/comparison block.

### P2-6. Birth insurance calculator optional inputs need clearer behavior

Evidence:

- `components/BirthInsuranceCalculator.tsx` only refines the estimate when both `deductibleRemaining` and `oopMaxRemaining` are numbers.
- If a user enters only one of those fields, the estimate silently keeps the default model.

Recommendation:

- Add helper text: "Enter both deductible remaining and out-of-pocket max remaining to refine this estimate."
- Or show a small inline notice when only one is filled.

### P2-7. Add lightweight browser-visible QA before final launch

Manual browser checklist:

- Homepage desktop and mobile: hero, main calculator, CTA, footer.
- Main calculator: change each major option and confirm total changes.
- State childcare page: verify the embedded calculator starts in that state.
- Childcare subsidy page: check CDCTC/FSA scenarios at threshold values.
- Paid leave hub: verify count, review date, table values, and one paid/no-paid state page.
- Registry essentials: verify affiliate disclosure is near affiliate link cluster.
- Privacy/cookie: accept/decline banner and verify behavior.
- Print/save PDF on main calculator.

## Calculator-specific notes

### Main first-year calculator

Status: strong for launch after deployment gates pass.

Good:

- `isFirstBaby` now affects gear and clothing.
- Childcare none/family behavior is improved.
- Copy estimate and print/save PDF exist.
- Breakdown categories and warm palette are clearer.

Still worth improving:

- Add shareable URLs.
- Use a month-specific feeding curve in the chart.
- Consider a "Save scenario" or "Compare two scenarios" feature later.

### Childcare calculator

Status: strong.

Good:

- State pages now pass the correct state into the calculator.
- Care-type options are natural and understandable.

Still worth improving:

- Add shareable URLs for state/care/month/hour scenarios.
- Add city-level expansion only after validating traffic on state pages.

### Childcare subsidy / tax-credit calculator

Status: math improved, copy needs alignment.

Good:

- Pure calculation module exists.
- 2026 FSA cap is modeled.
- CDCTC no-double-dip rule is modeled.
- 2026 bracket proxy arrays are explicit.

Needs fix:

- Public schedule explanation is too simplified.
- Component comments are stale and cite wrong section numbers.
- State tax credits are not modeled; keep disclaimer visible.

### Paid leave pages

Status: useful but needs stale-copy cleanup before launch.

Good:

- `state_leave.csv` is much richer now.
- Official source URLs and source IDs are present.
- State-specific pages exist.

Needs fix:

- Hub count/date/Maryland copy.
- Tiered wage replacement display.
- Add a real income replacement calculator when possible.

### Birth and insurance planner

Status: useful and differentiated.

Good:

- Strong question lists.
- Better source anchoring.
- Newborn separate deductible consideration is valuable.

Still worth improving:

- Clarify optional input behavior.
- Add share link.
- Add a printable "call insurer / call hospital" checklist as a lead magnet.

### Registry, gear, diapers, feeding

Status: good launch support pages, but source evidence for retail assumptions should be tightened before heavy affiliate use.

Good:

- Practical user intent.
- Affiliate disclosure component exists.
- Product claims have been softened.

Still worth improving:

- Add a reproducible retail snapshot.
- Keep affiliate blocks useful and restrained.
- Avoid implying independent product rankings unless sourced.

## SEO/content opportunity list

Highest-value additions after P0/P1:

1. `Dependent Care FSA vs Child and Dependent Care Tax Credit`  
   Intent: exact search, high value, high trust. Should link to the calculator.

2. `Paid maternity leave calculator by state`  
   Intent: stronger than a static table. Uses the new state_leave tier columns.

3. `How much does a baby cost per month?`  
   If the page already exists, strengthen it around month-by-month cash flow and link it heavily from the homepage.

4. `Hospital birth bill checklist`  
   Lead magnet and email capture fit. Strong for birth-insurance planner.

5. `Baby budget spreadsheet`  
   This is the most natural email monetization asset. Do not promise it until the automation/download is real.

6. `Childcare cost by city`  
   Only after state pages get indexed. Start with 20-30 high-volume metros, not all cities.

7. `Second baby cost calculator`  
   Current page is content-only. A lightweight calculator would be more linkable.

8. `Daycare affordability by income`  
   Strong angle: compare state childcare cost to household income and the 7% HHS benchmark.

## Recommended fix order

### Do before deployment

1. Prove `npm test` and `npm run build` on the deployment target or clean CI.
2. Make lint non-interactive or remove it from launch requirements.
3. Fix paid-leave hub count/date/Maryland copy and sitemap date.
4. Align childcare tax-credit public copy and comments with exact step-function math.
5. Keep ad and analytics env vars unset until real scripts and consent gating are implemented.

### Do before SEO push

6. Header/nav label and order cleanup.
7. Visible breadcrumbs on all important guide/calculator pages.
8. State paid-leave tier display.
9. Shareable URLs for main calculator and subsidy calculator.
10. Update README, LAUNCH.md, and data/csv/README.md.

### Do before monetization push

11. Implement real analytics with consent behavior.
12. Implement real ad units, not placeholders.
13. Add a real workbook/download flow before collecting email.
14. Add a reproducible retail snapshot behind gear/diaper/formula claims.
15. Create 2-3 carefully placed affiliate clusters on high-intent pages.

## Final assessment of niche and angle

The niche is still worth pursuing. The broad idea "baby cost calculator" is competitive, but this site has a better angle than a generic blog if it stays calculator-first and source-first:

- First-year total calculator for the broad query.
- State childcare pages for programmatic SEO.
- Tax/FSA calculator for high-value, high-trust intent.
- Paid leave pages for current-year state-specific traffic.
- Birth/insurance planner for differentiated pain-point content.
- Registry/gear pages for affiliate monetization.

The site should not try to look like a parenting magazine. It should look like a practical financial planning tool for expecting parents. That means the winning formula is:

- fewer claims,
- stronger sources,
- better calculators,
- clear update dates,
- simple navigation,
- printable/shareable outputs,
- restrained affiliate placement.

The brand can expand beyond "first year" later, but if a rebrand happens, do it before serious SEO push so canonical URLs, metadata, social profiles, and backlinks are not split across identities.
