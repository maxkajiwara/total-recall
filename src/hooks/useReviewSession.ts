import { useState, useCallback, useRef } from 'react';
import { api } from '~/trpc/react';

export type ReviewState = 
  | 'question'     // State 1: Display question
  | 'answering'    // State 2: Entering text answer
  | 'processing'   // State 3: Processing answer
  | 'feedback'     // State 4: Show feedback
  | 'complete';    // State 5: Session complete

export interface Question {
  id: number;
  question: string;
  answer: string;
  contextId: number;
  context: {
    id: number;
    name: string;
  };
}

export interface ReviewResult {
  feedback: string;
  score: number;
  nextDue: Date;
}

export interface ReviewSessionState {
  currentState: ReviewState;
  questions: Question[];
  currentQuestionIndex: number;
  currentQuestion: Question | null;
  currentResult: ReviewResult | null;
  isLoading: boolean;
  error: string | null;
  sessionProgress: number; // 0-100
}

export interface ReviewSessionActions {
  startSession: (questions: Question[]) => void;
  nextQuestion: () => void;
  setState: (state: ReviewState) => void;
  submitAnswer: (textAnswer: string) => Promise<void>;
  resetSession: () => void;
  exitSession: () => void;
  finishSession: () => void;
  sessionData: React.MutableRefObject<Array<{ questionId: number; result: ReviewResult }>>;
}

export function useReviewSession(): ReviewSessionState & ReviewSessionActions {
  const [currentState, setCurrentState] = useState<ReviewState>('question');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentResult, setCurrentResult] = useState<ReviewResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const sessionData = useRef<Array<{ questionId: number; result: ReviewResult }>>([]);

  const evaluateTextAnswerMutation = api.question.evaluateTextAnswer.useMutation();

  const currentQuestion = questions[currentQuestionIndex] || null;
  const sessionProgress = questions.length > 0 
    ? Math.round(((currentQuestionIndex + (currentState === 'complete' ? 1 : 0)) / questions.length) * 100)
    : 0;

  const startSession = useCallback((sessionQuestions: Question[]) => {
    setQuestions(sessionQuestions);
    setCurrentQuestionIndex(0);
    setCurrentState('question');
    setCurrentResult(null);
    setError(null);
  }, []);

  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setCurrentState('question');
      setCurrentResult(null);
      setError(null);
    } else {
      setCurrentState('complete');
    }
  }, [currentQuestionIndex, questions.length]);

  const setState = useCallback((state: ReviewState) => {
    setCurrentState(state);
    if (state === 'question') {
      setError(null);
      setCurrentResult(null);
    }
  }, []);

  const submitAnswer = useCallback(async (textAnswer: string) => {
    if (!currentQuestion) {
      setError('No current question available');
      return;
    }

    try {
      setCurrentState('processing');
      setError(null);

      const result = await evaluateTextAnswerMutation.mutateAsync({
        questionId: currentQuestion.id,
        textAnswer: textAnswer,
      });

      setCurrentResult(result);
      setCurrentState('feedback');
    } catch (err) {
      console.error('Error evaluating answer:', err);
      setError(err instanceof Error ? err.message : 'Failed to evaluate answer');
      setCurrentState('question');
    }
  }, [currentQuestion, evaluateTextAnswerMutation]);

  const resetSession = useCallback(() => {
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setCurrentState('question');
    setCurrentResult(null);
    setError(null);
    sessionData.current = [];
  }, []);

  const exitSession = useCallback(() => {
    resetSession();
  }, [resetSession]);

  const finishSession = useCallback(() => {
    // Handle session completion logic here
    resetSession();
  }, [resetSession]);

  return {
    // State
    currentState,
    questions,
    currentQuestionIndex,
    currentQuestion,
    currentResult,
    isLoading: evaluateTextAnswerMutation.isPending,
    error,
    sessionProgress,
    
    // Actions
    startSession,
    nextQuestion,
    setState,
    submitAnswer,
    resetSession,
    exitSession,
    finishSession,
    sessionData,
  };
}