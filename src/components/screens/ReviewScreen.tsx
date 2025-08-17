"use client";

import { useState } from "react";
import { CardsDueState } from "~/components/CardsDueState";
import { AllCaughtUpState } from "~/components/AllCaughtUpState";
import { useReviewData } from "~/hooks/useReviewData";
import { ReviewModal } from "~/app/_components/ReviewModal";

export function ReviewScreen() {
  const [showAll, setShowAll] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const { 
    dueQuestions, 
    dueCount, 
    topicsBreakdown, 
    studyStreakData, 
    nextReviewData, 
    isLoading,
    hasQuestions 
  } = useReviewData();

  const handleStartReview = () => {
    if (dueQuestions.length > 0) {
      setIsReviewModalOpen(true);
    }
  };

  const handleCloseReviewModal = () => {
    setIsReviewModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="animate-pulse text-muted-foreground">
          Loading your review data...
        </div>
      </div>
    );
  }

  const hasDueCards = dueCount > 0;

  return (
    <div className="h-full overflow-auto">
      <div className="mx-auto max-w-md p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Review</h1>
          {hasQuestions && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="rounded-lg border border-primary px-3 py-2 text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
            >
              Show {showAll ? 'Cards Due' : 'All'}
            </button>
          )}
        </div>

        {/* Main Content */}
        {!hasQuestions ? (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mb-4 text-6xl">📚</div>
              <h2 className="mb-2 text-xl font-semibold">No content yet</h2>
              <p className="text-muted-foreground">
                Add some content to start reviewing and building your knowledge.
              </p>
            </div>
          </div>
        ) : hasDueCards ? (
          <CardsDueState
            dueCount={dueCount}
            topics={topicsBreakdown}
            nextReview={nextReviewData}
            onStartReview={handleStartReview}
            showAll={showAll}
          />
        ) : (
          <AllCaughtUpState
            studyStreak={studyStreakData}
            nextReview={nextReviewData}
          />
        )}
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={handleCloseReviewModal}
        questions={dueQuestions}
      />
    </div>
  );
}