import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('./authService.js', import.meta.url), 'utf8');

assert.match(source, /signInWithPassword\(\{\s*email:\s*normalizedEmail,\s*password,\s*\}\)/);
assert.match(source, /supabase\.rpc\('is_admin'\)/);
assert.match(source, /clearUnauthorizedSession/);
assert.match(source, /await supabase\?\.auth\.signOut\(\)/);
assert.match(source, /This account does not have administrator access/);
assert.match(source, /Unable to verify administrator access/);

console.log('Auth service contract checks passed.');
