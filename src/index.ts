#!/usr/bin/env node

import express, { Request, Response } from 'express';
import OpenAI from 'openai';

// Configuration from environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4";
const PORT = parseInt(process.env.PORT || "3000", 10);
const HOST = process.env.HOST || "127.0.0.1";

if (!OPENAI_API_KEY) {
  console.error("Error: OPENAI_API_KEY environment variable is required");
  process.exit(1);
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  baseURL: OPENAI_BASE_URL,
});

const app = express();
app.use(express.json());

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', model: OPENAI_MODEL, baseUrl: OPENAI_BASE_URL });
});

// Anthropic message format
interface AnthropicMessage {
  role: 'user' | 'assistant';
  content: string | Array<{ type: string; text?: string; source?: any }>;
}

interface AnthropicRequest {
  model: string;
  messages: AnthropicMessage[];
  max_tokens: number;
  system?: string;
  temperature?: number;
  top_p?: number;
  stream?: boolean;
}

// Convert Anthropic content to string
function extractTextContent(content: string | Array<{ type: string; text?: string }>): string {
  if (typeof content === 'string') {
    return content;
  }
  
  // Handle array of content blocks
  return content
    .filter(block => block.type === 'text' && block.text)
    .map(block => block.text)
    .join('\n');
}

// Convert Anthropic messages to OpenAI format
function convertToOpenAI(anthropicRequest: AnthropicRequest): OpenAI.Chat.ChatCompletionCreateParams {
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];
  
  // Add system message if provided
  if (anthropicRequest.system) {
    messages.push({
      role: 'system',
      content: anthropicRequest.system
    });
  }
  
  // Convert messages
  for (const msg of anthropicRequest.messages) {
    const content = extractTextContent(msg.content);
    messages.push({
      role: msg.role,
      content: content
    });
  }
  
  return {
    model: OPENAI_MODEL,
    messages: messages,
    max_tokens: anthropicRequest.max_tokens,
    temperature: anthropicRequest.temperature,
    top_p: anthropicRequest.top_p,
    stream: anthropicRequest.stream || false,
  };
}

// Convert OpenAI response to Anthropic format
function convertToAnthropic(openaiResponse: OpenAI.Chat.ChatCompletion) {
  const choice = openaiResponse.choices[0];
  if (!choice) {
    throw new Error("No response from OpenAI");
  }
  
  return {
    id: `msg_${openaiResponse.id}`,
    type: 'message',
    role: 'assistant',
    content: [
      {
        type: 'text',
        text: choice.message.content || ''
      }
    ],
    model: openaiResponse.model,
    stop_reason: choice.finish_reason === 'stop' ? 'end_turn' : choice.finish_reason,
    stop_sequence: null,
    usage: {
      input_tokens: openaiResponse.usage?.prompt_tokens || 0,
      output_tokens: openaiResponse.usage?.completion_tokens || 0
    }
  };
}

// Main endpoint: POST /v1/messages (Anthropic format)
app.post('/v1/messages', async (req: Request, res: Response) => {
  try {
    const anthropicRequest: AnthropicRequest = req.body;
    
    // Validate request
    if (!anthropicRequest.messages || !Array.isArray(anthropicRequest.messages)) {
      return res.status(400).json({
        type: 'error',
        error: {
          type: 'invalid_request_error',
          message: 'messages is required and must be an array'
        }
      });
    }
    
    // Check for streaming
    if (anthropicRequest.stream) {
      // Handle streaming response
      const openaiParams = convertToOpenAI(anthropicRequest);
      const stream = await openai.chat.completions.create({
        ...openaiParams,
        stream: true,
      });
      
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      
      // Send initial message_start event
      res.write(`event: message_start\ndata: ${JSON.stringify({
        type: 'message_start',
        message: {
          id: 'msg_' + Date.now(),
          type: 'message',
          role: 'assistant',
          content: [],
          model: OPENAI_MODEL,
          usage: { input_tokens: 0, output_tokens: 0 }
        }
      })}\n\n`);
      
      // Send content_block_start
      res.write(`event: content_block_start\ndata: ${JSON.stringify({
        type: 'content_block_start',
        index: 0,
        content_block: { type: 'text', text: '' }
      })}\n\n`);
      
      let fullText = '';
      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content || '';
        if (delta) {
          fullText += delta;
          res.write(`event: content_block_delta\ndata: ${JSON.stringify({
            type: 'content_block_delta',
            index: 0,
            delta: { type: 'text_delta', text: delta }
          })}\n\n`);
        }
      }
      
      // Send content_block_stop
      res.write(`event: content_block_stop\ndata: ${JSON.stringify({
        type: 'content_block_stop',
        index: 0
      })}\n\n`);
      
      // Send message_delta with usage
      res.write(`event: message_delta\ndata: ${JSON.stringify({
        type: 'message_delta',
        delta: { stop_reason: 'end_turn', stop_sequence: null },
        usage: { output_tokens: fullText.split(' ').length }
      })}\n\n`);
      
      // Send message_stop
      res.write(`event: message_stop\ndata: ${JSON.stringify({
        type: 'message_stop'
      })}\n\n`);
      
      res.end();
    } else {
      // Handle non-streaming response
      const openaiParams = convertToOpenAI(anthropicRequest);
      const completion = await openai.chat.completions.create({
        ...openaiParams,
        stream: false,
      }) as OpenAI.Chat.ChatCompletion;
      
      const anthropicResponse = convertToAnthropic(completion);
      res.json(anthropicResponse);
    }
    
  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({
      type: 'error',
      error: {
        type: 'api_error',
        message: errorMessage
      }
    });
  }
});

// Start server
app.listen(PORT, HOST, () => {
  console.log(`\n🚀 Claude BYOM Proxy Server running on http://${HOST}:${PORT}`);
  console.log(`📡 OpenAI Base URL: ${OPENAI_BASE_URL}`);
  console.log(`🤖 Model: ${OPENAI_MODEL}`);
  console.log(`\nConfigure Claude to use this proxy:`);
  console.log(`  ANTHROPIC_BASE_URL=http://${HOST}:${PORT}`);
  console.log(`  ANTHROPIC_API_KEY=any-value\n`);
});
