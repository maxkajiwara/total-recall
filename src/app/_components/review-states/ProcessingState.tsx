"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { api } from "~/trpc/react";

interface ProcessingStateProps {
  currentQuestion: {
    id: number;
    question: string;
    answer: string;
    context: {
      id: number;
      name: string;
    };
  };
  currentQuestionIndex: number;
  totalQuestions: number;
  onClose: () => void;
  questionId: number;
  onProcessingComplete: (result: {
    feedback: string;
    score: number;
    nextDue: Date;
  }) => void;
}

export function ProcessingState({
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  onClose,
  questionId,
  onProcessingComplete
}: ProcessingStateProps) {
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const hasProcessed = useRef(false);

  // This component is now used purely for showing processing animation
  // The actual API call happens in useReviewSession
  useEffect(() => {
    // Show processing for a brief moment to improve UX
    const timer = setTimeout(() => {
      if (!hasProcessed.current) {
        hasProcessed.current = true;
        // This won't be called since processing happens in useReviewSession
        // But we keep it for safety in case of race conditions
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-600">
          Question {currentQuestionIndex + 1}/{totalQuestions}
        </span>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div
          className="bg-[#d97757] h-2 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Processing Animation */}
      <div className="flex flex-col items-center justify-center py-16">
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
            Processing...
          </h3>
          
          {/* Loading Dots */}
          <div className="flex items-center justify-center space-x-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <motion.div
                key={index}
                className="w-3 h-3 bg-[#d97757] rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: index * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </div>

        <div className="text-center max-w-xs">
          <div className="text-sm text-gray-600 leading-relaxed">
            Evaluating your answer...
          </div>
        </div>
      </div>
    </div>
  );
}