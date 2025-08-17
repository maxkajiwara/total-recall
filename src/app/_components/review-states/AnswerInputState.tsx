"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface AnswerInputStateProps {
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
  onSubmitAnswer: (textAnswer: string) => void;
}

export function AnswerInputState({
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  onClose,
  onSubmitAnswer
}: AnswerInputStateProps) {
  const [answer, setAnswer] = useState("");
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const handleSubmit = () => {
    if (answer.trim()) {
      onSubmitAnswer(answer.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey) && answer.trim()) {
      handleSubmit();
    }
  };

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

      {/* Answer Input */}
      <div className="space-y-4">
        <div className="relative">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your answer here..."
            className="w-full min-h-32 p-4 border-2 border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#d97757] focus:border-transparent transition-all"
            autoFocus
          />
          <div className="absolute bottom-3 right-3 text-xs text-gray-400">
            {answer.length > 0 && `${answer.length} characters`}
          </div>
        </div>
        
        <div className="flex flex-col items-center space-y-2">
          <motion.button
            onClick={handleSubmit}
            disabled={!answer.trim()}
            className="w-full py-3 px-6 bg-[#d97757] text-white rounded-lg font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-[#c66641] transition-colors"
            whileHover={answer.trim() ? { scale: 1.02 } : {}}
            whileTap={answer.trim() ? { scale: 0.98 } : {}}
          >
            Submit Answer
          </motion.button>
          
          <div className="text-xs text-gray-500 text-center">
            Press Ctrl+Enter (Cmd+Enter on Mac) to submit quickly
          </div>
        </div>
      </div>
    </div>
  );
}