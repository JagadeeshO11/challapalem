import {
  getContentById,
  getContentCollection,
  getContentList,
  searchContent,
} from './contentService';

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

console.log('contentService local contract checks passed');
