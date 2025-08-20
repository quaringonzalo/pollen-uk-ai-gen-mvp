import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InteractiveSkillRadar from "@/components/interactive-skill-radar";
import EnhancedAssessmentBank from "@/components/enhanced-assessment-bank";
import { motion } from "framer-motion";
import { 
  Radar, 
  TrendingUp, 
  Target, 
  Award,
  Brain,
  Zap,
  BookOpen,
  Users,
  BarChart3
} from "lucide-react";

export default function SkillRadarPage() {
  const [activeTab, setActiveTab] = useState("radar");

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold mb-2">Your Skill Universe</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Visualize, analyse, and grow your professional capabilities
        </p>
        
        {/* Quick Stats Bar */}
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Radar className="h-4 w-4 text-blue-600" />
            <span>6 Skill Categories</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-green-600" />
            <span>12 Verified Skills</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-purple-600" />
            <span>6 Trending Skills</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-orange-600" />
            <span>15 Assessments Completed</span>
          </div>
        </div>
      </motion.div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="radar" className="flex items-center gap-2">
            <Radar className="h-4 w-4" />
            Skill Radar
          </TabsTrigger>
          <TabsTrigger value="assessments" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Assessments
          </TabsTrigger>
          <TabsTrigger value="development" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Development
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="radar" className="space-y-6">
          <InteractiveSkillRadar 
            showControls={true}
            animateOnLoad={true}
            interactive={true}
          />
        </TabsContent>

        <TabsContent value="assessments" className="space-y-6">
          <EnhancedAssessmentBank />
        </TabsContent>

        <TabsContent value="development" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Skill Development Plan */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Personalized Development Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Improve Data Analysis</h4>
                      <p className="text-sm text-muted-foreground">Current: 75% → Target: 85%</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">3 weeks</Badge>
                      <Button size="sm">Start</Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Learn Python Advanced</h4>
                      <p className="text-sm text-muted-foreground">Current: 65% → Target: 80%</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">5 weeks</Badge>
                      <Button size="sm">Start</Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Presentation Skills</h4>
                      <p className="text-sm text-muted-foreground">Current: 70% → Target: 85%</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">4 weeks</Badge>
                      <Button size="sm">Start</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Learning Resources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Recommended Learning
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">Advanced JavaScript Patterns</h4>
                      <Badge className="bg-blue-100 text-blue-600">Course</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Learn advanced JavaScript design patterns and best practices
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">4.8 ⭐ • 12h</span>
                      <Button size="sm" variant="outline">View</Button>
                    </div>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">Data Visualization Masterclass</h4>
                      <Badge className="bg-green-100 text-green-600">Workshop</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Create compelling data visualizations and dashboards
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">4.9 ⭐ • 8h</span>
                      <Button size="sm" variant="outline">View</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Market Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Market Trends
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">JavaScript</span>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      <span className="text-sm text-green-600">+15%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Data Analysis</span>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      <span className="text-sm text-green-600">+22%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">AI/ML</span>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      <span className="text-sm text-green-600">+35%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skill Gaps */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Opportunity Gaps
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg border-orange-200 bg-orange-50">
                    <h4 className="font-medium text-orange-800">Cloud Computing</h4>
                    <p className="text-sm text-orange-600">High demand, low supply</p>
                  </div>
                  <div className="p-3 border rounded-lg border-blue-200 bg-blue-50">
                    <h4 className="font-medium text-blue-800">Machine Learning</h4>
                    <p className="text-sm text-blue-600">Growing market need</p>
                  </div>
                  <div className="p-3 border rounded-lg border-purple-200 bg-purple-50">
                    <h4 className="font-medium text-purple-800">Cybersecurity</h4>
                    <p className="text-sm text-purple-600">Critical skill shortage</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Career Matching */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Career Fit Score
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Frontend Developer</span>
                    <Badge className="bg-green-100 text-green-600">92%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Data Analyst</span>
                    <Badge className="bg-blue-100 text-blue-600">85%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Product Manager</span>
                    <Badge className="bg-yellow-100 text-yellow-600">78%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">UX Designer</span>
                    <Badge className="bg-purple-100 text-purple-600">72%</Badge>
                  </div>
                </div>
                
                <Button className="w-full mt-4">
                  <Zap className="h-4 w-4 mr-2" />
                  Find Matching Jobs
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}