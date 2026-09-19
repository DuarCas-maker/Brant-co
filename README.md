# BRANT·CO — Digital Growth Systems

Production-oriented corporate site and five-turn AI Discovery experience for BRANT·CO. The product connects the public marketing site to a structured lead pipeline:

```text
Visitor → Lead Capture → AI Discovery → Qualification → Qualified / Review / Nurture
```

## Project Overview

Public routes:

- `/` — Inicio
- `/servicios` — the ATTRACT / CONVERT / AUTOMATE service architecture
- `/portafolio` — centralized case-study structures without invented claims
- `/forms` — progressive AI Discovery experience
- `/prs` — professional placeholder pending the commercial definition of PRS
- `/privacy` and `/terms` — launch-review drafts
- `/api/health` — deployment health check

The website uses the official BRANT·CO colors (`#A20000`, `#000000`, `#FFFFFF`), Montserrat, and logo assets extracted without redrawing from the supplied branding source.

## Tech Stack

- Next.js App Router, React and TypeScript
- Tailwind CSS v4 plus centralized CSS design tokens
- Supabase/Postgres for leads, messages, assessments and rate-limit state
- OpenAI Responses API with Structured Outputs and Zod
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

The site is available at `http://localhost:3000` by default. The public pages render without credentials; the discovery APIs return a safe configuration message until Supabase and OpenAI are configured.

## Environment Variables

| Variable | Scope | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public | Canonical origin, sitemap and metadata |
| `NEXT_PUBLIC_BOOKING_URL` | Public | Booking link shown only to qualified leads |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Public | Optional footer contact address |
| `N8N_LEAD_WEBHOOK_URL` | Server config | Validated lead-capture webhook sent from the server |
| `NEXT_PUBLIC_SUPABASE_URL` | Public identifier | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public identifier | Reserved for future browser features; not used by discovery writes |
| `SUPABASE_SERVICE_ROLE_KEY` | Server secret | Server-only database access; never expose as `NEXT_PUBLIC_*` |
| `OPENAI_API_KEY` | Server secret | Server-only Responses API credential |
| `OPENAI_DISCOVERY_MODEL` | Server config | Model used for discovery and final opportunity brief |
| `RATE_LIMIT_SALT` | Server secret | Hashes client network identifiers before rate-limit persistence |

Do not log environment objects, lead payloads or full provider responses in production.

## Supabase Setup

1. Create a Supabase project.
2. Apply `supabase/migrations/202609170001_initial_discovery.sql` using the Supabase CLI or SQL editor.
3. Configure the URL and service role key.

The migration creates:

- `leads` — contact and lifecycle state;
- `lead_messages` — one user/assistant message per turn;
- `lead_assessments` — the structured profile, opportunity brief and qualification;
- `api_rate_limits` and `consume_rate_limit` — an atomic fixed-window limiter.

Row Level Security is enabled. Browser roles receive no direct access; discovery writes pass only through validated server routes using the service role.

## Database Migrations

Migrations are append-only. Do not rewrite a migration that has been applied to production. Add a new timestamped file for schema changes and review destructive changes before applying them.

## OpenAI Setup

The implementation follows the OpenAI Responses API Structured Outputs pattern:

- `lib/openai/client.ts` owns the server-side client, timeout and retry policy;
- `lib/openai/discovery-prompt.ts` contains the protected discovery instructions;
- `lib/openai/discovery-schema.ts` is the Zod contract and lead profile;
- `lib/openai/discovery.ts` uses `responses.parse` with `zodTextFormat`;
- the model is selected only through `OPENAI_DISCOVERY_MODEL`.

No API key, system prompt, score or raw opportunity brief is returned to the browser.

## AI Discovery Architecture

1. The initial form captures only name, email and WhatsApp.
2. `/api/leads/start` validates, rate-limits and creates the lead immediately.
3. Turns 1–4 collect Business + Current State, Problem + Impact, Future State and the highest-value qualification gap.
4. Turn 5 is an application-controlled USD budget selector—not a free-text AI question.
5. User messages are persisted before the OpenAI call. A provider failure can be retried without losing or duplicating the turn.
6. Finalization creates the internal opportunity brief, runs deterministic scoring and returns only the public result.

`localStorage` stores a small resume pointer (lead ID, current turn and current question). Supabase remains the source of truth.

## Qualification Logic

The application calculates 100 points in `lib/qualification/scoring.ts`:

- Budget: 30
- Problem clarity: 20
- Operating business: 15
- Decision authority: 15
- Volume / opportunity: 10
- Identifiable impact: 10

Hard rules:

- Budget below USD 1,000 always produces `nurture` and never returns a booking URL.
- Special software and unknown budget go to `review`.
- `qualified` requires an operating business, a concrete problem, reasonable service fit, eligible budget and a score of at least 70.
- Scores and internal reasoning are never displayed to the visitor.

## Content Management

Editable public content is centralized in:

- `content/site.ts`
- `content/services.ts`
- `content/portfolio.ts`
- `content/prs.ts`

Do not add unverified clients, logos, testimonials, metrics or results. Replace portfolio placeholders only with approved evidence.

## Testing

Run the full local gate:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Tests cover contact validation, malformed discovery payloads, the five-turn contract, budget rules, 50/70 score boundaries, operating status, special software routing and booking eligibility.

For a credentialed staging environment, also verify Supabase/OpenAI failures, idempotent retries and end-to-end persistence before launch.

## Deployment with Coolify

The included multi-stage `Dockerfile` produces a Next.js standalone image running as an unprivileged user.

Use the production runbook in [`docs/COOLIFY_DEPLOYMENT.md`](docs/COOLIFY_DEPLOYMENT.md).
The short version is:

1. Connect the GitHub repository and select branch `main`.
2. Select Dockerfile deployment, expose port `3000`, and use `/api/health` for health checks.
3. Configure `NEXT_PUBLIC_*` values for both build and runtime.
4. Configure service credentials and webhook settings as runtime-only secrets.
5. Apply the Supabase migration before sending production traffic to `/forms`.

## Security Notes

- All public payloads are validated server-side with length limits.
- Rate-limit identifiers are salted and hashed; raw IP addresses are not persisted.
- The service role and OpenAI keys remain server-only.
- Messages use text rendering; user HTML is never executed.
- The discovery prompt treats user messages as untrusted data and rejects role/secret/scoring override attempts.
- Logs contain technical categories, not full lead payloads or unnecessary PII.

## Known TODOs

- **PRS final content pending definition.** Do not invent the acronym or commercial claims.
- Replace portfolio placeholders with approved client work and verified outcomes.
- Complete legal entity, jurisdiction, retention period and contact details in Privacy/Terms after legal review.
- Configure final booking and contact URLs.
- Run credentialed staging E2E tests against the production Supabase schema and selected OpenAI model.
