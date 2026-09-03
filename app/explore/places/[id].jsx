import React from 'react';
import DynamicDetail from '../../../src/components/DynamicDetail';
import { places } from '../../../src/data/content';

export default function PlaceDetailScreen() {
  return <DynamicDetail collection={places} eyebrow="PLACE" />;
}
