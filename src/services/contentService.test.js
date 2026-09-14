import { readFile } from 'node:fs/promises';
import {
  getContentById,
  getContentCollection,
  getContentList,
  searchContent,
} from './contentService.js';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const types = ['place', 'event', 'business', 'community'];

for (const type of types) {
  const collection = getContentCollection(type);
  assert(Array.isArray(collection), `${type} collection must be an array`);
  assert(collection.length > 0, `${type} collection should contain seed content`);
  assert(getContentList(type).length === collection.length, `${type} list should match its collection`);

  const first = collection[0];
  assert(getContentById(type, first.id)?.id === first.id, `${type} item lookup should return the matching item`);
  assert(searchContent(type, first.title).some((item) => item.id === first.id), `${type} search should find a matching title`);
}

assert(getContentCollection('unknown').length === 0, 'Unknown types should return an empty collection');
assert(getContentById('place', 'missing-id') === null, 'Missing items should return null');
assert(searchContent('unknown', 'anything').length === 0, 'Unknown type search should be empty');

// Guard the production boundary as well as the local data API. The public client
// must always add the published filter before querying Supabase, even though RLS
// also enforces the rule at the database boundary.
const serviceSource = await readFile(new URL('./contentService.js', import.meta.url), 'utf8');
assert(
  serviceSource.includes(".eq('published', true)"),
  'Remote public queries must explicitly request published content only',
);
assert(
  serviceSource.includes(".eq('type', type)"),
  'Remote queries must scope content by type',
);
assert(
  serviceSource.includes(".from('content_items')"),
  'Remote content service must query the content_items table',
);

console.log('contentService local and remote contract checks passed');
