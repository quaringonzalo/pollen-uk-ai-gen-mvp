import { storage } from "./storage";
import { emailNotificationService } from "./email-notifications";

interface FeedbackRequest {
  applicationId: number;
  userId: number;
  employerId: number;
  jobId: number;
  outcomeStage: string;
  userEmail: string;
  userName: string;
  jobTitle: string;
  companyName: string;
}

interface OutcomeUpdate {
  applicationId: number;
  finalOutcome: "hired" | "rejected" | "withdrawn" | "offer_declined";
  outcomeStage: "application_review" | "challenge" | "interview" | "offer";
  outcomeDate: Date;
  jobAccepted?: boolean;
  startDate?: Date;
  actualSalary?: number;
  employmentType?: string;
}

interface FeedbackResponse {
  applicationId: number;
  userId: number;
  employerId: number;
  jobId: number;
  feedbackQuality: number;
  communicationSpeed: number;
  interviewExperience: number;
  processTransparency: number;
  overallExperience: number;
  recommendToFriend: number;
  bestAspect?: string;
  worstAspect?: string;
  additionalComments?: string;
  outcomeStage: string;
  wouldApplyAgain: boolean;
}

export class OutcomeTrackingService {
  /**
   * Record application outcome and trigger feedback request
   */
  async recordApplicationOutcome(outcome: OutcomeUpdate): Promise<void> {
    try {
      // Store outcome in database
      await storage.recordApplicationOutcome(outcome);
      
      // Get application details for feedback request
      const application = await storage.getApplicationById(outcome.applicationId);
      if (!application) {
        throw new Error("Application not found");
      }
      
      // Get user and employer details
      const user = await storage.getUserById(application.userId);
      const employer = await storage.getEmployerById(application.employerId);
      const job = await storage.getJobById(application.jobId);
      
      if (!user || !employer || !job) {
        throw new Error("Missing required data for feedback request");
      }
      
      // Request feedback from candidate
      await this.requestCandidateFeedback({
        applicationId: outcome.applicationId,
        userId: application.userId,
        employerId: application.employerId,
        jobId: application.jobId,
        outcomeStage: outcome.outcomeStage,
        userEmail: user.email,
        userName: `${user.firstName} ${user.lastName}`,
        jobTitle: job.title,
        companyName: employer.companyName
      });
      
      // If hired, schedule follow-up tracking
      if (outcome.finalOutcome === "hired" && outcome.jobAccepted) {
        await this.scheduleEmploymentFollowUp(outcome);
      }
      
    } catch (error) {
      console.error("Error recording application outcome:", error);
      throw error;
    }
  }
  
  /**
   * Send feedback request email to candidate
   */
  async requestCandidateFeedback(request: FeedbackRequest): Promise<void> {
    try {
      // Store feedback request in database
      await storage.createFeedbackRequest(request);
      
      // Generate feedback URL with token
      const feedbackToken = this.generateFeedbackToken(request.applicationId, request.userId);
      const feedbackUrl = `${process.env.BASE_URL}/feedback/${feedbackToken}`;
      
      // Send email based on outcome stage
      const emailTemplate = this.getFeedbackEmailTemplate(request.outcomeStage);
      
      await emailNotificationService.sendFeedbackRequestEmail(
        request.userEmail,
        request.userName,
        request.jobTitle,
        request.companyName,
        feedbackUrl
      );
      
    } catch (error) {
      console.error("Error requesting candidate feedback:", error);
      throw error;
    }
  }
  
  /**
   * Process candidate feedback and update company ratings
   */
  async processCandidateFeedback(feedback: FeedbackResponse): Promise<void> {
    try {
      // Store feedback in database
      await storage.storeCandidateFeedback(feedback);
      
      // Get current company ratings
      const currentRatings = await storage.getCompanyRatings(feedback.employerId);
      
      // Calculate new ratings
      const newRatings = this.calculateUpdatedRatings(currentRatings, feedback);
      
      // Update company ratings
      await storage.updateCompanyRatings(feedback.employerId, newRatings);
      
      // Log rating changes
      await storage.logRatingUpdate(feedback.employerId, feedback.applicationId, currentRatings, newRatings);
      
      // Check if this creates a success story
      await this.checkForSuccessStory(feedback);
      
    } catch (error) {
      console.error("Error processing candidate feedback:", error);
      throw error;
    }
  }
  
  /**
   * Schedule 6-month employment follow-up
   */
  async scheduleEmploymentFollowUp(outcome: OutcomeUpdate): Promise<void> {
    try {
      // This would integrate with a job scheduling system
      // For now, we'll log the follow-up requirement
      console.log(`Scheduling 6-month follow-up for application ${outcome.applicationId}`);
      
      // In production, this would:
      // 1. Add to job queue for 6 months from start date
      // 2. Send email to candidate asking about employment status
      // 3. Update success story metrics
      
    } catch (error) {
      console.error("Error scheduling employment follow-up:", error);
      throw error;
    }
  }
  
  /**
   * Check if successful outcome should create a success story
   */
  async checkForSuccessStory(feedback: FeedbackResponse): Promise<void> {
    try {
      // Only create success stories for hired candidates with positive experience
      if (feedback.overallExperience >= 4 && feedback.recommendToFriend >= 7) {
        const application = await storage.getApplicationById(feedback.applicationId);
        if (application) {
          // Check if outcome was "hired"
          const outcome = await storage.getApplicationOutcome(feedback.applicationId);
          if (outcome && outcome.finalOutcome === "hired") {
            await this.createSuccessStory(feedback, application, outcome);
          }
        }
      }
    } catch (error) {
      console.error("Error checking for success story:", error);
      throw error;
    }
  }
  
