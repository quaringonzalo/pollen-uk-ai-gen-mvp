import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, CheckCircle, Save, SkipForward, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface BackgroundDataCheckpointProps {
  onComplete: (data: any) => void;
  onSaveAndExit?: (data: any) => void;
  onSkip?: () => void;
  initialData?: any;
}

// Optional diversity monitoring questions only
const FORM_FIELDS = [
  {
    id: 'gender',
    label: 'Gender (optional - for diversity monitoring)',
    helpText: 'This information helps us track diversity and inclusion',
    type: 'select',
    options: [
      'Male',
      'Female', 
      'Non-binary',
      'Other',
      'Prefer not to say'
    ],
    required: false
  },
  {
    id: 'ethnicity',
    label: 'Ethnicity (optional - for diversity monitoring)', 
    helpText: 'This information helps us ensure equal opportunities',
    type: 'select',
    options: [
      'White British',
      'White Irish',
      'White Other',
      'Mixed White and Black Caribbean',
      'Mixed White and Black African', 
      'Mixed White and Asian',
      'Mixed Other',
      'Asian Indian',
      'Asian Pakistani',
      'Asian Bangladeshi',
      'Asian Chinese',
      'Asian Other',
      'Black Caribbean',
      'Black African',
      'Black Other',
      'Arab',
      'Other ethnic group',
      'Prefer not to say'
    ],
    required: false
  },
  {
    id: 'disability',
    label: 'Do you consider yourself to have a disability? (optional)',
    helpText: 'This helps us ensure accessibility and equal opportunities',
    type: 'select',
    options: [
      'Yes',
      'No',
      'Prefer not to say'
    ],
    required: false
  }
];

export function BackgroundDataCheckpoint({
  onComplete,
  onSaveAndExit,
  onSkip,
  initialData = {}
}: BackgroundDataCheckpointProps) {
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0);
  const [completedFields, setCompletedFields] = useState<Set<string>>(new Set());
  const [allFieldsCompleted, setAllFieldsCompleted] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const saveProgressMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/checkpoint-progress", {
      checkpointId: "background-data",
      data,
      phase: "optional"
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/checkpoint-progress"] });
    }
  });

  useEffect(() => {
    // Check which fields have content
    const completed = new Set<string>();
    FORM_FIELDS.forEach(field => {
      const value = formData[field.id];
      if (value !== undefined && value !== '' && 
          (Array.isArray(value) ? value.length > 0 : true)) {
        completed.add(field.id);
      }
    });
    setCompletedFields(completed);
    
    // Set completion state if we've reached the end
    if (currentFieldIndex >= FORM_FIELDS.length) {
      setAllFieldsCompleted(true);
    }
  }, [formData, currentFieldIndex]);

  const handleValueChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleNext = () => {
    if (currentFieldIndex < FORM_FIELDS.length - 1) {
      setCurrentFieldIndex(currentFieldIndex + 1);
    } else {
      setAllFieldsCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentFieldIndex > 0) {
      setCurrentFieldIndex(currentFieldIndex - 1);
    }
  };

  const handleComplete = () => {
    saveProgressMutation.mutate(formData);
    onComplete(formData);
  };

  const handleSaveAndExit = () => {
    saveProgressMutation.mutate(formData);
    if (onSaveAndExit) onSaveAndExit(formData);
  };

  const handleSkip = () => {
    if (onSkip) onSkip();
  };

  if (allFieldsCompleted) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              Optional Background Information Complete
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-600">
              Thank you for providing this optional diversity monitoring information. 
              This data helps us ensure equal opportunities and track our commitment to diversity and inclusion.
            </p>
            
            <div className="flex justify-center gap-4 pt-4">
              <Button variant="outline" onClick={() => window.location.href = "/profile-checkpoints"}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <Button onClick={handleComplete}>
                Complete Profile
                <CheckCircle className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentField = FORM_FIELDS[currentFieldIndex];
  const progress = ((currentFieldIndex + 1) / FORM_FIELDS.length) * 100;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Supporting Diversity</h2>
        <p className="text-gray-600">
          This diversity monitoring data is completely optional and helps us ensure equal opportunities
        </p>
        <Progress value={progress} className="w-full mt-4" />
      </div>

      {/* Current Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentFieldIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-2 border-blue-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg">{currentField.label}</h3>
                  <p className="text-sm text-gray-600 font-normal">{currentField.helpText}</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentField.type === 'select' && (
                <Select
                  value={formData[currentField.id] || ''}
                  onValueChange={(value) => handleValueChange(currentField.id, value)}
                >
                  <SelectTrigger>
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
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-6">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentFieldIndex === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Question {currentFieldIndex + 1} of {FORM_FIELDS.length}</span>
          <Button variant="ghost" size="sm" onClick={handleSkip}>
            <SkipForward className="w-4 h-4 mr-1" />
            Skip All
          </Button>
        </div>
        
        <div className="flex gap-3">
          <Button variant="ghost" onClick={handleSaveAndExit}>
            <Save className="w-4 h-4 mr-2" />
            Save & Exit
          </Button>
          
          <Button onClick={handleNext}>
            {currentFieldIndex < FORM_FIELDS.length - 1 ? (
              <>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Complete
                <CheckCircle className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}