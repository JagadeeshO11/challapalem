import React from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable, Image, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { theme } from '../src/theme';
import SectionHeader from '../src/components/SectionHeader';
import FeatureCard from '../src/components/FeatureCard';

const features = [
  ['🌾', 'Village Life', 'Stories, traditions and everyday life.', '/explore'],
  ['🛕', 'Heritage', 'Places, temples and local history.', '/explore'],
  ['🌴', 'Nature', 'Fields, waterways and beautiful landscapes.', '/explore'],
  ['🤝', 'Community', 'People, events, businesses and services.', '/explore'],
];

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const wide = width >= 800;
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.page}>
      <View style={[styles.nav, wide && styles.navWide]}>
        <Pressable style={styles.brand} onPress={() => router.replace('/')}>
          <Image source={require('../challapalem-logo.png')} style={styles.logo} resizeMode="contain" />
          <View><Text style={styles.brandName}>CHALLAPALLE</Text><Text style={styles.brandTag}>OUR VILLAGE · OUR STORY</Text></View>
        </Pressable>
        {wide && <View style={styles.links}>{[['Explore','/explore'],['Events','/explore'],['Businesses','/explore'],['Community','/explore']].map(([label,path]) => <Pressable key={label} onPress={() => router.push(path)}><Text style={styles.link}>{label}</Text></Pressable>)}</View>}
      </View>
      <View style={[styles.hero, wide && styles.heroWide]}>
        <View style={styles.heroCopy}>
          <Text style={styles.eyebrow}>NAMASTE CHALLAPALLE</Text>
          <Text style={styles.heroTitle}>A village with{`\n`}a story to tell.</Text>
          <Text style={styles.heroText}>Discover the people, places, traditions and memories that make Challapalle home.</Text>
          <Pressable style={styles.button} onPress={() => router.push('/explore')}><Text style={styles.buttonText}>Explore the village  →</Text></Pressable>
        </View>
        <View style={styles.heroArt}><Text style={styles.sun}>☀</Text><Text style={styles.palms}>🌴  🌴</Text><Text style={styles.field}>🌾🌾🌾🌾🌾</Text></View>
      </View>
      <View style={styles.section}>
        <SectionHeader eyebrow="DISCOVER" title="Everything that makes us home." description="Explore the places, stories, nature and people that give Challapalle its character." />
        <View style={[styles.grid, wide && styles.gridWide]}>{features.map(([icon,title,text,path])=><View key={title} style={wide ? styles.cardSlot : undefined}><FeatureCard icon={icon} title={title} text={text} onPress={()=>router.push(path)} /></View>)}</View>
      </View>
      <View style={styles.story}><Text style={styles.eyebrow}>OUR STORY</Text><Text style={styles.storyTitle}>More than a place on a map.</Text><Text style={styles.storyText}>Challapalle is shaped by its people, its land and generations of memories. This digital home brings those stories together for everyone, wherever they are.</Text></View>
      <View style={styles.footer}><Text style={styles.footerName}>CHALLAPALLE.IN</Text><Text style={styles.footerText}>Our village. Our story. Our digital home.</Text></View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root:{flex:1,backgroundColor:theme.colors.background},page:{paddingBottom:40},nav:{minHeight:76,paddingHorizontal:22,paddingVertical:16,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},navWide:{paddingHorizontal:'7%'},brand:{flexDirection:'row',alignItems:'center',gap:10},logo:{width:52,height:52},brandName:{color:theme.colors.primaryDark,fontSize:17,fontWeight:'800',letterSpacing:1.5},brandTag:{color:theme.colors.accent,fontSize:8,fontWeight:'700',letterSpacing:1.3,marginTop:3},links:{flexDirection:'row',gap:28},link:{color:'#315541',fontSize:14,fontWeight:'600'},hero:{marginHorizontal:18,borderRadius:28,overflow:'hidden',backgroundColor:'#DCE8C9',minHeight:500,padding:30,flexDirection:'column'},heroWide:{marginHorizontal:'5%',paddingHorizontal:'6%',paddingVertical:60,minHeight:520,flexDirection:'row'},heroCopy:{flex:1,justifyContent:'center',zIndex:2},eyebrow:{color:theme.colors.accent,fontSize:11,fontWeight:'900',letterSpacing:2,marginBottom:9},heroTitle:{color:theme.colors.primaryDark,fontSize:48,lineHeight:53,fontWeight:'900',letterSpacing:-1.5},heroText:{color:'#46634F',fontSize:16,lineHeight:25,maxWidth:480,marginTop:18},button:{alignSelf:'flex-start',backgroundColor:theme.colors.primary,paddingHorizontal:22,paddingVertical:15,borderRadius:30,marginTop:25},buttonText:{color:theme.colors.inverse,fontSize:14,fontWeight:'800'},heroArt:{flex:.8,minHeight:190,justifyContent:'flex-end',alignItems:'center',paddingBottom:20},sun:{fontSize:100,opacity:.75,position:'absolute',top:10,right:20},palms:{fontSize:58,marginBottom:10},field:{fontSize:30,letterSpacing:-5},section:{paddingHorizontal:20,paddingTop:70,paddingBottom:35,maxWidth:1250,width:'100%',alignSelf:'center'},grid:{gap:14},gridWide:{flexDirection:'row',flexWrap:'wrap'},cardSlot:{flex:1,minWidth:220,margin:5},story:{marginTop:20,backgroundColor:theme.colors.primary,paddingHorizontal:25,paddingVertical:55},storyTitle:{color:theme.colors.inverse,fontSize:34,fontWeight:'900',marginBottom:16},storyText:{color:'#DCE8D9',fontSize:16,lineHeight:27,maxWidth:760},footer:{padding:30,alignItems:'center'},footerName:{color:theme.colors.primary,fontWeight:'900',letterSpacing:2},footerText:{color:'#7A827A',marginTop:6,fontSize:12}
});
