# BRANT·CO deployment in Coolify

This runbook keeps the application portable between the provisional and final
Coolify instances. GitHub is the source of truth; Coolify only builds and runs
the selected commit.

## 1. Create the application

1. In Coolify, add the GitHub source and grant it access to
   `DuarCas-maker/Brant-co`.
2. Create a new resource from that repository.
3. Select branch `main`.
4. Select **Dockerfile** as the build pack.
5. Use `Dockerfile` as the Dockerfile location and `/` as the base directory.
6. Expose container port `3000`.
7. Configure the health check path as `/api/health`.

No custom start command is required. The image starts the minimal Next.js
standalone server as the non-root `nextjs` user.

## 2. Configure environment variables

Copy the variable names from `.env.example`; never upload a local `.env` file.

### Build and runtime variables

Mark these variables as available during both build and runtime in Coolify:

- `NEXT_PUBLIC_SITE_URL`: final HTTPS origin, without a trailing slash.
- `NEXT_PUBLIC_BOOKING_URL`: optional booking URL.
- `NEXT_PUBLIC_CONTACT_EMAIL`: optional public contact email.
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase public anon key.

Next.js freezes `NEXT_PUBLIC_*` values into browser bundles during the image
build. Rebuild the image after changing one of these values.

### Runtime-only variables

Configure these as runtime variables. Do not expose them as Docker build
arguments and do not prefix them with `NEXT_PUBLIC_`:

- `N8N_LEAD_WEBHOOK_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `OPENAI_DISCOVERY_MODEL`
- `RATE_LIMIT_SALT`

Generate `RATE_LIMIT_SALT` as a long random value. Treat the Supabase service
role key and OpenAI key as secrets.

## 3. Prepare Supabase

1. Create or select the Supabase Cloud project.
2. Run `supabase/migrations/0001_initial_schema.sql` in the SQL editor.
3. Add the project URL and keys to Coolify with the scopes above.
4. Do not expose the service role key to the browser.

## 4. Deploy and verify

1. Deploy the latest `main` commit.
2. Confirm that `/api/health` returns HTTP 200 and `{ "status": "ok" }`.
3. Open `/`, `/servicios`, `/portafolio`, `/forms`, and `/prs` in both languages.
4. Submit a test lead and confirm its n8n execution and Supabase records.
5. Complete a five-turn discovery test and verify qualification/booking rules.
6. Confirm canonical URLs, `robots.txt`, and `sitemap.xml` use the production
   domain.

## 5. Move to another Coolify server

1. Connect the same GitHub repository to the new Coolify instance.
2. Recreate the application using the settings in this document.
3. Copy the environment variables securely; do not move them through Git.
4. Point the new instance at the same Supabase Cloud project.
5. Deploy and verify using a temporary domain.
6. Change DNS only after the new instance passes the checks above.
7. Keep the old instance available for rollback until DNS and webhook tests are
   stable, then remove it.

Because application state is stored in Supabase rather than the container,
moving between Coolify servers does not require rebuilding the database.
