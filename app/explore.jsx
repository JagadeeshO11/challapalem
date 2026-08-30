import React from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { router } from 'expo-router';
import SectionHeader from '../src/components/SectionHeader';
import FeatureCard from '../src/components/FeatureCard';
import { theme } from '../src/theme';

const items = [['🧭','Places','Discover notable places around Challapalle.'],['🛕','Heritage','Explore temples, history and local heritage.'],['🌿','Nature','See the landscapes, fields and waterways.']];
export default function ExploreScreen(){return <ScrollView style={styles.root} contentContainerStyle={styles.page}><Pressable onPress={()=>router.back()}><Text style={styles.back}>← Back</Text></Pressable><SectionHeader eyebrow="EXPLORE" title="Discover Challapalle." description="Start with the places, heritage and natural character of our village."/><View style={styles.grid}>{items.map(([icon,title,text])=><FeatureCard key={title} icon={icon} title={title} text={text} onPress={()=>{}}/>)}</View></ScrollView>}
const styles=StyleSheet.create({root:{flex:1,backgroundColor:theme.colors.background},page:{padding:24,maxWidth:1000,width:'100%',alignSelf:'center',gap:28},back:{color:theme.colors.primary,fontWeight:'800',fontSize:15},grid:{gap:16}});
