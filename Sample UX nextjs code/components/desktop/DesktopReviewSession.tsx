'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';

interface Question {
  id: string;
  context: string;
  question: string;
  correctAnswer: string;
  explanation?: string;
}

interface DesktopReviewSessionProps {
  isOpen: boolean;
  onComplete: (results: any) => void;
  onExit: () => void;
  selectedContexts?: string[];
}

type ReviewState = 'question' | 'correct' | 'incorrect' | 'showing-answer' | 'complete';

export default function DesktopReviewSession({ 
  isOpen,
  onComplete, 
  onExit, 
  selectedContexts = []
}: DesktopReviewSessionProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [reviewState, setReviewState] = useState<ReviewState>('question');
  const [results, setResults] = useState<any[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Mock questions data
  const questions: Question[] = [
    {
      id: '1',
      context: 'Biology › Photosynthesis',
      question: 'What is the primary function of chlorophyll in the photosynthesis process?',
      correctAnswer: 'Chlorophyll absorbs light energy (mainly red and blue wavelengths) and converts it into chemical energy in the form of ATP and NADPH, which are used in the Calvin cycle to produce glucose.',
      explanation: 'Specificity about energy conversion (light → chemical) and the molecules involved (ATP, NADPH) demonstrates deeper understanding.'
    },
    {
      id: '2',
      context: 'Spanish › Travel Phrases',
      question: '¿Cómo se dice "Where is the bathroom?" en español?',
      correctAnswer: '¿Dónde está el baño?',
      explanation: 'Remember to use "¿Dónde está...?" for asking locations and "el baño" is the most common term for bathroom in Spanish.'
    },
    {
      id: '3',
      context: 'Physics › Quantum Mechanics',
      question: 'What is quantum entanglement?',
      correctAnswer: 'Quantum entanglement is a quantum mechanical phenomenon where pairs or groups of particles interact in ways such that the quantum state of each particle cannot be described independently, even when separated by large distances.',
      explanation: 'The key is that measuring one particle instantly affects its entangled partner, regardless of the distance between them.'
    }
  ];

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCurrentQuestionIndex(0);
      setUserAnswer('');
      setReviewState('question');
      setResults([]);
    }
  }, [isOpen]);

  // Focus textarea when showing question
  useEffect(() => {
    if (isOpen && reviewState === 'question' && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen, reviewState]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onExit();
      } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        if (reviewState === 'question' && userAnswer.trim()) {
          handleSubmit();
        }
      } else if (e.key === ' ' && reviewState !== 'question') {
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
    if (!userAnswer.trim()) return;

    // Simple answer checking (in real app, this would be AI-powered)
    const isCorrect = checkAnswer(userAnswer, currentQuestion.correctAnswer);
    
    const result = {
      questionId: currentQuestion.id,
      question: currentQuestion.question,
      userAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
      timeSpent: Date.now() // In real app, track actual time
    };

    setResults(prev => [...prev, result]);
    setReviewState(isCorrect ? 'correct' : 'incorrect');
  };

  const checkAnswer = (userAnswer: string, correctAnswer: string) => {
    // Simple similarity check - in real app use AI
    const userWords = userAnswer.toLowerCase().split(/\s+/);
    const correctWords = correctAnswer.toLowerCase().split(/\s+/);
    
    let matchCount = 0;
    userWords.forEach(word => {
      if (correctWords.some(cWord => cWord.includes(word) || word.includes(cWord))) {
        matchCount++;
      }
    });
    
    return matchCount / correctWords.length > 0.5; // 50% threshold
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setUserAnswer('');
      setReviewState('question');
    } else {
      setReviewState('complete');
    }
  };

  const handleSkip = () => {
    const result = {
      questionId: currentQuestion.id,
      question: currentQuestion.question,
      userAnswer: '',
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect: false,
      skipped: true,
      timeSpent: Date.now()
    };

    setResults(prev => [...prev, result]);
    handleNext();
  };

  const showCorrectAnswer = () => {
    setReviewState('showing-answer');
  };

  const handleComplete = () => {
    onComplete({
      totalQuestions,
      results,
      correctCount: results.filter(r => r.isCorrect).length,
      skippedCount: results.filter(r => r.skipped).length
    });
  };

  if (!isOpen) return null;

  const correctCount = results.filter(r => r.isCorrect).length;
  const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

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
          className="bg-surface rounded-2xl shadow-lg-custom w-full max-w-4xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {reviewState === 'complete' ? (
            /* Session Complete */
            <div className="p-8 text-center">
              <div className="text-6xl mb-6">🎉</div>
              <h1 className="text-2xl font-semibold mb-4">Session Complete!</h1>
              
              <div className="progress-custom mb-6 max-w-md mx-auto">
                <div className="progress-fill" style={{ width: '100%' }}></div>
              </div>

              <p className="text-lg text-secondary mb-6">
                Great work! You've completed {totalQuestions} cards.
              </p>

              <div className="grid grid-cols-2 gap-8 mb-8 max-w-2xl mx-auto">
                <div>
                  <h3 className="font-medium mb-4">Session Summary:</h3>
                  <div className="space-y-2 text-left">
                    <div className="flex justify-between">
                      <span>Correct:</span>
                      <span className="text-success font-medium">{correctCount} cards ({accuracy}%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Incorrect:</span>
                      <span className="text-error font-medium">{totalQuestions - correctCount} cards ({100 - accuracy}%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time spent:</span>
                      <span>8 minutes</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-4">Next cards due:</h3>
                  <div className="space-y-2 text-left text-sm text-secondary">
                    <div>• 2 cards in 3 hours</div>
                    <div>• 5 cards tomorrow</div>
                    <div>• 8 cards in 3 days</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <Button onClick={handleComplete} className="bg-primary-custom hover:bg-primary-hover text-white">
                  Back to Home
                </Button>
                <Button variant="outline">
                  Review Mistakes
                </Button>
              </div>
            </div>
          ) : (
            /* Review Session */
            <div className="flex flex-col h-full max-h-[90vh]">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-custom">
                <div>
                  <h1 className="text-xl font-semibold">Review Session</h1>
                  <p className="text-secondary">
                    Question {currentQuestionIndex + 1} of {totalQuestions}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-secondary">{Math.round(progress)}%</div>
                  {reviewState === 'question' && (
                    <Button variant="outline" size="sm" onClick={handleSkip}>
                      Skip
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={onExit}>
                    Exit
                  </Button>
                </div>
              </div>

              {/* Progress bar */}
              <div className="px-6 py-4">
                <div className="progress-custom">
                  <motion.div 
                    className="progress-fill"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <AnimatePresence mode="wait">
                  {/* Question State */}
                  {reviewState === 'question' && (
                    <motion.div
                      key="question"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <div className="text-sm text-secondary mb-2">{currentQuestion.context}</div>
                        <h2 className="text-xl leading-relaxed">{currentQuestion.question}</h2>
                      </div>

                      <div className="space-y-4">
                        <Textarea
                          ref={textareaRef}
                          value={userAnswer}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          placeholder="Type your answer here..."
                          className="min-h-32 text-base"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                              e.preventDefault();
                              if (userAnswer.trim()) handleSubmit();
                            }
                          }}
                        />

                        <div className="flex items-center justify-between">
                          <div className="text-sm text-tertiary">
                            Keyboard: <kbd className="px-2 py-1 bg-surface-hover rounded">⌘↵</kbd> to submit, 
                            <kbd className="px-2 py-1 bg-surface-hover rounded ml-1">→</kbd> to skip
                          </div>
                          <Button
                            onClick={handleSubmit}
                            disabled={!userAnswer.trim()}
                            className="bg-primary-custom hover:bg-primary-hover text-white"
                          >
                            Submit
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Correct Answer State */}
                  {reviewState === 'correct' && (
                    <motion.div
                      key="correct"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center text-white">
                          ✓
                        </div>
                        <h2 className="text-xl font-semibold text-success">Correct!</h2>
                      </div>

                      <div className="space-y-4">
                        <p className="text-secondary">
                          Excellent! You correctly identified the key concepts. 
                          {currentQuestion.explanation && (
                            <span className="block mt-2">{currentQuestion.explanation}</span>
                          )}
                        </p>
                        <div className="text-sm text-secondary">
                          Next review: <strong>In 4 days</strong>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-tertiary">
                          Press <kbd className="px-2 py-1 bg-surface-hover rounded">Space</kbd> to continue
                        </div>
                        <Button onClick={handleNext} className="bg-primary-custom hover:bg-primary-hover text-white">
                          Continue →
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* Incorrect Answer State */}
                  {reviewState === 'incorrect' && (
                    <motion.div
                      key="incorrect"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-warning rounded-full flex items-center justify-center text-white">
                          ⚠️
                        </div>
                        <h2 className="text-xl font-semibold text-warning">Not quite right</h2>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h3 className="font-medium mb-2">Your answer:</h3>
                          <div className="p-3 bg-surface-hover rounded-lg text-secondary">
                            "{userAnswer}"
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-medium mb-2">Why it's incomplete:</h3>
                          <p className="text-secondary">
                            {currentQuestion.explanation || 
                             "Your answer touched on some concepts but missed key details that demonstrate complete understanding."
                            }
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <Button variant="outline" onClick={showCorrectAnswer}>
                          View Correct Answer
                        </Button>
                        <div className="text-sm text-secondary">
                          Next review: <strong>Tomorrow</strong>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Showing Correct Answer State */}
                  {reviewState === 'showing-answer' && (
                    <motion.div
                      key="showing-answer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-warning rounded-full flex items-center justify-center text-white">
                          ⚠️
                        </div>
                        <h2 className="text-xl font-semibold text-warning">Not quite right</h2>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <h3 className="font-medium mb-2">Your answer:</h3>
                          <div className="p-3 bg-surface-hover rounded-lg text-secondary">
                            "{userAnswer}"
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-medium mb-2">Correct answer:</h3>
                          <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                            {currentQuestion.correctAnswer}
                          </div>
                        </div>

                        <div>
                          <h3 className="font-medium mb-2">Why the difference matters:</h3>
                          <p className="text-secondary">
                            {currentQuestion.explanation}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-tertiary">
                          Press <kbd className="px-2 py-1 bg-surface-hover rounded">Space</kbd> to continue
                        </div>
                        <Button onClick={handleNext} className="bg-primary-custom hover:bg-primary-hover text-white">
                          Continue →
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}