import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  User, MapPin, Briefcase, Target, Heart, Brain,
  CheckCircle, ArrowRight, Clock, Trophy, Star
} from "lucide-react";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<any>;
  required: boolean;
}

export default function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [assessmentData, setAssessmentData] = useState({});

  const steps: OnboardingStep[] = [
    {
      id: "welcome",
      title: "Welcome to Pollen",
      description: "Let's get you set up for success",
      component: WelcomeStep,
      required: true
    },
    {
      id: "personality_insights",
      title: "Work Style Assessment",
      description: "Help us understand how you like to work and learn",
      component: EnhancedPersonalityInsightsStep,
      required: true
    },
    {
      id: "skills_verification",
      title: "Skills Verification",
      description: "Complete recommended challenges to showcase your abilities",
      component: SkillsVerificationStep,
      required: false
    },
    {
      id: "complete",
      title: "You're All Set!",
      description: "Access personalised job matches and company recommendations",
      component: CompletionStep,
      required: true
    }
  ];

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleStepComplete = (stepId: string, data: any) => {
    setCompletedSteps(prev => [...prev, stepId]);
    setAssessmentData(prev => ({ ...prev, [stepId]: data }));
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSkipStep = () => {
    if (!currentStepData.required && currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Getting Started</h1>
            </div>
            <Badge variant="outline">
              Step {currentStep + 1} of {steps.length}
            </Badge>
          </div>
          
          <Progress value={progress} className="h-2" />
          
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>{currentStepData.title}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
        </div>

        {/* Current Step Content */}
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">{currentStepData.title}</CardTitle>
            <p className="text-gray-600">{currentStepData.description}</p>
          </CardHeader>
          <CardContent>
            <currentStepData.component
              onComplete={(data: any) => handleStepComplete(currentStepData.id, data)}
              onSkip={handleSkipStep}
              canSkip={!currentStepData.required}
              assessmentData={assessmentData}
            />
          </CardContent>
        </Card>

        {/* Step Navigation */}
        <div className="flex justify-center mt-8">
          <div className="flex gap-2">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`w-3 h-3 rounded-full ${
                  completedSteps.includes(step.id)
                    ? "bg-green-500"
                    : index === currentStep
                    ? "bg-primary"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Step Components
function PersonalInfoStep({ onComplete }: { onComplete: (data: any) => void }) {
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    location: '',
    pronouns: '',
    ethnicBackground: '',
    workingRights: '',
    visaStatus: '',
    currentSituation: '',
    motivationToWork: ''
  });

  const handleSubmit = () => {
    onComplete({
      step: 'personal_info',
      data: formData
    });
  };

  const isComplete = Object.values(formData).every(value => value !== '');

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Personal Information
        </CardTitle>
        <CardDescription>
          This information helps us understand our candidate community and provide better job matching.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Age</label>
            <select 
              value={formData.age}
              onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select age range</option>
              <option value="16-18">16-18</option>
              <option value="19-21">19-21</option>
              <option value="22-24">22-24</option>
              <option value="25-27">25-27</option>
              <option value="28-30">28-30</option>
              <option value="30+">30+</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Gender</label>
            <select 
              value={formData.gender}
              onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select gender</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Non-binary">Non-binary</option>
              <option value="Prefer not to say">Prefer not to say</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Location (City, Country)</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            className="w-full p-2 border rounded-md"
            placeholder="e.g., London, UK"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Pronouns</label>
          <select 
            value={formData.pronouns}
            onChange={(e) => setFormData(prev => ({ ...prev, pronouns: e.target.value }))}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Select pronouns</option>
            <option value="She/Her">She/Her</option>
            <option value="He/Him">He/Him</option>
            <option value="They/Them">They/Them</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Ethnic Background</label>
          <select 
            value={formData.ethnicBackground}
            onChange={(e) => setFormData(prev => ({ ...prev, ethnicBackground: e.target.value }))}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Select background</option>
            <option value="White">White</option>
            <option value="Black/African/Caribbean">Black/African/Caribbean</option>
            <option value="Asian">Asian</option>
            <option value="Mixed/Multiple">Mixed/Multiple ethnic groups</option>
            <option value="Other">Other ethnic group</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Working Rights</label>
          <select 
            value={formData.workingRights}
            onChange={(e) => setFormData(prev => ({ ...prev, workingRights: e.target.value }))}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Select working rights</option>
            <option value="Citizen">Citizen</option>
            <option value="Permanent resident">Permanent resident</option>
            <option value="Work visa">Work visa</option>
            <option value="Student visa">Student visa</option>
            <option value="No current rights">No current working rights</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Current Situation</label>
          <select 
            value={formData.currentSituation}
            onChange={(e) => setFormData(prev => ({ ...prev, currentSituation: e.target.value }))}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Select current situation</option>
            <option value="Student">Full-time student</option>
            <option value="Graduate">Recent graduate</option>
            <option value="Job seeking">Actively job seeking</option>
            <option value="Career change">Looking for career change</option>
            <option value="Part-time work">Currently working part-time</option>
            <option value="Unemployed">Currently unemployed</option>
            <option value="Intern">Currently interning</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">What motivates you to find work right now?</label>
          <textarea
            value={formData.motivationToWork}
            onChange={(e) => setFormData(prev => ({ ...prev, motivationToWork: e.target.value }))}
            className="w-full p-2 border rounded-md h-20 resize-none"
            placeholder="Tell us what's driving your job search..."
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={handleSubmit} disabled={!isComplete}>
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function EducationExperienceStep({ onComplete }: { onComplete: (data: any) => void }) {
  const [formData, setFormData] = useState({
    educationLevel: '',
    fieldOfStudy: '',
    institution: '',
    graduationYear: '',
    hasWorkExperience: '',
    workExperience: '',
    skills: '',
    certifications: '',
    languagesSpoken: ''
  });

  const handleSubmit = () => {
    onComplete({
      step: 'education_experience',
      data: formData
    });
  };

  const isComplete = formData.educationLevel && formData.fieldOfStudy && formData.hasWorkExperience;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          Education & Experience
        </CardTitle>
        <CardDescription>
          Tell us about your educational background and any work experience you have.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Highest Education Level</label>
          <select 
            value={formData.educationLevel}
            onChange={(e) => setFormData(prev => ({ ...prev, educationLevel: e.target.value }))}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Select education level</option>
            <option value="High School">High School</option>
            <option value="College/A-Levels">College/A-Levels</option>
            <option value="Bachelor's Degree">Bachelor's Degree</option>
            <option value="Master's Degree">Master's Degree</option>
            <option value="PhD">PhD</option>
            <option value="Professional Qualification">Professional Qualification</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Field of Study</label>
          <input
            type="text"
            value={formData.fieldOfStudy}
            onChange={(e) => setFormData(prev => ({ ...prev, fieldOfStudy: e.target.value }))}
            className="w-full p-2 border rounded-md"
            placeholder="e.g., Business, Marketing, Computer Science"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Institution</label>
            <input
              type="text"
              value={formData.institution}
              onChange={(e) => setFormData(prev => ({ ...prev, institution: e.target.value }))}
              className="w-full p-2 border rounded-md"
              placeholder="University/School name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Graduation Year</label>
            <select 
              value={formData.graduationYear}
              onChange={(e) => setFormData(prev => ({ ...prev, graduationYear: e.target.value }))}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select year</option>
              {Array.from({ length: 10 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return <option key={year} value={year}>{year}</option>;
              })}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Do you have any work experience?</label>
          <select 
            value={formData.hasWorkExperience}
            onChange={(e) => setFormData(prev => ({ ...prev, hasWorkExperience: e.target.value }))}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Select option</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
            <option value="Internships only">Internships only</option>
            <option value="Volunteer work">Volunteer work only</option>
          </select>
        </div>

        {formData.hasWorkExperience === 'Yes' && (
          <div>
            <label className="block text-sm font-medium mb-1">Describe your work experience</label>
            <textarea
              value={formData.workExperience}
              onChange={(e) => setFormData(prev => ({ ...prev, workExperience: e.target.value }))}
              className="w-full p-2 border rounded-md h-24 resize-none"
              placeholder="Tell us about your roles, responsibilities, and achievements..."
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Skills & Competencies</label>
          <textarea
            value={formData.skills}
            onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
            className="w-full p-2 border rounded-md h-20 resize-none"
            placeholder="List your key skills (technical, soft skills, software, etc.)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Languages Spoken</label>
          <input
            type="text"
            value={formData.languagesSpoken}
            onChange={(e) => setFormData(prev => ({ ...prev, languagesSpoken: e.target.value }))}
            className="w-full p-2 border rounded-md"
            placeholder="e.g., English (native), Spanish (conversational)"
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={handleSubmit} disabled={!isComplete}>
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ComprehensiveAssessmentStep({ onComplete }: { onComplete: (data: any) => void }) {
  const [currentSection, setCurrentSection] = useState(0);
  const [responses, setResponses] = useState<{ [key: string]: any }>({});
  
  const sections = [
    {
      id: 'behavioural',
      title: 'Behavioral Assessment',
      description: 'How you prefer to work and interact with others',
      questions: [
        {
          id: "rules",
          question: "Rules are for...",
          options: [
            "Respecting - they're there for a reason",
            "Avoiding unnecessary risks", 
            "Breaking if they don't make sense",
            "Guidance, but flexibility is key"
          ],
          trait: "conscientiousness"
        },
        {
          id: "conflict",
          question: "When it comes to conflict...",
          options: [
            "I remove myself from the situation",
            "I care deeply if I'm involved, it matters to me what people think",
            "I try to mediate and find solutions",
            "I address it head-on directly"
          ],
          trait: "agreeableness"
        },
        // Add more behavioural questions here
      ]
    },
    {
      id: 'cognitive',
      title: 'Cognitive Assessment',
      description: 'Problem-solving and analytical thinking',
      questions: [
        {
          id: 'pattern_recognition',
          question: 'Look at this sequence: 2, 4, 8, 16, ?. What comes next?',
          type: 'multiple_choice',
          options: ['24', '32', '20', '28'],
          correct: '32'
        },
        {
          id: 'logical_reasoning',
          question: 'If all roses are flowers, and some flowers are red, then:',
          type: 'multiple_choice',
          options: [
            'All roses are red',
            'Some roses might be red',
            'No roses are red',
            'All flowers are roses'
          ],
          correct: 'Some roses might be red'
        }
      ]
    },
    {
      id: 'situational',
      title: 'Situational Judgment',
      description: 'How you handle workplace scenarios',
      questions: [
        {
          id: 'deadline_pressure',
          question: 'You have multiple urgent deadlines approaching and your manager asks you to take on an additional task. What do you do?',
          type: 'multiple_choice',
          options: [
            'Accept the task immediately to show commitment',
            'Explain your current workload and negotiate priorities',
            'Decline politely and suggest someone else',
            'Accept but work late to complete everything'
          ]
        },
        {
          id: 'team_conflict',
          question: 'Two team members disagree on an approach and ask for your opinion. You think both have valid points. How do you respond?',
          type: 'multiple_choice',
          options: [
            'Support the more senior team member',
            'Suggest combining elements from both approaches',
            'Remain neutral and let them decide',
            'Escalate to your manager for guidance'
          ]
        }
      ]
    }
  ];

  const currentSectionData = sections[currentSection];
  const totalQuestions = sections.reduce((sum, section) => sum + section.questions.length, 0);
  const answeredQuestions = Object.keys(responses).length;

  const handleAnswer = (questionId: string, answer: any) => {
    setResponses(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(prev => prev + 1);
    } else {
      // Complete assessment
      const profile = calculateComprehensiveProfile(responses);
      onComplete({
        step: 'comprehensive_assessment',
        responses,
        profile,
        sections: sections.map(s => s.id)
      });
    }
  };

  const canProceed = currentSectionData.questions.every(q => responses[q.id] !== undefined);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          {currentSectionData.title}
        </CardTitle>
        <CardDescription>
          {currentSectionData.description}
        </CardDescription>
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Section {currentSection + 1} of {sections.length}</span>
            <span>{answeredQuestions} of {totalQuestions} questions completed</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${(answeredQuestions / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-6">
          {currentSectionData.questions.map((question, index) => (
            <Card key={question.id} className="p-4">
              <h4 className="font-medium mb-3">{index + 1}. {question.question}</h4>
              <div className="space-y-2">
                {question.options.map((option, optionIndex) => (
                  <Button
                    key={optionIndex}
                    variant={responses[question.id] === option ? "default" : "outline"}
                    className="w-full justify-start text-sm"
                    onClick={() => handleAnswer(question.id, option)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </Card>
          ))}
        </div>

        <div className="flex justify-between pt-4">
          <Button 
            variant="outline" 
            onClick={() => currentSection > 0 && setCurrentSection(prev => prev - 1)}
            disabled={currentSection === 0}
          >
            Previous Section
          </Button>
          <Button onClick={handleNextSection} disabled={!canProceed}>
            {currentSection === sections.length - 1 ? 'Complete Assessment' : 'Next Section'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function WelcomeStep({ onComplete }: { onComplete: (data: any) => void }) {
  return (
    <div className="text-center space-y-6">
      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
        <Heart className="w-12 h-12 text-primary" />
      </div>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Welcome to Your Career Journey!</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          We're here to help you discover amazing career opportunities that match your 
          unique skills, interests, and personality. This process takes about 10-15 minutes.
        </p>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center p-4">
            <Brain className="w-8 h-8 text-primary mx-auto mb-2" />
            <h4 className="font-medium">Personality Insights</h4>
            <p className="text-sm text-gray-600">Understand your work style</p>
          </div>
          <div className="text-center p-4">
            <Target className="w-8 h-8 text-primary mx-auto mb-2" />
            <h4 className="font-medium">Skills Verification</h4>
            <p className="text-sm text-gray-600">Showcase your abilities</p>
          </div>
          <div className="text-center p-4">
            <Briefcase className="w-8 h-8 text-primary mx-auto mb-2" />
            <h4 className="font-medium">Job Matching</h4>
            <p className="text-sm text-gray-600">Find perfect opportunities</p>
          </div>
        </div>
      </div>
      
      <Button onClick={() => onComplete({})} className="w-full max-w-sm">
        Let's Get Started
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
}

function CareerPreferencesStep({ onComplete }: { onComplete: (data: any) => void }) {
  const [preferences, setPreferences] = useState({
    industries: [] as string[],
    roles: [] as string[],
    workStyle: "",
    location: "",
    experience: "",
    salary: ""
  });

  const industries = [
    "Technology", "Healthcare", "Finance", "Education", "Marketing",
    "Design", "Sales", "Operations", "Customer Service", "Media"
  ];

  const roles = [
    "Software Development", "Data Analysis", "Digital Marketing", "Customer Success",
    "Business Development", "Product Management", "HR", "Content Creation",
    "Operations", "Administration"
  ];

  const workStyles = [
    "Remote", "Hybrid", "In-office", "Flexible"
  ];

  const handleSubmit = () => {
    onComplete(preferences);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3">Which industries interest you?</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {industries.map(industry => (
            <Button
              key={industry}
              variant={preferences.industries.includes(industry) ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setPreferences(prev => ({
                  ...prev,
                  industries: prev.industries.includes(industry)
                    ? prev.industries.filter(i => i !== industry)
                    : [...prev.industries, industry]
                }));
              }}
            >
              {industry}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">What roles are you interested in?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {roles.map(role => (
            <Button
              key={role}
              variant={preferences.roles.includes(role) ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setPreferences(prev => ({
                  ...prev,
                  roles: prev.roles.includes(role)
                    ? prev.roles.filter(r => r !== role)
                    : [...prev.roles, role]
                }));
              }}
            >
              {role}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">What's your preferred work style?</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {workStyles.map(style => (
            <Button
              key={style}
              variant={preferences.workStyle === style ? "default" : "outline"}
              onClick={() => setPreferences(prev => ({ ...prev, workStyle: style }))}
            >
              {style}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={handleSubmit}
          disabled={preferences.industries.length === 0 || preferences.roles.length === 0}
        >
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

function EnhancedPersonalityInsightsStep({ onComplete }: { onComplete: (data: any) => void }) {
  const [responses, setResponses] = useState<{ [key: string]: string }>({});
  
  // Enhanced behavioural questions from your original quiz + Big Five elements
  const questions = [
    {
      id: "rules",
      question: "Rules are for...",
      options: [
        "Respecting - they're there for a reason",
        "Avoiding unnecessary risks", 
        "Breaking if they don't make sense",
        "Guidance, but flexibility is key"
      ],
      trait: "conscientiousness"
    },
    {
      id: "conflict", 
      question: "When it comes to conflict...",
      options: [
        "I remove myself from the situation",
        "I care deeply if I'm involved, it matters to me what people think",
        "I try to mediate and find solutions",
        "I address it head-on directly"
      ],
      trait: "agreeableness"
    },
    {
      id: "furniture",
      question: "Flat pack furniture...",
      options: [
        "Is a fun activity to do as a team",
        "Gives me a big sense of accomplishment after proper preparation",
        "Is frustrating without clear instructions", 
        "I prefer to hire someone else to do it"
      ],
      trait: "conscientiousness"
    },
    {
      id: "todo_list",
      question: "My to-do list is...",
      options: [
        "Extensively organised into categories",
        "Pretty concise, I don't have many urgent things to do",
        "Not overly important, flexibility is everything",
        "Constantly changing based on priorities"
      ],
      trait: "conscientiousness"
    },
    {
      id: "games",
      question: "When playing a game I...",
      options: [
        "Play to win",
        "Will analyse every move and strive to do my best", 
        "Focus on having fun with others",
        "Try new strategies to see what works"
      ],
      trait: "extraversion"
    },
    {
      id: "tasks",
      question: "When carrying out a task I...",
      options: [
        "Approach it systematically, ensuring all details are covered",
        "Invest time in deciding how to tackle it, seeking guidance from others where I can",
        "Jump in and adapt as I go",
        "Break it down into manageable chunks"
      ],
      trait: "conscientiousness"
    },
    {
      id: "social_life",
      question: "My social life is...",
      options: [
        "Super busy, I'm always hanging out with different people",
        "All about close-knit bonds and shared memories",
        "A good balance of social time and alone time", 
        "Centered around shared interests and activities"
      ],
      trait: "extraversion"
    },
    {
      id: "decisions",
      question: "I make decisions...",
      options: [
        "As a team, once I've consulted everyone's opinions",
        "With careful thought and analysis, every choice matters",
        "Quickly based on my instincts",
        "After researching all available options"
      ],
      trait: "openness"
    },
    {
      id: "plans",
      question: "When making plans I...",
      options: [
        "Involve everyone, plans are stronger together",
        "Keep it open-ended, who knows where the adventure leads?",
        "Plan thoroughly with backup options",
        "Set clear goals and timelines"
      ],
      trait: "conscientiousness"
    },
    {
      id: "homework",
      question: "At school, I would complete homework...",
      options: [
        "To the best of my ability, having thoroughly checked it through",
        "As quickly as possible so I could do better things",
        "With friends to make it more enjoyable",
        "When I understood the material completely"
      ],
      trait: "conscientiousness"
    },
    {
      id: "problem_solving",
      question: "If I have a tough problem to solve...",
      options: [
        "I seek input and opinions to find the best solution",
        "I break it down systematically and work through it",
        "I try different approaches until something works",
        "I research similar problems and their solutions"
      ],
      trait: "openness"
    },
    {
      id: "fearful_of",
      question: "I'm most fearful of...",
      options: [
        "Feeling disconnected from others or being misunderstood",
        "Making mistakes or failing at important tasks",
        "Missing out on opportunities or experiences",
        "Being in situations I can't control"
      ],
      trait: "neuroticism"
    },
    {
      id: "phone_calls",
      question: "When someone calls me up I...",
      options: [
        "Answer enthusiastically, conversations energise me",
        "Answer warmly, eager to connect",
        "Sometimes let it go to voicemail if I'm busy",
        "Prefer they text first so I know what it's about"
      ],
      trait: "extraversion"
    },
    {
      id: "good_job",
      question: "If I've done a good job I...",
      options: [
        "Feel accomplished and validated",
        "Hope others notice and acknowledge it",
        "Am already thinking about the next challenge",
        "Take a moment to appreciate the achievement"
      ],
      trait: "neuroticism"
    },
    {
      id: "worst_party",
      question: "At the worst party ever I...",
      options: [
        "Try to amplify the fun factor with music and games",
        "Wonder who's responsible for organising it",
        "Make the best of it and try to enjoy myself",
        "Leave early or find a few people to talk with"
      ],
      trait: "extraversion"
    },
    {
      id: "work_best",
      question: "I work best...",
      options: [
        "In dynamic settings with human interactions",
        "In a supportive and cooperative environment",
        "Under pressure, striving for results",
        "In quiet, focused environments"
      ],
      trait: "extraversion"
    },
    {
      id: "fun_idea",
      question: "My idea of fun is something...",
      options: [
        "Full of social interactions and new experiences",
        "Shared with close friends, creating memorable moments",
        "Challenging that pushes my limits",
        "Creative or intellectually stimulating"
      ],
      trait: "openness"
    },
    {
      id: "meeting_people",
      question: "When meeting new people I...",
      options: [
        "Like to make a good impression",
        "Show sincere interest in what they have to say",
        "Am naturally curious about their background",
        "Take time to observe before engaging"
      ],
      trait: "extraversion"
    },
    {
      id: "new_ideas",
      question: "When someone runs an idea by me I...",
      options: [
        "Get excited about new possibilities and brainstorm further",
        "Evaluate its feasibility and potential impact",
        "Consider how it might affect everyone involved",
        "Ask questions to understand it better"
      ],
      trait: "openness"
    },
    {
      id: "problems_shared",
      question: "When someone runs a problem by me I...",
      options: [
        "Like to set realistic expectations - the problem might not be easy to solve",
        "Will do what I can to help them, even if I've got no idea how",
        "Offer practical solutions based on my experience",
        "Listen carefully and ask clarifying questions"
      ],
      trait: "agreeableness"
    },
    {
      id: "same_thing_daily",
      question: "The thought of doing the same thing every day makes me feel...",
      options: [
        "Bored - I like variety",
        "Reassured - I like to feel a sense of orderly structure",
        "Neutral - it depends on what the thing is",
        "Motivated to find ways to improve or optimise it"
      ],
      trait: "openness"
    },
    {
      id: "stressful_situation",
      question: "If faced with a stressful situation I...",
      options: [
        "Seek out friends and focus my energy on having a good time",
        "Seek emotional support from friends or loved ones",
        "Take charge and try to solve the problem directly",
        "Take time alone to think through the situation"
      ],
      trait: "neuroticism"
    }
  ];

  const handleSubmit = () => {
    // Calculate personality profile based on responses
    const profile = calculatePersonalityProfile(responses);
    onComplete({
      assessmentType: 'enhanced_personality',
      responses,
      profile
    });
  };

  const isComplete = questions.every(q => responses[q.id]);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Brain className="w-12 h-12 text-primary mx-auto mb-2" />
        <h3 className="text-lg font-semibold">Work Style Assessment</h3>
        <p className="text-gray-600">This enhanced assessment combines your original behavioural questions with Big Five personality insights. Takes about 10-15 minutes and provides detailed career profiling.</p>
      </div>

      <div className="max-h-96 overflow-y-auto space-y-4 pr-2">
        {questions.map((question, index) => (
          <Card key={question.id} className="p-4">
            <h4 className="font-medium mb-3">{index + 1}. {question.question}</h4>
            <div className="space-y-2">
              {question.options.map((option, optionIndex) => (
                <Button
                  key={optionIndex}
                  variant={responses[question.id] === option ? "default" : "outline"}
                  className="w-full justify-start text-sm"
                  onClick={() => setResponses(prev => ({ ...prev, [question.id]: option }))}
                >
                  {option}
                </Button>
              ))}
            </div>
          </Card>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Assessment Progress</span>
          <span className="text-sm text-gray-600">{Object.keys(responses).length} of {questions.length} completed</span>
        </div>
        <Progress value={(Object.keys(responses).length / questions.length) * 100} className="h-2" />
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={!isComplete}>
          Complete Assessment
          <CheckCircle className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

function SkillsVerificationStep({ onComplete, onSkip, canSkip }: { 
  onComplete: (data: any) => void;
  onSkip: () => void;
  canSkip: boolean;
}) {
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([]);

  const recommendedChallenges = [
    {
      id: "digital_marketing",
      title: "Digital Marketing Fundamentals",
      description: "Test your knowledge of SEO, social media, and campaign management",
      duration: "15 minutes",
      difficulty: "Beginner",
      skills: ["SEO", "Social Media", "Analytics"],
      category: "Marketing"
    },
    {
      id: "data_analysis",
      title: "Data Analysis Challenge",
      description: "Analyze a dataset and create meaningful insights using Excel",
      duration: "20 minutes", 
      difficulty: "Beginner",
      skills: ["Excel", "Data Visualization", "Analysis"],
      category: "Analytics"
    },
    {
      id: "customer_service",
      title: "Customer Service Scenarios",
      description: "Handle challenging customer situations professionally",
      duration: "10 minutes",
      difficulty: "Beginner",
      skills: ["Communication", "Problem Solving", "Empathy"],
      category: "Customer Service"
    },
    {
      id: "project_coordination",
      title: "Project Coordination Basics",
      description: "Plan a simple project timeline and identify potential challenges",
      duration: "12 minutes",
      difficulty: "Beginner", 
      skills: ["Planning", "Organization", "Time Management"],
      category: "Operations"
    },
    {
      id: "content_creation",
      title: "Content Writing Challenge",
      description: "Write engaging content for different audiences and platforms",
      duration: "18 minutes",
      difficulty: "Beginner",
      skills: ["Writing", "Creativity", "Communication"],
      category: "Content"
    },
    {
      id: "basic_coding",
      title: "Logic and Problem Solving",
      description: "Solve logical puzzles and basic programming concepts",
      duration: "25 minutes",
      difficulty: "Beginner",
      skills: ["Logic", "Problem Solving", "Attention to Detail"],
      category: "Technology"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Trophy className="w-12 h-12 text-primary mx-auto mb-2" />
        <h3 className="text-lg font-semibold">Showcase Your Skills</h3>
        <p className="text-gray-600">Complete challenges to verify your abilities and stand out to employers</p>
      </div>

      <div className="grid gap-4">
        {recommendedChallenges.map(challenge => (
          <Card key={challenge.id} className="p-4 cursor-pointer hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold">{challenge.title}</h4>
                <p className="text-gray-600 text-sm mb-2">{challenge.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {challenge.duration}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {challenge.difficulty}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  <Badge variant="outline" className="text-xs mb-1">
                    {challenge.category}
                  </Badge>
                  {challenge.skills.map(skill => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button
                variant={selectedChallenges.includes(challenge.id) ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setSelectedChallenges(prev => 
                    prev.includes(challenge.id) 
                      ? prev.filter(id => id !== challenge.id)
                      : [...prev, challenge.id]
                  );
                }}
              >
                {selectedChallenges.includes(challenge.id) ? "Selected" : "Select"}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-between">
        {canSkip && (
          <Button variant="ghost" onClick={onSkip}>
            Skip for Now
          </Button>
        )}
        <Button onClick={() => onComplete({ selectedChallenges })}>
          {selectedChallenges.length > 0 ? "Start Challenges" : "Continue"}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

function CompletionStep({ assessmentData }: { assessmentData: any }) {
  return (
    <div className="text-center space-y-6">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-12 h-12 text-green-600" />
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-2">You're All Set!</h3>
        <p className="text-gray-600">
          Based on your responses, we've created your personalised career profile.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 max-w-md mx-auto">
        <Card className="p-4 text-center">
          <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <h4 className="font-medium">Job Matches</h4>
          <p className="text-sm text-gray-600">Personalized opportunities</p>
        </Card>
        <Card className="p-4 text-center">
          <Briefcase className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <h4 className="font-medium">Company Profiles</h4>
          <p className="text-sm text-gray-600">Discover great employers</p>
        </Card>
      </div>

      <Button 
        onClick={() => window.location.href = "/job-recommendations"}
        className="w-full max-w-sm"
      >
        Explore Opportunities
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
}

function calculatePersonalityProfile(responses: { [key: string]: string }) {
  // Big Five + Color-based personality scoring
  const bigFive = {
    openness: 0,
    conscientiousness: 0,
    extraversion: 0,
    agreeableness: 0,
    neuroticism: 0
  };

  const colourScores = { red: 0, yellow: 0, green: 0, blue: 0 };
  
  // Response mappings for Big Five traits and colour system
  const responseMapping: { [key: string]: { [key: string]: { trait: string; score: number; colour: string } } } = {
    rules: {
      "Respecting - they're there for a reason": { trait: "conscientiousness", score: 5, colour: "blue" },
      "Avoiding unnecessary risks": { trait: "conscientiousness", score: 4, colour: "green" },
      "Breaking if they don't make sense": { trait: "openness", score: 5, colour: "red" },
      "Guidance, but flexibility is key": { trait: "openness", score: 4, colour: "yellow" }
    },
    conflict: {
      "I remove myself from the situation": { trait: "neuroticism", score: 4, colour: "green" },
      "I care deeply if I'm involved, it matters to me what people think": { trait: "agreeableness", score: 5, colour: "yellow" },
      "I try to mediate and find solutions": { trait: "agreeableness", score: 5, colour: "blue" },
      "I address it head-on directly": { trait: "extraversion", score: 5, colour: "red" }
    },
    social_life: {
      "Super busy, I'm always hanging out with different people": { trait: "extraversion", score: 5, colour: "yellow" },
      "All about close-knit bonds and shared memories": { trait: "agreeableness", score: 5, colour: "green" },
      "A good balance of social time and alone time": { trait: "extraversion", score: 3, colour: "blue" },
      "Centered around shared interests and activities": { trait: "openness", score: 4, colour: "blue" }
    },
    stressful_situation: {
      "Seek out friends and focus my energy on having a good time": { trait: "extraversion", score: 5, colour: "yellow" },
      "Seek emotional support from friends or loved ones": { trait: "agreeableness", score: 5, colour: "green" },
      "Take charge and try to solve the problem directly": { trait: "extraversion", score: 5, colour: "red" },
      "Take time alone to think through the situation": { trait: "conscientiousness", score: 4, colour: "blue" }
    }
    // Add more mappings for all questions...
  };

  // Calculate scores
  Object.entries(responses).forEach(([questionId, response]) => {
    if (responseMapping[questionId] && responseMapping[questionId][response]) {
      const mapping = responseMapping[questionId][response];
      bigFive[mapping.trait as keyof typeof bigFive] += mapping.score;
      colourScores[mapping.colour as keyof typeof colourScores] += 1;
    }
  });

  // Normalize scores to percentages
  const totalQuestions = Object.keys(responses).length;
  const normalizedBigFive = Object.fromEntries(
    Object.entries(bigFive).map(([trait, score]) => [
      trait, Math.round((score / (totalQuestions * 5)) * 100)
    ])
  );

  const totalColorResponses = Object.values(colourScores).reduce((sum, score) => sum + score, 0);
  const colourPercentages = Object.fromEntries(
    Object.entries(colourScores).map(([colour, score]) => [
      colour, totalColorResponses > 0 ? Math.round((score / totalColorResponses) * 100) : 25
    ])
  );

  // Determine primary traits
  const primaryBigFive = Object.entries(normalizedBigFive).reduce((a, b) => 
    normalizedBigFive[a[0] as keyof typeof normalizedBigFive] > normalizedBigFive[b[0] as keyof typeof normalizedBigFive] ? a : b
  )[0];

  const primaryColor = Object.entries(colourPercentages).reduce((a, b) => 
    colourPercentages[a[0] as keyof typeof colourPercentages] > colourPercentages[b[0] as keyof typeof colourPercentages] ? a : b
  )[0];

  return {
    bigFive: normalizedBigFive,
    colourScores: colourPercentages,
    primaryBigFive,
    primaryColor,
    workStyle: getBigFiveWorkStyle(primaryBigFive, normalizedBigFive),
    careerFit: getBigFiveCareerFit(normalizedBigFive),
    personalityInsights: getBigFiveInsights(normalizedBigFive, primaryBigFive),
    colourInsights: getColorInsights(primaryColor, colourPercentages)
  };
}

function getWorkStyleRecommendation(primaryTrait: string, traits: any) {
  const styles = {
    analytical: "Detail-oriented and data-driven",
    collaborative: "Team-focused and communicative", 
    creative: "Innovative and adaptable",
    organised: "Structured and systematic",
    adaptable: "Flexible and responsive to change",
    leadership: "Natural leader and decision-maker"
  };
  return styles[primaryTrait as keyof typeof styles] || "Balanced approach";
}

function getCareerFitRecommendations(primaryTrait: string, traits: any) {
  const fits = {
    analytical: ["Data Analysis", "Research", "Quality Assurance", "Business Analysis"],
    collaborative: ["Customer Success", "HR", "Project Management", "Sales"],
    creative: ["Marketing", "Design", "Content Creation", "Product Development"],
    organised: ["Operations", "Administration", "Finance", "Project Coordination"],
    adaptable: ["Consulting", "Customer Service", "Account Management", "Support"],
    leadership: ["Team Leadership", "Management", "Business Development", "Training"]
  };
  return fits[primaryTrait as keyof typeof traits] || [];
}

function getBigFiveWorkStyle(primaryTrait: string, scores: any) {
  const styles = {
    openness: "Creative and intellectually curious",
    conscientiousness: "Organized and detail-oriented",
    extraversion: "Social and energetic",
    agreeableness: "Collaborative and supportive",
    neuroticism: "Sensitive and emotionally aware"
  };
  return styles[primaryTrait as keyof typeof styles] || "Balanced approach";
}

function getBigFiveCareerFit(scores: any) {
  const careerMap = {
    openness: ["Creative Industries", "Research & Development", "Innovation Roles", "Design"],
    conscientiousness: ["Project Management", "Finance", "Operations", "Quality Assurance"],
    extraversion: ["Sales", "Marketing", "HR", "Customer Relations"],
    agreeableness: ["Healthcare", "Education", "Social Work", "Team Leadership"],
    neuroticism: ["Counseling", "Psychology", "Crisis Management", "Support Roles"]
  };
  
  // Return careers for top 2 traits
  const topTraits = Object.entries(scores)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 2)
    .map(([trait]) => trait);
    
  return topTraits.flatMap(trait => careerMap[trait as keyof typeof careerMap] || []);
}

function getBigFiveInsights(scores: any, primaryTrait: string) {
  const insights = {
    openness: [
      "You enjoy exploring new ideas and experiences",
      "You're naturally curious and creative",
      "You appreciate variety and intellectual challenges"
    ],
    conscientiousness: [
      "You're reliable and well-organised",
      "You prefer structure and clear expectations", 
      "You're detail-oriented and thorough in your work"
    ],
    extraversion: [
      "You gain energy from social interactions",
      "You're comfortable speaking up and taking initiative",
      "You work well in team environments"
    ],
    agreeableness: [
      "You're naturally cooperative and helpful",
      "You value harmony and positive relationships",
      "You're empathetic and considerate of others"
    ],
    neuroticism: [
      "You're emotionally sensitive and self-aware",
      "You may benefit from stress management techniques",
      "You're thoughtful about potential challenges"
    ]
  };
  
  return insights[primaryTrait as keyof typeof insights] || [];
}

function getColorInsights(primaryColor: string, scores: any) {
  const colourProfiles = {
    red: {
      name: "Direct & Results-Driven",
      description: "You're goal-oriented, decisive, and thrive on achieving results quickly.",
      workEnvironment: ["Fast-paced settings", "Leadership roles", "Competitive environments"],
      motivators: ["Achievement", "Recognition", "Autonomy"]
    },
    yellow: {
      name: "Enthusiastic & People-Focused", 
      description: "You're optimistic, social, and energized by working with others.",
      workEnvironment: ["Collaborative teams", "Social interactions", "Creative freedom"],
      motivators: ["Social connection", "Variety", "Recognition"]
    },
    green: {
      name: "Supportive & Steady",
      description: "You're patient, reliable, and prefer stable, harmonious environments.",
      workEnvironment: ["Stable settings", "Supportive culture", "Clear processes"],
      motivators: ["Security", "Team harmony", "Helping others"]
    },
    blue: {
      name: "Analytical & Detail-Oriented",
      description: "You're methodical, precise, and value accuracy and quality.",
      workEnvironment: ["Focused settings", "Clear standards", "Quality-focused culture"],
      motivators: ["Accuracy", "Expertise", "Learning"]
    }
  };
  
  return colourProfiles[primaryColor as keyof typeof colourProfiles] || colourProfiles.blue;
}