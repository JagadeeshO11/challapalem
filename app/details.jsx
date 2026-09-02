import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import ContentDetail from '../src/components/ContentDetail';
import { places, events, businesses, community } from '../src/data/content';

const collections = { place: places, event: events, business: businesses, community };
const labels = { place: 'PLACE', event: 'EVENT', business: 'BUSINESS', community: 'COMMUNITY' };

export default function DetailsScreen() {
  const params = useLocalSearchParams();
  const key = Array.isArray(params.key) ? params.key[0] : params.key;
  const type = Array.isArray(params.type) ? params.type[0] : params.type;
  const collection = collections[type] ?? places;
  const item = collection.find((entry) => entry.id === key);

  return <ContentDetail eyebrow={labels[type] ?? 'DETAIL'} item={item} />;
}
