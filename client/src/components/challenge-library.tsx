import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code, Database, PaintbrushVertical, Clock, Signal, Trophy } from "lucide-react";

export default function ChallengeLibrary() {
  const { data: challenges, isLoading } = useQuery({
    queryKey: ["/api/challenges/active"],
  });

  // Mock data for demo
  const mockChallenges = [
    {
      id: 1,
      title: "React Component Challenge",
      description: "Build a responsive product card component with interactive features.",
      difficulty: "intermediate",
      estimatedTime: "2-3 hours",
      skills: ["React", "CSS", "JavaScript"],
      status: "available",
      icon: Code,
      colour: "primary",
    },
    {
      id: 2,
      title: "API Design Challenge",
      description: "Design and implement a RESTful API for a task management system.",
      difficulty: "advanced",
      estimatedTime: "4-5 hours",
      skills: ["Node.js", "Express", "MongoDB"],
      status: "completed",
      score: 92,
      icon: Database,
      colour: "yellow",
    },
    {
      id: 3,
      title: "UX Design Challenge",
      description: "Create a user-friendly mobile app interface for a fitness tracking app.",
      difficulty: "intermediate",
      estimatedTime: "3-4 hours",
      skills: ["Figma", "UX Research", "Prototyping"],
      status: "locked",
      icon: PaintbrushVertical,
      colour: "purple",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Prove Your Skills</h2>
        <p className="text-lg text-gray-600">Complete real-world challenges to unlock opportunities with top employers.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockChallenges.map((challenge) => {
          const IconComponent = challenge.icon;
          return (
            <Card key={challenge.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      challenge.colour === "primary" ? "bg-primary/10" :
                      challenge.colour === "yellow" ? "bg-yellow-100" :
                      "bg-purple-100"
                    }`}>
                      <IconComponent className={`w-5 h-5 ${
                        challenge.colour === "primary" ? "text-primary" :
                        challenge.colour === "yellow" ? "text-yellow-500" :
                        "text-purple-500"
                      }`} />
                    </div>
                  </div>
                  <Badge variant={
                    challenge.status === "available" ? "secondary" :
                    challenge.status === "completed" ? "default" :
                    "outline"
                  } className={
                    challenge.status === "available" ? "bg-green-100 text-green-700" :
                    challenge.status === "completed" ? "bg-green-100 text-green-700" :
                    "bg-gray-100 text-gray-500"
                  }>
                    {challenge.status === "available" ? "Available" :
                     challenge.status === "completed" ? "Completed" :
                     "Locked"}
                  </Badge>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{challenge.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{challenge.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {challenge.estimatedTime}
                  </span>
                  <span className="flex items-center">
                    <Signal className="w-4 h-4 mr-1" />
                    {challenge.difficulty}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {challenge.skills.map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
                
                {challenge.status === "completed" && challenge.score ? (
                  <div className="w-full bg-green-50 border border-green-200 text-green-700 py-2 rounded-lg text-center font-medium">
                    <Trophy className="w-4 h-4 inline mr-2" />
                    Score: {challenge.score}/100
                  </div>
                ) : challenge.status === "available" ? (
                  <Button className="w-full">
                    Start Challenge
                  </Button>
                ) : (
                  <Button className="w-full" disabled variant="secondary">
                    Complete React Challenge First
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
