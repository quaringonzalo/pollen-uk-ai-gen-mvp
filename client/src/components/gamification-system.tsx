import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { Trophy, Star, Zap, Target, Gift, Crown, Medal, Award, TrendingUp, Users, Calendar } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  points: number;
  category: 'skills' | 'community' | 'profile' | 'social';
}

export default function GamificationSystem() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - in production this would come from API
  const playerStats = {
    level: 12,
    totalPoints: 2850,
    pointsToNextLevel: 150,
    currentLevelPoints: 2700,
    nextLevelPoints: 3000,
    streak: 7,
    completedChallenges: 15,
    verifiedSkills: 8,
    communityEvents: 5
  };

  const achievements: Achievement[] = [
    {
      id: 'first_challenge',
      title: 'First Steps',
      description: 'Complete your first skills challenge',
      icon: Target,
      progress: 1,
      maxProgress: 1,
      unlocked: true,
      points: 100,
      category: 'skills'
    },
    {
      id: 'skill_master',
      title: 'Skill Master',
      description: 'Verify 5 different skills',
      icon: Award,
      progress: 3,
      maxProgress: 5,
      unlocked: false,
      points: 500,
      category: 'skills'
    },
    {
      id: 'perfect_score',
      title: 'Perfect Score',
      description: 'Score 100% on any challenge',
      icon: Star,
      progress: 0,
      maxProgress: 1,
      unlocked: false,
      points: 250,
      category: 'skills'
    },
    {
      id: 'community_member',
      title: 'Community Member',
      description: 'Attend 3 community events',
      icon: Users,
      progress: 2,
      maxProgress: 3,
      unlocked: false,
      points: 300,
      category: 'community'
    },
    {
      id: 'profile_complete',
      title: 'Profile Pro',
      description: 'Complete your profile to 100%',
      icon: Crown,
      progress: 85,
      maxProgress: 100,
      unlocked: false,
      points: 200,
      category: 'profile'
    },
    {
      id: 'weekly_warrior',
      title: 'Weekly Warrior',
      description: 'Complete challenges 7 days in a row',
      icon: Zap,
      progress: 7,
      maxProgress: 7,
      unlocked: true,
      points: 400,
      category: 'skills'
    }
  ];

  const weeklyQuests = [
    {
      id: 'complete_2_challenges',
      title: 'Challenge Accepted',
      description: 'Complete 2 skills challenges',
      progress: 1,
      maxProgress: 2,
      points: 150,
      deadline: '3 days remaining'
    },
    {
      id: 'attend_event',
      title: 'Community Spirit',
      description: 'Attend 1 community event',
      progress: 0,
      maxProgress: 1,
      points: 100,
      deadline: '5 days remaining'
    },
    {
      id: 'update_profile',
      title: 'Profile Polish',
      description: 'Update your profile information',
      progress: 0,
      maxProgress: 1,
      points: 75,
      deadline: '2 days remaining'
    }
  ];

  const rewards = [
    {
      id: 'premium_challenge',
      title: 'Premium Challenge Access',
      description: 'Unlock advanced challenges',
      cost: 500,
      available: true,
      icon: Crown
    },
    {
      id: 'profile_boost',
      title: 'Profile Visibility Boost',
      description: '7 days of enhanced visibility',
      cost: 300,
      available: true,
      icon: TrendingUp
    },
    {
      id: 'mentor_session',
      title: '1-on-1 Mentor Session',
      description: 'Book a session with industry expert',
      cost: 800,
      available: false,
      icon: Users
    },
    {
      id: 'event_priority',
      title: 'Priority Event Booking',
      description: 'Skip the queue for popular events',
      cost: 200,
      available: true,
      icon: Calendar
    }
  ];

  const levelProgress = ((playerStats.totalPoints - playerStats.currentLevelPoints) / 
                        (playerStats.nextLevelPoints - playerStats.currentLevelPoints)) * 100;

  const AchievementCard = ({ achievement }: { achievement: Achievement }) => {
    const Icon = achievement.icon;
    const progressPercent = (achievement.progress / achievement.maxProgress) * 100;
    
    return (
      <Card className={`transition-all ${achievement.unlocked ? 'border-green-200 bg-green-50' : 'opacity-75'}`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${achievement.unlocked ? 'bg-green-100' : 'bg-gray-100'}`}>
              <Icon className={`h-5 w-5 ${achievement.unlocked ? 'text-green-600' : 'text-gray-400'}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium">{achievement.title}</h4>
                <Badge variant={achievement.unlocked ? "default" : "secondary"}>
                  {achievement.points} pts
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>{achievement.progress}/{achievement.maxProgress}</span>
                  <span>{Math.round(progressPercent)}%</span>
                </div>
                <Progress value={progressPercent} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Player Stats Header */}
      <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Crown className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">Level {playerStats.level}</h3>
              <p className="text-sm text-muted-foreground">Skill Explorer</p>
              <div className="mt-2">
                <Progress value={levelProgress} className="h-2" />
                <p className="text-xs mt-1">{playerStats.pointsToNextLevel} pts to next level</p>
              </div>
            </div>

            <div className="text-center">
              <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <h4 className="text-xl font-bold">{playerStats.totalPoints}</h4>
              <p className="text-sm text-muted-foreground">Total Points</p>
            </div>

            <div className="text-center">
              <Zap className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <h4 className="text-xl font-bold">{playerStats.streak}</h4>
              <p className="text-sm text-muted-foreground">Day Streak</p>
            </div>

            <div className="text-center">
              <Medal className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h4 className="text-xl font-bold">{playerStats.verifiedSkills}</h4>
              <p className="text-sm text-muted-foreground">Verified Skills</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg">
        {[
          { id: "overview", label: "Overview", icon: Trophy },
          { id: "achievements", label: "Achievements", icon: Award },
          { id: "quests", label: "Weekly Quests", icon: Target },
          { id: "rewards", label: "Rewards Store", icon: Gift }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colours ${
              activeTab === id 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Achievements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {achievements.filter(a => a.unlocked).slice(0, 3).map(achievement => (
                <div key={achievement.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <achievement.icon className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{achievement.title}</h4>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">{achievement.points} pts</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Target className="h-4 w-4 mr-2" />
                Take Skills Challenge (+50-200 pts)
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Join Community Event (+100 pts)
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Star className="h-4 w-4 mr-2" />
                Complete Profile (+25 pts)
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'achievements' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map(achievement => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </div>
      )}

      {activeTab === 'quests' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {weeklyQuests.map(quest => (
            <Card key={quest.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{quest.title}</h4>
                  <Badge variant="secondary">{quest.points} pts</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{quest.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>{quest.progress}/{quest.maxProgress} completed</span>
                    <span className="text-orange-600">{quest.deadline}</span>
                  </div>
                  <Progress value={(quest.progress / quest.maxProgress) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'rewards' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rewards.map(reward => {
            const Icon = reward.icon;
            return (
              <Card key={reward.id} className={!reward.available ? 'opacity-50' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{reward.title}</h4>
                      <p className="text-sm text-muted-foreground">{reward.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{reward.cost} points</Badge>
                    <Button 
                      size="sm" 
                      disabled={!reward.available || playerStats.totalPoints < reward.cost}
                    >
                      {playerStats.totalPoints < reward.cost ? 'Not Enough Points' : 'Claim'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}