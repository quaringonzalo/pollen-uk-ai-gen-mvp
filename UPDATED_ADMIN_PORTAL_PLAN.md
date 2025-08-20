# Updated Admin Portal Development Plan
*Incorporating Employer Demo UI/UX Success Patterns*

## Design Philosophy
Following the successful simplicity and clarity of the employer portal:
- **Clean, minimal design** with white backgrounds and strategic Pollen brand colors
- **Consistent Sora/Poppins typography** throughout the interface
- **Simplified 4-status system** with clear visual indicators and action-oriented CTAs
- **Progressive disclosure** to avoid overwhelming admins with complex interfaces
- **Unified candidate profile structure** matching /candidates/23 format exactly

## Core Dashboard Structure

### Main Admin Dashboard (`/admin/dashboard`)
Clean, minimal admin hub following employer portal simplicity:

```
┌─────────────────────────────────────────────────────────┐
│ Admin Portal                         [Profile] [Logout] │
│                                                         │
│ Welcome back, Holly                                     │
│ Your admin dashboard                                    │
│                                                         │
│ Primary Actions (4 buttons in grid):                   │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │
│ │ 🏢 Employers │ │ 📝 Jobs      │ │ 👥 Assigned  │ │ 💬 Messages  │ │
│ │   Management │ │  Approval    │ │   Jobs       │ │   & Support  │ │
│ │              │ │              │ │              │ │              │ │
│ │ 11 pending   │ │ 12 pending   │ │ 3 active     │ │ 8 unread     │ │
│ └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘ │
│                                                         │
│ Recent Activity:                                        │
│ ┌─ TechFlow: Marketing Assistant applications ─ 2h ago ┐ │
│ │ [Review 6 Applications] [Schedule Interviews]       │ │
│ └─────────────────────────────────────────────────────┘ │
│ ┌─ Creative Studios: Interview scores needed ─ 4h ago ┐ │
│ │ [Submit Scores] [Approve Candidates]               │ │
│ └─────────────────────────────────────────────────────┘ │
│ ┌─ New employer: DataTech Solutions ────────── 6h ago ┐ │
│ │ [Review Application] [Approve Profile]             │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

#### Implementation Specifics:
- **Header**: Clean navigation matching employer portal style with admin role context
- **4-Button Grid**: 2x2 layout, each button 300px width, 120px height
- **Button Colors**: Employers Management (blue-600), Jobs Approval (green-600), Assigned Jobs (pink-600), Messages (gray-600)
- **Activity Feed**: Last 3 recent items, real-time updates, clear CTAs
- **Progressive Disclosure**: Detailed workflows accessed through primary buttons to avoid dashboard overload
- **Notification Badges**: Red circles with white numbers, positioned top-right of buttons

## Core Admin Action/Status Pipeline

### Real Admin Responsibilities (Based on User Brief)

**1. Employer Management Workflow:**
- 🟢 **New Employer Application** → "Review company details and approve/reject"
- 🔵 **Profile Setup Complete** → "Review employer profile configuration and approve"
- 🟢 **Job Posting Submitted** → "Review for brand compliance (no experience/education requirements)"
- ⚪ **Active Employer** → "Track status: profile, payment, jobs, offers issued"

**2. Job-Specific Admin Assignment Workflow:**
- 🟢 **Applications Received** → "Review all applicants in grid view, edit/approve AI scores"
- 🔵 **Candidates Selected** → "Progress 2-3 candidates to Pollen interview"
- 🟠 **Pollen Interview Complete** → "Submit interview scores with standardized questions"
- ⚪ **Post-Interview Decision** → "Approve for employer OR edit/approve AI feedback"
- 🟢 **Employer Match** → "Edit/approve AI-generated candidate summary for employer"

**3. Content Approval Workflow:**
- 🟢 **Employer Review Submitted** → "Approve job seeker review of employer before publishing"
- 🔵 **AI-Generated Content** → "Review and edit AI scores, feedback, summaries"
- ⚪ **Ready for Publication** → "Approved content ready to send"

**4. Communication & Support:**
- Message both employers and candidates as needed
- Track employer status (profile, payment, job uploads, offers)
- Platform administration and settings management

## Page Structure & Navigation

### 1. Candidate Review Dashboard (`/admin/candidates`)
Matching the successful `/candidates` employer view structure with detailed layout:

```
┌─────────────────────────────────────────────────────────────────────┐
│ ← Back to Dashboard                               Admin Portal        │
│                                                                     │
│ Candidate Review                                [+ New Candidate]   │
│ Manage and review candidate applications                            │
│                                                                     │
│ ┌─ Search candidates... ──────────────┐ ┌─ All Statuses ▼ ─┐ ┌─ Export ─┐ │
│ │ 🔍 Sarah, James, Priya...           │ │ New (23)        │ │ PDF List │ │
│ └─────────────────────────────────────┘ │ In Progress (8) │ └──────────┘ │
│                                         │ Complete (12)   │              │
│                                         │ Matched (45)    │              │
│                                         └─────────────────┘              │
│                                                                     │
│ Candidate Grid (3 columns on desktop, 1 on mobile):                │
│ ┌─ Sarah Chen ──────────────────────┐ ┌─ James Mitchell ──────────┐ ┌─ Priya Singh ─────┐ │
│ │ 👩 SC  she/her                   │ │ 👨 JM  he/him            │ │ 👩 PS  she/her   │ │
│ │                                  │ │                          │ │                  │ │
│ │ Marketing Assistant              │ │ Digital Marketing        │ │ UX Designer      │ │
│ │ London • Available immediately   │ │ Manchester • 2 weeks     │ │ Edinburgh • Now  │ │
│ │                                  │ │                          │ │                  │ │
│ │ 🟢 New                          │ │ 🔵 In Progress          │ │ ⚪ Complete      │ │
│ │ time to review Sarah's profile   │ │ feedback pending for     │ │ approved for     │ │
│ │ and assessment                   │ │ James's interview        │ │ employer match   │ │
│ │                                  │ │                          │ │                  │ │
│ │ [Review Profile]                 │ │ [Provide Update]         │ │ [View Details]   │ │
│ │ Message • PDF • Assign           │ │ Message • PDF • Assign   │ │ Message • PDF    │ │
│ └──────────────────────────────────┘ └──────────────────────────┘ └──────────────────┘ │
│                                                                     │
│ ┌─ Alex Johnson ────────────────────┐ ┌─ Lucy Brown ──────────────┐ ┌─ David Wilson ────┐ │
│ │ 👨 AJ  he/him                    │ │ 👩 LB  she/her           │ │ 👨 DW  he/him    │ │
│ │                                  │ │                          │ │                  │ │
│ │ Software Developer               │ │ Content Marketing        │ │ Data Analyst     │ │
│ │ Remote • Available now           │ │ Birmingham • 1 month     │ │ London • Now     │ │
│ │                                  │ │                          │ │                  │ │
│ │ 🟢 Matched                      │ │ 🔵 In Progress          │ │ 🟢 New          │ │
│ │ successfully matched with        │ │ interview scheduled for  │ │ time to review   │ │
│ │ TechFlow Solutions              │ │ Lucy on Jan 30th         │ │ David's profile  │ │
│ │                                  │ │                          │ │                  │ │
│ │ [View Details]                   │ │ [View Interview]         │ │ [Review Profile] │ │
│ │ Message • PDF                    │ │ Message • PDF • Assign   │ │ Message • PDF    │ │
│ └──────────────────────────────────┘ └──────────────────────────┘ └──────────────────┘ │
│                                                                     │
│ Showing 6 of 88 candidates                          [< Prev] [Next >] │
└─────────────────────────────────────────────────────────────────────┘
```

#### Implementation Specifics:
- **Header**: Breadcrumb navigation, page title, primary action button
- **Search Bar**: 400px width, debounced search (300ms), placeholder text
- **Status Filter**: Dropdown with counts, multi-select capability
- **Card Grid**: CSS Grid, 3 columns desktop (minmax(300px, 1fr)), 1 column mobile
- **Card Structure**: 
  - Profile image: 48px circle, colored background with initials
  - Status badge: Consistent with employer portal colors/styling
  - Description text: 14px Poppins, gray-600 color
  - CTA buttons: Primary (green-600), secondary (outline gray)
- **Pagination**: 18 candidates per page, simple prev/next navigation

#### Individual Candidate Detail (`/admin/candidates/:id`)
**CRITICAL: Exact same structure as `/candidates/23` employer view for consistency**

```
┌───────────────────────────────────────────────────────────────────────────────────┐
│ ← Back to Candidates                                           Admin Portal        │
│                                                                                   │
│ ┌─ 👩 SC ─┐  Sarah Chen (she/her)                          🟢 New Application    │
│ │         │                                                                       │
│ │  Sarah  │  📍 London • ⏰ Available immediately • 🛂 British Citizen           │
│ │  Chen   │                                                                       │
│ │         │  📊 Admin Suitability: 8.7/10                                        │
│ └─────────┘                                                                       │
│                                                                                   │
│ ┌─ Actions ──────────────────────────────────────────────────────────────────────┐ │
│ │ [💬 Message] [📄 Export PDF] [👥 Assign Reviewer] [📅 Set Interview]        │ │
│ │                                              [✅ Approve] [❌ Reject]        │ │
│ └───────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                   │
│ ┌─ Tabs ─────────────────────────────────────────────────────────────────────────┐ │
│ │ [Admin Assessment] [Profile] [Skills]                                          │ │
│ └───────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                   │
│ Tab 1: Admin Team Assessment (Active)                                            │
│ ┌─ Assessment Overview ──────────────────────────────────────────────────────────┐ │
│ │ Sarah is a naturally gifted communicator with exceptional interpersonal       │ │
│ │ skills and a collaborative mindset. Her background in digital marketing       │ │
│ │ demonstrates strong analytical thinking and creative problem-solving          │ │
│ │ abilities. She shows genuine enthusiasm for growth opportunities and          │ │
│ │ brings a refreshing energy to team environments. Her proactive approach       │ │
│ │ to learning and adaptability make her an excellent candidate for dynamic      │ │
│ │ marketing roles where innovation and relationship-building are key.          │ │
│ └───────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                   │
│ ┌─ Interview Performance ────────────────────────────────────────────────────────┐ │
│ │ 📊 Communication: 9/10      🎯 Problem Solving: 8/10                          │ │
│ │ 🤝 Collaboration: 9/10      💡 Creativity: 8/10                               │ │
│ │                                                                               │ │
│ │ Overall Interview Score: 8.5/10 (Excellent)                                  │ │
│ │ Interviewer: Holly Saunders • Date: Jan 28, 2025                             │ │
│ └───────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                   │
│ ┌─ Important Information ────────────────────────────────────────────────────────┐ │
│ │ 🛂 Visa Status: British Citizen (No visa required)                            │ │
│ │ ♿ Interview Support: None required                                            │ │
│ │ 📅 Start Date: Available immediately                                          │ │
│ │ 💰 Salary Expectation: £26,000 - £30,000                                     │ │
│ │ 🚗 Travel: Happy to travel up to 25% for work                                │ │
│ └───────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                   │
│ ┌─ Admin Controls (Collapsible) ─────────────────────────────────────────────────┐ │
│ │ ▼ Internal Notes & Workflow                                                   │ │
│ │                                                                               │ │
│ │ ┌─ Internal Notes ──────────────────────────────────────────────────────────┐ │ │
│ │ │ [Add private note for admin team...]                                      │ │ │
│ │ │                                                                           │ │ │
│ │ │ Jan 28: Strong candidate, excellent cultural fit - Holly                  │ │ │
│ │ │ Jan 27: Assessment scores very impressive - Marcus                        │ │ │
│ │ └───────────────────────────────────────────────────────────────────────────┘ │ │
│ │                                                                               │ │
│ │ Workflow Status: ⏳ Pending Admin Approval                                    │ │
│ │ Assigned Reviewer: Holly Saunders                                            │ │
│ │ Next Action: Review assessment and approve for employer matching             │ │
│ └───────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                   │
│ [Continue to Profile tab for identical employer view structure...]               │
└───────────────────────────────────────────────────────────────────────────────────┘
```

#### Implementation Specifications:

**Header Layout (Identical to Employer Portal):**
- Profile image: 80px circle, Pollen pink background, white initials (24px Sora font)
- Name: 28px Sora font, pronouns in gray-500 16px
- Location/status icons: 16px lucide-react icons, 14px Poppins text
- Status badge: Same styling as employer portal (green/blue/gray/emerald)
- Admin suitability score: Replaces job match score, same visual treatment

**Action Buttons Row:**
- Button height: 40px, rounded-lg, consistent spacing (gap-3)
- Primary actions: Message (blue-600), Export PDF (gray-600), Assign (pink-600)
- Admin actions: Approve (green-600), Reject (red-600)
- All buttons use lucide-react icons + text

**Tab Structure (Reusing Employer Components):**
- Same TabsList and TabsTrigger styling
- Tab content uses identical CardContent containers
- All text formatting matches employer portal exactly

**Admin Assessment Tab (New):**
- Assessment blurb: Same 100-120 word format as Pollen team insights
- Interview scores: Grid layout, score bars with colors (red/yellow/green)
- Important info: Icon + text pairs, same styling as employer portal
- Admin controls: Collapsible section, internal notes textarea, workflow status

**Additional Admin Features (Non-Disruptive):**
- Interview scoring: Modal overlay, doesn't replace existing content
- Assignment controls: Dropdown in header, integrates with existing layout
- Calendly integration: Button in action row, opens modal for availability setting
- Internal notes: Expandable section within tabs, doesn't disturb main content

## Calendly Integration Specification

### Interview Availability Management
- **Admin Interface:** "Set Interview Availability" button in candidate header
- **Sync Mechanism:** Direct integration with existing Calendly account slots
- **Availability Submission:** Pollen users submit preferred interview times that sync to Calendly
- **Scheduling Flow:** 
  1. Candidate completes assessment → Admin assigns to Pollen reviewer
  2. Assigned reviewer sets availability via Calendly integration
  3. Employer sees available slots when scheduling interviews
  4. Confirmation automatically updates all systems

### Technical Implementation Requirements
- Calendly API integration for slot management
- Real-time availability sync between Pollen platform and Calendly
- Notification system for availability changes
- Calendar integration (Google, Outlook, iCal) via Calendly

## Job Assignment System Specification

### Assignment Workflow
- **Job Selection:** Dropdown showing active review jobs in candidate header
- **Team Member Assignment:** Assign specific Pollen reviewers to candidate evaluations
- **Responsibility Tracking:** Clear assignment status and review progress
- **Workload Distribution:** Balanced assignment across available team members

### Assignment Features
- **Active Jobs Display:** Show jobs requiring candidate review
- **Reviewer Capacity:** Track current assignments per team member
- **Assignment History:** Record of who reviewed which candidates
- **Status Updates:** Real-time progress on assigned reviews
- **Handoff Management:** Transfer assignments between team members

### 2. Employer Management (`/admin/employers`)
Following same card-based layout:

#### Employer Cards
- Company logo/initials
- Company name + industry
- Contact person + email
- Status badge with descriptive copy
- Green CTA for primary action

#### Individual Employer Detail (`/admin/employers/:id`)
- Company profile review
- Job posting history
- Candidate pipeline status
- Payment/subscription status
- Communication thread
- Performance metrics

### 3. Job Approvals (`/admin/jobs`)
Similar structure with job-specific information:

#### Job Cards
- Job title + company
- Department + location
- Posted date + deadline
- Status badge
- CTA for review/approval

### 4. Platform Insights (`/admin/insights`)
Clean analytics dashboard with:
- Key metrics cards (white backgrounds, colored accents)
- Diversity tracking charts
- Performance indicators
- Impact measurements

## System Architecture Breakdown

### High-Level Architecture
The admin portal follows a modular, role-based architecture that extends the existing employer portal foundation:

```
┌─────────────────────────────────────────────────────────────────┐
│                    ADMIN PORTAL ARCHITECTURE                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─ AUTHENTICATION LAYER ──────────────────────────────────────┐ │
│  │ • Role-based access control (admin permissions)             │ │
│  │ • Session management with admin privilege checks            │ │
│  │ • Route protection for /admin/* paths                       │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─ PRESENTATION LAYER ─────────────────────────────────────────┐ │
│  │ React Components (TypeScript)                               │ │
│  │ ├─ Admin Dashboard (4-button layout)                        │ │
│  │ ├─ Candidate Management (grid + detail views)               │ │
│  │ ├─ Employer Management (approval workflows)                 │ │
│  │ ├─ Job Approval System (review + publish)                   │ │
│  │ └─ Analytics Dashboard (insights + reports)                 │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─ BUSINESS LOGIC LAYER ───────────────────────────────────────┐ │
│  │ Custom Hooks & State Management                             │ │
│  │ ├─ useAdminWorkflow (status transitions, approvals)         │ │
│  │ ├─ useAssignmentSystem (reviewer assignments)               │ │
│  │ ├─ useInterviewScoring (assessment workflows)               │ │
│  │ └─ useAdminNotifications (real-time updates)                │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─ DATA ACCESS LAYER ──────────────────────────────────────────┐ │
│  │ API Routes & Database Integration                           │ │
│  │ ├─ Extended Candidate APIs (admin fields + permissions)     │ │
│  │ ├─ Employer Management APIs (approval workflows)            │ │
│  │ ├─ Internal Notes System (private admin data)               │ │
│  │ └─ Analytics APIs (aggregate reporting)                     │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─ DATABASE LAYER ─────────────────────────────────────────────┐ │
│  │ PostgreSQL with Drizzle ORM                                 │ │
│  │ ├─ Existing Tables (candidates, employers, jobs)            │ │
│  │ ├─ New Admin Tables (internal_notes, assignments)           │ │
│  │ ├─ Workflow Tables (approval_history, status_transitions)   │ │
│  │ └─ Analytics Tables (admin_metrics, usage_tracking)         │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow Architecture
```
┌─ USER INTERACTION ─┐    ┌─ COMPONENT LAYER ─┐    ┌─ API LAYER ─┐    ┌─ DATABASE ─┐
│                    │    │                   │    │             │    │            │
│ Admin Dashboard    │───▶│ useAdminCandidates│───▶│ GET /api/   │───▶│ PostgreSQL │
│ Click "Review"     │    │ (TanStack Query)  │    │ candidates  │    │ + Drizzle  │
│                    │    │                   │    │             │    │            │
│ Status Update      │───▶│ useWorkflowUpdate │───▶│ POST /api/  │───▶│ Update     │
│ Approve Candidate  │    │ (Mutation)        │    │ admin/      │    │ Tables     │
│                    │    │                   │    │ approve     │    │            │
│                    │    │                   │    │             │    │            │
│ Real-time Updates  │◀───│ useAdminSocket    │◀───│ WebSocket   │◀───│ Triggers   │
│ Notification Badge │    │ (Live Updates)    │    │ /admin/ws   │    │ & Events   │
└────────────────────┘    └───────────────────┘    └─────────────┘    └────────────┘
```

## Pages Architecture Breakdown

### 1. Main Dashboard (`/admin/dashboard`)
**Purpose**: Comprehensive admin hub with role-specific workflows and personal job management
**Layout**: Job seeker pipeline + employer pipeline + personal assignments + quick actions

```
Page Structure:
├── AdminHeader (navigation, profile, personal notifications)
├── PersonalGreeting (admin name, role context, current workload summary)
├── JobSeekerPipeline (6-card grid with candidate workflow stages)
│   ├── NewApplicationsCard (count + review CTA)
│   ├── ProfilesCompleteCard (approval workflow CTA)
│   ├── ReadyToMatchCard (employer matching CTA)
│   ├── InterviewFeedbackCard (admin review CTA)
│   ├── SkillsAssessmentsCard (scoring workflow CTA)
│   └── FollowUpsCard (candidate communication CTA)
├── EmployerPipeline (6-card grid with employer workflow stages)
│   ├── NewEmployerSignupsCard (approval review CTA)
│   ├── CompanyProfilesCard (verification workflow CTA)
│   ├── PaymentIssuesCard (support resolution CTA)
│   ├── JobPostingsCard (approval workflow CTA)
│   ├── BrandComplianceCard (compliance review CTA)
│   └── PremiumSetupCard (account configuration CTA)
├── PersonalJobAssignments (expandable section with assigned jobs)
│   ├── AssignmentSummary (total jobs, priority breakdown)
│   ├── HighPriorityJobs (urgent items needing attention)
│   ├── MediumPriorityJobs (scheduled tasks)
│   ├── LowPriorityJobs (ongoing maintenance)
│   └── ViewAllToggle (switch between personal and all jobs)
└── QuickActionsBar (platform-level admin tools)

Data Dependencies:
- GET /api/admin/jobseeker-pipeline-stats (candidate workflow counts)
- GET /api/admin/employer-pipeline-stats (employer workflow counts)
- GET /api/admin/personal-assignments/:adminId (assigned jobs with priorities)
- GET /api/admin/job-assignment-summary (workload distribution)
- WebSocket /admin/ws (real-time pipeline updates)

State Management:
- useJobSeekerPipeline() - Candidate workflow statistics
- useEmployerPipeline() - Employer workflow statistics  
- usePersonalAssignments() - Admin's assigned jobs and priorities
- useWorkloadSummary() - Overall assignment distribution
- usePipelineUpdates() - Real-time workflow changes
```

### 2. Candidate Management (`/admin/candidates`)
**Purpose**: Grid view of all candidates with filtering and search
**Layout**: Search/filter bar + responsive card grid + pagination

```
Page Structure:
├── AdminBreadcrumb (navigation path)
├── PageHeader (title, description, primary actions)
├── FilterSection
│   ├── SearchBar (debounced candidate search)
│   ├── StatusFilter (multi-select dropdown)
│   ├── DateRangeFilter (application date range)
│   └── ExportActions (PDF export options)
├── CandidateGrid (responsive 3-column layout)
│   └── AdminCandidateCard[] (profile, status, actions)
└── Pagination (simple prev/next with page info)

Data Dependencies:
- GET /api/admin/candidates (paginated, filtered)
- GET /api/admin/candidate-stats (filter counts)

State Management:
- useAdminCandidates() - Main candidate data
- useFilterState() - Search and filter management
- useBulkActions() - Multi-select operations
```

### 3. Individual Candidate Detail (`/admin/candidates/:id`)
**Purpose**: Comprehensive candidate profile with admin controls
**Layout**: Header + 3-tab structure (identical to employer view) + admin overlays

```
Page Structure:
├── AdminBreadcrumb (back to candidates list)
├── CandidateHeader (reused from employer portal)
│   ├── ProfileImage (initials, colored background)
│   ├── BasicInfo (name, pronouns, location, visa)
│   ├── AdminSuitabilityScore (replaces job match score)
│   └── ActionButtonRow (message, PDF, admin actions)
├── CandidateDetailTabs (reused component structure)
│   ├── AdminAssessmentTab (replaces Pollen insights)
│   │   ├── AssessmentBlurb (100-120 words)
│   │   ├── InterviewScores (if completed)
│   │   └── ImportantInformation (visa, support needs)
│   ├── ProfileTab (identical to employer view)
│   │   ├── BehavioralProfile (DISC, work style)
│   │   ├── PersonalInsights (6 subsections)
│   │   ├── CommunityEngagement (proactivity, achievements)
│   │   ├── KeyStrengths (3 strength cards)
│   │   └── References (if available)
│   └── SkillsTab (identical to employer view)
│       ├── SkillsScoresHeader (overall performance)
│       └── AssessmentSections (expandable submissions)
├── AdminControlsOverlay (collapsible, non-disruptive)
│   ├── InternalNotes (private admin comments)
│   ├── WorkflowStatus (current stage tracking)
│   ├── AssignmentControls (reviewer assignment)
│   └── ApprovalActions (approve/reject with reasons)
└── InterviewScoringModal (overlay for assessment)

Data Dependencies:
- GET /api/candidates/:id (reused employer endpoint)
- GET /api/admin/candidate-workflow/:id (admin-specific data)
- GET /api/admin/internal-notes/:id (private notes)

State Management:
- useCandidateDetail() - Reused from employer portal
- useAdminWorkflow() - Admin-specific actions
- useInternalNotes() - Private comment system
- useInterviewScoring() - Assessment workflows
```

### 4. Employer Management (`/admin/employers`)
**Purpose**: Review and approve employer applications and profiles
**Layout**: Similar to candidate grid with employer-specific data

```
Page Structure:
├── AdminBreadcrumb (navigation)
├── PageHeader (employer management title and actions)
├── EmployerFilterSection
│   ├── SearchBar (company name, contact person)
│   ├── StatusFilter (new, pending, approved, premium)
│   ├── IndustryFilter (sector-based filtering)
│   └── SubscriptionFilter (free, paid, enterprise)
├── EmployerGrid (2-column desktop, 1-column mobile)
│   └── EmployerCard[] (logo, company info, status, actions)
└── Pagination (standard navigation)

Individual Employer Detail (/admin/employers/:id):
├── EmployerHeader (company logo, name, industry, status)
├── EmployerDetailTabs
│   ├── CompanyProfileTab (business info, team, culture)
│   ├── JobHistoryTab (posted jobs, candidate metrics)
│   ├── PaymentTab (subscription, billing, usage)
│   └── CommunicationTab (message history, notes)
└── EmployerControlsOverlay (approval, suspension, support)

Data Dependencies:
- GET /api/admin/employers (employer list with admin fields)
- GET /api/admin/employer-detail/:id (complete profile)
- GET /api/admin/employer-metrics/:id (performance data)

State Management:
- useAdminEmployers() - Employer listing and filters
- useEmployerWorkflow() - Approval processes
- useEmployerMetrics() - Performance tracking
```

### 5. Job Approval System (`/admin/jobs`)
**Purpose**: Review and approve job postings before publication
**Layout**: Job cards with approval workflow and content review

```
Page Structure:
├── AdminBreadcrumb (navigation)
├── PageHeader (job approvals overview)
├── JobFilterSection
│   ├── SearchBar (job title, company)
│   ├── StatusFilter (new, review, approved, published)
│   ├── DepartmentFilter (marketing, tech, design)
│   └── DateFilter (submission date range)
├── JobGrid (job posting cards with review status)
│   └── JobApprovalCard[] (title, company, status, actions)
└── Pagination (standard navigation)

Individual Job Review (/admin/jobs/:id):
├── JobHeader (title, company, department, posted date)
├── JobReviewTabs
│   ├── JobDetailsTab (description, requirements, benefits)
│   ├── BrandComplianceTab (language review, requirements check)
│   ├── IdealPersonaTab (behavioral requirements, skills focus)
│   └── PublishingTab (SEO settings, visibility controls)
├── ComplianceChecklist (automated and manual checks)
├── ReviewerNotes (internal feedback and concerns)
└── ApprovalActions (approve, request changes, reject)

Data Dependencies:
- GET /api/admin/job-postings (jobs awaiting approval)
- GET /api/admin/job-detail/:id (complete job posting)
- GET /api/admin/brand-compliance/:id (compliance checks)

State Management:
- useJobApprovals() - Job listing and review workflow
- useBrandCompliance() - Automated compliance checking
- useJobWorkflow() - Approval processes and feedback
```

### 6. Platform Insights (`/admin/insights`)
**Purpose**: Analytics dashboard for platform performance and user metrics
**Layout**: Metrics cards + charts + detailed reporting

```
Page Structure:
├── AdminBreadcrumb (navigation)
├── InsightsHeader (analytics overview, date range selector)
├── MetricsOverview (key performance indicators)
│   ├── CandidateMetrics (applications, approvals, matches)
│   ├── EmployerMetrics (registrations, active jobs, hires)
│   ├── PlatformMetrics (engagement, completion rates)
│   └── QualityMetrics (assessment scores, feedback ratings)
├── ChartsSection (visual data representation)
│   ├── CandidateFlowChart (pipeline progression)
│   ├── EmployerEngagementChart (usage patterns)
│   ├── MatchingEfficiencyChart (success rates)
│   └── DiversityTrackingChart (demographic analytics)
├── DetailedReports (exportable data tables)
│   ├── CandidatePerformanceReport (assessment analytics)
│   ├── EmployerSatisfactionReport (feedback analysis)
│   ├── PlatformUsageReport (engagement metrics)
│   └── ImpactMeasurementReport (outcomes tracking)
└── ExportControls (PDF, CSV, scheduled reports)

Data Dependencies:
- GET /api/admin/metrics (real-time platform statistics)
- GET /api/admin/analytics/:metric (detailed metric data)
- GET /api/admin/reports (exportable report data)

State Management:
- usePlatformMetrics() - Real-time statistics
- useAnalyticsData() - Chart and report data
- useReportExport() - Export functionality
```

## Routing Architecture

### Route Structure & Navigation Flow
```
/admin/
├── dashboard                           (Main admin hub)
├── candidates/                         (Candidate management)
│   ├── ""                             (Grid view with filters)
│   ├── ":id"                          (Individual candidate detail)
│   ├── ":id/interview"                (Interview scoring overlay)
│   └── ":id/notes"                    (Internal notes management)
├── employers/                          (Employer management)
│   ├── ""                             (Employer grid view)
│   ├── ":id"                          (Individual employer detail)
│   ├── ":id/jobs"                     (Employer's job history)
│   └── ":id/metrics"                  (Performance analytics)
├── jobs/                              (Job approval system)
│   ├── ""                             (Job postings grid)
│   ├── ":id"                          (Individual job review)
│   ├── ":id/compliance"               (Brand compliance check)
│   └── ":id/publish"                  (Publishing workflow)
├── insights/                          (Analytics dashboard)
│   ├── ""                             (Main insights overview)
│   ├── candidates                     (Candidate analytics)
│   ├── employers                      (Employer analytics)
│   ├── platform                       (Platform performance)
│   └── reports                        (Detailed reporting)
├── settings/                          (Admin configuration)
│   ├── users                          (Admin user management)
│   ├── permissions                    (Role management)
│   └── system                         (Platform settings)
└── notifications                      (Notification center)
```

### Route Protection & Permissions
```typescript
// Route protection implementation
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return <LoadingSpinner />;
  
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

// Admin App routing structure
export default function AdminApp() {
  return (
    <Router>
      <AdminRoute>
        <AdminLayout>
          <Route path="/admin/dashboard" component={AdminDashboard} />
          <Route path="/admin/candidates" component={AdminCandidates} />
          <Route path="/admin/candidates/:id" component={AdminCandidateDetail} />
          <Route path="/admin/employers" component={AdminEmployers} />
          <Route path="/admin/jobs" component={AdminJobs} />
          <Route path="/admin/insights" component={AdminInsights} />
        </AdminLayout>
      </AdminRoute>
    </Router>
  );
}
```

## State Management Architecture

### Global State Structure
```typescript
// Admin-specific state management using TanStack Query

// 1. Dashboard State
const useDashboardStats = () => useQuery({
  queryKey: ['admin', 'dashboard-stats'],
  queryFn: () => fetch('/api/admin/dashboard-stats').then(res => res.json()),
  refetchInterval: 30000, // Real-time updates every 30 seconds
});

// 2. Candidate Management State
const useAdminCandidates = (filters: CandidateFilters) => useQuery({
  queryKey: ['admin', 'candidates', filters],
  queryFn: () => fetchAdminCandidates(filters),
  keepPreviousData: true, // Smooth filtering experience
});

// 3. Workflow Management State
const useAdminWorkflow = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateCandidateStatus,
    onSuccess: () => {
      // Invalidate related queries for real-time updates
      queryClient.invalidateQueries(['admin', 'candidates']);
      queryClient.invalidateQueries(['admin', 'dashboard-stats']);
    },
  });
};

// 4. Real-time Notifications State
const useAdminNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  useEffect(() => {
    const socket = new WebSocket('/admin/ws');
    
    socket.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      setNotifications(prev => [notification, ...prev.slice(0, 9)]);
    };
    
    return () => socket.close();
  }, []);
  
  return { notifications, clearNotifications: () => setNotifications([]) };
};
```

### Local State Patterns
```typescript
// Filter management for candidate/employer grids
const useFilterState = <T>(initialFilters: T) => {
  const [filters, setFilters] = useState<T>(initialFilters);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch] = useDebounce(searchQuery, 300);
  
  const updateFilter = (key: keyof T, value: T[keyof T]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  const resetFilters = () => {
    setFilters(initialFilters);
    setSearchQuery('');
  };
  
  return {
    filters: { ...filters, search: debouncedSearch },
    searchQuery,
    setSearchQuery,
    updateFilter,
    resetFilters,
  };
};

// Bulk operations for candidate/employer management
const useBulkActions = <T extends { id: string }>() => {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isAllSelected, setIsAllSelected] = useState(false);
  
  const toggleSelection = (id: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };
  
  const selectAll = (items: T[]) => {
    if (isAllSelected) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(items.map(item => item.id)));
    }
    setIsAllSelected(!isAllSelected);
  };
  
  const clearSelection = () => {
    setSelectedItems(new Set());
    setIsAllSelected(false);
  };
  
  return {
    selectedItems: Array.from(selectedItems),
    selectedCount: selectedItems.size,
    isAllSelected,
    toggleSelection,
    selectAll,
    clearSelection,
  };
};
```

## Technical Implementation

### Component Architecture & File Structure

```
client/src/
├── pages/admin/
│   ├── admin-dashboard.tsx              (Main dashboard with 4-button layout)
│   ├── admin-candidates.tsx             (Candidate grid view)
│   ├── admin-candidate-detail.tsx       (Individual candidate profile)
│   ├── admin-employers.tsx              (Employer management)
│   ├── admin-jobs.tsx                   (Job approval workflow)
│   └── admin-insights.tsx               (Analytics dashboard)
├── components/admin/
│   ├── admin-candidate-card.tsx         (Reuses employer candidate card styling)
│   ├── admin-header.tsx                 (Navigation with admin-specific features)
│   ├── admin-status-badge.tsx           (Consistent status indicators)
│   ├── admin-action-buttons.tsx         (Approve/reject/assign controls)
│   ├── interview-scoring-modal.tsx      (Overlay for interview assessment)
│   ├── assignment-dropdown.tsx          (Job assignment interface)
│   └── internal-notes-section.tsx       (Collapsible admin notes)
└── hooks/admin/
    ├── use-admin-candidates.tsx         (Admin candidate data management)
    ├── use-assignment-system.tsx        (Job assignment logic)
    └── use-admin-workflow.tsx           (Status transitions and approvals)
```

### API Endpoint Strategy

**Reuse Existing Endpoints Where Possible:**
```typescript
// Reuse employer endpoints with admin permissions
GET /api/candidates/:id          // Same data structure as employer view
GET /api/all-candidates          // Extended with admin fields
GET /api/employer-profiles       // For employer management
GET /api/job-postings           // For job approval workflow

// Core admin dashboard endpoints
GET /api/admin/approval-stats              // Approval workflow counts
GET /api/admin/personal-assignments/:id    // Admin's assigned jobs
GET /api/admin/employer-status-tracking    // Employer pipeline status

// Employer management endpoints  
POST /api/admin/approve-employer           // Approve new employer applications
POST /api/admin/approve-employer-profile   // Approve completed employer profiles
POST /api/admin/approve-job-posting        // Approve job posts (brand compliance)
POST /api/admin/approve-employer-review    // Approve candidate reviews of employers

// Job-specific admin assignment endpoints
GET /api/admin/job-applicants-grid/:jobId  // Grid view of all applicants for comparison
POST /api/admin/review-ai-scores           // Review and edit AI-generated candidate scores
POST /api/admin/progress-to-interview      // Move candidates to Pollen interview stage
POST /api/admin/submit-interview-scores    // Submit standardized Pollen interview scores
POST /api/admin/approve-ai-feedback        // Review/edit AI feedback for unsuccessful candidates
POST /api/admin/approve-employer-summary   // Review/edit AI candidate summary for employer

// Communication and support
POST /api/admin/send-message              // Message employers or candidates
GET /api/admin/employer-status/:id        // Track employer status (profile, payment, jobs, offers)
```

### Candidate Data Structure Consistency
**CRITICAL: Admin portal must use identical data structure to `/candidates/23`**

**Component Reuse Strategy:**
```typescript
// admin-candidate-detail.tsx
import { CandidateDetailTabs } from '@/components/candidate-detail-tabs';
import { CandidateHeader } from '@/components/candidate-header';
import { CandidateProfile } from '@/components/candidate-profile';

// Wrap existing components with admin-specific features
export default function AdminCandidateDetail() {
  const candidateData = useCandidateDetail(candidateId); // Same hook as employer view
  
  return (
    <div className="admin-candidate-detail">
      <AdminBreadcrumb />
      
      {/* Reuse exact header component with admin additions */}
      <CandidateHeader 
        candidate={candidateData}
        showAdminActions={true}
        adminScore={candidateData.adminSuitability}
      />
      
      {/* Reuse exact tab structure */}
      <CandidateDetailTabs
        candidate={candidateData}
        tabOverrides={{
          'pollen-insights': <AdminAssessmentTab candidate={candidateData} />,
          'profile': <CandidateProfile candidate={candidateData} />, // Identical
          'skills': <CandidateSkills candidate={candidateData} />    // Identical
        }}
      />
      
      {/* Admin-only features as overlays */}
      <AdminControlsOverlay candidate={candidateData} />
    </div>
  );
}
```

**Data Interface Extensions:**
```typescript
interface AdminCandidateDetail extends CandidateDetail {
  // Extends existing interface without breaking employer view
  adminSuitability: number;
  internalNotes: InternalNote[];
  assignedReviewer?: string;
  workflowStatus: AdminWorkflowStatus;
  interviewScores?: InterviewScorecard;
  approvalHistory: ApprovalAction[];
}

