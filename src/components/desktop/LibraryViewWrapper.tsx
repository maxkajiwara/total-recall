'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { api } from '~/trpc/react';
import { toast } from 'sonner';

interface LibraryViewWrapperProps {
  onAddContext: () => void;
  onReviewContext: (contextId: string) => void;
}

export default function LibraryViewWrapper({ onAddContext, onReviewContext }: LibraryViewWrapperProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('due');

  // Fetch real context data
  const { data: contexts = [], isLoading } = api.context.list.useQuery();
  const { data: allQuestions = [] } = api.question.list.useQuery();
  const { data: dueQuestions = [] } = api.question.getDue.useQuery({ limit: 100 });
  
  const utils = api.useUtils();
  const deleteContext = api.context.delete.useMutation({
    onSuccess: () => {
      toast.success('Context deleted successfully');
      utils.context.list.invalidate();
      utils.question.list.invalidate();
      utils.question.getDue.invalidate();
    },
    onError: (error) => {
      toast.error(`Failed to delete context: ${error.message}`);
    }
  });

  // Process contexts to add computed fields
  const processedContexts = contexts.map(context => {
    const contextQuestions = allQuestions.filter(q => q.contextId === context.id);
    const contextDueQuestions = dueQuestions.filter(q => q.contextId === context.id);
    
    // Calculate retention rate (simplified - percentage of questions not due)
    const retentionRate = contextQuestions.length > 0 
      ? Math.round(((contextQuestions.length - contextDueQuestions.length) / contextQuestions.length) * 100)
      : 100;
    
    // Get emoji based on context name
    const getEmoji = (name: string) => {
      const lowerName = name.toLowerCase();
      if (lowerName.includes('biology') || lowerName.includes('bio')) return '🧬';
      if (lowerName.includes('physics')) return '⚛️';
      if (lowerName.includes('spanish') || lowerName.includes('español')) return '🇪🇸';
      if (lowerName.includes('math') || lowerName.includes('mathematics')) return '🔢';
      if (lowerName.includes('chemistry')) return '🧪';
      if (lowerName.includes('history')) return '🏛️';
      if (lowerName.includes('english') || lowerName.includes('language')) return '📚';
      return '📝';
    };
    
    return {
      id: context.id.toString(),
      name: context.name,
      emoji: getEmoji(context.name),
      description: context.url ? new URL(context.url).hostname : 'Text content',
      totalQuestions: contextQuestions.length,
      dueCards: contextDueQuestions.length,
      retentionRate
    };
  });

  const filteredContexts = processedContexts.filter(context =>
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
    if (action === 'delete') {
      if (confirm('Are you sure you want to delete this context and all its questions?')) {
        deleteContext.mutate({ id: parseInt(contextId) });
      }
    }
    // TODO: Implement other context actions (edit, regenerate questions)
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-custom mx-auto mb-4"></div>
          <p className="text-secondary">Loading your library...</p>
        </div>
      </div>
    );
  }

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
          <p className="text-secondary">Manage your learning contexts and flashcards</p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-4">
          <Button 
            onClick={onAddContext}
            className="bg-primary-custom hover:bg-primary-hover text-white"
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
              <span className="text-sm text-secondary">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border border-custom rounded-lg px-3 py-2 bg-surface focus:border-primary-custom focus:outline-none"
              >
                <option value="due">Due ▼</option>
                <option value="name">Name ▼</option>
                <option value="retention">Retention ▼</option>
              </select>
            </div>
          </div>
        </div>

        {/* Context Table */}
        <div className="card-custom overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-subtle">
                  <th className="text-left py-4 px-6 font-medium text-secondary">Name</th>
                  <th className="text-left py-4 px-4 font-medium text-secondary">Questions</th>
                  <th className="text-left py-4 px-4 font-medium text-secondary">Due</th>
                  <th className="text-left py-4 px-4 font-medium text-secondary">Retention</th>
                  <th className="text-right py-4 px-6 font-medium text-secondary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedContexts.map((context, index) => (
                  <motion.tr
                    key={context.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-subtle hover:bg-surface-hover transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl">{context.emoji}</span>
                        <div>
                          <div className="font-medium text-lg">{context.name}</div>
                          <div className="text-sm text-secondary mt-1">
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
                        <span className="bg-primary-custom text-white px-2 py-1 rounded-full text-sm font-medium">
                          {context.dueCards}
                        </span>
                      ) : (
                        <span className="text-tertiary">0</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 h-2 bg-border-subtle rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-success rounded-full"
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
                            className="bg-primary-custom hover:bg-primary-hover text-white text-xs"
                          >
                            Review
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleContextAction(context.id, 'delete')}
                          className="p-2 text-error hover:bg-red-50"
                        >
                          🗑️
                        </Button>
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
            <p className="text-secondary">
              {searchQuery ? 'No contexts found matching your search.' : 'No contexts yet. Add your first one!'}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}