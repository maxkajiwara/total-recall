import { StudyStreak } from "./StudyStreak";
import type { StudyStreakData, NextReviewData } from "~/hooks/useReviewData";

interface AllCaughtUpStateProps {
  studyStreak: StudyStreakData;
  nextReview: NextReviewData;
}

export function AllCaughtUpState({ studyStreak, nextReview }: AllCaughtUpStateProps) {
  return (
    <div className="space-y-6">
      {/* Celebration Section */}
      <div className="text-center">
        <div className="mb-4 text-6xl">✨</div>
        
        <h2 className="mb-2 text-2xl font-bold">All done!</h2>
        
        <p className="mb-6 text-muted-foreground">
          You&apos;ve completed all your reviews for now. Great work on staying consistent!
        </p>
      </div>

      {/* Next Review Info */}
      {nextReview.nextDueTime && (
        <div className="rounded-xl bg-card p-6 shadow-[var(--shadow-card)]">
          <h3 className="mb-4 text-center font-semibold text-card-foreground">Next Review</h3>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">
              {nextReview.nextDueTime.toLocaleTimeString([], { 
                hour: 'numeric', 
                minute: '2-digit' 
              })}
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              {nextReview.upcomingCount} {nextReview.upcomingCount === 1 ? 'card' : 'cards'} from{' '}
              {nextReview.contextName ?? 'Biology'} will be ready
            </div>
          </div>
        </div>
      )}

      {/* Study Streak */}
      <StudyStreak data={studyStreak} />

      {/* Encouragement */}
      <div className="rounded-xl bg-card p-6 shadow-[var(--shadow-card)] text-center">
        <div className="mb-2 text-2xl">💡</div>
        <div className="text-sm text-muted-foreground">
          Consider adding more learning materials to keep growing your knowledge
        </div>
      </div>
    </div>
  );
}