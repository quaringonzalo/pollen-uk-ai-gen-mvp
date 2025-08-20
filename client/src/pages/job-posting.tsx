import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ArrowRight, 
  ArrowLeft, 
  Users,
  Target,
  CheckCircle,
  Loader2
} from "lucide-react";
import { COMPANY_SIZE_OPTIONS, CONTRACT_DURATION_OPTIONS, EMPLOYMENT_TYPE_OPTIONS } from "@shared/pricing";
import { useQuery } from "@tanstack/react-query";

interface JobFormData {
  jobTitle: string;
  keyJobFunctions: string[];
  placeOfWork: string;
  workingHours: string;
  employmentType: string;
  contractType: string;
  contractDuration: string;
  companySize: string;
  employeeCount: number;
  hiringVolume: string;
  workArrangement: string;
  urgencyOfHire: string;
  keySkills: string[];
  selectedApproach: string;
}

// Key job functions available
const JOB_FUNCTIONS = [
  "Administration & Support",
  "Sales & Business Development", 
  "Marketing & Communications",
  "Customer Service",
  "Finance & Accounting",
  "Human Resources",
  "Operations & Logistics",
  "Project Management",
  "Data Analysis & Research",
  "Creative & Design",
  "Technical Support",
  "Quality Assurance",
  "Training & Development",
  "Legal & Compliance"
];

// Foundation challenge skills that job seekers complete
const FOUNDATION_SKILLS = [
  "Communication",
  "Problem Solving", 
  "Time Management",
  "Attention to Detail",
  "Customer Service",
  "Data Analysis",
  "Project Management",
  "Digital Marketing",
  "Content Creation",
  "Administrative Skills",
  "Sales & Business Development",
  "Financial Analysis",
  "Technical Support",
  "Quality Control",
  "Team Collaboration"
];

