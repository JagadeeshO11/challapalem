import { isSupabaseConfigured, supabase } from '../lib/supabase.js';

const DEFAULT_PAGE_SIZE = 50;
const MAX_PAGE_SIZE = 100;

function unavailable(message) {
  return { data: null, error: new Error(message) };
}

async function callModerationRpc(name, submissionId) {
  const id = Number(submissionId);
  if (!Number.isInteger(id) || id <= 0) {
    return unavailable('A valid submission id is required.');
  }

  if (!isSupabaseConfigured || !supabase) {
    return unavailable('Online moderation is not configured yet.');
  }

  try {
    const { data, error } = await supabase.rpc(name, { p_submission_id: id });
    return { data: data ?? null, error: error ?? null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unable to complete moderation action.'),
    };
  }
}

export async function approveSubmission(submissionId) {
  return callModerationRpc('approve_content_submission', submissionId);
}

export async function rejectSubmission(submissionId) {
  return callModerationRpc('reject_content_submission', submissionId);
}

export async function listPendingSubmissions({ limit = DEFAULT_PAGE_SIZE, offset = 0 } = {}) {
  const pageSize = Number(limit);
  const pageOffset = Number(offset);

  if (!Number.isInteger(pageSize) || pageSize <= 0 || pageSize > MAX_PAGE_SIZE) {
    return unavailable(`Moderation page size must be between 1 and ${MAX_PAGE_SIZE}.`);
  }
  if (!Number.isInteger(pageOffset) || pageOffset < 0) {
    return unavailable('Moderation page offset must be a non-negative integer.');
  }

  if (!isSupabaseConfigured || !supabase) {
    return unavailable('Online moderation is not configured yet.');
  }

  try {
    const { data, error } = await supabase
      .from('content_submissions')
      .select('id, type, title, category, description, details, date_text, status, created_at, updated_at')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .range(pageOffset, pageOffset + pageSize - 1);

    return { data: data ?? [], error: error ?? null };
  } catch (error) {
    return {
      data: [],
      error: error instanceof Error ? error : new Error('Unable to load pending submissions.'),
    };
  }
}
