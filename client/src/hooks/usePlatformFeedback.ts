import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";

interface FeedbackTriggerConditions {
  showFeedback: boolean;
  triggerReason: string | null;
}

export function usePlatformFeedback(): FeedbackTriggerConditions {
  const { user } = useAuth();
  const [showFeedback, setShowFeedback] = useState(false);
  const [triggerReason, setTriggerReason] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    // Check if feedback has already been submitted or skipped
    const feedbackSubmitted = localStorage.getItem("pollen_feedback_submitted");
    const feedbackSkipped = localStorage.getItem("pollen_feedback_skipped");
    
    if (feedbackSubmitted || feedbackSkipped) {
      return;
    }

    // Disable feedback popup for demo users to improve demo experience
    const isDemoUser = user.email && (
      user.email.includes("@demo.com") || 
      user.email.includes("@jobseeker.com") || 
      user.email.includes("@employer.com") ||
      user.email.includes("@admin.com")
    );
    
    if (isDemoUser) {
      return;
    }

    // Check various conditions that might trigger feedback request
    const checkFeedbackConditions = () => {
      const accountAge = user.createdAt ? Date.now() - new Date(user.createdAt).getTime() : 0;
      const daysActive = Math.floor(accountAge / (1000 * 60 * 60 * 24));
      
      // Get user activity data from localStorage or API
      const totalApplications = parseInt(localStorage.getItem("user_total_applications") || "0");
      const hasCompletedProfile = user.profileCompletion && user.profileCompletion >= 80;
      const hasReceivedFeedback = parseInt(localStorage.getItem("user_feedback_received") || "0") > 0;
      const communityPoints = user.communityPoints || 0;

      // Trigger conditions (only one needs to be true)
      const conditions = [
        {
          condition: daysActive >= 14 && totalApplications >= 2,
          reason: "active_user_experience"
        },
        {
          condition: totalApplications >= 5,
          reason: "application_milestone"
        },
        {
          condition: hasReceivedFeedback && totalApplications >= 1,
          reason: "feedback_received"
        },
        {
          condition: communityPoints >= 200,
          reason: "community_engagement"
        },
        {
          condition: daysActive >= 30,
          reason: "long_term_user"
        },
        {
          condition: hasCompletedProfile && daysActive >= 7,
          reason: "completed_profile_week"
        }
      ];

      const triggeredCondition = conditions.find(c => c.condition);
      
      if (triggeredCondition) {
        // Add random delay to avoid overwhelming users
        const delay = Math.random() * 5000 + 2000; // 2-7 seconds
        
        setTimeout(() => {
          setShowFeedback(true);
          setTriggerReason(triggeredCondition.reason);
        }, delay);
      }
    };

    // Check conditions on mount and set up periodic checks
    checkFeedbackConditions();

    // Optional: Check again when user performs certain actions
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.startsWith("user_")) {
        checkFeedbackConditions();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    
    // Listen for test trigger
    const handleTestTrigger = () => {
      console.log('Test trigger received in hook');
      setShowFeedback(true);
      setTriggerReason("test_trigger");
    };
    
    window.addEventListener("triggerPlatformFeedback", handleTestTrigger);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("triggerPlatformFeedback", handleTestTrigger);
    };
  }, [user]);

  return { showFeedback, triggerReason };
}

// Helper function to trigger feedback after specific actions
export function triggerFeedbackCheck() {
  // Dispatch a custom event to trigger feedback check
  window.dispatchEvent(new CustomEvent("pollen_feedback_check"));
}

// Helper function to update user activity counters
export function updateUserActivity(type: "application" | "feedback" | "community", increment: number = 1) {
  const currentKey = `user_${type}_count`;
  const current = parseInt(localStorage.getItem(currentKey) || "0");
  localStorage.setItem(currentKey, (current + increment).toString());
  
  // Trigger feedback check after activity update
  triggerFeedbackCheck();
}