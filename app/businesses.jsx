import React from 'react';
import RoutePage from '../src/components/RoutePage';

export default function BusinessesScreen() {
  return <RoutePage eyebrow="BUSINESSES" title="Local businesses, close to home." description="Discover local shops, services and people building livelihoods in and around Challapalle." cards={[
    { icon: '🏪', title: 'Local shops', text: 'Find everyday stores and village essentials.' },
    { icon: '🧰', title: 'Services', text: 'Explore skilled workers and useful local services.' },
    { icon: '🤝', title: 'List your business', text: 'Create a place for your local business in the village directory.' },
  ]} />;
}
