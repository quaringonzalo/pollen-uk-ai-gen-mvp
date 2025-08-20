import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { User, Target, Users, BarChart3, Download, Share2, Edit3 } from "lucide-react";

interface CandidateProfileProps {
  profileData?: any;
  isEditable?: boolean;
}

export default function CandidateProfileGenerator({ profileData, isEditable = false }: CandidateProfileProps) {
  const { user } = useAuth();
  
  const { data: profile } = useQuery({
    queryKey: [`/api/job-seeker-profiles/user/${user?.id}`],
    enabled: !!user?.id && !profileData,
  });

  const displayProfile = profileData || profile;

  if (!displayProfile) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Complete your profile to generate your candidate profile.</p>
        </CardContent>
      </Card>
    );
  }

  const getBehavioralInsights = () => {
    if (!displayProfile.primaryProfile) return null;
    
    const insights = {
      "Green - Steady": {
        description: "Cooperative team player who values relationships. Creates harmony and seeks balance.",
        strengths: ["Team collaboration", "Conflict resolution", "Attention to details", "Reliable execution"],
        workStyle: "Prefers structured environments with clear expectations and collaborative teams."
      },
      "Blue - Analytical": {
        description: "Detail-oriented with a keen eye for precision. Thrives on structured and methodical approaches.",
        strengths: ["Data analysis", "Quality assurance", "Systematic thinking", "Research skills"],
        workStyle: "Excels in roles requiring accuracy, analysis, and methodical problem-solving."
      },
      "Red - Dominant": {
        description: "Results-oriented and decisive. Thrives in fast-paced environments and enjoys taking charge.",
        strengths: ["Leadership", "Decision making", "Goal achievement", "Problem solving"],
        workStyle: "Prefers autonomous roles with clear objectives and measurable results."
      },
      "Yellow - Influential": {
        description: "People-focused and enthusiastic. Excels at building relationships and inspiring others.",
        strengths: ["Communication", "Relationship building", "Team motivation", "Creative thinking"],
        workStyle: "Thrives in collaborative, people-focused environments with variety and social interaction."
      }
    };

    return insights[displayProfile.primaryProfile as keyof typeof insights];
  };

  const getSkillsData = () => {
    const skills = displayProfile.skills || [];
    return skills.map((skill: string) => ({
      name: skill,
      level: Math.floor(Math.random() * 30) + 70, // Demo data between 70-100%
    }));
  };

  const getBehavioralData = () => ({
    red: displayProfile.discRedScore || 0,
    yellow: displayProfile.discYellowScore || 0,
    green: displayProfile.discGreenScore || 0,
    blue: displayProfile.discBlueScore || 0,
  });

  const behaviouralInsights = getBehavioralInsights();
  const skillsData = getSkillsData();
  const behaviouralData = getBehavioralData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">
                  {user?.firstName} {user?.lastName} (She/Her)
                </CardTitle>
                <p className="text-muted-foreground">{user?.email}</p>
                <p className="text-sm text-muted-foreground mt-1">Available Immediately</p>
              </div>
            </div>
            <div className="flex gap-2">
              {isEditable && (
                <Button variant="outline" size="sm">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Personal Highlights */}
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Most Happy When...</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                I love spending time with my family, especially my German Shepherd Rey. I love going for 
                long walks with my partner and exploring new places. I love having a cozy night in 
                with a book, a candle and I also love making matcha cups of coffee!
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Most Proud Of...</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                I am really proud of recently buying a home with my partner. It feels like a huge achievement!
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Described As...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium text-sm">Creative, organised, unique by friends</p>
                <p className="font-medium text-sm">Hardworking, committed, detailed teachers</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Perfect Job Is...</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                A perfect job is one which gives you variety and room for progression, but also a 
                perfect job is one where you know where you stand. It is one where you can 
                communicate efficiently with your co workers and build relationships positively and 
                have a sense of community.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Center Column */}
        <div className="space-y-6">
          {/* Behavioral Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Behavioural Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {behaviouralInsights && (
                <>
                  <div>
                    <h4 className="font-semibold text-green-600">Primary Profile</h4>
                    <p className="font-medium">{displayProfile.primaryProfile}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <Users className="w-5 h-5 text-green-500" />
                      <p className="text-sm text-muted-foreground">{behaviouralInsights.description}</p>
                    </div>
                  </div>

                  {displayProfile.secondaryProfile && (
                    <div>
                      <h4 className="font-semibold text-blue-600">Secondary Profile</h4>
                      <p className="font-medium">{displayProfile.secondaryProfile}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <BarChart3 className="w-5 h-5 text-blue-500" />
                        <p className="text-sm text-muted-foreground">Analytical thinker who values accuracy</p>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* DISC Chart */}
              <div className="grid grid-cols-4 gap-2 mt-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-1">
                    <Target className="w-6 h-6 text-red-500" />
                  </div>
                  <div className="text-lg font-bold text-red-500">{behaviouralData.red}%</div>
                  <div className="text-xs text-muted-foreground">Red</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-1">
                    <Users className="w-6 h-6 text-yellow-500" />
                  </div>
                  <div className="text-lg font-bold text-yellow-500">{behaviouralData.yellow}%</div>
                  <div className="text-xs text-muted-foreground">Yellow</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-1">
                    <Users className="w-6 h-6 text-green-500" />
                  </div>
                  <div className="text-lg font-bold text-green-500">{behaviouralData.green}%</div>
                  <div className="text-xs text-muted-foreground">Green</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-1">
                    <BarChart3 className="w-6 h-6 text-blue-500" />
                  </div>
                  <div className="text-lg font-bold text-blue-500">{behaviouralData.blue}%</div>
                  <div className="text-xs text-muted-foreground">Blue</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interest Areas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Interests Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium mb-2">Favourite subjects...</h4>
                  <div className="flex gap-2">
                    <Badge variant="secondary">Art</Badge>
                    <Badge variant="secondary">English</Badge>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Interested in roles in...</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Administration & Support</Badge>
                    <Badge variant="outline">Marketing</Badge>
                    <Badge variant="outline">Charity</Badge>
                    <Badge variant="outline">People / HR</Badge>
                    <Badge variant="outline">Media & Communication</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Skills Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Skills Profile</CardTitle>
              <p className="text-sm text-muted-foreground">Combined Score: 90%</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {skillsData.length > 0 ? (
                skillsData.map((skill: any) => (
                  <div key={skill.name} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium text-sm">{skill.name}</span>
                      <span className="text-sm text-muted-foreground">{skill.level}%</span>
                    </div>
                    <Progress value={skill.level} className="h-2" />
                  </div>
                ))
              ) : (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium text-sm">Written Communication</span>
                      <span className="text-sm text-muted-foreground">100%</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium text-sm">Proactivity & Engagement</span>
                      <span className="text-sm text-muted-foreground">90%</span>
                    </div>
                    <Progress value={90} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium text-sm">Skills Challenge</span>
                      <span className="text-sm text-muted-foreground">80%</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Work Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Work Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Focus</span>
                <span className="text-sm">Both tasks and people equally</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Style</span>
                <span className="text-sm">Extroverted</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Learning</span>
                <span className="text-sm">Variety and specialising equally</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Motivation</span>
                <span className="text-sm">Mission-led</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Training</span>
                <span className="text-sm">Formal + freedom equally</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Growth</span>
                <span className="text-sm">Building practical skills</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}