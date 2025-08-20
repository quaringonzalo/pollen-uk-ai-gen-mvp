import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Trophy, Clock, Star, Target, Upload, Download, 
  Calculator, TrendingUp, Users, Lightbulb, 
  FileText, CheckCircle, AlertCircle, ArrowRight
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

// Skills Challenge Types based on your documents
const CHALLENGE_CATEGORIES = {
  'analytical': {
    name: 'Analytical & Problem Solving',
    icon: Calculator,
    colour: 'bg-blue-500',
    description: 'Mathematical reasoning, data analysis, and logical problem solving'
  },
  'creative': {
    name: 'Creative & Marketing',
    icon: Lightbulb,
    colour: 'bg-purple-500',
    description: 'Creative thinking, marketing strategy, and brand communication'
  },
  'business': {
    name: 'Business & Finance',
    icon: TrendingUp,
    colour: 'bg-green-500',
    description: 'Financial analysis, business planning, and commercial understanding'
  },
  'organizational': {
    name: 'Organization & Planning',
    icon: FileText,
    colour: 'bg-orange-500',
    description: 'Project management, organization, and systematic thinking'
  }
};

// Challenge Templates based on your documents
const CHALLENGE_TEMPLATES = [
  {
    id: 'media-planning',
    title: 'Media Planning Challenge',
    category: 'creative',
    difficulty: 'intermediate',
    timeLimit: 45,
    points: 150,
    description: 'Plan an advertising campaign for an animal rescue charity with a £10,000 budget',
    skills: ['media-planning', 'budget-management', 'audience-targeting', 'strategic-thinking'],
    instructions: `You are working with an animal rescue charity that needs to plan an advertising campaign across multiple media channels.

**Client Brief:**
- Budget: £10,000 (including VAT)
- Current Strategy: Newspaper advertising (very effective for donations)
- Core Audience: 55+ animal lovers
- Goal: Maximize donations and awareness

**Part 1: Newspaper Advertisement Costing**
The standard gross cost for a full page newspaper advert is £5,000.
- They receive a 15% discount
- You receive 5% commission (on gross cost)
- Both media space and commission are subject to VAT

Calculate:
1. Net cost of newspaper advert (before VAT)
2. Total cost including VAT
3. Remaining budget

**Part 2: Additional Media Recommendations**
Recommend new media channels for testing and explain:
1. Why these channels suit their core audience (55+ animal lovers)
2. What other audiences they should target and why
3. How to allocate the remaining budget effectively`,
    submissionType: 'document',
    rubric: [
      { criteria: 'Mathematical Accuracy', maxPoints: 40, description: 'Correct calculations for costs, VAT, and budget allocation' },
      { criteria: 'Media Strategy', maxPoints: 60, description: 'Thoughtful media channel recommendations with clear rationale' },
      { criteria: 'Audience Understanding', maxPoints: 30, description: 'Demonstrates understanding of target demographics' },
      { criteria: 'Budget Optimization', maxPoints: 20, description: 'Efficient use of available budget across channels' }
    ]
  },
  {
    id: 'pl-analysis',
    title: 'P&L Financial Analysis',
    category: 'business',
    difficulty: 'advanced',
    timeLimit: 60,
    points: 200,
    description: 'Create a comprehensive P&L statement and provide business insights',
    skills: ['financial-analysis', 'spreadsheet-skills', 'business-insight', 'critical-thinking'],
    instructions: `Analyze the following data for a fictional clothing business and create a complete P&L statement.

**Financial Data:**
- Total Sales: £400,000
- Returned Goods: £60,000
- Cost of Goods Sold (COGS): £150,000
- Salaries and Wages: £100,000
- Rent: £50,000
- Utilities: £5,000
- Marketing: £15,000
- Loan: £100,000 at 5% interest rate
- Income Taxes: £15,000

**Required Calculations:**
1. Gross Profit (Revenue minus COGS)
2. Total Operating Expenses
3. Operating Income
4. Net Income (after interest and taxes)

**Analysis Required:**
- Summary of key findings
- Areas for further investigation
- Business recommendations based on the data
- Attach your calculation spreadsheet`,
    submissionType: 'document-with-spreadsheet',
    rubric: [
      { criteria: 'Calculation Accuracy', maxPoints: 50, description: 'All P&L calculations are mathematically correct' },
      { criteria: 'Spreadsheet Organization', maxPoints: 30, description: 'Clear, professional spreadsheet layout and formulas' },
      { criteria: 'Business Insights', maxPoints: 70, description: 'Thoughtful analysis and actionable recommendations' },
      { criteria: 'Professional Presentation', maxPoints: 50, description: 'Clear writing and professional document structure' }
    ]
  },
  {
    id: 'social-media-strategy',
    title: 'Social Media Content Creation',
    category: 'creative',
    difficulty: 'beginner',
    timeLimit: 30,
    points: 100,
    description: 'Create a social media post representing Pollen\'s brand and mission',
    skills: ['content-creation', 'brand-understanding', 'social-media', 'visual-design'],
    instructions: `Create a mock-up social media post speaking as Pollen. Include both visual content and copy.

**Requirements:**
- Choose your preferred social media platform (justify your choice)
- Include image or video content
- Write platform-appropriate copy/caption
- Submit as PDF format

**Content Areas (choose one):**
- Statistics and research about career development
- Pollen's mission and values
- Potential partnerships in the career space
- Personal success stories from job seekers

**Key Points:**
- Demonstrate understanding of Pollen's brand
- Show platform-specific best practices
- Keep it authentic and engaging
- Time limit: 30 minutes (focus on approach over perfection)

**Submission:**
Upload your PDF mock-up with platform rationale`,
    submissionType: 'creative-file',
    rubric: [
      { criteria: 'Brand Alignment', maxPoints: 40, description: 'Content reflects Pollen\'s mission and values accurately' },
      { criteria: 'Platform Strategy', maxPoints: 30, description: 'Clear rationale for platform choice and format' },
      { criteria: 'Content Quality', maxPoints: 20, description: 'Engaging, well-written copy appropriate for audience' },
      { criteria: 'Visual Presentation', maxPoints: 10, description: 'Professional and appealing visual design' }
    ]
  },
  {
    id: 'communication-challenge',
    title: 'Client Communication Challenge',
    category: 'creative',
    difficulty: 'intermediate',
    timeLimit: 35,
    points: 130,
    description: 'Handle a difficult client communication scenario with professionalism and clarity',
    skills: ['written-communication', 'problem-solving', 'client-management', 'empathy'],
    instructions: `You're working at Pollen and receive this email from a frustrated job seeker:

**Client Email:**
"Hi there, I've been using your platform for 3 months now and I'm really disappointed. I completed your behavioural assessment and several challenges, but I still haven't gotten ANY job interviews. The jobs you recommended don't match what I'm looking for at all - I said I wanted remote marketing roles and you keep showing me in-person sales positions. I'm starting to think this whole platform is just a waste of time. I want to know what you're actually doing to help people like me, or if I should just cancel my account and go back to traditional job boards. This is really frustrating and I expected much better from a company that claims to revolutionize careers."

**Your Task:**
Write a professional, empathetic response that:
1. Acknowledges their frustration and validates their concerns
2. Explains how Pollen's matching system works and why there might be a mismatch
3. Offers specific, actionable solutions to improve their experience
4. Demonstrates Pollen's value proposition without being defensive
5. Maintains a helpful, solution-focused tone throughout

**Requirements:**
- Keep response between 200-400 words
- Use Pollen's brand voice (supportive, innovative, transparent)
- Include at least 2 concrete next steps for the client
- Show understanding of both technical and emotional aspects of their concern`,
    submissionType: 'text',
    rubric: [
      { criteria: 'Empathy & Acknowledgment', maxPoints: 30, description: 'Validates client concerns and shows genuine understanding' },
      { criteria: 'Technical Explanation', maxPoints: 25, description: 'Clear explanation of platform functionality and potential issues' },
      { criteria: 'Solution-Oriented', maxPoints: 35, description: 'Provides actionable, specific steps to resolve the problem' },
      { criteria: 'Brand Voice & Professionalism', maxPoints: 25, description: 'Maintains Pollen\'s brand voice while being professional' },
      { criteria: 'Communication Clarity', maxPoints: 15, description: 'Clear, well-structured writing that\'s easy to follow' }
    ]
  },
  {
    id: 'organization-challenge',
    title: 'Project Organization & Planning',
    category: 'organizational',
    difficulty: 'intermediate',
    timeLimit: 40,
    points: 120,
    description: 'Organise a complex project with multiple stakeholders and deadlines',
    skills: ['project-management', 'prioritization', 'stakeholder-management', 'systematic-thinking'],
    instructions: `You've been tasked with organising a virtual career fair for 500+ participants.

**Project Overview:**
- Event Date: 6 weeks from today
- Participants: 500 job seekers, 25 employers, 10 career coaches
- Format: Virtual platform with breakout rooms
- Budget: £15,000
- Team: You + 3 colleagues (part-time availability)

**Your Challenge:**
1. Create a detailed project timeline with key milestones
2. Identify and prioritise critical tasks
3. Assign responsibilities and resource requirements
4. Plan risk mitigation strategies
5. Design stakeholder communication plan

**Deliverables:**
- Project timeline (Gantt chart or similar)
- Task priority matrix
- Risk assessment with mitigation plans
- Communication schedule for all stakeholders

**Evaluation Criteria:**
Focus on systematic thinking, realistic timelines, and stakeholder management`,
    submissionType: 'document',
    rubric: [
      { criteria: 'Timeline Realism', maxPoints: 40, description: 'Realistic and detailed project timeline with logical sequencing' },
      { criteria: 'Task Prioritisation', maxPoints: 30, description: 'Clear understanding of critical path and dependencies' },
      { criteria: 'Risk Management', maxPoints: 30, description: 'Comprehensive risk identification and mitigation strategies' },
      { criteria: 'Stakeholder Communication', maxPoints: 20, description: 'Thoughtful communication plan for all participant groups' }
    ]
  }
];

