"use client";

import { motion, useMotionValue, type PanInfo } from "framer-motion";
import { useEffect, useRef } from "react";
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
  const x = useMotionValue(0);

  // Snap to screen positions
  useEffect(() => {
    if (isInitialized && typeof window !== "undefined") {
      const targetX = -currentScreenIndex * window.innerWidth;
      x.set(targetX);
    }
  }, [currentScreenIndex, x, isInitialized]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (typeof window === "undefined") return;
    
    const { offset, velocity } = info;
    const screenWidth = window.innerWidth;
    const swipeThreshold = screenWidth * 0.2; // 20% of screen width
    const velocityThreshold = 500;

    // Determine direction based on offset and velocity
    const shouldSwipeNext = 
      (offset.x < -swipeThreshold || velocity.x < -velocityThreshold) && canGoNext;
    const shouldSwipePrevious = 
      (offset.x > swipeThreshold || velocity.x > velocityThreshold) && canGoPrevious;

    if (shouldSwipeNext) {
      goToNext();
    } else if (shouldSwipePrevious) {
      goToPrevious();
    } else {
      // Snap back to current screen
      const targetX = -currentScreenIndex * screenWidth;
      x.set(targetX);
    }
  };

  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const screenWidth = window?.innerWidth ?? 390;
    const basePosition = -currentScreenIndex * screenWidth;
    const newX = basePosition + info.offset.x;
    
    // Apply rubber band effect at edges
    const minX = -(screens.length - 1) * screenWidth;
    const maxX = 0;
    
    let constrainedX = newX;
    
    if (newX > maxX) {
      // Rubber band on the left edge
      const overflow = newX - maxX;
      constrainedX = maxX + overflow * 0.3;
    } else if (newX < minX) {
      // Rubber band on the right edge
      const overflow = minX - newX;
      constrainedX = minX - overflow * 0.3;
    }
    
    x.set(constrainedX);
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-secondary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Main swipe container */}
      <div ref={containerRef} className="h-screen overflow-hidden">
        <motion.div
          className="flex h-full"
          style={{ x }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          animate={{
            x: -currentScreenIndex * (window?.innerWidth ?? 390),
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            mass: 1,
          }}
        >
          {children.map((child, index) => (
            <div
              key={index}
              className="min-w-full h-full flex-shrink-0"
              style={{ width: '100vw' }}
            >
              {child}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Page indicator */}
      <PageIndicator
        screens={screens}
        currentScreenIndex={currentScreenIndex}
        onScreenSelect={goToScreen}
      />
    </div>
  );
}