import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Trophy, Star, Zap, Target, Gift, Crown, Medal, Award, 
  TrendingUp, Timer, CheckCircle, Lock, Flame, Coins,
  Users, Calendar, Brain, Code, Database, Globe
} from "lucide-react";

interface Challenge {
  id: number;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  skillCategory: string;
  estimatedTime: number;
  basePoints: number;
  bonusMultiplier: number;
  isPremium: boolean;
  prerequisites: string[];
  completionCount: number;
  averageScore: number;
  tags: string[];
}

interface ChallengeAttempt {
  id: number;
  challengeId: number;
  score: number;
  timeSpent: number;
  pointsEarned: number;
  bonusPoints: number;
  completedAt: string;
  feedback: string;
}

export default function ChallengeGamification() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Mock data for demo - in production this would come from API
  const challenges: Challenge[] = [
    {
      id: 1,
      title: "React Component Mastery",
      description: "Build a complex data visualization component with hooks and state management",
      difficulty: "intermediate",
      skillCategory: "Frontend",
      estimatedTime: 45,
      basePoints: 150,
      bonusMultiplier: 2.0,
      isPremium: false,
      prerequisites: ["JavaScript Fundamentals"],
      completionCount: 1247,
      averageScore: 78,
      tags: ["React", "JavaScript", "Components"]
    },
    {
      id: 2,
      title: "API Design Challenge",
      description: "Design and implement a RESTful API with authentication and rate limiting",
      difficulty: "advanced",
      skillCategory: "Backend",
      estimatedTime: 90,
      basePoints: 300,
      bonusMultiplier: 3.0,
      isPremium: true,
      prerequisites: ["Node.js Basics", "Database Design"],
      completionCount: 456,
      averageScore: 71,
      tags: ["API", "Node.js", "Authentication"]
    },
    {
      id: 3,
      title: "Database Optimization Quest",
      description: "Optimize slow queries and design efficient database schemas",
      difficulty: "expert",
      skillCategory: "Database",
      estimatedTime: 120,
      basePoints: 500,
      bonusMultiplier: 4.0,
      isPremium: true,
      prerequisites: ["SQL Mastery", "Performance Tuning"],
      completionCount: 189,
      averageScore: 65,
      tags: ["SQL", "Optimization", "Performance"]
    },
    {
      id: 4,
      title: "CSS Layout Magic",
      description: "Create responsive layouts using modern CSS techniques",
      difficulty: "beginner",
      skillCategory: "Frontend",
      estimatedTime: 30,
      basePoints: 75,
      bonusMultiplier: 1.5,
      isPremium: false,
      prerequisites: [],
      completionCount: 2103,
      averageScore: 82,
      tags: ["CSS", "Layout", "Responsive"]
    }
  ];

  const userAttempts: ChallengeAttempt[] = [
    {
      id: 1,
      challengeId: 4,
      score: 95,
      timeSpent: 25,
      pointsEarned: 75,
      bonusPoints: 38,
      completedAt: "2024-12-15T10:30:00Z",
      feedback: "Excellent work on responsive design!"
    },
    {
      id: 2,
      challengeId: 1,
      score: 88,
      timeSpent: 52,
      pointsEarned: 150,
      bonusPoints: 132,
      completedAt: "2024-12-10T14:20:00Z",
      feedback: "Great component architecture, minor optimization opportunities"
    }
  ];

  const playerStats = {
    totalPoints: 2850,
    challengesCompleted: 15,
    averageScore: 84,
    currentStreak: 7,
    longestStreak: 12,
    rank: "Expert Challenger",
    nextRankPoints: 1150,
    premiumChallengesUnlocked: 8
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-gray-100 text-gray-800';
      case 'intermediate': return 'bg-gray-100 text-gray-800';
      case 'advanced': return 'bg-gray-100 text-gray-800';
      case 'expert': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Frontend': return Code;
      case 'Backend': return Database;
      case 'Database': return Database;
      case 'DevOps': return Globe;
      default: return Brain;
    }
  };

  const calculatePotentialPoints = (challenge: Challenge) => {
    const basePoints = challenge.basePoints;
    const maxBonus = Math.floor(basePoints * (challenge.bonusMultiplier - 1));
    return { base: basePoints, max: basePoints + maxBonus };
  };

  const isCompleted = (challengeId: number) => {
    return userAttempts.some(attempt => attempt.challengeId === challengeId);
  };

  const getAttempt = (challengeId: number) => {
    return userAttempts.find(attempt => attempt.challengeId === challengeId);
  };

  const filteredChallenges = challenges.filter(challenge => {
    const difficultyMatch = selectedDifficulty === 'all' || challenge.difficulty === selectedDifficulty;
    const categoryMatch = selectedCategory === 'all' || challenge.skillCategory === selectedCategory;
    return difficultyMatch && categoryMatch;
  });

  const ChallengeCard = ({ challenge }: { challenge: Challenge }) => {
    const completed = isCompleted(challenge.id);
    const attempt = getAttempt(challenge.id);
    const points = calculatePotentialPoints(challenge);
    const Icon = getCategoryIcon(challenge.skillCategory);

    return (
      <Card className={`relative overflow-hidden transition-all hover:shadow-lg ${
        challenge.isPremium ? 'border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-indigo-50' : 
        completed ? 'border-green-200 bg-green-50' : 'hover:border-blue-200'
      }`}>
        {challenge.isPremium && (
          <div className="absolute top-2 right-2">
            <Crown className="h-5 w-5 text-pink-600" />
          </div>
        )}
        
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${challenge.isPremium ? 'bg-pink-100' : 'bg-blue-100'}`}>
                <Icon className={`h-5 w-5 ${challenge.isPremium ? 'text-pink-600' : 'text-blue-600'}`} />
              </div>
              <div>
                <CardTitle className="text-lg">{challenge.title}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={getDifficultyColor(challenge.difficulty)}>
                    {challenge.difficulty}
                  </Badge>
                  <Badge variant="outline">{challenge.skillCategory}</Badge>
                </div>
              </div>
            </div>
            {completed && (
              <div className="flex items-center gap-1">
                <CheckCircle className="h-5 w-5 text-gray-700" />
                <span className="text-sm font-medium text-gray-700">{attempt?.score}%</span>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{challenge.description}</p>

          {/* Challenge Stats */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-muted-foreground" />
              <span>{challenge.estimatedTime} min</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{challenge.completionCount.toLocaleString()} completed</span>
            </div>
            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-yellow-500" />
              <span>{points.base}-{points.max} pts</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span>{challenge.averageScore}% avg</span>
            </div>
          </div>

          {/* Prerequisites */}
          {challenge.prerequisites.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Prerequisites:</p>
              <div className="flex flex-wrap gap-1">
                {challenge.prerequisites.map(prereq => (
                  <Badge key={prereq} variant="outline" className="text-xs">
                    {prereq}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {challenge.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Action Button */}
          <div className="pt-2">
            {completed ? (
              <div className="space-y-2">
                <Button variant="outline" className="w-full">
                  View Results
                </Button>
                <Button variant="ghost" className="w-full text-sm">
                  Retake Challenge (+{Math.floor(points.base * 0.5)} pts)
                </Button>
              </div>
            ) : challenge.isPremium ? (
              <Button className="w-full bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-700 hover:to-indigo-700">
                <Crown className="h-4 w-4 mr-2" />
                Start Premium Challenge
              </Button>
            ) : (
              <Button className="w-full">
                Start Challenge
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <Card className="bg-gradient-to-r from-blue-600 to-pink-600 text-white">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Trophy className="h-8 w-8 mr-2" />
                <span className="text-2xl font-bold">{playerStats.totalPoints}</span>
              </div>
              <p className="text-blue-100">Total Points</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Target className="h-8 w-8 mr-2" />
                <span className="text-2xl font-bold">{playerStats.challengesCompleted}</span>
              </div>
              <p className="text-blue-100">Challenges Completed</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Flame className="h-8 w-8 mr-2" />
                <span className="text-2xl font-bold">{playerStats.currentStreak}</span>
              </div>
              <p className="text-blue-100">Day Streak</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="h-8 w-8 mr-2" />
                <span className="text-2xl font-bold">{playerStats.averageScore}%</span>
              </div>
              <p className="text-blue-100">Average Score</p>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-blue-100 mb-2">Progress to next rank: {playerStats.rank}</p>
            <Progress 
              value={(playerStats.totalPoints / (playerStats.totalPoints + playerStats.nextRankPoints)) * 100} 
              className="h-2 bg-blue-700"
            />
            <p className="text-xs text-blue-200 mt-1">{playerStats.nextRankPoints} points to Expert Master</p>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Difficulty:</span>
          {['all', 'beginner', 'intermediate', 'advanced', 'expert'].map(difficulty => (
            <Button
              key={difficulty}
              variant={selectedDifficulty === difficulty ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedDifficulty(difficulty)}
              className="text-xs"
            >
              {difficulty === 'all' ? 'All' : difficulty}
            </Button>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Category:</span>
          {['all', 'Frontend', 'Backend', 'Database', 'DevOps'].map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="text-xs"
            >
              {category === 'all' ? 'All' : category}
            </Button>
          ))}
        </div>
      </div>

      {/* Challenge Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChallenges.map(challenge => (
          <ChallengeCard key={challenge.id} challenge={challenge} />
        ))}
      </div>

      {/* Incentive Section */}
      <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-6 w-6 text-orange-600" />
            Bonus Rewards This Week
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border border-orange-200">
              <Zap className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <h4 className="font-semibold">Double Points Weekend</h4>
              <p className="text-sm text-muted-foreground">All challenges give 2x points</p>
              <p className="text-xs text-orange-600 font-medium">2 days left</p>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg border border-pink-200">
              <Crown className="h-8 w-8 text-pink-500 mx-auto mb-2" />
              <h4 className="font-semibold">Premium Challenge Streak</h4>
              <p className="text-sm text-muted-foreground">Complete 3 premium challenges</p>
              <p className="text-xs text-pink-600 font-medium">+1000 bonus points</p>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg border border-green-200">
              <Medal className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h4 className="font-semibold">Perfect Score Club</h4>
              <p className="text-sm text-muted-foreground">Score 100% on any challenge</p>
              <p className="text-xs text-green-600 font-medium">Unlock exclusive badge</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Completions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {userAttempts.slice(0, 3).map(attempt => {
              const challenge = challenges.find(c => c.id === attempt.challengeId);
              return (
                <div key={attempt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">{challenge?.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(attempt.completedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <Badge className={attempt.score >= 90 ? 'bg-green-100 text-green-800' : 
                                     attempt.score >= 70 ? 'bg-blue-100 text-blue-800' : 
                                     'bg-orange-100 text-orange-800'}>
                        {attempt.score}%
                      </Badge>
                      <span className="text-sm font-medium text-yellow-600">
                        +{attempt.pointsEarned + attempt.bonusPoints} pts
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}