function SkillsChallenges() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null);
  const [challengeStep, setChallengeStep] = useState<'browse' | 'instructions' | 'attempt' | 'submit'>('browse');
  
  console.log('Current challenge step:', challengeStep);
  console.log('Selected challenge:', selectedChallenge?.title);
  const [submission, setSubmission] = useState<{
    textResponse: string;
    fileUploads: File[];
    timeSpent: number;
  }>({
    textResponse: '',
    fileUploads: [],
    timeSpent: 0
  });
  const [timer, setTimer] = useState<number>(0);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerActive && challengeStep === 'attempt') {
      interval = setInterval(() => {
        setTimer(timer => timer + 1);
      }, 1000);
    } else if (!isTimerActive && timer !== 0) {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, timer, challengeStep]);

  // Format timer display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Filter challenges by category
  const filteredChallenges = selectedCategory === 'all' 
    ? CHALLENGE_TEMPLATES 
    : CHALLENGE_TEMPLATES.filter(c => c.category === selectedCategory);

  // Start challenge
  const startChallenge = (challenge: any) => {
    console.log('Starting challenge:', challenge.title);
    setSelectedChallenge(challenge);
    setChallengeStep('instructions');
    setTimer(0);
    setSubmission({ textResponse: '', fileUploads: [], timeSpent: 0 });
  };

  // Begin attempt
  const beginAttempt = () => {
    setChallengeStep('attempt');
    setIsTimerActive(true);
  };

  // Submit challenge
  const submitChallenge = useMutation({
    mutationFn: async (submissionData: any) => {
      return apiRequest('/api/challenges/submit', {
        method: 'POST',
        body: JSON.stringify({
          challengeId: selectedChallenge.id,
          ...submissionData,
          timeSpent: timer
        })
      });
    },
    onSuccess: (data) => {
      setIsTimerActive(false);
      // Redirect to results page
      window.location.href = `/challenge-results/${data.id}`;
    }
  });

  const handleSubmit = () => {
    submitChallenge.mutate({
      challengeId: selectedChallenge.id,
      textResponse: submission.textResponse,
      fileUploads: submission.fileUploads,
      timeSpent: timer
    });
  };

  // File upload handler
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSubmission(prev => ({
      ...prev,
      fileUploads: [...prev.fileUploads, ...files]
    }));
  };

  if (challengeStep === 'instructions' && selectedChallenge) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => setChallengeStep('browse')}
            className="mb-4"
          >
            ← Back to Challenges
          </Button>
          
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-3 rounded-lg ${CHALLENGE_CATEGORIES[selectedChallenge.category].colour}`}>
              {(() => {
                const IconComponent = CHALLENGE_CATEGORIES[selectedChallenge.category].icon;
                return <IconComponent className="h-6 w-6 text-white" />;
              })()}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{selectedChallenge.title}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {selectedChallenge.timeLimit} minutes
                </span>
                <span className="flex items-center gap-1">
                  <Trophy className="h-4 w-4" />
                  {selectedChallenge.points} points
                </span>
                <Badge variant={selectedChallenge.difficulty === 'beginner' ? 'default' : 
                              selectedChallenge.difficulty === 'intermediate' ? 'secondary' : 'destructive'}>
                  {selectedChallenge.difficulty}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Challenge Instructions</CardTitle>
            <CardDescription>{selectedChallenge.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                {selectedChallenge.instructions}
              </pre>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Skills Assessed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {selectedChallenge.skills.map((skill: string) => (
                <Badge key={skill} variant="outline">
                  {skill.replace('-', ' ')}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Evaluation Rubric</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedChallenge.rubric.map((criterion: any, index: number) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold">{criterion.criteria}</h4>
                    <Badge>{criterion.maxPoints} points</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {criterion.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button onClick={beginAttempt} size="lg" className="px-8">
            Start Challenge
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    );
  }

  if (challengeStep === 'attempt' && selectedChallenge) {
    const timeLimit = selectedChallenge.timeLimit * 60; // Convert to seconds
    const timeRemaining = Math.max(0, timeLimit - timer);
    const isTimeUp = timeRemaining === 0;

    return (
      <div className="max-w-4xl mx-auto p-6">
        {/* Timer Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">{selectedChallenge.title}</h2>
              <p className="opacity-90">Complete your submission below</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-mono font-bold">
                {formatTime(timeRemaining)}
              </div>
              <div className="text-sm opacity-90">
                {isTimeUp ? 'Time\'s up!' : 'Time remaining'}
              </div>
            </div>
          </div>
          <Progress 
            value={(timer / timeLimit) * 100} 
            className="mt-3 bg-white/20"
          />
        </div>

        {/* Instructions Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Quick Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {selectedChallenge.description}
            </p>
          </CardContent>
        </Card>

        {/* Submission Area */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Your Submission</CardTitle>
            <CardDescription>
              Submit your response using the format specified in the challenge instructions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Text Response */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Written Response & Analysis
              </label>
              <Textarea
                placeholder="Provide your detailed response, calculations, analysis, and recommendations here..."
                value={submission.textResponse}
                onChange={(e) => setSubmission(prev => ({ ...prev, textResponse: e.target.value }))}
                className="min-h-[300px]"
                disabled={isTimeUp}
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">
                File Attachments
                <span className="text-sm text-muted-foreground ml-2">
                  (Spreadsheets, PDFs, images, etc.)
                </span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Drop files here or click to upload
                  </p>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    disabled={isTimeUp}
                    accept=".pdf,.xlsx,.xls,.doc,.docx,.png,.jpg,.jpeg"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('file-upload')?.click()}
                    disabled={isTimeUp}
                  >
                    Choose Files
                  </Button>
                </div>
              </div>
              
              {/* Uploaded Files */}
              {submission.fileUploads.length > 0 && (
                <div className="mt-4 space-y-2">
                  {submission.fileUploads.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">{file.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSubmission(prev => ({
                          ...prev,
                          fileUploads: prev.fileUploads.filter((_, i) => i !== index)
                        }))}
                        disabled={isTimeUp}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleSubmit}
            disabled={!submission.textResponse.trim() || submitChallenge.isPending}
            size="lg"
            className="px-8"
          >
            {submitChallenge.isPending ? 'Submitting...' : 'Submit Challenge'}
            <CheckCircle className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {isTimeUp && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 mr-2" />
              <div>
                <h4 className="font-medium text-amber-800">Time's Up!</h4>
                <p className="text-sm text-amber-700 mt-1">
                  Please submit your current work. You can still make final edits to your written response.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Main browse view
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Skills Challenges</h1>
        <p className="text-muted-foreground">
          Demonstrate your abilities through practical, real-world challenges. 
          Complete challenges to earn points and showcase your skills to employers.
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('all')}
          >
            All Challenges
          </Button>
          {Object.entries(CHALLENGE_CATEGORIES).map(([key, category]) => {
            const IconComponent = category.icon;
            return (
              <Button
                key={key}
                variant={selectedCategory === key ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(key)}
                className="flex items-center gap-2"
              >
                <IconComponent className="h-4 w-4" />
                {category.name}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChallenges.map((challenge) => {
          const categoryInfo = CHALLENGE_CATEGORIES[challenge.category];
          const IconComponent = categoryInfo.icon;
          
          return (
            <Card key={challenge.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`p-2 rounded-lg ${categoryInfo.colour} mb-3`}>
                    <IconComponent className="h-5 w-5 text-white" />
                  </div>
                  <Badge variant={challenge.difficulty === 'beginner' ? 'default' : 
                                challenge.difficulty === 'intermediate' ? 'secondary' : 'destructive'}>
                    {challenge.difficulty}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{challenge.title}</CardTitle>
                <CardDescription>{challenge.description}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {challenge.timeLimit} min
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Trophy className="h-4 w-4" />
                      {challenge.points} pts
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {challenge.skills.slice(0, 3).map((skill: string) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill.replace('-', ' ')}
                      </Badge>
                    ))}
                    {challenge.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{challenge.skills.length - 3} more
                      </Badge>
                    )}
                  </div>
                  
                  <Button 
                    onClick={(e) => {
                      e.preventDefault();
                      console.log('Button clicked for challenge:', challenge.title);
                      startChallenge(challenge);
                    }}
                    className="w-full"
                  >
                    Start Challenge
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredChallenges.length === 0 && (
        <div className="text-center py-12">
          <Target className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No challenges found</h3>
          <p className="text-muted-foreground">
            Try selecting a different category or check back later for new challenges.
          </p>
        </div>
      )}
    </div>
  );
}

export default SkillsChallenges;