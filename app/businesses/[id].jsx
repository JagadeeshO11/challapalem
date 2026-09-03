import React from 'react';
import DynamicDetail from '../../src/components/DynamicDetail';
import { businesses } from '../../src/data/content';

export default function BusinessDetailScreen() {
  return <DynamicDetail collection={businesses} eyebrow="BUSINESS" />;
}
