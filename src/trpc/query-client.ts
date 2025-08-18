import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from "@tanstack/react-query";
import SuperJSON from "superjson";

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // Keep data fresh for 5 minutes to prevent unnecessary refetches during navigation
        staleTime: 5 * 60 * 1000, // 5 minutes
        // Keep data in cache for 10 minutes (gcTime is the new name for cacheTime)
        gcTime: 10 * 60 * 1000, // 10 minutes  
        // Don't refetch on window focus for smoother UX
        refetchOnWindowFocus: false,
        // Retry failed requests once
        retry: 1,
      },
      dehydrate: {
        serializeData: SuperJSON.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
      hydrate: {
        deserializeData: SuperJSON.deserialize,
      },
    },
  });
