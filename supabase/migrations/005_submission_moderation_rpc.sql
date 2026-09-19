-- Transactional moderation actions for community submissions.
-- Run after 004_content_submission_admin.sql.

create or replace function public.approve_content_submission(p_submission_id bigint)
returns public.content_items
language plpgsql
security definer
set search_path = public
as $$
declare
  submission public.content_submissions%rowtype;
  result public.content_items%rowtype;
  base_slug text;
  candidate_slug text;
  suffix integer := 1;
begin
  if not public.is_admin() then
    raise exception 'not authorized' using errcode = '42501';
  end if;

  select * into submission
  from public.content_submissions
  where id = p_submission_id
  for update;

  if not found then
    raise exception 'submission not found' using errcode = 'P0002';
  end if;

  if submission.status <> 'pending' then
    raise exception 'submission is already moderated' using errcode = 'P0001';
  end if;

  base_slug := regexp_replace(lower(trim(submission.title)), '[^a-z0-9]+', '-', 'g');
  base_slug := trim(both '-' from base_slug);
  if base_slug = '' then
    base_slug := 'community-submission';
  end if;
  candidate_slug := left(base_slug, 180);

  while exists (
    select 1 from public.content_items
    where type = submission.type and slug = candidate_slug
  ) loop
    candidate_slug := left(base_slug, 170) || '-' || suffix::text;
    suffix := suffix + 1;
  end loop;

  insert into public.content_items (
    type,
    slug,
    title,
    category,
    description,
    details,
    date_text,
    published
  )
  values (
    submission.type,
    candidate_slug,
    submission.title,
    submission.category,
    submission.description,
    submission.details,
    submission.date_text,
    true
  )
  returning * into result;

  update public.content_submissions
  set status = 'approved', updated_at = now()
  where id = submission.id;

  return result;
end;
$$;

create or replace function public.reject_content_submission(p_submission_id bigint)
returns public.content_submissions
language plpgsql
security definer
set search_path = public
as $$
declare
  result public.content_submissions%rowtype;
begin
  if not public.is_admin() then
    raise exception 'not authorized' using errcode = '42501';
  end if;

  update public.content_submissions
  set status = 'rejected', updated_at = now()
  where id = p_submission_id
    and status = 'pending'
  returning * into result;

  if not found then
    raise exception 'pending submission not found' using errcode = 'P0002';
  end if;

  return result;
end;
$$;

revoke all on function public.approve_content_submission(bigint) from public, anon, authenticated;
revoke all on function public.reject_content_submission(bigint) from public, anon, authenticated;
grant execute on function public.approve_content_submission(bigint) to authenticated;
grant execute on function public.reject_content_submission(bigint) to authenticated;
