# System Integration Plan

## Overview

This plan outlines the integration of Firebase authentication, ActiveCampaign email automation, and migration of existing job seeker data into the new checkpoint-based system architecture.

## Firebase Integration

### Authentication System Integration

#### Firebase Configuration Setup
**Required Firebase Services**:
- Firebase Authentication (Google Sign-in)
- Firestore Database (existing job seeker data)
- Firebase Analytics (user behavior tracking)

**Environment Variables Required**:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_PROJECT_ID=your_project_id  
VITE_FIREBASE_APP_ID=your_app_id
```

#### Authentication Flow Integration
**Current System Enhancement**:
```typescript
// Enhanced authentication with Firebase backup
export class AuthService {
  private firebaseAuth: Auth;
  private localAuth: LocalAuthService;

  async signInWithGoogle(): Promise<User> {
    // Primary: Firebase Google Sign-in
    const firebaseResult = await signInWithPopup(this.firebaseAuth, googleProvider);
    
    // Secondary: Sync with local PostgreSQL system
    const localUser = await this.syncWithLocalSystem(firebaseResult.user);
    
    return localUser;
  }

  async syncWithLocalSystem(firebaseUser: FirebaseUser): Promise<User> {
    // Check if user exists in PostgreSQL
    let localUser = await this.localAuth.findByEmail(firebaseUser.email);
    
    if (!localUser) {
      // Create new user in PostgreSQL with Firebase UID reference
      localUser = await this.localAuth.createUser({
        email: firebaseUser.email,
        firstName: firebaseUser.displayName?.split(' ')[0],
        lastName: firebaseUser.displayName?.split(' ')[1],
        firebaseUid: firebaseUser.uid,
        profileImageUrl: firebaseUser.photoURL,
        role: 'job_seeker'
      });
    }
    
    return localUser;
  }
}
```

#### User Session Management
**Hybrid Session Approach**:
- Firebase handles Google OAuth flow
- PostgreSQL stores comprehensive user data
- Express sessions maintain server-side state
- Firebase UID used as external reference key

### Firestore Data Access

#### Existing Job Seeker Data Retrieval
```typescript
export class FirebaseDataService {
  private db: Firestore;

  async getExistingJobSeekers(): Promise<FirebaseJobSeeker[]> {
    const jobSeekersRef = collection(this.db, 'jobSeekers');
    const snapshot = await getDocs(jobSeekersRef);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as FirebaseJobSeeker
    }));
  }

  async getJobSeekerByEmail(email: string): Promise<FirebaseJobSeeker | null> {
    const q = query(
      collection(this.db, 'jobSeekers'),
      where('email', '==', email)
    );
    const snapshot = await getDocs(q);
    
    return snapshot.empty ? null : {
      id: snapshot.docs[0].id,
      ...snapshot.docs[0].data() as FirebaseJobSeeker
    };
  }

  async migrateJobSeekerData(firebaseId: string, localUserId: number): Promise<void> {
    const firebaseData = await this.getJobSeeker(firebaseId);
    if (!firebaseData) return;

    // Map Firebase data to new checkpoint system
    await this.mapToCheckpoints(firebaseData, localUserId);
  }
}
```

## ActiveCampaign Integration

### Email Automation Setup

#### API Configuration
```typescript
export class ActiveCampaignService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.ACTIVECAMPAIGN_API_KEY!;
    this.baseUrl = process.env.ACTIVECAMPAIGN_BASE_URL!;
  }

  async createContact(contactData: ContactData): Promise<ActiveCampaignContact> {
    const response = await fetch(`${this.baseUrl}/api/3/contacts`, {
      method: 'POST',
      headers: {
        'Api-Token': this.apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contact: {
          email: contactData.email,
          firstName: contactData.firstName,
          lastName: contactData.lastName,
          phone: contactData.phone
        }
      })
    });

    return response.json();
  }
}
```

#### Automated Email Campaigns

**Checkpoint Completion Triggers**:
```typescript
export class EmailAutomationService {
  private activeCampaign: ActiveCampaignService;

  async triggerCheckpointEmail(userId: number, checkpointId: string): Promise<void> {
    const user = await this.getUserById(userId);
    const checkpoint = this.getCheckpointConfig(checkpointId);

    // Add to appropriate automation based on checkpoint
    await this.activeCampaign.addToAutomation(user.email, checkpoint.automationId);
  }

