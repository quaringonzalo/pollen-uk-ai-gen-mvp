import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, Lightbulb, TrendingUp, FileText, ArrowRight, Clock, Trophy, User, Star, Crown, Info, Lock, CheckCircle, Zap, Target, Home, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import SimpleModal from "@/components/simple-modal";
import BootcampModal from "@/components/bootcamp-modal";

// Foundation Challenges - uniform 100 points each
const ALL_CHALLENGES = [
  {
    id: 'media-planning',
    title: 'Media Planning Challenge',
    category: 'creative',
    timeLimit: 45,
    points: 100,
    description: 'Plan an advertising campaign for an animal rescue charity with a £10,000 budget',
    skills: ['media-planning', 'budget-management', 'audience-targeting', 'strategic-thinking']
  },
  {
    id: 'client-communication',
    title: 'Client Communication Challenge',
    category: 'creative',
    timeLimit: 35,
    points: 100,
    description: 'Handle a difficult client communication scenario with professionalism and clarity',
    skills: ['written-communication', 'problem-solving', 'client-management', 'empathy']
  },
  {
    id: 'pl-analysis',
    title: 'P&L Financial Analysis',
    category: 'business',
    timeLimit: 60,
    points: 100,
    description: 'Create a comprehensive P&L statement and provide business insights',
    skills: ['financial-analysis', 'spreadsheet-skills', 'business-insight', 'critical-thinking']
  },
  {
    id: 'social-media-campaign',
    title: 'Social Media Campaign',
    category: 'creative',
    timeLimit: 30,
    points: 100,
    description: 'Design a social media campaign for a local business launch',
    skills: ['social-media', 'content-creation', 'brand-strategy', 'creativity']
  },
  {
    id: 'office-organization',
    title: 'Office Organization Challenge',
    category: 'organizational',
    timeLimit: 40,
    points: 100,
    description: 'Reorganise office workflows and improve administrative efficiency',
    skills: ['organization', 'process-improvement', 'time-management', 'documentation']
  },
  {
    id: 'data-visualization',
    title: 'Data Visualization Challenge',
    category: 'analytical',
    timeLimit: 50,
    points: 100,
    description: 'Transform complex data into clear, actionable insights',
    skills: ['data-analysis', 'visualization', 'storytelling', 'excel']
  },
  {
    id: 'customer-service',
    title: 'Customer Service Excellence',
    category: 'creative',
    timeLimit: 25,
    points: 100,
    description: 'Handle multiple customer inquiries with care and efficiency',
    skills: ['customer-service', 'empathy', 'problem-solving', 'multitasking']
  },
  {
    id: 'project-coordination',
    title: 'Project Coordination Challenge',
    category: 'organizational',
    timeLimit: 55,
    points: 100,
    description: 'Coordinate a multi-stakeholder project with tight deadlines',
    skills: ['project-management', 'stakeholder-management', 'planning', 'communication']
  }
];

// Sample Company Challenges (locked until foundation challenges completed)
const COMPANY_CHALLENGES = [
  {
    id: 'techcorp-product-launch',
    title: 'TechCorp Product Launch Strategy',
    companyName: 'TechCorp',
    companyLogo: '🚀',
    role: 'Marketing Coordinator',
    salary: '£28,000 - £32,000',
    timeLimit: 90,
    points: 200,
    description: 'Design a complete go-to-market strategy for our new SaaS product launch',
    requirements: ['Complete at least 2 Foundation Challenges', 'Focus on Creative & Business challenges'],
    benefits: [
      'Human review by TechCorp hiring team',
      'Direct interview if successful',
      '1:1 coaching session with Pollen team',
      'Guaranteed feedback within 48 hours'
    ]
  },
  {
    id: 'greentech-sustainability',
    title: 'GreenTech Sustainability Report',
    companyName: 'GreenTech Solutions',
    companyLogo: '🌱',
    role: 'Junior Analyst',
    salary: '£25,000 - £30,000',
    timeLimit: 120,
    points: 250,
    description: 'Create a comprehensive sustainability impact report with data visualization',
    requirements: ['Complete at least 1 Foundation Challenge', 'Must include Data Visualization challenge'],
    benefits: [
      'Direct access to GreenTech hiring manager',
      'Portfolio review session',
      'Pollen career coaching if unsuccessful',
      'Fast-track to final interview round'
    ]
  }
];

