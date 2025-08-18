import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';

interface DesktopMainContentProps {
  selectedContexts: string[];
  totalDueCards: number;
  onStartReview: () => void;
  onAddContext: () => void;
}

export function DesktopMainContent({ 
  selectedContexts, 
  totalDueCards, 
  onStartReview, 
  onAddContext 
}: DesktopMainContentProps) {
  const [showEmptyState, setShowEmptyState] = useState(false); // For demo purposes

  // Mock data for recent activity
  const recentActivity = [
    { context: 'Biology', action: '5 cards reviewed', time: '2 hours ago' },
    { context: 'Spanish', action: '8 cards reviewed', time: 'yesterday' },
    { context: 'Physics', action: '3 new cards added', time: 'today' }
  ];

  // First time user state
  if (showEmptyState) {
    return (
      <div className="desktop-content flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl"
        >
          <div className="text-6xl mb-6">📚</div>
          <h1 className="text-2xl font-semibold mb-4">Welcome to Total Recall!</h1>
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            Your AI-powered spaced repetition companion. Get started by adding your first learning
            content. I'll automatically create flashcards and schedule reviews using scientifically-proven
            spaced repetition.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="card-custom p-6 cursor-pointer hover:shadow-md-custom"
              onClick={onAddContext}
            >
              <div className="text-3xl mb-3">🔗</div>
              <h3 className="font-medium mb-2">Add from URL</h3>
              <p className="text-sm text-muted-foreground">Paste any article or webpage</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="card-custom p-6 cursor-pointer hover:shadow-md-custom"
              onClick={onAddContext}
            >
              <div className="text-3xl mb-3">📝</div>
              <h3 className="font-medium mb-2">Add from Text</h3>
              <p className="text-sm text-muted-foreground">Type or paste your notes</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="card-custom p-6 cursor-pointer hover:shadow-md-custom"
              onClick={() => {
                // TODO: Load sample content
                console.log('Load sample content');
              }}
            >
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-medium mb-2">Try Sample Content</h3>
              <p className="text-sm text-muted-foreground">Load example biology flashcards</p>
            </motion.div>
          </div>

          {/* Debug toggle */}
          <Button
            onClick={() => setShowEmptyState(false)}
            className="text-xs"
          >
            Show Main State
          </Button>
        </motion.div>
      </div>
    );
  }

  // All caught up state
  if (totalDueCards === 0) {
    return (
      <div className="desktop-content flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-lg"
        >
          <motion.div 
            className="text-6xl mb-6"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            ✨
          </motion.div>
          
          <h1 className="text-2xl font-semibold mb-4">All caught up!</h1>
          <p className="text-muted-foreground text-lg mb-8">
            You've completed all reviews. Great work staying consistent!
          </p>

          <div className="card-custom p-6 mb-6">
            <h3 className="font-medium mb-2">Next review session:</h3>
            <p className="text-primary text-lg font-semibold">Tomorrow at 9:00 AM (5 cards)</p>
          </div>

          <div className="text-left">
            <h3 className="font-medium mb-3">While you wait:</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Add new content to learn</li>
              <li>• Review your progress stats</li>
              <li>• Browse your knowledge library</li>
            </ul>
          </div>

          <div className="flex space-x-3 mt-6">
            <Button onClick={onAddContext} className="bg-primary hover:bg-primary/90 text-white">
              Add Context
            </Button>
            <Button>
              View Stats
            </Button>
          </div>

          {/* Debug toggle */}
          <Button
            onClick={() => setShowEmptyState(true)}
            className="text-xs mt-4"
          >
            Show Empty State
          </Button>
        </motion.div>
      </div>
    );
  }

  // Main state with cards due
  return (
    <div className="desktop-content">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl"
      >
        {/* Welcome Section */}
        <div className="card-custom p-8 mb-8">
          <h1 className="text-2xl font-semibold mb-4">Welcome back!</h1>
          <p className="text-lg text-muted-foreground mb-6">
            You have <strong>{totalDueCards} cards</strong> ready for review across{' '}
            <strong>{selectedContexts.includes('all') ? 'all topics' : `${selectedContexts.length} topic${selectedContexts.length !== 1 ? 's' : ''}`}</strong>.
          </p>
          
          <div className="flex space-x-4">
            <Button 
              onClick={onStartReview}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3"
            >
              Start Review
            </Button>
            <Button 
              onClick={onAddContext}
              className="px-8 py-3"
            >
              Add Context
            </Button>
          </div>

          <p className="text-sm text-gray-400 mt-4">
            Or select specific topics from the sidebar →
          </p>
        </div>

        {/* Recent Progress */}
        <div className="card-custom p-6">
          <h2 className="font-semibold mb-4">Recent Progress:</h2>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50"
              >
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <div className="flex-1">
                  <span className="font-medium">{activity.context}:</span>{' '}
                  <span>{activity.action}</span>
                </div>
                <span className="text-sm text-muted-foreground">{activity.time}</span>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
            <div className="text-center">
              <div className="text-lg font-semibold text-success">25</div>
              <div className="text-sm text-muted-foreground">Cards yesterday</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-primary">92%</div>
              <div className="text-sm text-muted-foreground">Retention rate</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-warning">2 hours</div>
              <div className="text-sm text-muted-foreground">Next review</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}