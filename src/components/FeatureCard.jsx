import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { theme } from '../theme';

export default function FeatureCard({ icon, title, text, onPress }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>{text}</Text>
      <Text style={styles.arrow}>↗</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, padding: theme.spacing.lg, minHeight: 180, borderWidth: 1, borderColor: theme.colors.border, position: 'relative' },
  pressed: { opacity: 0.8, transform: [{ scale: 0.99 }] },
  icon: { fontSize: 28, marginBottom: theme.spacing.md },
  title: { color: theme.colors.primary, fontSize: 19, fontWeight: '800' },
  text: { color: theme.colors.muted, fontSize: 14, lineHeight: 21, marginTop: theme.spacing.xs, paddingRight: 18 },
  arrow: { position: 'absolute', right: 18, bottom: 15, color: theme.colors.accent, fontSize: 21 },
});
