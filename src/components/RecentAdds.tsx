"use client";

import { api } from "~/trpc/react";
import { Trash2 } from "lucide-react";
import { useState } from "react";

export function RecentAdds() {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  
  const { data: contexts, isLoading, error } = api.context.list.useQuery();
  const utils = api.useUtils();
  
  const deleteContext = api.context.delete.useMutation({
    onMutate: async ({ id }) => {
      setDeletingId(id);
      // Optimistic update
      await utils.context.list.cancel();
      const previousData = utils.context.list.getData();
      
      utils.context.list.setData(undefined, (old) => 
        old?.filter(context => context.id !== id)
      );
      
      return { previousData };
    },
    onError: (err, { id }, context) => {
      // Rollback on error
      if (context?.previousData) {
        utils.context.list.setData(undefined, context.previousData);
      }
      setDeletingId(null);
      alert('Failed to delete content. Please try again.');
    },
    onSuccess: () => {
      utils.context.list.invalidate();
      utils.question.list.invalidate();
      utils.question.getDue.invalidate();
    },
    onSettled: () => {
      setDeletingId(null);
    },
  });
  
  const handleDelete = async (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}" and all its flashcards?`)) {
      deleteContext.mutate({ id });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-4 border border-border animate-pulse">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl p-4 border border-border">
        <p className="text-sm text-red-600">Failed to load recent content</p>
      </div>
    );
  }

  const recentContexts = contexts?.slice(0, 8) ?? [];

  if (recentContexts.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 border border-border text-center">
        <div className="text-4xl mb-3">📚</div>
        <p className="text-sm text-muted-foreground">No content added yet</p>
        <p className="text-xs text-muted-foreground mt-1">Your recent content will appear here</p>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return diffInMinutes < 1 ? "Just now" : `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return diffInDays === 1 ? "1 day ago" : `${diffInDays} days ago`;
    }
  };

  const getContentTypeEmoji = (context: typeof recentContexts[0]) => {
    if (context.url) {
      return "🔗";
    } else {
      return "📝";
    }
  };

  const getSubjectEmoji = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('biology') || lowerName.includes('plant') || lowerName.includes('photosynthesis')) {
      return "🧬";
    } else if (lowerName.includes('physics') || lowerName.includes('quantum')) {
      return "⚛️";
    } else if (lowerName.includes('language') || lowerName.includes('spanish') || lowerName.includes('english')) {
      return "📚";
    } else if (lowerName.includes('math') || lowerName.includes('calculus')) {
      return "🔢";
    } else if (lowerName.includes('history')) {
      return "🏛️";
    } else if (lowerName.includes('chemistry')) {
      return "🧪";
    }
    return "📝"; // Default emoji for general content
  };

  const truncateName = (name: string, maxLength = 50) => {
    return name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;
  };

  const getContentPreview = (context: typeof recentContexts[0]) => {
    if (context.url) {
      try {
        const url = new URL(context.url);
        return url.hostname.replace('www.', '');
      } catch {
        return context.url;
      }
    } else {
      return context.name;
    }
  };

  return (
    <div className="space-y-4">
      {recentContexts.map((context) => (
        <div
          key={context.id}
          className="bg-white rounded-xl p-4 border border-border hover:shadow-md transition-all group relative"
        >
          <div className="flex items-start space-x-3">
            <div className="text-2xl flex-shrink-0">
              {getSubjectEmoji(context.name)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-foreground mb-1">
                    {context.name.split(' - ')[0] || 'Untitled'}
                  </h4>
                  <p className="text-sm text-secondary truncate">
                    {getContentPreview(context)}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <p className="text-xs text-muted-foreground">
                    {formatDate(context.createdAt)}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(context.id, context.name);
                    }}
                    disabled={deletingId === context.id}
                    className="transition-opacity p-1.5 rounded-lg hover:bg-red-50 text-red-500 hover:text-red-600 disabled:opacity-50"
                    aria-label="Delete content"
                  >
                    {deletingId === context.id ? (
                      <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}