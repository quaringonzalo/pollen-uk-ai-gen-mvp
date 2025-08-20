import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ConsolidatedAssessmentConfigProps {
  onBack: () => void;
  onComplete: (data: any) => void;
  initialData?: any;
}

interface FormData {
  // Section A: Role Context & Environment
  keyTasks: string[];
  customTasks: string;
  clientInteraction: string;
  teamStructure: string;
  workEnvironment: string;
  autonomyLevel: string;
  learningCurve: string;
  
  // Section B: Role-Specific Deep Dive (Dynamic)
  writtenCommunication: string[];
  challengingEmailExample: string;
  difficultNewsFrequency: string;
  difficultNewsApproach: string;
  communicationChallenges: string[];
  communicationFailure: string;
  stakeholderInteraction: string[];
  communicationStyle: string;
  
  // Section C: Scenario-Based Assessment (Dynamic)
  qualityCheckMaterials: string[];
  commonQualityIssues: string[];
  worstQualityFailure: string;
  detailLevel: string;
  qualityImpact: string[];
  currentQualityProcess: string;
  qualityTools: string;
  
  // Section D: Challenge Calibration (Dynamic)
  typicalPressureSituation: string;
  multitaskingFrequency: string;
  deadlinePressureResponse: string;
  competingPriorities: string;
  workloadOverload: string;
  capacityCommunication: string;
  decisionMakingPressure: string;
  communicationBreakdown: string;
  professionalDelay: string;
}

