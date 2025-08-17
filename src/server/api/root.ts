import { postRouter } from "~/server/api/routers/post";
import { exaRouter } from "~/server/api/routers/exa";
import { contextRouter } from "~/server/api/routers/context";
import { questionRouter } from "~/server/api/routers/question";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  exa: exaRouter,
  context: contextRouter,
  question: questionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
