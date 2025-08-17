import { CheckCircle, Trophy } from 'lucide-react';
import type { ReviewResult } from '~/hooks/useReviewSession';

interface SessionCompleteProps {
  lastResult: ReviewResult | null;
  totalQuestions: number;
  onFinish: () => void;
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

export function SessionComplete({ lastResult, totalQuestions, onFinish }: SessionCompleteProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-6 min-h-[400px]">
      {/* Success Icon */}
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
        <Trophy className="w-8 h-8 text-green-600" />
      </div>

      {/* Completion Message */}
      <div className="text-xl font-semibold text-gray-900 text-center">
        Session Complete!
      </div>

      <div className="text-sm text-gray-600 text-center">
        You've completed {totalQuestions} question{totalQuestions !== 1 ? 's' : ''}
      </div>

      {/* Last Question Result */}
      {lastResult && (
        <div className="flex flex-col items-center space-y-4 mt-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
              scoreColors[lastResult.score as keyof typeof scoreColors] || scoreColors[3]
            }`}>
              {scoreLabels[lastResult.score as keyof typeof scoreLabels] || 'Unknown'} ({lastResult.score})
            </span>
          </div>

          <div className="text-sm text-gray-700 text-center max-w-md leading-relaxed">
            {lastResult.feedback}
          </div>
        </div>
      )}

      {/* Finish Button */}
      <button
        onClick={onFinish}
        className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 mt-8"
      >
        Finish Review
      </button>
    </div>
  );
}