import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Clock, Award, CheckCircle, PlayCircle, FileText, Download } from "lucide-react";

interface Challenge {
  id: number;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  category: string;
  skills: string[];
  instructions: string[];
  resources: Array<{
    type: "document" | "template" | "video";
    title: string;
    url: string;
  }>;
  submissionFormat: string;
  completed?: boolean;
  score?: number;
}

const SAMPLE_CHALLENGES: Challenge[] = [
  {
    id: 1,
    title: "Strategic Media Planning Challenge",
    description: "Develop a comprehensive media strategy for a new product launch targeting Gen Z consumers.",
    difficulty: "Intermediate",
    duration: "3-4 hours",
    category: "Marketing & Strategy",
    skills: ["Strategic Planning", "Media Analysis", "Target Audience Research", "Budget Allocation"],
    instructions: [
      "Analyze the provided brand brief and target audience data",
      "Research media consumption patterns for Gen Z demographic",
      "Create a multi-channel media strategy with rationale",
      "Develop a detailed budget allocation across channels",
      "Present your recommendations in the template provided"
    ],
    resources: [
      {
        type: "document",
        title: "Brand Brief & Market Research",
        url: "/challenges/media-planning/brief.pdf"
      },
      {
        type: "template",
        title: "Media Planning Template",
        url: "/challenges/media-planning/template.xlsx"
      },
      {
        type: "document",
        title: "Gen Z Media Consumption Report",
        url: "/challenges/media-planning/research.pdf"
      }
    ],
    submissionFormat: "Complete the media planning template and submit as Excel file (.xlsx)",
    completed: false
  },
  {
    id: 2,
    title: "P&L Analysis & Business Optimization",
    description: "Analyze a company's financial performance and propose strategic improvements to profitability.",
    difficulty: "Advanced",
    duration: "4-5 hours",
    category: "Finance & Analysis",
    skills: ["Financial Analysis", "P&L Management", "Business Strategy", "Data Interpretation"],
    instructions: [
      "Review the provided P&L statements for the past 3 years",
      "Identify key trends and performance drivers",
      "Conduct variance analysis and benchmark against industry standards",
      "Develop actionable recommendations for improvement",
      "Present findings in a executive summary format"
    ],
    resources: [
      {
        type: "document",
        title: "3-Year P&L Statements",
        url: "/challenges/pl-analysis/financials.xlsx"
      },
      {
        type: "document",
        title: "Industry Benchmark Data",
        url: "/challenges/pl-analysis/benchmarks.pdf"
      },
      {
        type: "template",
        title: "Analysis Template",
        url: "/challenges/pl-analysis/template.pptx"
      }
    ],
    submissionFormat: "Executive presentation (PowerPoint) with key findings and recommendations",
    completed: true,
    score: 87
  },
  {
    id: 3,
    title: "Office Administration Systems Design",
    description: "Design and implement efficient administrative processes for a growing healthcare practice.",
    difficulty: "Intermediate",
    duration: "2-3 hours",
    category: "Operations & Administration",
    skills: ["Process Design", "Systems Thinking", "Documentation", "Quality Assurance"],
    instructions: [
      "Assess current administrative challenges in the case study",
      "Design streamlined processes for patient scheduling and records",
      "Create standard operating procedures (SOPs)",
      "Propose technology solutions and implementation timeline",
      "Develop quality metrics and monitoring systems"
    ],
    resources: [
      {
        type: "document",
        title: "Healthcare Practice Case Study",
        url: "/challenges/admin-systems/case-study.pdf"
      },
      {
        type: "template",
        title: "SOP Template",
        url: "/challenges/admin-systems/sop-template.docx"
      },
      {
        type: "document",
        title: "Best Practices Guide",
        url: "/challenges/admin-systems/best-practices.pdf"
      }
    ],
    submissionFormat: "Process documentation package with SOPs and implementation plan",
    completed: false
  },
  {
    id: 4,
    title: "Social Media Campaign Strategy",
    description: "Create a comprehensive social media campaign for a sustainability-focused brand.",
    difficulty: "Beginner",
    duration: "2-3 hours",
    category: "Digital Marketing",
    skills: ["Content Strategy", "Social Media Marketing", "Brand Voice", "Campaign Planning"],
    instructions: [
      "Define campaign objectives and key performance indicators",
      "Develop content calendar for 4 weeks across 3 platforms",
      "Create sample posts with captions and hashtag strategies",
      "Design engagement and community management approach",
      "Propose budget allocation and success metrics"
    ],
    resources: [
      {
        type: "document",
        title: "Brand Guidelines & Values",
        url: "/challenges/social-media/brand-guide.pdf"
      },
      {
        type: "template",
        title: "Content Calendar Template",
        url: "/challenges/social-media/calendar.xlsx"
      },
      {
        type: "document",
        title: "Platform Best Practices",
        url: "/challenges/social-media/platform-guide.pdf"
      }
    ],
    submissionFormat: "Campaign strategy document with content calendar and sample posts",
    completed: true,
    score: 92
  }
];

