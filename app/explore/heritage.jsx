import React from 'react';
import RoutePage from '../../src/components/RoutePage';

export default function HeritageScreen() {
  return <RoutePage eyebrow="HERITAGE" title="Stories carried through generations." description="Preserve temples, traditions, landmarks and the history that gives Challapalle its identity." cards={[
    { icon: '🛕', title: 'Temples & traditions', text: 'Document places of worship and the traditions around them.' },
    { icon: '📜', title: 'Local history', text: 'Collect stories, milestones and memories from the village.' },
    { icon: '🧓', title: 'Oral histories', text: 'Give elders and families a place to preserve their stories.' },
  ]} />;
}