const CHALLENGE_CATEGORIES = {
  'analytical': {
    name: 'Analytical & Problem Solving',
    icon: Calculator,
    color: 'bg-blue-500',
  },
  'creative': {
    name: 'Creative & Marketing',
    icon: Lightbulb,
    color: 'bg-purple-500',
  },
  'business': {
    name: 'Business & Finance',
    icon: TrendingUp,
    color: 'bg-green-500',
  },
  'organizational': {
    name: 'Organization & Planning',
    icon: FileText,
    color: 'bg-orange-500',
  }
};

// Simple personalization logic
const getRecommendedChallenges = () => {
  // For demo, return first 4 challenges as "recommended"
  return ['media-planning', 'client-communication', 'pl-analysis', 'social-media-campaign'];
};

export default function WorkingChallenges() {
  console.log("WorkingChallenges component loaded");
  const [selectedCategory, setSelectedCategory] = useState<string>('recommended');
  const [lockedDialogOpen, setLockedDialogOpen] = useState(false);
  const [showUnlockDialog, setShowUnlockDialog] = useState(false);
  const [showBootcampDialog, setShowBootcampDialog] = useState(false);
  
  console.log("Current showUnlockDialog state:", showUnlockDialog);
  
  const recommendedIds = getRecommendedChallenges();
  const recommendedChallenges = ALL_CHALLENGES.filter(c => recommendedIds.includes(c.id));
  
  // For demo purposes, assume user has completed 0 foundation challenges
  const completedFoundationChallenges = 0;
  const totalPoints = completedFoundationChallenges * 100; // Each foundation challenge worth 100 points
  const hasUnlockedCompanyChallenges = completedFoundationChallenges >= 1;
  const hasUnlockedBootcamp = totalPoints >= 500; // Needs 500+ points (5+ challenges)
  
  const displayedChallenges = selectedCategory === 'recommended' 
    ? recommendedChallenges 
    : selectedCategory === 'all'
    ? ALL_CHALLENGES
    : selectedCategory === 'company' || selectedCategory === 'bootcamp'
    ? []  // Company challenges and bootcamp shown separately
    : ALL_CHALLENGES.filter(c => c.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Skills Challenges</h1>
              <p className="text-muted-foreground">
                Demonstrate your abilities and unlock job opportunities
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/home'}
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Home
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/profile'}
              className="flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              My Profile
            </Button>
            <Button 
              variant="outline"
              className="flex items-center gap-2"
            >
              <Target className="h-4 w-4" />
              {totalPoints} Points
            </Button>
          </div>
        </div>
        
        {/* Challenge Requirements Info */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="flex items-start gap-3">
              <Trophy className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Job Opportunities</h3>
                <p className="text-sm text-blue-800">
                  Complete <strong>1+ foundation challenge</strong> to unlock job opportunities. 
                  More challenges = stronger profile.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <div className="flex items-start gap-3">
              <Crown className="w-5 h-5 text-purple-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-purple-900 mb-1">Company Challenges</h3>
                <p className="text-sm text-purple-800">
                  Exclusive roles with <strong>company-created challenges</strong>, 
                  human review, and coaching support.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-orange-900 mb-1">Pollen Bootcamp</h3>
                <p className="text-sm text-orange-800">
                  1-week intensive for top performers. <strong>500+ points</strong> 
                  unlocks startup opportunities.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="text-sm text-green-800">
                <strong>Your Profile:</strong> Creative Influencer • 
                We've highlighted {recommendedChallenges.length} challenges that align with your behavioural strengths and career interests.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4 flex-wrap">
          <Button
            variant={selectedCategory === 'recommended' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('recommended')}
          >
            <Star className="h-4 w-4 mr-2" />
            Recommended for You ({recommendedChallenges.length})
          </Button>
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('all')}
          >
            Browse All ({ALL_CHALLENGES.length})
          </Button>
          <Button
            variant={selectedCategory === 'company' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('company')}
            className="relative"
          >
            <Crown className="h-4 w-4 mr-2" />
            Company Challenges ({COMPANY_CHALLENGES.length})
            {!hasUnlockedCompanyChallenges && (
              <Lock className="h-3 w-3 ml-1 text-muted-foreground" />
            )}
          </Button>
          <Button
            variant={selectedCategory === 'bootcamp' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('bootcamp')}
            className="relative"
          >
            <Zap className="h-4 w-4 mr-2" />
            Pollen Bootcamp
            {!hasUnlockedBootcamp && (
              <Lock className="h-3 w-3 ml-1 text-muted-foreground" />
            )}
          </Button>
          {Object.entries(CHALLENGE_CATEGORIES).map(([key, category]) => {
            const count = ALL_CHALLENGES.filter(c => c.category === key).length;
            const IconComponent = category.icon;
            return (
              <Button
                key={key}
                variant={selectedCategory === key ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(key)}
                className="flex items-center gap-2"
              >
                <IconComponent className="h-4 w-4" />
                {category.name} ({count})
              </Button>
            );
          })}
        </div>
        
        {selectedCategory === 'all' && (
          <p className="text-sm text-muted-foreground">
            All foundation challenges are worth 100 points each. Complete any combination to build your skills profile and unlock job opportunities.
          </p>
        )}
        
        {selectedCategory === 'recommended' && (
          <p className="text-sm text-muted-foreground">
            These challenges are specially selected based on your Creative Influencer profile. Start here for the best match with your strengths.
          </p>
        )}
        
        {selectedCategory === 'company' && (
          <div className="mb-4">
            {hasUnlockedCompanyChallenges ? (
              <p className="text-sm text-muted-foreground">
                Congratulations! You've unlocked exclusive company challenges with premium support and direct employer access.
              </p>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Lock className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-amber-900 mb-1">Complete Foundation Challenges to Unlock</h4>
                    <p className="text-sm text-amber-800">
                      Company challenges become available after completing at least 1 foundation challenge. 
                      These exclusive opportunities offer direct employer access and premium support.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {selectedCategory === 'bootcamp' && (
          <div className="mb-4">
            {hasUnlockedBootcamp ? (
              <p className="text-sm text-muted-foreground">
                Amazing! You've qualified for the exclusive Pollen Bootcamp. This elite programmeme connects top performers with startup opportunities.
              </p>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Target className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-amber-900 mb-1">Earn 500+ Points to Unlock Bootcamp</h4>
                    <p className="text-sm text-amber-800 mb-2">
                      Current progress: <strong>{totalPoints} / 500 points</strong> ({Math.max(0, 500 - totalPoints)} points needed)
                    </p>
                    <p className="text-sm text-amber-800">
                      Complete 5+ foundation challenges to qualify for our exclusive 1-week bootcamp, 
                      featuring startup partnerships and part-time opportunities.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Company Challenges Section */}
        {selectedCategory === 'company' && COMPANY_CHALLENGES.map((challenge) => (
          <Card key={challenge.id} className={`relative overflow-hidden ${!hasUnlockedCompanyChallenges ? 'opacity-75' : ''}`}>
            {!hasUnlockedCompanyChallenges && (
              <div 
                className="absolute inset-0 bg-gray-900/20 backdrop-blur-[1px] z-10 flex items-center justify-center pointer-events-none"
                style={{ pointerEvents: 'none' }}
              >
                <div className="bg-white rounded-full p-3 shadow-lg">
                  <Lock className="h-6 w-6 text-gray-600" />
                </div>
              </div>
            )}
            
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-2xl">{challenge.companyLogo}</div>
                  <div>
                    <div className="font-semibold text-sm text-purple-600">{challenge.companyName}</div>
                    <div className="text-xs text-muted-foreground">{challenge.role}</div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700 mb-1">
                    Company Challenge
                  </Badge>
                  <div className="text-xs text-muted-foreground">{challenge.salary}</div>
                </div>
              </div>
              <CardTitle className="text-lg">{challenge.title}</CardTitle>
              <CardDescription>{challenge.description}</CardDescription>
              
              {!hasUnlockedCompanyChallenges && (
                <div className="mt-2 p-2 bg-amber-50 rounded text-xs text-amber-700 border border-amber-200">
                  <strong>Requirements:</strong> {challenge.requirements.join(', ')}
                </div>
              )}
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
                
                <div>
                  <h5 className="text-sm font-semibold mb-2">Premium Benefits:</h5>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {challenge.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {hasUnlockedCompanyChallenges ? (
                  <Button 
                    onClick={() => alert(`Starting ${challenge.title} - Premium Company Challenge!`)}
                    className="w-full"
                  >
                    Start Company Challenge
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button 
                    variant="secondary" 
                    className="w-full relative z-20"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log("Company challenge button clicked - opening modal");
                      setShowUnlockDialog(true);
                    }}
                    style={{ position: 'relative', zIndex: 20 }}
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    Get Started
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {/* Bootcamp Section */}
        {selectedCategory === 'bootcamp' && (
          <Card className={`col-span-full relative overflow-hidden ${!hasUnlockedBootcamp ? 'opacity-75' : ''}`}>
            {!hasUnlockedBootcamp && (
              <div className="absolute inset-0 bg-gray-900/20 backdrop-blur-[1px] z-10 flex items-center justify-center">
                <div className="bg-white rounded-full p-4 shadow-lg">
                  <Lock className="h-8 w-8 text-gray-600" />
                </div>
              </div>
            )}
            
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl mb-1">Pollen Bootcamp</CardTitle>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                      Elite Programmeme
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-orange-600">500+ Points</div>
                  <div className="text-xs text-muted-foreground">Required</div>
                </div>
              </div>
              
              <CardDescription className="text-base">
                An exclusive 1-week self-directed intensive programmeme for top-performing community members. 
                Develop advanced skills with live interaction via Slack and video calls, plus access to startup opportunities.
              </CardDescription>
              
              {!hasUnlockedBootcamp && (
                <div className="mt-3 p-3 bg-amber-50 rounded text-sm text-amber-700 border border-amber-200">
                  <strong>Qualification Requirements:</strong> Complete 5+ foundation challenges (500+ points total)
                </div>
              )}
            </CardHeader>
            
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold mb-3">Programmeme Highlights:</h5>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      1-week self-directed intensive programmeme
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Live interaction via Slack and video calls
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Advanced skills development modules
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Part-time startup position opportunities
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-semibold mb-3">Startup Partners:</h5>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Direct access to startup ecosystem
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Portfolio building opportunities
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Networking with founders
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Potential equity participation
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6">
                <Button 
                  disabled={!hasUnlockedBootcamp}
                  onClick={() => {
                    if (hasUnlockedBootcamp) {
                      alert("Congratulations! Redirecting to Pollen Bootcamp application...");
                    }
                  }}
                  className="w-full"
                  size="lg"
                  variant={hasUnlockedBootcamp ? "default" : "secondary"}
                >
                  {hasUnlockedBootcamp ? (
                    <>
                      Apply to Pollen Bootcamp
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Complete {Math.ceil((500 - totalPoints) / 100)} More Foundation Challenges
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Foundation Challenges Section */}
        {displayedChallenges.map((challenge) => {
          const categoryInfo = CHALLENGE_CATEGORIES[challenge.category];
          const IconComponent = categoryInfo.icon;
          const isRecommended = selectedCategory === 'recommended' || recommendedIds.includes(challenge.id);
          
          return (
            <Card key={challenge.id} className="hover:shadow-lg transition-shadow relative">
              {isRecommended && selectedCategory === 'recommended' && (
                <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full z-10">
                  Recommended
                </div>
              )}
              
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`p-2 rounded-lg ${categoryInfo.colour} mb-3`}>
                    <IconComponent className="h-5 w-5 text-white" />
                  </div>
                  <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                    Foundation Challenge
                  </Badge>
                </div>
                <CardTitle className="text-lg">{challenge.title}</CardTitle>
                <CardDescription>{challenge.description}</CardDescription>
                
                {isRecommended && selectedCategory === 'recommended' && (
                  <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-700">
                    <strong>Great fit:</strong> This challenge aligns perfectly with your Creative Influencer profile and behavioural strengths.
                  </div>
                )}
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
                    onClick={() => {
                      // Demo the media planning challenge
                      if (challenge.id === 'media-planning') {
                        window.location.href = '/challenge-demo';
                      } else {
                        const message = `🚀 Starting ${challenge.title}!\n\n` +
                          `⏱️ Time Guidance: ${challenge.timeLimit} minutes\n` +
                          `🏆 Points: ${challenge.points} (all foundation challenges worth 100 points)\n` +
                          `📝 Skills Demonstrated: ${challenge.skills.join(', ')}\n\n` +
                          `After completion:\n` +
                          `• Automatic scoring and feedback\n` +
                          `• Direct matching to relevant job opportunities\n` +
                          `• Skills profile enhancement\n` +
                          `• Fast-track consideration by employers`;
                        alert(message);
                      }
                    }}
                    className="w-full"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Locked Preview Cards - Show in recommended and all views */}
        {(selectedCategory === 'recommended' || selectedCategory === 'all') && (
          <>
            {/* Locked Company Challenge Preview */}
            <Card className="relative overflow-hidden opacity-75 border-purple-200">
              <div 
                className="absolute inset-0 bg-purple-900/10 backdrop-blur-[1px] z-10 flex items-center justify-center pointer-events-none"
                style={{ pointerEvents: 'none' }}
              >
                <div className="bg-white rounded-full p-3 shadow-lg">
                  <Lock className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-xl">🚀</div>
                    <div>
                      <div className="font-semibold text-sm text-purple-600">TechCorp</div>
                      <div className="text-xs text-muted-foreground">Marketing Coordinator</div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                    Company Challenge
                  </Badge>
                </div>
                <CardTitle className="text-lg">Product Launch Strategy</CardTitle>
                <CardDescription>
                  Design a complete go-to-market strategy for TechCorp's new SaaS product launch
                </CardDescription>
                
                <div className="mt-2 p-2 bg-purple-50 rounded text-xs text-purple-700 border border-purple-200">
                  <strong>Unlock Requirements:</strong> Complete 1+ Foundation Challenge
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      90 min
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Trophy className="h-4 w-4" />
                      200 pts
                    </span>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    <div className="mb-2"><strong>Premium Benefits:</strong></div>
                    <ul className="space-y-1">
                      <li>• Human review by TechCorp hiring team</li>
                      <li>• Direct interview if successful</li>
                      <li>• 1:1 coaching with Pollen team</li>
                    </ul>
                  </div>
                  
                  <Button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log("Bootcamp button clicked - opening modal");
                      setShowUnlockDialog(true);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white relative z-20"
                    style={{ position: 'relative', zIndex: 20 }}
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    Get Started
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Locked Bootcamp Preview */}
            <Card className="relative overflow-hidden opacity-75 border-orange-200">
              <div 
                className="absolute inset-0 bg-orange-900/10 backdrop-blur-[1px] z-10 flex items-center justify-center pointer-events-none"
                style={{ pointerEvents: 'none' }}
              >
                <div className="bg-white rounded-full p-3 shadow-lg">
                  <Lock className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                      <Zap className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-orange-600">Pollen</div>
                      <div className="text-xs text-muted-foreground">Elite Programme</div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                    Bootcamp Access
                  </Badge>
                </div>
                <CardTitle className="text-lg">Pollen Bootcamp</CardTitle>
                <CardDescription>
                  1-week intensive programme with startup partnerships and part-time opportunities
                </CardDescription>
                
                <div className="mt-2 p-2 bg-orange-50 rounded text-xs text-orange-700 border border-orange-200">
                  <strong>Unlock Requirements:</strong> Earn 500+ Points (5+ Foundation Challenges)
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      1 week
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Target className="h-4 w-4" />
                      500+ pts
                    </span>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    <div className="mb-2"><strong>Programme Highlights:</strong></div>
                    <ul className="space-y-1">
                      <li>• Self-directed intensive curriculum</li>
                      <li>• Live Slack and video call support</li>
                      <li>• Startup partnership opportunities</li>
                    </ul>
                  </div>
                  
                  <Button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log("Bootcamp button clicked - opening bootcamp modal");
                      setShowBootcampDialog(true);
                    }}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white relative z-20"
                    style={{ position: 'relative', zIndex: 20 }}
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    Get Started
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {displayedChallenges.length === 0 && (
        <div className="text-center py-12">
          <Trophy className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No challenges found</h3>
          <p className="text-muted-foreground">
            Try selecting a different category or check back later for new challenges.
          </p>
        </div>
      )}

      <SimpleModal 
        isOpen={showUnlockDialog}
        onClose={() => {
          console.log("Closing modal");
          setShowUnlockDialog(false);
        }}
        onStartChallenge={() => {
          console.log("Starting challenge");
          setSelectedCategory('recommended');
          setShowUnlockDialog(false);
        }}
      />

      <BootcampModal 
        isOpen={showBootcampDialog}
        onClose={() => {
          console.log("Closing bootcamp modal");
          setShowBootcampDialog(false);
        }}
        onStartChallenge={() => {
          console.log("Starting foundation challenge from bootcamp modal");
          setSelectedCategory('recommended');
          setShowBootcampDialog(false);
        }}
        totalPoints={totalPoints}
      />
    </div>
  );
}