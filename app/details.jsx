import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import ContentDetail from '../src/components/ContentDetail';
import { places } from '../src/data/content';

export default function DetailsScreen() {
  const params = useLocalSearchParams();
  const key = Array.isArray(params.key) ? params.key[0] : params.key;
  const item = places.find((place) => place.id === key);
  return <ContentDetail eyebrow="PLACE" item={item} />;
}
