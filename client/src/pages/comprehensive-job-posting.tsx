import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Plus, X, Home } from "lucide-react";

interface JobFormData {
  // Role Scenarios & Challenges
  typicalDay: string;
  biggestChallenges: string[];
  criticalDecisions: string[];
  problemSolvingScenarios: string[];
  
  // Skills Analysis (derived from scenarios)
  extractedSkills: string[];
  foundationSkillsRequired: string[];
  technicalCapabilities: string[];
  
  // Practical Requirements
  salaryRange: { min: number; max: number };
  contractType: 'full-time' | 'part-time' | 'contract' | 'internship';
  workingModel: 'office' | 'remote' | 'hybrid';
  location: string;
  visaOpenness: 'open-to-all' | 'uk-right-to-work' | 'sponsorship-available' | 'temporary-permits-ok';
  travelRequirements: string;
  flexibilityNeeds: string[];
  flexibilityDetails: { [key: string]: string };
  desiredStartDate: string;
  
  // Skills Analysis for Challenge Creation
  primarySkillAreas: string[];
  realWorldScenarios: string[];
  toolsAndSoftware: string[];
  problemSolvingExamples: string[];
  qualityMetrics: string[];
  decisionMakingScenarios: string[];
  
  // Hiring Process
  hiringProcessSteps: number;
  processStyle: 'quick' | 'thorough' | 'structured';
  interviewTypes: string[];
  timelineExpectation: string;
  
  // Dynamic Behavioral Assessment
  workingStylePreferences: { [key: string]: string };
  teamDynamicsAnswers: { [key: string]: string };
  communicationScenarios: { [key: string]: string };
  
  // Package-Specific
  packageType: string;
  recommendedChallenges: string[];
  scenarioBasedChallenges: string[];
  
  // Derived Data
  personalityMatch: string[];
  skillsChallengeSuggestions: string[];
}

