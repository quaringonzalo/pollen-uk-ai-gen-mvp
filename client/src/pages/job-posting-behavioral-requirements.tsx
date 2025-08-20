import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

// Comprehensive behavioural framework for job matching
export const BEHAVIORAL_DIMENSIONS = {
  work_style: {
    name: "Work Style",
    description: "How the person approaches tasks and collaboration",
    traits: [
      { id: "independent", label: "Independent Worker", description: "Prefers working autonomously with minimal supervision" },
      { id: "collaborative", label: "Team Player", description: "Thrives in collaborative environments and group settings" },
      { id: "structured", label: "Structure-Oriented", description: "Works best with clear processes and defined expectations" },
      { id: "flexible", label: "Adaptable", description: "Comfortable with changing priorities and ambiguous situations" }
    ]
  },
  communication: {
    name: "Communication Style",
    description: "How the person exchanges information and ideas",
    traits: [
      { id: "direct", label: "Direct Communicator", description: "Clear, straightforward communication style" },
      { id: "diplomatic", label: "Diplomatic", description: "Tactful and considerate in communication" },
      { id: "analytical", label: "Detail-Oriented", description: "Focuses on facts, data, and thorough explanations" },
      { id: "inspirational", label: "Inspirational", description: "Motivates others through positive, energetic communication" }
    ]
  },
  problem_solving: {
    name: "Problem-Solving Approach",
    description: "How the person tackles challenges and makes decisions",
    traits: [
      { id: "methodical", label: "Methodical", description: "Systematic approach using proven processes" },
      { id: "creative", label: "Creative Thinker", description: "Generates innovative solutions and thinks outside the box" },
      { id: "collaborative_solver", label: "Collaborative Solver", description: "Seeks input and works with others to find solutions" },
      { id: "decisive", label: "Quick Decision Maker", description: "Makes decisions efficiently with available information" }
    ]
  },
  learning_growth: {
    name: "Learning & Growth",
    description: "How the person develops skills and adapts to change",
    traits: [
      { id: "hands_on", label: "Hands-On Learner", description: "Learns best through practice and experimentation" },
      { id: "research_oriented", label: "Research-Oriented", description: "Prefers to study and understand before acting" },
      { id: "feedback_driven", label: "Feedback-Driven", description: "Actively seeks and responds well to feedback" },
      { id: "self_directed", label: "Self-Directed", description: "Takes initiative in personal development" }
    ]
  },
  motivation: {
    name: "Motivation Drivers",
    description: "What energizes and drives the person",
    traits: [
      { id: "achievement", label: "Achievement-Focused", description: "Motivated by personal accomplishments and recognition" },
      { id: "impact", label: "Impact-Driven", description: "Motivated by making a difference and helping others" },
      { id: "growth", label: "Growth-Minded", description: "Motivated by learning and skill development" },
      { id: "stability", label: "Stability-Seeking", description: "Motivated by consistent, predictable environments" }
    ]
  },
  leadership: {
    name: "Leadership Style",
    description: "How the person influences and guides others",
    traits: [
      { id: "directive", label: "Directive Leader", description: "Takes charge and provides clear direction" },
      { id: "supportive", label: "Supportive Leader", description: "Empowers others and provides guidance" },
      { id: "collaborative_leader", label: "Collaborative Leader", description: "Facilitates team decisions and consensus" },
      { id: "lead_by_example", label: "Lead by Example", description: "Influences through actions and modeling behavior" }
    ]
  }
};

interface BehavioralRequirement {
  dimensionId: string;
  traitId: string;
  importance: number; // 1-5 scale
  required: boolean;
}

