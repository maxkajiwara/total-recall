'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface Context {
  id: string;
  name: string;
  emoji: string;
  description: string;
  totalQuestions: number;
  dueCards: number;
  retentionRate: number;
}

interface LibraryViewProps {
  onAddContext: () => void;
  onReviewContext: (contextId: string) => void;
}

export default function LibraryView({ onAddContext, onReviewContext }: LibraryViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('due');

  // Mock context data
  const contexts: Context[] = [
    {
      id: 'biology',
      name: 'Biology',
      emoji: '🧬',
      description: 'Photosynthesis, Cell structure, Genetics...',
      totalQuestions: 45,
      dueCards: 12,
      retentionRate: 85
    },
    {
      id: 'physics',
      name: 'Physics',
      emoji: '⚛️',
      description: 'Quantum mechanics, Thermodynamics, Optics...',
      totalQuestions: 32,
      dueCards: 8,
      retentionRate: 92
    },
    {
      id: 'spanish',
      name: 'Spanish',
      emoji: '🇪🇸',
      description: 'Vocabulary, Grammar, Conversations...',
      totalQuestions: 28,
      dueCards: 0,
      retentionRate: 78
    },
    {
      id: 'mathematics',
      name: 'Mathematics',
      emoji: '🔢',
      description: 'Calculus, Linear algebra, Statistics...',
      totalQuestions: 15,
      dueCards: 3,
      retentionRate: 95
    }
  ];

  const filteredContexts = contexts.filter(context =>
    context.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    context.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedContexts = [...filteredContexts].sort((a, b) => {
    switch (sortBy) {
      case 'due':
        return b.dueCards - a.dueCards;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'retention':
        return b.retentionRate - a.retentionRate;
      default:
        return 0;
    }
  });

  const handleContextAction = (contextId: string, action: string) => {
    console.log(`${action} context:`, contextId);
    // TODO: Implement context actions
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold mb-2">My Learning Library</h1>
          <p className="text-muted-foreground">Manage your learning contexts and flashcards</p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-4">
          <Button 
            onClick={onAddContext}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            + Add Context
          </Button>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Input
                placeholder="🔍 Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-80"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:border-primary focus:outline-none cursor-pointer"
              >
                <option value="due">Due</option>
                <option value="name">Name</option>
                <option value="retention">Retention</option>
              </select>
            </div>
          </div>
        </div>

        {/* Context Table */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-4 px-6 font-medium text-muted-foreground">Name</th>
                  <th className="text-left py-4 px-4 font-medium text-muted-foreground">Questions</th>
                  <th className="text-left py-4 px-4 font-medium text-muted-foreground">Due</th>
                  <th className="text-left py-4 px-4 font-medium text-muted-foreground">Retention</th>
                  <th className="text-right py-4 px-6 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedContexts.map((context, index) => (
                  <motion.tr
                    key={context.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl">{context.emoji}</span>
                        <div>
                          <div className="font-medium text-lg">{context.name}</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {context.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium">{context.totalQuestions}</span>
                    </td>
                    <td className="py-4 px-4">
                      {context.dueCards > 0 ? (
                        <span className="bg-primary text-white px-2 py-1 rounded-full text-sm font-medium">
                          {context.dueCards}
                        </span>
                      ) : (
                        <span className="text-gray-400">0</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-600 rounded-full"
                            style={{ width: `${context.retentionRate}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{context.retentionRate}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end space-x-2">
                        {context.dueCards > 0 && (
                          <Button
                            size="sm"
                            onClick={() => onReviewContext(context.id)}
                            className="bg-primary hover:bg-primary/90 text-white text-xs"
                          >
                            Review
                          </Button>
                        )}
                        <div className="relative">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleContextAction(context.id, 'menu')}
                            className="p-2"
                          >
                            ⋯
                          </Button>
                          {/* TODO: Add dropdown menu */}
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {sortedContexts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-muted-foreground">No contexts found matching your search.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}