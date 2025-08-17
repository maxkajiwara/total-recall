export function ProcessingState() {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-6 min-h-[400px]">
      {/* Processing Title */}
      <div className="text-xl font-semibold text-gray-900">
        Processing...
      </div>

      {/* Loading Animation */}
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" />
      </div>

      {/* Processing Description */}
      <div className="text-sm text-gray-600 text-center max-w-sm leading-relaxed">
        Transcribing and evaluating your answer...
      </div>
    </div>
  );
}