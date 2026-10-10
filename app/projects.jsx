import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, router } from 'expo-router';
import { getVillageProjects, getProjectProgress, formatProjectCurrency, projectStatuses } from '../src/services/projectService.js';
import { isSupabaseConfigured } from '../src/lib/supabase.js';
import { theme } from '../src/theme';

const filters = [
  { value: 'all', label: 'All projects' },
  { value: 'planned', label: 'Planned' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'on_hold', label: 'On hold' },
];

function formatDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function ProjectCard({ project }) {
  const progress = getProjectProgress(project);
  const status = projectStatuses[project.status] ?? project.status;
  const spent = Number(project.spent_amount ?? 0);
  const budget = Number(project.target_budget ?? 0);
  const overBudget = budget > 0 && spent > budget;

  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.categoryPill}><Text style={styles.categoryText}>{project.category}</Text></View>
        <View style={[styles.statusPill, project.status === 'completed' && styles.completedPill]}><Text style={styles.statusText}>{status}</Text></View>
      </View>
      <Text style={styles.projectTitle}>{project.title}</Text>
      <Text style={styles.description}>{project.description}</Text>
      {project.location ? <Text style={styles.meta}>⌖  {project.location}</Text> : null}
      {(project.start_date || project.target_date) ? (
        <Text style={styles.meta}>
          {project.start_date ? 'Started ' + formatDate(project.start_date) : 'Start date not set'}
          {project.target_date ? '  ·  Target ' + formatDate(project.target_date) : ''}
        </Text>
      ) : null}
      <View style={styles.budgetRow}>
        <View style={styles.budgetColumn}><Text style={styles.budgetLabel}>Budget target</Text><Text style={styles.budgetValue}>{formatProjectCurrency(budget)}</Text></View>
        <View style={styles.budgetColumn}><Text style={styles.budgetLabel}>Reported spent</Text><Text style={[styles.budgetValue, overBudget && styles.overBudget]}>{formatProjectCurrency(spent)}</Text></View>
      </View>
      <View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: progress }} accessibilityLabel={project.title + ' reported expenditure'}>
        <View style={styles.progressTrack}><View style={[styles.progressFill, { width: progress + '%' }]} /></View>
      </View>
      <Text style={styles.progressCaption}>
        {budget > 0 ? progress + '% of budget reported as spent' : 'Budget target not set'}{overBudget ? ' · Over target' : ''}
      </Text>
      {project.details ? <Text style={styles.details}>{project.details}</Text> : null}
      {project.updated_at ? <Text style={styles.updated}>Report updated {formatDate(project.updated_at)}</Text> : null}
    </View>
  );
}

