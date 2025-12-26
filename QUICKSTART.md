# Quick Start Guide

This guide will help you get claude-byom up and running quickly.

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

## Configuration

### Option 1: Using OpenAI

1. Get your OpenAI API key from https://platform.openai.com/api-keys

2. Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "claude-byom": {
      "command": "node",
      "args": ["/absolute/path/to/claude-byom/build/index.js"],
      "env": {
        "OPENAI_API_KEY": "sk-your-api-key-here",
        "OPENAI_MODEL": "gpt-4"
      }
    }
  }
}
```

### Option 2: Using Ollama (Free, Local)

1. Install Ollama from https://ollama.ai

2. Pull a model: `ollama pull llama2`

3. Start Ollama: `ollama serve`

4. Add to Claude Desktop config:

```json
{
  "mcpServers": {
    "claude-byom": {
      "command": "node",
      "args": ["/absolute/path/to/claude-byom/build/index.js"],
      "env": {
        "OPENAI_API_KEY": "ollama",
        "OPENAI_BASE_URL": "http://localhost:11434/v1",
        "OPENAI_MODEL": "llama2"
      }
    }
  }
}
```

### Option 3: Using Together AI

1. Get your API key from https://api.together.xyz

2. Add to Claude Desktop config:

```json
{
  "mcpServers": {
    "claude-byom": {
      "command": "node",
      "args": ["/absolute/path/to/claude-byom/build/index.js"],
      "env": {
        "OPENAI_API_KEY": "your-together-api-key",
        "OPENAI_BASE_URL": "https://api.together.xyz/v1",
        "OPENAI_MODEL": "mistralai/Mixtral-8x7B-Instruct-v0.1"
      }
    }
  }
}
```

## Usage

1. Restart Claude Desktop after updating the config

2. The `chat` tool will now be available in Claude Code

3. You can now use the configured LLM through Claude Code's interface

## Troubleshooting

### "OPENAI_API_KEY is required" error
Make sure you've set the `OPENAI_API_KEY` in your config file.

### Connection refused (Ollama)
Ensure Ollama is running: `ollama serve`

### Model not found
Check that the model name matches exactly what your provider expects.

### Server not appearing in Claude
- Verify the path to `build/index.js` is absolute and correct
- Check the Claude Desktop logs for error messages
- Restart Claude Desktop

## Next Steps

- See [README.md](README.md) for detailed documentation
- Check [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines
- Report issues at https://github.com/liyishuai/claude-byom/issues
