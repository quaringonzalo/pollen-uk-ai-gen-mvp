import { db } from "./db";
import { jobSeekerProfiles } from "../shared/schema";
import { eq } from "drizzle-orm";

export interface CommunityActivity {
  userId: number;
  activityType: 'question' | 'comment' | 'event' | 'masterclass' | 'bootcamp' | 'introduction' | 'resource_share' | 'mentorship_seeking';
  points: number;
  qualityScore?: number; // 1-5 based on community response
  metadata?: any;
}

export class CommunityEngagementService {
  
  /**
   * Award points for community activities
   */
  async awardCommunityPoints(activity: CommunityActivity): Promise<void> {
    const profile = await db
      .select()
      .from(jobSeekerProfiles)
      .where(eq(jobSeekerProfiles.userId, activity.userId))
      .limit(1);

    if (profile.length === 0) return;

    const currentProfile = profile[0];
    
    // Calculate point values based on activity type and quality
    const finalPoints = this.calculateActivityPoints(activity);
    
    // Update community engagement metrics
    await this.updateEngagementMetrics(activity.userId, activity.activityType, finalPoints);
    
    // Recalculate proactivity score
    await this.updateProactivityScore(activity.userId);
  }

  /**
   * Calculate points for different activity types
   */
  private calculateActivityPoints(activity: CommunityActivity): number {
    const basePoints: Record<string, number> = {
      'introduction': 25,
      'question': 5,
      'comment': 5,
      'resource_share': 10,
      'event': 30,
      'masterclass': 50,
      'bootcamp': 200,
      'mentorship_seeking': 20
    };

    let points = basePoints[activity.activityType] || 0;
    
    // Quality multiplier for questions and comments
    if (activity.qualityScore && ['question', 'comment'].includes(activity.activityType)) {
      points = Math.floor(points * (activity.qualityScore / 3)); // 1-5 scale to multiplier
    }

    return points;
  }

  /**
   * Update engagement metrics in database
   */
  private async updateEngagementMetrics(userId: number, activityType: string, points: number): Promise<void> {
    const profile = await db
      .select()
      .from(jobSeekerProfiles)
      .where(eq(jobSeekerProfiles.userId, userId))
      .limit(1);

    if (profile.length === 0) return;

    const current = profile[0];
    
    // Update activity counters
    const updates: any = {
      communityPoints: (current.communityPoints || 0) + points,
      totalPoints: (current.totalPoints || 0) + points,
    };

    // Update specific activity counters
    switch (activityType) {
      case 'question':
        updates.questionsAsked = (current.questionsAsked || 0) + 1;
        break;
      case 'comment':
        updates.commentsPosted = (current.commentsPosted || 0) + 1;
        break;
      case 'event':
        updates.eventsAttended = (current.eventsAttended || 0) + 1;
        updates.learningPoints = (current.learningPoints || 0) + points;
        break;
      case 'masterclass':
        updates.masterclassesCompleted = (current.masterclassesCompleted || 0) + 1;
        updates.learningPoints = (current.learningPoints || 0) + points;
        break;
      case 'bootcamp':
        updates.bootcampParticipation = true;
        updates.learningPoints = (current.learningPoints || 0) + points;
        break;
    }

    await db
      .update(jobSeekerProfiles)
      .set(updates)
      .where(eq(jobSeekerProfiles.userId, userId));
  }

  /**
   * Calculate and update proactivity score (0-10 scale)
   */
  private async updateProactivityScore(userId: number): Promise<void> {
    const profile = await db
      .select()
      .from(jobSeekerProfiles)
      .where(eq(jobSeekerProfiles.userId, userId))
      .limit(1);

    if (profile.length === 0) return;

    const current = profile[0];
    
    // Calculate proactivity components
    const communityEngagement = this.scoreCommunityEngagement(current);
    const learningCommitment = this.scoreLearningCommitment(current);
    const qualityContributions = this.scoreQualityContributions(current);
    
    // Weighted average (community 40%, learning 40%, quality 20%)
    const rawScore = (communityEngagement * 0.4) + (learningCommitment * 0.4) + (qualityContributions * 0.2);
    
    // Apply newcomer protection (minimum 6.0 for users under 30 days)
    const accountAge = this.getAccountAgeDays(current.createdAt);
    const protectedScore = accountAge < 30 ? Math.max(6.0, rawScore) : rawScore;
    
    // Cap at 10.0
    const finalScore = Math.min(10.0, protectedScore);

    await db
      .update(jobSeekerProfiles)
      .set({ 
        proactivityScore: finalScore.toFixed(2)
      })
      .where(eq(jobSeekerProfiles.userId, userId));
  }

