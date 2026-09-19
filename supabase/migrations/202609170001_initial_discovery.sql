create extension if not exists pgcrypto;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  idempotency_key uuid not null unique,
  name text not null check (char_length(name) between 2 and 80),
  email text not null check (char_length(email) <= 254),
  phone text not null check (char_length(phone) between 7 and 24),
  status text not null default 'assessment_started' check (status in (
    'new', 'assessment_started', 'assessment_completed', 'qualified', 'review', 'nurture',
    'discovery_scheduled', 'discovery_completed', 'proposal_sent', 'won', 'lost'
  )),
  qualification_status text check (qualification_status in ('qualified', 'review', 'nurture')),
  score integer check (score between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lead_messages (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  turn_number integer not null check (turn_number between 1 and 5),
  role text not null check (role in ('user', 'assistant')),
  content text not null check (char_length(content) between 1 and 4000),
  created_at timestamptz not null default now(),
  unique (lead_id, turn_number, role)
);

create table if not exists public.lead_assessments (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null unique references public.leads(id) on delete cascade,
  company_name text,
  industry text,
  business_model text,
  operating boolean,
  current_state text,
  primary_problem text,
  secondary_problems jsonb not null default '[]'::jsonb,
  process_affected text,
  tools jsonb not null default '[]'::jsonb,
  manual_processes jsonb not null default '[]'::jsonb,
  lead_volume text,
  transaction_volume text,
  time_impact text,
  financial_impact text,
  error_impact text,
  lost_opportunities text,
  other_impact text,
  future_state text,
  expected_impact text,
  success_metrics jsonb not null default '[]'::jsonb,
  decision_authority text,
  urgency text,
  budget_range text,
  primary_service text,
  secondary_services jsonb not null default '[]'::jsonb,
  special_software_project boolean not null default false,
  potential_project text,
  score integer check (score between 0 and 100),
  qualification_status text check (qualification_status in ('qualified', 'review', 'nurture')),
  executive_summary text,
  main_opportunity text,
  risks jsonb not null default '[]'::jsonb,
  missing_information jsonb not null default '[]'::jsonb,
  recommended_next_step text,
  raw_ai_json jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.api_rate_limits (
  key_hash text not null,
  window_start timestamptz not null,
  request_count integer not null default 1 check (request_count > 0),
  primary key (key_hash, window_start)
);

create index if not exists lead_messages_lead_created_idx on public.lead_messages (lead_id, created_at);
create index if not exists leads_created_idx on public.leads (created_at desc);
create index if not exists leads_qualification_idx on public.leads (qualification_status, created_at desc);
create index if not exists api_rate_limits_window_idx on public.api_rate_limits (window_start);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at before update on public.leads
for each row execute function public.set_updated_at();

drop trigger if exists lead_assessments_set_updated_at on public.lead_assessments;
create trigger lead_assessments_set_updated_at before update on public.lead_assessments
for each row execute function public.set_updated_at();

create or replace function public.consume_rate_limit(
  p_key_hash text,
  p_window_start timestamptz,
  p_limit integer
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
begin
  delete from public.api_rate_limits where window_start < now() - interval '2 days';

  insert into public.api_rate_limits (key_hash, window_start, request_count)
  values (p_key_hash, p_window_start, 1)
  on conflict (key_hash, window_start)
  do update set request_count = public.api_rate_limits.request_count + 1
  returning request_count into v_count;

  return v_count <= p_limit;
end;
$$;

alter table public.leads enable row level security;
alter table public.lead_messages enable row level security;
alter table public.lead_assessments enable row level security;
alter table public.api_rate_limits enable row level security;

revoke all on public.leads, public.lead_messages, public.lead_assessments, public.api_rate_limits from anon, authenticated;
revoke all on function public.consume_rate_limit(text, timestamptz, integer) from public, anon, authenticated;
grant select, insert, update, delete on public.leads, public.lead_messages, public.lead_assessments, public.api_rate_limits to service_role;
grant execute on function public.consume_rate_limit(text, timestamptz, integer) to service_role;
