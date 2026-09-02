import React from 'react';
import DataDirectory from './data-directory';
import { events } from '../src/data/content';

export default function EventsScreen() {
  return <DataDirectory eyebrow="EVENTS" title="What's happening in Challapalle." description="A home for village celebrations, gatherings, festivals and community moments." items={events} detailType="event" />;
}
