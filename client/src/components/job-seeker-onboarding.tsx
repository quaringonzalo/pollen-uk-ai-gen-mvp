import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { Rocket, Target, Book, Users, Zap, User } from "lucide-react";

const onboardingSchema = z.object({
  careerGoals: z.string().min(20, "Please provide at least 20 characters about your career goals"),
  jobFunction: z.array(z.string()).min(1, "Select at least one job function"),
  preferredIndustries: z.array(z.string()).min(1, "Select at least one industry"),
  skillsToLearn: z.array(z.string()).min(1, "Select at least one skill to develop"),
  workLocations: z.array(z.string()).min(1, "Select at least one preferred location"),
  whenToStart: z.string().min(1, "Please specify when you'd like to start"),
  currentEmploymentStatus: z.string().min(1, "Employment status is required"),
  jobApplicationsPerWeek: z.string().min(1, "Please specify application frequency"),
  importantFactors: z.array(z.string()).min(1, "Select at least one important factor"),
  reasonsForPollen: z.array(z.string()).min(1, "Select at least one reason"),
  jobSearchFrustrations: z.array(z.string()).min(1, "Select at least one frustration"),
  howDidYouHear: z.string().min(1, "Please tell us how you heard about Pollen"),
  workEnvironmentPrefs: z.array(z.string()).min(1, "Select at least one work preference"),
  challengeAreas: z.array(z.string()).optional(),
  motivations: z.array(z.string()).min(1, "Select at least one motivation"),
  // Demographics
  pronouns: z.string().optional(),
  genderIdentity: z.string().optional(),
  ethnicity: z.string().optional(),
  upbringingLocation: z.string().optional(),
  disability: z.string().optional(),
  reasonableAdjustments: z.string().optional(),
  lowIncomeHousehold: z.string().optional(),
  freeSchoolMeals: z.string().optional(),
  firstGenUniversity: z.string().optional(),
  firstSecondGenImmigrant: z.string().optional(),
  lgbtqia: z.string().optional(),
});

type OnboardingData = z.infer<typeof onboardingSchema>;

interface JobSeekerOnboardingProps {
  onComplete: (data: OnboardingData) => void;
}

