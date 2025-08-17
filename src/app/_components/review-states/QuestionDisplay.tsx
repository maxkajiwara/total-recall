"use client";

import { motion } from "framer-motion";

interface QuestionDisplayProps {
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
  onStartAnswering: () => void;
}

export function QuestionDisplay({
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  onClose,
  onStartAnswering
}: QuestionDisplayProps) {
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

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
        <motion.div
          className="bg-[#d97757] h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Context Name */}
      <div className="mb-6">
        <div className="text-sm font-medium text-[#d97757] bg-orange-50 px-3 py-1 rounded-full inline-block">
          {currentQuestion.context.name}
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <div className="text-lg font-medium text-gray-900 leading-relaxed">
          {currentQuestion.question}
        </div>
      </div>

      {/* Answer Button */}
      <div className="flex flex-col items-center">
        <motion.button
          onClick={onStartAnswering}
          className="w-20 h-20 bg-[#d97757] rounded-full flex items-center justify-center text-white shadow-lg hover:bg-[#c66641] transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Start answering"
        >
          <svg
            className="w-8 h-8"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
          </svg>
        </motion.button>
        
        <div className="mt-4 text-center">
          <div className="text-sm font-medium text-gray-900">
            Tap to answer
          </div>
          <div className="text-sm text-gray-600">
            Type your response
          </div>
        </div>
      </div>
    </div>
  );
}