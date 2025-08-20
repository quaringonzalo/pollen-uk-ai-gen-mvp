import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CheckCircle, ArrowRight, Clock, Trophy, Star,
  GraduationCap, Globe, Users, Brain, Lightbulb,
  ArrowLeft, User, Heart, Target, Plus
} from "lucide-react";
import { DiscRadarChart } from "@/components/disc-radar-chart";
import { SkillsRadarChart } from "@/components/skills-radar-chart";
import { BehaviouralRadarChart } from "@/components/behavioral-radar-chart";

// Multiple choice options for career preferences
const JOB_APPLICATION_FREQUENCY = [
  "1-2 jobs per week",
  "3-5 jobs per week", 
  "6-10 jobs per week",
  "10+ jobs per week",
  "I don't apply regularly",
  "This would be my first job application"
];

const IMPORTANT_JOB_FACTORS = [
  "Salary and benefits",
  "Learning and development opportunities",
  "Company culture and values",
  "Work-life balance",
  "Career progression opportunities",
  "Flexible working arrangements",
  "Job security",
  "Meaningful work/making a difference",
  "Location/commute",
  "Team and colleagues",
  "Company size and structure",
  "Industry and sector"
];

const POLLEN_SIGNUP_REASONS = [
  "Skills-based approach to hiring",
  "Support for entry-level candidates", 
  "Community and networking opportunities",
  "Guaranteed feedback on applications",
  "Access to mentoring and career development",
  "Transparent and fair hiring process",
  "Opportunity to showcase abilities through challenges",
  "Recommended by a friend or colleague",
  "Alternative to traditional job boards",
  "Company partnerships and exclusive opportunities"
];

const JOB_SEARCH_FRUSTRATIONS = [
  "Lack of feedback from employers",
  "Job requirements asking for too much experience",
  "Unclear job descriptions", 
  "Long and complex application processes",
  "No response after applying",
  "Difficulty standing out from other candidates",
  "Limited entry-level opportunities",
  "Bias in traditional recruitment",
  "Unpaid work tests and assignments",
  "Salary information not disclosed"
];

const HOW_HEARD_OPTIONS = [
  "Google search",
  "LinkedIn",
  "Indeed",
  "Facebook",
  "Instagram",
  "TikTok",
  "Friend/Family/Colleague",
  "Event/Webinar",
  "Podcast/Radio",
  "Newspaper/Feature",
  "Other"
];

const EMPLOYMENT_STATUS_OPTIONS = [
  "Unemployed and actively looking for work",
  "Student (school, college, or university)",
  "Recent leaver (finished education in last 2 years)",
  "Currently working but looking for something better",
  "Currently working but want a career change", 
  "Working in temporary or contract roles",
  "Working part-time but want full-time work",
  "Working in retail, hospitality, or service roles",
  "Working but feel underutilised in current role",
  "On a career break or gap year",
  "Between opportunities",
  "Other"
];

const EMPLOYMENT_TYPE_OPTIONS = [
  "Full-time permanent employment",
  "Part-time employment",
  "Apprenticeship or traineeship",
  "Graduate scheme or structured programmeme",
  "Internship or work placement",
  "Contract or temporary work",
  "Freelance or self-employment",
  "Remote or flexible working",
  "Not sure yet - open to options"
];

const COMPANY_SIZE_OPTIONS = [
  "Startup (1-10 employees)",
  "Small business (11-50 employees)",
  "Medium company (51-250 employees)",
  "Large company (251-1000 employees)",
  "Enterprise/Corporation (1000+ employees)",
  "Government or public sector",
  "Non-profit organisation",
  "No preference"
];

const COURSE_SUBJECTS = [
  "Business & Management",
  "Computer Science & IT",
  "Engineering",
  "Marketing & Communications",
  "Psychology",
  "English Language & Literature",
  "Mathematics",
  "Biology",
  "Chemistry",
  "Physics",
  "History",
  "Geography",
  "Art & Design",
  "Media Studies",
  "Economics",
  "Sociology",
  "Law",
  "Medicine & Health Sciences",
  "Education & Teaching",
  "Modern Languages",
  "Finance & Accounting",
  "Philosophy",
  "Politics",
  "Environmental Science",
  "Other",
  "Not applicable"
];

const TOTAL_APPLICATIONS_OPTIONS = [
  "0-5 applications",
  "6-15 applications",
  "16-30 applications",
  "31-50 applications",
  "51-100 applications",
  "100+ applications"
];

// UK Education subjects
const FAVORITE_SUBJECTS = [
  "Mathematics",
  "English Language", 
  "English Literature",
  "Science (General)",
  "Biology",
  "Chemistry", 
  "Physics",
  "History",
  "Geography",
  "Modern Foreign Languages",
  "Art & Design",
  "Music",
  "Drama/Theatre Studies",
  "Physical Education",
  "Computing/Computer Science",
  "Business Studies",
  "Economics",
  "Psychology",
  "Sociology",
  "Religious Studies",
  "Philosophy",
  "Politics",
  "Media Studies",
  "Design Technology",
  "Food Technology",
  "Other"
];

// Industry and career options
const INDUSTRY_OPTIONS = [
  "Technology & Software",
  "Finance & Banking", 
  "Healthcare & Medicine",
  "Education & Training",
  "Marketing & Advertising",
  "Media & Communications",
  "Retail & E-commerce",
  "Manufacturing & Engineering",
  "Construction & Property",
  "Hospitality & Tourism",
  "Transport & Logistics",
  "Legal Services",
  "Government & Public Sector",
  "Non-profit & Charity",
  "Creative Industries",
  "Sports & Recreation",
  "Agriculture & Environment",
  "Energy & Utilities",
  "Other"
];

const CAREER_TYPES = [
  "Administration & Office Support",
  "Customer Service & Support",
  "Sales & Business Development", 
  "Marketing & Communications",
  "Human Resources & Recruitment",
  "Finance & Accounting",
  "Data Analysis & Research",
  "Software Development & IT",
  "Design & Creative",
  "Project Management",
  "Operations & Logistics",
  "Teaching & Training",
  "Healthcare & Care",
  "Legal & Compliance",
  "Engineering & Technical",
  "Management & Leadership",
  "Consultancy & Advisory",
  "Other"
];

// UK Locations for work preferences
const UK_LOCATIONS = [
  "London",
  "Manchester", 
  "Birmingham",
  "Bristol",
  "Leeds",
  "Liverpool",
  "Sheffield",
  "Edinburgh",
  "Glasgow",
  "Cardiff",
  "Newcastle",
  "Nottingham",
  "Southampton",
  "Reading",
  "Brighton",
  "Cambridge",
  "Oxford",
  "Bath",
  "York",
  "Chester",
  "Remote",
  "Hybrid (Mix of remote/office)",
  "Open to relocation",
  "Other"
];

