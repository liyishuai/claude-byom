# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-12-26

### Added
- Initial release of claude-byom MCP server
- MCP server implementation wrapping OpenAI-compatible APIs
- Support for any OpenAI-compatible LLM provider (OpenAI, Ollama, Together AI, Azure, etc.)
- Message format conversion from Anthropic to OpenAI format
- `chat` tool for sending messages and receiving responses
- Configuration via environment variables:
  - `OPENAI_API_KEY` - API key for OpenAI-compatible service
  - `OPENAI_BASE_URL` - Custom base URL for alternative providers
  - `OPENAI_MODEL` - Model selection
- Support for optional parameters:
  - System prompts
  - Temperature control
  - Max tokens configuration
- Comprehensive documentation:
  - README with detailed setup instructions
  - Quick Start Guide for fast onboarding
  - Contributing guidelines
  - Example configurations for multiple providers
- Automated testing suite
- Error handling and validation
- TypeScript support with strict mode
- Build system with npm scripts

### Security
- No known vulnerabilities (validated with CodeQL)
- Proper error handling for API failures
- Input validation for message roles and API responses

[1.0.0]: https://github.com/liyishuai/claude-byom/releases/tag/v1.0.0
