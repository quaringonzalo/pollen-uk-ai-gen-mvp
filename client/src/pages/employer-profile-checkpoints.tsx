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
        <div className="max-w-4xl mx-auto px-6 py-6">
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

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{fontFamily: 'Sora'}}>
              <CheckCircle className="w-5 h-5 text-green-600" />
              Profile Completion Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2" style={{fontFamily: 'Poppins'}}>
                  <span>Overall Progress</span>
                  <span>{completedCount} of {checkpoints.length} sections complete</span>
                </div>
                <Progress value={completionPercentage} className="h-2" />
              </div>
              
              {savedProfile?.lastSaved && (
                <div className="flex items-center gap-2 text-sm text-gray-600" style={{fontFamily: 'Poppins'}}>
                  <Clock className="w-4 h-4" />
                  Last saved: {new Date(savedProfile.lastSaved).toLocaleDateString()}
                </div>
              )}

              {nextCheckpoint && (
                <div className="mt-4">
                  <Button 
                    onClick={() => setLocation(nextCheckpoint.route)}
                    className="bg-pink-600 hover:bg-pink-700"
                    style={{fontFamily: 'Sora'}}
                  >
                    Continue Setup
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Checkpoints Grid */}
        <div className="grid gap-6">
          {checkpoints.map((checkpoint, index) => {
            const Icon = checkpoint.icon;
            const isNext = nextCheckpoint?.id === checkpoint.id;
            
            return (
              <Card 
                key={checkpoint.id} 
                className={`transition-all duration-200 ${
                  isNext ? 'ring-2 ring-pink-600 bg-pink-50' : 
                  checkpoint.completed ? 'bg-green-50 border-green-200' : 
                  'hover:shadow-md'
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${
                        checkpoint.completed ? 'bg-green-100 text-green-600' :
                        isNext ? 'bg-pink-100 text-pink-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold" style={{fontFamily: 'Sora'}}>
                          {checkpoint.title}
                        </h3>
                        <p className="text-gray-600 text-sm" style={{fontFamily: 'Poppins'}}>
                          {checkpoint.description}
                        </p>
                        {isNext && (
                          <p className="text-pink-600 text-sm font-medium mt-1" style={{fontFamily: 'Poppins'}}>
                            Continue here
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {checkpoint.completed && (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm font-medium" style={{fontFamily: 'Poppins'}}>Complete</span>
                        </div>
                      )}
                      
                      <Button 
                        onClick={() => setLocation(checkpoint.route)}
                        variant={isNext ? "default" : checkpoint.completed ? "outline" : "ghost"}
                        className={isNext ? "bg-pink-600 hover:bg-pink-700" : ""}
                        style={{fontFamily: 'Sora'}}
                      >
                        {checkpoint.completed ? "Review" : isNext ? "Continue" : "Start"}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Completion Message */}
        {completionPercentage === 100 && (
          <Card className="mt-8 bg-green-50 border-green-200">
            <CardContent className="p-6">
              <div className="text-center">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-green-800 mb-2" style={{fontFamily: 'Sora'}}>
                  Profile Complete!
                </h3>
                <p className="text-green-700 mb-4" style={{fontFamily: 'Poppins'}}>
                  Your employer profile is now complete and ready to attract top talent.
                </p>
                <Button 
                  onClick={() => setLocation("/employer-dashboard")}
                  className="bg-green-600 hover:bg-green-700"
                  style={{fontFamily: 'Sora'}}
                >
                  View Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}