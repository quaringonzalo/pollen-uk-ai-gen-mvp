# Simplified Candidate Status Workflow

## Overview
Clean, intuitive status workflow where the feedback page handles branching decisions, and the main status system remains simple and clear.

## Core Status Flow

### Main Pipeline Statuses
1. **new_application**
   - Badge: "New Application" (Green)
   - Action: "Schedule Interview" (Pink)
   - Description: Fresh application, needs interview scheduling

2. **interview_scheduled**
   - Badge: "Interview Scheduled" (Blue) 
   - Action: "View Interview Details" (Blue)
   - Description: Interview booked, can view/edit details

3. **interview_completed**
   - Badge: "Interview Complete" (Orange)
   - Action: "Provide Update" (Orange)
   - Description: Interview done, needs update and decision

4. **in_progress**
   - Badge: "In Progress" (Yellow)
   - Action: "Check Progress" (Yellow)
   - Description: Further interview requested, awaiting candidate response

5. **complete**
   - Badge: "Complete" (Red)
   - Action: "Send Message" (Gray)
   - Description: Process complete, not progressing with candidate

6. **job_offered**
   - Badge: "Job Offered" (Green)
   - Action: "Monitor Offer" (Green)
   - Description: Job offer sent, waiting for response

7. **hired**
   - Badge: "Hired" (Emerald)
   - Action: "Send Message" (Emerald)
   - Description: Candidate hired, can send congratulations/updates

## Feedback Page Decision Logic

When employers click "Provide Update" on interview_completed candidates, they choose:

### Option 1: Not Proceeding
- **Feedback required**: Employer provides reasons/feedback
- **Notification sent**: Candidate receives feedback
- **Result status**: `complete` (red badge to indicate not progressing)

### Option 2: Request Further Interview  
- **Availability required**: Employer provides interview slots
- **Request sent**: Candidate receives interview request
- **Result status**: `in_progress` (awaiting candidate response)
- **If accepted**: Back to `interview_scheduled`
- **If declined**: `complete`

### Option 3: Offer Job
- **Offer details**: Employer creates offer with message
- **Offer sent**: Candidate receives job offer
- **Result status**: `job_offered`
- **If accepted**: `hired` (captures successful hiring data)
- **If declined**: `complete`

## Benefits of Simplified System

1. **Clean Status List**: Only 7 core statuses covering all active states
2. **Intuitive Labels**: Status names make immediate sense
3. **Feedback-Driven Branching**: Complex decisions handled in feedback interface
4. **Clear Actions**: Each status has obvious next step
5. **Simple Filtering**: Employers can easily filter by meaningful statuses
6. **Natural End States**: "Complete" and "Hired" are clear final outcomes

The complexity lives in the feedback interface where decisions are made, not in the status system where visibility is key. Old records can be handled through date-based filtering rather than adding archival complexity.