export default function ConsolidatedAssessmentConfig({ onBack, onComplete, initialData }: ConsolidatedAssessmentConfigProps) {
  const [currentSection, setCurrentSection] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    keyTasks: initialData?.keyTasks || [],
    customTasks: initialData?.customTasks || '',
    clientInteraction: initialData?.clientInteraction || '',
    teamStructure: initialData?.teamStructure || '',
    workEnvironment: initialData?.workEnvironment || '',
    autonomyLevel: initialData?.autonomyLevel || '',
    learningCurve: initialData?.learningCurve || '',
    
    writtenCommunication: initialData?.writtenCommunication || [],
    challengingEmailExample: initialData?.challengingEmailExample || '',
    difficultNewsFrequency: initialData?.difficultNewsFrequency || '',
    difficultNewsApproach: initialData?.difficultNewsApproach || '',
    communicationChallenges: initialData?.communicationChallenges || [],
    communicationFailure: initialData?.communicationFailure || '',
    stakeholderInteraction: initialData?.stakeholderInteraction || [],
    communicationStyle: initialData?.communicationStyle || '',
    
    qualityCheckMaterials: initialData?.qualityCheckMaterials || [],
    commonQualityIssues: initialData?.commonQualityIssues || [],
    worstQualityFailure: initialData?.worstQualityFailure || '',
    detailLevel: initialData?.detailLevel || '',
    qualityImpact: initialData?.qualityImpact || [],
    currentQualityProcess: initialData?.currentQualityProcess || '',
    qualityTools: initialData?.qualityTools || '',
    
    typicalPressureSituation: initialData?.typicalPressureSituation || '',
    multitaskingFrequency: initialData?.multitaskingFrequency || '',
    deadlinePressureResponse: initialData?.deadlinePressureResponse || '',
    competingPriorities: initialData?.competingPriorities || '',
    workloadOverload: initialData?.workloadOverload || '',
    capacityCommunication: initialData?.capacityCommunication || '',
    decisionMakingPressure: initialData?.decisionMakingPressure || '',
    communicationBreakdown: initialData?.communicationBreakdown || '',
    professionalDelay: initialData?.professionalDelay || ''
  });

  const sections = [
    { id: 1, title: "The Role Setup" },
    { id: 2, title: "Key Skills & Communication" },
    { id: 3, title: "Real-World Scenarios" },
    { id: 4, title: "Assessment Finalization" }
  ];

  const progress = (currentSection / 4) * 100;

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: keyof FormData, item: string) => {
    setFormData(prev => {
      const currentValue = prev[field] as string[];
      if (!Array.isArray(currentValue)) return prev;
      
      return {
        ...prev,
        [field]: currentValue.includes(item)
          ? currentValue.filter((i: string) => i !== item)
          : [...currentValue, item]
      };
    });
  };

  const isCurrentSectionValid = () => {
    switch (currentSection) {
      case 1:
        return formData.keyTasks.length > 0 && formData.clientInteraction && formData.workEnvironment;
      case 2:
        // Simplified requirements: basic email example, communication style, and at least one skill
        return formData.challengingEmailExample.length >= 30 && 
               formData.communicationStyle && 
               formData.communicationChallenges.length > 0;
      case 3:
        return formData.qualityCheckMaterials.length > 0 && formData.worstQualityFailure.length >= 30 && formData.detailLevel;
      case 4:
        return formData.typicalPressureSituation && formData.deadlinePressureResponse;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentSection < 4) {
      setCurrentSection(currentSection + 1);
    } else {
      onComplete(formData);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    }
  };

  // Dynamic filtering based on selected tasks
  const isTaskSelected = (category: string) => {
    return formData.keyTasks.some(task => task.includes(category));
  };

  const getFilteredContent = () => {
    const hasComms = isTaskSelected('Communication') || isTaskSelected('Relationships');
    const hasTech = isTaskSelected('Technical') || isTaskSelected('Analysis');
    const hasCreative = isTaskSelected('Creative') || isTaskSelected('Content');
    const hasProject = isTaskSelected('Project') || isTaskSelected('Operations');
    
    return { hasComms, hasTech, hasCreative, hasProject };
  };

  const renderSection = () => {
    const { hasComms, hasTech, hasCreative, hasProject } = getFilteredContent();

    switch (currentSection) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Key Tasks (select all that apply)</Label>
              <div className="mt-3 space-y-4">
                {[
                  { category: "Communication & Relationships", options: ["Client communication", "Team collaboration", "Stakeholder management", "Presentation delivery"] },
                  { category: "Project & Operations", options: ["Project coordination", "Process management", "Quality assurance", "Resource planning"] },
                  { category: "Creative & Content", options: ["Content creation", "Design work", "Brand management", "Creative strategy"] },
                  { category: "Technical & Analysis", options: ["Data analysis", "Technical research", "System management", "Problem solving"] },
                  { category: "Business & Strategy", options: ["Strategic planning", "Business development", "Market analysis", "Financial planning"] }
                ].map(group => (
                  <div key={group.category} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">{group.category}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {group.options.map(task => (
                        <div key={task} className="flex items-center space-x-2">
                          <Checkbox
                            id={task}
                            checked={formData.keyTasks.includes(task)}
                            onCheckedChange={() => toggleArrayItem('keyTasks', task)}
                          />
                          <Label htmlFor={task} className="text-sm">{task}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Label htmlFor="customTasks">Other key tasks</Label>
                <Textarea
                  id="customTasks"
                  value={formData.customTasks}
                  onChange={(e) => updateFormData('customTasks', e.target.value)}
                  placeholder="Describe any additional key tasks for this role..."
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="clientInteraction">Client Interaction Level</Label>
              <Select value={formData.clientInteraction} onValueChange={(value) => updateFormData('clientInteraction', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select client interaction level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High - Daily client contact</SelectItem>
                  <SelectItem value="medium">Medium - Weekly client contact</SelectItem>
                  <SelectItem value="low">Low - Occasional client contact</SelectItem>
                  <SelectItem value="none">None - Internal only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="workEnvironment">Work Environment</Label>
              <Select value={formData.workEnvironment} onValueChange={(value) => updateFormData('workEnvironment', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select work environment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fast-paced">Fast-paced with tight deadlines</SelectItem>
                  <SelectItem value="collaborative">Collaborative team environment</SelectItem>
                  <SelectItem value="independent">Independent work with autonomy</SelectItem>
                  <SelectItem value="structured">Structured with clear processes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {/* Engaging Introduction */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border">
              <h3 className="font-medium text-gray-900 mb-2">Help us create the perfect test</h3>
              <p className="text-sm text-gray-600">
                We'll use these insights to design challenges that reveal how candidates actually think and communicate - the skills that matter most for success in your role.
              </p>
            </div>

            {/* Streamlined Questions */}
            <div>
              <Label className="text-base font-medium mb-3 block">What's a tricky email situation they might face?</Label>
              <Textarea
                value={formData.challengingEmailExample}
                onChange={(e) => updateFormData('challengingEmailExample', e.target.value)}
                placeholder="Example: A frustrated client wants a refund but their request falls outside our policy..."
                className="min-h-[80px]"
              />
              <div className="text-xs text-gray-500 mt-1">
                This helps us test their problem-solving and communication under pressure
              </div>
            </div>

            <div>
              <Label className="text-base font-medium mb-3 block">How do you prefer people to communicate with you?</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "concise", label: "Get straight to the point", desc: "Brief, action-focused" },
                  { value: "detailed", label: "Give me the full picture", desc: "Thorough, comprehensive" },
                  { value: "collaborative", label: "Think it through together", desc: "Discussion-based" },
                  { value: "formal", label: "Keep it professional", desc: "Structured, formal tone" }
                ].map(option => (
                  <div 
                    key={option.value}
                    className={`p-3 border rounded-lg cursor-pointer transition-colours ${
                      formData.communicationStyle === option.value 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => updateFormData('communicationStyle', option.value)}
                  >
                    <div className="font-medium text-sm">{option.label}</div>
                    <div className="text-xs text-gray-500">{option.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base font-medium mb-3 block">Which communication skills matter most?</Label>
              <p className="text-sm text-gray-600 mb-3">Pick the top 2-3 that really make a difference in your team</p>
              <div className="grid grid-cols-2 gap-2">
                {["Clear writing", "Active listening", "Staying calm under pressure", "Building relationships", "Explaining complex things simply", "Professional phone manner"].map(skill => (
                  <div key={skill} className="flex items-center space-x-2">
                    <Checkbox
                      id={skill}
                      checked={formData.communicationChallenges.includes(skill)}
                      onCheckedChange={() => toggleArrayItem('communicationChallenges', skill)}
                    />
                    <Label htmlFor={skill} className="text-sm">{skill}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {/* Engaging Introduction */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border">
              <h3 className="font-medium text-gray-900 mb-2">Let's talk about quality standards</h3>
              <p className="text-sm text-gray-600">
                We'll create scenarios that test attention to detail and problem-solving when things don't go to plan - the real-world situations that matter.
              </p>
            </div>

            <div>
              <Label className="text-base font-medium mb-3 block">What could go wrong if they miss important details?</Label>
              <Textarea
                value={formData.worstQualityFailure}
                onChange={(e) => updateFormData('worstQualityFailure', e.target.value)}
                placeholder="Example: If they send the wrong pricing to a client, we could lose the deal and damage our reputation..."
                className="min-h-[80px]"
              />
              <div className="text-xs text-gray-500 mt-1">
                This helps us understand what really matters in your role
              </div>
            </div>

            <div>
              <Label className="text-base font-medium mb-3 block">How much does accuracy matter in this role?</Label>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { value: "high", label: "Extremely important", desc: "Mistakes could have serious consequences", icon: "🎯" },
                  { value: "medium", label: "Pretty important", desc: "Accuracy matters but mistakes are fixable", icon: "⚖️" },
                  { value: "flexible", label: "Overall quality focus", desc: "Perfect isn't essential, good is good enough", icon: "🌟" }
                ].map(option => (
                  <div 
                    key={option.value}
                    className={`p-3 border rounded-lg cursor-pointer transition-colours ${
                      formData.detailLevel === option.value 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => updateFormData('detailLevel', option.value)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{option.icon}</span>
                      <div>
                        <div className="font-medium text-sm">{option.label}</div>
                        <div className="text-xs text-gray-500">{option.desc}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base font-medium mb-3 block">What should they double-check in their work?</Label>
              <p className="text-sm text-gray-600 mb-3">Pick the key things that matter most for quality</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "Spelling and grammar",
                  "Numbers and calculations", 
                  "Following company guidelines",
                  "Client requirements",
                  "Deadlines and timings",
                  "Brand consistency"
                ].map(material => (
                  <div key={material} className="flex items-center space-x-2">
                    <Checkbox
                      id={material}
                      checked={formData.qualityCheckMaterials.includes(material)}
                      onCheckedChange={() => toggleArrayItem('qualityCheckMaterials', material)}
                    />
                    <Label htmlFor={material} className="text-sm">{material}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-sm text-orange-700">
                <strong>Pressure Testing:</strong> Scenarios calibrated for entry-level roles with growth focus.
              </p>
            </div>

            <div>
              <Label htmlFor="typicalPressure">Typical High-Pressure Situations</Label>
              <Textarea
                id="typicalPressure"
                value={formData.typicalPressureSituation}
                onChange={(e) => updateFormData('typicalPressureSituation', e.target.value)}
                placeholder="Describe typical high-pressure situations for this role..."
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="deadlineResponse">Deadline Pressure Response</Label>
              <Select value={formData.deadlinePressureResponse} onValueChange={(value) => updateFormData('deadlinePressureResponse', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="How should they handle deadline pressure?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="methodical">Stay methodical and ask for help</SelectItem>
                  <SelectItem value="prioritize">Quickly prioritise and communicate</SelectItem>
                  <SelectItem value="collaborative">Seek team collaboration immediately</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="workloadOverload">Workload Overload Recognition</Label>
              <Textarea
                id="workloadOverload"
                value={formData.workloadOverload}
                onChange={(e) => updateFormData('workloadOverload', e.target.value)}
                placeholder="How should they recognise when they're genuinely overwhelmed and need support?"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="capacityCommunication">Capacity Communication</Label>
              <Textarea
                id="capacityCommunication"
                value={formData.capacityCommunication}
                onChange={(e) => updateFormData('capacityCommunication', e.target.value)}
                placeholder="How should they communicate capacity concerns professionally?"
                className="mt-1"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Assessment Configuration</h2>
          <div className="text-sm text-gray-600">
            Section {currentSection} of 4
          </div>
        </div>
        
        <Progress value={progress} className="mb-4" />
        
        <div className="flex space-x-4 mb-6">
          {sections.map((section) => (
            <div
              key={section.id}
              className={`flex-1 p-3 rounded-lg text-center text-sm ${
                section.id < currentSection
                  ? 'bg-green-100 text-green-800'
                  : section.id === currentSection
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <div className="flex items-center justify-center mb-1">
                {section.id < currentSection ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <span className="font-medium">{section.id}</span>
                )}
              </div>
              <div className="font-medium">{section.title}</div>
            </div>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{sections[currentSection - 1]?.title}</CardTitle>
        </CardHeader>
        <CardContent>
          {renderSection()}
        </CardContent>
      </Card>

      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={currentSection === 1 ? onBack : handlePrevious}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {currentSection === 1 ? 'Back to Dashboard' : 'Previous Section'}
        </Button>

        <Button
          onClick={handleNext}
          disabled={!isCurrentSectionValid()}
        >
          {currentSection === 4 ? 'Complete Assessment Configuration' : 'Next Section'}
          {currentSection < 4 && <ArrowRight className="w-4 h-4 ml-2" />}
        </Button>
      </div>
    </div>
  );
}