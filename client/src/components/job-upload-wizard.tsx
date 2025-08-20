import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { 
  Briefcase, MapPin, Pound, Clock, Users, Target, 
  CheckCircle, ArrowLeft, ArrowRight, Wand2, Eye,
  Award, Star, Lightbulb, Building2, Zap
} from "lucide-react";

interface JobData {
  // Basic Info
  title: string;
  department: string;
  location: string;
  workArrangement: string;
  employmentType: string;
  
  // Compensation
  salaryMin: string;
  salaryMax: string;
  currency: string;
  salaryPeriod: string;
  benefits: string[];
  
  // Requirements & Description
  description: string;
  responsibilities: string;
  requirements: string;
  requiredSkills: string[];
  preferredSkills: string[];
  
  // Behavioral Requirements
  requiredBehavioral: string[];
  preferredBehavioral: string[];
  
  // Settings
  tier: string;
  hasSkillsChallenge: boolean;
  applicationDeadline: string;
  startDate: string;
}

interface TierFeatures {
  [key: string]: {
    name: string;
    price: string;
    features: string[];
    skillsChallenge: boolean;
    aiRecommendations: boolean;
    priorityListing: boolean;
  };
}

export default function JobUploadWizard({ onComplete }: { onComplete?: () => void }) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<JobData>({
    title: "",
    department: "",
    location: "",
    workArrangement: "office",
    employmentType: "full_time",
    salaryMin: "",
    salaryMax: "",
    currency: "GBP",
    salaryPeriod: "annual",
    benefits: [],
    description: "",
    responsibilities: "",
    requirements: "",
    requiredSkills: [],
    preferredSkills: [],
    requiredBehavioral: [],
    preferredBehavioral: [],
    tier: "basic",
    hasSkillsChallenge: false,
    applicationDeadline: "",
    startDate: ""
  });

  const tierFeatures: TierFeatures = {
    basic: {
      name: "Basic",
      price: "£99/month",
      features: [
        "Job posting for 30 days",
        "Basic candidate matching",
        "Email notifications",
        "Standard support"
      ],
      skillsChallenge: false,
      aiRecommendations: false,
      priorityListing: false
    },
    premium: {
      name: "Premium",
      price: "£199/month",
      features: [
        "Job posting for 60 days",
        "Advanced candidate matching",
        "Skills challenge integration",
        "AI-powered job description",
        "Priority listing",
        "Analytics dashboard"
      ],
      skillsChallenge: true,
      aiRecommendations: true,
      priorityListing: true
    },
    enterprise: {
      name: "Enterprise",
      price: "£399/month",
      features: [
        "Unlimited job postings",
        "Premium candidate matching",
        "Custom skills challenges",
        "Dedicated account manager",
        "Advanced analytics",
        "API access",
        "White-label solution"
      ],
      skillsChallenge: true,
      aiRecommendations: true,
      priorityListing: true
    }
  };

  const availableSkills = [
    "Communication", "Customer Service", "Data Analysis", "Problem Solving",
    "Time Management", "Microsoft Office", "Social Media", "Sales",
    "Project Management", "Teamwork", "Leadership", "Research",
    "Writing", "Organization", "Attention to Detail", "Multitasking"
  ];

  const availableBehavioral = [
    "Team Player", "Independent Worker", "Detail-Oriented", "Creative Thinker",
    "Results-Driven", "Adaptable", "Proactive", "Analytical",
    "People-Focused", "Process-Oriented", "Innovation-Minded", "Goal-Oriented"
  ];

  const availableBenefits = [
    "Private Healthcare", "Dental Care", "Pension Scheme", "Flexible Hours",
    "Remote Work", "Professional Development", "Gym Membership", "Free Meals",
    "Life Insurance", "Childcare Vouchers", "Mental Health Support", "Performance Bonuses"
  ];

  const createJobMutation = useMutation({
    mutationFn: async (jobData: JobData) => {
      // Mock API call - in real app would create job posting
      await new Promise(resolve => setTimeout(resolve, 2000));
      return { id: Math.floor(Math.random() * 1000) + 100 };
    },
    onSuccess: () => {
      toast({
        title: "Job Posted Successfully!",
        description: "Your job posting is now live and candidates can apply."
      });
      
      if (onComplete) {
        setTimeout(onComplete, 1500);
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create job posting. Please try again.",
        variant: "destructive"
      });
    }
  });

  const generateAIDescription = () => {
    // Mock AI-generated description based on job title and requirements
    const aiDescription = `We are seeking a motivated ${formData.title} to join our dynamic team. This role offers an excellent opportunity for career growth in a collaborative environment.

Key Responsibilities:
• Support daily operations and contribute to team goals
• Collaborate with cross-functional teams to deliver projects
• Maintain high standards of quality and attention to detail
• Assist in process improvements and optimization

What We Offer:
• Competitive salary and benefits package
• Professional development opportunities
• Supportive and inclusive work environment
• Opportunity to make a meaningful impact

Join us in our mission to create exceptional experiences and drive innovation in our industry.`;

    setFormData(prev => ({ ...prev, description: aiDescription }));
    
    toast({
      title: "AI Description Generated!",
      description: "Review and customize the generated job description as needed."
    });
  };

  const updateFormData = (field: keyof JobData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArraySelection = (field: keyof JobData, item: string) => {
    setFormData(prev => {
      const currentArray = prev[field] as string[];
      return {
        ...prev,
        [field]: currentArray.includes(item)
          ? currentArray.filter(i => i !== item)
          : [...currentArray, item]
      };
    });
  };

  const nextStep = () => {
    if (step < 5) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.title && formData.location && formData.workArrangement;
      case 2:
        return formData.salaryMin && formData.salaryMax;
      case 3:
        return formData.description && formData.requiredSkills.length > 0;
      case 4:
        return formData.tier;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = () => {
    createJobMutation.mutate(formData);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3, 4, 5].map((stepNum) => (
            <div
              key={stepNum}
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 text-sm font-medium ${
                stepNum <= step
                  ? "bg-primary border-primary text-white"
                  : "border-gray-300 text-gray-400"
              }`}
            >
              {stepNum < step ? <CheckCircle className="w-5 h-5" /> : stepNum}
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {step === 1 && <><Briefcase className="w-5 h-5" /> Job Basics</>}
            {step === 2 && <><Pound className="w-5 h-5" /> Compensation & Benefits</>}
            {step === 3 && <><Users className="w-5 h-5" /> Job Description & Requirements</>}
            {step === 4 && <><Star className="w-5 h-5" /> Service Tier & Features</>}
            {step === 5 && <><Eye className="w-5 h-5" /> Review & Publish</>}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Job Basics */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => updateFormData("title", e.target.value)}
                  placeholder="e.g., Marketing Assistant"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => updateFormData("department", e.target.value)}
                    placeholder="e.g., Marketing"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => updateFormData("location", e.target.value)}
                    placeholder="e.g., London, UK"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="workArrangement">Work Arrangement *</Label>
                  <Select value={formData.workArrangement} onValueChange={(value) => updateFormData("workArrangement", value)}>
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
                <div>
                  <Label htmlFor="employmentType">Employment Type</Label>
                  <Select value={formData.employmentType} onValueChange={(value) => updateFormData("employmentType", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full_time">Full-time</SelectItem>
                      <SelectItem value="part_time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Compensation & Benefits */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="salaryMin">Minimum Salary *</Label>
                  <Input
                    id="salaryMin"
                    value={formData.salaryMin}
                    onChange={(e) => updateFormData("salaryMin", e.target.value)}
                    placeholder="25000"
                  />
                </div>
                <div>
                  <Label htmlFor="salaryMax">Maximum Salary *</Label>
                  <Input
                    id="salaryMax"
                    value={formData.salaryMax}
                    onChange={(e) => updateFormData("salaryMax", e.target.value)}
                    placeholder="35000"
                  />
                </div>
                <div>
                  <Label htmlFor="salaryPeriod">Period</Label>
                  <Select value={formData.salaryPeriod} onValueChange={(value) => updateFormData("salaryPeriod", value)}>
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

              <div>
                <Label>Benefits & Perks</Label>
                <p className="text-sm text-gray-600 mb-3">Select all benefits you offer</p>
                <div className="grid grid-cols-2 gap-2">
                  {availableBenefits.map((benefit) => (
                    <div key={benefit} className="flex items-center space-x-2">
                      <Checkbox
                        id={benefit}
                        checked={formData.benefits.includes(benefit)}
                        onCheckedChange={() => toggleArraySelection('benefits', benefit)}
                      />
                      <Label htmlFor={benefit} className="text-sm">{benefit}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Job Description & Requirements */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="description">Job Description *</Label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={generateAIDescription}
                    className="flex items-center gap-2"
                  >
                    <Wand2 className="w-4 h-4" />
                    Generate with AI
                  </Button>
                </div>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => updateFormData("description", e.target.value)}
                  placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                  className="min-h-[120px]"
                />
              </div>

              <div>
                <Label>Required Skills *</Label>
                <p className="text-sm text-gray-600 mb-3">Select skills that are essential for this role</p>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {availableSkills.map((skill) => (
                    <div key={skill} className="flex items-center space-x-2">
                      <Checkbox
                        id={skill}
                        checked={formData.requiredSkills.includes(skill)}
                        onCheckedChange={() => toggleArraySelection('requiredSkills', skill)}
                      />
                      <Label htmlFor={skill} className="text-sm">{skill}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Preferred Skills</Label>
                <p className="text-sm text-gray-600 mb-3">Select skills that would be nice to have</p>
                <div className="grid grid-cols-2 gap-2">
                  {availableSkills.map((skill) => (
                    <div key={skill} className="flex items-center space-x-2">
                      <Checkbox
                        id={`preferred_${skill}`}
                        checked={formData.preferredSkills.includes(skill)}
                        onCheckedChange={() => toggleArraySelection('preferredSkills', skill)}
                      />
                      <Label htmlFor={`preferred_${skill}`} className="text-sm">{skill}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Behavioral Traits</Label>
                <p className="text-sm text-gray-600 mb-3">Select personality traits that fit your team culture</p>
                <div className="grid grid-cols-2 gap-2">
                  {availableBehavioral.map((trait) => (
                    <div key={trait} className="flex items-center space-x-2">
                      <Checkbox
                        id={trait}
                        checked={formData.requiredBehavioral.includes(trait)}
                        onCheckedChange={() => toggleArraySelection('requiredBehavioral', trait)}
                      />
                      <Label htmlFor={trait} className="text-sm">{trait}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Service Tier */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Choose Your Service Tier</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(tierFeatures).map(([tierKey, tier]) => (
                    <Card 
                      key={tierKey}
                      className={`cursor-pointer transition-all ${
                        formData.tier === tierKey ? 'ring-2 ring-primary bg-primary/5' : 'hover:shadow-md'
                      }`}
                      onClick={() => updateFormData('tier', tierKey)}
                    >
                      <CardContent className="p-4">
                        <div className="text-center space-y-3">
                          <div>
                            <h4 className="font-semibold text-lg">{tier.name}</h4>
                            <p className="text-2xl font-bold text-primary">{tier.price}</p>
                          </div>
                          
                          <div className="space-y-2">
                            {tier.features.map((feature) => (
                              <div key={feature} className="flex items-center gap-2 text-sm">
                                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>

                          <div className="pt-2">
                            <Badge 
                              className={formData.tier === tierKey ? 'bg-primary text-white' : 'bg-gray-100'}
                            >
                              {formData.tier === tierKey ? 'Selected' : 'Select'}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Skills Challenge Option */}
              {tierFeatures[formData.tier]?.skillsChallenge && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="skillsChallenge"
                      checked={formData.hasSkillsChallenge}
                      onCheckedChange={(checked) => updateFormData('hasSkillsChallenge', checked)}
                    />
                    <Label htmlFor="skillsChallenge" className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-blue-600" />
                      Include Skills Challenge
                    </Label>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 ml-6">
                    Add a practical skills assessment to better evaluate candidates
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 5: Review */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Review Your Job Posting</h3>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">{formData.title}</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><MapPin className="w-4 h-4 inline mr-1" />{formData.location} • {formData.workArrangement}</p>
                      <p><Pound className="w-4 h-4 inline mr-1" />£{formData.salaryMin} - £{formData.salaryMax} {formData.salaryPeriod}</p>
                      <p><Building2 className="w-4 h-4 inline mr-1" />{tierFeatures[formData.tier].name} Tier</p>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium mb-2">Required Skills</h5>
                    <div className="flex flex-wrap gap-1">
                      {formData.requiredSkills.map((skill) => (
                        <Badge key={skill} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </div>

                  {formData.preferredSkills.length > 0 && (
                    <div>
                      <h5 className="font-medium mb-2">Preferred Skills</h5>
                      <div className="flex flex-wrap gap-1">
                        {formData.preferredSkills.map((skill) => (
                          <Badge key={skill} variant="outline">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {formData.benefits.length > 0 && (
                    <div>
                      <h5 className="font-medium mb-2">Benefits</h5>
                      <div className="flex flex-wrap gap-1">
                        {formData.benefits.map((benefit) => (
                          <Badge key={benefit} className="bg-green-100 text-green-800">{benefit}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {formData.hasSkillsChallenge && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2 text-blue-800">
                        <Award className="w-4 h-4" />
                        <span className="font-medium">Skills Challenge Included</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={step === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            {step < 5 ? (
              <Button
                onClick={nextStep}
                disabled={!isStepValid()}
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!isStepValid() || createJobMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                {createJobMutation.isPending ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Publish Job
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}