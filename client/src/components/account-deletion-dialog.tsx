import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, CheckCircle } from "lucide-react";

interface AccountDeletionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface DeletionData {
  primaryReason: string;
  customReason: string;
  foundJob: boolean;
  pollenHelped: boolean;
  helpfulAspects: string[];
  additionalFeedback: string;
  confirmDeletion: boolean;
}

// Determine if current user is an employer (would need actual user role detection)
const isEmployerUser = window.location.pathname.includes('employer') || 
                      window.location.pathname.includes('company') ||
                      window.location.pathname.includes('hiring');

const deletionReasons = isEmployerUser ? [
  { value: "hired_successfully", label: "Successfully hired through platform" },
  { value: "no_suitable_candidates", label: "No suitable candidates available" },
  { value: "poor_experience", label: "Poor user experience" },
  { value: "too_time_consuming", label: "Platform takes too much time" },
  { value: "privacy_concerns", label: "Privacy or data concerns" },
  { value: "changed_hiring_needs", label: "No longer hiring" },
  { value: "budget_constraints", label: "Budget constraints" },
  { value: "other", label: "Other reason" }
] : [
  { value: "found_job", label: "I found a job" },
  { value: "no_suitable_jobs", label: "No suitable jobs available" },
  { value: "poor_experience", label: "Poor user experience" },
  { value: "too_time_consuming", label: "Platform takes too much time" },
  { value: "privacy_concerns", label: "Privacy or data concerns" },
  { value: "no_longer_job_hunting", label: "No longer looking for work" },
  { value: "other", label: "Other reason" }
];

const helpfulAspects = isEmployerUser ? [
  { value: "successful_hire", label: "Successfully hired quality candidates" },
  { value: "streamlined_process", label: "Streamlined our hiring process" },
  { value: "better_candidate_quality", label: "Improved quality of candidates" },
  { value: "reduced_hiring_time", label: "Reduced time to hire" },
  { value: "behavioural_insights", label: "Better candidate behavioural insights" },
  { value: "skills_verification", label: "Verified candidate skills effectively" },
  { value: "cost_effective", label: "Cost-effective hiring solution" },
  { value: "diverse_candidates", label: "Access to diverse talent pool" },
  { value: "professional_support", label: "Excellent support from Pollen team" },
  { value: "external_success", label: "Applied Pollen insights to other hiring" }
] : [
  { value: "direct_job_placement", label: "Found a job directly through Pollen" },
  { value: "skills_development", label: "Developed skills through challenges and feedback" },
  { value: "confidence_building", label: "Built confidence in job applications" },
  { value: "interview_skills", label: "Improved interview skills and preparation" },
  { value: "behavioural_insights", label: "Better understanding of work style and strengths" },
  { value: "application_quality", label: "Learned to write better applications" },
  { value: "community_support", label: "Community networking and peer support" },
  { value: "career_clarity", label: "Gained clarity on career direction" },
  { value: "professional_feedback", label: "Valuable feedback from employers/professionals" },
  { value: "external_job_success", label: "Used Pollen learnings to succeed elsewhere" }
];

