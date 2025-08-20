import ProgressiveForm from "@/components/progressive-form";

interface JobSearchExperienceCheckpointProps {
  onComplete: (data: any) => void;
  onSaveAndExit?: (data: any) => void;
  initialData?: any;
}

const FORM_FIELDS = [
  {
    id: 'current_employment_status',
    type: 'select' as const,
    label: 'What is your current employment status?',
    required: true,
    options: [
      "Currently unemployed and job hunting",
      "Currently employed (looking for a change)",
      "Student", 
      "Recent graduate",
      "Career break / gap year",
      "Self-employed / freelance",
      "Career changer (switching industries)",
      "Other"
    ],
    helpText: 'This helps us understand your current situation'
  },
  {
    id: 'job_search_duration',
    type: 'select' as const,
    label: 'How long have you been looking for a job?',
    required: true,
    options: [
      "Just started",
      "1-3 months",
      "3-6 months", 
      "6-12 months",
      "More than a year",
      "Not actively looking"
    ],
    helpText: 'This helps us understand your job search timeline'
  },
  {
    id: 'weekly_applications',
    type: 'select' as const,
    label: 'How many jobs do you apply to a week?',
    required: true,
    options: [
      "0-2",
      "3-5",
      "6-10",
      "11-20",
      "More than 20"
    ],
    helpText: 'This shows us your application activity level'
  },
  {
    id: 'important_job_factors',
    type: 'multiselect' as const,
    label: 'What factors do you consider important when applying for a job?',
    required: true,
    options: [
      "Salary",
      "Location",
      "Company culture",
      "Career development",
      "Work-life balance",
      "Job security",
      "Benefits",
      "Company reputation",
      "Role responsibilities",
      "Team environment",
      "Flexibility",
      "Other"
    ],
    helpText: 'Select all factors that matter to you'
  },
  {
    id: 'pollen_signup_reasons',
    type: 'multiselect' as const,
    label: 'What were the main reasons you signed up to Pollen?',
    required: true,
    options: [
      "Access resources that make job hunting easier",
      "Find a job",
      "Learn about alternative careers",
      "Guidance/support",
      "Join a community of like-minded people",
      "CV-less job applications",
      "Other"
    ],
    helpText: 'This helps us understand what drew you to our platform'
  },
  {
    id: 'traditional_job_search_frustrations',
    type: 'multiselect' as const,
    label: 'What frustrates you the most about the traditional job seeking process?',
    required: true,
    options: [
      "CV formatting",
      "Lack of feedback",
      "Long application processes",
      "Irrelevant job suggestions",
      "Experience requirements",
      "Unclear job descriptions",
      "No response from employers",
      "Interview process",
      "Other"
    ],
    helpText: 'Select all that apply - this helps us improve the job search experience'
  },
  {
    id: 'job_search_experiences',
    type: 'textarea' as const,
    label: 'Could you elaborate more on your experiences of looking for a job?',
    required: false,
    placeholder: 'Share any specific challenges, successes, or insights from your job search journey...',
    helpText: 'Optional - your experiences help us understand how to better support job seekers'
  }
];

export function JobSearchExperienceCheckpoint({ 
  onComplete, 
  onSaveAndExit, 
  initialData = {} 
}: JobSearchExperienceCheckpointProps) {
  return (
    <ProgressiveForm
      title="Help Us Help You"
      description="Tell us about your job searching experiences and motivations"
      fields={FORM_FIELDS}
      onComplete={onComplete}
      onSaveAndExit={onSaveAndExit}
      initialData={initialData}
      isOptional={true}
    />
  );
}