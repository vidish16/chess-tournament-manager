<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Chess Pairing AI System

This is a modern, full-stack chess tournament management system built with Next.js, TypeScript, and cutting-edge visualization libraries.

## Project Architecture
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives for accessibility
- **State Management**: Zustand for global state, React Query for server state
- **Visualizations**: D3.js for interactive tournament brackets, Recharts for analytics
- **Database**: SQLite with Prisma ORM for local deployment
- **AI Integration**: OpenAI API for intelligent pairing optimization

## Key Features
- **Interactive Tournament Dashboard**: Real-time rankings and round management
- **Visual Pairing System**: Interactive graphs showing player connections and match history
- **Swiss Tournament Algorithm**: AI-enhanced pairing logic with ELO integration
- **Player Analytics**: Match history, performance trends, and rating progression
- **Mobile-Responsive**: Clean, minimalistic design optimized for all devices
- **Community Features**: Player profiles, tournament history, and social features

## Code Style Guidelines
- Use TypeScript with strict typing
- Follow Next.js 14 App Router conventions
- Implement responsive design with mobile-first approach
- Use semantic HTML and accessible components
- Leverage Tailwind CSS utility classes with custom design tokens
- Create reusable components with proper prop interfaces
- Implement proper error handling and loading states

## Tournament Logic
- **Swiss System**: Advanced pairing algorithm considering rating, color balance, and previous opponents
- **ELO Rating**: Dynamic rating calculations with configurable K-factors
- **Color Balance**: Intelligent white/black assignment based on player history
- **Bye Handling**: Fair bye distribution for odd-numbered tournaments
- **AI Enhancement**: OpenAI integration for complex pairing scenarios

## Data Models
- **Player**: ID, name, rating, tournament history, preferences
- **Tournament**: Format, rounds, participants, settings
- **Match**: Players, result, round, board number, color assignments
- **Rating**: Historical ELO progression and statistics

## API Design
- RESTful endpoints following Next.js API conventions
- Type-safe API routes with proper error handling
- Real-time updates using WebSockets or Server-Sent Events
- Optimistic UI updates with React Query

## Deployment
- Optimized for Vercel deployment
- Environment-based configuration
- SQLite for development, PostgreSQL for production
- Edge-ready API routes for global performance
