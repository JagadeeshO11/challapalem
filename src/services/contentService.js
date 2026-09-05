import { places, events, businesses, community } from '../data/content';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

const collections = { places, events, businesses, community };

export const contentTypes = Object.freeze({
  place: 'places',
  event: 'events',
  business: 'businesses',
  community: 'community',
});

export function getContentCollection(type) {
  const collectionName = contentTypes[type];
  return collectionName ? collections[collectionName] : [];
}

export function getContentList(type) {
  return getContentCollection(type);
}

export function getContentById(type, id) {
  if (!id) return null;
  return getContentCollection(type).find((item) => item.id === id) ?? null;
}

export function searchContent(type, query) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return getContentList(type);

  return getContentList(type).filter((item) =>
    `${item.title} ${item.category ?? ''} ${item.description ?? ''} ${item.details ?? ''}`
      .toLowerCase()
      .includes(normalized),
  );
}

function mapRemoteItem(row) {
  return {
    id: row.slug,
    title: row.title,
    category: row.category ?? undefined,
    description: row.description,
    details: row.details ?? undefined,
    date: row.date_text ?? undefined,
  };
}

export async function getContentListRemote(type) {
  if (!isSupabaseConfigured || !supabase || !contentTypes[type]) {
    return { data: getContentList(type), error: null, source: 'local' };
  }

  const { data, error } = await supabase
    .from('content_items')
    .select('type, slug, title, category, description, details, date_text')
    .eq('type', type)
    .order('title', { ascending: true });

  if (error) {
    return { data: getContentList(type), error, source: 'local-fallback' };
  }

  return { data: (data ?? []).map(mapRemoteItem), error: null, source: 'supabase' };
}

export async function getContentByIdRemote(type, id) {
  if (!isSupabaseConfigured || !supabase || !contentTypes[type]) {
    return { data: getContentById(type, id), error: null, source: 'local' };
  }

  const { data, error } = await supabase
    .from('content_items')
    .select('type, slug, title, category, description, details, date_text')
    .eq('type', type)
    .eq('slug', id)
    .maybeSingle();

  if (error) {
    return { data: getContentById(type, id), error, source: 'local-fallback' };
  }

  return { data: data ? mapRemoteItem(data) : null, error: null, source: 'supabase' };
}

export async function searchContentRemote(type, query) {
  const normalized = query.trim();
  if (!isSupabaseConfigured || !supabase || !contentTypes[type]) {
    return { data: searchContent(type, query), error: null, source: 'local' };
  }

  if (!normalized) return getContentListRemote(type);

  const pattern = `%${normalized.replace(/[%_]/g, '\\$&')}%`;
  const { data, error } = await supabase
    .from('content_items')
    .select('type, slug, title, category, description, details, date_text')
    .eq('type', type)
    .or(`title.ilike.${pattern},category.ilike.${pattern},description.ilike.${pattern},details.ilike.${pattern}`)
    .order('title', { ascending: true });

  if (error) {
    return { data: searchContent(type, query), error, source: 'local-fallback' };
  }

  return { data: (data ?? []).map(mapRemoteItem), error: null, source: 'supabase' };
}
