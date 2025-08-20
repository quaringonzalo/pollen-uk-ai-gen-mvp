# Navigation Architecture - Skills Challenge Simplification

## Overview

The Skills Challenge Simplification has created a new streamlined navigation structure. Here's how the pages relate to each other:

## Navigation Structure

### Landing Page (`/`)
- **Purpose**: Public marketing page for new visitors
- **Audience**: Non-authenticated users
- **Navigation**: Sign up flows to role-specific dashboards

### Home Page (`/home`) 
- **Purpose**: Central hub for authenticated users with role-specific content
- **Audience**: All authenticated users (job seekers, employers, admins)
- **Content**: 
  - Role-specific quick actions
  - Recent activity summaries
  - Navigation to specialized dashboards
- **Job Seeker Navigation**: "Browse Jobs" button → `/jobs`

### Jobs Page (`/jobs`) - NEW SIMPLIFIED DASHBOARD
- **Purpose**: **Primary job browsing and application hub** for job seekers
- **Audience**: Job seekers (authenticated)
- **Relationship**: This is the main jobs interface, accessed FROM `/home`
- **Content**:
  - Profile completion guidance (if incomplete)
  - Personalized job recommendations (if profile complete)
  - Quick navigation to companies and saved items
  - Direct application flow to `/jobs/:jobId/apply`

### Job Application (`/jobs/:jobId/apply`) - NEW SIMPLIFIED FLOW
- **Purpose**: Streamlined "One Challenge, One Application" process
- **Flow**: Job Overview → Custom Assessment → Application Complete
- **Features**: 
  - Integrated bespoke challenges
  - Professional review process
  - Direct employer submission

## Key Changes from Skills Challenge Simplification

### Before (Dual Challenge System)
```
/home → /job-recommendations → /job-application/:jobId
                            → Foundation challenges
                            → Company challenges
```

### After (Simplified System)
```
/home → /jobs → /jobs/:jobId/apply
             → Single bespoke challenge per application
             → Professional review integrated
```

## User Journey Flow

### New Job Seeker Journey
1. **Authentication** → Land on `/home`
2. **Profile Setup** → Complete checkpoints via `/profile-checkpoints`
3. **Job Discovery** → Navigate to `/jobs` (primary job hub)
4. **Profile Complete?**
   - **Yes**: See personalized recommendations + quick nav to companies/saved items
   - **No**: See profile completion alert + general opportunities + completion guidance
5. **Application** → Click "Apply Now" → `/jobs/:jobId/apply`
6. **Assessment** → Complete single bespoke challenge
7. **Submission** → Professional review → Employer delivery

### Navigation Hierarchy
```
/home (central hub)
  ├── /jobs (primary job browsing) ← THIS IS THE MAIN JOBS PAGE
  │   ├── /jobs/:jobId/apply (simplified application)
  │   ├── /companies (company browsing)
  │   └── /saved-items (saved jobs/companies)
  ├── /profile-checkpoints (profile completion)
  ├── /applications (application tracking)
  └── Other role-specific sections
```

## Technical Implementation

### Route Structure
- `/jobs` → `SimplifiedJobSeekerDashboard` component
- `/jobs/:jobId/apply` → `SimplifiedJobApplication` component
- `/home` → Updated to navigate to `/jobs` for job browsing

### Key Features
- **Profile-aware content**: Shows different experiences based on completion
- **Progressive disclosure**: Guides users through profile completion
- **Quick navigation**: Easy access to related sections when profile is complete
- **Clear value proposition**: Explains benefits of completing profile

## Answer to Your Question

**"Where does this /jobs page sit?"**

The `/jobs` page is the **primary job browsing dashboard** that users navigate TO from the `/home` page. It's not replacing `/home` - instead:

- `/home` remains the central hub for all authenticated users
- `/jobs` becomes the specialized job seeker workspace
- Users click "Browse Jobs" on `/home` to reach `/jobs`
- `/jobs` provides the main job discovery and application experience

This creates a clear separation:
- **`/home`**: Multi-role central hub with overview and quick actions
- **`/jobs`**: Dedicated job seeker workspace with full job browsing functionality

The simplified navigation makes the user journey more focused while maintaining the existing home page structure for other platform features.