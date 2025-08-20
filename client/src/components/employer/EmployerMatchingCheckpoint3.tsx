import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Checkpoint3Data {
  qualityCheckMaterials: string[];
  commonQualityIssues: string[];
  worstQualityFailure: string;
  detailLevel: string;
  qualityImpact: string[];
  currentQualityProcess: string;
  qualityTools: string;
}

interface Props {
  onContinue: (data: Checkpoint3Data) => void;
  onBack: () => void;
  initialData?: Checkpoint3Data;
  checkpoint1Data: {
    keyTasks: string[];
  };
}

export default function EmployerMatchingCheckpoint3({ onContinue, onBack, initialData, checkpoint1Data }: Props) {
  const [formData, setFormData] = useState<Checkpoint3Data>({
    qualityCheckMaterials: initialData?.qualityCheckMaterials || [],
    commonQualityIssues: initialData?.commonQualityIssues || [],
    worstQualityFailure: initialData?.worstQualityFailure || '',
    detailLevel: initialData?.detailLevel || '',
    qualityImpact: initialData?.qualityImpact || [],
    currentQualityProcess: initialData?.currentQualityProcess || '',
    qualityTools: initialData?.qualityTools || ''
  });

  // Dynamic quality check materials based on role type
  const getQualityCheckMaterialsOptions = () => {
    const options = [];
    
    // Add client-facing materials if client communication selected
    if (checkpoint1Data.keyTasks.includes('client-communication') || 
        checkpoint1Data.keyTasks.includes('stakeholder-management')) {
      options.push(
        { id: 'client-presentations', label: 'Client-facing presentations and proposals' },
        { id: 'client-proposals', label: 'Client proposals and project updates' }
      );
    }
    
    // Add creative materials if creative tasks selected
    if (checkpoint1Data.keyTasks.some(task => ['designing-artwork', 'content-creation', 'social-media-management', 'creative-briefing'].includes(task))) {
      options.push(
        { id: 'marketing-materials', label: 'Marketing materials (posters, social media, websites)' },
        { id: 'creative-work', label: 'Creative work before client review' },
        { id: 'brand-materials', label: 'Brand guidelines and visual identity materials' }
      );
    }
    
    // Add technical materials if technical tasks selected
    if (checkpoint1Data.keyTasks.some(task => ['software-development', 'technical-support', 'data-analysis', 'system-management'].includes(task))) {
      options.push(
        { id: 'technical-documentation', label: 'Technical documentation and code comments' },
        { id: 'data-reports', label: 'Data analysis reports and dashboards' },
        { id: 'system-configurations', label: 'System configurations and deployment scripts' }
      );
    }
    
    // Add business materials if business tasks selected
    if (checkpoint1Data.keyTasks.some(task => ['financial-management', 'business-analysis', 'sales-support'].includes(task))) {
      options.push(
        { id: 'financial-data', label: 'Financial reports and budget analysis' },
        { id: 'business-reports', label: 'Business analysis and strategic reports' },
        { id: 'sales-materials', label: 'Sales proposals and client materials' }
      );
    }
    
    // Always include basic options
    options.push(
      { id: 'written-reports', label: 'Written reports and analysis' },
      { id: 'process-docs', label: 'Internal process documentation' }
    );
    
    return options;
  };

  const qualityCheckMaterialsOptions = getQualityCheckMaterialsOptions();

  // Dynamic quality issues based on role type
  const getCommonQualityIssuesOptions = () => {
    const options = [];
    
    // Always include basic issues
    options.push(
      { id: 'spelling-grammar', label: 'Spelling and grammar errors' },
      { id: 'factual-errors', label: 'Factual inaccuracies or outdated information' },
      { id: 'missing-info', label: 'Missing key information or requirements' }
    );
    
    // Add creative-specific issues
    if (checkpoint1Data.keyTasks.some(task => ['designing-artwork', 'content-creation', 'social-media-management', 'creative-briefing'].includes(task))) {
      options.push(
        { id: 'brand-inconsistency', label: 'Inconsistent branding/formatting' },
        { id: 'design-issues', label: 'Poor visual design or layout issues' },
        { id: 'image-quality', label: 'Low resolution or poor quality images' }
      );
    }
    
    // Add technical-specific issues
    if (checkpoint1Data.keyTasks.some(task => ['software-development', 'technical-support', 'data-analysis'].includes(task))) {
      options.push(
        { id: 'data-accuracy', label: 'Data calculation errors or incorrect formulas' },
        { id: 'code-quality', label: 'Code syntax errors or poor documentation' },
        { id: 'system-compatibility', label: 'Compatibility issues or broken functionality' }
      );
    }
    
    // Add business-specific issues
    if (checkpoint1Data.keyTasks.some(task => ['financial-management', 'business-analysis', 'sales-support'].includes(task))) {
      options.push(
        { id: 'financial-accuracy', label: 'Financial calculation errors or inconsistencies' },
        { id: 'compliance-issues', label: 'Regulatory compliance or legal requirement failures' }
      );
    }
    
    // Add communication-specific issues
    options.push({ id: 'unclear-messaging', label: 'Unclear or confusing messaging' });
    
    return options;
  };

  const commonQualityIssuesOptions = getCommonQualityIssuesOptions();

  const detailLevelOptions = [
    { value: 'forensic', label: 'Forensic level - every detail must be perfect' },
    { value: 'thorough-practical', label: 'Thorough but practical - catch major issues efficiently' },
    { value: 'high-level', label: 'High-level review - focus on big picture problems' },
    { value: 'basic-sense-check', label: 'Basic sense-check - obvious errors only' }
  ];

  const qualityImpactOptions = [
    { id: 'client-embarrassment', label: 'Client embarrassment and relationship damage' },
    { id: 'rework-costs', label: 'Rework costs and timeline delays' },
    { id: 'team-credibility', label: 'Team credibility and professional reputation' },
    { id: 'financial-penalties', label: 'Financial penalties or lost business' },
    { id: 'process-breakdowns', label: 'Internal process breakdowns' }
  ];

  const currentQualityProcessOptions = [
    { value: 'multiple-review', label: 'Multiple people review everything' },
    { value: 'self-check-spotcheck', label: 'Self-checking with spot-checks from seniors' },
    { value: 'peer-review', label: 'Peer review between team members' },
    { value: 'single-approval', label: 'Single person responsible for final approval' }
  ];

  const handleArrayToggle = (array: string[], value: string, field: keyof Checkpoint3Data) => {
    const currentArray = formData[field] as string[];
    setFormData(prev => ({
      ...prev,
      [field]: currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value]
    }));
  };

  const handleContinue = () => {
    onContinue(formData);
  };

  const isFormValid = () => {
    return formData.qualityCheckMaterials.length > 0 && 
           formData.commonQualityIssues.length > 0 &&
           formData.worstQualityFailure.trim() &&
           formData.detailLevel && 
           formData.qualityImpact.length > 0 &&
           formData.currentQualityProcess;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Quality Control & Attention to Detail
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Define quality standards and error-detection requirements for challenge creation
        </p>
        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Checkpoint 3 of 5 • 6-7 minutes
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Materials to Quality Check
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>This helps us create realistic materials with deliberate errors for quality control challenges.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <CardDescription>
            What types of materials will they quality check? (Select all that apply)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {qualityCheckMaterialsOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                <Checkbox
                  id={option.id}
                  checked={formData.qualityCheckMaterials.includes(option.id)}
                  onCheckedChange={() => handleArrayToggle(formData.qualityCheckMaterials, option.id, 'qualityCheckMaterials')}
                />
                <Label htmlFor={option.id} className="cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Common Quality Issues</CardTitle>
          <CardDescription>
            What are the most common quality issues you've seen? (Select all that apply)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {commonQualityIssuesOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                <Checkbox
                  id={option.id}
                  checked={formData.commonQualityIssues.includes(option.id)}
                  onCheckedChange={() => handleArrayToggle(formData.commonQualityIssues, option.id, 'commonQualityIssues')}
                />
                <Label htmlFor={option.id} className="cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Worst Quality Control Failure</CardTitle>
          <CardDescription>
            Describe your worst quality control failure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="What went wrong and what should have been caught before it reached the client?"
            value={formData.worstQualityFailure}
            onChange={(e) => setFormData(prev => ({ ...prev, worstQualityFailure: e.target.value }))}
            className="min-h-[120px]"
          />
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            This helps us understand the real-world consequences and create appropriate challenge scenarios.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Required Detail Level</CardTitle>
          <CardDescription>
            How detailed should their quality checking be?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {detailLevelOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                <input
                  type="radio"
                  id={option.value}
                  name="detailLevel"
                  value={option.value}
                  checked={formData.detailLevel === option.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, detailLevel: e.target.value }))}
                  className="text-blue-600"
                />
                <Label htmlFor={option.value} className="cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Impact of Quality Issues</CardTitle>
          <CardDescription>
            What's the impact when quality issues slip through? (Select all that apply)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {qualityImpactOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                <Checkbox
                  id={option.id}
                  checked={formData.qualityImpact.includes(option.id)}
                  onCheckedChange={() => handleArrayToggle(formData.qualityImpact, option.id, 'qualityImpact')}
                />
                <Label htmlFor={option.id} className="cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Quality Control Process</CardTitle>
          <CardDescription>
            How do you currently handle quality control?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currentQualityProcessOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                <input
                  type="radio"
                  id={option.value}
                  name="currentQualityProcess"
                  value={option.value}
                  checked={formData.currentQualityProcess === option.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentQualityProcess: e.target.value }))}
                  className="text-blue-600"
                />
                <Label htmlFor={option.value} className="cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quality Control Tools & Processes</CardTitle>
          <CardDescription>
            What quality control tools or processes do you use? (optional)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Checklists, software, review processes, style guides..."
            value={formData.qualityTools}
            onChange={(e) => setFormData(prev => ({ ...prev, qualityTools: e.target.value }))}
            className="min-h-[100px]"
          />
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            This helps us make the quality control challenges more realistic to your actual processes.
          </p>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-6">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Communication
        </Button>
        
        <Button
          onClick={handleContinue}
          disabled={!isFormValid()}
          className="flex items-center gap-2"
        >
          Continue to Pressure Scenarios
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}