import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Heart, 
  Trophy, 
  Users, 
  Target, 
  HelpCircle, 
  FileText,
  ArrowLeft,
  Calendar
} from "lucide-react";

interface EmployerProfileViewProps {
  profileData: any;
  onBack?: () => void;
  printable?: boolean;
}

export default function EmployerProfileView({ profileData, onBack, printable = false }: EmployerProfileViewProps) {
  const [isPrintView, setIsPrintView] = useState(printable);

  const discPercentages = profileData?.discProfile || {
    red: profileData?.discRedPercentage || 0,
    yellow: profileData?.discYellowPercentage || 0,
    green: profileData?.discGreenPercentage || 0,
    blue: profileData?.discBluePercentage || 0
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`min-h-screen ${isPrintView ? 'print:bg-white' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className={`bg-gradient-to-br ${getProfileColor('blue')} rounded-2xl p-8 text-white relative overflow-hidden print:rounded-none print:bg-blue-600`}>
          {!isPrintView && onBack && (
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
          
          {!isPrintView && (
            <div className="absolute top-4 right-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePrint}
                className="bg-white/20 border-white/30 text-white hover:bg-white/30"
              >
                <FileText className="w-4 h-4 mr-2" />
                Print Profile
              </Button>
            </div>
          )}
          
          <div className="text-center space-y-4">
            <div className="mx-auto w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Candidate Profile</h1>
              <p className="text-white/90">Employer View</p>
              <p className="text-white/80 text-sm flex items-center justify-center gap-1">
                <Calendar className="w-4 h-4" />
                Member since {new Date(profileData?.createdAt || Date.now()).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Personal Story (Employer Visible) */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-2 border-blue-100">
              <CardHeader className="pb-4">
                <CardTitle className="text-blue-600 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  PERFECT JOB IS...
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  {profileData?.personalStory?.perfectJob || "What's your idea of the perfect job?"}
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-100">
              <CardHeader className="pb-4">
                <CardTitle className="text-blue-600 flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  MOST HAPPY WHEN...
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  {profileData?.personalStory?.happinessSource || "What do you like doing that makes you happy?"}
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-100">
              <CardHeader className="pb-4">
                <CardTitle className="text-blue-600 flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  MOST PROUD OF...
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  {profileData?.personalStory?.proudMoment || "Is there anything you've done you feel really proud of?"}
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-100">
              <CardHeader className="pb-4">
                <CardTitle className="text-blue-600 flex items-center gap-2">
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
          </div>

          {/* Middle Column - Behavioral Profile */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-2 border-indigo-100">
              <CardHeader className="pb-4">
                <CardTitle className="text-center">
                  <span className="text-blue-600">BEHAVIORAL PROFILE</span>
                  <Button variant="ghost" size="sm" className="ml-2">
                    <HelpCircle className="w-4 h-4" />
                  </Button>
                </CardTitle>
                <p className="text-sm text-gray-600 text-center">Read-only assessment results</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* DISC Summary */}
                <div className="text-center p-4 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200">
                  <div className="text-lg font-bold text-purple-700">
                    {(() => {
                      // Generate DISC summary based on stored percentages
                      const scores = [
                        { name: "Dominant", value: discPercentages.red, label: "D" },
                        { name: "Influential", value: discPercentages.yellow, label: "I" },  
                        { name: "Steady", value: discPercentages.green, label: "S" },
                        { name: "Conscientious", value: discPercentages.blue, label: "C" }
                      ].sort((a, b) => b.value - a.value);

                      const primary = scores[0];
                      const secondary = scores[1];

                      if (primary.value >= 35) {
                        switch (primary.name) {
                          case "Dominant":
                            if (secondary.name === "Influential") return "Decisive Leader";
                            if (secondary.name === "Steady") return "Results-Driven Collaborator";
                            if (secondary.name === "Conscientious") return "Strategic Director";
                            return "Action-Oriented Leader";
                          
                          case "Influential":
                            if (secondary.name === "Dominant") return "Inspiring Motivator";
                            if (secondary.name === "Steady") return "Supportive Communicator";
                            if (secondary.name === "Conscientious") return "Thoughtful Influencer";
                            return "Enthusiastic Connector";
                          
                          case "Steady":
                            if (secondary.name === "Dominant") return "Reliable Achiever";
                            if (secondary.name === "Influential") return "Harmonious Team Player";
                            if (secondary.name === "Conscientious") return "Methodical Supporter";
                            return "Consistent Collaborator";
                          
                          case "Conscientious":
                            if (secondary.name === "Dominant") return "Systematic Problem-Solver";
                            if (secondary.name === "Influential") return "Analytical Communicator";
                            if (secondary.name === "Steady") return "Thoughtful Organiser";
                            return "Detail-Oriented Analyst";
                        }
                      } else {
                        if (primary.value - secondary.value <= 10) {
                          return "Balanced Adaptor";
                        }
                        return "Versatile Professional";
                      }
                      
                      return "Adaptable Professional";
                    })()}
                  </div>
                  <div className="text-sm text-purple-600 mt-1">
                    Candidate's behavioural profile type
                  </div>
                </div>

                {/* DISC Percentages Display */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-lg bg-red-50 border border-red-200">
                    <div className="text-lg font-bold text-red-600">
                      {Math.round(discPercentages.red)}%
                    </div>
                    <div className="text-xs font-medium">Dominance</div>
                    <div className="text-xs text-muted-foreground">Results-focused</div>
                  </div>
                  
                  <div className="text-center p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                    <div className="text-lg font-bold text-yellow-600">
                      {Math.round(discPercentages.yellow)}%
                    </div>
                    <div className="text-xs font-medium">Influence</div>
                    <div className="text-xs text-muted-foreground">People-focused</div>
                  </div>
                  
                  <div className="text-center p-3 rounded-lg bg-green-50 border border-green-200">
                    <div className="text-lg font-bold text-green-600">
                      {Math.round(discPercentages.green)}%
                    </div>
                    <div className="text-xs font-medium">Steadiness</div>
                    <div className="text-xs text-muted-foreground">Stability-focused</div>
                  </div>
                  
                  <div className="text-center p-3 rounded-lg bg-blue-50 border border-blue-200">
                    <div className="text-lg font-bold text-blue-600">
                      {Math.round(discPercentages.blue)}%
                    </div>
                    <div className="text-xs font-medium">Conscientiousness</div>
                    <div className="text-xs text-muted-foreground">Quality-focused</div>
                  </div>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Assessment completed on {new Date(profileData?.behaviouralAssessment?.completedAt || Date.now()).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Results cannot be edited and are used for matching purposes only
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Skills & Interests (Employer Visible Only) */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-2 border-teal-100">
              <CardHeader className="pb-4">
                <CardTitle className="text-blue-600">INTERESTS & BACKGROUND</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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

                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-2">What frustrates you?</h4>
                  <p className="text-sm text-gray-600">
                    {profileData?.personalStory?.frustrations || "Is there anything in life that frustrates you?"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-pink-100">
              <CardHeader className="pb-4">
                <CardTitle className="text-blue-600">SKILLS PROFILE</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-blue-600 font-medium mb-2">Skills challenges available</div>
                  <p className="text-sm text-gray-600">Candidate can complete skills assessments through the platform</p>
                </div>

                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">
                    Skills verification in progress
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Results will be available once completed
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer for Print View */}
        {isPrintView && (
          <div className="print:block hidden text-center text-sm text-gray-500 mt-8 pt-4 border-t">
            <p>Generated by Pollen Platform - {new Date().toLocaleDateString()}</p>
            <p>This profile contains verified behavioural assessment data and candidate preferences</p>
          </div>
        )}
      </div>
    </div>
  );
}