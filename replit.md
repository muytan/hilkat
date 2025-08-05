# Overview

This is a React-based horror story web application called "Hilkat Garibesi" (Turkish for "Horror Stories"). The application features a modern, dark-themed interface for displaying interactive horror stories with scroll-based animations. The main story follows "Yargıç Erkan Cantay" (Judge Erkan Cantay) and includes features for loading content from Google Docs with fallback text support.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React 18** with TypeScript for type safety and modern development
- **Vite** as the build tool and development server for fast hot module replacement
- **Wouter** for lightweight client-side routing instead of React Router
- **shadcn/ui** component library built on Radix UI primitives for accessible, customizable components
- **Tailwind CSS** for utility-first styling with custom dark theme configuration
- **TanStack Query** for server state management and data fetching

## Animation System
- **GSAP (GreenSock)** loaded via CDN for high-performance animations
- **ScrollTrigger** plugin for scroll-based reveal animations
- Custom **ScrollReveal** component that splits text into words and animates them progressively as user scrolls
- Fallback graceful degradation when GSAP fails to load

## Styling Approach
- Dark horror theme with custom CSS variables for consistent theming
- Responsive design with mobile-first approach
- CSS-in-JS avoided in favor of utility classes for better performance
- Custom horror-themed animations and floating elements

## Content Management
- **Google Docs integration** for dynamic story content loading
- Fallback system with hardcoded content when external sources fail
- **StorySection** component handles content fetching with error boundaries
- Preview/expand functionality for long-form content

## Database Layer
- **Drizzle ORM** configured for PostgreSQL with type-safe database operations
- User schema with authentication fields (username, password)
- Database migrations handled through Drizzle Kit
- Connection configured for Neon Database (serverless PostgreSQL)

## Backend Architecture
- **Express.js** server with TypeScript
- Modular route registration system
- In-memory storage implementation with interface for easy database switching
- Middleware for request logging and error handling
- Static file serving for production builds

## Development Workflow
- **ESM modules** throughout the codebase for modern JavaScript
- **TypeScript** with strict mode enabled for type safety
- Development and production build scripts with esbuild
- Hot module replacement in development mode
- Replit-specific development banner integration

## External Dependencies

- **@neondatabase/serverless** - Serverless PostgreSQL database driver
- **GSAP & ScrollTrigger** - Animation library loaded via CDN
- **Google Docs API** - For dynamic content loading (export format)
- **Radix UI** - Unstyled, accessible UI component primitives
- **Tailwind CSS** - Utility-first CSS framework
- **TanStack Query** - Server state management
- **Drizzle ORM** - Type-safe PostgreSQL ORM
- **Wouter** - Lightweight React router
- **Vite** - Build tool and development server