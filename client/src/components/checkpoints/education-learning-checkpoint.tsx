import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, ArrowLeft, ArrowRight } from "lucide-react";
import ProgressiveForm from "@/components/progressive-form";

// Education options from comprehensive onboarding
const EDUCATION_LEVELS = [
  "GCSE/O Levels",
  "A Levels/Scottish Highers",
  "BTEC/National Diploma", 
  "Apprenticeship",
  "Currently at University",
  "University Graduate",
  "Masters Degree",
  "PhD",
  "Professional Qualifications",
  "Other"
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

interface EducationLearningCheckpointProps {
  onComplete: (data: any) => void;
  onSaveAndExit?: (data: any) => void;
  initialData?: any;
}

const FORM_FIELDS = [
  {
    id: 'education_level',
    type: 'select' as const,
    label: 'What\'s the highest level of qualification you have received, or are currently working towards?',
    required: true,
    options: EDUCATION_LEVELS,
    validation: (value: string) => !value ? 'Please select your education level' : null
  },
  {
    id: 'institution_name',
    type: 'text' as const,
    label: 'Institution name',
    required: false,
    placeholder: 'e.g. University of Manchester, Manchester College, etc.'
  },
  {
    id: 'graduation_year',
    type: 'text' as const,
    label: 'When did/will you finish education? (if applicable)',
    required: false,
    placeholder: 'e.g. 2023, Currently studying, etc.'
  }
];

export function EducationLearningCheckpoint({ 
  onComplete, 
  onSaveAndExit, 
  initialData = {} 
}: EducationLearningCheckpointProps) {
  // Safety check for fields
  if (!FORM_FIELDS || FORM_FIELDS.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl text-center">
        <h2 className="text-2xl font-bold mb-4">Education & Learning</h2>
        <p className="text-gray-600 mb-4">This section is currently being updated.</p>
        <Button 
          onClick={() => window.location.href = "/profile-checkpoints"}
        >
          Return to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <ProgressiveForm
      title="Your Learning Journey"
      description="Help us understand your educational journey and interests. This information is for research purposes only and not used in job matching."
      fields={FORM_FIELDS}
      onComplete={onComplete}
      onSaveAndExit={onSaveAndExit}
      initialData={initialData}
      isOptional={true}
    />
  );
}