import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('./004_content_submission_admin.sql', import.meta.url), 'utf8');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(source.includes('create table if not exists public.admin_users'), 'Admin users table must exist');
assert(source.includes('references auth.users(id)'), 'Admin users must reference Supabase Auth users');
assert(source.includes('create or replace function public.is_admin()'), 'Admin role check must be centralized');
assert(source.includes('security definer'), 'Admin role check must safely read its access table');
assert(source.includes('create table if not exists public.content_submissions'), 'Submission table must exist');
assert(source.includes("status text not null default 'pending'"), 'New submissions must default to pending');
assert(source.includes("status in ('pending', 'approved', 'rejected')"), 'Submission status must be constrained');
assert(source.includes('create policy "Public can submit pending content"'), 'Public submission policy must exist');
assert(source.includes("status = 'pending'"), 'Public submissions must not be able to self-approve');
assert(source.includes('create policy "Admins can read submissions"'), 'Admin submission read policy must exist');
assert(source.includes('create policy "Admins can moderate submissions"'), 'Admin moderation policy must exist');
assert(source.includes('create policy "Admins can manage content"'), 'Admins must be able to manage content items');
assert(source.includes('grant insert, update, delete on public.content_items to authenticated'), 'Authenticated admins need content write grants');
assert(source.includes('alter table public.content_submissions enable row level security'), 'Submission RLS must be enabled');
assert(source.includes('alter table public.admin_users enable row level security'), 'Admin RLS must be enabled');

console.log('content submission/admin migration contract checks passed');
