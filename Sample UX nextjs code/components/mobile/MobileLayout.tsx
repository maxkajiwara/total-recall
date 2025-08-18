'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, PanInfo } from 'motion/react';
import { AddContentScreen } from '../AddContentScreen';
import { ReviewScreen } from '../ReviewScreen';
import { KnowledgeGraphScreen } from '../KnowledgeGraphScreen';
import { NavigationDots } from '../NavigationDots';
import { VoiceReviewModal } from '../VoiceReviewModal';

export default function MobileLayout() {
  const [currentScreen, setCurrentScreen] = useState(1); // Start at Review screen (index 1)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [hasShownSwipeHint, setHasShownSwipeHint] = useState(false);
  
  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate the transform based on current screen
  const baseX = -currentScreen * 100;
  
  // Set initial position
  useEffect(() => {
    x.set(baseX);
  }, [currentScreen, baseX, x]);

  // Show swipe hint after 3 seconds on first visit
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasShownSwipeHint(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false);
    
    const threshold = 50; // pixels
    const velocity = info.velocity.x;
    const offset = info.offset.x;
    
    // Determine new screen based on drag distance and velocity
    let newScreen = currentScreen;
    
    if (offset > threshold || velocity > 500) {
      // Dragged right (go to previous screen)
      newScreen = Math.max(0, currentScreen - 1);
    } else if (offset < -threshold || velocity < -500) {
      // Dragged left (go to next screen)
      newScreen = Math.min(2, currentScreen + 1);
    }
    
    setCurrentScreen(newScreen);
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const screenTitles = ['Add Content', 'Review', 'Knowledge Graph'];

  return (
    <div className="h-screen overflow-hidden bg-warm relative mobile-only">
      {/* Swipe affordance hints */}
      <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/5 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/5 to-transparent pointer-events-none z-10" />
      
      {/* Screen indicator at top */}
      <div className="absolute top-0 left-0 right-0 bg-warm/90 backdrop-blur-sm border-b border-custom z-20">
        <div className="flex items-center justify-center py-4">
          <motion.h2
            key={currentScreen}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-medium text-sm"
          >
            {screenTitles[currentScreen]}
          </motion.h2>
        </div>
      </div>

      {/* One-time swipe hint */}
      {!hasShownSwipeHint && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
        >
          <div className="bg-surface px-4 py-3 rounded-2xl border border-custom shadow-custom">
            <div className="flex items-center space-x-2">
              <motion.div
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-lg"
              >
                👆
              </motion.div>
              <span className="text-sm text-secondary">Swipe to explore</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main swipe container */}
      <div ref={containerRef} className="relative h-full pt-16 pb-20">
        <motion.div
          className="flex h-full"
          style={{ x }}
          drag="x"
          dragConstraints={{ left: -200, right: 0 }}
          dragElastic={0.1}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          animate={{ 
            x: isDragging ? undefined : baseX + '%'
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
        >
          {/* Screen 1: Add Content */}
          <motion.div 
            className="w-full h-full flex-shrink-0 relative"
            style={{
              filter: currentScreen === 0 ? 'none' : 'brightness(0.7)',
              transition: 'filter 0.3s ease'
            }}
          >
            <AddContentScreen />
            {/* Peek affordance for next screen */}
            {currentScreen === 0 && (
              <div className="absolute top-1/2 right-4 transform -translate-y-1/2 pointer-events-none">
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-secondary text-sm bg-surface px-2 py-1 rounded border border-custom"
                >
                  →
                </motion.div>
              </div>
            )}
          </motion.div>
          
          {/* Screen 2: Review (Home) */}
          <motion.div 
            className="w-full h-full flex-shrink-0 relative"
            style={{
              filter: currentScreen === 1 ? 'none' : 'brightness(0.7)',
              transition: 'filter 0.3s ease'
            }}
          >
            <ReviewScreen onStartReview={() => setIsReviewModalOpen(true)} />
            {/* Peek affordances for adjacent screens */}
            {currentScreen === 1 && (
              <>
                <div className="absolute top-1/2 left-4 transform -translate-y-1/2 pointer-events-none">
                  <motion.div
                    animate={{ x: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    className="text-secondary text-sm bg-surface px-2 py-1 rounded border border-custom"
                  >
                    ←
                  </motion.div>
                </div>
                <div className="absolute top-1/2 right-4 transform -translate-y-1/2 pointer-events-none">
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    className="text-secondary text-sm bg-surface px-2 py-1 rounded border border-custom"
                  >
                    →
                  </motion.div>
                </div>
              </>
            )}
          </motion.div>
          
          {/* Screen 3: Knowledge Graph */}
          <motion.div 
            className="w-full h-full flex-shrink-0 relative"
            style={{
              filter: currentScreen === 2 ? 'none' : 'brightness(0.7)',
              transition: 'filter 0.3s ease'
            }}
          >
            <KnowledgeGraphScreen />
            {/* Peek affordance for previous screen */}
            {currentScreen === 2 && (
              <div className="absolute top-1/2 left-4 transform -translate-y-1/2 pointer-events-none">
                <motion.div
                  animate={{ x: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-secondary text-sm bg-surface px-2 py-1 rounded border border-custom"
                >
                  ←
                </motion.div>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Navigation dots */}
      <div className="absolute bottom-0 left-0 right-0 bg-warm/90 backdrop-blur-sm border-t border-custom">
        <NavigationDots currentIndex={currentScreen} total={3} />
      </div>

      {/* Voice Review Modal */}
      <VoiceReviewModal 
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
      />
    </div>
  );
}