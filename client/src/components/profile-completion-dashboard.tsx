import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Clock, 
  ArrowRight, 
  ArrowLeft,
  Home,
  Brain, 
  Heart, 
  GraduationCap, 
  Target, 
  Globe, 
  Users,
  Star
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface CheckpointStatus {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
  questionsTotal: number;
  questionsCompleted: number;
  estimatedTime: string;
  isOptional?: boolean;
}

interface ProfileCompletionDashboardProps {
  onNavigateToCheckpoint: (checkpointId: string) => void;
}

export function ProfileCompletionDashboard({ onNavigateToCheckpoint }: ProfileCompletionDashboardProps) {
  const { data: completionStatus } = useQuery({
    queryKey: ['/api/profile-completion-status'],
    queryFn: async () => {
      const response = await fetch('/api/profile-completion-status');
      return response.json();
    }
  });

  const checkpoints: CheckpointStatus[] = [
    {
      id: "work-style",
      name: "Discover Your Work Style",
      description: "Complete behavioural assessment for better job matching",
      icon: <Brain className="w-5 h-5" />,
      completed: completionStatus?.workStyle || false,
      questionsTotal: 15,
      questionsCompleted: completionStatus?.workStyle ? 15 : 0,
      estimatedTime: "5-7 min"
    },
    {
      id: "personal-story", 
      name: "Your Personal Story",
      description: "Share your career aspirations and personality insights",
      icon: <Heart className="w-5 h-5" />,
      completed: completionStatus?.personalStory || false,
      questionsTotal: 6,
      questionsCompleted: completionStatus?.personalStory ? 6 : 0,
      estimatedTime: "3-5 min"
    },
    {
      id: "practical-preferences",
      name: "The Practical Stuff",
      description: "Pronouns, visa, employment type, location, and timing preferences",
      icon: <Globe className="w-5 h-5" />,
      completed: completionStatus?.practicalPreferences || false,
      questionsTotal: 9,
      questionsCompleted: completionStatus?.practicalPreferences ? 9 : 0,
      estimatedTime: "3-5 min"
    },
    {
      id: "interests-preferences",
      name: "What Lights You Up",
      description: "Subjects, roles, industries, and company preferences",
      icon: <Target className="w-5 h-5" />,
      completed: completionStatus?.interestsPreferences || false,
      questionsTotal: 7,
      questionsCompleted: completionStatus?.interestsPreferences ? 7 : 0,
      estimatedTime: "4-6 min"
    },
    {
      id: "education",
      name: "Your Learning Journey", 
      description: "Educational background and qualifications (optional)",
      icon: <GraduationCap className="w-5 h-5" />,
      completed: completionStatus?.education || false,
      questionsTotal: 3,
      questionsCompleted: completionStatus?.education ? 3 : 0,
      estimatedTime: "2-3 min",
      isOptional: true
    },
    {
      id: "personal-info",
      name: "Supporting Diversity",
      description: "Demographics and background information (optional)",
      icon: <Users className="w-5 h-5" />,
      completed: completionStatus?.personalInfo || false,
      questionsTotal: 13,
      questionsCompleted: completionStatus?.personalInfo ? 13 : 0,
      estimatedTime: "4-6 min",
      isOptional: true
    },
    {
      id: "job-search-experience",
      name: "Help Us Help You",
      description: "Your job searching journey and experiences (optional)",
      icon: <Star className="w-5 h-5" />,
      completed: completionStatus?.jobSearchExperience || false,
      questionsTotal: 7,
      questionsCompleted: completionStatus?.jobSearchExperience ? 7 : 0,
      estimatedTime: "3-5 min",
      isOptional: true
    }
  ];

  const completedCheckpoints = checkpoints.filter(c => c.completed).length;
  const totalRequiredCheckpoints = checkpoints.filter(c => !c.isOptional).length;
  const completionPercentage = Math.round((completedCheckpoints / checkpoints.length) * 100);
  const coreCompletionPercentage = Math.round((checkpoints.filter(c => c.completed && !c.isOptional).length / totalRequiredCheckpoints) * 100);

  const getStatusBadge = (checkpoint: CheckpointStatus) => {
    if (checkpoint.completed) {
      return <Badge variant="default" className="bg-green-50 text-green-700 border-green-200">Complete</Badge>;
    }
    return <Badge variant="outline" className="text-orange-600 border-orange-200">Incomplete</Badge>;
  };

  const nextIncompleteCheckpoint = checkpoints.find(c => !c.completed && !c.isOptional);

  return (
    <div className="max-w-4xl mx-auto p-3 sm:px-6 sm:pt-3 sm:pb-6">
      <div className="flex justify-end items-center mb-4 sm:mb-6">
        <Button 
          variant="ghost" 
          onClick={() => window.location.href = "/profile"}
          className="text-sm sm:text-base"
        >
          Review Profile
        </Button>
      </div>
      
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
          <Star className="w-6 h-6 sm:w-8 sm:h-8 text-pink-600" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Profile Completion</h1>
        <p className="text-sm sm:text-base text-gray-600 mb-4 px-4 sm:px-0">
          Complete your profile to get better job matches and opportunities
        </p>
        
        {/* Overall Progress */}
        <div className="bg-white rounded-lg border p-4 sm:p-6 mx-2 sm:mx-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm font-medium text-gray-700">Overall Progress</span>
            <span className="text-xs sm:text-sm font-medium text-gray-900">{completedCheckpoints} of {checkpoints.length} sections</span>
          </div>
          <Progress value={completionPercentage} className="w-full mb-2" />
          
          {/* Core vs Optional breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mt-4 text-xs sm:text-sm">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-gray-600">Core Profile</span>
                <span className="font-medium">{coreCompletionPercentage}%</span>
              </div>
              <Progress value={coreCompletionPercentage} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-gray-600">Optional Data</span>
                <span className="font-medium">
                  {checkpoints.find(c => c.id === 'background-data')?.completed ? '100%' : '0%'}
                </span>
              </div>
              <Progress 
                value={checkpoints.find(c => c.id === 'background-data')?.completed ? 100 : 0} 
                className="h-2" 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action */}
      {nextIncompleteCheckpoint && (
        <Card className="mb-4 sm:mb-6 border-l-4 border-l-blue-500 bg-blue-50/50 mx-2 sm:mx-0">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  {nextIncompleteCheckpoint.icon}
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900">Continue Profile Setup</h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Next: {nextIncompleteCheckpoint.name} ({nextIncompleteCheckpoint.estimatedTime})
                  </p>
                </div>
              </div>
              <Button 
                onClick={() => onNavigateToCheckpoint(nextIncompleteCheckpoint.id)}
                className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto text-sm"
                size="sm"
              >
                Continue <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Checkpoint List */}
      <div className="space-y-3 sm:space-y-4 px-2 sm:px-0">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Profile Sections</h2>
        
        {checkpoints.map((checkpoint, index) => (
          <Card 
            key={checkpoint.id} 
            className={`transition-all hover:shadow-md ${
              checkpoint.completed ? 'bg-green-50/30 border-green-200' : 'hover:border-blue-200'
            }`}
          >
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    checkpoint.completed 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {checkpoint.completed ? <CheckCircle className="w-6 h-6" /> : checkpoint.icon}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-1">
                      <h3 className="font-semibold text-gray-900">{checkpoint.name}</h3>
                      {getStatusBadge(checkpoint)}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{checkpoint.description}</p>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>{checkpoint.questionsCompleted}/{checkpoint.questionsTotal} questions</span>
                      <span>•</span>
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {checkpoint.estimatedTime}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
                  {checkpoint.completed ? (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onNavigateToCheckpoint(checkpoint.id)}
                      className="w-full sm:w-auto text-xs sm:text-sm"
                    >
                      Review
                    </Button>
                  ) : (
                    <Button 
                      size="sm"
                      onClick={() => onNavigateToCheckpoint(checkpoint.id)}
                      variant={checkpoint.isOptional ? "outline" : "default"}
                      className="w-full sm:w-auto text-xs sm:text-sm"
                    >
                      {checkpoint.questionsCompleted > 0 ? 'Continue' : 'Start'}
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Progress bar for incomplete sections */}
              {!checkpoint.completed && checkpoint.questionsCompleted > 0 && (
                <div className="mt-4">
                  <Progress 
                    value={(checkpoint.questionsCompleted / checkpoint.questionsTotal) * 100} 
                    className="h-2"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Completion Message */}
      {completedCheckpoints === checkpoints.length && (
        <Card className="mt-4 sm:mt-6 bg-green-50 border-green-200 mx-2 sm:mx-0">
          <CardContent className="p-4 sm:p-6 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-green-900 mb-2">Profile Complete!</h3>
            <p className="text-sm sm:text-base text-green-700 px-2 sm:px-0">
              Your profile is fully complete. You're ready to receive personalised job matches and opportunities.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}