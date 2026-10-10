# Village Development Projects

## What this module does

- Adds a responsive Expo Router page at /projects.
- Reads published project records from Supabase.
- Displays project status, category, location, dates, budget target, reported expenditure, and an expenditure-to-budget indicator.
- Includes status filters, refresh, aggregate totals, and an empty state.
- Adds no checkout, donation, payment, or contribution collection.

## Database setup

Apply supabase/migrations/007_village_projects.sql after the existing admin foundation migrations (001–006). The migration creates the public.village_projects table, enables row-level security, allows anonymous/authenticated visitors to select published projects, and allows authenticated administrators recognized by public.is_admin() to manage rows.

Only users already registered in public.admin_users can manage projects. Do not expose a Supabase service-role key in the Expo client. The spent_amount field is an administrator-reported figure, not a bank balance or independent audit.

## Publishing a project

After applying the migration, an authorized administrator can add a row through the Supabase dashboard or a future admin UI. Set published = true only after verifying the project description, budget basis, owner, and supporting records. Keep spent_amount and updated_at current as reporting changes.

No sample project rows are inserted: the public page should not imply that an unapproved initiative or budget is real.

## Configuration and verification

Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY in the deployment environment. These are public client settings; never use a service-role key here.

Run npm run test:projects, npm run test:project-migration, and npm run build:web.

The migration contract test checks policy intent text, not the behavior of a live Supabase instance. Verify RLS with anon, non-admin, and admin test accounts before publishing real project information.
