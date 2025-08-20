import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, MapPin, Mail, Phone, Calendar, Award, Star, 
  Briefcase, GraduationCap, Target, Heart, Brain,
  Trophy, Clock, TrendingUp, CheckCircle, Zap
} from "lucide-react";

interface CandidateProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  profileImage?: string;
  
  // Enhanced profile data
  bio: string;
  personalInterests: string[];
  motivations: string[];
  careerGoals: string;
  achievements: string[];
  
  // Skills & verification
  skills: string[];
  skillsVerified: string[];
  skillsScore: number;
  
  // Behavioral profile
  behaviouralScore: number;
  workStyle: string;
  communicationStyle: string;
  teamRole: string;
  personalityType: string;
  
  // Gamification
  totalPoints: number;
  badges: string[];
  level: number;
  
  // Job search status
  lookingForJobSince: Date;
  jobSearchStatus: string;
  availability: string;
  salaryExpectation: number;
  
  // Performance metrics
  assessmentCompleted: boolean;
  assessmentScore: number;
  profileStrength: number;
  responseRate: number;
  interviewSuccessRate: number;
}

interface CandidateProfileProps {
  candidate: CandidateProfile;
  viewMode?: 'employer' | 'candidate' | 'admin';
}

export default function CandidateProfileEnhanced({ candidate, viewMode = 'employer' }: CandidateProfileProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const getPollenAvatar = () => {
    // Always use Pollen branding instead of candidate initials
    return "P";
  };

  const getLevelInfo = (points: number) => {
    const levels = [
      { level: 1, min: 0, max: 100, title: "Explorer" },
      { level: 2, min: 101, max: 300, title: "Achiever" },
      { level: 3, min: 301, max: 600, title: "Professional" },
      { level: 4, min: 601, max: 1000, title: "Expert" },
      { level: 5, min: 1001, max: 1500, title: "Master" }
    ];
    
    const currentLevel = levels.find(l => points >= l.min && points <= l.max) || levels[0];
    const nextLevel = levels[currentLevel.level] || currentLevel;
    const progressInLevel = ((points - currentLevel.min) / (currentLevel.max - currentLevel.min)) * 100;
    
    return { currentLevel, nextLevel, progressInLevel };
  };

  const { currentLevel, progressInLevel } = getLevelInfo(candidate.totalPoints);

  const badgeIcons: Record<string, string> = {
    "Assessment Master": "🎯",
    "Skill Verifier": "✅",
    "Team Player": "🤝",
    "Quick Learner": "⚡",
    "Interview Pro": "🎤",
    "Profile Complete": "💯"
  };

  const strengthColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar & Basic Info */}
            <div className="flex flex-col items-center text-center md:text-left md:flex-row md:items-start gap-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={candidate.profileImage} />
                <AvatarFallback className="text-lg bg-pink-600 text-white">
                  {getPollenAvatar()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold">{candidate.firstName} {candidate.lastName}</h1>
                <div className="flex flex-col gap-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {candidate.location}
                  </div>
                  {viewMode !== 'candidate' && (
                    <>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {candidate.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {candidate.phone}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Level & Points */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Level {currentLevel.level} - {currentLevel.title}</h3>
                  <p className="text-sm text-gray-500">{candidate.totalPoints} points</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <span className="font-medium">{candidate.badges.length} badges</span>
                  </div>
                </div>
              </div>
              <Progress value={progressInLevel} className="h-2" />

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${strengthColor(candidate.profileStrength)}`}>
                    Profile {candidate.profileStrength}%
                  </div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Skills Verified</p>
                  <p className="font-bold text-green-600">{candidate.skillsVerified.length}</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600">Assessment</p>
                  <p className="font-bold text-purple-600">{candidate.assessmentScore}%</p>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <p className="text-sm text-gray-600">Available</p>
                  <p className="font-bold text-orange-600">{candidate.availability}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="skills">Skills & Verification</TabsTrigger>
          <TabsTrigger value="behavioural">Work Style</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="compatibility">Compatibility</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  About
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">{candidate.bio}</p>
                
                <div>
                  <h4 className="font-medium mb-2">Career Goals</h4>
                  <p className="text-sm text-gray-600">{candidate.careerGoals}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Personal Interests</h4>
                  <div className="flex flex-wrap gap-2">
                    {candidate.personalInterests.map((interest, index) => (
                      <Badge key={index} variant="secondary">{interest}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">What Motivates Them</h4>
                  <div className="flex flex-wrap gap-2">
                    {candidate.motivations.map((motivation, index) => (
                      <Badge key={index} variant="outline" className="border-green-200 text-green-700">
                        <Heart className="w-3 h-3 mr-1" />
                        {motivation}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Job Search Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Status</span>
                  <Badge className={candidate.jobSearchStatus === 'actively_looking' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                    {candidate.jobSearchStatus.replace('_', ' ')}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Looking since</span>
                  <span className="text-sm text-gray-600">
                    {new Date(candidate.lookingForJobSince).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Salary expectation</span>
                  <span className="text-sm font-medium">
                    £{candidate.salaryExpectation.toLocaleString()}
                  </span>
                </div>

                {viewMode !== 'candidate' && (
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Performance Metrics</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Response Rate</span>
                        <span className="text-sm font-medium">{candidate.responseRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Interview Success</span>
                        <span className="text-sm font-medium">{candidate.interviewSuccessRate}%</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Verified Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {candidate.skillsVerified.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="font-medium">{skill}</span>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  All Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill, index) => (
                    <Badge 
                      key={index} 
                      variant={candidate.skillsVerified.includes(skill) ? "default" : "secondary"}
                      className={candidate.skillsVerified.includes(skill) ? "bg-green-600" : ""}
                    >
                      {skill}
                      {candidate.skillsVerified.includes(skill) && (
                        <CheckCircle className="w-3 h-3 ml-1" />
                      )}
                    </Badge>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Skills Score</span>
                    <span className="text-sm text-gray-600">{candidate.skillsScore}/100</span>
                  </div>
                  <Progress value={candidate.skillsScore} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Behavioral Tab */}
        <TabsContent value="behavioural" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Work Style Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Personality Type</h4>
                  <Badge className="bg-purple-100 text-purple-800 text-lg px-3 py-1">
                    {candidate.personalityType}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium">Work Style</span>
                    <p className="text-sm text-gray-600">{candidate.workStyle}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Communication Style</span>
                    <p className="text-sm text-gray-600">{candidate.communicationStyle}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Team Role</span>
                    <p className="text-sm text-gray-600">{candidate.teamRole}</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Behavioral Score</span>
                    <span className="text-sm text-gray-600">{candidate.behaviouralScore}/100</span>
                  </div>
                  <Progress value={candidate.behaviouralScore} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Strengths & Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Key Strengths</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 bg-blue-50 rounded text-center text-sm">
                      Problem Solving
                    </div>
                    <div className="p-2 bg-green-50 rounded text-center text-sm">
                      Team Collaboration
                    </div>
                    <div className="p-2 bg-purple-50 rounded text-center text-sm">
                      Adaptability
                    </div>
                    <div className="p-2 bg-orange-50 rounded text-center text-sm">
                      Communication
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Ideal Work Environment</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Collaborative team setting</li>
                    <li>• Clear structure and processes</li>
                    <li>• Opportunities for growth</li>
                    <li>• Regular feedback and recognition</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Earned Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {candidate.badges.map((badge, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                      <span className="text-2xl">{badgeIcons[badge] || "🏆"}</span>
                      <span className="text-sm font-medium">{badge}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {candidate.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <Trophy className="w-5 h-5 text-yellow-500 mt-0.5" />
                      <span className="text-sm">{achievement}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Compatibility Tab */}
        <TabsContent value="compatibility" className="space-y-6">
          {viewMode === 'employer' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Job Compatibility Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    Select a job posting to see compatibility analysis
                  </p>
                  <Button className="mt-4">
                    Analyze Against Job
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {viewMode !== 'employer' && (
            <Card>
              <CardHeader>
                <CardTitle>Career Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">Recommended Roles</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge>Marketing Assistant</Badge>
                      <Badge>Project Coordinator</Badge>
                      <Badge>Customer Success</Badge>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">Skills to Develop</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline">Data Analysis</Badge>
                      <Badge variant="outline">Project Management</Badge>
                      <Badge variant="outline">Public Speaking</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}