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
      <div className="flex items-center gap-2">
        {screens.map((screen, index) => (
          <button
            key={screen}
            onClick={() => onScreenSelect(screen)}
            className="p-1"
            aria-label={`Go to page ${index + 1}`}
          >
            <motion.div
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                index === currentScreenIndex
                  ? "bg-orange-500"
                  : "bg-gray-300"
              }`}
              initial={false}
              animate={{
                scale: index === currentScreenIndex ? 1.2 : 1,
              }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}