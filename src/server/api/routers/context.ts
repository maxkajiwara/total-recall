import { z } from "zod";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { contexts } from "~/server/db/schema";
import { getWebpageContent, ExaError } from "~/lib/exa";

// Helper function to validate XOR logic for url/text
const validateUrlOrText = (url?: string | null, text?: string | null) => {
  const hasUrl = url && url.length > 0;
  const hasText = text && text.length > 0;
  
  if (!hasUrl && !hasText) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Either 'url' or 'text' must be provided",
    });
  }
  
  if (hasUrl && hasText) {
    throw new TRPCError({
      code: "BAD_REQUEST", 
      message: "Cannot provide both 'url' and 'text' - only one is allowed",
    });
  }
};

export const contextRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required").max(256, "Name too long"),
        url: z.string().url("Invalid URL format").optional(),
        text: z.string().min(1, "Text cannot be empty").optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      validateUrlOrText(input.url, input.text);
      
      let extractedContent: string | null = null;
      
      // If URL is provided, extract content using EXA
      if (input.url) {
        try {
          console.log('Extracting content for URL:', input.url);
          const exaResponse = await getWebpageContent(input.url);
          extractedContent = JSON.stringify(exaResponse);
          console.log('Successfully extracted content, storing complete response as JSON');
        } catch (error) {
          console.error('Failed to extract content from URL:', error);
          // Don't fail the creation, just log the error and continue without extracted content
          if (error instanceof ExaError) {
            console.error('EXA Error:', error.message);
          }
        }
      }
      
      const [createdContext] = await ctx.db
        .insert(contexts)
        .values({
          name: input.name,
          url: input.url ?? null,
          text: input.text ?? null,
          extractedContent,
        })
        .returning();
      
      if (!createdContext) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create context",
        });
      }
      
      return createdContext;
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.number().int().positive("ID must be a positive integer"),
        name: z.string().min(1, "Name is required").max(256, "Name too long"),
        url: z.string().url("Invalid URL format").optional(),
        text: z.string().min(1, "Text cannot be empty").optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      validateUrlOrText(input.url, input.text);
      
      // Check if context exists first
      const existingContext = await ctx.db.query.contexts.findFirst({
        where: eq(contexts.id, input.id),
      });
      
      if (!existingContext) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Context with ID ${input.id} not found`,
        });
      }
      
      // Determine values - when switching types, null out the other field
      const hasUrl = input.url && input.url.length > 0;
      let extractedContent: string | null = null;
      
      // If URL is provided, extract content using EXA
      if (hasUrl) {
        try {
          console.log('Extracting content for updated URL:', input.url);
          const exaResponse = await getWebpageContent(input.url!);
          extractedContent = JSON.stringify(exaResponse);
          console.log('Successfully extracted content, storing complete response as JSON');
        } catch (error) {
          console.error('Failed to extract content from URL:', error);
          // Don't fail the update, just log the error and continue without extracted content
          if (error instanceof ExaError) {
            console.error('EXA Error:', error.message);
          }
        }
      }
      
      const updateValues = {
        name: input.name,
        url: hasUrl ? input.url : null,
        text: hasUrl ? null : (input.text ?? null),
        extractedContent,
        updatedAt: new Date(),
      };
      
      const [updatedContext] = await ctx.db
        .update(contexts)
        .set(updateValues)
        .where(eq(contexts.id, input.id))
        .returning();
      
      if (!updatedContext) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update context",
        });
      }
      
      return updatedContext;
    }),

  get: publicProcedure
    .input(
      z.object({
        id: z.number().int().positive("ID must be a positive integer"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const context = await ctx.db.query.contexts.findFirst({
        where: eq(contexts.id, input.id),
      });
      
      if (!context) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Context with ID ${input.id} not found`,
        });
      }
      
      return context;
    }),

  list: publicProcedure.query(async ({ ctx }) => {
    const allContexts = await ctx.db.query.contexts.findMany({
      orderBy: (contexts, { desc }) => [desc(contexts.createdAt)],
    });
    
    return allContexts;
  }),

  delete: publicProcedure
    .input(
      z.object({
        id: z.number().int().positive("ID must be a positive integer"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if context exists first
      const existingContext = await ctx.db.query.contexts.findFirst({
        where: eq(contexts.id, input.id),
      });
      
      if (!existingContext) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Context with ID ${input.id} not found`,
        });
      }
      
      const [deletedContext] = await ctx.db
        .delete(contexts)
        .where(eq(contexts.id, input.id))
        .returning();
      
      if (!deletedContext) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete context",
        });
      }
      
      return deletedContext;
    }),
});