import React, { useState, useEffect } from "react";
import { PersonalStoryCheckpoint } from "@/components/checkpoints/personal-story-checkpoint";
import { JobPreferencesCheckpoint } from "@/components/checkpoints/job-preferences-checkpoint";
import { InterestsPreferencesCheckpoint } from "@/components/checkpoints/interests-preferences-checkpoint";
import { EducationLearningCheckpoint } from "@/components/checkpoints/education-learning-checkpoint";
import { PersonalInfoCheckpoint } from "@/components/checkpoints/personal-info-checkpoint";
import { JobSearchExperienceCheckpoint } from "@/components/checkpoints/job-search-experience-checkpoint";

import { ProfileCompletionDashboard } from "@/components/profile-completion-dashboard";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function ProfileCheckpoints() {
  const [currentCheckpoint, setCurrentCheckpoint] = useState<string>('dashboard');
  const [savedData, setSavedData] = useState<Record<string, any>>({});
  const { toast } = useToast();

  // Handle URL query parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const checkpointParam = urlParams.get('checkpoint');
    if (checkpointParam) {
      setCurrentCheckpoint(checkpointParam);
    }
  }, []);

  const handleSaveProgress = async (checkpointId: string, data: any) => {
    try {
      const response = await fetch('/api/checkpoint-progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          checkpointId,
          data,
          phase: 'profile'
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save checkpoint progress');
      }
      
      setSavedData(prev => ({ ...prev, [checkpointId]: data }));
      
      toast({
        title: "Progress Saved",
        description: "Your information has been saved successfully.",
      });
    } catch (error: any) {
      console.error('Save error:', error);
      toast({
        title: "Save Failed", 
        description: `${error?.message || 'Unknown error'}. Please try again or contact support if the issue persists.`,
        variant: "destructive"
      });
    }
  };

  const handleNavigateToCheckpoint = (checkpointId: string) => {
    // For work style, redirect to existing behavioural assessment
    if (checkpointId === 'work-style') {
      window.location.href = '/behavioural-assessment';
      return;
    }
    
    setCurrentCheckpoint(checkpointId);
  };

  const renderCurrentCheckpoint = () => {
    switch (currentCheckpoint) {
      case 'dashboard':
        return (
          <ProfileCompletionDashboard
            onNavigateToCheckpoint={handleNavigateToCheckpoint}
          />
        );
      
      case 'personal-story':
        return (
          <PersonalStoryCheckpoint
            onComplete={(data) => {
              handleSaveProgress('personal-story', data);
              setCurrentCheckpoint('education');
            }}
            onSaveAndExit={() => setCurrentCheckpoint('dashboard')}
            initialData={savedData['personal-story']}
          />
        );
      

      
      case 'practical-preferences':
        return (
          <JobPreferencesCheckpoint
            onComplete={(data) => {
              handleSaveProgress('practical-preferences', data);
              setCurrentCheckpoint('personal-info');
            }}
            onSaveAndExit={() => setCurrentCheckpoint('dashboard')}
            initialData={savedData['practical-preferences']}
          />
        );
      
      case 'interests-preferences':
        return (
          <InterestsPreferencesCheckpoint
            onComplete={(data) => {
              handleSaveProgress('interests-preferences', data);
              setCurrentCheckpoint('practical-preferences');
            }}
            onSaveAndExit={() => setCurrentCheckpoint('dashboard')}
            initialData={savedData['interests-preferences']}
          />
        );
      
      case 'education':
        return (
          <EducationLearningCheckpoint
            onComplete={(data) => {
              handleSaveProgress('education', data);
              setCurrentCheckpoint('interests-preferences');
            }}
            onSaveAndExit={() => setCurrentCheckpoint('dashboard')}
            initialData={savedData['education']}
          />
        );
      
      case 'personal-info':
        return (
          <PersonalInfoCheckpoint
            onComplete={(data) => {
              handleSaveProgress('personal-info', data);
              setCurrentCheckpoint('job-search-experience');
            }}
            onSaveAndExit={() => setCurrentCheckpoint('dashboard')}
            initialData={savedData['personal-info']}
          />
        );
      
      case 'job-search-experience':
        return (
          <JobSearchExperienceCheckpoint
            onComplete={(data) => {
              handleSaveProgress('job-search-experience', data);
              setCurrentCheckpoint('dashboard');
            }}
            onSaveAndExit={() => setCurrentCheckpoint('dashboard')}
            initialData={savedData['job-search-experience']}
          />
        );
      
      default:
        return (
          <div className="text-center p-8">
            <h2 className="text-xl font-semibold mb-4">Checkpoint: {currentCheckpoint}</h2>
            <p className="text-gray-600 mb-6">This checkpoint is being built.</p>
            <p className="text-sm text-gray-500">
              Use the sidebar navigation to continue exploring the platform.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 profile-checkpoints-page">
      {renderCurrentCheckpoint()}
    </div>
  );
}