interface InternalNote {
  id: string;
  content: string;
  author: string;
  timestamp: Date;
  private: boolean;
}

interface AdminApprovalStats {
  employerApplications: number;     // New companies to approve
  profileSetups: number;           // Employer profiles completed, need approval
  jobPostings: number;             // Job posts awaiting approval
  employerReviews: number;         // Candidate reviews of employers pending
  aiScoreReviews: number;          // AI-generated candidate scores to review/edit
  aiFeedback: number;              // AI-generated feedback needing approval
}

interface PersonalJobAssignment {
  id: string;
  jobTitle: string;
  companyName: string;
  priority: 'high' | 'medium' | 'low';
  status: 'new' | 'in_progress' | 'complete' | 'matched';
  candidateCount: number;
  interviewsScheduled: number;
  feedbackPending: number;
  nextAction: string;
  dueDate: Date;
  actionButtons: AssignmentAction[];
}

interface AssignmentAction {
  label: string;
  type: 'primary' | 'secondary';
  color: 'green' | 'blue' | 'orange' | 'gray';
  route: string;
}

interface PollenInterviewScoring {
  candidateId: string;
  jobId: string;
  interviewDate: Date;
  confidence: 1 | 2 | 3 | 4 | 5;                    // How confident did candidate seem?
  companyResearch: 1 | 2 | 3 | 4 | 5;             // Research about the company
  questionQuality: 1 | 2 | 3 | 4 | 5;             // Quality of questions asked
  overallImpression: 1 | 2 | 3 | 4 | 5;           // General interview performance
  notes: string;                                    // Detailed admin notes
  recommendation: 'progress_to_employer' | 'send_feedback' | 'fast_track';
  adminId: string;
  submittedAt: Date;
}

