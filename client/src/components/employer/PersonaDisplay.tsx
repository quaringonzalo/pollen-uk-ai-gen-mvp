import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface PersonaData {
  id: string;
  name: string;
  description: string;
  roleType: string;
  discProfile: {
    red: number;
    yellow: number;
    green: number;
    blue: number;
  };
  keyTraits: PersonaTrait[];
  mindset: PersonaMindset;
  skillsMatch: string[];
  redFlags: string[];
  roleAlignmentScore: number;
  generatedAt: Date;
}

interface PersonaTrait {
  title: string;
  description: string;
  sourceCheckpoint: string;
  icon: string;
  colour: string;
}

interface PersonaMindset {
  thrivesOn: string;
  motivatedBy: string;
  approach: string;
  growthStyle: string;
}

interface PersonaDisplayProps {
  persona: PersonaData;
  onRefineProfile: () => void;
  onReviewChallenge: () => void;
  checkpointSummary: string;
}

export function PersonaDisplay({ persona, onRefineProfile, onReviewChallenge, checkpointSummary }: PersonaDisplayProps) {
  const getTraitColorClass = (colour: string) => {
    const colourMap: { [key: string]: string } = {
      "#f59e0b": "bg-yellow-100 border-yellow-500 text-yellow-800",
      "#3b82f6": "bg-blue-100 border-blue-500 text-blue-800", 
      "#16a34a": "bg-green-100 border-green-500 text-green-800",
      "#ef4444": "bg-red-100 border-red-500 text-red-800"
    };
    return colourMap[colour] || "bg-gray-100 border-gray-500 text-gray-800";
  };

  const getDiscColor = (dimension: string) => {
    const colours = {
      red: "#ef4444",
      yellow: "#eab308", 
      green: "#22c55e",
      blue: "#3b82f6"
    };
    return colours[dimension as keyof typeof colours];
  };

  const getDiscLabel = (dimension: string) => {
    const labels = {
      red: "Dominance",
      yellow: "Influence",
      green: "Steadiness", 
      blue: "Conscientiousness"
    };
    return labels[dimension as keyof typeof labels];
  };

  const getDiscDescription = (dimension: string, percentage: number) => {
    const descriptions = {
      red: percentage > 30 ? "Strong leadership tendencies" : "Collaborative team player",
      yellow: percentage > 30 ? "Natural communication skills" : "Thoughtful communicator",
      green: percentage > 30 ? "Builds reliable client relationships" : "Adaptable and flexible",
      blue: percentage > 30 ? "Quality-focused approach" : "Balanced attention to detail"
    };
    return descriptions[dimension as keyof typeof descriptions];
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="bg-slate-50">
          <CardTitle className="text-2xl">Your Ideal Candidate Profile</CardTitle>
        </CardHeader>
      </Card>

      {/* Hero Section */}
      <Card>
        <CardContent className="p-8">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-6">
              {/* Avatar */}
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-2xl text-white">
                👤
              </div>
              
              {/* Identity */}
              <div className="space-y-3">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{persona.name}</h2>
                  <p className="text-lg text-slate-600">{persona.roleType}</p>
                </div>
                
                {/* Description */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-2xl">
                  <p className="text-yellow-800 font-medium">"{persona.description}"</p>
                </div>
              </div>
            </div>

            {/* Alignment Score */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center min-w-[180px]">
              <p className="text-sm font-semibold text-green-700">Role Alignment Score</p>
              <p className="text-3xl font-bold text-green-700">{persona.roleAlignmentScore}%</p>
              <p className="text-xs text-green-600">Based on your 6 checkpoints</p>
            </div>
          </div>

          {/* Context */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-sm text-slate-600">{checkpointSummary}</p>
          </div>
        </CardContent>
      </Card>

      {/* Key Traits */}
      <Card>
        <CardHeader>
          <CardTitle>Key Strengths for This Role</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {persona.keyTraits.map((trait, index) => (
              <div key={index} className={`rounded-lg border p-4 ${getTraitColorClass(trait.colour)}`}>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-current bg-opacity-20 flex items-center justify-center text-lg">
                    {trait.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold">{trait.title}</h3>
                    <p className="text-sm mt-1 opacity-90">{trait.description}</p>
                    <p className="text-xs mt-2 font-medium opacity-75">{trait.sourceCheckpoint}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* DISC Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Behavioral Profile Match</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* DISC Radar Chart Placeholder */}
            <div className="relative">
              <div className="w-64 h-64 mx-auto relative">
                {/* Radar Chart Background */}
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <circle cx="100" cy="100" r="80" fill="none" stroke="#e2e8f0" strokeWidth="2"/>
                  <circle cx="100" cy="100" r="60" fill="none" stroke="#e2e8f0" strokeWidth="1"/>
                  <circle cx="100" cy="100" r="40" fill="none" stroke="#e2e8f0" strokeWidth="1"/>
                  <circle cx="100" cy="100" r="20" fill="none" stroke="#e2e8f0" strokeWidth="1"/>
                  
                  {/* Axis lines */}
                  <line x1="100" y1="20" x2="100" y2="180" stroke="#e2e8f0" strokeWidth="1"/>
                  <line x1="20" y1="100" x2="180" y2="100" stroke="#e2e8f0" strokeWidth="1"/>
                  
                  {/* DISC Labels */}
                  <text x="100" y="15" textAnchor="middle" className="text-xs font-semibold fill-red-600">D</text>
                  <text x="185" y="105" textAnchor="middle" className="text-xs font-semibold fill-yellow-600">I</text>
                  <text x="100" y="195" textAnchor="middle" className="text-xs font-semibold fill-green-600">S</text>
                  <text x="15" y="105" textAnchor="middle" className="text-xs font-semibold fill-blue-600">C</text>
                  
                  {/* Plot points */}
                  <circle cx="100" cy={100 - (persona.discProfile.red * 0.8)} r="3" fill="#ef4444"/>
                  <circle cx={100 + (persona.discProfile.yellow * 0.8)} cy="100" r="3" fill="#eab308"/>
                  <circle cx="100" cy={100 + (persona.discProfile.green * 0.8)} r="3" fill="#22c55e"/>
                  <circle cx={100 - (persona.discProfile.blue * 0.8)} cy="100" r="3" fill="#3b82f6"/>
                  
                  {/* Connecting polygon */}
                  <polygon 
                    points={`100,${100 - (persona.discProfile.red * 0.8)} ${100 + (persona.discProfile.yellow * 0.8)},100 100,${100 + (persona.discProfile.green * 0.8)} ${100 - (persona.discProfile.blue * 0.8)},100`}
                    fill="rgba(59, 130, 246, 0.1)" 
                    stroke="#3b82f6" 
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>

            {/* DISC Explanations */}
            <div className="space-y-3">
              <h3 className="font-semibold text-slate-900">Perfect Behavioral Match:</h3>
              {Object.entries(persona.discProfile).map(([dimension, percentage]) => (
                <div key={dimension} className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getDiscColor(dimension) }}
                  />
                  <span className="text-sm">
                    <span style={{ colour: getDiscColor(dimension) }} className="font-medium">
                      {percentage}% {getDiscLabel(dimension)}
                    </span>
                    {" - "}
                    <span className="text-slate-600">
                      {getDiscDescription(dimension, percentage)}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mindset */}
      <Card>
        <CardHeader>
          <CardTitle>{persona.name} Mindset</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <span className="text-lg">✨ </span>
                <span className="font-semibold">Thrives on:</span>
                <span className="ml-2 text-slate-700">{persona.mindset.thrivesOn}</span>
              </div>
              <div>
                <span className="text-lg">🎯 </span>
                <span className="font-semibold">Motivated by:</span>
                <span className="ml-2 text-slate-700">{persona.mindset.motivatedBy}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <span className="text-lg">💡 </span>
                <span className="font-semibold">Approach:</span>
                <span className="ml-2 text-slate-700">"{persona.mindset.approach}"</span>
              </div>
              <div>
                <span className="text-lg">🌱 </span>
                <span className="font-semibold">Growth style:</span>
                <span className="ml-2 text-slate-700">{persona.mindset.growthStyle}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills & Red Flags */}
      <Card>
        <CardHeader>
          <CardTitle>Essential Skills & Red Flags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Skills */}
            <div className="flex flex-wrap gap-2">
              {persona.skillsMatch.map((skill, index) => (
                <Badge key={index} variant="outline" className="bg-green-50 border-green-200 text-green-800">
                  {skill} ✓
                </Badge>
              ))}
            </div>
            
            {/* Red Flags */}
            {persona.redFlags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {persona.redFlags.map((flag, index) => (
                  <Badge key={index} variant="outline" className="bg-red-50 border-red-200 text-red-800">
                    Avoid: {flag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onRefineProfile} className="flex items-center space-x-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Refine Profile</span>
        </Button>
        
        <Button onClick={onReviewChallenge} className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700">
          <span>Review "{persona.name}" Challenge</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}