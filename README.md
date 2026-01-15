# Alecia Colab - M&A Knowledge Base & Collaboration Platform

<p align="center">
  <img src="https://img.shields.io/badge/Status-Active-success" alt="Status" />
  <img src="https://img.shields.io/badge/License-Apache--2.0-blue" alt="License" />
</p>

## Overview

**Alecia Colab** is a comprehensive M&A knowledge centralization and collaboration platform designed to streamline deal workflows, due diligence processes, and integration planning. Built on modern web technologies, it provides a powerful yet intuitive interface for managing the entire M&A lifecycle.

## Features

### 🎯 Core Capabilities
- **Rich Text Editor**: Advanced WYSIWYG editor with slash commands, bubble menus, and AI-powered suggestions
- **M&A Templates**: Pre-built templates for deal pipeline, due diligence, valuation models, and integration planning
- **Real-time Collaboration**: Secure authentication with Microsoft OAuth via Clerk
- **Document Management**: Organize and track M&A documents, checklists, and knowledge base articles
- **AI-Powered Assistance**: Intelligent content suggestions and autocompletion for faster documentation

### 📊 M&A-Specific Features
- **Deal Pipeline Tracking**: Monitor opportunities from sourcing to closing
- **Due Diligence Frameworks**: Comprehensive checklists and questionnaires
- **Financial Modeling**: Built-in support for LaTeX formulas and calculations
- **Integration Planning**: Post-merger integration templates and timelines
- **Knowledge Base**: Centralized repository for M&A best practices and learnings

### 🛠️ Technical Features
- Image uploads (drag & drop, copy & paste)
- Code syntax highlighting
- Mathematical expressions with LaTeX
- Task lists and checklists
- Auto-save functionality
- Dark mode support
- Responsive design

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Clerk account for authentication
- OpenAI API key (optional, for AI features)
- Vercel Blob storage (optional, for image uploads)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/mitchlabeetch/alecia-colab.git
cd alecia-colab
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the `apps/web` directory with the following:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret

# OpenAI (Optional)
OPENAI_API_KEY=your_openai_key

# Vercel Blob (Optional)
BLOB_READ_WRITE_TOKEN=your_blob_token
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Authentication Setup

This application uses Clerk for authentication with Microsoft OAuth support:

1. Create a Clerk account at [clerk.com](https://clerk.com)
2. Create a new application in the Clerk Dashboard
3. Enable Microsoft as an OAuth provider in "Social Connections"
4. Copy your API keys to the `.env` file
5. Configure Microsoft Azure OAuth credentials in Clerk Dashboard

See [Clerk documentation](https://clerk.com/docs/authentication/social-connections/microsoft) for detailed setup instructions.

## Usage

### Creating Documents
1. Click anywhere in the editor to start typing
2. Use `/` to open the command menu for templates and formatting
3. Type `++` to activate AI-powered suggestions
4. Your work is automatically saved to local storage

### M&A Templates
Access specialized templates via the slash command (`/`):
- Deal Pipeline Template
- Due Diligence Checklist
- Valuation Model
- Integration Planning
- Meeting Notes
- And more...

### Keyboard Shortcuts
- `/` - Open command menu
- `++` - Trigger AI suggestions
- `Cmd/Ctrl + B` - Bold text
- `Cmd/Ctrl + I` - Italic text
- `Cmd/Ctrl + K` - Add link

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **Editor**: [Tiptap](https://tiptap.dev/)
- **AI**: [OpenAI](https://openai.com/) + [Vercel AI SDK](https://sdk.vercel.ai/docs)
- **Authentication**: [Clerk](https://clerk.com/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **Storage**: [Vercel Blob](https://vercel.com/docs/storage/vercel-blob)
- **Rate Limiting**: [Upstash](https://upstash.com/)

## Development

### Project Structure
```
alecia-colab/
├── apps/
│   └── web/              # Next.js application
│       ├── app/          # App router pages
│       ├── components/   # React components
│       ├── lib/          # Utilities and content
│       └── styles/       # Global styles
├── packages/
│   └── headless/         # Editor core package
└── docs/                 # Documentation
```

### Available Scripts
```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run lint        # Run linter
npm run format      # Format code
npm run typecheck   # Type checking
```

### Code Quality
This project uses:
- [Biome](https://biomejs.dev/) for linting and formatting
- [Husky](https://typicode.github.io/husky/) for git hooks
- [Commitlint](https://commitlint.js.org/) for commit message conventions

## Contributing

We welcome contributions! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Security

For security concerns, please refer to [SECURITY.md](SECURITY.md) or contact the maintainers directly.

## License

Licensed under the [Apache-2.0 license](LICENSE).

## Acknowledgments

Built with ❤️ for the M&A community. This project utilizes various open-source technologies and frameworks - see package.json for a complete list of dependencies.

---

For more information, visit our [documentation](https://github.com/mitchlabeetch/alecia-colab/wiki) or open an issue.
