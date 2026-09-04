import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import ContentDetail from '../src/components/ContentDetail';
import { getContentById } from '../src/services/contentService';

const labels = { place: 'PLACE', event: 'EVENT', business: 'BUSINESS', community: 'COMMUNITY' };

export default function DetailsScreen() {
  const params = useLocalSearchParams();
  const key = Array.isArray(params.key) ? params.key[0] : params.key;
  const type = Array.isArray(params.type) ? params.type[0] : params.type;
  const item = getContentById(type, key);

  return <ContentDetail eyebrow={labels[type] ?? 'DETAIL'} item={item} />;
}
