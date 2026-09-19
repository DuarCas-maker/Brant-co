import { zodTextFormat } from "openai/helpers/zod";
import { getServerEnv } from "@/lib/env";
import { getOpenAIClient } from "@/lib/openai/client";
import {
  discoveryProfileSchema,
  discoveryTurnOutputSchema,
  finalDiscoveryOutputSchema,
  type DiscoveryProfile,
} from "@/lib/openai/discovery-schema";
import { getDiscoverySystemPrompt, objectiveByAnsweredTurn } from "@/lib/openai/discovery-prompt";
import type { Locale } from "@/lib/i18n/config";
import type { BudgetRange } from "@/types/discovery";

export class DiscoveryProviderError extends Error {
  constructor() {
    super("The discovery service is temporarily unavailable.");
    this.name = "DiscoveryProviderError";
  }
}

export async function runDiscoveryTurn(input: {
  turn: number;
  profile: DiscoveryProfile;
  latestAnswer: string;
  locale: Locale;
}) {
  const objective = objectiveByAnsweredTurn[input.turn];
  if (!objective) throw new Error("Unsupported discovery turn.");

  try {
    const response = await getOpenAIClient().responses.parse({
      model: getServerEnv().OPENAI_DISCOVERY_MODEL,
      instructions: getDiscoverySystemPrompt(input.locale),
      input: [
        {
          role: "user",
          content: JSON.stringify({
            answered_turn: input.turn,
            current_profile: input.profile,
            latest_answer: input.latestAnswer,
            next_objective: objective,
          }),
        },
      ],
      text: { format: zodTextFormat(discoveryTurnOutputSchema, "brant_discovery_turn") },
      store: false,
    });

    const parsed = discoveryTurnOutputSchema.parse(response.output_parsed);
    if (parsed.profile.lead_id !== input.profile.lead_id) throw new Error("Lead identity mismatch.");
    if (input.turn < 4 && !parsed.next_question?.trim()) throw new Error("Missing next question.");
    if (input.turn === 3 && !parsed.profile.discovery.future_state?.trim()) throw new Error("Missing mandatory future state.");
    if (input.turn === 4) parsed.next_question = null;
    return parsed;
  } catch (error) {
    console.error("OpenAI discovery turn failed", {
      errorType: error instanceof Error ? error.name : "unknown",
      turn: input.turn,
    });
    throw new DiscoveryProviderError();
  }
}

export async function finalizeDiscoveryProfile(profile: DiscoveryProfile, budgetRange: BudgetRange, locale: Locale = "en") {
  const profileWithBudget = discoveryProfileSchema.parse({
    ...profile,
    qualification: { ...profile.qualification, budget_range: budgetRange },
  });

  try {
    const response = await getOpenAIClient().responses.parse({
      model: getServerEnv().OPENAI_DISCOVERY_MODEL,
      instructions: `${getDiscoverySystemPrompt(locale)}\n\nFINALIZATION\nPrepare the internal AI Opportunity Brief. Complete executive_summary, main_opportunity, missing_information, risks, recommended_next_step, service fit and potential project using only the supplied profile. Do not change known facts or the lead_id. Do not assign a numeric score or qualification status; application code owns those decisions.`,
      input: [{ role: "user", content: JSON.stringify({ current_profile: profileWithBudget }) }],
      text: { format: zodTextFormat(finalDiscoveryOutputSchema, "brant_opportunity_brief") },
      store: false,
    });
    const parsed = finalDiscoveryOutputSchema.parse(response.output_parsed).profile;
    if (parsed.lead_id !== profile.lead_id) throw new Error("Lead identity mismatch.");
    parsed.qualification.budget_range = budgetRange;
    if (!parsed.discovery.future_state?.trim()) throw new Error("Missing mandatory future state.");
    return parsed;
  } catch (error) {
    console.error("OpenAI discovery finalization failed", {
      errorType: error instanceof Error ? error.name : "unknown",
    });
    throw new DiscoveryProviderError();
  }
}
