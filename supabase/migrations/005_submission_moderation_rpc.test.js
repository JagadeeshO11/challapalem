import fs from 'node:fs';

const migration = fs.readFileSync(new URL('./005_submission_moderation_rpc.sql', import.meta.url), 'utf8');

const required = [
  'create or replace function public.approve_content_submission(p_submission_id bigint)',
  'create or replace function public.reject_content_submission(p_submission_id bigint)',
  'security definer',
  "if not public.is_admin() then",
  "for update;",
  "submission.status <> 'pending'",
  "status = 'approved'",
  "published",
  "status = 'rejected'",
  'revoke all on function public.approve_content_submission(bigint) from public, anon, authenticated;',
  'grant execute on function public.approve_content_submission(bigint) to authenticated;',
  'grant execute on function public.reject_content_submission(bigint) to authenticated;',
];

for (const fragment of required) {
  if (!migration.includes(fragment)) {
    throw new Error(`Missing moderation contract: ${fragment}`);
  }
}

if (!migration.includes("candidate_slug := left(base_slug, 180);")) {
  throw new Error('Approval contract must generate a bounded slug.');
}

if (!migration.includes("candidate_slug := left(base_slug, 170) || '-' || suffix::text;")) {
  throw new Error('Approval contract must resolve slug collisions.');
}

console.log('Submission moderation RPC contract tests passed.');
