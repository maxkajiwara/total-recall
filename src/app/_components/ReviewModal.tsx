"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { useReviewSession, type Question } from "~/hooks/useReviewSession";
import { QuestionDisplay } from "./review-states/QuestionDisplay";
import { AnswerInputState } from "./review-states/AnswerInputState";
import { ProcessingState } from "./review-states/ProcessingState";
import { FeedbackState } from "./review-states/FeedbackState";
import { SessionComplete } from "./review-states/SessionComplete";
import { ModalPortal } from "~/components/ModalPortal";


interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
}

export type ReviewState = 
  | "question"
  | "answering" 
  | "processing"
  | "feedback"
  | "complete";

export function ReviewModal({ isOpen, onClose, questions }: ReviewModalProps) {
  const {
    currentState,
    currentQuestionIndex,
    currentQuestion,
    sessionData,
    nextQuestion,
    finishSession,
    setState,
    resetSession,
    startSession,
    submitAnswer,
    currentResult
  } = useReviewSession();

  // Reset session when modal opens
  useEffect(() => {
    if (isOpen && questions.length > 0) {
      startSession(questions);
    }
  }, [isOpen, questions, startSession]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleClose = () => {
    resetSession();
    onClose();
  };

  const renderCurrentState = () => {
    if (!currentQuestion) return null;

    const commonProps = {
      currentQuestion,
      currentQuestionIndex,
      totalQuestions: questions.length,
      onClose: handleClose,
    };

    switch (currentState) {
      case "question":
        return (
          <QuestionDisplay
            {...commonProps}
            onStartAnswering={() => setState("answering")}
          />
        );
      
      case "answering":
        return (
          <AnswerInputState
            {...commonProps}
            onSubmitAnswer={(textAnswer: string) => {
              void submitAnswer(textAnswer);
            }}
          />
        );
      
      case "processing":
        return (
          <ProcessingState
            {...commonProps}
            questionId={currentQuestion.id}
            onProcessingComplete={(result) => {
              // This is now handled by useReviewSession
            }}
          />
        );
      
      case "feedback":
        return (
          <FeedbackState
            {...commonProps}
            result={currentResult ?? { feedback: "No feedback available", score: 1, nextDue: new Date() }}
            onNext={() => {
              if (currentQuestionIndex >= questions.length - 1) {
                setState("complete");
              } else {
                nextQuestion();
                setState("question");
              }
            }}
          />
        );
      
      case "complete":
        return (
          <SessionComplete
            {...commonProps}
            result={currentResult ?? { feedback: "Session completed!", score: 3, nextDue: new Date() }}
            onFinish={() => {
              finishSession();
              handleClose();
            }}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <ModalPortal>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                handleClose();
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                {renderCurrentState()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ModalPortal>
  );
}