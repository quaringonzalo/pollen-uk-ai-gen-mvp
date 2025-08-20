import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, ArrowRight, ArrowLeft, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FormField {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'multiselect' | 'checkbox' | 'number';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  helpText?: string;
  validation?: (value: any) => string | null;
  conditional?: {
    dependsOn: string;
    showWhen: string[];
  };
}

interface ProgressiveFormProps {
  title: string;
  description: string;
  fields: FormField[];
  onComplete: (data: Record<string, any>) => void;
  onSaveAndExit?: (data: Record<string, any>) => void;
  initialData?: Record<string, any>;
  showSaveOption?: boolean;
  completionButtonText?: string;
  isOptional?: boolean;
}

export default function ProgressiveForm({
  title,
  description,
  fields,
  onComplete,
  onSaveAndExit,
  initialData = {},
  showSaveOption = true,
  completionButtonText = "Continue to Next Section",
  isOptional = false
}: ProgressiveFormProps) {
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [completedFields, setCompletedFields] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Mark fields as completed if they have valid initial data
    const completed = new Set<string>();
    fields.forEach(field => {
      if (initialData[field.id] && (!field.required || initialData[field.id])) {
        completed.add(field.id);
      }
    });
    setCompletedFields(completed);
    
    // Start from first incomplete field
    const firstIncompleteIndex = fields.findIndex(field => !completed.has(field.id));
    if (firstIncompleteIndex !== -1) {
      setCurrentFieldIndex(firstIncompleteIndex);
    }
  }, [fields, initialData]);

  // Filter fields based on conditional logic
  const getVisibleFields = () => {
    return fields.filter(field => {
      if (!field.conditional) return true;
      
      const dependentValue = formData[field.conditional.dependsOn];
      return field.conditional.showWhen.includes(dependentValue);
    });
  };

  const visibleFields = getVisibleFields();
  const currentField = visibleFields[currentFieldIndex];
  
  // Safety check for undefined fields
  if (!currentField) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600">Error: No fields available</p>
        <Button onClick={() => window.location.href = "/profile-checkpoints"}>
          Return to Dashboard
        </Button>
      </div>
    );
  }
  const progress = ((completedFields.size) / visibleFields.length) * 100;
  const allFieldsCompleted = completedFields.size === visibleFields.length;

  const validateField = (field: FormField, value: any): string | null => {
    // Skip required validation if the entire section is optional
    if (!isOptional && field.required && (!value || (Array.isArray(value) && value.length === 0))) {
      return `${field.label} is required`;
    }
    
    if (field.validation) {
      return field.validation(value);
    }
    
    return null;
  };

  const handleFieldComplete = (fieldId: string, value: any) => {
    const field = fields.find(f => f.id === fieldId);
    if (!field) return;

    const error = validateField(field, value);
    
    if (error) {
      setErrors(prev => ({ ...prev, [fieldId]: error }));
      return;
    }

    // Clear error and update data
    setErrors(prev => ({ ...prev, [fieldId]: '' }));
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    setCompletedFields(prev => new Set(Array.from(prev).concat(fieldId)));

    // Move to next incomplete field within visible fields
    const nextIncompleteIndex = visibleFields.findIndex((field, index) => 
      index > currentFieldIndex && !completedFields.has(field.id)
    );
    
    if (nextIncompleteIndex !== -1) {
      setCurrentFieldIndex(nextIncompleteIndex);
    }
  };

  const handleValueChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    
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

  const handleNext = () => {
    const value = formData[currentField.id];
    
    // If section is optional, allow moving to next field even with validation errors
    if (isOptional) {
      // Save the current value regardless of validation
      setFormData(prev => ({ ...prev, [currentField.id]: value }));
      
      // Move to next field or complete if at the end
      if (currentFieldIndex < visibleFields.length - 1) {
        setCurrentFieldIndex(currentFieldIndex + 1);
      } else {
        onComplete(formData);
      }
    } else {
      handleFieldComplete(currentField.id, value);
    }
  };

  const handleSubmit = () => {
    // Validate all fields one more time
    const newErrors: Record<string, string> = {};
    
    fields.forEach(field => {
      const error = validateField(field, formData[field.id]);
      if (error) {
        newErrors[field.id] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onComplete(formData);
  };

  const renderField = (field: FormField) => {
    const value = formData[field.id] || '';
    const hasError = !!errors[field.id];
    const isCompleted = completedFields.has(field.id);

    switch (field.type) {
      case 'text':
        return (
          <div className="space-y-2">
            <Input
              value={value}
              onChange={(e) => handleValueChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              className={hasError ? 'border-red-500' : isCompleted ? 'border-green-500' : ''}
            />
            {hasError && (
              <p className="text-sm text-red-600">{errors[field.id]}</p>
            )}
          </div>
        );
      
      case 'textarea':
        return (
          <div className="space-y-2">
            <Textarea
              value={value}
              onChange={(e) => handleValueChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              rows={3}
              className={hasError ? 'border-red-500' : isCompleted ? 'border-green-500' : ''}
            />
            {hasError && (
              <p className="text-sm text-red-600">{errors[field.id]}</p>
            )}
          </div>
        );
      
      case 'select':
        return (
          <div className="space-y-2">
            <Select 
              value={value} 
              onValueChange={(newValue) => handleValueChange(field.id, newValue)}
            >
              <SelectTrigger className={hasError ? 'border-red-500' : isCompleted ? 'border-green-500' : ''}>
                <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasError && (
              <p className="text-sm text-red-600">{errors[field.id]}</p>
            )}
          </div>
        );
        
      case 'number':
        return (
          <div className="space-y-2">
            <Input
              type="number"
              value={value || ''}
              onChange={(e) => handleValueChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              className={hasError ? 'border-red-500' : isCompleted ? 'border-green-500' : ''}
            />
            {field.helpText && (
              <p className="text-sm text-gray-600">{field.helpText}</p>
            )}
            {hasError && (
              <p className="text-sm text-red-600">{errors[field.id]}</p>
            )}
          </div>
        );
        
      case 'multiselect':
        const selectedValues = Array.isArray(value) ? value : (value ? [value] : []);
        return (
          <div className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto border rounded-md p-3">
              {field.options?.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${field.id}-${option}`}
                    checked={selectedValues.includes(option)}
                    onCheckedChange={(checked) => {
                      const newValues = checked 
                        ? [...selectedValues, option]
                        : selectedValues.filter(v => v !== option);
                      handleValueChange(field.id, newValues);
                    }}
                  />
                  <label htmlFor={`${field.id}-${option}`} className="text-sm cursor-pointer">
                    {option}
                  </label>
                </div>
              ))}
            </div>
            {hasError && (
              <p className="text-sm text-red-600">{errors[field.id]}</p>
            )}
          </div>
        );



      default:
        return (
          <div className="space-y-2">
            <Input
              value={value}
              onChange={(e) => handleValueChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              className={hasError ? 'border-red-500' : isCompleted ? 'border-green-500' : ''}
            />
            {hasError && (
              <p className="text-sm text-red-600">{errors[field.id]}</p>
            )}
          </div>
        );
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-3xl font-bold">{title}</h1>
          {isOptional && (
            <Badge variant="secondary" className="text-xs">Optional</Badge>
          )}
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">{description}</p>
        
        <div className="flex items-center justify-center gap-4">
          <span className="text-sm text-gray-500">{completedFields.size} of {fields.length} completed</span>
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
                      <div className="w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg">{currentField.label}</h3>
                    {currentField.helpText && (
                      <p className="text-sm text-gray-600 font-normal">{currentField.helpText}</p>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {renderField(currentField)}
                
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentFieldIndex === 0}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button onClick={handleNext}>
                      {currentFieldIndex === fields.length - 1 ? 'Complete' : 'Continue'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back to Dashboard - Only show when not complete */}
      {!allFieldsCompleted && showSaveOption && onSaveAndExit && (
        <div className="text-center">
          <Button 
            variant="ghost" 
            onClick={() => {
              onSaveAndExit(formData);
              window.location.href = "/profile-checkpoints";
            }}
            className="text-gray-600 hover:text-gray-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      )}

      {/* Completed Summary */}
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
                Section Complete!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-green-700">
                All required information has been completed for this section.
              </p>
              
              <div className="flex justify-between">
                {showSaveOption && onSaveAndExit && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (onSaveAndExit) onSaveAndExit(formData);
                      window.location.href = "/profile-checkpoints";
                    }}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                  </Button>
                )}
                
                <Button onClick={handleSubmit} className="flex items-center gap-2">
                  {completionButtonText}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Completed Fields Summary */}
      {completedFields.size > 0 && (
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-sm text-gray-600">Completed Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {fields.filter(field => completedFields.has(field.id)).map(field => (
                <div key={field.id} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-gray-700">{field.label}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentFieldIndex(fields.findIndex(f => f.id === field.id))}
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
    </div>
  );
}