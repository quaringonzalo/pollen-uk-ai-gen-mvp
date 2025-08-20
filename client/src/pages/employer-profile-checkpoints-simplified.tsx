import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
  AlertTriangle,
  Eye
} from "lucide-react";

interface SavedProfile {
  id: number;
  userId: number;
  profileData: any;
  step: number;
  isComplete: boolean;
  lastSaved: string;
}

export default function EmployerProfileCheckpointsSimplified() {
  const [, setLocation] = useLocation();

  const { data: savedProfile, isLoading, error } = useQuery<SavedProfile>({
    queryKey: ['/api/employer-profile/saved'],
  });

  // Handle error state
  if (error) {
    console.log("No saved profile found, starting fresh");
  }

  const currentStep = savedProfile?.step || 0;
  
  // All checkpoints (including both required and optional)
  const allCheckpoints = [
    // Required sections (must complete for profile to be live)
    {
      id: 1,
      title: "Company Information",
      description: "Basic company details and contact information",
      icon: Building,
      route: "/employer-profile-setup",
      completed: currentStep >= 3, // Updated to reflect 3-step basic setup completion
      required: true,
      estimatedTime: "5 minutes"
    },
    
    // Optional enhancement sections
    {
      id: 2,
      title: "Entry-Level Employee Testimonials",
      description: "Showcase success stories from junior employees to build trust with candidates",
      icon: Quote,
      route: "/employer-testimonials",
      completed: false,
      required: false,
      estimatedTime: "15 minutes"
    },
    {
      id: 3,
      title: "Company Recognitions",
      description: "Highlight awards, certifications, and industry recognition",
      icon: Award,
      route: "/employer-recognition",
      completed: false,
      required: false,
      estimatedTime: "10 minutes"
    },
    {
      id: 4,
      title: "Entry-Level Support Programmes",
      description: "Detail your mentorship, training, and development programmes",
      icon: GraduationCap,
      route: "/employer-programmes",
      completed: false,
      required: false,
      estimatedTime: "15 minutes"
    },
    {
      id: 5,
      title: "Team & Culture Photos",
      description: "Share authentic photos of your team, office space, and company events",
      icon: Camera,
      route: "/employer-photos",
      completed: false,
      required: false,
      estimatedTime: "10 minutes"
    }
  ];

  const requiredCheckpoints = allCheckpoints.filter(cp => cp.required);
  const optionalCheckpoints = allCheckpoints.filter(cp => !cp.required);
  
  const completedRequired = requiredCheckpoints.filter(cp => cp.completed).length;
  const completedOptional = optionalCheckpoints.filter(cp => cp.completed).length;
  const totalCompleted = completedRequired + completedOptional;
  
  // Calculate completion percentage for required sections
  const requiredCompletionPercentage = (completedRequired / requiredCheckpoints.length) * 100;
  
  // Calculate overall completion percentage (required sections are worth 60%, optional 40%)
  const overallCompletionPercentage = (requiredCompletionPercentage * 0.6) + 
    ((completedOptional / optionalCheckpoints.length) * 40);

  const nextRequiredCheckpoint = requiredCheckpoints.find(cp => !cp.completed);
  const nextOptionalCheckpoint = optionalCheckpoints.find(cp => !cp.completed);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-pink-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold" style={{fontFamily: 'Sora'}}>Profile Enhancement Centre</h1>
              <p className="text-gray-600 mt-1" style={{fontFamily: 'Poppins'}}>
                Your basic profile is under review. Add these enhancements to attract more candidates.
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline"
                onClick={() => setLocation("/employer-profile")}
                style={{fontFamily: 'Sora'}}
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview Profile
              </Button>
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
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Progress Overview - Single, Clear Card */}
        <Card className="mb-8 border-l-4 border-l-green-500 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-900 mb-2" style={{fontFamily: 'Sora'}}>
                  Basic Profile Complete ✓
                </h3>
                <p className="text-green-800 mb-4" style={{fontFamily: 'Poppins'}}>
                  Your essential company information has been submitted and is being reviewed by our team. 
                  You'll be notified once it's live (typically within 24 hours).
                </p>
                <div className="flex items-center gap-4 text-sm text-green-700">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Under review
                  </div>
                  {savedProfile?.lastSaved && (
                    <div>
                      Last updated: {new Date(savedProfile.lastSaved).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhancement Sections */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4" style={{fontFamily: 'Sora'}}>
              Enhance Your Profile
            </h2>
            <p className="text-gray-600 mb-6" style={{fontFamily: 'Poppins'}}>
              While your basic profile is under review, you can add these sections to make it even more attractive to candidates.
            </p>
          </div>

          {/* Enhancement Options Grid */}
          <div className="grid gap-4">
            {optionalCheckpoints.map((checkpoint) => {
              const Icon = checkpoint.icon;
              
              return (
                <Card 
                  key={checkpoint.id} 
                  className="transition-all duration-200 hover:shadow-md"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-gray-100 text-gray-600">
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1" style={{fontFamily: 'Sora'}}>
                            {checkpoint.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2" style={{fontFamily: 'Poppins'}}>
                            {checkpoint.description}
                          </p>
                          <div className="text-xs text-gray-500">
                            Estimated time: {checkpoint.estimatedTime}
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={() => setLocation(checkpoint.route)}
                        variant="outline"
                        className="hover:bg-pink-50 hover:border-pink-300"
                        style={{fontFamily: 'Sora'}}
                      >
                        {checkpoint.completed ? "Edit" : "Add"}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Help Text */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-blue-900 mb-1" style={{fontFamily: 'Sora'}}>
                    Why add these sections?
                  </h4>
                  <p className="text-blue-800 text-sm" style={{fontFamily: 'Poppins'}}>
                    Profiles with testimonials and detailed company information receive 3x more applications 
                    and help candidates understand your company culture before applying.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}