import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, Lightbulb, TrendingUp, FileText, ArrowRight, Clock, Trophy, User } from "lucide-react";

// Complete bank of challenges
const ALL_CHALLENGES = [
  {
    id: 'media-planning',
    title: 'Media Planning Challenge',
    category: 'creative',
    difficulty: 'intermediate',
    timeLimit: 45,
    points: 150,
    description: 'Plan an advertising campaign for an animal rescue charity with a £10,000 budget',
    skills: ['media-planning', 'budget-management', 'audience-targeting', 'strategic-thinking'],
    requirements: ['high-creativity', 'strategic-thinking', 'budget-conscious'],
    detailedDescription: 'Create a comprehensive media plan including channel selection, budget allocation, and success metrics for an animal rescue charity campaign.'
  },
  {
    id: 'client-communication',
    title: 'Client Communication Challenge',
    category: 'creative',
    difficulty: 'intermediate',
    timeLimit: 35,
    points: 130,
    description: 'Handle a difficult client communication scenario with professionalism and clarity',
    skills: ['written-communication', 'problem-solving', 'client-management', 'empathy'],
    requirements: ['high-influence', 'high-steadiness', 'people-focused'],
    detailedDescription: 'Demonstrate your ability to handle challenging client situations while maintaining professionalism and achieving positive outcomes.'
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
    requirements: ['high-compliance', 'analytical-thinking', 'detail-oriented'],
    detailedDescription: 'Analyze financial data, create accurate P&L statements, and provide strategic business recommendations based on your findings.'
  },
  {
    id: 'social-media-campaign',
    title: 'Social Media Campaign Challenge',
    category: 'creative',
    difficulty: 'beginner',
    timeLimit: 30,
    points: 100,
    description: 'Design a social media campaign for a local business launch',
    skills: ['social-media', 'content-creation', 'brand-strategy', 'creativity'],
    requirements: ['high-creativity', 'digital-native', 'visual-thinking'],
    detailedDescription: 'Create a complete social media strategy including content calendar, visual concepts, and engagement tactics.'
  },
  {
    id: 'office-organization',
    title: 'Office Organization Challenge',
    category: 'organizational',
    difficulty: 'intermediate',
    timeLimit: 40,
    points: 120,
    description: 'Reorganise office workflows and improve administrative efficiency',
    skills: ['organization', 'process-improvement', 'time-management', 'documentation'],
    requirements: ['high-compliance', 'detail-oriented', 'systematic-thinking'],
    detailedDescription: 'Analyze current office processes, identify inefficiencies, and propose systematic improvements with implementation plans.'
  },
  {
    id: 'data-visualization',
    title: 'Data Visualization Challenge',
    category: 'analytical',
    difficulty: 'intermediate',
    timeLimit: 50,
    points: 140,
    description: 'Transform complex data into clear, actionable insights',
    skills: ['data-analysis', 'visualization', 'storytelling', 'excel'],
    requirements: ['analytical-thinking', 'visual-communication', 'detail-oriented'],
    detailedDescription: 'Take raw business data and create compelling visualizations that tell a clear story and support decision-making.'
  },
  {
    id: 'customer-service',
    title: 'Customer Service Excellence Challenge',
    category: 'creative',
    difficulty: 'beginner',
    timeLimit: 25,
    points: 90,
    description: 'Handle multiple customer inquiries with care and efficiency',
    skills: ['customer-service', 'empathy', 'problem-solving', 'multitasking'],
    requirements: ['high-steadiness', 'people-focused', 'patience'],
    detailedDescription: 'Demonstrate your ability to provide exceptional customer service while managing multiple priorities and difficult situations.'
  },
  {
    id: 'project-coordination',
    title: 'Project Coordination Challenge',
    category: 'organizational',
    difficulty: 'advanced',
    timeLimit: 55,
    points: 180,
    description: 'Coordinate a multi-stakeholder project with tight deadlines',
    skills: ['project-management', 'stakeholder-management', 'planning', 'communication'],
    requirements: ['leadership-potential', 'systematic-thinking', 'high-drive'],
    detailedDescription: 'Plan and coordinate a complex project involving multiple teams, manage timelines, and ensure successful delivery.'
  }
];

