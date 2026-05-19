# FirstYearCost — Changes from AUDIT.md

Date: 2026-05-08
Driven by: `docs/AUDIT.md` punch list (sections 5–7)

This pass focused on bugs, source/content corrections, SEO, and accessibility.
The "new pages worth adding" section of the audit was deliberately deferred.

---

## Ship-blockers — done

1. **Fabricated CDC source replaced** (audit §6 #1 / §7 #1) — `data/sourceNotes.ts`
   - Deleted `cdc-births-2025` (URL `cdc.gov/nchs/pressroom/releases/20260409.html` did not exist; "3,606,400" births was invented).
   - Replaced `cdc-births-2024` to point at the real **CDC NCHS Data Brief #535** (`https://www.cdc.gov/nchs/data/databriefs/db535.pdf`) with the real 2024 final figure of **3,628,934** births.
   - Refreshed `kff-pregnancy-costs` notes to the audited figures ($15,712 / $2,563 vaginal, $28,998 / $3,071 C-section) and added a new `kff-pregnancy-costs-2024` entry pointing at the August 2024 KFF release ($2,854 OOP).
   - Replaced `aap-newborn-care` URL (was the consumer site root) with AAP Bright Futures.
   - Added new sources: `aap-safe-sleep-2022`, `cms-no-surprises`, `healthcare-gov-breast-pump`, `healthcare-gov-newborn-sep`, `hhs-ccdf-7-percent`, `ccaoa-price-landscape` (replaces the unverified `ccaoas-methodology-2026/` URL).

2. **Robots.txt conflict resolved** (audit §6 #2 / §5 #2 / §7 #2) — `app/robots.ts`, `public/robots.txt`
   - Could not delete either file from this environment (filesystem permissions). Made `app/robots.ts` produce output identical to `public/robots.txt` and removed the non-standard `host:` field. A code comment documents the situation. **Recommended follow-up:** delete `public/robots.txt` so the dynamic file is the only source of truth.

3. **Orphaned `/daycare-vs-nanny-cost` page now linked** (audit §6 #3 / §5 #1 / §7 #3)
   - Added a link in `components/Footer.tsx` (Resources column) and a new `CalcLink` card on `app/page.tsx` (specialized calculators grid).

4. **`hospitalCoinsurance` input is now wired** (audit §6 #5 / §4 #9 / §7 #5) — `components/BirthInsuranceCalculator.tsx`
   - The user-entered coinsurance % is now applied to the post-deductible billed amount (anchored to KFF averages) and capped by `oopMaxRemaining`. Default of 20% applied if left blank.

5. **Per-page `openGraph` metadata** (audit §5 #4 / §7 #4) — all 14 page files
   - Added per-page `openGraph` and `twitter` blocks to every page in `app/`, including dynamic per-state metadata via `generateMetadata`. Removed the stale layout-level `alternates: { canonical: '/' }` and gave the homepage its own canonical.

6. **C-section employer OOP `mid` reconciled with sources** (audit §6 #7 / §7 #7) — `data/assumptions.ts`
   - `birthOOPRanges.employer.csection.mid`: $4,200 → $3,100 to match Peterson-KFF (~$3,071). Tightened range bands. Touched up vaginal mid slightly ($2,700 → $2,600) and updated the file's source comment.

7. **Random sort during static generation removed** (audit §6 #4 / §5 #16 / §7 #6) — `app/state-childcare-costs/[state]/page.tsx`
   - Replaced `sort(() => 0.5 - Math.random())` with a deterministic neighbor selection: closest 8 states by mid-range center cost. Stable across builds, useful as internal links.

---

## High-impact follow-ups — done

8. **Refreshed FAQs and prose with new sources** (audit §3, §7 #8)
   - `app/birth-insurance-planner/page.tsx`: FAQ #1 updated with KFF Aug 2024 figures + Peterson-KFF detail; FAQ #4 references HealthCare.gov special enrollment; FAQ #5 references CMS.gov/nosurprises; "20-60% cash discount" softened to "10–50%".
   - `app/baby-gear-budget/page.tsx`: registry % claim softened to industry estimates; AAP safe-sleep gets the 2022 policy reference.
   - `app/formula-vs-breastfeeding-calculator/page.tsx`: ACA breast-pump claim now references HealthCare.gov "Breastfeeding benefits".
   - `app/childcare-calculator/page.tsx` & `app/state-childcare-costs/[state]/page.tsx`: HHS 7% benchmark now correctly qualified ("for low-income families receiving CCDF subsidies").
   - `content/faqHome.tsx`: "Where do your assumptions come from" updated with current sources.
   - `components/BirthInsuranceCalculator.tsx` "National benchmarks" card: refreshed with KFF Aug 2024 + Peterson-KFF figures.

9. **Part-time childcare factor consistency** (audit §6 #16 / §7 #9)
   - `lib/calculator.ts` part-time band: 0.55–0.65 → **0.65–0.75** (matches "65–75% of full-time" in copy).
   - `components/ChildcareCalculator.tsx`: same change in the local switch + `compareRows`.
   - `app/state-childcare-costs/[state]/page.tsx`: corrected the contradictory "60–70% of full-time price, not 60%" line.

10. **Strict-Transport-Security + baseline CSP** (audit §6 #13–14 / §7 #10) — `next.config.mjs`
    - Added `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`.
    - Added a permissive baseline CSP (allows AdSense host + inline styles for Tailwind/dynamic CSS vars). Tighten once analytics/ad code is fully wired.

---

## Medium-term — done

11. **BreadcrumbList JSON-LD helper + emit on per-state pages** (audit §5 #6 / §7 #11) — new `components/Breadcrumbs.tsx`, used in `app/state-childcare-costs/[state]/page.tsx`.
12. **Capped stacked gear discount** (audit §6 #17 / §7 #12) — `lib/calculator.ts`
    - `usedFactor × (1 - registry)` was producing 86% off in worst case. Now floored to retain at least 30% of base gear cost.
13. **Real contact email wired in** (audit §6 #20 / §7 #13)
    - Added `mailto:hello@firstyearcost.com` link to `Footer.tsx`, `app/privacy/page.tsx`, and `app/methodology/page.tsx`.
14. **`<AdSlot>` hidden unless `NEXT_PUBLIC_ADSENSE_CLIENT` is set** (audit §6 #26 / §7 #14)
    - Returns `null` when env var is absent (no debug-looking placeholders in production).
    - Reserved heights also tightened to match real AdSense formats (50/90, 250, 600, 90).
15. **`MonthlyChart` code-split with `next/dynamic`** (audit §5 page-speed / §7 #15) — `components/MainCalculator.tsx`
    - Recharts (~80kB gzipped) now loads only on the client when the calculator renders. Skeleton shown while loading.
16. **Per-state OG image** (audit §5 #5 / §7 #16) — new `app/state-childcare-costs/[state]/opengraph-image.tsx`
    - Per-state OG card with state name and center-care range, generated at build time for all 51 slugs.

---

## Other audit items addressed

- **§6 #6** — removed the stray `* 1.0` no-op multiplier in `lib/calculator.ts:calcMedical`.
- **§6 #9** — `CookieBanner.tsx` `<a href="/privacy">` now uses `next/link` (no full-page reload). Closing the X no longer silently persists "decline" — banner returns next visit instead.
- **§6 #10** — `as any` cast on `setStateCode` replaced with proper `StateCode` type import in `ChildcareCalculator.tsx`.
- **§6 #11** — `extractText` in `FAQ.tsx` now uses `isValidElement` and a typed `ReactElement<{children?: ReactNode}>` instead of `as any` walks.
- **§6 #19** — homepage result label "Monthly avg" → "Monthly recurring" with a tooltip clarifying it's childcare + feeding + diapers + misc only.
- **§6 #23** — `Slider.tsx` `style={{ ['--p' as any]: … }}` replaced with proper `CSSProperties` cast.
- **§6 #27** — when "Newborn on separate deductible?" is `unsure`, the calculator now adds a partial-likelihood share (~$300/$450) instead of zero.
- **§6 #33** — `MainCalculator` "Copy estimate" now shows a brief "Copied" confirmation (with `aria-live="polite"`).
- **§6 #34** — `AdSlot` heights updated to match live AdSense slot sizes (50/90 leaderboard etc.).
- **§6 #35** — `app/privacy/page.tsx` and `app/terms/page.tsx` now set `robots: { index: false, follow: true }`.
- **§5 #3** — `host:` field removed from `app/robots.ts`.
- **§5 #11** — `alternates: { canonical: '/' }` moved out of root layout into the homepage's own metadata.
- **§5 #17** — `applicationName` and `appleWebApp.title` added to root metadata.
- **§4 UI #1** — Header nav now keeps Home / Childcare / By State visible at `md:` and tucks the rest behind a "More" disclosure; full nav appears at `lg:`.
- **§4 UI #2** — new `<NextStepCTA />` component appended to all four standalone calculator pages, the methodology page, and exists on per-state pages already.
- **§4 UI #4** — homepage result total `text-5xl` standardized down to `text-4xl` (matches all other calculators).
- **§4 UI #5** — `BreakdownBar` rows converted to a 4-column grid so labels can wrap without misaligning the % + dollar columns.
- **§4 UI #8** — Header now uses `bg-cream` with a `supports-[backdrop-filter]` enhancement so the bar stays opaque on browsers/iOS Safari paints where the blur fails to apply.
- **§4 UI #10** — `Segmented` mutes "unsure" / "unknown" options until selected.
- **§4 UI #17** — `Segmented` buttons now have `focus-visible:ring-2 ring-teal-500`.
- **Last-reviewed dates** bumped to `2026-05-08` where the underlying assumption was reviewed in this pass.

---

## Skipped (and why)

- **Audit §2 (new pages worth adding)** — explicitly out of scope for this pass.
- **§4 UI #3** — splitting the 446-line `MainCalculator` into per-section components was deferred. It's a refactor, not a fix, and would have ballooned the diff. The existing component still works.
- **§6 #15** — the `new Date().getFullYear()` in `Footer.tsx` is acceptable in practice; the audit rated it optional.
- **§5 #19** — encoding calculator inputs in `?q=` for shareable deep-links is a feature, not a fix.
- **§5 #20** — `loading.tsx`/`error.tsx` are perceived-perf nice-to-haves; not added.
- **§6 #2 / §7 #2 partial** — `public/robots.txt` could not be deleted from this environment (file deletes were denied). Worked around by making `app/robots.ts` produce identical output. **Manual follow-up:** `git rm public/robots.txt` so only the dynamic file ships.
- **§6 #18** — exposing `comboFeedingMultiplier` as a slider is an enhancement, not a fix.
- **§6 #22, #25, #29, #31, #32** — explicitly noted as "no action" in the audit.
- **§6 #30** — README cleanup of the "roadmap" section was deferred. Not user-facing.
- **§4 UI #11–13, #14–15, #18** — minor cosmetic items. Bandwidth-bounded, deferred.
- **§5 #7 (Article/Dataset schema on methodology)**, **§5 #8 (full per-state schema)**, **§5 #9 (Search Console verification — needs the actual codes)**, **§5 #10 (`metadataBase` env var)**, **§5 #12 (drop `keywords`)**, **§5 #18 (`Organization` JSON-LD)** — left for a follow-up SEO sweep with the right verification tokens and a deployment env var convention.

---

## Build/test notes

The sandbox running this pass could not reach the npm registry, so `npm install` / `npm run build` could not be executed. **Strongly recommend** running locally before deploy:

```
npm install
npm run lint
npm run build
```

In particular, verify:
- The new `BreadcrumbsJsonLd`, `NextStepCTA` components type-check.
- The `dynamic(() => import('./MonthlyChart'))` import correctly resolves the named export.
- The per-state `opengraph-image.tsx` builds for all 51 slugs without timeouts (it uses `runtime: 'edge'`).
- The CSP doesn't break any third-party script you've added since the audit.

---

## Files touched

```
app/baby-gear-budget/page.tsx
app/birth-insurance-planner/page.tsx
app/childcare-calculator/page.tsx
app/daycare-vs-nanny-cost/page.tsx
app/diaper-calculator/page.tsx
app/faq/page.tsx
app/formula-vs-breastfeeding-calculator/page.tsx
app/layout.tsx
app/methodology/page.tsx
app/monthly-baby-budget/page.tsx
app/page.tsx
app/privacy/page.tsx
app/robots.ts
app/state-childcare-costs/page.tsx
app/state-childcare-costs/[state]/page.tsx
app/state-childcare-costs/[state]/opengraph-image.tsx   (new)
app/terms/page.tsx
components/AdSlot.tsx
components/BirthInsuranceCalculator.tsx
components/BreakdownBar.tsx
components/Breadcrumbs.tsx                              (new)
components/ChildcareCalculator.tsx
components/CookieBanner.tsx
components/FAQ.tsx
components/Footer.tsx
components/Header.tsx
components/MainCalculator.tsx
components/NextStepCTA.tsx                              (new)
components/Segmented.tsx
components/Slider.tsx
content/faqHome.tsx
data/assumptions.ts
data/sourceNotes.ts
lib/calculator.ts
next.config.mjs
docs/CHANGES.md                                         (new — this file)
```
