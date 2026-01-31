# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Shorty is a URL shortening service built with AdonisJS 6, Vue 3, and Inertia.js. It allows users to create shortened URLs with custom domains and slugs, featuring QR code generation and user authentication.

## Development Commands

### Essential Commands

- `npm run dev` - Start development server with hot module replacement
- `npm run build` - Build the application for production
- `npm start` - Start production server
- `npm run test` - Run all tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run typecheck` - Run TypeScript type checking

### Testing Commands

- `node ace test` - Run all test suites
- `node ace test --suite=unit` - Run unit tests only
- `node ace test --suite=functional` - Run functional tests only

### Database Commands

- `node ace migration:run` - Run database migrations
- `node ace db:seed` - Seed the database
- `node ace make:migration <name>` - Create new migration
- `node ace make:seeder <name>` - Create new seeder

## Architecture

### Core Stack

- **Backend**: AdonisJS 6 with TypeScript
- **Frontend**: Vue 3 with Inertia.js (SPA-like experience)
- **Database**: PostgreSQL with Lucid ORM
- **Authentication**: AdonisJS Auth with session-based auth
- **UI**: Nuxt UI components with Tailwind CSS
- **Build**: Vite with HMR support

### Key Models

- **User**: Authentication and user management
- **Link**: Core URL shortening functionality with auto/custom slugs
- **Domain**: Custom domain management for organizations
- **Organization**: Multi-tenant support
- **Analytics**: Click tracking and analytics data for links

### Directory Structure

- `app/controllers/` - HTTP request handlers organized by feature
- `app/models/` - Database models with Lucid ORM
- `app/services/` - Business logic services
- `app/validators/` - Request validation schemas
- `app/middleware/` - HTTP middleware
- `database/migrations/` - Database schema migrations
- `inertia/` - Frontend Vue.js application
- `inertia/pages/` - Inertia.js pages
- `inertia/components/` - Reusable Vue components
- `start/routes.ts` - Route definitions
- `config/` - Application configuration

### Import Aliases

The project uses import aliases defined in package.json:

- `#controllers/*` - App controllers
- `#models/*` - Database models
- `#services/*` - Business services
- `#validators/*` - Request validators
- `#middleware/*` - HTTP middleware
- `#config/*` - Configuration files
- `#database/*` - Database files
- `#start/*` - Application startup files

### Key Features

- **URL Shortening**: Auto-generated and custom slugs
- **Domain Management**: Custom domains for organizations
- **QR Code Generation**: Built-in QR code creation for links
- **Authentication**: User registration and login
- **Multi-platform URLs**: iOS, Android, and fallback URL support
- **Analytics**: Comprehensive click tracking with device, browser, and referrer data
  - Overview statistics (total clicks, links, today, this week)
  - Clicks over time visualization
  - Top performing links
  - Traffic sources analysis
  - Device and browser breakdown

### Frontend Architecture

- **Inertia.js**: Bridges Laravel-style backend with Vue frontend
- **Vue 3**: Composition API with TypeScript support
- **Nuxt UI**: Pre-built components with Tailwind CSS
- **Vite**: Fast build tool with HMR

### Database Schema

- Uses ULID for primary keys across all models
- PostgreSQL as primary database
- Lucid ORM for database operations
- Migrations in `database/migrations/`

### Code Style

- ESLint with AdonisJS configuration
- Prettier for code formatting
- TypeScript strict mode enabled
- French comments and error messages in some areas

## Testing

The project uses Japa test runner with two test suites:

- **Unit tests**: Located in `tests/unit/` (2s timeout)
- **Functional tests**: Located in `tests/functional/` (30s timeout)

## Development Notes

- The application uses session-based authentication
- Environment variables are managed through `start/env.ts`
- Hot reloading is configured for controllers and middleware
- The frontend uses Inertia.js for SPA-like navigation without API endpoints
- All models use ULID instead of auto-incrementing IDs
- Slug generation service creates unique alphanumeric identifiers
