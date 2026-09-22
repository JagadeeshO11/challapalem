import fs from 'node:fs';

const service = fs.readFileSync(new URL('./moderationService.js', import.meta.url), 'utf8');

const required = [
  "supabase.rpc(name, { p_submission_id: id })",
  "approve_content_submission",
  "reject_content_submission",
  ".from('content_submissions')",
  ".eq('status', 'pending')",
  ".order('created_at', { ascending: true })",
  '.range(pageOffset, pageOffset + pageSize - 1)',
  'DEFAULT_PAGE_SIZE = 50',
  'MAX_PAGE_SIZE = 100',
  'Number.isInteger(id)',
];

for (const fragment of required) {
  if (!service.includes(fragment)) {
    throw new Error(`Missing moderation service contract: ${fragment}`);
  }
}

console.log('Moderation service contract tests passed.');
