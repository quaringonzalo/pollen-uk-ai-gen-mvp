import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, Lightbulb, TrendingUp, FileText, ArrowRight, Clock, Trophy } from "lucide-react";

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

const SAMPLE_CHALLENGES = [
  {
    id: 'media-planning',
    title: 'Media Planning Challenge',
    category: 'creative',
    difficulty: 'intermediate',
    timeLimit: 45,
    points: 150,
    description: 'Plan an advertising campaign for an animal rescue charity with a £10,000 budget',
    skills: ['media-planning', 'budget-management', 'audience-targeting', 'strategic-thinking']
  },
  {
    id: 'communication-challenge',
    title: 'Client Communication Challenge',
    category: 'creative',
    difficulty: 'intermediate',
    timeLimit: 35,
    points: 130,
    description: 'Handle a difficult client communication scenario with professionalism and clarity',
    skills: ['written-communication', 'problem-solving', 'client-management', 'empathy']
  },
  {
    id: 'pl-analysis',
    title: 'P&L Financial Analysis',
    category: 'business',
    difficulty: 'advanced',
    timeLimit: 60,
    points: 200,
    description: 'Create a comprehensive P&L statement and provide business insights',
    skills: ['financial-analysis', 'spreadsheet-skills', 'business-insight', 'critical-thinking']
  }
];

export default function SkillsChallengesFixed() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredChallenges = selectedCategory === 'all' 
    ? SAMPLE_CHALLENGES 
    : SAMPLE_CHALLENGES.filter(c => c.category === selectedCategory);

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
                    onClick={() => {
                      alert(`Starting ${challenge.title} - This will be connected to the full challenge system.`);
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
          <h3 className="text-lg font-semibold mb-2">No challenges found</h3>
          <p className="text-muted-foreground">
            Try selecting a different category or check back later for new challenges.
          </p>
        </div>
      )}
    </div>
  );
}