import ProgressiveForm from "@/components/progressive-form";

interface PersonalInfoCheckpointProps {
  onComplete: (data: any) => void;
  onSaveAndExit?: (data: any) => void;
  initialData?: any;
}

const FORM_FIELDS = [
  {
    id: 'gender_identity',
    type: 'select' as const,
    label: 'Gender Identity',
    required: false,
    options: [
      "Male",
      "Female",
      "Non-binary", 
      "Other",
      "Prefer not to say"
    ],
    helpText: 'This helps us understand gender representation in our community'
  },
  {
    id: 'ethnicity',
    type: 'select' as const,
    label: 'Ethnicity',
    required: false,
    options: [
      "Black, Black British, Caribbean or African",
      "Asian or Asian British",
      "White",
      "Multi-racial / Multi-ethnic",
      "Other",
      "Prefer not to say"
    ],
    helpText: 'This helps us understand ethnic representation in our community'
  },
  {
    id: 'upbringing_type',
    type: 'select' as const,
    label: 'Where did you spend most of your childhood?',
    required: false,
    options: [
      "I grew up in a city",
      "I grew up in a town or suburb",
      "I grew up in a rural area",
      "I moved around a lot growing up",
      "I grew up outside of the UK",
      "Other"
    ],
    helpText: 'This helps us understand different backgrounds and experiences'
  },
  {
    id: 'disability_status',
    type: 'select' as const,
    label: 'Do you identify as disabled or having a physical disability?',
    required: false,
    options: [
      "Yes",
      "No",
      "Prefer not to say"
    ],
    helpText: 'This helps us understand representation and build inclusive practices'
  },
  {
    id: 'neurodivergent_status',
    type: 'select' as const,
    label: 'Do you identify as being neurodivergent?',
    required: false,
    options: [
      "Yes (diagnosed)",
      "Yes (self-identified)",
      "No",
      "Not sure",
      "Prefer not to say"
    ],
    helpText: 'This includes conditions like ADHD, autism, dyslexia, etc.'
  },
  {
    id: 'mental_health_challenges',
    type: 'select' as const,
    label: 'Do you experience mental health challenges?',
    required: false,
    options: [
      "Yes",
      "No", 
      "Prefer not to say"
    ],
    helpText: 'This helps us understand representation and impact in our community'
  },
  {
    id: 'low_income_household',
    type: 'select' as const,
    label: 'Would you consider yourself to be from a low income household?',
    required: false,
    options: [
      "Yes",
      "No",
      "Prefer not to say"
    ],
    helpText: 'This helps us understand socioeconomic representation in our community'
  },
  {
    id: 'free_school_meals',
    type: 'select' as const,
    label: 'Were you eligible for Free School Meals while at school?',
    required: false,
    options: [
      "Yes",
      "No",
      "Prefer not to say"
    ],
    helpText: 'This helps us understand socioeconomic representation in our community'
  },
  {
    id: 'secondary_education_background',
    type: 'select' as const,
    label: 'What best describes your secondary education background?',
    required: false,
    options: [
      "I went to a fee-paying school",
      "I went to a state school",
      "I studied outside of the UK",
      "Other"
    ],
    helpText: 'This helps us understand socioeconomic representation in our community'
  },
  {
    id: 'first_generation_university',
    type: 'select' as const,
    label: 'If you attend or attended university, were you the first generation in your family to go to university?',
    required: false,
    options: [
      "Yes",
      "No",
      "Prefer not to say",
      "Not applicable"
    ],
    helpText: 'This helps us understand socioeconomic representation in our community'
  },
  {
    id: 'immigration_status',
    type: 'select' as const,
    label: 'Are you a first or second generation immigrant?',
    required: false,
    options: [
      "Yes",
      "No",
      "Prefer not to say"
    ],
    helpText: 'This helps us understand cultural diversity'
  },
  {
    id: 'date_of_birth',
    type: 'text' as const,
    label: 'Date of Birth',
    required: false,
    placeholder: 'DD/MM/YYYY',
    helpText: 'This helps us understand age demographics'
  },
  {
    id: 'lgbtqia_community',
    type: 'select' as const,
    label: 'Are you part of the LGBTQIA+ community?',
    required: false,
    options: [
      "Yes",
      "No",
      "Prefer not to say"
    ],
    helpText: 'This helps us understand representation in our community'
  }
];

export function PersonalInfoCheckpoint({ 
  onComplete, 
  onSaveAndExit, 
  initialData = {} 
}: PersonalInfoCheckpointProps) {
  return (
    <ProgressiveForm
      title="Supporting Diversity"
      description="This information is optional and used only for research and diversity monitoring. It is never shared with employers."
      fields={FORM_FIELDS}
      onComplete={onComplete}
      onSaveAndExit={onSaveAndExit}
      initialData={initialData}
    />
  );
}