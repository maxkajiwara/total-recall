import { useEffect, useState } from 'react';
import type { Question } from '~/hooks/useReviewSession';

interface RecordingStateProps {
  question: Question;
  onStopRecording: () => void;
}

export function RecordingState({ question, onStopRecording }: RecordingStateProps) {
  const [pulseClass, setPulseClass] = useState('');

  // Pulsing animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseClass('animate-pulse');
      setTimeout(() => setPulseClass(''), 500);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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

      {/* Recording Indicator */}
      <div className="flex flex-col items-center space-y-4 mt-8">
        {/* Red Recording Dot */}
        <button
          onClick={onStopRecording}
          className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 active:bg-red-700 flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <div className={`w-4 h-4 bg-white rounded-full ${pulseClass}`} />
        </button>

        {/* Pulsing Dots Animation */}
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
        </div>

        {/* Recording Status */}
        <div className="text-center">
          <div className="text-base font-medium text-red-600">Recording...</div>
          <div className="text-sm text-gray-600 mt-1">Tap to stop</div>
        </div>
      </div>
    </div>
  );
}