  /**
   * Create success story entry
   */
  async createSuccessStory(feedback: FeedbackResponse, application: any, outcome: any): Promise<void> {
    try {
      const user = await storage.getUserById(feedback.userId);
      const job = await storage.getJobById(feedback.jobId);
      const employer = await storage.getEmployerById(feedback.employerId);
      
      if (!user || !job || !employer) return;
      
      const successStory = {
        applicationId: feedback.applicationId,
        userId: feedback.userId,
        employerId: feedback.employerId,
        jobId: feedback.jobId,
        candidateName: `${user.firstName} ${user.lastName}`,
        jobTitle: job.title,
        companyName: employer.companyName,
        applicationDate: application.submittedAt,
        hiredDate: outcome.outcomeDate,
        daysToPlacer: this.calculateDaysToPlacement(application.submittedAt, outcome.outcomeDate),
        candidateQuote: feedback.bestAspect,
        challengeOvercome: feedback.additionalComments,
        actualSalary: outcome.actualSalary,
        employmentType: outcome.employmentType
      };
      
      await storage.createSuccessStory(successStory);
      
    } catch (error) {
      console.error("Error creating success story:", error);
      throw error;
    }
  }
  
  /**
   * Calculate updated company ratings based on new feedback
   */
  private calculateUpdatedRatings(currentRatings: any, newFeedback: FeedbackResponse): any {
    const totalReviews = currentRatings.totalReviews || 0;
    const newTotalReviews = totalReviews + 1;
    
    // Calculate weighted averages
    const updateRating = (currentRating: number, newRating: number): number => {
      return ((currentRating * totalReviews) + newRating) / newTotalReviews;
    };
    
    return {
      feedbackQualityRating: updateRating(currentRatings.feedbackQualityRating, newFeedback.feedbackQuality),
      communicationSpeedRating: updateRating(currentRatings.communicationSpeedRating, newFeedback.communicationSpeed),
      interviewExperienceRating: updateRating(currentRatings.interviewExperienceRating, newFeedback.interviewExperience),
      processTransparencyRating: updateRating(currentRatings.processTransparencyRating, newFeedback.processTransparency),
      totalReviews: newTotalReviews
    };
  }
  
  /**
   * Get email template based on outcome stage
   */
  private getFeedbackEmailTemplate(outcomeStage: string): { subject: string; html: string } {
    const templates = {
      application_review: {
        subject: "Help us improve - feedback on your {jobTitle} application",
        html: `
          <h2>Hi {userName},</h2>
          <p>Thank you for applying to the {jobTitle} position at {companyName} through Pollen.</p>
          <p>We'd love to hear about your experience to help us improve our platform and ensure companies provide the best candidate experience.</p>
          <p>It takes just 2 minutes and helps other job seekers like you.</p>
          <p><a href="{feedbackUrl}" style="background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Share Your Experience</a></p>
          <p>Best regards,<br>The Pollen Team</p>
        `
      },
      challenge: {
        subject: "Quick feedback on your {jobTitle} assessment",
        html: `
          <h2>Hi {userName},</h2>
          <p>Thank you for completing the assessment for the {jobTitle} position at {companyName}.</p>
          <p>We'd love to hear about your experience with both the assessment and the company's communication.</p>
          <p>Your feedback helps us improve our platform and holds companies accountable for providing great candidate experiences.</p>
          <p><a href="{feedbackUrl}" style="background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Share Your Experience</a></p>
          <p>Best regards,<br>The Pollen Team</p>
        `
      },
      interview: {
        subject: "How was your interview experience at {companyName}?",
        html: `
          <h2>Hi {userName},</h2>
          <p>We hope your interview for the {jobTitle} position at {companyName} went well!</p>
          <p>We'd love to hear about your experience - both the interview process and how the company communicated with you.</p>
          <p>Your feedback helps us maintain high standards and helps other job seekers know what to expect.</p>
          <p><a href="{feedbackUrl}" style="background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Share Your Experience</a></p>
          <p>Best regards,<br>The Pollen Team</p>
        `
      },
      offer: {
        subject: "Final feedback on your {companyName} experience",
        html: `
          <h2>Hi {userName},</h2>
          <p>Congratulations on completing the process for the {jobTitle} position at {companyName}!</p>
          <p>We'd love to hear about your overall experience with the company and our platform.</p>
          <p>Your feedback helps us improve and helps other job seekers understand what to expect when applying through Pollen.</p>
          <p><a href="{feedbackUrl}" style="background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Share Your Experience</a></p>
          <p>Best regards,<br>The Pollen Team</p>
        `
      }
    };
    
    return templates[outcomeStage] || templates.application_review;
  }
  
  /**
   * Generate secure feedback token
   */
  private generateFeedbackToken(applicationId: number, userId: number): string {
    // In production, this would use a proper JWT or similar
    return Buffer.from(`${applicationId}-${userId}-${Date.now()}`).toString('base64');
  }
  
  /**
   * Calculate days between application and placement
   */
  private calculateDaysToPlacement(applicationDate: Date, placementDate: Date): number {
    const diffTime = Math.abs(placementDate.getTime() - applicationDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}

export const outcomeTrackingService = new OutcomeTrackingService();