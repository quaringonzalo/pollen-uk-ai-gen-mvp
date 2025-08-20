import { db } from "./db";
import { users, onboardingCheckpoints } from "../shared/schema";
import { eq, and } from "drizzle-orm";

export interface CheckpointData {
  checkpointId: string;
  userId: number;
  data: any;
  completedAt?: Date;
  phase: 'profile' | 'preferences' | 'optional';
}

export class CheckpointStorage {
  /**
   * Save progress for a specific checkpoint
   */
  async saveCheckpointProgress(userId: number, checkpointId: string, data: any, phase: string) {
    try {
      // First check if checkpoint already exists
      const existing = await db
        .select()
        .from(onboardingCheckpoints)
        .where(
          and(
            eq(onboardingCheckpoints.userId, userId),
            eq(onboardingCheckpoints.checkpointId, checkpointId)
          )
        )
        .limit(1);

      const checkpointData = {
        userId,
        checkpointId,
        data: JSON.stringify(data),
        phase: phase as any,
        completedAt: new Date(),
        updatedAt: new Date()
      };

      if (existing.length > 0) {
        // Update existing checkpoint
        await db
          .update(onboardingCheckpoints)
          .set(checkpointData)
          .where(
            and(
              eq(onboardingCheckpoints.userId, userId),
              eq(onboardingCheckpoints.checkpointId, checkpointId)
            )
          );
      } else {
        // Create new checkpoint
        await db
          .insert(onboardingCheckpoints)
          .values({
            ...checkpointData,
            createdAt: new Date()
          });
      }

      return { success: true };
    } catch (error) {
      console.error('Error saving checkpoint progress:', error);
      throw new Error('Failed to save checkpoint progress');
    }
  }

  /**
   * Get all saved checkpoints for a user
   */
  async getUserCheckpoints(userId: number): Promise<Record<string, any>> {
    try {
      const checkpoints = await db
        .select()
        .from(onboardingCheckpoints)
        .where(eq(onboardingCheckpoints.userId, userId));

      const result: Record<string, any> = {};
      
      checkpoints.forEach(checkpoint => {
        try {
          result[checkpoint.checkpointId] = JSON.parse(checkpoint.data);
        } catch (error) {
          console.error(`Error parsing checkpoint data for ${checkpoint.checkpointId}:`, error);
          result[checkpoint.checkpointId] = {};
        }
      });

      return result;
    } catch (error) {
      console.error('Error getting user checkpoints:', error);
      throw new Error('Failed to retrieve checkpoints');
    }
  }

  /**
   * Get specific checkpoint data
   */
  async getCheckpointData(userId: number, checkpointId: string): Promise<any | null> {
    try {
      const checkpoint = await db
        .select()
        .from(onboardingCheckpoints)
        .where(
          and(
            eq(onboardingCheckpoints.userId, userId),
            eq(onboardingCheckpoints.checkpointId, checkpointId)
          )
        )
        .limit(1);

      if (checkpoint.length === 0) {
        return null;
      }

      return JSON.parse(checkpoint[0].data);
    } catch (error) {
      console.error('Error getting checkpoint data:', error);
      return null;
    }
  }

  /**
   * Check if user has completed core profile checkpoints
   */
  async hasCompletedCoreProfile(userId: number): Promise<boolean> {
    try {
      const coreCheckpoints = ['basic-setup', 'work-style-assessment', 'personal-story', 'background'];
      
      const completed = await db
        .select()
        .from(onboardingCheckpoints)
        .where(
          and(
            eq(onboardingCheckpoints.userId, userId),
            eq(onboardingCheckpoints.phase, 'profile')
          )
        );

      const completedIds = completed.map(cp => cp.checkpointId);
      return coreCheckpoints.every(id => completedIds.includes(id));
    } catch (error) {
      console.error('Error checking core profile completion:', error);
      return false;
    }
  }

  /**
   * Get completion status for all checkpoints
   */
  async getCompletionStatus(userId: number): Promise<Record<string, boolean>> {
    try {
      const checkpoints = await db
        .select()
        .from(onboardingCheckpoints)
        .where(eq(onboardingCheckpoints.userId, userId));

      const status: Record<string, boolean> = {};
      checkpoints.forEach(checkpoint => {
        status[checkpoint.checkpointId] = true;
      });

      return status;
    } catch (error) {
      console.error('Error getting completion status:', error);
      return {};
    }
  }

  /**
   * Delete checkpoint data (for cleanup or reset)
   */
  async deleteCheckpoint(userId: number, checkpointId: string): Promise<void> {
    try {
      await db
        .delete(onboardingCheckpoints)
        .where(
          and(
            eq(onboardingCheckpoints.userId, userId),
            eq(onboardingCheckpoints.checkpointId, checkpointId)
          )
        );
    } catch (error) {
      console.error('Error deleting checkpoint:', error);
      throw new Error('Failed to delete checkpoint');
    }
  }

  /**
   * Build complete user profile from checkpoint data
   */
  async buildUserProfile(userId: number): Promise<any> {
    try {
      const checkpointData = await this.getUserCheckpoints(userId);
      
      // Combine profile-relevant data from different checkpoints
      const profile = {
        // From basic-setup
        contactInfo: checkpointData['basic-setup']?.contactInfo || {},
        
        // From work-style-assessment
        behavioralProfile: checkpointData['work-style-assessment']?.profile || {},
        
        // From personal-story
        careerAspirations: checkpointData['personal-story']?.careerGoals || '',
        personalMission: checkpointData['personal-story']?.mission || '',
        proudMoments: checkpointData['personal-story']?.proudOf || '',
        idealJob: checkpointData['personal-story']?.perfectJob || '',
        
        // From background
        education: checkpointData['background']?.education || [],
        experience: checkpointData['background']?.experience || [],
        skills: checkpointData['background']?.skills || [],
        
        // From skills-verification (if completed)
        verifiedSkills: checkpointData['skills-verification']?.completedChallenges || [],
        
        // Metadata
        profileCompleteness: this.calculateCompleteness(checkpointData),
        lastUpdated: new Date()
      };

      return profile;
    } catch (error) {
      console.error('Error building user profile:', error);
      throw new Error('Failed to build user profile');
    }
  }

  /**
   * Calculate profile completeness percentage
   */
  private calculateCompleteness(checkpointData: Record<string, any>): number {
    const coreCheckpoints = ['basic-setup', 'work-style-assessment', 'personal-story', 'background'];
    const completedCore = coreCheckpoints.filter(id => checkpointData[id]).length;
    
    let completeness = (completedCore / coreCheckpoints.length) * 80; // Core profile is 80%
    
    // Bonus for optional enhancements
    if (checkpointData['skills-verification']) completeness += 15;
    if (checkpointData['demographics']) completeness += 5;
    
    return Math.min(completeness, 100);
  }
}