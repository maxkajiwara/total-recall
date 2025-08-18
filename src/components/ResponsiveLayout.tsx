'use client';

import { useEffect, useState } from 'react';
// Mobile imports preserved but commented for future use
// import { SwipeContainer } from './SwipeContainer';
// import { AddContentScreen } from './screens/AddContentScreen';
// import { ReviewScreen } from './screens/ReviewScreen';
// import { KnowledgeGraphScreen } from './screens/KnowledgeGraphScreen';
import DesktopLayoutWrapper from './desktop/DesktopLayoutWrapper';

export function ResponsiveLayout() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null;
  }

  // Always show desktop view for now
  return <DesktopLayoutWrapper />;
  
  // Mobile layout code preserved for future use
  // return (
  //   <SwipeContainer>
  //     <AddContentScreen />
  //     <ReviewScreen />
  //     <KnowledgeGraphScreen />
  //   </SwipeContainer>
  // );
}