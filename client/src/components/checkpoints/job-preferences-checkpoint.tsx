import ProgressiveForm from "@/components/progressive-form";

interface JobPreferencesCheckpointProps {
  onComplete: (data: any) => void;
  onSaveAndExit?: (data: any) => void;
  initialData?: any;
}

const FORM_FIELDS = [
  {
    id: 'pronouns',
    type: 'select' as const,
    label: 'Pronouns',
    required: false,
    options: [
      "He/Him",
      "She/Her", 
      "They/Them",
      "Other",
      "Prefer not to say"
    ],
    helpText: 'This helps employers address you correctly'
  },
  {
    id: 'visa_status',
    type: 'select' as const,
    label: 'What is your right to work in the UK?',
    required: true,
    options: [
      "British citizen",
      "EU/EEA citizen (pre-settled/settled status)",
      "Work visa holder",
      "Student visa (with work rights)",
      "Post-study work visa / Graduate visa",
      "Other visa with work rights", 
      "No current right to work (will need sponsorship)"
    ],
    helpText: 'This helps employers understand any visa requirements'
  },
  {
    id: 'work_permit_expiry',
    type: 'text' as const,
    label: 'When does your work permit expire?',
    required: false,
    conditional: {
      dependsOn: 'visa_status',
      showWhen: ['Work visa holder', 'Student visa (with work rights)', 'Post-study work visa / Graduate visa', 'Other visa with work rights']
    },
    placeholder: 'e.g., March 2026',
    helpText: 'This helps employers plan for visa renewal requirements'
  },
  {
    id: 'employment_type_preferences',
    type: 'multiselect' as const,
    label: 'What type of employment are you looking for?',
    required: true,
    options: [
      "Full time",
      "Part time",
      "Temporary", 
      "Permanent",
      "Apprenticeship",
      "Internship",
      "Freelance / contract",
      "Other"
    ],
    helpText: 'Select all employment types you would consider'
  },
  {
    id: 'work_arrangements',
    type: 'multiselect' as const,
    label: 'What working arrangements would you consider?',
    required: true,
    options: [
      "Fully remote",
      "Hybrid (mix of remote and office)",
      "Fully in-office",
      "Flexible arrangements"
    ],
    helpText: 'Select all arrangements you would be comfortable with'
  },
  {
    id: 'desired_locations',
    type: 'multiselect' as const,
    label: 'Where would you like to work?',
    required: true,
    options: [
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
      "Open to relocation",
      "Other"
    ],
    helpText: 'Select all locations you would consider'
  },
  {
    id: 'minimum_salary',
    type: 'number' as const,
    label: 'What are your minimum salary expectations? (£)',
    required: false,
    placeholder: 'e.g., 25000',
    helpText: 'You will only be shown jobs that meet these minimum requirements. Leave blank if flexible.'
  },
  {
    id: 'start_availability',
    type: 'select' as const,
    label: 'When are you looking to start a job?',
    required: true,
    options: [
      "Immediately",
      "Within 2 weeks",
      "Within 1 month",
      "Within 2-3 months",
      "More than 3 months",
      "Flexible/not urgent"
    ],
    helpText: 'This helps employers understand your timeline'
  },
  {
    id: 'additional_skills',
    type: 'multiselect' as const,
    label: 'Do any of the following apply to you?',
    required: false,
    options: [
      "Full driving license",
      "Fluent in multiple languages", 
      "First aid certified",
      "DBS check completed",
      "None of the above"
    ]
  },
  {
    id: 'reasonable_adjustments',
    type: 'textarea' as const,
    label: 'Are there any reasonable adjustments we need to make for you?',
    required: false,
    placeholder: 'Please describe any accommodations you need for interviews or work...',
    helpText: 'This is relevant for disabled, neurodivergent or sensory impaired candidates - helps us and employers provide appropriate support'
  }
];

export function JobPreferencesCheckpoint({ 
  onComplete, 
  onSaveAndExit, 
  initialData = {} 
}: JobPreferencesCheckpointProps) {
  return (
    <ProgressiveForm
      title="The Practical Stuff"
      description="Tell us about your job preferences and expectations. This helps us show you the most relevant job opportunities."
      fields={FORM_FIELDS}
      onComplete={onComplete}
      onSaveAndExit={onSaveAndExit}
      initialData={initialData}
    />
  );
}