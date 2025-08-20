import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Checkpoint1Data {
  keyTasks: string[];
  customTasks: string;
  workEnvironment: string;
  independence: string;
  clientInteraction: string;
  pressureStakes: string;
  dayOneSuccess: string;
}

interface Props {
  onContinue: (data: Checkpoint1Data) => void;
  onBack: () => void;
  initialData?: Checkpoint1Data;
}

export default function EmployerMatchingCheckpoint1({ onContinue, onBack, initialData }: Props) {
  const [formData, setFormData] = useState<Checkpoint1Data>({
    keyTasks: initialData?.keyTasks || [],
    customTasks: initialData?.customTasks || '',
    workEnvironment: initialData?.workEnvironment || '',
    independence: initialData?.independence || '',
    clientInteraction: initialData?.clientInteraction || '',
    pressureStakes: initialData?.pressureStakes || '',
    dayOneSuccess: initialData?.dayOneSuccess || ''
  });

  const keyTaskCategories = [
    {
      category: 'Communication & Relationships',
      tasks: [
        { id: 'client-communication', label: 'Client Communication', description: 'Professional emails, calls, relationship building' },
        { id: 'stakeholder-management', label: 'Stakeholder Management', description: 'Coordinating between internal teams and external clients' },
        { id: 'relationship-diplomacy', label: 'Relationship Diplomacy', description: 'Handling difficult conversations, managing expectations' },
        { id: 'presenting-reporting', label: 'Presenting & Reporting', description: 'Creating presentations, delivering updates to senior stakeholders' }
      ]
    },
    {
      category: 'Project & Operations',
      tasks: [
        { id: 'project-coordination', label: 'Project Coordination', description: 'Managing timelines, chasing updates, status reporting' },
        { id: 'deadline-management', label: 'Deadline Management', description: 'Prioritizing urgent work, managing competing demands' },
        { id: 'quality-control', label: 'Quality Control', description: 'Reviewing materials before delivery, catching errors' },
        { id: 'administrative-tasks', label: 'Administrative Tasks', description: 'Documentation, filing, process management, data entry' }
      ]
    },
    {
      category: 'Creative & Content',
      tasks: [
        { id: 'designing-artwork', label: 'Designing Artwork', description: 'Creating graphics, layouts, visual materials' },
        { id: 'content-creation', label: 'Content Creation', description: 'Writing copy, creating social media posts, blog content' },
        { id: 'social-media-management', label: 'Social Media Management', description: 'Managing channels, posting content, community engagement' },
        { id: 'creative-briefing', label: 'Creative Briefing', description: 'Working with designers, providing feedback, managing revisions' }
      ]
    },
    {
      category: 'Technical & Analysis',
      tasks: [
        { id: 'data-analysis', label: 'Data Analysis', description: 'Analyzing datasets, creating reports, identifying trends' },
        { id: 'software-development', label: 'Software Development', description: 'Coding, testing, debugging, technical implementation' },
        { id: 'technical-support', label: 'Technical Support', description: 'Troubleshooting issues, providing technical assistance' },
        { id: 'system-management', label: 'System Management', description: 'Managing software, databases, technical infrastructure' }
      ]
    },
    {
      category: 'Business & Strategy',
      tasks: [
        { id: 'financial-management', label: 'Financial Management', description: 'Budget tracking, financial reporting, cost analysis' },
        { id: 'business-analysis', label: 'Business Analysis', description: 'Market research, process improvement, strategic planning' },
        { id: 'sales-support', label: 'Sales Support', description: 'Lead qualification, proposal creation, sales administration' },
        { id: 'problem-solving', label: 'Problem Solving', description: 'Identifying issues, developing solutions, implementing fixes' }
      ]
    }
  ];

  const workEnvironmentOptions = [
    { value: 'fast-paced', label: 'Fast-paced, lots of moving parts, constant context switching' },
    { value: 'steady-rhythm', label: 'Steady rhythm with occasional busy periods' },
    { value: 'calm-methodical', label: 'Calm, methodical environment with predictable workflows' },
    { value: 'mixed-intensity', label: 'Mix of intense periods and quieter project work' }
  ];

  const independenceOptions = [
    { value: 'high-autonomy', label: 'High autonomy - they set their own priorities and methods' },
    { value: 'guided-independence', label: 'Guided independence - clear objectives, flexible on approach' },
    { value: 'structured-role', label: 'Structured role - clear processes and regular check-ins' },
    { value: 'close-supervision', label: 'Close supervision - frequent guidance and approval needed' }
  ];

  const clientInteractionOptions = [
    { value: 'direct-communication', label: 'Direct client communication (emails, calls, meetings)' },
    { value: 'indirect-work', label: 'Indirect client work (preparing materials, behind-scenes support)' },
    { value: 'internal-focus', label: 'Internal focus with occasional external touchpoints' },
    { value: 'no-external', label: 'No external client interaction' }
  ];

  const pressureStakesOptions = [
    { value: 'high-stakes', label: 'High stakes - client-facing work with reputation/revenue impact' },
    { value: 'medium-stakes', label: 'Medium stakes - important but manageable consequences' },
    { value: 'lower-stakes', label: 'Lower stakes - supportive role with limited external impact' },
    { value: 'variable-stakes', label: 'Variable stakes depending on project and timeline' }
  ];

  const handleTaskToggle = (taskId: string) => {
    setFormData(prev => ({
      ...prev,
      keyTasks: prev.keyTasks.includes(taskId)
        ? prev.keyTasks.filter(id => id !== taskId)
        : [...prev.keyTasks, taskId]
    }));
  };

  const handleContinue = () => {
    onContinue(formData);
  };

  const isFormValid = () => {
    return formData.keyTasks.length > 0 && 
           formData.workEnvironment && 
           formData.independence && 
           formData.clientInteraction && 
           formData.pressureStakes &&
           formData.dayOneSuccess.trim();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Role Context & Environment
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Help us understand the core requirements and working environment for this role
        </p>
        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Checkpoint 1 of 5 • 5-6 minutes
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Key Tasks & Responsibilities
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Select all tasks this person will regularly handle. This helps us generate relevant skills challenges.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <CardDescription>
            What are the key tasks this person will handle? (Select all that apply)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {keyTaskCategories.map((category) => (
            <div key={category.category} className="space-y-3">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 border-b pb-2">
                {category.category}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {category.tasks.map((task) => (
                  <div key={task.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                    <Checkbox
                      id={task.id}
                      checked={formData.keyTasks.includes(task.id)}
                      onCheckedChange={() => handleTaskToggle(task.id)}
                    />
                    <div className="flex-1">
                      <Label htmlFor={task.id} className="font-medium cursor-pointer text-sm">
                        {task.label}
                      </Label>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {task.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          <div className="mt-6">
            <Label htmlFor="custom-tasks" className="text-base font-medium">
              Other key tasks (optional)
            </Label>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Describe any additional tasks specific to your role or industry...
            </p>
            <Textarea
              id="custom-tasks"
              placeholder="e.g., Managing client budgets and presenting ROI reports to C-suite"
              value={formData.customTasks}
              onChange={(e) => setFormData(prev => ({ ...prev, customTasks: e.target.value }))}
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Work Environment</CardTitle>
          <CardDescription>
            Describe the typical work environment and pace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {workEnvironmentOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                <input
                  type="radio"
                  id={option.value}
                  name="workEnvironment"
                  value={option.value}
                  checked={formData.workEnvironment === option.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, workEnvironment: e.target.value }))}
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
          <CardTitle>Independence Level</CardTitle>
          <CardDescription>
            How much independence will this person have in their work?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {independenceOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                <input
                  type="radio"
                  id={option.value}
                  name="independence"
                  value={option.value}
                  checked={formData.independence === option.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, independence: e.target.value }))}
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
          <CardTitle>Client Interaction Level</CardTitle>
          <CardDescription>
            What's the level of client interaction in this role?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {clientInteractionOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                <input
                  type="radio"
                  id={option.value}
                  name="clientInteraction"
                  value={option.value}
                  checked={formData.clientInteraction === option.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, clientInteraction: e.target.value }))}
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
          <CardTitle>Pressure & Stakes</CardTitle>
          <CardDescription>
            Describe the pressure level and consequences in this role
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pressureStakesOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                <input
                  type="radio"
                  id={option.value}
                  name="pressureStakes"
                  value={option.value}
                  checked={formData.pressureStakes === option.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, pressureStakes: e.target.value }))}
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
          <CardTitle>Day-One Success</CardTitle>
          <CardDescription>
            What's most important for this person to excel at immediately?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Describe what you need this person to excel at immediately vs. what they can learn over time..."
            value={formData.dayOneSuccess}
            onChange={(e) => setFormData(prev => ({ ...prev, dayOneSuccess: e.target.value }))}
            className="min-h-[120px]"
          />
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            This helps us calibrate the difficulty level of skills challenges for entry-level candidates.
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
          Back to Dashboard
        </Button>
        
        <Button
          onClick={handleContinue}
          disabled={!isFormValid()}
          className="flex items-center gap-2"
        >
          Continue to Communication Requirements
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}