export default function AccountDeletionDialog({ open, onOpenChange }: AccountDeletionDialogProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<DeletionData>({
    primaryReason: "",
    customReason: "",
    foundJob: false,
    pollenHelped: false,
    helpfulAspects: [],
    additionalFeedback: "",
    confirmDeletion: false
  });

  const deleteAccountMutation = useMutation({
    mutationFn: async (data: DeletionData) => {
      return apiRequest("DELETE", "/api/account", data);
    },
    onSuccess: () => {
      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted. Thank you for your feedback.",
      });
      // Clear session and redirect to home
      localStorage.clear();
      window.location.href = "/";
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again.",
        variant: "destructive"
      });
    }
  });

  const updateFormData = (field: keyof DeletionData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleHelpfulAspect = (aspect: string) => {
    const current = formData.helpfulAspects;
    const updated = current.includes(aspect)
      ? current.filter(a => a !== aspect)
      : [...current, aspect];
    updateFormData("helpfulAspects", updated);
  };

  const handleNext = () => {
    if (step === 1 && (formData.primaryReason === "found_job" || formData.primaryReason === "hired_successfully")) {
      setStep(2); // Success flow for both job seekers and employers
    } else {
      setStep(3); // Final confirmation
    }
  };

  const handleDelete = () => {
    deleteAccountMutation.mutate(formData);
  };

  const canProceedStep1 = formData.primaryReason !== "" && 
    (formData.primaryReason !== "other" || formData.customReason.trim() !== "");
  const canProceedStep2 = true; // Optional questions
  const canDelete = formData.confirmDeletion;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Delete Account
          </DialogTitle>
          <DialogDescription>
            {step === 1 && "Help us understand why you're leaving"}
            {step === 2 && (isEmployerUser ? "Congratulations on your successful hire!" : "Congratulations on finding a job!")}
            {step === 3 && "Final confirmation"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step 1: Primary reason */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">
                  What's the main reason you're deleting your account?
                </Label>
                <RadioGroup
                  value={formData.primaryReason}
                  onValueChange={(value) => updateFormData("primaryReason", value)}
                  className="mt-3"
                >
                  {deletionReasons.map((reason) => (
                    <div key={reason.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={reason.value} id={reason.value} />
                      <Label htmlFor={reason.value} className="font-normal">
                        {reason.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Custom reason input when "other" is selected */}
              {formData.primaryReason === "other" && (
                <div>
                  <Label htmlFor="customReason" className="text-sm font-medium">
                    Please specify your reason
                  </Label>
                  <Textarea
                    id="customReason"
                    value={formData.customReason}
                    onChange={(e) => updateFormData("customReason", e.target.value)}
                    placeholder={isEmployerUser ? "Tell us more about your reason for leaving..." : "Tell us more about your reason for deleting your account..."}
                    className="mt-2"
                    style={{fontFamily: 'Poppins'}}
                  />
                </div>
              )}

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button onClick={handleNext} disabled={!canProceedStep1}>
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Job success questions */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-green-900">Congratulations!</h3>
                </div>
                <p className="text-green-800">
                  We're thrilled you found a job. Your feedback helps us improve for future job seekers.
                </p>
              </div>

              <div>
                <Label className="text-base font-medium">
                  How did Pollen impact your career development?
                </Label>
                <p className="text-sm text-gray-500 mt-1">
                  Including direct job placement, skills development, feedback, community support, or other career growth
                </p>
                <RadioGroup
                  value={formData.pollenHelped ? "yes" : "no"}
                  onValueChange={(value) => updateFormData("pollenHelped", value === "yes")}
                  className="mt-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="helped-yes" />
                    <Label htmlFor="helped-yes" className="font-normal">
                      Yes, Pollen helped with my career development
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="helped-no" />
                    <Label htmlFor="helped-no" className="font-normal">
                      No, Pollen had no impact on my career
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {formData.pollenHelped && (
                <div>
                  <Label className="text-base font-medium">
                    Which aspects of Pollen were most helpful? (Select all that apply)
                  </Label>
                  <div className="mt-3 space-y-2">
                    {helpfulAspects.map((aspect) => (
                      <div key={aspect.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={aspect.value}
                          checked={formData.helpfulAspects.includes(aspect.value)}
                          onCheckedChange={() => toggleHelpfulAspect(aspect.value)}
                        />
                        <Label htmlFor={aspect.value} className="font-normal">
                          {aspect.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="feedback" className="text-base font-medium">
                  Any additional feedback about your experience?
                </Label>
                <Textarea
                  id="feedback"
                  value={formData.additionalFeedback}
                  onChange={(e) => updateFormData("additionalFeedback", e.target.value)}
                  placeholder="Tell us about your experience, suggestions for improvement, or anything else you'd like to share..."
                  className="mt-2"
                  rows={4}
                />
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button onClick={() => setStep(3)}>
                  Continue to Delete
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Final confirmation */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-semibold text-red-900 mb-2">Account Deletion</h3>
                <p className="text-red-800 text-sm">
                  This action cannot be undone. All your profile data, applications, and account history will be permanently deleted.
                </p>
              </div>

              {formData.primaryReason !== "found_job" && (
                <div>
                  <Label htmlFor="final-feedback" className="text-base font-medium">
                    Before you go, is there anything we could have done better?
                  </Label>
                  <Textarea
                    id="final-feedback"
                    value={formData.additionalFeedback}
                    onChange={(e) => updateFormData("additionalFeedback", e.target.value)}
                    placeholder={isEmployerUser ? "Your feedback helps us improve the platform for other employers..." : "Your feedback helps us improve the platform for other job seekers..."}
                    className="mt-2"
                    rows={3}
                  />
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="confirm-deletion"
                  checked={formData.confirmDeletion}
                  onCheckedChange={(checked) => updateFormData("confirmDeletion", checked)}
                />
                <Label htmlFor="confirm-deletion" className="text-sm">
                  I understand this action is permanent and cannot be undone
                </Label>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={!canDelete || deleteAccountMutation.isPending}
                >
                  {deleteAccountMutation.isPending ? "Deleting..." : "Delete Account"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}