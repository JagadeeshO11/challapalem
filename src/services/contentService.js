import { places, events, businesses, community } from '../data/content.js';
import { isSupabaseConfigured, supabase } from '../lib/supabase.js';

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

export function searchContent(type, query = '') {
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

function localResult(type, query, error = null) {
  const data = query === undefined ? getContentList(type) : searchContent(type, query);
  return { data, error, source: error ? 'local-fallback' : 'local' };
}

function fallbackError(error) {
  return error instanceof Error ? error : new Error('The online directory is temporarily unavailable.');
}

export async function getContentListRemote(type) {
  if (!isSupabaseConfigured || !supabase || !contentTypes[type]) {
    return localResult(type);
  }

  try {
    const { data, error } = await supabase
      .from('content_items')
      .select('type, slug, title, category, description, details, date_text')
      .eq('type', type)
      .order('title', { ascending: true });

    if (error) return localResult(type, undefined, error);
    return { data: (data ?? []).map(mapRemoteItem), error: null, source: 'supabase' };
  } catch (error) {
    return localResult(type, undefined, fallbackError(error));
  }
}

export async function getContentByIdRemote(type, id) {
  if (!isSupabaseConfigured || !supabase || !contentTypes[type]) {
    return { data: getContentById(type, id), error: null, source: 'local' };
  }

  try {
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
  } catch (error) {
    return {
      data: getContentById(type, id),
      error: fallbackError(error),
      source: 'local-fallback',
    };
  }
}

export async function searchContentRemote(type, query = '') {
  const normalized = query.trim();
  if (!isSupabaseConfigured || !supabase || !contentTypes[type]) {
    return localResult(type, query);
  }

  if (!normalized) return getContentListRemote(type);

  try {
    const pattern = `%${normalized.replace(/[%_]/g, '\\$&')}%`;
    const { data, error } = await supabase
      .from('content_items')
      .select('type, slug, title, category, description, details, date_text')
      .eq('type', type)
      .or(`title.ilike.${pattern},category.ilike.${pattern},description.ilike.${pattern},details.ilike.${pattern}`)
      .order('title', { ascending: true });

    if (error) return localResult(type, query, error);
    return { data: (data ?? []).map(mapRemoteItem), error: null, source: 'supabase' };
  } catch (error) {
    return localResult(type, query, fallbackError(error));
  }
}
