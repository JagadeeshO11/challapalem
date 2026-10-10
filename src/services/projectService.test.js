import assert from 'node:assert/strict';
import { formatProjectCurrency, getProjectProgress, projectStatuses } from './projectService.js';

assert.equal(getProjectProgress({ target_budget: 1000, spent_amount: 250 }), 25);
assert.equal(getProjectProgress({ target_budget: 1000, spent_amount: 1200 }), 100);
assert.equal(getProjectProgress({ target_budget: 0, spent_amount: 250 }), 0);
assert.equal(getProjectProgress({ target_budget: -1, spent_amount: 250 }), 0);
assert.equal(getProjectProgress({ target_budget: 100, spent_amount: -2 }), 0);
assert.equal(getProjectProgress({ target_budget: 'not-a-number', spent_amount: 20 }), 0);
assert.match(formatProjectCurrency(125000), /1,25,000/);
assert.equal(formatProjectCurrency(Number.NaN), '₹0');
assert.deepEqual(projectStatuses, { planned: 'Planned', in_progress: 'In progress', completed: 'Completed', on_hold: 'On hold' });

console.log('village project service contract checks passed');
