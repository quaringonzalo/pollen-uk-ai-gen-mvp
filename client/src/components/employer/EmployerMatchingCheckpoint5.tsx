import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, CheckCircle, HelpCircle, Settings, FileText, Clock, Zap } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

interface Checkpoint5Data {
  emailScenarioApproved: boolean;
  emailScenarioAdjustments: string;
  qualityMaterialsApproved: boolean;
  qualityMaterialsAdjustments: string;
  pressureScenarioApproved: boolean;
  pressureScenarioAdjustments: string;
  companySpecificRequirements: string;
  difficultyLevel: string;
}

interface Props {
  onComplete: (data: Checkpoint5Data) => void;
  onBack: () => void;
  initialData?: Checkpoint5Data;
  // These would come from previous checkpoints in real implementation
  generatedChallenges?: {
    emailScenario: string;
    qualityMaterial: string;
    pressureScenario: string;
  };
}

export default function EmployerMatchingCheckpoint5({ onComplete, onBack, initialData, generatedChallenges }: Props) {
  const [formData, setFormData] = useState<Checkpoint5Data>({
    emailScenarioApproved: initialData?.emailScenarioApproved || false,
    emailScenarioAdjustments: initialData?.emailScenarioAdjustments || '',
    qualityMaterialsApproved: initialData?.qualityMaterialsApproved || false,
    qualityMaterialsAdjustments: initialData?.qualityMaterialsAdjustments || '',
    pressureScenarioApproved: initialData?.pressureScenarioApproved || false,
    pressureScenarioAdjustments: initialData?.pressureScenarioAdjustments || '',
    companySpecificRequirements: initialData?.companySpecificRequirements || '',
    difficultyLevel: initialData?.difficultyLevel || ''
  });

  // Mock generated challenges for demonstration
  const mockChallenges = generatedChallenges || {
    emailScenario: "A client project is running 2 days behind due to unexpected feedback from their stakeholders. Write a professional email explaining the delay while maintaining the relationship and proposing next steps. The client has a board meeting next week where they planned to present this work.",
    qualityMaterial: "Review a client presentation with 8 deliberate errors including: spelling mistakes, brand colour inconsistencies, outdated data from Q2 instead of Q3, missing contact information, and design alignment issues.",
    pressureScenario: "You have 90 minutes before a client call. You need to: review designer feedback on 3 concepts, update project timeline in the system, respond to 2 urgent client emails about different projects, and prepare talking points for the call. How do you prioritize and what gets done first?"
  };

  const difficultyLevelOptions = [
    { value: 'entry-level', label: 'Entry-level friendly (minimal experience assumed)', description: 'Challenges focus on core competencies with clear guidance' },
    { value: 'some-experience', label: 'Some experience helpful (1-2 years background)', description: 'Moderate complexity with industry context' },
    { value: 'experienced', label: 'Experienced candidates preferred (2+ years)', description: 'Advanced scenarios requiring proven track record' }
  ];

  const handleComplete = () => {
    onComplete(formData);
  };

  const isFormValid = () => {
    return formData.difficultyLevel &&
           (formData.emailScenarioApproved || formData.emailScenarioAdjustments.trim()) &&
           (formData.qualityMaterialsApproved || formData.qualityMaterialsAdjustments.trim()) &&
           (formData.pressureScenarioApproved || formData.pressureScenarioAdjustments.trim());
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Challenge Selection & Customization
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Review and customize auto-generated challenges based on your requirements
        </p>
        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Checkpoint 5 of 5 • 8-10 minutes
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="font-semibold text-blue-900 dark:text-blue-100">Auto-Generated Challenge Suite</h3>
        </div>
        <p className="text-blue-800 dark:text-blue-200 text-sm">
          Based on your previous responses, we've created a personalised set of challenges. Review each one and make adjustments as needed.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-green-600" />
            Foundation Communication Challenge
            <Badge variant="secondary">Always Included</Badge>
          </CardTitle>
          <CardDescription>
            Professional email writing and difficult conversation handling
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Generated Email Scenario:</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {mockChallenges.emailScenario}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Checkbox
              id="email-approved"
              checked={formData.emailScenarioApproved}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, emailScenarioApproved: !!checked }))}
            />
            <Label htmlFor="email-approved" className="cursor-pointer">
              This scenario matches our reality
            </Label>
          </div>

          {!formData.emailScenarioApproved && (
            <div className="space-y-2">
              <Label htmlFor="email-adjustments">Suggested adjustments:</Label>
              <Textarea
                id="email-adjustments"
                placeholder="What should we change about this scenario to make it more realistic for your role?"
                value={formData.emailScenarioAdjustments}
                onChange={(e) => setFormData(prev => ({ ...prev, emailScenarioAdjustments: e.target.value }))}
                className="min-h-[80px]"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-orange-600" />
            Quality Control Challenge
            <Badge variant="outline">Error Detection</Badge>
          </CardTitle>
          <CardDescription>
            Error detection in realistic materials with deliberate mistakes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Generated Quality Control Material:</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {mockChallenges.qualityMaterial}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Checkbox
              id="quality-approved"
              checked={formData.qualityMaterialsApproved}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, qualityMaterialsApproved: !!checked }))}
            />
            <Label htmlFor="quality-approved" className="cursor-pointer">
              These error types match what we need to catch
            </Label>
          </div>

          {!formData.qualityMaterialsApproved && (
            <div className="space-y-2">
              <Label htmlFor="quality-adjustments">Specific error types to include/remove:</Label>
              <Textarea
                id="quality-adjustments"
                placeholder="What errors are most important for this role? What should we add or remove?"
                value={formData.qualityMaterialsAdjustments}
                onChange={(e) => setFormData(prev => ({ ...prev, qualityMaterialsAdjustments: e.target.value }))}
                className="min-h-[80px]"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-red-600" />
            Pressure & Multitasking Challenge
            <Badge variant="destructive">High Stakes</Badge>
          </CardTitle>
          <CardDescription>
            Priority management simulation under time pressure
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Generated Pressure Scenario:</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {mockChallenges.pressureScenario}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Checkbox
              id="pressure-approved"
              checked={formData.pressureScenarioApproved}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, pressureScenarioApproved: !!checked }))}
            />
            <Label htmlFor="pressure-approved" className="cursor-pointer">
              This pressure scenario is realistic for our environment
            </Label>
          </div>

          {!formData.pressureScenarioApproved && (
            <div className="space-y-2">
              <Label htmlFor="pressure-adjustments">Adjust time pressure and complexity:</Label>
              <Textarea
                id="pressure-adjustments"
                placeholder="Should we increase/decrease the time pressure? Add different tasks? Change the context?"
                value={formData.pressureScenarioAdjustments}
                onChange={(e) => setFormData(prev => ({ ...prev, pressureScenarioAdjustments: e.target.value }))}
                className="min-h-[80px]"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Company-Specific Requirements</CardTitle>
          <CardDescription>
            Add any additional requirements specific to your company or industry
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Industry knowledge, software skills, cultural elements, specific processes..."
            value={formData.companySpecificRequirements}
            onChange={(e) => setFormData(prev => ({ ...prev, companySpecificRequirements: e.target.value }))}
            className="min-h-[100px]"
          />
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            These will be incorporated into the final challenge suite.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Overall Difficulty Level</CardTitle>
          <CardDescription>
            Set the appropriate difficulty level for your target candidates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {difficultyLevelOptions.map((option) => (
              <div key={option.value} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                <input
                  type="radio"
                  id={option.value}
                  name="difficultyLevel"
                  value={option.value}
                  checked={formData.difficultyLevel === option.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, difficultyLevel: e.target.value }))}
                  className="text-blue-600 mt-1"
                />
                <div className="flex-1">
                  <Label htmlFor={option.value} className="font-medium cursor-pointer">
                    {option.label}
                  </Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {option.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
          <h3 className="font-semibold text-green-900 dark:text-green-100">Next Steps</h3>
        </div>
        <div className="text-green-800 dark:text-green-200 text-sm space-y-1">
          <p>• Your bespoke challenge suite will be finalized and ready for candidates</p>
          <p>• Matching algorithm will be activated with your behavioural and skills requirements</p>
          <p>• You'll be notified when qualified candidates complete the challenges</p>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Pressure Scenarios
        </Button>
        
        <Button
          onClick={handleComplete}
          disabled={!isFormValid()}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
        >
          <CheckCircle className="w-4 h-4" />
          Activate Candidate Matching
        </Button>
      </div>
    </div>
  );
}