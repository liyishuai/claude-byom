#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import OpenAI from "openai";

// Configuration from environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4";

if (!OPENAI_API_KEY) {
  console.error("Error: OPENAI_API_KEY environment variable is required");
  process.exit(1);
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  baseURL: OPENAI_BASE_URL,
});

// Define the tool for calling the LLM
const CHAT_TOOL: Tool = {
  name: "chat",
  description: "Send a message to the OpenAI-compatible LLM and receive a response. This wraps an OpenAI-compatible API as an Anthropic-compatible interface.",
  inputSchema: {
    type: "object",
    properties: {
      messages: {
        type: "array",
        description: "Array of messages in Anthropic format",
        items: {
          type: "object",
          properties: {
            role: {
              type: "string",
              enum: ["user", "assistant"],
              description: "The role of the message sender"
            },
            content: {
              type: "string",
              description: "The content of the message"
            }
          },
          required: ["role", "content"]
        }
      },
      system: {
        type: "string",
        description: "Optional system prompt"
      },
      max_tokens: {
        type: "number",
        description: "Maximum number of tokens to generate",
        default: 4096
      },
      temperature: {
        type: "number",
        description: "Temperature for sampling (0-2)",
        default: 1.0
      }
    },
    required: ["messages"]
  }
};

// Convert Anthropic-style messages to OpenAI format
function convertMessages(
  messages: Array<{ role: string; content: string }>,
  system?: string
): OpenAI.Chat.ChatCompletionMessageParam[] {
  const openaiMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [];
  
  // Add system message if provided
  if (system) {
    openaiMessages.push({
      role: "system",
      content: system
    });
  }
  
  // Convert user/assistant messages
  for (const msg of messages) {
    if (msg.role === "user" || msg.role === "assistant") {
      openaiMessages.push({
        role: msg.role,
        content: msg.content
      });
    }
  }
  
  return openaiMessages;
}

// Create MCP server instance
const server = new Server(
  {
    name: "claude-byom",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Handle list tools request
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [CHAT_TOOL],
  };
});

// Handle tool call request
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "chat") {
    const args = request.params.arguments as {
      messages: Array<{ role: string; content: string }>;
      system?: string;
      max_tokens?: number;
      temperature?: number;
    };

    try {
      const openaiMessages = convertMessages(args.messages, args.system);
      
      const completion = await openai.chat.completions.create({
        model: OPENAI_MODEL,
        messages: openaiMessages,
        max_tokens: args.max_tokens || 4096,
        temperature: args.temperature || 1.0,
      });

      const response = completion.choices[0]?.message?.content || "";

      return {
        content: [
          {
            type: "text",
            text: response,
          },
        ],
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: "text",
            text: `Error calling OpenAI API: ${errorMessage}`,
          },
        ],
        isError: true,
      };
    }
  }

  throw new Error(`Unknown tool: ${request.params.name}`);
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error("Claude BYOM MCP Server running");
  console.error(`OpenAI Base URL: ${OPENAI_BASE_URL}`);
  console.error(`Model: ${OPENAI_MODEL}`);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
