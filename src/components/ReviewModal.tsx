import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useReviewSession, type Question } from '~/hooks/useReviewSession';
import { useVoiceRecording } from '~/hooks/useVoiceRecording';
import { QuestionDisplay } from './review-states/QuestionDisplay';
import { RecordingState } from './review-states/RecordingState';
import { ProcessingState } from './review-states/ProcessingState';
import { FeedbackState } from './review-states/FeedbackState';
import { SessionComplete } from './review-states/SessionComplete';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
}

export function ReviewModal({ isOpen, onClose, questions }: ReviewModalProps) {
  const {
    currentState,
    currentQuestion,
    currentQuestionIndex,
    currentResult,
    sessionProgress,
    error: sessionError,
    startSession,
    nextQuestion,
    setState,
    submitAnswer,
    exitSession,
  } = useReviewSession();

  const {
    isRecording,
    audioBase64,
    error: recordingError,
    isSupported,
    startRecording,
    stopRecording,
    resetRecording,
  } = useVoiceRecording();

  // Initialize session when modal opens
  useEffect(() => {
    if (isOpen && questions.length > 0) {
      startSession(questions);
      resetRecording();
    }
  }, [isOpen, questions, startSession, resetRecording]);

  // Handle recording state transitions
  useEffect(() => {
    if (isRecording && currentState === 'question') {
      setState('answering');
    }
  }, [isRecording, currentState, setState]);

  // Handle audio submission when recording stops
  useEffect(() => {
    if (audioBase64 && currentState === 'answering') {
      submitAnswer(audioBase64);
      resetRecording();
    }
  }, [audioBase64, currentState, submitAnswer, resetRecording]);

  const handleClose = () => {
    exitSession();
    resetRecording();
    onClose();
  };

  const handleStartRecording = async () => {
    resetRecording();
    await startRecording();
  };

  const handleStopRecording = () => {
    stopRecording();
  };

  const handleNext = () => {
    nextQuestion();
    resetRecording();
  };

  if (!isOpen) return null;

  const totalQuestions = questions.length;
  const isLastQuestion = currentQuestionIndex >= totalQuestions - 1;
  const error = sessionError || recordingError;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">
              Question {currentQuestionIndex + 1}/{totalQuestions}
            </span>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-2">
          <div 
            className="bg-blue-600 h-2 transition-all duration-300 ease-out"
            style={{ width: `${sessionProgress}%` }}
          />
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {currentState === 'question' && currentQuestion && (
            <QuestionDisplay
              question={currentQuestion}
              onStartRecording={handleStartRecording}
              isRecordingSupported={isSupported}
              error={error}
            />
          )}

          {currentState === 'answering' && currentQuestion && (
            <RecordingState
              question={currentQuestion}
              onStopRecording={handleStopRecording}
            />
          )}

          {currentState === 'processing' && (
            <ProcessingState />
          )}

          {currentState === 'feedback' && currentResult && (
            <FeedbackState
              result={currentResult}
              onNext={handleNext}
              isLastQuestion={isLastQuestion}
            />
          )}

          {currentState === 'complete' && (
            <SessionComplete
              lastResult={currentResult}
              totalQuestions={totalQuestions}
              onFinish={handleClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}