# Love Message App

## Overview

This is a full-stack React application built with Express.js backend, designed as a romantic love message app. The application features a modern UI built with shadcn/ui components, TypeScript throughout, and uses Drizzle ORM for database operations with PostgreSQL. The app provides multiple sections for relationship activities including daily tasks, complaints, hugs tracking, reminders, and special day celebrations.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (January 2025)

- Fixed background colors for both light and dark modes with gentle pink theme
- Improved hug animations with more impactful bounce effects and multiple layers
- Shortened complaint box interface while maintaining functionality
- Added built-in developer console for real-time data monitoring
- Created comprehensive developer guide for data access and monitoring
- Implemented localStorage-based data persistence for user activities

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development and building
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Query (@tanstack/react-query) for server state management, local state with React hooks and localStorage
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Layout**: Single-page application with sidebar navigation and section-based routing

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API structure (routes not yet implemented)
- **Middleware**: JSON parsing, URL encoding, request logging, and error handling
- **Development**: Hot reload with tsx in development mode

### Database & Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: PostgreSQL (configured for Neon Database via connection string)
- **Schema Location**: Centralized in `shared/schema.ts` for type sharing
- **Migrations**: Drizzle Kit for schema migrations in `./migrations` directory
- **Storage Interface**: Abstracted storage layer with in-memory implementation for development

## Key Components

### Data Models
- **Users**: Basic user model with id, username, and password fields
- **Storage Interface**: Abstracted CRUD operations for scalability

### Frontend Features
- **Love Messages**: Daily rotating love messages and reminders
- **Task Tracking**: Daily task completion with localStorage persistence
- **Complaint System**: Text-based complaint logging with timestamps
- **Hug Counter**: Daily hug tracking with animated feedback
- **Theme Support**: Dark/light mode toggle with system preference detection
- **Responsive Design**: Mobile-first approach with sidebar navigation

### UI Components
- **Component Library**: Comprehensive shadcn/ui component collection
- **Form Handling**: React Hook Form with Zod validation (configured but not yet implemented)
- **Animations**: CSS-based animations and transitions
- **Accessibility**: Radix UI primitives ensure good accessibility practices

## Data Flow

### Client-Side Data Flow
1. **Local Storage**: User preferences, daily tasks, complaints, and hug counters persist in localStorage
2. **State Management**: React Query handles server state, React hooks manage local state
3. **Navigation**: URL-based routing with wouter, sidebar state management
4. **Real-time Updates**: Timer-based updates for countdown displays

### Server-Side Data Flow
1. **Request Processing**: Express middleware handles JSON parsing and logging
2. **Route Handling**: Centralized route registration (implementation pending)
3. **Data Access**: Storage interface abstracts database operations
4. **Error Handling**: Global error middleware with proper HTTP status codes

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection for serverless environments
- **drizzle-orm & drizzle-kit**: Database ORM and migration tools
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight React routing
- **date-fns**: Date manipulation utilities

### UI Dependencies
- **@radix-ui/***: Comprehensive set of accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe component variants
- **lucide-react**: Icon library

### Development Dependencies
- **vite**: Fast build tool and dev server
- **typescript**: Type checking and compilation
- **tsx**: TypeScript execution for Node.js

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite builds React app to `dist/public`
2. **Backend Build**: esbuild bundles server code to `dist/index.js`
3. **Production Mode**: Serves static files and API from single Express server

### Environment Configuration
- **Development**: Hot reload with Vite dev server proxy
- **Production**: Static file serving with Express
- **Database**: PostgreSQL connection via `DATABASE_URL` environment variable

### Deployment Considerations
- **Database Migrations**: Manual execution via `npm run db:push`
- **Environment Variables**: DATABASE_URL required for production
- **Static Assets**: Served from `dist/public` in production
- **Error Handling**: Comprehensive error boundaries and logging

The application follows a monorepo structure with clear separation between client, server, and shared code, making it maintainable and scalable for future romantic features and enhancements.