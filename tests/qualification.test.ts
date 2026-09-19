import { describe, expect, it } from "vitest";
import { createEmptyProfile, type DiscoveryProfile } from "@/lib/openai/discovery-schema";
import { calculateOpportunityScore, determineQualification, isBookingAllowed } from "@/lib/qualification/scoring";
import type { BudgetRange } from "@/types/discovery";

const leadId = "550e8400-e29b-41d4-a716-446655440000";

function strongProfile(budget: BudgetRange = "5000_7499"): DiscoveryProfile {
  const profile = createEmptyProfile(leadId);
  profile.company = { name: "Example Co", industry: "Services", business_model: "B2B", operating: true };
  profile.discovery.current_state = "Leads are copied manually between three tools.";
  profile.discovery.primary_problem = "Manual lead follow-up is inconsistent.";
  profile.discovery.process_affected = "Lead management";
  profile.discovery.manual_processes = ["Copy lead", "Create task"];
  profile.discovery.impact = {
    lead_volume: "120 per month",
    transaction_volume: "30 active opportunities",
    time_cost: "20 hours per week",
    financial_cost: "Unknown",
    errors: "Duplicate and missing records",
    lost_opportunities: "Late follow-up",
    other: "Founder dependency",
  };
  profile.discovery.future_state = "Every lead is captured, routed and followed up automatically.";
  profile.discovery.expected_business_impact = "Faster response and better visibility.";
  profile.discovery.success_metrics = ["Response time", "Booked calls"];
  profile.qualification = { decision_authority: "decision_maker", urgency: "within_30_days", budget_range: budget };
  profile.service_fit = {
    primary: "Marketing & Sales Operations",
    secondary: ["Automation & Integrations"],
    special_software_project: false,
    potential_project: "Sales operations system",
  };
  return profile;
}

describe("deterministic qualification", () => {
  it("calculates a transparent score capped at 100", () => {
    const score = calculateOpportunityScore(strongProfile("7500_plus"));
    expect(score.total).toBe(100);
    expect(score).toMatchObject({ budget: 30, problemClarity: 20, operatingBusiness: 15, decisionAuthority: 15 });
  });

  it.each(["less_than_500", "500_999"] as BudgetRange[])("never enables booking below USD 1,000 (%s)", (budget) => {
    const profile = strongProfile(budget);
    const status = determineQualification(profile, 95);
    expect(status).toBe("nurture");
    expect(isBookingAllowed(profile, status)).toBe(false);
  });

  it("qualifies an operating, clear, high-fit opportunity at 70+", () => {
    const profile = strongProfile();
    expect(determineQualification(profile, 70)).toBe("qualified");
    expect(isBookingAllowed(profile, "qualified")).toBe(true);
  });

  it("keeps the 50–69 boundary in review", () => {
    expect(determineQualification(strongProfile(), 69)).toBe("review");
  });

  it("routes unknown budget and special software to review", () => {
    expect(determineQualification(strongProfile("not_sure"), 90)).toBe("review");
    const special = strongProfile();
    special.service_fit.special_software_project = true;
    special.service_fit.primary = "Special Software Project";
    expect(determineQualification(special, 90)).toBe("review");
  });

  it("nurtures a business that is not operating", () => {
    const profile = strongProfile();
    profile.company.operating = false;
    expect(determineQualification(profile, 90)).toBe("nurture");
  });
});
