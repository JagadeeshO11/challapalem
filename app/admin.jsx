import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Stack, router } from 'expo-router';
import { approveSubmission, listPendingSubmissions, rejectSubmission } from '../src/services/moderationService.js';
import { getAdminSession, signInAdmin, signOutAdmin } from '../src/services/authService.js';
import { theme } from '../src/theme';

const PAGE_SIZE = 50;
const typeLabels = { place: 'Place', event: 'Event', business: 'Business', community: 'Community' };

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

export default function AdminScreen() {
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [busy, setBusy] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [queueError, setQueueError] = useState('');
  const [actionId, setActionId] = useState(null);
  const [queueOffset, setQueueOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadQueue = useCallback(async ({ append = false, offset = 0 } = {}) => {
    setQueueError('');
    const result = await listPendingSubmissions({ limit: PAGE_SIZE, offset });
    if (result.error) {
      setQueueError(result.error.message);
      return false;
    }
    const page = result.data ?? [];
    setSubmissions((current) => (append ? [...current, ...page] : page));
    setQueueOffset(offset + page.length);
    setHasMore(page.length === PAGE_SIZE);
    return true;
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      const result = await getAdminSession();
      if (!active) return;
      setSession(result.data);
      setChecking(false);
      if (result.error && result.data === null) setLoginError(result.error.message);
      if (result.data) await loadQueue({ offset: 0 });
    })();
    return () => { active = false; };
  }, [loadQueue]);

  const handleLogin = async () => {
    setLoginError('');
    setBusy(true);
    const result = await signInAdmin(email, password);
    setBusy(false);
    if (result.error) {
      setLoginError(result.error.message);
      return;
    }
    setSession(result.data?.session ?? result.data ?? true);
    setPassword('');
    await loadQueue({ offset: 0 });
  };

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    await loadQueue({ append: true, offset: queueOffset });
    setLoadingMore(false);
  };

  const handleRefresh = async () => {
    await loadQueue({ offset: 0 });
  };

  const handleModeration = async (id, action) => {
    setActionId(id);
    setQueueError('');
    const result = action === 'approve' ? await approveSubmission(id) : await rejectSubmission(id);
    setActionId(null);
    if (result.error) {
      setQueueError(result.error.message);
      return;
    }
    setSubmissions((current) => current.filter((item) => item.id !== id));
  };

  const handleSignOut = async () => {
    await signOutAdmin();
    setSession(null);
    setSubmissions([]);
    setQueueOffset(0);
    setHasMore(false);
  };

  if (checking) {
    return <View style={styles.center}><ActivityIndicator color={theme.colors.primary} /></View>;
  }

  if (!session) {
    return (
      <ScrollView contentContainerStyle={styles.loginContainer} keyboardShouldPersistTaps="handled">
        <Stack.Screen options={{ headerShown: false }} />
        <Pressable onPress={() => router.back()} style={styles.back}><Text style={styles.backText}>← Back</Text></Pressable>
        <Text style={styles.eyebrow}>ADMIN</Text>
        <Text style={styles.title}>Challapalle moderation</Text>
        <Text style={styles.description}>Sign in with an approved administrator account to review community submissions.</Text>
        <Text style={styles.label}>Email</Text>
        <TextInput autoCapitalize="none" autoComplete="email" keyboardType="email-address" value={email} onChangeText={setEmail} placeholder="admin@example.com" placeholderTextColor={theme.colors.muted} style={styles.input} />
        <Text style={styles.label}>Password</Text>
        <TextInput secureTextEntry value={password} onChangeText={setPassword} placeholder="Password" placeholderTextColor={theme.colors.muted} style={styles.input} />
        {loginError ? <Text style={styles.error}>{loginError}</Text> : null}
        <Pressable disabled={busy} onPress={handleLogin} style={[styles.primaryButton, busy && styles.disabled]}>
          {busy ? <ActivityIndicator color={theme.colors.inverse} /> : <Text style={styles.primaryText}>Sign in</Text>}
        </Pressable>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.headerRow}>
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>ADMIN</Text>
          <Text style={styles.title}>Moderation queue</Text>
          <Text style={styles.description}>Review pending community suggestions before they become public.</Text>
        </View>
        <Pressable onPress={handleSignOut} style={styles.signOut}><Text style={styles.signOutText}>Sign out</Text></Pressable>
      </View>

      {queueError ? <Text style={styles.error}>{queueError}</Text> : null}
      <Pressable onPress={handleRefresh} style={styles.refresh}><Text style={styles.refreshText}>Refresh queue</Text></Pressable>

      {submissions.length === 0 ? (
        <View style={styles.empty}><Text style={styles.emptyTitle}>No pending submissions</Text><Text style={styles.emptyText}>The moderation queue is clear.</Text></View>
      ) : submissions.map((item) => (
        <View key={item.id} style={styles.card}>
          <View style={styles.badge}><Text style={styles.badgeText}>{typeLabels[item.type] ?? item.type}</Text></View>
          <Text style={styles.cardTitle}>{item.title}</Text>
          {item.category ? <Text style={styles.category}>{item.category}</Text> : null}
          <Text style={styles.cardText}>{item.description}</Text>
          {item.details ? <Text style={styles.detail}>{item.details}</Text> : null}
          {item.date_text ? <Text style={styles.meta}>Date / timing: {item.date_text}</Text> : null}
          <Text style={styles.meta}>Submitted {formatDate(item.created_at)}</Text>
          <View style={styles.actions}>
            <Pressable disabled={actionId === item.id} onPress={() => handleModeration(item.id, 'reject')} style={[styles.rejectButton, actionId === item.id && styles.disabled]}>
              <Text style={styles.rejectText}>Reject</Text>
            </Pressable>
            <Pressable disabled={actionId === item.id} onPress={() => handleModeration(item.id, 'approve')} style={[styles.approveButton, actionId === item.id && styles.disabled]}>
              {actionId === item.id ? <ActivityIndicator color={theme.colors.inverse} /> : <Text style={styles.approveText}>Approve & publish</Text>}
            </Pressable>
          </View>
        </View>
      ))}

      {hasMore ? (
        <Pressable disabled={loadingMore} onPress={handleLoadMore} style={[styles.loadMore, loadingMore && styles.disabled]}>
          {loadingMore ? <ActivityIndicator color={theme.colors.primary} /> : <Text style={styles.loadMoreText}>Load more submissions</Text>}
        </Pressable>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background },
  loginContainer: { padding: theme.spacing.lg, paddingTop: 56, maxWidth: 620, width: '100%', alignSelf: 'center' },
  container: { padding: theme.spacing.lg, paddingTop: 44, maxWidth: 900, width: '100%', alignSelf: 'center' },
  back: { alignSelf: 'flex-start', marginBottom: 24, padding: 6 },
  backText: { color: theme.colors.primary, fontWeight: '800' },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 18 },
  headerCopy: { flex: 1 },
  eyebrow: { color: theme.colors.accent, fontWeight: '900', letterSpacing: 1.6, fontSize: 12, marginBottom: 6 },
  title: { color: theme.colors.primaryDark, fontWeight: '900', fontSize: 34, lineHeight: 40, marginBottom: 8 },
  description: { color: theme.colors.muted, fontSize: 16, lineHeight: 24, marginBottom: 18 },
  label: { color: theme.colors.primaryDark, fontWeight: '800', fontSize: 14, marginTop: 12, marginBottom: 7 },
  input: { minHeight: 50, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.md, backgroundColor: theme.colors.surface, paddingHorizontal: 14, color: theme.colors.primaryDark, fontSize: 15 },
  primaryButton: { minHeight: 52, borderRadius: theme.radius.md, backgroundColor: theme.colors.primary, alignItems: 'center', justifyContent: 'center', marginTop: 18 },
  primaryText: { color: theme.colors.inverse, fontWeight: '900', fontSize: 16 },
  error: { color: '#B64A3A', backgroundColor: '#FBEDEA', padding: 12, borderRadius: theme.radius.sm, marginTop: 10 },
  disabled: { opacity: 0.65 },
  signOut: { borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.pill, paddingHorizontal: 14, paddingVertical: 9 },
  signOutText: { color: theme.colors.primaryDark, fontWeight: '800' },
  refresh: { alignSelf: 'flex-start', borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.pill, paddingHorizontal: 14, paddingVertical: 9, marginBottom: 14 },
  refreshText: { color: theme.colors.primaryDark, fontWeight: '800' },
  empty: { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.md, padding: 22 },
  emptyTitle: { color: theme.colors.primaryDark, fontWeight: '900', fontSize: 18 },
  emptyText: { color: theme.colors.muted, marginTop: 5 },
  card: { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.md, padding: 18, marginBottom: 14 },
  badge: { alignSelf: 'flex-start', backgroundColor: theme.colors.background, borderRadius: theme.radius.pill, paddingHorizontal: 10, paddingVertical: 5, marginBottom: 10 },
  badgeText: { color: theme.colors.primary, fontWeight: '800', fontSize: 12 },
  cardTitle: { color: theme.colors.primaryDark, fontWeight: '900', fontSize: 21, marginBottom: 4 },
  category: { color: theme.colors.accent, fontWeight: '800', marginBottom: 10 },
  cardText: { color: theme.colors.primaryDark, fontSize: 15, lineHeight: 23 },
  detail: { color: theme.colors.muted, fontSize: 14, lineHeight: 21, marginTop: 10 },
  meta: { color: theme.colors.muted, fontSize: 12, marginTop: 10 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 18 },
  rejectButton: { flex: 1, minHeight: 48, borderWidth: 1, borderColor: '#D7A39A', borderRadius: theme.radius.md, alignItems: 'center', justifyContent: 'center' },
  rejectText: { color: '#9B3D30', fontWeight: '900' },
  approveButton: { flex: 1, minHeight: 48, borderRadius: theme.radius.md, backgroundColor: theme.colors.primary, alignItems: 'center', justifyContent: 'center' },
  approveText: { color: theme.colors.inverse, fontWeight: '900' },
  loadMore: { minHeight: 50, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.md, alignItems: 'center', justifyContent: 'center', marginTop: 2, marginBottom: 24 },
  loadMoreText: { color: theme.colors.primary, fontWeight: '900' },
});
