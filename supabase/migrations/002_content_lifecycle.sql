-- Production content lifecycle and timestamp maintenance

alter table public.content_items
  add column if not exists published boolean not null default true;

create index if not exists content_items_published_type_idx
  on public.content_items (published, type, title);

create or replace function public.set_content_items_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists content_items_set_updated_at on public.content_items;
create trigger content_items_set_updated_at
before update on public.content_items
for each row
execute function public.set_content_items_updated_at();

-- Existing rows created by the first migration are public by default.
update public.content_items
set published = true
where published is null;
