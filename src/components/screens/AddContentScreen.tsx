"use client";

import { AddContentForm } from "~/components/AddContentForm";
import { RecentAdds } from "~/components/RecentAdds";

export function AddContentScreen() {
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex-none p-4 border-b border-subtle bg-surface">
        <h1 className="text-header text-foreground">Add Learning Content</h1>
        <p className="text-body text-secondary mt-1">
          Add URLs or text to create flashcards for spaced repetition learning
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Add Content Form */}
        <div className="bg-surface rounded-lg border border-subtle p-4 shadow-card">
          <AddContentForm />
        </div>

        {/* Recent Adds */}
        <div>
          <h2 className="text-title text-foreground mb-4">Recent Additions</h2>
          <RecentAdds />
        </div>
      </div>
    </div>
  );
}