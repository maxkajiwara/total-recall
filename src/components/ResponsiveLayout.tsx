'use client';

import { useEffect, useState } from 'react';
import { SwipeContainer } from './SwipeContainer';
import { AddContentScreen } from './screens/AddContentScreen';
import { ReviewScreen } from './screens/ReviewScreen';
import { KnowledgeGraphScreen } from './screens/KnowledgeGraphScreen';
import DesktopLayoutWrapper from './desktop/DesktopLayoutWrapper';

interface ResponsiveLayoutProps {
  children?: React.ReactNode;
}

export function ResponsiveLayout({ children }: ResponsiveLayoutProps) {
  const [isDesktop, setIsDesktop] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 768); // md breakpoint
    };
    
    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);
    
    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null;
  }

  if (isDesktop) {
    return <DesktopLayoutWrapper />;
  }

  // Mobile layout with swipe navigation
  return (
    <SwipeContainer>
      <AddContentScreen />
      <ReviewScreen />
      <KnowledgeGraphScreen />
    </SwipeContainer>
  );
}