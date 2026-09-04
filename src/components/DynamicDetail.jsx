import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import ContentDetail from './ContentDetail';
import { getContentById } from '../services/contentService';

export default function DynamicDetail({ type, eyebrow }) {
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const item = getContentById(type, id);

  return <ContentDetail item={item} eyebrow={eyebrow} />;
}
