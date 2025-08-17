# Total Recall - AI-Powered Spaced Repetition Learning System

A mobile-first flashcard application with a beautiful swipe-based interface that uses AI to automatically generate questions from content and implements the FSRS (Free Spaced Repetition Scheduler) algorithm for optimized learning.

## Features

### Core Learning Features
- **AI-Powered Question Generation**: Automatically generates flashcards from URLs or text using Google Gemini
- **FSRS Algorithm**: Scientifically-proven spaced repetition scheduling (20-30% fewer reviews than traditional algorithms)
- **Context Management**: Store learning materials as contexts with URL extraction via EXA API
- **Smart Answer Evaluation**: AI evaluates text answers with encouraging feedback and adaptive scoring
- **MCP Server Integration**: Expose APIs via Model Context Protocol for AI assistant integration

### Mobile-First UI/UX
- **Swipe Navigation**: Intuitive 3-screen swipe interface (Add Content → Review → Knowledge Graph)
- **Beautiful Design**: Calming terracotta accent colors with warm off-white backgrounds
- **Review Modal**: Full-screen immersive review experience with progress tracking
- **Recent Activity**: Quick access to recently added content with smart categorization
- **Study Streaks**: Motivational streak tracking to build consistent study habits
- **Type-Safe Full Stack**: Built with TypeScript, tRPC, and Prisma for end-to-end type safety

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org) with App Router
- **Database**: PostgreSQL with [Prisma ORM](https://prisma.io)
- **API Layer**: [tRPC](https://trpc.io) for type-safe APIs
- **AI Integration**: 
  - Google Gemini 2.0 Flash (via Vercel AI SDK) for fast answer evaluation
  - Google Gemini 1.5 Flash for question generation
  - EXA API for content extraction from URLs
- **Spaced Repetition**: [ts-fsrs](https://github.com/open-spaced-repetition/ts-fsrs) library
- **Animations**: [Framer Motion](https://www.framer.com/motion/) for smooth swipe navigation
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) with custom design system
- **MCP Support**: Model Context Protocol server for AI assistants

## Quick Start

1. **Clone and install dependencies**
   ```bash
   git clone <repository>
   cd total-recall-hack
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Required variables:
   - `DATABASE_URL`: PostgreSQL connection string
   - `EXA_API_KEY`: For URL content extraction
   - `GOOGLE_GENERATIVE_AI_API_KEY`: For AI question generation (optional)

3. **Set up database**
   ```bash
   npm run db:push     # Push schema to database
   npm run db:generate # Generate Prisma client
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## API Endpoints

### Context Management
- `context.create` - Create context with URL or text
- `context.update` - Update existing context
- `context.get` - Get context by ID
- `context.list` - List all contexts
- `context.delete` - Delete context

### Question Management
- `question.create` - Create question manually
- `question.update` - Update question text
- `question.get` - Get question by ID
- `question.list` - List all questions
- `question.listByContext` - List questions for a context
- `question.delete` - Delete question

### FSRS Review System
- `question.review` - Process a review with rating (1-4: Again/Hard/Good/Easy)
- `question.getDue` - Get questions due for review
- `question.getScheduling` - Get scheduling options for different ratings

## Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Type checking
npm run db:studio    # Open Prisma Studio
```

## MCP Server Configuration

For AI assistants like Claude Desktop:

```json
{
  "mcpServers": {
    "total-recall": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "http://localhost:3000/api/mcp/mcp"]
    }
  }
}
```

## Project Structure

```
src/
├── app/                    # Next.js app router pages
├── components/
│   ├── screens/           # Main app screens
│   │   ├── AddContentScreen.tsx
│   │   ├── ReviewScreen.tsx
│   │   └── KnowledgeGraphScreen.tsx
│   ├── review-states/     # Review modal states
│   ├── SwipeContainer.tsx # Swipe navigation wrapper
│   ├── ReviewModal.tsx    # Full-screen review experience
│   └── ModalPortal.tsx    # React portal for modals
├── hooks/
│   ├── useSwipeNavigation.ts  # Screen navigation logic
│   ├── useReviewSession.ts    # Review session management
│   └── useAddContent.ts       # Content creation logic
├── server/
│   ├── api/
│   │   ├── routers/       # tRPC routers (context, question)
│   │   └── trpc.ts        # tRPC configuration
│   └── db/                # Database client
├── lib/
│   ├── ai.ts              # Gemini AI integration
│   ├── voice-evaluation.ts # Answer evaluation with AI
│   ├── fsrs.ts            # FSRS algorithm utilities
│   └── exa.ts             # EXA API integration
└── mcp/                   # MCP server implementation
```

## Testing

Use the included Postman collection at `src/postman_collections.json` to test all API endpoints.

## How It Works

1. **Content Input**: Swipe to the Add Content screen and paste URLs or enter text directly
2. **AI Processing**: Gemini automatically generates flashcards following SuperMemo principles
3. **Review**: Swipe to Review screen, tap "Start Review" for an immersive study session
4. **Answer & Feedback**: Type your answer and receive instant AI-powered evaluation with encouraging feedback
5. **Smart Scheduling**: FSRS algorithm optimizes when each card should be reviewed next
6. **Track Progress**: View your study streak, cards due, and topic breakdown at a glance
7. **Efficient Learning**: Achieve better retention with 20-30% fewer reviews than traditional methods

## License

This project is built with the [T3 Stack](https://create.t3.gg/).