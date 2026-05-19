// Thin analytics wrapper. Routes events to either GA4 (gtag) or Plausible
// depending on which loader is present. No-ops if neither is loaded —
// safe to call from any component without environment checks.
//
// Wire by setting one of these env vars and adding the loader to app/layout.tsx:
//   NEXT_PUBLIC_GA_ID=G-XXXXXXX        (GA4)
//   NEXT_PUBLIC_PLAUSIBLE_DOMAIN=...   (Plausible)

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    plausible?: (event: string, opts?: { props?: Record<string, string | number | boolean> }) => void;
  }
}

export type CalcEvent =
  | 'calculator_started'
  | 'calculator_completed'
  | 'state_selected'
  | 'childcare_plan_selected'
  | 'feeding_plan_selected'
  | 'diaper_plan_selected'
  | 'gear_tier_selected'
  | 'copy_budget_clicked'
  | 'print_budget_clicked'
  | 'source_note_opened'
  | 'preset_applied'
  | 'newsletter_signup'
  | 'affiliate_click'
  | 'subsidy_estimator_run'
  | 'leave_state_viewed';

export function track(event: CalcEvent, props?: Record<string, string | number | boolean>): void {
  if (typeof window === 'undefined') return;
  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', event, props ?? {});
    }
    if (typeof window.plausible === 'function') {
      window.plausible(event, props ? { props } : undefined);
    }
  } catch {
    // Never let analytics break the UI.
  }
}
