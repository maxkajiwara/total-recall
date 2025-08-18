'use client';

import { useState } from 'react';
import DesktopNavigation from './DesktopNavigation';
import HomeView from './HomeView';
import LibraryViewWrapper from './LibraryViewWrapper';
import StatsView from './StatsView';
import GraphView from './GraphView';
import DesktopReviewSession from './DesktopReviewSession';
import AddContextModal from './AddContextModal';
import FilterReviewModal from './FilterReviewModal';
import { api } from '~/trpc/react';
import { toast } from 'sonner';

type NavigationView = 'home' | 'library' | 'stats' | 'graph';

export default function DesktopLayoutWrapper() {
  const [currentView, setCurrentView] = useState<NavigationView>('home');
  const [isReviewSessionOpen, setIsReviewSessionOpen] = useState(false);
  const [isAddContextModalOpen, setIsAddContextModalOpen] = useState(false);
  const [isFilterReviewModalOpen, setIsFilterReviewModalOpen] = useState(false);
  const [selectedContextIds, setSelectedContextIds] = useState<number[]>([]);

  // Fetch real data
  const { data: dueQuestions } = api.question.getDue.useQuery({ limit: 100 });
  const totalDueCards = dueQuestions?.length ?? 0;
  
  // Calculate streak (simplified - you might want to add a proper API endpoint for this)
  const currentStreak = 7; // TODO: Calculate from actual data

  const utils = api.useUtils();
  const createContext = api.context.create.useMutation({
    onSuccess: () => {
      toast.success('Context created successfully!');
      utils.context.list.invalidate();
      utils.question.getDue.invalidate();
      setIsAddContextModalOpen(false);
    },
    onError: (error) => {
      toast.error(`Failed to create context: ${error.message}`);
    }
  });

  const handleStartReview = () => {
    setSelectedContextIds([]);
    setIsReviewSessionOpen(true);
  };

  const handleFilterReview = () => {
    setIsFilterReviewModalOpen(true);
  };

  const handleStartFilteredReview = (contextIds: string[]) => {
    setSelectedContextIds(contextIds.map(id => parseInt(id)));
    setIsFilterReviewModalOpen(false);
    setIsReviewSessionOpen(true);
  };

  const handleAddContext = () => {
    setIsAddContextModalOpen(true);
  };

  const handleAddContextSubmit = (data: { name: string; type: 'url' | 'text'; content: string }) => {
    if (data.type === 'url') {
      createContext.mutate({
        name: data.name,
        url: data.content,
      });
    } else {
      createContext.mutate({
        name: data.name,
        text: data.content,
      });
    }
  };

  const handleReviewContext = (contextId: string) => {
    setSelectedContextIds([parseInt(contextId)]);
    setIsReviewSessionOpen(true);
  };

  const handleReviewComplete = (results: any) => {
    setIsReviewSessionOpen(false);
    toast.success('Review session completed!');
    utils.question.getDue.invalidate();
  };

  const handleExitReview = () => {
    setIsReviewSessionOpen(false);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return (
          <HomeView
            totalDueCards={totalDueCards}
            onStartReview={handleStartReview}
            onFilterReview={handleFilterReview}
            onAddContext={handleAddContext}
          />
        );
      case 'library':
        return (
          <LibraryViewWrapper
            onAddContext={handleAddContext}
            onReviewContext={handleReviewContext}
          />
        );
      case 'stats':
        return <StatsView />;
      case 'graph':
        return <GraphView />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Navigation */}
      <DesktopNavigation
        currentView={currentView}
        onNavigate={setCurrentView}
        totalDueCards={totalDueCards}
        currentStreak={currentStreak}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {renderCurrentView()}
      </div>

      {/* Modals */}
      <AddContextModal
        isOpen={isAddContextModalOpen}
        onClose={() => setIsAddContextModalOpen(false)}
        onSubmit={handleAddContextSubmit}
      />

      <FilterReviewModal
        isOpen={isFilterReviewModalOpen}
        onClose={() => setIsFilterReviewModalOpen(false)}
        onStartReview={handleStartFilteredReview}
      />

      <DesktopReviewSession
        isOpen={isReviewSessionOpen}
        selectedContextIds={selectedContextIds}
        onComplete={handleReviewComplete}
        onExit={handleExitReview}
      />
    </div>
  );
}