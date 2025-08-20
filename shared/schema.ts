import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  decimal,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table - supports multiple roles
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  role: varchar("role", { length: 20 }).notNull().default("job_seeker"), // job_seeker, employer, admin
  profileImageUrl: varchar("profile_image_url", { length: 500 }),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Job seeker profiles
export const jobSeekerProfiles = pgTable("job_seeker_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  preferredRole: varchar("preferred_role", { length: 100 }),
  location: varchar("location", { length: 200 }),
  experience: varchar("experience", { length: 50 }),
  education: varchar("education", { length: 200 }),
  skills: jsonb("skills").$type<string[]>().default([]),
  portfolioProjects: jsonb("portfolio_projects").$type<{ name: string; url: string; description: string }[]>().default([]),
  profileStrength: integer("profile_strength").default(0),
  discRedPercentage: decimal("disc_red_percentage", { precision: 5, scale: 2 }).default("0.00"),
  discYellowPercentage: decimal("disc_yellow_percentage", { precision: 5, scale: 2 }).default("0.00"),
  discGreenPercentage: decimal("disc_green_percentage", { precision: 5, scale: 2 }).default("0.00"),
  discBluePercentage: decimal("disc_blue_percentage", { precision: 5, scale: 2 }).default("0.00"),
  assessmentCompleted: boolean("assessment_completed").default(false),
  assessmentValidityScore: decimal("assessment_validity_score", { precision: 5, scale: 2 }),
  assessmentConsistencyScore: decimal("assessment_consistency_score", { precision: 5, scale: 2 }),
  assessmentSocialDesirabilityScore: decimal("assessment_social_desirability_score", { precision: 5, scale: 2 }),
  assessmentCompletedAt: timestamp("assessment_completed_at"),
  assessmentRetakes: integer("assessment_retakes").default(0),
  totalPoints: integer("total_points").default(0),
  

});

// Notifications table for employers
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // new_match, feedback_reminder, interview_reminder, etc.
  title: varchar("title", { length: 200 }).notNull(),
  message: text("message").notNull(),
  jobId: integer("job_id"), // Reference to related job
  jobTitle: varchar("job_title", { length: 200 }),
  candidateId: integer("candidate_id"), // Reference to related candidate
  candidateName: varchar("candidate_name", { length: 200 }),
  isRead: boolean("is_read").default(false),
  priority: varchar("priority", { length: 20 }).default("normal"), // low, normal, high, urgent
  actionRequired: boolean("action_required").default(false),
  actionUrl: varchar("action_url", { length: 500 }),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Saved jobs table
export const savedJobs = pgTable("saved_jobs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  jobId: varchar("job_id", { length: 100 }).notNull(),
  jobTitle: varchar("job_title", { length: 200 }).notNull(),
  companyName: varchar("company_name", { length: 200 }).notNull(),
  savedAt: timestamp("saved_at").defaultNow(),
});

// Saved companies table
export const savedCompanies = pgTable("saved_companies", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  companyId: varchar("company_id", { length: 100 }).notNull(),
  companyName: varchar("company_name", { length: 200 }).notNull(),
  savedAt: timestamp("saved_at").defaultNow(),
});

