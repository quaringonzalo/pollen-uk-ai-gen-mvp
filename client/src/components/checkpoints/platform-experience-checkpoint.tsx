import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Users, HelpCircle, ArrowLeft, ArrowRight, CheckCircle, Save, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface PlatformExperienceCheckpointProps {
  onComplete: (data: any) => void;
  onSaveAndExit?: (data: any) => void;
  initialData?: any;
}

// Referral source options from comprehensive onboarding
const REFERRAL_SOURCE_OPTIONS = [
  "Google search",
  "Social media (Instagram, TikTok, LinkedIn)",
  "Friend or family recommendation",
  "University career service",
  "Job board or career website",
  "News article or blog post",
  "Advertisement",
  "Career fair or event",
  "Other"
];

const FORM_FIELDS = [
  {
    id: 'how_heard_about_us',
    type: 'select' as const,
    label: 'How did you hear about Pollen?',
    required: false,
    options: [
      "LinkedIn",
      "Indeed", 
      "TikTok",
      "Instagram",
      "Podcast / Radio",
      "News Article / Feature",
      "Family / friend / colleague recommendation",
      "Event",
      "Search Engine",
      "Other"
    ],
    helpText: 'This helps us understand how people discover our platform'
  },
  {
    id: 'reasonable_adjustments',
    type: 'textarea' as const,
    label: 'Do you need any reasonable adjustments for work or interviews?',
    required: false,
    placeholder: 'e.g., wheelchair access, flexible hours due to medical appointments, or interview accommodations...',
    helpText: 'This covers both disability accommodations and neurodivergent support needs'
  },
  {
    id: 'job_search_experience',
    type: 'textarea' as const,
    label: 'Tell us about your job search experience so far',
    required: false,
    placeholder: 'e.g. What challenges have you faced? What type of roles are you applying for?',
    helpText: 'This helps us improve our platform and provide better support'  
  }
];

export function PlatformExperienceCheckpoint({
  onComplete,
  onSaveAndExit,
  initialData = {}
}: PlatformExperienceCheckpointProps) {
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0);
  const [completedFields, setCompletedFields] = useState<Set<string>>(new Set());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [allFieldsCompleted, setAllFieldsCompleted] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const saveProgressMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/checkpoint-progress", {
      checkpointId: "platform-experience",
      data,
      phase: "internal"
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
      if (value !== undefined && value !== '' || !field.required) {
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
    // Basic validation - check if required field has value
    if (currentField.required && (!value || value === '')) {
      const errorMsg = 'This field is required';
      setErrors(prev => ({ ...prev, [currentField.id]: errorMsg }));
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
    // Validate all required fields
    let isValid = true;
    const newErrors: Record<string, string> = {};
    
    FORM_FIELDS.forEach(field => {
      if (field.required) {
        const value = formData[field.id];
        // Basic validation - check if required field has value
        if (!value || value === '') {
          newErrors[field.id] = 'This field is required';
          isValid = false;
        }
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
          title: "Platform experience completed!",
          description: "Thanks for helping us improve our service."
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
            <h2 className="text-2xl font-bold">Platform experience completed!</h2>
            <p className="text-gray-600 mt-2">
              Thanks for sharing how you found us and any support you might need.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-left">
            <div>
              <h4 className="font-medium text-sm text-gray-700">How you found us:</h4>
              <p className="text-sm text-gray-600">
                {formData.referral_source || 'Not specified'}
              </p>
            </div>
            {formData.reasonable_adjustments && (
              <div>
                <h4 className="font-medium text-sm text-gray-700">Reasonable adjustments:</h4>
                <p className="text-sm text-gray-600">
                  {formData.reasonable_adjustments}
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => window.location.href = "/profile-checkpoints"}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <Button onClick={handleComplete} disabled={saveProgressMutation.isPending}>
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
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full">
          <div className="w-2 h-2 bg-green-600 rounded-full" />
          <span className="text-sm font-medium text-green-700">Help Us Help You</span>
        </div>
        
        <h1 className="text-3xl font-bold">Help Us Help You</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Just a couple of quick questions to help us understand how people find us and how we can better support you.
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
          <Card className="border-2 border-green-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${completedFields.has(currentField.id) ? 'bg-green-100' : 'bg-green-100'}`}>
                  {completedFields.has(currentField.id) ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <Settings className="w-5 h-5 text-green-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg">{currentField.label}</h3>
                  <p className="text-sm text-gray-600 font-normal">{currentField.helpText}</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentField.type === 'select' ? (
                <Select
                  value={formData[currentField.id]}
                  onValueChange={(value) => handleValueChange(currentField.id, value)}
                >
                  <SelectTrigger className={errors[currentField.id] ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select an option..." />
                  </SelectTrigger>
                  <SelectContent>
                    {currentField.options?.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Textarea
                  value={formData[currentField.id] || ''}
                  onChange={(e) => handleValueChange(currentField.id, e.target.value)}
                  placeholder={currentField.placeholder}
                  rows={4}
                  className={`${errors[currentField.id] ? 'border-red-500' : completedFields.has(currentField.id) ? 'border-green-500' : ''}`}
                />
              )}

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
          <Button variant="ghost" onClick={handleSaveAndExit}>
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