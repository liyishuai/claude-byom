# claude-byom

**Bring Your Own Model** - An MCP server that wraps OpenAI-compatible LLM providers into an Anthropic-compatible interface for use with Claude Code and other MCP clients.

## 🚀 Quick Start

New to claude-byom? Check out the [Quick Start Guide](QUICKSTART.md) for step-by-step setup instructions.

## Overview

This Model Context Protocol (MCP) server allows you to use any OpenAI-compatible LLM provider (like OpenAI, Azure OpenAI, Together AI, Ollama, LM Studio, etc.) with Claude Code by wrapping the OpenAI API into an Anthropic-compatible interface.

## Features

- ✅ Compatible with any OpenAI-compatible API endpoint
- ✅ Works with Claude Code and other MCP clients
- ✅ Supports custom base URLs for alternative providers
- ✅ Configurable model selection
- ✅ Temperature and max_tokens control
- ✅ System prompts support

## Installation

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone https://github.com/liyishuai/claude-byom.git
cd claude-byom
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

## Configuration

The server is configured through environment variables:

- `OPENAI_API_KEY` (required): Your API key for the OpenAI-compatible service
- `OPENAI_BASE_URL` (optional): Base URL for the API (default: `https://api.openai.com/v1`)
- `OPENAI_MODEL` (optional): Model to use (default: `gpt-4`)

### Example Configurations

#### Using with OpenAI
```json
{
  "mcpServers": {
    "claude-byom": {
      "command": "node",
      "args": ["/path/to/claude-byom/build/index.js"],
      "env": {
        "OPENAI_API_KEY": "sk-your-openai-api-key",
        "OPENAI_MODEL": "gpt-4"
      }
    }
  }
}
```

#### Using with Ollama (local)
```json
{
  "mcpServers": {
    "claude-byom": {
      "command": "node",
      "args": ["/path/to/claude-byom/build/index.js"],
      "env": {
        "OPENAI_API_KEY": "ollama",
        "OPENAI_BASE_URL": "http://localhost:11434/v1",
        "OPENAI_MODEL": "llama2"
      }
    }
  }
}
```

#### Using with Together AI
```json
{
  "mcpServers": {
    "claude-byom": {
      "command": "node",
      "args": ["/path/to/claude-byom/build/index.js"],
      "env": {
        "OPENAI_API_KEY": "your-together-api-key",
        "OPENAI_BASE_URL": "https://api.together.xyz/v1",
        "OPENAI_MODEL": "mistralai/Mixtral-8x7B-Instruct-v0.1"
      }
    }
  }
}
```

#### Using with Azure OpenAI
```json
{
  "mcpServers": {
    "claude-byom": {
      "command": "node",
      "args": ["/path/to/claude-byom/build/index.js"],
      "env": {
        "OPENAI_API_KEY": "your-azure-api-key",
        "OPENAI_BASE_URL": "https://your-resource.openai.azure.com/openai/deployments/your-deployment",
        "OPENAI_MODEL": "gpt-4"
      }
    }
  }
}
```

## Usage with Claude Code

1. Add the server configuration to your MCP settings file (typically `~/Library/Application Support/Claude/claude_desktop_config.json` on macOS or `%APPDATA%/Claude/claude_desktop_config.json` on Windows)

2. Restart Claude Code

3. The `chat` tool will be available for use with your configured OpenAI-compatible LLM

## Available Tools

### `chat`

Send messages to the OpenAI-compatible LLM and receive responses.

**Parameters:**
- `messages` (required): Array of message objects with `role` ("user" or "assistant") and `content`
- `system` (optional): System prompt to guide the model's behavior
- `max_tokens` (optional): Maximum number of tokens to generate (default: 4096)
- `temperature` (optional): Sampling temperature 0-2 (default: 1.0)

**Example:**
```json
{
  "messages": [
    {"role": "user", "content": "Hello, how are you?"}
  ],
  "system": "You are a helpful assistant.",
  "max_tokens": 2048,
  "temperature": 0.7
}
```

## Development

### Running in development mode
```bash
npm run dev
```

### Building
```bash
npm run build
```

### Running the built version
```bash
npm start
```

## Supported Providers

This server works with any OpenAI-compatible API, including:

- OpenAI (ChatGPT)
- Azure OpenAI
- Together AI
- Ollama (local)
- LM Studio (local)
- LocalAI
- vLLM
- Text Generation WebUI (oobabooga)
- And many more...

## Troubleshooting

### Server not starting
- Ensure `OPENAI_API_KEY` is set
- Check that the build directory exists (`npm run build`)
- Verify Node.js version is 18 or higher

### API errors
- Verify your API key is correct
- Check that the `OPENAI_BASE_URL` is correct for your provider
- Ensure the model name is valid for your provider

### Connection issues
- For local providers (Ollama, LM Studio), ensure they are running
- Check firewall settings for local providers

## License

See [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
