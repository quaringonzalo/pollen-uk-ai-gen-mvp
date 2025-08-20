import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Heart, MessageSquare, X } from "lucide-react";

interface PlatformFeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FeedbackData {
  overallExperience: string;
  careerImpact: string;
  helpfulAspects: string[];
  improvementSuggestions: string;
  recommendToFriend: string;
  additionalComments: string;
}

const experienceOptions = [
  { value: "excellent", label: "Excellent - Exceeded my expectations" },
  { value: "good", label: "Good - Met my expectations" },
  { value: "okay", label: "Okay - Some good aspects" },
  { value: "poor", label: "Poor - Below expectations" }
];

const careerImpactOptions = [
  { value: "major_positive", label: "Major positive impact on my career" },
  { value: "some_positive", label: "Some positive impact" },
  { value: "helpful_skills", label: "Helped me develop skills and confidence" },
  { value: "early_to_tell", label: "Too early to tell" },
  { value: "no_impact", label: "No significant impact" }
];

const helpfulAspects = [
  { value: "job_matching", label: "Job matching and recommendations" },
  { value: "skills_challenges", label: "Skills challenges and practical assessments" },
  { value: "behavioural_insights", label: "Work style and behavioural insights" },
  { value: "application_feedback", label: "Professional feedback on applications" },
  { value: "community_support", label: "Community and peer networking" },
  { value: "confidence_building", label: "Building job search confidence" },
  { value: "career_clarity", label: "Gaining clarity on career direction" },
  { value: "interview_skills", label: "Interview preparation and skills" },
  { value: "professional_development", label: "Overall professional development" }
];

const recommendOptions = [
  { value: "definitely", label: "Definitely would recommend" },
  { value: "probably", label: "Probably would recommend" },
  { value: "maybe", label: "Maybe, depends on the person" },
  { value: "probably_not", label: "Probably would not recommend" },
  { value: "definitely_not", label: "Definitely would not recommend" }
];

export default function PlatformFeedbackDialog({ open, onOpenChange }: PlatformFeedbackDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FeedbackData>({
    overallExperience: "",
    careerImpact: "",
    helpfulAspects: [],
    improvementSuggestions: "",
    recommendToFriend: "",
    additionalComments: ""
  });

  const submitFeedbackMutation = useMutation({
    mutationFn: async (data: FeedbackData) => {
      return apiRequest("POST", "/api/platform-feedback", data);
    },
    onSuccess: () => {
      toast({
        title: "Thank You!",
        description: "Your feedback helps us improve Pollen for everyone.",
      });
      // Mark feedback as submitted in localStorage to prevent showing again
      localStorage.setItem("pollen_feedback_submitted", "true");
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive"
      });
    }
  });

  const updateFormData = (field: keyof FeedbackData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleHelpfulAspect = (aspect: string) => {
    const current = formData.helpfulAspects;
    const updated = current.includes(aspect)
      ? current.filter(a => a !== aspect)
      : [...current, aspect];
    updateFormData("helpfulAspects", updated);
  };

  const handleSubmit = () => {
    if (!formData.overallExperience || !formData.careerImpact) {
      toast({
        title: "Please Complete Required Fields",
        description: "Overall experience and career impact are required.",
        variant: "destructive"
      });
      return;
    }
    submitFeedbackMutation.mutate(formData);
  };

  const handleSkip = () => {
    // Mark as skipped so it doesn't show again
    localStorage.setItem("pollen_feedback_skipped", "true");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-purple-600" />
              <DialogTitle className="text-xl">Help Us Improve Pollen</DialogTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={handleSkip}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <DialogDescription>
            Your feedback is invaluable in helping us create the best possible platform for job seekers like you.
            This survey takes about 3 minutes and will only be shown once.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Overall Experience */}
          <Card>
            <CardContent className="pt-6">
              <div>
                <Label className="text-base font-medium">
                  How would you rate your overall experience with Pollen? *
                </Label>
                <RadioGroup
                  value={formData.overallExperience}
                  onValueChange={(value) => updateFormData("overallExperience", value)}
                  className="mt-3"
                >
                  {experienceOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={`exp-${option.value}`} />
                      <Label htmlFor={`exp-${option.value}`} className="font-normal">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* Career Impact */}
          <Card>
            <CardContent className="pt-6">
              <div>
                <Label className="text-base font-medium">
                  How has Pollen impacted your career development? *
                </Label>
                <p className="text-sm text-gray-500 mt-1">
                  This includes job opportunities, skills development, confidence, networking, etc.
                </p>
                <RadioGroup
                  value={formData.careerImpact}
                  onValueChange={(value) => updateFormData("careerImpact", value)}
                  className="mt-3"
                >
                  {careerImpactOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={`impact-${option.value}`} />
                      <Label htmlFor={`impact-${option.value}`} className="font-normal">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* Helpful Aspects */}
          <Card>
            <CardContent className="pt-6">
              <div>
                <Label className="text-base font-medium">
                  Which aspects of Pollen have been most helpful? (Select all that apply)
                </Label>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                  {helpfulAspects.map((aspect) => (
                    <div key={aspect.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={aspect.value}
                        checked={formData.helpfulAspects.includes(aspect.value)}
                        onCheckedChange={() => toggleHelpfulAspect(aspect.value)}
                      />
                      <Label htmlFor={aspect.value} className="font-normal text-sm">
                        {aspect.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Improvements */}
          <Card>
            <CardContent className="pt-6">
              <div>
                <Label htmlFor="improvements" className="text-base font-medium">
                  What could we improve or add to make Pollen better?
                </Label>
                <Textarea
                  id="improvements"
                  value={formData.improvementSuggestions}
                  onChange={(e) => updateFormData("improvementSuggestions", e.target.value)}
                  placeholder="Share your ideas for features, improvements, or changes..."
                  className="mt-2"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Recommendation */}
          <Card>
            <CardContent className="pt-6">
              <div>
                <Label className="text-base font-medium">
                  Would you recommend Pollen to a friend looking for work?
                </Label>
                <RadioGroup
                  value={formData.recommendToFriend}
                  onValueChange={(value) => updateFormData("recommendToFriend", value)}
                  className="mt-3"
                >
                  {recommendOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={`rec-${option.value}`} />
                      <Label htmlFor={`rec-${option.value}`} className="font-normal">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* Additional Comments */}
          <Card>
            <CardContent className="pt-6">
              <div>
                <Label htmlFor="comments" className="text-base font-medium">
                  Any additional thoughts or feedback?
                </Label>
                <Textarea
                  id="comments"
                  value={formData.additionalComments}
                  onChange={(e) => updateFormData("additionalComments", e.target.value)}
                  placeholder="Share any other thoughts, success stories, or feedback..."
                  className="mt-2"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={handleSkip}>
              Skip for Now
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={submitFeedbackMutation.isPending}
              className="min-w-[120px]"
            >
              {submitFeedbackMutation.isPending ? (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Submit Feedback
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}