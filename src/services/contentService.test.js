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

const serviceModuleUrl = new URL('./contentService.js', import.meta.url).href;
const originalFetch = globalThis.fetch;

function createQueryBuilder(rows) {
  const filters = [];
  const builder = {
    select() { return builder; },
    eq(column, value) { filters.push(['eq', column, value]); return builder; },
    or() { return builder; },
    order() { return builder; },
    maybeSingle() {
      return Promise.resolve({ data: rows[0] ?? null, error: null });
    },
    then(resolve, reject) {
      return Promise.resolve({ data: rows, error: null }).then(resolve, reject);
    },
  };
  return { builder, filters };
}

function createFetchRecorder(rows) {
  const calls = [];
  const fetch = async (input, init = {}) => {
    const url = String(input);
    calls.push({ url, init });
    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  };
  return { calls, fetch };
}

const remoteRow = {
  type: 'place',
  slug: 'remote-place',
  title: 'Remote Place',
  category: 'Test',
  description: 'Remote content',
  details: 'Remote details',
  date_text: null,
};

// The production client is configured through environment variables. A cache-busting
// module URL lets this contract test load the service once with Supabase disabled and
// once with a lightweight HTTP-level fake for the configured client.
process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY = 'test-public-key';
const { calls, fetch } = createFetchRecorder([remoteRow]);
globalThis.fetch = fetch;

const remoteService = await import(`${serviceModuleUrl}?remote-contract=${Date.now()}`);
const remoteResult = await remoteService.getContentListRemote('place');

assert(remoteResult.source === 'supabase', 'Configured client should report Supabase as the source');
assert(remoteResult.data.length === 1, 'Remote list should return mapped rows');
assert(remoteResult.data[0].id === 'remote-place', 'Remote rows should map slug to id');
assert(calls.length > 0, 'Remote list should issue a Supabase request');
assert(calls[0].url.includes('published=eq.true'), 'Remote public queries must request published content only');
assert(calls[0].url.includes('type=eq.place'), 'Remote queries must scope content by type');

globalThis.fetch = originalFetch;

console.log('contentService local and remote contract checks passed');
