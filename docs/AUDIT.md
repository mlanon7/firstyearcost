# FirstYearCost — Site Audit

Audit date: 2026-05-08
Scope: full project (`D:\claude projects\firstyearcost`)
Auditor: end-to-end review of pages, components, data, calculator logic, FAQs, sources, SEO, and UI

---

## 1. What's there now

### Project type & stack
- Next.js 14.2.18 (App Router) + React 18.3 + TypeScript (strict mode on).
- Tailwind CSS 3.4 with a custom palette (`ink`, `teal`, `coral`, `sun`, `cream`) defined in `tailwind.config.ts`. Design tokens are duplicated as CSS custom properties in `app/globals.css`.
- Recharts 2.13 for the month-by-month chart, Lucide-react 0.468 for icons.
- No data layer — all assumptions are static TS modules under `data/`.
- No tests, no linter config beyond Next's default `next lint`, no CI config in repo.
- Security headers configured in `next.config.mjs` (X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy). No HSTS, no CSP.
- AdSense slots are placeholder `<div>`s in `components/AdSlot.tsx` — no live ad code yet.
- Cookie banner in `components/CookieBanner.tsx` writes a single key (`fyc-cookie-consent-v1`) to `localStorage`.

### Routes (verified against `app/sitemap.ts`)
| Route | File | Purpose |
|---|---|---|
| `/` | `app/page.tsx` (294 lines) | Hero + main first-year calculator + 6-card "Why ranges" + calculator directory + trust bar + FAQ + CTA |
| `/childcare-calculator` | `app/childcare-calculator/page.tsx` | Childcare-only calculator with 5-FAQ block |
| `/diaper-calculator` | `app/diaper-calculator/page.tsx` | Diaper/wipes calculator + FAQ |
| `/formula-vs-breastfeeding-calculator` | `app/formula-vs-breastfeeding-calculator/page.tsx` | Feeding cost calculator + FAQ |
| `/baby-gear-budget` | `app/baby-gear-budget/page.tsx` | Gear budget planner + FAQ |
| `/birth-insurance-planner` | `app/birth-insurance-planner/page.tsx` | Birth/insurance OOP planner + FAQ |
| `/state-childcare-costs` | `app/state-childcare-costs/page.tsx` | All-states index with cheapest/priciest cards + table |
| `/state-childcare-costs/[state]` | `app/state-childcare-costs/[state]/page.tsx` | One page per state (51 generated via `generateStaticParams`) |
| `/monthly-baby-budget` | `app/monthly-baby-budget/page.tsx` | 12-month narrative guide |
| `/daycare-vs-nanny-cost` | `app/daycare-vs-nanny-cost/page.tsx` | Comparison page (orphaned — see Bugs) |
| `/methodology` | `app/methodology/page.tsx` | Source list pulled from `data/sourceNotes.ts` |
| `/faq` | `app/faq/page.tsx` | 10-item global FAQ |
| `/privacy`, `/terms` | `app/privacy/page.tsx`, `app/terms/page.tsx` | Legal pages |
| `/sitemap.xml` | `app/sitemap.ts` | Dynamic; lists all of the above + 51 state pages |
| `/robots.txt` | `app/robots.ts` AND `public/robots.txt` | Two competing definitions (see Bugs) |
| `/opengraph-image` | `app/opengraph-image.tsx` | Dynamic OG image, `runtime: 'edge'` |
| `/icon` | `app/icon.tsx` | 32×32 favicon (just "$") |
| 404 | `app/not-found.tsx` | Custom 404 |

### Components (16 files, ~2.0k lines)
- Layout: `Header.tsx` (sticky, mobile burger), `Footer.tsx` (4-column), `CookieBanner.tsx`.
- Calculators: `MainCalculator.tsx` (446 lines — the "everything" form on the homepage), plus four standalone calculators (`ChildcareCalculator`, `DiaperCalculator`, `FeedingCalculator`, `GearCalculator`, `BirthInsuranceCalculator`).
- Primitives: `Segmented`, `Slider`, `StatCard`, `BreakdownBar`, `MonthlyChart`, `Disclaimer`, `SectionHeader`, `AdSlot`, `FAQ`/`FAQSchema`.

### Data (~460 lines total)
- `data/assumptions.ts` — diaper, wipes, formula, breastfeeding, gear, clothing, birth OOP, newborn medical, misc monthly. `lastReviewed: 2026-04-30`.
- `data/stateChildcare.ts` — all 50 states + DC, with `centerLow/High`, `homeLow/High`, `nannyMid`, `pctMedianIncome`. Slug + lookup helpers.
- `data/presets.ts` — six scenario presets for the homepage calculator.
- `data/sourceNotes.ts` — nine source-note records pulled into the methodology page.
- `content/faqHome.tsx` — 10 FAQ entries used on the homepage.

### Calculator logic
`lib/calculator.ts` (426 lines) is the core. The math: childcare prorated by months & care type, feeding by plan + formula type, diapers month-by-month, gear with `usedFactor × (1 - registryCoverage)`, medical = birth OOP + newborn first-year OOP, misc = monthly bundle × 12. A 12-row month-by-month breakdown is built for the chart.

### How it runs
`npm install && npm run dev` → `localhost:3000`. No env vars required for MVP. Build deploys to Vercel cleanly per the README.

---

## 2. Content gaps & pages worth adding

Sorted roughly by SEO/traffic potential. Difficulty is rough engineering effort, not content effort.

### Tier 1 — high traffic intent, moderate build

1. **Per-state birth-cost pages** — `/birth-cost/[state]/`
   *Cover:* state-level Medicaid eligibility for pregnancy, average billed and OOP delivery cost, in-state hospital vs. out-of-state, common state-specific programs (e.g., NY's Family Health Plus, CA's Medi-Cal pregnancy coverage).
   *Why:* "cost of having a baby in [state]" is a high-intent search; no per-state page exists yet for this.
   *Difficulty:* medium. Need to extend `data/` with a `stateBirth.ts` file (state-by-state Medicaid income limits, average employer-plan OOP). Reuse the [state] route pattern.

