import { ResponsiveLayout } from "~/components/ResponsiveLayout";
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
        <ResponsiveLayout />
      </main>
    </HydrateClient>
  );
}
