'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { api } from '~/trpc/react';
import { toast } from 'sonner';

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
  // Fetch real data
  const { data: contexts = [], isLoading: loadingContexts } = api.context.list.useQuery();
  const { data: allQuestions = [], isLoading: loadingQuestions } = api.question.list.useQuery();
  const { data: dueQuestions = [] } = api.question.getDue.useQuery({ limit: 100 });
  
  const utils = api.useUtils();
  const createContext = api.context.create.useMutation({
    onSuccess: () => {
      toast.success('Sample content loaded successfully!');
      utils.context.list.invalidate();
      utils.question.list.invalidate();
      utils.question.getDue.invalidate();
    },
    onError: (error) => {
      toast.error(`Failed to load sample content: ${error.message}`);
    }
  });

  // Calculate retention rate
  const retentionRate = useMemo(() => {
    if (allQuestions.length === 0) return 100;
    const reviewedCards = allQuestions.length - dueQuestions.length;
    return Math.round((reviewedCards / allQuestions.length) * 100);
  }, [allQuestions.length, dueQuestions.length]);

  // Calculate next review info
  const nextReviewInfo = useMemo(() => {
    if (!allQuestions.length) {
      return { time: null, count: 0 };
    }

    const now = new Date();
    const upcomingQuestions = allQuestions
      .filter(q => new Date(q.due) > now)
      .sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime());

    if (upcomingQuestions.length === 0) {
      return { time: null, count: 0 };
    }

    const nextDue = new Date(upcomingQuestions[0]!.due);
    const nextDueDate = nextDue.toDateString();
    
    // Count questions due on the same day
    const sameTimeCount = upcomingQuestions.filter(q => 
      new Date(q.due).toDateString() === nextDueDate
    ).length;

    // Format the time
    const formatTime = () => {
      const diff = nextDue.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const days = Math.floor(hours / 24);
      
      if (days > 0) {
        const time = nextDue.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        });
        if (days === 1) {
          return `Tomorrow at ${time}`;
        }
        return `In ${days} days at ${time}`;
      } else if (hours > 0) {
        return `In ${hours} hour${hours > 1 ? 's' : ''}`;
      } else {
        const minutes = Math.floor(diff / (1000 * 60));
        return `In ${minutes} minute${minutes !== 1 ? 's' : ''}`;
      }
    };

    return {
      time: formatTime(),
      count: sameTimeCount
    };
  }, [allQuestions]);

  // Build recent activity from real data
  const recentActivity = useMemo(() => {
    return contexts
      .slice(0, 3)
      .map(context => {
        const contextQuestions = allQuestions.filter(q => q.contextId === context.id);
        const contextDueQuestions = dueQuestions.filter(q => q.contextId === context.id);
        
        let action = '';
        if (contextQuestions.length === 0) {
          action = 'No questions yet';
        } else if (contextDueQuestions.length > 0) {
          action = `${contextDueQuestions.length} cards due`;
        } else {
          action = `${contextQuestions.length} cards learned`;
        }

        // Format time based on creation date
        const formatRelativeTime = (date: Date) => {
          const now = new Date();
          const diff = now.getTime() - date.getTime();
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const days = Math.floor(hours / 24);
          
          if (days > 0) {
            return days === 1 ? 'yesterday' : `${days} days ago`;
          } else if (hours > 0) {
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
          } else {
            return 'just now';
          }
        };

        return {
          context: context.name,
          action,
          time: formatRelativeTime(new Date(context.createdAt))
        };
      });
  }, [contexts, allQuestions, dueQuestions]);

  // Calculate streak (simplified - in production would need review history)
  const currentStreak = useMemo(() => {
    // For now, use a simple calculation based on having reviewed cards
    const hasReviewedRecently = allQuestions.length > dueQuestions.length;
    return hasReviewedRecently ? 7 : 0; // Mock value for demo
  }, [allQuestions.length, dueQuestions.length]);

  // Handle loading sample content
  const handleLoadSampleContent = async () => {
    const sampleContent = `
Photosynthesis is the process by which plants and other organisms convert light energy into chemical energy. This process is fundamental to life on Earth as it provides the primary source of organic compounds and oxygen.

The overall equation for photosynthesis is:
6CO2 + 6H2O + light energy → C6H12O6 + 6O2

There are two main stages of photosynthesis:

1. Light-dependent reactions (Light reactions):
- Occur in the thylakoid membranes
- Require light to produce ATP and NADPH
- Water molecules are split (photolysis) releasing oxygen as a byproduct
- Chlorophyll absorbs light energy to drive the process

2. Light-independent reactions (Calvin Cycle):
- Occur in the stroma of chloroplasts
- Use ATP and NADPH from light reactions
- Carbon dioxide is fixed into organic molecules
- Produces glucose through a series of enzymatic reactions

Key factors affecting photosynthesis rate:
- Light intensity: Higher intensity increases rate until saturation
- Carbon dioxide concentration: More CO2 generally increases rate
- Temperature: Optimal around 25-35°C for most plants
- Water availability: Essential for the process
    `.trim();

    createContext.mutate({
      name: 'Biology: Photosynthesis',
      text: sampleContent
    });
  };

  const isLoading = loadingContexts || loadingQuestions;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // First time user state (no contexts)
  if (contexts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
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
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={onAddContext}
            >
              <div className="text-3xl mb-3">🔗</div>
              <h3 className="font-medium mb-2">Add from URL</h3>
              <p className="text-sm text-muted-foreground">Paste any article or webpage</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={onAddContext}
            >
              <div className="text-3xl mb-3">📝</div>
              <h3 className="font-medium mb-2">Add from Text</h3>
              <p className="text-sm text-muted-foreground">Type or paste your notes</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={handleLoadSampleContent}
              style={{ opacity: createContext.isPending ? 0.6 : 1 }}
            >
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-medium mb-2">Try Sample Content</h3>
              <p className="text-sm text-muted-foreground">
                {createContext.isPending ? 'Loading...' : 'Load example biology flashcards'}
              </p>
            </motion.div>
          </div>
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
          <p className="text-muted-foreground text-lg mb-8">
            You've completed all reviews. Great work staying consistent!
          </p>

          {nextReviewInfo.time && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
              <h3 className="font-medium mb-2">Next review session:</h3>
              <p className="text-primary text-lg font-semibold">
                {nextReviewInfo.time} ({nextReviewInfo.count} card{nextReviewInfo.count !== 1 ? 's' : ''})
              </p>
            </div>
          )}

          <div className="text-left mb-6">
            <h3 className="font-medium mb-3">While you wait:</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Add new content to learn</li>
              <li>• Review your progress stats</li>
              <li>• Browse your knowledge library</li>
            </ul>
          </div>

          <div className="flex justify-center space-x-3">
            <Button onClick={onAddContext} className="bg-primary hover:bg-primary/90 text-white">
              Add Context
            </Button>
            <Button>
              View Stats
            </Button>
          </div>
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
          <p className="text-lg text-muted-foreground mb-8">
            📚 You have <strong>{totalDueCards} cards</strong> ready for review
          </p>
          
          <div className="mb-6">
            <Button 
              onClick={onStartReview}
              className="bg-primary hover:bg-primary/90 text-white px-12 py-4 text-lg rounded-xl"
              size="lg"
            >
              Start Review ({totalDueCards} cards)
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold mb-4">Quick Stats</h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl mb-2">🔥</div>
              <div className="text-lg font-semibold">{currentStreak} day streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">📊</div>
              <div className="text-lg font-semibold">{retentionRate}% retention rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">⏰</div>
              {nextReviewInfo.time ? (
                <>
                  <div className="text-lg font-semibold">Next review {nextReviewInfo.time}</div>
                  <div className="text-sm text-muted-foreground">({nextReviewInfo.count} cards)</div>
                </>
              ) : (
                <div className="text-lg font-semibold">No upcoming reviews</div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        {recentActivity.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50"
                >
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <div className="flex-1">
                    <span className="font-medium">{activity.context}:</span>{' '}
                    <span>{activity.action}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{activity.time}</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex justify-center space-x-4">
          <Button
            onClick={onFilterReview}
            className="px-6"
          >
            Filter Review
          </Button>
          <Button
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