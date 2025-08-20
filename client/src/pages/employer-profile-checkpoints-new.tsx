import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { 
  Building, 
  FileText, 
  Star, 
  Camera, 
  Quote,
  Award,
  ArrowRight,
  Clock,
  CheckCircle,
  Users,
  GraduationCap,
  Mail,
  Phone,
  UserPlus,
  Shield,
  AlertTriangle
} from "lucide-react";

interface SavedProfile {
  id: number;
  userId: number;
  profileData: any;
  step: number;
  isComplete: boolean;
  lastSaved: string;
}

export default function EmployerProfileCheckpoints() {
  const [, setLocation] = useLocation();

  const { data: savedProfile, isLoading, error } = useQuery<SavedProfile>({
    queryKey: ['/api/employer-profile/saved'],
  });

  // Handle error state
  if (error) {
    console.log("No saved profile found, starting fresh");
  }

  const currentStep = savedProfile?.step || 0;
  
  // Required sections (must complete for profile to be live)
  const requiredCheckpoints = [
    {
      id: 1,
      title: "Company Information",
      description: "Basic company details and contact information",
      icon: Building,
      route: "/employer-profile-setup",
      completed: currentStep >= 1,
      required: true,
      estimatedTime: "5 minutes"
    },
    {
      id: 2,
      title: "Company Culture & Values", 
      description: "Work environment, values, and company culture",
      icon: FileText,
      route: "/employer-profile-setup",
      completed: currentStep >= 2,
      required: true,
      estimatedTime: "10 minutes"
    },
    {
      id: 3,
      title: "Visual Identity",
      description: "Company logo and cover image",
      icon: Camera,
      route: "/employer-profile-setup", 
      completed: currentStep >= 3,
      required: true,
      estimatedTime: "5 minutes"
    },
    {
      id: 4,
      title: "Entry-Level Support Programmes",
      description: "Training, mentorship, and development opportunities for new graduates",
      icon: GraduationCap,
      route: "/employer-programmes",
      completed: false,
      required: true,
      estimatedTime: "8 minutes"
    },
    {
      id: 5,
      title: "Contact Information",
      description: "Primary hiring contact and team member access",
      icon: Mail,
      route: "/employer-contact-setup",
      completed: false,
      required: true,
      estimatedTime: "3 minutes"
    }
  ];

  // Optional sections (enhance profile visibility and appeal)
  const optionalCheckpoints = [
    {
      id: 6,
      title: "Company Photos",
      description: "Office photos and team images",
      icon: Camera,
      route: "/employer-photos",
      completed: false,
      required: false,
      estimatedTime: "10 minutes"
    },
    {
      id: 7,
      title: "Employee Testimonials", 
      description: "Current employee reviews and experiences",
      icon: Quote,
      route: "/employer-testimonials",
      completed: false,
      required: false,
      estimatedTime: "15 minutes"
    },
    {
      id: 8,
      title: "Recognition & Awards",
      description: "Company achievements and industry recognition",
      icon: Award,
      route: "/employer-recognition", 
      completed: false,
      required: false,
      estimatedTime: "5 minutes"
    },
    {
      id: 9,
      title: "Team Member Access",
      description: "Add colleagues to help review applications",
      icon: UserPlus,
      route: "/employer-team-access",
      completed: false,
      required: false,
      estimatedTime: "3 minutes"
    }
  ];

  const allCheckpoints = [...requiredCheckpoints, ...optionalCheckpoints];

  const requiredCompletedCount = requiredCheckpoints.filter(c => c.completed).length;
  const optionalCompletedCount = optionalCheckpoints.filter(c => c.completed).length;
  const requiredCompletionPercentage = (requiredCompletedCount / requiredCheckpoints.length) * 100;
  const overallCompletionPercentage = ((requiredCompletedCount + optionalCompletedCount) / allCheckpoints.length) * 100;

  const getNextIncompleteRequired = () => {
    return requiredCheckpoints.find(c => !c.completed);
  };

  const nextRequiredCheckpoint = getNextIncompleteRequired();
  const isProfileLive = requiredCompletedCount === requiredCheckpoints.length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold" style={{fontFamily: 'Sora'}}>Complete Your Profile</h1>
              <p className="text-gray-600 mt-1" style={{fontFamily: 'Poppins'}}>
                Build a comprehensive employer profile to attract top talent
              </p>
            </div>
            <Button 
              variant="outline"
              onClick={() => setLocation("/employer-dashboard")}
              style={{fontFamily: 'Sora'}}
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Progress Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className={isProfileLive ? "border-green-200 bg-green-50" : "border-yellow-200 bg-yellow-50"}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2" style={{fontFamily: 'Sora'}}>
                    {isProfileLive ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        Profile Live
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        Required Sections
                      </>
                    )}
                  </CardTitle>
                  <p className="text-gray-600 text-sm mt-1" style={{fontFamily: 'Poppins'}}>
                    {isProfileLive 
                      ? "Your profile is live and attracting candidates"
                      : `Complete ${requiredCheckpoints.length - requiredCompletedCount} more required sections`
                    }
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-pink-600" style={{fontFamily: 'Sora'}}>
                    {Math.round(requiredCompletionPercentage)}%
                  </div>
                  <p className="text-sm text-gray-500" style={{fontFamily: 'Poppins'}}>Required</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={requiredCompletionPercentage} className="h-2 mb-4" />
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span style={{fontFamily: 'Poppins'}}>{requiredCompletedCount} of {requiredCheckpoints.length} required sections</span>
                {nextRequiredCheckpoint && (
                  <Button 
                    onClick={() => setLocation(nextRequiredCheckpoint.route)}
                    className="bg-pink-600 hover:bg-pink-700"
                    size="sm"
                    style={{fontFamily: 'Sora'}}
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2" style={{fontFamily: 'Sora'}}>
                    <Star className="w-5 h-5 text-blue-600" />
                    Overall Progress
                  </CardTitle>
                  <p className="text-gray-600 text-sm mt-1" style={{fontFamily: 'Poppins'}}>
                    Including optional enhancements
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600" style={{fontFamily: 'Sora'}}>
                    {Math.round(overallCompletionPercentage)}%
                  </div>
                  <p className="text-sm text-gray-500" style={{fontFamily: 'Poppins'}}>Total</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={overallCompletionPercentage} className="h-2 mb-4" />
              <div className="text-sm text-gray-600" style={{fontFamily: 'Poppins'}}>
                {requiredCompletedCount + optionalCompletedCount} of {allCheckpoints.length} sections completed
              </div>
              {savedProfile?.lastSaved && (
                <p className="text-xs text-gray-500 mt-2" style={{fontFamily: 'Poppins'}}>
                  Last saved: {new Date(savedProfile.lastSaved).toLocaleDateString()}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Required Sections */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h2 className="text-xl font-bold text-gray-900" style={{fontFamily: 'Sora'}}>
              Required Sections
            </h2>
            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full" style={{fontFamily: 'Poppins'}}>
              Must complete to go live
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {requiredCheckpoints.map((checkpoint) => {
              const IconComponent = checkpoint.icon;
              return (
                <Card 
                  key={checkpoint.id} 
                  className={`cursor-pointer transition-all hover:shadow-lg border-l-4 ${
                    checkpoint.completed 
                      ? 'border-l-green-500 border-green-200 bg-green-50' 
                      : 'border-l-red-500 border-red-200 bg-red-50'
                  }`}
                  onClick={() => setLocation(checkpoint.route)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          checkpoint.completed ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          <IconComponent className={`w-5 h-5 ${
                            checkpoint.completed ? 'text-green-600' : 'text-red-600'
                          }`} />
                        </div>
                        <div>
                          <CardTitle className="text-base" style={{fontFamily: 'Sora'}}>
                            {checkpoint.title}
                          </CardTitle>
                          <p className="text-xs text-gray-500" style={{fontFamily: 'Poppins'}}>
                            <Clock className="w-3 h-3 inline mr-1" />
                            {checkpoint.estimatedTime}
                          </p>
                        </div>
                      </div>
                      {checkpoint.completed && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-3" style={{fontFamily: 'Poppins'}}>
                      {checkpoint.description}
                    </p>
                    <Button 
                      variant={checkpoint.completed ? "outline" : "default"}
                      size="sm" 
                      className={`w-full ${!checkpoint.completed ? 'bg-red-600 hover:bg-red-700' : ''}`}
                      style={{fontFamily: 'Sora'}}
                    >
                      {checkpoint.completed ? 'Review' : 'Start'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Optional Sections */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900" style={{fontFamily: 'Sora'}}>
              Optional Enhancements
            </h2>
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full" style={{fontFamily: 'Poppins'}}>
              Boost profile appeal
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {optionalCheckpoints.map((checkpoint) => {
              const IconComponent = checkpoint.icon;
              return (
                <Card 
                  key={checkpoint.id} 
                  className={`cursor-pointer transition-all hover:shadow-lg border-l-4 ${
                    checkpoint.completed 
                      ? 'border-l-green-500 border-green-200 bg-green-50' 
                      : 'border-l-blue-500 border-blue-200 bg-blue-50'
                  }`}
                  onClick={() => setLocation(checkpoint.route)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          checkpoint.completed ? 'bg-green-100' : 'bg-blue-100'
                        }`}>
                          <IconComponent className={`w-5 h-5 ${
                            checkpoint.completed ? 'text-green-600' : 'text-blue-600'
                          }`} />
                        </div>
                        <div>
                          <CardTitle className="text-base" style={{fontFamily: 'Sora'}}>
                            {checkpoint.title}
                          </CardTitle>
                          <p className="text-xs text-gray-500" style={{fontFamily: 'Poppins'}}>
                            <Clock className="w-3 h-3 inline mr-1" />
                            {checkpoint.estimatedTime}
                          </p>
                        </div>
                      </div>
                      {checkpoint.completed && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-3" style={{fontFamily: 'Poppins'}}>
                      {checkpoint.description}
                    </p>
                    <Button 
                      variant={checkpoint.completed ? "outline" : "default"}
                      size="sm" 
                      className={`w-full ${!checkpoint.completed ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                      style={{fontFamily: 'Sora'}}
                    >
                      {checkpoint.completed ? 'Review' : 'Start'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}