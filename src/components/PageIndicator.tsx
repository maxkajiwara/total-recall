"use client";

import { motion } from "framer-motion";
import type { Screen } from "~/hooks/useSwipeNavigation";

interface PageIndicatorProps {
  screens: Screen[];
  currentScreenIndex: number;
  onScreenSelect: (screen: Screen) => void;
}

export function PageIndicator({ 
  screens, 
  currentScreenIndex, 
  onScreenSelect 
}: PageIndicatorProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg">
        {screens.map((screen, index) => (
          <button
            key={screen}
            onClick={() => onScreenSelect(screen)}
            className="p-1 transition-transform hover:scale-110"
            aria-label={`Go to page ${index + 1}`}
          >
            <motion.div
              className="w-2 h-2 rounded-full"
              initial={false}
              animate={{
                scale: index === currentScreenIndex ? 1.3 : 1,
                backgroundColor: index === currentScreenIndex ? "#d97757" : "#d1d5db",
              }}
              transition={{ 
                duration: 0.3, 
                ease: "easeInOut",
                type: "spring",
                stiffness: 500,
                damping: 30
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}