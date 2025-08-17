"use client";

import { motion } from "framer-motion";

interface SessionCompleteProps {
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
  onFinish: () => void;
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

export function SessionComplete({
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  onClose,
  result,
  onFinish
}: SessionCompleteProps) {
  const scoreBadge = getScoreBadge(result?.score ?? 1);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-600">
          Question {totalQuestions}/{totalQuestions}
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

      {/* Full Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <motion.div
          className="bg-green-600 h-2 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>

      {/* Completion Celebration */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20,
          delay: 0.3 
        }}
        className="text-center mb-6"
      >
        <div className="text-4xl mb-2">🎉</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Review Complete!
        </h2>
        <p className="text-sm text-gray-600">
          You&rsquo;ve completed all {totalQuestions} questions
        </p>
      </motion.div>

      {/* Final Score Badge */}
      <div className="flex justify-center mb-6">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20,
            delay: 0.6 
          }}
          className={`${scoreBadge.bgColor} ${scoreBadge.textColor} px-4 py-2 rounded-full flex items-center space-x-2 font-medium text-sm`}
        >
          {scoreBadge.icon}
          <span>{scoreBadge.label} ({result?.score})</span>
        </motion.div>
      </div>

      {/* Final Feedback */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mb-8"
      >
        <div className="text-sm text-gray-900 leading-relaxed text-center">
          {result?.feedback ?? "Great job completing this review session!"}
        </div>
      </motion.div>

      {/* Session Stats (Optional) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="bg-gray-50 rounded-lg p-4 mb-8"
      >
        <div className="text-center">
          <div className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
            Session Summary
          </div>
          <div className="flex justify-center space-x-8">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{totalQuestions}</div>
              <div className="text-xs text-gray-600">Questions</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">✓</div>
              <div className="text-xs text-gray-600">Completed</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Finish Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="flex justify-center"
      >
        <button
          onClick={onFinish}
          className="bg-[#d97757] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#c66641] transition-colors flex items-center space-x-2"
        >
          <span>Finish Review</span>
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
              d="M5 13l4 4L19 7"
            />
          </svg>
        </button>
      </motion.div>
    </div>
  );
}