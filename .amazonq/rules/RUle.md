
## Response Style (VERY IMPORTANT)
Keep responses concise and focused. Avoid comprehensive solutions or lengthy explanations unless specifically requested. Provide targeted, actionable answers that directly address the immediate question or task. When implementing features, focus on the minimal viable solution rather than extensive, feature-complete implementations.

Ask the user questions if your confidence level for a solution drops below 80% else take your judgement.

## Project Overview

This is a T3 Stack application using Next.js 15, tRPC, Drizzle ORM with SQLite, and Tailwind CSS. The project follows the T3 Stack conventions for type-safe full-stack development.

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

- `npm run db:generate` - Generate Drizzle migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:push` - Push schema changes directly to database
- `npm run db:studio` - Open Drizzle Studio for database inspection

## Architecture

### Database Layer
- **ORM**: Drizzle ORM with SQLite
- **Schema**: Located in `src/server/db/schema.ts`
- **Connection**: Database instance exported from `src/server/db/index.ts`
- **Table Prefix**: All tables prefixed with `total-recall-hack_` for multi-project schema support

### API Layer
- **Framework**: tRPC for type-safe API routes
- **Router**: Main router in `src/server/api/root.ts`
- **Procedures**: Individual routers in `src/server/api/routers/`
- **Context**: Database and request context provided to all procedures
- **Middleware**: Timing middleware with artificial delay in development

### Frontend Layer
- **Framework**: Next.js 15 with App Router
- **State Management**: TanStack Query via tRPC React integration
- **Styling**: Tailwind CSS v4
- **Font**: Geist font family

### Environment Configuration
- **Validation**: Environment variables validated using `@t3-oss/env-nextjs`
- **Schema**: Defined in `src/env.js`
- **Required**: `DATABASE_URL` for database connection

## Key Files and Directories

- `src/server/api/trpc.ts` - tRPC configuration and procedure definitions
- `src/trpc/react.tsx` - Client-side tRPC and React Query setup
- `src/server/db/schema.ts` - Database schema definitions
- `drizzle.config.ts` - Drizzle ORM configuration
- `src/env.js` - Environment variable validation

## Development Notes

- The project uses TypeScript in strict mode
- All API calls are type-safe through tRPC
- Database operations use Drizzle ORM with type-safe queries
- Development server includes artificial latency simulation to catch waterfall issues
- Environment variables are validated at build time