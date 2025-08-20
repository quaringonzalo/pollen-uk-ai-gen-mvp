import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Target, ArrowLeft, ArrowRight, CheckCircle, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface CareerInterestsCheckpointProps {
  onComplete: (data: any) => void;
  onSaveAndExit?: (data: any) => void;
  initialData?: any;
}

// Industry options from comprehensive onboarding
const INDUSTRY_OPTIONS = [
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
  "No idea! Help!",
  "Other"
];

// Role types from comprehensive onboarding
const EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time", 
  "Permanent",
  "Temporary",
  "Internship",
  "Apprenticeship",
  "No idea! Help!"
];

const WORK_ARRANGEMENTS = [
  "Remote",
  "Hybrid", 
  "In office"
];

const FAVORITE_SUBJECTS = [
  "Mathematics",
  "English Language & Literature", 
  "Sciences (Biology, Chemistry, Physics)",
  "Computer Science & IT",
  "Business & Management",
  "Psychology",
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
  "Engineering",
  "Marketing & Communications",
  "Other"
];

const FORM_FIELDS = [
  {
    id: 'industry_interests',
    label: 'Which industries interest you most?',
    helpText: 'Select all industries where you could see yourself working',
    icon: Target,
    type: 'multiselect',
    options: INDUSTRY_OPTIONS,
    required: true,
    validation: (value: string[]) => {
      if (!value || value.length === 0) return 'Please select at least one industry';
      return null;
    }
  },
  {
    id: 'employment_types',
    label: 'What type of employment are you interested in?',
    helpText: 'Select all employment types you would consider',
    icon: Target,
    type: 'multiselect', 
    options: EMPLOYMENT_TYPES,
    required: true,
    validation: (value: string[]) => {
      if (!value || value.length === 0) return 'Please select at least one employment type';
      return null;
    }
  },
  {
    id: 'courses_self_learning',
    label: 'Have you done any courses or self learning you\'d like to share?',
    helpText: 'Tell us about any learning you\'ve done outside of formal education',
    icon: Target,
    type: 'textarea',
    required: false,
    placeholder: 'e.g., "I completed a Python course on Codecademy and learned video editing through YouTube tutorials"'
  },
  {
    id: 'work_location_preference',
    label: 'What working arrangements would you consider?',
    helpText: 'Select all that apply',
    icon: Target,
    type: 'multiselect',
    options: WORK_ARRANGEMENTS,
    required: true,
    validation: (value: string[]) => {
      if (!value || value.length === 0) return 'Please select at least one working arrangement';
      return null;
    }
  },
  {
    id: 'favourite_subjects',
    label: 'What were your favourite subjects during education?',
    helpText: 'This helps us recommend roles that match your interests',
    icon: Target,
    type: 'multiselect',
    options: FAVORITE_SUBJECTS,
    required: false
  }
];