export default function VillageProjectsScreen() {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadProjects = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true);
    else setLoading(true);
    setError('');
    try {
      const result = await getVillageProjects();
      setProjects(result.data ?? []);
      if (result.error) setError('Live project information could not be loaded. Please try again.');
    } catch {
      setError('We could not load project information. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadProjects(); }, [loadProjects]);

  const visibleProjects = useMemo(
    () => filter === 'all' ? projects : projects.filter((project) => project.status === filter),
    [filter, projects],
  );

  const totals = useMemo(() => projects.reduce((result, project) => ({
    budget: result.budget + Number(project.target_budget ?? 0),
    spent: result.spent + Number(project.spent_amount ?? 0),
  }), { budget: 0, spent: 0 }), [projects]);

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.page}>
      <Stack.Screen options={{ title: 'Village development projects', headerShown: false }} />
      <Pressable onPress={() => router.back()} style={styles.back} accessibilityRole="button"><Text style={styles.backText}>← Back</Text></Pressable>

      <View style={styles.hero}>
        <Text style={styles.eyebrow}>OUR VILLAGE · OUR SHARED FUTURE</Text>
        <Text style={styles.title}>Village development projects</Text>
        <Text style={styles.heroText}>Follow local initiatives, understand their goals and review published budgets and expenditure reports.</Text>
        <View style={styles.notice}>
          <Text style={styles.noticeTitle}>Transparency first</Text>
          <Text style={styles.noticeText}>Figures shown here are project reports, not live bank balances. Each project should be supported by verified records and an accountable project owner.</Text>
        </View>
      </View>

      <View style={styles.summary}>
        <View style={styles.summaryItem}><Text style={styles.summaryLabel}>Published projects</Text><Text style={styles.summaryValue}>{projects.length}</Text></View>
        <View style={styles.summaryItem}><Text style={styles.summaryLabel}>Combined budget</Text><Text style={styles.summaryValue}>{formatProjectCurrency(totals.budget)}</Text></View>
        <View style={styles.summaryItem}><Text style={styles.summaryLabel}>Reported spent</Text><Text style={styles.summaryValue}>{formatProjectCurrency(totals.spent)}</Text></View>
      </View>

      <View style={styles.sectionHeader}>
        <View style={styles.sectionCopy}><Text style={styles.sectionTitle}>Project register</Text><Text style={styles.sectionSubtitle}>Only published projects appear here.</Text></View>
        <Pressable onPress={() => loadProjects(true)} disabled={refreshing} style={styles.refreshButton} accessibilityRole="button"><Text style={styles.refreshText}>{refreshing ? 'Refreshing…' : 'Refresh'}</Text></Pressable>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
        {filters.map((item) => (
          <Pressable key={item.value} onPress={() => setFilter(item.value)} style={[styles.filter, filter === item.value && styles.filterActive]} accessibilityRole="button" accessibilityState={{ selected: filter === item.value }}>
            <Text style={[styles.filterText, filter === item.value && styles.filterTextActive]}>{item.label}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {loading ? (
        <View style={styles.loading}><ActivityIndicator size="large" color={theme.colors.primary} /><Text style={styles.loadingText}>Loading project register…</Text></View>
      ) : visibleProjects.length ? (
        <View style={styles.projectList}>{visibleProjects.map((project) => <ProjectCard key={project.id} project={project} />)}</View>
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🌱</Text>
          <Text style={styles.emptyTitle}>{filter === 'all' ? 'No published projects yet' : 'No ' + (projectStatuses[filter]?.toLowerCase() ?? '') + ' projects'}</Text>
          <Text style={styles.emptyText}>
            {isSupabaseConfigured
              ? 'When an authorized administrator publishes a verified village initiative, its goals, budget and progress will appear here.'
              : 'The project register is ready, but Supabase is not configured in this environment yet. Configure the public Supabase URL and publishable key, then apply the village projects migration.'}
          </Text>
          {!isSupabaseConfigured ? <Text style={styles.setupNote}>No sample budgets or fundraising claims are displayed.</Text> : null}
        </View>
      )}

      <View style={styles.footerNote}>
        <Text style={styles.footerTitle}>Have a project to suggest?</Text>
        <Text style={styles.footerText}>Share a community idea through the existing submission process. Suggestions are reviewed before publication.</Text>
        <Pressable onPress={() => router.push('/submit')} style={styles.suggestButton} accessibilityRole="button"><Text style={styles.suggestText}>Suggest a community initiative →</Text></Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.background },
  page: { paddingBottom: 48 },
  back: { alignSelf: 'flex-start', marginTop: 20, marginHorizontal: 22, paddingVertical: 8, paddingHorizontal: 4 },
  backText: { color: theme.colors.primary, fontWeight: '800', fontSize: 15 },
  hero: { paddingHorizontal: 22, paddingTop: 18, paddingBottom: 30, maxWidth: 1120, width: '100%', alignSelf: 'center' },
  eyebrow: { color: theme.colors.accent, fontWeight: '900', letterSpacing: 1.7, fontSize: 11, marginBottom: 10 },
  title: { color: theme.colors.primaryDark, fontWeight: '900', fontSize: 36, lineHeight: 43, maxWidth: 760 },
  heroText: { color: theme.colors.muted, fontSize: 16, lineHeight: 25, maxWidth: 760, marginTop: 14 },
  notice: { backgroundColor: '#EDF3E6', borderLeftWidth: 4, borderLeftColor: theme.colors.primary, borderRadius: theme.radius.md, padding: 16, marginTop: 24 },
  noticeTitle: { color: theme.colors.primaryDark, fontSize: 15, fontWeight: '900' },
  noticeText: { color: '#49624F', fontSize: 13, lineHeight: 20, marginTop: 5 },
  summary: { marginHorizontal: 18, padding: 18, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.lg, backgroundColor: theme.colors.surface, flexDirection: 'row', flexWrap: 'wrap', gap: 18 },
  summaryItem: { flex: 1, minWidth: 90 },
  summaryLabel: { color: theme.colors.muted, fontSize: 12, fontWeight: '700' },
  summaryValue: { color: theme.colors.primaryDark, fontSize: 19, fontWeight: '900', marginTop: 6 },
  sectionHeader: { maxWidth: 1120, width: '100%', alignSelf: 'center', paddingHorizontal: 22, marginTop: 36, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  sectionCopy: { flex: 1 },
  sectionTitle: { color: theme.colors.primaryDark, fontSize: 24, fontWeight: '900' },
  sectionSubtitle: { color: theme.colors.muted, fontSize: 13, marginTop: 4 },
  refreshButton: { borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.pill, paddingHorizontal: 15, paddingVertical: 10 },
  refreshText: { color: theme.colors.primary, fontWeight: '800' },
  filters: { paddingHorizontal: 22, paddingVertical: 18, gap: 8 },
  filter: { borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.pill, paddingHorizontal: 14, paddingVertical: 10, backgroundColor: theme.colors.surface },
  filterActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  filterText: { color: theme.colors.primaryDark, fontSize: 13, fontWeight: '700' },
  filterTextActive: { color: theme.colors.inverse },
  projectList: { maxWidth: 1120, width: '100%', alignSelf: 'center', paddingHorizontal: 18, gap: 14 },
  card: { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.lg, padding: 20 },
  cardTop: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  categoryPill: { backgroundColor: '#EDF3E6', borderRadius: theme.radius.pill, paddingHorizontal: 11, paddingVertical: 6 },
  categoryText: { color: theme.colors.primary, fontSize: 12, fontWeight: '800' },
  statusPill: { backgroundColor: '#F5EEDB', borderRadius: theme.radius.pill, paddingHorizontal: 11, paddingVertical: 6 },
  completedPill: { backgroundColor: '#E2F1E5' },
  statusText: { color: theme.colors.primaryDark, fontSize: 12, fontWeight: '800' },
  projectTitle: { color: theme.colors.primaryDark, fontSize: 22, lineHeight: 28, fontWeight: '900', marginTop: 16 },
  description: { color: theme.colors.muted, fontSize: 15, lineHeight: 23, marginTop: 8 },
  meta: { color: theme.colors.muted, fontSize: 12, lineHeight: 18, marginTop: 8 },
  budgetRow: { flexDirection: 'row', gap: 18, marginTop: 22, marginBottom: 14 },
  budgetColumn: { flex: 1 },
  budgetLabel: { color: theme.colors.muted, fontSize: 12, fontWeight: '700' },
  budgetValue: { color: theme.colors.primaryDark, fontSize: 18, fontWeight: '900', marginTop: 5 },
  overBudget: { color: '#A23D32' },
  progressTrack: { height: 8, borderRadius: 99, overflow: 'hidden', backgroundColor: '#E8E9DF' },
  progressFill: { height: 8, borderRadius: 99, backgroundColor: theme.colors.primary },
  progressCaption: { color: theme.colors.muted, fontSize: 12, marginTop: 7 },
  details: { color: '#4F6253', fontSize: 14, lineHeight: 22, marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: theme.colors.border },
  updated: { color: theme.colors.muted, fontSize: 11, marginTop: 12 },
  loading: { alignItems: 'center', justifyContent: 'center', padding: 42, gap: 12 },
  loadingText: { color: theme.colors.muted, fontSize: 14 },
  empty: { marginHorizontal: 18, borderWidth: 1, borderColor: theme.colors.border, borderStyle: 'dashed', borderRadius: theme.radius.lg, padding: 28, alignItems: 'center', backgroundColor: theme.colors.surface },
  emptyIcon: { fontSize: 34 },
  emptyTitle: { color: theme.colors.primaryDark, fontSize: 20, fontWeight: '900', textAlign: 'center', marginTop: 10 },
  emptyText: { color: theme.colors.muted, fontSize: 14, lineHeight: 22, textAlign: 'center', maxWidth: 620, marginTop: 8 },
  setupNote: { color: theme.colors.accent, fontSize: 12, fontWeight: '800', textAlign: 'center', marginTop: 12 },
  error: { color: '#9B3D30', backgroundColor: '#FBEDEA', marginHorizontal: 18, padding: 12, borderRadius: theme.radius.sm },
  footerNote: { backgroundColor: '#E9F0E1', marginHorizontal: 18, marginTop: 28, padding: 22, borderRadius: theme.radius.lg },
  footerTitle: { color: theme.colors.primaryDark, fontSize: 18, fontWeight: '900' },
  footerText: { color: '#526652', fontSize: 14, lineHeight: 22, marginTop: 7 },
  suggestButton: { alignSelf: 'flex-start', backgroundColor: theme.colors.primary, borderRadius: theme.radius.pill, paddingHorizontal: 17, paddingVertical: 12, marginTop: 16 },
  suggestText: { color: theme.colors.inverse, fontSize: 13, fontWeight: '800' },
});
