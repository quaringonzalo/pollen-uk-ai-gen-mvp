import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, ArrowRight, ArrowLeft, Save, Heart, Target, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface PersonalStoryCheckpointProps {
  onComplete: (data: any) => void;
  onSaveAndExit?: (data: any) => void;
  initialData?: any;
}

interface FormField {
  id: string;
  label: string;
  placeholder: string;
  helpText: string;
  icon: React.ComponentType<any>;
  required: boolean;
  minLength: number;
}

const FORM_FIELDS: FormField[] = [
  {
    id: 'perfectJob',
    label: "What's your idea of the perfect job?",
    placeholder: 'Describe what your ideal role would look like, what you\'d be doing, and what would make you excited to go to work...',
    helpText: 'This helps us understand what type of work environment and responsibilities appeal to you.',
    icon: Target,
    required: true,
    minLength: 40
  },
  {
    id: 'friendDescriptions',
    label: 'In 3 words or phrases, how would your friends describe you?',
    placeholder: 'e.g., Supportive, Creative, Always laughing...',
    helpText: 'This shows your personality from the perspective of people who know you well.',
    icon: Heart,
    required: true,
    minLength: 10
  },
  {
    id: 'teacherDescriptions',
    label: 'In 3 words or phrases, how would your teachers describe you?',
    placeholder: 'e.g., Curious, Hardworking, Good collaborator...',
    helpText: 'This reveals your learning style and approach to challenges.',
    icon: Trophy,
    required: true,
    minLength: 10
  },
  {
    id: 'happyActivities',
    label: 'What do you like doing that makes you happy?',
    placeholder: 'Think about hobbies, activities, or situations that energize you...',
    helpText: 'Understanding what brings you joy helps us find roles that align with your interests.',
    icon: Heart,
    required: true,
    minLength: 20
  },
  {
    id: 'frustrations',
    label: 'Is there anything in life that frustrates you?',
    placeholder: 'This could be situations, tasks, or environments that drain your energy...',
    helpText: 'Knowing what doesn\'t work for you helps us avoid poor matches.',
    icon: Target,
    required: true,
    minLength: 15
  },
  {
    id: 'proudMoment',
    label: 'Is there anything you\'ve done you feel really proud of?',
    placeholder: 'This could be academic, personal, volunteer work, sports, or any accomplishment...',
    helpText: 'Achievements show your character and potential, regardless of work experience.',
    icon: Trophy,
    required: true,
    minLength: 20
  }
];

