import { motion } from 'motion/react';

export function KnowledgeGraphScreen() {
  return (
    <div className="flex flex-col h-full bg-warm relative">
      {/* Swipe hint */}
      <motion.div
        initial={{ opacity: 1, x: -20 }}
        animate={{ opacity: 0, x: -40 }}
        transition={{ delay: 3, duration: 1 }}
        className="absolute top-6 left-6 text-xs text-secondary bg-surface px-3 py-2 rounded-full border border-custom pointer-events-none"
      >
        ← Swipe back
      </motion.div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="text-center max-w-sm"
        >
          <motion.div 
            className="text-6xl mb-6"
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            🧠
          </motion.div>
          
          <h1 className="mb-4">Knowledge Graph</h1>
          
          <div className="bg-surface p-8 rounded-2xl border-custom border shadow-custom mb-6">
            <motion.h2 
              className="mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Coming Soon!
            </motion.h2>
            
            <motion.p 
              className="text-secondary text-sm mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              We're building an interactive knowledge graph that will show connections between your learning materials and help you discover new topics to explore.
            </motion.p>

            {/* Mock preview of what's coming */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="space-y-3"
            >
              <div className="text-xs text-secondary mb-2">Preview features:</div>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-primary-custom rounded-full"></div>
                <span className="text-sm">Visual topic connections</span>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-sm">Learning path suggestions</span>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-sm">Knowledge gap identification</span>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="bg-surface p-4 rounded-xl border-custom border"
          >
            <p className="text-sm text-secondary">
              📊 For now, focus on building your knowledge through regular reviews!
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}