import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, ArrowRight, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Checkpoint {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  completed: boolean;
  data?: any;
  phase: 'profile' | 'preferences' | 'optional';
}

interface CheckpointSystemProps {
  currentCheckpoint: string;
  onCheckpointChange: (checkpointId: string) => void;
  onSaveProgress: (checkpointId: string, data: any) => void;
  onComplete: () => void;
  savedData: Record<string, any>;
}

const CHECKPOINTS: Checkpoint[] = [
  // Phase 1: Core Profile Building
  {
    id: 'work-style-assessment',
    title: 'Work Style Discovery',
    description: 'DISC behavioural assessment to understand your work preferences',
    estimatedMinutes: 10,
    completed: false,
    phase: 'profile'
  },
  {
    id: 'personal-story',
    title: 'Personal Story',
    description: 'Share your career goals and what motivates you',
    estimatedMinutes: 8,
    completed: false,
    phase: 'profile'
  },
  {
    id: 'education-learning',
    title: 'Education & Learning',
    description: 'Tell us about your educational background and interests',
    estimatedMinutes: 8,
    completed: false,
    phase: 'profile'
  },
  {
    id: 'background',
    title: 'Education & Experience',
    description: 'Your educational background and any work experience',
    estimatedMinutes: 12,
    completed: false,
    phase: 'profile'
  },
  // Phase 2: Platform Preferences
  {
    id: 'job-search-config',
    title: 'Job Search Configuration',
    description: 'Set your job preferences and search criteria',
    estimatedMinutes: 8,
    completed: false,
    phase: 'preferences'
  },
  {
    id: 'platform-setup',
    title: 'Platform Experience Setup',
    description: 'Configure how Pollen works best for you',
    estimatedMinutes: 5,
    completed: false,
    phase: 'preferences'
  },
  // Phase 3: Optional Enhancements
  {
    id: 'skills-verification',
    title: 'Skills Verification',
    description: 'Complete challenges to showcase your abilities',
    estimatedMinutes: 15,
    completed: false,
    phase: 'optional'
  },
  {
    id: 'demographics',
    title: 'Background Information',
    description: 'Optional diversity and inclusion information',
    estimatedMinutes: 3,
    completed: false,
    phase: 'optional'
  }
];

export default function CheckpointSystem({ 
  currentCheckpoint, 
  onCheckpointChange, 
  onSaveProgress,
  onComplete,
  savedData 
}: CheckpointSystemProps) {
  const { toast } = useToast();
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>(CHECKPOINTS);

  useEffect(() => {
    // Update completion status based on saved data
    setCheckpoints(prev => prev.map(checkpoint => ({
      ...checkpoint,
      completed: !!savedData[checkpoint.id],
      data: savedData[checkpoint.id]
    })));
  }, [savedData]);

  const handleSaveAndContinue = (checkpointId: string, data: any) => {
    onSaveProgress(checkpointId, data);
    
    // Mark checkpoint as completed
    setCheckpoints(prev => prev.map(checkpoint => 
      checkpoint.id === checkpointId 
        ? { ...checkpoint, completed: true, data }
        : checkpoint
    ));

    // Move to next checkpoint
    const currentIndex = checkpoints.findIndex(cp => cp.id === checkpointId);
    const nextCheckpoint = checkpoints[currentIndex + 1];
    
    if (nextCheckpoint) {
      onCheckpointChange(nextCheckpoint.id);
    } else {
      onComplete();
    }

    toast({
      title: "Progress Saved",
      description: "You can return anytime to continue where you left off.",
    });
  };

  const handleSaveAndExit = (checkpointId: string, data: any) => {
    onSaveProgress(checkpointId, data);
    
    toast({
      title: "Progress Saved",
      description: "Your information has been saved. Return anytime to continue.",
    });
  };

  const getPhaseTitle = (phase: string) => {
    switch (phase) {
      case 'profile': return 'Core Profile Building';
      case 'preferences': return 'Platform Preferences';
      case 'optional': return 'Optional Enhancements';
      default: return '';
    }
  };

  const getPhaseProgress = (phase: string) => {
    const phaseCheckpoints = checkpoints.filter(cp => cp.phase === phase);
    const completedCount = phaseCheckpoints.filter(cp => cp.completed).length;
    return (completedCount / phaseCheckpoints.length) * 100;
  };

  const getCurrentCheckpoint = () => {
    return checkpoints.find(cp => cp.id === currentCheckpoint);
  };

  const canSkipToCheckpoint = (checkpointId: string) => {
    const targetIndex = checkpoints.findIndex(cp => cp.id === checkpointId);
    const currentIndex = checkpoints.findIndex(cp => cp.id === currentCheckpoint);
    
    // Can always go back to completed checkpoints
    if (checkpoints[targetIndex].completed) return true;
    
    // Can skip to next uncompleted checkpoint in same phase
    if (targetIndex === currentIndex + 1) return true;
    
    // Can skip to optional phase checkpoints anytime after profile is complete
    const profileComplete = checkpoints
      .filter(cp => cp.phase === 'profile')
      .every(cp => cp.completed);
    
    if (profileComplete && checkpoints[targetIndex].phase === 'optional') return true;
    
    return false;
  };

  return (
    <div className="space-y-6">
      {/* Phase Progress Overview */}
      <div className="grid md:grid-cols-3 gap-4">
        {['profile', 'preferences', 'optional'].map(phase => (
          <Card key={phase} className={`${phase === 'profile' ? 'border-blue-200' : 'border-gray-200'}`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center justify-between">
                {getPhaseTitle(phase)}
                <Badge variant={getPhaseProgress(phase) === 100 ? 'default' : 'secondary'}>
                  {Math.round(getPhaseProgress(phase))}%
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <Progress value={getPhaseProgress(phase)} className="h-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Checkpoint Navigation */}
      <div className="space-y-4">
        {['profile', 'preferences', 'optional'].map(phase => (
          <div key={phase}>
            <h3 className="font-semibold text-lg mb-3 text-gray-700">
              {getPhaseTitle(phase)}
            </h3>
            <div className="grid gap-3">
              {checkpoints.filter(cp => cp.phase === phase).map((checkpoint) => (
                <Card 
                  key={checkpoint.id}
                  className={`cursor-pointer transition-all ${
                    currentCheckpoint === checkpoint.id 
                      ? 'ring-2 ring-blue-500 bg-blue-50' 
                      : checkpoint.completed
                      ? 'bg-green-50 border-green-200'
                      : canSkipToCheckpoint(checkpoint.id)
                      ? 'hover:bg-gray-50'
                      : 'opacity-60 cursor-not-allowed'
                  }`}
                  onClick={() => {
                    if (canSkipToCheckpoint(checkpoint.id)) {
                      onCheckpointChange(checkpoint.id);
                    }
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {checkpoint.completed ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : currentCheckpoint === checkpoint.id ? (
                          <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-white" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                        )}
                        <div>
                          <h4 className="font-medium">{checkpoint.title}</h4>
                          <p className="text-sm text-gray-600">{checkpoint.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        {checkpoint.estimatedMinutes}min
                        {currentCheckpoint === checkpoint.id && (
                          <ArrowRight className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Save & Exit Option */}
      <Card className="border-dashed border-gray-300">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Save className="w-4 h-4" />
            <span className="text-sm">
              Your progress is automatically saved. You can return anytime to continue.
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}