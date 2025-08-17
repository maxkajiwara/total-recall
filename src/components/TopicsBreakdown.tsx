import type { TopicBreakdown } from "~/hooks/useReviewData";

interface TopicsBreakdownProps {
  topics: TopicBreakdown[];
  showAll?: boolean;
}

export function TopicsBreakdown({ topics, showAll = false }: TopicsBreakdownProps) {
  const displayTopics = showAll ? topics : topics.filter(t => t.dueCount > 0);

  if (displayTopics.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-4 text-card-foreground">
        <h3 className="mb-3 font-semibold">Review Topics</h3>
        <div className="text-center text-muted-foreground">
          {showAll ? "No topics available" : "No cards due by topic"}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-4 text-card-foreground">
      <h3 className="mb-3 font-semibold">Review Topics</h3>
      <div className="space-y-2">
        {displayTopics.map((topic) => (
          <div 
            key={topic.contextId}
            className="flex items-center justify-between rounded p-2 hover:bg-muted/50"
          >
            <span className="font-medium">{topic.contextName}</span>
            <div className="text-sm">
              {showAll ? (
                <span className="text-muted-foreground">
                  {topic.dueCount > 0 && (
                    <span className="mr-2 font-semibold text-foreground">
                      {topic.dueCount} due
                    </span>
                  )}
                  {topic.totalCount} total
                </span>
              ) : (
                <span className="font-semibold">
                  {topic.dueCount} {topic.dueCount === 1 ? 'card' : 'cards'}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}