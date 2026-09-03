import React from 'react';
import DynamicDetail from '../../src/components/DynamicDetail';
import { events } from '../../src/data/content';

export default function EventDetailScreen() {
  return <DynamicDetail collection={events} eyebrow="EVENT" />;
}
