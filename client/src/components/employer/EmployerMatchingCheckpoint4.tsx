import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Checkpoint4Data {
  typicalPressureSituation: string;
  multitaskingFrequency: string;
  stressCauses: string[];
  prioritizationMethod: string;
  leadershipRole: string;
  multitaskingAbilities: string[];
  pressureExample: string;
}

interface Props {
  onContinue: (data: Checkpoint4Data) => void;
  onBack: () => void;
  initialData?: Checkpoint4Data;
  checkpoint1Data: {
    keyTasks: string[];
    workEnvironment: string;
  };
}

export default function EmployerMatchingCheckpoint4({ onContinue, onBack, initialData, checkpoint1Data }: Props) {
  const [formData, setFormData] = useState<Checkpoint4Data>({
    typicalPressureSituation: initialData?.typicalPressureSituation || '',
    multitaskingFrequency: initialData?.multitaskingFrequency || '',
    stressCauses: initialData?.stressCauses || [],
    prioritizationMethod: initialData?.prioritizationMethod || '',
    leadershipRole: initialData?.leadershipRole || '',
    multitaskingAbilities: initialData?.multitaskingAbilities || [],
    pressureExample: initialData?.pressureExample || ''
  });

  const multitaskingFrequencyOptions = [
    { value: 'constantly', label: 'Constantly - it\'s the nature of the role' },
    { value: 'frequently', label: 'Frequently during busy periods' },
    { value: 'occasionally', label: 'Occasionally when things get hectic' },
    { value: 'rarely', label: 'Rarely - they can usually focus on one thing' }
  ];

  const stressCausesOptions = [
    { id: 'client-demands', label: 'Client demands and expectations' },
    { id: 'tight-deadlines', label: 'Tight deadlines with lots of moving parts' },
    { id: 'unclear-instructions', label: 'Unclear instructions or changing requirements' },
    { id: 'technical-problems', label: 'Technical problems or system failures' },
    { id: 'team-coordination', label: 'Team coordination and communication challenges' },
    { id: 'quality-pressure', label: 'Quality pressure and reputation concerns' }
  ];

  const prioritizationMethodOptions = [
    { value: 'client-first', label: 'Client-facing work always comes first' },
    { value: 'follow-guidelines', label: 'Follow clear guidelines about priority levels' },
    { value: 'ask-guidance', label: 'Ask for guidance from senior team members' },
    { value: 'use-judgment', label: 'Use their judgment based on business impact' }
  ];

  const leadershipRoleOptions = [
    { value: 'take-charge', label: 'Take charge and coordinate team response' },
    { value: 'support-actively', label: 'Support senior staff but contribute actively' },
    { value: 'follow-instructions', label: 'Follow instructions and execute tasks efficiently' },
    { value: 'escalate-update', label: 'Escalate to management and provide updates' }
  ];

  // Dynamic pressure situation placeholder based on role type
  const getPressureSituationPlaceholder = () => {
    if (checkpoint1Data.keyTasks.includes('client-communication')) {
      return "Multiple urgent client requests, tight deadlines, competing priorities, client calls while working on deliverables...";
    }
    if (checkpoint1Data.keyTasks.some(task => ['software-development', 'technical-support', 'data-analysis'].includes(task))) {
      return "System downtime with users affected, debugging under time pressure, multiple technical issues requiring immediate attention...";
    }
    if (checkpoint1Data.keyTasks.some(task => ['designing-artwork', 'content-creation', 'creative-briefing'].includes(task))) {
      return "Multiple design revision cycles with tight deadlines, creative approvals needed urgently, conflicting creative feedback from stakeholders...";
    }
    return "Multiple urgent project updates needed, competing deadlines from different departments, coordination challenges with remote team members...";
  };

  // Dynamic multitasking abilities based on role type
  const getMultitaskingAbilitiesOptions = () => {
    const options = [];
    
    // Always include basic multitasking
    options.push(
      { id: 'handle-interruptions', label: 'Handling interruptions while maintaining focus' },
      { id: 'balance-urgent-planned', label: 'Balancing urgent requests with planned work' }
    );
    
    // Add client-specific multitasking if client communication selected
    if (checkpoint1Data.keyTasks.includes('client-communication') || 
        checkpoint1Data.keyTasks.includes('stakeholder-management')) {
      options.push(
        { id: 'multiple-projects', label: 'Managing multiple client projects simultaneously' },
        { id: 'client-internal-balance', label: 'Balancing client calls with internal deliverable work' }
      );
    }
    
    // Add creative-specific multitasking
    if (checkpoint1Data.keyTasks.some(task => ['designing-artwork', 'content-creation', 'creative-briefing'].includes(task))) {
      options.push(
        { id: 'creative-admin', label: 'Switching between creative and administrative tasks' },
        { id: 'multiple-creative-projects', label: 'Managing multiple creative projects in different stages' }
      );
    }
    
    // Add technical-specific multitasking
    if (checkpoint1Data.keyTasks.some(task => ['software-development', 'technical-support', 'data-analysis'].includes(task))) {
      options.push(
        { id: 'debug-develop', label: 'Switching between debugging urgent issues and planned development' },
        { id: 'technical-coordination', label: 'Managing technical tasks while supporting team members' }
      );
    }
    
    // Add coordination multitasking
    options.push({ id: 'coordinate-departments', label: 'Coordinating with different team members and departments' });
    
    return options;
  };

  const multitaskingAbilitiesOptions = getMultitaskingAbilitiesOptions();

  const handleArrayToggle = (array: string[], value: string, field: keyof Checkpoint4Data) => {
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
    return formData.typicalPressureSituation.trim() &&
           formData.multitaskingFrequency && 
           formData.stressCauses.length > 0 &&
           formData.prioritizationMethod && 
           formData.leadershipRole &&
           formData.multitaskingAbilities.length > 0;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Pressure & Multitasking Scenarios
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Define high-pressure situations and multitasking requirements for challenge creation
        </p>
        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Checkpoint 4 of 5 • 6-7 minutes
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Typical High-Pressure Situation
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>This specific scenario will be used to create realistic pressure-testing challenges.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <CardDescription>
            Describe a typical high-pressure situation in this role
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder={getPressureSituationPlaceholder()}
            value={formData.typicalPressureSituation}
            onChange={(e) => setFormData(prev => ({ ...prev, typicalPressureSituation: e.target.value }))}
            className="min-h-[120px]"
          />
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            We'll use this to create realistic multitasking and priority management scenarios.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Multitasking Frequency</CardTitle>
          <CardDescription>
            How often do they need to juggle multiple tasks simultaneously?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {multitaskingFrequencyOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                <input
                  type="radio"
                  id={option.value}
                  name="multitaskingFrequency"
                  value={option.value}
                  checked={formData.multitaskingFrequency === option.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, multitaskingFrequency: e.target.value }))}
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
          <CardTitle>Main Stress Causes</CardTitle>
          <CardDescription>
            What causes the most stress in this role? (Select all that apply)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stressCausesOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                <Checkbox
                  id={option.id}
                  checked={formData.stressCauses.includes(option.id)}
                  onCheckedChange={() => handleArrayToggle(formData.stressCauses, option.id, 'stressCauses')}
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
          <CardTitle>Prioritization Method</CardTitle>
          <CardDescription>
            When everything is urgent, how should they prioritise?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {prioritizationMethodOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                <input
                  type="radio"
                  id={option.value}
                  name="prioritizationMethod"
                  value={option.value}
                  checked={formData.prioritizationMethod === option.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, prioritizationMethod: e.target.value }))}
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
          <CardTitle>Leadership During Crises</CardTitle>
          <CardDescription>
            Describe their leadership role during crises
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leadershipRoleOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                <input
                  type="radio"
                  id={option.value}
                  name="leadershipRole"
                  value={option.value}
                  checked={formData.leadershipRole === option.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, leadershipRole: e.target.value }))}
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
          <CardTitle>Essential Multitasking Abilities</CardTitle>
          <CardDescription>
            What multitasking abilities are essential? (Select all that apply)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {multitaskingAbilitiesOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                <Checkbox
                  id={option.id}
                  checked={formData.multitaskingAbilities.includes(option.id)}
                  onCheckedChange={() => handleArrayToggle(formData.multitaskingAbilities, option.id, 'multitaskingAbilities')}
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
          <CardTitle>Pressure Excellence Example</CardTitle>
          <CardDescription>
            Give an example of when someone excelled under pressure (optional)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="What did they do that impressed you during a challenging situation?"
            value={formData.pressureExample}
            onChange={(e) => setFormData(prev => ({ ...prev, pressureExample: e.target.value }))}
            className="min-h-[100px]"
          />
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            This helps us understand what success looks like in high-pressure situations.
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
          Back to Quality Control
        </Button>
        
        <Button
          onClick={handleContinue}
          disabled={!isFormValid()}
          className="flex items-center gap-2"
        >
          Continue to Challenge Selection
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}