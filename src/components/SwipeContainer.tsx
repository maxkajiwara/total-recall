"use client";

import { motion, useMotionValue, type PanInfo, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { PageIndicator } from "./PageIndicator";
import { useSwipeNavigation } from "~/hooks/useSwipeNavigation";

interface SwipeContainerProps {
  children: React.ReactNode[];
}

export function SwipeContainer({ children }: SwipeContainerProps) {
  const {
    currentScreenIndex,
    screens,
    goToScreen,
    goToNext,
    goToPrevious,
    canGoNext,
    canGoPrevious,
    isInitialized,
  } = useSwipeNavigation();

  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [screenWidth, setScreenWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 390);
  
  // Initialize x with the starting position (Review screen is at index 1)
  const x = useMotionValue(typeof window !== 'undefined' ? -window.innerWidth : -390);

  // Update screen width on mount and resize
  useEffect(() => {
    const updateScreenWidth = () => {
      setScreenWidth(window.innerWidth);
    };
    
    updateScreenWidth();
    window.addEventListener('resize', updateScreenWidth);
    
    return () => window.removeEventListener('resize', updateScreenWidth);
  }, []);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // Update x position smoothly during drag
    const baseX = -currentScreenIndex * screenWidth;
    let newX = baseX + info.offset.x;
    
    // Apply rubber band effect at boundaries
    if (!canGoPrevious && info.offset.x > 0) {
      // At first screen, dragging right
      newX = baseX + info.offset.x * 0.3;
    } else if (!canGoNext && info.offset.x < 0) {
      // At last screen, dragging left
      newX = baseX + info.offset.x * 0.3;
    }
    
    x.set(newX);
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    
    const { offset, velocity } = info;
    const swipeThreshold = screenWidth * 0.15;
    const velocityThreshold = 300;

    // Determine direction based on offset and velocity
    const shouldSwipeNext = 
      (offset.x < -swipeThreshold || velocity.x < -velocityThreshold) && canGoNext;
    const shouldSwipePrevious = 
      (offset.x > swipeThreshold || velocity.x > velocityThreshold) && canGoPrevious;

    let targetIndex = currentScreenIndex;
    
    if (shouldSwipeNext) {
      targetIndex = currentScreenIndex + 1;
      goToNext();
    } else if (shouldSwipePrevious) {
      targetIndex = currentScreenIndex - 1;
      goToPrevious();
    }
    
    // Animate to final position
    const finalX = -targetIndex * screenWidth;
    animate(x, finalX, {
      type: "spring",
      stiffness: 500,
      damping: 35,
      mass: 0.5,
    });
  };

  if (!isInitialized || screenWidth === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-secondary animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Main swipe container */}
      <div ref={containerRef} className="h-screen overflow-hidden relative">
        <motion.div
          className="flex h-full will-change-transform"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0}
          dragMomentum={false}
          onDragStart={handleDragStart}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          style={{
            x,
            cursor: isDragging ? 'grabbing' : 'grab',
          }}
        >
          {children.map((child, index) => (
            <div
              key={index}
              className="min-w-full h-full flex-shrink-0"
              style={{ 
                width: `${screenWidth}px`,
                // Optimize rendering performance
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden',
              }}
            >
              <div className="h-full w-full">
                {child}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Page indicator with smooth fade */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <PageIndicator
          screens={screens}
          currentScreenIndex={currentScreenIndex}
          onScreenSelect={goToScreen}
        />
      </motion.div>
    </div>
  );
}