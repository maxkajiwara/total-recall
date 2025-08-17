import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { processReview, getSchedulingOptions, Rating, getDefaultFSRSValues } from "~/lib/fsrs";
import { processVoiceAnswer, evaluateAnswer } from "~/lib/voice-evaluation";

export const questionRouter = createTRPCRouter({
  create: publicProcedure
    .meta({ 
      openapi: { 
        enabled: true, 
        description: "Create a new question linked to a context" 
      } 
    })
    .input(
      z.object({
        contextId: z.number().int().positive("Context ID must be a positive integer"),
        question: z.string().min(1, "Question is required"),
        answer: z.string().min(1, "Answer is required"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Validate that context exists before creating
      const existingContext = await ctx.db.context.findUnique({
        where: { id: input.contextId },
      });
      
      if (!existingContext) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Context with ID ${input.contextId} not found`,
        });
      }
      
      const createdQuestion = await ctx.db.question.create({
        data: {
          contextId: input.contextId,
          question: input.question,
          answer: input.answer,
          ...getDefaultFSRSValues(),
        },
      });
      
      return createdQuestion;
    }),

  update: publicProcedure
    .meta({ 
      openapi: { 
        enabled: true, 
        description: "Update question/answer text only" 
      } 
    })
    .input(
      z.object({
        id: z.number().int().positive("ID must be a positive integer"),
        question: z.string().min(1, "Question is required"),
        answer: z.string().min(1, "Answer is required"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if question exists first
      const existingQuestion = await ctx.db.question.findUnique({
        where: { id: input.id },
      });
      
      if (!existingQuestion) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Question with ID ${input.id} not found`,
        });
      }
      
      const updatedQuestion = await ctx.db.question.update({
        where: { id: input.id },
        data: {
          question: input.question,
          answer: input.answer,
        },
      });
      
      return updatedQuestion;
    }),

  get: publicProcedure
    .meta({ 
      openapi: { 
        enabled: true, 
        description: "Get a question by ID with related context" 
      } 
    })
    .input(
      z.object({
        id: z.number().int().positive("ID must be a positive integer"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const question = await ctx.db.question.findUnique({
        where: { id: input.id },
        include: {
          context: true,
        },
      });
      
      if (!question) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Question with ID ${input.id} not found`,
        });
      }
      
      return question;
    }),

  list: publicProcedure
    .meta({ 
      openapi: { 
        enabled: true, 
        description: "List all questions with optional context filter" 
      } 
    })
    .input(
      z.object({
        contextId: z.number().int().positive("Context ID must be a positive integer").optional(),
      }).optional(),
    )
    .query(async ({ ctx, input }) => {
      const where = input?.contextId ? { contextId: input.contextId } : {};
      
      const allQuestions = await ctx.db.question.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: {
          context: true,
        },
      });
      
      return allQuestions;
    }),

  listByContext: publicProcedure
    .meta({ 
      openapi: { 
        enabled: true, 
        description: "List questions for a specific context" 
      } 
    })
    .input(
      z.object({
        contextId: z.number().int().positive("Context ID must be a positive integer"),
      }),
    )
    .query(async ({ ctx, input }) => {
      // Validate that context exists
      const existingContext = await ctx.db.context.findUnique({
        where: { id: input.contextId },
      });
      
      if (!existingContext) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Context with ID ${input.contextId} not found`,
        });
      }
      
      const questions = await ctx.db.question.findMany({
        where: { contextId: input.contextId },
        orderBy: { createdAt: "desc" },
        include: {
          context: true,
        },
      });
      
      return questions;
    }),

  delete: publicProcedure
    .meta({ 
      openapi: { 
        enabled: true, 
        description: "Delete a question by ID" 
      } 
    })
    .input(
      z.object({
        id: z.number().int().positive("ID must be a positive integer"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if question exists first
      const existingQuestion = await ctx.db.question.findUnique({
        where: { id: input.id },
      });
      
      if (!existingQuestion) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Question with ID ${input.id} not found`,
        });
      }
      
      const deletedQuestion = await ctx.db.question.delete({
        where: { id: input.id },
      });
      
      return deletedQuestion;
    }),

  review: publicProcedure
    .meta({ 
      openapi: { 
        enabled: true, 
        description: "Review a question and update FSRS scheduling" 
      } 
    })
    .input(
      z.object({
        id: z.number().int().positive("ID must be a positive integer"),
        rating: z.number().int().min(1).max(4), // 1=Again, 2=Hard, 3=Good, 4=Easy
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if question exists first
      const existingQuestion = await ctx.db.question.findUnique({
        where: { id: input.id },
      });
      
      if (!existingQuestion) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Question with ID ${input.id} not found`,
        });
      }
      
      // Process the review with FSRS
      const updatedCardData = processReview(existingQuestion, input.rating as Rating);
      
      const updatedQuestion = await ctx.db.question.update({
        where: { id: input.id },
        data: updatedCardData,
      });
      
      return updatedQuestion;
    }),

  getScheduling: publicProcedure
    .meta({ 
      openapi: { 
        enabled: true, 
        description: "Get scheduling options for a question" 
      } 
    })
    .input(
      z.object({
        id: z.number().int().positive("ID must be a positive integer"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const question = await ctx.db.question.findUnique({
        where: { id: input.id },
      });
      
      if (!question) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Question with ID ${input.id} not found`,
        });
      }
      
      const options = getSchedulingOptions(question);
      
      return {
        again: {
          interval: options[Rating.Again].card.scheduled_days,
          due: options[Rating.Again].card.due,
        },
        hard: {
          interval: options[Rating.Hard].card.scheduled_days,
          due: options[Rating.Hard].card.due,
        },
        good: {
          interval: options[Rating.Good].card.scheduled_days,
          due: options[Rating.Good].card.due,
        },
        easy: {
          interval: options[Rating.Easy].card.scheduled_days,
          due: options[Rating.Easy].card.due,
        },
      };
    }),

  getDue: publicProcedure
    .meta({ 
      openapi: { 
        enabled: true, 
        description: "Get questions that are due for review" 
      } 
    })
    .input(
      z.object({
        contextId: z.number().int().positive("Context ID must be a positive integer").optional(),
        limit: z.number().int().positive().max(100).default(20),
      }).optional(),
    )
    .query(async ({ ctx, input }) => {
      const now = new Date();
      const where = {
        due: { lte: now },
        ...(input?.contextId && { contextId: input.contextId }),
      };
      
      const dueQuestions = await ctx.db.question.findMany({
        where,
        orderBy: { due: "asc" },
        take: input?.limit ?? 20,
        include: {
          context: true,
        },
      });
      
      return dueQuestions;
    }),

  evaluateAnswer: publicProcedure
    .meta({ 
      openapi: { 
        enabled: true, 
        description: "Evaluate voice answer and update FSRS" 
      } 
    })
    .input(
      z.object({
        questionId: z.number().int().positive("Question ID must be a positive integer"),
        audioData: z.string().min(1, "Audio data is required"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Get the question with context
      const question = await ctx.db.question.findUnique({
        where: { id: input.questionId },
        include: {
          context: true,
        },
      });
      
      if (!question) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Question with ID ${input.questionId} not found`,
        });
      }
      
      try {
        // Process the voice answer
        const { transcription, feedback, score } = await processVoiceAnswer(
          input.audioData,
          question
        );
        
        // Update FSRS using the existing review endpoint logic
        const updatedCardData = processReview(question, score as Rating);
        
        const updatedQuestion = await ctx.db.question.update({
          where: { id: input.questionId },
          data: updatedCardData,
        });
        
        return {
          transcription,
          feedback,
          score,
          nextDue: updatedQuestion.due,
        };
      } catch (error) {
        console.error('Error processing voice answer:', error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to process voice answer",
        });
      }
    }),

  evaluateTextAnswer: publicProcedure
    .meta({ 
      openapi: { 
        enabled: true, 
        description: "Evaluate text answer and update FSRS" 
      } 
    })
    .input(
      z.object({
        questionId: z.number().int().positive("Question ID must be a positive integer"),
        textAnswer: z.string().min(1, "Text answer is required"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Get the question with context
      const question = await ctx.db.question.findUnique({
        where: { id: input.questionId },
        include: {
          context: true,
        },
      });
      
      if (!question) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Question with ID ${input.questionId} not found`,
        });
      }
      
      try {
        // Evaluate the text answer directly with Google Gemini
        const { feedback, score } = await evaluateAnswer(
          input.textAnswer,
          question.answer,
          question.question
        );
        
        // Update FSRS using the existing review endpoint logic
        const updatedCardData = processReview(question, score as Rating);
        
        const updatedQuestion = await ctx.db.question.update({
          where: { id: input.questionId },
          data: updatedCardData,
        });
        
        return {
          feedback,
          score,
          nextDue: updatedQuestion.due,
        };
      } catch (error) {
        console.error('Error evaluating text answer:', error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to evaluate text answer",
        });
      }
    }),
});