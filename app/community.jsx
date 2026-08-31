import React from 'react';
import DataDirectory from './data-directory';
import { community } from '../src/data/content';

export default function CommunityScreen() {
  return <DataDirectory eyebrow="COMMUNITY" title="People are the heart of Challapalle." description="Connect residents, groups and local initiatives in one welcoming digital community." items={community} />;
}
