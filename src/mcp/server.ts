#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { createCaller } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

// Tool schemas matching our tRPC input schemas
const createContextSchema = z.object({
  name: z.string().describe("Name of the context"),
  url: z.string().optional().describe("URL to extract content from"),
  text: z.string().optional().describe("Text content (cannot be used with URL)"),
});

const updateContextSchema = z.object({
  id: z.number().describe("ID of the context to update"),
  name: z.string().describe("New name for the context"),
  url: z.string().optional().describe("New URL to extract content from"),
  text: z.string().optional().describe("New text content (cannot be used with URL)"),
});

const getContextSchema = z.object({
  id: z.number().describe("ID of the context to retrieve"),
});

const deleteContextSchema = z.object({
  id: z.number().describe("ID of the context to delete"),
});

async function main() {
  console.error("Starting Total Recall MCP Server...");

  // Create tRPC context and caller
  const context = await createTRPCContext({ headers: new Headers() });
  const caller = createCaller(context);

  // Create MCP server
  const server = new Server(
    {
      name: "total-recall-mcp",
      version: "0.1.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Register tool list handler
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: "context_create",
          description: "Create a new context with either URL or text content",
          inputSchema: {
            type: "object",
            properties: {
              name: { type: "string", description: "Name of the context" },
              url: { type: "string", description: "URL to extract content from (optional)" },
              text: { type: "string", description: "Text content (optional, cannot be used with URL)" },
            },
            required: ["name"],
          },
        },
        {
          name: "context_update",
          description: "Update an existing context",
          inputSchema: {
            type: "object",
            properties: {
              id: { type: "number", description: "ID of the context to update" },
              name: { type: "string", description: "New name for the context" },
              url: { type: "string", description: "New URL to extract content from (optional)" },
              text: { type: "string", description: "New text content (optional, cannot be used with URL)" },
            },
            required: ["id", "name"],
          },
        },
        {
          name: "context_get",
          description: "Get a context by ID",
          inputSchema: {
            type: "object",
            properties: {
              id: { type: "number", description: "ID of the context to retrieve" },
            },
            required: ["id"],
          },
        },
        {
          name: "context_list",
          description: "List all contexts",
          inputSchema: {
            type: "object",
            properties: {},
            required: [],
          },
        },
        {
          name: "context_delete",
          description: "Delete a context by ID",
          inputSchema: {
            type: "object",
            properties: {
              id: { type: "number", description: "ID of the context to delete" },
            },
            required: ["id"],
          },
        },
      ],
    };
  });

  // Register tool call handler
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      switch (name) {
        case "context_create": {
          const input = createContextSchema.parse(args);
          const result = await caller.context.create(input);
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }

        case "context_update": {
          const input = updateContextSchema.parse(args);
          const result = await caller.context.update(input);
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }

        case "context_get": {
          const input = getContextSchema.parse(args);
          const result = await caller.context.get(input);
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }

        case "context_list": {
          const result = await caller.context.list();
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }

        case "context_delete": {
          const input = deleteContextSchema.parse(args);
          const result = await caller.context.delete(input);
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }

        default:
          throw new McpError(ErrorCode.MethodNotFound, `Tool ${name} not found`);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new McpError(
          ErrorCode.InvalidParams,
          `Invalid parameters: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`
        );
      }
      
      if (error instanceof Error) {
        throw new McpError(
          ErrorCode.InternalError,
          error.message
        );
      }
      
      throw error;
    }
  });

  // Set up stdio transport
  const transport = new StdioServerTransport();
  
  // Connect server to transport
  await server.connect(transport);
  
  console.error("MCP Server is running and ready for connections");

  // Handle graceful shutdown
  process.on("SIGINT", async () => {
    console.error("Shutting down MCP server...");
    await server.close();
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    console.error("Shutting down MCP server...");
    await server.close();
    process.exit(0);
  });
}

// Run the server
main().catch((error) => {
  console.error("Failed to start MCP server:", error);
  process.exit(1);
});