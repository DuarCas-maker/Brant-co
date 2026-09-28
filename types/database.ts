export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type LeadRow = {
  id: string;
  idempotency_key: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  qualification_status: string | null;
  score: number | null;
  created_at: string;
  updated_at: string;
};

type LeadMessageRow = {
  id: string;
  lead_id: string;
  turn_number: number;
  role: string;
  content: string;
  created_at: string;
};

type LeadAssessmentRow = {
  id: string;
  lead_id: string;
  company_name: string | null;
  industry: string | null;
  business_model: string | null;
  operating: boolean | null;
  current_state: string | null;
  primary_problem: string | null;
  secondary_problems: Json;
  process_affected: string | null;
  tools: Json;
  manual_processes: Json;
  lead_volume: string | null;
  transaction_volume: string | null;
  time_impact: string | null;
  financial_impact: string | null;
  error_impact: string | null;
  lost_opportunities: string | null;
  other_impact: string | null;
  future_state: string | null;
  expected_impact: string | null;
  success_metrics: Json;
  decision_authority: string | null;
  urgency: string | null;
  budget_range: string | null;
  primary_service: string | null;
  secondary_services: Json;
  special_software_project: boolean;
  potential_project: string | null;
  score: number | null;
  qualification_status: string | null;
  executive_summary: string | null;
  main_opportunity: string | null;
  risks: Json;
  missing_information: Json;
  recommended_next_step: string | null;
  raw_ai_json: Json;
  assessment_version: string | null;
  questionnaire_answers: Json | null;
  business_stage: string | null;
  primary_challenge: string | null;
  impact_level: string | null;
  decision_readiness: string | null;
  score_breakdown: Json | null;
  challenge_selections: Json;
  challenge_other: string | null;
  priority_level: string | null;
  priority_other: string | null;
  decision_stage: string | null;
  decision_other: string | null;
  business_context: string | null;
  diagnosis_completed: boolean;
  diagnosis_summary: string | null;
  diagnosis_completed_at: string | null;
  created_at: string;
  updated_at: string;
};

type RateLimitRow = {
  key_hash: string;
  window_start: string;
  request_count: number;
};

export type Database = {
  public: {
    Tables: {
      leads: {
        Row: LeadRow;
        Insert: Omit<LeadRow, "id" | "created_at" | "updated_at" | "qualification_status" | "score"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
          qualification_status?: string | null;
          score?: number | null;
        };
        Update: Partial<Omit<LeadRow, "id">>;
        Relationships: [];
      };
      lead_messages: {
        Row: LeadMessageRow;
        Insert: Omit<LeadMessageRow, "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Omit<LeadMessageRow, "id">>;
        Relationships: [
          {
            foreignKeyName: "lead_messages_lead_id_fkey";
            columns: ["lead_id"];
            isOneToOne: false;
            referencedRelation: "leads";
            referencedColumns: ["id"];
          },
        ];
      };
      lead_assessments: {
        Row: LeadAssessmentRow;
        Insert: Partial<Omit<LeadAssessmentRow, "lead_id" | "raw_ai_json">> & {
          lead_id: string;
          raw_ai_json: Json;
        };
        Update: Partial<Omit<LeadAssessmentRow, "id" | "lead_id">>;
        Relationships: [
          {
            foreignKeyName: "lead_assessments_lead_id_fkey";
            columns: ["lead_id"];
            isOneToOne: true;
            referencedRelation: "leads";
            referencedColumns: ["id"];
          },
        ];
      };
      api_rate_limits: {
        Row: RateLimitRow;
        Insert: RateLimitRow;
        Update: Partial<RateLimitRow>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      consume_rate_limit: {
        Args: { p_key_hash: string; p_window_start: string; p_limit: number };
        Returns: boolean;
      };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
