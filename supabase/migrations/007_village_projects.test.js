import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('./007_village_projects.sql', import.meta.url), 'utf8');
function assert(condition, message) { if (!condition) throw new Error(message); }

assert(source.includes('create table if not exists public.village_projects'), 'Project register table must exist');
assert(source.includes('alter table public.village_projects enable row level security'), 'RLS must be enabled');
assert(source.includes('using (published = true)'), 'Public reads must be limited to published projects');
assert(source.includes('using (public.is_admin())'), 'Only admins may manage project rows');
assert(source.includes('with check (public.is_admin())'), 'Admin writes must verify admin role');
assert(source.includes('target_budget >= 0'), 'Budget target must not be negative');
assert(source.includes('spent_amount >= 0'), 'Reported spending must not be negative');
assert(source.includes("('planned', 'in_progress', 'completed', 'on_hold')"), 'Project status must be constrained');
assert(source.includes('village_projects_dates_check'), 'Project date range must be checked');
assert(source.includes('revoke all on public.village_projects from anon, authenticated'), 'Table privileges must be reset explicitly');
assert(source.includes('grant select on public.village_projects to anon, authenticated'), 'Public roles should only receive select grant');
assert(!/grant\s+(?:insert|update|delete|all)\s+on\s+public\.village_projects\s+to\s+anon/i.test(source), 'Anonymous users must not be able to write projects');
assert(source.toLowerCase().includes('does not collect money'), 'Migration must document that no payment processing is included');

console.log('village projects migration contract checks passed');
