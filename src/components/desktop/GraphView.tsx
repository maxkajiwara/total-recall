'use client';

import { motion } from 'framer-motion';
import { Button } from '../ui/button';

export default function GraphView() {
  const handleNotifyMe = () => {
    console.log('Notify when available clicked');
    // TODO: Implement notification signup
  };

  return (
    <div className="flex items-center justify-center min-h-96">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-lg"
      >
        <motion.div 
          className="text-8xl mb-8"
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [0, 2, -2, 0]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          🌐
        </motion.div>
        
        <h1 className="text-2xl font-semibold mb-4">Knowledge Graph</h1>
        <h2 className="text-lg text-primary font-medium mb-6">Coming Soon</h2>
        
        <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
          This feature will visualize connections between your learning topics and show
          knowledge dependencies, helping you understand how concepts relate to each other.
        </p>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm p-6 mb-8 text-left">
          <h3 className="font-semibold mb-4">What to expect:</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start space-x-2">
              <span className="text-primary mt-1">•</span>
              <span>Interactive network visualization of your knowledge</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-primary mt-1">•</span>
              <span>Discover connections between different topics</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-primary mt-1">•</span>
              <span>Identify knowledge gaps and learning paths</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-primary mt-1">•</span>
              <span>Track concept mastery over time</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-primary mt-1">•</span>
              <span>Smart recommendations for what to study next</span>
            </li>
          </ul>
        </div>

        <Button
          onClick={handleNotifyMe}
          className="bg-primary hover:bg-primary/90 text-white px-8 py-3"
        >
          Notify When Available
        </Button>

        <p className="text-xs text-gray-400 mt-4">
          We'll send you an email when this feature is ready
        </p>
      </motion.div>
    </div>
  );
}