interface AIContentReview {
  id: string;
  type: 'candidate_scores' | 'feedback_message' | 'employer_summary';
  originalContent: string;
  editedContent?: string;
  status: 'pending' | 'approved' | 'edited_approved';
  candidateId: string;
  jobId: string;
  adminId: string;
  reviewedAt?: Date;
}
```

### Styling Consistency Implementation

**CSS Variable Reuse:**
```css
/* Extend existing employer portal variables */
:root {
  /* Existing employer variables remain unchanged */
  --admin-suitability-color: #10b981; /* green-500 */
  --admin-pending-color: #f59e0b;     /* amber-500 */
  --admin-approved-color: #059669;    /* emerald-600 */
}

/* Admin-specific component overrides */
.admin-candidate-detail {
  /* All styling inherits from employer portal */
  @apply max-w-6xl mx-auto p-6 space-y-6;
}

.admin-controls-overlay {
  /* Non-disruptive positioning */
  @apply absolute top-4 right-4 bg-white shadow-lg rounded-lg p-4;
}
```

**Component Class Mapping:**
```typescript
// Reuse existing className patterns
const statusBadgeClasses = {
  new: 'bg-green-100 text-green-800',           // Same as employer
  in_progress: 'bg-blue-100 text-blue-800',     // Same as employer  
  complete: 'bg-gray-100 text-gray-800',        // Same as employer
  matched: 'bg-emerald-100 text-emerald-800'    // New admin status
};

