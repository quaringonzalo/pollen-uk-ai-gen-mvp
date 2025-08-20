import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle, ArrowRight, Clock, Settings, FileText, Users } from 'lucide-react';
import ConsolidatedAssessmentConfig from './ConsolidatedAssessmentConfig';
import EmployerMatchingCheckpoint6 from './EmployerMatchingCheckpoint6';

interface CheckpointData {
  jobPosting?: any;
  assessmentConfig?: any;
  personaReview?: any;
  adminReview?: any;
}

interface EmployerMatchingDashboardProps {
  jobData?: any;
  onComplete?: (data: any) => void;
}

export default function EmployerMatchingDashboard({ jobData, onComplete }: EmployerMatchingDashboardProps) {
  const [currentCheckpoint, setCurrentCheckpoint] = useState<number>(0);
  const [checkpointData, setCheckpointData] = useState<CheckpointData>({});

  const checkpoints = [
    {
      id: 1,
      title: 'Job Posting Creation',
      description: 'Complete job posting with role details and requirements',
      time: '10-15 minutes',
      completed: !!checkpointData.jobPosting,
      icon: FileText
    },
    {
      id: 2,
      title: 'Assessment Configuration', 
      description: 'Define role requirements and challenge parameters',
      time: '20-25 minutes',
      completed: !!checkpointData.assessmentConfig,
      icon: Settings
    },
    {
      id: 3,
      title: 'Persona Review & Challenge Refinement',
      description: 'Review generated persona and customize challenges',
      time: '4-5 minutes',
      completed: !!checkpointData.personaReview,
      icon: Users
    },
    {
      id: 4,
      title: 'Admin Review & Activation',
      description: 'Final review and challenge activation',
      time: '24 hours',
      completed: !!checkpointData.adminReview,
      icon: CheckCircle
    }
  ];

  const handleCheckpointComplete = (checkpointNum: number, data: any) => {
    setCheckpointData(prev => ({
      ...prev,
      [`checkpoint${checkpointNum}`]: data
    }));
    
    // Move to next checkpoint or back to dashboard
    if (checkpointNum < 5) {
      setCurrentCheckpoint(0); // Return to dashboard to show progress
    } else {
      // Final completion - trigger persona generation and completion callback
      const finalData = { ...checkpointData, checkpoint5: data };
      console.log('All checkpoints completed:', finalData);
      
      // Call the completion callback if provided
      if (onComplete) {
        onComplete(finalData);
      } else {
        setCurrentCheckpoint(0);
      }
    }
  };

  const handleBackToDashboard = () => {
    setCurrentCheckpoint(0);
  };

  const startCheckpoint = (checkpointNum: number) => {
    setCurrentCheckpoint(checkpointNum);
  };

  const completedCheckpoints = checkpoints.filter(cp => cp.completed).length;
  const totalTime = checkpoints.reduce((sum, cp) => {
    const time = parseInt(cp.time.split('-')[0]);
    return sum + time;
  }, 0);

  // Render specific checkpoint
  if (currentCheckpoint > 0) {
    const commonProps = {
      onBack: handleBackToDashboard,
      initialData: checkpointData[`checkpoint${currentCheckpoint}` as keyof CheckpointData]
    };

    switch (currentCheckpoint) {
      case 1:
        return (
          <EmployerMatchingCheckpoint1
            onBack={handleBackToDashboard}
            initialData={checkpointData.checkpoint1}
            onContinue={(data) => handleCheckpointComplete(1, data)}
          />
        );
      case 2:
        return (
          <EmployerMatchingCheckpoint2
            onBack={handleBackToDashboard}
            initialData={checkpointData.checkpoint2}
            checkpoint1Data={checkpointData.checkpoint1}
            onContinue={(data) => handleCheckpointComplete(2, data)}
          />
        );
      case 3:
        return (
          <EmployerMatchingCheckpoint3
            onBack={handleBackToDashboard}
            initialData={checkpointData.checkpoint3}
            checkpoint1Data={checkpointData.checkpoint1}
            onContinue={(data) => handleCheckpointComplete(3, data)}
          />
        );
      case 4:
        return (
          <EmployerMatchingCheckpoint4
            onBack={handleBackToDashboard}
            initialData={checkpointData.checkpoint4}
            checkpoint1Data={checkpointData.checkpoint1}
            onContinue={(data) => handleCheckpointComplete(4, data)}
          />
        );
      case 5:
        return (
          <EmployerMatchingCheckpoint5
            onBack={handleBackToDashboard}
            initialData={checkpointData.checkpoint5}
            onComplete={(data) => handleCheckpointComplete(5, data)}
          />
        );
      default:
        return null;
    }
  }

  // Render dashboard
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2" style={{fontFamily: 'Sora'}}>
          Candidate Matching Configuration
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300" style={{fontFamily: 'Poppins'}}>
          Configure your candidate matching preferences through our step-by-step process
        </p>
        <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Total time: ~{totalTime} minutes</span>
          </div>
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            <span>Progress: {completedCheckpoints}/5 completed</span>
          </div>
        </div>
      </div>

      {completedCheckpoints === 5 && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <h3 className="font-semibold text-green-900 dark:text-green-100">Configuration Complete!</h3>
          </div>
          <p className="text-green-800 dark:text-green-200 text-sm mb-3">
            Your bespoke challenge suite is ready and the matching algorithm has been activated. 
            You'll be notified when qualified candidates complete their assessments.
          </p>
          <Button className="bg-pink-600 hover:bg-pink-700 text-white" style={{fontFamily: 'Sora'}}>
            View Candidate Pipeline
          </Button>
        </div>
      )}

      <div className="grid gap-4">
        {checkpoints.map((checkpoint) => (
          <Card key={checkpoint.id} className={`cursor-pointer transition-colours ${
            checkpoint.completed 
              ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20' 
              : 'hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {checkpoint.completed ? (
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-400" />
                  )}
                  <div>
                    <CardTitle className="text-lg" style={{fontFamily: 'Sora'}}>
                      Checkpoint {checkpoint.id}: {checkpoint.title}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {checkpoint.description}
                    </CardDescription>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {checkpoint.time}
                  </div>
                  <Button
                    onClick={() => startCheckpoint(checkpoint.id)}
                    variant={checkpoint.completed ? "secondary" : "default"}
                    size="sm"
                    className={`flex items-center gap-2 ${!checkpoint.completed ? 'bg-pink-600 hover:bg-pink-700' : ''}`}
                    style={{fontFamily: 'Sora'}}
                  >
                    {checkpoint.completed ? 'Review & Edit' : 'Start'}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            {checkpoint.completed && (
              <CardContent className="pt-0">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Completed - configuration saved and ready for challenge generation
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {completedCheckpoints > 0 && completedCheckpoints < 5 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="w-5 h-5 text-pink-600 dark:text-pink-400" />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100" style={{fontFamily: 'Sora'}}>Progress Saved</h3>
          </div>
          <p className="text-gray-700 dark:text-gray-200 text-sm" style={{fontFamily: 'Poppins'}}>
            Your progress has been automatically saved. Continue with the remaining checkpoints 
            to activate candidate matching.
          </p>
        </div>
      )}
    </div>
  );
}