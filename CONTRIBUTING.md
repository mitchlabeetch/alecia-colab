# Contributing to Alecia Colab

Thank you for your interest in contributing to Alecia Colab! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git for version control
- Basic knowledge of React, Next.js, and TypeScript

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/alecia-colab.git
   cd alecia-colab
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**
   ```bash
   cd apps/web
   cp .env.example .env
   # Edit .env with your credentials
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## 📝 Development Guidelines

### Code Style
- Follow the existing code style and conventions
- Use TypeScript for type safety
- Use meaningful variable and function names
- Add comments for complex logic

### Code Quality Tools
- **Linting**: Run `npm run lint` before committing
- **Formatting**: Run `npm run format` to auto-format code
- **Type Checking**: Run `npm run typecheck` to check types

### Component Guidelines
- Create reusable components in `apps/web/components`
- Follow the existing component structure
- Use Tailwind CSS for styling
- Ensure components are accessible (ARIA labels, keyboard navigation)

### Commit Messages
Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
feat: add new feature
fix: fix a bug
docs: update documentation
style: code style changes
refactor: code refactoring
test: add or update tests
chore: maintenance tasks
```

Examples:
- `feat: add deal pipeline visualization`
- `fix: resolve save status not updating`
- `docs: update README installation steps`

## 🎯 Areas for Contribution

### High Priority
- [ ] Document versioning and history tracking
- [ ] Enhanced search and filtering
- [ ] Real-time collaboration features
- [ ] Mobile responsiveness improvements
- [ ] Performance optimizations

### M&A Features
- [ ] Advanced financial modeling templates
- [ ] Deal comparison tools
- [ ] Automated reporting
- [ ] Custom analytics dashboard
- [ ] Integration with external data sources

### General Improvements
- [ ] Unit and integration tests
- [ ] Accessibility enhancements
- [ ] Internationalization (i18n)
- [ ] Documentation improvements
- [ ] Bug fixes

## 🔄 Pull Request Process

1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Write clean, documented code
   - Test thoroughly
   - Follow code style guidelines

3. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add your feature"
   ```

4. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Open a Pull Request**
   - Provide a clear description of changes
   - Reference any related issues
   - Include screenshots for UI changes
   - Ensure all checks pass

6. **Code Review**
   - Address reviewer feedback
   - Make requested changes
   - Update your PR as needed

## 🐛 Bug Reports

When reporting bugs, include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details (OS, browser, Node version)

Use the [GitHub issue template](https://github.com/mitchlabeetch/alecia-colab/issues/new) when available.

## 💡 Feature Requests

For feature requests:
- Check if the feature already exists
- Provide use case and rationale
- Include mockups or examples if possible
- Be open to discussion and feedback

## 📚 Documentation

Help improve documentation:
- Fix typos and clarify instructions
- Add examples and tutorials
- Update outdated information
- Translate to other languages

## 🧪 Testing

- Write tests for new features
- Ensure existing tests pass
- Test across different browsers
- Verify mobile compatibility

## 🤝 Community Guidelines

- Be respectful and inclusive
- Help others learn and grow
- Provide constructive feedback
- Follow the [Code of Conduct](CODE_OF_CONDUCT.md)

## 📄 License

By contributing to Alecia Colab, you agree that your contributions will be licensed under the Apache-2.0 License.

## 🙏 Recognition

Contributors will be recognized in:
- GitHub contributors page
- Release notes for significant contributions
- Project documentation

Thank you for making Alecia Colab better! 🎉
