import ProgressiveForm from "@/components/progressive-form";

interface InterestsPreferencesCheckpointProps {
  onComplete: (data: any) => void;
  onSaveAndExit?: (data: any) => void;
  initialData?: any;
}

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

const COURSES_SELF_LEARNING = [
  "Online courses (Coursera, Udemy, etc.)",
  "YouTube tutorials",
  "Self-taught coding/programming",
  "Self-taught design/creative skills",
  "Self-taught languages",
  "Self-taught music/instruments",
  "Self-taught crafts/hobbies",
  "Professional development courses",
  "Industry certifications",
  "None of the above"
];

const ROLE_TYPES = [
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

const INDUSTRIES = [
  "Technology & Software",
  "Healthcare & Medical",
  "Finance & Banking",
  "Education & Training",
  "Marketing & Advertising",
  "Retail & E-commerce",
  "Manufacturing & Engineering",
  "Media & Entertainment",
  "Non-profit & Social Impact",
  "Government & Public Service",
  "Hospitality & Tourism",
  "Real Estate & Property",
  "Transportation & Logistics",
  "Energy & Environment",
  "Legal & Professional Services",
  "Construction & Architecture",
  "Agriculture & Food",
  "Fashion & Beauty",
  "Sports & Recreation",
  "Other"
];

const COMPANY_SIZES = [
  "Startup (1-10 employees)",
  "Small business (11-50 employees)",
  "Medium company (51-250 employees)",
  "Large company (251-1000 employees)",
  "Enterprise/Corporation (1000+ employees)",
  "Government or public sector",
  "Non-profit organisation",
  "No preference"
];

const COMPANY_CULTURES = [
  "Fast-paced and dynamic",
  "Collaborative and team-focused",
  "Structured and organised",
  "Creative and innovative",
  "Supportive and nurturing",
  "Results-driven",
  "Flexible and autonomous",
  "Traditional and hierarchical",
  "Casual and relaxed",
  "Mission-driven",
  "No preference"
];

const FORM_FIELDS = [
  {
    id: 'favourite_subjects',
    type: 'multiselect' as const,
    label: 'What were your favourite subjects during education?',
    required: true,
    options: FAVORITE_SUBJECTS,
    helpText: 'Select all subjects you enjoyed - this helps us understand your interests'
  },
  {
    id: 'courses_self_learning',
    type: 'multiselect' as const,
    label: 'Have you done any courses or self learning you\'d like to share?',
    required: false,
    options: COURSES_SELF_LEARNING,
    helpText: 'Show us your self-motivation and learning initiatives'
  },
  {
    id: 'self_learning_details',
    type: 'textarea' as const,
    label: 'Tell us more about your learning experiences',
    required: false,
    conditional: {
      dependsOn: 'courses_self_learning',
      showWhen: COURSES_SELF_LEARNING.filter(option => option !== 'None of the above')
    },
    placeholder: 'Describe what you learned, what motivated you, and any achievements...',
    helpText: 'Give us more detail about your self-directed learning journey'
  },
  {
    id: 'role_types',
    type: 'multiselect' as const,
    label: 'Are there any types of roles that have caught your eye already?',
    required: true,
    options: ROLE_TYPES,
    helpText: 'Select all role types that interest you'
  },
  {
    id: 'industries',
    type: 'multiselect' as const,
    label: 'Which industries interest you most?',
    required: true,
    options: INDUSTRIES,
    helpText: 'Select all industries where you could see yourself working'
  },
  {
    id: 'company_size',
    type: 'multiselect' as const,
    label: 'What size of company interests you?',
    required: true,
    options: COMPANY_SIZES,
    helpText: 'Select all company sizes you would consider'
  },
  {
    id: 'company_culture',
    type: 'multiselect' as const,
    label: 'What type of company culture do you think you\'d prefer?',
    required: true,
    options: COMPANY_CULTURES,
    helpText: 'Select all cultural styles that appeal to you'
  }
];

export function InterestsPreferencesCheckpoint({ 
  onComplete, 
  onSaveAndExit, 
  initialData = {} 
}: InterestsPreferencesCheckpointProps) {
  return (
    <ProgressiveForm
      title="What Lights You Up"
      description="Tell us about your favourite subjects and learning experiences. Help us understand what kind of work and environments appeal to you."
      fields={FORM_FIELDS}
      onComplete={onComplete}
      onSaveAndExit={onSaveAndExit}
      initialData={initialData}
    />
  );
}