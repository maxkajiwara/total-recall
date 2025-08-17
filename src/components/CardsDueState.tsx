import { TopicsBreakdown } from "./TopicsBreakdown";
import type { TopicBreakdown, NextReviewData } from "~/hooks/useReviewData";

interface CardsDueStateProps {
  dueCount: number;
  topics: TopicBreakdown[];
  nextReview: NextReviewData;
  onStartReview: () => void;
  showAll: boolean;
}

export function CardsDueState({ 
  dueCount, 
  topics, 
  nextReview, 
  onStartReview,
  showAll 
}: CardsDueStateProps) {
  return (
    <div className="space-y-6">
      {/* Main CTA Section */}
      <div className="text-center">
        <div className="mb-4 text-6xl">📚</div>
        
        <div className="rounded-xl bg-card p-6 shadow-[var(--shadow-card)]">
          <h2 className="mb-2 text-lg font-semibold text-card-foreground">Ready to Review</h2>
          <div className="mb-4 text-3xl font-bold text-card-foreground">
            {dueCount} {dueCount === 1 ? 'card' : 'cards'} due
          </div>
          
          <button
            onClick={onStartReview}
            className="min-h-12 rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Start Review
          </button>
        </div>
      </div>

      {/* Topics Breakdown */}
      <TopicsBreakdown topics={topics} showAll={showAll} />

      {/* Next Review Time */}
      {nextReview.nextDueTime && (
        <div className="text-center text-sm text-muted-foreground">
          <div>
            Next: {nextReview.nextDueTime.toLocaleTimeString([], { 
              hour: 'numeric', 
              minute: '2-digit' 
            })}
          </div>
          <div className="mt-1 flex justify-center">
            <div className="flex gap-1">
              <div className="h-2 w-2 rounded-full bg-muted" />
              <div className="h-2 w-2 rounded-full bg-primary" />
              <div className="h-2 w-2 rounded-full bg-muted" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}