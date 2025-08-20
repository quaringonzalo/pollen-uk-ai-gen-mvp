import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, ArrowLeft, ArrowRight } from "lucide-react";
import ProgressiveForm from "@/components/progressive-form";

const VISA_STATUS_OPTIONS = [
  "UK Citizen",
  "EU Citizen (settled status)",
  "EU Citizen (pre-settled status)", 
  "Visa holder (can work without restrictions)",
  "Student visa (limited work rights)",
  "Graduate visa",
  "Spouse/Partner visa",
  "Other work visa",
  "No current work authorization"
];

const TRAVEL_WILLINGNESS = [
  "Happy to travel regularly (weekly)",
  "Occasional travel is fine (monthly)",
  "Minimal travel preferred (few times per year)",
  "No travel"
];

interface BasicInfoCheckpointProps {
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
    label: 'What is your current UK work authorization status?',
    required: true,
    options: VISA_STATUS_OPTIONS,
    helpText: 'This helps us match you with appropriate opportunities'
  },
  {
    id: 'travel_willingness',
    type: 'select' as const,
    label: 'How do you feel about work-related travel?',
    required: true,
    options: TRAVEL_WILLINGNESS,
    helpText: 'Some roles may involve visiting clients or other offices'
  },
  {
    id: 'availability_date',
    type: 'text' as const,
    label: 'When are you available to start work?',
    required: true,
    placeholder: 'e.g. Immediately, June 2025, After graduation...',
    helpText: 'This helps employers understand your timeline'
  }
];

export function BasicInfoCheckpoint({ 
  onComplete, 
  onSaveAndExit, 
  initialData = {} 
}: BasicInfoCheckpointProps) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full mb-4">
          <div className="w-2 h-2 bg-green-600 rounded-full" />
          <span className="text-sm font-medium text-green-700">Basic Information</span>
        </div>
        <p className="text-sm text-gray-500">
          Essential information for job matching, compliance, and creating your profile.
        </p>
      </div>
      
      <ProgressiveForm
        title="Basic Information"
        description="Help us understand your work eligibility and availability"
        fields={FORM_FIELDS}
        onComplete={onComplete}
        onSaveAndExit={onSaveAndExit}
        initialData={initialData}
      />
    </div>
  );
}