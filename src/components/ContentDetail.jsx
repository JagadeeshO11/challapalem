import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { theme } from '../theme';

export default function ContentDetail({ item, eyebrow = 'DETAIL', notice = '' }) {
  if (!item) {
    return (
      <View style={styles.center}>
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        <Text style={styles.title}>We couldn’t find that item.</Text>
        <Text style={styles.description}>The page may have moved or the item may no longer be available.</Text>
        <Pressable onPress={() => router.back()} style={styles.button} accessibilityRole="button">
          <Text style={styles.buttonText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.page}>
      <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Go back">
        <Text style={styles.back}>← Back</Text>
      </Pressable>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.title}>{item.title}</Text>
      {item.category ? <Text style={styles.category}>{item.category}</Text> : null}
      {item.date ? <Text style={styles.date}>{item.date}</Text> : null}
      {notice ? <Text style={styles.notice}>{notice}</Text> : null}
      <Text style={styles.description}>{item.description}</Text>
      {item.details ? <Text style={styles.body}>{item.details}</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.background },
  page: { padding: 24, maxWidth: 900, width: '100%', alignSelf: 'center', paddingBottom: 60 },
  center: { flex: 1, backgroundColor: theme.colors.background, padding: 28, justifyContent: 'center', alignItems: 'flex-start' },
  back: { color: theme.colors.primary, fontSize: 15, fontWeight: '800', marginBottom: 38 },
  eyebrow: { color: theme.colors.accent, fontSize: 11, fontWeight: '900', letterSpacing: 2, marginBottom: 10 },
  title: { color: theme.colors.primaryDark, fontSize: 42, lineHeight: 48, fontWeight: '900', marginBottom: 10 },
  category: { alignSelf: 'flex-start', color: theme.colors.primary, backgroundColor: theme.colors.surface, borderRadius: theme.radius.pill, paddingHorizontal: 13, paddingVertical: 7, fontSize: 13, fontWeight: '800', marginBottom: 12 },
  date: { color: theme.colors.accent, fontSize: 14, fontWeight: '800', marginBottom: 18 },
  notice: { color: theme.colors.muted, fontSize: 12, lineHeight: 18, backgroundColor: theme.colors.surface, borderRadius: 12, padding: 12, marginBottom: 18 },
  description: { color: theme.colors.muted, fontSize: 17, lineHeight: 27, maxWidth: 720 },
  body: { color: theme.colors.primaryDark, fontSize: 16, lineHeight: 27, marginTop: 28, maxWidth: 720 },
  button: { marginTop: 24, backgroundColor: theme.colors.primary, borderRadius: theme.radius.pill, paddingHorizontal: 20, paddingVertical: 13 },
  buttonText: { color: theme.colors.inverse, fontWeight: '800' },
});
