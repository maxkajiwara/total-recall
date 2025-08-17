# MCP Server Setup for Total Recall

This project exposes tRPC APIs as an MCP (Model Context Protocol) server, allowing AI assistants like Claude Desktop to interact with your Context database.

## Available Tools

The MCP server exposes the following tools:

- **context_create** - Create a new context with either URL or text content
- **context_update** - Update an existing context
- **context_get** - Get a context by ID
- **context_list** - List all contexts
- **context_delete** - Delete a context by ID

## Running the MCP Server

### Development Mode
```bash
npm run mcp:dev
```

### Production Mode
```bash
npm run mcp:build
npm run mcp:start
```

## Claude Desktop Configuration

To use this MCP server with Claude Desktop:

1. Open Claude Desktop settings
2. Navigate to Developer > Edit Config
3. Add the following configuration to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "total-recall": {
      "command": "npm",
      "args": ["run", "mcp:dev"],
      "cwd": "/absolute/path/to/total-recall-hack",
      "env": {
        "DATABASE_URL": "postgresql://your_username:your_password@localhost:5432/total_recall_hack"
      }
    }
  }
}
```

4. Replace `/absolute/path/to/total-recall-hack` with your actual project path
5. Ensure the DATABASE_URL matches your PostgreSQL configuration
6. Restart Claude Desktop

## Features

- **XOR Validation**: Contexts can have either a URL or text, but not both
- **Automatic Content Extraction**: When a URL is provided, the EXA API automatically extracts and stores the webpage content
- **Type Safety**: All operations maintain full type safety through tRPC
- **Error Handling**: Proper error messages for validation failures and not-found scenarios

## Testing the MCP Server

You can test the MCP server is running correctly:

```bash
npm run mcp:dev
```

You should see:
```
Starting Total Recall MCP Server...
MCP Server is running and ready for connections
```

The server communicates via stdio, so it's designed to be used by MCP clients like Claude Desktop.