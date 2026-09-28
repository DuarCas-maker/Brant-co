import { z } from "zod";
import { budgetRanges, challengeOptions, decisionStages, priorityLevels } from "@/types/discovery";

const localeSchema = z.enum(["en", "es"]).default("en");
const safeText = (minimum: number, maximum: number) => z.string().trim().min(minimum).max(maximum).refine((value) => !/[<>]/.test(value), { message: "Please remove angle brackets." });

export const leadCaptureSchema = z.object({
  name: safeText(2, 80),
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  phone: z.string().trim().min(7).max(24).regex(/^\+?[0-9()\-\s.]+$/, "Enter a valid WhatsApp number."),
  idempotencyKey: z.string().uuid(),
  locale: localeSchema,
});

export const questionnaireAnswersSchema = z.object({
  challenges: z.array(z.enum(challengeOptions)).min(1).max(6).refine((items) => new Set(items).size === items.length),
  challengeOther: safeText(2, 300).optional(),
  priority: z.enum(priorityLevels),
  priorityOther: safeText(2, 300).optional(),
  decisionStage: z.enum(decisionStages),
  budgetRange: z.enum(budgetRanges),
  businessContext: safeText(30, 2000),
}).superRefine((data, context) => {
  if (data.challenges.includes("other") && !data.challengeOther) context.addIssue({ code: z.ZodIssueCode.custom, path: ["challengeOther"], message: "Required for other." });
  if (data.priority === "other" && !data.priorityOther) context.addIssue({ code: z.ZodIssueCode.custom, path: ["priorityOther"], message: "Required for other." });
});

export const finalizeDiscoverySchema = z.object({ leadId: z.string().uuid(), answers: questionnaireAnswersSchema, locale: localeSchema });
export const diagnosisMessageSchema = z.object({ leadId: z.string().uuid(), locale: localeSchema, turn: z.number().int().min(1).max(5), message: safeText(1, 2000).optional(), start: z.boolean().optional() }).refine((data) => data.start || data.message, { message: "A message is required." });
export type LeadCaptureInput = z.infer<typeof leadCaptureSchema>;
