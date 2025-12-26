# claude-byom

**Bring Your Own Model** - An HTTP proxy server that translates Anthropic API calls to OpenAI-compatible LLM providers, allowing you to use any OpenAI-compatible LLM with Claude Desktop or other Anthropic API clients.

## 🚀 Quick Start

See the [Quick Start Guide](QUICKSTART.md) for step-by-step setup instructions.

## Overview

This proxy server sits between Claude (or any Anthropic API client) and your OpenAI-compatible LLM provider. It translates Anthropic's API format to OpenAI's format in real-time, allowing you to:

- Use Claude Desktop with any OpenAI-compatible LLM (OpenAI, Ollama, Together AI, etc.)
- Point `ANTHROPIC_BASE_URL` to this proxy
- Keep using the familiar Claude interface with your own models

## How It Works

```
Claude Desktop → [ANTHROPIC_BASE_URL] → claude-byom proxy → [translates] → OpenAI API
     ↓                                                                           ↓
  Anthropic                                                              OpenAI-compatible
  API format                                                             LLM provider
```

## Features

- ✅ Full Anthropic API compatibility
- ✅ Streaming and non-streaming responses
- ✅ Works with any OpenAI-compatible API endpoint
- ✅ Supports system prompts, temperature, and token limits
- ✅ Compatible with Claude Desktop and other Anthropic clients
- ✅ Real-time message format translation

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

The proxy server is configured through environment variables:

- `OPENAI_API_KEY` (required): Your API key for the OpenAI-compatible service
- `OPENAI_BASE_URL` (optional): Base URL for the API (default: `https://api.openai.com/v1`)
- `OPENAI_MODEL` (optional): Model to use (default: `gpt-4`)
- `PORT` (optional): Port for the proxy server (default: `3000`)
- `HOST` (optional): Host to bind to (default: `127.0.0.1`)

## Usage

### Starting the Proxy Server

#### Using OpenAI
```bash
export OPENAI_API_KEY="sk-your-openai-api-key"
export OPENAI_MODEL="gpt-4"
npm start
```

#### Using Ollama (local)
```bash
export OPENAI_API_KEY="ollama"
export OPENAI_BASE_URL="http://localhost:11434/v1"
export OPENAI_MODEL="llama2"
npm start
```

#### Using Together AI
```bash
export OPENAI_API_KEY="your-together-api-key"
export OPENAI_BASE_URL="https://api.together.xyz/v1"
export OPENAI_MODEL="mistralai/Mixtral-8x7B-Instruct-v0.1"
npm start
```

The server will start on `http://127.0.0.1:3000` by default.

### Configuring Claude Desktop

Once the proxy is running, configure Claude Desktop to use it:

**On macOS**: Edit `~/Library/Application Support/Claude/claude_desktop_config.json`

**On Windows**: Edit `%APPDATA%\Claude\claude_desktop_config.json`

Add these environment variables:

```json
{
  "environmentVariables": {
    "ANTHROPIC_BASE_URL": "http://127.0.0.1:3000",
    "ANTHROPIC_API_KEY": "any-value-works"
  }
}
```

**Important**: Restart Claude Desktop after making changes.

### Alternative: Using .env file

Create a `.env` file in the project root:

```bash
OPENAI_API_KEY=sk-your-api-key-here
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4
PORT=3000
HOST=127.0.0.1
```

Then run:
```bash
npm start
```

## Supported Providers

This proxy works with any OpenAI-compatible API, including:

- **OpenAI** (ChatGPT) - https://api.openai.com/v1
- **Azure OpenAI** - Custom endpoint
- **Together AI** - https://api.together.xyz/v1
- **Ollama** (local) - http://localhost:11434/v1
- **LM Studio** (local) - http://localhost:1234/v1
- **LocalAI** - Custom endpoint
- **vLLM** - Custom endpoint
- **Text Generation WebUI** - Custom endpoint
- And many more...

## API Endpoints

### POST /v1/messages

Main endpoint that accepts Anthropic-formatted messages and returns Anthropic-formatted responses.

**Request Format** (Anthropic):
```json
{
  "model": "claude-3-5-sonnet-20241022",
  "max_tokens": 1024,
  "messages": [
    {"role": "user", "content": "Hello, world"}
  ]
}
```

**Response Format** (Anthropic):
```json
{
  "id": "msg_123",
  "type": "message",
  "role": "assistant",
  "content": [{"type": "text", "text": "Hello! How can I help you?"}],
  "model": "gpt-4",
  "stop_reason": "end_turn",
  "usage": {
    "input_tokens": 10,
    "output_tokens": 15
  }
}
```

### GET /health

Health check endpoint to verify the proxy is running.

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

## Examples

### Example 1: Using with Ollama

1. Install Ollama: https://ollama.ai
2. Pull a model: `ollama pull llama2`
3. Start the proxy:
```bash
export OPENAI_API_KEY="ollama"
export OPENAI_BASE_URL="http://localhost:11434/v1"
export OPENAI_MODEL="llama2"
npm start
```
4. Configure Claude Desktop to use `http://127.0.0.1:3000`
5. Start chatting in Claude Desktop with Llama2!

### Example 2: Using with OpenAI

1. Get your API key from https://platform.openai.com/api-keys
2. Start the proxy:
```bash
export OPENAI_API_KEY="sk-your-key-here"
export OPENAI_MODEL="gpt-4"
npm start
```
3. Configure Claude Desktop to use `http://127.0.0.1:3000`
4. Use GPT-4 through Claude's interface!

## Troubleshooting

### Server won't start
- Ensure `OPENAI_API_KEY` is set
- Check that port 3000 is not already in use
- Verify Node.js version is 18 or higher

### Claude Desktop not connecting
- Ensure the proxy server is running
- Verify `ANTHROPIC_BASE_URL` points to the correct host and port
- Try `http://localhost:3000` instead of `127.0.0.1`
- Check firewall settings
- Restart Claude Desktop after config changes

### API errors
- Verify your API key is correct
- Check that `OPENAI_BASE_URL` is correct for your provider
- Ensure the model name is valid for your provider
- Check the proxy server logs for detailed error messages

### Ollama connection issues
- Ensure Ollama is running: `ollama serve`
- Verify the model is pulled: `ollama list`
- Check Ollama is listening on the correct port

## Security Considerations

- The proxy runs on localhost (127.0.0.1) by default for security
- Never expose this proxy to the public internet
- Keep your API keys secure
- Review the [SECURITY.md](SECURITY.md) file for more details

## License

See [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.
