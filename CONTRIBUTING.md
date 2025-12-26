# Contributing to claude-byom

Thank you for your interest in contributing to claude-byom! This document provides guidelines for contributing to the project.

## Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR-USERNAME/claude-byom.git`
3. Install dependencies: `npm install`
4. Build the project: `npm run build`
5. Run tests: `npm test`

## Development Workflow

1. Create a new branch for your feature: `git checkout -b feature/your-feature-name`
2. Make your changes in the `src/` directory
3. Build and test your changes: `npm test`
4. Commit your changes with a descriptive message
5. Push to your fork and create a pull request

## Code Style

- Use TypeScript strict mode
- Follow existing code formatting
- Add comments for complex logic
- Keep functions focused and single-purpose

## Testing

- All changes should include appropriate tests
- Run `npm test` before submitting a pull request
- Ensure all existing tests still pass

## Submitting Pull Requests

1. Ensure your code builds without errors: `npm run build`
2. Ensure all tests pass: `npm test`
3. Update documentation if you're changing functionality
4. Write a clear description of your changes in the PR

## Reporting Issues

When reporting issues, please include:

- Your operating system and Node.js version
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Any error messages or logs

## Feature Requests

We welcome feature requests! Please open an issue describing:

- The problem you're trying to solve
- Your proposed solution
- Any alternative solutions you've considered

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.
