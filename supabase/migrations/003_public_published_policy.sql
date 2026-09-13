-- Enforce publication status at the database boundary.
-- Client-side filtering is not sufficient because direct API queries can bypass it.

drop policy if exists "Public can read published content" on public.content_items;

create policy "Public can read published content"
  on public.content_items
  for select
  to anon, authenticated
  using (published = true);
