'use client';

import { useState } from 'react';
import DesktopNavigation from './DesktopNavigation';
import HomeView from './HomeView';
import LibraryView from './LibraryView';
import StatsView from './StatsView';
import GraphView from './GraphView';
import DesktopReviewSession from './DesktopReviewSession';
import AddContextModal from './AddContextModal';
import FilterReviewModal from './FilterReviewModal';

type NavigationView = 'home' | 'library' | 'stats' | 'graph';

export default function DesktopLayout() {
  const [currentView, setCurrentView] = useState<NavigationView>('home');
  const [isReviewSessionOpen, setIsReviewSessionOpen] = useState(false);
  const [isAddContextModalOpen, setIsAddContextModalOpen] = useState(false);
  const [isFilterReviewModalOpen, setIsFilterReviewModalOpen] = useState(false);

  // Mock data
  const totalDueCards = 12;
  const currentStreak = 7;

  const handleStartReview = () => {
    setIsReviewSessionOpen(true);
  };

  const handleFilterReview = () => {
    setIsFilterReviewModalOpen(true);
  };

  const handleStartFilteredReview = (selectedContextIds: string[]) => {
    console.log('Starting filtered review with contexts:', selectedContextIds);
    setIsReviewSessionOpen(true);
  };

  const handleAddContext = () => {
    setIsAddContextModalOpen(true);
  };

  const handleAddContextSubmit = (data: { name: string; type: 'url' | 'text'; content: string }) => {
    console.log('Adding context:', data);
    setIsAddContextModalOpen(false);
    
    // TODO: Implement actual context creation
    // This would typically:
    // 1. Send data to backend for AI processing
    // 2. Generate flashcards
    // 3. Add new context to the contexts list
    // 4. Show success notification
  };

  const handleReviewContext = (contextId: string) => {
    console.log('Reviewing context:', contextId);
    setIsReviewSessionOpen(true);
  };

  const handleReviewComplete = (results: any) => {
    setIsReviewSessionOpen(false);
    console.log('Review completed:', results);
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
          <LibraryView
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
    <div className="h-screen flex flex-col bg-warm">
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
        selectedContexts={[]}
        onComplete={handleReviewComplete}
        onExit={handleExitReview}
      />
    </div>
  );
}