export default function ComprehensiveJobPosting() {
  const [formData, setFormData] = useState<JobFormData>({
    typicalDay: '',
    biggestChallenges: [],
    criticalDecisions: [],
    problemSolvingScenarios: [],
    extractedSkills: [],
    foundationSkillsRequired: [],
    technicalCapabilities: [],
    salaryRange: { min: 0, max: 0 },
    contractType: 'full-time',
    workingModel: 'office',
    location: '',
    visaOpenness: 'temporary-permits-ok',
    travelRequirements: '',
    flexibilityNeeds: [],
    flexibilityDetails: {},
    desiredStartDate: '',
    // Detailed working hours information
    generalWorkingHours: '',
    partTimeDaysPerWeek: '',
    contractDuration: '',
    permanentConversionPotential: false,
    hybridExpectations: '',
    workingArrangements: '',
    primarySkillAreas: [],
    realWorldScenarios: [],
    toolsAndSoftware: [],
    problemSolvingExamples: [],
    qualityMetrics: [],
    decisionMakingScenarios: [],
    hiringProcessSteps: 2,
    processStyle: 'structured',
    interviewTypes: [],
    timelineExpectation: '1-2 weeks',
    stepDescriptions: {} as { [key: string]: string },
    workingStylePreferences: {},
    teamDynamicsAnswers: {},
    communicationScenarios: {},
    packageType: '',
    recommendedChallenges: [],
    scenarioBasedChallenges: [],
    personalityMatch: [],
    skillsChallengeSuggestions: []
  });

  const [packageSelection, setPackageSelection] = useState<any>(null);
  const [jobData, setJobData] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isEditingPreview, setIsEditingPreview] = useState(false);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);

  useEffect(() => {
    // Load package selection and job data from previous flows
    const savedSelection = localStorage.getItem('packageSelection');
    const savedJobData = localStorage.getItem('jobFormData');
    
    if (savedSelection) {
      const selection = JSON.parse(savedSelection);
      setPackageSelection(selection);
      setFormData(prev => ({ ...prev, packageType: selection.packageType }));
    }
    
    if (savedJobData) {
      const jobInfo = JSON.parse(savedJobData);
      setJobData(jobInfo);
    }
  }, []);

  const totalSteps = 4; // Job posting steps: Role Details, Practical Requirements, Interview Process, Preview

  const addToArray = (field: keyof JobFormData, value: string) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...(prev[field] as string[]), value.trim()]
      }));
    }
  };

  const removeFromArray = (field: keyof JobFormData, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }));
  };

  // Comprehensive behavioural questions for thorough assessment
  const behaviouralQuestions = [
    {
      id: 'deadline_pressure',
      question: 'When facing a tight deadline, this person should:',
      options: [
        { value: 'methodical', label: 'Work methodically through a structured plan' },
        { value: 'adaptive', label: 'Quickly adapt and prioritize on the fly' },
        { value: 'collaborative', label: 'Rally the team and delegate effectively' },
        { value: 'focused', label: 'Laser-focus on the most critical tasks' }
      ]
    },
    {
      id: 'problem_approach',
      question: 'When encountering an unfamiliar problem, they should:',
      options: [
        { value: 'research', label: 'Research thoroughly before taking action' },
        { value: 'experiment', label: 'Try different approaches and learn by doing' },
        { value: 'consult', label: 'Consult with experts and stakeholders' },
        { value: 'systematic', label: 'Break it down systematically step by step' }
      ]
    },
    {
      id: 'team_conflict',
      question: 'In team disagreements, they should:',
      options: [
        { value: 'mediate', label: 'Mediate and find common ground' },
        { value: 'decisive', label: 'Make decisive calls based on data' },
        { value: 'diplomatic', label: 'Navigate diplomatically to preserve relationships' },
        { value: 'transparent', label: 'Address issues transparently and directly' }
      ]
    },
    {
      id: 'communication_style',
      question: 'When explaining complex information, they should:',
      options: [
        { value: 'detailed', label: 'Provide comprehensive details and background' },
        { value: 'concise', label: 'Give clear, concise summaries' },
        { value: 'visual', label: 'Use charts, diagrams and visual aids' },
        { value: 'interactive', label: 'Engage through questions and discussion' }
      ]
    },
    {
      id: 'work_independence',
      question: 'This role requires someone who:',
      options: [
        { value: 'autonomous', label: 'Works independently with minimal guidance' },
        { value: 'collaborative', label: 'Thrives on constant team interaction' },
        { value: 'guided', label: 'Prefers clear direction and regular check-ins' },
        { value: 'flexible', label: 'Adapts between independent and collaborative work' }
      ]
    },
    {
      id: 'change_adaptation',
      question: 'When priorities change suddenly, they should:',
      options: [
        { value: 'embrace', label: 'Embrace change and pivot quickly' },
        { value: 'analyse', label: 'Analyze the impact before adjusting' },
        { value: 'communicate', label: 'Communicate concerns and seek clarity' },
        { value: 'stabilize', label: 'Help stabilize the team through transition' }
      ]
    },
    {
      id: 'decision_making',
      question: 'When making important decisions, they should:',
      options: [
        { value: 'data_driven', label: 'Rely primarily on data and analysis' },
        { value: 'intuitive', label: 'Trust gut instincts and experience' },
        { value: 'consensus', label: 'Seek input and build consensus' },
        { value: 'pragmatic', label: 'Focus on practical outcomes' }
      ]
    },
    {
      id: 'learning_style',
      question: 'When learning new skills, they typically:',
      options: [
        { value: 'hands_on', label: 'Learn by doing and experimenting' },
        { value: 'structured', label: 'Prefer organised training and documentation' },
        { value: 'mentored', label: 'Learn best through guidance from others' },
        { value: 'self_directed', label: 'Research and teach themselves' }
      ]
    },
    {
      id: 'stress_response',
      question: 'Under pressure, this person typically:',
      options: [
        { value: 'focused', label: 'Becomes more focused and determined' },
        { value: 'creative', label: 'Finds innovative solutions' },
        { value: 'methodical', label: 'Sticks to proven processes' },
        { value: 'collaborative', label: 'Seeks support from colleagues' }
      ]
    },
    {
      id: 'feedback_preference',
      question: 'They respond best to feedback that is:',
      options: [
        { value: 'direct', label: 'Direct and straightforward' },
        { value: 'constructive', label: 'Balanced with specific improvement suggestions' },
        { value: 'frequent', label: 'Given regularly in small doses' },
        { value: 'comprehensive', label: 'Detailed and thorough' }
      ]
    },
    {
      id: 'motivation_source',
      question: 'They are most motivated by:',
      options: [
        { value: 'achievement', label: 'Achieving targets and seeing measurable results' },
        { value: 'recognition', label: 'Recognition and appreciation from others' },
        { value: 'autonomy', label: 'Independence and control over their work' },
        { value: 'growth', label: 'Learning new skills and personal development' }
      ]
    },
    {
      id: 'work_environment',
      question: 'They perform best in an environment that is:',
      options: [
        { value: 'structured', label: 'Well-organised with clear processes' },
        { value: 'dynamic', label: 'Fast-paced and constantly changing' },
        { value: 'collaborative', label: 'Highly collaborative and social' },
        { value: 'focused', label: 'Quiet and focused with minimal distractions' }
      ]
    },
    {
      id: 'challenge_response',
      question: 'When faced with a difficult challenge, they typically:',
      options: [
        { value: 'persistent', label: 'Keep trying until they find a solution' },
        { value: 'strategic', label: 'Step back and develop a strategic approach' },
        { value: 'collaborative', label: 'Reach out for help and input from others' },
        { value: 'innovative', label: 'Look for creative or unconventional solutions' }
      ]
    },
    {
      id: 'detail_orientation',
      question: 'In their work approach, they tend to be:',
      options: [
        { value: 'detail_focused', label: 'Highly detail-oriented and thorough' },
        { value: 'big_picture', label: 'Big-picture focused with good strategic vision' },
        { value: 'balanced', label: 'Good at balancing details with overall objectives' },
        { value: 'outcome_focused', label: 'Results-oriented, focusing on end goals' }
      ]
    },
    {
      id: 'risk_tolerance',
      question: 'Their approach to risk and uncertainty is:',
      options: [
        { value: 'cautious', label: 'Cautious and prefer proven approaches' },
        { value: 'calculated', label: 'Willing to take calculated risks' },
        { value: 'adventurous', label: 'Comfortable with uncertainty and new challenges' },
        { value: 'analytical', label: 'Thoroughly analyse risks before proceeding' }
      ]
    }
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Job Description Builder</CardTitle>
              <p className="text-sm text-gray-600">Let's create compelling content for job seekers to see</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="keyResponsibilities">Key Responsibilities</Label>
                <p className="text-sm text-gray-500 mb-2">What will this person be doing day-to-day?</p>
                <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-3">
                  <p className="text-sm text-blue-700 font-medium mb-1">Examples:</p>
                  <ul className="text-xs text-blue-600 space-y-1">
                    <li>• "Manage social media accounts and create engaging content for 10,000+ followers"</li>
                    <li>• "Process customer orders and resolve queries within 24 hours"</li>
                    <li>• "Analyze sales data to identify trends and present weekly reports to management"</li>
                    <li>• "Support project delivery by coordinating between teams and tracking milestones"</li>
                  </ul>
                </div>
                <ArrayInput
                  items={formData.biggestChallenges}
                  onAdd={(value) => addToArray('biggestChallenges', value)}
                  onRemove={(index) => removeFromArray('biggestChallenges', index)}
                  placeholder="e.g. Create and manage digital marketing campaigns across 3 platforms"
                />
              </div>

              <div>
                <Label htmlFor="idealPerson">The type of person who would love this job</Label>
                <p className="text-sm text-gray-500 mb-2">What personality traits and motivations fit this role?</p>
                <div className="bg-green-50 border border-green-200 rounded p-3 mb-3">
                  <p className="text-sm text-green-700 font-medium mb-1">Examples:</p>
                  <ul className="text-xs text-green-600 space-y-1">
                    <li>• "Someone who loves solving problems and helping customers feel valued"</li>
                    <li>• "A creative person who enjoys variety and learning new skills"</li>
                    <li>• "Detail-oriented individual who takes pride in accurate, high-quality work"</li>
                    <li>• "Team player who thrives in a fast-paced, collaborative environment"</li>
                  </ul>
                </div>
                <ArrayInput
                  items={formData.criticalDecisions}
                  onAdd={(value) => addToArray('criticalDecisions', value)}
                  onRemove={(index) => removeFromArray('criticalDecisions', index)}
                  placeholder="e.g. Someone who gets energized by meeting targets and seeing results"
                />
              </div>

              <div>
                <Label htmlFor="successMetrics">Success in this role means...</Label>
                <p className="text-sm text-gray-500 mb-2">How will they know they're doing well?</p>
                <div className="bg-purple-50 border border-purple-200 rounded p-3 mb-3">
                  <p className="text-sm text-purple-700 font-medium mb-1">Examples:</p>
                  <ul className="text-xs text-purple-600 space-y-1">
                    <li>• "Consistently achieving 95%+ customer satisfaction scores"</li>
                    <li>• "Growing social media engagement by 20% within 6 months"</li>
                    <li>• "Completing projects on time and within budget"</li>
                    <li>• "Building strong relationships with key stakeholders"</li>
                  </ul>
                </div>
                <Input
                  id="successMetrics"
                  value={formData.typicalDay}
                  onChange={(e) => setFormData(prev => ({ ...prev, typicalDay: e.target.value }))}
                  placeholder="e.g. Delivering accurate reports that help the team make better decisions"
                />
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Practical Requirements</CardTitle>
              <p className="text-sm text-gray-600">Let's cover the practical details</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Salary Range (Annual)</Label>
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <Label htmlFor="min-salary" className="text-sm">Minimum £</Label>
                    <Input
                      id="min-salary"
                      type="number"
                      placeholder="25000"
                      min="25000"
                      value={formData.salaryRange.min || ''}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0;
                        setFormData(prev => ({
                          ...prev,
                          salaryRange: { ...prev.salaryRange, min: Math.max(value, 25000) }
                        }));
                      }}
                    />
                    {formData.salaryRange.min > 0 && formData.salaryRange.min < 25000 && (
                      <p className="text-red-600 text-xs mt-1">Minimum salary must be at least £25,000</p>
                    )}
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="max-salary" className="text-sm">Maximum £</Label>
                    <Input
                      id="max-salary"
                      type="number"
                      placeholder="35000"
                      value={formData.salaryRange.max || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        salaryRange: { ...prev.salaryRange, max: parseInt(e.target.value) || 0 }
                      }))}
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label>Work Authorization Requirements</Label>
                <div className="space-y-3 mt-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="visa-open"
                      name="visaOpenness"
                      value="open-to-all"
                      checked={formData.visaOpenness === 'open-to-all'}
                      onChange={(e) => setFormData(prev => ({ ...prev, visaOpenness: e.target.value as any }))}
                    />
                    <Label htmlFor="visa-open" className="text-sm">
                      <strong>Open to all candidates</strong> - we will sponsor visas if needed
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="visa-temporary-ok"
                      name="visaOpenness"
                      value="temporary-permits-ok"
                      checked={formData.visaOpenness === 'temporary-permits-ok'}
                      onChange={(e) => setFormData(prev => ({ ...prev, visaOpenness: e.target.value as any }))}
                    />
                    <Label htmlFor="visa-temporary-ok" className="text-sm">
                      <strong>Temporary work permits welcome</strong> - graduate visas, student visas with work rights, skilled worker visas (no sponsorship offered)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="visa-sponsorship"
                      name="visaOpenness"
                      value="sponsorship-available"
                      checked={formData.visaOpenness === 'sponsorship-available'}
                      onChange={(e) => setFormData(prev => ({ ...prev, visaOpenness: e.target.value as any }))}
                    />
                    <Label htmlFor="visa-sponsorship" className="text-sm">
                      <strong>Temporary visas welcome, sponsorship possible</strong> - open to candidates on temporary visas with potential future sponsorship
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="visa-permanent-only"
                      name="visaOpenness"
                      value="uk-right-to-work"
                      checked={formData.visaOpenness === 'uk-right-to-work'}
                      onChange={(e) => setFormData(prev => ({ ...prev, visaOpenness: e.target.value as any }))}
                    />
                    <Label htmlFor="visa-permanent-only" className="text-sm">
                      <strong>Permanent right to work only</strong> - UK/Irish citizens or those with settled/pre-settled status
                    </Label>
                  </div>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded p-3 mt-3">
                  <p className="text-xs text-amber-700">
                    💡 <strong>Recommendation:</strong> Accepting temporary work permits significantly increases your talent pool. Many excellent graduates and skilled professionals are on these visas and can contribute immediately.
                  </p>
                </div>
              </div>

              <div>
                <Label>Desired Start Date</Label>
                <div className="space-y-3 mt-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="start-asap"
                      name="startDate"
                      value="ASAP"
                      checked={formData.desiredStartDate === 'ASAP'}
                      onChange={(e) => setFormData(prev => ({ ...prev, desiredStartDate: e.target.value }))}
                    />
                    <Label htmlFor="start-asap" className="text-sm">ASAP</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="start-flexible"
                      name="startDate"
                      value="Flexible"
                      checked={formData.desiredStartDate === 'Flexible'}
                      onChange={(e) => setFormData(prev => ({ ...prev, desiredStartDate: e.target.value }))}
                    />
                    <Label htmlFor="start-flexible" className="text-sm">Flexible</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="start-specific"
                      name="startDate"
                      value="specific"
                      checked={formData.desiredStartDate !== 'ASAP' && formData.desiredStartDate !== 'Flexible' && formData.desiredStartDate !== ''}
                      onChange={() => setFormData(prev => ({ ...prev, desiredStartDate: new Date().toISOString().split('T')[0] }))}
                    />
                    <Label htmlFor="start-specific" className="text-sm">Specific date:</Label>
                  </div>
                  {formData.desiredStartDate !== 'ASAP' && formData.desiredStartDate !== 'Flexible' && formData.desiredStartDate !== '' && (
                    <Input
                      type="date"
                      value={formData.desiredStartDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, desiredStartDate: e.target.value }))}
                      className="ml-6 w-48"
                    />
                  )}
                </div>
              </div>

              <div>
                <Label>Additional Requirements</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {[
                    { id: 'overtime', label: 'Occasional overtime' },
                    { id: 'flexible_hours', label: 'Flexible hours' },
                    { id: 'weekend', label: 'Weekend availability' },
                    { id: 'evening', label: 'Evening events' },
                    { id: 'remote', label: 'Remote work capability' },
                    { id: 'office', label: 'Office presence required' },
                    { id: 'travel', label: 'Travel required' },
                    { id: 'driving', label: 'Driving license required' }
                  ].map(req => (
                    <div key={req.id} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={req.id}
                          checked={formData.flexibilityNeeds.includes(req.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData(prev => ({ ...prev, flexibilityNeeds: [...prev.flexibilityNeeds, req.id] }));
                            } else {
                              setFormData(prev => ({ 
                                ...prev, 
                                flexibilityNeeds: prev.flexibilityNeeds.filter(f => f !== req.id),
                                flexibilityDetails: { ...prev.flexibilityDetails, [req.id]: '' }
                              }));
                            }
                          }}
                        />
                        <Label htmlFor={req.id} className="text-sm">{req.label}</Label>
                      </div>
                      {formData.flexibilityNeeds.includes(req.id) && (
                        <Input
                          placeholder={`Details about ${req.label.toLowerCase()}...`}
                          value={formData.flexibilityDetails[req.id] || ''}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            flexibilityDetails: { ...prev.flexibilityDetails, [req.id]: e.target.value }
                          }))}
                          className="text-xs ml-6"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Other requirements</Label>
                <p className="text-sm text-gray-500 mb-2">Any other specific requirements not covered above?</p>
                <Textarea
                  value={formData.flexibilityDetails['other'] || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    flexibilityDetails: { ...prev.flexibilityDetails, other: e.target.value }
                  }))}
                  placeholder="e.g. Must be comfortable with pets in office, requires security clearance, bilingual preferred..."
                  className="min-h-[80px]"
                />
              </div>

              <div>
                <Label>General working hours</Label>
                <p className="text-sm text-gray-500 mb-2">What are the standard working hours?</p>
                <Input
                  value={formData.generalWorkingHours}
                  onChange={(e) => setFormData(prev => ({ ...prev, generalWorkingHours: e.target.value }))}
                  placeholder="e.g. Monday-Friday 9am-5pm, 37.5 hours per week"
                />
              </div>

              {formData.contractType === 'part-time' && (
                <div>
                  <Label>Part-time days per week</Label>
                  <p className="text-sm text-gray-500 mb-2">How many days per week?</p>
                  <Input
                    value={formData.partTimeDaysPerWeek}
                    onChange={(e) => setFormData(prev => ({ ...prev, partTimeDaysPerWeek: e.target.value }))}
                    placeholder="e.g. 3 days per week (Monday, Wednesday, Friday)"
                  />
                </div>
              )}

              {(formData.contractType === 'contract' || formData.contractType === 'internship') && (
                <>
                  <div>
                    <Label>Contract duration</Label>
                    <p className="text-sm text-gray-500 mb-2">How long is this contract for?</p>
                    <Input
                      value={formData.contractDuration}
                      onChange={(e) => setFormData(prev => ({ ...prev, contractDuration: e.target.value }))}
                      placeholder="e.g. 6 months, 1 year, 3-month summer internship"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="permanent-conversion"
                      checked={formData.permanentConversionPotential}
                      onChange={(e) => setFormData(prev => ({ ...prev, permanentConversionPotential: e.target.checked }))}
                    />
                    <Label htmlFor="permanent-conversion">Potential to convert to permanent role</Label>
                  </div>
                </>
              )}

              {formData.workingModel === 'hybrid' && (
                <div>
                  <Label>Hybrid working expectations</Label>
                  <p className="text-sm text-gray-500 mb-2">What are the office attendance requirements?</p>
                  <Input
                    value={formData.hybridExpectations}
                    onChange={(e) => setFormData(prev => ({ ...prev, hybridExpectations: e.target.value }))}
                    placeholder="e.g. 2 days per week in office (Tuesday & Thursday), flexible on which days"
                  />
                </div>
              )}

              <div>
                <Label>Additional working arrangements</Label>
                <p className="text-sm text-gray-500 mb-2">Describe any other flexible working options</p>
                <Textarea
                  value={formData.workingArrangements}
                  onChange={(e) => setFormData(prev => ({ ...prev, workingArrangements: e.target.value }))}
                  placeholder="e.g. Flexible start times between 8-10am, compressed hours available"
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Final Interview Process Design</CardTitle>
              <p className="text-sm text-gray-600">Design your final interview stages after we provide your shortlist. We recommend 1-2 efficient final stages for your package.</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Number of final interview steps</Label>
                <p className="text-sm text-gray-500 mb-2">How many stages after receiving your shortlist?</p>
                <div className="flex space-x-4 mt-2">
                  {[1, 2, 3, 4].map(steps => (
                    <div key={steps} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id={`steps-${steps}`}
                        name="hiringSteps"
                        value={steps}
                        checked={formData.hiringProcessSteps === steps}
                        onChange={(e) => setFormData(prev => ({ ...prev, hiringProcessSteps: parseInt(e.target.value) }))}
                      />
                      <Label htmlFor={`steps-${steps}`} className="text-sm">{steps} step{steps > 1 ? 's' : ''}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {Array.from({ length: formData.hiringProcessSteps }, (_, i) => (
                <div key={i + 1}>
                  <Label>Step {i + 1} Description</Label>
                  <p className="text-sm text-gray-500 mb-2">Describe this interview step</p>
                  <Input
                    value={formData.stepDescriptions[`step${i + 1}`] || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      stepDescriptions: {
                        ...prev.stepDescriptions,
                        [`step${i + 1}`]: e.target.value
                      }
                    }))}
                    placeholder={
                      i === 0 ? "e.g., 20 minute screening call with people lead" :
                      i === 1 ? "e.g., Face-to-face interview with team lead and company director" :
                      i === 2 ? "e.g., Practical task or presentation" :
                      "e.g., Informal meet with team"
                    }
                  />
                </div>
              ))}

              <div>
                <Label>What's your preferred interview style?</Label>
                <div className="space-y-3 mt-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="style-quick"
                      name="processStyle"
                      value="quick"
                      checked={formData.processStyle === 'quick'}
                      onChange={(e) => setFormData(prev => ({ ...prev, processStyle: e.target.value as any }))}
                    />
                    <Label htmlFor="style-quick" className="text-sm">
                      <strong>Quick & Efficient</strong> - Short interviews focused on key skills and values fit
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="style-thorough"
                      name="processStyle"
                      value="thorough"
                      checked={formData.processStyle === 'thorough'}
                      onChange={(e) => setFormData(prev => ({ ...prev, processStyle: e.target.value as any }))}
                    />
                    <Label htmlFor="style-thorough" className="text-sm">
                      <strong>Thorough Assessment</strong> - In-depth interviews and practical assessments
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="style-structured"
                      name="processStyle"
                      value="structured"
                      checked={formData.processStyle === 'structured'}
                      onChange={(e) => setFormData(prev => ({ ...prev, processStyle: e.target.value as any }))}
                    />
                    <Label htmlFor="style-structured" className="text-sm">
                      <strong>Balanced Approach</strong> - Some practical, some values fit, generally more informal
                    </Label>
                  </div>
                </div>
              </div>

              <div>
                <Label>When would you ideally like to receive your shortlist?</Label>
                <p className="text-sm text-gray-500 mb-2">We'll automatically set an appropriate application deadline for candidates. To keep momentum and candidates engaged, we expect you to arrange the next stage within 7 days of receiving your shortlist, with an offer issued within 3 weeks.</p>
                <div className="space-y-3 mt-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="timeline-asap"
                      name="timeline"
                      value="As soon as possible"
                      checked={formData.timelineExpectation === 'As soon as possible'}
                      onChange={(e) => setFormData(prev => ({ ...prev, timelineExpectation: e.target.value }))}
                    />
                    <Label htmlFor="timeline-asap" className="text-sm">As soon as possible</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="timeline-1-2weeks"
                      name="timeline"
                      value="1-2 weeks"
                      checked={formData.timelineExpectation === '1-2 weeks'}
                      onChange={(e) => setFormData(prev => ({ ...prev, timelineExpectation: e.target.value }))}
                    />
                    <Label htmlFor="timeline-1-2weeks" className="text-sm">1-2 weeks</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="timeline-3-4weeks"
                      name="timeline"
                      value="3-4 weeks"
                      checked={formData.timelineExpectation === '3-4 weeks'}
                      onChange={(e) => setFormData(prev => ({ ...prev, timelineExpectation: e.target.value }))}
                    />
                    <Label htmlFor="timeline-3-4weeks" className="text-sm">3-4 weeks</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="timeline-custom"
                      name="timeline"
                      value="custom"
                      checked={formData.timelineExpectation !== 'As soon as possible' && formData.timelineExpectation !== '1-2 weeks' && formData.timelineExpectation !== '3-4 weeks'}
                      onChange={() => {}}
                    />
                    <Label htmlFor="timeline-custom" className="text-sm">Other:</Label>
                    <Input
                      value={formData.timelineExpectation !== 'As soon as possible' && formData.timelineExpectation !== '1-2 weeks' && formData.timelineExpectation !== '3-4 weeks' ? formData.timelineExpectation : ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, timelineExpectation: e.target.value }))}
                      placeholder="e.g., After Christmas, Next quarter"
                      className="flex-1"
                      onFocus={() => setFormData(prev => ({ ...prev, timelineExpectation: '' }))}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        if (isGeneratingPreview) {
          return (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <h3 className="text-lg font-semibold mb-2">Generating your job description...</h3>
                <p className="text-sm text-gray-600 text-center max-w-md">
                  We're analyzing your requirements and creating a compelling job posting that will attract the right candidates.
                </p>
              </CardContent>
            </Card>
          );
        }

        return (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Job Description Preview</CardTitle>
                  <p className="text-sm text-gray-600">This is how your job posting will appear to candidates</p>
                </div>
                <Button
                  variant={isEditingPreview ? "default" : "outline"}
                  onClick={() => setIsEditingPreview(!isEditingPreview)}
                  className="ml-4"
                >
                  {isEditingPreview ? 'Finish Editing' : 'Edit Preview'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded p-4">
                <h3 className="font-semibold text-blue-800 mb-2">📝 Review Process</h3>
                <p className="text-sm text-blue-700 mb-2">
                  Your job description will be reviewed by our team to ensure it meets platform standards and attracts quality candidates.
                </p>
                <p className="text-sm text-blue-700">
                  <strong>Approval time:</strong> We aim to review and approve within 4 hours during business hours.
                </p>
              </div>

              <div className="bg-white border rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold mb-4">Job Posting Preview:</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Key Responsibilities</Label>
                    <div className="mt-1">
                      {isEditingPreview ? (
                        <Textarea
                          value={formData.biggestChallenges.join('\n• ')}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            biggestChallenges: e.target.value.split('\n').map(item => item.replace(/^• /, '').trim()).filter(item => item)
                          }))}
                          rows={3}
                          className="text-sm"
                          placeholder="Add key responsibilities..."
                        />
                      ) : (
                        <div className="text-sm border rounded p-3 bg-gray-50 min-h-[80px]">
                          {formData.biggestChallenges.length > 0 ? (
                            <ul className="list-disc list-inside space-y-1">
                              {formData.biggestChallenges.map((resp, index) => (
                                <li key={index}>{resp}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-gray-500 italic">No responsibilities added yet</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">You'll love this job if you...</Label>
                    <div className="mt-1">
                      {isEditingPreview ? (
                        <Textarea
                          value={formData.criticalDecisions.join('\n• ')}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            criticalDecisions: e.target.value.split('\n').map(item => item.replace(/^• /, '').trim()).filter(item => item)
                          }))}
                          rows={3}
                          className="text-sm"
                          placeholder="Add what candidates will love about this role..."
                        />
                      ) : (
                        <div className="text-sm border rounded p-3 bg-gray-50 min-h-[80px]">
                          {formData.criticalDecisions.length > 0 ? (
                            <ul className="list-disc list-inside space-y-1">
                              {formData.criticalDecisions.map((item, index) => (
                                <li key={index}>{item}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-gray-500 italic">No details added yet</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">What success looks like for this role</Label>
                    <div className="mt-1">
                      {isEditingPreview ? (
                        <Input
                          value={formData.typicalDay}
                          onChange={(e) => setFormData(prev => ({ ...prev, typicalDay: e.target.value }))}
                          className="text-sm"
                          placeholder="Describe what success looks like..."
                        />
                      ) : (
                        <div className="text-sm border rounded p-3 bg-gray-50">
                          {formData.typicalDay || <span className="text-gray-500 italic">No success criteria added yet</span>}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Contract Type</Label>
                      <div className="text-sm mt-1 border rounded p-3 bg-gray-50 capitalize">
                        {jobData?.contractType?.replace('-', ' ') || formData.contractType.replace('-', ' ')}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Working Model</Label>
                      <div className="text-sm mt-1 border rounded p-3 bg-gray-50 capitalize">
                        {jobData?.workingModel || formData.workingModel}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Location</Label>
                      <div className="text-sm mt-1 border rounded p-3 bg-gray-50">
                        {jobData?.location || formData.location || 'Not specified'}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Salary Range (Annual)</Label>
                      <div className="text-sm mt-1 border rounded p-3 bg-gray-50">
                        £{formData.salaryRange.min?.toLocaleString() || '0'} - £{formData.salaryRange.max?.toLocaleString() || '0'}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Start Date</Label>
                      <div className="text-sm mt-1 border rounded p-3 bg-gray-50">
                        {formData.desiredStartDate === 'ASAP' ? 'As soon as possible' :
                         formData.desiredStartDate === 'Flexible' ? 'Flexible start date' :
                         formData.desiredStartDate ? new Date(formData.desiredStartDate).toLocaleDateString() : 'Not specified'}
                      </div>
                    </div>
                  </div>

                  {formData.flexibilityNeeds.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium">Additional Requirements</Label>
                      <div className="text-sm mt-1 border rounded p-3 bg-gray-50">
                        <div className="space-y-1">
                          {formData.flexibilityNeeds.map(need => {
                            const details = formData.flexibilityDetails[need];
                            const label = need === 'driving' ? 'Driving license required' :
                                         need === 'travel' ? 'Travel required' :
                                         need === 'overtime' ? 'Occasional overtime expected' :
                                         need === 'weekend' ? 'Weekend availability needed' :
                                         need === 'evening' ? 'Evening availability required' :
                                         need.replace('_', ' ');
                            
                            return (
                              <p key={need}>
                                {label}{details ? `: ${details}` : ''}
                              </p>
                            );
                          })}
                          {formData.flexibilityDetails['other'] && (
                            <p><strong>Other requirements:</strong> {formData.flexibilityDetails['other']}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {(formData.generalWorkingHours || formData.partTimeDaysPerWeek || formData.contractDuration || formData.permanentConversionPotential || formData.hybridExpectations) && (
                    <div>
                      <Label className="text-sm font-medium">Working Arrangements</Label>
                      <div className="space-y-2 mt-1">
                        {formData.generalWorkingHours && (
                          <div className="text-sm border rounded p-3 bg-gray-50">
                            <strong>Working Hours:</strong> {formData.generalWorkingHours}
                          </div>
                        )}
                        {formData.partTimeDaysPerWeek && (
                          <div className="text-sm border rounded p-3 bg-gray-50">
                            <strong>Part-time Schedule:</strong> {formData.partTimeDaysPerWeek}
                          </div>
                        )}
                        {formData.contractDuration && (
                          <div className="text-sm border rounded p-3 bg-gray-50">
                            <strong>Contract Duration:</strong> {formData.contractDuration}
                          </div>
                        )}
                        {formData.permanentConversionPotential && (
                          <div className="text-sm border rounded p-3 bg-gray-50">
                            <strong>Conversion Opportunity:</strong> Potential to convert to permanent role
                          </div>
                        )}
                        {formData.hybridExpectations && (
                          <div className="text-sm border rounded p-3 bg-gray-50">
                            <strong>Hybrid Arrangement:</strong> {formData.hybridExpectations}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {formData.workingArrangements && (
                    <div>
                      <Label className="text-sm font-medium">Additional Flexibility</Label>
                      <div className="text-sm mt-1 border rounded p-3 bg-gray-50">
                        {formData.workingArrangements}
                      </div>
                    </div>
                  )}

                  <div>
                    <Label className="text-sm font-medium">Final Interview Process</Label>
                    <div className="text-sm mt-1 border rounded p-3 bg-gray-50">
                      <div className="space-y-2">
                        <p><strong>{formData.hiringProcessSteps} step process</strong> after shortlist delivery</p>
                        {Object.entries(formData.stepDescriptions).map(([step, description]) => {
                          const stepNum = step.replace('step', '');
                          return description ? (
                            <p key={step}><strong>Step {stepNum}:</strong> {description}</p>
                          ) : null;
                        })}
                        {formData.timelineExpectation && (
                          <p><strong>Timeline:</strong> {formData.timelineExpectation}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded p-4">
                <h3 className="font-semibold text-amber-800 mb-2">👀 Additional Candidate Information</h3>
                <p className="text-sm text-amber-700">
                  Candidates will also see your company profile, ratings, and reviews. 
                  <a 
                    href="/employer-dashboard" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-amber-800 underline hover:text-amber-900"
                  >
                    Make sure your profile is up to date
                  </a> to attract the best talent.
                </p>
              </div>
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Skills & Tools</CardTitle>
              <p className="text-sm text-gray-600">What skills and tools matter most for this role?</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Core skill areas for this role</Label>
                <p className="text-sm text-gray-500 mb-2">What are the 3-5 most important skill categories?</p>
                <ArrayInput
                  items={formData.primarySkillAreas}
                  onAdd={(value) => addToArray('primarySkillAreas', value)}
                  onRemove={(index) => removeFromArray('primarySkillAreas', index)}
                  placeholder="e.g. Data Analysis, Customer Communication, Project Planning"
                />
              </div>

              <div>
                <Label>Tools and software they'll use</Label>
                <p className="text-sm text-gray-500 mb-2">List the main tools, platforms, or software</p>
                <ArrayInput
                  items={formData.toolsAndSoftware}
                  onAdd={(value) => addToArray('toolsAndSoftware', value)}
                  onRemove={(index) => removeFromArray('toolsAndSoftware', index)}
                  placeholder="e.g. Excel, Salesforce, Adobe Creative Suite"
                />
              </div>

              <div>
                <Label>Quality metrics</Label>
                <p className="text-sm text-gray-500 mb-2">How would you measure if they're doing a good job?</p>
                <ArrayInput
                  items={formData.qualityMetrics}
                  onAdd={(value) => addToArray('qualityMetrics', value)}
                  onRemove={(index) => removeFromArray('qualityMetrics', index)}
                  placeholder="e.g. Clear, accurate communication with stakeholders"
                />
              </div>
            </CardContent>
          </Card>
        );

      case 6:
        const currentBehavioralQuestion = behaviouralQuestions[currentQuestion];
        const isLastBehavioralQuestion = currentQuestion === behaviouralQuestions.length - 1;

        return (
          <Card>
            <CardHeader>
              <CardTitle>Working Style</CardTitle>
              <p className="text-sm text-gray-600">
                Question {currentQuestion + 1} of {behaviouralQuestions.length}: What working style fits this role?
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-lg font-medium mb-4 block">{behaviouralQuestions[currentQuestion].question}</Label>
                <div className="space-y-3">
                  {behaviouralQuestions[currentQuestion].options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <input
                        type="radio"
                        id={`option-${index}`}
                        name={behaviouralQuestions[currentQuestion].id}
                        value={option.value}
                        checked={formData.workingStylePreferences[behaviouralQuestions[currentQuestion].id] === option.value}
                        onChange={(e) => {
                          setFormData(prev => ({
                            ...prev,
                            workingStylePreferences: {
                              ...prev.workingStylePreferences,
                              [behaviouralQuestions[currentQuestion].id]: e.target.value
                            }
                          }));
                          if (currentQuestion < behaviouralQuestions.length - 1) {
                            setTimeout(() => {
                              setCurrentQuestion(prev => prev + 1);
                            }, 1000);
                          } else {
                            setTimeout(() => {
                              setCurrentStep(prev => prev + 1);
                              setCurrentQuestion(0);
                            }, 1000);
                          }
                        }}
                      />
                      <Label htmlFor={`option-${index}`} className="text-sm cursor-pointer flex-1 p-3 border rounded hover:bg-gray-50">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center">
                <div className="flex space-x-2">
                  {behaviouralQuestions.map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full ${
                        index === currentQuestion ? 'bg-blue-600' :
                        index < currentQuestion ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        );




      default:
        return null;
    }
  };

  const handleNext = () => {
    if (currentStep === 6 && currentQuestion < behaviouralQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else if (currentStep === 3) {
      setIsGeneratingPreview(true);
      setTimeout(() => {
        setIsGeneratingPreview(false);
        setCurrentStep(prev => prev + 1);
        setCurrentQuestion(0);
      }, 2000);
    } else if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      setCurrentQuestion(0);
    } else {
      handleSubmit();
    }
  };

  const getRecommendedSkills = () => {
    const skills: string[] = [];
    
    // Analyze typical day and challenges to extract skills
    const dayText = formData.typicalDay.toLowerCase();
    const challenges = formData.biggestChallenges.join(' ').toLowerCase();
    
    if (dayText.includes('data') || dayText.includes('analysis') || challenges.includes('analysis')) {
      skills.push('Data Analysis');
    }
    if (dayText.includes('present') || dayText.includes('communication') || challenges.includes('present')) {
      skills.push('Communication');
    }
    if (dayText.includes('manage') || dayText.includes('project') || challenges.includes('project')) {
      skills.push('Project Management');
    }
    if (dayText.includes('problem') || challenges.includes('problem') || challenges.includes('solve')) {
      skills.push('Problem Solving');
    }
    if (dayText.includes('team') || challenges.includes('team') || challenges.includes('collaborate')) {
      skills.push('Teamwork');
    }
    if (dayText.includes('customer') || dayText.includes('client') || challenges.includes('customer')) {
      skills.push('Customer Service');
    }
    
    return skills.length > 0 ? skills : ['Communication', 'Problem Solving', 'Critical Thinking'];
  };

  const getPersonalityMatches = () => {
    const matches: string[] = [];
    const preferences = formData.workingStylePreferences;
    
    if (preferences.deadline_pressure === 'methodical') {
      matches.push('Structured and methodical approach to work');
    } else if (preferences.deadline_pressure === 'adaptive') {
      matches.push('Adaptable and flexible under pressure');
    } else if (preferences.deadline_pressure === 'collaborative') {
      matches.push('Strong leadership and delegation skills');
    }
    
    if (preferences.problem_approach === 'research') {
      matches.push('Thorough research and analytical thinking');
    } else if (preferences.problem_approach === 'experiment') {
      matches.push('Hands-on learning and experimentation');
    } else if (preferences.problem_approach === 'consult') {
      matches.push('Collaborative problem-solving approach');
    }
    
    if (preferences.team_conflict === 'mediate') {
      matches.push('Strong interpersonal and mediation skills');
    } else if (preferences.team_conflict === 'decisive') {
      matches.push('Data-driven decision making abilities');
    }
    
    return matches.length > 0 ? matches : ['Positive attitude and growth mindset', 'Strong work ethic and reliability'];
  };

  const handleSubmit = () => {
    // Enrich form data with analysis
    const enrichedData = {
      ...formData,
      extractedSkills: getRecommendedSkills(),
      personalityMatch: getPersonalityMatches(),
      jobData: jobData // Include original job data
    };
    
    localStorage.setItem('completeJobFormData', JSON.stringify(enrichedData));
    console.log('Job posting data:', enrichedData);
    
    // Navigate to employer jobs page
    window.location.href = '/employer-jobs';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = '/employer-dashboard'}
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Dashboard
              </Button>
              <h1 className="text-3xl font-bold">Create Job Posting</h1>
            </div>
            <div className="text-sm text-gray-600">
              Step {currentStep} of {totalSteps}
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {renderStep()}

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => {
              if (currentStep === 6 && currentQuestion > 0) {
                setCurrentQuestion(prev => prev - 1);
              } else if (currentStep > 1) {
                setCurrentStep(prev => prev - 1);
                if (currentStep === 7) {
                  setCurrentQuestion(behaviouralQuestions.length - 1); // Go to last behavioural question
                }
              }
            }}
            disabled={currentStep === 1 && currentQuestion === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          {/* Show Next/Submit button based on step */}
          {!isGeneratingPreview && (
            <Button onClick={() => {
              if (currentStep === 4) {
                // Submit job post and redirect to employer jobs page
                handleSubmit();
                window.location.href = '/employer-jobs';
              } else {
                handleNext();
              }
            }}>
              {currentStep === 4 ? 'Submit Job Post' : 'Next'}
              {currentStep !== 4 && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          )}
        </div>
        
        {/* Booking call note */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700 text-center">
            <strong>Not sure about your requirements?</strong> Book a free consultation call with our team to discuss your hiring needs and get personalised guidance.
            <br />
            <a 
              href="/book-consultation" 
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Schedule a call →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function ArrayInput({ items, onAdd, onRemove, placeholder }: {
  items: string[];
  onAdd: (value: string) => void;
  onRemove: (index: number) => void;
  placeholder: string;
}) {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (inputValue.trim()) {
      onAdd(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex space-x-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
        />
        <Button type="button" onClick={handleAdd} size="icon">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <Badge key={index} variant="secondary" className="flex items-center gap-1">
            {item}
            <button onClick={() => onRemove(index)} className="ml-1">
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}

function SkillsSelector({ selectedSkills, onSkillsChange, category }: {
  selectedSkills: string[];
  onSkillsChange: (skills: string[]) => void;
  category: string;
}) {
  const foundationSkills = [
    'Communication', 'Problem Solving', 'Critical Thinking', 'Teamwork',
    'Time Management', 'Adaptability', 'Leadership', 'Customer Service',
    'Data Analysis', 'Project Management', 'Research', 'Presentation Skills'
  ];

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      onSkillsChange(selectedSkills.filter(s => s !== skill));
    } else {
      onSkillsChange([...selectedSkills, skill]);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
      {foundationSkills.map(skill => (
        <div key={skill} className="flex items-center space-x-2">
          <Checkbox
            id={skill}
            checked={selectedSkills.includes(skill)}
            onCheckedChange={() => toggleSkill(skill)}
          />
          <Label htmlFor={skill} className="text-sm">{skill}</Label>
        </div>
      ))}
    </div>
  );
}

function PersonalitySelector({ selectedTraits, onTraitsChange }: {
  selectedTraits: string[];
  onTraitsChange: (traits: string[]) => void;
}) {
  const personalityTraits = [
    'Detail-oriented', 'Big-picture thinker', 'Results-driven', 'People-focused',
    'Innovative', 'Analytical', 'Enthusiastic', 'Calm under pressure',
    'Proactive', 'Collaborative', 'Independent', 'Methodical'
  ];

  const toggleTrait = (trait: string) => {
    if (selectedTraits.includes(trait)) {
      onTraitsChange(selectedTraits.filter(t => t !== trait));
    } else {
      onTraitsChange([...selectedTraits, trait]);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
      {personalityTraits.map(trait => (
        <div key={trait} className="flex items-center space-x-2">
          <Checkbox
            id={trait}
            checked={selectedTraits.includes(trait)}
            onCheckedChange={() => toggleTrait(trait)}
          />
          <Label htmlFor={trait} className="text-sm">{trait}</Label>
        </div>
      ))}
    </div>
  );
}