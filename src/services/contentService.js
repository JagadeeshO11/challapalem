import { places, events, businesses, community } from '../data/content';

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
