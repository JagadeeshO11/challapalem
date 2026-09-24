import fs from 'node:fs';

const migration = fs.readFileSync(new URL('./006_moderation_audit.sql', import.meta.url), 'utf8');

const required = [
  'create table if not exists public.moderation_audit_log',
  'submission_id bigint not null references public.content_submissions(id) on delete restrict',
  'admin_user_id uuid not null references auth.users(id) on delete restrict',
  "action text not null check (action in ('approved', 'rejected'))",
  'content_item_id bigint references public.content_items(id) on delete set null',
  'alter table public.moderation_audit_log enable row level security',
  'public.is_admin()',
  "insert into public.moderation_audit_log",
  "auth.uid(), 'approved', result.id",
  "auth.uid(), 'rejected'",
  'security definer',
  'for update;',
  'grant execute on function public.approve_content_submission(bigint) to authenticated;',
  'grant execute on function public.reject_content_submission(bigint) to authenticated;',
];

for (const fragment of required) {
  if (!migration.includes(fragment)) {
    throw new Error(`Missing moderation audit contract: ${fragment}`);
  }
}

console.log('Moderation audit migration contract tests passed.');
