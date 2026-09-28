# BRANT·CO — Clearer Growth, Simpler Work

Production-oriented bilingual website with a five-question project form and an optional guided assessment:

```text
Visitor → Contact Details → Five Questions → Recommendation → Booking / Team Review / Guided Assessment
```

## Project Overview

Public routes:

- `/` — home;
- `/servicios` — three result-focused services plus special projects;
- `/portafolio` — six provisional visual samples without invented clients or results;
- `/forms` — contact capture and five business questions;
- `/diagnostico` — guided follow-up that uses the completed form as context;
- `/pqrs` — questions, requests, complaints, claims and suggestions;
- `/privacy` and `/terms` — launch-review drafts;
- `/api/health` — deployment health check.

The website uses the official BRANT·CO colors (`#A20000`, `#000000`, `#FFFFFF`), Montserrat, and the supplied logo assets.

## Tech Stack

- Next.js App Router, React and TypeScript
- Tailwind CSS v4 plus centralized CSS design tokens
- Supabase/Postgres for leads, assessments and rate-limit state
- OpenAI Responses API for the optional guided assessment
- Zod for server-side validation
- Vitest for deterministic business-logic tests
- Docker standalone output for Coolify

## Local Setup

1. Install Node.js 22 or newer.
2. Copy `.env.example` to `.env.local` and complete the required values.
3. Install and run:

```bash
npm ci
npm run dev
```

The site is available at `http://localhost:3000` by default. Public pages render without credentials; assessment APIs return a safe configuration message until Supabase is configured.

## Environment Variables

| Variable | Scope | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public | Canonical origin, sitemap and metadata |
| `NEXT_PUBLIC_BOOKING_URL` | Public | Booking link shown only to qualified leads |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Public | Optional footer contact address |
| `N8N_LEAD_WEBHOOK_URL` | Server config | Validated lead-capture webhook sent from the server |
| `NEXT_PUBLIC_SUPABASE_URL` | Public identifier | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public identifier | Reserved for future browser features; not used by assessment writes |
| `SUPABASE_SERVICE_ROLE_KEY` | Server secret | Server-only database access; never expose as `NEXT_PUBLIC_*` |
| `RATE_LIMIT_SALT` | Server secret | Hashes client network identifiers before rate-limit persistence |
| `OPENAI_API_KEY` | Server secret | Optional guided assessment; never expose as `NEXT_PUBLIC_*` |
| `OPENAI_DISCOVERY_MODEL` | Server config | Model used by the guided assessment |

Do not log environment objects or lead payloads in production.

## Supabase Setup

Apply the migrations in timestamp order:

1. `supabase/migrations/202609170001_initial_discovery.sql`
2. `supabase/migrations/202609210001_multiple_choice_assessment.sql`
3. `supabase/migrations/202609260001_contextual_assessment.sql`

The first migration creates leads, messages and security policies. The second adds versioned questionnaire answers. The third stores the new contextual answers and the guided-assessment summary.

Row Level Security is enabled. Browser roles receive no direct access; writes pass only through validated server routes using the service role.

Migrations are append-only. Do not rewrite a migration that has been applied to production.
The logical sequence (001, 002, 003) is documented in `supabase/migrations/README.md`.
Future files should include the next logical number after their Supabase timestamp,
for example `YYYYMMDDHHMMSS_004_short_description.sql`. Do not rename the three
existing files after they have been applied.

## Five-Question Assessment

After contact capture, the visitor completes:

1. Main challenges — multiple selections and an optional “Other” answer
2. Priority — one selection and an optional “Other” answer
3. Decision readiness — one closed selection
4. Investment range — one closed selection
5. Business and process context — open text

The challenge answers select a primary and optional secondary service. Priority, decision stage and investment range produce a server-side score from 0 to 100 in `lib/qualification/scoring.ts`.

Hard rules:

- Budget below USD 1,000 always produces `nurture` and never returns a booking URL.
- A custom priority answer produces `review`.
- Eligible scores of 65 or more produce `qualified`; scores from 42 through 64 produce `review`.
- A challenge entered only through “Other” opens the guided assessment after the form is saved.

The database stores `contextual_v2`, all five answers, the component breakdown, total score and recommendation. The score and breakdown are not returned to the visitor.

## Assessment Architecture

1. The initial form captures name, email and WhatsApp.
2. `/api/leads/start` validates, rate-limits and creates the lead immediately.
3. The client presents the five questions from `content/questionnaire.ts`.
4. `/api/discovery/finalize` validates the complete answer set, calculates the score and persists the versioned result.
5. The public response contains only the recommendation, visitor-facing message and booking eligibility.
6. `/api/discovery/message` optionally asks up to five follow-up questions, using the business answers but not the visitor's contact details. Requests use structured output and `store: false`.

`localStorage` stores only the form session, progress and business answers needed to continue. It does not store the visitor's name, email or WhatsApp number. Supabase remains the source of truth after submission.

## Content Management

Editable public content is centralized in:

- `content/site.ts`
- `content/services.ts`
- `content/portfolio.ts`
- `content/prs.ts`
- `content/questionnaire.ts`

Do not add unverified clients, logos, testimonials, metrics or results.

## Testing

Run the full local gate:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Tests cover contact validation, all five answer types, custom answers, removed-option rejection, deterministic scoring, service recommendations and booking eligibility.

For a credentialed staging environment, also verify Supabase failures, idempotent retries, n8n delivery and end-to-end persistence before launch.

## Deployment with Coolify

The included multi-stage `Dockerfile` produces a Next.js standalone image running as an unprivileged user. Follow `docs/COOLIFY_DEPLOYMENT.md`, configure runtime secrets, and apply all Supabase migrations before sending production traffic to `/forms`.

## Security Notes

- Public payloads are validated server-side with closed enums, cross-field rules and length limits.
- Rate-limit identifiers are salted and hashed; raw IP addresses are not persisted.
- The Supabase service role remains server-only.
- The browser cannot write directly to Supabase.
- Logs contain technical categories, not full lead payloads or unnecessary PII.
- The guided assessment does not send name, email or WhatsApp to OpenAI, and API responses are requested with storage disabled.

## Known TODOs

- Complete legal entity, jurisdiction, retention period and contact details in Privacy/Terms after legal review.
- Configure final booking and contact URLs.
- Replace portfolio placeholders with approved client work and verified outcomes.
- Run credentialed staging E2E tests against the production Supabase schema.
