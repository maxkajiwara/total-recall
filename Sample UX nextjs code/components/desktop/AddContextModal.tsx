'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

interface AddContextModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; type: 'url' | 'text'; content: string }) => void;
}

export default function AddContextModal({ isOpen, onClose, onSubmit }: AddContextModalProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<'url' | 'text'>('text');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !content.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onSubmit({
      name: name.trim(),
      type,
      content: content.trim()
    });
    
    // Reset form
    setName('');
    setContent('');
    setType('text');
    setIsSubmitting(false);
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setName('');
    setContent('');
    setType('text');
    onClose();
  };

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
          className="bg-surface rounded-2xl shadow-lg-custom w-full max-w-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-custom">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Add Learning Content</h2>
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="text-secondary hover:text-primary-custom text-lg w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-hover transition-colors disabled:opacity-50"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Name your content:
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Photosynthesis Overview"
                className="w-full"
                disabled={isSubmitting}
              />
            </div>

            {/* Type Selection */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Add from:
              </label>
              <div className="flex space-x-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="url"
                    checked={type === 'url'}
                    onChange={(e) => setType(e.target.value as 'url' | 'text')}
                    disabled={isSubmitting}
                    className="w-4 h-4 text-primary-custom border-custom focus:ring-primary-custom"
                  />
                  <span>URL</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="text"
                    checked={type === 'text'}
                    onChange={(e) => setType(e.target.value as 'url' | 'text')}
                    disabled={isSubmitting}
                    className="w-4 h-4 text-primary-custom border-custom focus:ring-primary-custom"
                  />
                  <span>Text</span>
                </label>
              </div>
            </div>

            {/* Content Input */}
            <div>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={
                  type === 'url' 
                    ? "https://example.com/article-about-photosynthesis"
                    : "Photosynthesis is the process by which plants convert light energy into chemical energy. The process occurs in chloroplasts and involves two main stages..."
                }
                className="min-h-40 resize-none"
                disabled={isSubmitting}
              />
            </div>

            {/* Info Note */}
            <div className="flex items-start space-x-2 p-3 bg-primary-light rounded-lg">
              <span className="text-primary-custom mt-0.5">ℹ️</span>
              <p className="text-sm text-primary-custom">
                AI will automatically generate flashcards from your content using spaced repetition principles.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-custom bg-surface-hover">
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!name.trim() || !content.trim() || isSubmitting}
                className="bg-primary-custom hover:bg-primary-hover text-white min-w-48"
              >
                {isSubmitting ? (
                  <motion.div className="flex items-center space-x-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                    <span>Generating...</span>
                  </motion.div>
                ) : (
                  'Add & Generate Questions'
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}