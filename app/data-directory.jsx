import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { theme } from '../src/theme';
import { searchContentRemote } from '../src/services/contentService';
import FeatureCard from '../src/components/FeatureCard';

const iconFor = (item) => {
  if (item.category === 'Nature') return '🌿';
  if (item.category === 'Heritage') return '🛕';
  if (item.category === 'Services') return '🧰';
  if (item.category === 'Shopping') return '🛍️';
  if (item.category === 'Stories') return '📖';
  if (item.category === 'Community') return '🤝';
  return '📍';
};

const routeFor = {
  place: '/explore/places',
  event: '/events',
  business: '/businesses',
  community: '/community',
};

export default function DataDirectory({ title, eyebrow, description, detailType }) {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const basePath = routeFor[detailType];

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setErrorMessage('');
      const result = await searchContentRemote(detailType, query);
      if (!active) return;
      setItems(result.data);
      if (result.error) {
        setErrorMessage('Showing saved local content while the online directory is unavailable.');
      }
      setLoading(false);
    };

    load();
    return () => { active = false; };
  }, [detailType, query]);

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <TextInput value={query} onChangeText={setQuery} placeholder="Search this section..." placeholderTextColor="#899189" accessibilityLabel={`Search ${title}`} returnKeyType="search" style={styles.search} />
      {errorMessage ? <Text style={styles.notice}>{errorMessage}</Text> : null}
      {loading ? (
        <View style={styles.loading}><ActivityIndicator color={theme.colors.primary} /><Text style={styles.loadingText}>Loading the directory...</Text></View>
      ) : (
        <>
          <Text style={styles.resultCount}>{items.length} {items.length === 1 ? 'result' : 'results'}</Text>
          {items.length ? items.map((item) => (
            <FeatureCard key={item.id} icon={iconFor(item)} title={item.title} text={item.description} onPress={basePath ? () => router.push({ pathname: `${basePath}/[id]`, params: { id: item.id } }) : undefined} />
          )) : (
            <View style={styles.empty}><Text style={styles.emptyTitle}>Nothing found</Text><Text style={styles.emptyText}>Try a different search term.</Text></View>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.background },
  page: { padding: 24, gap: 14, maxWidth: 1000, width: '100%', alignSelf: 'center' },
  eyebrow: { color: theme.colors.accent, fontSize: 11, fontWeight: '900', letterSpacing: 2, marginTop: 20 },
  title: { color: theme.colors.primaryDark, fontSize: 42, fontWeight: '900' },
  description: { color: theme.colors.muted, fontSize: 16, lineHeight: 25, marginBottom: 10 },
  search: { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.pill, paddingHorizontal: 18, paddingVertical: 13, fontSize: 15, color: theme.colors.primaryDark },
  notice: { color: theme.colors.muted, fontSize: 12, lineHeight: 18, backgroundColor: theme.colors.surface, borderRadius: 12, padding: 12 },
  loading: { padding: 30, alignItems: 'center', gap: 10 },
  loadingText: { color: theme.colors.muted },
  resultCount: { color: theme.colors.muted, fontSize: 12, fontWeight: '700', marginLeft: 4, marginBottom: 2 },
  empty: { padding: 30, backgroundColor: theme.colors.surface, borderRadius: theme.radius.md, borderWidth: 1, borderColor: theme.colors.border },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: theme.colors.primaryDark },
  emptyText: { marginTop: 5, color: theme.colors.muted },
});
