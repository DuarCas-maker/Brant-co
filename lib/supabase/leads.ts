import type { LeadCaptureInput } from "@/lib/validation/schemas";
import { questionnaireAnswersSchema } from "@/lib/validation/schemas";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getServiceRecommendation, SCORING_VERSION, type ScoreBreakdown } from "@/lib/qualification/scoring";
import { serviceIds, type QualificationStatus, type QuestionnaireAnswers, type ServiceId } from "@/types/discovery";

function assertData<T>(data: T | null, error: { message: string } | null): T {
  if (error || data === null) { console.error("Supabase operation failed", { error: error?.message || "missing data" }); throw new Error("Persistence operation failed."); }
  return data;
}

export async function createLead(input: LeadCaptureInput) {
  const { data, error } = await getSupabaseAdmin().from("leads").upsert({ idempotency_key: input.idempotencyKey, name: input.name, email: input.email, phone: input.phone, status: "assessment_started" }, { onConflict: "idempotency_key" }).select("id").single();
  return assertData(data, error).id as string;
}

export async function requireLead(leadId: string) {
  const { data, error } = await getSupabaseAdmin().from("leads").select("id,status").eq("id", leadId).maybeSingle();
  if (error) throw new Error("Persistence operation failed.");
  return data as { id: string; status: string } | null;
}

export async function loadCompletedAssessment(leadId: string) {
  const { data, error } = await getSupabaseAdmin().from("lead_assessments").select("questionnaire_answers,qualification_status").eq("lead_id", leadId).maybeSingle();
  if (error) throw new Error("Persistence operation failed.");
  if (!data?.questionnaire_answers || !data.qualification_status) return null;
  const parsed = questionnaireAnswersSchema.safeParse(data.questionnaire_answers);
  if (!parsed.success) return null;
  return { answers: parsed.data, status: data.qualification_status as QualificationStatus };
}

export async function saveQuestionnaireAssessment(leadId: string, answers: QuestionnaireAnswers, score: ScoreBreakdown, status: QualificationStatus) {
  const recommendation = getServiceRecommendation(answers);
  const row = {
    lead_id: leadId,
    current_state: answers.businessContext,
    primary_problem: answers.challenges.join(","),
    secondary_problems: answers.challenges.slice(1),
    budget_range: answers.budgetRange,
    decision_authority: answers.decisionStage,
    urgency: answers.priority,
    primary_service: recommendation.primary,
    secondary_services: recommendation.secondary,
    special_software_project: recommendation.primary === "special" || recommendation.secondary.includes("special"),
    score: score.total,
    qualification_status: status,
    raw_ai_json: { assessment_version: SCORING_VERSION, answers, score, qualification_status: status, recommendation },
    assessment_version: SCORING_VERSION,
    questionnaire_answers: answers,
    score_breakdown: score,
    challenge_selections: answers.challenges,
    challenge_other: answers.challengeOther || null,
    priority_level: answers.priority,
    priority_other: answers.priorityOther || null,
    decision_stage: answers.decisionStage,
    decision_other: answers.decisionOther || null,
    business_context: answers.businessContext,
  };
  const { error } = await getSupabaseAdmin().from("lead_assessments").upsert(row, { onConflict: "lead_id" });
  if (error) throw new Error("Persistence operation failed.");
}

export async function completeLead(leadId: string, status: QualificationStatus, score: number) {
  const { error } = await getSupabaseAdmin().from("leads").update({ status, qualification_status: status, score }).eq("id", leadId);
  if (error) throw new Error("Persistence operation failed.");
}

export type SavedMessage = { turn_number: number; role: "user" | "assistant"; content: string };
export async function loadMessages(leadId: string) {
  const { data, error } = await getSupabaseAdmin().from("lead_messages").select("turn_number,role,content").eq("lead_id", leadId).order("turn_number").order("created_at");
  if (error) throw new Error("Persistence operation failed.");
  return (data || []) as SavedMessage[];
}

export async function saveMessage(leadId: string, turn: number, role: "user" | "assistant", content: string) {
  const { error } = await getSupabaseAdmin().from("lead_messages").upsert({ lead_id: leadId, turn_number: turn, role, content }, { onConflict: "lead_id,turn_number,role" });
  if (error) throw new Error("Persistence operation failed.");
}

export async function saveDiagnosisResult(leadId: string, summary: string, primary: ServiceId, secondary: ServiceId[]) {
  const { error } = await getSupabaseAdmin().from("lead_assessments").update({ diagnosis_completed: true, diagnosis_summary: summary, executive_summary: summary, primary_service: primary, secondary_services: secondary, recommended_next_step: "Team review and tailored proposal", diagnosis_completed_at: new Date().toISOString() }).eq("lead_id", leadId);
  if (error) throw new Error("Persistence operation failed.");
}

export async function loadDiagnosisResult(leadId: string) {
  const { data, error } = await getSupabaseAdmin().from("lead_assessments").select("diagnosis_completed,diagnosis_summary,primary_service,secondary_services").eq("lead_id", leadId).maybeSingle();
  if (error) throw new Error("Persistence operation failed.");
  if (!data?.diagnosis_completed || !data.diagnosis_summary) return null;
  const validServices = new Set<string>(serviceIds);
  const primary = validServices.has(data.primary_service || "") ? data.primary_service as ServiceId : "unclear";
  const secondary = Array.isArray(data.secondary_services) ? data.secondary_services.filter((item): item is ServiceId => typeof item === "string" && validServices.has(item)).slice(0, 2) : [];
  return { summary: data.diagnosis_summary, primaryService: primary, secondaryServices: secondary };
}
