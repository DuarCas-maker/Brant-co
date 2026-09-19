export type AnalyticsEvent =
  | "cta_click"
  | "assessment_started"
  | "assessment_turn_completed"
  | "assessment_completed"
  | "lead_qualified"
  | "lead_nurture"
  | "book_call_click"
  | "portfolio_view"
  | "service_view";

export function trackEvent(event: AnalyticsEvent, properties: Record<string, string | number | boolean> = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("brant:analytics", { detail: { event, properties } }));
}
