import React from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import ContentDetail from './ContentDetail';

export default function DynamicDetail({ collection, eyebrow }) {
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const item = collection.find((entry) => entry.id === id);

  return <ContentDetail item={item} eyebrow={eyebrow} />;
}