export function CareerInterestsCheckpoint({
  onComplete,
  onSaveAndExit,
  initialData = {}
}: CareerInterestsCheckpointProps) {
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0);
  const [completedFields, setCompletedFields] = useState<Set<string>>(new Set());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [allFieldsCompleted, setAllFieldsCompleted] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const saveProgressMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/checkpoint-progress", {
      checkpointId: "career-interests",
      data,
      phase: "profile"
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/checkpoint-progress"] });
    }
  });

  useEffect(() => {
    // Check which fields are completed on load
    const completed = new Set<string>();
    FORM_FIELDS.forEach(field => {
      const value = formData[field.id];
      const error = field.validation?.(value);
      if (!error && value !== undefined && value !== '' && 
          (Array.isArray(value) ? value.length > 0 : true)) {
        completed.add(field.id);
      }
    });
    setCompletedFields(completed);
    
    // If all fields completed, show completion state
    if (completed.size === FORM_FIELDS.length) {
      setAllFieldsCompleted(true);
    }
  }, [formData]);

  const handleValueChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: '' }));
    }
  };

  const validateCurrentField = () => {
    const currentField = FORM_FIELDS[currentFieldIndex];
    const value = formData[currentField.id];
    const error = currentField.validation?.(value);
    
    if (error) {
      setErrors(prev => ({ ...prev, [currentField.id]: error }));
      return false;
    }
    
    setCompletedFields(prev => new Set(Array.from(prev).concat([currentField.id])));
    return true;
  };

  const handleNext = () => {
    if (validateCurrentField()) {
      if (currentFieldIndex < FORM_FIELDS.length - 1) {
        setCurrentFieldIndex(prev => prev + 1);
      } else {
        setAllFieldsCompleted(true);
      }
    }
  };

  const handlePrevious = () => {
    if (currentFieldIndex > 0) {
      setCurrentFieldIndex(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    // Validate all fields
    let isValid = true;
    const newErrors: Record<string, string> = {};
    
    FORM_FIELDS.forEach(field => {
      const value = formData[field.id];
      const error = field.validation?.(value);
      if (error) {
        newErrors[field.id] = error;
        isValid = false;
      }
    });
    
    if (!isValid) {
      setErrors(newErrors);
      toast({
        title: "Please complete all required fields",
        variant: "destructive"
      });
      return;
    }

    // Save to database and complete
    saveProgressMutation.mutate(formData, {
      onSuccess: () => {
        onComplete(formData);
        toast({
          title: "Career interests saved!",
          description: "Your interests have been recorded successfully."
        });
      }
    });
  };

  const handleSaveAndExit = () => {
    saveProgressMutation.mutate(formData, {
      onSuccess: () => {
        onSaveAndExit?.(formData);
        toast({
          title: "Progress saved",
          description: "You can continue where you left off later."
        });
      }
    });
  };

  const progress = (completedFields.size / FORM_FIELDS.length) * 100;
  const currentField = FORM_FIELDS[currentFieldIndex];

  if (allFieldsCompleted) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold">Career interests completed!</h2>
            <p className="text-gray-600 mt-2">
              Great! We now understand what industries and roles interest you most.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-left">
            <div>
              <h4 className="font-medium text-sm text-gray-700">Industries of interest:</h4>
              <p className="text-sm text-gray-600">
                {formData.industry_interests?.join(', ') || 'Not specified'}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-gray-700">Role types:</h4>
              <p className="text-sm text-gray-600">
                {formData.role_types?.join(', ') || 'Not specified'}
              </p>
            </div>
            {formData.courses_and_learning && (
              <div>
                <h4 className="font-medium text-sm text-gray-700">Courses & learning:</h4>
                <p className="text-sm text-gray-600">
                  {formData.courses_and_learning}
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => window.location.href = "/profile-checkpoints"}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <Button onClick={() => window.location.href = "/profile-checkpoints"} disabled={saveProgressMutation.isPending}>
              Continue to Next Section
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Header */}
      <div className="text-center space-y-4 mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
          <div className="w-2 h-2 bg-blue-600 rounded-full" />
          <span className="text-sm font-medium text-blue-700">Career Interests</span>
        </div>
        
        <h1 className="text-3xl font-bold">Dream Job Exploration</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Help us understand what types of work excite you most so we can find the perfect opportunities.
        </p>
        
        <div className="flex items-center justify-center gap-4">
          <span className="text-sm text-gray-500">{completedFields.size} of {FORM_FIELDS.length} completed</span>
          <Progress value={progress} className="w-48 h-2" />
        </div>
      </div>

      {/* Current Field */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentField.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-2 border-blue-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${completedFields.has(currentField.id) ? 'bg-green-100' : 'bg-blue-100'}`}>
                  {completedFields.has(currentField.id) ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <currentField.icon className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg">{currentField.label}</h3>
                  <p className="text-sm text-gray-600 font-normal">{currentField.helpText}</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentField.type === 'multiselect' ? (
                /* Multi-select options */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentField.options?.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${currentField.id}-${option}`}
                        checked={formData[currentField.id]?.includes(option) || false}
                        onCheckedChange={(checked) => {
                          const currentValues = formData[currentField.id] || [];
                          const newValues = checked
                            ? [...currentValues, option]
                            : currentValues.filter((v: string) => v !== option);
                          handleValueChange(currentField.id, newValues);
                        }}
                      />
                      <label
                        htmlFor={`${currentField.id}-${option}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              ) : currentField.type === 'textarea' ? (
                /* Textarea field */
                <div className="space-y-2">
                  <textarea
                    className="w-full min-h-[120px] px-3 py-2 border border-gray-300 rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Completed a coding bootcamp in JavaScript, took online courses in digital marketing, self-taught Excel and data analysis..."
                    value={formData[currentField.id] || ''}
                    onChange={(e) => handleValueChange(currentField.id, e.target.value)}
                  />
                  <p className="text-sm text-gray-500">
                    This is optional - only fill in if you have specific courses or learning to mention.
                  </p>
                </div>
              ) : null}

              {errors[currentField.id] && (
                <p className="text-sm text-red-600">{errors[currentField.id]}</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-8">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentFieldIndex === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => window.location.href = "/profile-checkpoints"}>
            <Save className="w-4 h-4 mr-2" />
            Save & Exit
          </Button>
          
          <Button onClick={handleNext}>
            {currentFieldIndex === FORM_FIELDS.length - 1 ? 'Complete' : 'Next'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}