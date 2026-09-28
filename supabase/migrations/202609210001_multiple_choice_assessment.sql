alter table public.lead_assessments
  add column if not exists assessment_version text,
  add column if not exists questionnaire_answers jsonb,
  add column if not exists business_stage text check (business_stage in (
    'operating_growing', 'operating_stable', 'operating_early', 'not_operating'
  )),
  add column if not exists primary_challenge text check (primary_challenge in (
    'growth_content', 'marketing_sales_ops', 'automation_integrations',
    'integrated_growth', 'special_software', 'unclear'
  )),
  add column if not exists impact_level text check (impact_level in (
    'critical', 'high', 'moderate', 'exploratory', 'unclear'
  )),
  add column if not exists decision_readiness text check (decision_readiness in (
    'decision_30_days', 'shared_90_days', 'decision_exploring', 'recommender', 'no_authority'
  )),
  add column if not exists score_breakdown jsonb;

create index if not exists lead_assessments_version_idx
  on public.lead_assessments (assessment_version, created_at desc);
