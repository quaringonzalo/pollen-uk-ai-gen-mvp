import { db } from "./db";
import { notifications, insertNotificationSchema } from "@shared/schema";
import type { InsertNotification } from "@shared/schema";
import { sql } from "drizzle-orm";

export class NotificationService {
  // Create a new match notification for employer
  async createNewMatchNotification(
    employerId: number,
    jobId: number,
    jobTitle: string,
    candidateName: string,
    candidateId: number,
    matchScore: number
  ) {
    const notification: InsertNotification = {
      userId: employerId,
      type: 'new_match',
      title: `New candidate match for ${jobTitle}`,
      message: `${candidateName} is a ${matchScore}% match for your ${jobTitle} position. Their skills and behavioural profile align well with your requirements.`,
      jobId,
      jobTitle,
      candidateId,
      candidateName,
      priority: matchScore >= 85 ? 'high' : 'normal',
      actionRequired: true,
      actionUrl: `/job-candidate-matches/${jobId}`,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    };

    return this.createNotification(notification);
  }

  // Create feedback reminder notification
  async createFeedbackReminderNotification(
    employerId: number,
    jobId: number,
    jobTitle: string,
    candidateName: string,
    candidateId: number,
    daysOverdue: number
  ) {
    const urgency = daysOverdue >= 7 ? 'urgent' : daysOverdue >= 3 ? 'high' : 'normal';
    
    const notification: InsertNotification = {
      userId: employerId,
      type: 'feedback_reminder',
      title: `Feedback required: ${candidateName}`,
      message: `Please provide feedback for ${candidateName}'s application to ${jobTitle}. This has been pending for ${daysOverdue} day${daysOverdue !== 1 ? 's' : ''}. Timely feedback helps candidates improve and builds your reputation as a responsive employer.`,
      jobId,
      jobTitle,
      candidateId,
      candidateName,
      priority: urgency,
      actionRequired: true,
      actionUrl: `/job-candidate-matches/${jobId}?candidate=${candidateId}`,
      expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
    };

    return this.createNotification(notification);
  }

  // Create interview reminder notification
  async createInterviewReminderNotification(
    employerId: number,
    jobId: number,
    jobTitle: string,
    candidateName: string,
    candidateId: number,
    interviewDate: Date,
    hoursUntilInterview: number
  ) {
    const urgency = hoursUntilInterview <= 2 ? 'urgent' : hoursUntilInterview <= 24 ? 'high' : 'normal';
    
    const timeMessage = hoursUntilInterview < 1 
      ? 'in less than an hour'
      : hoursUntilInterview <= 24 
      ? `in ${Math.round(hoursUntilInterview)} hour${Math.round(hoursUntilInterview) !== 1 ? 's' : ''}`
      : `in ${Math.round(hoursUntilInterview / 24)} day${Math.round(hoursUntilInterview / 24) !== 1 ? 's' : ''}`;

    const notification: InsertNotification = {
      userId: employerId,
      type: 'interview_reminder',
      title: `Interview reminder: ${candidateName}`,
      message: `Your interview with ${candidateName} for the ${jobTitle} position is scheduled ${timeMessage}. Don't forget to prepare your questions and review their profile.`,
      jobId,
      jobTitle,
      candidateId,
      candidateName,
      priority: urgency,
      actionRequired: true,
      actionUrl: `/job-candidate-matches/${jobId}?candidate=${candidateId}&tab=interview`,
      expiresAt: interviewDate,
    };

    return this.createNotification(notification);
  }

  // Create application deadline reminder
  async createApplicationDeadlineNotification(
    employerId: number,
    jobId: number,
    jobTitle: string,
    daysUntilDeadline: number,
    applicationCount: number
  ) {
    const urgency = daysUntilDeadline <= 1 ? 'urgent' : daysUntilDeadline <= 3 ? 'high' : 'normal';
    
    const notification: InsertNotification = {
      userId: employerId,
      type: 'deadline_reminder',
      title: `Application deadline approaching: ${jobTitle}`,
      message: `Your ${jobTitle} position closes in ${daysUntilDeadline} day${daysUntilDeadline !== 1 ? 's' : ''}. You currently have ${applicationCount} candidate${applicationCount !== 1 ? 's' : ''} to review. Consider extending the deadline if you need more candidates.`,
      jobId,
      jobTitle,
      priority: urgency,
      actionRequired: true,
      actionUrl: `/job-posting-view/${jobId}`,
      expiresAt: new Date(Date.now() + (daysUntilDeadline + 1) * 24 * 60 * 60 * 1000),
    };

    return this.createNotification(notification);
  }

  // Create quality assurance notification (from Pollen team)
  async createQualityAssuranceNotification(
    employerId: number,
    jobId: number,
    jobTitle: string,
    candidateName: string,
    candidateId: number,
    issueType: 'incomplete_feedback' | 'unfair_rejection' | 'process_violation'
  ) {
    const messages = {
      incomplete_feedback: `Your feedback for ${candidateName}'s application to ${jobTitle} needs more detail. Quality feedback helps candidates grow and maintains our platform standards.`,
      unfair_rejection: `We've flagged the rejection of ${candidateName} for ${jobTitle} for review. Our team will reach out to discuss fair hiring practices and platform guidelines.`,
      process_violation: `There's been a process violation regarding ${candidateName}'s application to ${jobTitle}. Please review our hiring guidelines and contact support if you have questions.`
    };

    const notification: InsertNotification = {
      userId: employerId,
      type: 'quality_assurance',
      title: `Action required: Quality assurance review`,
      message: messages[issueType],
      jobId,
      jobTitle,
      candidateId,
      candidateName,
      priority: 'high',
      actionRequired: true,
      actionUrl: `/job-candidate-matches/${jobId}?candidate=${candidateId}&tab=feedback`,
      expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
    };

    return this.createNotification(notification);
  }

  // Create general system notification
  async createSystemNotification(
    employerId: number,
    title: string,
    message: string,
    priority: 'low' | 'normal' | 'high' | 'urgent' = 'normal',
    actionUrl?: string
  ) {
    const notification: InsertNotification = {
      userId: employerId,
      type: 'system',
      title,
      message,
      priority,
      actionRequired: !!actionUrl,
      actionUrl,
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
    };

    return this.createNotification(notification);
  }

  // Generic notification creation method
  private async createNotification(notificationData: InsertNotification) {
    try {
      const validatedData = insertNotificationSchema.parse(notificationData);
      
      const [newNotification] = await db
        .insert(notifications)
        .values(validatedData)
        .returning();

      console.log(`Created notification: ${newNotification.title} for user ${newNotification.userId}`);
      return newNotification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Cleanup expired notifications (run as scheduled job)
  async cleanupExpiredNotifications() {
    try {
      const result = await db
        .delete(notifications)
        .where(sql`expires_at < NOW()`)
        .returning({ id: notifications.id });

      console.log(`Cleaned up ${result.length} expired notifications`);
      return result.length;
    } catch (error) {
      console.error('Error cleaning up expired notifications:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const notificationService = new NotificationService();