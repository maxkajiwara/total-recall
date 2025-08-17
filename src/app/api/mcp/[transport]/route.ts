import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { createCaller } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

const handler = createMcpHandler(
  async (server) => {
    // Create tRPC context and caller
    const context = await createTRPCContext({ headers: new Headers() });
    const caller = createCaller(context);

    // Register Context CRUD tools
    server.tool(
      "context_create",
      "Create a new context with either URL or text content",
      {
        name: z.string().describe("Name of the context"),
        url: z.string().optional().describe("URL to extract content from"),
        text: z.string().optional().describe("Text content (cannot be used with URL)"),
      },
      async (input) => {
        try {
          const result = await caller.context.create(input);
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
              },
            ],
          };
        }
      }
    );

    server.tool(
      "context_update",
      "Update an existing context",
      {
        id: z.number().describe("ID of the context to update"),
        name: z.string().describe("New name for the context"),
        url: z.string().optional().describe("New URL to extract content from"),
        text: z.string().optional().describe("New text content (cannot be used with URL)"),
      },
      async (input) => {
        try {
          const result = await caller.context.update(input);
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
              },
            ],
          };
        }
      }
    );

    server.tool(
      "context_get",
      "Get a context by ID",
      {
        id: z.number().describe("ID of the context to retrieve"),
      },
      async (input) => {
        try {
          const result = await caller.context.get(input);
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
              },
            ],
          };
        }
      }
    );

    server.tool(
      "context_list",
      "List all contexts",
      {},
      async () => {
        try {
          const result = await caller.context.list();
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
              },
            ],
          };
        }
      }
    );

    server.tool(
      "context_delete",
      "Delete a context by ID",
      {
        id: z.number().describe("ID of the context to delete"),
      },
      async (input) => {
        try {
          const result = await caller.context.delete(input);
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
              },
            ],
          };
        }
      }
    );

    // Register Question CRUD tools
    server.tool(
      "question_create",
      "Create a new question linked to a context",
      {
        contextId: z.number().describe("ID of the context to link the question to"),
        question: z.string().describe("The question text"),
        answer: z.string().describe("The answer text"),
      },
      async (input) => {
        try {
          const result = await caller.question.create(input);
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
              },
            ],
          };
        }
      }
    );

    server.tool(
      "question_list",
      "List all questions with optional context filter",
      {
        contextId: z.number().optional().describe("Optional context ID to filter questions"),
      },
      async (input) => {
        try {
          const result = await caller.question.list(input);
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
              },
            ],
          };
        }
      }
    );

    server.tool(
      "question_listByContext",
      "List questions for a specific context",
      {
        contextId: z.number().describe("Context ID to list questions for"),
      },
      async (input) => {
        try {
          const result = await caller.question.listByContext(input);
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
              },
            ],
          };
        }
      }
    );

    server.tool(
      "question_review",
      "Review a question and update FSRS scheduling",
      {
        id: z.number().describe("ID of the question to review"),
        rating: z.number().min(1).max(4).describe("Rating: 1=Again, 2=Hard, 3=Good, 4=Easy"),
      },
      async (input) => {
        try {
          const result = await caller.question.review(input);
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
              },
            ],
          };
        }
      }
    );

    server.tool(
      "question_getDue",
      "Get questions that are due for review",
      {
        contextId: z.number().optional().describe("Optional context ID to filter questions"),
        limit: z.number().optional().describe("Maximum number of questions to return (default: 20, max: 100)"),
      },
      async (input) => {
        try {
          const result = await caller.question.getDue(input);
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
              },
            ],
          };
        }
      }
    );

    server.tool(
      "question_delete",
      "Delete a question by ID",
      {
        id: z.number().describe("ID of the question to delete"),
      },
      async (input) => {
        try {
          const result = await caller.question.delete(input);
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
              },
            ],
          };
        }
      }
    );
  },
  {
    // Server configuration - no name/version here
  },
  {
    // Handler configuration
    basePath: "/api/mcp",
    // No Redis - using HTTP-only mode
    verboseLogs: process.env.NODE_ENV === "development",
  }
);

// Export for both GET (SSE) and POST (HTTP) methods
export { handler as GET, handler as POST };