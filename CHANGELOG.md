# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-12-26

### Added
- Initial release of claude-byom HTTP proxy server
- HTTP proxy that translates Anthropic API calls to OpenAI-compatible format
- Support for any OpenAI-compatible LLM provider (OpenAI, Ollama, Together AI, Azure, etc.)
- Full Anthropic API v1/messages endpoint compatibility
- Streaming response support with Server-Sent Events (SSE)
- Non-streaming response support
- Message format conversion:
  - Anthropic messages → OpenAI chat completions
  - OpenAI responses → Anthropic message format
- Configuration via environment variables:
  - `OPENAI_API_KEY` - API key for OpenAI-compatible service
  - `OPENAI_BASE_URL` - Custom base URL for alternative providers
  - `OPENAI_MODEL` - Model selection
  - `PORT` - Proxy server port (default: 3000)
  - `HOST` - Bind host (default: 127.0.0.1)
- Support for Anthropic API parameters:
  - System prompts
  - Temperature control
  - Max tokens configuration
  - Top-p sampling
  - Streaming toggle
- Health check endpoint at `/health`
- Comprehensive documentation:
  - README with detailed setup instructions
  - Quick Start Guide with step-by-step examples
  - Contributing guidelines
  - Security policy
  - Example Claude Desktop configurations for multiple providers
- TypeScript support with strict mode
- Express-based HTTP server
- Real-time API format translation
- Usage statistics in responses
- Error handling with Anthropic-compatible error format

### Security
- Server binds to localhost (127.0.0.1) by default
- No vulnerabilities detected (CodeQL validated)
- Proper error handling for API failures
- Input validation for requests
- Secure API key handling

[1.0.0]: https://github.com/liyishuai/claude-byom/releases/tag/v1.0.0
