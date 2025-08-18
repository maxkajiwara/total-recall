'use client';

import { useDesktop } from './components/ui/use-desktop';
import DesktopLayout from './components/desktop/DesktopLayout';
import MobileLayout from './components/mobile/MobileLayout';
import { motion } from 'motion/react';

export default function App() {
  const { isDesktop, isLoading } = useDesktop();

  // Show loading spinner while detecting screen size
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-warm">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-primary-custom border-t-transparent rounded-full"
        />
      </div>
    );
  }

  // Render desktop or mobile layout based on screen size
  return (
    <div className="app-container">
      {isDesktop ? (
        <div className="desktop-only">
          <DesktopLayout />
        </div>
      ) : (
        <div className="mobile-only">
          <MobileLayout />
        </div>
      )}
    </div>
  );
}