export function PersonalStoryCheckpoint({ 
  onComplete, 
  onSaveAndExit, 
  initialData = {} 
}: PersonalStoryCheckpointProps) {
  const { toast } = useToast();
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0);
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [completedFields, setCompletedFields] = useState<Set<string>>(new Set());

  // Initialize completed fields based on initial data
  useState(() => {
    const completed = new Set<string>();
    FORM_FIELDS.forEach(field => {
      if (initialData[field.id] && initialData[field.id].length >= field.minLength) {
        completed.add(field.id);
      }
    });
    setCompletedFields(completed);
    
    // Start from first incomplete field
    const firstIncompleteIndex = FORM_FIELDS.findIndex(field => !completed.has(field.id));
    if (firstIncompleteIndex !== -1) {
      setCurrentFieldIndex(firstIncompleteIndex);
    }
  });

  const currentField = FORM_FIELDS[currentFieldIndex];
  const progress = (completedFields.size / FORM_FIELDS.length) * 100;
  const allFieldsCompleted = completedFields.size === FORM_FIELDS.length;

  const validateField = (field: FormField, value: string): string | null => {
    if (!value || value.trim().length === 0) {
      return `${field.label} is required`;
    }
    
    if (value.length < field.minLength) {
      return `Please provide at least ${field.minLength} characters`;
    }
    
    return null;
  };

  const handleFieldComplete = () => {
    const value = formData[currentField.id] || '';
    const error = validateField(currentField, value);
    
    if (error) {
      setErrors(prev => ({ ...prev, [currentField.id]: error }));
      return;
    }

    // Clear error and mark as completed
    setErrors(prev => ({ ...prev, [currentField.id]: '' }));
    setCompletedFields(prev => new Set(Array.from(prev).concat(currentField.id)));

    // Move to next incomplete field
    const nextIncompleteIndex = FORM_FIELDS.findIndex((field, index) => 
      index > currentFieldIndex && !completedFields.has(field.id)
    );
    
    if (nextIncompleteIndex !== -1) {
      setCurrentFieldIndex(nextIncompleteIndex);
    }
  };

  const handleValueChange = (fieldId: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [fieldId]: value }));
    
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: '' }));
    }
  };

  const handlePrevious = () => {
    if (currentFieldIndex > 0) {
      setCurrentFieldIndex(currentFieldIndex - 1);
    }
  };

  const handleSaveAndExit = async () => {
    try {
      // Save current progress first
      const response = await fetch("/api/checkpoint-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checkpointId: "personal-story",
          data: formData,
          phase: "profile"
        })
      });

      if (!response.ok) {
        throw new Error(`Save failed: ${response.status}`);
      }

      if (onSaveAndExit) {
        onSaveAndExit(formData);
      }
      
      // Navigate back to dashboard
      window.location.href = "/profile-checkpoints";
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Please try again or continue without saving",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = () => {
    // Validate all fields one more time
    const newErrors: Record<string, string> = {};
    
    FORM_FIELDS.forEach(field => {
      const error = validateField(field, formData[field.id] || '');
      if (error) {
        newErrors[field.id] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast({
        title: "Please complete all fields",
        description: "Some fields need more information before continuing.",
        variant: "destructive"
      });
      return;
    }

    onComplete(formData);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Tell us your story</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Help employers understand what drives you and what you're looking for in your career. 
          This information will be visible on your profile.
        </p>
        
        <div className="flex items-center justify-center gap-4">
          <span className="text-sm text-gray-500">{completedFields.size} of {FORM_FIELDS.length} completed</span>
          <Progress value={progress} className="w-48 h-2" />
        </div>
      </div>

      {/* Current Field */}
      <AnimatePresence mode="wait">
        {!allFieldsCompleted && currentField && (
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
                <Textarea
                  value={formData[currentField.id] || ''}
                  onChange={(e) => handleValueChange(currentField.id, e.target.value)}
                  placeholder={currentField.placeholder}
                  rows={4}
                  className={`${errors[currentField.id] ? 'border-red-500' : completedFields.has(currentField.id) ? 'border-green-500' : ''}`}
                />
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span className={`${(formData[currentField.id]?.length || 0) >= currentField.minLength ? 'text-green-600' : 'text-gray-500'}`}>
                      {formData[currentField.id]?.length || 0} / {currentField.minLength} characters minimum
                    </span>
                    {errors[currentField.id] && (
                      <span className="text-red-600">{errors[currentField.id]}</span>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentFieldIndex === 0}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  
                  <Button 
                    onClick={handleFieldComplete}
                    disabled={(formData[currentField.id]?.length || 0) < currentField.minLength}
                  >
                    {currentFieldIndex === FORM_FIELDS.length - 1 ? 'Complete' : 'Continue'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completion Summary */}
      {allFieldsCompleted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <CheckCircle className="w-6 h-6" />
                Personal Story Complete!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-green-700">
                Great! You've shared your story and career aspirations. This information will help employers 
                understand what drives you and find opportunities that align with your goals.
              </p>
              
              <div className="flex justify-between">
                {onSaveAndExit && (
                  <Button
                    variant="outline"
                    onClick={handleSaveAndExit}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                  </Button>
                )}
                
                <Button onClick={handleSubmit} className="flex items-center gap-2">
                  Continue to Next Section
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Progress Summary */}
      {completedFields.size > 0 && !allFieldsCompleted && (
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-sm text-gray-600">Completed Sections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {FORM_FIELDS.filter(field => completedFields.has(field.id)).map(field => (
                <div key={field.id} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-gray-700">{field.label}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentFieldIndex(FORM_FIELDS.findIndex(f => f.id === field.id))}
                    className="ml-auto text-blue-600 hover:text-blue-700"
                  >
                    Edit
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save & Exit Option */}
      <div className="text-center">
        <Button
          variant="ghost"
          onClick={handleSaveAndExit}
          className="text-gray-600 hover:text-gray-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}