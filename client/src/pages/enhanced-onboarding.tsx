import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  User, MapPin, GraduationCap, Heart, Target, 
  Brain, TrendingUp, Users, Award, Lightbulb,
  CheckCircle, Star, BarChart, Clock
} from "lucide-react";

interface OnboardingData {
  personal: any;
  behavioural: any;
  preferences: any;
  background: any;
  demographics: any;
}

export default function EnhancedOnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<OnboardingData>({
    personal: {},
    behavioural: {},
    preferences: {},
    background: {},
    demographics: {}
  });
  const [showResults, setShowResults] = useState(false);

  const steps = [
    { id: "personal", title: "Personal Information", icon: User },
    { id: "behavioural", title: "Work Style Assessment", icon: Brain },
    { id: "preferences", title: "Job Preferences", icon: Target },
    { id: "background", title: "Background & Experience", icon: GraduationCap },
    { id: "demographics", title: "Background Information", icon: Users },
  ];

  const handleStepComplete = (stepData: any) => {
    const stepId = steps[currentStep].id;
    setResponses(prev => ({ ...prev, [stepId]: stepData }));
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  if (showResults) {
    return <OnboardingResults responses={responses} />;
  }

  const CurrentStepComponent = getStepComponent(steps[currentStep].id);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Complete Your Profile</h1>
          <p className="text-lg text-gray-600">
            Help us understand you better for personalised job matching
          </p>
        </div>

        {/* Progress */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Profile Completion</h3>
              <span className="text-sm text-gray-600">
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>
            <Progress value={((currentStep + 1) / steps.length) * 100} className="h-3 mb-4" />
            <div className="flex justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = index < currentStep;
                const isCurrent = index === currentStep;
                
                return (
                  <div key={step.id} className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      isCompleted ? "bg-green-500 text-white" :
                      isCurrent ? "bg-blue-500 text-white" :
                      "bg-gray-200 text-gray-500"
                    }`}>
                      {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <span className="text-xs text-center font-medium">{step.title}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Current Step */}
        <CurrentStepComponent onComplete={handleStepComplete} />
      </div>
    </div>
  );
}

function getStepComponent(stepId: string) {
  switch (stepId) {
    case "personal": return PersonalInformationStep;
    case "behavioural": return BehavioralAssessmentStep;
    case "preferences": return JobPreferencesStep;
    case "background": return BackgroundStep;
    case "demographics": return DemographicsStep;
    default: return PersonalInformationStep;
  }
}

function PersonalInformationStep({ onComplete }: { onComplete: (data: any) => void }) {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    pronouns: "",
    happyActivities: "",
    frustrations: "",
    proudMoment: ""
  });

  const isComplete = data.firstName && data.lastName && data.email && data.happyActivities;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-6 h-6" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={data.firstName}
              onChange={(e) => setData(prev => ({ ...prev, firstName: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              value={data.lastName}
              onChange={(e) => setData(prev => ({ ...prev, lastName: e.target.value }))}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => setData(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={data.phone}
              onChange={(e) => setData(prev => ({ ...prev, phone: e.target.value }))}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="pronouns">Preferred Pronouns</Label>
          <Select value={data.pronouns} onValueChange={(value) => setData(prev => ({ ...prev, pronouns: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select pronouns" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="she/her">She/Her</SelectItem>
              <SelectItem value="he/him">He/Him</SelectItem>
              <SelectItem value="they/them">They/Them</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="happyActivities">What do you like doing that makes you happy? *</Label>
          <Textarea
            id="happyActivities"
            value={data.happyActivities}
            onChange={(e) => setData(prev => ({ ...prev, happyActivities: e.target.value }))}
            placeholder="Tell us about your hobbies, interests, and activities that bring you joy..."
          />
        </div>

        <div>
          <Label htmlFor="frustrations">Is there anything in life that frustrates you?</Label>
          <Textarea
            id="frustrations"
            value={data.frustrations}
            onChange={(e) => setData(prev => ({ ...prev, frustrations: e.target.value }))}
            placeholder="Share what challenges or situations you find frustrating..."
          />
        </div>

        <div>
          <Label htmlFor="proudMoment">Is there anything you've done you feel really proud of?</Label>
          <Textarea
            id="proudMoment"
            value={data.proudMoment}
            onChange={(e) => setData(prev => ({ ...prev, proudMoment: e.target.value }))}
            placeholder="Describe an achievement or moment you're particularly proud of..."
          />
        </div>

        <div className="flex justify-end">
          <Button onClick={() => onComplete(data)} disabled={!isComplete}>
            Continue to Work Style Assessment
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function BehavioralAssessmentStep({ onComplete }: { onComplete: (data: any) => void }) {
  const [responses, setResponses] = useState<{ [key: string]: string }>({});

  const behaviouralQuestions = [
    {
      id: "rules",
      question: "Rules are for...",
      options: [
        "Respecting - they're there for a reason",
        "Avoiding unnecessary risks",
        "Breaking if they don't make sense",
        "Guidance, but flexibility is key"
      ]
    },
    {
      id: "conflict",
      question: "When it comes to conflict...",
      options: [
        "I remove myself from the situation",
        "I care deeply if I'm involved, it matters to me what people think",
        "I try to mediate and find solutions",
        "I address it head-on directly"
      ]
    },
    {
      id: "furniture",
      question: "Flat pack furniture...",
      options: [
        "Is a fun activity to do as a team",
        "Gives me a big sense of accomplishment after proper preparation", 
        "Is frustrating without clear instructions",
        "I prefer to hire someone else to do it"
      ]
    },
    {
      id: "todo_list",
      question: "My to-do list is...",
      options: [
        "Extensively organised into categories",
        "Pretty concise, I don't have many urgent things to do",
        "Not overly important, flexibility is everything",
        "Constantly changing based on priorities"
      ]
    },
    {
      id: "games",
      question: "When playing a game I...",
      options: [
        "Play to win",
        "Will analyse every move and strive to do my best",
        "Focus on having fun with others",
        "Try new strategies to see what works"
      ]
    },
    {
      id: "tasks",
      question: "When carrying out a task I...",
      options: [
        "Approach it systematically, ensuring all details are covered",
        "Invest time in deciding how to tackle it, seeking guidance from others where I can",
        "Jump in and adapt as I go",
        "Break it down into manageable chunks"
      ]
    },
    {
      id: "social_life",
      question: "My social life is...",
      options: [
        "Super busy, I'm always hanging out with different people",
        "All about close-knit bonds and shared memories",
        "A good balance of social time and alone time",
        "Centered around shared interests and activities"
      ]
    },
    {
      id: "decisions",
      question: "I make decisions...",
      options: [
        "As a team, once I've consulted everyone's opinions",
        "With careful thought and analysis, every choice matters",
        "Quickly based on my instincts",
        "After researching all available options"
      ]
    },
    {
      id: "plans",
      question: "When making plans I...",
      options: [
        "Involve everyone, plans are stronger together",
        "Keep it open-ended, who knows where the adventure leads?",
        "Plan thoroughly with backup options",
        "Set clear goals and timelines"
      ]
    },
    {
      id: "homework",
      question: "At school, I would complete homework...",
      options: [
        "To the best of my ability, having thoroughly checked it through",
        "As quickly as possible so I could do better things",
        "With friends to make it more enjoyable",
        "When I understood the material completely"
      ]
    }
  ];

  const isComplete = behaviouralQuestions.every(q => responses[q.id]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-6 h-6" />
          Work Style Assessment
        </CardTitle>
        <p className="text-gray-600">These questions help us understand your natural working preferences</p>
      </CardHeader>
      <CardContent>
        <div className="max-h-96 overflow-y-auto space-y-6 pr-2">
          {behaviouralQuestions.map((question, index) => (
            <div key={question.id} className="space-y-3">
              <h4 className="font-medium">{index + 1}. {question.question}</h4>
              <RadioGroup
                value={responses[question.id] || ""}
                onValueChange={(value) => setResponses(prev => ({ ...prev, [question.id]: value }))}
              >
                {question.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`${question.id}-${optionIndex}`} />
                    <Label htmlFor={`${question.id}-${optionIndex}`} className="text-sm">{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-gray-600">
              {Object.keys(responses).length} of {behaviouralQuestions.length} completed
            </span>
          </div>
          <Progress value={(Object.keys(responses).length / behaviouralQuestions.length) * 100} className="h-2" />
        </div>

        <div className="flex justify-end mt-6">
          <Button onClick={() => onComplete(responses)} disabled={!isComplete}>
            Continue to Job Preferences
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function JobPreferencesStep({ onComplete }: { onComplete: (data: any) => void }) {
  const [data, setData] = useState({
    jobTypes: [] as string[],
    workArrangement: [] as string[],
    locations: [] as string[],
    functions: [] as string[],
    industries: [] as string[],
    companySize: "",
    startTime: "",
    idealJob: "",
    whatAppeals: ""
  });

  const jobTypes = ["Permanent", "Temporary", "Internship", "Apprenticeship", "Full-time", "Part-time", "Contract / Freelance"];
  
  const locations = [
    "London", "Birmingham", "Manchester", "Leeds", "Liverpool", "Newcastle", "Sheffield", 
    "Southampton", "Nottingham", "Glasgow", "Cardiff", "Bristol", "Edinburgh", "Brighton",
    "Fully remote", "Open to relocate"
  ];

  const functions = [
    "Accounting & Finance", "Administration & Support", "Art & Design", "Business Dev & Strategy",
    "Consulting", "Data & Analytics", "Engineering", "Information Technology", "Marketing",
    "Media & Communication", "Operations", "Product Development", "Sales & Account Management",
    "Software Development", "No idea! Help!"
  ];

  const industries = [
    "Art & Design", "Automotive", "Charity & Community", "Consulting", "Data & Analytics",
    "eCommerce & Retail", "Education & Learning", "Fashion & Beauty", "Financial Services",
    "Gaming & Entertainment", "Marketing & Advertising", "Media & News", "Software & Technology",
    "No idea! Help!"
  ];

  const isComplete = data.jobTypes.length > 0 && data.locations.length > 0;

  const handleArrayUpdate = (field: keyof typeof data, value: string, checked: boolean) => {
    setData(prev => ({
      ...prev,
      [field]: checked 
        ? [...(prev[field] as string[]), value]
        : (prev[field] as string[]).filter(item => item !== value)
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-6 h-6" />
          Job Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-base font-medium">What type of work are you looking for? *</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
            {jobTypes.map(type => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={type}
                  checked={data.jobTypes.includes(type)}
                  onCheckedChange={(checked) => handleArrayUpdate('jobTypes', type, checked as boolean)}
                />
                <Label htmlFor={type} className="text-sm">{type}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-base font-medium">Where would you like to work? *</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2 max-h-48 overflow-y-auto">
            {locations.map(location => (
              <div key={location} className="flex items-center space-x-2">
                <Checkbox
                  id={location}
                  checked={data.locations.includes(location)}
                  onCheckedChange={(checked) => handleArrayUpdate('locations', location, checked as boolean)}
                />
                <Label htmlFor={location} className="text-sm">{location}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-base font-medium">What functions interest you?</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2 max-h-48 overflow-y-auto">
            {functions.map(func => (
              <div key={func} className="flex items-center space-x-2">
                <Checkbox
                  id={func}
                  checked={data.functions.includes(func)}
                  onCheckedChange={(checked) => handleArrayUpdate('functions', func, checked as boolean)}
                />
                <Label htmlFor={func} className="text-sm">{func}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-base font-medium">Which industries appeal to you?</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2 max-h-48 overflow-y-auto">
            {industries.map(industry => (
              <div key={industry} className="flex items-center space-x-2">
                <Checkbox
                  id={industry}
                  checked={data.industries.includes(industry)}
                  onCheckedChange={(checked) => handleArrayUpdate('industries', industry, checked as boolean)}
                />
                <Label htmlFor={industry} className="text-sm">{industry}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="idealJob">What's your idea of the perfect job?</Label>
          <Textarea
            id="idealJob"
            value={data.idealJob}
            onChange={(e) => setData(prev => ({ ...prev, idealJob: e.target.value }))}
            placeholder="Describe your ideal work environment, tasks, and culture..."
          />
        </div>

        <div className="flex justify-end">
          <Button onClick={() => onComplete(data)} disabled={!isComplete}>
            Continue to Background
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function BackgroundStep({ onComplete }: { onComplete: (data: any) => void }) {
  const [data, setData] = useState({
    education: "",
    subjects: "",
    institution: "",
    employmentStatus: "",
    jobSearchDuration: "",
    applicationRate: "",
    subjects_studied: [] as string[],
    creativeness: "",
    people_tasks: "",
    personality_type: ""
  });

  const subjects = [
    "English", "Maths", "Physics", "Geography", "History", "PE / Sports Science",
    "Business Studies", "Psychology", "Media Studies", "Modern Languages", "Biology",
    "IT / Computing", "Chemistry", "Law", "Design Tech", "Drama & Music", "Art",
    "Economics", "Marketing", "Engineering"
  ];

  const isComplete = data.education && data.employmentStatus;

  const handleSubjectsUpdate = (subject: string, checked: boolean) => {
    setData(prev => ({
      ...prev,
      subjects_studied: checked 
        ? [...prev.subjects_studied, subject]
        : prev.subjects_studied.filter(s => s !== subject)
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="w-6 h-6" />
          Background & Experience
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="education">What's the highest level of qualification you have received? *</Label>
          <Select value={data.education} onValueChange={(value) => setData(prev => ({ ...prev, education: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select education level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gcse">GCSE/O-Levels</SelectItem>
              <SelectItem value="a-levels">A-Levels</SelectItem>
              <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
              <SelectItem value="master">Master's Degree</SelectItem>
              <SelectItem value="phd">PhD/Doctorate</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="subjects">In what subject(s)?</Label>
            <Input
              id="subjects"
              value={data.subjects}
              onChange={(e) => setData(prev => ({ ...prev, subjects: e.target.value }))}
              placeholder="e.g., Computer Science, English Literature"
            />
          </div>
          <div>
            <Label htmlFor="institution">From which institution?</Label>
            <Input
              id="institution"
              value={data.institution}
              onChange={(e) => setData(prev => ({ ...prev, institution: e.target.value }))}
              placeholder="University/School name"
            />
          </div>
        </div>

        <div>
          <Label className="text-base font-medium">Which subjects did you enjoy or excel at?</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2 max-h-48 overflow-y-auto">
            {subjects.map(subject => (
              <div key={subject} className="flex items-center space-x-2">
                <Checkbox
                  id={subject}
                  checked={data.subjects_studied.includes(subject)}
                  onCheckedChange={(checked) => handleSubjectsUpdate(subject, checked as boolean)}
                />
                <Label htmlFor={subject} className="text-sm">{subject}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="employmentStatus">What is your current employment status? *</Label>
          <Select value={data.employmentStatus} onValueChange={(value) => setData(prev => ({ ...prev, employmentStatus: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select employment status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="unemployed">Unemployed and looking for work</SelectItem>
              <SelectItem value="employed-wrong-field">Employed but not in my desired career path</SelectItem>
              <SelectItem value="employed-right-field">Employed in my desired career path</SelectItem>
              <SelectItem value="part-time">Part-time work</SelectItem>
              <SelectItem value="internship">Currently in an internship</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="jobSearchDuration">How long have you been looking for a job?</Label>
            <Select value={data.jobSearchDuration} onValueChange={(value) => setData(prev => ({ ...prev, jobSearchDuration: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not-looking">Not currently looking</SelectItem>
                <SelectItem value="just-started">Just started</SelectItem>
                <SelectItem value="1-3-months">1-3 months</SelectItem>
                <SelectItem value="3-6-months">3-6 months</SelectItem>
                <SelectItem value="6-12-months">6-12 months</SelectItem>
                <SelectItem value="over-year">Over a year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="applicationRate">How many jobs do you apply to per week?</Label>
            <Select value={data.applicationRate} onValueChange={(value) => setData(prev => ({ ...prev, applicationRate: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0 jobs</SelectItem>
                <SelectItem value="1-3">1-3 jobs</SelectItem>
                <SelectItem value="4-7">4-7 jobs</SelectItem>
                <SelectItem value="8-15">8-15 jobs</SelectItem>
                <SelectItem value="15+">15+ jobs</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => onComplete(data)} disabled={!isComplete}>
            Continue to Demographics
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function DemographicsStep({ onComplete }: { onComplete: (data: any) => void }) {
  const [data, setData] = useState({
    genderIdentity: "",
    ethnicity: "",
    age: "",
    upbringing: "",
    disability: "",
    lowIncome: "",
    freeMeals: "",
    firstGenUni: "",
    immigrant: "",
    lgbtq: ""
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-6 h-6" />
          Background Information
        </CardTitle>
        <p className="text-gray-600">This information helps us understand diversity and create an inclusive platform</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="genderIdentity">Gender Identity</Label>
          <Select value={data.genderIdentity} onValueChange={(value) => setData(prev => ({ ...prev, genderIdentity: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender identity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="non-binary">Non-binary</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
              <SelectItem value="self-describe">Self describe</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="ethnicity">Ethnicity</Label>
          <Select value={data.ethnicity} onValueChange={(value) => setData(prev => ({ ...prev, ethnicity: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select ethnicity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="white">White</SelectItem>
              <SelectItem value="black">Black/African/Caribbean</SelectItem>
              <SelectItem value="asian">Asian</SelectItem>
              <SelectItem value="mixed">Mixed/Multiple ethnic groups</SelectItem>
              <SelectItem value="other">Other ethnic group</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="age">Age</Label>
          <Select value={data.age} onValueChange={(value) => setData(prev => ({ ...prev, age: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select age range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="under-18">Under 18</SelectItem>
              <SelectItem value="18-21">18-21</SelectItem>
              <SelectItem value="22-24">22-24</SelectItem>
              <SelectItem value="25-27">25-27</SelectItem>
              <SelectItem value="28-30">28-30</SelectItem>
              <SelectItem value="over-30">Over 30</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="upbringing">What was your upbringing like?</Label>
          <Select value={data.upbringing} onValueChange={(value) => setData(prev => ({ ...prev, upbringing: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select upbringing" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="city">I grew up in a city</SelectItem>
              <SelectItem value="town">I grew up in a town or suburb</SelectItem>
              <SelectItem value="rural">I grew up in a rural area</SelectItem>
              <SelectItem value="mixed">Mixed - moved around</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Do you identify as disabled or having a disability?</Label>
            <RadioGroup value={data.disability} onValueChange={(value) => setData(prev => ({ ...prev, disability: value }))}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="disability-yes" />
                <Label htmlFor="disability-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="disability-no" />
                <Label htmlFor="disability-no">No</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="prefer-not-to-say" id="disability-prefer" />
                <Label htmlFor="disability-prefer">Prefer not to say</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label>Would you consider yourself to be from a low income household?</Label>
            <RadioGroup value={data.lowIncome} onValueChange={(value) => setData(prev => ({ ...prev, lowIncome: value }))}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="income-yes" />
                <Label htmlFor="income-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="income-no" />
                <Label htmlFor="income-no">No</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="prefer-not-to-say" id="income-prefer" />
                <Label htmlFor="income-prefer">Prefer not to say</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label>Are you part of the LGBTQIA+ community?</Label>
            <RadioGroup value={data.lgbtq} onValueChange={(value) => setData(prev => ({ ...prev, lgbtq: value }))}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="lgbtq-yes" />
                <Label htmlFor="lgbtq-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="lgbtq-no" />
                <Label htmlFor="lgbtq-no">No</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="prefer-not-to-say" id="lgbtq-prefer" />
                <Label htmlFor="lgbtq-prefer">Prefer not to say</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => onComplete(data)}>
            Complete Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function OnboardingResults({ responses }: { responses: OnboardingData }) {
  const personalityProfile = calculatePersonalityProfile(responses.behavioural);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Profile Complete!</h1>
          <p className="text-lg text-gray-600">
            Here's your personalised work style analysis
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <PersonalityInsightCard profile={personalityProfile} />
          <WorkStyleRecommendations profile={personalityProfile} />
        </div>

        <CareerMatchingCard profile={personalityProfile} preferences={responses.preferences} />

        <div className="text-center mt-8">
          <Button size="lg" onClick={() => window.location.href = '/job-recommendations'}>
            <Target className="w-5 h-5 mr-2" />
            View Job Recommendations
          </Button>
        </div>
      </div>
    </div>
  );
}

function PersonalityInsightCard({ profile }: { profile: any }) {
  const colours = {
    red: "#EF4444",
    yellow: "#F59E0B", 
    green: "#10B981",
    blue: "#3B82F6"
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-6 h-6" />
          Your Personality Profile
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Primary Style: {profile.primaryStyle}
            </h3>
            <p className="text-gray-600">{profile.description}</p>
          </div>

          <div className="space-y-3">
            {Object.entries(profile.scores as { [key: string]: number }).map(([colour, percentage]) => (
              <div key={colour}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium capitalize">{colour}</span>
                  <span className="text-sm font-medium">{percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="h-3 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: colours[colour as keyof typeof colours]
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">What this means:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              {profile.insights?.map((insight: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <Star className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
                  {insight}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function WorkStyleRecommendations({ profile }: { profile: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-6 h-6" />
          Work Style Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Ideal Work Environment:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {profile.workEnvironment?.map((env: string, index: number) => (
                <li key={index} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  {env}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Communication Style:</h4>
            <p className="text-sm text-gray-600">{profile.communicationStyle}</p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Motivation Drivers:</h4>
            <div className="flex flex-wrap gap-2">
              {profile.motivators?.map((motivator: string, index: number) => (
                <Badge key={index} variant="secondary">{motivator}</Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Potential Challenges:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {profile.challenges?.map((challenge: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 mt-0.5 text-orange-500 flex-shrink-0" />
                  {challenge}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CareerMatchingCard({ profile, preferences }: { profile: any; preferences: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-6 h-6" />
          Career Fit Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Recommended Career Areas:</h4>
            <div className="space-y-2">
              {profile.careerAreas?.map((area: string, index: number) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-green-50 rounded">
                  <Award className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">{area}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">Your Preferences:</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div>
                <span className="font-medium">Preferred Functions:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {preferences?.functions?.slice(0, 3).map((func: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">{func}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <span className="font-medium">Preferred Industries:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {preferences?.industries?.slice(0, 3).map((industry: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">{industry}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <span className="font-medium">Location:</span>
                <span className="ml-2">{preferences?.locations?.[0] || "Not specified"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Next Steps:</h4>
          <div className="grid md:grid-cols-3 gap-4">
            <Button variant="outline" size="sm" className="h-auto p-3">
              <BarChart className="w-4 h-4 mb-1" />
              <div className="text-xs">
                <div className="font-medium">Skills Assessment</div>
                <div className="text-gray-600">Complete challenges</div>
              </div>
            </Button>
            <Button variant="outline" size="sm" className="h-auto p-3">
              <Users className="w-4 h-4 mb-1" />
              <div className="text-xs">
                <div className="font-medium">View Matches</div>
                <div className="text-gray-600">See compatible jobs</div>
              </div>
            </Button>
            <Button variant="outline" size="sm" className="h-auto p-3">
              <Clock className="w-4 h-4 mb-1" />
              <div className="text-xs">
                <div className="font-medium">Book Session</div>
                <div className="text-gray-600">Get career guidance</div>
              </div>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function calculatePersonalityProfile(behaviouralResponses: any) {
  // Color-based personality scoring system matching your original quiz
  const scores = { red: 0, yellow: 0, green: 0, blue: 0 };
  
  // Mapping responses to personality colours based on your original system
  const responseMapping: { [key: string]: { [key: string]: string } } = {
    rules: {
      "Respecting - they're there for a reason": "blue",
      "Avoiding unnecessary risks": "green", 
      "Breaking if they don't make sense": "red",
      "Guidance, but flexibility is key": "yellow"
    },
    conflict: {
      "I remove myself from the situation": "green",
      "I care deeply if I'm involved, it matters to me what people think": "yellow",
      "I try to mediate and find solutions": "blue",
      "I address it head-on directly": "red"
    },
    furniture: {
      "Is a fun activity to do as a team": "yellow",
      "Gives me a big sense of accomplishment after proper preparation": "blue",
      "Is frustrating without clear instructions": "green",
      "I prefer to hire someone else to do it": "red"
    }
    // Add more mappings based on your original quiz logic
  };

  // Calculate scores based on responses
  Object.entries(behaviouralResponses).forEach(([questionId, response]) => {
    if (responseMapping[questionId] && responseMapping[questionId][response as string]) {
      const colour = responseMapping[questionId][response as string];
      scores[colour as keyof typeof scores] += 1;
    }
  });

  // Convert to percentages
  const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
  const percentages = Object.fromEntries(
    Object.entries(scores).map(([colour, score]) => [
      colour, 
      total > 0 ? Math.round((score / total) * 100) : 25
    ])
  );

  // Determine primary style
  const primaryColor = Object.entries(percentages).reduce((a, b) => 
    percentages[a[0] as keyof typeof percentages] > percentages[b[0] as keyof typeof percentages] ? a : b
  )[0];

  const profiles = {
    red: {
      name: "Direct & Results-Driven",
      description: "You're goal-oriented, decisive, and thrive on achieving results quickly.",
      insights: [
        "You prefer fast-paced environments with clear objectives",
        "You're comfortable making quick decisions and taking charge",
        "You work best with autonomy and minimal micromanagement"
      ],
      workEnvironment: [
        "Goal-oriented teams",
        "Performance-based environments",
        "Leadership opportunities",
        "Competitive settings"
      ],
      communicationStyle: "Direct and to-the-point communication",
      motivators: ["Achievement", "Recognition", "Autonomy", "Competition"],
      challenges: [
        "May need to develop patience for detailed processes",
        "Could benefit from considering others' perspectives more",
        "Might rush through important details"
      ],
      careerAreas: ["Sales", "Business Development", "Management", "Entrepreneurship"]
    },
    yellow: {
      name: "Enthusiastic & People-Focused",
      description: "You're optimistic, social, and energized by working with others.",
      insights: [
        "You thrive in collaborative, social environments",
        "You're naturally good at motivating and inspiring others",
        "You prefer variety and flexibility in your work"
      ],
      workEnvironment: [
        "Collaborative teams",
        "Social interactions",
        "Creative freedom",
        "Positive, energetic culture"
      ],
      communicationStyle: "Enthusiastic and expressive communication",
      motivators: ["Social interaction", "Recognition", "Variety", "Fun"],
      challenges: [
        "May need to focus on follow-through and details",
        "Could benefit from better time management",
        "Might struggle with routine, repetitive tasks"
      ],
      careerAreas: ["Marketing", "PR", "Human Resources", "Event Management"]
    },
    green: {
      name: "Supportive & Steady",
      description: "You're patient, reliable, and prefer stable, harmonious environments.",
      insights: [
        "You value team harmony and cooperative relationships",
        "You're dependable and work steadily toward goals",
        "You prefer clear expectations and supportive leadership"
      ],
      workEnvironment: [
        "Stable, predictable settings",
        "Supportive team culture",
        "Clear processes and expectations",
        "Minimal conflict"
      ],
      communicationStyle: "Patient and considerate communication",
      motivators: ["Security", "Team harmony", "Helping others", "Stability"],
      challenges: [
        "May avoid necessary confrontations",
        "Could be more assertive about ideas and needs",
        "Might resist change even when beneficial"
      ],
      careerAreas: ["Customer Service", "Healthcare", "Education", "Administration"]
    },
    blue: {
      name: "Analytical & Detail-Oriented",
      description: "You're methodical, precise, and value accuracy and quality.",
      insights: [
        "You excel at analyzing complex information and data",
        "You prefer systematic approaches and detailed planning",
        "You value accuracy and high-quality work"
      ],
      workEnvironment: [
        "Quiet, focused settings",
        "Clear standards and procedures",
        "Time for thorough analysis",
        "Quality-focused culture"
      ],
      communicationStyle: "Thoughtful and precise communication",
      motivators: ["Accuracy", "Quality", "Learning", "Expertise"],
      challenges: [
        "May get caught up in details at expense of bigger picture",
        "Could benefit from faster decision-making",
        "Might be overly critical of work that doesn't meet high standards"
      ],
      careerAreas: ["Data Analysis", "Research", "Finance", "Quality Assurance"]
    }
  };

  return {
    scores: percentages,
    primaryStyle: profiles[primaryColor as keyof typeof profiles].name,
    description: profiles[primaryColor as keyof typeof profiles].description,
    ...profiles[primaryColor as keyof typeof profiles]
  };
}