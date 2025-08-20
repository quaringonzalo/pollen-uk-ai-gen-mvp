# Job Matching and Filtering System - AUTHORITATIVE DOCUMENTATION

## Core Principle: NO ACADEMIC OR EXPERIENCE SCREENING
**CRITICAL**: This platform does NOT screen candidates by academic background or experience. We are explicitly values/behavior-first.

## Two-Stage System

### Stage 1: Practical Requirements Filter (Job Seeker View)
**Purpose**: Job seekers only see jobs they can practically do
**Criteria** (must pass ALL to see the job):
1. **Visa/Work Authorization**: Can legally work in required location
2. **Location Compatibility**: Can work from required location (remote/hybrid/office)
3. **Job Type Alignment**: Matches permanent/temporary/contract preference
4. **Employment Type**: Matches full-time/part-time preference  
5. **Salary Range Compatibility**: Job salary range overlaps with their requirements
6. **Driving License**: If required for role, candidate must have it

**What this means**: If a candidate doesn't meet these basic practical requirements, they never see the job listing at all.

### Stage 2: Employer Scoring (After Application)
**Purpose**: How candidates are ranked for employers who review applications
**Weighting**:
- **60% Skills**: From bespoke assessment completion and quality
- **30% Behavioral**: From DISC behavioral assessment alignment with role requirements
- **10% Proactivity**: From community engagement and learning activities

**What this means**: All candidates who apply have already passed the practical filter. Employers see them ranked by this 60/30/10 split.

## Personalization vs Screening

### Job Recommendations (What Job Seekers See)
- **Personalization**: Behavioral compatibility and interests influence which jobs are shown first
- **NOT Screening**: All practically compatible jobs are still browsable
- **Purpose**: Help candidates find roles they'd enjoy, not exclude them from opportunities

### Key Distinction
- **Filter**: Excludes jobs completely (practical requirements only)
- **Personalization**: Reorders jobs for better recommendations (behavioral/interests)
- **Scoring**: Ranks candidates for employers (skills + behavioral + proactivity)

## Technical Implementation Notes
- Stage 1 filtering happens in job discovery (frontend job lists)
- Stage 2 scoring happens in compatibility-scoring.ts (employer application review)
- No "skills potential" calculations - we don't predict ability from background
- Behavioral matching is for fit assessment, not capability screening

## Last Updated: July 1, 2025 - 2:30 PM GMT
**Status: CURRENT - Use this as authoritative reference**