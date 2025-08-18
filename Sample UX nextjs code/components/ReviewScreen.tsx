import { useState } from 'react';
import { motion } from 'motion/react';

interface ReviewScreenProps {
  onStartReview: () => void;
}

export function ReviewScreen({ onStartReview }: ReviewScreenProps) {
  const [showAllCaughtUp, setShowAllCaughtUp] = useState(false);
  
  const cardsDue = 12;
  const nextReviewTime = "2:30 PM";
  
  // Mock data for card contexts
  const cardContexts = [
    { name: 'Biology - Plant Processes', count: 5, color: '#589B7C' },
    { name: 'Physics - Quantum Mechanics', count: 4, color: '#D97757' },
    { name: 'Spanish - Travel Phrases', count: 3, color: '#8B5CF6' }
  ];

  if (showAllCaughtUp) {
    return (
      <div className="flex flex-col h-full bg-warm relative">
        {/* Debug toggle - remove in production */}
        <button
          onClick={() => setShowAllCaughtUp(false)}
          className="absolute top-4 right-4 text-xs bg-surface px-2 py-1 rounded border border-custom z-10"
        >
          Show Cards Due
        </button>
        
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="text-center"
          >
            <motion.div 
              className="text-6xl mb-6"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              ✨
            </motion.div>
            <h1 className="mb-4">All done!</h1>
            <p className="text-secondary mb-8 max-w-sm">
              You've completed all your reviews for now. Great work on staying consistent!
            </p>
            
            <div className="bg-surface p-6 rounded-2xl border-custom border shadow-custom mb-6">
              <h3 className="mb-2">Next Review</h3>
              <p className="text-primary-custom text-lg font-semibold">{nextReviewTime}</p>
              <p className="text-xs text-secondary mt-1">
                3 cards from Biology will be ready
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="bg-surface p-4 rounded-xl border-custom border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Study Streak</span>
                  <span className="text-sm text-primary-custom">🔥 7 days</span>
                </div>
                <div className="w-full bg-border h-2 rounded-full">
                  <div className="w-4/5 h-2 bg-primary-custom rounded-full"></div>
                </div>
                <p className="text-xs text-secondary mt-1">Keep it up!</p>
              </div>
            </div>

            <div className="bg-surface p-4 rounded-xl border-custom border">
              <p className="text-sm text-secondary">
                💡 Consider adding more learning materials to keep growing your knowledge
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-warm relative">
      {/* Debug toggle - remove in production */}
      <button
        onClick={() => setShowAllCaughtUp(true)}
        className="absolute top-4 right-4 text-xs bg-surface px-2 py-1 rounded border border-custom z-10"
      >
        Show All Caught Up
      </button>
      
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="text-center max-w-sm w-full">
          <motion.div 
            className="text-6xl mb-6"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            📚
          </motion.div>
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-surface p-8 rounded-2xl border-custom border shadow-custom mb-6"
          >
            <h1 className="mb-2">Ready to Review</h1>
            <div className="mb-6">
              <motion.div 
                className="text-3xl font-semibold text-primary-custom mb-1"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.2 }}
              >
                {cardsDue}
              </motion.div>
              <p className="text-secondary">
                card{cardsDue !== 1 ? 's' : ''} due for review
              </p>
            </div>
            
            <motion.button
              onClick={onStartReview}
              className="w-full bg-primary-custom hover:bg-primary-custom/90 text-white py-4 px-6 rounded-xl transition-all duration-200 font-medium text-lg touch-manipulation"
              style={{ minHeight: '48px' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Start Review
            </motion.button>
          </motion.div>

          {/* Card contexts preview */}
          <div className="bg-surface p-4 rounded-xl border-custom border shadow-custom mb-4">
            <h3 className="text-sm font-medium mb-3">Review Topics</h3>
            <div className="space-y-2">
              {cardContexts.map((context, index) => (
                <motion.div
                  key={context.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: context.color }}
                    ></div>
                    <span className="text-xs text-secondary">{context.name}</span>
                  </div>
                  <span className="text-xs font-medium">{context.count}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-surface p-4 rounded-xl border-custom border">
            <p className="text-sm text-secondary">
              Next review available at {nextReviewTime}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}