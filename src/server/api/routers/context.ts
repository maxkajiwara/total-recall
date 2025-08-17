import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getWebpageContent, ExaError } from "~/lib/exa";
import { generateQuestions } from "~/lib/ai";
import { getDefaultFSRSValues } from "~/lib/fsrs";

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
    .meta({ 
      openapi: { 
        enabled: true, 
        description: "Create a new context with either URL or text content" 
      } 
    })
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
      
      const createdContext = await ctx.db.context.create({
        data: {
          name: input.name,
          url: input.url ?? null,
          text: input.text ?? null,
          extractedContent: extractedContent ?? input.text,
        },
      });
      
      // Generate questions if we have content
      const contentForQuestions = extractedContent ?? input.text;
      if (contentForQuestions && process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        try {
          console.log('Generating questions for new context...');
          const flashcards = await generateQuestions(contentForQuestions);
          
          if (flashcards.length > 0) {
            await ctx.db.question.createMany({
              data: flashcards.map(fc => ({
                contextId: createdContext.id,
                question: fc.question,
                answer: fc.answer,
                ...getDefaultFSRSValues(),
              })),
            });
            console.log(`Generated ${flashcards.length} questions for context ${createdContext.id}`);
          }
        } catch (error) {
          console.error('Failed to generate questions:', error);
          // Don't fail the context creation if question generation fails
        }
      }
      
      return createdContext;
    }),

  update: publicProcedure
    .meta({ 
      openapi: { 
        enabled: true, 
        description: "Update an existing context" 
      } 
    })
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
      const existingContext = await ctx.db.context.findUnique({
        where: { id: input.id },
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
      
      const updatedContext = await ctx.db.context.update({
        where: { id: input.id },
        data: {
          name: input.name,
          url: hasUrl ? input.url : null,
          text: hasUrl ? null : (input.text ?? null),
          extractedContent: extractedContent ?? (hasUrl ? null : input.text),
        },
      });
      
      // Regenerate questions if we have content
      const contentForQuestions = extractedContent ?? (hasUrl ? null : input.text);
      if (contentForQuestions && process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        try {
          console.log('Regenerating questions for updated context...');
          
          // Delete existing questions
          await ctx.db.question.deleteMany({
            where: { contextId: input.id },
          });
          
          // Generate new questions
          const flashcards = await generateQuestions(contentForQuestions);
          
          if (flashcards.length > 0) {
            await ctx.db.question.createMany({
              data: flashcards.map(fc => ({
                contextId: input.id,
                question: fc.question,
                answer: fc.answer,
                ...getDefaultFSRSValues(),
              })),
            });
            console.log(`Regenerated ${flashcards.length} questions for context ${input.id}`);
          }
        } catch (error) {
          console.error('Failed to regenerate questions:', error);
          // Don't fail the context update if question generation fails
        }
      }
      
      return updatedContext;
    }),

  get: publicProcedure
    .meta({ 
      openapi: { 
        enabled: true, 
        description: "Get a context by ID" 
      } 
    })
    .input(
      z.object({
        id: z.number().int().positive("ID must be a positive integer"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const context = await ctx.db.context.findUnique({
        where: { id: input.id },
      });
      
      if (!context) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Context with ID ${input.id} not found`,
        });
      }
      
      return context;
    }),

  list: publicProcedure
    .meta({ 
      openapi: { 
        enabled: true, 
        description: "List all contexts" 
      } 
    })
    .query(async ({ ctx }) => {
    const allContexts = await ctx.db.context.findMany({
      orderBy: { createdAt: "desc" },
    });
    
    return allContexts;
  }),

  delete: publicProcedure
    .meta({ 
      openapi: { 
        enabled: true, 
        description: "Delete a context by ID" 
      } 
    })
    .input(
      z.object({
        id: z.number().int().positive("ID must be a positive integer"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if context exists first
      const existingContext = await ctx.db.context.findUnique({
        where: { id: input.id },
      });
      
      if (!existingContext) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Context with ID ${input.id} not found`,
        });
      }
      
      const deletedContext = await ctx.db.context.delete({
        where: { id: input.id },
      });
      
      return deletedContext;
    }),
});