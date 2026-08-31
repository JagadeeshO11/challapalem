import React from 'react';
import DataDirectory from '../../app/data-directory';
import { places } from '../../src/data/content';

export default function PlacesScreen() {
  return <DataDirectory eyebrow="PLACES" title="Places worth discovering." description="Build a living guide to the places people visit, remember and recommend." items={places} />;
}
