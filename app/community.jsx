import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import DataDirectory from './data-directory';
import { community } from '../src/data/content';
import { theme } from '../src/theme';

function SuggestCard() {
  return (
    <View style={styles.card}>
      <View style={styles.copy}>
        <Text style={styles.eyebrow}>YOUR CHALLAPALLE</Text>
        <Text style={styles.heading}>Know a place, event, or local initiative we should add?</Text>
        <Text style={styles.body}>Send it for review. Approved suggestions become part of the public directory.</Text>
      </View>
      <Pressable accessibilityRole="button" onPress={() => router.push('/submit')} style={styles.button}>
        <Text style={styles.buttonText}>Suggest content</Text>
      </Pressable>
    </View>
  );
}

export default function CommunityScreen() {
  return (
    <DataDirectory
      eyebrow="COMMUNITY"
      title="People are the heart of Challapalle."
      description="Connect residents, groups and local initiatives in one welcoming digital community."
      items={community}
      detailType="community"
      headerSlot={<SuggestCard />}
    />
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: theme.spacing.lg, padding: theme.spacing.lg, borderRadius: theme.radius.lg, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surface, gap: theme.spacing.md },
  copy: { gap: 5 },
  eyebrow: { color: theme.colors.accent, fontSize: 11, fontWeight: '900', letterSpacing: 1.2 },
  heading: { color: theme.colors.primaryDark, fontSize: 21, lineHeight: 27, fontWeight: '900' },
  body: { color: theme.colors.muted, fontSize: 14, lineHeight: 21 },
  button: { alignSelf: 'flex-start', backgroundColor: theme.colors.primary, borderRadius: theme.radius.pill, paddingHorizontal: 18, paddingVertical: 11 },
  buttonText: { color: theme.colors.inverse, fontWeight: '900' },
});
