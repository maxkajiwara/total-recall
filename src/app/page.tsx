import { SwipeContainer } from "~/components/SwipeContainer";
import { AddContentScreen } from "~/components/screens/AddContentScreen";
import { ReviewScreen } from "~/components/screens/ReviewScreen";
import { KnowledgeGraphScreen } from "~/components/screens/KnowledgeGraphScreen";
import { HydrateClient } from "~/trpc/server";

// Force dynamic rendering since we need database access
export const dynamic = 'force-dynamic';

export default async function Home() {

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
