import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, Gift, Star, ArrowRight, X, GraduationCap, Info } from "lucide-react";
import BehavioralAssessment from "./behavioural-assessment";
import { useQuery } from "@tanstack/react-query";

interface PostSignupAssessmentProps {
  userId: number;
  onComplete?: () => void;
  onSkip?: () => void;
}

export default function PostSignupAssessment({ userId, onComplete, onSkip }: PostSignupAssessmentProps) {
  const [showAssessment, setShowAssessment] = useState(false);
  const [showAcademicForm, setShowAcademicForm] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [academicData, setAcademicData] = useState({
    qualificationLevel: "",
    qualificationSubject: "",
    institutionName: "",
    graduationYear: ""
  });

  const { data: userProfile } = useQuery({
    queryKey: ['/api/job-seekers/profile', userId],
  });

  const handleAssessmentComplete = () => {
    setIsCompleted(true);
    if (onComplete) {
      setTimeout(onComplete, 2000); // Show success for 2 seconds
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    }
  };

  const qualificationLevels = [
    "High School / A-Levels", "College Diploma", "Bachelor's Degree", 
    "Master's Degree", "PhD", "Professional Certification", "Other"
  ];

  const currentYear = new Date().getFullYear();
  const graduationYears = Array.from({ length: 50 }, (_, i) => currentYear - i);

  const handleAcademicSubmit = () => {
    // Save academic data (mock implementation)
    console.log("Academic data:", academicData);
    setShowAcademicForm(false);
    setShowAssessment(true);
  };

  if (showAcademicForm) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <GraduationCap className="w-6 h-6 text-blue-500" />
              Academic Background (Optional)
            </CardTitle>
            <CardDescription className="flex items-center justify-center gap-2 text-blue-600">
              <Info className="w-4 h-4" />
              This information is for research purposes only and won't affect your job opportunities
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="qualificationLevel">Highest Qualification</Label>
                <Select value={academicData.qualificationLevel} onValueChange={(value) => 
                  setAcademicData(prev => ({ ...prev, qualificationLevel: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select qualification" />
                  </SelectTrigger>
                  <SelectContent>
                    {qualificationLevels.map((level) => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="qualificationSubject">Subject/Field</Label>
                <Input
                  id="qualificationSubject"
                  value={academicData.qualificationSubject}
                  onChange={(e) => setAcademicData(prev => ({ ...prev, qualificationSubject: e.target.value }))}
                  placeholder="e.g., Business, Computer Science, Art"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="institutionName">Institution Name</Label>
                <Input
                  id="institutionName"
                  value={academicData.institutionName}
                  onChange={(e) => setAcademicData(prev => ({ ...prev, institutionName: e.target.value }))}
                  placeholder="e.g., University of London"
                />
              </div>

              <div>
                <Label htmlFor="graduationYear">Graduation Year</Label>
                <Select value={academicData.graduationYear} onValueChange={(value) => 
                  setAcademicData(prev => ({ ...prev, graduationYear: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {graduationYears.map((year) => (
                      <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-between gap-3 pt-4">
              <Button variant="outline" onClick={() => {
                setShowAcademicForm(false);
                setShowAssessment(true);
              }}>
                Skip for Now
              </Button>
              <Button onClick={handleAcademicSubmit}>
                Continue to Assessment
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-green-700">
              <Star className="w-6 h-6" />
              Work Style Quiz Completed!
            </CardTitle>
            <CardDescription className="text-green-600">
              You've earned 100 points and enhanced your profile for better job matching
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Badge variant="default" className="bg-green-500 text-white">
                +100 Points
              </Badge>
              <Badge variant="outline" className="border-green-500 text-green-700">
                Profile Enhanced
              </Badge>
            </div>
            <p className="text-sm text-gray-600">
              Your behavioural profile will help us match you with the right opportunities and work environments.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showAssessment) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Work Style Quiz</h2>
          <Button variant="ghost" onClick={() => setShowAssessment(false)}>
            <X className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
        <BehavioralAssessment 
          type="enhanced" 
          showResults={true}
          userId={userId}
          onComplete={handleAssessmentComplete}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Brain className="w-6 h-6 text-blue-500" />
            Boost Your Profile with Our Fun Assessment
          </CardTitle>
          <CardDescription>
            Take 5 minutes to help us understand your work style and earn points
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Gift className="w-5 h-5 text-green-500" />
                What You Get
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <strong>100 points</strong> for completing
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  Better job matching
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
                  Personality insights
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full" />
                  Career guidance
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">How It Works</h3>
              <ol className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mt-0.5">1</span>
                  Answer 16 quick questions about work preferences
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mt-0.5">2</span>
                  Get your DISC behavioural profile
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mt-0.5">3</span>
                  Receive personalised career insights
                </li>
              </ol>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Current completion rate</p>
                <p className="text-sm text-gray-600">50% of users complete this step</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">100</p>
                <p className="text-sm text-gray-600">points available</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <Button 
              onClick={() => setShowAcademicForm(true)}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700"
            >
              Start Assessment
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              onClick={handleSkip}
              size="lg"
            >
              Skip for Now
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            This assessment is for profile enhancement only and takes about 5 minutes to complete. 
            You can retake it anytime from your dashboard.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}