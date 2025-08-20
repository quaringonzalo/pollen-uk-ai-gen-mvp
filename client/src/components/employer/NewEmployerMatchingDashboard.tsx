import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle, ArrowRight, Clock, Settings, FileText, Users } from 'lucide-react';
import ConsolidatedAssessmentConfig from './ConsolidatedAssessmentConfig';
import { useLocation } from 'wouter';

interface CheckpointData {
  jobPosting?: any;
  assessmentConfig?: any;
  personaReview?: any;
  adminReview?: any;
}

interface NewEmployerMatchingDashboardProps {
  jobData?: any;
  onComplete?: (data: any) => void;
}

export default function NewEmployerMatchingDashboard({ jobData, onComplete }: NewEmployerMatchingDashboardProps) {
  const [currentCheckpoint, setCurrentCheckpoint] = useState<number>(0);
  const [checkpointData, setCheckpointData] = useState<CheckpointData>({});
  const [location, navigate] = useLocation();

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

  const handleCheckpointComplete = (checkpointKey: string, data: any) => {
    setCheckpointData(prev => ({
      ...prev,
      [checkpointKey]: data
    }));
    
    // Return to dashboard to show progress
    setCurrentCheckpoint(0);
    
    // If this was the final step, trigger completion
    if (checkpointKey === 'personaReview' && onComplete) {
      const finalData = { ...checkpointData, [checkpointKey]: data };
      onComplete(finalData);
    }
  };

  const renderCurrentCheckpoint = () => {
    switch (currentCheckpoint) {
      case 1:
        // Navigate to job posting creation
        navigate('/comprehensive-job-posting');
        return null;
        
      case 2:
        return (
          <ConsolidatedAssessmentConfig
            onBack={() => setCurrentCheckpoint(0)}
            onComplete={(data) => handleCheckpointComplete('assessmentConfig', data)}
            initialData={checkpointData.assessmentConfig}
          />
        );
        
      case 3:
        return (
          <div className="max-w-4xl mx-auto p-6">
            <Card>
              <CardHeader>
                <CardTitle>Persona Review & Challenge Refinement</CardTitle>
                <CardDescription>
                  Review the generated ideal candidate persona and customize challenges
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Based on your assessment configuration, we'll generate an ideal candidate persona 
                    and create customized challenges. This step will be available after completing 
                    the assessment configuration.
                  </p>
                  <Button 
                    onClick={() => handleCheckpointComplete('personaReview', { reviewed: true })}
                    className="bg-pink-600 hover:bg-pink-700"
                    style={{fontFamily: 'Sora'}}
                  >
                    Complete Persona Review
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
        
      case 4:
        return (
          <div className="max-w-4xl mx-auto p-6">
            <Card>
              <CardHeader>
                <CardTitle>Admin Review & Activation</CardTitle>
                <CardDescription>
                  Your assessment is being reviewed by our team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Our team will review your assessment configuration and activate it within 24 hours.
                    You'll receive an email notification once it's ready.
                  </p>
                  <Button 
                    onClick={() => handleCheckpointComplete('adminReview', { submitted: true })}
                    className="bg-pink-600 hover:bg-pink-700"
                    style={{fontFamily: 'Sora'}}
                  >
                    Submit for Review
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
        
      default:
        return null;
    }
  };

  if (currentCheckpoint > 0) {
    return renderCurrentCheckpoint();
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{fontFamily: 'Sora'}}>Assessment Setup Dashboard</h1>
        <p className="text-gray-600" style={{fontFamily: 'Poppins'}}>
          Complete these steps to create your customised candidate assessment system
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {checkpoints.map((checkpoint) => {
          const Icon = checkpoint.icon;
          const isCompleted = checkpoint.completed;
          const canStart = checkpoint.id === 1 || checkpoints[checkpoint.id - 2]?.completed;
          
          return (
            <Card key={checkpoint.id} className={`relative ${isCompleted ? 'border-green-200 bg-green-50' : canStart ? 'border-pink-200' : 'border-gray-200 bg-gray-50'}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${isCompleted ? 'bg-green-100' : canStart ? 'bg-pink-100' : 'bg-gray-100'}`}>
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Icon className={`w-5 h-5 ${canStart ? 'text-pink-600' : 'text-gray-400'}`} />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg" style={{fontFamily: 'Sora'}}>{checkpoint.title}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <Clock className="w-4 h-4 mr-1" />
                        {checkpoint.time}
                      </CardDescription>
                    </div>
                  </div>
                  {isCompleted && (
                    <div className="text-green-600 font-medium text-sm">
                      Completed
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{checkpoint.description}</p>
                <Button
                  onClick={() => setCurrentCheckpoint(checkpoint.id)}
                  disabled={!canStart}
                  variant={isCompleted ? "outline" : "default"}
                  className={`w-full ${canStart && !isCompleted ? 'bg-pink-600 hover:bg-pink-700' : ''}`}
                  style={{fontFamily: 'Sora'}}
                >
                  {isCompleted ? "Review & Edit" : canStart ? "Start" : "Locked"}
                  {canStart && <ArrowRight className="w-4 h-4 ml-2" />}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {checkpoints.some(c => c.completed) && (
        <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900" style={{fontFamily: 'Sora'}}>Progress Overview</h3>
              <p className="text-gray-700 text-sm" style={{fontFamily: 'Poppins'}}>
                {checkpoints.filter(c => c.completed).length} of {checkpoints.length} steps completed
              </p>
            </div>
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-pink-600 h-2 rounded-full transition-all"
                style={{ width: `${(checkpoints.filter(c => c.completed).length / checkpoints.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}