  async sendProfileCompletionReminder(userId: number): Promise<void> {
    const user = await this.getUserById(userId);
    const completionStatus = await this.getCompletionStatus(userId);

    const emailData = {
      to: user.email,
      templateId: 'profile-completion-reminder',
      personalizations: {
        firstName: user.firstName,
        completionPercentage: completionStatus.percentage,
        nextCheckpoint: completionStatus.nextCheckpoint,
        completionUrl: `${process.env.BASE_URL}/profile/checkpoints`
      }
    };

    await this.activeCampaign.sendTransactionalEmail(emailData);
  }
}
```

**Email Campaign Types**:
1. **Onboarding Sequence**
   - Welcome email after registration
   - Checkpoint completion encouragement
   - Profile completion reminders

2. **Engagement Campaigns**
   - Job match notifications
   - New challenge opportunities
   - Platform feature updates

3. **Retention Campaigns**
   - Re-engagement for inactive users
   - Checkpoint completion incentives
   - Success story sharing

### Event-Driven Email Triggers

#### Checkpoint Completion Events
```typescript
export class CheckpointEventHandler {
  async onCheckpointCompleted(userId: number, checkpointId: string): Promise<void> {
    // Update ActiveCampaign contact tags
    await this.activeCampaign.addTag(userId, `checkpoint-${checkpointId}-completed`);
    
    // Trigger next checkpoint email if not final
    const nextCheckpoint = this.getNextCheckpoint(checkpointId);
    if (nextCheckpoint) {
      await this.emailService.scheduleCheckpointReminder(userId, nextCheckpoint.id);
    }
    
    // Check for profile completion
    const isProfileComplete = await this.checkProfileCompletion(userId);
    if (isProfileComplete) {
      await this.emailService.triggerProfileCompletionEmail(userId);
    }
  }

  async onJobApplicationSubmitted(userId: number, jobId: number): Promise<void> {
    await this.activeCampaign.addTag(userId, 'application-submitted');
    await this.emailService.sendApplicationConfirmation(userId, jobId);
  }
}
```

## Data Migration Plan

### Existing Job Seeker Data Analysis

Based on the CSV structure, mapping existing fields to new checkpoint system:

#### CSV Data Structure Analysis
```typescript
interface ExistingJobSeekerCSV {
  // Personal Information
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  
  // Current Assessment Data
  behavioralAnswers?: string; // JSON string of existing responses
  workStyle?: string;
  communicationStyle?: string;
  
  // Profile Information
  education?: string;
  experience?: string;
  skills?: string;
  interests?: string;
  
  // Platform Data
  registrationDate: string;
  lastActive?: string;
  completionStatus?: string;
}
```

#### Checkpoint Mapping Strategy

**Checkpoint 1: Work Style Discovery (Behavioral Assessment)**
```typescript
async function migrateBehavioralData(csvData: ExistingJobSeekerCSV, userId: number): Promise<void> {
  if (csvData.behavioralAnswers) {
    const existingAnswers = JSON.parse(csvData.behavioralAnswers);
    
    // Map old assessment to new DISC system
    const discProfile = await this.convertToDiscProfile(existingAnswers);
    
    await this.checkpointStorage.saveCheckpointProgress(
      userId,
      'behavioral-assessment',
      {
        discProfile,
        completed: true,
        migratedFrom: 'legacy-system',
        originalData: existingAnswers
      },
      'profile'
    );
  }
}
```

**Checkpoint 2: Personal Story**
```typescript
async function migratePersonalStory(csvData: ExistingJobSeekerCSV, userId: number): Promise<void> {
  const storyData = {
    perfectJob: this.extractFromExperience(csvData.interests),
    friendDescription: null, // Not available in CSV
    teacherDescription: null, // Not available in CSV
    happyActivities: this.extractFromInterests(csvData.interests),
    frustrations: null, // Not available in CSV
    proudMoments: this.extractFromExperience(csvData.experience),
    migrated: true
  };

  await this.checkpointStorage.saveCheckpointProgress(
    userId,
    'personal-story',
    storyData,
    'profile'
  );
}
```

**Checkpoint 3: Education & Learning**
```typescript
async function migrateEducation(csvData: ExistingJobSeekerCSV, userId: number): Promise<void> {
  if (csvData.education) {
    const educationData = {
      highestQualification: this.parseEducationLevel(csvData.education),
      subjects: this.extractSubjects(csvData.education),
      additionalLearning: csvData.skills ? csvData.skills.split(',') : [],
      migrated: true
    };

    await this.checkpointStorage.saveCheckpointProgress(
      userId,
      'education',
      educationData,
      'profile'
    );
  }
}
```

#### Migration Process Workflow

**Phase 1: Data Validation and Cleanup**
```typescript
export class DataMigrationService {
  async validateCSVData(csvPath: string): Promise<ValidationResult> {
    const csvData = await this.parseCSV(csvPath);
    const validationErrors: ValidationError[] = [];
    
    for (const row of csvData) {
      // Validate email format
      if (!this.isValidEmail(row.email)) {
        validationErrors.push({
          row: row.index,
          field: 'email',
          error: 'Invalid email format'
        });
      }
      
      // Check for duplicate emails
      const existingUser = await this.findUserByEmail(row.email);
      if (existingUser) {
        validationErrors.push({
          row: row.index,
          field: 'email',
          error: 'User already exists'
        });
      }
    }
    
    return { isValid: validationErrors.length === 0, errors: validationErrors };
  }
}
```

**Phase 2: User Account Creation**
```typescript
async function createMigratedUser(csvRow: ExistingJobSeekerCSV): Promise<User> {
  return await this.userService.createUser({
    email: csvRow.email,
    firstName: csvRow.firstName,
    lastName: csvRow.lastName,
    phone: csvRow.phone,
    role: 'job_seeker',
    source: 'migration',
    migrationDate: new Date(),
    originalRegistrationDate: new Date(csvRow.registrationDate)
  });
}
```

**Phase 3: Checkpoint Data Migration**
```typescript
async function migrateUserCheckpoints(csvRow: ExistingJobSeekerCSV, user: User): Promise<void> {
  const migrationTasks = [
    this.migrateBehavioralData(csvRow, user.id),
    this.migratePersonalStory(csvRow, user.id),
    this.migrateEducation(csvRow, user.id),
    this.migrateCareerInterests(csvRow, user.id),
    this.migrateJobPreferences(csvRow, user.id)
  ];
  
  await Promise.all(migrationTasks);
  
  // Calculate completion percentage
  const completionStatus = await this.calculateMigrationCompletion(user.id);
  await this.updateUserMigrationStatus(user.id, completionStatus);
}
```

**Phase 4: ActiveCampaign Sync**
```typescript
async function syncWithActiveCampaign(user: User, completionStatus: CompletionStatus): Promise<void> {
  // Create or update contact in ActiveCampaign
  const contact = await this.activeCampaign.createContact({
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone
  });
  
  // Add migration tags
  await this.activeCampaign.addTag(contact.id, 'migrated-user');
  await this.activeCampaign.addTag(contact.id, `completion-${completionStatus.percentage}`);
  
  // Add to appropriate automation based on completion
  if (completionStatus.percentage < 100) {
    await this.activeCampaign.addToAutomation(contact.id, 'profile-completion-sequence');
  } else {
    await this.activeCampaign.addToAutomation(contact.id, 'job-matching-sequence');
  }
}
```

## Technical Implementation

### Database Schema Updates

**Migration Tracking Tables**:
```sql
-- Track migration status
migration_log:
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  migration_date TIMESTAMP DEFAULT NOW(),
  original_source VARCHAR(50), -- 'csv', 'firebase'
  completion_percentage INTEGER,
  migration_notes TEXT

