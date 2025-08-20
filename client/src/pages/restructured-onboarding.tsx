import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, ArrowRight, Save, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import ProgressiveForm from "@/components/progressive-form";

// Import existing checkpoint components as we build them
// import PersonalStoryCheckpoint from "@/components/checkpoints/personal-story";
// import EducationExperienceCheckpoint from "@/components/checkpoints/education-experience";
// import JobSearchConfigCheckpoint from "@/components/checkpoints/job-search-config";
// import PlatformPreferencesCheckpoint from "@/components/checkpoints/platform-preferences";

interface Checkpoint {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  phase: 'profile' | 'preferences' | 'optional';
  required: boolean;
}

const CHECKPOINTS: Checkpoint[] = [
  {
    id: 'work-style-assessment',
    title: 'Work Style Assessment',
    description: 'DISC behavioural assessment (already completed)',
    estimatedMinutes: 10,
    phase: 'profile',
    required: true
  },
  {
    id: 'personal-story',
    title: 'Personal Story & Career Goals',
    description: 'Share your aspirations and what drives you',
    estimatedMinutes: 8,
    phase: 'profile',
    required: true
  },
  {
    id: 'education-experience',
    title: 'Education & Experience',
    description: 'Your background and skills gained',
    estimatedMinutes: 12,
    phase: 'profile',
    required: true
  },
  {
    id: 'job-search-config',
    title: 'Job Search Preferences',
    description: 'Set your job search criteria and preferences',
    estimatedMinutes: 8,
    phase: 'preferences',
    required: true
  },
  {
    id: 'platform-preferences',
    title: 'Platform Experience',
    description: 'Help us improve your Pollen experience',
    estimatedMinutes: 5,
    phase: 'preferences',
    required: false
  },
  {
    id: 'demographics',
    title: 'Background Information',
    description: 'Optional diversity and inclusion data',
    estimatedMinutes: 3,
    phase: 'optional',
    required: false
  }
];

