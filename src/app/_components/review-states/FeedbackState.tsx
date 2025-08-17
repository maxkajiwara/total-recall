"use client";

import { motion } from "framer-motion";

interface FeedbackStateProps {
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
  result?: {
    transcription?: string;
    feedback: string;
    score: number;
    nextDue: Date;
  };
  onNext: () => void;
}

const getScoreBadge = (score: number) => {
  switch (score) {
    case 1:
      return {
        label: "Again",
        bgColor: "bg-red-100",
        textColor: "text-red-800",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        )
      };
    case 2:
      return {
        label: "Hard",
        bgColor: "bg-orange-100",
        textColor: "text-orange-800",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.348 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        )
      };
    case 3:
      return {
        label: "Good",
        bgColor: "bg-green-100",
        textColor: "text-green-800",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )
      };
    case 4:
      return {
        label: "Easy",
        bgColor: "bg-blue-100",
        textColor: "text-blue-800",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )
      };
    default:
      return {
        label: "Unknown",
        bgColor: "bg-gray-100",
        textColor: "text-gray-800",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      };
  }
};

export function FeedbackState({
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  onClose,
  result,
  onNext
}: FeedbackStateProps) {
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const scoreBadge = getScoreBadge(result?.score ?? 1);
  const isLastQuestion = currentQuestionIndex >= totalQuestions - 1;

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

      {/* Score Badge */}
      <div className="flex justify-center mb-6">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20,
            delay: 0.2 
          }}
          className={`${scoreBadge.bgColor} ${scoreBadge.textColor} px-4 py-2 rounded-full flex items-center space-x-2 font-medium text-sm`}
        >
          {scoreBadge.icon}
          <span>{scoreBadge.label} ({result?.score})</span>
        </motion.div>
      </div>

      {/* Feedback */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <div className="text-sm text-gray-900 leading-relaxed">
          {result?.feedback ?? "Processing your answer..."}
        </div>
      </motion.div>

      {/* Transcription (Optional - show if available) */}
      {result?.transcription && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
              What we heard:
            </div>
            <div className="text-sm text-gray-700 italic">
              &ldquo;{result.transcription}&rdquo;
            </div>
          </div>
        </motion.div>
      )}

      {/* Next Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex justify-center"
      >
        <button
          onClick={onNext}
          className="bg-[#d97757] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#c66641] transition-colors flex items-center space-x-2"
        >
          <span>{isLastQuestion ? "Finish Review" : "Next Question"}</span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </motion.div>
    </div>
  );
}