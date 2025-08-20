# Data Categorization Plan for Remaining Fields

## Fields to Categorize

The following fields need to be properly categorized across the checkpoint system:

- Favourite subjects
- Industries interested in  
- Role types interested in
- Location preference
- Employment type preference (full-time, part-time, etc.)
- Size of company preference
- Timeframe (when they want to start)
- How they heard about us
- Reasonable adjustments

## Proposed Categorization

### Checkpoint 3: Education & Experience Background (Profile-Relevant)
**Profile Impact**: These feed into personal insights section
- **Favourite subjects** → Shows academic interests and learning preferences
- **Role types interested in** → Career direction and aspirations

### Checkpoint 4: Job Search Configuration (Platform Preferences)
**Platform Settings**: Configure job matching algorithm
- **Industries interested in** → Job matching filters
- **Location preference** → Job matching filters
- **Employment type preference** → Job matching filters (full-time, part-time, contract)
- **Size of company preference** → Job matching filters (startup, SME, corporate)
- **Timeframe** → When they want to start looking/working

### Checkpoint 5: Platform Experience (Internal Data)
**Analytics & Improvement**: Not visible to employers
- **How they heard about us** → Marketing attribution
- **Reasonable adjustments** → Accessibility and inclusion support

## Rationale

### Profile-Relevant (Employer Visible)
- **Favourite subjects**: Shows intellectual curiosity and learning style
- **Role types interested in**: Demonstrates career direction and self-awareness

### Job Matching Configuration
- **Industries, Location, Employment Type, Company Size**: Core matching criteria
- **Timeframe**: Important for employer timing but not part of personality profile

### Platform Internal
- **Referral source**: Marketing data, not relevant to job matching
- **Reasonable adjustments**: Important for accessibility but separate from core profile

## Implementation Notes

### Education & Experience Checkpoint
```typescript
{
  id: 'favouriteSubjects',
  label: 'What were your favourite subjects at school/college?',
  helpText: 'This shows your natural interests and learning preferences to employers.'
}

{
  id: 'roleTypesInterested',
  label: 'What types of roles interest you most?',
  helpText: 'This helps employers understand your career direction and aspirations.'
}
```

### Job Search Configuration Checkpoint
- Multi-select dropdowns for industries
- Location input with suggestions
- Radio buttons for employment type
- Company size slider/selection
- Date picker for start timeframe

### Platform Experience Checkpoint
- Dropdown for referral source
- Optional text area for reasonable adjustments
- Keep this lightweight and optional

## Benefits of This Structure

1. **Clear Purpose**: Each field has a clear reason for being in that checkpoint
2. **Profile Coherence**: Employer-visible data stays together
3. **Matching Logic**: Job search criteria grouped for algorithm efficiency
4. **User Understanding**: Clear separation between what employers see vs platform settings
5. **Progressive Enhancement**: Platform-specific questions come after core profile building

## Questions for Confirmation

1. Should "timeframe" be in job search config or treated differently?
2. Are there other fields that should feed into the personal insights section?
3. Should reasonable adjustments be earlier in the flow for accessibility?

This categorization maintains the principle of separating profile-building data from platform configuration while ensuring each field has a logical home in the checkpoint system.