export default function RestructuredOnboarding() {
  const { toast } = useToast();
  const [currentCheckpoint, setCurrentCheckpoint] = useState('personal-story'); // Start after behavioural assessment
  const [completedCheckpoints, setCompletedCheckpoints] = useState<Set<string>>(new Set(['work-style-assessment']));
  const [checkpointData, setCheckpointData] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Load saved checkpoint data on mount
  useEffect(() => {
    loadSavedProgress();
  }, []);

  const loadSavedProgress = async () => {
    try {
      const response = await apiRequest('GET', '/api/checkpoint-progress');
      const savedData = response.data || {};
      
      setCheckpointData(savedData);
      
      // Update completed checkpoints
      const completed = new Set(Object.keys(savedData));
      completed.add('work-style-assessment'); // Always mark behavioural assessment as complete
      setCompletedCheckpoints(completed);
      
      // Find first incomplete checkpoint
      const firstIncomplete = CHECKPOINTS.find(cp => !completed.has(cp.id));
      if (firstIncomplete) {
        setCurrentCheckpoint(firstIncomplete.id);
      }
    } catch (error) {
      console.error('Error loading checkpoint progress:', error);
    }
  };

  const saveCheckpointProgress = async (checkpointId: string, data: any) => {
    setIsLoading(true);
    try {
      await apiRequest('POST', '/api/checkpoint-progress', {
        checkpointId,
        data,
        phase: CHECKPOINTS.find(cp => cp.id === checkpointId)?.phase || 'profile'
      });
      
      setCheckpointData(prev => ({ ...prev, [checkpointId]: data }));
      setCompletedCheckpoints(prev => new Set([...prev, checkpointId]));
      
      toast({
        title: "Progress Saved",
        description: "Your information has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Please try again or contact support if the issue persists.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckpointComplete = async (data: any) => {
    await saveCheckpointProgress(currentCheckpoint, data);
    
    // Move to next required checkpoint
    const currentIndex = CHECKPOINTS.findIndex(cp => cp.id === currentCheckpoint);
    const nextCheckpoint = CHECKPOINTS.find((cp, index) => 
      index > currentIndex && cp.required && !completedCheckpoints.has(cp.id)
    );
    
    if (nextCheckpoint) {
      setCurrentCheckpoint(nextCheckpoint.id);
    } else {
      // All required checkpoints complete - show completion
      handleOnboardingComplete();
    }
  };

  const handleSaveAndExit = async (data: any) => {
    await saveCheckpointProgress(currentCheckpoint, data);
    
    toast({
      title: "Progress Saved",
      description: "You can return anytime to continue where you left off.",
    });
    
    // Could redirect to dashboard or profile page
    window.location.href = '/profile';
  };

  const handleOnboardingComplete = () => {
    toast({
      title: "Profile Complete!",
      description: "Welcome to Pollen! Your personalised journey begins now.",
    });
    
    // Redirect to main dashboard or skills challenges
    window.location.href = '/dashboard';
  };

  const getCurrentCheckpointData = () => {
    const checkpoint = CHECKPOINTS.find(cp => cp.id === currentCheckpoint);
    return checkpoint;
  };

  const getPhaseProgress = (phase: string) => {
    const phaseCheckpoints = CHECKPOINTS.filter(cp => cp.phase === phase);
    const completedCount = phaseCheckpoints.filter(cp => completedCheckpoints.has(cp.id)).length;
    return (completedCount / phaseCheckpoints.length) * 100;
  };

  const renderCurrentCheckpoint = () => {
    const checkpoint = getCurrentCheckpointData();
    if (!checkpoint) return null;

    switch (checkpoint.id) {
      case 'personal-story':
        return (
          <PersonalStoryForm
            onComplete={handleCheckpointComplete}
            onSaveAndExit={handleSaveAndExit}
            initialData={checkpointData[checkpoint.id] || {}}
          />
        );
      
      case 'education-experience':
        return (
          <EducationExperienceForm
            onComplete={handleCheckpointComplete}
            onSaveAndExit={handleSaveAndExit}
            initialData={checkpointData[checkpoint.id] || {}}
          />
        );
      
      case 'job-search-config':
        return (
          <JobSearchConfigForm
            onComplete={handleCheckpointComplete}
            onSaveAndExit={handleSaveAndExit}
            initialData={checkpointData[checkpoint.id] || {}}
          />
        );
      
      case 'platform-preferences':
        return (
          <PlatformPreferencesForm
            onComplete={handleCheckpointComplete}
            onSaveAndExit={handleSaveAndExit}
            initialData={checkpointData[checkpoint.id] || {}}
          />
        );
      
      case 'demographics':
        return (
          <DemographicsForm
            onComplete={handleCheckpointComplete}
            onSaveAndExit={handleSaveAndExit}
            initialData={checkpointData[checkpoint.id] || {}}
          />
        );
      
      default:
        return <div>Checkpoint not implemented yet</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        
        {/* Progress Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Creation Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {['profile', 'preferences', 'optional'].map(phase => (
                <div key={phase} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium capitalize">{phase} Building</span>
                    <span className="text-sm text-gray-600">{Math.round(getPhaseProgress(phase))}%</span>
                  </div>
                  <Progress value={getPhaseProgress(phase)} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Checkpoint Navigation */}
        <div className="grid md:grid-cols-4 gap-4">
          {CHECKPOINTS.map(checkpoint => (
            <Card 
              key={checkpoint.id}
              className={`${
                currentCheckpoint === checkpoint.id 
                  ? 'ring-2 ring-blue-500 bg-blue-50' 
                  : completedCheckpoints.has(checkpoint.id)
                  ? 'bg-green-50 border-green-200'
                  : 'opacity-60'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {completedCheckpoints.has(checkpoint.id) ? (
                    <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                  ) : currentCheckpoint === checkpoint.id ? (
                    <div className="w-5 h-5 rounded-full bg-blue-600 mt-1 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 mt-1" />
                  )}
                  <div className="space-y-1">
                    <h4 className="font-medium text-sm">{checkpoint.title}</h4>
                    <p className="text-xs text-gray-600">{checkpoint.description}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {checkpoint.estimatedMinutes}min
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Current Checkpoint Form */}
        <div>
          {renderCurrentCheckpoint()}
        </div>

      </div>
    </div>
  );
}

// Placeholder components - we'll implement these one by one
function PersonalStoryForm({ onComplete, onSaveAndExit, initialData }: any) {
  const fields = [
    {
      id: 'perfectJob',
      type: 'textarea',
      label: "What's your idea of the perfect job?",
      placeholder: 'Describe what your ideal role would look like, what you\'d be doing, and what would make you excited to go to work...',
      required: true,
      helpText: 'This helps us understand what type of work environment and responsibilities appeal to you.'
    },
    {
      id: 'friendDescriptions',
      type: 'text',
      label: 'In 3 words or phrases, how would your friends describe you?',
      placeholder: 'e.g., Supportive, Creative, Always laughing...',
      required: true,
      helpText: 'This shows your personality from the perspective of people who know you well.'
    },
    {
      id: 'teacherDescriptions',
      type: 'text',
      label: 'In 3 words or phrases, how would your teachers describe you?',
      placeholder: 'e.g., Curious, Hardworking, Good collaborator...',
      required: true,
      helpText: 'This reveals your learning style and approach to challenges.'
    },
    {
      id: 'happyActivities',
      type: 'textarea',
      label: 'What do you like doing that makes you happy?',
      placeholder: 'Think about hobbies, activities, or situations that energize you...',
      required: true,
      helpText: 'Understanding what brings you joy helps us find roles that align with your interests.'
    },
    {
      id: 'frustrations',
      type: 'textarea',
      label: 'Is there anything in life that frustrates you?',
      placeholder: 'This could be situations, tasks, or environments that drain your energy...',
      required: true,
      helpText: 'Knowing what doesn\'t work for you helps us avoid poor matches.'
    },
    {
      id: 'proudMoment',
      type: 'textarea',
      label: 'Is there anything you\'ve done you feel really proud of?',
      placeholder: 'This could be academic, personal, volunteer work, sports, or any accomplishment...',
      required: true,
      helpText: 'Achievements show your character and potential, regardless of work experience.'
    }
  ];

  return (
    <ProgressiveForm
      title="Personal Story & Career Goals"
      description="Help employers understand what drives you and what you're looking for in your career."
      fields={fields}
      onComplete={onComplete}
      onSaveAndExit={onSaveAndExit}
      initialData={initialData}
    />
  );
}

// Placeholder for other checkpoint forms
function EducationExperienceForm({ onComplete, onSaveAndExit, initialData }: any) {
  return <div>Education & Experience form - to be implemented</div>;
}

function JobSearchConfigForm({ onComplete, onSaveAndExit, initialData }: any) {
  return <div>Job Search Config form - to be implemented</div>;
}

function PlatformPreferencesForm({ onComplete, onSaveAndExit, initialData }: any) {
  return <div>Platform Preferences form - to be implemented</div>;
}

function DemographicsForm({ onComplete, onSaveAndExit, initialData }: any) {
  return <div>Demographics form - to be implemented</div>;
}