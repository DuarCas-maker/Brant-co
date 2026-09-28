import type { BudgetRange, DecisionStage, PriorityLevel, QualificationStatus, QuestionnaireAnswers, ServiceId } from "@/types/discovery";

export const SCORING_VERSION = "contextual_v2";
export type ScoreBreakdown = { priority: number; decision: number; budget: number; total: number };

const priorityPoints: Record<PriorityLevel, number> = { critical: 35, this_quarter: 28, important_not_urgent: 18, exploring: 8, other: 12 };
const decisionPoints: Record<DecisionStage, number> = { approved_30: 35, comparing: 18, needs_approval: 10, exploring: 4 };
const budgetPoints: Record<BudgetRange, number> = { less_than_500: 0, "500_999": 5, "1000_1999": 14, "2000_2999": 19, "3000_4999": 23, "5000_plus": 30 };
const belowMinimum = new Set<BudgetRange>(["less_than_500", "500_999"]);

export function calculateOpportunityScore(answers: QuestionnaireAnswers): ScoreBreakdown {
  const priority = priorityPoints[answers.priority];
  const decision = decisionPoints[answers.decisionStage];
  const budget = budgetPoints[answers.budgetRange];
  return { priority, decision, budget, total: priority + decision + budget };
}
export function determineQualification(answers: QuestionnaireAnswers, score: number): QualificationStatus {
  if (belowMinimum.has(answers.budgetRange)) return "nurture";
  if (answers.priority === "other") return "review";
  return score >= 65 ? "qualified" : score >= 42 ? "review" : "nurture";
}

export function getServiceRecommendation(answers: QuestionnaireAnswers): { primary: ServiceId; secondary: ServiceId[] } {
  const mapped: ServiceId[] = [];
  const add = (service: ServiceId) => { if (!mapped.includes(service)) mapped.push(service); };
  if (answers.challenges.includes("more_demand")) add("attract");
  if (answers.challenges.includes("sales_followup")) add("convert");
  if (answers.challenges.includes("repetitive_work")) add("automate");
  if (answers.challenges.includes("connected_business")) { add("automate"); add("convert"); }
  if (answers.challenges.includes("custom_solution")) add("special");
  if (answers.challenges.includes("other") && mapped.length === 0) add("unclear");
  return { primary: mapped[0] || "unclear", secondary: mapped.slice(1, 3) };
}

export function isBookingAllowed(answers: QuestionnaireAnswers, status: QualificationStatus) {
  return status === "qualified" && !belowMinimum.has(answers.budgetRange);
}
