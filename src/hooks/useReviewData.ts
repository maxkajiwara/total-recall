import { useMemo } from "react";
import { api } from "~/trpc/react";

export interface TopicBreakdown {
  contextId: number;
  contextName: string;
  dueCount: number;
  totalCount: number;
}

export interface StudyStreakData {
  currentStreak: number;
  longestStreak: number;
  progress: number; // 0-1 for progress bar
}

export interface NextReviewData {
  nextDueTime: Date | null;
  upcomingCount: number;
  contextName?: string;
}

export function useReviewData() {
  // Get due questions
  const { data: dueQuestions = [], isLoading: loadingDue } = api.question.getDue.useQuery({
    limit: 100,
  });

  // Get all contexts
  const { data: contexts = [], isLoading: loadingContexts } = api.context.list.useQuery();

  // Get all questions for topic breakdown
  const { data: allQuestions = [], isLoading: loadingAll } = api.question.list.useQuery();

  const isLoading = loadingDue || loadingContexts || loadingAll;

  // Calculate topic breakdown
  const topicsBreakdown = useMemo((): TopicBreakdown[] => {
    if (!contexts.length || !allQuestions.length) return [];

    const contextMap = new Map<number, { name: string; dueCount: number; totalCount: number }>();

    // Initialize all contexts
    contexts.forEach(context => {
      contextMap.set(context.id, {
        name: context.name,
        dueCount: 0,
        totalCount: 0,
      });
    });

    // Count total questions per context
    allQuestions.forEach(question => {
      const context = contextMap.get(question.contextId);
      if (context) {
        context.totalCount++;
      }
    });

    // Count due questions per context
    dueQuestions.forEach(question => {
      const context = contextMap.get(question.contextId);
      if (context) {
        context.dueCount++;
      }
    });

    return Array.from(contextMap.entries())
      .map(([contextId, data]) => ({
        contextId,
        contextName: data.name,
        dueCount: data.dueCount,
        totalCount: data.totalCount,
      }))
      .filter(topic => topic.totalCount > 0) // Only show contexts with questions
      .sort((a, b) => b.dueCount - a.dueCount); // Sort by due count descending
  }, [contexts, allQuestions, dueQuestions]);

  // Calculate next review data
  const nextReviewData = useMemo((): NextReviewData => {
    if (!allQuestions.length) {
      return {
        nextDueTime: null,
        upcomingCount: 0,
      };
    }

    // Find next due question
    const now = new Date();
    const upcomingQuestions = allQuestions
      .filter(q => new Date(q.due) > now)
      .sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime());

    if (upcomingQuestions.length === 0) {
      return {
        nextDueTime: null,
        upcomingCount: 0,
      };
    }

    const nextQuestion = upcomingQuestions[0];
    const nextDueTime = new Date(nextQuestion!.due);
    
    // Count questions due at the same time as the next one
    const nextDueTimeStr = nextDueTime.toISOString().split('T')[0]; // Same day
    const upcomingCount = upcomingQuestions.filter(q => 
      new Date(q.due).toISOString().split('T')[0] === nextDueTimeStr
    ).length;

    return {
      nextDueTime,
      upcomingCount,
      contextName: nextQuestion!.context?.name,
    };
  }, [allQuestions]);

  // Calculate study streak (simplified - based on consecutive days with reviews)
  const studyStreakData = useMemo((): StudyStreakData => {
    // For MVP, we'll use a simplified streak calculation
    // In a real app, you'd track review history in the database
    const reviewedToday = dueQuestions.length < allQuestions.length;
    const currentStreak = reviewedToday ? 7 : 6; // Mock data for demo
    const longestStreak = 12; // Mock data for demo
    const progress = currentStreak / longestStreak;

    return {
      currentStreak,
      longestStreak,
      progress,
    };
  }, [dueQuestions.length, allQuestions.length]);

  return {
    dueQuestions,
    dueCount: dueQuestions.length,
    topicsBreakdown,
    studyStreakData,
    nextReviewData,
    isLoading,
    hasQuestions: allQuestions.length > 0,
  };
}