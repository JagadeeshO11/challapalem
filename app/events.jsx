import React from 'react';
import RoutePage from '../src/components/RoutePage';

export default function EventsScreen() {
  return <RoutePage eyebrow="EVENTS" title="What's happening in Challapalle." description="A home for village celebrations, gatherings, festivals and community moments." cards={[
    { icon: '🎉', title: 'Festivals', text: 'Celebrate the traditions and occasions that bring the village together.' },
    { icon: '📅', title: 'Community events', text: 'Keep track of local gatherings, meetings and activities.' },
    { icon: '📸', title: 'Village moments', text: 'Share and preserve memories from important days.' },
  ]} />;
}
