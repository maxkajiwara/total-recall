'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { api } from '~/trpc/react';
import { toast } from 'sonner';

interface DesktopReviewSessionProps {
  isOpen: boolean;
  onComplete: (results: any) => void;
  onExit: () => void;
  selectedContextIds?: number[];
}

type ReviewState = 'question' | 'evaluating' | 'feedback' | 'complete';

interface ReviewResult {
  questionId: number;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  score: number;
  feedback: string;
  skipped: boolean;
  timeSpent: number;
}

export default function DesktopReviewSession({ 
  isOpen,
  onComplete, 
  onExit, 
  selectedContextIds = []
}: DesktopReviewSessionProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [reviewState, setReviewState] = useState<ReviewState>('question');
  const [results, setResults] = useState<ReviewResult[]>([]);
  const [currentFeedback, setCurrentFeedback] = useState<{ score: number; feedback: string } | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [showAnswer, setShowAnswer] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Fetch real questions
  const { data: questions = [], isLoading, refetch } = api.question.getDue.useQuery(
    {
      limit: 100,
      contextIds: selectedContextIds.length > 0 ? selectedContextIds : undefined
    },
    {
      enabled: isOpen
    }
  );

  // Evaluate answer mutation - using evaluateTextAnswer for text-based answers
  const evaluateAnswer = api.question.evaluateTextAnswer.useMutation({
    onSuccess: (data) => {
      const timeSpent = Date.now() - questionStartTime;
      const result: ReviewResult = {
        questionId: currentQuestion!.id,
        question: currentQuestion!.question,
        userAnswer,
        correctAnswer: currentQuestion!.answer,
        score: data.score,
        feedback: data.feedback,
        skipped: false,
        timeSpent
      };
      setResults(prev => [...prev, result]);
      setCurrentFeedback({ score: data.score, feedback: data.feedback });
      setReviewState('feedback');
    },
    onError: (error) => {
      toast.error(`Failed to evaluate answer: ${error.message}`);
      setReviewState('question');
    }
  });

  const utils = api.useUtils();
  
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentQuestionIndex];
  const progress = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;

  // Calculate stats for completion screen
  const completionStats = useMemo(() => {
    if (results.length === 0) return { correctCount: 0, accuracy: 0, avgTime: 0 };
    
    const correctCount = results.filter(r => r.score >= 3).length; // Good (3) or Easy (4)
    const accuracy = Math.round((correctCount / results.length) * 100);
    const totalTime = results.reduce((sum, r) => sum + r.timeSpent, 0);
    const avgTime = Math.round(totalTime / results.length / 1000); // in seconds
    
    return { correctCount, accuracy, avgTime };
  }, [results]);

  // Get next due info
  const { data: allQuestions = [] } = api.question.list.useQuery(undefined, {
    enabled: reviewState === 'complete'
  });

  const nextDueInfo = useMemo(() => {
    if (!allQuestions.length) return [];
    
    const now = new Date();
    const upcoming = allQuestions
      .filter(q => new Date(q.due) > now)
      .sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime())
      .slice(0, 3);
    
    return upcoming.map(q => {
      const due = new Date(q.due);
      const diff = due.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const days = Math.floor(hours / 24);
      
      let timeStr = '';
      if (days > 0) {
        timeStr = days === 1 ? 'tomorrow' : `in ${days} days`;
      } else if (hours > 0) {
        timeStr = `in ${hours} hour${hours > 1 ? 's' : ''}`;
      } else {
        timeStr = 'in a few minutes';
      }
      
      return timeStr;
    });
  }, [allQuestions]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCurrentQuestionIndex(0);
      setUserAnswer('');
      setReviewState('question');
      setResults([]);
      setCurrentFeedback(null);
      setQuestionStartTime(Date.now());
      refetch();
    }
  }, [isOpen, refetch]);

  // Focus textarea when showing question
  useEffect(() => {
    if (isOpen && reviewState === 'question' && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen, reviewState, currentQuestionIndex]);

  // Update start time when moving to new question
  useEffect(() => {
    if (reviewState === 'question') {
      setQuestionStartTime(Date.now());
    }
  }, [currentQuestionIndex, reviewState]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onExit();
      } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        if (reviewState === 'question' && userAnswer.trim()) {
          handleSubmit();
        } else if (reviewState === 'feedback') {
          handleNext();
        }
      } else if (e.key === ' ' && reviewState === 'feedback') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowRight' && reviewState === 'question') {
        handleSkip();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, reviewState, userAnswer]);

  const handleSubmit = () => {
    if (!userAnswer.trim() || !currentQuestion) return;
    
    setReviewState('evaluating');
    evaluateAnswer.mutate({
      questionId: currentQuestion.id,
      textAnswer: userAnswer.trim()
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setUserAnswer('');
      setReviewState('question');
      setCurrentFeedback(null);
      setShowAnswer(false); // Reset show answer state
    } else {
      setReviewState('complete');
    }
  };

  const handleSkip = () => {
    if (!currentQuestion) return;
    
    const timeSpent = Date.now() - questionStartTime;
    const result: ReviewResult = {
      questionId: currentQuestion.id,
      question: currentQuestion.question,
      userAnswer: '',
      correctAnswer: currentQuestion.answer,
      score: 1, // "Again" rating for skipped
      feedback: 'Question skipped',
      skipped: true,
      timeSpent
    };

    setResults(prev => [...prev, result]);
    handleNext();
  };

  const handleComplete = () => {
    // Invalidate queries to refresh data
    utils.question.getDue.invalidate();
    utils.question.list.invalidate();
    
    onComplete({
      totalQuestions: results.length,
      results,
      correctCount: completionStats.correctCount,
      accuracy: completionStats.accuracy,
      avgTime: completionStats.avgTime
    });
  };

  if (!isOpen) return null;

  // Loading state
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      >
        <div className="bg-white rounded-2xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading questions...</p>
        </div>
      </motion.div>
    );
  }

  // No questions available
  if (questions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        onClick={onExit}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl p-8 text-center max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-6xl mb-4">✨</div>
          <h2 className="text-xl font-semibold mb-2">No Questions Due</h2>
          <p className="text-muted-foreground mb-6">
            {selectedContextIds.length > 0
              ? 'No questions are due for review in the selected contexts.'
              : 'Great work! You\'ve reviewed all your due cards.'}
          </p>
          <Button onClick={onExit} className="bg-primary hover:bg-primary/90 text-white">
            Back to Dashboard
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        onClick={onExit}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="bg-white rounded-2xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {reviewState === 'complete' ? (
            /* Session Complete */
            <div className="p-8 text-center">
              <div className="text-6xl mb-6">🎉</div>
              <h1 className="text-2xl font-semibold mb-4">Session Complete!</h1>
              
              <div className="h-1 bg-gray-200 rounded-full overflow-hidden mb-6 max-w-md mx-auto">
                <div className="h-full bg-primary transition-all duration-500" style={{ width: '100%' }}></div>
              </div>

              <p className="text-lg text-muted-foreground mb-6">
                Great work! You've reviewed {results.length} card{results.length !== 1 ? 's' : ''}.
              </p>

              <div className="grid grid-cols-2 gap-8 mb-8 max-w-2xl mx-auto">
                <div>
                  <h3 className="font-medium mb-4">Session Summary:</h3>
                  <div className="space-y-2 text-left">
                    <div className="flex justify-between">
                      <span>Accuracy:</span>
                      <span className="font-medium">
                        {completionStats.accuracy}% correct
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cards reviewed:</span>
                      <span className="font-medium">{results.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg. time per card:</span>
                      <span className="font-medium">{completionStats.avgTime}s</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-4">Next cards due:</h3>
                  <div className="space-y-2 text-left text-sm text-muted-foreground">
                    {nextDueInfo.length > 0 ? (
                      nextDueInfo.map((time, i) => (
                        <div key={i}>• Cards due {time}</div>
                      ))
                    ) : (
                      <div>No upcoming reviews scheduled</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <Button onClick={handleComplete} className="bg-primary hover:bg-primary/90 text-white">
                  Back to Home
                </Button>
              </div>
            </div>
          ) : (
            /* Review Session */
            <div className="flex flex-col h-full max-h-[90vh]">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div>
                  <h1 className="text-xl font-semibold">Review Session</h1>
                  <p className="text-muted-foreground">
                    Question {currentQuestionIndex + 1} of {totalQuestions}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-muted-foreground">{Math.round(progress)}%</div>
                  {reviewState === 'question' && (
                    <Button size="sm" variant="ghost" onClick={handleSkip}>
                      Skip →
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={onExit}>
                    Exit
                  </Button>
                </div>
              </div>

              {/* Progress bar */}
              <div className="px-6 py-4">
                <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-primary transition-all duration-500"
                    animate={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <AnimatePresence mode="wait">
                  {(reviewState === 'question' || reviewState === 'evaluating') && currentQuestion && (
                    <motion.div
                      key="question"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <div className="text-sm text-muted-foreground mb-2">
                          {currentQuestion.context?.name || 'General'}
                        </div>
                        <h2 className="text-2xl font-medium">
                          {currentQuestion.question}
                        </h2>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Your answer:
                        </label>
                        <Textarea
                          ref={textareaRef}
                          value={userAnswer}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          placeholder="Type your answer here..."
                          className="min-h-32 resize-none"
                          disabled={reviewState === 'evaluating'}
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                          Press Cmd+Enter (Mac) or Ctrl+Enter (PC) to submit
                        </p>
                      </div>

                      <div className="flex justify-end space-x-3">
                        <Button
                          onClick={handleSubmit}
                          disabled={!userAnswer.trim() || reviewState === 'evaluating'}
                          className="bg-primary hover:bg-primary/90 text-white min-w-32"
                        >
                          {reviewState === 'evaluating' ? (
                            <motion.div className="flex items-center space-x-2">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                              />
                              <span>Evaluating...</span>
                            </motion.div>
                          ) : (
                            'Submit Answer'
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {reviewState === 'feedback' && currentQuestion && currentFeedback && (
                    <motion.div
                      key="feedback"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <h2 className="text-2xl font-medium mb-4">
                          {currentQuestion.question}
                        </h2>
                      </div>

                      {/* Score indicator */}
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">
                          {currentFeedback.score >= 3 ? '✅' : '❌'}
                        </span>
                        <span className={`font-medium ${
                          currentFeedback.score >= 3 ? 'text-green-600' : 'text-orange-600'
                        }`}>
                          {currentFeedback.score === 4 ? 'Perfect!' :
                           currentFeedback.score === 3 ? 'Good!' :
                           currentFeedback.score === 2 ? 'Needs work' :
                           'Try again'}
                        </span>
                      </div>

                      {/* Your answer */}
                      <div>
                        <h3 className="font-medium mb-2">Your answer:</h3>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          {userAnswer}
                        </div>
                      </div>

                      {/* Show/Hide Answer Button and Answer */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">Expected answer:</h3>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setShowAnswer(!showAnswer)}
                            className="text-sm"
                          >
                            {showAnswer ? 'Hide Answer' : 'Show Answer'}
                          </Button>
                        </div>
                        {showAnswer ? (
                          <div className="p-3 bg-green-50 rounded-lg text-green-900">
                            {currentQuestion.answer}
                          </div>
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-lg text-gray-400 italic">
                            Click "Show Answer" to reveal the expected answer
                          </div>
                        )}
                      </div>

                      {/* AI Feedback */}
                      <div>
                        <h3 className="font-medium mb-2">Feedback:</h3>
                        <div className={`p-3 rounded-lg ${
                          currentFeedback.score >= 3 
                            ? 'bg-green-50 text-green-900' 
                            : 'bg-red-50 text-red-900'
                        }`}>
                          {currentFeedback.feedback}
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button
                          onClick={handleNext}
                          className="bg-primary hover:bg-primary/90 text-white"
                        >
                          {currentQuestionIndex < totalQuestions - 1 ? 'Next Question →' : 'Finish Review'}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Keyboard shortcuts hint */}
              <div className="px-6 py-3 border-t border-gray-100 bg-gray-50">
                <p className="text-xs text-muted-foreground text-center">
                  <span className="font-medium">Shortcuts:</span> 
                  {' '}Cmd/Ctrl+Enter to submit • Right Arrow to skip • Esc to exit
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}