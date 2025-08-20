import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  User, 
  Heart, 
  Trophy, 
  Users, 
  Target, 
  HelpCircle, 
  Edit3, 
  Save, 
  X,
  Plus,
  ArrowLeft,
  Briefcase
} from "lucide-react";

interface ProfileViewProps {
  profileData: any;
  editable?: boolean;
  onSave?: (data: any) => void;
  onBack?: () => void;
}

export default function ProfileView({ profileData, editable = false, onSave, onBack }: ProfileViewProps) {
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState(profileData);
  const queryClient = useQueryClient();

  // Force fresh data on component mount
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    queryClient.invalidateQueries({ queryKey: ['behavioural-insights'] });
  }, [queryClient]);

  // Generate behavioral insights directly from DISC data (matching assessment logic)
  const generateBehavioralTypeFromDisc = (discPercentages: any) => {
    const scores = [
      { name: "Dominant", value: discPercentages.red, label: "D" },
      { name: "Influential", value: discPercentages.yellow, label: "I" },  
      { name: "Steady", value: discPercentages.green, label: "S" },
      { name: "Conscientious", value: discPercentages.blue, label: "C" }
    ].sort((a, b) => b.value - a.value);
    
    const primary = scores[0];
    const secondary = scores[1];
    
    // Generate profile type name (matching assessment logic)
    if (primary.value >= 35) {
      switch (primary.name) {
        case "Dominant":
          if (secondary.name === "Influential") return "The Rocket Launcher";
          if (secondary.name === "Steady") return "The Results Machine";
          if (secondary.name === "Conscientious") return "The Strategic Ninja";
          return "The Problem Solver";
        case "Influential":
          if (secondary.name === "Dominant") return "The People Champion";
          if (secondary.name === "Steady") return "The Social Butterfly";
          if (secondary.name === "Conscientious") return "The Creative Genius";
          return "The Innovation Catalyst";
        case "Steady":
          if (secondary.name === "Dominant") return "The Steady Rock";
          if (secondary.name === "Influential") return "The Team Builder";
          if (secondary.name === "Conscientious") return "The Quality Guardian";
          return "The Team Builder";
        case "Conscientious":
          if (secondary.name === "Dominant") return "The Methodical Achiever";
          if (secondary.name === "Influential") return "The Engaging Analyst";
          if (secondary.name === "Steady") return "The Patient Perfectionist";
          return "The Detail Master";
      }
    }
    
    return primary.value - secondary.value <= 10 ? "The Balanced Achiever" : "The Versatile Professional";
  };

  // Generate behavioral insights from DISC percentages
  const generateBehavioralInsights = (discPercentages: any) => {
    const insights = {
      strengths: [] as string[],
      idealWorkEnvironment: [] as string[],
      motivators: [] as string[],
      compatibleRoles: [] as string[],
      communicationStyle: '',
      decisionMaking: ''
    };

    // Results-driven approach (high red)
    if (discPercentages.red >= 35) {
      insights.strengths.push('Leadership', 'Decision-making', 'Goal-oriented', 'Problem-solving');
      insights.idealWorkEnvironment.push('Autonomous environment', 'Results-focused culture', 'Fast-paced challenges');
      insights.motivators.push('Achievement', 'Control over outcomes', 'Competition');
      insights.compatibleRoles.push('Leading projects and teams', 'Solving tough problems', 'Getting results fast');
      insights.communicationStyle = 'Direct and results-focused communication style';
      insights.decisionMaking = 'Quick, decisive approach to problem-solving';
    }
    // People-focused approach (high yellow)
    else if (discPercentages.yellow >= 25) {
      insights.strengths.push('Communication', 'Enthusiasm', 'Team building', 'Creativity');
      insights.idealWorkEnvironment.push('Collaborative workspace', 'Social interaction', 'People-focused culture');
      insights.motivators.push('Recognition', 'Social interaction', 'Variety in work');
      insights.compatibleRoles.push('Making friends at work', 'Sharing ideas with others', 'Creative work with people');
      insights.communicationStyle = 'Enthusiastic and collaborative communication style';
      insights.decisionMaking = 'Considers team input and seeks consensus';
    }
    // Supportive approach (high green)
    else if (discPercentages.green >= 25) {
      insights.strengths.push('Reliability', 'Patience', 'Teamwork', 'Listening');
      insights.idealWorkEnvironment.push('Supportive environment', 'Team-oriented culture', 'Stable processes');
      insights.motivators.push('Security', 'Helping others', 'Team success');
      insights.compatibleRoles.push('Helping team members', 'Being reliable and helpful', 'Supporting others');
      insights.communicationStyle = 'Patient and supportive communication style';
      insights.decisionMaking = 'Thoughtful approach that considers team harmony';
    }
    // Analytical approach (high blue)
    else if (discPercentages.blue >= 30) {
      insights.strengths.push('Accuracy', 'Analysis', 'Planning', 'Quality focus');
      insights.idealWorkEnvironment.push('Organised workspace', 'Detail-focused culture', 'Quality-oriented processes');
      insights.motivators.push('Excellence', 'Understanding', 'Accuracy');
      insights.compatibleRoles.push('Planning and organising', 'Quality control', 'Research and analysis');
      insights.communicationStyle = 'Precise and detail-oriented communication style';
      insights.decisionMaking = 'Systematic approach with thorough analysis';
    }
    // Balanced approach
    else {
      insights.strengths.push('Adaptability', 'Flexibility', 'Well-rounded skills', 'Team collaboration');
      insights.idealWorkEnvironment.push('Varied responsibilities', 'Collaborative culture', 'Growth opportunities');
      insights.motivators.push('Learning', 'Variety', 'Team success');
      insights.compatibleRoles.push('Working with different people', 'Adapting to new situations', 'Supporting team goals');
      insights.communicationStyle = 'Balanced communication style that adapts to different situations';
      insights.decisionMaking = 'Flexible approach that considers multiple perspectives';
    }

    return insights;
  };

  // Check if user has actual DISC data (not just zeros)
  const discPercentages = {
    red: profileData?.disc_red_percentage || 0,
    yellow: profileData?.disc_yellow_percentage || 0,
    green: profileData?.disc_green_percentage || 0,
    blue: profileData?.disc_blue_percentage || 0
  };
  
  const hasActualDiscData = discPercentages.red > 0 || discPercentages.yellow > 0 || discPercentages.green > 0 || discPercentages.blue > 0;
  
  // Only generate behavioral profile if user has actual assessment data
  const behaviouralProfile = hasActualDiscData ? { primary: generateBehavioralTypeFromDisc(discPercentages) } : null;
  const behaviouralInsights = hasActualDiscData ? generateBehavioralInsights(discPercentages) : null;
  const personalBackground = profileData?.personalBackground;
  const careerPreferences = profileData?.careerPreferences;
  const educationExperience = profileData?.educationExperience;

  const handleSave = () => {
    onSave?.(editedData);
    setEditMode(false);
  };

  const getProfileColor = (profile: string) => {
    switch (profile?.toLowerCase()) {
      case 'red': return 'from-red-500 to-orange-500';
      case 'yellow': return 'from-yellow-400 to-orange-400';
      case 'green': return 'from-green-500 to-emerald-500';
      case 'blue': return 'from-blue-500 to-indigo-500';
      default: return 'from-purple-500 to-blue-500';
    }
  };

  const getProfileLabel = (profile: string): string => {
    switch (profile?.toLowerCase()) {
      case 'red': return 'Decisive';
      case 'yellow': return 'Enthusiastic';
      case 'green': return 'Steady';
      case 'blue': return 'Analytical';
      default: return 'Balanced';
    }
  };

  const getProfileTraits = (profile: string): string[] => {
    switch (profile?.toLowerCase()) {
      case 'red':
        return [
          'Results-oriented leader who takes charge',
          'Direct communicator who values efficiency',
          'Thrives in fast-paced, challenging environments'
        ];
      case 'yellow':
        return [
          'Creative team player who values relationships',
          'Enthusiastic communicator who inspires others',
          'Brings energy and innovation to projects'
        ];
      case 'green':
        return [
          'Collaborative team player who values harmony',
          'Supportive communicator who listens well',
          'Creates stability and builds strong relationships'
        ];
      case 'blue':
        return [
          'Analytical thinker who values accuracy',
          'Detail-oriented with a keen eye for precision',
          'Thrives on structured and methodical approaches'
        ];
      default:
        return ['Adaptable and well-rounded', 'Brings multiple strengths to teams'];
    }
  };

  const getPersonalityDescriptor = (profile: string): string => {
    switch (profile?.toLowerCase()) {
      case 'red': return 'Determined, confident, natural leader';
      case 'yellow': return 'Creative, optimistic, energetic';
      case 'green': return 'Supportive, reliable, team-oriented';
      case 'blue': return 'Thoughtful, methodical, detail-focused';
      default: return 'Well-rounded, adaptable, balanced';
    }
  };

  const calculateCombinedScore = (profile: any): number => {
    if (!profile) return 85;
    const baseScore = 80;
    const bonusPoints = Object.keys(profile.traits || {}).length * 2;
    return Math.min(baseScore + bonusPoints, 95);
  };

  const getSkillScore = (skillArea: string): number => {
    const skillMappings: { [key: string]: number } = {
      'Action-oriented and decisive': 92,
      'Creative and innovative': 88,
      'Collaborative and inclusive': 85,
      'Analytical and systematic': 90,
      'Leadership and direction': 90,
      'Ideas and energy': 87,
      'Support and harmony': 85,
      'Quality and accuracy': 92
    };
    
    return skillMappings[skillArea] || 85;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className={`bg-gradient-to-br ${getProfileColor(behaviouralProfile?.primary)} rounded-2xl p-8 text-white relative overflow-hidden`}>
          {onBack && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onBack}
              className="absolute top-4 left-4 bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          
          {editable && (
            <div className="absolute top-4 right-4 flex gap-2">
              {editMode ? (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setEditMode(false)}
                    className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSave}
                    className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setEditMode(true)}
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          )}
          
          <div className="text-center space-y-4">
            <div className="mx-auto w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Your Pollen Profile</h1>
              <p className="text-white/90">Ready to bloom in your career</p>
              <p className="text-white/80 text-sm">
                Member of Pollen since {new Date(profileData?.createdAt || Date.now()).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
            <div className="w-full h-full rounded-full border-8 border-white transform translate-x-1/2 -translate-y-1/2"></div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Personal Insights */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-2 border-blue-100">
              <CardHeader className="pb-4">
                <CardTitle className="text-teal-600 flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  MOST HAPPY WHEN...
                </CardTitle>
              </CardHeader>
              <CardContent>
                {editMode ? (
                  <Textarea
                    value={editedData?.personalStory?.happinessSource || ""}
                    onChange={(e) => setEditedData(prev => ({
                      ...prev,
                      personalStory: {
                        ...prev?.personalStory,
                        happinessSource: e.target.value
                      }
                    }))}
                    placeholder="What makes you happiest..."
                    rows={3}
                  />
                ) : (
                  <p className="text-gray-700">
                    {profileData?.personalStory?.happinessSource || "What do you like doing that makes you happy?"}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="border-2 border-green-100">
              <CardHeader className="pb-4">
                <CardTitle className="text-teal-600 flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  MOST PROUD OF...
                </CardTitle>
              </CardHeader>
              <CardContent>
                {editMode ? (
                  <Textarea
                    value={editedData?.personalStory?.proudMoment || ""}
                    onChange={(e) => setEditedData(prev => ({
                      ...prev,
                      personalStory: {
                        ...prev?.personalStory,
                        proudMoment: e.target.value
                      }
                    }))}
                    placeholder="What are you most proud of..."
                    rows={3}
                  />
                ) : (
                  <p className="text-gray-700">
                    {profileData?.personalStory?.proudMoment || "Is there anything you've done you feel really proud of?"}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-100">
              <CardHeader className="pb-4">
                <CardTitle className="text-teal-600 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  DESCRIBED AS...
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <span className="font-medium">By friends:</span> {profileData?.personalStory?.friendDescriptions || "In 3 words or phrases, how would your friends describe you?"}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">By teachers:</span> {profileData?.personalStory?.teacherDescriptions || "In 3 words or phrases, how would your teachers describe you?"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-100">
              <CardHeader className="pb-4">
                <CardTitle className="text-teal-600 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  PERFECT JOB IS...
                </CardTitle>
              </CardHeader>
              <CardContent>
                {editMode ? (
                  <Textarea
                    value={editedData?.personalStory?.perfectJob || ""}
                    onChange={(e) => setEditedData(prev => ({
                      ...prev,
                      personalStory: {
                        ...prev?.personalStory,
                        perfectJob: e.target.value
                      }
                    }))}
                    placeholder="What's your idea of the perfect job..."
                    rows={4}
                  />
                ) : (
                  <p className="text-gray-700">
                    {profileData?.personalStory?.perfectJob || "What's your idea of the perfect job?"}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Middle Column - Behavioral Profile */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-2 border-indigo-100">
              <CardHeader className="pb-4">
                <CardTitle className="text-center">
                  <span className="text-teal-600">BEHAVIORAL PROFILE</span>
                  <Button variant="ghost" size="sm" className="ml-2">
                    <HelpCircle className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* DISC Summary */}
                {hasActualDiscData ? (
                  <div className="text-center p-4 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 border border-purple-200 dark:border-purple-800">
                    <div className="text-lg font-bold text-purple-700 dark:text-purple-300">
                      {behaviouralProfile?.primary}
                    </div>
                    <div className="text-sm text-purple-600 dark:text-purple-400 mt-1">
                      Your behavioural profile type
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800">
                    <div className="text-lg font-medium text-gray-500 dark:text-gray-400">
                      Complete your behavioural assessment to see your profile
                    </div>
                    <div className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                      Assessment not completed yet
                    </div>
                  </div>
                )}

                {/* DISC Percentages Display - Only show if user has actual data */}
                {hasActualDiscData && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
                      <div className="text-lg font-bold text-red-600 dark:text-red-400">
                        {Math.round(discPercentages.red)}%
                      </div>
                      <div className="text-xs font-medium">Dominance</div>
                      <div className="text-xs text-muted-foreground">Results-focused</div>
                    </div>
                    
                    <div className="text-center p-3 rounded-lg bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800">
                      <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                        {Math.round(discPercentages.yellow)}%
                      </div>
                      <div className="text-xs font-medium">Influence</div>
                      <div className="text-xs text-muted-foreground">People-focused</div>
                    </div>
                    
                    <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">
                        {Math.round(discPercentages.green)}%
                      </div>
                      <div className="text-xs font-medium">Steadiness</div>
                      <div className="text-xs text-muted-foreground">Stability-focused</div>
                    </div>
                    
                    <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
                      <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {Math.round(discPercentages.blue)}%
                      </div>
                      <div className="text-xs font-medium">Conscientiousness</div>
                      <div className="text-xs text-muted-foreground">Quality-focused</div>
                    </div>
                  </div>
                )}

                {/* Key Strengths */}
                <div>
                  <h4 className="text-purple-400 font-medium mb-3">Key Strengths</h4>
                  <div className="flex flex-wrap gap-2">
                    {(behaviouralInsights?.strengths || ['Adaptable', 'Team player', 'Good communicator', 'Reliable']).map((strength: string, idx: number) => (
                      <span key={idx} className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">
                        {strength}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Communication Style */}
                <div>
                  <h4 className="text-purple-400 font-medium mb-3">Communication Style</h4>
                  <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {behaviouralInsights?.communicationStyle || "Balanced communication style that adapts to different situations and team needs."}
                    </p>
                  </div>
                </div>

                {/* Ideal Work Environment */}
                <div>
                  <h4 className="text-purple-400 font-medium mb-3">Ideal Work Environment</h4>
                  <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                    <ul className="space-y-2">
                      {(behaviouralInsights?.idealWorkEnvironment || ['Collaborative and supportive team environment', 'Clear goals and expectations', 'Opportunities for growth']).map((env: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <span className="text-blue-600 font-bold">•</span>
                          <span className="text-gray-700 dark:text-gray-300">{env}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Compatible Role Types */}
                <div>
                  <h4 className="text-purple-400 font-medium mb-3">Where You Excel</h4>
                  <div className="flex flex-wrap gap-2">
                    {(behaviouralInsights?.compatibleRoles || ['Helping teams work well', 'Making friends at work', 'Solving problems together', 'Working with different people']).map((role: string, idx: number) => (
                      <span key={idx} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Career Motivators */}
                <div>
                  <h4 className="text-purple-400 font-medium mb-3">What Motivates You</h4>
                  <div className="bg-purple-50 dark:bg-purple-950 p-3 rounded-lg border border-purple-200 dark:border-purple-800">
                    <ul className="space-y-2">
                      {(behaviouralInsights?.motivators || ['Professional growth', 'Team collaboration', 'Clear expectations', 'Meaningful work']).map((motivator: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <span className="text-purple-600 font-bold">•</span>
                          <span className="text-gray-700 dark:text-gray-300">{motivator}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Decision Making Approach */}
                <div>
                  <h4 className="text-purple-400 font-medium mb-3">Decision Making Approach</h4>
                  <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {behaviouralInsights?.decisionMaking || "Thoughtful decision-making approach that considers multiple factors and team input."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-cyan-100">
              <CardHeader className="pb-4">
                <CardTitle className="text-teal-600">INTERESTS PROFILE</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Favourite subjects...</h4>
                  <div className="flex flex-wrap gap-2">
                    {educationExperience?.favouriteSubjects?.slice(0, 6).map((subject: string, idx: number) => (
                      <Badge key={idx} variant="secondary" className="bg-gray-100 text-gray-700">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Favorite subjects:</h4>
                  <div className="flex flex-wrap gap-2">
                    {profileData?.interestsPreferences?.favourite_subjects?.slice(0, 6).map((subject: string, idx: number) => (
                      <Badge key={idx} variant="secondary" className="bg-gray-100 text-gray-700">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Role types of interest:</h4>
                  <div className="flex flex-wrap gap-2">
                    {profileData?.interestsPreferences?.role_types?.slice(0, 6).map((role: string, idx: number) => (
                      <Badge key={idx} variant="secondary" className="bg-blue-100 text-blue-700">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Visa status:</h4>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {profileData?.practicalPreferences?.visa_status || "Not specified"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Additional Information (Standard Profile Only) */}
          <div className="lg:col-span-1 space-y-6">
            {editable && (
              <Card className="border-2 border-yellow-100">
                <CardHeader className="pb-4">
                  <CardTitle className="text-teal-600">REASONABLE ADJUSTMENTS</CardTitle>
                </CardHeader>
                <CardContent>
                  {editMode ? (
                    <Textarea
                      value={editedData?.other?.reasonable_adjustments || ""}
                      onChange={(e) => setEditedData((prev: any) => ({
                        ...prev,
                        other: {
                          ...prev?.other,
                          reasonable_adjustments: e.target.value
                        }
                      }))}
                      placeholder="Please describe any accommodations you need..."
                      rows={3}
                    />
                  ) : (
                    <p className="text-gray-700">
                      {profileData?.other?.reasonable_adjustments || "No reasonable adjustments required"}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            <Card className="border-2 border-pink-100">
              <CardHeader className="pb-4">
                <CardTitle className="text-teal-600">CAREER READINESS</CardTitle>
                <p className="text-sm text-gray-600 mt-2">
                  Skills demonstrated through behavioural assessment and work experience
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-purple-400 font-medium mb-2">Readiness Score:</div>
                  <div className="text-4xl font-bold text-purple-500">
                    {calculateCombinedScore(behaviouralProfile)}%
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Communication</span>
                      <span className="font-bold">95%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-teal-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Problem Solving</span>
                      <span className="font-bold">{getSkillScore(behaviouralProfile?.insights?.problemSolving)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${getSkillScore(behaviouralProfile?.insights?.problemSolving)}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Team Collaboration</span>
                      <span className="font-bold">{getSkillScore(behaviouralProfile?.insights?.teamContribution)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-pink-500 h-2 rounded-full" style={{ width: `${getSkillScore(behaviouralProfile?.insights?.teamContribution)}%` }}></div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.location.href = '/jobs'}
                  >
                    Apply to Jobs to Demonstrate Skills
                    <Briefcase className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}