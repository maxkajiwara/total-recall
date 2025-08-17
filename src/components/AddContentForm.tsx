"use client";

import { useAddContent } from "~/hooks/useAddContent";

interface AddContentFormProps {
  onSuccess?: () => void;
}

export function AddContentForm({ onSuccess }: AddContentFormProps) {
  const {
    formState,
    errors,
    isLoading,
    isSuccess,
    updateContent,
    updateName,
    submitForm,
    reset,
  } = useAddContent({ onSuccess });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitForm();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      submitForm();
    }
  };

  if (isSuccess) {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-green-800">Content added successfully!</h3>
              <p className="text-sm text-green-600">
                {formState.isUrl ? "URL content" : "Text"} has been processed and questions are being generated.
              </p>
            </div>
          </div>
        </div>
        
        <button
          onClick={reset}
          className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Add Another
        </button>
      </div>
    );
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      updateContent(text);
    } catch (err) {
      console.error('Failed to read clipboard:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Main Input Area */}
      <div className="space-y-4">
        <div className="relative">
          <textarea
            id="content"
            placeholder="Paste a URL or enter text to create learning materials..."
            value={formState.content}
            onChange={(e) => updateContent(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className={`w-full min-h-[120px] px-4 py-4 border-2 rounded-xl resize-none focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground ${
              errors.content 
                ? "border-red-300 focus:ring-red-500" 
                : "border-border bg-white"
            } ${isLoading ? "bg-gray-50 cursor-not-allowed" : ""}`}
            rows={4}
          />
          {formState.content && (
            <div className="absolute top-3 right-3">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                formState.isUrl 
                  ? "bg-blue-100 text-blue-800" 
                  : "bg-gray-100 text-gray-800"
              }`}>
                {formState.isUrl ? "URL" : "Text"}
              </span>
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handlePaste}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-3 bg-white border-2 border-border rounded-xl font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Paste
          </button>
          
          <button
            type="submit"
            disabled={isLoading || !formState.content.trim()}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[48px]"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Adding...</span>
              </div>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add
              </>
            )}
          </button>
        </div>
        
        {errors.content && (
          <p className="text-sm text-red-600">{errors.content}</p>
        )}
      </div>

      {/* Name Input - Only show if content is provided */}
      {formState.content.trim() && (
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-foreground">
            Name (Optional)
          </label>
          <input
            id="name"
            type="text"
            placeholder="Enter a descriptive name..."
            value={formState.name}
            onChange={(e) => updateName(e.target.value)}
            disabled={isLoading}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all ${
              errors.name 
                ? "border-red-300 focus:ring-red-500" 
                : "border-border bg-white"
            } ${isLoading ? "bg-gray-50 cursor-not-allowed" : ""}`}
          />
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name}</p>
          )}
        </div>
      )}

      {/* Error Display */}
      {errors.general && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{errors.general}</p>
        </div>
      )}
    </form>
  );
}