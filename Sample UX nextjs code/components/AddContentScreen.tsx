import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

type AddState = 'idle' | 'loading' | 'success' | 'error';

export function AddContentScreen() {
  const [input, setInput] = useState('');
  const [addState, setAddState] = useState<AddState>('idle');
  const [recentAdditions, setRecentAdditions] = useState([
    { text: 'What is photosynthesis?', type: 'text', time: '2 hours ago', context: 'Biology - Plant Processes' },
    { text: 'https://example.com/quantum-physics', type: 'url', time: '1 day ago', context: 'Physics - Quantum Mechanics' },
    { text: 'Spanish: Common phrases for travel', type: 'text', time: '2 days ago', context: 'Languages - Spanish' }
  ]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    } catch (err) {
      console.log('Failed to read clipboard');
    }
  };

  const handleAdd = async () => {
    if (!input.trim()) return;
    
    setAddState('loading');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate 90% success rate
    if (Math.random() > 0.1) {
      const newItem = {
        text: input.trim(),
        type: isValidUrl(input) ? 'url' : 'text',
        time: 'just now',
        context: isValidUrl(input) ? 'Web Content' : 'Custom Text'
      };
      setRecentAdditions(prev => [newItem as any, ...prev.slice(0, 4)]);
      setInput('');
      setAddState('success');
      
      // Reset to idle after showing success
      setTimeout(() => setAddState('idle'), 2000);
    } else {
      setAddState('error');
      setTimeout(() => setAddState('idle'), 3000);
    }
  };

  const isUrl = isValidUrl(input);

  return (
    <div className="flex flex-col h-full bg-warm p-6 pt-16 relative">
      {/* Swipe hint - only show on first visit */}
      <motion.div
        initial={{ opacity: 1, x: 20 }}
        animate={{ opacity: 0, x: 40 }}
        transition={{ delay: 3, duration: 1 }}
        className="absolute top-6 right-6 text-xs text-secondary bg-surface px-3 py-2 rounded-full border border-custom pointer-events-none"
      >
        Swipe to explore →
      </motion.div>

      <div className="flex-1">
        <div className="mb-8">
          <h1 className="mb-2">Add Learning Content</h1>
          <p className="text-secondary text-sm">
            Add URLs or text to create flashcards for spaced repetition learning
          </p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste a URL or enter text to create learning materials..."
              className="min-h-32 bg-surface border-custom shadow-custom resize-none text-base p-4 transition-colors"
              disabled={addState === 'loading'}
            />
            
            <AnimatePresence>
              {isUrl && input && addState === 'idle' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-2 p-3 bg-surface border border-success rounded-lg"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span className="text-sm text-success font-medium">URL detected</span>
                  </div>
                  <p className="text-sm text-secondary mt-1">
                    We'll extract key information to create flashcards
                  </p>
                </motion.div>
              )}
              
              {addState === 'loading' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-2 p-3 bg-surface border border-primary-custom rounded-lg"
                >
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-1 h-1 bg-primary-custom rounded-full"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: i * 0.2
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-primary-custom font-medium">
                      {isUrl ? 'Processing URL...' : 'Creating flashcards...'}
                    </span>
                  </div>
                </motion.div>
              )}
              
              {addState === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-2 p-3 bg-surface border border-success rounded-lg"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-success">✓</span>
                    <span className="text-sm text-success font-medium">Successfully added!</span>
                  </div>
                  <p className="text-sm text-secondary mt-1">
                    {isUrl ? '5 flashcards created from web content' : '3 flashcards created from your text'}
                  </p>
                </motion.div>
              )}
              
              {addState === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-2 p-3 bg-surface border border-red-300 rounded-lg"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-red-500">⚠</span>
                    <span className="text-sm text-red-600 font-medium">Failed to process</span>
                  </div>
                  <p className="text-sm text-secondary mt-1">
                    {isUrl ? 'Could not access the URL. Please try again.' : 'Something went wrong. Please try again.'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex space-x-3">
            <Button 
              onClick={handlePaste}
              variant="outline"
              className="flex-1 h-12 border-custom"
              disabled={addState === 'loading'}
            >
              📋 Paste
            </Button>
            <Button 
              onClick={handleAdd}
              disabled={!input.trim() || addState === 'loading'}
              className="flex-1 h-12 bg-primary-custom hover:bg-primary-custom/90 text-white relative overflow-hidden"
            >
              {addState === 'loading' ? (
                <motion.div className="flex items-center space-x-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                  <span>Adding...</span>
                </motion.div>
              ) : (
                <>➕ Add</>
              )}
            </Button>
          </div>
        </div>

        {recentAdditions.length > 0 && (
          <div className="mt-8">
            <h3 className="mb-4">Recent Additions</h3>
            <div className="space-y-3">
              {recentAdditions.map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-surface border-custom border rounded-lg shadow-custom"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs">
                          {item.type === 'url' ? '🔗' : '📝'}
                        </span>
                        <span className="text-xs text-secondary">{item.context}</span>
                      </div>
                      <p className="text-sm">{item.text}</p>
                      <p className="text-xs text-secondary mt-1">{item.time}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}