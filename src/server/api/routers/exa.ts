import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getWebpageContent, ExaError } from "~/lib/exa";

export const exaRouter = createTRPCRouter({
  getContent: publicProcedure
    .input(
      z.object({
        url: z.string().url("Please provide a valid URL"),
      }),
    )
    .query(async ({ input, ctx }) => {
      console.log('EXA getContent called with input:', JSON.stringify(input, null, 2));
      console.log('Input type:', typeof input);
      console.log('Input url:', input?.url);
      
      try {
        const content = await getWebpageContent(input.url);
        console.log('Successfully got content, returning response');
        return {
          url: input.url,
          content,
          success: true,
        };
      } catch (error) {
        console.error('Error in getContent procedure:', error);
        if (error instanceof ExaError) {
          throw new Error(`EXA API Error: ${error.message}`);
        }
        throw new Error(`Failed to fetch content: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),
});