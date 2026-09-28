import { describe, expect, it } from "vitest";
import { finalizeDiscoverySchema, leadCaptureSchema, questionnaireAnswersSchema } from "@/lib/validation/schemas";

const uuid = "550e8400-e29b-41d4-a716-446655440000";
const answers = {
  challenges: ["repetitive_work"],
  priority: "critical",
  decisionStage: "approved_30",
  budgetRange: "5000_plus",
  businessContext: "We run a service company with a team of eight and repeat the same reports manually.",
};

describe("lead capture validation", () => {
  it("accepts valid contact details", () => {
    expect(leadCaptureSchema.safeParse({ name: "Alex Rivera", email: "ALEX@example.com", phone: "+34 600 000 000", idempotencyKey: uuid }).success).toBe(true);
  });
  it("rejects invalid email, empty fields and malformed phone", () => {
    expect(leadCaptureSchema.safeParse({ name: "", email: "invalid", phone: "abc", idempotencyKey: uuid }).success).toBe(false);
  });
});

describe("questionnaire validation", () => {
  it("requires all five answers", () => {
    expect(questionnaireAnswersSchema.safeParse(answers).success).toBe(true);
    expect(questionnaireAnswersSchema.safeParse({ ...answers, priority: undefined }).success).toBe(false);
  });
  it("requires an explanation for other", () => {
    expect(questionnaireAnswersSchema.safeParse({ ...answers, priority: "other" }).success).toBe(false);
    expect(questionnaireAnswersSchema.safeParse({ ...answers, priority: "other", priorityOther: "Another timing condition" }).success).toBe(true);
  });
  it.each([
    ["challenge", { ...answers, challenges: ["unclear"] }],
    ["priority", { ...answers, priority: "unknown" }],
    ["decision", { ...answers, decisionStage: "approved_90" }],
    ["budget", { ...answers, budgetRange: "7500_plus" }],
  ])("rejects the removed %s option", (_field, payload) => {
    expect(questionnaireAnswersSchema.safeParse(payload).success).toBe(false);
  });
  it("accepts a complete finalization payload", () => {
    expect(finalizeDiscoverySchema.safeParse({ leadId: uuid, answers, locale: "es" }).success).toBe(true);
    expect(finalizeDiscoverySchema.safeParse({ leadId: "bad", answers }).success).toBe(false);
  });
});
