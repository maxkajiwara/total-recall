'use client';

import { useEffect, useState } from 'react';
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

  return <DesktopLayoutWrapper />;
}