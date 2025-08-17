"use client";

import { motion } from "framer-motion";
import { useVoiceRecording } from "~/hooks/useVoiceRecording";
import { useEffect } from "react";

interface RecordingStateProps {
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
  onStopRecording: (audioData: string) => void;
  onProcessingStart: () => void;
}

export function RecordingState({
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  onClose,
  onStopRecording,
  onProcessingStart
}: RecordingStateProps) {
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  
  const { isRecording, stopRecording, audioBase64 } = useVoiceRecording();

  // Handle when recording is complete and audio is ready
  useEffect(() => {
    if (audioBase64 && !isRecording) {
      onStopRecording(audioBase64);
      onProcessingStart();
    }
  }, [audioBase64, isRecording, onStopRecording, onProcessingStart]);

  const handleStopRecording = () => {
    stopRecording();
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
        <div
          className="bg-blue-600 h-2 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Context Name */}
      <div className="mb-6">
        <div className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full inline-block">
          {currentQuestion.context.name}
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <div className="text-lg font-medium text-gray-900 leading-relaxed">
          {currentQuestion.question}
        </div>
      </div>

      {/* Recording Interface */}
      <div className="flex flex-col items-center">
        {/* Recording Dot with Pulsing Animation */}
        <motion.button
          onClick={handleStopRecording}
          className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg relative overflow-hidden"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Stop recording"
        >
          {/* Pulsing Background */}
          <motion.div
            className="absolute inset-0 bg-red-600 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.8, 0.4, 0.8]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Recording Dot */}
          <motion.div
            className="w-4 h-4 bg-white rounded-full z-10"
            animate={{
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.button>

        {/* Animated Sound Waves */}
        <div className="flex items-center justify-center mt-4 space-x-1">
          {[...Array(7)].map((_, index) => (
            <motion.div
              key={index}
              className="w-1 bg-red-600 rounded-full"
              animate={{
                height: [8, 24, 8],
                opacity: [0.4, 1, 0.4]
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: index * 0.1,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
        
        <div className="mt-4 text-center">
          <div className="text-sm font-medium text-red-600">
            Recording...
          </div>
          <div className="text-sm text-gray-600">
            Tap to stop
          </div>
        </div>
      </div>
    </div>
  );
}