// Job seeker enhanced profile fields
export const jobSeekerProfileExtensions = pgTable("job_seeker_profile_extensions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  bio: text("bio"),
  personalInterests: jsonb("personal_interests").$type<string[]>().default([]),
  motivations: jsonb("motivations").$type<string[]>().default([]),
  careerGoals: text("career_goals"),
  achievements: jsonb("achievements").$type<string[]>().default([]),
  badges: jsonb("badges").$type<string[]>().default([]),
  skillsVerified: jsonb("skills_verified").$type<string[]>().default([]),
  skillsScore: integer("skills_score").default(0),
  behavioralScore: integer("behavioral_score").default(0),
  // Job search preferences
  lookingForJobSince: timestamp("looking_for_job_since"),
  jobSearchStatus: varchar("job_search_status", { length: 50 }).default("actively_looking"), // actively_looking, passively_looking, not_looking
  preferredStartDate: timestamp("preferred_start_date"),
  salaryExpectation: decimal("salary_expectation", { precision: 10, scale: 2 }),
  // Demographics for insights
  ageRange: varchar("age_range", { length: 20 }),
  hasDisability: boolean("has_disability").default(false),
  disabilitySupport: text("disability_support"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Employer profiles
export const employerProfiles = pgTable("employer_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  companyName: varchar("company_name", { length: 200 }).notNull(),
  companySize: varchar("company_size", { length: 50 }),
  industry: varchar("industry", { length: 100 }),
  industries: jsonb("industries").$type<string[]>().default([]),
  companyDescription: text("company_description"),
  website: varchar("website", { length: 255 }),
  logo: varchar("logo", { length: 500 }),
  location: varchar("location", { length: 200 }),
  // Enhanced profile fields
  about: text("about"),
  mission: text("mission"),
  values: jsonb("values").$type<string[]>().default([]),
  culture: text("culture"),
  companyStatement: text("company_statement"),
  benefits: jsonb("benefits").$type<string[]>().default([]),
  workEnvironment: text("work_environment"),
  diversityCommitment: text("diversity_commitment"),
  // Save and completion status
  setupStatus: varchar("setup_status", { length: 20 }).default("draft"), // draft, completed
  setupStep: integer("setup_step").default(1),
  setupData: jsonb("setup_data"),
  // Rating fields
  overallRating: decimal("overall_rating", { precision: 3, scale: 2 }).default("0"),
  cultureRating: decimal("culture_rating", { precision: 3, scale: 2 }).default("0"),
  benefitsRating: decimal("benefits_rating", { precision: 3, scale: 2 }).default("0"),
  managementRating: decimal("management_rating", { precision: 3, scale: 2 }).default("0"),
  glassdoorRating: decimal("glassdoor_rating", { precision: 3, scale: 2 }),
  glassdoorUrl: varchar("glassdoor_url", { length: 500 }),
  // Contact info
  contactEmail: varchar("contact_email", { length: 255 }),
  contactPhone: varchar("contact_phone", { length: 50 }),
  // Additional profile fields
  foundedYear: varchar("founded_year", { length: 4 }),
  remotePolicy: varchar("remote_policy", { length: 100 }),
  careersPage: varchar("careers_page", { length: 500 }),
  techStack: jsonb("tech_stack").$type<string[]>().default([]),
  perks: jsonb("perks").$type<string[]>().default([]),
  programmes: jsonb("programmes").$type<string[]>().default([]),
  initiatives: jsonb("initiatives").$type<string[]>().default([]),
  coverImage: varchar("cover_image", { length: 500 }),
  companyPhotos: jsonb("company_photos").$type<string[]>().default([]),
  linkedinPage: varchar("linkedin_page", { length: 500 }),
  // Additional rating fields
  workLifeBalance: decimal("work_life_balance", { precision: 3, scale: 2 }).default("0"),
  careerGrowth: decimal("career_growth", { precision: 3, scale: 2 }).default("0"),
  compensationRating: decimal("compensation_rating", { precision: 3, scale: 2 }).default("0"),
  diversityScore: decimal("diversity_score", { precision: 3, scale: 2 }).default("0"),
  innovationScore: decimal("innovation_score", { precision: 3, scale: 2 }).default("0"),
  stabilityScore: decimal("stability_score", { precision: 3, scale: 2 }).default("0"),
  // Candidate experience ratings
  feedbackQualityRating: decimal("feedback_quality_rating", { precision: 3, scale: 2 }).default("4.8"),
  communicationSpeedRating: decimal("communication_speed_rating", { precision: 3, scale: 2 }).default("4.9"),
  interviewExperienceRating: decimal("interview_experience_rating", { precision: 3, scale: 2 }).default("4.7"),
  processTransparencyRating: decimal("process_transparency_rating", { precision: 3, scale: 2 }).default("4.6"),
  totalReviews: integer("total_reviews").default(23),
  // Employee testimonials
  youngestEmployeeTestimonial: text("youngest_employee_testimonial"),
  youngestEmployeeName: varchar("youngest_employee_name", { length: 100 }),
  youngestEmployeeRole: varchar("youngest_employee_role", { length: 100 }),
  // Pollen team observations
  pollenObservations: text("pollen_observations"),
  observationsCompleted: boolean("observations_completed").default(false),
  reviewedAt: timestamp("reviewed_at"),
  // Approval status
  approvalStatus: varchar("approval_status", { length: 20 }).default("pending"), // pending, approved, rejected
  approvedAt: timestamp("approved_at"),
  approvedBy: integer("approved_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Testimonial requests table
export const testimonialRequests = pgTable("testimonial_requests", {
  id: serial("id").primaryKey(),
  employerId: integer("employer_id").references(() => employerProfiles.id).notNull(),
  recipientEmail: varchar("recipient_email", { length: 255 }).notNull(),
  recipientName: varchar("recipient_name", { length: 100 }).notNull(),
  recipientRole: varchar("recipient_role", { length: 100 }),
  companyName: varchar("company_name", { length: 200 }).notNull(),
  requestorName: varchar("requestor_name", { length: 100 }).notNull(),
  customMessage: text("custom_message"),
  status: varchar("status", { length: 20 }).default("sent"), // sent, responded, expired
  requestToken: varchar("request_token", { length: 100 }).unique().notNull(),
  sentAt: timestamp("sent_at").defaultNow(),
  respondedAt: timestamp("responded_at"),
  expiresAt: timestamp("expires_at"), // 30 days from sent
  remindersSent: integer("reminders_sent").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Jobs/Opportunities
export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  employerId: integer("employer_id").references(() => employerProfiles.id).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description").notNull(),
  location: varchar("location", { length: 100 }),
  isRemote: boolean("is_remote").default(false),
  workArrangement: varchar("work_arrangement", { length: 50 }).default("office"), // office, remote, hybrid
  salaryMin: decimal("salary_min", { precision: 10, scale: 2 }),
  salaryMax: decimal("salary_max", { precision: 10, scale: 2 }),
  currency: varchar("currency", { length: 10 }).default("GBP"),
  salaryPeriod: varchar("salary_period", { length: 20 }).default("annual"), // annual, monthly, hourly
  requiredSkills: jsonb("required_skills").$type<string[]>().default([]),
  preferredSkills: jsonb("preferred_skills").$type<string[]>().default([]),
  requiredBehavioral: jsonb("required_behavioral").$type<string[]>().default([]),
  preferredBehavioral: jsonb("preferred_behavioral").$type<string[]>().default([]),
  experienceLevel: varchar("experience_level", { length: 50 }),
  department: varchar("department", { length: 100 }),
  employmentType: varchar("employment_type", { length: 50 }).default("full_time"), // full_time, part_time, contract, internship
  contractDuration: integer("contract_duration"), // Duration in months, null for permanent
  contractType: varchar("contract_type", { length: 30 }).default("permanent"), // temporary, permanent
  companySize: varchar("company_size", { length: 30 }), // micro, small, medium, large
  employeeCount: integer("employee_count"), // Actual number for more precise sizing
  benefits: jsonb("benefits").$type<string[]>().default([]),
  requirements: text("requirements"),
  responsibilities: text("responsibilities"),
  companyBenefits: text("company_benefits"),
  tier: varchar("tier", { length: 20 }).default("basic"), // basic, premium, enterprise
  hasSkillsChallenge: boolean("has_skills_challenge").default(false),
  status: varchar("status", { length: 20 }).default("draft"), // draft, active, paused, closed
  challengeId: integer("challenge_id").references(() => challenges.id),
  applicationDeadline: timestamp("application_deadline"),
  startDate: timestamp("start_date"),
  // Admin review fields
  reviewStatus: varchar("review_status", { length: 20 }).default("pending"),
  reviewData: jsonb("review_data"),
  assessmentReviewData: jsonb("assessment_review_data"),
  assessmentStatus: varchar("assessment_status", { length: 20 }).default("pending"),
  checkpointData: jsonb("checkpoint_data"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Skills challenges
export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description").notNull(),
  instructions: text("instructions").notNull(),
  difficulty: varchar("difficulty", { length: 20 }).notNull(), // beginner, intermediate, advanced
  estimatedTime: varchar("estimated_time", { length: 50 }),
  skills: jsonb("skills").$type<string[]>().default([]),
  maxScore: integer("max_score").default(100),
  isActive: boolean("is_active").default(true),
  usageCount: integer("usage_count").default(0),
  averageScore: decimal("average_score", { precision: 5, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Job applications
export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").references(() => jobs.id).notNull(),
  jobSeekerId: integer("job_seeker_id").references(() => jobSeekerProfiles.id).notNull(),
  status: varchar("status", { length: 30 }).default("applied"), // applied, screening, challenge_sent, challenge_completed, interview, offer, hired, rejected
  matchScore: decimal("match_score", { precision: 5, scale: 2 }),
  notes: text("notes"),
  submittedAt: timestamp("submitted_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Challenge submissions
export const challengeSubmissions = pgTable("challenge_submissions", {
  id: serial("id").primaryKey(),
  applicationId: integer("application_id").references(() => applications.id).notNull(),
  challengeId: integer("challenge_id").references(() => challenges.id).notNull(),
  submissionUrl: varchar("submission_url", { length: 500 }),
  submissionText: text("submission_text"),
  score: integer("score"),
  feedback: text("feedback"),
  reviewedBy: integer("reviewed_by").references(() => users.id),
  submittedAt: timestamp("submitted_at").defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
});

// NEW ACCOUNTABILITY SYSTEM TABLES

// Employer feedback on candidates - MANDATORY for progression
export const employerFeedback = pgTable("employer_feedback", {
  id: serial("id").primaryKey(),
  applicationId: integer("application_id").references(() => applications.id).notNull(),
  employerId: integer("employer_id").references(() => employerProfiles.id).notNull(),
  jobId: integer("job_id").references(() => jobs.id).notNull(),
  candidateId: integer("candidate_id").references(() => jobSeekerProfiles.id).notNull(),
  
  // Mandatory feedback fields
  decision: varchar("decision", { length: 20 }).notNull(), // progress, reject, need_more_candidates
  overallScore: integer("overall_score").notNull(), // 1-10 uniform scoring
  skillsScore: integer("skills_score").notNull(), // 1-10
  behaviouralScore: integer("behavioural_score").notNull(), // 1-10
  culturalFitScore: integer("cultural_fit_score").notNull(), // 1-10
  
  // Detailed feedback
  strengths: text("strengths").notNull(),
  concerns: text("concerns"),
  specificFeedback: text("specific_feedback").notNull(),
  interviewTopics: text("interview_topics"), // If progressing to interview
  
  // Accountability tracking
  stage: varchar("stage", { length: 30 }).notNull(), // profile_review, interview, final_decision
  reasonForRejection: varchar("reason_for_rejection", { length: 100 }),
  improvementSuggestions: text("improvement_suggestions"),
  
  // Review status by Pollen team
  reviewStatus: varchar("review_status", { length: 20 }).default("pending"), // pending, approved, needs_revision, rejected
  reviewedBy: integer("reviewed_by").references(() => users.id),
  reviewNotes: text("review_notes"),
  reviewedAt: timestamp("reviewed_at"),
  
  // Feedback delivery tracking
  deliveredToCandidate: boolean("delivered_to_candidate").default(false),
  deliveredAt: timestamp("delivered_at"),
  candidateViewed: boolean("candidate_viewed").default(false),
  candidateViewedAt: timestamp("candidate_viewed_at"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Employer accountability tracking
export const employerAccountability = pgTable("employer_accountability", {
  id: serial("id").primaryKey(),
  employerId: integer("employer_id").references(() => employerProfiles.id).notNull(),
  
  // Feedback compliance metrics
  totalCandidatesReviewed: integer("total_candidates_reviewed").default(0),
  feedbackProvided: integer("feedback_provided").default(0),
  feedbackComplianceRate: decimal("feedback_compliance_rate", { precision: 5, scale: 2 }).default("100.00"),
  
  // Quality metrics
  averageOverallScore: decimal("average_overall_score", { precision: 4, scale: 2 }),
  averageSkillsScore: decimal("average_skills_score", { precision: 4, scale: 2 }),
  averageBehaviouralScore: decimal("average_behavioural_score", { precision: 4, scale: 2 }),
  averageCulturalScore: decimal("average_cultural_score", { precision: 4, scale: 2 }),
  
  // Feedback quality scores (rated by Pollen team)
  feedbackQualityScore: decimal("feedback_quality_score", { precision: 4, scale: 2 }),
  constructivenesScore: decimal("constructiveness_score", { precision: 4, scale: 2 }),
  specificityScore: decimal("specificity_score", { precision: 4, scale: 2 }),
  
  // Warning system
  warningLevel: varchar("warning_level", { length: 20 }).default("green"), // green, yellow, red
  warningCount: integer("warning_count").default(0),
  lastWarningDate: timestamp("last_warning_date"),
  warningReason: text("warning_reason"),
  
  // Job posting restrictions
  jobPostingRestricted: boolean("job_posting_restricted").default(false),
  restrictionReason: text("restriction_reason"),
  restrictionStartDate: timestamp("restriction_start_date"),
  restrictionEndDate: timestamp("restriction_end_date"),
  restrictedBy: integer("restricted_by").references(() => users.id),
  
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Job blocking/pausing system
export const jobRestrictions = pgTable("job_restrictions", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").references(() => jobs.id).notNull(),
  employerId: integer("employer_id").references(() => employerProfiles.id).notNull(),
  
  // Restriction details
  restrictionType: varchar("restriction_type", { length: 30 }).notNull(), // blocked, paused, under_review
  reason: text("reason").notNull(),
  severity: varchar("severity", { length: 20 }).notNull(), // low, medium, high, critical
  
  // Actions required
  actionsRequired: jsonb("actions_required").$type<string[]>().default([]),
  complianceDeadline: timestamp("compliance_deadline"),
  
  // Review tracking
  appliedBy: integer("applied_by").references(() => users.id).notNull(),
  reviewedBy: integer("reviewed_by").references(() => users.id),
  
  // Status tracking
  isActive: boolean("is_active").default(true),
  resolvedAt: timestamp("resolved_at"),
  resolutionNotes: text("resolution_notes"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Candidate shortlists managed by Pollen team
export const candidateShortlists = pgTable("candidate_shortlists", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").references(() => jobs.id).notNull(),
  employerId: integer("employer_id").references(() => employerProfiles.id).notNull(),
  
  // Shortlist metadata
  batchNumber: integer("batch_number").default(1),
  totalCandidates: integer("total_candidates").notNull(),
  presentedCandidates: integer("presented_candidates").notNull(),
  
  // Pollen team summary
  pollenSummary: text("pollen_summary").notNull(),
  matchingNotes: text("matching_notes"),
  recommendedNextSteps: text("recommended_next_steps"),
  
  // Status tracking
  status: varchar("status", { length: 20 }).default("presented"), // presented, under_review, feedback_pending, completed
  employerViewedAt: timestamp("employer_viewed_at"),
  feedbackDeadline: timestamp("feedback_deadline"),
  
  // Quality metrics
  averageMatchScore: decimal("average_match_score", { precision: 5, scale: 2 }),
  skillsAlignment: decimal("skills_alignment", { precision: 5, scale: 2 }),
  behaviouralAlignment: decimal("behavioural_alignment", { precision: 5, scale: 2 }),
  
  // Created by Pollen team
  createdBy: integer("created_by").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Workflow tracking for admin
export const workflows = pgTable("workflows", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").references(() => jobs.id).notNull(),
  currentStage: varchar("current_stage", { length: 30 }).default("applications"),
  totalStages: integer("total_stages").default(5),
  progress: decimal("progress", { precision: 5, scale: 2 }).default("0"),
  status: varchar("status", { length: 20 }).default("active"), // active, paused, completed
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Employer applications for approval workflow
export const employerApplications = pgTable("employer_applications", {
  id: serial("id").primaryKey(),
  companyName: varchar("company_name", { length: 200 }).notNull(),
  companySize: varchar("company_size", { length: 50 }).notNull(),
  industries: jsonb("industries").$type<string[]>().default([]).notNull(),
  location: varchar("location", { length: 100 }).notNull(),
  website: varchar("website", { length: 300 }).notNull(),
  contactEmail: varchar("contact_email", { length: 200 }).notNull(),
  contactName: varchar("contact_name", { length: 100 }).notNull(),
  contactRole: varchar("contact_role", { length: 100 }).notNull(),
  contactPhone: varchar("contact_phone", { length: 50 }),
  companyDescription: text("company_description").notNull(),
  whyPollen: text("why_pollen").notNull(),
  hiringVolume: varchar("hiring_volume", { length: 50 }).notNull(),
  howDidYouHear: varchar("how_did_you_hear", { length: 50 }).notNull(),
  diversity: boolean("diversity").default(false),
  remote: boolean("remote").default(false),
  glassdoorRating: varchar("glassdoor_rating", { length: 10 }),
  linkedinUrl: varchar("linkedin_url", { length: 300 }),
  status: varchar("status", { length: 20 }).default("pending"), // pending, approved, rejected
  reviewedBy: integer("reviewed_by").references(() => users.id),
  reviewNotes: text("review_notes"),
  submittedAt: timestamp("submitted_at").defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
});

// Job seeker onboarding responses
export const onboardingResponses = pgTable("onboarding_responses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  careerGoals: text("career_goals"),
  experienceLevel: varchar("experience_level", { length: 50 }),
  preferredIndustries: jsonb("preferred_industries").$type<string[]>().default([]),
  skillsToLearn: jsonb("skills_to_learn").$type<string[]>().default([]),
  workEnvironmentPrefs: jsonb("work_environment_prefs").$type<string[]>().default([]),
  challengeAreas: jsonb("challenge_areas").$type<string[]>().default([]),
  motivations: jsonb("motivations").$type<string[]>().default([]),
  completedAt: timestamp("completed_at").defaultNow(),
});

// Application feedback and outcome tracking
export const applicationOutcomes = pgTable("application_outcomes", {
  id: serial("id").primaryKey(),
  applicationId: integer("application_id").references(() => applications.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  employerId: integer("employer_id").references(() => employerProfiles.id).notNull(),
  jobId: integer("job_id").references(() => jobs.id).notNull(),
  
  // Final outcome
  finalOutcome: varchar("final_outcome", { length: 30 }).notNull(), // hired, rejected, withdrawn, offer_declined
  outcomeStage: varchar("outcome_stage", { length: 30 }).notNull(), // application_review, challenge, interview, offer
  outcomeDate: timestamp("outcome_date").notNull(),
  
  // Job acceptance details (if hired)
  jobAccepted: boolean("job_accepted").default(false),
  startDate: timestamp("start_date"),
  actualSalary: decimal("actual_salary", { precision: 10, scale: 2 }),
  employmentType: varchar("employment_type", { length: 50 }),
  
  // 6-month follow-up
  stillEmployed: boolean("still_employed"),
  employmentEndDate: timestamp("employment_end_date"),
  employmentEndReason: varchar("employment_end_reason", { length: 50 }), // voluntary, involuntary, contract_end
  
  // Internal tracking
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Candidate experience feedback
export const candidateExperienceFeedback = pgTable("candidate_experience_feedback", {
  id: serial("id").primaryKey(),
  applicationId: integer("application_id").references(() => applications.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  employerId: integer("employer_id").references(() => employerProfiles.id).notNull(),
  jobId: integer("job_id").references(() => jobs.id).notNull(),
  
  // Experience ratings (1-5 scale)
  feedbackQuality: integer("feedback_quality"), // How helpful was the feedback?
  communicationSpeed: integer("communication_speed"), // How quickly did they respond?
  interviewExperience: integer("interview_experience"), // How was the interview process?
  processTransparency: integer("process_transparency"), // How clear was the process?
  overallExperience: integer("overall_experience"), // Overall experience rating
  
  // Likelihood to recommend
  recommendToFriend: integer("recommend_to_friend"), // 1-10 NPS style
  
  // Qualitative feedback
  bestAspect: text("best_aspect"), // What did you enjoy most?
  worstAspect: text("worst_aspect"), // What could be improved?
  additionalComments: text("additional_comments"),
  
  // Outcome-specific feedback
  outcomeStage: varchar("outcome_stage", { length: 30 }), // When they provided feedback
  wouldApplyAgain: boolean("would_apply_again"), // Would you apply to this company again?
  
  // Feedback request tracking
  requestedAt: timestamp("requested_at"),
  completedAt: timestamp("completed_at"),
  remindersSent: integer("reminders_sent").default(0),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Company rating updates from feedback
export const companyRatingUpdates = pgTable("company_rating_updates", {
  id: serial("id").primaryKey(),
  employerId: integer("employer_id").references(() => employerProfiles.id).notNull(),
  feedbackId: integer("feedback_id").references(() => candidateExperienceFeedback.id).notNull(),
  
  // Rating changes
  previousFeedbackQuality: decimal("previous_feedback_quality", { precision: 3, scale: 2 }),
  newFeedbackQuality: decimal("new_feedback_quality", { precision: 3, scale: 2 }),
  previousCommunicationSpeed: decimal("previous_communication_speed", { precision: 3, scale: 2 }),
  newCommunicationSpeed: decimal("new_communication_speed", { precision: 3, scale: 2 }),
  previousInterviewExperience: decimal("previous_interview_experience", { precision: 3, scale: 2 }),
  newInterviewExperience: decimal("new_interview_experience", { precision: 3, scale: 2 }),
  previousProcessTransparency: decimal("previous_process_transparency", { precision: 3, scale: 2 }),
  newProcessTransparency: decimal("new_process_transparency", { precision: 3, scale: 2 }),
  
  // Total reviews count
  totalReviewsAfterUpdate: integer("total_reviews_after_update"),
  
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Success stories and impact tracking
export const successStories = pgTable("success_stories", {
  id: serial("id").primaryKey(),
  applicationId: integer("application_id").references(() => applications.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  employerId: integer("employer_id").references(() => employerProfiles.id).notNull(),
  jobId: integer("job_id").references(() => jobs.id).notNull(),
  
  // Story details
  candidateName: varchar("candidate_name", { length: 100 }),
  jobTitle: varchar("job_title", { length: 200 }),
  companyName: varchar("company_name", { length: 200 }),
  
  // Journey metrics
  applicationDate: timestamp("application_date"),
  hiredDate: timestamp("hired_date"),
  daysToPlacer: integer("days_to_placement"),
  
  // Impact metrics
  salaryIncrease: decimal("salary_increase", { precision: 10, scale: 2 }), // vs previous/expected
  careerProgression: text("career_progression"), // How this role advanced their career
  
  // Story content
  candidateQuote: text("candidate_quote"), // Their experience story
  challengeOvercome: text("challenge_overcome"), // What barrier did Pollen help overcome?
  uniqueValue: text("unique_value"), // What made this placement special?
  
  // Publishing
  publishedOnWebsite: boolean("published_on_website").default(false),
  publishedOnSocial: boolean("published_on_social").default(false),
  candidateConsented: boolean("candidate_consented").default(false),
  
  // Follow-up tracking
  sixMonthFollowUp: boolean("six_month_follow_up").default(false),
  oneYearFollowUp: boolean("one_year_follow_up").default(false),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Calendly integrations table
export const calendlyIntegrations = pgTable("calendly_integrations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token"),
  calendlyUserId: varchar("calendly_user_id", { length: 255 }).notNull(),
  organizationUri: varchar("organization_uri", { length: 500 }).notNull(),
  webhookUri: varchar("webhook_uri", { length: 500 }),
  eventTypeUris: jsonb("event_type_uris").$type<string[]>().default([]),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Scheduled interviews table
export const scheduledInterviews = pgTable("scheduled_interviews", {
  id: serial("id").primaryKey(),
  applicationId: varchar("application_id", { length: 50 }).notNull(),
  calendlyEventUri: varchar("calendly_event_uri", { length: 500 }).notNull().unique(),
  scheduledAt: timestamp("scheduled_at").notNull(),
  interviewerEmail: varchar("interviewer_email", { length: 255 }).notNull(),
  candidateEmail: varchar("candidate_email", { length: 255 }).notNull(),
  candidateName: varchar("candidate_name", { length: 200 }),
  eventTypeUri: varchar("event_type_uri", { length: 500 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("scheduled"), // scheduled, completed, canceled, no_show
  meetingUrl: varchar("meeting_url", { length: 500 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const userRelations = relations(users, ({ one, many }) => ({
  jobSeekerProfile: one(jobSeekerProfiles, {
    fields: [users.id],
    references: [jobSeekerProfiles.userId],
  }),
  employerProfile: one(employerProfiles, {
    fields: [users.id],
    references: [employerProfiles.userId],
  }),
  notifications: many(notifications),
}));

export const notificationRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const jobSeekerProfileRelations = relations(jobSeekerProfiles, ({ one, many }) => ({
  user: one(users, {
    fields: [jobSeekerProfiles.userId],
    references: [users.id],
  }),
  applications: many(applications),
}));

export const employerProfileRelations = relations(employerProfiles, ({ one, many }) => ({
  user: one(users, {
    fields: [employerProfiles.userId],
    references: [users.id],
  }),
  jobs: many(jobs),
}));

export const jobRelations = relations(jobs, ({ one, many }) => ({
  employer: one(employerProfiles, {
    fields: [jobs.employerId],
    references: [employerProfiles.id],
  }),
  challenge: one(challenges, {
    fields: [jobs.challengeId],
    references: [challenges.id],
  }),
  applications: many(applications),
  workflow: one(workflows),
}));

export const challengeRelations = relations(challenges, ({ many }) => ({
  jobs: many(jobs),
  submissions: many(challengeSubmissions),
}));

export const applicationRelations = relations(applications, ({ one, many }) => ({
  job: one(jobs, {
    fields: [applications.jobId],
    references: [jobs.id],
  }),
  jobSeeker: one(jobSeekerProfiles, {
    fields: [applications.jobSeekerId],
    references: [jobSeekerProfiles.id],
  }),
  challengeSubmissions: many(challengeSubmissions),
}));

export const challengeSubmissionRelations = relations(challengeSubmissions, ({ one }) => ({
  application: one(applications, {
    fields: [challengeSubmissions.applicationId],
    references: [applications.id],
  }),
  challenge: one(challenges, {
    fields: [challengeSubmissions.challengeId],
    references: [challenges.id],
  }),
  reviewer: one(users, {
    fields: [challengeSubmissions.reviewedBy],
    references: [users.id],
  }),
}));

export const workflowRelations = relations(workflows, ({ one }) => ({
  job: one(jobs, {
    fields: [workflows.jobId],
    references: [jobs.id],
  }),
}));

export const employerApplicationRelations = relations(employerApplications, ({ one }) => ({
  reviewer: one(users, {
    fields: [employerApplications.reviewedBy],
    references: [users.id],
  }),
}));

export const onboardingResponseRelations = relations(onboardingResponses, ({ one }) => ({
  user: one(users, {
    fields: [onboardingResponses.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertJobSeekerProfileSchema = createInsertSchema(jobSeekerProfiles).omit({
  id: true,
});

export const insertEmployerProfileSchema = createInsertSchema(employerProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertChallengeSchema = createInsertSchema(challenges).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  submittedAt: true,
  updatedAt: true,
});

export const insertChallengeSubmissionSchema = createInsertSchema(challengeSubmissions).omit({
  id: true,
  submittedAt: true,
  reviewedAt: true,
});

export const insertWorkflowSchema = createInsertSchema(workflows).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEmployerApplicationSchema = createInsertSchema(employerApplications).omit({
  id: true,
  submittedAt: true,
  reviewedAt: true,
});

export const insertOnboardingResponseSchema = createInsertSchema(onboardingResponses).omit({
  id: true,
  completedAt: true,
});

export const insertSavedCompanySchema = createInsertSchema(savedCompanies).omit({
  id: true,
  savedAt: true,
});

export const onboardingCheckpoints = pgTable("onboarding_checkpoints", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  checkpointId: varchar("checkpoint_id", { length: 100 }).notNull(),
  phase: varchar("phase", { length: 20 }).notNull(), // 'profile', 'preferences', 'optional'
  data: text("data").notNull(), // JSON string of checkpoint data
  completedAt: timestamp("completed_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertOnboardingCheckpointSchema = createInsertSchema(onboardingCheckpoints).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type OnboardingCheckpoint = typeof onboardingCheckpoints.$inferSelect;
export type InsertOnboardingCheckpoint = z.infer<typeof insertOnboardingCheckpointSchema>;

export type JobSeekerProfile = typeof jobSeekerProfiles.$inferSelect;
export type InsertJobSeekerProfile = z.infer<typeof insertJobSeekerProfileSchema>;

export type EmployerProfile = typeof employerProfiles.$inferSelect;
export type InsertEmployerProfile = z.infer<typeof insertEmployerProfileSchema>;

export type Job = typeof jobs.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;

export type SavedCompany = typeof savedCompanies.$inferSelect;
export type InsertSavedCompany = z.infer<typeof insertSavedCompanySchema>;

export type Challenge = typeof challenges.$inferSelect;
export type InsertChallenge = z.infer<typeof insertChallengeSchema>;

export type Application = typeof applications.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;

export type ChallengeSubmission = typeof challengeSubmissions.$inferSelect;
export type InsertChallengeSubmission = z.infer<typeof insertChallengeSubmissionSchema>;

export type Workflow = typeof workflows.$inferSelect;
export type InsertWorkflow = z.infer<typeof insertWorkflowSchema>;

export type EmployerApplication = typeof employerApplications.$inferSelect;
export type InsertEmployerApplication = z.infer<typeof insertEmployerApplicationSchema>;

export type OnboardingResponse = typeof onboardingResponses.$inferSelect;
export type InsertOnboardingResponse = z.infer<typeof insertOnboardingResponseSchema>;

// NEW ATS INSERT SCHEMAS
export const insertEmployerFeedbackSchema = createInsertSchema(employerFeedback).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEmployerAccountabilitySchema = createInsertSchema(employerAccountability).omit({
  id: true,
  updatedAt: true,
});

export const insertJobRestrictionSchema = createInsertSchema(jobRestrictions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCandidateShortlistSchema = createInsertSchema(candidateShortlists).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// NEW ATS TYPES
export type EmployerFeedback = typeof employerFeedback.$inferSelect;
export type InsertEmployerFeedback = z.infer<typeof insertEmployerFeedbackSchema>;
export type EmployerAccountability = typeof employerAccountability.$inferSelect;
export type InsertEmployerAccountability = z.infer<typeof insertEmployerAccountabilitySchema>;
export type CandidateShortlist = typeof candidateShortlists.$inferSelect;
export type InsertCandidateShortlist = z.infer<typeof insertCandidateShortlistSchema>;
export type JobRestriction = typeof jobRestrictions.$inferSelect;
export type InsertJobRestriction = z.infer<typeof insertJobRestrictionSchema>;

// Saved employer profile checkpoints
export const savedProfiles = pgTable('saved_profiles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  profileData: jsonb('profile_data').$type<any>(),
  step: integer('step').default(0),
  isComplete: boolean('is_complete').default(false),
  lastSaved: timestamp('last_saved').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Team member access for employers
export const teamMembers = pgTable('team_members', {
  id: serial('id').primaryKey(),
  companyId: integer('company_id').references(() => employerProfiles.id).notNull(),
  userId: integer('user_id').references(() => users.id), // null for pending invitations
  email: varchar('email', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  jobTitle: varchar('job_title', { length: 200 }), // their role at the company
  role: varchar('role', { length: 50 }).notNull(), // 'owner', 'admin', 'hiring_manager', 'recruiter', 'interviewer'
  status: varchar('status', { length: 20 }).default('pending'), // 'pending', 'active', 'suspended', 'removed'
  permissions: jsonb('permissions').$type<{
    viewApplications: boolean;
    reviewCandidates: boolean;
    scheduleInterviews: boolean;
    provideFeedback: boolean;
    manageJobs: boolean;
    manageTeam: boolean;
    viewBilling: boolean;
    manageSettings: boolean;
  }>().default({
    viewApplications: false,
    reviewCandidates: false,
    scheduleInterviews: false,
    provideFeedback: false,
    manageJobs: false,
    manageTeam: false,
    viewBilling: false,
    manageSettings: false
  }),
  invitedBy: integer('invited_by').references(() => users.id),
  invitedAt: timestamp('invited_at').defaultNow(),
  activatedAt: timestamp('activated_at'),
  lastActiveAt: timestamp('last_active_at'),
  inviteToken: varchar('invite_token', { length: 100 }), // for pending invitations
  inviteExpiresAt: timestamp('invite_expires_at'),
  personalMessage: text('personal_message'), // message from inviter
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Insert schemas for new tables
export const insertSavedProfileSchema = createInsertSchema(savedProfiles).omit({
  id: true,
  createdAt: true,
});

export const insertTeamMemberSchema = createInsertSchema(teamMembers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Notification schema and types
export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Hidden Jobs Board Schema
export const hiddenJobs = pgTable("hidden_jobs", {
  id: serial("id").primaryKey(),
  role: text("role").notNull(),
  company: text("company").notNull(),
  pollenApproved: boolean("pollen_approved").default(false),
  companyPage: text("company_page"),
  industries: jsonb("industries").$type<string[]>().default([]),
  location: text("location").notNull(),
  contractTypes: jsonb("contract_types").$type<string[]>().default([]),
  salary: text("salary"),
  applicationDeadline: timestamp("application_deadline"),
  applicationLink: text("application_link"),
  description: text("description"),
  requirements: text("requirements"),
  benefits: text("benefits"),
  isActive: boolean("is_active").default(true),
  featured: boolean("featured").default(false),
  clicks: integer("clicks").default(0),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const hiddenJobApplications = pgTable("hidden_job_applications", {
  id: serial("id").primaryKey(),
  hiddenJobId: integer("hidden_job_id").references(() => hiddenJobs.id),
  userId: integer("user_id").references(() => users.id),
  status: text("status").default("applied"), // "applied", "viewed", "shortlisted", "rejected"
  appliedAt: timestamp("applied_at").defaultNow(),
  notes: text("notes")
});

// Hidden job schemas
export const insertHiddenJobSchema = createInsertSchema(hiddenJobs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertHiddenJobApplicationSchema = createInsertSchema(hiddenJobApplications).omit({
  id: true,
  appliedAt: true,
});

// Types for new tables
export type SavedProfile = typeof savedProfiles.$inferSelect;
export type InsertSavedProfile = typeof savedProfiles.$inferInsert;
export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = typeof teamMembers.$inferInsert;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type HiddenJob = typeof hiddenJobs.$inferSelect;
export type InsertHiddenJob = z.infer<typeof insertHiddenJobSchema>;
export type HiddenJobApplication = typeof hiddenJobApplications.$inferSelect;
export type InsertHiddenJobApplication = z.infer<typeof insertHiddenJobApplicationSchema>;
