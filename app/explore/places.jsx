import React from 'react';
import RoutePage from '../../src/components/RoutePage';

export default function PlacesScreen() {
  return <RoutePage eyebrow="PLACES" title="Places worth discovering." description="Build a living guide to the places people visit, remember and recommend." cards={[
    { icon: '📍', title: 'Village landmarks', text: 'Notable places and familiar landmarks around Challapalle.' },
    { icon: '🗺️', title: 'Local guide', text: 'Useful locations, directions and practical information.' },
    { icon: '⭐', title: 'Community favourites', text: 'Places recommended by people who know the village.' },
  ]} />;
}
