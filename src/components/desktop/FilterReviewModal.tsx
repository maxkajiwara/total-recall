'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { api } from '~/trpc/react';

interface FilterReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartReview: (selectedContextIds: string[]) => void;
}

export default function FilterReviewModal({ isOpen, onClose, onStartReview }: FilterReviewModalProps) {
  const [selectedContexts, setSelectedContexts] = useState<string[]>([]);

  // Fetch real data
  const { data: contexts = [], isLoading: loadingContexts } = api.context.list.useQuery();
  const { data: dueQuestions = [], isLoading: loadingDue } = api.question.getDue.useQuery({ limit: 100 });
  const { data: allQuestions = [] } = api.question.list.useQuery();

  // Process contexts with due counts
  const processedContexts = useMemo(() => {
    // Get emoji based on context name
    const getEmoji = (name: string) => {
      const lowerName = name.toLowerCase();
      if (lowerName.includes('biology') || lowerName.includes('bio')) return '🧬';
      if (lowerName.includes('physics')) return '⚛️';
      if (lowerName.includes('spanish') || lowerName.includes('español')) return '🇪🇸';
      if (lowerName.includes('math') || lowerName.includes('mathematics')) return '🔢';
      if (lowerName.includes('chemistry') || lowerName.includes('chem')) return '🧪';
      if (lowerName.includes('history')) return '🏛️';
      if (lowerName.includes('english') || lowerName.includes('language')) return '📚';
      if (lowerName.includes('computer') || lowerName.includes('programming')) return '💻';
      if (lowerName.includes('art')) return '🎨';
      if (lowerName.includes('music')) return '🎵';
      if (lowerName.includes('geography')) return '🌍';
      if (lowerName.includes('psychology')) return '🧠';
      return '📝';
    };

    return contexts
      .map(context => {
        // Count due cards for this context
        const contextDueCards = dueQuestions.filter(q => q.contextId === context.id);
        const contextTotalCards = allQuestions.filter(q => q.contextId === context.id);
        
        return {
          id: context.id.toString(), // Convert to string for consistency
          name: context.name,
          emoji: getEmoji(context.name),
          dueCards: contextDueCards.length,
          totalCards: contextTotalCards.length
        };
      })
      .filter(context => context.totalCards > 0) // Only show contexts with questions
      .sort((a, b) => b.dueCards - a.dueCards); // Sort by due cards descending
  }, [contexts, dueQuestions, allQuestions]);

  const handleContextToggle = (contextId: string) => {
    setSelectedContexts(prev => 
      prev.includes(contextId)
        ? prev.filter(id => id !== contextId)
        : [...prev, contextId]
    );
  };

  const handleStartReview = () => {
    if (selectedContexts.length > 0) {
      onStartReview(selectedContexts);
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedContexts([]);
    onClose();
  };

  const handleSelectAll = () => {
    const contextsWithDue = processedContexts.filter(c => c.dueCards > 0);
    if (selectedContexts.length === contextsWithDue.length) {
      // Deselect all
      setSelectedContexts([]);
    } else {
      // Select all contexts with due cards
      setSelectedContexts(contextsWithDue.map(c => c.id));
    }
  };

  const totalSelectedCards = processedContexts
    .filter(c => selectedContexts.includes(c.id))
    .reduce((sum, c) => sum + c.dueCards, 0);

  const isLoading = loadingContexts || loadingDue;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="bg-white rounded-2xl shadow-lg w-full max-w-md overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Select Contexts to Review</h2>
              <button
                onClick={handleClose}
                className="text-muted-foreground hover:text-primary text-lg w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading contexts...</p>
              </div>
            ) : processedContexts.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📚</div>
                <p className="text-muted-foreground">No contexts with questions yet.</p>
                <p className="text-sm text-muted-foreground mt-2">Add some content to get started!</p>
              </div>
            ) : processedContexts.filter(c => c.dueCards > 0).length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">✨</div>
                <p className="text-muted-foreground">No cards due for review!</p>
                <p className="text-sm text-muted-foreground mt-2">Great work staying on top of your reviews.</p>
              </div>
            ) : (
              <>
                {/* Select All button for multiple contexts with due cards */}
                {processedContexts.filter(c => c.dueCards > 0).length > 1 && (
                  <div className="flex justify-end pb-2">
                    <button
                      onClick={handleSelectAll}
                      className="text-sm text-primary hover:text-primary/80 transition-colors"
                    >
                      {selectedContexts.length === processedContexts.filter(c => c.dueCards > 0).length
                        ? 'Deselect All'
                        : 'Select All'}
                    </button>
                  </div>
                )}
                
                {processedContexts.map((context) => (
                  <motion.label
                    key={context.id}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      context.dueCards === 0 
                        ? 'opacity-50 cursor-not-allowed border-gray-100'
                        : selectedContexts.includes(context.id)
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-100 hover:border-primary/30 hover:bg-gray-50'
                    }`}
                    whileHover={context.dueCards > 0 ? { scale: 1.01 } : {}}
                    whileTap={context.dueCards > 0 ? { scale: 0.99 } : {}}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedContexts.includes(context.id)}
                        onChange={() => context.dueCards > 0 && handleContextToggle(context.id)}
                        disabled={context.dueCards === 0}
                        className="w-4 h-4 text-primary border-border rounded focus:ring-primary disabled:opacity-50"
                      />
                      <span className="text-xl">{context.emoji}</span>
                      <div>
                        <div className="font-medium">{context.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {context.dueCards > 0 ? (
                            <span className="text-primary font-medium">{context.dueCards} cards due</span>
                          ) : (
                            <span>No cards due</span>
                          )}
                          {' '}
                          <span className="text-gray-400">
                            ({context.totalCards} total)
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {context.dueCards > 0 && selectedContexts.includes(context.id) && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-primary text-white text-xs px-2 py-1 rounded-full font-medium"
                      >
                        {context.dueCards}
                      </motion.div>
                    )}
                  </motion.label>
                ))}
              </>
            )}

            {totalSelectedCards > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center pt-4 border-t border-gray-100"
              >
                <p className="text-lg font-medium">
                  Total: <span className="text-primary">{totalSelectedCards} cards</span> selected
                </p>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border bg-gray-50">
            <div className="flex justify-end space-x-3">
              <Button
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                onClick={handleStartReview}
                disabled={totalSelectedCards === 0}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                Start Review →
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}