interface ChallengeViewerProps {
  onBack?: () => void;
}

export default function ChallengeViewer({ onBack }: ChallengeViewerProps) {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const filteredChallenges = SAMPLE_CHALLENGES.filter(challenge => {
    if (filter === "all") return true;
    if (filter === "completed") return challenge.completed;
    if (filter === "pending") return !challenge.completed;
    return challenge.difficulty.toLowerCase() === filter;
  });

  const startChallenge = (challenge: Challenge) => {
    // In a real implementation, this would start a challenge session
    console.log("Starting challenge:", challenge.title);
  };

  const downloadResource = (resource: any) => {
    // In a real implementation, this would download the resource
    console.log("Downloading resource:", resource.title);
  };

  if (selectedChallenge) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => setSelectedChallenge(null)}>
            ← Back to Challenges
          </Button>
          <div className="flex items-center space-x-2">
            <Badge variant={selectedChallenge.completed ? "default" : "secondary"}>
              {selectedChallenge.completed ? "Completed" : "Not Started"}
            </Badge>
            <Badge variant="outline">{selectedChallenge.difficulty}</Badge>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-2xl">{selectedChallenge.title}</CardTitle>
                <p className="text-muted-foreground">{selectedChallenge.description}</p>
              </div>
              {selectedChallenge.completed && selectedChallenge.score && (
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-600">{selectedChallenge.score}%</div>
                  <div className="text-sm text-muted-foreground">Score</div>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm">{selectedChallenge.duration}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm">{selectedChallenge.category}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm">{selectedChallenge.submissionFormat}</span>
              </div>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="instructions">Instructions</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="submission">Submission</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Skills Assessed</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedChallenge.skills.map((skill) => (
                      <Badge key={skill} variant="outline">{skill}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Challenge Description</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedChallenge.description}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="instructions" className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Step-by-Step Instructions</h4>
                  <ol className="space-y-3">
                    {selectedChallenge.instructions.map((instruction, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                          {index + 1}
                        </div>
                        <span className="text-sm">{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </TabsContent>

              <TabsContent value="resources" className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Challenge Resources</h4>
                  <div className="space-y-2">
                    {selectedChallenge.resources.map((resource, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <div className="text-sm font-medium">{resource.title}</div>
                            <div className="text-xs text-muted-foreground capitalize">{resource.type}</div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => downloadResource(resource)}>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="submission" className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Submission Requirements</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    {selectedChallenge.submissionFormat}
                  </p>
                  
                  {selectedChallenge.completed ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 text-green-700">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">Challenge Completed</span>
                      </div>
                      <p className="text-sm text-green-600 mt-1">
                        You scored {selectedChallenge.score}% on this challenge.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Upload your completed challenge submission
                        </p>
                        <Button className="mt-3" variant="outline">
                          Choose File
                        </Button>
                      </div>
                      <Button className="w-full" onClick={() => startChallenge(selectedChallenge)}>
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Start Challenge
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Skills Challenges</h2>
          <p className="text-muted-foreground">Complete real-world challenges to demonstrate your abilities</p>
        </div>
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            ← Back to Library
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: "all", label: "All Challenges" },
          { id: "pending", label: "Not Started" },
          { id: "completed", label: "Completed" },
          { id: "beginner", label: "Beginner" },
          { id: "intermediate", label: "Intermediate" },
          { id: "advanced", label: "Advanced" },
        ].map((filterOption) => (
          <Button
            key={filterOption.id}
            variant={filter === filterOption.id ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(filterOption.id)}
          >
            {filterOption.label}
          </Button>
        ))}
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredChallenges.map((challenge) => (
          <Card key={challenge.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-lg">{challenge.title}</CardTitle>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {challenge.description}
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <Badge variant={challenge.completed ? "default" : "secondary"}>
                    {challenge.completed ? "Completed" : "Available"}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {challenge.difficulty}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{challenge.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Award className="w-4 h-4" />
                      <span>{challenge.category}</span>
                    </div>
                  </div>
                  {challenge.completed && challenge.score && (
                    <div className="text-green-600 font-medium">
                      {challenge.score}%
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-1">
                  {challenge.skills.slice(0, 3).map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {challenge.skills.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{challenge.skills.length - 3} more
                    </Badge>
                  )}
                </div>

                <Button 
                  className="w-full" 
                  onClick={() => setSelectedChallenge(challenge)}
                  variant={challenge.completed ? "outline" : "default"}
                >
                  {challenge.completed ? "View Results" : "Start Challenge"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}