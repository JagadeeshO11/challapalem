import { isSupabaseConfigured, supabase } from '../lib/supabase.js';

export const projectStatuses = Object.freeze({
  planned: 'Planned',
  in_progress: 'In progress',
  completed: 'Completed',
  on_hold: 'On hold',
});

const projectFields = 'id, slug, title, category, description, details, location, target_budget, spent_amount, status, start_date, target_date, published, created_at, updated_at';

export function getProjectProgress(project = {}) {
  const target = Number(project.target_budget ?? 0);
  const spent = Number(project.spent_amount ?? 0);
  if (!Number.isFinite(target) || !Number.isFinite(spent) || target <= 0 || spent <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((spent / target) * 100)));
}

export function formatProjectCurrency(value) {
  const amount = Number(value ?? 0);
  if (!Number.isFinite(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

function mapProject(row) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category ?? 'Community',
    description: row.description,
    details: row.details ?? null,
    location: row.location ?? null,
    target_budget: Number(row.target_budget ?? 0),
    spent_amount: Number(row.spent_amount ?? 0),
    status: row.status,
    start_date: row.start_date ?? null,
    target_date: row.target_date ?? null,
    updated_at: row.updated_at ?? null,
  };
}

export async function getVillageProjects() {
  if (!isSupabaseConfigured || !supabase) return { data: [], error: null, source: 'unconfigured' };
  try {
    const { data, error } = await supabase
      .from('village_projects')
      .select(projectFields)
      .eq('published', true)
      .order('created_at', { ascending: false });
    if (error) return { data: [], error, source: 'supabase-error' };
    return { data: (data ?? []).map(mapProject), error: null, source: 'supabase' };
  } catch (error) {
    return { data: [], error: error instanceof Error ? error : new Error('Unable to load village projects.'), source: 'supabase-error' };
  }
}
