import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Pressable, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const places = [
  { icon: '🌾', title: 'Village Life', text: 'Stories, traditions and everyday life.' },
  { icon: '🛕', title: 'Heritage', text: 'Places, temples and local history.' },
  { icon: '🌴', title: 'Nature', text: 'Fields, waterways and beautiful landscapes.' },
  { icon: '🤝', title: 'Community', text: 'People, events, businesses and services.' },
];

export default function App() {
  const { width } = useWindowDimensions();
  const wide = width >= 800;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.page}>
        <View style={[styles.nav, wide && styles.navWide]}>
          <View style={styles.brand}>
            <View style={styles.logoMark}><Text style={styles.logoLeaf}>🌿</Text></View>
            <View>
              <Text style={styles.brandName}>CHALLAPALLE</Text>
              <Text style={styles.brandTag}>OUR VILLAGE · OUR STORY</Text>
            </View>
          </View>
          {wide && <View style={styles.links}><Text style={styles.link}>Home</Text><Text style={styles.link}>Explore</Text><Text style={styles.link}>Community</Text><Text style={styles.link}>About</Text></View>}
        </View>

        <View style={[styles.hero, wide && styles.heroWide]}>
          <View style={styles.heroCopy}>
            <Text style={styles.kicker}>WELCOME TO CHALLAPALLE</Text>
            <Text style={styles.heroTitle}>A village with{`\n`}a story to tell.</Text>
            <Text style={styles.heroText}>Discover the people, places, traditions and memories that make Challapalle home.</Text>
            <Pressable style={styles.button}><Text style={styles.buttonText}>Explore the village  →</Text></Pressable>
          </View>
          <View style={styles.heroArt}>
            <Text style={styles.sun}>☀</Text>
            <Text style={styles.palms}>🌴  🌴</Text>
            <Text style={styles.field}>🌾🌾🌾🌾🌾</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionEyebrow}>DISCOVER</Text>
          <Text style={styles.sectionTitle}>Everything that makes us home.</Text>
          <View style={[styles.grid, wide && styles.gridWide]}>
            {places.map((item) => (
              <Pressable key={item.title} style={[styles.card, wide && styles.cardWide]}>
                <Text style={styles.cardIcon}>{item.icon}</Text>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardText}>{item.text}</Text>
                <Text style={styles.arrow}>↗</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.story}>
          <Text style={styles.sectionEyebrow}>OUR STORY</Text>
          <Text style={styles.storyTitle}>More than a place on a map.</Text>
          <Text style={styles.storyText}>Challapalle is shaped by its people, its land and generations of memories. This digital home brings those stories together for everyone, wherever they are.</Text>
        </View>

        <View style={styles.footer}><Text style={styles.footerName}>CHALLAPALLE.IN</Text><Text style={styles.footerText}>Our village. Our story. Our digital home.</Text></View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F5EA' },
  page: { paddingBottom: 40 },
  nav: { minHeight: 76, paddingHorizontal: 22, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  navWide: { paddingHorizontal: '7%' },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoMark: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#1D5A3B', alignItems: 'center', justifyContent: 'center' },
  logoLeaf: { fontSize: 24 },
  brandName: { color: '#173E2A', fontSize: 17, fontWeight: '800', letterSpacing: 1.5 },
  brandTag: { color: '#B58A35', fontSize: 8, fontWeight: '700', letterSpacing: 1.3, marginTop: 3 },
  links: { flexDirection: 'row', gap: 28 },
  link: { color: '#315541', fontSize: 14, fontWeight: '600' },
  hero: { marginHorizontal: 18, borderRadius: 28, overflow: 'hidden', backgroundColor: '#DCE8C9', minHeight: 500, padding: 30, flexDirection: 'column' },
  heroWide: { marginHorizontal: '5%', paddingHorizontal: '6%', paddingVertical: 60, minHeight: 520, flexDirection: 'row' },
  heroCopy: { flex: 1, justifyContent: 'center', zIndex: 2 },
  kicker: { color: '#9A7125', fontSize: 12, fontWeight: '800', letterSpacing: 2, marginBottom: 15 },
  heroTitle: { color: '#173E2A', fontSize: 48, lineHeight: 53, fontWeight: '900', letterSpacing: -1.5 },
  heroText: { color: '#46634F', fontSize: 16, lineHeight: 25, maxWidth: 480, marginTop: 18 },
  button: { alignSelf: 'flex-start', backgroundColor: '#1D5A3B', paddingHorizontal: 22, paddingVertical: 15, borderRadius: 30, marginTop: 25 },
  buttonText: { color: '#FFFDF5', fontSize: 14, fontWeight: '800' },
  heroArt: { flex: 0.8, minHeight: 190, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 20 },
  sun: { fontSize: 100, opacity: 0.75, position: 'absolute', top: 10, right: 20 },
  palms: { fontSize: 58, marginBottom: 10 },
  field: { fontSize: 30, letterSpacing: -5 },
  section: { paddingHorizontal: 20, paddingTop: 70, paddingBottom: 35, maxWidth: 1250, width: '100%', alignSelf: 'center' },
  sectionEyebrow: { color: '#A27A2A', fontSize: 11, fontWeight: '900', letterSpacing: 2, marginBottom: 9 },
  sectionTitle: { color: '#173E2A', fontSize: 32, fontWeight: '900', marginBottom: 25 },
  grid: { gap: 14 },
  gridWide: { flexDirection: 'row', flexWrap: 'wrap' },
  card: { backgroundColor: '#FFFDF7', borderRadius: 20, padding: 22, minHeight: 190, borderWidth: 1, borderColor: '#E8E1CE', position: 'relative' },
  cardWide: { flex: 1, minWidth: 220, margin: 5 },
  cardIcon: { fontSize: 28, marginBottom: 18 },
  cardTitle: { color: '#1D4D34', fontSize: 20, fontWeight: '800' },
  cardText: { color: '#667568', fontSize: 14, lineHeight: 21, marginTop: 8, maxWidth: 260 },
  arrow: { position: 'absolute', right: 20, bottom: 18, color: '#B58A35', fontSize: 22 },
  story: { marginTop: 20, backgroundColor: '#1D5A3B', paddingHorizontal: 25, paddingVertical: 55 },
  storyTitle: { color: '#FFFDF5', fontSize: 34, fontWeight: '900', marginBottom: 16 },
  storyText: { color: '#DCE8D9', fontSize: 16, lineHeight: 27, maxWidth: 760 },
  footer: { padding: 30, alignItems: 'center' },
  footerName: { color: '#1D5A3B', fontWeight: '900', letterSpacing: 2 },
  footerText: { color: '#7A827A', marginTop: 6, fontSize: 12 },
});
