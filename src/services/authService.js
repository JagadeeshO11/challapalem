import { isSupabaseConfigured, supabase } from '../lib/supabase.js';

function unavailable(message) {
  return { data: null, error: new Error(message) };
}

async function clearUnauthorizedSession(message) {
  try {
    await supabase?.auth.signOut();
  } catch {
    // Keep the authorization error even if local session cleanup fails.
  }
  return unavailable(message);
}

export async function signInAdmin(email, password) {
  const normalizedEmail = String(email ?? '').trim().toLowerCase();
  if (!normalizedEmail || !password) {
    return unavailable('Email and password are required.');
  }

  if (!isSupabaseConfigured || !supabase) {
    return unavailable('Online admin access is not configured yet.');
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (error) return { data: null, error };

    const { data: adminData, error: adminError } = await supabase.rpc('is_admin');
    if (adminError) {
      return clearUnauthorizedSession('Unable to verify administrator access.');
    }

    if (!adminData) {
      return clearUnauthorizedSession('This account does not have administrator access.');
    }

    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unable to sign in as administrator.'),
    };
  }
}

export async function getAdminSession() {
  if (!isSupabaseConfigured || !supabase) return unavailable('Online admin access is not configured yet.');

  try {
    const { data: sessionData, error } = await supabase.auth.getSession();
    if (error) return { data: null, error };
    if (!sessionData.session) return { data: null, error: null };

    const { data: adminData, error: adminError } = await supabase.rpc('is_admin');
    if (adminError) {
      return clearUnauthorizedSession('Unable to verify administrator access.');
    }
    if (!adminData) {
      return clearUnauthorizedSession('This account does not have administrator access.');
    }

    return { data: sessionData.session, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unable to verify administrator session.'),
    };
  }
}

export async function signOutAdmin() {
  if (!isSupabaseConfigured || !supabase) return unavailable('Online admin access is not configured yet.');

  try {
    const { error } = await supabase.auth.signOut();
    return { data: null, error: error ?? null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unable to sign out.'),
    };
  }
}
