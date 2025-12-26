# Security Policy

## Supported Versions

We release patches for security vulnerabilities for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security vulnerability, please follow these steps:

1. **Do Not** open a public issue
2. Email the maintainers directly at the email addresses listed in the repository
3. Include the following information:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We will acknowledge receipt of your vulnerability report within 48 hours and will send a more detailed response within 7 days indicating the next steps.

## Security Best Practices

When using claude-byom:

### API Keys
- **Never** commit API keys to source control
- Store API keys in environment variables or secure configuration files
- Use different API keys for development and production
- Rotate API keys regularly

### Configuration
- Validate the `OPENAI_BASE_URL` before use
- Only use trusted OpenAI-compatible providers
- For local providers (Ollama, LM Studio), ensure they're only accessible from localhost

### Network Security
- When using local providers, ensure they're not exposed to the internet
- Use HTTPS for all remote API endpoints
- Verify SSL certificates for remote connections

### Data Privacy
- Be aware that messages are sent to the configured LLM provider
- Don't send sensitive or confidential information unless you trust the provider
- Review your provider's data retention and privacy policies

## Known Security Considerations

1. **API Key Exposure**: Ensure your MCP server configuration is stored securely with appropriate file permissions
2. **Local Providers**: When using local providers like Ollama, ensure they're properly configured and not exposed to untrusted networks
3. **Third-Party APIs**: This server sends data to third-party APIs. Ensure you trust the configured provider.

## Updates

Security updates will be released as patch versions. We recommend:
- Always using the latest version
- Subscribing to release notifications
- Reviewing the CHANGELOG.md for security-related updates

## Disclosure Policy

When we receive a security bug report, we will:

1. Confirm the problem and determine affected versions
2. Audit code to find similar problems
3. Prepare fixes for all supported versions
4. Release new versions as soon as possible

## Contact

For security concerns, please contact the project maintainers through GitHub.
