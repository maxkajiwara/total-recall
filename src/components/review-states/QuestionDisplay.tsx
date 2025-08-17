import { Mic } from 'lucide-react';
import type { Question } from '~/hooks/useReviewSession';

interface QuestionDisplayProps {
  question: Question;
  onStartRecording: () => void;
  isRecordingSupported: boolean;
  error?: string | null;
}

export function QuestionDisplay({ 
  question, 
  onStartRecording, 
  isRecordingSupported, 
  error 
}: QuestionDisplayProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-6 min-h-[400px]">
      {/* Context Name */}
      <div className="text-sm text-gray-600 font-medium text-center">
        {question.context.name}
      </div>

      {/* Question Text */}
      <div className="text-lg font-medium text-gray-900 text-center max-w-md leading-relaxed">
        {question.question}
      </div>

      {/* Microphone Button */}
      <div className="flex flex-col items-center space-y-3 mt-8">
        <button
          onClick={onStartRecording}
          disabled={!isRecordingSupported}
          className={`
            w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200
            ${isRecordingSupported 
              ? 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700 shadow-lg hover:shadow-xl' 
              : 'bg-gray-300 cursor-not-allowed'
            }
          `}
        >
          <Mic className="w-6 h-6 text-white" />
        </button>

        {/* Instructions */}
        <div className="text-sm text-gray-600 text-center">
          {isRecordingSupported 
            ? 'Tap the microphone to record your answer'
            : 'Microphone not supported in this browser'
          }
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-sm text-red-600 text-center mt-2 max-w-md">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}