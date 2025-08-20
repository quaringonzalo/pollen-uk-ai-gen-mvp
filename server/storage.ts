import {
  users,
  jobSeekerProfiles,
  employerProfiles,
  jobs,
  challenges,
  applications,
  challengeSubmissions,
  workflows,
  savedCompanies,
  hiddenJobs,
  hiddenJobApplications,
  type User,
  type InsertUser,
  type JobSeekerProfile,
  type InsertJobSeekerProfile,
  type EmployerProfile,
  type InsertEmployerProfile,
  type Job,
  type InsertJob,
  type Challenge,
  type InsertChallenge,
  type Application,
  type InsertApplication,
  type ChallengeSubmission,
  type InsertChallengeSubmission,
  type Workflow,
  type InsertWorkflow,
  type SavedCompany,
  type InsertSavedCompany,
  type HiddenJob,
  type InsertHiddenJob,
  type HiddenJobApplication,
  type InsertHiddenJobApplication,
  employerApplications,
  type EmployerApplication,
  type InsertEmployerApplication,
  onboardingResponses,
  type OnboardingResponse,
  type InsertOnboardingResponse,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, sql, gte } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User>;

  // Job Seeker Profile operations
  getJobSeekerProfile(userId: number): Promise<JobSeekerProfile | undefined>;
  createJobSeekerProfile(profile: InsertJobSeekerProfile): Promise<JobSeekerProfile>;
  updateJobSeekerProfile(id: number, updates: Partial<InsertJobSeekerProfile>): Promise<JobSeekerProfile>;
  updateJobSeekerProfileByUserId(userId: number, updates: any): Promise<JobSeekerProfile>;

  // Employer Profile operations
  getEmployerProfile(userId: number): Promise<EmployerProfile | undefined>;
  getEmployerProfileById(id: number): Promise<EmployerProfile | undefined>;
  getAllEmployerProfiles(): Promise<EmployerProfile[]>;
  getEmployerProfiles(): Promise<EmployerProfile[]>;
  createEmployerProfile(profile: InsertEmployerProfile): Promise<EmployerProfile>;
  updateEmployerProfile(id: number, updates: Partial<InsertEmployerProfile>): Promise<EmployerProfile>;

  // Job operations
  getAllJobs(): Promise<Job[]>;
  getJobById(id: number): Promise<Job | undefined>;
  getJobsByEmployer(employerId: number): Promise<Job[]>;
  createJob(job: InsertJob): Promise<Job>;
  updateJob(id: number, updates: Partial<InsertJob>): Promise<Job>;
  deleteJob(id: number): Promise<void>;

  // Challenge operations
  getAllChallenges(): Promise<Challenge[]>;
  getChallengeById(id: number): Promise<Challenge | undefined>;
  getActiveChallenges(): Promise<Challenge[]>;
  createChallenge(challenge: InsertChallenge): Promise<Challenge>;
  updateChallenge(id: number, updates: Partial<InsertChallenge>): Promise<Challenge>;

  // Application operations
  getApplicationsByJob(jobId: number): Promise<Application[]>;
  getApplicationsByJobSeeker(jobSeekerId: number): Promise<Application[]>;
  getApplicationById(id: number): Promise<Application | undefined>;
  createApplication(application: InsertApplication): Promise<Application>;
  
  // Outcome tracking operations
  recordApplicationOutcome(outcome: any): Promise<void>;
  createFeedbackRequest(request: any): Promise<void>;
  storeCandidateFeedback(feedback: any): Promise<void>;
  getCompanyRatings(employerId: number): Promise<any>;
  updateCompanyRatings(employerId: number, ratings: any): Promise<void>;
  logRatingUpdate(employerId: number, applicationId: number, oldRatings: any, newRatings: any): Promise<void>;
  getApplicationOutcome(applicationId: number): Promise<any>;
  createSuccessStory(story: any): Promise<void>;
  getUserById(id: number): Promise<User | undefined>;
  getEmployerById(id: number): Promise<EmployerProfile | undefined>;
  updateApplication(id: number, updates: Partial<InsertApplication>): Promise<Application>;

  // Challenge Submission operations
  getChallengeSubmissionsByApplication(applicationId: number): Promise<ChallengeSubmission[]>;
  getChallengeSubmissionById(id: number): Promise<ChallengeSubmission | undefined>;
  createChallengeSubmission(submission: InsertChallengeSubmission): Promise<ChallengeSubmission>;
  updateChallengeSubmission(id: number, updates: Partial<InsertChallengeSubmission>): Promise<ChallengeSubmission>;

  // Workflow operations
  getWorkflowByJob(jobId: number): Promise<Workflow | undefined>;
  createWorkflow(workflow: InsertWorkflow): Promise<Workflow>;
  updateWorkflow(id: number, updates: Partial<InsertWorkflow>): Promise<Workflow>;
  getAllWorkflows(): Promise<Workflow[]>;

  // Employer Application operations
  getAllEmployerApplications(): Promise<EmployerApplication[]>;
  createEmployerApplication(application: InsertEmployerApplication): Promise<EmployerApplication>;
  reviewEmployerApplication(id: number, status: string, reviewNotes?: string, reviewedBy?: number): Promise<EmployerApplication>;

  // Onboarding Response operations
  createOnboardingResponse(response: InsertOnboardingResponse): Promise<OnboardingResponse>;
  getOnboardingResponse(userId: number): Promise<OnboardingResponse | undefined>;

  // Analytics operations
  getPlatformStats(): Promise<{
    totalJobSeekers: number;
    totalEmployers: number;
    totalChallengesCompleted: number;
    totalHires: number;
  }>;
  getJobMatchesForSeeker(jobSeekerId: number): Promise<(Job & { matchScore: number })[]>;

  // Challenge Gamification operations
  getChallengeAttempts(jobSeekerId: number): Promise<any[]>;
  createChallengeAttempt(attempt: any): Promise<any>;
  getChallengeLeaderboard(challengeId: number): Promise<any[]>;
  updateChallengeStreak(jobSeekerId: number): Promise<any>;
  
  // Job Acceptance operations
  recordJobAcceptance(acceptanceData: any): Promise<void>;
  getWeeklyChallenges(): Promise<any[]>;
  createWeeklyChallenge(challenge: any): Promise<any>;

  // Admin Review operations
  saveJobReview(review: any): Promise<void>;
  getJobReview(jobId: number): Promise<any>;
  updateJobReview(jobId: number, updates: any): Promise<void>;
  activateJobPosting(jobId: number): Promise<void>;
  saveAssessmentReview(review: any): Promise<void>;
  getAssessmentReview(configId: string): Promise<any>;
  updateAssessmentReview(configId: string, updates: any): Promise<void>;
  activateAssessmentConfig(configId: string): Promise<void>;
  getAssessmentConfig(configId: string): Promise<any>;

  // Employer Checkpoint operations
  saveCheckpointData(jobId: number, checkpointId: string, data: any): Promise<void>;
  getCheckpointData(jobId: number, checkpointId: string): Promise<any>;
  getAllCheckpointData(jobId: number): Promise<any>;

  // Saved Companies operations
  getSavedCompanies(userId: number): Promise<SavedCompany[]>;
  saveCompany(data: InsertSavedCompany): Promise<SavedCompany>;
  removeSavedCompany(userId: number, companyId: string): Promise<void>;
  isCompanySaved(userId: number, companyId: string): Promise<boolean>;

  // Hidden Jobs operations
  getAllHiddenJobs(): Promise<HiddenJob[]>;
  getActiveHiddenJobs(): Promise<HiddenJob[]>;
  getHiddenJobById(id: number): Promise<HiddenJob | undefined>;
  createHiddenJob(job: InsertHiddenJob): Promise<HiddenJob>;
  updateHiddenJob(id: number, updates: Partial<InsertHiddenJob>): Promise<HiddenJob>;
  deleteHiddenJob(id: number): Promise<void>;
  incrementHiddenJobClicks(id: number): Promise<void>;
  createHiddenJobApplication(application: InsertHiddenJobApplication): Promise<HiddenJobApplication>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Job Seeker Profile operations
  async getJobSeekerProfile(userId: number): Promise<JobSeekerProfile | undefined> {
    const [profile] = await db
      .select()
      .from(jobSeekerProfiles)
      .where(eq(jobSeekerProfiles.userId, userId));
    return profile;
  }

  async createJobSeekerProfile(profile: InsertJobSeekerProfile): Promise<JobSeekerProfile> {
    const [created] = await db.insert(jobSeekerProfiles).values([profile]).returning();
    return created;
  }

  async updateJobSeekerProfile(id: number, updates: any): Promise<JobSeekerProfile> {
    const [profile] = await db
      .update(jobSeekerProfiles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(jobSeekerProfiles.id, id))
      .returning();
    return profile;
  }

  async updateJobSeekerProfileByUserId(userId: number, updates: any): Promise<JobSeekerProfile> {
    const [profile] = await db
      .update(jobSeekerProfiles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(jobSeekerProfiles.userId, userId))
      .returning();
    return profile;
  }

  // Employer Profile operations
  async getEmployerProfile(userId: number): Promise<EmployerProfile | undefined> {
    const [profile] = await db
      .select()
      .from(employerProfiles)
      .where(eq(employerProfiles.userId, userId));
    return profile;
  }

  async getEmployerProfileById(id: number): Promise<EmployerProfile | undefined> {
    const [profile] = await db
      .select()
      .from(employerProfiles)
      .where(eq(employerProfiles.id, id));
    return profile;
  }

  async getEmployerProfiles(): Promise<EmployerProfile[]> {
    return await db.select().from(employerProfiles).orderBy(desc(employerProfiles.createdAt));
  }

  async createEmployerProfile(profile: InsertEmployerProfile): Promise<EmployerProfile> {
    // Ensure array fields are properly formatted
    const profileData = {
      ...profile,
      values: Array.isArray(profile.values) ? profile.values : [],
      benefits: Array.isArray(profile.benefits) ? profile.benefits : [],
      perks: Array.isArray(profile.perks) ? profile.perks : [],
      techStack: Array.isArray(profile.techStack) ? profile.techStack : [],
      companyPhotos: Array.isArray(profile.companyPhotos) ? profile.companyPhotos : []
    };
    const [created] = await db.insert(employerProfiles).values(profileData).returning();
    return created;
  }

  async updateEmployerProfile(id: number, updates: Partial<InsertEmployerProfile>): Promise<EmployerProfile> {
    const [profile] = await db
      .update(employerProfiles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(employerProfiles.id, id))
      .returning();
    return profile;
  }

  // Job operations
  async getAllJobs(): Promise<Job[]> {
    return await db.select().from(jobs).orderBy(desc(jobs.createdAt));
  }

  async getJobById(id: number): Promise<Job | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
    return job;
  }

  async getJobsByEmployer(employerId: number): Promise<Job[]> {
    return await db
      .select()
      .from(jobs)
      .where(eq(jobs.employerId, employerId))
      .orderBy(desc(jobs.createdAt));
  }

  async createJob(job: InsertJob): Promise<Job> {
    const [created] = await db.insert(jobs).values([job]).returning();
    return created;
  }

  async updateJob(id: number, updates: Partial<InsertJob>): Promise<Job> {
    const updateData = { ...updates, updatedAt: new Date() };
    if (updateData.requiredSkills && Array.isArray(updateData.requiredSkills)) {
      updateData.requiredSkills = updateData.requiredSkills as string[];
    }
    if (updateData.preferredSkills && Array.isArray(updateData.preferredSkills)) {
      updateData.preferredSkills = updateData.preferredSkills as string[];
    }
    const [job] = await db
      .update(jobs)
      .set(updateData)
      .where(eq(jobs.id, id))
      .returning();
    return job;
  }

  async deleteJob(id: number): Promise<void> {
    await db.delete(jobs).where(eq(jobs.id, id));
  }

  // Challenge operations
  async getAllChallenges(): Promise<Challenge[]> {
    return await db.select().from(challenges).orderBy(desc(challenges.createdAt));
  }

  async getChallengeById(id: number): Promise<Challenge | undefined> {
    const [challenge] = await db.select().from(challenges).where(eq(challenges.id, id));
    return challenge;
  }

  async getActiveChallenges(): Promise<Challenge[]> {
    return await db
      .select()
      .from(challenges)
      .where(eq(challenges.isActive, true))
      .orderBy(desc(challenges.createdAt));
  }

  async createChallenge(challenge: InsertChallenge): Promise<Challenge> {
    const [created] = await db.insert(challenges).values([challenge]).returning();
    return created;
  }

  async updateChallenge(id: number, updates: Partial<InsertChallenge>): Promise<Challenge> {
    const updateData = { ...updates, updatedAt: new Date() };
    if (updateData.skills && Array.isArray(updateData.skills)) {
      updateData.skills = updateData.skills as string[];
    }
    const [challenge] = await db
      .update(challenges)
      .set(updateData)
      .where(eq(challenges.id, id))
      .returning();
    return challenge;
  }

  // Application operations
  async getApplicationsByJob(jobId: number): Promise<Application[]> {
    return await db
      .select()
      .from(applications)
      .where(eq(applications.jobId, jobId))
      .orderBy(desc(applications.submittedAt));
  }

  async getApplicationsByJobSeeker(jobSeekerId: number): Promise<Application[]> {
    return await db
      .select()
      .from(applications)
      .where(eq(applications.jobSeekerId, jobSeekerId))
      .orderBy(desc(applications.submittedAt));
  }

  async getApplicationById(id: number): Promise<Application | undefined> {
    const [application] = await db.select().from(applications).where(eq(applications.id, id));
    return application;
  }

  async createApplication(application: InsertApplication): Promise<Application> {
    const [created] = await db.insert(applications).values(application).returning();
    return created;
  }

  async updateApplication(id: number, updates: Partial<InsertApplication>): Promise<Application> {
    const [application] = await db
      .update(applications)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(applications.id, id))
      .returning();
    return application;
  }

  // Challenge Submission operations
  getChallengeSubmissionById(id: number): Promise<ChallengeSubmission | undefined>;
  
  async getChallengeSubmissionById(id: number): Promise<ChallengeSubmission | undefined> {
    const [submission] = await db.select().from(challengeSubmissions).where(eq(challengeSubmissions.id, id));
    return submission;
  }

  async getChallengeSubmissionsByApplication(applicationId: number): Promise<ChallengeSubmission[]> {
    return await db
      .select()
      .from(challengeSubmissions)
      .where(eq(challengeSubmissions.applicationId, applicationId))
      .orderBy(desc(challengeSubmissions.submittedAt));
  }

  async createChallengeSubmission(submission: InsertChallengeSubmission): Promise<ChallengeSubmission> {
    const [created] = await db.insert(challengeSubmissions).values(submission).returning();
    return created;
  }

  async updateChallengeSubmission(id: number, updates: Partial<InsertChallengeSubmission>): Promise<ChallengeSubmission> {
    const [submission] = await db
      .update(challengeSubmissions)
      .set({ ...updates, reviewedAt: updates.score ? new Date() : undefined })
      .where(eq(challengeSubmissions.id, id))
      .returning();
    return submission;
  }

  // Workflow operations
  async getWorkflowByJob(jobId: number): Promise<Workflow | undefined> {
    const [workflow] = await db.select().from(workflows).where(eq(workflows.jobId, jobId));
    return workflow;
  }

  async createWorkflow(workflow: InsertWorkflow): Promise<Workflow> {
    const [created] = await db.insert(workflows).values(workflow).returning();
    return created;
  }

  async updateWorkflow(id: number, updates: Partial<InsertWorkflow>): Promise<Workflow> {
    const [workflow] = await db
      .update(workflows)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(workflows.id, id))
      .returning();
    return workflow;
  }

  async getAllWorkflows(): Promise<Workflow[]> {
    return await db.select().from(workflows).orderBy(desc(workflows.createdAt));
  }

  // Analytics operations
  async getPlatformStats(): Promise<{
    totalJobSeekers: number;
    totalEmployers: number;
    totalChallengesCompleted: number;
    totalHires: number;
  }> {
    const [jobSeekersCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.role, "job_seeker"));

    const [employersCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.role, "employer"));

    const [challengesCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(challengeSubmissions);

    const [hiresCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(applications)
      .where(eq(applications.status, "hired"));

    return {
      totalJobSeekers: jobSeekersCount.count,
      totalEmployers: employersCount.count,
      totalChallengesCompleted: challengesCount.count,
      totalHires: hiresCount.count,
    };
  }

  async getJobMatchesForSeeker(jobSeekerId: number): Promise<(Job & { matchScore: number })[]> {
    const profile = await this.getJobSeekerProfile(jobSeekerId);
    if (!profile) return [];

    const allJobs = await db
      .select()
      .from(jobs)
      .where(eq(jobs.status, "active"));

    // Simple matching algorithm based on skill overlap
    const matchedJobs = allJobs.map((job) => {
      const seekerSkills = profile.skills || [];
      const requiredSkills = job.requiredSkills || [];
      const preferredSkills = job.preferredSkills || [];
      
      const totalJobSkills = [...requiredSkills, ...preferredSkills];
      const matchingSkills = seekerSkills.filter(skill => 
        totalJobSkills.some(jobSkill => 
          jobSkill.toLowerCase().includes(skill.toLowerCase()) || 
          skill.toLowerCase().includes(jobSkill.toLowerCase())
        )
      );
      
      const matchScore = totalJobSkills.length > 0 
        ? Math.round((matchingSkills.length / totalJobSkills.length) * 100)
        : 0;

      return {
        ...job,
        matchScore,
      };
    });

    return matchedJobs
      .filter(job => job.matchScore > 30) // Only return matches above 30%
      .sort((a, b) => b.matchScore - a.matchScore);
  }

  // Challenge Gamification operations
  async getChallengeAttempts(jobSeekerId: number): Promise<any[]> {
    // Mock data for demo - in production would query challenge_attempts table
    return [
      {
        id: 1,
        challengeId: 4,
        score: 95,
        timeSpent: 25,
        pointsEarned: 75,
        bonusPoints: 38,
        completedAt: "2024-12-15T10:30:00Z",
        feedback: "Excellent work on responsive design!"
      },
      {
        id: 2,
        challengeId: 1,
        score: 88,
        timeSpent: 52,
        pointsEarned: 150,
        bonusPoints: 132,
        completedAt: "2024-12-10T14:20:00Z",
        feedback: "Great component architecture, minor optimization opportunities"
      }
    ];
  }

  async createChallengeAttempt(attempt: any): Promise<any> {
    // Mock implementation - in production would insert into challenge_attempts table
    return { id: Date.now(), ...attempt };
  }

  async getChallengeLeaderboard(challengeId: number): Promise<any[]> {
    // Mock leaderboard data
    return [
      { rank: 1, jobSeekerName: "Alex Chen", score: 98, timeSpent: 42 },
      { rank: 2, jobSeekerName: "Sarah Kim", score: 95, timeSpent: 38 },
      { rank: 3, jobSeekerName: "Mike Johnson", score: 92, timeSpent: 45 }
    ];
  }

  async updateChallengeStreak(jobSeekerId: number): Promise<any> {
    // Mock streak update
    return { currentStreak: 7, longestStreak: 12, bonusEarned: 50 };
  }

  async getWeeklyChallenges(): Promise<any[]> {
    // Mock weekly challenges
    return [
      {
        id: 1,
        title: "Double Points Weekend",
        description: "All challenges give 2x points",
        bonusMultiplier: 2.0,
        startDate: "2024-12-14T00:00:00Z",
        endDate: "2024-12-16T23:59:59Z"
      }
    ];
  }

  async createWeeklyChallenge(challenge: any): Promise<any> {
    return { id: Date.now(), ...challenge };
  }

  // Employer Application operations
  async getAllEmployerApplications(): Promise<EmployerApplication[]> {
    return await db.select().from(employerApplications);
  }

  async createEmployerApplication(application: InsertEmployerApplication): Promise<EmployerApplication> {
    const [newApplication] = await db
      .insert(employerApplications)
      .values(application)
      .returning();
    return newApplication;
  }

  async reviewEmployerApplication(id: number, status: string, reviewNotes?: string, reviewedBy?: number): Promise<EmployerApplication> {
    const [updatedApplication] = await db
      .update(employerApplications)
      .set({
        status,
        reviewNotes,
        reviewedBy,
        reviewedAt: new Date(),
      })
      .where(eq(employerApplications.id, id))
      .returning();
    return updatedApplication;
  }

  // Onboarding Response operations
  async createOnboardingResponse(response: InsertOnboardingResponse): Promise<OnboardingResponse> {
    const [newResponse] = await db
      .insert(onboardingResponses)
      .values(response)
      .returning();
    return newResponse;
  }

  async getOnboardingResponse(userId: number): Promise<OnboardingResponse | undefined> {
    const [response] = await db.select().from(onboardingResponses).where(eq(onboardingResponses.userId, userId));
    return response;
  }

  async updateJobSeekerBehavioralAssessment(userId: number, assessment: {
    discRedPercentage: number;
    discYellowPercentage: number;
    discGreenPercentage: number;
    discBluePercentage: number;
    assessmentCompleted: boolean;
    assessmentValidityScore?: number;
    assessmentConsistencyScore?: number;
    assessmentSocialDesirabilityScore?: number;
    assessmentCompletedAt: Date;
    totalPoints?: number;
  }) {
    // First, get the existing job seeker profile
    const existingProfile = await this.getJobSeekerProfile(userId);
    
    if (existingProfile) {
      // Update existing profile
      const [updated] = await db
        .update(jobSeekerProfiles)
        .set({
          discRedPercentage: assessment.discRedPercentage,
          discYellowPercentage: assessment.discYellowPercentage,
          discGreenPercentage: assessment.discGreenPercentage,
          discBluePercentage: assessment.discBluePercentage,
          assessmentCompleted: assessment.assessmentCompleted,
          assessmentValidityScore: assessment.assessmentValidityScore,
          assessmentConsistencyScore: assessment.assessmentConsistencyScore,
          assessmentSocialDesirabilityScore: assessment.assessmentSocialDesirabilityScore,
          assessmentCompletedAt: assessment.assessmentCompletedAt,
          totalPoints: assessment.totalPoints,
          updatedAt: new Date()
        })
        .where(eq(jobSeekerProfiles.userId, userId))
        .returning();
      return updated;
    } else {
      // Create new profile if none exists
      const [created] = await db.insert(jobSeekerProfiles).values({
        userId,
        discRedPercentage: assessment.discRedPercentage,
        discYellowPercentage: assessment.discYellowPercentage,
        discGreenPercentage: assessment.discGreenPercentage,
        discBluePercentage: assessment.discBluePercentage,
        assessmentCompleted: assessment.assessmentCompleted,
        assessmentValidityScore: assessment.assessmentValidityScore,
        assessmentConsistencyScore: assessment.assessmentConsistencyScore,
        assessmentSocialDesirabilityScore: assessment.assessmentSocialDesirabilityScore,
        assessmentCompletedAt: assessment.assessmentCompletedAt,
        totalPoints: assessment.totalPoints || 0
      }).returning();
      return created;
    }
  }

  // Admin Review operations
  async saveJobReview(review: any): Promise<void> {
    // Store in jobs table with review data
    await db.update(jobs).set({ 
      reviewStatus: review.status,
      reviewData: JSON.stringify(review),
      updatedAt: new Date()
    }).where(eq(jobs.id, review.jobId));
  }

  async getJobReview(jobId: number): Promise<any> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, jobId));
    return job?.reviewData ? JSON.parse(job.reviewData) : null;
  }

  async updateJobReview(jobId: number, updates: any): Promise<void> {
    const existing = await this.getJobReview(jobId);
    const updated = { ...existing, ...updates };
    await db.update(jobs).set({
      reviewStatus: updated.status,
      reviewData: JSON.stringify(updated),
      updatedAt: new Date()
    }).where(eq(jobs.id, jobId));
  }

  async activateJobPosting(jobId: number): Promise<void> {
    await db.update(jobs).set({
      status: 'active',
      updatedAt: new Date()
    }).where(eq(jobs.id, jobId));
  }

  async saveAssessmentReview(review: any): Promise<void> {
    // Store assessment review data in jobs table
    await db.update(jobs).set({
      assessmentReviewData: JSON.stringify(review),
      updatedAt: new Date()
    }).where(eq(jobs.id, review.jobId));
  }

  async getAssessmentReview(configId: string): Promise<any> {
    // Find job by config ID stored in metadata
    const [job] = await db.select().from(jobs).where(sql`metadata->>'configId' = ${configId}`);
    return job?.assessmentReviewData ? JSON.parse(job.assessmentReviewData) : null;
  }

  async updateAssessmentReview(configId: string, updates: any): Promise<void> {
    const existing = await this.getAssessmentReview(configId);
    const updated = { ...existing, ...updates };
    await db.update(jobs).set({
      assessmentReviewData: JSON.stringify(updated),
      updatedAt: new Date()
    }).where(sql`metadata->>'configId' = ${configId}`);
  }

  async activateAssessmentConfig(configId: string): Promise<void> {
    await db.update(jobs).set({
      assessmentStatus: 'active',
      updatedAt: new Date()
    }).where(sql`metadata->>'configId' = ${configId}`);
  }

  async getAssessmentConfig(configId: string): Promise<any> {
    const [job] = await db.select().from(jobs).where(sql`metadata->>'configId' = ${configId}`);
    return job?.checkpointData ? JSON.parse(job.checkpointData) : null;
  }

  // Employer Checkpoint operations
  async saveCheckpointData(jobId: number, checkpointId: string, data: any): Promise<void> {
    const existing = await this.getAllCheckpointData(jobId);
    const updated = { ...existing, [checkpointId]: data };
    
    await db.update(jobs).set({
      checkpointData: JSON.stringify(updated),
      updatedAt: new Date()
    }).where(eq(jobs.id, jobId));
  }

  async getCheckpointData(jobId: number, checkpointId: string): Promise<any> {
    const allData = await this.getAllCheckpointData(jobId);
    return allData?.[checkpointId] || null;
  }

  async getAllCheckpointData(jobId: number): Promise<any> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, jobId));
    return job?.checkpointData ? JSON.parse(job.checkpointData) : {};
  }

  // Outcome tracking operations
  async recordApplicationOutcome(outcome: any): Promise<void> {
    // Store outcome in memory for now
    // In production, this would be stored in a database table
    console.log(`Recording application outcome:`, outcome);
  }

  async createFeedbackRequest(request: any): Promise<void> {
    // Store feedback request in memory for now
    console.log(`Creating feedback request:`, request);
  }

  async storeCandidateFeedback(feedback: any): Promise<void> {
    // Store feedback in memory for now
    console.log(`Storing candidate feedback:`, feedback);
  }

  async getCompanyRatings(employerId: number): Promise<any> {
    // Return mock ratings for now
    return {
      feedbackQualityRating: 4.2,
      communicationSpeedRating: 4.0,
      interviewExperienceRating: 4.3,
      processTransparencyRating: 4.1,
      totalReviews: 25
    };
  }

  async updateCompanyRatings(employerId: number, ratings: any): Promise<void> {
    // Update ratings in memory for now
    console.log(`Updating company ratings for employer ${employerId}:`, ratings);
  }

  async logRatingUpdate(employerId: number, applicationId: number, oldRatings: any, newRatings: any): Promise<void> {
    // Log rating update in memory for now
    console.log(`Rating update for employer ${employerId}, application ${applicationId}:`, { oldRatings, newRatings });
  }

  async getApplicationOutcome(applicationId: number): Promise<any> {
    // Return mock outcome for now
    return {
      finalOutcome: "hired",
      outcomeDate: new Date(),
      outcomeStage: "offer"
    };
  }

  async createSuccessStory(story: any): Promise<void> {
    // Store success story in memory for now
    console.log(`Creating success story:`, story);
  }



  async recordJobAcceptance(acceptanceData: any): Promise<void> {
    // Store job acceptance data in memory for now
    console.log(`Recording job acceptance:`, acceptanceData);
    // In production, this would be stored in a database table for outcome tracking
  }

  // Saved Companies operations
  async getSavedCompanies(userId: number): Promise<SavedCompany[]> {
    try {
      const saved = await db.select()
        .from(savedCompanies)
        .where(eq(savedCompanies.userId, userId))
        .orderBy(desc(savedCompanies.savedAt));
      return saved;
    } catch (error) {
      console.error("Error fetching saved companies:", error);
      throw error;
    }
  }

  async saveCompany(data: InsertSavedCompany): Promise<SavedCompany> {
    try {
      const [saved] = await db.insert(savedCompanies)
        .values(data)
        .returning();
      return saved;
    } catch (error) {
      console.error("Error saving company:", error);
      throw error;
    }
  }

  async removeSavedCompany(userId: number, companyId: string): Promise<void> {
    try {
      await db.delete(savedCompanies)
        .where(and(
          eq(savedCompanies.userId, userId),
          eq(savedCompanies.companyId, companyId)
        ));
    } catch (error) {
      console.error("Error removing saved company:", error);
      throw error;
    }
  }

  async isCompanySaved(userId: number, companyId: string): Promise<boolean> {
    try {
      const [saved] = await db.select()
        .from(savedCompanies)
        .where(and(
          eq(savedCompanies.userId, userId),
          eq(savedCompanies.companyId, companyId)
        ))
        .limit(1);
      return !!saved;
    } catch (error) {
      console.error("Error checking if company is saved:", error);
      throw error;
    }
  }

  // Hidden Jobs operations
  async getAllHiddenJobs(): Promise<HiddenJob[]> {
    return await db.select().from(hiddenJobs).orderBy(desc(hiddenJobs.createdAt));
  }

  async getActiveHiddenJobs(): Promise<HiddenJob[]> {
    return await db
      .select()
      .from(hiddenJobs)
      .where(eq(hiddenJobs.isActive, true))
      .orderBy(desc(hiddenJobs.createdAt));
  }

  async getHiddenJobById(id: number): Promise<HiddenJob | undefined> {
    const [job] = await db.select().from(hiddenJobs).where(eq(hiddenJobs.id, id));
    return job;
  }

  async createHiddenJob(job: InsertHiddenJob): Promise<HiddenJob> {
    const [created] = await db.insert(hiddenJobs).values(job).returning();
    return created;
  }

  async updateHiddenJob(id: number, updates: Partial<InsertHiddenJob>): Promise<HiddenJob> {
    const [job] = await db
      .update(hiddenJobs)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(hiddenJobs.id, id))
      .returning();
    return job;
  }

  async deleteHiddenJob(id: number): Promise<void> {
    await db.delete(hiddenJobs).where(eq(hiddenJobs.id, id));
  }

  async incrementHiddenJobClicks(id: number): Promise<void> {
    await db
      .update(hiddenJobs)
      .set({ clicks: sql`${hiddenJobs.clicks} + 1`, updatedAt: new Date() })
      .where(eq(hiddenJobs.id, id));
  }

  async createHiddenJobApplication(application: InsertHiddenJobApplication): Promise<HiddenJobApplication> {
    const [created] = await db.insert(hiddenJobApplications).values(application).returning();
    return created;
  }
}

export const storage = new DatabaseStorage();
