'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';

interface HomeViewProps {
  totalDueCards: number;
  onStartReview: () => void;
  onFilterReview: () => void;
  onAddContext: () => void;
}

export default function HomeView({ 
  totalDueCards, 
  onStartReview, 
  onFilterReview, 
  onAddContext 
}: HomeViewProps) {
  const [showEmptyState, setShowEmptyState] = useState(false); // For demo

  // Mock data for recent activity
  const recentActivity = [
    { context: 'Biology', action: '5 cards reviewed', time: '2 hours ago' },
    { context: 'Spanish', action: '8 cards reviewed', time: 'yesterday' },
    { context: 'Physics', action: '3 new cards added', time: 'today' }
  ];

  // First time user state
  if (showEmptyState) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl"
        >
          <div className="text-6xl mb-6">📚</div>
          <h1 className="text-2xl font-semibold mb-4">Welcome to Total Recall!</h1>
          <p className="text-secondary text-lg mb-8 leading-relaxed">
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
              <p className="text-sm text-secondary">Paste any article or webpage</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="card-custom p-6 cursor-pointer hover:shadow-md-custom"
              onClick={onAddContext}
            >
              <div className="text-3xl mb-3">📝</div>
              <h3 className="font-medium mb-2">Add from Text</h3>
              <p className="text-sm text-secondary">Type or paste your notes</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="card-custom p-6 cursor-pointer hover:shadow-md-custom"
              onClick={() => {
                console.log('Load sample content');
              }}
            >
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-medium mb-2">Try Sample Content</h3>
              <p className="text-sm text-secondary">Load example biology flashcards</p>
            </motion.div>
          </div>

          {/* Debug toggle */}
          <Button
            variant="outline"
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
      <div className="flex items-center justify-center min-h-96">
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
          <p className="text-secondary text-lg mb-8">
            You've completed all reviews. Great work staying consistent!
          </p>

          <div className="card-custom p-6 mb-6">
            <h3 className="font-medium mb-2">Next review session:</h3>
            <p className="text-primary-custom text-lg font-semibold">Tomorrow at 9:00 AM (5 cards)</p>
          </div>

          <div className="text-left mb-6">
            <h3 className="font-medium mb-3">While you wait:</h3>
            <ul className="space-y-2 text-secondary">
              <li>• Add new content to learn</li>
              <li>• Review your progress stats</li>
              <li>• Browse your knowledge library</li>
            </ul>
          </div>

          <div className="flex justify-center space-x-3">
            <Button onClick={onAddContext} className="bg-primary-custom hover:bg-primary-hover text-white">
              Add Context
            </Button>
            <Button variant="outline">
              View Stats
            </Button>
          </div>

          {/* Debug toggle */}
          <Button
            variant="outline"
            onClick={() => setShowEmptyState(true)}
            className="text-xs mt-4"
          >
            Show Empty State
          </Button>
        </motion.div>
      </div>
    );
  }

  // Main review dashboard
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Welcome Section */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Welcome back!</h1>
          <p className="text-lg text-secondary mb-8">
            📚 You have <strong>{totalDueCards} cards</strong> ready for review
          </p>
          
          <div className="mb-6">
            <Button 
              onClick={onStartReview}
              className="bg-primary-custom hover:bg-primary-hover text-white px-12 py-4 text-lg rounded-xl"
              size="lg"
            >
              Start Review ({totalDueCards} cards)
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="card-custom p-6">
          <h2 className="font-semibold mb-4">Quick Stats</h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl mb-2">🔥</div>
              <div className="text-lg font-semibold">7 day streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">📊</div>
              <div className="text-lg font-semibold">89% retention rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">⏰</div>
              <div className="text-lg font-semibold">Next review in 2 hours</div>
              <div className="text-sm text-secondary">(3 cards)</div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card-custom p-6">
          <h2 className="font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-3 p-3 rounded-lg bg-surface-hover"
              >
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <div className="flex-1">
                  <span className="font-medium">{activity.context}:</span>{' '}
                  <span>{activity.action}</span>
                </div>
                <span className="text-sm text-secondary">{activity.time}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-center space-x-4">
          <Button 
            variant="outline" 
            onClick={onFilterReview}
            className="px-6"
          >
            Filter Review
          </Button>
          <Button 
            variant="outline" 
            onClick={onAddContext}
            className="px-6"
          >
            Add Context
          </Button>
        </div>
      </motion.div>
    </div>
  );
}