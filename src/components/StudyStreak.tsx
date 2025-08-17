import type { StudyStreakData } from "~/hooks/useReviewData";

interface StudyStreakProps {
  data: StudyStreakData;
}

export function StudyStreak({ data }: StudyStreakProps) {
  const { currentStreak, progress } = data;

  return (
    <div className="rounded-xl bg-card p-6 shadow-[var(--shadow-card)]">
      <div className="mb-4 flex items-center justify-between">
        <div className="font-semibold text-card-foreground">Study Streak</div>
        <div className="flex items-center gap-1">
          <span className="text-xl">🔥</span>
          <span className="font-semibold text-primary">{currentStreak} days</span>
        </div>
      </div>
      
      <div className="mb-2">
        <div className="mb-2 h-2 w-full rounded-full bg-muted">
          <div 
            className="h-2 rounded-full bg-primary transition-all duration-300"
            style={{ width: `${Math.min(progress * 100, 100)}%` }}
          />
        </div>
        <div className="text-center text-sm text-muted-foreground">
          Keep it up!
        </div>
      </div>
    </div>
  );
}