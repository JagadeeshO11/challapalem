import React from 'react';
import RoutePage from '../src/components/RoutePage';

export default function CommunityScreen() {
  return <RoutePage eyebrow="COMMUNITY" title="People are the heart of Challapalle." description="Connect residents, groups and local initiatives in one welcoming digital community." cards={[
    { icon: '👥', title: 'People', text: 'Meet the people, groups and stories that shape village life.' },
    { icon: '💬', title: 'Community board', text: 'Make space for useful announcements and local conversations.' },
    { icon: '❤️', title: 'Help & volunteering', text: 'Find ways to support neighbours and community initiatives.' },
  ]} />;
}
