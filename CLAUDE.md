# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Response Style (VERY IMPORTANT)
Keep responses concise and focused. Avoid comprehensive solutions or lengthy explanations unless specifically requested. Provide targeted, actionable answers that directly address the immediate question or task. When implementing features, focus on the minimal viable solution rather than extensive, feature-complete implementations.

Ask the user questions if your confidence level for a solution drops below 80% else take your judgement.

## Project Overview

This is a mobile-first T3 Stack application with a beautiful swipe-based interface, using Next.js 15, tRPC, Prisma ORM with PostgreSQL, Tailwind CSS, and Framer Motion. The project implements an AI-powered spaced repetition learning system with FSRS algorithm integration.

### Key Features
- **Mobile-First UI**: Intuitive 3-screen swipe navigation (Add Content → Review → Knowledge Graph)
- **Context Management System**: Store and manage contexts with either URL or text content (XOR validation - can have one but not both)
- **EXA Integration**: Automatic content extraction when URLs are provided, stores full API response as JSON
- **AI-Powered Question Generation**: Automatic flashcard generation using Google Gemini when contexts are created/updated
- **Smart Review System**: Full-screen immersive review experience with AI-powered answer evaluation
- **FSRS Spaced Repetition**: Scientific spaced repetition algorithm via ts-fsrs library for optimized learning schedules
- **Question Management System**: Full CRUD for flashcard questions with FSRS state tracking (due dates, stability, difficulty, etc.)
- **Type-safe APIs**: Full-stack type safety through tRPC with automatic client generation

## Development Commands

- `npm run dev` - Start development server with Turbo
- `npm run build` - Build the application for production
- `npm run start` - Start production server
- `npm run preview` - Build and start production server locally

## Code Quality & Linting

- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with auto-fix
- `npm run typecheck` - Run TypeScript type checking without emitting files
- `npm run check` - Run both linting and type checking
- `npm run format:check` - Check code formatting with Prettier
- `npm run format:write` - Format code with Prettier

## Database Commands

- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:push` - Push schema changes directly to database
- `npm run db:studio` - Open Prisma Studio for database inspection

## Architecture

### Database Layer
- **ORM**: Prisma ORM with PostgreSQL
- **Schema**: Located in `prisma/schema.prisma`
- **Connection**: Database instance exported from `src/server/db/index.ts`
- **Models**: 
  - `Post` - Simple posts with name and timestamps
  - `Context` - Contexts with name, optional URL or text (XOR), and extracted content
  - `Question` - Flashcard questions with FSRS fields (due, stability, difficulty, state, etc.), linked to Context via contextId

### API Layer
- **Framework**: tRPC for type-safe API routes
- **Router**: Main router in `src/server/api/root.ts`
- **Procedures**: Individual routers in `src/server/api/routers/`
  - `post.ts` - Basic CRUD for posts
  - `context.ts` - Context CRUD with XOR validation, EXA integration, and automatic AI question generation
  - `question.ts` - Question CRUD with FSRS review system, scheduling, and due card queries
  - `exa.ts` - EXA search functionality
- **Context**: Database and request context provided to all procedures
- **Middleware**: Timing middleware with artificial delay in development

### AI Integration Layer
- **LLM Providers**: 
  - Google Gemini 2.0 Flash - Fast answer evaluation with encouraging feedback
  - Google Gemini 1.5 Flash - Question generation from context
- **AI Services**: 
  - `src/lib/ai.ts` - Handles question generation from context
  - `src/lib/voice-evaluation.ts` - Answer evaluation and scoring
- **Prompt Template**: `src/question_generation_prompt.md` - SuperMemo-based flashcard generation prompt
- **Auto-generation**: Questions automatically created/updated when contexts change

### Spaced Repetition Layer
- **Algorithm**: FSRS (Free Spaced Repetition Scheduler) via ts-fsrs library
- **FSRS Service**: `src/lib/fsrs.ts` - Handles review processing and scheduling calculations
- **Card States**: New (0), Learning (1), Review (2), Relearning (3)
- **Rating System**: 1=Again, 2=Hard, 3=Good, 4=Easy
- **Optimization**: 20-30% fewer reviews compared to traditional algorithms

### Frontend Layer
- **Framework**: Next.js 15 with App Router
- **State Management**: TanStack Query via tRPC React integration
- **Animations**: Framer Motion for smooth swipe navigation
- **Styling**: Tailwind CSS v4 with custom design system
  - Warm terracotta accent color (#d97757)
  - Off-white background (#fafaf8)
  - Soft shadows and rounded corners
- **Font**: Geist font family
- **Navigation**: Swipe-based with visual page indicators

### Environment Configuration
- **Validation**: Environment variables validated using `@t3-oss/env-nextjs`
- **Schema**: Defined in `src/env.js`
- **Required**: 
  - `DATABASE_URL` - PostgreSQL connection string (format: postgresql://username:password@host:port/database)
  - `EXA_API_KEY` - EXA API key for content extraction
  - `GOOGLE_GENERATIVE_AI_API_KEY` - Google AI Studio API key for Gemini (optional, enables AI features)

## Key Files and Directories

### Backend & API
- `src/server/api/trpc.ts` - tRPC configuration
- `src/trpc/react.tsx` - Client-side tRPC and React Query setup
- `prisma/schema.prisma` - Database schema definitions
- `src/server/db/index.ts` - Prisma client instance
- `src/env.js` - Environment variable validation

### AI & Integration Services
- `src/lib/exa.ts` - EXA API integration utilities
- `src/lib/ai.ts` - Google Gemini AI integration for question generation
- `src/lib/voice-evaluation.ts` - Answer evaluation with Gemini 2.0 Flash
- `src/lib/fsrs.ts` - FSRS spaced repetition algorithm implementation
- `src/question_generation_prompt.md` - Prompt template for flashcard generation

### API Routers
- `src/server/api/routers/question.ts` - Question CRUD with FSRS review system
- `src/server/api/routers/context.ts` - Context CRUD with AI integration
- `src/postman_collections.json` - Postman collection for API testing

### UI Components
- `src/components/SwipeContainer.tsx` - Main swipe navigation wrapper
- `src/components/PageIndicator.tsx` - Visual navigation dots
- `src/components/ModalPortal.tsx` - React portal for full-screen modals
- `src/components/ReviewModal.tsx` - Full-screen review experience
- `src/components/screens/AddContentScreen.tsx` - Content creation interface
- `src/components/screens/ReviewScreen.tsx` - Review dashboard with statistics
- `src/components/screens/KnowledgeGraphScreen.tsx` - Future knowledge visualization
- `src/components/review-states/` - 5 review modal states (Intro, Question, Answer, Evaluation, Complete)

### Custom Hooks
- `src/hooks/useSwipeNavigation.ts` - Screen navigation and state management
- `src/hooks/useReviewSession.ts` - Review session logic and progress tracking
- `src/hooks/useAddContent.ts` - Content creation and submission logic
- `src/hooks/useReviewData.ts` - Review statistics and due cards calculation

## Development Notes

- The project uses TypeScript in strict mode
- All API calls are type-safe through tRPC
- Database operations use Prisma with type-safe queries and migrations
- Development server includes artificial latency simulation to catch waterfall issues
- Environment variables are validated at build time
- Context XOR validation ensures data integrity (either URL or text, never both)
- EXA integration provides automatic content extraction for URLs
- AI question generation happens automatically on context create/update (deletes old questions on update)

## AI Features

- **Automatic Question Generation**: When a context is created or updated with content, the system automatically generates flashcard questions using Google Gemini
- **SuperMemo Principles**: Questions follow proven learning principles (minimum information, cloze deletion, etc.)
- **Smart Regeneration**: On context update, old questions are deleted and new ones are generated
- **FSRS Integration**: Each question includes full FSRS state for scientific spaced repetition

## FSRS Question Fields

Each question includes the following FSRS fields:
- `due`: DateTime when card is due for review
- `stability`: Memory stability (days for R to drop from 100% to 90%)
- `difficulty`: Inherent difficulty of the material (1-10 scale)
- `elapsedDays`: Days since last review
- `scheduledDays`: Interval until next review
- `learningSteps`: Current step in learning phase
- `reps`: Total number of reviews
- `lapses`: Number of times forgotten
- `state`: Card state (0=New, 1=Learning, 2=Review, 3=Relearning)
- `lastReview`: Date of last review (nullable)

## Question API Endpoints

### Standard CRUD
- `question.create` - Create with FSRS defaults
- `question.update` - Update question/answer text only
- `question.get` - Get by ID with context
- `question.list` - List all with optional filter
- `question.listByContext` - List for specific context
- `question.delete` - Delete by ID

### FSRS Review System
- `question.review` - Process review with rating (1-4)
- `question.getDue` - Get cards due for review
- `question.getScheduling` - Preview scheduling options
- `question.evaluateAnswer` - Voice answer evaluation with AI (transcribe + evaluate + auto-update FSRS)