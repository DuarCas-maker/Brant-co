alter table public.lead_assessments
  add column if not exists challenge_selections jsonb not null default '[]'::jsonb,
  add column if not exists challenge_other text,
  add column if not exists priority_level text,
  add column if not exists priority_other text,
  add column if not exists decision_stage text,
  add column if not exists decision_other text,
  add column if not exists business_context text,
  add column if not exists diagnosis_completed boolean not null default false,
  add column if not exists diagnosis_summary text,
  add column if not exists diagnosis_completed_at timestamptz;

create index if not exists lead_assessments_diagnosis_idx
  on public.lead_assessments (diagnosis_completed, updated_at desc);
