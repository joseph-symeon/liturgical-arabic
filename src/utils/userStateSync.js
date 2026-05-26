import { getSupabaseClient, isSupabaseConfigured } from './supabaseClient.js';
import {
  clearStoredPreviewPhraseProgress,
  getStoredPreviewPhraseProgress,
  getStoredPhraseProgress,
  mergePhraseProgress,
  replaceStoredPhraseProgress
} from './progressScoring.js';

const USER_STATE_TABLE = 'user_state';
const PENDING_PROGRESS_SYNC_KEY_PREFIX = 'liturgical-arabic:pending-progress-sync:v1:';

function getEmptyUserState(userId) {
  return {
    user_id: userId,
    progress: {
      version: 2,
      phrases: {}
    },
    preferences: {},
    updated_at: null
  };
}

export function canSyncUserState() {
  return isSupabaseConfigured();
}

export async function getCurrentSession() {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export function subscribeToAuthChanges(callback) {
  const supabase = getSupabaseClient();
  if (!supabase) return () => {};
  const { data } = supabase.auth.onAuthStateChange((_event, session) => callback(session));
  return () => data.subscription.unsubscribe();
}

export async function signInWithEmail(email) {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error('Supabase is not configured.');
  const redirectTo = typeof window === 'undefined'
    ? undefined
    : `${window.location.origin}${window.location.pathname}`;
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectTo
    }
  });
  if (error) throw error;
}

export async function signInWithPassword({ email, password }) {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error('Supabase is not configured.');
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) throw error;
}

export async function signUpWithPassword({ email, password }) {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error('Supabase is not configured.');
  const redirectTo = typeof window === 'undefined'
    ? undefined
    : `${window.location.origin}${window.location.pathname}`;
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectTo
    }
  });
  if (error) throw error;
  return data;
}

export async function sendPasswordReset(email) {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error('Supabase is not configured.');
  const redirectTo = typeof window === 'undefined'
    ? undefined
    : `${window.location.origin}${window.location.pathname}`;
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo
  });
  if (error) throw error;
}

export async function updatePassword(password) {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error('Supabase is not configured.');
  const { error } = await supabase.auth.updateUser({
    password
  });
  if (error) throw error;
}

export async function signOut() {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function fetchRemoteUserState(userId) {
  const supabase = getSupabaseClient();
  if (!supabase || !userId) return null;

  const { data, error } = await supabase
    .from(USER_STATE_TABLE)
    .select('user_id, progress, preferences, updated_at')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data || getEmptyUserState(userId);
}

export async function saveRemoteUserState({ userId, progress, preferences }) {
  const supabase = getSupabaseClient();
  if (!supabase || !userId) return null;

  const { data, error } = await supabase
    .from(USER_STATE_TABLE)
    .upsert({
      user_id: userId,
      progress,
      preferences,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id'
    })
    .select('user_id, progress, preferences, updated_at')
    .single();

  if (error) throw error;
  return data;
}

function getPendingProgressSyncKey(userId) {
  return `${PENDING_PROGRESS_SYNC_KEY_PREFIX}${userId}`;
}

export function hasPendingProgressSync(userId) {
  if (typeof window === 'undefined' || !userId) return false;
  return window.localStorage.getItem(getPendingProgressSyncKey(userId)) === 'true';
}

export function markPendingProgressSync(userId) {
  if (typeof window === 'undefined' || !userId) return;
  window.localStorage.setItem(getPendingProgressSyncKey(userId), 'true');
}

export function clearPendingProgressSync(userId) {
  if (typeof window === 'undefined' || !userId) return;
  window.localStorage.removeItem(getPendingProgressSyncKey(userId));
}

export function replaceRemoteProgressIntoLocal(remoteProgress) {
  return replaceStoredPhraseProgress(remoteProgress);
}

export function mergePendingLocalProgressIntoRemote(remoteProgress) {
  const mergedProgress = mergePhraseProgress(remoteProgress, getStoredPhraseProgress());
  return replaceStoredPhraseProgress(mergedProgress);
}

export function mergePreviewProgressIntoRemote(remoteProgress) {
  const mergedProgress = mergePhraseProgress(remoteProgress, getStoredPreviewPhraseProgress());
  return replaceStoredPhraseProgress(mergedProgress);
}

export function clearPreviewProgress() {
  clearStoredPreviewPhraseProgress();
}
