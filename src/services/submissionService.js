import { isSupabaseConfigured, supabase } from '../lib/supabase.js';

export const submissionTypes = Object.freeze({
  place: 'place',
  event: 'event',
  business: 'business',
  community: 'community',
});

const MAX_TITLE_LENGTH = 160;
const MAX_CATEGORY_LENGTH = 80;
const MAX_DESCRIPTION_LENGTH = 1000;
const MAX_DETAILS_LENGTH = 5000;
const MAX_DATE_LENGTH = 120;

function clean(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export function validateSubmission(input = {}) {
  const type = clean(input.type).toLowerCase();
  const title = clean(input.title);
  const category = clean(input.category);
  const description = clean(input.description);
  const details = clean(input.details);
  const dateText = clean(input.dateText);
  const errors = {};

  if (!submissionTypes[type]) errors.type = 'Choose a valid submission type.';
  if (!title) errors.title = 'Title is required.';
  else if (title.length > MAX_TITLE_LENGTH) errors.title = `Title must be ${MAX_TITLE_LENGTH} characters or fewer.`;
  if (category.length > MAX_CATEGORY_LENGTH) errors.category = `Category must be ${MAX_CATEGORY_LENGTH} characters or fewer.`;
  if (!description) errors.description = 'Description is required.';
  else if (description.length > MAX_DESCRIPTION_LENGTH) errors.description = `Description must be ${MAX_DESCRIPTION_LENGTH} characters or fewer.`;
  if (details.length > MAX_DETAILS_LENGTH) errors.details = `Details must be ${MAX_DETAILS_LENGTH} characters or fewer.`;
  if (dateText.length > MAX_DATE_LENGTH) errors.dateText = `Date or timing must be ${MAX_DATE_LENGTH} characters or fewer.`;

  return { valid: Object.keys(errors).length === 0, errors };
}

export async function submitContent(input = {}) {
  const type = clean(input.type).toLowerCase();
  const title = clean(input.title);
  const category = clean(input.category);
  const description = clean(input.description);
  const details = clean(input.details);
  const dateText = clean(input.dateText);
  const validation = validateSubmission(input);

  if (!validation.valid) {
    return { data: null, error: new Error('Please correct the highlighted fields.'), validation };
  }

  if (!isSupabaseConfigured || !supabase) {
    return { data: null, error: new Error('Online submissions are not configured yet.'), validation };
  }

  try {
    const { data, error } = await supabase
      .from('content_submissions')
      .insert({
        type,
        title,
        category: category || null,
        description,
        details: details || null,
        date_text: dateText || null,
        status: 'pending',
      })
      .select('id, type, title, status, created_at')
      .single();

    return { data: data ?? null, error: error ?? null, validation };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error : new Error('Unable to submit this item right now.'), validation };
  }
}
