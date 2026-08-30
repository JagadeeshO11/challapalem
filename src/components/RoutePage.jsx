import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { theme } from '../theme';

export default function RoutePage({ eyebrow, title, description, cards = [] }) {
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.page}>
      <View style={styles.nav}>
        <Pressable style={styles.brand} onPress={() => router.replace('/')} accessibilityRole="button" accessibilityLabel="Go to Challapalle home">
          <Image source={require('../../challapalem-logo.png')} style={styles.logo} resizeMode="contain" />
          <Text style={styles.brandName}>CHALLAPALLE</Text>
        </Pressable>
        <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Go back">
          <Text style={styles.back}>← Back</Text>
        </Pressable>
      </View>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <View style={styles.grid}>
        {cards.map((card) => (
          <Pressable key={card.title} style={({ pressed }) => [styles.card, pressed && styles.pressed]} onPress={() => card.path && router.push(card.path)} disabled={!card.path}>
            <Text style={styles.icon}>{card.icon}</Text>
            <Text style={styles.cardTitle}>{card.title}</Text>
            <Text style={styles.cardText}>{card.text}</Text>
            {!!card.path && <Text style={styles.arrow}>↗</Text>}
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.background },
  page: { paddingBottom: 48 },
  nav: { minHeight: 76, paddingHorizontal: 22, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logo: { width: 42, height: 42 },
  brandName: { color: theme.colors.primaryDark, fontSize: 15, fontWeight: '900', letterSpacing: 1.4 },
  back: { color: theme.colors.primary, fontSize: 14, fontWeight: '800' },
  hero: { paddingHorizontal: 24, paddingTop: 54, paddingBottom: 34, maxWidth: 1000, width: '100%', alignSelf: 'center' },
  eyebrow: { color: theme.colors.accent, fontSize: 11, fontWeight: '900', letterSpacing: 2, marginBottom: 9 },
  title: { color: theme.colors.primaryDark, fontSize: 40, lineHeight: 46, fontWeight: '900' },
  description: { color: theme.colors.muted, fontSize: 16, lineHeight: 25, maxWidth: 720, marginTop: 14 },
  grid: { width: '100%', maxWidth: 1000, alignSelf: 'center', paddingHorizontal: 24, gap: 14 },
  card: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, padding: theme.spacing.lg, minHeight: 170, borderWidth: 1, borderColor: theme.colors.border, position: 'relative' },
  pressed: { opacity: 0.82, transform: [{ scale: 0.99 }] },
  icon: { fontSize: 28, marginBottom: 14 },
  cardTitle: { color: theme.colors.primary, fontSize: 19, fontWeight: '800' },
  cardText: { color: theme.colors.muted, fontSize: 14, lineHeight: 21, marginTop: 5, paddingRight: 20 },
  arrow: { position: 'absolute', right: 18, bottom: 15, color: theme.colors.accent, fontSize: 21 },
});
