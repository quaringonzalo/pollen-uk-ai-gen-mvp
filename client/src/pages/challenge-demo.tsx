import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Clock, Upload, Save, Send, ArrowLeft, CheckCircle, Target, FileText, User } from "lucide-react";

const DEMO_CHALLENGE = {
  id: 'media-planning-demo',
  title: 'Media Planning Challenge',
  company: 'Demo Challenge',
  timeGuidance: 45,
  points: 100,
  description: 'Plan an advertising campaign for an animal rescue charity with a £10,000 budget',
  brief: `
**Challenge Brief: Animal Rescue Charity Campaign**

Happy Paws Animal Rescue is a local charity that has been operating for 5 years. They rescue abandoned and injured animals, provide veterinary care, and find loving homes for pets.

**Your Task:**
Create a comprehensive media plan for their annual fundraising campaign with a budget of £10,000.

**Key Information:**
- Target audience: Pet lovers aged 25-55 in the local area
- Campaign goal: Raise £50,000 in donations
- Timeline: 6-week campaign starting next month
- Previous campaigns relied mainly on social media and local newspaper ads
- They have a database of 2,000 email subscribers
- Strong volunteer network of 50+ people

**Deliverables:**
1. Media mix recommendation with budget allocation
2. Target audience analysis
3. Key messaging strategy
4. Success metrics and measurement plan
5. Timeline for campaign execution

**Resources Available:**
- High-quality photos and videos of rescued animals
- Testimonials from adopters
- Volunteer network for grassroots marketing
- Basic social media presence (1,500 Instagram, 800 Facebook followers)
  `,
  sections: [
    {
      id: 'audience',
      title: '1. Target Audience Analysis',
      description: 'Analyze and define your target audience segments',
      required: true
    },
    {
      id: 'media-mix',
      title: '2. Media Mix & Budget Allocation',
      description: 'Recommend channels and allocate the £10,000 budget',
      required: true
    },
    {
      id: 'messaging',
      title: '3. Key Messaging Strategy',
      description: 'Develop core messages and positioning',
      required: true
    },
    {
      id: 'timeline',
      title: '4. Campaign Timeline',
      description: 'Create a 6-week execution timeline',
      required: true
    },
    {
      id: 'metrics',
      title: '5. Success Metrics',
      description: 'Define KPIs and measurement approach',
      required: true
    }
  ]
};

export default function ChallengeDemo() {
  const [currentSection, setCurrentSection] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [timeSpent, setTimeSpent] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [savedProgress, setSavedProgress] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const handleResponseChange = (sectionId: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [sectionId]: value
    }));
  };

  const saveProgress = () => {
    setSavedProgress(true);
    setTimeout(() => setSavedProgress(false), 2000);
  };

  const submitChallenge = () => {
    setIsSubmitted(true);
  };

  const completedSections = DEMO_CHALLENGE.sections.filter(
    section => responses[section.id]?.trim().length > 50
  ).length;

  const progressPercentage = (completedSections / DEMO_CHALLENGE.sections.length) * 100;

  if (isSubmitted) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="text-center py-12">
          <CardContent>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Challenge Submitted Successfully!</h2>
            <p className="text-muted-foreground mb-6">
              Your media planning challenge has been submitted for review. You'll receive detailed feedback within 24 hours.
            </p>
            
            <div className="grid md:grid-cols-3 gap-4 mb-6 text-sm">
              <div className="bg-blue-50 p-3 rounded">
                <div className="font-semibold text-blue-900">Time Spent</div>
                <div className="text-blue-700">{timeSpent} minutes</div>
              </div>
              <div className="bg-green-50 p-3 rounded">
                <div className="font-semibold text-green-900">Sections Completed</div>
                <div className="text-green-700">{completedSections}/5</div>
              </div>
              <div className="bg-purple-50 p-3 rounded">
                <div className="font-semibold text-purple-900">Points Earned</div>
                <div className="text-purple-700">100 points</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex gap-3">
                <Button onClick={() => window.location.href = '/profile'}>
                  <User className="mr-2 h-4 w-4" />
                  View My Profile
                </Button>
                <Button variant="outline" onClick={() => window.location.href = '/skills-challenges'}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  More Challenges
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                This challenge contributes to your skills profile and job matching algorithm
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => window.history.back()}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Challenges
        </Button>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">{DEMO_CHALLENGE.title}</h1>
            <p className="text-muted-foreground">{DEMO_CHALLENGE.description}</p>
          </div>
          <Badge variant="default" className="bg-green-600">
            Foundation Challenge - 100 Points
          </Badge>
        </div>

        {/* Progress and Time */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Progress</span>
            </div>
            <Progress value={progressPercentage} className="mb-2" />
            <p className="text-xs text-muted-foreground">
              {completedSections}/5 sections completed
            </p>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium">Time Guidance</span>
            </div>
            <p className="text-lg font-semibold">{DEMO_CHALLENGE.timeGuidance} minutes</p>
            <p className="text-xs text-muted-foreground">
              Suggested time (work at your own pace)
            </p>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Time Spent</span>
            </div>
            <p className="text-lg font-semibold">{timeSpent} minutes</p>
            <p className="text-xs text-muted-foreground">
              No time limit - complete when ready
            </p>
          </Card>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Challenge Brief */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg">Challenge Brief</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm whitespace-pre-line">{DEMO_CHALLENGE.brief}</div>
            </CardContent>
          </Card>
        </div>

        {/* Response Sections */}
        <div className="lg:col-span-2 space-y-6">
          {DEMO_CHALLENGE.sections.map((section, index) => (
            <Card key={section.id} className={index === currentSection ? 'ring-2 ring-primary' : ''}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    {responses[section.id]?.trim().length > 50 && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                    {section.required && (
                      <Badge variant="outline" className="text-xs">Required</Badge>
                    )}
                  </div>
                </div>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <Textarea
                  placeholder={`Enter your response for ${section.title.toLowerCase()}...`}
                  value={responses[section.id] || ''}
                  onChange={(e) => handleResponseChange(section.id, e.target.value)}
                  className="min-h-[150px]"
                  onFocus={() => setCurrentSection(index)}
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-muted-foreground">
                    {responses[section.id]?.length || 0} characters
                  </p>
                  {responses[section.id]?.trim().length > 50 && (
                    <p className="text-xs text-green-600">✓ Complete</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* File Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Supporting Materials (Optional)</CardTitle>
              <CardDescription>
                Upload any additional documents, spreadsheets, or visual materials to support your campaign plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Drag and drop files here, or click to browse
                </p>
                <p className="text-xs text-gray-500">
                  Supported formats: PDF, DOC, XLS, PNG, JPG (Max 10MB)
                </p>
                <Button variant="outline" className="mt-2">
                  <Upload className="mr-2 h-4 w-4" />
                  Choose Files
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <Button 
              variant="outline" 
              onClick={saveProgress}
              disabled={savedProgress}
            >
              <Save className="mr-2 h-4 w-4" />
              {savedProgress ? 'Saved!' : 'Save Progress'}
            </Button>
            
            <Button 
              onClick={submitChallenge}
              disabled={completedSections < 5}
              className="min-w-[150px]"
            >
              <Send className="mr-2 h-4 w-4" />
              Submit Challenge
            </Button>
          </div>
          
          {completedSections < 5 && (
            <p className="text-sm text-muted-foreground text-center">
              Complete all required sections to submit your challenge ({completedSections}/5 done)
            </p>
          )}
        </div>
      </div>
    </div>
  );
}