export default function JobPosting() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<JobFormData>({
    jobTitle: "",
    keyJobFunctions: [],
    placeOfWork: "",
    workingHours: "",
    employmentType: "",
    contractType: "",
    contractDuration: "",
    companySize: "",
    employeeCount: 0,
    hiringVolume: "",
    workArrangement: "",
    urgencyOfHire: "",
    keySkills: [],
    selectedApproach: ""
  });

  // Load employer profile data to pre-populate company size
  const { data: employerProfile } = useQuery({
    queryKey: ["/api/employer-profile/current"],
    staleTime: 0, // Always fetch fresh data
  });

  // Map employer profile company size to pricing structure format
  const mapEmployerCompanySize = (employerSize: string) => {
    switch (employerSize) {
      case "1-10 employees":
        return { companySize: "micro", employeeCount: 5 };
      case "11-50 employees":
        return { companySize: "small", employeeCount: 25 };
      case "51-200 employees":
        return { companySize: "medium", employeeCount: 100 };
      case "201-500 employees":
        return { companySize: "medium", employeeCount: 300 };
      case "501-1000 employees":
        return { companySize: "large", employeeCount: 750 };
      case "1000+ employees":
        return { companySize: "large", employeeCount: 1000 };
      default:
        return { companySize: "small", employeeCount: 25 };
    }
  };

  // Auto-populate company size from employer profile
  useEffect(() => {
    if (employerProfile?.companySize) {
      const mappedSize = mapEmployerCompanySize(employerProfile.companySize);
      setFormData(prev => ({
        ...prev,
        companySize: mappedSize.companySize,
        employeeCount: mappedSize.employeeCount
      }));
    }
  }, [employerProfile]);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisResults, setAnalysisResults] = useState({
    matchingCandidates: 0,
    skillsAvailability: "",
    marketInsights: ""
  });

  const totalSteps = 2; // 1: Form, 2: Analysis

  const handleNext = () => {
    if (currentStep === 1) {
      // Check if freelance/outsourced was selected
      if (formData.employmentType === 'freelancer') {
        localStorage.setItem('jobFormData', JSON.stringify(formData));
        window.location.href = '/freelance-consultation';
        return;
      }
      
      localStorage.setItem('jobFormData', JSON.stringify(formData));
      setCurrentStep(2);
      startAnalysis();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const startAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisComplete(false);

    // 10-second dramatic analysis
    setTimeout(() => {
      // Simulate analysis results based on form data
      const candidateCount = Math.floor(Math.random() * 50) + 20; // 20-70 candidates
      const skillsLevel = candidateCount > 40 ? "High" : candidateCount > 25 ? "Medium" : "Growing";
      
      // Generate dynamic market insights based on results
      let insights = "";
      if (skillsLevel === "High") {
        insights = `Excellent match! Strong pool of ${formData.keySkills.slice(0, 2).join(" & ")} professionals in our community ready to engage with your opportunity.`;
      } else if (skillsLevel === "Medium") {
        insights = `Good foundation of ${formData.keySkills.slice(0, 2).join(" & ")} talent available. With the right approach, we can attract quality candidates to your role.`;
      } else {
        insights = `Growing talent pool for ${formData.keySkills.slice(0, 2).join(" & ")} skills. We have strategies to maximize visibility and attract the right candidates for your needs.`;
      }
      
      setAnalysisResults({
        matchingCandidates: candidateCount,
        skillsAvailability: skillsLevel,
        marketInsights: insights
      });
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }, 10000);
  };

  const proceedToSelection = () => {
    localStorage.setItem('completeJobFormData', JSON.stringify({
      ...formData,
      analysisResults
    }));
    window.location.href = '/simplified-service-selection';
  };

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      keySkills: prev.keySkills.includes(skill)
        ? prev.keySkills.filter(s => s !== skill)
        : [...prev.keySkills, skill]
    }));
  };

  const handleJobFunctionToggle = (jobFunction: string) => {
    setFormData(prev => ({
      ...prev,
      keyJobFunctions: prev.keyJobFunctions.includes(jobFunction)
        ? prev.keyJobFunctions.filter(f => f !== jobFunction)
        : [...prev.keyJobFunctions, jobFunction]
    }));
  };

  const isStep1Valid = () => {
    const placeOfWorkValid = formData.workArrangement === 'remote' || formData.placeOfWork.length > 0;
    const baseValidation = formData.jobTitle && 
           formData.keyJobFunctions.length > 0 &&
           formData.workArrangement &&
           placeOfWorkValid &&
           formData.workingHours && 
           formData.employmentType &&
           formData.hiringVolume && 
           formData.urgencyOfHire &&
           formData.keySkills.length > 0;
    
    // Additional validation for payroll employees
    if (formData.employmentType === 'payroll') {
      return baseValidation && 
             formData.contractType &&
             (formData.contractType === 'permanent' || formData.contractDuration);
    }
    
    return baseValidation;
  };

  const renderJobForm = () => {
    // Progressive form - show fields as previous ones are completed
    const showJobFunctions = formData.jobTitle.length > 0;
    const showWorkArrangement = formData.keyJobFunctions.length > 0;
    const showPlaceOfWork = formData.workArrangement.length > 0 && (formData.workArrangement === 'hybrid' || formData.workArrangement === 'office');
    const showWorkingHours = (formData.workArrangement === 'remote') || (formData.placeOfWork.length > 0 && (formData.workArrangement === 'hybrid' || formData.workArrangement === 'office'));
    const showEmploymentType = formData.workingHours.length > 0;
    const showContractType = formData.employmentType === 'payroll';
    const showContractDuration = formData.contractType && formData.contractType !== 'permanent';
    const showHiringVolume = (formData.employmentType === 'payroll' && formData.contractType) || formData.employmentType === 'freelancer';
    const showUrgency = formData.hiringVolume.length > 0;
    const showSkills = formData.urgencyOfHire.length > 0;

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Let's create your job posting</h2>
          <p className="text-gray-600">We'll guide you through step by step</p>
        </div>

        <div className="space-y-6">
          {/* Job Title */}
          <div>
            <Label htmlFor="jobTitle">Job title *</Label>
            <Input
              id="jobTitle"
              value={formData.jobTitle}
              onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
              placeholder="e.g. Marketing Assistant, Sales Representative"
              className="mt-1"
            />
          </div>

          {/* Key Job Functions */}
          {showJobFunctions && (
            <div className="animate-in slide-in-from-top-4 duration-300">
              <Label>Key job function(s) *</Label>
              <p className="text-sm text-gray-600 mb-3">
                Select the main functions this role will be responsible for
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {JOB_FUNCTIONS.map((jobFunction) => (
                  <div key={jobFunction} className="flex items-center space-x-2">
                    <Checkbox
                      id={jobFunction}
                      checked={formData.keyJobFunctions.includes(jobFunction)}
                      onCheckedChange={() => handleJobFunctionToggle(jobFunction)}
                    />
                    <Label htmlFor={jobFunction} className="text-sm">{jobFunction}</Label>
                  </div>
                ))}
              </div>
              {formData.keyJobFunctions.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {formData.keyJobFunctions.map((jobFunction) => (
                    <Badge key={jobFunction} variant="secondary" className="text-xs">
                      {jobFunction}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Work Arrangement */}
          {showWorkArrangement && (
            <div className="animate-in slide-in-from-top-4 duration-300">
              <Label>Work arrangement *</Label>
              <RadioGroup 
                value={formData.workArrangement} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, workArrangement: value, placeOfWork: value === 'remote' ? 'Fully Remote' : '' }))}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="remote" id="remote" />
                  <Label htmlFor="remote">Fully remote</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hybrid" id="hybrid" />
                  <Label htmlFor="hybrid">Hybrid working</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="office" id="office" />
                  <Label htmlFor="office">Office-based</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Place of Work */}
          {showPlaceOfWork && (
            <div className="animate-in slide-in-from-top-4 duration-300">
              <Label>Office location *</Label>
              <p className="text-sm text-gray-600 mb-2">
                Enter the specific office address where employees will work
              </p>
              <Input
                value={formData.placeOfWork}
                onChange={(e) => setFormData(prev => ({ ...prev, placeOfWork: e.target.value }))}
                placeholder="e.g. 123 High Street, London, SW1A 1AA"
                className="mt-1"
              />
            </div>
          )}

          {showWorkingHours && (
            <div className="animate-in slide-in-from-top-4 duration-300">
              <Label>Working hours *</Label>
              <RadioGroup 
                value={formData.workingHours} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, workingHours: value }))}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="full-time" id="full-time" />
                  <Label htmlFor="full-time">Full-time</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="part-time" id="part-time" />
                  <Label htmlFor="part-time">Part-time</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="either" id="either-hours" />
                  <Label htmlFor="either-hours">Either</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Employment Type */}
          {showEmploymentType && (
            <div className="animate-in slide-in-from-top-4 duration-300">
              <Label>Employment type *</Label>
              <RadioGroup 
                value={formData.employmentType} 
                onValueChange={(value) => setFormData(prev => ({ 
                  ...prev, 
                  employmentType: value,
                  contractType: '', // Reset contract type when employment type changes
                  contractDuration: '' // Reset contract duration when employment type changes
                }))}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="payroll" id="payroll" />
                  <Label htmlFor="payroll">On your payroll</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="freelancer" id="freelancer" />
                  <Label htmlFor="freelancer">Freelancer/contractor</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Contract Type - Only for payroll employees */}
          {showContractType && (
            <div className="animate-in slide-in-from-top-4 duration-300">
              <Label>Contract type *</Label>
              <RadioGroup 
                value={formData.contractType} 
                onValueChange={(value) => setFormData(prev => ({ 
                  ...prev, 
                  contractType: value,
                  contractDuration: value === 'permanent' ? 'permanent' : '' // Auto-set duration for permanent
                }))}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="temporary" id="temporary" />
                  <Label htmlFor="temporary">Temporary / Fixed term</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="internship" id="internship" />
                  <Label htmlFor="internship">Internship</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="permanent" id="permanent" />
                  <Label htmlFor="permanent">Permanent</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Contract Duration - Only for temporary contracts */}
          {showContractDuration && (
            <div className="animate-in slide-in-from-top-4 duration-300">
              <Label>Contract duration *</Label>
              <RadioGroup 
                value={formData.contractDuration} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, contractDuration: value }))}
                className="mt-2"
              >
                {CONTRACT_DURATION_OPTIONS.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value}>{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}



          {/* Hiring Volume */}
          {showHiringVolume && (
            <div className="animate-in slide-in-from-top-4 duration-300">
              <Label>How many people are you hiring for this role? *</Label>
              <RadioGroup 
                value={formData.hiringVolume} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, hiringVolume: value }))}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1" id="one" />
                  <Label htmlFor="one">1 person</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2-5" id="few" />
                  <Label htmlFor="few">2-5 people</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="5+" id="many" />
                  <Label htmlFor="many">5+ people</Label>
                </div>
              </RadioGroup>
            </div>
          )}



          {/* Urgency of Hire */}
          {showUrgency && (
            <div className="animate-in slide-in-from-top-4 duration-300">
              <Label>Urgency of hire *</Label>
              <RadioGroup 
                value={formData.urgencyOfHire} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, urgencyOfHire: value }))}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="asap" id="asap" />
                  <Label htmlFor="asap">ASAP (within 2 weeks)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="month" id="month" />
                  <Label htmlFor="month">Within a month</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="flexible" id="flexible" />
                  <Label htmlFor="flexible">Flexible timing</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Key Skills */}
          {showSkills && (
            <div className="animate-in slide-in-from-top-4 duration-300">
              <Label>What key skills are needed for this role? *</Label>
              <p className="text-sm text-gray-600 mb-3">
                Select the main skills required for this position
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {FOUNDATION_SKILLS.map((skill) => (
                  <div key={skill} className="flex items-center space-x-2">
                    <Checkbox
                      id={skill}
                      checked={formData.keySkills.includes(skill)}
                      onCheckedChange={() => handleSkillToggle(skill)}
                    />
                    <Label htmlFor={skill} className="text-sm">{skill}</Label>
                  </div>
                ))}
              </div>
              {formData.keySkills.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {formData.keySkills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderAnalysis = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {isAnalyzing ? "Analysing our community..." : "Analysis Complete!"}
        </h2>
        <p className="text-gray-600">
          {isAnalyzing ? "Hold tight, we're finding your perfect matches" : "Here's what we found for your role"}
        </p>
      </div>

      {isAnalyzing && (
        <div className="flex flex-col items-center space-y-4 py-12">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
          <div className="text-center">
            <p className="text-lg font-medium text-gray-900 mb-2">Searching our talent community</p>
            <p className="text-gray-600">Matching skills • Checking location preferences • Analysing availability • Assessing employment type fit</p>
          </div>
          <Progress value={75} className="w-64" />
        </div>
      )}

      {analysisComplete && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{analysisResults.matchingCandidates}</div>
                <div className="text-sm text-gray-600">Matching candidates</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{analysisResults.skillsAvailability}</div>
                <div className="text-sm text-gray-600">Skills availability</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <CheckCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">Ready</div>
                <div className="text-sm text-gray-600">To proceed</div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <h3 className="font-semibold text-blue-900 mb-2">Market Insights</h3>
              <p className="text-blue-800">{analysisResults.marketInsights}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {formData.keySkills.slice(0, 3).map((skill) => (
                  <Badge key={skill} className="bg-blue-100 text-blue-800">
                    {skill} ✓
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button 
              onClick={proceedToSelection}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700"
            >
              Choose Your Approach
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderJobForm();
      case 2:
        return renderAnalysis();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Post New Job</h1>
            <div className="text-sm text-gray-600">
              Step {currentStep} of {totalSteps}
            </div>
          </div>
          <Progress value={(currentStep / totalSteps) * 100} className="w-full" />
        </div>

        {/* Content */}
        <Card>
          <CardContent className="p-8">
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        {!isAnalyzing && (
          <div className="flex justify-between mt-6">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            {currentStep < totalSteps && (
              <Button 
                onClick={handleNext}
                disabled={currentStep === 1 && !isStep1Valid()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}