export default function JobPostingBehavioralRequirements({ onComplete }: { onComplete: (requirements: BehavioralRequirement[]) => void }) {
  const [requirements, setRequirements] = useState<BehavioralRequirement[]>([]);
  const [currentDimension, setCurrentDimension] = useState(Object.keys(BEHAVIORAL_DIMENSIONS)[0]);

  const updateRequirement = (dimensionId: string, traitId: string, importance: number, required: boolean) => {
    setRequirements(prev => {
      const existing = prev.find(r => r.dimensionId === dimensionId && r.traitId === traitId);
      if (existing) {
        return prev.map(r => 
          r.dimensionId === dimensionId && r.traitId === traitId 
            ? { ...r, importance, required }
            : r
        );
      } else {
        return [...prev, { dimensionId, traitId, importance, required }];
      }
    });
  };

  const getRequirement = (dimensionId: string, traitId: string) => {
    return requirements.find(r => r.dimensionId === dimensionId && r.traitId === traitId);
  };

  const selectedRequirements = requirements.filter(r => r.importance > 0);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Define Behavioral Requirements</CardTitle>
          <CardDescription>
            Specify the behavioural traits and work styles that would be most successful in this role.
            This helps us match candidates whose natural working style aligns with your needs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Dimension Navigation */}
            <div className="space-y-2">
              <h3 className="font-medium text-sm text-gray-600">Behavioral Dimensions</h3>
              {Object.entries(BEHAVIORAL_DIMENSIONS).map(([key, dimension]) => (
                <button
                  key={key}
                  onClick={() => setCurrentDimension(key)}
                  className={`w-full text-left p-3 rounded-lg border transition-colours ${
                    currentDimension === key 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-sm">{dimension.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{dimension.description}</div>
                  {requirements.some(r => r.dimensionId === key && r.importance > 0) && (
                    <Badge variant="secondary" className="mt-2 text-xs">
                      {requirements.filter(r => r.dimensionId === key && r.importance > 0).length} selected
                    </Badge>
                  )}
                </button>
              ))}
            </div>

            {/* Trait Selection */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <h3 className="font-medium">{BEHAVIORAL_DIMENSIONS[currentDimension].name}</h3>
                <p className="text-sm text-gray-600">{BEHAVIORAL_DIMENSIONS[currentDimension].description}</p>
              </div>

              {BEHAVIORAL_DIMENSIONS[currentDimension].traits.map((trait) => {
                const requirement = getRequirement(currentDimension, trait.id);
                const importance = requirement?.importance || 0;
                const required = requirement?.required || false;

                return (
                  <Card key={trait.id} className={`p-4 ${importance > 0 ? 'border-blue-200 bg-blue-50' : ''}`}>
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              checked={required}
                              onCheckedChange={(checked) => 
                                updateRequirement(currentDimension, trait.id, Math.max(importance, 1), checked === true)
                              }
                            />
                            <h4 className="font-medium">{trait.label}</h4>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{trait.description}</p>
                        </div>
                      </div>

                      {(importance > 0 || required) && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Importance Level: {importance}/5
                          </label>
                          <Slider
                            value={[importance]}
                            onValueChange={([value]) => 
                              updateRequirement(currentDimension, trait.id, value, required)
                            }
                            max={5}
                            min={1}
                            step={1}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Nice to have</span>
                            <span>Essential</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          {selectedRequirements.length > 0 && (
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-3">Selected Requirements ({selectedRequirements.length})</h3>
              <div className="space-y-2">
                {selectedRequirements.map((req) => {
                  const dimension = BEHAVIORAL_DIMENSIONS[req.dimensionId];
                  const trait = dimension.traits.find(t => t.id === req.traitId);
                  return (
                    <div key={`${req.dimensionId}-${req.traitId}`} className="flex items-center justify-between">
                      <span className="text-sm">
                        <span className="font-medium">{trait?.label}</span>
                        <span className="text-gray-500 ml-2">({dimension.name})</span>
                      </span>
                      <div className="flex items-center space-x-2">
                        {req.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                        <Badge variant="outline" className="text-xs">
                          {req.importance}/5
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={() => window.history.back()}>
              Back
            </Button>
            <Button 
              onClick={() => onComplete(requirements)}
              disabled={selectedRequirements.length === 0}
            >
              Continue with These Requirements
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}