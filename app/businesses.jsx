import React from 'react';
import DataDirectory from './data-directory';
import { businesses } from '../src/data/content';

export default function BusinessesScreen() {
  return <DataDirectory eyebrow="BUSINESSES" title="Local businesses, close to home." description="Discover local shops, services and people building livelihoods in and around Challapalle." items={businesses} detailType="business" />;
}
