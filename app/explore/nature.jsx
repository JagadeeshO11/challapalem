import React from 'react';
import RoutePage from '../../src/components/RoutePage';

export default function NatureScreen() {
  return <RoutePage eyebrow="NATURE" title="The landscape around us." description="Showcase the fields, trees, waterways and seasonal beauty that make the village feel like home." cards={[
    { icon: '🌾', title: 'Fields & farms', text: 'Explore the agricultural landscape and the work behind it.' },
    { icon: '🌴', title: 'Green spaces', text: 'Highlight trees, gardens and peaceful places to spend time.' },
    { icon: '💧', title: 'Water & seasons', text: 'Capture local waterways and the changing rhythm of the year.' },
  ]} />;
}
