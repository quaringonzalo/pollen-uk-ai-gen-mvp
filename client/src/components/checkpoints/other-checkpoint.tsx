import ProgressiveForm from "@/components/progressive-form";

interface OtherCheckpointProps {
  onComplete: (data: any) => void;
  onSaveAndExit?: (data: any) => void;
  initialData?: any;
}

const FORM_FIELDS = [
  {
    id: 'reasonable_adjustments',
    type: 'textarea' as const,
    label: 'Are there any reasonable adjustments we need to make for you?',
    required: false,
    placeholder: 'Please describe any accommodations you need for interviews or work...',
    helpText: 'This is relevant for disabled, neurodivergent or sensory impaired candidates - helps us and employers provide appropriate support'
  },
  {
    id: 'how_heard_about_us',
    type: 'select' as const,
    label: 'How did you hear about us?',
    required: true,
    options: [
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
    ],
    helpText: 'This helps us understand how people discover our platform'
  }
];

export function OtherCheckpoint({ 
  onComplete, 
  onSaveAndExit, 
  initialData = {} 
}: OtherCheckpointProps) {
  return (
    <ProgressiveForm
      title="Other"
      description="A couple of final questions to help us support you better"
      fields={FORM_FIELDS}
      onComplete={onComplete}
      onSaveAndExit={onSaveAndExit}
      initialData={initialData}
      completionButtonText="Complete Profile"
      isOptional={true}
    />
  );
}