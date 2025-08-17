"use client";

export function KnowledgeGraphScreen() {
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex-none p-4 border-b border-subtle bg-surface">
        <h1 className="text-header text-foreground">Knowledge Graph</h1>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="text-center max-w-sm space-y-8">
          {/* Brain Emoji */}
          <div className="text-6xl">
            🧠
          </div>
          
          {/* Title */}
          <h2 className="text-title text-foreground">Knowledge Graph</h2>

          {/* Coming Soon Card */}
          <div className="bg-surface border border-subtle rounded-lg p-6 text-left" style={{ boxShadow: 'var(--shadow-card)' }}>
            <h3 className="text-title text-foreground mb-4 text-center">Coming Soon!</h3>
            
            <p className="text-body text-secondary mb-6 text-center">
              We&apos;re building an interactive knowledge graph that will show connections between your learning materials and help you discover new topics to explore.
            </p>

            <div className="space-y-4">
              <p className="text-body text-secondary">Preview features:</p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-body text-foreground">Visual topic connections</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-body text-foreground">Learning path suggestions</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-body text-foreground">Knowledge gap identification</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chart tip */}
          <div className="flex items-center gap-2 text-body text-secondary">
            <span>📊</span>
            <span>For now, focus on building your knowledge through regular reviews!</span>
          </div>
        </div>
      </div>
    </div>
  );
}