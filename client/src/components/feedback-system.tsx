import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { 
  MessageSquare, Star, ThumbsUp, ThumbsDown, Send, 
  Clock, CheckCircle, AlertCircle, User, Building2,
  TrendingUp, BarChart3, Target, Award, Eye, Reply
} from "lucide-react";

interface FeedbackItem {
  id: number;
  type: 'interview' | 'application' | 'assessment' | 'general';
  fromUserId: number;
  fromUserName: string;
  fromUserType: 'job_seeker' | 'employer';
  toUserId: number;
  toUserName: string;
  toUserType: 'job_seeker' | 'employer';
  subject: string;
  content: string;
  rating?: number;
  status: 'pending' | 'delivered' | 'read' | 'responded';
  createdAt: Date;
  jobId?: number;
  jobTitle?: string;
  anonymous: boolean;
  categories: string[];
  helpful: number;
  notHelpful: number;
}

interface FeedbackTemplate {
  id: string;
  name: string;
  type: 'interview' | 'application' | 'assessment';
  subject: string;
  content: string;
  categories: string[];
}

interface FeedbackSystemProps {
  userId: number;
  userType: 'job_seeker' | 'employer' | 'admin';
}

export default function FeedbackSystem({ userId, userType }: FeedbackSystemProps) {
  const { toast } = useToast();
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [feedbackFilter, setFeedbackFilter] = useState('all');

  // Mock feedback data
  const mockFeedback: FeedbackItem[] = [
    {
      id: 1,
      type: 'interview',
      fromUserId: userType === 'job_seeker' ? 201 : 101,
      fromUserName: userType === 'job_seeker' ? "TechCorp HR" : "Sarah Johnson",
      fromUserType: userType === 'job_seeker' ? 'employer' : 'job_seeker',
      toUserId: userId,
      toUserName: "You",
      toUserType: userType,
      subject: "Interview Feedback - Marketing Assistant Position",
      content: "Thank you for taking the time to interview with us. Your presentation of your portfolio was impressive and showed great creativity. We were particularly impressed by your campaign strategy examples. Areas for improvement include developing more analytical skills and gaining experience with data interpretation. We encourage you to apply for similar positions as you continue to develop these skills.",
      rating: 4,
      status: 'delivered',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      jobId: 1,
      jobTitle: "Marketing Assistant",
      anonymous: false,
      categories: ['interview_performance', 'technical_skills', 'communication'],
      helpful: 12,
      notHelpful: 1
    },
    {
      id: 2,
      type: 'assessment',
      fromUserId: userType === 'job_seeker' ? 202 : 102,
      fromUserName: userType === 'job_seeker' ? "DataTech Ltd" : "Michael Chen",
      fromUserType: userType === 'job_seeker' ? 'employer' : 'job_seeker',
      toUserId: userId,
      toUserName: "You",
      toUserType: userType,
      subject: "Skills Assessment Results & Recommendations",
      content: "Your performance on the data analysis assessment was solid overall. You demonstrated good understanding of Excel functions and basic statistical concepts. To strengthen your profile, we recommend focusing on advanced Excel features like pivot tables and learning basic SQL queries. Consider taking an online course in data visualization tools like Tableau or Power BI.",
      rating: 3,
      status: 'read',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      jobId: 2,
      jobTitle: "Data Analyst Trainee",
      anonymous: true,
      categories: ['skills_assessment', 'technical_feedback', 'career_advice'],
      helpful: 8,
      notHelpful: 2
    },
    {
      id: 3,
      type: 'application',
      fromUserId: userType === 'job_seeker' ? 203 : 103,
      fromUserName: userType === 'job_seeker' ? "StartupX" : "Emily Rodriguez",
      fromUserType: userType === 'job_seeker' ? 'employer' : 'job_seeker',
      toUserId: userId,
      toUserName: "You",
      toUserType: userType,
      subject: "Application Review Feedback",
      content: "Thank you for your interest in our Customer Support role. Your application showed enthusiasm and relevant customer service experience from retail. While we decided to proceed with other candidates for this specific role, we encourage you to apply for future openings. To strengthen future applications, consider highlighting specific examples of problem-solving and any experience with helpdesk software or CRM systems.",
      status: 'pending',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      jobId: 3,
      jobTitle: "Customer Support Representative",
      anonymous: false,
      categories: ['application_review', 'experience_feedback', 'future_opportunities'],
      helpful: 5,
      notHelpful: 0
    }
  ];

  const feedbackTemplates: FeedbackTemplate[] = [
    {
      id: 'interview_positive',
      name: 'Positive Interview Feedback',
      type: 'interview',
      subject: 'Interview Feedback - [Job Title]',
      content: 'Thank you for interviewing for the [Job Title] position. We were impressed by [specific strengths]. Your [specific examples] demonstrated excellent [skills]. We encourage you to continue developing [areas for growth] and look forward to potentially working together in the future.',
      categories: ['interview_performance', 'strengths', 'encouragement']
    },
    {
      id: 'assessment_constructive',
      name: 'Assessment Development Feedback',
      type: 'assessment',
      subject: 'Skills Assessment Results & Development Recommendations',
      content: 'Your performance on the [assessment type] showed [positive aspects]. To further develop your skills, we recommend focusing on [specific areas]. Consider [specific resources or courses]. Your [strength areas] are already strong foundations to build upon.',
      categories: ['skills_assessment', 'development_recommendations', 'resources']
    },
    {
      id: 'application_encouragement',
      name: 'Application Encouragement',
      type: 'application',
      subject: 'Application Review & Future Opportunities',
      content: 'Thank you for your application for [Job Title]. While we proceeded with other candidates this time, we were impressed by [specific positives]. To strengthen future applications, consider [specific advice]. We encourage you to apply for similar roles as you continue developing your career.',
      categories: ['application_review', 'encouragement', 'career_advice']
    }
  ];

  const sendFeedbackMutation = useMutation({
    mutationFn: async (feedbackData: Partial<FeedbackItem>) => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return { id: Math.floor(Math.random() * 1000) + 100 };
    },
    onSuccess: () => {
      toast({
        title: "Feedback Sent",
        description: "Your feedback has been delivered successfully."
      });
      setShowCompose(false);
    }
  });

  const markHelpfulMutation = useMutation({
    mutationFn: async ({ feedbackId, helpful }: { feedbackId: number; helpful: boolean }) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Thank you",
        description: "Your feedback rating has been recorded."
      });
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'delivered': return 'bg-blue-100 text-blue-800';
      case 'read': return 'bg-green-100 text-green-800';
      case 'responded': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'interview': return 'bg-blue-100 text-blue-800';
      case 'assessment': return 'bg-purple-100 text-purple-800';
      case 'application': return 'bg-green-100 text-green-800';
      case 'general': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredFeedback = mockFeedback.filter(feedback => {
    if (feedbackFilter === 'all') return true;
    if (feedbackFilter === 'received') return feedback.toUserId === userId;
    if (feedbackFilter === 'sent') return feedback.fromUserId === userId;
    return feedback.type === feedbackFilter;
  });

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Feedback Center</h1>
          <p className="text-gray-600">Send and receive constructive feedback to improve your career journey</p>
        </div>
        <Button onClick={() => setShowCompose(true)}>
          <Send className="w-4 h-4 mr-2" />
          Send Feedback
        </Button>
      </div>

      <Tabs defaultValue="inbox" className="space-y-6">
        <TabsList>
          <TabsTrigger value="inbox">Feedback Inbox</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Feedback Inbox */}
        <TabsContent value="inbox" className="space-y-6">
          <div className="flex gap-4 mb-6">
            <Select value={feedbackFilter} onValueChange={setFeedbackFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter feedback" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Feedback</SelectItem>
                <SelectItem value="received">Received</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
                <SelectItem value="assessment">Assessment</SelectItem>
                <SelectItem value="application">Application</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Feedback List */}
            <div className="lg:col-span-1 space-y-3">
              {filteredFeedback.map((feedback) => (
                <Card
                  key={feedback.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedFeedback?.id === feedback.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedFeedback(feedback)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge className={getTypeColor(feedback.type)}>
                          {feedback.type}
                        </Badge>
                        <Badge className={getStatusColor(feedback.status)}>
                          {feedback.status}
                        </Badge>
                      </div>
                      <span className="text-xs text-gray-500">
                        {feedback.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                    
                    <h3 className="font-medium text-sm mb-1 line-clamp-2">{feedback.subject}</h3>
                    <p className="text-xs text-gray-600 mb-2">
                      From: {feedback.fromUserName} {feedback.anonymous && "(Anonymous)"}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      {feedback.rating && renderStars(feedback.rating)}
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <ThumbsUp className="w-3 h-3" />
                        {feedback.helpful}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Feedback Detail */}
            <div className="lg:col-span-2">
              {selectedFeedback ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{selectedFeedback.subject}</CardTitle>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User className="w-4 h-4" />
                            {selectedFeedback.fromUserName}
                            {selectedFeedback.anonymous && " (Anonymous)"}
                          </div>
                          {selectedFeedback.jobTitle && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Building2 className="w-4 h-4" />
                              {selectedFeedback.jobTitle}
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            {selectedFeedback.createdAt.toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getTypeColor(selectedFeedback.type)}>
                          {selectedFeedback.type}
                        </Badge>
                        <Badge className={getStatusColor(selectedFeedback.status)}>
                          {selectedFeedback.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedFeedback.rating && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Rating:</span>
                        {renderStars(selectedFeedback.rating)}
                        <span className="text-sm text-gray-600">({selectedFeedback.rating}/5)</span>
                      </div>
                    )}

                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-wrap">{selectedFeedback.content}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {selectedFeedback.categories.map((category) => (
                        <Badge key={category} variant="secondary" className="text-xs">
                          {category.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">Was this feedback helpful?</span>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => markHelpfulMutation.mutate({
                              feedbackId: selectedFeedback.id,
                              helpful: true
                            })}
                          >
                            <ThumbsUp className="w-4 h-4 mr-1" />
                            {selectedFeedback.helpful}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => markHelpfulMutation.mutate({
                              feedbackId: selectedFeedback.id,
                              helpful: false
                            })}
                          >
                            <ThumbsDown className="w-4 h-4 mr-1" />
                            {selectedFeedback.notHelpful}
                          </Button>
                        </div>
                      </div>
                      <Button size="sm">
                        <Reply className="w-4 h-4 mr-2" />
                        Reply
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Select a feedback item to view details</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Feedback</p>
                    <p className="text-2xl font-bold">{mockFeedback.length}</p>
                  </div>
                  <MessageSquare className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg Rating</p>
                    <p className="text-2xl font-bold">
                      {(mockFeedback.filter(f => f.rating).reduce((sum, f) => sum + (f.rating || 0), 0) / 
                        mockFeedback.filter(f => f.rating).length || 0).toFixed(1)}
                    </p>
                  </div>
                  <Star className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Helpful Rate</p>
                    <p className="text-2xl font-bold">89%</p>
                  </div>
                  <ThumbsUp className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Response Rate</p>
                    <p className="text-2xl font-bold">76%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Feedback Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['interview_performance', 'technical_skills', 'communication', 'career_advice', 'application_review'].map((category) => (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{category.replace('_', ' ')}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div 
                            className="h-2 bg-blue-500 rounded-full" 
                            style={{ width: `${Math.random() * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{Math.floor(Math.random() * 20) + 1}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-green-900">Improved Response Time</span>
                    </div>
                    <p className="text-sm text-green-800">
                      Average feedback response time decreased by 32% this month
                    </p>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Star className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-blue-900">Higher Quality Ratings</span>
                    </div>
                    <p className="text-sm text-blue-800">
                      Overall feedback quality ratings increased to 4.2/5
                    </p>
                  </div>

                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="w-4 h-4 text-purple-600" />
                      <span className="font-medium text-purple-900">More Actionable Feedback</span>
                    </div>
                    <p className="text-sm text-purple-800">
                      85% of feedback now includes specific recommendations
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Templates */}
        <TabsContent value="templates" className="space-y-6">
          <div className="space-y-4">
            {feedbackTemplates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <Badge className={getTypeColor(template.type)}>
                        {template.type}
                      </Badge>
                    </div>
                    <Button size="sm" onClick={() => {
                      setShowCompose(true);
                      // In real app, would populate compose form with template
                    }}>
                      Use Template
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-sm">Subject:</span>
                      <p className="text-sm text-gray-600">{template.subject}</p>
                    </div>
                    <div>
                      <span className="font-medium text-sm">Content:</span>
                      <p className="text-sm text-gray-600 whitespace-pre-wrap">{template.content}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {template.categories.map((category) => (
                        <Badge key={category} variant="secondary" className="text-xs">
                          {category.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Settings */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Feedback Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-4">Notification Settings</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <span className="font-medium">Email notifications for new feedback</span>
                      <p className="text-sm text-gray-500">Receive emails when someone sends you feedback</p>
                    </div>
                    <input type="checkbox" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <span className="font-medium">Weekly feedback summary</span>
                      <p className="text-sm text-gray-500">Get a weekly digest of all your feedback</p>
                    </div>
                    <input type="checkbox" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <span className="font-medium">Anonymous feedback</span>
                      <p className="text-sm text-gray-500">Allow others to send you anonymous feedback</p>
                    </div>
                    <input type="checkbox" defaultChecked />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Privacy Settings</h3>
                <div className="space-y-3">
                  <div>
                    <Label>Who can send you feedback?</Label>
                    <RadioGroup defaultValue="interviewed" className="mt-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="anyone" id="anyone" />
                        <label htmlFor="anyone" className="text-sm">Anyone on the platform</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="interviewed" id="interviewed" />
                        <label htmlFor="interviewed" className="text-sm">Only employers I've interviewed with</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="applied" id="applied" />
                        <label htmlFor="applied" className="text-sm">Only employers I've applied to</label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>

              <Button className="w-full">
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Compose Feedback Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Send Feedback</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Feedback Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="interview">Interview Feedback</SelectItem>
                      <SelectItem value="assessment">Assessment Feedback</SelectItem>
                      <SelectItem value="application">Application Feedback</SelectItem>
                      <SelectItem value="general">General Feedback</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Recipient</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipient" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="candidate1">Sarah Johnson</SelectItem>
                      <SelectItem value="candidate2">Michael Chen</SelectItem>
                      <SelectItem value="employer1">TechCorp Ltd</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Subject</Label>
                <Input placeholder="Feedback subject" />
              </div>

              <div>
                <Label>Overall Rating (Optional)</Label>
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-6 h-6 text-gray-300 hover:text-yellow-400 cursor-pointer"
                    />
                  ))}
                </div>
              </div>

              <div>
                <Label>Feedback Content</Label>
                <Textarea
                  placeholder="Provide specific, constructive feedback..."
                  className="min-h-[120px]"
                />
              </div>

              <div>
                <Label>Categories</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {['Interview Performance', 'Technical Skills', 'Communication', 'Problem Solving', 'Teamwork', 'Career Advice'].map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <input type="checkbox" />
                      <label className="text-sm">{category}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input type="checkbox" />
                <label className="text-sm">Send anonymously</label>
              </div>

              <div className="flex gap-2">
                <Button 
                  className="flex-1"
                  onClick={() => sendFeedbackMutation.mutate({})}
                  disabled={sendFeedbackMutation.isPending}
                >
                  {sendFeedbackMutation.isPending ? "Sending..." : "Send Feedback"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowCompose(false)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}