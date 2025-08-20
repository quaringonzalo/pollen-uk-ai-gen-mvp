# Pollen Platform - Compressed replit.md

## Overview

Pollen is a skills-first career platform designed to revolutionize hiring by prioritizing verified abilities and behavioral fit over traditional credentials. It features gamified skills assessments, advanced behavioral profiling, and intelligent job matching. The platform aims to connect job seekers with employers based on actual competencies and shared values, fostering a more effective and equitable hiring landscape.

## Recent Changes (August 2025)
- **Behavioral Assessment Results Integration**: Fixed critical issue where frontend was using duplicate personality type generation instead of backend results. Eliminated frontend duplication ensuring profile page correctly displays backend-generated personality types like "The Results Machine" with comprehensive behavioral content using dynamic pronoun transformation system.
- **Question Count Correction**: Updated checkpoints page to correctly show "0/15 questions" instead of "0/30 questions" for the reduced behavioral assessment, maintaining consistency across all user interfaces.
- **Streamlined Behavioral Assessment Enhancement**: Implemented focused 17-type personality system differentiating pure profiles (70%+ single dimension) vs blended profiles (40-69% primary + 30%+ secondary). System generates distinct types covering all 12 possible blended combinations like "The Quality Guardian" (70%+ blue) vs "The Methodical Achiever" (50% blue + 40% red) vs "The Engaging Analyst" (50% blue + 40% yellow). Eliminated excessive variants while maintaining complete coverage of all meaningful DISC combinations.
- **Behavioral Assessment Calculation Bug Fix**: Fixed critical DISC calculation error where reduced assessment was using wrong question array, causing incorrect personality results. Implemented proper forced-choice scoring (+3 for most like me, -1 for least like me) and corrected normalization logic to ensure accurate percentage calculations matching user responses.
- **Homepage Pollen Jobs Priority**: Fixed critical issue where Pollen approved jobs weren't displaying on homepage. Homepage now prioritizes Pollen approved jobs first in featured section, ensuring Marketing Coordinator, Junior Data Analyst, and Content Marketing Assistant roles are prominently displayed.
- **Save Job Functionality**: Successfully implemented complete save job feature on job-application pages with heart button toggle, proper API integration, visual feedback, and persistent state management. Fixed critical navigation workflow by removing redundant job-detail pages that broke intended user flow (Homepage → Job Application pages directly).
- **Database Migration**: Successfully migrated from hardcoded fallback system to PostgreSQL database for job data management.
- **Interview Scheduling Logic**: Fixed message scheduling buttons to show correct CTAs based on sender role and scheduling status. Pollen team messages show Calendly booking links, employer messages show scheduling forms, scheduled interviews show review details.
- **Notification Indicators**: Replaced complex count badges with simple colored dots (red for notifications, blue for messages) for reliable visual feedback.

## User Preferences

Preferred communication style: Simple, everyday language.
Never use "cultural fit" - always use "values fit" instead.
Prefers single comprehensive documentation - update PROFILE_CREATION_RESTRUCTURE_PLAN.md with all question mappings rather than multiple documents.
**CRITICAL**: Job posting ideal persona sections must focus on behavioral assessment and key skills only - NEVER include experience or education requirements (off-brand).
Simplified UI approach - remove overwhelming content, focus on core functionality. People just want to see jobs!
Remove redundant navigation elements that are covered by other UI components (like removing secondary headers when main navigation exists).

## System Architecture

### Core Principles
- **Skills-First Approach**: Emphasizes verified abilities and behavioral traits for matching.
- **Gamification**: Integrates points, streaks, leaderboards, and challenges for engagement.
- **Human-Centric Design**: Prioritizes clear communication, intuitive workflows, and user well-being.
- **Progressive Disclosure**: Information presented incrementally to avoid overwhelm.
- **Accessibility & Inclusivity**: Focus on WCAG AA compliance, British English localization, and support for diverse user needs.

### Technical Implementation
- **Frontend**: React 18 with TypeScript, Vite, TailwindCSS (shadcn/ui components), TanStack Query, Wouter, React Hook Form with Zod validation.
- **Backend**: Node.js with Express, TypeScript (ES modules), Drizzle ORM, PostgreSQL-backed sessions, local filesystem storage.
- **Data Storage**: PostgreSQL 16 for primary data and sessions, Drizzle for schema management.

### UI/UX Decisions
- Clean, flat design utilizing white backgrounds, neutral grays, and Pollen brand colors (Bold Pink #E2007A for primary actions, Yellow #ffde59 for highlights).
- Typography: Sora for headings/buttons, Poppins for body text.
- Consistent iconography and visual hierarchy with mobile-responsive layouts.

### Feature Specifications
- **Skills Challenge System**: Gamified, practical assessments including company-specific challenges.
- **Behavioral Assessment Engine**: Enhanced DISC profiling with 17+ fun behavioral types system (Results Dynamo, Social Butterfly, Steady Planner, Quality Guardian, etc.). Assessment optimization planned: reduce from 30 to 15 questions with mixed formats (situational choice, ranking, sliders), progressive milestone feedback, and improved DISC presentation using pie charts with strength-based language instead of high/low scores to avoid weakness perception. Results map to consistent behavioral types across job seeker, admin, and employer portals.
- **Job Matching Algorithm**: Two-stage process combining practical filters (visa, location) with weighted scoring (70% skills, 30% behavioral fit).
- **User Role System**: Distinct workflows for Job Seekers, Employers, and Admins.
- **Gamification**: Point system, streaks, leaderboards, and achievements.
- **Checkpoint Systems**: Progressive profile creation (7 checkpoints for job seekers, 6 for employers) with dynamic content adaptation.
- **Interview Management System**: Comprehensive scheduling, calendar integration, and status tracking.
- **Messaging System**: Unified, context-aware messaging for all user types.
- **Candidate Profile Structure**: Precise 3-tab system: "Pollen Team Insights" (assessment, interview performance), "Profile" (behavioral profile, key strengths, personal insights), and "Skills" (assessment scores, submission examples).
- **Employer Portal & Admin Portal**: Streamlined dashboards with focused primary actions and progressive disclosure, ensuring consistent data views across admin and employer interfaces.
- **Comprehensive Analytics System**: Detailed platform analytics tracking job seeker demographics, diversity outcomes, employer hiring patterns, time-to-hire metrics, and individual applicant progress to demonstrate methodology effectiveness.
- **Hidden Jobs Board**: Exclusive job opportunities accessible only to Pollen users, with admin management capabilities for creating and maintaining hidden job listings. Features comprehensive job posting management with Pollen approval status, industry categorization, and direct application links.
- **Profile Completion Validation**: Pollen approved jobs require complete user profiles (basic info + behavioral assessment) before allowing applications. External jobs can be applied to without profile completion requirements. Users are redirected to profile checkpoints with clear messaging when attempting to apply without complete profiles.
- **Simplified Status System**: 4 main statuses (New, In Progress, Complete, Hired) with clear visual indicators and detailed CTAs.
- **PDF Generation**: High-fidelity, single-page PDF export of candidate profiles.

## External Dependencies

- **@neondatabase/serverless**: PostgreSQL database connection.
- **@radix-ui/**: UI component library.
- **@tanstack/react-query**: Server state management.
- **drizzle-orm**: Database ORM.
- **express**: Web server framework.
- **react**: Frontend framework.
- **tailwindcss**: Styling.
- **typescript**: Language.
- **vite**: Build tool.
- **wouter**: Routing.
- **zod**: Validation.
- **connect-pg-simple**: PostgreSQL session store.
- **SendGrid**: Email notifications.