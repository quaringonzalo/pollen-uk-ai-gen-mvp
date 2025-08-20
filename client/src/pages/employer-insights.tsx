import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLocation } from "wouter";
import { 
  Star, Clock, MessageSquare, Eye, Users, Award, 
  TrendingUp, BarChart3, Target, CheckCircle, Calendar, Zap
} from "lucide-react";

export default function EmployerInsights() {
  const [, setLocation] = useLocation();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{fontFamily: 'Sora'}}>
          Hiring Insights & Performance
        </h1>
        <p className="text-gray-600" style={{fontFamily: 'Poppins'}}>
          Your detailed hiring metrics and candidate feedback
        </p>
      </div>

      {/* Overall Rating Summary */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{fontFamily: 'Sora'}}>
            <Star className="w-5 h-5 text-yellow-600" />
            Overall Employer Rating
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold text-yellow-600">4.8</div>
              <div>
                <div className="flex mb-1">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="w-6 h-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-gray-600">Based on 47 candidate reviews</p>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-800 text-sm px-3 py-1">
              <Award className="w-4 h-4 mr-1" />
              Star Employer
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Communication Speed</span>
                  <span className="text-sm font-bold">4.9</span>
                </div>
                <p className="text-xs text-gray-500 mb-2" style={{fontFamily: 'Poppins'}}>
                  How quickly you respond to applications and scheduling requests
                </p>
                <Progress value={98} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Interview Experience</span>
                  <span className="text-sm font-bold">4.7</span>
                </div>
                <p className="text-xs text-gray-500 mb-2" style={{fontFamily: 'Poppins'}}>
                  Quality of your interview process, preparation, and candidate treatment
                </p>
                <Progress value={94} className="h-2" />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Process Transparency</span>
                  <span className="text-sm font-bold">4.8</span>
                </div>
                <p className="text-xs text-gray-500 mb-2" style={{fontFamily: 'Poppins'}}>
                  How clearly you communicate timelines, next steps, and expectations
                </p>
                <Progress value={96} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Feedback Quality</span>
                  <span className="text-sm font-bold">4.8</span>
                </div>
                <p className="text-xs text-gray-500 mb-2" style={{fontFamily: 'Poppins'}}>
                  Usefulness and professionalism of feedback provided to candidates
                </p>
                <Progress value={96} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Match Score</p>
                <p className="text-2xl font-bold">86%</p>
                <p className="text-sm text-green-600">↑ 3% vs last month</p>
              </div>
              <Target className="w-8 h-8 text-pink-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Response Rate</p>
                <p className="text-2xl font-bold">78%</p>
                <p className="text-sm text-green-600">↑ 5% vs last month</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Time to Hire</p>
                <p className="text-2xl font-bold">14 days</p>
                <p className="text-sm text-green-600">↓ 3 days vs last month</p>
                <p className="text-xs text-gray-500 mt-1" style={{fontFamily: 'Poppins'}}>
                  From shortlist to offer acceptance
                </p>
              </div>
              <Calendar className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hire Success Rate</p>
                <p className="text-2xl font-bold">89%</p>
                <p className="text-sm text-green-600">↑ 4% vs last month</p>
                <p className="text-xs text-gray-500 mt-1" style={{fontFamily: 'Poppins'}}>
                  % hired vs target headcount
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Performance Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{fontFamily: 'Sora'}}>
              <BarChart3 className="w-5 h-5" />
              Time to Complete Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Initial Response to Applications</span>
                  <span className="text-sm font-bold">2.4 hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={85} className="flex-1 h-2" />
                  <Badge variant="outline" className="text-xs">Fast</Badge>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Interview Scheduling</span>
                  <span className="text-sm font-bold">1.2 days</span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={90} className="flex-1 h-2" />
                  <Badge variant="outline" className="text-xs">Excellent</Badge>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Post-Interview Feedback</span>
                  <span className="text-sm font-bold">18 hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={78} className="flex-1 h-2" />
                  <Badge variant="outline" className="text-xs">Good</Badge>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Final Decision Communication</span>
                  <span className="text-sm font-bold">3.1 days</span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={72} className="flex-1 h-2" />
                  <Badge variant="outline" className="text-xs">Average</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{fontFamily: 'Sora'}}>
              <Award className="w-5 h-5" />
              Badges & Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-medium text-yellow-900" style={{fontFamily: 'Sora'}}>Star Employer</h4>
                  <p className="text-sm text-yellow-700" style={{fontFamily: 'Poppins'}}>4.5+ rating with 25+ reviews</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-blue-900" style={{fontFamily: 'Sora'}}>Quick Responder</h4>
                  <p className="text-sm text-blue-700" style={{fontFamily: 'Poppins'}}>Average response time under 4 hours</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-green-900" style={{fontFamily: 'Sora'}}>Inclusive Hiring Partner</h4>
                  <p className="text-sm text-green-700" style={{fontFamily: 'Poppins'}}>Diverse candidate selection practices</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Candidate Reviews */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{fontFamily: 'Sora'}}>
            <MessageSquare className="w-5 h-5" />
            Recent Candidate Reviews
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-green-500">
              <div className="flex items-start gap-3">
                <div className="flex">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700 mb-2" style={{fontFamily: 'Poppins'}}>
                    "Excellent communication throughout the process. The interview was well-structured and the team was very welcoming. Clear feedback was provided promptly."
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>Marketing Assistant applicant</span>
                    <span>•</span>
                    <span>2 days ago</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-green-500">
              <div className="flex items-start gap-3">
                <div className="flex">
                  {[1,2,3,4].map((star) => (
                    <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                  <Star className="w-4 h-4 text-gray-300" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700 mb-2" style={{fontFamily: 'Poppins'}}>
                    "Great company culture and the hiring process was transparent. The only minor issue was a slight delay in final feedback, but overall a positive experience."
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>Junior Developer applicant</span>
                    <span>•</span>
                    <span>1 week ago</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-green-500">
              <div className="flex items-start gap-3">
                <div className="flex">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700 mb-2" style={{fontFamily: 'Poppins'}}>
                    "Professional and respectful throughout. The interview felt more like a conversation, and they took time to answer my questions about career development."
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>Content Marketing applicant</span>
                    <span>•</span>
                    <span>2 weeks ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => setLocation("/employer-messages?filter=feedback")}
              style={{fontFamily: 'Sora'}}
            >
              View All Candidate Feedback
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Improvement Recommendations */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{fontFamily: 'Sora'}}>
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Recommendations for Improvement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium text-blue-900" style={{fontFamily: 'Sora'}}>Reduce Final Decision Time</h4>
                <p className="text-sm text-blue-800" style={{fontFamily: 'Poppins'}}>
                  Your final decision communication takes 3.1 days on average. Consider setting internal deadlines to improve to under 48 hours.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium text-blue-900" style={{fontFamily: 'Sora'}}>Enhance Interview Experience</h4>
                <p className="text-sm text-blue-800" style={{fontFamily: 'Poppins'}}>
                  Consider adding more interactive elements to your interviews and providing clearer role expectations upfront.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}