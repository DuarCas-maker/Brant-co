import { describe, expect, it } from "vitest";
import { calculateOpportunityScore, determineQualification, getServiceRecommendation, isBookingAllowed, SCORING_VERSION } from "@/lib/qualification/scoring";
import type { QuestionnaireAnswers } from "@/types/discovery";

function strongAnswers(overrides: Partial<QuestionnaireAnswers> = {}): QuestionnaireAnswers {
  return {
    challenges: ["connected_business"],
    priority: "critical",
    decisionStage: "approved_30",
    budgetRange: "5000_plus",
    businessContext: "We are a growing service company with repeated follow-up work every day.",
    ...overrides,
  };
}

describe("five-question deterministic qualification", () => {
  it("scores priority, decision and budget on a 100-point scale", () => {
    expect(SCORING_VERSION).toBe("contextual_v2");
    expect(calculateOpportunityScore(strongAnswers())).toEqual({ priority: 35, decision: 35, budget: 30, total: 100 });
  });

  it.each(["less_than_500", "500_999"] as const)("never enables booking below USD 1,000 (%s)", (budgetRange) => {
    const answers = strongAnswers({ budgetRange });
    expect(determineQualification(answers, 95)).toBe("nurture");
    expect(isBookingAllowed(answers, "nurture")).toBe(false);
  });

  it("qualifies a ready opportunity with at least USD 1,000", () => {
    const answers = strongAnswers({ priority: "this_quarter", decisionStage: "approved_30", budgetRange: "1000_1999" });
    const score = calculateOpportunityScore(answers);
    expect(score.total).toBe(77);
    expect(determineQualification(answers, score.total)).toBe("qualified");
    expect(isBookingAllowed(answers, "qualified")).toBe(true);
  });

  it("maps multiple needs to a primary and secondary recommendation", () => {
    expect(getServiceRecommendation(strongAnswers({ challenges: ["sales_followup", "repetitive_work"] }))).toEqual({ primary: "convert", secondary: ["automate"] });
  });

  it("routes an unclassified need to the guided assessment", () => {
    expect(getServiceRecommendation(strongAnswers({ challenges: ["other"], challengeOther: "A different need" }))).toEqual({ primary: "unclear", secondary: [] });
  });
});
