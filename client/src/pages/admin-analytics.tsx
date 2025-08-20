import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useState } from "react";
import { 
  Users, Building2, TrendingUp, Calendar, ArrowLeft, Brain,
  UserPlus, Briefcase, CheckCircle, BarChart3, Target, Clock, 
  Award, Eye, Filter, PieChart, MapPin, GraduationCap, Heart, 
  Zap, Activity, Layers, Settings, Download, Search, Plus,
  AlertTriangle, Lightbulb, Database, LineChart
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  LineChart as RechartsLineChart, Line, PieChart as RechartsPieChart, Pie, Cell, 
  AreaChart as RechartsAreaChart, Area, ComposedChart, ScatterChart, Scatter
} from 'recharts';

// Platform KPIs interface based on requirements
interface PlatformKPIs {
  totalUsers: number;
  activeUsers30Days: number;
  profileCompletionRate: number;
  applicationSuccessRate: number;
  employerSatisfactionScore: number;
  revenueGrowthRate: number;
  timeToHire: number; // Average days from application to offer
  candidateFeedbackScore: number;
  diversityIndex: number;

}

// Segmentation interface
interface DemographicSegments {
  age: '18-21' | '22-25' | '26-30';
  gender: 'Male' | 'Female' | 'Non-binary' | 'Prefer not to say';
  ethnicity: string;
  location: {
    region: string;
    city: string;
    postcode: string;
  };
  educationLevel: 'School' | 'College' | 'University' | 'Postgraduate' | 'Other';
  workExperience: 'None' | '0-6 months' | '6-12 months' | '1-2 years' | '2+ years';
}



// Career analytics interface
interface CareerInterestAnalytics {
  popularIndustries: {
    industry: string;
    candidateCount: number;
    growthRate: number;
    successRate: number;
  }[];
  rolePreferences: {
    roleType: string;
    demand: number;
    supply: number;
    matchingSuccess: number;
  }[];
  skillGaps: {
    skill: string;
    demandLevel: number;
    candidateSupply: number;
    gap: number;
  }[];
}

const COLORS = ['#E2007A', '#ffde59', '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#84CC16'];