-- Store original data for reference
original_user_data:
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  original_data JSONB, -- Full original CSV/Firebase data
  data_source VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()

-- Firebase integration references
firebase_user_mapping:
  id SERIAL PRIMARY KEY,
  local_user_id INTEGER REFERENCES users(id),
  firebase_uid VARCHAR(255) UNIQUE,
  synced_at TIMESTAMP DEFAULT NOW()
```

### API Endpoints

**Migration Management APIs**:
```typescript
// Migration endpoints
POST /api/admin/migration/validate-csv
POST /api/admin/migration/start-migration
GET /api/admin/migration/status
POST /api/admin/migration/retry-failed

// Firebase sync endpoints  
POST /api/auth/firebase-sync
GET /api/user/firebase-data
PUT /api/user/merge-firebase-data

// ActiveCampaign integration
POST /api/email/sync-contact
PUT /api/email/update-tags
POST /api/email/trigger-campaign
```

### Error Handling and Recovery

**Migration Error Recovery**:
```typescript
export class MigrationErrorHandler {
  async handleMigrationError(userId: number, error: MigrationError): Promise<void> {
    // Log error details
    await this.logMigrationError(userId, error);
    
    // Attempt recovery based on error type
    switch (error.type) {
      case 'DATA_VALIDATION':
        await this.scheduleDataCleanup(userId);
        break;
      case 'CHECKPOINT_CREATION':
        await this.retryCheckpointCreation(userId, error.checkpointId);
        break;
      case 'ACTIVECAMPAIGN_SYNC':
        await this.retryActiveCampaignSync(userId);
        break;
      default:
        await this.markForManualReview(userId, error);
    }
  }
}
```

## Implementation Timeline

### Week 1: Firebase Integration
- Firebase authentication setup
- User sync mechanism implementation
- Firestore data access configuration

### Week 2: ActiveCampaign Integration  
- API connection establishment
- Email automation setup
- Event trigger implementation

### Week 3: Data Migration Framework
- CSV parsing and validation system
- Migration workflow implementation
- Error handling and recovery

### Week 4: Migration Execution
- Existing data migration
- Quality assurance testing
- User notification and onboarding

### Week 5: Testing and Optimization
- Integration testing
- Performance optimization
- User acceptance testing

## Success Metrics

### Migration Success Criteria
- 95%+ successful user account creation
- 85%+ checkpoint data migration accuracy
- 100% ActiveCampaign contact sync
- <1% data loss during migration

### Integration Performance
- Firebase authentication: <2 second response time
- ActiveCampaign sync: <5 second delay
- Data migration: <30 seconds per user
- Error recovery: <24 hour resolution time

This comprehensive integration plan ensures seamless connection with existing systems while maintaining data integrity and providing enhanced user experience through the new checkpoint-based architecture.