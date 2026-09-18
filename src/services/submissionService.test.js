import assert from 'node:assert/strict';
import { validateSubmission } from './submissionService.js';

const base = {
  type: 'business',
  title: 'Sri Lakshmi Bakery',
  category: 'Food',
  description: 'A local bakery serving fresh snacks and bread.',
  details: 'Near the main road',
  dateText: '',
};

const valid = validateSubmission(base);
assert.equal(valid.valid, true);
assert.deepEqual(valid.errors, {});

assert.equal(validateSubmission({ ...base, type: 'unknown' }).valid, false);
assert.match(validateSubmission({ ...base, type: 'unknown' }).errors.type, /valid submission type/i);
assert.match(validateSubmission({ ...base, title: ' ' }).errors.title, /required/i);
assert.match(validateSubmission({ ...base, title: 'x'.repeat(161) }).errors.title, /160/);
assert.match(validateSubmission({ ...base, category: 'x'.repeat(81) }).errors.category, /80/);
assert.match(validateSubmission({ ...base, description: ' ' }).errors.description, /required/i);
assert.match(validateSubmission({ ...base, description: 'x'.repeat(1001) }).errors.description, /1000/);
assert.match(validateSubmission({ ...base, details: 'x'.repeat(5001) }).errors.details, /5000/);
assert.match(validateSubmission({ ...base, dateText: 'x'.repeat(121) }).errors.dateText, /120/);
assert.equal(validateSubmission({ ...base, title: '  Bakery  ' }).valid, true);

console.log('submission service contract tests passed');
