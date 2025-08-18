'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { api } from '~/trpc/react';
import { toast } from 'sonner';

interface AddContextModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddContextModal({ isOpen, onClose, onSuccess }: AddContextModalProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<'url' | 'text'>('text');
  const [content, setContent] = useState('');

  const utils = api.useUtils();
  const createContext = api.context.create.useMutation({
    onSuccess: () => {
      toast.success('Context created successfully! AI is generating questions...');
      // Invalidate queries to refresh data
      utils.context.list.invalidate();
      utils.question.list.invalidate();
      utils.question.getDue.invalidate();
      
      // Reset form
      setName('');
      setContent('');
      setType('text');
      
      // Call parent's onSuccess callback
      onSuccess?.();
      onClose();
    },
    onError: (error) => {
      toast.error(`Failed to create context: ${error.message}`);
    }
  });

  // Auto-detect URL from content
  useEffect(() => {
    if (!content) return;
    
    const urlPattern = /^https?:\/\//i;
    const isUrl = urlPattern.test(content.trim());
    
    if (isUrl && type !== 'url') {
      setType('url');
      // Auto-generate name from URL if name is empty
      if (!name) {
        try {
          const url = new URL(content.trim());
          const hostname = url.hostname.replace('www.', '');
          const pathname = url.pathname.replace(/\/$/, '');
          const lastSegment = pathname.split('/').pop();
          
          if (lastSegment && lastSegment !== '') {
            // Use the last part of the URL path as name
            const suggestedName = lastSegment
              .replace(/[-_]/g, ' ')
              .replace(/\.(html?|pdf|php|aspx?)$/i, '')
              .split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
            setName(suggestedName);
          } else {
            // Use hostname as name
            setName(hostname.charAt(0).toUpperCase() + hostname.slice(1));
          }
        } catch {
          // Invalid URL, ignore
        }
      }
    } else if (!isUrl && type !== 'text') {
      setType('text');
      // Auto-generate name from text if name is empty
      if (!name && content.trim().length > 0) {
        const words = content.trim().split(/\s+/).slice(0, 5).join(' ');
        const suggestedName = words.length > 30 
          ? words.substring(0, 30) + '...'
          : words;
        setName(suggestedName);
      }
    }
  }, [content, type, name]);

  const handleSubmit = () => {
    if (!name.trim() || !content.trim()) return;

    // Validate URL format if URL type is selected
    if (type === 'url') {
      try {
        new URL(content.trim());
      } catch {
        toast.error('Please enter a valid URL');
        return;
      }
    }

    // Make the actual API call
    if (type === 'url') {
      createContext.mutate({
        name: name.trim(),
        url: content.trim()
      });
    } else {
      createContext.mutate({
        name: name.trim(),
        text: content.trim()
      });
    }
  };

  const handleClose = () => {
    if (createContext.isPending) return; // Don't close while submitting
    setName('');
    setContent('');
    setType('text');
    onClose();
  };

  const handleContentChange = (value: string) => {
    setContent(value);
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
          className="bg-white rounded-2xl shadow-lg w-full max-w-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Add Learning Content</h2>
              <button
                onClick={handleClose}
                disabled={createContext.isPending}
                className="text-muted-foreground hover:text-primary text-lg w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors disabled:opacity-50"
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
                placeholder="e.g., Photosynthesis Overview"
                className="w-full"
                disabled={createContext.isPending}
              />
            </div>

            {/* Type Selection */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Content type:
              </label>
              <div className="flex space-x-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="url"
                    checked={type === 'url'}
                    onChange={(e) => setType(e.target.value as 'url' | 'text')}
                    disabled={createContext.isPending}
                    className="w-4 h-4 text-primary border-border focus:ring-primary"
                  />
                  <span>URL</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="text"
                    checked={type === 'text'}
                    onChange={(e) => setType(e.target.value as 'url' | 'text')}
                    disabled={createContext.isPending}
                    className="w-4 h-4 text-primary border-border focus:ring-primary"
                  />
                  <span>Text</span>
                </label>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {type === 'url' 
                  ? 'Paste a URL and we\'ll extract the content'
                  : 'Paste or type your learning material'}
              </p>
            </div>

            {/* Content Input */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {type === 'url' ? 'URL:' : 'Content:'}
              </label>
              <Textarea
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder={
                  type === 'url' 
                    ? "https://example.com/article-about-photosynthesis"
                    : "Paste your learning content here...\n\nFor example:\nPhotosynthesis is the process by which plants convert light energy into chemical energy..."
                }
                className="min-h-40 resize-none"
                disabled={createContext.isPending}
              />
            </div>

            {/* Info Note */}
            <div className="flex items-start space-x-2 p-3 bg-primary/10 rounded-lg">
              <span className="text-primary mt-0.5">ℹ️</span>
              <div className="text-sm text-primary">
                <p className="font-medium mb-1">What happens next:</p>
                <ul className="space-y-1 text-xs">
                  <li>• AI analyzes your content</li>
                  <li>• Generates smart flashcards using spaced repetition</li>
                  <li>• Questions appear in your review queue</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border bg-gray-50">
            <div className="flex justify-end space-x-3">
              <Button
                onClick={handleClose}
                disabled={createContext.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!name.trim() || !content.trim() || createContext.isPending}
                className="bg-primary hover:bg-primary/90 text-white min-w-48"
              >
                {createContext.isPending ? (
                  <motion.div className="flex items-center space-x-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                    <span>Creating Context...</span>
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