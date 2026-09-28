export const challengeOptions = [
  "more_demand",
  "sales_followup",
  "repetitive_work",
  "connected_business",
  "custom_solution",
  "other",
] as const;

export const priorityLevels = [
  "critical",
  "this_quarter",
  "important_not_urgent",
  "exploring",
  "other",
] as const;

export const decisionStages = [
  "approved_30",
  "comparing",
  "needs_approval",
  "exploring",
] as const;

export const budgetRanges = [
  "less_than_500",
  "500_999",
  "1000_1999",
  "2000_2999",
  "3000_4999",
  "5000_plus",
] as const;

export const serviceIds = ["attract", "convert", "automate", "special", "unclear"] as const;

export type ChallengeOption = (typeof challengeOptions)[number];
export type PriorityLevel = (typeof priorityLevels)[number];
export type DecisionStage = (typeof decisionStages)[number];
export type BudgetRange = (typeof budgetRanges)[number];
export type ServiceId = (typeof serviceIds)[number];

export type QuestionnaireAnswers = {
  challenges: ChallengeOption[];
  challengeOther?: string;
  priority: PriorityLevel;
  priorityOther?: string;
  decisionStage: DecisionStage;
  decisionOther?: string;
  budgetRange: BudgetRange;
  businessContext: string;
};
export type QuestionnaireQuestionId = "challenges" | "priority" | "decisionStage" | "budgetRange" | "businessContext";
export type QualificationStatus = "qualified" | "review" | "nurture";

export type PublicAssessmentResult = {
  status: QualificationStatus;
  primaryService: ServiceId;
  secondaryServices: ServiceId[];
  message: string;
  bookingEligible: boolean;
  bookingUrl: string | null;
  shouldStartDiagnosis: boolean;
};