export default function JobSeekerOnboarding({ onComplete }: JobSeekerOnboardingProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 7;

  const form = useForm<OnboardingData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      careerGoals: "",
      jobFunction: [],
      preferredIndustries: [],
      skillsToLearn: [],
      workLocations: [],
      whenToStart: "",
      currentEmploymentStatus: "",
      jobApplicationsPerWeek: "",
      importantFactors: [],
      reasonsForPollen: [],
      jobSearchFrustrations: [],
      howDidYouHear: "",
      workEnvironmentPrefs: [],
      challengeAreas: [],
      motivations: [],
      pronouns: "",
      genderIdentity: "",
      ethnicity: "",
      upbringingLocation: "",
      disability: "",
      reasonableAdjustments: "",
      lowIncomeHousehold: "",
      freeSchoolMeals: "",
      firstGenUniversity: "",
      firstSecondGenImmigrant: "",
      lgbtqia: "",
    },
  });

  const onboardingMutation = useMutation({
    mutationFn: async (data: OnboardingData) => {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Onboarding failed");
      return response.json();
    },
    onSuccess: (_, variables) => {
      toast({
        title: "Welcome to Pollen!",
        description: "Your personalised journey begins now. Check out your recommended challenges!",
      });
      onComplete(variables);
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "Please try again or contact support if the issue persists.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: OnboardingData) => {
    onboardingMutation.mutate(data);
  };

  const nextStep = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const jobFunctions = [
    "Marketing & Advertising", "Sales & Business Development", "Customer Service & Support",
    "Human Resources & People", "Finance & Accounting", "Operations & Project Management",
    "Data & Analytics", "Software Engineering", "Product Management", "Design & Creative",
    "Content & Communications", "Consulting", "Legal", "Healthcare", "Education & Training",
    "Research & Development", "Manufacturing & Production", "Retail & eCommerce"
  ];

  const industries = [
    "Agriculture & Environment", "Art & Design", "Automotive", "Blockchain", "Charity & Community",
    "Construction & Property", "Consulting", "Data & Analytics", "eCommerce & Retail", 
    "Education & Learning", "Energy & Utilities", "Fashion & Beauty", "Financial Services",
    "FMCG", "Gaming & Entertainment", "Marketing & Advertising", "Media & News", "Healthcare",
    "Hospitality, Travel & Leisure", "HR, People & Recruitment", "Law", "Lifestyle, Health & Fitness",
    "Manufacturing & Logistics", "Publishing", "Software & Technology", "Science", "Sports", 
    "Telecommunications", "No idea! Help!"
  ];

  const ukLocations = [
    "London", "Manchester", "Birmingham", "Edinburgh", "Glasgow", "Bristol", "Leeds", "Liverpool",
    "Newcastle", "Sheffield", "Cardiff", "Belfast", "Brighton", "Cambridge", "Oxford", "Bath",
    "York", "Chester", "Canterbury", "Anywhere in England", "Anywhere in Scotland", 
    "Anywhere in Wales", "Anywhere in Northern Ireland", "Remote only", "Happy to relocate anywhere"
  ];

  const skills = [
    "JavaScript", "Python", "React", "Data Analysis", "Project Management",
    "Digital Marketing", "UX/UI Design", "Sales", "Communication", "Leadership"
  ];

  const workPrefs = [
    "Remote work", "Hybrid work", "Office-based", "Flexible hours",
    "Collaborative environment", "Independent work", "Fast-paced", "Structured"
  ];

  const challenges = [
    "Technical interviews", "Networking", "Building portfolio", "Confidence",
    "Industry knowledge", "Salary negotiation", "Work-life balance"
  ];

  const jobApplicationsOptions = [
    "0-2 applications", "3-5 applications", "6-10 applications", "11-15 applications", 
    "16-20 applications", "More than 20 applications", "I'm not actively applying yet"
  ];

  const importantFactors = [
    "Sustainability", "Salary", "Company Culture & Values", "Career Progression", "Leadership",
    "Diversity & Inclusivity", "Company Benefits", "Flexible or Remote Working", "Work-life balance",
    "Learning & Development opportunities", "Job security", "Company size", "Industry reputation"
  ];

  const pollensReasons = [
    "Access resources that make job hunting easier", "Find a job", "Learn about alternative careers",
    "Guidance/support", "Join a community of like-minded people", "CV-less job applications",
    "Skills-based hiring", "Get feedback on applications", "Career mentoring", "Networking opportunities"
  ];

  const jobSearchFrustrations = [
    "Lack of feedback", "Lengthy application process", "Vague job descriptions", 
    "Lack of transparency regarding salaries", "Lack of communication", "Ghosted by employers",
    "Overemphasis on experience and education", "Unclear job requirements", "Discrimination",
    "Too many irrelevant job postings", "Complicated application systems"
  ];

  const howDidYouHearOptions = [
    "TikTok", "Instagram", "LinkedIn", "Family member / friend / colleague", 
    "An event", "In the news", "Google search", "University career service",
    "Job board", "Podcast", "Other social media", "Word of mouth"
  ];

  const motivations = [
    "Career growth", "Learning new skills", "Better salary", "Work-life balance",
    "Making impact", "Job security", "Creative fulfillment", "Leadership opportunities"
  ];

  const toggleArrayValue = (array: string[], value: string, onChange: (newArray: string[]) => void) => {
    if (array.includes(value)) {
      onChange(array.filter(item => item !== value));
    } else {
      onChange([...array, value]);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold">Career Goals & Interests</h2>
        <p className="text-muted-foreground">Tell us about your aspirations and preferences</p>
      </div>

      <div>
        <Label htmlFor="careerGoals">What are your career goals for the next 2-3 years? *</Label>
        <Textarea
          id="careerGoals"
          {...form.register("careerGoals")}
          placeholder="I want to become a software developer and work on projects that make a positive impact. I'm particularly interested in..."
          rows={4}
          className="mt-2"
        />
        {form.formState.errors.careerGoals && (
          <p className="text-sm text-red-600 mt-1">{form.formState.errors.careerGoals.message}</p>
        )}
      </div>

      <div>
        <Label>Job Functions of Interest *</Label>
        <p className="text-sm text-muted-foreground mb-3">What type of roles are you interested in?</p>
        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
          {jobFunctions.map((func) => (
            <div key={func} className="flex items-center space-x-2">
              <Checkbox
                id={func}
                checked={form.watch("jobFunction").includes(func)}
                onCheckedChange={() => {
                  const current = form.watch("jobFunction");
                  toggleArrayValue(current, func, (newArray) => 
                    form.setValue("jobFunction", newArray)
                  );
                }}
              />
              <Label htmlFor={func} className="text-sm">{func}</Label>
            </div>
          ))}
        </div>
        {form.formState.errors.jobFunction && (
          <p className="text-sm text-red-600 mt-1">{form.formState.errors.jobFunction.message}</p>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Rocket className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold">Industries & Location</h2>
        <p className="text-muted-foreground">Where and what industries interest you?</p>
      </div>

      <div>
        <Label>Preferred Industries *</Label>
        <p className="text-sm text-muted-foreground mb-3">Select all that interest you</p>
        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
          {industries.map((industry) => (
            <div key={industry} className="flex items-center space-x-2">
              <Checkbox
                id={industry}
                checked={form.watch("preferredIndustries").includes(industry)}
                onCheckedChange={() => {
                  const current = form.watch("preferredIndustries");
                  toggleArrayValue(current, industry, (newArray) => 
                    form.setValue("preferredIndustries", newArray)
                  );
                }}
              />
              <Label htmlFor={industry} className="text-sm">{industry}</Label>
            </div>
          ))}
        </div>
        {form.formState.errors.preferredIndustries && (
          <p className="text-sm text-red-600 mt-1">{form.formState.errors.preferredIndustries.message}</p>
        )}
      </div>

      <div>
        <Label>Where would you like to work? *</Label>
        <p className="text-sm text-muted-foreground mb-3">Select all locations you'd consider</p>
        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
          {ukLocations.map((location) => (
            <div key={location} className="flex items-center space-x-2">
              <Checkbox
                id={location}
                checked={form.watch("workLocations").includes(location)}
                onCheckedChange={() => {
                  const current = form.watch("workLocations");
                  toggleArrayValue(current, location, (newArray) => 
                    form.setValue("workLocations", newArray)
                  );
                }}
              />
              <Label htmlFor={location} className="text-sm">{location}</Label>
            </div>
          ))}
        </div>
        {form.formState.errors.workLocations && (
          <p className="text-sm text-red-600 mt-1">{form.formState.errors.workLocations.message}</p>
        )}
      </div>

      <div>
        <Label>Skills You Want to Learn *</Label>
        <p className="text-sm text-muted-foreground mb-3">Choose skills you'd like to develop</p>
        <div className="grid grid-cols-2 gap-2">
          {skills.map((skill) => (
            <div key={skill} className="flex items-center space-x-2">
              <Checkbox
                id={skill}
                checked={form.watch("skillsToLearn").includes(skill)}
                onCheckedChange={() => {
                  const current = form.watch("skillsToLearn");
                  toggleArrayValue(current, skill, (newArray) => 
                    form.setValue("skillsToLearn", newArray)
                  );
                }}
              />
              <Label htmlFor={skill} className="text-sm">{skill}</Label>
            </div>
          ))}
        </div>
        {form.formState.errors.skillsToLearn && (
          <p className="text-sm text-red-600 mt-1">{form.formState.errors.skillsToLearn.message}</p>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Book className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold">Skills & Employment</h2>
        <p className="text-muted-foreground">Tell us about your current situation and learning goals</p>
      </div>

      <div>
        <Label>Skills you'd like to develop *</Label>
        <p className="text-sm text-muted-foreground mb-3">Choose areas for growth</p>
        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
          {skills.map((skill) => (
            <div key={skill} className="flex items-center space-x-2">
              <Checkbox
                id={skill}
                checked={form.watch("skillsToLearn").includes(skill)}
                onCheckedChange={() => {
                  const current = form.watch("skillsToLearn");
                  toggleArrayValue(current, skill, (newArray) => 
                    form.setValue("skillsToLearn", newArray)
                  );
                }}
              />
              <Label htmlFor={skill} className="text-sm">{skill}</Label>
            </div>
          ))}
        </div>
        {form.formState.errors.skillsToLearn && (
          <p className="text-sm text-red-600 mt-1">{form.formState.errors.skillsToLearn.message}</p>
        )}
      </div>

      <div>
        <Label>Current employment status *</Label>
        <p className="text-sm text-muted-foreground mb-3">How would you describe your current situation?</p>
        <div className="grid grid-cols-1 gap-2">
          {[
            "Employed - satisfied with my career path",
            "Employed - looking for something more fulfilling", 
            "Employed - seeking career change",
            "Unemployed - actively job searching",
            "Recently left education (school/college/university)",
            "Taking a career break",
            "Self-employed/Freelancing",
            "Volunteer work/Unpaid experience",
            "Other"
          ].map((status) => (
            <Button
              key={status}
              type="button"
              variant={form.watch("currentEmploymentStatus") === status ? "default" : "outline"}
              onClick={() => form.setValue("currentEmploymentStatus", status)}
              className="justify-start text-sm h-auto py-3"
            >
              {status}
            </Button>
          ))}
        </div>
        {form.formState.errors.currentEmploymentStatus && (
          <p className="text-sm text-red-600 mt-1">{form.formState.errors.currentEmploymentStatus.message}</p>
        )}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold">Job Search Preferences</h2>
        <p className="text-muted-foreground">Help us understand your job search approach</p>
      </div>

      <div>
        <Label>How many jobs do you typically apply to per week? *</Label>
        <div className="grid grid-cols-2 gap-3 mt-2">
          {jobApplicationsOptions.map((option) => (
            <Button
              key={option}
              type="button"
              variant={form.watch("jobApplicationsPerWeek") === option ? "default" : "outline"}
              onClick={() => form.setValue("jobApplicationsPerWeek", option)}
              className="justify-start text-sm h-auto py-2"
            >
              {option}
            </Button>
          ))}
        </div>
        {form.formState.errors.jobApplicationsPerWeek && (
          <p className="text-sm text-red-600 mt-1">{form.formState.errors.jobApplicationsPerWeek.message}</p>
        )}
      </div>

      <div>
        <Label>What factors are most important to you in a job? *</Label>
        <p className="text-sm text-muted-foreground mb-3">Select all that apply</p>
        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
          {importantFactors.map((factor) => (
            <div key={factor} className="flex items-center space-x-2">
              <Checkbox
                id={factor}
                checked={form.watch("importantFactors").includes(factor)}
                onCheckedChange={() => {
                  const current = form.watch("importantFactors");
                  toggleArrayValue(current, factor, (newArray) => 
                    form.setValue("importantFactors", newArray)
                  );
                }}
              />
              <Label htmlFor={factor} className="text-sm">{factor}</Label>
            </div>
          ))}
        </div>
        {form.formState.errors.importantFactors && (
          <p className="text-sm text-red-600 mt-1">{form.formState.errors.importantFactors.message}</p>
        )}
      </div>

      <div>
        <Label>Work environment preferences *</Label>
        <p className="text-sm text-muted-foreground mb-3">What type of work environment suits you best?</p>
        <div className="grid grid-cols-2 gap-2">
          {workPrefs.map((pref) => (
            <div key={pref} className="flex items-center space-x-2">
              <Checkbox
                id={pref}
                checked={form.watch("workEnvironmentPrefs").includes(pref)}
                onCheckedChange={() => {
                  const current = form.watch("workEnvironmentPrefs");
                  toggleArrayValue(current, pref, (newArray) => 
                    form.setValue("workEnvironmentPrefs", newArray)
                  );
                }}
              />
              <Label htmlFor={pref} className="text-sm">{pref}</Label>
            </div>
          ))}
        </div>
        {form.formState.errors.workEnvironmentPrefs && (
          <p className="text-sm text-red-600 mt-1">{form.formState.errors.workEnvironmentPrefs.message}</p>
        )}
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Zap className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold">About Pollen</h2>
        <p className="text-muted-foreground">Help us understand why you're here and improve our service</p>
      </div>

      <div>
        <Label>Why did you sign up for Pollen? *</Label>
        <p className="text-sm text-muted-foreground mb-3">Select all that apply</p>
        <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
          {pollensReasons.map((reason) => (
            <div key={reason} className="flex items-center space-x-2">
              <Checkbox
                id={reason}
                checked={form.watch("reasonsForPollen").includes(reason)}
                onCheckedChange={() => {
                  const current = form.watch("reasonsForPollen");
                  toggleArrayValue(current, reason, (newArray) => 
                    form.setValue("reasonsForPollen", newArray)
                  );
                }}
              />
              <Label htmlFor={reason} className="text-sm">{reason}</Label>
            </div>
          ))}
        </div>
        {form.formState.errors.reasonsForPollen && (
          <p className="text-sm text-red-600 mt-1">{form.formState.errors.reasonsForPollen.message}</p>
        )}
      </div>

      <div>
        <Label>What frustrates you most about job searching? *</Label>
        <p className="text-sm text-muted-foreground mb-3">Select all that apply</p>
        <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
          {jobSearchFrustrations.map((frustration) => (
            <div key={frustration} className="flex items-center space-x-2">
              <Checkbox
                id={frustration}
                checked={form.watch("jobSearchFrustrations").includes(frustration)}
                onCheckedChange={() => {
                  const current = form.watch("jobSearchFrustrations");
                  toggleArrayValue(current, frustration, (newArray) => 
                    form.setValue("jobSearchFrustrations", newArray)
                  );
                }}
              />
              <Label htmlFor={frustration} className="text-sm">{frustration}</Label>
            </div>
          ))}
        </div>
        {form.formState.errors.jobSearchFrustrations && (
          <p className="text-sm text-red-600 mt-1">{form.formState.errors.jobSearchFrustrations.message}</p>
        )}
      </div>

      <div>
        <Label>How did you hear about Pollen? *</Label>
        <div className="grid grid-cols-2 gap-3 mt-2">
          {howDidYouHearOptions.map((option) => (
            <Button
              key={option}
              type="button"
              variant={form.watch("howDidYouHear") === option ? "default" : "outline"}
              onClick={() => form.setValue("howDidYouHear", option)}
              className="justify-start text-sm h-auto py-2"
            >
              {option}
            </Button>
          ))}
        </div>
        {form.formState.errors.howDidYouHear && (
          <p className="text-sm text-red-600 mt-1">{form.formState.errors.howDidYouHear.message}</p>
        )}
      </div>
    </div>
  );



  const renderStep7 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Zap className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold">What Drives You?</h2>
        <p className="text-muted-foreground">Understanding your motivations</p>
      </div>

      <div>
        <Label>What motivates you most in your career? *</Label>
        <p className="text-sm text-muted-foreground mb-3">Select all that resonate with you</p>
        <div className="grid grid-cols-2 gap-2">
          {motivations.map((motivation) => (
            <div key={motivation} className="flex items-center space-x-2">
              <Checkbox
                id={motivation}
                checked={form.watch("motivations").includes(motivation)}
                onCheckedChange={() => {
                  const current = form.watch("motivations");
                  toggleArrayValue(current, motivation, (newArray) => 
                    form.setValue("motivations", newArray)
                  );
                }}
              />
              <Label htmlFor={motivation} className="text-sm">{motivation}</Label>
            </div>
          ))}
        </div>
        {form.formState.errors.motivations && (
          <p className="text-sm text-red-600 mt-1">{form.formState.errors.motivations.message}</p>
        )}
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">What happens next?</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Personalized challenge recommendations based on your goals</li>
          <li>• Curated learning resources for your target skills</li>
          <li>• Mentorship matches in your preferred industries</li>
          <li>• Job opportunities aligned with your preferences</li>
          <li>• Community events relevant to your interests</li>
        </ul>
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <User className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold">Personal Background</h2>
        <p className="text-muted-foreground">Help us understand your background (all optional and confidential)</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Pronouns</Label>
          <div className="grid grid-cols-1 gap-2 mt-2">
            {["She/Her", "He/Him", "They/Them", "Prefer not to say"].map((pronoun) => (
              <Button
                key={pronoun}
                type="button"
                variant={form.watch("pronouns") === pronoun ? "default" : "outline"}
                onClick={() => form.setValue("pronouns", pronoun)}
                className="justify-start text-sm h-auto py-2"
              >
                {pronoun}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Label>Gender Identity</Label>
          <div className="grid grid-cols-1 gap-2 mt-2">
            {["Female", "Male", "Non-binary", "Transgender", "Prefer not to say"].map((gender) => (
              <Button
                key={gender}
                type="button"
                variant={form.watch("genderIdentity") === gender ? "default" : "outline"}
                onClick={() => form.setValue("genderIdentity", gender)}
                className="justify-start text-sm h-auto py-2"
              >
                {gender}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <Label>Ethnicity</Label>
        <div className="grid grid-cols-1 gap-2 mt-2">
          {[
            "Black, Black British, Caribbean or African",
            "Asian or Asian British", 
            "White",
            "Multi-racial / Multi-ethnic",
            "Other",
            "Prefer not to say"
          ].map((ethnicity) => (
            <Button
              key={ethnicity}
              type="button"
              variant={form.watch("ethnicity") === ethnicity ? "default" : "outline"}
              onClick={() => form.setValue("ethnicity", ethnicity)}
              className="justify-start text-sm h-auto py-2"
            >
              {ethnicity}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <Label>Where did you grow up?</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {[
            "I grew up in a city",
            "I grew up in a town / suburb", 
            "I grew up in a rural area",
            "I moved around growing up",
            "Other",
            "Prefer not to say"
          ].map((location) => (
            <Button
              key={location}
              type="button"
              variant={form.watch("upbringingLocation") === location ? "default" : "outline"}
              onClick={() => form.setValue("upbringingLocation", location)}
              className="justify-start text-sm h-auto py-2"
            >
              {location}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <Label>Are you part of the LGBTQIA+ community?</Label>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {["Yes", "No", "Prefer not to say"].map((answer) => (
            <Button
              key={answer}
              type="button"
              variant={form.watch("lgbtqia") === answer ? "default" : "outline"}
              onClick={() => form.setValue("lgbtqia", answer)}
              className="justify-start text-sm h-auto py-2"
            >
              {answer}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );



  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Welcome to Pollen!</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Step {currentStep} of 7
              </p>
            </div>
            <div className="flex space-x-1">
              {Array.from({ length: 7 }, (_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    i + 1 <= currentStep ? "bg-blue-600" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 7) * 100}%` }}
              />
            </div>

            <div className="space-y-8">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
              {currentStep === 4 && renderStep4()}
              {currentStep === 5 && renderStep5()}
              {currentStep === 6 && renderStep6()}
              {currentStep === 7 && renderStep7()}
            </div>

            <div className="flex justify-between mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              
              {currentStep < 7 ? (
                <Button type="button" onClick={nextStep}>
                  Next
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  disabled={onboardingMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {onboardingMutation.isPending ? "Completing Setup..." : "Complete Setup"}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}