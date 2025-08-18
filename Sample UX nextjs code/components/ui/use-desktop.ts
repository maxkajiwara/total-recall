import { useState, useEffect } from 'react';

export function useDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 768);
      setIsLoading(false);
    };

    // Initial check
    checkScreenSize();

    // Listen for resize events
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  return { isDesktop, isLoading };
}