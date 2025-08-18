import { useState } from 'react';
import { motion } from 'motion/react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface Context {
  id: string;
  name: string;
  emoji: string;
  totalCards: number;
  dueCards: number;
  retentionRate?: number;
  isSelected: boolean;
}

interface DesktopSidebarProps {
  selectedContexts: string[];
  onContextSelectionChange: (contextIds: string[]) => void;
  onStartReview: () => void;
  onAddContext: () => void;
}

export function DesktopSidebar({ 
  selectedContexts, 
  onContextSelectionChange, 
  onStartReview,
  onAddContext 
}: DesktopSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const contexts: Context[] = [
    {
      id: 'all',
      name: 'All',
      emoji: '📚',
      totalCards: 45,
      dueCards: 12,
      isSelected: selectedContexts.includes('all')
    },
    {
      id: 'biology',
      name: 'Biology',
      emoji: '🧬',
      totalCards: 18,
      dueCards: 5,
      retentionRate: 89,
      isSelected: selectedContexts.includes('biology')
    },
    {
      id: 'physics',
      name: 'Physics',
      emoji: '⚛️',
      totalCards: 15,
      dueCards: 3,
      retentionRate: 92,
      isSelected: selectedContexts.includes('physics')
    },
    {
      id: 'spanish',
      name: 'Spanish',
      emoji: '🇪🇸',
      totalCards: 22,
      dueCards: 4,
      retentionRate: 87,
      isSelected: selectedContexts.includes('spanish')
    },
    {
      id: 'math',
      name: 'Math',
      emoji: '🔢',
      totalCards: 12,
      dueCards: 0,
      retentionRate: 94,
      isSelected: selectedContexts.includes('math')
    }
  ];

  const filteredContexts = contexts.filter(context =>
    context.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContextToggle = (contextId: string) => {
    if (contextId === 'all') {
      // If selecting "All", clear other selections
      onContextSelectionChange(['all']);
    } else {
      // Remove "all" if selecting specific contexts
      let newSelection = selectedContexts.filter(id => id !== 'all');
      
      if (selectedContexts.includes(contextId)) {
        newSelection = newSelection.filter(id => id !== contextId);
      } else {
        newSelection = [...newSelection, contextId];
      }
      
      // If no specific contexts selected, default to "all"
      if (newSelection.length === 0) {
        newSelection = ['all'];
      }
      
      onContextSelectionChange(newSelection);
    }
  };

  const totalDueCards = selectedContexts.includes('all') 
    ? contexts.find(c => c.id === 'all')?.dueCards || 0
    : contexts
        .filter(c => selectedContexts.includes(c.id))
        .reduce((sum, c) => sum + c.dueCards, 0);

  return (
    <div className="desktop-sidebar flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-subtle">
        <h2 className="font-semibold text-lg mb-4">Contexts</h2>
        
        <div className="relative">
          <Input
            placeholder="🔍 Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {/* Context List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {filteredContexts.map((context) => (
            <motion.button
              key={context.id}
              onClick={() => handleContextToggle(context.id)}
              className={`w-full text-left p-3 rounded-lg transition-colors focus-ring ${
                context.isSelected 
                  ? 'bg-primary-light text-primary-custom border border-primary-custom/20' 
                  : 'hover:bg-surface-hover border border-transparent'
              }`}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={context.isSelected}
                    readOnly
                    className="rounded border-custom text-primary-custom focus:ring-primary-custom"
                  />
                  <span className="text-lg">{context.emoji}</span>
                  <div>
                    <div className="font-medium">{context.name}</div>
                    <div className="text-sm text-secondary">
                      ({context.totalCards})
                    </div>
                  </div>
                </div>
                
                {context.dueCards > 0 && (
                  <div className="text-xs bg-primary-custom text-white px-2 py-1 rounded-full">
                    {context.dueCards}
                  </div>
                )}
              </div>
              
              {context.id !== 'all' && context.dueCards > 0 && (
                <div className="mt-2 text-xs text-secondary">
                  {context.dueCards} due
                  {context.retentionRate && (
                    <span className="ml-2">• {context.retentionRate}% retention</span>
                  )}
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      {totalDueCards > 0 && (
        <div className="p-4 border-t border-subtle">
          <Button
            onClick={onStartReview}
            className="w-full bg-primary-custom hover:bg-primary-hover text-white mb-3"
          >
            Review {totalDueCards} Card{totalDueCards !== 1 ? 's' : ''}
          </Button>
          <Button
            variant="outline"
            onClick={onAddContext}
            className="w-full"
          >
            Add Context
          </Button>
        </div>
      )}
    </div>
  );
}