import { SwipeContainer } from "~/components/SwipeContainer";
import { AddContentScreen } from "~/components/screens/AddContentScreen";
import { ReviewScreen } from "~/components/screens/ReviewScreen";
import { KnowledgeGraphScreen } from "~/components/screens/KnowledgeGraphScreen";
import { api, HydrateClient } from "~/trpc/server";

// Force dynamic rendering since we need database access
export const dynamic = 'force-dynamic';

export default async function Home() {
  // Prefetch all data on the server to make initial load instant
  void api.context.list.prefetch();
  void api.question.list.prefetch();
  void api.question.getDue.prefetch({ limit: 100 });

  return (
    <HydrateClient>
      <main className="min-h-screen">
        <SwipeContainer>
          <AddContentScreen />
          <ReviewScreen />
          <KnowledgeGraphScreen />
        </SwipeContainer>
      </main>
    </HydrateClient>
  );
}