export default function AdminAnalytics() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const [timeFilter, setTimeFilter] = useState("last_month");
  const [segmentFilter, setSegmentFilter] = useState("all");


  // Fetch Platform KPIs
  const { data: platformKPIs } = useQuery<PlatformKPIs>({
    queryKey: ["/api/analytics/platform-kpis", timeFilter],
    initialData: {
      totalUsers: 1247,
      activeUsers30Days: 892,
      profileCompletionRate: 78.5,
      applicationSuccessRate: 64.2,
      employerSatisfactionScore: 4.6,
      revenueGrowthRate: 23.4,
      timeToHire: 14.2,
      candidateFeedbackScore: 4.3,
      diversityIndex: 85.6
    }
  });

  // Fetch segmentation data
  const { data: segmentationData } = useQuery({
    queryKey: ["/api/analytics/segmentation", segmentFilter, timeFilter],
    initialData: {
      demographics: {
        age: [
          { segment: "18-21", count: 324, successRate: 67.2, growthRate: 12.3 },
          { segment: "22-25", count: 589, successRate: 71.8, growthRate: 18.7 },
          { segment: "26-30", count: 334, successRate: 74.1, growthRate: 8.9 }
        ],
        education: [
          { segment: "University", count: 678, successRate: 73.4, growthRate: 15.2 },
          { segment: "College", count: 389, successRate: 68.9, growthRate: 11.7 },
          { segment: "School", count: 180, successRate: 62.3, growthRate: 22.1 }
        ],
        ethnicity: [
          { segment: "White British", count: 512, successRate: 69.8, representation: 41.1 },
          { segment: "Asian", count: 298, successRate: 75.2, representation: 23.9 },
          { segment: "Black", count: 187, successRate: 72.1, representation: 15.0 },
          { segment: "Mixed", count: 134, successRate: 71.6, representation: 10.8 },
          { segment: "Other", count: 116, successRate: 68.4, representation: 9.3 }
        ]
      },
      behavioral: [
        { type: "Supporter", count: 389, successRate: 76.4, hiringPreference: "High" },
        { type: "Achiever", count: 298, successRate: 82.1, hiringPreference: "Very High" },
        { type: "Influencer", count: 267, successRate: 74.8, hiringPreference: "High" },
        { type: "Analyst", count: 184, successRate: 71.2, hiringPreference: "Medium" },
        { type: "Coordinator", count: 109, successRate: 69.1, hiringPreference: "Medium" }
      ]
    }
  });

  // Fetch success prediction data
  const { data: successPrediction } = useQuery({
    queryKey: ["/api/analytics/success-prediction"],
    initialData: {
      shortlistingFactors: [
        { factor: "Behavioral fit score", weight: 0.32, impact: "positive", significance: 94.2 },
        { factor: "Skills challenge performance", weight: 0.28, impact: "positive", significance: 89.7 },
        { factor: "Profile completeness", weight: 0.18, impact: "positive", significance: 76.3 },
        { factor: "Response quality", weight: 0.15, impact: "positive", significance: 71.8 },
        { factor: "Application timing", weight: 0.07, impact: "positive", significance: 42.1 }
      ],
      offerPredictors: [
        { 
          characteristic: "DISC Profile Match", 
          correlation: 0.78,
          demographicVariance: [
            { segment: "22-25 age", correlation: 0.82 },
            { segment: "University educated", correlation: 0.75 },
            { segment: "London region", correlation: 0.71 }
          ]
        },
        { 
          characteristic: "Communication Skills", 
          correlation: 0.71,
          demographicVariance: [
            { segment: "Native English", correlation: 0.76 },
            { segment: "Non-native English", correlation: 0.64 }
          ]
        }
      ]
    }
  });

  // Fetch career insights
  const { data: careerInsights } = useQuery<CareerInterestAnalytics>({
    queryKey: ["/api/analytics/career-insights", timeFilter],
    initialData: {
      popularIndustries: [
        { industry: "Technology", candidateCount: 423, growthRate: 28.4, successRate: 76.2 },
        { industry: "Creative Services", candidateCount: 312, growthRate: 15.7, successRate: 71.8 },
        { industry: "Professional Services", candidateCount: 278, growthRate: 12.3, successRate: 68.9 },
        { industry: "Healthcare", candidateCount: 134, growthRate: 22.1, successRate: 74.6 }
      ],
      rolePreferences: [
        { roleType: "Marketing Assistant", demand: 45, supply: 89, matchingSuccess: 67.4 },
        { roleType: "Data Analyst", demand: 32, supply: 28, matchingSuccess: 92.3 },
        { roleType: "Content Creator", demand: 28, supply: 76, matchingSuccess: 58.9 },
        { roleType: "Project Coordinator", demand: 19, supply: 34, matchingSuccess: 74.2 }
      ],
      skillGaps: [
        { skill: "Data Analysis", demandLevel: 8.7, candidateSupply: 3.2, gap: 5.5 },
        { skill: "Digital Marketing", demandLevel: 7.9, candidateSupply: 6.8, gap: 1.1 },
        { skill: "Project Management", demandLevel: 6.4, candidateSupply: 2.1, gap: 4.3 },
        { skill: "Content Writing", demandLevel: 5.8, candidateSupply: 8.9, gap: -3.1 }
      ]
    }
  });

  // Bias detection data
  const biasDetectionData = [
    { category: "Age Bias", score: 94.2, trend: "improving", flaggedCases: 3 },
    { category: "Gender Bias", score: 89.7, trend: "stable", flaggedCases: 7 },
    { category: "Ethnicity Bias", score: 91.8, trend: "improving", flaggedCases: 4 },
    { category: "Education Bias", score: 87.3, trend: "declining", flaggedCases: 12 },
    { category: "Location Bias", score: 92.5, trend: "stable", flaggedCases: 2 }
  ];

  // Predictive model performance
  const modelPerformance = [
    { model: "Shortlisting Predictor", accuracy: 84.7, precision: 79.2, recall: 86.1 },
    { model: "Offer Predictor", accuracy: 78.3, precision: 82.4, recall: 74.6 },
    { model: "Churn Predictor", accuracy: 91.2, precision: 87.8, recall: 93.4 },
    { model: "Engagement Predictor", accuracy: 76.9, precision: 73.1, recall: 81.2 }
  ];

  const renderKPICard = (title: string, value: string | number, change: number, icon: any, format: string = "") => (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
          {icon}
          <span className="ml-2">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-baseline justify-between">
          <div className="text-2xl font-bold text-gray-900">
            {typeof value === 'number' ? value.toLocaleString() : value}{format}
          </div>
          <Badge className={`${change >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {change >= 0 ? '+' : ''}{change}%
          </Badge>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setLocation("/admin")}
                className="flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Dashboard
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <BarChart3 className="h-6 w-6 mr-2" />
                Advanced Analytics
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last_week">Last Week</SelectItem>
                  <SelectItem value="last_month">Last Month</SelectItem>
                  <SelectItem value="last_quarter">Last Quarter</SelectItem>
                  <SelectItem value="last_year">Last Year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Platform Overview</TabsTrigger>
            <TabsTrigger value="segmentation">Advanced Segmentation</TabsTrigger>
            <TabsTrigger value="prediction">Predictive Analytics</TabsTrigger>
            <TabsTrigger value="career">Career Insights</TabsTrigger>
            <TabsTrigger value="bias">Bias Detection</TabsTrigger>
            <TabsTrigger value="builder">Custom Analytics</TabsTrigger>
          </TabsList>

          {/* Platform Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Platform KPIs */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Platform KPIs</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {renderKPICard("Total Users", platformKPIs?.totalUsers || 0, 12.3, <Users className="h-4 w-4" />)}
                {renderKPICard("30-Day Active", platformKPIs?.activeUsers30Days || 0, 8.7, <Activity className="h-4 w-4" />)}
                {renderKPICard("Profile Completion", platformKPIs?.profileCompletionRate || 0, 5.2, <CheckCircle className="h-4 w-4" />, "%")}
                {renderKPICard("Application Success", platformKPIs?.applicationSuccessRate || 0, 3.8, <Target className="h-4 w-4" />, "%")}
                {renderKPICard("Employer Satisfaction", platformKPIs?.employerSatisfactionScore || 0, 2.1, <Heart className="h-4 w-4" />, "/5")}
                {renderKPICard("Revenue Growth", platformKPIs?.revenueGrowthRate || 0, 15.6, <TrendingUp className="h-4 w-4" />, "%")}
                {renderKPICard("Time to Hire", platformKPIs?.timeToHire || 0, -6.3, <Clock className="h-4 w-4" />, " days")}
                {renderKPICard("Diversity Index", platformKPIs?.diversityIndex || 0, 4.2, <Users className="h-4 w-4" />, "%")}
              </div>
            </div>

            {/* Growth Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LineChart className="h-5 w-5 mr-2" />
                  Growth Trends & Engagement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={[
                    { month: "Aug", registrations: 89, applications: 156, hires: 23, engagement: 76.2 },
                    { month: "Sep", registrations: 112, applications: 198, hires: 31, engagement: 78.9 },
                    { month: "Oct", registrations: 134, applications: 267, hires: 42, engagement: 81.3 },
                    { month: "Nov", registrations: 156, applications: 312, hires: 48, engagement: 79.7 },
                    { month: "Dec", registrations: 178, applications: 389, hires: 56, engagement: 82.1 },
                    { month: "Jan", registrations: 203, applications: 445, hires: 67, engagement: 84.6 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="registrations" fill="#E2007A" name="New Registrations" />
                    <Bar yAxisId="left" dataKey="applications" fill="#ffde59" name="Applications" />
                    <Bar yAxisId="left" dataKey="hires" fill="#10B981" name="Successful Hires" />
                    <Line yAxisId="right" type="monotone" dataKey="engagement" stroke="#8B5CF6" strokeWidth={3} name="Engagement %" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Segmentation Tab */}
          <TabsContent value="segmentation" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Advanced Segmentation Analysis</h3>
              <div className="flex items-center space-x-3">
                <Select value={segmentFilter} onValueChange={setSegmentFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Segments</SelectItem>
                    <SelectItem value="age">Age Groups</SelectItem>
                    <SelectItem value="education">Education Level</SelectItem>
                    <SelectItem value="ethnicity">Ethnicity</SelectItem>
                    <SelectItem value="behavioral">Behavioral Types</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Create Segment
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Demographic Segmentation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Demographic Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={segmentationData?.demographics.age}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="segment" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="successRate" fill="#E2007A" name="Success Rate %" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Behavioral Segmentation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="h-5 w-5 mr-2" />
                    Behavioral Profile Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={segmentationData?.behavioral}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ type, count }) => `${type}: ${count}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {segmentationData?.behavioral.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Ethnicity Representation */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Diversity & Representation Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {segmentationData?.demographics.ethnicity.map((item, index) => (
                      <div key={item.segment} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="font-medium">{item.segment}</span>
                        </div>
                        <div className="flex items-center space-x-6 text-sm">
                          <span>{item.count} candidates</span>
                          <span>{item.representation}% representation</span>
                          <Badge className={`${item.successRate > 70 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {item.successRate}% success
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Predictive Analytics Tab */}
          <TabsContent value="prediction" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Predictive Analytics & Success Patterns</h3>
              <Select value="shortlisting" onValueChange={() => {}}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shortlisting">Shortlisting Factors</SelectItem>
                  <SelectItem value="offers">Offer Predictors</SelectItem>
                  <SelectItem value="engagement">Engagement Prediction</SelectItem>
                  <SelectItem value="churn">Churn Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Success Factors */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Shortlisting Success Factors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {successPrediction?.shortlistingFactors.map((factor: any, index: number) => (
                      <div key={factor.factor} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{factor.factor}</span>
                          <Badge className="bg-blue-100 text-blue-800">
                            {(factor.weight * 100).toFixed(0)}% weight
                          </Badge>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-pink-500 to-yellow-400 h-2 rounded-full" 
                            style={{ width: `${factor.significance}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-600">
                          {factor.significance}% significance
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Model Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="h-5 w-5 mr-2" />
                    ML Model Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {modelPerformance.map((model) => (
                      <div key={model.model} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{model.model}</span>
                          <Badge className={`${model.accuracy > 80 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {model.accuracy}% accuracy
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>Precision: {model.precision}%</div>
                          <div>Recall: {model.recall}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Correlation Analysis */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="h-5 w-5 mr-2" />
                    Offer Prediction Correlations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={successPrediction?.offerPredictors}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="characteristic" />
                      <YAxis domain={[0, 1]} tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                      <Tooltip formatter={(value) => [`${(Number(value) * 100).toFixed(1)}%`, 'Correlation']} />
                      <Bar dataKey="correlation" fill="#8B5CF6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Career Insights Tab */}
          <TabsContent value="career" className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Career Insights & Industry Trends</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Popular Industries */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building2 className="h-5 w-5 mr-2" />
                    Industry Demand & Growth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={careerInsights?.popularIndustries}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="industry" angle={-45} textAnchor="end" height={80} />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Bar yAxisId="left" dataKey="candidateCount" fill="#E2007A" name="Candidates" />
                      <Line yAxisId="right" type="monotone" dataKey="growthRate" stroke="#10B981" strokeWidth={2} name="Growth %" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Skill Gaps */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <GraduationCap className="h-5 w-5 mr-2" />
                    Skills Gap Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {careerInsights?.skillGaps.map((skill) => (
                      <div key={skill.skill} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{skill.skill}</span>
                          <Badge className={`${skill.gap > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                            Gap: {skill.gap > 0 ? '+' : ''}{skill.gap.toFixed(1)}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="space-y-1">
                            <div className="text-gray-600">Demand</div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-red-500 h-2 rounded-full" 
                                style={{ width: `${(skill.demandLevel / 10) * 100}%` }}
                              />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-gray-600">Supply</div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ width: `${(skill.candidateSupply / 10) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Supply vs Demand */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Layers className="h-5 w-5 mr-2" />
                    Role Supply vs Demand Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ScatterChart data={careerInsights?.rolePreferences}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" dataKey="demand" name="Demand" />
                      <YAxis type="number" dataKey="supply" name="Supply" />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                      <Scatter name="Roles" dataKey="matchingSuccess" fill="#8B5CF6" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Bias Detection Tab */}
          <TabsContent value="bias" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Bias Detection & Fairness Metrics</h3>
              <div className="flex items-center space-x-2">
                <div className="text-sm text-gray-600">Overall Bias Score:</div>
                <Badge className="bg-green-100 text-green-800 text-lg px-3 py-1">
                  91.2%
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bias Detection Categories */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Bias Detection by Category
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {biasDetectionData.map((item) => (
                      <div key={item.category} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="space-y-1">
                          <div className="font-medium">{item.category}</div>
                          <div className="text-sm text-gray-600">{item.flaggedCases} flagged cases</div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge className={`${item.score > 90 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {item.score}%
                          </Badge>
                          <Badge variant="outline" className={`${
                            item.trend === 'improving' ? 'text-green-600' : 
                            item.trend === 'declining' ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {item.trend}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Fairness Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lightbulb className="h-5 w-5 mr-2" />
                    AI Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="font-medium text-yellow-800">Education Bias Alert</div>
                      <div className="text-sm text-yellow-700 mt-1">
                        University graduates have 15% higher success rates. Consider reviewing job requirements.
                      </div>
                    </div>
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="font-medium text-green-800">Age Diversity Improving</div>
                      <div className="text-sm text-green-700 mt-1">
                        Balanced representation across age groups with fair outcomes.
                      </div>
                    </div>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="font-medium text-blue-800">Suggestion</div>
                      <div className="text-sm text-blue-700 mt-1">
                        Implement skills-based assessment weighting to reduce education bias.
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Custom Analytics Builder Tab */}
          <TabsContent value="builder" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Custom Analytics Builder</h3>
              <Button className="bg-pink-600 hover:bg-pink-700">
                <Plus className="h-4 w-4 mr-1" />
                Create New Report
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Report Builder */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Report Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Data Source</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select data source" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="candidates">Candidates</SelectItem>
                            <SelectItem value="employers">Employers</SelectItem>
                            <SelectItem value="applications">Applications</SelectItem>
                            <SelectItem value="assessments">Assessments</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Time Range</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select time range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="7d">Last 7 days</SelectItem>
                            <SelectItem value="30d">Last 30 days</SelectItem>
                            <SelectItem value="90d">Last 90 days</SelectItem>
                            <SelectItem value="1y">Last year</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Metrics</label>
                      <div className="mt-2 space-y-2">
                        {[
                          "Profile completion rate",
                          "Application success rate", 
                          "Assessment scores",
                          "Time to hire",
                          "Employer satisfaction",
                          "Diversity metrics"
                        ].map((metric) => (
                          <label key={metric} className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span className="text-sm">{metric}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Segmentation</label>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {["Age", "Gender", "Ethnicity", "Education", "Location", "DISC Type"].map((segment) => (
                          <label key={segment} className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span className="text-sm">{segment}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Saved Reports */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="h-5 w-5 mr-2" />
                    Saved Reports
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: "Weekly Diversity Report", updated: "2h ago" },
                      { name: "Skills Gap Analysis", updated: "1d ago" },
                      { name: "Employer Success Metrics", updated: "3d ago" },
                      { name: "Bias Detection Summary", updated: "1w ago" }
                    ].map((report) => (
                      <div key={report.name} className="flex items-center justify-between p-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <div>
                          <div className="font-medium text-sm">{report.name}</div>
                          <div className="text-xs text-gray-600">Updated {report.updated}</div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}