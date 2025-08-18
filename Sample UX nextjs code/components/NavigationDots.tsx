import { motion } from 'motion/react';

interface NavigationDotsProps {
  currentIndex: number;
  total: number;
}

export function NavigationDots({ currentIndex, total }: NavigationDotsProps) {
  return (
    <div className="flex justify-center items-center space-x-2 py-4">
      {Array.from({ length: total }).map((_, index) => (
        <motion.div
          key={index}
          className={`w-2 h-2 rounded-full transition-colors duration-200 ${
            index === currentIndex 
              ? 'bg-primary-custom' 
              : 'bg-border border-custom'
          }`}
          initial={false}
          animate={{
            scale: index === currentIndex ? 1.2 : 1,
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 17
          }}
        />
      ))}
    </div>
  );
}