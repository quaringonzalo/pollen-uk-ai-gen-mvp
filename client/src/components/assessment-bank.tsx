import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { 
  Brain, Clock, Star, Play, CheckCircle, User, Users, 
  Trophy, Target, BookOpen, Zap, Award, BarChart3,
  Lightbulb, Heart, Cpu, Puzzle, MessageSquare
} from "lucide-react";

interface Assessment {
  id: string;
  title: string;
  description: string;
  category: 'behavioural' | 'technical' | 'cognitive' | 'personality';
  skillArea: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  questions: number;
  pointsReward: number;
  isCompleted: boolean;
  score?: number;
  completedAt?: string;
  prerequisite?: string;
}

interface UserProgress {
  totalAssessments: number;
  completedAssessments: number;
  totalPoints: number;
  averageScore: number;
  strengths: string[];
  areasForImprovement: string[];
}

export default function AssessmentBank({ userId }: { userId: number }) {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);

  // Mock user progress data
  const userProgress: UserProgress = {
    totalAssessments: 24,
    completedAssessments: 8,
    totalPoints: 1250,
    averageScore: 82,
    strengths: ['Communication', 'Problem Solving', 'Teamwork'],
    areasForImprovement: ['Time Management', 'Technical Skills', 'Leadership']
  };

  // Mock assessment data
  const assessments: Assessment[] = [
    {
      id: '1',
      title: 'Communication Skills Assessment',
      description: 'Evaluate your verbal and written communication abilities',
      category: 'behavioural',
      skillArea: 'Communication',
      difficulty: 'beginner',
      duration: 15,
      questions: 20,
      pointsReward: 100,
      isCompleted: true,
      score: 85,
      completedAt: '2024-01-10'
    },
    {
      id: '2',
      title: 'Problem Solving & Critical Thinking',
      description: 'Test your analytical and logical reasoning skills',
      category: 'cognitive',
      skillArea: 'Problem Solving',
      difficulty: 'intermediate',
      duration: 25,
      questions: 15,
      pointsReward: 150,
      isCompleted: true,
      score: 78,
      completedAt: '2024-01-12'
    },
    {
      id: '3',
      title: 'Teamwork & Collaboration',
      description: 'Assess your ability to work effectively in teams',
      category: 'behavioural',
      skillArea: 'Teamwork',
      difficulty: 'beginner',
      duration: 20,
      questions: 18,
      pointsReward: 120,
      isCompleted: true,
      score: 92,
      completedAt: '2024-01-14'
    },
    {
      id: '4',
      title: 'Customer Service Excellence',
      description: 'Evaluate your customer service and interpersonal skills',
      category: 'behavioural',
      skillArea: 'Customer Service',
      difficulty: 'intermediate',
      duration: 30,
      questions: 25,
      pointsReward: 180,
      isCompleted: false
    },
    {
      id: '5',
      title: 'Basic Data Analysis',
      description: 'Test your understanding of data interpretation and analysis',
      category: 'technical',
      skillArea: 'Data Analysis',
      difficulty: 'beginner',
      duration: 35,
      questions: 20,
      pointsReward: 200,
      isCompleted: false
    },
    {
      id: '6',
      title: 'Time Management & Organization',
      description: 'Assess your ability to prioritize and manage tasks efficiently',
      category: 'behavioural',
      skillArea: 'Time Management',
      difficulty: 'beginner',
      duration: 15,
      questions: 16,
      pointsReward: 100,
      isCompleted: false
    },
    {
      id: '7',
      title: 'Emotional Intelligence',
      description: 'Evaluate your emotional awareness and social skills',
      category: 'personality',
      skillArea: 'Emotional Intelligence',
      difficulty: 'intermediate',
      duration: 25,
      questions: 22,
      pointsReward: 150,
      isCompleted: false
    },
    {
      id: '8',
      title: 'Basic Microsoft Office Skills',
      description: 'Test your proficiency with Word, Excel, and PowerPoint',
      category: 'technical',
      skillArea: 'Office Skills',
      difficulty: 'beginner',
      duration: 40,
      questions: 30,
      pointsReward: 250,
      isCompleted: false,
      prerequisite: 'Complete Basic Data Analysis first'
    },
    {
      id: '9',
      title: 'Leadership Potential',
      description: 'Assess your leadership qualities and management potential',
      category: 'behavioural',
      skillArea: 'Leadership',
      difficulty: 'advanced',
      duration: 30,
      questions: 20,
      pointsReward: 200,
      isCompleted: false
    },
    {
      id: '10',
      title: 'Creative Thinking',
      description: 'Evaluate your creativity and innovative problem-solving abilities',
      category: 'cognitive',
      skillArea: 'Creativity',
      difficulty: 'intermediate',
      duration: 20,
      questions: 12,
      pointsReward: 130,
      isCompleted: false
    }
  ];

  const categories = [
    { id: 'all', label: 'All Assessments', icon: BookOpen },
    { id: 'behavioural', label: 'Behavioral', icon: Users },
    { id: 'technical', label: 'Technical', icon: Cpu },
    { id: 'cognitive', label: 'Cognitive', icon: Brain },
    { id: 'personality', label: 'Personality', icon: Heart }
  ];

  const filteredAssessments = selectedCategory === 'all' 
    ? assessments 
    : assessments.filter(a => a.category === selectedCategory);

  const startAssessmentMutation = useMutation({
    mutationFn: async (assessmentId: string) => {
      // Mock API call to start assessment
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { assessmentId, started: true };
    },
    onSuccess: (data) => {
      const assessment = assessments.find(a => a.id === data.assessmentId);
      toast({
        title: "Assessment Started!",
        description: `You've started "${assessment?.title}". You'll earn ${assessment?.pointsReward} points upon completion.`
      });
      
      // In real app, would navigate to assessment page
      setSelectedAssessment(assessment || null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to start assessment. Please try again.",
        variant: "destructive"
      });
    }
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'behavioural':
        return <Users className="w-4 h-4" />;
      case 'technical':
        return <Cpu className="w-4 h-4" />;
      case 'cognitive':
        return <Brain className="w-4 h-4" />;
      case 'personality':
        return <Heart className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* User Progress Overview */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold">{userProgress.completedAssessments}</div>
              <div className="text-sm opacity-90">Completed</div>
              <div className="text-xs opacity-75">of {userProgress.totalAssessments} total</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{userProgress.totalPoints}</div>
              <div className="text-sm opacity-90">Points Earned</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{userProgress.averageScore}%</div>
              <div className="text-sm opacity-90">Average Score</div>
            </div>
            <div className="text-center">
              <div className="text-sm mb-2">Overall Progress</div>
              <Progress 
                value={(userProgress.completedAssessments / userProgress.totalAssessments) * 100} 
                className="h-3 bg-white/20"
              />
              <div className="text-xs mt-1">
                {Math.round((userProgress.completedAssessments / userProgress.totalAssessments) * 100)}% Complete
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strengths and Areas for Improvement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Your Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {userProgress.strengths.map((strength) => (
                <div key={strength} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                  <Star className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-green-800">{strength}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" />
              Areas for Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {userProgress.areasForImprovement.map((area) => (
                <div key={area} className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                  <Lightbulb className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-800">{area}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const IconComponent = category.icon;
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center gap-2"
            >
              <IconComponent className="w-4 h-4" />
              {category.label}
            </Button>
          );
        })}
      </div>

      {/* Assessment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssessments.map((assessment) => (
          <Card key={assessment.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(assessment.category)}
                      <Badge className={getDifficultyColor(assessment.difficulty)}>
                        {assessment.difficulty}
                      </Badge>
                    </div>
                    {assessment.isCompleted && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                  
                  <h3 className="font-semibold text-lg">{assessment.title}</h3>
                  <p className="text-sm text-gray-600">{assessment.description}</p>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{assessment.duration} min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4 text-gray-400" />
                    <span>{assessment.questions} questions</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span>{assessment.pointsReward} points</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="w-4 h-4 text-blue-500" />
                    <span>{assessment.skillArea}</span>
                  </div>
                </div>

                {/* Score or Progress */}
                {assessment.isCompleted && assessment.score && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Your Score</span>
                      <span className={`font-bold text-lg ${getScoreColor(assessment.score)}`}>
                        {assessment.score}%
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Completed on {assessment.completedAt}
                    </div>
                  </div>
                )}

                {/* Prerequisite */}
                {assessment.prerequisite && (
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <div className="text-sm text-yellow-800">
                      <strong>Prerequisite:</strong> {assessment.prerequisite}
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <div className="pt-2">
                  {assessment.isCompleted ? (
                    <Button variant="outline" className="w-full">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View Results
                    </Button>
                  ) : (
                    <Button 
                      className="w-full"
                      onClick={() => startAssessmentMutation.mutate(assessment.id)}
                      disabled={startAssessmentMutation.isPending || !!assessment.prerequisite}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {startAssessmentMutation.isPending ? 'Starting...' : 'Start Assessment'}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredAssessments.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              No assessments found
            </h3>
            <p className="text-gray-500">
              Try selecting a different category to see more assessments.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}