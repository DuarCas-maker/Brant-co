import type { DiscoveryProfile } from "@/lib/openai/discovery-schema";
import type { BudgetRange, QualificationStatus } from "@/types/discovery";

export type ScoreBreakdown = {
  budget: number;
  problemClarity: number;
  operatingBusiness: number;
  decisionAuthority: number;
  volumeOpportunity: number;
  identifiableImpact: number;
  total: number;
};

const budgetPoints: Record<BudgetRange, number> = {
  less_than_500: 0,
  "500_999": 5,
  "1000_1999": 18,
  "2000_2999": 22,
  "3000_4999": 25,
  "5000_7499": 28,
  "7500_plus": 30,
  not_sure: 12,
};

const authorityPoints: Record<DiscoveryProfile["qualification"]["decision_authority"], number> = {
  decision_maker: 15,
  co_decision_maker: 12,
  recommender: 7,
  no_authority: 0,
  unknown: 4,
};

function present(value: string | null) {
  return Boolean(value?.trim());
}

export function calculateOpportunityScore(profile: DiscoveryProfile): ScoreBreakdown {
  const budget = profile.qualification.budget_range ? budgetPoints[profile.qualification.budget_range] : 0;
  const problemClarity = Math.min(
    20,
    (present(profile.discovery.primary_problem) ? 8 : 0) +
      (present(profile.discovery.process_affected) ? 5 : 0) +
      (present(profile.discovery.current_state) ? 4 : 0) +
      (present(profile.discovery.future_state) ? 3 : 0),
  );
  const operatingBusiness = profile.company.operating === true ? 15 : profile.company.operating === false ? 0 : 4;
  const decisionAuthority = authorityPoints[profile.qualification.decision_authority];
  const impact = profile.discovery.impact;
  const volumeOpportunity = Math.min(
    10,
    (present(impact.lead_volume) ? 5 : 0) +
      (present(impact.transaction_volume) ? 3 : 0) +
      (profile.discovery.manual_processes.length > 0 ? 2 : 0),
  );
  const impactSignals = [
    impact.time_cost,
    impact.financial_cost,
    impact.errors,
    impact.lost_opportunities,
    impact.other,
  ].filter(present).length;
  const identifiableImpact = Math.min(10, impactSignals * 2);
  const total = budget + problemClarity + operatingBusiness + decisionAuthority + volumeOpportunity + identifiableImpact;

  return { budget, problemClarity, operatingBusiness, decisionAuthority, volumeOpportunity, identifiableImpact, total };
}

const belowMinimum = new Set<BudgetRange>(["less_than_500", "500_999"]);

export function determineQualification(profile: DiscoveryProfile, score: number): QualificationStatus {
  const budget = profile.qualification.budget_range;
  const concreteProblem = present(profile.discovery.primary_problem) && present(profile.discovery.process_affected);
  const reasonableFit = profile.service_fit.primary !== "Unclear / Needs Discovery";

  if (budget && belowMinimum.has(budget)) return "nurture";
  if (profile.company.operating === false) return "nurture";
  if (profile.service_fit.special_software_project || budget === "not_sure") return "review";
  if (!concreteProblem || !reasonableFit) return score >= 50 ? "review" : "nurture";
  if (budget && profile.company.operating === true && score >= 70) return "qualified";
  if (score >= 50) return "review";
  return "nurture";
}

export function isBookingAllowed(profile: DiscoveryProfile, status: QualificationStatus) {
  const budget = profile.qualification.budget_range;
  return status === "qualified" && Boolean(budget && !belowMinimum.has(budget));
}
