import { CheckCircle, ArrowRight } from 'lucide-react';
import type { ReviewResult } from '~/hooks/useReviewSession';

interface FeedbackStateProps {
  result: ReviewResult;
  onNext: () => void;
  isLastQuestion: boolean;
}

const scoreLabels = {
  1: 'Again',
  2: 'Hard', 
  3: 'Good',
  4: 'Easy'
} as const;

const scoreColors = {
  1: 'bg-red-100 text-red-800 border-red-200',
  2: 'bg-orange-100 text-orange-800 border-orange-200',
  3: 'bg-green-100 text-green-800 border-green-200',
  4: 'bg-blue-100 text-blue-800 border-blue-200'
} as const;

export function FeedbackState({ result, onNext, isLastQuestion }: FeedbackStateProps) {
  const scoreLabel = scoreLabels[result.score as keyof typeof scoreLabels] || 'Unknown';
  const scoreColorClass = scoreColors[result.score as keyof typeof scoreColors] || scoreColors[3];

  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-6 min-h-[400px]">
      {/* Score Badge */}
      <div className="flex items-center space-x-2">
        <CheckCircle className="w-5 h-5 text-green-600" />
        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${scoreColorClass}`}>
          {scoreLabel} ({result.score})
        </span>
      </div>

      {/* Feedback Text */}
      <div className="text-sm text-gray-700 text-center max-w-md leading-relaxed">
        {result.feedback}
      </div>

      {/* Transcription section removed for text input version */}

      {/* Next Button */}
      <button
        onClick={onNext}
        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 mt-8"
      >
        <span>{isLastQuestion ? 'Finish Review' : 'Next Question'}</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}