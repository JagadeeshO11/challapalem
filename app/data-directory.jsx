import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { theme } from '../src/theme';
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

export default function DataDirectory({ title, eyebrow, description, items = [], detailType }) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return items;
    return items.filter((item) => `${item.title} ${item.category ?? ''} ${item.description}`.toLowerCase().includes(normalized));
  }, [items, query]);

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search this section..."
        placeholderTextColor="#899189"
        accessibilityLabel={`Search ${title}`}
        returnKeyType="search"
        style={styles.search}
      />
      <Text style={styles.resultCount}>{filtered.length} {filtered.length === 1 ? 'result' : 'results'}</Text>
      {filtered.length ? filtered.map((item) => (
        <FeatureCard
          key={item.id}
          icon={iconFor(item)}
          title={item.title}
          text={item.description}
          onPress={detailType ? () => router.push({ pathname: '/details', params: { key: item.id, type: detailType } }) : undefined}
        />
      )) : (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Nothing found</Text>
          <Text style={styles.emptyText}>Try a different search term.</Text>
        </View>
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
  search: { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.pill, paddingHorizontal: 18, paddingVertical: 13, fontSize: 15, color: theme.colors.primaryDark, marginBottom: 0 },
  resultCount: { color: theme.colors.muted, fontSize: 12, fontWeight: '700', marginLeft: 4, marginBottom: 2 },
  empty: { padding: 30, backgroundColor: theme.colors.surface, borderRadius: theme.radius.md, borderWidth: 1, borderColor: theme.colors.border },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: theme.colors.primaryDark },
  emptyText: { marginTop: 5, color: theme.colors.muted },
});
