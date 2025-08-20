# Community Points System Documentation

**Last Updated: June 30, 2025**  
**Status: IMPLEMENTED - Active in job matching algorithm (10% weighting)**

## Overview

Pollen's Community Points System rewards genuine platform engagement and learning commitment through a comprehensive points-based framework. Points contribute to a user's **Proactivity Score** (0-10 scale), which accounts for 10% of job matching algorithm weighting alongside 60% skills and 30% behavioral fit.

## Point Categories & Values

### 1. Community Participation
**Purpose**: Reward helpful community engagement and knowledge sharing

| Activity | Points | Quality Requirements |
|----------|--------|---------------------|
| Asking thoughtful questions | 5-10 | Must show research effort, clear context |
| Providing helpful answers | 5-20 | Based on peer voting and usefulness |
| Forum discussions | 5-15 | Constructive participation, not spam |
| Sharing career insights | 10-25 | Original content, valuable to community |
| Event introductions | 5 | Active participation in networking events |
| Resource sharing | 10-20 | Relevant, high-quality resources |
| **Seeking mentorship** | 15-25 | Structured request with specific goals and learning plan |

### 2. Learning & Development
**Purpose**: Encourage continuous skill development and platform engagement

| Activity | Points | Description |
|----------|--------|-------------|
| Workshop attendance | 30-50 | Live participation in career workshops |
| Masterclass completion | 50-100 | Completion of full masterclass series |
| Bootcamp participation | 100-200 | Active engagement in intensive programs |
| Webinar attendance | 20-30 | Educational session participation |
| Career coaching sessions | 40-60 | One-on-one development sessions |

### 3. Job Application Activity
**Purpose**: Reward quality application efforts and learning from feedback

| Activity | Points | Conditions |
|----------|--------|------------|
| Job application submission | 25-50 | Complete application with bespoke challenge |
| Receiving employer feedback | 25-50 | Professional feedback on application |
| Interview completion | 50-75 | Completing first-stage interviews |
| Application improvement | 15-25 | Acting on feedback for future applications |

### 4. Platform Milestones
**Purpose**: Recognize profile completion and platform commitment

| Activity | Points | One-time Awards |
|----------|--------|-----------------|
| Behavioral assessment completion | 100 | Enhanced DISC profiling |
| Profile completion (all checkpoints) | 50 | Complete career profile |
| First application milestone | 25 | Platform engagement commitment |
| 30-day active user | 30 | Sustained platform usage |
| 90-day active user | 75 | Long-term commitment |

## Quality Control Framework

### Automated Pre-filters
- Minimum character requirements for contributions
- Spam detection and duplicate content filtering
- Time-based posting limits to prevent gaming

### Community Validation
- Peer voting system for answer quality (upvotes/downvotes)
- Community flagging for inappropriate content
- Mentor validation for high-value contributions

### Admin Oversight
- Manual review of flagged content
- Quality score assignment (1-5 scale)
- Point adjustment for exceptional contributions

## Proactivity Score Calculation

### Algorithm Components
```
Proactivity Score = (Community Engagement + Learning Commitment + Quality Contributions) / 3

Where each component is scored 0-10:
- Community Engagement: Forum activity, questions, answers, discussions
- Learning Commitment: Workshop attendance, skill development, platform usage
- Quality Contributions: Peer-validated helpful content, resource sharing
```

### Newcomer Protection
- Users under 30 days: **6.0 baseline score** (above average)
- Prevents unfair disadvantage in job matching for new users
- Allows time to build genuine community engagement

### Score Ranges
- **8.0-10.0**: Highly Proactive (Top 20% of users)
- **6.5-7.9**: Above Average (Next 30% of users)
- **5.0-6.4**: Average (Middle 30% of users)
- **3.0-4.9**: Below Average (Next 15% of users)
- **0.0-2.9**: Inactive (Bottom 5% of users)



## Integration with Job Matching

### Weighting in Algorithm
- **60% Skills Compatibility**: Verified through bespoke challenges
- **30% Behavioral Fit**: Enhanced DISC profiling alignment
- **10% Proactivity Score**: Community engagement and learning commitment (includes mentorship activities)

### Impact on Candidate Ranking
- Higher proactivity scores boost candidate visibility
- Demonstrates genuine platform engagement to employers
- Rewards users who contribute to community ecosystem
- Balances technical skills with soft skills demonstration

### How Mentorship Seeking Affects Algorithm
**Mentorship Seeking** (15-25 points):
- Shows proactive learning attitude and self-awareness
- Demonstrates growth mindset - key trait for entry-level roles
- Indicates coachability and willingness to learn from others
- Must include structured request with specific goals and learning plan
- Signals to employers: strong potential for development and team collaboration

## Example Point Calculations

### Demo Profile Breakdown (635 Total Points)
```
Behavioral Assessment Completion: 100 points
Job Applications (2 × 87.5 avg): 175 points
Workshop Attendance (8 × 30 avg): 240 points
Community Help (24 × 5 avg): 120 points
Total: 635 points → Proactivity Score: 8.2/10
```

### Monthly Active User Example
```
Weekly workshop: 40 points × 4 = 160 points
Forum contributions: 10 points × 8 = 80 points
Job applications: 75 points × 2 = 150 points
Helping others: 15 points × 6 = 90 points
Monthly Total: 480 points → Strong engagement
```

## Anti-Gaming Measures

### Prevention Strategies
- Quality-based scoring over quantity
- Peer validation requirements
- Time-distributed activities (can't earn all points in one day)
- Diminishing returns for repetitive activities
- Manual review of suspicious patterns

### Penalty System
- Point deduction for spam or low-quality content
- Temporary restrictions for gaming attempts
- Account warnings for repeated violations
- Community reporting of inappropriate behavior

## Future Enhancements

### Planned Features
- Seasonal point multipliers during peak hiring periods
- Special recognition badges for high contributors
- Mentorship program integration with bonus points
- Company-sponsored community challenges
- Advanced analytics for engagement optimization

### Success Metrics
- 80% of active users maintain 6.0+ proactivity scores
- Average community contribution quality score above 3.5/5
- 60% of job applications include candidates with 7.0+ proactivity
- Reduced platform churn through engagement rewards

## Technical Implementation

### Database Schema
- `community_activities` table tracks all point-earning activities
- `user_engagement_metrics` stores calculated scores and statistics
- `quality_validations` manages peer voting and validation
- Real-time proactivity score updates on user actions

### API Endpoints
- `/api/community/award-points` - Award points for activities
- `/api/community/engagement-summary` - User engagement dashboard
- `/api/community/leaderboard` - Community participation rankings
- `/api/community/quality-vote` - Peer validation system

## Support & Guidelines

### User Education
- Clear explanation of point values in help documentation
- Regular communication about scoring updates
- Community guidelines for quality contributions
- Examples of high-value activities and contributions

### Community Standards
- Respectful, professional communication required
- Genuine help and knowledge sharing encouraged
- No spam, self-promotion, or low-effort content
- Focus on career development and mutual support

---

*Last Updated: June 30, 2025*
*Version: 1.0*