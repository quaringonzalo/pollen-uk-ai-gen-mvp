import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { 
  Target, TrendingUp, Star, BookOpen, Award, Play, 
  CheckCircle, Clock, Zap, Brain, Trophy, ArrowRight,
  Lightbulb, Users, BarChart3, Rocket
} from "lucide-react";

interface SkillRecommendation {
  id: string;
  skill: string;
  currentLevel: number;
  recommendedLevel: number;
  priority: 'high' | 'medium' | 'low';
  reason: string;
  source: 'assessment' | 'market_demand' | 'career_path';
  marketDemand: number;
  salaryImpact: number;
  timeToLearn: string;
  learningPath: string[];
  relatedJobs: string[];
}

interface GameificationState {
  totalPoints: number;
  level: number;
  streak: number;
  badges: string[];
  weeklyGoal: number;
  weeklyProgress: number;
}

export default function SkillRecommendationEngine({ userId }: { userId: number }) {
  const { toast } = useToast();
  const [selectedSkill, setSelectedSkill] = useState<SkillRecommendation | null>(null);
  const [viewMode, setViewMode] = useState<'recommended' | 'explore' | 'progress'>('recommended');

  // Mock data - in real app would come from API based on user assessment
  const gamificationState: GameificationState = {
    totalPoints: 2450,
    level: 7,
    streak: 12,
    badges: ['Early Bird', 'Quick Learner', 'Assessment Champion', 'Skill Explorer'],
    weeklyGoal: 5,
    weeklyProgress: 3
  };

  const skillRecommendations: SkillRecommendation[] = [
    {
      id: '1',
      skill: 'Digital Marketing',
      currentLevel: 2,
      recommendedLevel: 4,
      priority: 'high',
      reason: 'Based on your assessment results and career goals in marketing',
      source: 'assessment',
      marketDemand: 92,
      salaryImpact: 18,
      timeToLearn: '4-6 weeks',
      learningPath: ['Social Media Basics', 'Content Creation', 'Analytics', 'Campaign Management'],
      relatedJobs: ['Marketing Assistant', 'Social Media Coordinator', 'Content Creator']
    },
    {
      id: '2',
      skill: 'Data Analysis',
      currentLevel: 1,
      recommendedLevel: 3,
      priority: 'high',
      reason: 'High demand in your preferred industry with excellent salary potential',
      source: 'market_demand',
      marketDemand: 89,
      salaryImpact: 25,
      timeToLearn: '6-8 weeks',
      learningPath: ['Excel Basics', 'Data Visualization', 'Statistical Analysis', 'Reporting'],
      relatedJobs: ['Data Analyst', 'Business Analyst', 'Research Assistant']
    },
    {
      id: '3',
      skill: 'Project Management',
      currentLevel: 1,
      recommendedLevel: 3,
      priority: 'medium',
      reason: 'Complementary skill for your career progression path',
      source: 'career_path',
      marketDemand: 78,
      salaryImpact: 15,
      timeToLearn: '3-4 weeks',
      learningPath: ['Planning Basics', 'Task Management', 'Team Coordination', 'Agile Methods'],
      relatedJobs: ['Project Coordinator', 'Operations Assistant', 'Team Lead']
    },
    {
      id: '4',
      skill: 'Customer Service Excellence',
      currentLevel: 3,
      recommendedLevel: 4,
      priority: 'medium',
      reason: 'Strengthen your existing skills for better opportunities',
      source: 'assessment',
      marketDemand: 71,
      salaryImpact: 8,
      timeToLearn: '2-3 weeks',
      learningPath: ['Communication Skills', 'Conflict Resolution', 'CRM Systems', 'Service Recovery'],
      relatedJobs: ['Customer Success Manager', 'Account Coordinator', 'Support Specialist']
    },
    {
      id: '5',
      skill: 'Basic Coding',
      currentLevel: 0,
      recommendedLevel: 2,
      priority: 'low',
      reason: 'Emerging skill with future potential in your field',
      source: 'market_demand',
      marketDemand: 85,
      salaryImpact: 30,
      timeToLearn: '8-12 weeks',
      learningPath: ['HTML/CSS Basics', 'JavaScript Fundamentals', 'Web Development', 'Problem Solving'],
      relatedJobs: ['Junior Developer', 'Technical Support', 'Digital Assistant']
    }
  ];

  const allSkills = [
    'Communication', 'Leadership', 'Time Management', 'Problem Solving', 'Creativity',
    'Critical Thinking', 'Teamwork', 'Adaptability', 'Emotional Intelligence', 'Sales',
    'Public Speaking', 'Negotiation', 'Research', 'Writing', 'Design Thinking',
    'Event Planning', 'Translation', 'Photography', 'Video Editing', 'Social Media'
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'assessment':
        return <Brain className="w-4 h-4" />;
      case 'market_demand':
        return <TrendingUp className="w-4 h-4" />;
      case 'career_path':
        return <Target className="w-4 h-4" />;
      default:
        return <Star className="w-4 h-4" />;
    }
  };

  const startLearning = (skill: SkillRecommendation) => {
    toast({
      title: "Learning Path Started!",
      description: `You've started learning ${skill.skill}. You'll earn points for each milestone completed.`
    });
    
    // In real app, would start learning path and update user progress
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Gamification Header */}
      <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold">{gamificationState.totalPoints.toLocaleString()}</div>
              <div className="text-sm opacity-90">Total Points</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold flex items-center justify-center gap-2">
                <Trophy className="w-8 h-8" />
                {gamificationState.level}
              </div>
              <div className="text-sm opacity-90">Level</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold flex items-center justify-center gap-2">
                <Zap className="w-8 h-8" />
                {gamificationState.streak}
              </div>
              <div className="text-sm opacity-90">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-sm mb-2">Weekly Progress</div>
              <Progress 
                value={(gamificationState.weeklyProgress / gamificationState.weeklyGoal) * 100} 
                className="h-3 bg-white/20"
              />
              <div className="text-xs mt-1">{gamificationState.weeklyProgress}/{gamificationState.weeklyGoal} skills</div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4">
            {gamificationState.badges.map((badge) => (
              <Badge key={badge} className="bg-white/20 text-white border-white/30">
                <Award className="w-3 h-3 mr-1" />
                {badge}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex gap-2">
        <Button 
          variant={viewMode === 'recommended' ? 'default' : 'outline'}
          onClick={() => setViewMode('recommended')}
        >
          <Target className="w-4 h-4 mr-2" />
          Recommended for You
        </Button>
        <Button 
          variant={viewMode === 'explore' ? 'default' : 'outline'}
          onClick={() => setViewMode('explore')}
        >
          <BookOpen className="w-4 h-4 mr-2" />
          Explore All Skills
        </Button>
        <Button 
          variant={viewMode === 'progress' ? 'default' : 'outline'}
          onClick={() => setViewMode('progress')}
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          My Progress
        </Button>
      </div>

      {/* Recommended Skills */}
      {viewMode === 'recommended' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Personalized Skill Recommendations</h2>
            <p className="text-gray-600">Based on your assessment results, career goals, and market demand</p>
          </div>

          <div className="grid gap-6">
            {skillRecommendations.map((skill) => (
              <Card key={skill.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{skill.skill}</h3>
                        <Badge className={getPriorityColor(skill.priority)}>
                          {skill.priority} priority
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          {getSourceIcon(skill.source)}
                          <span className="capitalize">{skill.source.replace('_', ' ')}</span>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-3">{skill.reason}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-gray-600">Market Demand</div>
                          <div className="font-semibold text-green-600">{skill.marketDemand}%</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Salary Impact</div>
                          <div className="font-semibold text-blue-600">+{skill.salaryImpact}%</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Time to Learn</div>
                          <div className="font-semibold">{skill.timeToLearn}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Current Level</div>
                          <div className="font-semibold">{skill.currentLevel}/5</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="text-sm font-medium mb-1">Learning Path</div>
                          <div className="flex flex-wrap gap-1">
                            {skill.learningPath.map((step, index) => (
                              <Badge key={step} variant="outline" className="text-xs">
                                {index + 1}. {step}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm font-medium mb-1">Related Job Opportunities</div>
                          <div className="flex flex-wrap gap-1">
                            {skill.relatedJobs.map((job) => (
                              <Badge key={job} variant="secondary" className="text-xs">
                                {job}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-6 text-center">
                      <div className="mb-4">
                        <div className="text-2xl font-bold text-blue-600 mb-1">
                          +{Math.round((skill.recommendedLevel - skill.currentLevel) * 50)}
                        </div>
                        <div className="text-sm text-gray-600">Points to earn</div>
                      </div>
                      
                      <Button onClick={() => startLearning(skill)} className="w-full">
                        <Play className="w-4 h-4 mr-2" />
                        Start Learning
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Progress to Target Level</span>
                      <span className="text-sm text-gray-600">
                        Level {skill.currentLevel} → {skill.recommendedLevel}
                      </span>
                    </div>
                    <Progress 
                      value={(skill.currentLevel / skill.recommendedLevel) * 100} 
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Explore All Skills */}
      {viewMode === 'explore' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Explore All Skills</h2>
            <p className="text-gray-600">Discover new skills to expand your career opportunities</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allSkills.map((skill) => (
              <Card key={skill} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-medium mb-2">{skill}</h3>
                    <Button variant="outline" size="sm" className="w-full">
                      <Lightbulb className="w-3 h-3 mr-1" />
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Progress Tracking */}
      {viewMode === 'progress' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">My Learning Progress</h2>
            <p className="text-gray-600">Track your skill development journey</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Skills in Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {skillRecommendations.slice(0, 3).map((skill) => (
                    <div key={skill.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{skill.skill}</span>
                        <span className="text-sm text-gray-600">
                          {skill.currentLevel}/{skill.recommendedLevel}
                        </span>
                      </div>
                      <Progress value={(skill.currentLevel / skill.recommendedLevel) * 100} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium">Communication Basics</div>
                      <div className="text-sm text-gray-600">+50 points earned</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Star className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium">Quick Learner Badge</div>
                      <div className="text-sm text-gray-600">Completed 3 skills in a week</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <Zap className="w-5 h-5 text-purple-600" />
                    <div>
                      <div className="font-medium">12-Day Streak</div>
                      <div className="text-sm text-gray-600">Keep it up!</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}