import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Checkpoint2Data {
  writtenCommunication: string[];
  challengingEmailExample: string;
  difficultNewsFrequency: string;
  difficultNewsApproach: string;
  communicationChallenges: string[];
  communicationFailure: string;
  stakeholderInteraction: string[];
  communicationStyle: string;
}

interface Props {
  onContinue: (data: Checkpoint2Data) => void;
  onBack: () => void;
  initialData?: Checkpoint2Data;
  checkpoint1Data: {
    keyTasks: string[];
    clientInteraction: string;
  };
}

export default function EmployerMatchingCheckpoint2({ onContinue, onBack, initialData, checkpoint1Data }: Props) {
  const [formData, setFormData] = useState<Checkpoint2Data>({
    writtenCommunication: initialData?.writtenCommunication || [],
    challengingEmailExample: initialData?.challengingEmailExample || '',
    difficultNewsFrequency: initialData?.difficultNewsFrequency || '',
    difficultNewsApproach: initialData?.difficultNewsApproach || '',
    communicationChallenges: initialData?.communicationChallenges || [],
    communicationFailure: initialData?.communicationFailure || '',
    stakeholderInteraction: initialData?.stakeholderInteraction || [],
    communicationStyle: initialData?.communicationStyle || ''
  });

  // Dynamic communication options based on Checkpoint 1 selections
  const getWrittenCommunicationOptions = () => {
    const options = [];
    
    // Always include basic internal communication
    options.push({ id: 'team-updates', label: 'Internal team updates and coordination' });
    
    // Add client-facing options if client communication selected
    if (checkpoint1Data.keyTasks.includes('client-communication') || 
        checkpoint1Data.keyTasks.includes('stakeholder-management') ||
        checkpoint1Data.clientInteraction === 'direct-communication') {
      options.push(
        { id: 'client-emails', label: 'Professional client emails (formal, relationship-building)' },
        { id: 'client-proposals', label: 'Client proposals and project updates' },
        { id: 'difficult-conversations', label: 'Difficult client conversations and expectation management' }
      );
    }
    
    // Add creative options if creative tasks selected
    if (checkpoint1Data.keyTasks.some(task => ['designing-artwork', 'content-creation', 'social-media-management', 'creative-briefing'].includes(task))) {
      options.push(
        { id: 'creative-briefs', label: 'Creative briefs and project specifications' },
        { id: 'social-marketing', label: 'Social media or marketing content' },
        { id: 'creative-feedback', label: 'Creative feedback and revision requests' }
      );
    }
    
    // Add technical options if technical tasks selected
    if (checkpoint1Data.keyTasks.some(task => ['data-analysis', 'software-development', 'technical-support', 'system-management'].includes(task))) {
      options.push(
        { id: 'technical-docs', label: 'Technical documentation or procedures' },
        { id: 'bug-reports', label: 'Bug reports and technical support responses' },
        { id: 'code-reviews', label: 'Code review comments and technical explanations' }
      );
    }
    
    // Add business options if business tasks selected
    if (checkpoint1Data.keyTasks.some(task => ['financial-management', 'business-analysis', 'sales-support', 'presenting-reporting'].includes(task))) {
      options.push(
        { id: 'reports-summaries', label: 'Reports and analysis summaries' },
        { id: 'stakeholder-presentations', label: 'Stakeholder presentations and business communications' },
        { id: 'financial-reports', label: 'Financial reports and budget communications' }
      );
    }
    
    return options;
  };

  const writtenCommunicationOptions = getWrittenCommunicationOptions();

  // Enhanced detailed scenario placeholder
  const getDetailedScenarioPlaceholder = () => {
    if (checkpoint1Data.keyTasks.includes('client-communication')) {
      return "Describe a specific difficult client situation: What was their complaint? What tone did you need? What was the business impact if handled poorly? What information did you need before responding? How do you typically handle these situations?";
    }
    if (checkpoint1Data.keyTasks.some(task => ['designing-artwork', 'content-creation', 'creative-briefing'].includes(task))) {
      return "Describe when creative work was rejected: What were the specific issues? How should feedback be delivered to creative team? What's your approval process? How do you balance client preferences vs design best practices?";
    }
    if (checkpoint1Data.keyTasks.some(task => ['software-development', 'technical-support', 'data-analysis'].includes(task))) {
      return "Describe a recent technical problem: What systems were affected? How should technical issues be communicated to stakeholders? What level of detail do they want? What's your escalation process?";
    }
    return "Describe a challenging internal coordination situation: What departments were involved? What was the timeline pressure? How do you prioritise competing demands? What communication broke down?";
  };

  // Dynamic guided questions based on role type
  const getGuidedQuestions = () => {
    if (checkpoint1Data.keyTasks.includes('client-communication')) {
      return [
        "What was the client's specific complaint or concern?",
        "What tone did you need to strike? (apologetic, firm, educational)",
        "What was the potential business impact if handled poorly?",
        "How do you typically handle similar situations?"
      ];
    }
    if (checkpoint1Data.keyTasks.some(task => ['designing-artwork', 'content-creation', 'creative-briefing'].includes(task))) {
      return [
        "What were the specific creative issues or feedback?",
        "How should feedback be delivered to maintain team morale?",
        "What's your creative approval process?",
        "How do you balance client preferences vs best practices?"
      ];
    }
    if (checkpoint1Data.keyTasks.some(task => ['software-development', 'technical-support', 'data-analysis'].includes(task))) {
      return [
        "What systems/tools were affected by the problem?",
        "How should technical issues be explained to non-technical people?",
        "What level of technical detail do stakeholders want?",
        "What's your escalation process for technical problems?"
      ];
    }
    return [
      "What departments or team members were involved?",
      "What was the specific timeline or deadline pressure?",
      "How do you prioritise when everything seems urgent?",
      "What communication or tools typically break down?"
    ];
  };

  // Skip irrelevant questions based on role type
  const shouldShowClientQuestions = () => {
    return checkpoint1Data.keyTasks.includes('client-communication') || 
           checkpoint1Data.keyTasks.includes('stakeholder-management') ||
           checkpoint1Data.clientInteraction === 'direct-communication';
  };

  const shouldShowCreativeQuestions = () => {
    return checkpoint1Data.keyTasks.some(task => 
      ['designing-artwork', 'content-creation', 'social-media-management', 'creative-briefing'].includes(task)
    );
  };

  const difficultNewsFrequencyOptions = [
    { value: 'frequently', label: 'Frequently - it\'s a core part of the role' },
    { value: 'occasionally', label: 'Occasionally - when projects hit challenges' },
    { value: 'rarely', label: 'Rarely - mainly positive communications' },
    { value: 'never', label: 'Never - others handle difficult conversations' }
  ];

  const difficultNewsApproachOptions = [
    { value: 'direct-solution', label: 'Direct and solution-focused (get to the point quickly)' },
    { value: 'diplomatic-context', label: 'Diplomatic with context (soften the impact with explanation)' },
    { value: 'collaborative', label: 'Collaborative problem-solving (involve recipient in solutions)' },
    { value: 'escalate', label: 'Escalate to manager level (junior staff shouldn\'t handle this)' }
  ];

  const communicationChallengeOptions = [
    { id: 'too-informal', label: 'Too informal in professional settings' },
    { id: 'not-concise', label: 'Struggle to be concise and clear' },
    { id: 'avoid-difficult', label: 'Avoid difficult conversations' },
    { id: 'no-follow-up', label: 'Don\'t follow up or chase responses' },
    { id: 'miss-details', label: 'Miss important details in client communications' },
    { id: 'cant-adapt-tone', label: 'Can\'t adapt tone for different audiences' }
  ];

  const stakeholderInteractionOptions = [
    { id: 'presenting-work', label: 'Presenting work for approval' },
    { id: 'taking-briefs', label: 'Taking detailed briefs and requirements' },
    { id: 'status-updates', label: 'Providing status updates on projects' },
    { id: 'asking-questions', label: 'Asking questions when stuck' },
    { id: 'managing-expectations', label: 'Managing expectations on timelines' }
  ];

  const communicationStyleOptions = [
    { value: 'friendly-professional', label: 'Friendly but professional (warm relationship-building)' },
    { value: 'efficient-focused', label: 'Efficient and task-focused (get things done quickly)' },
    { value: 'collaborative-inclusive', label: 'Collaborative and inclusive (lots of team input)' },
    { value: 'formal-structured', label: 'Formal and structured (clear hierarchies and processes)' }
  ];

  const handleArrayToggle = (array: string[], value: string, field: keyof Checkpoint2Data) => {
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
    const basicRequirements = formData.writtenCommunication.length > 0 && 
                              formData.challengingEmailExample.trim() &&
                              formData.communicationChallenges.length > 0 &&
                              formData.communicationStyle;
    
    // Only require client-specific questions if client interaction is relevant
    const clientRequirements = !shouldShowClientQuestions() || 
                               (formData.difficultNewsFrequency && formData.difficultNewsApproach);
    
    const stakeholderRequirements = !shouldShowClientQuestions() || 
                                   formData.stakeholderInteraction.length > 0;
    
    return basicRequirements && clientRequirements && stakeholderRequirements;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Communication Requirements Deep-Dive
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Help us understand the specific communication scenarios for challenge creation
        </p>
        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Checkpoint 2 of 5 • 7-8 minutes
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Written Communication Types
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>This helps us generate realistic email and writing scenarios for skills challenges.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <CardDescription>
            What types of written communication will they handle? (Select all that apply)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {writtenCommunicationOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                <Checkbox
                  id={option.id}
                  checked={formData.writtenCommunication.includes(option.id)}
                  onCheckedChange={() => handleArrayToggle(formData.writtenCommunication, option.id, 'writtenCommunication')}
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
          <CardTitle>Challenging Email Scenario</CardTitle>
          <CardDescription>
            Describe a typical challenging email they might need to write
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder={getDetailedScenarioPlaceholder()}
            value={formData.challengingEmailExample}
            onChange={(e) => setFormData(prev => ({ ...prev, challengingEmailExample: e.target.value }))}
            className="min-h-[120px]"
          />
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            This specific scenario will be used to create realistic communication challenges.
          </p>
        </CardContent>
      </Card>

      {shouldShowClientQuestions() && (
        <Card>
          <CardHeader>
            <CardTitle>Difficult News Delivery</CardTitle>
            <CardDescription>
              How often will they need to deliver difficult news?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {difficultNewsFrequencyOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                  <input
                    type="radio"
                    id={option.value}
                    name="difficultNewsFrequency"
                    value={option.value}
                    checked={formData.difficultNewsFrequency === option.value}
                    onChange={(e) => setFormData(prev => ({ ...prev, difficultNewsFrequency: e.target.value }))}
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
      )}

      <Card>
        <CardHeader>
          <CardTitle>Preferred Approach for Bad News</CardTitle>
          <CardDescription>
            When delivering bad news, what approach do you prefer?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {difficultNewsApproachOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                <input
                  type="radio"
                  id={option.value}
                  name="difficultNewsApproach"
                  value={option.value}
                  checked={formData.difficultNewsApproach === option.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, difficultNewsApproach: e.target.value }))}
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
          <CardTitle>Common Communication Challenges</CardTitle>
          <CardDescription>
            What's your biggest communication challenge with junior staff? (Select all that apply)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {communicationChallengeOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                <Checkbox
                  id={option.id}
                  checked={formData.communicationChallenges.includes(option.id)}
                  onCheckedChange={() => handleArrayToggle(formData.communicationChallenges, option.id, 'communicationChallenges')}
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
          <CardTitle>Communication Failure Example</CardTitle>
          <CardDescription>
            Describe a recent communication failure that cost time/money (optional)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Help us understand what good communication prevents..."
            value={formData.communicationFailure}
            onChange={(e) => setFormData(prev => ({ ...prev, communicationFailure: e.target.value }))}
            className="min-h-[100px]"
          />
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            This helps us understand the stakes and create more realistic scenarios.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Senior Stakeholder Interaction</CardTitle>
          <CardDescription>
            How will they interact with senior stakeholders? (Select all that apply)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stakeholderInteractionOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                <Checkbox
                  id={option.id}
                  checked={formData.stakeholderInteraction.includes(option.id)}
                  onCheckedChange={() => handleArrayToggle(formData.stakeholderInteraction, option.id, 'stakeholderInteraction')}
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
          <CardTitle>Team Communication Style</CardTitle>
          <CardDescription>
            What communication style fits your team culture?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {communicationStyleOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                <input
                  type="radio"
                  id={option.value}
                  name="communicationStyle"
                  value={option.value}
                  checked={formData.communicationStyle === option.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, communicationStyle: e.target.value }))}
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

      <div className="flex justify-between pt-6">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Role Context
        </Button>
        
        <Button
          onClick={handleContinue}
          disabled={!isFormValid()}
          className="flex items-center gap-2"
        >
          Continue to Quality Control
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}