2. **Childcare cost in [city/metro]** — `/childcare-cost/[metro]/`
   *Cover:* top 30 metros (NYC, LA, SF, Seattle, Boston, DC, Chicago, etc.) with metro-level center, home, and nanny ranges.
   *Why:* state-level data hides huge in-state variance (San Francisco vs. Bakersfield, Boston vs. Worcester). Metro pages capture the long tail.
   *Difficulty:* medium-high — requires sourcing metro-level data (Care.com, Procare's surveys, BLS).

3. **"Cost of having a baby with [insurance type]" cluster** — `/cost-of-having-a-baby/employer/`, `/medicaid/`, `/marketplace/`, `/uninsured/`
   *Cover:* expand the existing birth-insurance-planner into 4 dedicated pages, each with its own FAQ, programs, and "questions to ask".
   *Why:* targets distinct search intents; current single page is generic.
   *Difficulty:* low — same calculator component, segmented content.

4. **Twins / multiples calculator** — `/twins-cost-calculator/`
   *Cover:* what scales linearly (diapers, formula, daycare slots) vs. what doesn't (one car, one nursery). The README already lists this as roadmap.
   *Why:* very specific niche, low competition, stuck-out-from-other-baby-cost-calc factor.
   *Difficulty:* low-medium — extend `CalculatorInputs` with `babyCount` and apply per-line multipliers in `lib/calculator.ts`.

5. **Glossary** — `/glossary/` or `/baby-cost-glossary/`
   *Cover:* deductible, OOP max, coinsurance, FSA, DCFSA, CDCTC, EPO/PPO/HMO, "global maternity package", balance billing, nanny share, Au pair, room-sharing, well-baby visit. Each term gets its own anchor.
   *Why:* huge SEO play (one page can rank for dozens of "[term] meaning" queries) and gives the site a reference flavor.
   *Difficulty:* low.

### Tier 2 — strong content / good internal linking

6. **Tax credits & savings programs** — `/baby-tax-credits/`
   *Cover:* Child Tax Credit, CDCTC, Dependent Care FSA, HSA usage for pregnancy expenses, 529 plans, EITC bumps from a new dependent, state-level tax credits.
   *Why:* high intent, evergreen, complements the calculators.
   *Difficulty:* medium — need careful sourcing (IRS, state DORs).

7. **Parental leave by state / employer** — `/parental-leave-by-state/`
   *Cover:* state PFML programs (CA, NJ, NY, MA, WA, CT, OR, CO, etc. — 13 states + DC have programs in 2026), FMLA federal floor, employer top-up patterns.
   *Why:* parental-leave research is a top-of-funnel topic; the calculator already collects "unpaid leave months" but doesn't help users figure out what's paid vs. unpaid.
   *Difficulty:* medium — well-bounded data (DOL + state).

8. **Cost calculator: years 0-5 ("first five years")** — `/cost-of-raising-a-baby-five-years/`
   *Cover:* extend the calculator to age 5 covering daycare year 2-3, preschool year 4-5, food, pediatric care.
   *Why:* "cost to raise a child" is a far higher-volume query than "first year." This is a foundational expansion, not a niche page.
   *Difficulty:* high — new logic and assumption set, but very high payoff.

9. **Comparison: cloth vs. disposable diapers (cost + impact)** — `/cloth-vs-disposable-diapers/`
   *Cover:* full first-year cost difference, water & energy use, time cost, second-baby savings, hybrid approach.
   *Why:* pulls in environment + cost search intents.
   *Difficulty:* low — calculator already models both; this just needs the prose page.

10. **Formula recall & shortage tracker** — `/formula-recalls/`
    *Cover:* current FDA recall list (linked, not duplicated), 2022 shortage retrospective, what to do if your formula is recalled.
    *Why:* high recurring search demand around recall events.
    *Difficulty:* low for static; medium if you want it auto-updating.

11. **Hospital bag checklist + cost** — `/hospital-bag-checklist/`
    *Cover:* what to pack, what hospitals provide, what costs extra (e.g., parking, overnight food for partner).
    *Why:* very high search volume around third trimester.
    *Difficulty:* low.

### Tier 3 — nice-to-have

12. **Baby registry strategy guide** — `/baby-registry-guide/` covering what % of items typically get gifted at each registry tier, plus "what to skip" lists per gear category.
13. **Daycare onboarding checklist** — `/daycare-checklist/` paired with `ChildcareCalculator`.
14. **Lactation consultant cost & ACA coverage** — `/lactation-consultant-cost/`.
15. **Breast pump insurance guide** — `/breast-pump-insurance-coverage/`.
16. **Doula cost guide** — `/doula-cost/`.
17. **Postpartum / 4th trimester cost guide** — `/postpartum-cost/`.
18. **Returning to work cost** — `/returning-to-work-after-baby/` covering daycare drop-in, nanny gap-week pay, work-from-home setup.
19. **Side-by-side state comparison** — `/compare-states/?from=CA&to=TX` for relocating families.
20. **First-birthday party budget** — small but very searched.

### Calculator variants

- **What-if scenario comparison:** save two configurations side-by-side (e.g., "daycare from month 3" vs. "stay home until month 6") with delta cost.
- **Inflation-adjusted projection:** show what daycare may cost when baby is 3 (CCDF inflation factor).
- **"Should I quit my job?" calculator:** household income loss vs. childcare savings vs. taxes — a different framing of the leave question.
- **Hourly nanny rate ↔ annual cost converter** with state minimum wage validation.

---

## 3. FAQ sources — quality audit

The site has FAQ blocks on 7 pages. The factual claims rely heavily on three sources (KFF/Peterson-KFF, Child Care Aware, AAP). Most claims are defensible; below are the items worth tightening or replacing.

### Numerical claims that need refreshed sourcing

| Claim | Where | Status | Recommendation |
|---|---|---|---|
| "$2,743 OOP, $20,416 total employer plan" | `birth-insurance-planner/page.tsx` FAQ #1; `BirthInsuranceCalculator.tsx` line 199; `data/sourceNotes.ts` `kff-pregnancy-costs` | The current Peterson-KFF brief still cites $20,416 / $2,743 on its landing page, but a more recent KFF release (Aug 2024) shows ~$18,865 / $2,854 from a different cohort. Both numbers are live on KFF properties and reasonable people quote either. | Pick one and stay consistent. Recommend updating the headline number to $2,854 and citing the newer KFF release ([KFF, Aug 2024](https://www.kff.org/health-costs/women-who-give-birth-incur-nearly-19000-in-additional-health-costs-including-2854-more-that-they-pay-out-of-pocket/)). Keep the older Peterson-KFF link as a methodology footnote. |
| "Newborn under 3 months averaged $5,820 total spend, ~$475 OOP" | `data/sourceNotes.ts` `kff-pregnancy-costs.notes` | Older Peterson-KFF figure. The current Peterson-KFF analysis (claims 2021–2023) reports infants 0–2 years average $16,575 total / $1,511 OOP — different denominator (2-year window, not 3-month). | Either reanchor to the 0–2 year number (and rename the bucket) or remove the outdated notes line. The current $475 is only defensible if the page is explicit about "first 3 months." |
| "$15,712 vaginal / $28,998 C-section" implied through ranges | `data/assumptions.ts` `birthOOPRanges`, FAQ on `/birth-insurance-planner` | The Peterson-KFF brief explicitly publishes "$15,712 (with $2,563 OOP)" for vaginal and "$28,998 ($3,071 OOP)" for C-section. Your `mid` values for employer ($2,700 vaginal, $4,200 C-section) are above the KFF central value for C-section. | Adjust `birthOOPRanges.employer.csection.mid` from 4200 down to ~3100, OR cite the source the higher number comes from. Right now the calculator overestimates C-section OOP by ~30%. |
| "3,606,400 U.S. births in 2025 provisional data" | `data/sourceNotes.ts` line 19, URL `https://www.cdc.gov/nchs/pressroom/releases/20260409.html` | This URL does not exist. The 2024 final number (released July 2025) was 3,628,934. There is no 2025 provisional release for that URL pattern. | **High-severity factual error.** Remove or replace with [CDC NCHS final 2024 data brief #535](https://www.cdc.gov/nchs/data/databriefs/db535.pdf). The number in `notes` is fabricated. |
| "Most expecting families with a registry receive 30–60% of registry items as gifts; high-help can hit 70-80%" | `/baby-gear-budget` FAQ #4 | Unsourced. Babylist's own annual reports give a typical fulfillment of ~50% but the 70–80% figure is not in any public report I could verify. | Soften to "industry estimates" without specific %, or source to [Babylist Year in Registry](https://www.babylist.com/year-in-review) (year varies). |
| "U.S. Department of Health and Human Services has historically used 7% of household income as a benchmark for affordable" | `/childcare-calculator` FAQ #2 | True but the gloss is off. The 7% benchmark was set in the 2016 CCDF rule and applies specifically to *copayments for low-income families receiving subsidies*, not to all families. ([Bipartisan Policy Center primer](https://bipartisanpolicy.org/article/demystifying-child-care-affordability/)) | Add "for low-income families receiving subsidies" qualifier. Otherwise it implies HHS calls 7% affordable for everyone, which it doesn't. |
| "Twins typically run about 1.7–1.9× the first-year cost" | `/faq` FAQ #7 | Reasonable order of magnitude but not directly sourced. | Either cite a source ([NerdWallet's 2024 twin cost analysis](https://www.nerdwallet.com/article/insurance/cost-of-twins) or similar) or hedge with "in our model." |
| "Hospital cash discount 20–60%" | `/birth-insurance-planner` prose section | Plausible but unsourced. Patient Advocate Foundation cites typical self-pay discounts of 20–50% with negotiation. | Soften to "typically 10–50%" and cite [Patient Advocate Foundation](https://www.patientadvocate.org/explore-our-resources/insurance-denials-appeals/managing-medical-debt/) or remove the bound. |
| "Most plans give a 30-day window to add a newborn" | `/birth-insurance-planner` FAQ #4 | Correct under federal law (HIPAA/ACA "special enrollment for newborn") for group plans, often 30 or 60 days. Should cite. | Add link to [healthcare.gov: special enrollment events](https://www.healthcare.gov/coverage-outside-open-enrollment/special-enrollment-period/). |
| "ACA covers a breast pump" | feeding FAQ #3 | True. | Cite [HealthCare.gov breast feeding benefits](https://www.healthcare.gov/coverage/breast-feeding-benefits/). |
| "AAP recommends room-sharing... for the first 6 months" | `/baby-gear-budget` FAQ #5 | Currently correct per [AAP 2022 Safe Sleep policy](https://publications.aap.org/pediatrics/article/150/1/e2022057990/188304/). The 2022 policy says "ideally for at least the first 6 months" — your wording is right. | Add inline link to the AAP policy. |

### Sources to add to `data/sourceNotes.ts`

| Source | URL | Why |
|---|---|---|
| Child Care Aware 2024 Price & Supply | [`https://www.childcareaware.org/price-landscape24/`](https://www.childcareaware.org/price-landscape24/) | Replaces the methodology-2026 link as the actual data report. |
| KFF Aug 2024 release (Women who give birth incur ~$2,854 OOP) | [`https://www.kff.org/health-costs/women-who-give-birth-incur-nearly-19000-in-additional-health-costs-including-2854-more-that-they-pay-out-of-pocket/`](https://www.kff.org/health-costs/women-who-give-birth-incur-nearly-19000-in-additional-health-costs-including-2854-more-that-they-pay-out-of-pocket/) | More recent and frequently quoted in 2025/2026 press. |
| AAP 2022 Safe Sleep Policy (full text) | [`https://publications.aap.org/pediatrics/article/150/1/e2022057990/188304/`](https://publications.aap.org/pediatrics/article/150/1/e2022057990/188304/) | Replaces the generic `healthychildren.org` link with the primary policy. |
| CMS — No Surprises Act overview | [`https://www.cms.gov/nosurprises`](https://www.cms.gov/nosurprises) | Authoritative source for the No-Surprises claim in birth FAQ #5. |
| HealthCare.gov — breast pump coverage | [`https://www.healthcare.gov/coverage/breast-feeding-benefits/`](https://www.healthcare.gov/coverage/breast-feeding-benefits/) | Authoritative, replaces "ACA" generic claim. |
| CDC NCHS Data Brief #535 (births 2024 final) | [`https://www.cdc.gov/nchs/data/databriefs/db535.pdf`](https://www.cdc.gov/nchs/data/databriefs/db535.pdf) | Replaces the broken/fabricated 2025 provisional URL. |
| HHS — CCDF affordability rule (2016, with 7% benchmark) | [`https://www.federalregister.gov/documents/2024/03/01/2024-04139/improving-child-care-access-affordability-and-stability-in-the-child-care-and-development-fund-ccdf`](https://www.federalregister.gov/documents/2024/03/01/2024-04139/improving-child-care-access-affordability-and-stability-in-the-child-care-and-development-fund-ccdf) | Authoritative for the 7% claim. |
| Bureau of Labor Statistics — child-care occupational wages | [`https://www.bls.gov/oes/current/oes399011.htm`](https://www.bls.gov/oes/current/oes399011.htm) | If/when state metro pages launch — drives nanny ranges. |
| FDA infant formula recalls | [`https://www.fda.gov/safety/recalls-market-withdrawals-safety-alerts`](https://www.fda.gov/safety/recalls-market-withdrawals-safety-alerts) | If you build the recall page suggested above. |
| USPSTF / AAP well-baby visit schedule | [`https://www.aap.org/en/practice-management/bright-futures/`](https://www.aap.org/en/practice-management/bright-futures/) | Underpins the newborn medical OOP estimate. |

### Outdated / weak sources currently in use

- `aap-newborn-care` source points only to `https://www.healthychildren.org/` (the AAP's consumer site root). **Severity: low.** Better to point to specific articles per claim.
- `retail-q1-2026` has `url: '#'` — listed as "internal — sampled major US retailers." **Severity: medium.** It is fine to keep this as an internal, undated source for retail snapshots, but the methodology page renders the title without a clickable link. Either remove from the public list or replace `'#'` with a methodology footnote.
- `usda-coc` is correctly flagged as discontinued (last published 2017). Keep it but add the CIA Reading Room or USAFacts cross-reference if you want.
- `ccaoa-methodology` URL `/ccaoas-methodology-2026/` — verify this is live; the 2024 report's methodology lives at `/ccaoas-methodology-2025/`. **Severity: medium.** Worth checking whether the 2026 slug exists yet.

---

## 4. Visual / UI improvements

Sorted high-impact first. None of these break the site.

### High-impact

1. **Header navigation hides too aggressively on tablets.** *(Severity: medium)*
   `components/Header.tsx` line 28 (`hidden lg:flex`) and line 43 (`lg:hidden`). On any viewport under 1024px the entire nav collapses to a burger — that includes most iPad-portrait sizes. Seven items + CTA is a tight fit, but you can keep the most-used 4 (Childcare, Diapers, Feeding, By State) visible at `md:` and tuck the rest under a "More" dropdown. Recommendation: switch to a responsive condensed nav that retains 3–4 links from `md:` up.

2. **No persistent CTA after results render.** *(Severity: medium)*
   The CTA card at the bottom of `app/page.tsx` jumps users to `#calculator`, but on long state pages and the Methodology page there is no equivalent. Each calculator/state page should end with a one-line "Run the full first-year estimate" link to `/`. State pages already do this; the gear/diaper/feeding/birth pages do not.

3. **`MainCalculator` is a 446-line single file.** *(Severity: low–medium)*
   The component is readable but the inputs column is a wall of `<div>`s. Splitting into `<LocationSection>`, `<ChildcareSection>`, `<FeedingSection>`, etc. would make the homepage easier to maintain and let the same sub-sections be reused on the deep-dive calculator pages instead of having a separate `ChildcareCalculator`/`DiaperCalculator`/etc.

4. **Result card padding & line-height differs across calculators.** *(Severity: low)*
   - `MainCalculator.tsx` line 348: total uses `text-5xl font-extrabold tracking-tight`.
   - `ChildcareCalculator.tsx` line 176: `text-4xl font-extrabold tracking-tight`.
   - `DiaperCalculator.tsx` line 153, `FeedingCalculator.tsx` line 168, `GearCalculator.tsx` line 175: `text-4xl font-extrabold`.
   The homepage is `5xl`, every other calculator is `4xl`. Either standardize on `4xl` and let the homepage hero do the heavy visual lift, or pick one and apply everywhere via a shared `<TotalDisplay>` component.

5. **Mobile spacing on the breakdown bar table.** *(Severity: low)*
   `components/BreakdownBar.tsx` row layout is `flex items-center gap-3` with a fixed `w-20` for the value. On narrow screens (≤340px), labels like "Medical out-of-pocket" wrap onto two lines and the alignment shifts. Convert the layout to a 3-column grid so labels can wrap without misaligning the % + dollar values.

6. **Color contrast spot-checks.** *(Severity: medium)*
   `text-ink-500` (`#5e6b7b` per the palette ÷ derived) on `bg-cream` (`#fbf9f5`) is around 4.6:1 — clears WCAG AA. But `text-ink-400` on `bg-cream` (used on labels like the OG image's "50-state childcare data" tag and the "Per Year" sub-label on state cards) is only ~3.2:1 — fails AA for normal-size text. Bump those uses to `text-ink-500` or larger size.

7. **Cookie banner default action is "decline."** *(Severity: low)*
   `components/CookieBanner.tsx` line 35 — clicking the X persists `'decline'`. That's a defensible privacy choice but inconsistent with the visual hierarchy (the prominent button is "Accept all"). Either persist nothing on close (so it re-shows next visit) or relabel the X.

### Medium-impact

8. **Sticky header on scroll changes opacity but not blur on mobile.** *(Severity: low)*
   `Header.tsx` uses `backdrop-blur-md bg-cream/80`. iOS Safari occasionally fails to apply `backdrop-blur-md` on first paint. Add a fallback `bg-cream` class so the bar stays opaque if the blur fails.

9. **Result card on `BirthInsuranceCalculator` does not visually update when `hospitalCoinsurance` is entered.** *(See Bugs section #6.)* Either compute it or remove the input.

10. **Segmented control does not visually flag the "Unsure" option.** *(Severity: low)*
    "Unsure" appears as an equal segment in `feedingPlan`, `diaperPlan`, and `delivery` segmented controls. Subtly muting it (`opacity-80` until selected) would match the language ("pick if unsure") without breaking radio semantics.

11. **`Disclaimer` color is the same on every page.** *(Severity: low)*
    Always sun-yellow with `Info` icon. On the BirthInsuranceCalculator (which has its own coral-themed result card) the yellow disclaimer fights the page palette. Letting `<Disclaimer accent="...">` accept a tone would solve it.

12. **Slider thumb is hard to grab on touch devices.** *(Severity: low)*
    `app/globals.css` lines 197–215 — thumb is 18px. Recommend 24px on mobile and a 44×44 touch target via padding for accessibility.

13. **`MonthlyChart` legend gets cramped on small screens.** *(Severity: low)*
    Legend wraps to two rows on iPhone SE. Recharts legend wrapping is OK; just widen the chart container to use `min-h-[18rem]` so the chart doesn't squish.

### Low-impact / cosmetic

14. **Footer "Made for parents planning the first 12 months." reads like a tagline but isn't styled as one.** Cosmetic.
15. **Prose `<h3>` margin is inconsistent.** `prose-custom h3` uses `mt-8`, but headings inside cards (e.g., `BirthInsuranceCalculator` "Questions to ask your insurer") use `mb-3` only. Standardize.
16. **"Updated for 2026" pill on homepage does not appear on calculator sub-pages.** That fresh-content cue should appear on every calculator page so the user knows the data is current.
17. **No focus-visible rings on segmented buttons.** Tab-keyboard users see the browser's default outline — fine, but `Segmented.tsx` button loses the outline on `:active`. Add an explicit `focus-visible:ring-2 ring-teal-500` rule.
18. **`SectionHeader` `eyebrow` is not optional in usage; some calls pass `title` only.** That's fine; just makes the design slightly inconsistent. Consider always rendering an eyebrow for consistent rhythm.

---

## 5. SEO

### What's good
- Per-page canonical URLs everywhere.
- Title template (`%s | FirstYearCost`) is set in `app/layout.tsx`.
- Dynamic per-state metadata via `generateMetadata`.
- Dynamic sitemap covering all 51 state pages.
- FAQ JSON-LD on every FAQ-bearing page (`components/FAQ.tsx` `FAQSchema`).
- WebApplication JSON-LD on the homepage.
- Dynamic OG image generator at `app/opengraph-image.tsx`.
- Headers configured with X-Frame, X-CTO, Referrer-Policy, Permissions-Policy.
- `next/font`-style font stack via system fonts (no FCP cost).

### Issues

| # | Issue | Where | Severity | Recommendation |
|---|---|---|---|---|
| 1 | **`/daycare-vs-nanny-cost` is orphaned.** No internal link from header, footer, or any page links to it. Only present in `app/sitemap.ts`. | grep: `daycare-vs-nanny` returns 0 internal links | High | Add to footer "Resources" column and to the homepage's specialized-calculators grid. |
| 2 | **Two robots.txt files conflict.** `app/robots.ts` (dynamic) and `public/robots.txt` (static) both ship. Next.js precedence is undefined — typically the static file wins, which means the `host:` field and dynamic logic in `robots.ts` are ignored. | `app/robots.ts`, `public/robots.txt` | High | Delete `public/robots.txt`; keep the dynamic one. |
| 3 | **`robots.ts` has a non-standard `host` field.** Next's `MetadataRoute.Robots` does not support `host:`. It will be silently ignored. | `app/robots.ts` line 7 | Low | Remove the `host:` line. |
| 4 | **Per-page `openGraph` not overridden on child pages.** Only the root layout defines `openGraph`. State pages, calculator pages, FAQ, methodology — all get the homepage's OG title and description. | All `app/**/page.tsx` files except `app/layout.tsx` | High | Add `openGraph: { title, description }` to every page's `metadata` (per-state included via `generateMetadata`). Otherwise share-card previews on Twitter/Slack/LinkedIn always show "Estimate your baby's first-year cost" regardless of which page is being shared. |
| 5 | **No per-state `openGraph` image.** Only `app/opengraph-image.tsx` exists. State pages share the homepage image. | `app/state-childcare-costs/[state]/page.tsx` | Medium | Add `app/state-childcare-costs/[state]/opengraph-image.tsx` (Next supports it per route segment). At minimum include the state name. |
| 6 | **No BreadcrumbList JSON-LD.** State pages, sub-calculator pages, and the methodology page all benefit from breadcrumbs that match the site's hierarchy. | All non-home pages | Medium | Add a small `<BreadcrumbsJsonLd>` helper. |
| 7 | **No `Article` or `Dataset` schema on the methodology page.** It lists nine sources — perfect for a `Dataset`/`CreativeWork` schema. | `app/methodology/page.tsx` | Low | Optional but easy. |
| 8 | **No structured data on per-state pages.** State pages are content-rich (numbers, comparisons) but emit no structured data beyond inheriting the layout. | `app/state-childcare-costs/[state]/page.tsx` | Medium | Add `WebPage` + `BreadcrumbList` + `FAQPage` (use the per-state mini-FAQ) + `Place` (with `addressRegion`). |
| 9 | **Search Console / Bing Webmaster verification missing.** | `app/layout.tsx` `metadata` | Medium | Add `verification: { google: '...', other: { 'msvalidate.01': '...' } }` once you own the property. |
| 10 | **No `metadataBase` is documented for non-prod.** | `app/layout.tsx` line 8 — hardcoded `https://firstyearcost.com` | Low | Use `process.env.NEXT_PUBLIC_SITE_URL ?? 'https://firstyearcost.com'`. |
| 11 | **`alternates: { canonical: '/' }` in root layout** | `app/layout.tsx` line 41 | Low | Each page already sets its own canonical, but the layout-level one is technically redundant and can confuse parsers if a page forgets to override. Move into the home page only. |
| 12 | **`keywords` field still set on the root layout.** | `app/layout.tsx` line 12 | Low | Search engines ignore `<meta keywords>`; keep it only if you want it for internal documentation. |
| 13 | **No image alt audit possible — no `<img>` tags exist.** | n/a | n/a | When you add images (gear photos, etc.), use `next/image` with explicit `alt`. |
| 14 | **No `Twitter:image` or per-page Twitter title.** | `app/layout.tsx` only | Medium | Same fix as #4. |
| 15 | **Sitemap `priority` and `changeFrequency` are over-set.** Google ignores both fields these days but they're not harmful. | `app/sitemap.ts` | Low | Keep or drop; not blocking. |
| 16 | **Per-state pages randomize "Compare other states" links on every build.** That randomization happens at build time (so it's frozen until next deploy) but it changes between deploys, which means the internal-link graph for each state shifts unpredictably. | `app/state-childcare-costs/[state]/page.tsx` line 32 | Medium | Replace random with deterministic — e.g., pick the 4 nearest by `centerLow + centerHigh` and the 4 most-populated peers. Also helps internal SEO since Google sees stable cross-links. |
| 17 | **No `application-name` or `apple-mobile-web-app-title` meta** | n/a | Low | Include in `viewport` or top-level metadata for PWA-style installs. |
| 18 | **No JSON-LD `Organization`** | n/a | Low | A small `Organization` block (with `sameAs` pointing to your social handles when you have them) helps brand panels. |
| 19 | **`Slider` value updates do not trigger any URL state.** Calculator inputs are entirely client-side, so users can't share a deep-link to "California, daycare from month 6, hypoallergenic formula." | All calculators | Medium | Optional but high-value: encode inputs in `?q=` and parse on hydration. Has direct SEO value (long-tail share links) and UX value. |
| 20 | **No `loading.tsx` or `error.tsx`** | `app/` | Low | Optional; helps perceived performance. |
| 21 | **OG image uses `runtime: 'edge'`** | `app/opengraph-image.tsx` line 3 | Low | Fine, but if you ever switch to fully static output, drop `runtime: 'edge'`. |

### Page speed
- No images means LCP is text. Should be near-instant.
- Tailwind generates a single CSS file — fine.
- Recharts is loaded on the homepage (`MonthlyChart`) — it's a hefty dep (~80kB gzipped). Worth code-splitting via `dynamic(() => import('@/components/MonthlyChart'), { ssr: false })` so it doesn't bloat the homepage's initial JS bundle.
- AdSense not yet wired — when you add it, ensure `crossorigin="anonymous"` and consider deferring with `next/script` `strategy="afterInteractive"`.

---

## 6. Bugs & code issues

### High severity

| # | Issue | Location | Recommendation |
|---|---|---|---|
| 1 | **Fabricated CDC URL & births number.** `data/sourceNotes.ts` lines 17–22 reference `https://www.cdc.gov/nchs/pressroom/releases/20260409.html` and "3,606,400 U.S. births reported in 2025 provisional data." That URL does not exist; the 2025 provisional release does not exist as of audit date. The number is invented. | `data/sourceNotes.ts:17–22` | Replace with the real CDC NCHS Data Brief #535 (final 2024: 3,628,934 births), URL [`https://www.cdc.gov/nchs/data/databriefs/db535.pdf`](https://www.cdc.gov/nchs/data/databriefs/db535.pdf). Or remove `cdc-births-2025` entirely. |
| 2 | **Two robots.txt definitions ship.** `public/robots.txt` (static) and `app/robots.ts` (dynamic) coexist. Next.js will deploy whichever wins the route-resolution race; the dynamic `host:` field is then ignored. | `public/robots.txt`, `app/robots.ts` | Delete `public/robots.txt`. |
| 3 | **`/daycare-vs-nanny-cost` is unlinked from anywhere on the site.** Only present in the sitemap. Crawlers will discover it but users will not. | none links to it | Add to `Footer.tsx` "Resources" column and the homepage CalcLink grid in `app/page.tsx`. |
| 4 | **Random `sort()` call during static generation.** `sort(() => 0.5 - Math.random())` is biased (does not produce a uniform shuffle), and because it runs at build time it makes every build's internal link graph for state pages slightly different. | `app/state-childcare-costs/[state]/page.tsx:32` | Replace with a deterministic selection — e.g., pick the 4 cheapest and 4 priciest *neighbors* of the current state (sorted by `centerLow+centerHigh` distance) so the link graph is stable AND useful. |
| 5 | **`hospitalCoinsurance` input is dead.** Stored in state, listed as a `useMemo` dependency, and bound to an `<input>`, but the value is never used in the calculation. | `components/BirthInsuranceCalculator.tsx:17, 54, 109` | Either use it (apply `% × postDeductibleSpend` capped at OOP max) or remove the input. Currently misleading — users think it changes the result. |
| 6 | **`* 1.0` no-op multiplier in birth-cost calc, suggests forgotten edit.** | `lib/calculator.ts:280` | Remove. (Cosmetic but indicates the function was edited mid-flight and not finalized.) |

### Medium severity

| # | Issue | Location | Recommendation |
|---|---|---|---|
| 7 | **`birthOOPRanges.employer.csection.mid = 4200`** is high relative to the Peterson-KFF central value (~$3,071 OOP for C-section). | `data/assumptions.ts:127` | Adjust mid to ~$3,200 with low ~$2,000, high ~$6,500. Or document the discrepancy in a `notes` field on `sourceNotes.ts`. |
| 8 | **C-section OOP range and vaginal OOP range overlap heavily** because the calculator hardcodes ranges instead of computing from billed-amount × deductible/coinsurance. | `data/assumptions.ts:124–139` | When you re-source from KFF, also widen the vaginal high-end (KFF reports a 90th-percentile around $5,500 OOP). |
| 9 | **`<a href="/privacy">` in Cookie Banner** — uses a raw anchor instead of `next/link`, causing a full-page reload when the privacy link is clicked from the banner. | `components/CookieBanner.tsx:42` | Replace with `<Link href="/privacy">`. |
| 10 | **`as any` cast on `setStateCode`.** | `components/ChildcareCalculator.tsx:69` | Replace with the correct narrow type or assert via `StateCode`. |
| 11 | **`extractText` walks `(node as any).props`** — works but loses type safety and silently fails on `Fragment` children. | `components/FAQ.tsx:63–66` | Either type as `ReactElement<{children?: ReactNode}>` or convert FAQ answers to a plain `string` field for SEO use and a separate optional `aRich` field for in-page React rendering. |
| 12 | **Cookie banner X click persists "decline" without giving the user a chance to read the policy.** | `components/CookieBanner.tsx:36` | Either persist nothing on X (so it re-shows on next visit) or change the X to "Close (no choice yet)." |
| 13 | **No `Strict-Transport-Security` header.** Production site will be HTTPS via Vercel, but the header is missing. | `next.config.mjs` | Add `{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }`. |
| 14 | **No Content-Security-Policy header.** Once AdSense and analytics are added, you'll want at least a "permissive but explicit" CSP so XSS is bounded. | `next.config.mjs` | Add a baseline CSP — `default-src 'self'; img-src * data:; script-src 'self' 'unsafe-inline' https://pagead2.googlesyndication.com; ...` once the ad code is live. |
| 15 | **`new Date().getFullYear()` in Footer is rendered on the server.** OK for now. **But** the file is a Server Component (no `'use client'`); on revalidation interval (default 60s) the year may lag in long-lived deployments around January 1. | `components/Footer.tsx:51` | Optional fix: pass `dynamic = 'force-dynamic'` for the layout, or hard-code the year. |
| 16 | **"Part-time care... typically 60-70% of full-time price, not 60%" is internally contradictory.** Also, `app/childcare-calculator/page.tsx:87` says "65–75%". | `app/state-childcare-costs/[state]/page.tsx:88` | Pick one range (recommend 65–75%) and apply consistently. Also reflect the same factor in `lib/calculator.ts:136-138` (currently 0.55–0.65 of full-time). |
| 17 | **Calculator stacks gear discounts.** A user marking "used OK" + "high registry help" gets `0.55 × (1 - 0.75) = 0.1375` of base gear cost — i.e., 86% off. That's plausible for a second baby but probably too aggressive for first-baby with high registry coverage. | `lib/calculator.ts:252–258` | Cap combined discount at e.g. 70% (or apply registry reduction *after* the used-fraction split rather than multiplying). |
| 18 | **`comboFeedingMultiplier` of 0.55 is hard-coded** and not user-adjustable in any of the UI surfaces. | `data/assumptions.ts:63`, used in `lib/calculator.ts` and `FeedingCalculator.tsx` | Optional: expose a "% formula in combo" slider on `FeedingCalculator`. The value is sensitive (each 10% change moves total feeding cost by ~$200–$400). |
| 19 | **`monthlyRecurringMid` excludes medical and gear**, so the displayed "Monthly avg" understates true average month-1 spend. | `lib/calculator.ts:322-323`, displayed in `MainCalculator.tsx:361` | Either rename the label to "Monthly recurring (childcare + feeding + diapers + misc)" or include amortized one-time costs. |

### Low severity / cleanup

| # | Issue | Location | Recommendation |
|---|---|---|---|
| 20 | "Email the address in the footer (when added)" reads as a placeholder. There is no contact email anywhere. | `app/privacy/page.tsx:81`, `app/methodology/page.tsx:108`, `Footer.tsx` | Add a real `mailto:` (e.g. `hello@firstyearcost.com`) or remove the references. |
| 21 | `ChildcareCalculator.tsx` declares `setHospitalCoinsurance` but is unused — wait, this is in `BirthInsuranceCalculator` (already item #5). | n/a | (duplicate) |
| 22 | `Slider` `wipesPerChange` slider lives in `DiaperCalculator` but the value also exists as `wipesPerChange` constant in `data/assumptions.ts`. The state value shadows the imported constant. | `components/DiaperCalculator.tsx:11, 23` | Keep, but rename the import to avoid confusion: `import { ... wipesPerChange as defaultWipesPerChange }` is already done — good. No action. |
| 23 | `Slider` style cast: `style={{ ['--p' as any]: ... }}`. | `components/Slider.tsx:19` | Use `style={{ '--p': `${pct}%` } as React.CSSProperties}`. |
| 24 | TypeScript `strict: true` is on but several `as any` casts remain. | various | Fix the four `as any` sites for clean strict compliance. |
| 25 | `Disclaimer` accepts `children` but defaults are a long inline JSX block. Hard to override partially. | `components/Disclaimer.tsx` | Optional: extract the default into a named const so callers can compose it. |
| 26 | `AdSlot` renders the size label visibly (`Sponsored · leaderboard`). Once AdSense is wired this will be replaced, but during the placeholder phase the text "Advertisement · leaderboard" looks like a debug print to first-time visitors. | `components/AdSlot.tsx:25` | Either remove the size suffix or hide AdSlots until env var is set: `if (!process.env.NEXT_PUBLIC_ADSENSE_CLIENT) return null;` — that way the live site doesn't show empty placeholders. |
| 27 | `BirthInsuranceCalculator` "newborn separate deductible" adds $800/$1,200 only when `'yes'`, doing nothing for `'unsure'`. UI implies otherwise. | `components/BirthInsuranceCalculator.tsx:39-43` | Add a small range adjustment for `'unsure'` (e.g., +$300 to mid) to reflect partial-likelihood pricing. |
| 28 | The newborn add-on of $800 / $1,200 is unsourced. | same | Cite or document. |
| 29 | `extractText` for FAQ JSON-LD can produce double-spacing in answers. | `components/FAQ.tsx` | Minor — Google parses fine. |
| 30 | The README still says "Roadmap (not implemented in v1)" — newsletter, multiples mode, etc. — but the project is now public-facing. Some users will read the README via the GitHub repo. | `README.md` | Update or remove the roadmap. |
| 31 | `next.config.mjs` does not set `output: 'standalone'`, which is fine for Vercel but should be documented for self-hosting. | `next.config.mjs` | Optional. |
| 32 | `tsconfig.json` does not include `next-env.d.ts` in `include` (it does — line 25), but `.gitignore` correctly excludes it. OK. | n/a | No action. |
| 33 | `MainCalculator.tsx` `handleCopy` silently ignores clipboard errors. There is no user feedback (toast / "copied" state). | `components/MainCalculator.tsx:37–52` | Add a temporary "Copied!" state after success. |
| 34 | The `AdSlot` placeholder height is `h-24 sm:h-28` for leaderboard but live AdSense leaderboard is 90–100px on desktop and 50px on mobile. CLS risk when AdSense loads. | `components/AdSlot.tsx:7-12` | Match exact reserved heights for live formats. |
| 35 | No `noindex` on `/privacy` or `/terms`. Standard practice is to leave them indexable; this is an opinion call but legal pages eat crawl budget. | `app/privacy/page.tsx`, `app/terms/page.tsx` | Optional: `robots: { index: false, follow: true }` on each. |

---

## 7. Prioritized punch list

### Ship-blockers (do before any traffic push)
1. **Replace fabricated CDC source URL & births number** in `data/sourceNotes.ts` lines 17–22.
2. **Delete `public/robots.txt`** so the dynamic `app/robots.ts` is the only source of truth.
3. **Link `/daycare-vs-nanny-cost`** from the Footer Resources column and from the homepage's specialized-calculator grid.
4. **Per-page `openGraph` metadata** on every page (state pages via `generateMetadata`, others via static `metadata.openGraph`).
5. **Wire or remove `hospitalCoinsurance`** in `BirthInsuranceCalculator` so the input doesn't lie.

### High-impact this week
6. **Replace `Math.random()` random sort** in `app/state-childcare-costs/[state]/page.tsx` with a deterministic neighbor picker.
7. **Refresh employer-plan and C-section OOP `mid` values** in `data/assumptions.ts` to match the latest Peterson-KFF figures, and add the Aug 2024 KFF release to `sourceNotes.ts`.
8. **Update the homepage FAQ "where do your numbers come from" answer** with the new sources, and add the AAP / CMS / HealthCare.gov links to the per-page FAQs noted in §3.
9. **Fix the "60-70% of full-time price, not 60%"** copy on the per-state page (and align it with the calculator's actual factor in `lib/calculator.ts:136`).
10. **Add Strict-Transport-Security header**, and stub a baseline CSP in `next.config.mjs`.

### Medium term (next 2–4 weeks)
11. **BreadcrumbList JSON-LD** on every non-home page; **WebPage + Place + FAQPage** on per-state pages.
12. **Cap stacked gear discount** in `lib/calculator.ts` so used + high-registry doesn't exceed ~70% off.
13. **Real contact email** wired into Footer + privacy + methodology.
14. **Hide `<AdSlot>`** unless `NEXT_PUBLIC_ADSENSE_CLIENT` is set, so live readers don't see "Advertisement" placeholders.
15. **Code-split `MonthlyChart`** with `next/dynamic` to drop ~80kB from the homepage's initial JS bundle.
16. **Per-state OG image** at `app/state-childcare-costs/[state]/opengraph-image.tsx`.

### Content roadmap (next quarter)
17. **Glossary page** (`/glossary/`) — fastest single content win.
18. **Hospital bag checklist** + **Baby tax credits** pages — easy traffic.
19. **Twins/multiples calculator** — small lift, distinctive positioning.
20. **Per-metro childcare pages** — biggest long-tail opportunity, highest data lift.

---

## Appendix A — Source-replacement quick reference

| FAQ / claim | Better source URL |
|---|---|
| Employer-plan birth cost / OOP | https://www.kff.org/health-costs/women-who-give-birth-incur-nearly-19000-in-additional-health-costs-including-2854-more-that-they-pay-out-of-pocket/ |
| Vaginal vs. C-section averages | https://www.healthsystemtracker.org/brief/health-costs-associated-with-pregnancy-childbirth-and-postpartum-care/ |
| Childcare cost national average | https://www.childcareaware.org/price-landscape24/ |
| Childcare 2024 affordability report (PDF) | https://info.childcareaware.org/hubfs/Affordability_Analysis_Updated_2024.pdf |
| AAP safe-sleep policy (full text) | https://publications.aap.org/pediatrics/article/150/1/e2022057990/188304/ |
| AAP Bright Futures (well-baby visit schedule) | https://www.aap.org/en/practice-management/bright-futures/ |
| ACA breast-pump coverage | https://www.healthcare.gov/coverage/breast-feeding-benefits/ |
| No Surprises Act overview | https://www.cms.gov/nosurprises |
| HHS 7% childcare affordability benchmark (regulatory text) | https://www.federalregister.gov/documents/2024/03/01/2024-04139/improving-child-care-access-affordability-and-stability-in-the-child-care-and-development-fund-ccdf |
| 2024 final births (CDC NCHS) | https://www.cdc.gov/nchs/data/databriefs/db535.pdf |
| USDA Cost of Raising a Child (last issue, historical) | https://www.fns.usda.gov/research/cnpp/expenditures-children-families |
| FDA infant formula recalls | https://www.fda.gov/safety/recalls-market-withdrawals-safety-alerts |
| Special enrollment for newborn (HealthCare.gov) | https://www.healthcare.gov/coverage-outside-open-enrollment/special-enrollment-period/ |

---

## Appendix B — File map

```
app/
├── layout.tsx              # global metadata, Header/Footer, CookieBanner
├── page.tsx                # homepage (294 lines) — hero, MainCalculator, features, FAQ, CTA
├── globals.css             # design tokens + utility classes
├── icon.tsx                # 32×32 favicon (just "$")
├── opengraph-image.tsx     # 1200×630 OG image (homepage only)
├── sitemap.ts              # dynamic sitemap (static pages + 51 state pages)
├── robots.ts               # dynamic robots.txt (CONFLICTS with public/robots.txt)
├── not-found.tsx           # 404
├── childcare-calculator/page.tsx
├── diaper-calculator/page.tsx
├── formula-vs-breastfeeding-calculator/page.tsx
├── baby-gear-budget/page.tsx
├── birth-insurance-planner/page.tsx
├── state-childcare-costs/
│   ├── page.tsx            # all-states index
│   └── [state]/page.tsx    # per-state page (51 generated)
├── monthly-baby-budget/page.tsx
├── daycare-vs-nanny-cost/page.tsx   # ORPHANED - no internal links
├── methodology/page.tsx
├── faq/page.tsx
├── privacy/page.tsx
└── terms/page.tsx

components/
├── Header.tsx              # sticky + burger, hides nav at <lg
├── Footer.tsx              # 4-col, missing /daycare-vs-nanny-cost
├── CookieBanner.tsx        # localStorage-based
├── MainCalculator.tsx      # 446-line homepage form
├── ChildcareCalculator.tsx
├── DiaperCalculator.tsx
├── FeedingCalculator.tsx
├── GearCalculator.tsx
├── BirthInsuranceCalculator.tsx  # has dead `hospitalCoinsurance`
├── MonthlyChart.tsx        # Recharts ComposedChart (~80kB dep)
├── BreakdownBar.tsx
├── StatCard.tsx
├── Segmented.tsx
├── Slider.tsx
├── SectionHeader.tsx
├── FAQ.tsx                 # FAQ + FAQSchema (JSON-LD)
├── Disclaimer.tsx
└── AdSlot.tsx              # placeholder, no live ad code

data/
├── assumptions.ts          # diapers, formula, gear, medical, misc
├── stateChildcare.ts       # 51 rows
├── presets.ts              # 6 scenario presets
└── sourceNotes.ts          # 9 sources (one URL fabricated)

lib/
├── calculator.ts           # core math (426 lines)
└── format.ts               # USD / percent helpers

content/
└── faqHome.tsx             # 10-item home FAQ
```

---

End of audit.
