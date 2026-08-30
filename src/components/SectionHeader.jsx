import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';

export default function SectionHeader({ eyebrow, title, description }) {
  return (
    <View style={styles.wrap}>
      {!!eyebrow && <Text style={styles.eyebrow}>{eyebrow}</Text>}
      <Text style={styles.title}>{title}</Text>
      {!!description && <Text style={styles.description}>{description}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: theme.spacing.lg },
  eyebrow: { color: theme.colors.accent, fontSize: 11, fontWeight: '900', letterSpacing: 2, marginBottom: theme.spacing.xs },
  title: { color: theme.colors.primaryDark, fontSize: 32, lineHeight: 38, fontWeight: '900' },
  description: { color: theme.colors.muted, fontSize: 15, lineHeight: 23, marginTop: theme.spacing.sm, maxWidth: 680 },
});