const actionButtonClasses = {
  approve: 'bg-green-600 hover:bg-green-700 text-white',
  reject: 'bg-red-600 hover:bg-red-700 text-white',
  assign: 'bg-pink-600 hover:bg-pink-700 text-white',  // Pollen brand
  message: 'bg-blue-600 hover:bg-blue-700 text-white'  // Same as employer
};
```

### Consistent Component Library
Reuse existing employer portal components:
- Same card layouts (`CardContent`, `CardHeader`)
- Identical status badge styling
- Consistent button variants and colors
- Unified form components and validation

### API Structure
Following employer API patterns:
- `/api/admin/candidates` (mirrors `/api/all-candidates`)
- `/api/admin/employers` 
- `/api/admin/jobs`
- `/api/admin/insights`

### Status Management
Implement same status determination logic:
```javascript
const getAdminActionInfo = (item, type) => {
  // Similar to getCandidateActionInfo in employer view
  // Return status badge, description, and CTA configuration
}
```

## Action-Oriented Workflows

### Candidate Review Process
1. **Grid View Comparison** - Side-by-side candidate cards for batch review
2. **Individual Deep Dive** - Full profile view with scoring interface  
3. **Interview Management** - Scheduling and scoring standardized interview
4. **Approval Workflow** - Generate summary and approve for employer matching

### Quality Control Interface
Following employer's clean design:
- AI score review with simple approve/edit options
- Feedback generation with preview and editing
- Bulk approval actions with confirmation dialogs
- Clear progress indicators

## Notification System
Adopting employer portal's notification badge system:
- Header notifications for pending actions
- Real-time updates for workflow changes
- Email automation triggers
- Dashboard alert cards for urgent items

## Advanced Features

### Candidate History Tracking
Extended version of candidate detail view:
- Timeline of all platform interactions
- Interview history across multiple applications  
- Progression tracking with visual pipeline
- Fast-track identification system

### Super User Functions
Clean interface for elevated permissions:
- Employer impersonation (with clear indicator)
- Admin user management
- Platform configuration panels
- Audit log viewing

## Implementation Priority & Detailed Timeline

### Phase 1: Core Dashboard & Candidate Review (Days 1-3)
**Day 1: Dashboard Foundation**
- Create `admin-dashboard.tsx` with 4-button layout ASCII design
- Implement `AdminHeader` component with navigation and notifications  
- Build activity feed with real-time updates
- Set up admin routing structure (`/admin/*` routes)

**Day 2: Candidate Grid View**
- Build `admin-candidates.tsx` with exact card layout from ASCII design
- Implement search, filtering, and pagination as specified
- Create `AdminCandidateCard` component reusing employer card styling
- Add status badges and action buttons with proper color schemes

**Day 3: Individual Candidate Detail**
- Copy exact structure from `/candidates/23` employer view
- Create `AdminAssessmentTab` replacing Pollen insights tab
- Implement admin controls overlay with notes and workflow status
- Add interview scoring modal and assignment dropdowns

### Phase 2: Workflow & Management (Days 4-5)
**Day 4: Admin-Specific Features**
- Build assignment system with job reviewer mapping
- Implement Calendly integration for interview availability
- Create internal notes system with private admin comments
- Add approval workflow with status transitions

**Day 5: Employer & Job Management**  
- Build employer management interface with same card patterns
- Create job approval workflow matching candidate review structure
- Implement notification system with badge counts
- Add communication tools integrated with existing messaging

### Phase 3: Integration & Polish (Days 6-7)
**Day 6: Data Integration**
- Ensure API endpoints reuse employer data structures exactly
- Implement admin permission layers and access controls
- Connect real candidate data to admin interfaces
- Test component reusability and styling consistency

**Day 7: Testing & Refinement**
- User acceptance testing with admin team
- Performance optimization and mobile responsiveness
- Final styling adjustments to match employer portal exactly
- Documentation and deployment preparation

### Component Implementation Checklist

**Admin Dashboard (`admin-dashboard.tsx`):**
```typescript
// Required components and exact specifications
- Header: Clean navigation, profile dropdown, notification badges
- 4-Button Grid: 300px x 120px each, icons + counts, hover effects
- Activity Feed: Last 10 actions, real-time updates, action buttons
- Recent Activity Cards: White background, subtle borders, clear CTAs
- Responsive: 2x2 grid desktop, 2x1 tablet, 1x1 mobile
```

**Candidate Grid (`admin-candidates.tsx`):**
```typescript
// Required components matching ASCII layout exactly
- Search Bar: 400px width, debounced (300ms), lucide search icon
- Status Filter: Multi-select dropdown, badge counts, clear selections
- Card Grid: CSS Grid 3 columns desktop, gap-6, auto-fit minmax(300px, 1fr)
- Candidate Cards: Profile image (48px), status badges, description text (14px)
- Pagination: Simple prev/next, 18 items per page, page indicator
```

**Candidate Detail (`admin-candidate-detail.tsx`):**
```typescript
// Exact reuse of employer components with admin extensions
- Header: Identical to employer with admin suitability score
- Tabs: Same TabsList styling, admin assessment tab replaces Pollen insights
- Profile/Skills: Identical components, no modifications needed
- Admin Controls: Collapsible overlay, non-disruptive to main content
- Action Buttons: Row of buttons, consistent spacing, proper colors
```

## Design Consistency Checklist

✅ **Color Scheme**: Pollen pink (#E2007A) for primary actions, consistent grays and whites  
✅ **Typography**: Sora for headings/buttons, Poppins for body text  
✅ **Status System**: 4-status framework with green/blue/gray/emerald indicators  
✅ **Card Layout**: White backgrounds, subtle borders, hover effects  
✅ **CTA Buttons**: Green primary buttons with action-oriented text  
✅ **Navigation**: Clean breadcrumbs and back buttons  
✅ **Responsive Design**: Mobile-friendly grid layouts  
✅ **Loading States**: Skeleton screens matching employer portal  

## Success Metrics

- **Operational Efficiency**: 60% reduction in admin processing time
- **User Experience**: 4.8+ admin satisfaction rating
- **Quality Consistency**: 95% scoring calibration across admin users
- **Process Speed**: 50% faster candidate-to-employer pipeline
- **Error Reduction**: 80% fewer manual processing errors

This updated plan ensures the admin portal maintains the clean, intuitive design patterns that made the employer demo successful while providing the comprehensive functionality needed for platform management.