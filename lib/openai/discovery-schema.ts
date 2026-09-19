import { z } from "zod";
import { budgetRanges } from "@/types/discovery";

const nullableText = z.string().nullable();

export const decisionAuthoritySchema = z.enum([
  "decision_maker",
  "co_decision_maker",
  "recommender",
  "no_authority",
  "unknown",
]);

export const urgencySchema = z.enum(["immediate", "within_30_days", "within_90_days", "exploring", "unknown"]);

export const serviceFitSchema = z.enum([
  "Growth & Content Systems",
  "Marketing & Sales Operations",
  "Automation & Integrations",
  "Integrated Growth System",
  "Special Software Project",
  "Unclear / Needs Discovery",
]);

export const discoveryProfileSchema = z.object({
  lead_id: z.string().uuid(),
  company: z.object({
    name: nullableText,
    industry: nullableText,
    business_model: nullableText,
    operating: z.boolean().nullable(),
  }),
  discovery: z.object({
    current_state: nullableText,
    primary_problem: nullableText,
    secondary_problems: z.array(z.string()),
    process_affected: nullableText,
    tools: z.array(z.string()),
    manual_processes: z.array(z.string()),
    impact: z.object({
      lead_volume: nullableText,
      transaction_volume: nullableText,
      time_cost: nullableText,
      financial_cost: nullableText,
      errors: nullableText,
      lost_opportunities: nullableText,
      other: nullableText,
    }),
    future_state: nullableText,
    expected_business_impact: nullableText,
    success_metrics: z.array(z.string()),
  }),
  qualification: z.object({
    decision_authority: decisionAuthoritySchema,
    urgency: urgencySchema,
    budget_range: z.enum(budgetRanges).nullable(),
  }),
  service_fit: z.object({
    primary: serviceFitSchema,
    secondary: z.array(serviceFitSchema),
    special_software_project: z.boolean(),
    potential_project: nullableText,
  }),
  ai_analysis: z.object({
    executive_summary: nullableText,
    main_opportunity: nullableText,
    risks: z.array(z.string()),
    missing_information: z.array(z.string()),
    recommended_next_step: nullableText,
  }),
});

export const discoveryTurnOutputSchema = z.object({
  profile: discoveryProfileSchema,
  next_question: nullableText,
});

export const finalDiscoveryOutputSchema = z.object({
  profile: discoveryProfileSchema,
});

export type DiscoveryProfile = z.infer<typeof discoveryProfileSchema>;

export function createEmptyProfile(leadId: string): DiscoveryProfile {
  return {
    lead_id: leadId,
    company: { name: null, industry: null, business_model: null, operating: null },
    discovery: {
      current_state: null,
      primary_problem: null,
      secondary_problems: [],
      process_affected: null,
      tools: [],
      manual_processes: [],
      impact: {
        lead_volume: null,
        transaction_volume: null,
        time_cost: null,
        financial_cost: null,
        errors: null,
        lost_opportunities: null,
        other: null,
      },
      future_state: null,
      expected_business_impact: null,
      success_metrics: [],
    },
    qualification: { decision_authority: "unknown", urgency: "unknown", budget_range: null },
    service_fit: {
      primary: "Unclear / Needs Discovery",
      secondary: [],
      special_software_project: false,
      potential_project: null,
    },
    ai_analysis: {
      executive_summary: null,
      main_opportunity: null,
      risks: [],
      missing_information: [],
      recommended_next_step: null,
    },
  };
}
