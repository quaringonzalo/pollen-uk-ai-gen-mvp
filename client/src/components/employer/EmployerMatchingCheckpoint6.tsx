import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, ArrowRight, Users, Target, Brain } from "lucide-react";
import { PersonaDisplay } from "./PersonaDisplay";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface PersonaData {
  id: string;
  name: string;
  description: string;
  roleType: string;
  discProfile: {
    red: number;
    yellow: number;
    green: number;
    blue: number;
  };
  keyTraits: Array<{
    title: string;
    description: string;
    sourceCheckpoint: string;
    icon: string;
    colour: string;
  }>;
  mindset: {
    thrivesOn: string;
    motivatedBy: string;
    approach: string;
    growthStyle: string;
  };
  skillsMatch: string[];
  redFlags: string[];
  roleAlignmentScore: number;
  generatedAt: Date;
}

interface Props {
  allCheckpointData: any;
  onComplete: (data: any) => void;
  onBack: () => void;
  initialData: any;
}

export function EmployerMatchingCheckpoint6({ allCheckpointData, onComplete, onBack, initialData }: Props) {
  const [isGenerating, setIsGenerating] = useState(true);
  const [persona, setPersona] = useState<PersonaData | null>(null);
  const [challengeDraft, setChallengeDraft] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    generatePersona();
  }, []);

  const generatePersona = async () => {
    try {
      setIsGenerating(true);

      // Generate persona based on all checkpoint data
      const response = await apiRequest("POST", "/api/generate-persona", {
        checkpointData: allCheckpointData
      });

      const result = await response.json();
      setPersona(result.persona);
      setChallengeDraft(result.challengeDraft);

    } catch (error: any) {
      console.error("Error generating persona:", error);
      toast({
        title: "Generation Error",
        description: "Failed to generate persona. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmitForReview = async () => {
    if (!persona) return;

    try {
      setIsSubmitting(true);

      const response = await apiRequest("POST", "/api/submit-assessment-configuration", {
        allCheckpointData,
        persona,
        challengeDraft
      });

      const result = await response.json();

      toast({
        title: "Configuration Submitted",
        description: "Your assessment configuration has been submitted for review. Expected review time: 24 hours.",
        variant: "default"
      });

      onComplete({
        persona,
        challengeDraft,
        submissionId: result.submissionId,
        reviewStatus: "pending"
      });

    } catch (error: any) {
      console.error("Error submitting configuration:", error);
      toast({
        title: "Submission Error", 
        description: "Failed to submit configuration. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefineProfile = () => {
    // Return to checkpoint 5 for refinement
    onBack();
  };

  const getCheckpointSummary = () => {
    if (!allCheckpointData) return "Generated from your complete assessment configuration";

    const checkpoint1 = allCheckpointData.checkpoint1 || {};
    const keyTasks = checkpoint1.keyTasks || [];
    const environment = checkpoint1.workEnvironment || "collaborative environment";
    
    return `Generated from your requirements: ${keyTasks.slice(0, 3).join(", ")} in a ${environment}`;
  };

  if (isGenerating) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-6 h-6 text-blue-600" />
              <span>Generating Your Ideal Candidate Profile</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <Loader2 className="w-12 h-12 animate-spin mx-auto text-blue-600" />
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Creating Your Perfect Match</h3>
                <p className="text-slate-600 max-w-2xl mx-auto">
                  We're analysing your 5 checkpoints of detailed requirements to create a comprehensive 
                  ideal candidate profile and generate a bespoke skills challenge.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-blue-900">Behavioral Analysis</p>
                  <p className="text-xs text-blue-700">DISC profiling & work style matching</p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-green-900">Persona Creation</p>
                  <p className="text-xs text-green-700">Ideal candidate characteristics</p>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <Brain className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-purple-900">Challenge Design</p>
                  <p className="text-xs text-purple-700">Bespoke skills assessment</p>
                </div>
              </div>

              <div className="text-xs text-slate-500">
                This process typically takes 30-60 seconds...
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!persona) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-red-600">Failed to generate persona. Please try again.</p>
            <Button onClick={generatePersona} className="mt-4">
              Retry Generation
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress indicator */}
      <div className="text-sm text-slate-600 mb-4">
        Checkpoint 6 of 6: Persona Review & Challenge Refinement
      </div>

      <PersonaDisplay
        persona={persona}
        onRefineProfile={handleRefineProfile}
        onReviewChallenge={handleSubmitForReview}
        checkpointSummary={getCheckpointSummary()}
      />

      {/* Challenge Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Challenge Draft Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-slate-50 rounded-lg p-4">
            <pre className="whitespace-pre-wrap text-sm text-slate-700 font-mono">
              {challengeDraft}
            </pre>
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Next Steps:</strong> This initial challenge draft will be reviewed by our assessment experts 
              within 24 hours. They'll refine it based on entry-level best practices and ensure it accurately 
              reflects your requirements before activation.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Submit Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-900">Ready to Submit?</h3>
              <p className="text-sm text-slate-600">
                Your complete assessment configuration will be reviewed within 24 hours during business hours.
              </p>
            </div>
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={onBack}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Calibration</span>
              </Button>
              
              <Button 
                onClick={handleSubmitForReview}
                disabled={isSubmitting}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
                <span>
                  {isSubmitting ? "Submitting..." : "Submit for Review"}
                </span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}