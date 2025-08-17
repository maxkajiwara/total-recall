import { SwipeContainer } from "~/components/SwipeContainer";
import { AddContentScreen } from "~/components/screens/AddContentScreen";
import { ReviewScreen } from "~/components/screens/ReviewScreen";
import { KnowledgeGraphScreen } from "~/components/screens/KnowledgeGraphScreen";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  // Prefetch data for all screens
  void api.question.getDue.prefetch({ limit: 100 });
  void api.context.list.prefetch();
  void api.question.list.prefetch();

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
