import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trophy, Medal, Award, Users, TrendingUp, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface LeaderboardUser {
  id: number;
  username: string;
  totalPoints: number;
  weeklyPoints: number;
  streak: number;
  tier: 'Newcomer' | 'Rising Star' | 'Community Leader' | 'Top Contributor';
  proactivityScore: number;
  rank: number;
  workshopsAttended: number;
  membersHelped: number;
  applicationsSubmitted: number;
}

export default function Leaderboard() {
  // Fetch current user data for leaderboard positioning
  const { data: currentUser, isLoading: userLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: () => fetch('/api/user-profile').then(res => {
      if (!res.ok) throw new Error('Not authenticated');
      return res.json();
    }),
    retry: false
  });

  // Mock data for demonstration - in real app this would come from API
  const mockLeaderboardData: LeaderboardUser[] = [
    {
      id: 100, // Different ID to avoid conflict with current user
      username: "Alex Johnson",
      totalPoints: 1247,
      weeklyPoints: 185,
      streak: 12,
      tier: "Top Contributor",
      proactivityScore: 9.2,
      rank: 1,
      workshopsAttended: 8,
      membersHelped: 15,
      applicationsSubmitted: 6
    },
    {
      id: 2,
      username: "Sarah Chen",
      totalPoints: 1089,
      weeklyPoints: 156,
      streak: 8,
      tier: "Community Leader",
      proactivityScore: 8.7,
      rank: 2,
      workshopsAttended: 6,
      membersHelped: 12,
      applicationsSubmitted: 4
    },
    {
      id: 3,
      username: "Marcus Thompson",
      totalPoints: 923,
      weeklyPoints: 134,
      streak: 15,
      tier: "Community Leader",
      proactivityScore: 8.4,
      rank: 3,
      workshopsAttended: 5,
      membersHelped: 9,
      applicationsSubmitted: 5
    },
    {
      id: 4,
      username: "Emma Williams",
      totalPoints: 856,
      weeklyPoints: 98,
      streak: 6,
      tier: "Community Leader",
      proactivityScore: 8.1,
      rank: 4,
      workshopsAttended: 4,
      membersHelped: 11,
      applicationsSubmitted: 3
    },
    {
      id: 5,
      username: "David Rodriguez",
      totalPoints: 742,
      weeklyPoints: 87,
      streak: 4,
      tier: "Rising Star",
      proactivityScore: 7.8,
      rank: 5,
      workshopsAttended: 3,
      membersHelped: 7,
      applicationsSubmitted: 4
    },
    {
      id: 6,
      username: "Lisa Park",
      totalPoints: 689,
      weeklyPoints: 76,
      streak: 9,
      tier: "Rising Star",
      proactivityScore: 7.5,
      rank: 6,
      workshopsAttended: 4,
      membersHelped: 8,
      applicationsSubmitted: 2
    },
    {
      id: 7,
      username: "James Wilson",
      totalPoints: 634,
      weeklyPoints: 65,
      streak: 3,
      tier: "Rising Star",
      proactivityScore: 7.2,
      rank: 7,
      workshopsAttended: 2,
      membersHelped: 6,
      applicationsSubmitted: 3
    },
    {
      id: 8,
      username: "Maya Patel",
      totalPoints: 578,
      weeklyPoints: 54,
      streak: 7,
      tier: "Rising Star",
      proactivityScore: 6.9,
      rank: 8,
      workshopsAttended: 3,
      membersHelped: 5,
      applicationsSubmitted: 2
    }
  ];

  // Create current user entry for leaderboard
  const currentUserEntry: LeaderboardUser | null = currentUser ? {
    id: currentUser.id,
    username: "Zara Williams", // Use actual demo user name
    totalPoints: 635, // Fixed to match demo profile
    weeklyPoints: 45, // Based on recent activity
    streak: 3, // Based on demo profile data
    tier: "Rising Star" as const,
    proactivityScore: 8.2, // Based on profile data
    rank: 0, // Will be calculated below
    workshopsAttended: 3, // Based on demo profile
    membersHelped: 4, // Based on demo profile  
    applicationsSubmitted: 2 // Based on demo profile
  } : null;

  // Combine and sort leaderboard data
  const combinedData = currentUserEntry 
    ? [...mockLeaderboardData, currentUserEntry].sort((a, b) => b.totalPoints - a.totalPoints)
    : mockLeaderboardData;

  // Assign ranks and find current user's position
  const leaderboardData = combinedData.map((user, index) => ({
    ...user,
    rank: index + 1
  }));

  const currentUserRank = currentUserEntry 
    ? leaderboardData.find(user => user.id === currentUser?.id)?.rank 
    : null;

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Top Contributor':
        return 'bg-yellow-500 text-white';
      case 'Community Leader':
        return 'bg-gray-400 text-white';
      case 'Rising Star':
        return 'bg-amber-600 text-white';
      default:
        return 'bg-gray-300 text-gray-700';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'Top Contributor':
        return <Trophy className="w-6 h-6" style={{ color: '#ffbd59' }} aria-label="Top Contributor" />;
      case 'Community Leader':
        return <Medal className="w-6 h-6" style={{ color: '#A0AEC0' }} aria-label="Community Leader" />;
      case 'Rising Star':
        return <Award className="w-6 h-6" style={{ color: '#CD7F32' }} aria-label="Rising Star" />;
      default:
        return <Star className="w-6 h-6 text-gray-400" aria-label="Newcomer" />;
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6" style={{ color: '#ffbd59' }} aria-label="First place" />;
      case 2:
        return <Medal className="w-6 h-6" style={{ color: '#A0AEC0' }} aria-label="Second place" />;
      case 3:
        return <Award className="w-6 h-6" style={{ color: '#CD7F32' }} aria-label="Third place" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-600">#{rank}</span>;
    }
  };

  if (userLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 bg-white min-h-screen">
      <div className="flex justify-center">
        <Button 
          variant="outline"
          onClick={() => window.location.href = '/community'}
          className="flex items-center gap-2"
        >
          <Users className="w-4 h-4" />
          Check out Community Activities
        </Button>
      </div>
      
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Community Leaderboard</h1>
        <p className="text-gray-600">See how you stack up against other community members</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto mb-2" style={{ color: '#E2007A' }} aria-label="Active members" />
            <div className="text-2xl font-bold text-gray-900">{leaderboardData.length}</div>
            <div className="text-sm text-gray-600">Active Members</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2" style={{ color: '#00B878' }} aria-label="Average weekly points" />
            <div className="text-2xl font-bold text-gray-900">
              {Math.round(leaderboardData.reduce((sum, user) => sum + user.weeklyPoints, 0) / leaderboardData.length)}
            </div>
            <div className="text-sm text-gray-600">Avg Weekly Points</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="w-8 h-8 mx-auto mb-2" style={{ color: '#ffbd59' }} aria-label="Top contributors count" />
            <div className="text-2xl font-bold text-gray-900">
              {leaderboardData.filter(user => user.tier === 'Top Contributor').length}
            </div>
            <div className="text-sm text-gray-600">Top Contributors</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="w-8 h-8 mx-auto mb-2" style={{ color: '#F59E0B' }} aria-label="Longest streak" />
            <div className="text-2xl font-bold text-gray-900">
              {Math.max(...leaderboardData.map(user => user.streak))}
            </div>
            <div className="text-sm text-gray-600">Longest Streak</div>
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" style={{ color: '#ffbd59' }} aria-label="Overall rankings" />
            Overall Rankings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {leaderboardData.map((user, index) => {
            const isCurrentUser = currentUser && user.id === currentUser.id;
            return (
            <div
              key={user.id}
              className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                isCurrentUser 
                  ? 'bg-pink-50 border-pink-300 ring-2 ring-pink-200' 
                  : index < 3 ? 'bg-yellow-50 border-yellow-200' : 'bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10">
                    {getRankIcon(user.rank)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        {getTierIcon(user.tier)}
                        <h3 className={`leaderboard-username-small ${isCurrentUser ? 'current-user text-pink-900' : 'text-gray-900'}`}>
                          {user.username}
                          {isCurrentUser && <span className="ml-2 text-pink-600">(You)</span>}
                        </h3>
                      </div>
                      <Badge className={getTierColor(user.tier)}>
                        {user.tier}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Total Points:</span>
                        <div className="text-lg font-bold" style={{ color: '#E2007A' }}>{user.totalPoints.toLocaleString()}</div>
                      </div>
                      
                      <div>
                        <span className="font-medium">This Week:</span>
                        <div className="text-lg font-bold" style={{ color: '#00B878' }}>+{user.weeklyPoints}</div>
                      </div>
                      
                      <div>
                        <span className="font-medium">Streak:</span>
                        <div className="text-lg font-bold" style={{ color: '#F59E0B' }}>{user.streak} days</div>
                      </div>
                      
                      <div>
                        <span className="font-medium">Proactivity:</span>
                        <div className="text-lg font-bold text-gray-700">{user.proactivityScore}/10</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-right space-y-2">
                  <div className="text-sm text-gray-600">
                    <div>📚 {user.workshopsAttended} workshops</div>
                    <div>🤝 {user.membersHelped} helped</div>
                    <div>📄 {user.applicationsSubmitted} applications</div>
                  </div>
                </div>
              </div>
              
              {/* Progress bar for weekly points */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Weekly Progress</span>
                  <span>{user.weeklyPoints}/200 points</span>
                </div>
                <Progress value={(user.weeklyPoints / 200) * 100} className="h-2" />
              </div>
            </div>
          )})}
          
          {/* Current User Position Summary */}
          {currentUser && currentUserRank && (
            <div className="mt-6 p-4 bg-pink-50 border border-pink-200 rounded-lg">
              <div className="text-center">
                <h3 className="font-semibold text-pink-900 mb-2">Your Current Position</h3>
                <div className="flex justify-center items-center gap-6 text-sm">
                  <div className="text-center">
                    <div className="text-lg font-bold" style={{ color: '#E2007A' }}>#{currentUserRank}</div>
                    <div className="text-pink-700">Rank</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold" style={{ color: '#E2007A' }}>635</div>
                    <div className="text-pink-700">Points</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold" style={{ color: '#E2007A' }}>Rising Star</div>
                    <div className="text-pink-700">Tier</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* How Points Work */}
      <Card>
        <CardHeader>
          <CardTitle>How Points Work</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2 text-gray-900">Earn Points By:</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Submitting job applications (25-75 points)</li>
                <li>• Attending workshops (20-50 points)</li>
                <li>• Helping community members (15-25 points)</li>
                <li>• Participating in discussions (5-15 points)</li>
                <li>• Connecting with a mentor (15-25 points)</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2 text-gray-900">Community Tiers:</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-gray-400" aria-label="Newcomer tier" />
                  <Badge className="bg-gray-300 text-gray-700">Newcomer</Badge>
                  <span className="text-gray-600">0-250 points</span>
                </li>
                <li className="flex items-center gap-2">
                  <Award className="w-5 h-5" style={{ color: '#CD7F32' }} aria-label="Rising Star tier" />
                  <Badge className="bg-amber-600 text-white">Rising Star</Badge>
                  <span className="text-gray-600">251-750 points</span>
                </li>
                <li className="flex items-center gap-2">
                  <Medal className="w-5 h-5" style={{ color: '#A0AEC0' }} aria-label="Community Leader tier" />
                  <Badge className="bg-gray-400 text-white">Community Leader</Badge>
                  <span className="text-gray-600">751-1500 points</span>
                </li>
                <li className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" style={{ color: '#ffbd59' }} aria-label="Top Contributor tier" />
                  <Badge className="bg-yellow-500 text-white">Top Contributor</Badge>
                  <span className="text-gray-600">1500+ points</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>💡 Pro Tip:</strong> Active community participation improves your job matching visibility! 
              Employers love candidates who engage with learning opportunities and help others grow.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}