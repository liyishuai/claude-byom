# Quick Start Guide

This guide will help you get claude-byom proxy server up and running quickly so you can use any OpenAI-compatible LLM with Claude Desktop.

## What You'll Do

1. Start the proxy server (translates Anthropic API → OpenAI API)
2. Configure Claude Desktop to use the proxy
3. Use Claude Desktop with your own LLM!

## Installation

```bash
# Clone the repository
git clone https://github.com/liyishuai/claude-byom.git
cd claude-byom

# Install dependencies
npm install

# Build the project
npm run build
```

## Option 1: Using OpenAI (Recommended for Testing)

### Step 1: Start the Proxy

1. Get your OpenAI API key from https://platform.openai.com/api-keys

2. Start the proxy server:
```bash
export OPENAI_API_KEY="sk-your-api-key-here"
export OPENAI_MODEL="gpt-4"
npm start
```

You should see:
```
🚀 Claude BYOM Proxy Server running on http://127.0.0.1:3000
📡 OpenAI Base URL: https://api.openai.com/v1
🤖 Model: gpt-4

Configure Claude to use this proxy:
  ANTHROPIC_BASE_URL=http://127.0.0.1:3000
  ANTHROPIC_API_KEY=any-value
```

### Step 2: Configure Claude Desktop

**On macOS**: 
```bash
nano ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

**On Windows**:
```bash
notepad %APPDATA%\Claude\claude_desktop_config.json
```

Add or update the file with:
```json
{
  "environmentVariables": {
    "ANTHROPIC_BASE_URL": "http://127.0.0.1:3000",
    "ANTHROPIC_API_KEY": "any-value-works"
  }
}
```

### Step 3: Restart Claude Desktop

Completely quit and restart Claude Desktop. Now you're using GPT-4 through Claude's interface!

## Option 2: Using Ollama (Free, Local)

Perfect for privacy-conscious users or offline use!

### Step 1: Install and Setup Ollama

1. Install Ollama from https://ollama.ai

2. Pull a model:
```bash
ollama pull llama2
```

3. Ollama starts automatically, or run:
```bash
ollama serve
```

### Step 2: Start the Proxy

```bash
export OPENAI_API_KEY="ollama"
export OPENAI_BASE_URL="http://localhost:11434/v1"
export OPENAI_MODEL="llama2"
npm start
```

### Step 3: Configure Claude Desktop

Same as Option 1, edit the config file:
```json
{
  "environmentVariables": {
    "ANTHROPIC_BASE_URL": "http://127.0.0.1:3000",
    "ANTHROPIC_API_KEY": "any-value-works"
  }
}
```

### Step 4: Restart Claude Desktop

Now you're using Llama2 locally with Claude Desktop!

## Option 3: Using Together AI

### Step 1: Get API Key

Get your API key from https://api.together.xyz

### Step 2: Start the Proxy

```bash
export OPENAI_API_KEY="your-together-api-key"
export OPENAI_BASE_URL="https://api.together.xyz/v1"
export OPENAI_MODEL="mistralai/Mixtral-8x7B-Instruct-v0.1"
npm start
```

### Step 3: Configure Claude Desktop

Same config as before:
```json
{
  "environmentVariables": {
    "ANTHROPIC_BASE_URL": "http://127.0.0.1:3000",
    "ANTHROPIC_API_KEY": "any-value-works"
  }
}
```

### Step 4: Restart Claude Desktop

Now using Mixtral with Claude!

## Testing

To verify the proxy is working:

1. Check the health endpoint:
```bash
curl http://127.0.0.1:3000/health
```

Should return:
```json
{"status":"ok","model":"gpt-4","baseUrl":"https://api.openai.com/v1"}
```

2. Test a message (with the proxy running):
```bash
curl -X POST http://127.0.0.1:3000/v1/messages \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-3-5-sonnet-20241022",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

## Troubleshooting

### "OPENAI_API_KEY is required" error
Make sure you set the environment variable before running `npm start`.

### Claude Desktop not connecting
- Make sure the proxy server is still running
- Try using `http://localhost:3000` instead of `127.0.0.1`
- Completely quit and restart Claude Desktop (not just close the window)
- Check Claude Desktop logs for errors

### Connection refused (Ollama)
- Ensure Ollama is running: `ollama serve`
- Check if Ollama is on the right port: `ollama list`

### Model not found
- Check that the model name matches your provider
- For Ollama: `ollama list` to see available models
- For OpenAI: use `gpt-4`, `gpt-3.5-turbo`, etc.

### Port already in use
Use a different port:
```bash
export PORT=3001
npm start
```

Then update Claude config to use `http://127.0.0.1:3001`

## Using .env File (Easier!)

Instead of exporting variables each time, create a `.env` file:

```bash
# .env file
OPENAI_API_KEY=sk-your-key-here
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4
PORT=3000
HOST=127.0.0.1
```

Then just run:
```bash
npm start
```

## Next Steps

- See [README.md](README.md) for detailed documentation
- Try different models and providers
- Check [CONTRIBUTING.md](CONTRIBUTING.md) if you want to contribute
- Report issues at https://github.com/liyishuai/claude-byom/issues

## Popular Models to Try

### Ollama (Local)
- `llama2` - Good general purpose
- `codellama` - Best for coding
- `mistral` - Fast and capable
- `llama3` - Latest Llama model

### OpenAI
- `gpt-4` - Most capable
- `gpt-3.5-turbo` - Fast and cheap

### Together AI
- `mistralai/Mixtral-8x7B-Instruct-v0.1` - Excellent performance
- `meta-llama/Llama-2-70b-chat-hf` - Very capable

Enjoy using your own models with Claude Desktop! 🎉
