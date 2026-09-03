import React from 'react';
import DynamicDetail from '../../src/components/DynamicDetail';
import { community as communityItems } from '../../src/data/content';

export default function CommunityDetailScreen() {
  return <DynamicDetail collection={communityItems} eyebrow="COMMUNITY" />;
}