// Enhanced 35-question behavioural assessment for robust job matching
const ENHANCED_BEHAVIORAL_QUESTIONS = [
  // DISC-based core questions (proven from your quiz)
  {
    id: 'rules_approach',
    text: 'Rules are for:',
    dimension: 'compliance',
    options: [
      { text: 'Challenging, if they make no sense', traits: ['direct', 'questioning', 'independent'] },
      { text: 'Bending, if they\'re boring', traits: ['flexible', 'creative', 'adaptable'] },
      { text: 'Respecting - they\'re usually there for a reason', traits: ['collaborative', 'respectful', 'structured'] },
      { text: 'Following to avoid unnecessary risks', traits: ['cautious', 'systematic', 'careful'] }
    ]
  },
  {
    id: 'conflict_handling',
    text: 'When it comes to conflict:',
    dimension: 'conflict_resolution',
    options: [
      { text: 'I tell it like it is and move on', traits: ['direct', 'decisive', 'straightforward'] },
      { text: 'I care deeply if I\'m involved, it matters to me what people think', traits: ['emotional', 'people_focused', 'empathetic'] },
      { text: 'I\'m usually the mediator, conflict should be resolved ASAP', traits: ['harmonious', 'collaborative', 'diplomatic'] },
      { text: 'I remove myself from the situation', traits: ['analytical', 'cautious', 'thoughtful'] }
    ]
  },
  {
    id: 'task_completion',
    text: 'When carrying out a task I:',
    dimension: 'work_approach',
    options: [
      { text: 'Work hard to get it done quickly so I can move on', traits: ['efficient', 'results_focused', 'fast_paced'] },
      { text: 'Enjoy the process and the creative sparks it brings', traits: ['creative', 'process_oriented', 'innovative'] },
      { text: 'Invest time in deciding how to tackle it, seeking guidance', traits: ['collaborative', 'thoughtful', 'supportive'] },
      { text: 'Approach it systematically, ensuring all details are covered', traits: ['methodical', 'thorough', 'quality_focused'] }
    ]
  },
  {
    id: 'decision_making',
    text: 'I make decisions:',
    dimension: 'decision_style',
    options: [
      { text: 'Quickly, once I\'ve collected the main facts', traits: ['decisive', 'pragmatic', 'action_oriented'] },
      { text: 'Impulsively, based on gut feel', traits: ['intuitive', 'spontaneous', 'instinctive'] },
      { text: 'As a team, once I\'ve consulted everyone\'s opinions', traits: ['collaborative', 'inclusive', 'consensus_building'] },
      { text: 'With careful thought and analysis, every choice matters', traits: ['analytical', 'deliberate', 'thorough'] }
    ]
  },
  {
    id: 'problem_solving',
    text: 'If I have a tough problem to solve:',
    dimension: 'problem_approach',
    options: [
      { text: 'I confront it head-on with determination', traits: ['direct', 'persistent', 'bold'] },
      { text: 'I ponder it deeply, trusting my instincts', traits: ['reflective', 'intuitive', 'creative'] },
      { text: 'I seek input and opinions to find the best solution', traits: ['collaborative', 'consultative', 'inclusive'] },
      { text: 'I can\'t rest until I\'ve cracked it, no matter how long it takes', traits: ['persistent', 'thorough', 'dedicated'] }
    ]
  },
  {
    id: 'work_environment',
    text: 'I work best:',
    dimension: 'work_style',
    options: [
      { text: 'Under pressure, striving for results', traits: ['pressure_motivated', 'results_oriented', 'competitive'] },
      { text: 'In dynamic settings with human interactions', traits: ['social', 'dynamic', 'people_focused'] },
      { text: 'In a supportive and cooperative environment', traits: ['supportive', 'collaborative', 'team_oriented'] },
      { text: 'With a clear task ahead', traits: ['structured', 'focused', 'goal_oriented'] }
    ]
  },
  {
    id: 'meeting_people',
    text: 'When meeting new people I:',
    dimension: 'social_approach',
    options: [
      { text: 'Like to understand what value they can bring to my life', traits: ['strategic', 'goal_oriented', 'practical'] },
      { text: 'Like to make a good impression', traits: ['social', 'impression_focused', 'engaging'] },
      { text: 'Show sincere interest in what they have to say', traits: ['empathetic', 'listener', 'caring'] },
      { text: 'Observe and assess, taking time to warm up', traits: ['cautious', 'observant', 'analytical'] }
    ]
  },
  {
    id: 'routine_preference',
    text: 'The thought of doing the same thing every day makes me feel:',
    dimension: 'variety_preference',
    options: [
      { text: 'Bored - I like variety', traits: ['variety_seeking', 'challenge_oriented', 'dynamic'] },
      { text: 'Restricted - I like to be free to do what I want', traits: ['freedom_seeking', 'autonomous', 'independent'] },
      { text: 'Relaxed - I\'m not that big on change anyway', traits: ['stability_seeking', 'consistent', 'predictable'] },
      { text: 'Reassured - I like to feel a sense of orderly structure', traits: ['structure_seeking', 'organised', 'systematic'] }
    ]
  },
  {
    id: 'stress_response',
    text: 'If faced with a stressful situation I:',
    dimension: 'stress_management',
    options: [
      { text: 'Feel better after venting my frustrations or doing exercise', traits: ['action_oriented', 'physical_release', 'expressive'] },
      { text: 'Seek out friends and focus my energy on having a good time', traits: ['social_support', 'positive_focus', 'optimistic'] },
      { text: 'Seek emotional support from friends or loved ones', traits: ['emotional_support', 'relationship_focused', 'connected'] },
      { text: 'Withdraw to reflect and gather my thoughts', traits: ['introspective', 'thoughtful', 'self_reliant'] }
    ]
  },
  {
    id: 'idea_evaluation',
    text: 'When someone runs an idea by me I:',
    dimension: 'idea_response',
    options: [
      { text: 'Evaluate its feasibility and potential impact', traits: ['practical', 'impact_focused', 'analytical'] },
      { text: 'Get excited about new possibilities and brainstorm further', traits: ['creative', 'enthusiastic', 'innovative'] },
      { text: 'Consider its implications on relationships and harmony', traits: ['relationship_aware', 'harmonious', 'considerate'] },
      { text: 'Analyse the idea\'s depth and intricacies', traits: ['analytical', 'detail_oriented', 'thorough'] }
    ]
  },

  // Additional proven questions from your CSV analysis
  {
    id: 'working_style',
    text: 'Would you consider yourself to be more:',
    dimension: 'thinking_style',
    options: [
      { text: 'Analytical', traits: ['analytical', 'logical', 'systematic'] },
      { text: 'Creative', traits: ['creative', 'innovative', 'imaginative'] },
      { text: 'Equal mix of both', traits: ['balanced', 'versatile', 'adaptable'] }
    ]
  },
  {
    id: 'work_preference',
    text: 'Do you prefer working with:',
    dimension: 'work_focus',
    options: [
      { text: 'Tasks', traits: ['task_focused', 'independent', 'goal_oriented'] },
      { text: 'People', traits: ['people_focused', 'social', 'collaborative'] },
      { text: 'Equal mix', traits: ['balanced', 'adaptable', 'flexible'] }
    ]
  },
  {
    id: 'social_energy',
    text: 'Would you consider yourself to be more:',
    dimension: 'social_orientation',
    options: [
      { text: 'Extroverted', traits: ['extroverted', 'social', 'outgoing'] },
      { text: 'Introverted', traits: ['introverted', 'reflective', 'independent'] },
      { text: 'Equal mix', traits: ['ambivert', 'balanced', 'adaptable'] }
    ]
  },
  {
    id: 'learning_style',
    text: 'Do you imagine yourself:',
    dimension: 'learning_approach',
    options: [
      { text: 'Learning lots of different things', traits: ['broad_learning', 'curious', 'diverse'] },
      { text: 'Specialising in one thing', traits: ['specialist', 'focused', 'deep_learning'] },
      { text: 'Equal mix', traits: ['balanced_learning', 'adaptable', 'versatile'] }
    ]
  },
  {
    id: 'organization_type',
    text: 'Do you envisage working somewhere:',
    dimension: 'organization_preference',
    options: [
      { text: 'Mission-led', traits: ['purpose_driven', 'values_focused', 'impact_oriented'] },
      { text: 'Commercially-led', traits: ['business_focused', 'results_oriented', 'competitive'] },
      { text: 'Equal appeal', traits: ['balanced', 'pragmatic', 'adaptable'] }
    ]
  },
  {
    id: 'training_preference',
    text: 'Is it more important to you:',
    dimension: 'development_style',
    options: [
      { text: 'To have formal training', traits: ['structured_learning', 'guided', 'systematic'] },
      { text: 'The freedom to figure things out', traits: ['autonomous_learning', 'independent', 'exploratory'] },
      { text: 'Equal importance', traits: ['balanced_learning', 'adaptable', 'flexible'] }
    ]
  },
  {
    id: 'skill_focus',
    text: 'Would you place more importance on:',
    dimension: 'skill_development',
    options: [
      { text: 'The opportunity to network', traits: ['relationship_building', 'social', 'connection_focused'] },
      { text: 'Building practical skills', traits: ['skill_building', 'practical', 'competency_focused'] },
      { text: 'Equal importance', traits: ['balanced_development', 'well_rounded', 'comprehensive'] }
    ]
  },
  {
    id: 'idea_orientation',
    text: 'Would you say you are more of:',
    dimension: 'innovation_style',
    options: [
      { text: 'A person that comes up with ideas', traits: ['idea_generator', 'creative', 'innovative'] },
      { text: 'A person that executes ideas', traits: ['executor', 'implementation_focused', 'practical'] },
      { text: 'Equal mix', traits: ['balanced_contributor', 'versatile', 'comprehensive'] }
    ]
  },
  {
    id: 'leadership_style',
    text: 'Would you rather:',
    dimension: 'leadership_preference',
    options: [
      { text: 'Take the lead', traits: ['leader', 'directive', 'initiative_taking'] },
      { text: 'Be led', traits: ['follower', 'supportive', 'team_player'] },
      { text: 'Equal comfort with both', traits: ['adaptive_leadership', 'situational', 'flexible'] }
    ]
  },
  {
    id: 'focus_orientation',
    text: 'Would you consider yourself to be more:',
    dimension: 'priority_focus',
    options: [
      { text: 'Results focused', traits: ['results_oriented', 'goal_focused', 'outcome_driven'] },
      { text: 'Relationship focused', traits: ['relationship_oriented', 'people_focused', 'connection_driven'] },
      { text: 'Equal focus', traits: ['balanced_focus', 'comprehensive', 'holistic'] }
    ]
  },
  {
    id: 'work_pace',
    text: 'Do you typically prioritise:',
    dimension: 'work_priority',
    options: [
      { text: 'Speed & efficiency', traits: ['fast_paced', 'efficient', 'quick'] },
      { text: 'Accuracy & precision', traits: ['quality_focused', 'detailed', 'thorough'] },
      { text: 'Equal balance', traits: ['balanced_approach', 'comprehensive', 'adaptable'] }
    ]
  },
  {
    id: 'risk_tolerance',
    text: 'Do you prefer:',
    dimension: 'risk_approach',
    options: [
      { text: 'Stability & certainty', traits: ['stability_seeking', 'cautious', 'predictable'] },
      { text: 'Taking risks', traits: ['risk_taking', 'adventurous', 'bold'] },
      { text: 'Equal comfort', traits: ['balanced_risk', 'situational', 'adaptable'] }
    ]
  },
  {
    id: 'team_contribution',
    text: 'Are you more of:',
    dimension: 'team_style',
    options: [
      { text: 'A team person', traits: ['team_oriented', 'collaborative', 'group_focused'] },
      { text: 'A get-stuff-done person', traits: ['task_oriented', 'independent', 'execution_focused'] },
      { text: 'Equal contribution style', traits: ['balanced_contributor', 'versatile', 'adaptable'] }
    ]
  },

  // Extended behavioural profiling questions for deeper matching
  {
    id: 'communication_style',
    text: 'In meetings, I typically:',
    dimension: 'communication_approach',
    options: [
      { text: 'Speak up early with my thoughts', traits: ['assertive', 'confident', 'vocal'] },
      { text: 'Listen first, then contribute thoughtfully', traits: ['thoughtful', 'considerate', 'strategic'] },
      { text: 'Ask questions to understand better', traits: ['curious', 'analytical', 'investigative'] },
      { text: 'Focus on keeping things moving forward', traits: ['action_oriented', 'efficient', 'pragmatic'] }
    ]
  },
  {
    id: 'feedback_preference',
    text: 'I prefer to receive feedback that is:',
    dimension: 'feedback_style',
    options: [
      { text: 'Direct and to the point', traits: ['direct', 'efficient', 'straightforward'] },
      { text: 'Encouraging and supportive', traits: ['supportive', 'positive', 'motivational'] },
      { text: 'Detailed with specific examples', traits: ['detailed', 'thorough', 'analytical'] },
      { text: 'Focused on future improvements', traits: ['growth_oriented', 'forward_thinking', 'developmental'] }
    ]
  },
  {
    id: 'project_approach',
    text: 'When starting a new project, I first:',
    dimension: 'project_initiation',
    options: [
      { text: 'Jump in and start working', traits: ['action_oriented', 'spontaneous', 'hands_on'] },
      { text: 'Create a detailed plan', traits: ['organised', 'systematic', 'structured'] },
      { text: 'Talk to others about their experiences', traits: ['collaborative', 'social', 'consultative'] },
      { text: 'Research best practices thoroughly', traits: ['research_oriented', 'thorough', 'methodical'] }
    ]
  },
  {
    id: 'deadline_management',
    text: 'When facing tight deadlines, I:',
    dimension: 'pressure_response',
    options: [
      { text: 'Thrive and do my best work', traits: ['pressure_motivated', 'energetic', 'performance_driven'] },
      { text: 'Stay calm and work systematically', traits: ['steady', 'methodical', 'composed'] },
      { text: 'Seek help from team members', traits: ['collaborative', 'supportive', 'team_oriented'] },
      { text: 'Focus intensely until it\'s done', traits: ['focused', 'determined', 'persistent'] }
    ]
  },
  {
    id: 'learning_preference',
    text: 'I learn best through:',
    dimension: 'learning_style',
    options: [
      { text: 'Hands-on experience and practice', traits: ['practical', 'experiential', 'kinesthetic'] },
      { text: 'Reading and studying materials', traits: ['theoretical', 'studious', 'analytical'] },
      { text: 'Discussion and collaboration', traits: ['social', 'collaborative', 'verbal'] },
      { text: 'Observation and reflection', traits: ['observational', 'reflective', 'thoughtful'] }
    ]
  },
  {
    id: 'mistake_handling',
    text: 'When I make a mistake, I typically:',
    dimension: 'error_response',
    options: [
      { text: 'Acknowledge it quickly and move on', traits: ['resilient', 'forward_thinking', 'pragmatic'] },
      { text: 'Analyze what went wrong to prevent it happening again', traits: ['analytical', 'learning_oriented', 'thorough'] },
      { text: 'Discuss it with others to get perspective', traits: ['collaborative', 'open', 'social'] },
      { text: 'Focus on fixing it immediately', traits: ['action_oriented', 'solution_focused', 'responsive'] }
    ]
  },
  {
    id: 'success_motivation',
    text: 'I feel most successful when:',
    dimension: 'success_drivers',
    options: [
      { text: 'I achieve measurable results', traits: ['achievement_oriented', 'goal_focused', 'results_driven'] },
      { text: 'I help others succeed', traits: ['supportive', 'service_oriented', 'team_focused'] },
      { text: 'I learn something new', traits: ['growth_oriented', 'curious', 'learning_focused'] },
      { text: 'I solve complex problems', traits: ['problem_solver', 'analytical', 'challenge_oriented'] }
    ]
  },
  {
    id: 'change_adaptation',
    text: 'When facing unexpected changes, I:',
    dimension: 'adaptability',
    options: [
      { text: 'Adapt quickly and find new approaches', traits: ['adaptable', 'flexible', 'resilient'] },
      { text: 'Take time to understand the implications', traits: ['thoughtful', 'analytical', 'cautious'] },
      { text: 'Look for ways to maintain stability', traits: ['stability_seeking', 'consistent', 'steady'] },
      { text: 'Get excited about new possibilities', traits: ['optimistic', 'opportunity_focused', 'positive'] }
    ]
  },
  {
    id: 'work_motivation',
    text: 'What motivates me most at work is:',
    dimension: 'motivation_drivers',
    options: [
      { text: 'Achieving ambitious goals', traits: ['ambitious', 'goal_oriented', 'achievement_focused'] },
      { text: 'Building meaningful relationships', traits: ['relationship_focused', 'social', 'connected'] },
      { text: 'Continuous learning and growth', traits: ['growth_oriented', 'curious', 'developmental'] },
      { text: 'Making a positive impact', traits: ['impact_focused', 'purpose_driven', 'meaningful'] }
    ]
  },
  {
    id: 'collaboration_style',
    text: 'In group work, I naturally:',
    dimension: 'collaboration_approach',
    options: [
      { text: 'Take charge and organise the effort', traits: ['leadership_oriented', 'organised', 'directive'] },
      { text: 'Contribute ideas and creative solutions', traits: ['creative', 'innovative', 'contributory'] },
      { text: 'Ensure everyone\'s voice is heard', traits: ['inclusive', 'democratic', 'supportive'] },
      { text: 'Focus on completing tasks efficiently', traits: ['task_focused', 'efficient', 'practical'] }
    ]
  },
  {
    id: 'decision_confidence',
    text: 'When making important decisions, I:',
    dimension: 'decision_confidence',
    options: [
      { text: 'Trust my instincts and decide confidently', traits: ['confident', 'intuitive', 'decisive'] },
      { text: 'Gather extensive information first', traits: ['thorough', 'research_oriented', 'analytical'] },
      { text: 'Seek input from trusted advisors', traits: ['consultative', 'collaborative', 'wise'] },
      { text: 'Consider multiple scenarios carefully', traits: ['strategic', 'thoughtful', 'comprehensive'] }
    ]
  },
  {
    id: 'workplace_energy',
    text: 'I bring energy to my workplace through:',
    dimension: 'energy_contribution',
    options: [
      { text: 'Enthusiasm and positivity', traits: ['enthusiastic', 'positive', 'energetic'] },
      { text: 'Steady reliability and consistency', traits: ['reliable', 'steady', 'consistent'] },
      { text: 'Fresh ideas and innovation', traits: ['innovative', 'creative', 'fresh_thinking'] },
      { text: 'Strong focus and determination', traits: ['focused', 'determined', 'driven'] }
    ]
  }
];





interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<any>;
  required: boolean;
}

export default function ComprehensiveOnboardingV2() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [profileData, setProfileData] = useState({
    welcome: {},
    behaviouralAssessment: {},
    education: {},
    jobSearchBackground: {},
    careerPreferences: {},
    personalBackground: {},
    skillsVerification: {}
  });

  // Check if user is returning from behavioural assessment
  useEffect(() => {
    const returnStep = localStorage.getItem('onboarding_return_step');
    if (returnStep === 'behavioural_assessment') {
      // Mark behavioural assessment as completed and move to next step
      setCompletedSteps(prev => [...prev, 'behaviouralAssessment']);
      setProfileData(prev => ({
        ...prev,
        behaviouralAssessment: { completed: true, completedAt: new Date() }
      }));
      setCurrentStep(2); // Move to education step (index 2)
      localStorage.removeItem('onboarding_return_step');
    }
  }, []);

  const steps: OnboardingStep[] = [
    {
      id: "welcome",
      title: "Welcome to Pollen",
      description: "Let's get started on your career journey",
      component: WelcomeStep,
      required: true
    },
    {
      id: "behavioural_assessment",
      title: "Working Style Discovery",
      description: "Help us understand how you like to work (fun multiple choice!)",
      component: EnhancedBehavioralAssessmentStep,
      required: true
    },
    {
      id: "education_experience",
      title: "Education & Background",
      description: "Your academic journey and interests",
      component: EducationExperienceStep,
      required: true
    },
    {
      id: "job_search_background",
      title: "Job Search Experience", 
      description: "Your work experience and job search journey",
      component: JobSearchBackgroundStep,
      required: true
    },
    {
      id: "career_preferences",
      title: "Career Aspirations",
      description: "What you're looking for in your career",
      component: CareerPreferencesStep,
      required: true
    },
    {
      id: "personal_background",
      title: "Personal Background",
      description: "Optional information for research purposes",
      component: PersonalBackgroundStep,
      required: false
    },
    {
      id: "skills_verification",
      title: "Skills Verification",
      description: "Optional challenges to showcase your abilities",
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
    setProfileData((prev: any) => ({ ...prev, [stepId]: data }));
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSkipStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const CurrentStepComponent = currentStepData.component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Star className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Profile Setup</h1>
                <p className="text-gray-600">Create your comprehensive candidate profile</p>
              </div>
            </div>
            <Badge variant="secondary">
              Step {currentStep + 1} of {steps.length}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>{currentStepData.title}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Step Content */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8">
            <CurrentStepComponent 
              onComplete={(data: any) => handleStepComplete(currentStepData.id, data)}
              onSkip={!currentStepData.required ? handleSkipStep : undefined}
              canSkip={!currentStepData.required}
              profileData={profileData}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function WelcomeStep({ onComplete }: { onComplete: (data: any) => void }) {
  return (
    <div className="text-center space-y-6">
      <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
        <Star className="w-10 h-10 text-white" />
      </div>
      
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">Welcome to Pollen</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          We're here to help you find meaningful work that matches your skills and personality.
          This quick setup will help us understand you better so we can connect you with the right opportunities.
        </p>
        

      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Brain className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold">Discover your style</h3>
          <p className="text-sm text-gray-600">Fun questions about how you like to work</p>
        </div>
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <Trophy className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold">Show your skills</h3>
          <p className="text-sm text-gray-600">Optional challenges to demonstrate abilities</p>
        </div>
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <Lightbulb className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-semibold">Find great matches</h3>
          <p className="text-sm text-gray-600">Get personalised job recommendations</p>
        </div>
      </div>

      <Button onClick={() => onComplete({})} size="lg" className="mt-8">
        Let's get started
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </div>
  );
}

function EnhancedBehavioralAssessmentStep({ onComplete }: { onComplete: (data: any) => void }) {
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  const handleStartAssessment = () => {
    setIsRedirecting(true);
    // Store the current onboarding state before redirecting
    localStorage.setItem('onboarding_return_step', 'behavioural_assessment');
    window.location.href = "/behavioural-assessment";
  };

  const handleSkipForNow = () => {
    // Skip with minimal data to continue onboarding
    onComplete({
      behaviouralAssessment: {
        skipped: true,
        completedLater: false
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
          <Brain className="w-8 h-8 text-purple-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Working Style Discovery</h2>
          <p className="text-gray-600 mt-2">
            Help us understand how you like to work so we can find the best job matches for you
          </p>
        </div>
      </div>

      <Card className="border-2 border-blue-100">
        <CardHeader>
          <CardTitle className="text-center">Quick Assessment</CardTitle>
          <p className="text-center text-muted-foreground">
            A few questions about your work style and preferences
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Button 
              onClick={handleStartAssessment} 
              size="lg" 
              className="w-full"
              disabled={isRedirecting}
            >
              {isRedirecting ? "Loading..." : "Start Questions"}
            </Button>
            
            <Button 
              onClick={handleSkipForNow}
              variant="outline" 
              size="lg" 
              className="w-full"
            >
              Skip for Now
            </Button>
          </div>
          
          <p className="text-xs text-center text-muted-foreground">
            Takes about 10 minutes • Can be completed later from your dashboard
          </p>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
          <Brain className="w-8 h-8 text-purple-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Working Style Discovery</h2>
          <p className="text-gray-600 mt-2">
            Quick multiple choice questions to understand your work preferences - this is the fun part!
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Question {currentQuestion + 1} of {ENHANCED_BEHAVIORAL_QUESTIONS.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question */}
      <Card className="border-2 border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl text-center">{question.text}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {question.options.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              className="w-full h-auto p-4 text-left justify-start hover:bg-blue-50 text-wrap"
              onClick={() => handleAnswerSelect(option)}
            >
              {option.text}
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function EducationExperienceStep({ onComplete }: { onComplete: (data: any) => void }) {
  const [formData, setFormData] = useState({
    education: '',
    fieldOfStudy: [] as string[],
    institution: '',
    graduationYear: '',
    yearOfCompletion: '',
    relevantCourses: '',
    projects: '',
    workExperience: '',
    volunteering: '',
    certifications: ''
  });

  const handleCourseSubjectToggle = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      fieldOfStudy: prev.fieldOfStudy.includes(subject)
        ? prev.fieldOfStudy.filter(s => s !== subject)
        : [...prev.fieldOfStudy, subject]
    }));
  };

  const handleSubmit = () => {
    onComplete({
      education: formData
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <GraduationCap className="w-8 h-8 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Education & Experience</h2>
          <p className="text-gray-600 mt-2">
            Help us understand your background
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-blue-800 text-sm">
          <strong>Important:</strong> This information is collected for research purposes only and will not be used for job matching or any selection criteria.
        </p>
      </div>

      <div className="space-y-6">


        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Education Level
          </label>
          <Select value={formData.education} onValueChange={(value) => 
            setFormData(prev => ({ ...prev, education: value }))
          }>
            <SelectTrigger>
              <SelectValue placeholder="Select your education level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gcse">GCSE/O Levels</SelectItem>
              <SelectItem value="a-levels">A Levels/Scottish Highers</SelectItem>
              <SelectItem value="btec">BTEC/National Diploma</SelectItem>
              <SelectItem value="apprenticeship">Apprenticeship</SelectItem>
              <SelectItem value="university-current">Currently at University</SelectItem>
              <SelectItem value="university-graduate">University Graduate</SelectItem>
              <SelectItem value="postgraduate">Postgraduate Studies (Masters/PhD)</SelectItem>
              <SelectItem value="professional">Professional Qualifications</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Course/Subject of Study (Select all that apply)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {COURSE_SUBJECTS.map((subject) => (
              <div key={subject} className="flex items-center space-x-2">
                <Checkbox
                  id={subject}
                  checked={formData.fieldOfStudy.includes(subject)}
                  onCheckedChange={() => handleCourseSubjectToggle(subject)}
                />
                <label
                  htmlFor={subject}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {subject}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Where did you study or are you studying? (School, college, university name)
          </label>
          <Input
            placeholder="e.g., Manchester University, King's College London, Manchester Grammar School..."
            value={formData.institution}
            onChange={(e) => setFormData(prev => ({ ...prev, institution: e.target.value }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What year did/will you complete your education?
          </label>
          <Select value={formData.yearOfCompletion} onValueChange={(value) => 
            setFormData(prev => ({ ...prev, yearOfCompletion: value }))
          }>
            <SelectTrigger>
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
              <SelectItem value="2021">2021</SelectItem>
              <SelectItem value="2020">2020</SelectItem>
              <SelectItem value="2019">2019</SelectItem>
              <SelectItem value="2018">2018</SelectItem>
              <SelectItem value="before-2018">Before 2018</SelectItem>
              <SelectItem value="future">Future year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Work Experience (including part-time, internships, freelance)
          </label>
          <Textarea
            placeholder="Describe any work experience you have, even if it seems unrelated to your career goals..."
            value={formData.workExperience}
            onChange={(e) => setFormData(prev => ({ ...prev, workExperience: e.target.value }))}
            rows={3}
          />
        </div>
      </div>

      <Button onClick={handleSubmit} className="w-full" size="lg">
        Continue to Job Search Background
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </div>
  );
}

function JobSearchBackgroundStep({ onComplete }: { onComplete: (data: any) => void }) {
  const [formData, setFormData] = useState({
    currentEmploymentStatus: '',
    jobSearchDuration: '',
    totalApplications: '',
    jobApplicationsPerWeek: '',
    importantFactors: [] as string[],
    reasonsForPollen: [] as string[],
    jobSearchFrustrations: [] as string[],
    jobSearchExperience: '',
    additionalInfo: ''
  });

  const handleFactorToggle = (factor: string) => {
    setFormData(prev => ({
      ...prev,
      importantFactors: prev.importantFactors.includes(factor)
        ? prev.importantFactors.filter(f => f !== factor)
        : [...prev.importantFactors, factor]
    }));
  };

  const handleReasonToggle = (reason: string) => {
    setFormData(prev => ({
      ...prev,
      reasonsForPollen: prev.reasonsForPollen.includes(reason)
        ? prev.reasonsForPollen.filter(r => r !== reason)
        : [...prev.reasonsForPollen, reason]
    }));
  };

  const handleFrustrationToggle = (frustration: string) => {
    setFormData(prev => ({
      ...prev,
      jobSearchFrustrations: prev.jobSearchFrustrations.includes(frustration)
        ? prev.jobSearchFrustrations.filter(f => f !== frustration)
        : [...prev.jobSearchFrustrations, frustration]
    }));
  };

  const handleSubmit = () => {
    onComplete({
      jobSearchBackground: formData
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
          <Users className="w-8 h-8 text-purple-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Job Search Background</h2>
          <p className="text-gray-600 mt-2">
            Tell us about your job search experience
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What is your current employment status?
          </label>
          <Select value={formData.currentEmploymentStatus} onValueChange={(value) => 
            setFormData(prev => ({ ...prev, currentEmploymentStatus: value }))
          }>
            <SelectTrigger>
              <SelectValue placeholder="Select your current situation" />
            </SelectTrigger>
            <SelectContent>
              {EMPLOYMENT_STATUS_OPTIONS.map((status) => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How long have you been looking for a job?
          </label>
          <Select value={formData.jobSearchDuration} onValueChange={(value) => 
            setFormData(prev => ({ ...prev, jobSearchDuration: value }))
          }>
            <SelectTrigger>
              <SelectValue placeholder="Select how long you've been looking" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="just-started">Just getting started</SelectItem>
              <SelectItem value="few-weeks">A few weeks</SelectItem>
              <SelectItem value="1-3-months">1-3 months</SelectItem>
              <SelectItem value="3-6-months">3-6 months</SelectItem>
              <SelectItem value="6-12-months">6-12 months</SelectItem>
              <SelectItem value="over-year">Over a year</SelectItem>
              <SelectItem value="not-currently-looking">Not currently looking</SelectItem>
            </SelectContent>
          </Select>
        </div>



        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How many jobs do you think you've applied to in total?
          </label>
          <Select value={formData.totalApplications} onValueChange={(value) => 
            setFormData(prev => ({ ...prev, totalApplications: value }))
          }>
            <SelectTrigger>
              <SelectValue placeholder="Select total applications" />
            </SelectTrigger>
            <SelectContent>
              {TOTAL_APPLICATIONS_OPTIONS.map((total) => (
                <SelectItem key={total} value={total}>{total}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How many jobs do you apply to per week on average?
          </label>
          <Select value={formData.jobApplicationsPerWeek} onValueChange={(value) => 
            setFormData(prev => ({ ...prev, jobApplicationsPerWeek: value }))
          }>
            <SelectTrigger>
              <SelectValue placeholder="Select application frequency" />
            </SelectTrigger>
            <SelectContent>
              {JOB_APPLICATION_FREQUENCY.map((freq) => (
                <SelectItem key={freq} value={freq}>{freq}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            What factors do you consider important when looking for a job? (Select all that apply)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {IMPORTANT_JOB_FACTORS.map((factor) => (
              <div key={factor} className="flex items-center space-x-2">
                <Checkbox
                  id={factor}
                  checked={formData.importantFactors.includes(factor)}
                  onCheckedChange={() => handleFactorToggle(factor)}
                />
                <label
                  htmlFor={factor}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {factor}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            What were the main reasons you signed up to Pollen? (Select all that apply)
          </label>
          <div className="grid grid-cols-1 gap-2">
            {POLLEN_SIGNUP_REASONS.map((reason) => (
              <div key={reason} className="flex items-center space-x-2">
                <Checkbox
                  id={reason}
                  checked={formData.reasonsForPollen.includes(reason)}
                  onCheckedChange={() => handleReasonToggle(reason)}
                />
                <label
                  htmlFor={reason}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {reason}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            What frustrates you the most about the traditional job seeking process? (Select all that apply)
          </label>
          <div className="grid grid-cols-1 gap-2">
            {JOB_SEARCH_FRUSTRATIONS.map((frustration) => (
              <div key={frustration} className="flex items-center space-x-2">
                <Checkbox
                  id={frustration}
                  checked={formData.jobSearchFrustrations.includes(frustration)}
                  onCheckedChange={() => handleFrustrationToggle(frustration)}
                />
                <label
                  htmlFor={frustration}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {frustration}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Could you elaborate more on your experiences of looking for a job?
          </label>
          <Textarea
            placeholder="Share your job search story - what's been working, what hasn't, any particular challenges or successes..."
            value={formData.jobSearchExperience}
            onChange={(e) => setFormData(prev => ({ ...prev, jobSearchExperience: e.target.value }))}
            rows={4}
          />
        </div>
      </div>

      <Button onClick={handleSubmit} className="w-full" size="lg">
        Continue to Career Preferences
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </div>
  );
}

function CareerPreferencesStep({ onComplete }: { onComplete: (data: any) => void }) {
  const [formData, setFormData] = useState({
    // Proven open-ended questions for profiling
    idealJob: '',
    friendsDescription: '',
    teachersDescription: '',
    happyActivities: '',
    frustrations: '',
    proudMoments: '',
    
    // Practical job preferences with multiple choice
    favouriteSubjects: [] as string[],
    preferredIndustries: [] as string[],
    preferredCareerTypes: [] as string[],
    workLocations: [] as string[],
    employmentTypes: [] as string[],
    companySize: [] as string[],
    startDate: '',
    
    // Additional practical details
    hearAboutUs: '',
    reasonableAdjustments: ''
  });

  const handleSubjectToggle = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      favouriteSubjects: prev.favouriteSubjects.includes(subject)
        ? prev.favouriteSubjects.filter(s => s !== subject)
        : [...prev.favouriteSubjects, subject]
    }));
  };

  const handleEmploymentTypeToggle = (type: string) => {
    setFormData(prev => ({
      ...prev,
      employmentTypes: prev.employmentTypes.includes(type)
        ? prev.employmentTypes.filter(t => t !== type)
        : [...prev.employmentTypes, type]
    }));
  };

  const handleCompanySizeToggle = (size: string) => {
    setFormData(prev => ({
      ...prev,
      companySize: prev.companySize.includes(size)
        ? prev.companySize.filter(s => s !== size)
        : [...prev.companySize, size]
    }));
  };

  const handleIndustryToggle = (industry: string) => {
    setFormData(prev => ({
      ...prev,
      preferredIndustries: prev.preferredIndustries.includes(industry)
        ? prev.preferredIndustries.filter(i => i !== industry)
        : [...prev.preferredIndustries, industry]
    }));
  };

  const handleCareerTypeToggle = (careerType: string) => {
    setFormData(prev => ({
      ...prev,
      preferredCareerTypes: prev.preferredCareerTypes.includes(careerType)
        ? prev.preferredCareerTypes.filter(c => c !== careerType)
        : [...prev.preferredCareerTypes, careerType]
    }));
  };

  const handleLocationToggle = (location: string) => {
    setFormData(prev => ({
      ...prev,
      workLocations: prev.workLocations.includes(location)
        ? prev.workLocations.filter(l => l !== location)
        : [...prev.workLocations, location]
    }));
  };

  const handleSubmit = () => {
    onComplete({
      careerPreferences: formData
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <Trophy className="w-8 h-8 text-green-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Career Aspirations</h2>
          <p className="text-gray-600 mt-2">
            Help us understand what you're looking for in your career
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Open-ended profile questions - PROVEN to work well */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-green-800 mb-3">Tell us about yourself</h3>
          <p className="text-green-700 text-sm mb-4">These questions help us understand who you are beyond your CV</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What's your idea of the perfect job?
              </label>
              <Textarea
                placeholder="Describe what would make the perfect job for you..."
                value={formData.idealJob}
                onChange={(e) => setFormData(prev => ({ ...prev, idealJob: e.target.value }))}
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                In 3 words or phrases, how would your friends describe you?
              </label>
              <Input
                placeholder="e.g., funny, reliable, creative..."
                value={formData.friendsDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, friendsDescription: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                In 3 words or phrases, how would your teachers describe you?
              </label>
              <Input
                placeholder="e.g., hardworking, curious, helpful..."
                value={formData.teachersDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, teachersDescription: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What do you like doing that makes you happy?
              </label>
              <Textarea
                placeholder="Tell us about activities, hobbies, or things that bring you joy..."
                value={formData.happyActivities}
                onChange={(e) => setFormData(prev => ({ ...prev, happyActivities: e.target.value }))}
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Is there anything in life that frustrates you?
              </label>
              <Textarea
                placeholder="What kinds of things tend to frustrate or annoy you..."
                value={formData.frustrations}
                onChange={(e) => setFormData(prev => ({ ...prev, frustrations: e.target.value }))}
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Is there anything you've done you feel really proud of?
              </label>
              <Textarea
                placeholder="Tell us about an achievement or moment you're proud of..."
                value={formData.proudMoments}
                onChange={(e) => setFormData(prev => ({ ...prev, proudMoments: e.target.value }))}
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Favorite subjects - moved from education section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            What were your favourite subjects during education? (Select all that apply)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {FAVORITE_SUBJECTS.map((subject) => (
              <div key={subject} className="flex items-center space-x-2">
                <Checkbox
                  id={subject}
                  checked={formData.favouriteSubjects.includes(subject)}
                  onCheckedChange={() => handleSubjectToggle(subject)}
                />
                <label
                  htmlFor={subject}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {subject}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Industry preferences with multiple choice */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Are there any particular industries that appeal to you? (Select all that apply)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {INDUSTRY_OPTIONS.map((industry) => (
              <div key={industry} className="flex items-center space-x-2">
                <Checkbox
                  id={industry}
                  checked={formData.preferredIndustries.includes(industry)}
                  onCheckedChange={() => handleIndustryToggle(industry)}
                />
                <label
                  htmlFor={industry}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {industry}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Career type preferences with multiple choice */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Are there any types of roles that have caught your eye already? (Select all that apply)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {CAREER_TYPES.map((careerType) => (
              <div key={careerType} className="flex items-center space-x-2">
                <Checkbox
                  id={careerType}
                  checked={formData.preferredCareerTypes.includes(careerType)}
                  onCheckedChange={() => handleCareerTypeToggle(careerType)}
                />
                <label
                  htmlFor={careerType}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {careerType}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Work location preferences with multiple choice */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Where would you like to work? (Select all that apply)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {UK_LOCATIONS.map((location) => (
              <div key={location} className="flex items-center space-x-2">
                <Checkbox
                  id={location}
                  checked={formData.workLocations.includes(location)}
                  onCheckedChange={() => handleLocationToggle(location)}
                />
                <label
                  htmlFor={location}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {location}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            What type of employment are you looking for? (Select all that apply)
          </label>
          <div className="grid grid-cols-1 gap-2">
            {EMPLOYMENT_TYPE_OPTIONS.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={type}
                  checked={formData.employmentTypes.includes(type)}
                  onCheckedChange={() => handleEmploymentTypeToggle(type)}
                />
                <label
                  htmlFor={type}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {type}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            What size of company interests you? (Select all that apply)
          </label>
          <div className="grid grid-cols-1 gap-2">
            {COMPANY_SIZE_OPTIONS.map((size) => (
              <div key={size} className="flex items-center space-x-2">
                <Checkbox
                  id={size}
                  checked={formData.companySize.includes(size)}
                  onCheckedChange={() => handleCompanySizeToggle(size)}
                />
                <label
                  htmlFor={size}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {size}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            When are you looking to start a job?
          </label>
          <Select value={formData.startDate} onValueChange={(value) => 
            setFormData(prev => ({ ...prev, startDate: value }))
          }>
            <SelectTrigger>
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="immediately">Immediately</SelectItem>
              <SelectItem value="1-month">Within 1 month</SelectItem>
              <SelectItem value="2-3-months">2-3 months</SelectItem>
              <SelectItem value="3-6-months">3-6 months</SelectItem>
              <SelectItem value="6-months-plus">6+ months</SelectItem>
              <SelectItem value="flexible">Flexible</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How did you hear about us?
          </label>
          <Select value={formData.hearAboutUs} onValueChange={(value) => 
            setFormData(prev => ({ ...prev, hearAboutUs: value }))
          }>
            <SelectTrigger>
              <SelectValue placeholder="Select how you heard about Pollen" />
            </SelectTrigger>
            <SelectContent>
              {HOW_HEARD_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Are there any reasonable adjustments we need to make for you?
            <span className="text-sm text-gray-500 block mt-1">
              This is relevant for disabled, neurodivergent or sensory impaired candidates
            </span>
          </label>
          <Textarea
            placeholder="Let us know if you need any accommodations or adjustments for accessibility, neurodivergence, or disabilities..."
            value={formData.reasonableAdjustments}
            onChange={(e) => setFormData(prev => ({ ...prev, reasonableAdjustments: e.target.value }))}
            rows={2}
          />
        </div>
      </div>

      <Button onClick={handleSubmit} className="w-full" size="lg">
        Continue to Personal Background
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </div>
  );
}

function PersonalBackgroundStep({ onComplete, onSkip, canSkip }: { 
  onComplete: (data: any) => void;
  onSkip?: () => void;
  canSkip?: boolean;
}) {
  const [formData, setFormData] = useState({
    pronouns: '',
    genderIdentity: '',
    ethnicity: '',
    upbringing: '',
    disability: '',
    lowIncome: '',
    freeMeals: '',
    firstGenUniversity: '',
    immigrant: '',
    dateOfBirth: '',
    lgbtqia: '',
    visaRequirements: '',
    visaDetails: ''
  });

  const handleSubmit = () => {
    onComplete({
      personalBackground: formData
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
          <Users className="w-8 h-8 text-orange-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Personal Background</h2>
          <p className="text-gray-600 mt-2">
            Optional information for research purposes only - this will never be used for job matching or selection
          </p>
        </div>
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-orange-800 mb-2">Why we ask these questions</h3>
        <p className="text-orange-700 text-sm">
          This information helps us understand diversity in our platform and improve our services. 
          <strong> It is completely optional and will never be shared with employers or used for matching.</strong>
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pronouns
          </label>
          <Select value={formData.pronouns} onValueChange={(value) => 
            setFormData(prev => ({ ...prev, pronouns: value }))
          }>
            <SelectTrigger>
              <SelectValue placeholder="Select pronouns (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="she-her">She/Her</SelectItem>
              <SelectItem value="he-him">He/Him</SelectItem>
              <SelectItem value="they-them">They/Them</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender Identity
          </label>
          <Select value={formData.genderIdentity} onValueChange={(value) => 
            setFormData(prev => ({ ...prev, genderIdentity: value }))
          }>
            <SelectTrigger>
              <SelectValue placeholder="Select gender identity (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="non-binary">Non-binary</SelectItem>
              <SelectItem value="transgender">Transgender</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ethnicity
          </label>
          <Select value={formData.ethnicity} onValueChange={(value) => 
            setFormData(prev => ({ ...prev, ethnicity: value }))
          }>
            <SelectTrigger>
              <SelectValue placeholder="Select ethnicity (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="black">Black, Black British, Caribbean or African</SelectItem>
              <SelectItem value="asian">Asian or Asian British</SelectItem>
              <SelectItem value="white">White</SelectItem>
              <SelectItem value="multi-racial">Multi-racial / Multi-ethnic</SelectItem>
              <SelectItem value="other">Other</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Where did you grow up?
          </label>
          <Select value={formData.upbringing} onValueChange={(value) => 
            setFormData(prev => ({ ...prev, upbringing: value }))
          }>
            <SelectTrigger>
              <SelectValue placeholder="Select where you grew up (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="city">I grew up in a city</SelectItem>
              <SelectItem value="town-suburb">I grew up in a town / suburb</SelectItem>
              <SelectItem value="rural">I grew up in a rural area</SelectItem>
              <SelectItem value="moved-around">I moved around growing up</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Do you identify as disabled or having a disability?
          </label>
          <Select value={formData.disability} onValueChange={(value) => 
            setFormData(prev => ({ ...prev, disability: value }))
          }>
            <SelectTrigger>
              <SelectValue placeholder="Select disability status (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Would you consider yourself to be from a low income household?
          </label>
          <Select value={formData.lowIncome} onValueChange={(value) => 
            setFormData(prev => ({ ...prev, lowIncome: value }))
          }>
            <SelectTrigger>
              <SelectValue placeholder="Select income background (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Were you eligible for Free School Meals whilst at school?
          </label>
          <Select value={formData.freeMeals} onValueChange={(value) => 
            setFormData(prev => ({ ...prev, freeMeals: value }))
          }>
            <SelectTrigger>
              <SelectValue placeholder="Select free school meals status (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            If you attend or attended university, were you the first generation in your family to go to university?
          </label>
          <Select value={formData.firstGenUniversity} onValueChange={(value) => 
            setFormData(prev => ({ ...prev, firstGenUniversity: value }))
          }>
            <SelectTrigger>
              <SelectValue placeholder="Select first generation status (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
              <SelectItem value="not-applicable">Not applicable</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Are you a first or second generation immigrant?
          </label>
          <Select value={formData.immigrant} onValueChange={(value) => 
            setFormData(prev => ({ ...prev, immigrant: value }))
          }>
            <SelectTrigger>
              <SelectValue placeholder="Select immigration status (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of birth (optional)
          </label>
          <Input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Are you part of the LGBTQIA+ community?
          </label>
          <Select value={formData.lgbtqia} onValueChange={(value) => 
            setFormData(prev => ({ ...prev, lgbtqia: value }))
          }>
            <SelectTrigger>
              <SelectValue placeholder="Select LGBTQIA+ status (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Do you require sponsorship to work in the UK, either now or in the future?
          </label>
          <Select value={formData.visaRequirements} onValueChange={(value) => 
            setFormData(prev => ({ ...prev, visaRequirements: value }))
          }>
            <SelectTrigger>
              <SelectValue placeholder="Select visa status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no">No</SelectItem>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="unsure">Not sure</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.visaRequirements === 'yes' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Please let us know more details of your visa requirements
            </label>
            <Textarea
              placeholder="Please provide details about your visa situation..."
              value={formData.visaDetails}
              onChange={(e) => setFormData(prev => ({ ...prev, visaDetails: e.target.value }))}
              rows={3}
            />
          </div>
        )}
      </div>

      <div className="flex gap-4 justify-center">
        {canSkip && onSkip && (
          <Button variant="outline" onClick={onSkip} size="lg">
            Skip this section
          </Button>
        )}
        <Button onClick={handleSubmit} size="lg">
          Continue
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

function SkillsVerificationStep({ onComplete, onSkip, canSkip }: { 
  onComplete: (data: any) => void;
  onSkip?: () => void;
  canSkip?: boolean;
}) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <Trophy className="w-8 h-8 text-green-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Ready for Skills Challenges?</h2>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Based on your profile, we've selected personalised challenges that match your strengths. 
            You can complete these optional challenges to showcase your abilities to employers.
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 max-w-2xl mx-auto">
        <div className="text-center space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">What You'll Find:</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Personalized challenge recommendations
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Real-world business scenarios
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              Skills verification and scoring
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              Portfolio building opportunities
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        {canSkip && onSkip && (
          <Button variant="outline" onClick={onSkip} size="lg">
            Skip for now
          </Button>
        )}
        <Button onClick={() => window.location.href = '/skills-challenges'} size="lg">
          View My Personalized Challenges
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 mb-3">Want to explore the community first?</p>
        <Button 
          variant="ghost" 
          onClick={() => window.location.href = '/community'}
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        >
          Join the Community
          <Users className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function CompletionStep({ profileData }: { profileData: any }) {
  const [showFullProfile, setShowFullProfile] = useState(false);
  
  // Generate comprehensive profile data
  const behaviouralProfile = profileData?.behaviouralAssessment?.profile;
  const interests = profileData?.educationExperience?.favouriteSubjects || [];
  const careerInterests = profileData?.careerPreferences?.industryTypes || [];
  
  if (showFullProfile) {
    return <ProfilePreview profileData={profileData} onBack={() => setShowFullProfile(false)} />;
  }

  return (
    <div className="text-center space-y-8">
      <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
        <CheckCircle className="w-10 h-10 text-white" />
      </div>
      
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">Your Profile is Complete!</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          We've created a comprehensive behavioural and career profile based on your responses. 
          Here's a preview of your unique profile.
        </p>
      </div>

      {/* Quick Profile Preview */}
      {behaviouralProfile && (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Behavioural & Skills Analysis</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <BehaviouralRadarChart 
                data={behaviouralProfile.behaviouralDimensions || {
                  drive: 75, influence: 65, steadiness: 80, 
                  compliance: 70, creativity: 85, leadership: 60
                }}
                size="sm"
                title="Behavioural Profile"
              />
            </div>
            <div>
              <SkillsRadarChart 
                data={generateSkillsProfile(behaviouralProfile)}
                size="sm"
                title="Skills Assessment"
              />
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              <strong>Top Strengths:</strong> {behaviouralProfile.insights?.strengths?.slice(0, 2).join(', ') || 'Well-rounded profile'}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-4 justify-center">
        <Button 
          variant="outline" 
          onClick={() => setShowFullProfile(true)}
          size="lg"
        >
          View Full Profile
          <User className="ml-2 h-5 w-5" />
        </Button>
        <Button size="lg" onClick={() => window.location.href = '/job-recommendations'}>
          View My Matches
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        <Button size="lg" variant="outline" onClick={() => window.location.href = '/skills-challenges'}>
          Browse Challenges
          <Trophy className="ml-2 h-5 w-5" />
        </Button>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 mb-3">Not ready for challenges yet?</p>
        <Button 
          variant="ghost" 
          onClick={() => window.location.href = '/community'}
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        >
          Explore the Community
          <Users className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Star className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold">Smart Matching</h3>
          <p className="text-sm text-gray-600">Get matched to jobs that fit your profile</p>
        </div>
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <Trophy className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold">Skill Verification</h3>
          <p className="text-sm text-gray-600">Showcase your abilities through challenges</p>
        </div>
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-semibold">Direct Applications</h3>
          <p className="text-sm text-gray-600">Apply directly to interested employers</p>
        </div>
      </div>
    </div>
  );
}

function ProfilePreview({ profileData, onBack }: { profileData: any; onBack: () => void }) {
  const behaviouralProfile = profileData?.behaviouralAssessment?.profile;
  const personalBackground = profileData?.personalBackground;
  const careerPreferences = profileData?.careerPreferences;
  const educationExperience = profileData?.educationExperience;

  const getProfileColor = (profile: string) => {
    switch (profile?.toLowerCase()) {
      case 'red': return 'from-red-500 to-orange-500';
      case 'yellow': return 'from-yellow-400 to-orange-400';
      case 'green': return 'from-green-500 to-emerald-500';
      case 'blue': return 'from-blue-500 to-indigo-500';
      default: return 'from-purple-500 to-blue-500';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className={`bg-gradient-to-br ${getProfileColor(behaviouralProfile?.primary)} rounded-2xl p-8 text-white relative overflow-hidden`}>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onBack}
          className="absolute top-4 left-4 bg-white/20 border-white/30 text-white hover:bg-white/30"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        <div className="text-center space-y-4">
          <div className="mx-auto w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
            <User className="w-12 h-12 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Your Pollen Profile</h1>
            <p className="text-white/90">Ready to bloom in your career</p>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
          <div className="w-full h-full rounded-full border-8 border-white transform translate-x-1/2 -translate-y-1/2"></div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Personal Insights */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-2 border-blue-100">
            <CardHeader className="pb-4">
              <CardTitle className="text-teal-600 flex items-center gap-2">
                <Heart className="w-5 h-5" />
                MOST HAPPY WHEN...
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                {personalBackground?.happinessSource || "I love connecting with people and working on meaningful projects that make a difference."}
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-100">
            <CardHeader className="pb-4">
              <CardTitle className="text-teal-600 flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                MOST PROUD OF...
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                {personalBackground?.proudMoment || "Overcoming challenges and continuously learning new skills to grow both personally and professionally."}
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-100">
            <CardHeader className="pb-4">
              <CardTitle className="text-teal-600 flex items-center gap-2">
                <Users className="w-5 h-5" />
                DESCRIBED AS...
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <span className="font-medium">By friends:</span> {getPersonalityDescriptor(behaviouralProfile?.primary)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-100">
            <CardHeader className="pb-4">
              <CardTitle className="text-teal-600 flex items-center gap-2">
                <Target className="w-5 h-5" />
                PERFECT JOB IS...
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                {careerPreferences?.idealJobDescription || 
                 `A role that combines ${behaviouralProfile?.insights?.workStyle?.toLowerCase()} work with opportunities for ${behaviouralProfile?.insights?.learningPreference?.toLowerCase()}, where I can contribute through ${behaviouralProfile?.insights?.teamContribution?.toLowerCase()}.`}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Middle Column - Behavioral Profile */}
        <div className="lg:col-span-1 space-y-6">
          <div>
            <DiscRadarChart 
              data={behaviouralProfile?.discScores || {
                red: 25, yellow: 25, green: 25, blue: 25
              }}
              title="DISC Profile"
            />
          </div>

          <Card className="border-2 border-indigo-100">
            <CardHeader className="pb-4">
              <CardTitle className="text-center text-teal-600">BEHAVIORAL INSIGHTS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Work Style</h4>
                <p className="text-sm text-gray-600">{behaviouralProfile?.insights?.workStyle}</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Communication</h4>
                <p className="text-sm text-gray-600">{behaviouralProfile?.insights?.communicationStyle}</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Team Contribution</h4>
                <p className="text-sm text-gray-600">{behaviouralProfile?.insights?.teamContribution}</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Key Strengths</h4>
                <div className="flex flex-wrap gap-1">
                  {behaviouralProfile?.insights?.strengths?.slice(0, 3).map((strength: string, idx: number) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {strength}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-cyan-100">
            <CardHeader className="pb-4">
              <CardTitle className="text-teal-600">INTERESTS PROFILE</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Favourite subjects...</h4>
                <div className="flex flex-wrap gap-2">
                  {educationExperience?.favouriteSubjects?.slice(0, 6).map((subject: string, idx: number) => (
                    <span key={idx} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                      {subject}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Interested in roles in...</h4>
                <div className="flex flex-wrap gap-2">
                  {careerPreferences?.industryTypes?.slice(0, 6).map((industry: string, idx: number) => (
                    <span key={idx} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                      {industry}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Skills Profile */}
        <div className="lg:col-span-1 space-y-6">
          <div>
            <SkillsRadarChart 
              data={generateSkillsProfile(behaviouralProfile)}
              title="Skills Analysis"
            />
          </div>

          <Card className="border-2 border-green-100">
            <CardHeader className="pb-4">
              <CardTitle className="text-teal-600">DEVELOPMENT OPPORTUNITIES</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Growth Areas</h4>
                <div className="space-y-2">
                  {behaviouralProfile?.insights?.developmentAreas?.map((area: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-400 rounded-full" />
                      <span className="text-sm text-gray-600">{area}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Learning Style</h4>
                <p className="text-sm text-gray-600">{behaviouralProfile?.insights?.learningPreference}</p>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <Button variant="outline" className="w-full">
                  Take Skills Challenges
                  <Plus className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function generateBehavioralInsights(discScores: { [key: string]: number }, traitCounts: { [key: string]: number }) {
  // Calculate percentages for easier interpretation
  const total = (Object.values(discScores) as number[]).reduce((sum: number, score: number) => sum + score, 0);
  const percentages = Object.entries(discScores).reduce((acc, [key, value]) => {
    acc[key] = total > 0 ? Math.round((value / total) * 100) : 0;
    return acc;
  }, {} as { [key: string]: number });

  // Determine dominant traits
  const topTraits = Object.entries(traitCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([trait]) => trait);

  // Generate insights based on DISC profile
  const insights = {
    workStyle: generateWorkStyleInsight(percentages),
    communicationStyle: generateCommunicationInsight(percentages),
    strengths: generateStrengths(topTraits, percentages),
    developmentAreas: generateDevelopmentAreas(percentages),
    idealEnvironment: generateIdealEnvironment(percentages),
    motivators: generateMotivators(percentages)
  };

  return insights;
}

function generateWorkStyleInsight(percentages: { [key: string]: number }): string {
  const { red, yellow, green, blue } = percentages;
  
  if (red >= 40) return "Results-driven and action-oriented - thrives on challenges and achieving goals";
  if (yellow >= 40) return "People-focused and energetic - brings enthusiasm and creativity to teams";
  if (green >= 40) return "Collaborative and supportive - values harmony and team success";
  if (blue >= 40) return "Analytical and thorough - focuses on quality and systematic approaches";
  return "Balanced and adaptable - can adjust approach based on situation needs";
}

function generateCommunicationInsight(percentages: { [key: string]: number }): string {
  const { red, yellow, green, blue } = percentages;
  
  if (yellow >= 40) return "Engaging and expressive - naturally connects with others through enthusiasm";
  if (red >= 40) return "Direct and decisive - communicates with clarity and confidence";
  if (green >= 40) return "Supportive and diplomatic - builds consensus through active listening";
  if (blue >= 40) return "Detailed and thoughtful - provides comprehensive and accurate information";
  return "Adaptive communicator - adjusts style to match the audience and situation";
}

function generateStrengths(topTraits: string[], percentages: { [key: string]: number }): string[] {
  const strengths = [];
  
  if (topTraits.includes('collaborative')) strengths.push("Team collaboration and consensus building");
  if (topTraits.includes('analytical')) strengths.push("Problem analysis and systematic thinking");
  if (topTraits.includes('creative')) strengths.push("Innovation and creative problem solving");
  if (topTraits.includes('decisive')) strengths.push("Quick decision making and action orientation");
  if (topTraits.includes('empathetic')) strengths.push("Understanding others and building relationships");
  if (topTraits.includes('thorough')) strengths.push("Attention to detail and quality focus");
  
  // Add based on DISC percentages
  if (percentages.red >= 30) strengths.push("Goal achievement and results delivery");
  if (percentages.yellow >= 30) strengths.push("Enthusiasm and positive energy");
  if (percentages.green >= 30) strengths.push("Reliability and steady performance");
  if (percentages.blue >= 30) strengths.push("Accuracy and systematic approach");
  
  return strengths.slice(0, 4); // Limit to top 4 strengths
}

function generateDevelopmentAreas(percentages: { [key: string]: number }): string[] {
  const areas = [];
  
  if (percentages.red < 20) areas.push("Taking initiative and driving results");
  if (percentages.yellow < 20) areas.push("Building relationships and team engagement");
  if (percentages.green < 20) areas.push("Patience and collaborative problem solving");
  if (percentages.blue < 20) areas.push("Attention to detail and systematic planning");
  
  return areas.slice(0, 2); // Focus on top 2 development areas
}

function generateIdealEnvironment(percentages: { [key: string]: number }): string[] {
  const environment = [];
  
  if (percentages.red >= 30) environment.push("Fast-paced with clear goals and autonomy");
  if (percentages.yellow >= 30) environment.push("Collaborative with opportunities for creativity");
  if (percentages.green >= 30) environment.push("Supportive with stable processes and teamwork");
  if (percentages.blue >= 30) environment.push("Structured with time for thorough analysis");
  
  return environment;
}

function generateMotivators(percentages: { [key: string]: number }): string[] {
  const motivators = [];
  
  if (percentages.red >= 30) motivators.push("Achievement and results recognition");
  if (percentages.yellow >= 30) motivators.push("Social interaction and creative expression");
  if (percentages.green >= 30) motivators.push("Team harmony and helping others succeed");
  if (percentages.blue >= 30) motivators.push("Quality work and expertise development");
  
  return motivators;
}

function calculateBehavioralProfile(responses: { [key: string]: any }) {
  // Enhanced DISC profile calculation with trait counting
  const traitCounts: { [key: string]: number } = {};
  const dimensionScores: { [key: string]: number } = {};

  // Count all traits from responses
  Object.values(responses).forEach((response: any) => {
    if (response.traits) {
      response.traits.forEach((trait: string) => {
        traitCounts[trait] = (traitCounts[trait] || 0) + 1;
      });
    }
  });

  // Calculate DISC scores based on trait patterns
  const discScores = {
    red: 0,    // Dominance - direct, decisive, results-focused
    yellow: 0, // Influence - social, enthusiastic, optimistic  
    green: 0,  // Steadiness - supportive, collaborative, stable
    blue: 0    // Conscientiousness - analytical, systematic, thorough
  };

  // Map traits to DISC dimensions
  const redTraits = ['direct', 'decisive', 'results_focused', 'action_oriented', 'competitive', 'bold', 'confident', 'leadership_oriented'];
  const yellowTraits = ['social', 'enthusiastic', 'creative', 'optimistic', 'innovative', 'energetic', 'positive', 'inspiring'];
  const greenTraits = ['collaborative', 'supportive', 'harmonious', 'team_oriented', 'steady', 'reliable', 'empathetic', 'patient'];
  const blueTraits = ['analytical', 'systematic', 'thorough', 'methodical', 'cautious', 'detailed', 'organised', 'quality_focused'];

  // Calculate scores
  Object.entries(traitCounts).forEach(([trait, count]) => {
    if (redTraits.includes(trait)) discScores.red += count;
    if (yellowTraits.includes(trait)) discScores.yellow += count;
    if (greenTraits.includes(trait)) discScores.green += count;
    if (blueTraits.includes(trait)) discScores.blue += count;
  });

  // Determine primary and secondary profiles
  const sortedScores = Object.entries(discScores).sort((a, b) => b[1] - a[1]);
  const primary = sortedScores[0][0];
  const secondary = sortedScores[1][0];

  // Generate comprehensive behavioural insights
  const profileInsights = generateBehavioralInsights(discScores, traitCounts);

  return {
    discScores,
    primary,
    secondary,
    traits: Object.keys(traitCounts),
    traitCounts,
    insights: profileInsights,
    completedAt: new Date().toISOString(),
    questionCount: ENHANCED_BEHAVIORAL_QUESTIONS.length
  };
}

function generateBehavioralAnalysis(dimensions: { [key: string]: number }, traitCounts: { [key: string]: number }) {
  return {
    workStyle: analyseWorkStyle(dimensions),
    communicationStyle: analyseCommunicationStyle(dimensions),
    problemSolving: analyseProblemSolving(dimensions),
    teamContribution: analyseTeamContribution(dimensions),
    learningPreference: analyseLearningPreference(dimensions, traitCounts),
    stressManagement: analyseStressManagement(dimensions),
    motivationDrivers: analyseMotivationDrivers(dimensions),
    strengths: identifyStrengths(dimensions),
    developmentAreas: identifyDevelopmentAreas(dimensions)
  };
}

function analyseWorkStyle(dimensions: { [key: string]: number }): string {
  const { drive, influence, steadiness, compliance, creativity } = dimensions;
  
  if (drive >= 70 && compliance >= 60) return "Strategic executor - combines drive with systematic approach";
  if (influence >= 70 && creativity >= 60) return "Innovative collaborator - brings creative energy to teams";
  if (steadiness >= 70 && compliance >= 60) return "Reliable specialist - delivers consistent, quality work";
  if (drive >= 70) return "Results-driven - focused on achieving goals efficiently";
  if (influence >= 70) return "People-focused - energizes and connects with others";
  if (creativity >= 70) return "Innovation-oriented - thrives on new ideas and approaches";
  return "Balanced approach - adapts style to situation needs";
}

function analyseCommunicationStyle(dimensions: { [key: string]: number }): string {
  const { drive, influence, steadiness, compliance } = dimensions;
  
  if (influence >= 70) return "Engaging and persuasive - naturally connects with others";
  if (drive >= 70) return "Direct and decisive - gets straight to the point";
  if (steadiness >= 70) return "Supportive and collaborative - builds consensus";
  if (compliance >= 70) return "Detailed and thorough - provides comprehensive information";
  return "Adaptive communicator - adjusts style to audience";
}

function analyseProblemSolving(dimensions: { [key: string]: number }): string {
  const { drive, creativity, compliance, steadiness } = dimensions;
  
  if (creativity >= 70 && drive >= 60) return "Innovative and action-oriented";
  if (compliance >= 70 && steadiness >= 60) return "Systematic and collaborative";
  if (drive >= 70) return "Quick and decisive";
  if (creativity >= 70) return "Creative and exploratory";
  return "Methodical and thoughtful";
}

function analyseTeamContribution(dimensions: { [key: string]: number }): string {
  const { leadership, influence, steadiness, creativity } = dimensions;
  
  if (leadership >= 70) return "Natural leader - guides and motivates teams";
  if (influence >= 70) return "Team energizer - builds relationships and morale";
  if (steadiness >= 70) return "Team stabilizer - provides support and reliability";
  if (creativity >= 70) return "Innovation catalyst - introduces new ideas and approaches";
  return "Versatile contributor - adapts role to team needs";
}

function analyseLearningPreference(dimensions: { [key: string]: number }, traits: { [key: string]: number }): string {
  const { creativity, compliance, influence, drive } = dimensions;
  
  if (creativity >= 70) return "Experiential and exploratory learning";
  if (influence >= 70) return "Social and discussion-based learning";
  if (compliance >= 70) return "Structured and research-based learning";
  if (drive >= 70) return "Practical and application-focused learning";
  return "Multi-modal learning approach";
}

function analyseStressManagement(dimensions: { [key: string]: number }): string {
  const { drive, steadiness, compliance, influence } = dimensions;
  
  if (drive >= 70) return "Action-oriented - tackles stress head-on";
  if (influence >= 70) return "Social support - seeks connection with others";
  if (steadiness >= 70) return "Steady approach - maintains calm and routine";
  if (compliance >= 70) return "Analytical - plans and prepares systematically";
  return "Balanced stress management approach";
}

function analyseMotivationDrivers(dimensions: { [key: string]: number }): string {
  const { drive, influence, creativity, leadership } = dimensions;
  
  if (drive >= 70 && leadership >= 60) return "Achievement and leadership";
  if (influence >= 70) return "Relationships and social impact";
  if (creativity >= 70) return "Innovation and self-expression";
  if (leadership >= 70) return "Vision and guiding others";
  return "Growth and continuous improvement";
}

function identifyStrengths(dimensions: { [key: string]: number }): string[] {
  const strengths = [];
  if (dimensions.drive >= 70) strengths.push("Results-oriented execution");
  if (dimensions.influence >= 70) strengths.push("People engagement and motivation");
  if (dimensions.steadiness >= 70) strengths.push("Reliability and team support");
  if (dimensions.compliance >= 70) strengths.push("Quality and attention to detail");
  if (dimensions.creativity >= 70) strengths.push("Innovation and adaptability");
  if (dimensions.leadership >= 70) strengths.push("Vision and team guidance");
  
  return strengths.length > 0 ? strengths : ["Well-rounded and adaptable"];
}

function identifyDevelopmentAreas(dimensions: { [key: string]: number }): string[] {
  const areas = [];
  if (dimensions.drive < 50) areas.push("Building assertiveness and initiative");
  if (dimensions.influence < 50) areas.push("Enhancing communication and social skills");
  if (dimensions.steadiness < 50) areas.push("Developing patience and team collaboration");
  if (dimensions.compliance < 50) areas.push("Improving attention to detail and quality");
  if (dimensions.creativity < 50) areas.push("Exploring innovation and new approaches");
  if (dimensions.leadership < 50) areas.push("Building leadership and decision-making skills");
  
  return areas.slice(0, 3); // Return top 3 development areas
}

// Helper functions for profile display
function getProfileLabel(profile: string): string {
  switch (profile?.toLowerCase()) {
    case 'red': return 'Decisive';
    case 'yellow': return 'Enthusiastic';
    case 'green': return 'Steady';
    case 'blue': return 'Analytical';
    default: return 'Balanced';
  }
}

function getProfileTraits(profile: string): string[] {
  switch (profile?.toLowerCase()) {
    case 'red':
      return [
        'Results-oriented leader who takes charge',
        'Direct communicator who values efficiency',
        'Thrives in fast-paced, challenging environments'
      ];
    case 'yellow':
      return [
        'Creative team player who values relationships',
        'Enthusiastic communicator who inspires others',
        'Brings energy and innovation to projects'
      ];
    case 'green':
      return [
        'Collaborative team player who values harmony',
        'Supportive communicator who listens well',
        'Creates stability and builds strong relationships'
      ];
    case 'blue':
      return [
        'Analytical thinker who values accuracy',
        'Detail-oriented with a keen eye for precision',
        'Thrives on structured and methodical approaches'
      ];
    default:
      return ['Adaptable and well-rounded', 'Brings multiple strengths to teams'];
  }
}

function getPersonalityDescriptor(profile: string): string {
  switch (profile?.toLowerCase()) {
    case 'red': return 'Determined, confident, natural leader';
    case 'yellow': return 'Creative, optimistic, energetic';
    case 'green': return 'Supportive, reliable, team-oriented';
    case 'blue': return 'Thoughtful, methodical, detail-focused';
    default: return 'Well-rounded, adaptable, balanced';
  }
}

function calculateCombinedScore(profile: any): number {
  if (!profile) return 85;
  // Calculate based on completeness and strength of profile
  const baseScore = 80;
  const bonusPoints = Object.keys(profile.traits || {}).length * 2;
  return Math.min(baseScore + bonusPoints, 95);
}

function generateSkillsProfile(behaviouralProfile: any) {
  if (!behaviouralProfile?.behaviouralDimensions) {
    return {
      communication: 85,
      problemSolving: 80,
      teamwork: 85,
      leadership: 75,
      technical: 70,
      adaptability: 80
    };
  }

  const dimensions = behaviouralProfile.behaviouralDimensions;
  
  return {
    communication: Math.round((dimensions.influence * 0.6 + dimensions.steadiness * 0.4)),
    problemSolving: Math.round((dimensions.creativity * 0.5 + dimensions.compliance * 0.3 + dimensions.drive * 0.2)),
    teamwork: Math.round((dimensions.steadiness * 0.6 + dimensions.influence * 0.4)),
    leadership: Math.round((dimensions.leadership * 0.7 + dimensions.drive * 0.3)),
    technical: Math.round((dimensions.compliance * 0.6 + dimensions.creativity * 0.4)),
    adaptability: Math.round((dimensions.creativity * 0.6 + dimensions.influence * 0.4))
  };
}