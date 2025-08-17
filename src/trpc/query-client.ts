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
        // Keep data in cache for 10 minutes
        cacheTime: 10 * 60 * 1000, // 10 minutes  
        // Don't refetch on window focus for smoother UX
        refetchOnWindowFocus: false,
        // Keep previous data while fetching new data
        keepPreviousData: true,
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