  /**
   * Score community engagement (0-10)
   */
  private scoreCommunityEngagement(profile: any): number {
    const questions = profile.questionsAsked || 0;
    const comments = profile.commentsPosted || 0;
    const upvotes = profile.communityUpvotes || 0;
    
    // Base score from activity volume (capped at 5 points)
    const activityScore = Math.min(5, (questions * 0.5) + (comments * 0.3));
    
    // Quality bonus from upvotes (up to 5 points)
    const qualityScore = Math.min(5, upvotes * 0.2);
    
    return activityScore + qualityScore;
  }

  /**
   * Score learning commitment (0-10)
   */
  private scoreLearningCommitment(profile: any): number {
    const events = profile.eventsAttended || 0;
    const masterclasses = profile.masterclassesCompleted || 0;
    const bootcamp = profile.bootcampParticipation || false;
    
    let score = 0;
    
    // Event attendance (up to 4 points)
    score += Math.min(4, events * 0.5);
    
    // Masterclass completion (up to 4 points)
    score += Math.min(4, masterclasses * 0.8);
    
    // Bootcamp participation (2 points bonus)
    if (bootcamp) score += 2;
    
    return Math.min(10, score);
  }

  /**
   * Score quality contributions (0-10)
   */
  private scoreQualityContributions(profile: any): number {
    const helpfulContributions = profile.helpfulContributions || 0;
    const upvotes = profile.communityUpvotes || 0;
    const totalActivity = (profile.questionsAsked || 0) + (profile.commentsPosted || 0);
    
    if (totalActivity === 0) return 6; // Neutral score for inactive users
    
    // Quality ratio: helpful contributions / total activity
    const qualityRatio = totalActivity > 0 ? helpfulContributions / totalActivity : 0;
    
    // Upvote ratio bonus
    const upvoteRatio = totalActivity > 0 ? upvotes / totalActivity : 0;
    
    return Math.min(10, (qualityRatio * 6) + (upvoteRatio * 4));
  }

  /**
   * Get account age in days
   */
  private getAccountAgeDays(createdAt: Date | null): number {
    if (!createdAt) return 0;
    const now = new Date();
    const diffMs = now.getTime() - createdAt.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  }

  /**
   * Award upvote to a user's contribution
   */
  async awardUpvote(userId: number): Promise<void> {
    const profile = await db
      .select()
      .from(jobSeekerProfiles)
      .where(eq(jobSeekerProfiles.userId, userId))
      .limit(1);

    if (profile.length === 0) return;

    await db
      .update(jobSeekerProfiles)
      .set({
        communityUpvotes: (profile[0].communityUpvotes || 0) + 1,
        helpfulContributions: (profile[0].helpfulContributions || 0) + 1
      })
      .where(eq(jobSeekerProfiles.userId, userId));

    // Recalculate proactivity score
    await this.updateProactivityScore(userId);
  }

  /**
   * Get user's engagement summary
   */
  async getUserEngagementSummary(userId: number): Promise<any> {
    const profile = await db
      .select()
      .from(jobSeekerProfiles)
      .where(eq(jobSeekerProfiles.userId, userId))
      .limit(1);

    if (profile.length === 0) return null;

    const current = profile[0];
    
    return {
      totalPoints: current.totalPoints || 0,
      communityPoints: current.communityPoints || 0,
      learningPoints: current.learningPoints || 0,
      proactivityScore: parseFloat(current.proactivityScore || "6.00"),
      activities: {
        questionsAsked: current.questionsAsked || 0,
        commentsPosted: current.commentsPosted || 0,
        eventsAttended: current.eventsAttended || 0,
        masterclassesCompleted: current.masterclassesCompleted || 0,
        bootcampParticipation: current.bootcampParticipation || false
      },
      quality: {
        communityUpvotes: current.communityUpvotes || 0,
        helpfulContributions: current.helpfulContributions || 0
      }
    };
  }
}

export const communityEngagement = new CommunityEngagementService();