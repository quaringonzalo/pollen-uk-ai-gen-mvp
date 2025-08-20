import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { 
  Briefcase, MapPin, Clock, PoundSterling, Users, Zap,
  Lightbulb, Target, Award, CheckCircle, AlertCircle,
  Sparkles, Brain, FileText, Calendar, Settings
} from "lucide-react";

interface JobData {
  // Basic Info
  title: string;
  department: string;
  location: string;
  workArrangement: string;
  employmentType: string;
  
  // Compensation
  salaryMin: number;
  salaryMax: number;
  currency: string;
  salaryPeriod: string;
  benefits: string[];
  
  // Description
  description: string;
  responsibilities: string;
  requirements: string;
  companyBenefits: string;
  
  // Skills & Behavioral
  requiredSkills: string[];
  preferredSkills: string[];
  requiredBehavioral: string[];
  preferredBehavioral: string[];
  
  // Settings
  tier: string;
  hasSkillsChallenge: boolean;
  applicationDeadline: string;
  startDate: string;
}

interface JobUploadCreatorProps {
  employerId: number;
  tier: 'basic' | 'premium' | 'enterprise';
}

export default function JobUploadCreator({ employerId, tier }: JobUploadCreatorProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [useAIAssistant, setUseAIAssistant] = useState(true);
  const [jobData, setJobData] = useState<JobData>({
    title: "",
    department: "",
    location: "",
    workArrangement: "office",
    employmentType: "full_time",
    salaryMin: 0,
    salaryMax: 0,
    currency: "GBP",
    salaryPeriod: "annual",
    benefits: [],
    description: "",
    responsibilities: "",
    requirements: "",
    companyBenefits: "",
    requiredSkills: [],
    preferredSkills: [],
    requiredBehavioral: [],
    preferredBehavioral: [],
    tier,
    hasSkillsChallenge: tier !== 'basic',
    applicationDeadline: "",
    startDate: ""
  });

  // AI-powered suggestions based on job title and tier
  const getAISuggestions = () => {
    const titleLower = jobData.title.toLowerCase();
    
    if (titleLower.includes('marketing')) {
      return {
        skills: ['Digital Marketing', 'Social Media', 'Content Creation', 'Analytics', 'SEO'],
        behavioural: ['Creativity', 'Communication', 'Adaptability', 'Results-oriented'],
        responsibilities: `• Develop and execute digital marketing campaigns across multiple channels
• Create engaging content for social media platforms and website
• Analyze campaign performance and optimize for better results
• Collaborate with design and sales teams to align marketing efforts
• Stay updated with latest marketing trends and best practices`,
        requirements: `• Passion for digital marketing and social media
• Strong written and verbal communication skills
• Basic understanding of social media platforms
• Analytical mindset with attention to detail
• Willingness to learn and adapt to new technologies`,
        challengeIdeas: [
          "Create a social media campaign strategy for a product launch",
          "Analyze marketing data and present insights",
          "Write compelling ad copy for different platforms"
        ]
      };
    }
    
    if (titleLower.includes('data') || titleLower.includes('analyst')) {
      return {
        skills: ['Excel', 'Data Analysis', 'SQL', 'Statistics', 'Visualization'],
        behavioural: ['Analytical thinking', 'Attention to detail', 'Problem-solving', 'Curiosity'],
        responsibilities: `• Collect, analyse, and interpret complex data sets
• Create reports and visualizations to communicate findings
• Identify trends and patterns to support business decisions
• Collaborate with teams to understand data requirements
• Maintain data quality and integrity standards`,
        requirements: `• Strong analytical and mathematical skills
• Proficiency in Excel and basic statistics
• Curiosity about data and problem-solving
• Excellent attention to detail
• Ability to explain complex concepts simply`,
        challengeIdeas: [
          "Analyze sales data to identify trends and recommendations",
          "Create a dashboard to visualize key business metrics",
          "Clean and process a messy dataset"
        ]
      };
    }
    
    // Default suggestions for entry-level roles
    return {
      skills: ['Communication', 'Microsoft Office', 'Time Management', 'Customer Service'],
      behavioural: ['Teamwork', 'Adaptability', 'Positive attitude', 'Eagerness to learn'],
      responsibilities: `• Support daily operations and administrative tasks
• Assist team members with various projects and initiatives
• Communicate effectively with colleagues and stakeholders
• Learn company processes and contribute to team goals
• Participate in training and development opportunities`,
      requirements: `• Strong communication and interpersonal skills
• Positive attitude and willingness to learn
• Ability to work well in a team environment
• Basic computer skills and familiarity with office software
• Reliable and punctual with good organizational skills`,
      challengeIdeas: [
        "Complete a time management and prioritization exercise",
        "Demonstrate customer service skills through role-play scenarios",
        "Create a presentation on a relevant industry topic"
      ]
    };
  };

  const aiSuggestions = getAISuggestions();

  // Tier-specific features
  const tierFeatures = {
    basic: {
      skillsChallenge: false,
      behaviouralAssessment: false,
      priorityListing: false,
      candidateFiltering: 'basic',
      aiOptimization: false
    },
    premium: {
      skillsChallenge: true,
      behaviouralAssessment: true,
      priorityListing: true,
      candidateFiltering: 'advanced',
      aiOptimization: true
    },
    enterprise: {
      skillsChallenge: true,
      behaviouralAssessment: true,
      priorityListing: true,
      candidateFiltering: 'advanced',
      aiOptimization: true,
      customBranding: true,
      dedicatedSupport: true
    }
  };

  const currentTierFeatures = tierFeatures[tier];

  const skillOptions = [
    'Communication', 'Teamwork', 'Problem Solving', 'Time Management', 'Customer Service',
    'Microsoft Office', 'Excel', 'PowerPoint', 'Data Analysis', 'Digital Marketing',
    'Social Media', 'Content Creation', 'Project Management', 'Organization', 'Leadership'
  ];

  const behaviouralOptions = [
    'Teamwork', 'Leadership', 'Adaptability', 'Communication', 'Problem-solving',
    'Creativity', 'Initiative', 'Attention to detail', 'Results-oriented', 'Customer-focused',
    'Analytical thinking', 'Positive attitude', 'Reliability', 'Eagerness to learn'
  ];

  const benefitOptions = [
    'Private Healthcare', 'Dental Care', 'Pension Scheme', 'Flexible Hours', 'Remote Work',
    'Professional Development', 'Annual Leave', 'Gym Membership', 'Free Meals',
    'Mental Health Support', 'Learning Budget', 'Career Progression'
  ];

  const createJobMutation = useMutation({
    mutationFn: async (data: JobData) => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return { id: Math.floor(Math.random() * 1000) + 100 };
    },
    onSuccess: () => {
      toast({
        title: "Job Posted Successfully!",
        description: "Your job posting is now live and visible to candidates."
      });
      // Reset form or redirect
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create job posting. Please try again.",
        variant: "destructive"
      });
    }
  });

  const updateJobData = (field: keyof JobData, value: any) => {
    setJobData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArraySelection = (field: keyof JobData, item: string) => {
    setJobData(prev => {
      const currentArray = prev[field] as string[];
      return {
        ...prev,
        [field]: currentArray.includes(item)
          ? currentArray.filter(i => i !== item)
          : [...currentArray, item]
      };
    });
  };

  const applyAISuggestion = (field: keyof JobData, suggestions: string[]) => {
    setJobData(prev => ({
      ...prev,
      [field]: [...new Set([...(prev[field] as string[]), ...suggestions])]
    }));
  };

  const handleSubmit = () => {
    createJobMutation.mutate(jobData);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return jobData.title && jobData.location && jobData.workArrangement && jobData.employmentType;
      case 2:
        return jobData.description && jobData.responsibilities;
      case 3:
        return jobData.requiredSkills.length > 0;
      case 4:
        return true; // Optional step
      default:
        return false;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Create Job Posting</h1>
          <p className="text-gray-600">Post entry-level opportunities and find great candidates</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge className={tier === 'enterprise' ? 'bg-purple-100 text-purple-800' : 
                           tier === 'premium' ? 'bg-blue-100 text-blue-800' : 
                           'bg-gray-100 text-gray-800'}>
            {tier.toUpperCase()} Tier
          </Badge>
          {currentTierFeatures.aiOptimization && (
            <div className="flex items-center gap-2">
              <Switch checked={useAIAssistant} onCheckedChange={setUseAIAssistant} />
              <span className="text-sm">AI Assistant</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step <= currentStep ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
            </div>
            {step < 4 && (
              <div className={`w-24 h-1 mx-2 ${
                step < currentStep ? 'bg-blue-500' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      <Tabs value={currentStep.toString()} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="1" disabled={currentStep < 1}>Basic Info</TabsTrigger>
          <TabsTrigger value="2" disabled={currentStep < 2}>Description</TabsTrigger>
          <TabsTrigger value="3" disabled={currentStep < 3}>Skills & Requirements</TabsTrigger>
          <TabsTrigger value="4" disabled={currentStep < 4}>Settings & Review</TabsTrigger>
        </TabsList>

        {/* Step 1: Basic Information */}
        <TabsContent value="1" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Job Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    value={jobData.title}
                    onChange={(e) => updateJobData("title", e.target.value)}
                    placeholder="e.g., Marketing Assistant"
                  />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={jobData.department}
                    onChange={(e) => updateJobData("department", e.target.value)}
                    placeholder="e.g., Marketing"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={jobData.location}
                    onChange={(e) => updateJobData("location", e.target.value)}
                    placeholder="e.g., London, UK"
                  />
                </div>
                <div>
                  <Label htmlFor="workArrangement">Work Arrangement *</Label>
                  <Select value={jobData.workArrangement} onValueChange={(value) => updateJobData("workArrangement", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="office">Office-based</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="employmentType">Employment Type *</Label>
                  <Select value={jobData.employmentType} onValueChange={(value) => updateJobData("employmentType", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full_time">Full-time</SelectItem>
                      <SelectItem value="part_time">Part-time</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                      <SelectItem value="apprenticeship">Apprenticeship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Salary Range */}
              <div className="space-y-4">
                <Label>Salary Range</Label>
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="salaryMin">Minimum</Label>
                    <Input
                      id="salaryMin"
                      type="number"
                      value={jobData.salaryMin || ""}
                      onChange={(e) => updateJobData("salaryMin", parseInt(e.target.value) || 0)}
                      placeholder="25000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="salaryMax">Maximum</Label>
                    <Input
                      id="salaryMax"
                      type="number"
                      value={jobData.salaryMax || ""}
                      onChange={(e) => updateJobData("salaryMax", parseInt(e.target.value) || 0)}
                      placeholder="35000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={jobData.currency} onValueChange={(value) => updateJobData("currency", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="USD">USD ($)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="salaryPeriod">Period</Label>
                    <Select value={jobData.salaryPeriod} onValueChange={(value) => updateJobData("salaryPeriod", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="annual">Annual</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="hourly">Hourly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div>
                <Label>Employee Benefits</Label>
                <p className="text-sm text-gray-600 mb-3">Select benefits offered with this position</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {benefitOptions.map((benefit) => (
                    <div key={benefit} className="flex items-center space-x-2">
                      <Checkbox
                        id={benefit}
                        checked={jobData.benefits.includes(benefit)}
                        onCheckedChange={() => toggleArraySelection('benefits', benefit)}
                      />
                      <Label htmlFor={benefit} className="text-sm">{benefit}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 2: Description */}
        <TabsContent value="2" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Job Description
              </CardTitle>
              {useAIAssistant && currentTierFeatures.aiOptimization && (
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <Sparkles className="w-4 h-4" />
                  AI suggestions available based on your job title
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="description">Job Overview *</Label>
                <Textarea
                  id="description"
                  value={jobData.description}
                  onChange={(e) => updateJobData("description", e.target.value)}
                  placeholder="Provide a brief overview of the role and what the successful candidate will be doing..."
                  className="min-h-[100px]"
                />
                {useAIAssistant && currentTierFeatures.aiOptimization && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => updateJobData("description", `We are seeking an enthusiastic ${jobData.title} to join our dynamic team. This is an excellent opportunity for someone starting their career to gain valuable experience and grow within our organization.`)}
                  >
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Use AI Suggestion
                  </Button>
                )}
              </div>

              <div>
                <Label htmlFor="responsibilities">Key Responsibilities *</Label>
                <Textarea
                  id="responsibilities"
                  value={jobData.responsibilities}
                  onChange={(e) => updateJobData("responsibilities", e.target.value)}
                  placeholder="List the main responsibilities and tasks..."
                  className="min-h-[120px]"
                />
                {useAIAssistant && currentTierFeatures.aiOptimization && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => updateJobData("responsibilities", aiSuggestions.responsibilities)}
                  >
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Use AI Suggestion
                  </Button>
                )}
              </div>

              <div>
                <Label htmlFor="requirements">Requirements & Qualifications *</Label>
                <Textarea
                  id="requirements"
                  value={jobData.requirements}
                  onChange={(e) => updateJobData("requirements", e.target.value)}
                  placeholder="List the essential requirements for this role..."
                  className="min-h-[120px]"
                />
                {useAIAssistant && currentTierFeatures.aiOptimization && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => updateJobData("requirements", aiSuggestions.requirements)}
                  >
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Use AI Suggestion
                  </Button>
                )}
              </div>

              <div>
                <Label htmlFor="companyBenefits">Why Join Us?</Label>
                <Textarea
                  id="companyBenefits"
                  value={jobData.companyBenefits}
                  onChange={(e) => updateJobData("companyBenefits", e.target.value)}
                  placeholder="Describe what makes your company a great place to work..."
                  className="min-h-[80px]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 3: Skills & Requirements */}
        <TabsContent value="3" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Required Skills
                </CardTitle>
                {useAIAssistant && currentTierFeatures.aiOptimization && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => applyAISuggestion('requiredSkills', aiSuggestions.skills)}
                  >
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Add AI Suggestions
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {skillOptions.map((skill) => (
                    <div key={skill} className="flex items-center space-x-2">
                      <Checkbox
                        id={`req-${skill}`}
                        checked={jobData.requiredSkills.includes(skill)}
                        onCheckedChange={() => toggleArraySelection('requiredSkills', skill)}
                      />
                      <Label htmlFor={`req-${skill}`} className="text-sm">{skill}</Label>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {jobData.requiredSkills.map((skill) => (
                    <Badge key={skill} variant="default">
                      {skill}
                      <button 
                        onClick={() => toggleArraySelection('requiredSkills', skill)}
                        className="ml-2 text-xs"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Preferred Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {skillOptions.filter(skill => !jobData.requiredSkills.includes(skill)).map((skill) => (
                    <div key={skill} className="flex items-center space-x-2">
                      <Checkbox
                        id={`pref-${skill}`}
                        checked={jobData.preferredSkills.includes(skill)}
                        onCheckedChange={() => toggleArraySelection('preferredSkills', skill)}
                      />
                      <Label htmlFor={`pref-${skill}`} className="text-sm">{skill}</Label>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {jobData.preferredSkills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                      <button 
                        onClick={() => toggleArraySelection('preferredSkills', skill)}
                        className="ml-2 text-xs"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {currentTierFeatures.behaviouralAssessment && (
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    Required Traits
                  </CardTitle>
                  {useAIAssistant && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => applyAISuggestion('requiredBehavioral', aiSuggestions.behavioural)}
                    >
                      <Lightbulb className="w-4 h-4 mr-2" />
                      Add AI Suggestions
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {behaviouralOptions.map((trait) => (
                      <div key={trait} className="flex items-center space-x-2">
                        <Checkbox
                          id={`req-behavioural-${trait}`}
                          checked={jobData.requiredBehavioral.includes(trait)}
                          onCheckedChange={() => toggleArraySelection('requiredBehavioral', trait)}
                        />
                        <Label htmlFor={`req-behavioural-${trait}`} className="text-sm">{trait}</Label>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {jobData.requiredBehavioral.map((trait) => (
                      <Badge key={trait} variant="default" className="bg-purple-600">
                        {trait}
                        <button 
                          onClick={() => toggleArraySelection('requiredBehavioral', trait)}
                          className="ml-2 text-xs"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Preferred Traits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {behaviouralOptions.filter(trait => !jobData.requiredBehavioral.includes(trait)).map((trait) => (
                      <div key={trait} className="flex items-center space-x-2">
                        <Checkbox
                          id={`pref-behavioural-${trait}`}
                          checked={jobData.preferredBehavioral.includes(trait)}
                          onCheckedChange={() => toggleArraySelection('preferredBehavioral', trait)}
                        />
                        <Label htmlFor={`pref-behavioural-${trait}`} className="text-sm">{trait}</Label>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {jobData.preferredBehavioral.map((trait) => (
                      <Badge key={trait} variant="secondary" className="bg-purple-100 text-purple-800">
                        {trait}
                        <button 
                          onClick={() => toggleArraySelection('preferredBehavioral', trait)}
                          className="ml-2 text-xs"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Step 4: Settings & Review */}
        <TabsContent value="4" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Job Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="applicationDeadline">Application Deadline</Label>
                    <Input
                      id="applicationDeadline"
                      type="date"
                      value={jobData.applicationDeadline}
                      onChange={(e) => updateJobData("applicationDeadline", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="startDate">Preferred Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={jobData.startDate}
                      onChange={(e) => updateJobData("startDate", e.target.value)}
                    />
                  </div>
                </div>

                {currentTierFeatures.skillsChallenge && (
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Skills Challenge</h4>
                      <p className="text-sm text-gray-600">Include a skills assessment with this job</p>
                    </div>
                    <Switch
                      checked={jobData.hasSkillsChallenge}
                      onCheckedChange={(checked) => updateJobData("hasSkillsChallenge", checked)}
                    />
                  </div>
                )}

                {jobData.hasSkillsChallenge && currentTierFeatures.skillsChallenge && (
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Suggested Skills Challenges</h4>
                      <div className="space-y-2">
                        {aiSuggestions.challengeIdeas.map((challenge, index) => (
                          <div key={index} className="text-sm p-2 bg-white rounded border">
                            {challenge}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Review & Publish
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Job Title:</span>
                    <span className="text-sm font-medium">{jobData.title || "Not set"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Location:</span>
                    <span className="text-sm font-medium">{jobData.location || "Not set"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Employment Type:</span>
                    <span className="text-sm font-medium">{jobData.employmentType.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Required Skills:</span>
                    <span className="text-sm font-medium">{jobData.requiredSkills.length}</span>
                  </div>
                  {currentTierFeatures.skillsChallenge && (
                    <div className="flex justify-between">
                      <span className="text-sm">Skills Challenge:</span>
                      <span className="text-sm font-medium">{jobData.hasSkillsChallenge ? "Yes" : "No"}</span>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Tier Benefits Active:</h4>
                  <ul className="text-sm space-y-1">
                    {currentTierFeatures.priorityListing && (
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Priority listing in search results
                      </li>
                    )}
                    {currentTierFeatures.skillsChallenge && (
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Skills assessment integration
                      </li>
                    )}
                    {currentTierFeatures.behaviouralAssessment && (
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Behavioral matching
                      </li>
                    )}
                    {currentTierFeatures.aiOptimization && (
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        AI-powered optimization
                      </li>
                    )}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Ready to publish?</h3>
                  <p className="text-sm text-gray-600">Your job posting will be visible to all job seekers immediately</p>
                </div>
                <Button 
                  onClick={handleSubmit}
                  disabled={createJobMutation.isPending || !isStepValid()}
                  size="lg"
                >
                  {createJobMutation.isPending ? "Publishing..." : "Publish Job"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
        >
          Previous
        </Button>
        
        {currentStep < 4 ? (
          <Button
            onClick={() => setCurrentStep(currentStep + 1)}
            disabled={!isStepValid()}
          >
            Next
          </Button>
        ) : null}
      </div>
    </div>
  );
}