-- Challapalle content foundation
-- Run this migration in the Supabase SQL Editor before enabling remote content.

create table if not exists public.content_items (
  type text not null check (type in ('place', 'event', 'business', 'community')),
  slug text not null,
  title text not null,
  category text,
  description text not null,
  details text,
  date_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (type, slug)
);

create index if not exists content_items_type_idx on public.content_items (type);
create index if not exists content_items_title_idx on public.content_items using gin (to_tsvector('simple', title));

alter table public.content_items enable row level security;

drop policy if exists "Public can read published content" on public.content_items;
create policy "Public can read published content"
  on public.content_items
  for select
  to anon, authenticated
  using (true);

revoke insert, update, delete on public.content_items from anon;
grant select on public.content_items to anon, authenticated;

insert into public.content_items (type, slug, title, category, description, details, date_text)
values
  ('place', 'village-center', 'Challapalle Village', 'Place', 'A starting point for discovering local life, stories and landmarks.', 'Use this space to document the village centre, important landmarks, local memories and practical information for residents and visitors.', null),
  ('place', 'heritage', 'Heritage & Temples', 'Heritage', 'Local places of worship, traditions and history worth preserving.', 'A growing collection for temples, heritage sites, festivals, oral history and other places that connect today’s Challapalle with its past.', null),
  ('place', 'nature', 'Fields & Waterways', 'Nature', 'The agricultural landscape and waterways that shape village life.', 'Document fields, canals, ponds, trees, seasonal changes and the natural places that are part of everyday life in Challapalle.', null),
  ('event', 'community-meet', 'Community Gathering', null, 'Local announcements, gatherings and community activities.', 'Event information will appear here when a gathering is scheduled, including date, time, location and community notes.', 'Coming soon'),
  ('event', 'heritage-day', 'Heritage Day', null, 'A space for celebrating and documenting local heritage.', 'Use this event page to share the programme, location, timings and stories connected with a future heritage celebration.', 'Coming soon'),
  ('business', 'local-services', 'Local Services', 'Services', 'Discover useful services and businesses in and around Challapalle.', 'This directory will grow into a practical local guide for services, contact information, opening hours and other useful details.', null),
  ('business', 'local-shops', 'Local Shops', 'Shopping', 'A future directory for neighborhood shops and everyday needs.', 'A place to discover neighborhood shops and everyday essentials, with verified business information added as the directory grows.', null),
  ('community', 'stories', 'Village Stories', 'Stories', 'Personal memories and stories from the people of Challapalle.', 'This collection is designed for personal memories, local history and stories shared by the people who know Challapalle best.', null),
  ('community', 'volunteer', 'Community Participation', 'Community', 'Ways for residents and visitors to contribute to the village directory.', 'Future participation tools can help residents suggest places, submit stories, share events and keep local information useful and current.', null)
on conflict (type, slug) do nothing;
