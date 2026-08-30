import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Pressable, Image, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const features = [
  { icon: '👥', title: 'Connect', text: 'Connect with people, groups and organizations in Challapalle.' },
  { icon: '🏪', title: 'Discover', text: 'Explore local businesses, services and opportunities.' },
  { icon: '📅', title: 'Participate', text: 'Join events, activities and community initiatives.' },
  { icon: '🌱', title: 'Grow Together', text: 'Build a stronger, sustainable Challapalle together.' },
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
            <Image source={require('./challapalem-logo.png')} style={styles.navLogo} resizeMode="contain" />
            <View>
              <Text style={styles.brandName}>Challapalem</Text>
              <Text style={styles.brandTag}>Namaste Challapalem</Text>
            </View>
          </View>
          {wide && (
            <View style={styles.links}>
              {['Home', 'Explore', 'Services', 'Businesses', 'Events', 'News', 'About Us'].map((item, index) => (
                <Pressable key={item} style={index === 0 ? styles.activeLinkWrap : undefined}>
                  <Text style={[styles.link, index === 0 && styles.activeLink]}>{item}</Text>
                </Pressable>
              ))}
              <Pressable style={styles.getStarted}><Text style={styles.getStartedText}>Get Started</Text></Pressable>
            </View>
          )}
        </View>

        <View style={styles.hero}>
          <View style={styles.heroGlow} />
          <View style={styles.heroContent}>
            <Image source={require('./challapalem-logo.png')} style={styles.heroLogo} resizeMode="contain" />
            <View style={styles.namasteRow}>
              <Text style={styles.leafMark}>❧</Text>
              <Text style={styles.namaste}>Namaste</Text>
              <Text style={styles.leafMark}>❧</Text>
            </View>
            <Text style={styles.heroTitle}>Challapalem</Text>
            <View style={styles.divider}><View style={styles.line} /><Text style={styles.diamond}>✦</Text><View style={styles.line} /></View>
            <Text style={styles.heroTagline}>One Village. One Platform. Infinite Possibilities.</Text>
            <Text style={styles.heroSub}>Discover. Connect. Grow together.</Text>
            <View style={styles.actions}>
              <Pressable style={styles.primaryButton}><Text style={styles.primaryText}>Explore Challapalem  →</Text></Pressable>
              <Pressable style={styles.secondaryButton}><Text style={styles.secondaryText}>Learn More  →</Text></Pressable>
            </View>
          </View>
        </View>

        <View style={[styles.featureGrid, wide && styles.featureGridWide]}>
          {features.map((feature) => (
            <Pressable key={feature.title} style={styles.featureCard}>
              <View style={styles.iconCircle}><Text style={styles.featureIcon}>{feature.icon}</Text></View>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureText}>{feature.text}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.story}>
          <Text style={styles.storyEyebrow}>OUR VILLAGE · OUR STORY</Text>
          <Text style={styles.storyTitle}>More than a place on a map.</Text>
          <Text style={styles.storyText}>Challapalle is shaped by its people, its land, its traditions and generations of memories. This digital home brings them together for everyone, wherever they are.</Text>
        </View>

        <View style={styles.footer}>
          <Image source={require('./challapalem-logo.png')} style={styles.footerLogo} resizeMode="contain" />
          <Text style={styles.footerName}>CHALLAPALLEM.IN</Text>
          <Text style={styles.footerText}>Namaste Challapalem · Our village. Our story.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FAFBF7' },
  page: { paddingBottom: 0 },
  nav: { minHeight: 82, paddingHorizontal: 20, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF' },
  navWide: { paddingHorizontal: '5%' },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  navLogo: { width: 58, height: 58 },
  brandName: { color: '#244C2D', fontSize: 22, fontWeight: '800', letterSpacing: 0.2 },
  brandTag: { color: '#87652D', fontSize: 11, fontWeight: '600', marginTop: 2 },
  links: { flexDirection: 'row', alignItems: 'center', gap: 25 },
  link: { color: '#252925', fontSize: 14, fontWeight: '600' },
  activeLinkWrap: { paddingBottom: 13, paddingTop: 13, borderBottomWidth: 2, borderBottomColor: '#3E8B27' },
  activeLink: { color: '#2F7623' },
  getStarted: { backgroundColor: '#3D8C24', borderRadius: 15, paddingHorizontal: 24, paddingVertical: 14, marginLeft: 8 },
  getStartedText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  hero: { marginHorizontal: 0, minHeight: 555, backgroundColor: '#F6F2E9', overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  heroGlow: { position: 'absolute', width: '120%', height: '120%', borderRadius: 999, backgroundColor: '#FFFDF7', opacity: 0.8, top: -110 },
  heroContent: { alignItems: 'center', paddingHorizontal: 20, paddingVertical: 50, zIndex: 1 },
  heroLogo: { width: 126, height: 126, marginBottom: 6 },
  namasteRow: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  namaste: { color: '#765122', fontSize: 42, fontWeight: '600', fontStyle: 'italic', letterSpacing: 0.5 },
  leafMark: { color: '#4A8C2D', fontSize: 28 },
  heroTitle: { color: '#286A24', fontSize: 70, lineHeight: 76, fontWeight: '900', letterSpacing: -2.5, textAlign: 'center', marginTop: -2 },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12, width: 430, maxWidth: '90%', marginTop: 14 },
  line: { height: 1, backgroundColor: '#BCA77D', flex: 1 },
  diamond: { color: '#5D982E', fontSize: 18 },
  heroTagline: { color: '#262A26', fontSize: 18, fontWeight: '600', textAlign: 'center', marginTop: 18 },
  heroSub: { color: '#343834', fontSize: 17, textAlign: 'center', marginTop: 9 },
  actions: { flexDirection: 'row', gap: 16, marginTop: 30, flexWrap: 'wrap', justifyContent: 'center' },
  primaryButton: { backgroundColor: '#3D8C24', paddingHorizontal: 30, paddingVertical: 16, borderRadius: 30, minWidth: 220, alignItems: 'center' },
  primaryText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
  secondaryButton: { backgroundColor: '#FFFFFF', borderWidth: 2, borderColor: '#3D8C24', paddingHorizontal: 30, paddingVertical: 14, borderRadius: 30, minWidth: 180, alignItems: 'center' },
  secondaryText: { color: '#315B2B', fontSize: 15, fontWeight: '800' },
  featureGrid: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 40, gap: 14, backgroundColor: '#F6F2E9' },
  featureGridWide: { flexDirection: 'row', paddingHorizontal: '7%', gap: 18 },
  featureCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 24, padding: 28, minHeight: 245, alignItems: 'center', justifyContent: 'flex-start', shadowOpacity: 0.05, shadowRadius: 12, elevation: 2 },
  iconCircle: { width: 66, height: 66, borderRadius: 33, backgroundColor: '#EEF5E8', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  featureIcon: { fontSize: 28 },
  featureTitle: { color: '#242824', fontSize: 21, fontWeight: '800', textAlign: 'center' },
  featureText: { color: '#646B64', fontSize: 14, lineHeight: 21, textAlign: 'center', marginTop: 10, maxWidth: 230 },
  story: { backgroundColor: '#286A3B', paddingHorizontal: '7%', paddingVertical: 65 },
  storyEyebrow: { color: '#D9C18A', fontSize: 11, fontWeight: '900', letterSpacing: 2, marginBottom: 10 },
  storyTitle: { color: '#FFFFFF', fontSize: 38, lineHeight: 45, fontWeight: '900' },
  storyText: { color: '#E2EDE3', fontSize: 16, lineHeight: 27, maxWidth: 760, marginTop: 16 },
  footer: { alignItems: 'center', paddingVertical: 35, backgroundColor: '#FAFBF7' },
  footerLogo: { width: 48, height: 48, marginBottom: 8 },
  footerName: { color: '#286A3B', fontSize: 13, fontWeight: '900', letterSpacing: 2 },
  footerText: { color: '#7B817A', fontSize: 12, marginTop: 7 },
});
