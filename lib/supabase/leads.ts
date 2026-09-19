import type { LeadCaptureInput } from "@/lib/validation/schemas";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createEmptyProfile, discoveryProfileSchema, type DiscoveryProfile } from "@/lib/openai/discovery-schema";
import type { ScoreBreakdown } from "@/lib/qualification/scoring";
import type { QualificationStatus } from "@/types/discovery";

function assertData<T>(data: T | null, error: { message: string } | null): T {
  if (error || data === null) {
    console.error("Supabase operation failed", { error: error?.message || "missing data" });
    throw new Error("Persistence operation failed.");
  }
  return data;
}

export async function createLead(input: LeadCaptureInput) {
  const client = getSupabaseAdmin();
  const { data, error } = await client
    .from("leads")
    .upsert(
      {
        idempotency_key: input.idempotencyKey,
        name: input.name,
        email: input.email,
        phone: input.phone,
        status: "assessment_started",
      },
      { onConflict: "idempotency_key" },
    )
    .select("id")
    .single();
  return assertData(data, error).id as string;
}

export async function requireLead(leadId: string) {
  const { data, error } = await getSupabaseAdmin().from("leads").select("id,status").eq("id", leadId).maybeSingle();
  if (error) throw new Error("Persistence operation failed.");
  if (!data) return null;
  return data as { id: string; status: string };
}

export async function saveMessage(leadId: string, turnNumber: number, role: "user" | "assistant", content: string) {
  const { error } = await getSupabaseAdmin()
    .from("lead_messages")
    .upsert({ lead_id: leadId, turn_number: turnNumber, role, content }, { onConflict: "lead_id,turn_number,role" });
  if (error) throw new Error("Persistence operation failed.");
}

export async function getAssistantMessage(leadId: string, turnNumber: number) {
  const { data, error } = await getSupabaseAdmin()
    .from("lead_messages")
    .select("content")
    .eq("lead_id", leadId)
    .eq("turn_number", turnNumber)
    .eq("role", "assistant")
    .maybeSingle();
  if (error) throw new Error("Persistence operation failed.");
  return (data?.content as string | undefined) || null;
}

export async function getLatestUserTurn(leadId: string) {
  const { data, error } = await getSupabaseAdmin()
    .from("lead_messages")
    .select("turn_number")
    .eq("lead_id", leadId)
    .eq("role", "user")
    .order("turn_number", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error("Persistence operation failed.");
  return (data?.turn_number as number | undefined) || 0;
}

export async function loadProfile(leadId: string): Promise<DiscoveryProfile> {
  const { data, error } = await getSupabaseAdmin()
    .from("lead_assessments")
    .select("raw_ai_json")
    .eq("lead_id", leadId)
    .maybeSingle();
  if (error) throw new Error("Persistence operation failed.");
  if (!data?.raw_ai_json) return createEmptyProfile(leadId);
  return discoveryProfileSchema.parse(data.raw_ai_json);
}

export async function loadCompletedAssessment(leadId: string) {
  const { data, error } = await getSupabaseAdmin()
    .from("lead_assessments")
    .select("raw_ai_json,qualification_status")
    .eq("lead_id", leadId)
    .maybeSingle();
  if (error) throw new Error("Persistence operation failed.");
  if (!data?.raw_ai_json || !data.qualification_status) return null;
  return {
    profile: discoveryProfileSchema.parse(data.raw_ai_json),
    status: data.qualification_status as QualificationStatus,
  };
}

export async function saveProfile(profile: DiscoveryProfile, scoring?: { score: ScoreBreakdown; status: QualificationStatus }) {
  const row = {
    lead_id: profile.lead_id,
    company_name: profile.company.name,
    industry: profile.company.industry,
    business_model: profile.company.business_model,
    operating: profile.company.operating,
    current_state: profile.discovery.current_state,
    primary_problem: profile.discovery.primary_problem,
    secondary_problems: profile.discovery.secondary_problems,
    process_affected: profile.discovery.process_affected,
    tools: profile.discovery.tools,
    manual_processes: profile.discovery.manual_processes,
    lead_volume: profile.discovery.impact.lead_volume,
    transaction_volume: profile.discovery.impact.transaction_volume,
    time_impact: profile.discovery.impact.time_cost,
    financial_impact: profile.discovery.impact.financial_cost,
    error_impact: profile.discovery.impact.errors,
    lost_opportunities: profile.discovery.impact.lost_opportunities,
    other_impact: profile.discovery.impact.other,
    future_state: profile.discovery.future_state,
    expected_impact: profile.discovery.expected_business_impact,
    success_metrics: profile.discovery.success_metrics,
    decision_authority: profile.qualification.decision_authority,
    urgency: profile.qualification.urgency,
    budget_range: profile.qualification.budget_range,
    primary_service: profile.service_fit.primary,
    secondary_services: profile.service_fit.secondary,
    special_software_project: profile.service_fit.special_software_project,
    potential_project: profile.service_fit.potential_project,
    executive_summary: profile.ai_analysis.executive_summary,
    main_opportunity: profile.ai_analysis.main_opportunity,
    risks: profile.ai_analysis.risks,
    missing_information: profile.ai_analysis.missing_information,
    recommended_next_step: profile.ai_analysis.recommended_next_step,
    raw_ai_json: profile,
    score: scoring?.score.total ?? null,
    qualification_status: scoring?.status ?? null,
  };
  const { error } = await getSupabaseAdmin().from("lead_assessments").upsert(row, { onConflict: "lead_id" });
  if (error) throw new Error("Persistence operation failed.");
}

export async function completeLead(leadId: string, status: QualificationStatus, score: number) {
  const { error } = await getSupabaseAdmin()
    .from("leads")
    .update({ status, qualification_status: status, score })
    .eq("id", leadId);
  if (error) throw new Error("Persistence operation failed.");
}
