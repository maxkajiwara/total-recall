'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/button';

interface Context {
  id: string;
  name: string;
  emoji: string;
  dueCards: number;
}

interface FilterReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartReview: (selectedContextIds: string[]) => void;
}

export default function FilterReviewModal({ isOpen, onClose, onStartReview }: FilterReviewModalProps) {
  const [selectedContexts, setSelectedContexts] = useState<string[]>([]);

  // Mock context data
  const contexts: Context[] = [
    { id: 'biology', name: 'Biology', emoji: '🧬', dueCards: 5 },
    { id: 'physics', name: 'Physics', emoji: '⚛️', dueCards: 3 },
    { id: 'spanish', name: 'Spanish', emoji: '🇪🇸', dueCards: 4 },
    { id: 'math', name: 'Math', emoji: '🔢', dueCards: 0 }
  ];

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

  const totalSelectedCards = contexts
    .filter(c => selectedContexts.includes(c.id))
    .reduce((sum, c) => sum + c.dueCards, 0);

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
          className="bg-surface rounded-2xl shadow-lg-custom w-full max-w-md overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-custom">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Select Contexts to Review</h2>
              <button
                onClick={handleClose}
                className="text-secondary hover:text-primary-custom text-lg w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-hover transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {contexts.map((context) => (
              <motion.label
                key={context.id}
                className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  selectedContexts.includes(context.id)
                    ? 'border-primary-custom bg-primary-light'
                    : 'border-border-subtle hover:border-primary-custom/30 hover:bg-surface-hover'
                }`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedContexts.includes(context.id)}
                    onChange={() => handleContextToggle(context.id)}
                    className="w-4 h-4 text-primary-custom border-custom rounded focus:ring-primary-custom"
                  />
                  <span className="text-xl">{context.emoji}</span>
                  <div>
                    <div className="font-medium">{context.name}</div>
                    <div className="text-sm text-secondary">
                      ({context.dueCards} cards due)
                    </div>
                  </div>
                </div>
                
                {context.dueCards > 0 && selectedContexts.includes(context.id) && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-primary-custom text-white text-xs px-2 py-1 rounded-full font-medium"
                  >
                    {context.dueCards}
                  </motion.div>
                )}
              </motion.label>
            ))}

            {totalSelectedCards > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center pt-4 border-t border-subtle"
              >
                <p className="text-lg font-medium">
                  Total: <span className="text-primary-custom">{totalSelectedCards} cards</span> selected
                </p>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-custom bg-surface-hover">
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                onClick={handleStartReview}
                disabled={totalSelectedCards === 0}
                className="bg-primary-custom hover:bg-primary-hover text-white"
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