// Personalization logic based on behavioural profile
const getPersonalizedRecommendations = (profile: any) => {
  const recommendations = [];
  
  // High creativity + influence = Creative challenges
  if (profile.creativity > 70 && profile.influence > 70) {
    recommendations.push({
      challengeId: 'media-planning',
      reason: 'Your high creativity and influence scores make you perfect for strategic marketing roles'
    });
    recommendations.push({
      challengeId: 'social-media-campaign',
      reason: 'Your creative and people-focused nature suits social media strategy'
    });
  }
  
  // High compliance + analytical = Business/Data challenges  
  if (profile.compliance > 70 || profile.drive > 70) {
    recommendations.push({
      challengeId: 'pl-analysis',
      reason: 'Your systematic thinking and attention to detail are ideal for financial analysis'
    });
    recommendations.push({
      challengeId: 'data-visualization',
      reason: 'Your analytical mindset suits data interpretation and visualization work'
    });
  }
  
  // High steadiness = Service/Communication challenges
  if (profile.steadiness > 70) {
    recommendations.push({
      challengeId: 'client-communication',
      reason: 'Your high steadiness and people skills make you excellent at relationship management'
    });
    recommendations.push({
      challengeId: 'customer-service',
      reason: 'Your patient and empathetic nature is perfect for customer-facing roles'
    });
  }
  
  // High drive + leadership = Management challenges
  if (profile.drive > 70 && profile.leadership > 60) {
    recommendations.push({
      challengeId: 'project-coordination',
      reason: 'Your drive and leadership qualities suit project management responsibilities'
    });
  }
  
  // Always include organizational for everyone
  recommendations.push({
    challengeId: 'office-organization',
    reason: 'Strong organizational skills are valuable in any role'
  });
  
  return recommendations.slice(0, 4); // Limit to top 4 recommendations
};

const CHALLENGE_CATEGORIES = {
  'analytical': {
    name: 'Analytical & Problem Solving',
    icon: Calculator,
    colour: 'bg-blue-500',
  },
  'creative': {
    name: 'Creative & Marketing',
    icon: Lightbulb,
    colour: 'bg-purple-500',
  },
  'business': {
    name: 'Business & Finance',
    icon: TrendingUp,
    colour: 'bg-green-500',
  },
  'organizational': {
    name: 'Organization & Planning',
    icon: FileText,
    colour: 'bg-orange-500',
  }
};

export default function PersonalizedChallenges() {
  const [selectedCategory, setSelectedCategory] = useState<string>('recommended');
  
  // Mock user profile - in real app this would come from auth/context
  const userProfile = {
    name: "Demo User",
    behaviouralProfile: {
      primary: "Creative Influencer",
      drive: 75,
      influence: 85,
      steadiness: 70,
      compliance: 60,
      creativity: 85,
      leadership: 65
    }
  };

  const recommendations = getPersonalizedRecommendations(userProfile.behaviouralProfile);
  const recommendedChallenges = recommendations.map(rec => {
    const challenge = ALL_CHALLENGES.find(c => c.id === rec.challengeId);
    return { ...challenge, matchReason: rec.reason };
  });

  const displayedChallenges = selectedCategory === 'recommended' 
    ? recommendedChallenges 
    : selectedCategory === 'all'
    ? ALL_CHALLENGES
    : ALL_CHALLENGES.filter(c => c.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Your Personalized Challenges</h1>
            <p className="text-muted-foreground">
              Based on your behavioural profile and career preferences
            </p>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            <strong>Your Profile:</strong> {userProfile.behaviouralProfile.primary} • 
            We've selected {recommendedChallenges.length} challenges that match your behavioural profile and career interests.
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4 flex-wrap">
          <Button
            variant={selectedCategory === 'recommended' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('recommended')}
          >
            Recommended for You ({recommendedChallenges.length})
          </Button>
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('all')}
          >
            Browse All ({ALL_CHALLENGES.length})
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
            Showing all available challenges. You can complete any challenge to demonstrate your skills.
          </p>
        )}
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedChallenges.map((challenge) => {
          const categoryInfo = CHALLENGE_CATEGORIES[challenge.category];
          const IconComponent = categoryInfo.icon;
          
          return (
            <Card key={challenge.id} className="hover:shadow-lg transition-shadow relative">
              {selectedCategory === 'recommended' && (
                <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full z-10">
                  Recommended
                </div>
              )}
              
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
                
                {selectedCategory === 'recommended' && (
                  <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-700">
                    <strong>Why this matches you:</strong> {challenge.matchReason}
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
                      // For demo purposes, show what would happen
                      const message = `🚀 Starting ${challenge.title}!\n\n` +
                        `⏱️ Time Limit: ${challenge.timeLimit} minutes\n` +
                        `🏆 Points Available: ${challenge.points}\n` +
                        `📝 Skills Tested: ${challenge.skills.join(', ')}\n\n` +
                        `${challenge.detailedDescription}\n\n` +
                        `This would redirect to the full challenge interface with:\n` +
                        `• Live timer\n• File upload capability\n• Detailed scoring rubric\n• Progress tracking`;
                      alert(message);
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

      {displayedChallenges.length === 0 && (
        <div className="text-center py-12">
          <Trophy className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No challenges found</h3>
          <p className="text-muted-foreground">
            Try selecting a different category or check back later for new challenges.
          </p>
        </div>
      )}
    </div>
  );
}