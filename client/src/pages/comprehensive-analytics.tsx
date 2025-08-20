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
  Zap, Activity, Download, Search, Plus, UserCheck, Star
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  LineChart as RechartsLineChart, Line, PieChart as RechartsPieChart, Pie, Cell, 
  AreaChart as RechartsAreaChart, Area
} from 'recharts';

// Job Seeker Analytics Interface
interface JobSeekerAnalytics {
  signupMetrics: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    trend: 'increasing' | 'stable' | 'decreasing';
    weeklyData: { week: string; signups: number }[];
  };
  demographics: {
    ageGroups: { range: string; count: number; percentage: number }[];
    genderDistribution: { gender: string; count: number; percentage: number }[];
    ethnicityBreakdown: { ethnicity: string; count: number; percentage: number }[];
    locationDistribution: { location: string; count: number; percentage: number }[];
    educationLevels: { level: string; count: number; percentage: number }[];
    socioeconomicData: { bracket: string; count: number; percentage: number }[];
  };
  jobSearchProfile: {
    searchDuration: { duration: string; count: number; percentage: number }[];
    industryInterests: { industry: string; count: number; percentage: number }[];
    rolePreferences: { role: string; count: number; percentage: number }[];
    salaryExpectations: { range: string; count: number; percentage: number }[];
    workPreferences: { type: string; count: number; percentage: number }[];
  };
}

// Diversity Impact Analytics
interface DiversityAnalytics {
  shortlistingRates: {
    overall: { applied: number; shortlisted: number; rate: number };
    byEthnicity: { group: string; applied: number; shortlisted: number; rate: number }[];
    byGender: { group: string; applied: number; shortlisted: number; rate: number }[];
    byAge: { group: string; applied: number; shortlisted: number; rate: number }[];
    byEducation: { group: string; applied: number; shortlisted: number; rate: number }[];
    bySocioeconomic: { group: string; applied: number; shortlisted: number; rate: number }[];
  };
  hiringOutcomes: {
    overall: { shortlisted: number; hired: number; rate: number };
    byEthnicity: { group: string; shortlisted: number; hired: number; rate: number }[];
    byGender: { group: string; shortlisted: number; hired: number; rate: number }[];
    byAge: { group: string; shortlisted: number; hired: number; rate: number }[];
    byEducation: { group: string; shortlisted: number; hired: number; rate: number }[];
    bySocioeconomic: { group: string; shortlisted: number; hired: number; rate: number }[];
  };
  diversityTrends: {
    month: string;
    diversityScore: number;
    representationImprovement: number;
    equityIndex: number;
  }[];
  platformImpact: {
    diversityImprovement: number;
    representationGains: { group: string; improvement: number }[];
    equityMetrics: { metric: string; score: number; change: number }[];
  };
}

// Individual Applicant Stats
interface ApplicantDetail {
  id: number;
  name: string;
  joinDate: string;
  profileCompleteness: number;
  applicationsSubmitted: number;
  shortlistsReceived: number;
  interviewsCompleted: number;
  offersReceived: number;
  averageSkillsScore: number;
  behavioralType: string;
  platformEngagement: {
    totalSessions: number;
    averageSessionDuration: number;
    lastActiveDate: string;
    assessmentsCompleted: number;
  };
  progressMetrics: {
    skillsImprovement: number;
    engagementTrend: 'increasing' | 'stable' | 'decreasing';
    successRate: number;
  };
}

// Employer Analytics
interface EmployerAnalytics {
  companies: {
    id: number;
    name: string;
    jobsPosted: number;
    applicationsReceived: number;
    candidatesShortlisted: number;
    candidatesHired: number;
    processMetrics: {
      averageTimeToShortlist: number;
      averageTimeToHire: number;
      feedbackResponseTime: number;
      feedbackCompletionRate: number;
    };
    diversityMetrics: {
      shortlistDiversityScore: number;
      hiringDiversityScore: number;
      diversityTrend: 'improving' | 'stable' | 'declining';
      representationGaps: { group: string; gap: number }[];
    };
    candidateSatisfaction: number;
  }[];
  aggregateMetrics: {
    averageTimeToShortlist: number;
    averageTimeToHire: number;
    averageFeedbackTime: number;
    diversityImprovementRate: number;
  };
}

const COLORS = ['#E2007A', '#ffde59', '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#84CC16'];

export default function ComprehensiveAnalytics() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("job-seekers");
  const [timeFilter, setTimeFilter] = useState("last_month");
  const [demographicFilter, setDemographicFilter] = useState("all");
  const [selectedApplicant, setSelectedApplicant] = useState<number | null>(null);

  // Job Seeker Analytics Data
  const { data: jobSeekerData } = useQuery<JobSeekerAnalytics>({
    queryKey: ["/api/analytics/job-seekers", timeFilter, demographicFilter],
    initialData: {
      signupMetrics: {
        today: 23,
        thisWeek: 156,
        thisMonth: 687,
        trend: 'increasing',
        weeklyData: [
          { week: 'Week 1', signups: 134 },
          { week: 'Week 2', signups: 156 },
          { week: 'Week 3', signups: 178 },
          { week: 'Week 4', signups: 219 },
        ]
      },
      demographics: {
        ageGroups: [
          { range: '18-21', count: 324, percentage: 26.0 },
          { range: '22-25', count: 456, percentage: 36.5 },
          { range: '26-30', count: 298, percentage: 23.9 },
          { range: '31+', count: 169, percentage: 13.6 },
        ],
        genderDistribution: [
          { gender: 'Female', count: 634, percentage: 50.8 },
          { gender: 'Male', count: 567, percentage: 45.4 },
          { gender: 'Non-binary', count: 32, percentage: 2.6 },
          { gender: 'Prefer not to say', count: 14, percentage: 1.2 },
        ],
        ethnicityBreakdown: [
          { ethnicity: 'White British', count: 423, percentage: 33.9 },
          { ethnicity: 'Asian/Asian British', count: 298, percentage: 23.9 },
          { ethnicity: 'Black/Black British', count: 189, percentage: 15.2 },
          { ethnicity: 'Mixed/Multiple', count: 156, percentage: 12.5 },
          { ethnicity: 'Other', count: 181, percentage: 14.5 },
        ],
        locationDistribution: [
          { location: 'London', count: 423, percentage: 33.9 },
          { location: 'Manchester', count: 189, percentage: 15.2 },
          { location: 'Birmingham', count: 156, percentage: 12.5 },
          { location: 'Leeds', count: 134, percentage: 10.7 },
          { location: 'Other', count: 345, percentage: 27.7 },
        ],
        educationLevels: [
          { level: 'University Degree', count: 567, percentage: 45.4 },
          { level: 'College/A-Levels', count: 298, percentage: 23.9 },
          { level: 'Postgraduate', count: 189, percentage: 15.2 },
          { level: 'School/GCSEs', count: 134, percentage: 10.7 },
          { level: 'Other', count: 59, percentage: 4.8 },
        ],
        socioeconomicData: [
          { bracket: 'Lower income', count: 298, percentage: 23.9 },
          { bracket: 'Middle income', count: 634, percentage: 50.8 },
          { bracket: 'Higher income', count: 189, percentage: 15.2 },
          { bracket: 'Prefer not to say', count: 126, percentage: 10.1 },
        ]
      },
      jobSearchProfile: {
        searchDuration: [
          { duration: 'Less than 1 month', count: 234, percentage: 18.8 },
          { duration: '1-3 months', count: 423, percentage: 33.9 },
          { duration: '3-6 months', count: 298, percentage: 23.9 },
          { duration: '6-12 months', count: 189, percentage: 15.2 },
          { duration: 'Over 12 months', count: 103, percentage: 8.2 },
        ],
        industryInterests: [
          { industry: 'Technology', count: 423, percentage: 33.9 },
          { industry: 'Marketing', count: 298, percentage: 23.9 },
          { industry: 'Finance', count: 189, percentage: 15.2 },
          { industry: 'Healthcare', count: 156, percentage: 12.5 },
          { industry: 'Other', count: 181, percentage: 14.5 },
        ],
        rolePreferences: [
          { role: 'Entry Level', count: 567, percentage: 45.4 },
          { role: 'Junior', count: 298, percentage: 23.9 },
          { role: 'Mid-Level', count: 189, percentage: 15.2 },
          { role: 'Senior', count: 103, percentage: 8.3 },
          { role: 'Management', count: 90, percentage: 7.2 },
        ],
        salaryExpectations: [
          { range: '£18-25k', count: 423, percentage: 33.9 },
          { range: '£25-35k', count: 298, percentage: 23.9 },
          { range: '£35-45k', count: 189, percentage: 15.2 },
          { range: '£45k+', count: 137, percentage: 11.0 },
          { range: 'Not specified', count: 200, percentage: 16.0 },
        ],
        workPreferences: [
          { type: 'Hybrid', count: 567, percentage: 45.4 },
          { type: 'Remote', count: 298, percentage: 23.9 },
          { type: 'Office-based', count: 234, percentage: 18.8 },
          { type: 'Flexible', count: 148, percentage: 11.9 },
        ]
      }
    }
  });

  // Diversity Analytics Data
  const { data: diversityData } = useQuery<DiversityAnalytics>({
    queryKey: ["/api/analytics/diversity", timeFilter],
    initialData: {
      shortlistingRates: {
        overall: { applied: 2847, shortlisted: 1423, rate: 50.0 },
        byEthnicity: [
          { group: 'White British', applied: 965, shortlisted: 523, rate: 54.2 },
          { group: 'Asian/Asian British', applied: 681, shortlisted: 347, rate: 50.9 },
          { group: 'Black/Black British', applied: 432, shortlisted: 198, rate: 45.8 },
          { group: 'Mixed/Multiple', applied: 356, shortlisted: 167, rate: 46.9 },
          { group: 'Other', applied: 413, shortlisted: 188, rate: 45.5 },
        ],
        byGender: [
          { group: 'Female', applied: 1445, shortlisted: 734, rate: 50.8 },
          { group: 'Male', applied: 1294, shortlisted: 634, rate: 49.0 },
          { group: 'Non-binary', applied: 73, shortlisted: 38, rate: 52.1 },
          { group: 'Prefer not to say', applied: 35, shortlisted: 17, rate: 48.6 },
        ],
        byAge: [
          { group: '18-21', applied: 739, shortlisted: 345, rate: 46.7 },
          { group: '22-25', applied: 1040, shortlisted: 534, rate: 51.3 },
          { group: '26-30', applied: 680, shortlisted: 356, rate: 52.4 },
          { group: '31+', applied: 388, shortlisted: 188, rate: 48.5 },
        ],
        byEducation: [
          { group: 'University Degree', applied: 1294, shortlisted: 678, rate: 52.4 },
          { group: 'College/A-Levels', applied: 680, shortlisted: 324, rate: 47.6 },
          { group: 'Postgraduate', applied: 432, shortlisted: 234, rate: 54.2 },
          { group: 'School/GCSEs', applied: 306, shortlisted: 134, rate: 43.8 },
          { group: 'Other', applied: 135, shortlisted: 53, rate: 39.3 },
        ],
        bySocioeconomic: [
          { group: 'Lower income', applied: 680, shortlisted: 298, rate: 43.8 },
          { group: 'Middle income', applied: 1445, shortlisted: 756, rate: 52.3 },
          { group: 'Higher income', applied: 432, shortlisted: 234, rate: 54.2 },
          { group: 'Prefer not to say', applied: 290, shortlisted: 135, rate: 46.6 },
        ]
      },
      hiringOutcomes: {
        overall: { shortlisted: 1423, hired: 287, rate: 20.2 },
        byEthnicity: [
          { group: 'White British', shortlisted: 523, hired: 118, rate: 22.6 },
          { group: 'Asian/Asian British', shortlisted: 347, hired: 67, rate: 19.3 },
          { group: 'Black/Black British', shortlisted: 198, hired: 34, rate: 17.2 },
          { group: 'Mixed/Multiple', shortlisted: 167, hired: 32, rate: 19.2 },
          { group: 'Other', shortlisted: 188, hired: 36, rate: 19.1 },
        ],
        byGender: [
          { group: 'Female', shortlisted: 734, hired: 152, rate: 20.7 },
          { group: 'Male', shortlisted: 634, hired: 124, rate: 19.6 },
          { group: 'Non-binary', shortlisted: 38, hired: 8, rate: 21.1 },
          { group: 'Prefer not to say', shortlisted: 17, hired: 3, rate: 17.6 },
        ],
        byAge: [
          { group: '18-21', shortlisted: 345, hired: 62, rate: 18.0 },
          { group: '22-25', shortlisted: 534, hired: 112, rate: 21.0 },
          { group: '26-30', shortlisted: 356, hired: 78, rate: 21.9 },
          { group: '31+', shortlisted: 188, hired: 35, rate: 18.6 },
        ],
        byEducation: [
          { group: 'University Degree', shortlisted: 678, hired: 145, rate: 21.4 },
          { group: 'College/A-Levels', shortlisted: 324, hired: 58, rate: 17.9 },
          { group: 'Postgraduate', shortlisted: 234, hired: 53, rate: 22.6 },
          { group: 'School/GCSEs', shortlisted: 134, hired: 23, rate: 17.2 },
          { group: 'Other', shortlisted: 53, hired: 8, rate: 15.1 },
        ],
        bySocioeconomic: [
          { group: 'Lower income', shortlisted: 298, hired: 48, rate: 16.1 },
          { group: 'Middle income', shortlisted: 756, hired: 162, rate: 21.4 },
          { group: 'Higher income', shortlisted: 234, hired: 53, rate: 22.6 },
          { group: 'Prefer not to say', shortlisted: 135, hired: 24, rate: 17.8 },
        ]
      },
      diversityTrends: [
        { month: 'Jan', diversityScore: 72.3, representationImprovement: 2.1, equityIndex: 68.5 },
        { month: 'Feb', diversityScore: 74.1, representationImprovement: 2.5, equityIndex: 70.2 },
        { month: 'Mar', diversityScore: 76.8, representationImprovement: 3.6, equityIndex: 73.1 },
        { month: 'Apr', diversityScore: 78.2, representationImprovement: 1.8, equityIndex: 74.9 },
        { month: 'May', diversityScore: 80.1, representationImprovement: 2.4, equityIndex: 76.8 },
        { month: 'Jun', diversityScore: 82.3, representationImprovement: 2.7, equityIndex: 79.2 },
      ],
      platformImpact: {
        diversityImprovement: 15.7,
        representationGains: [
          { group: 'Black/Black British', improvement: 18.3 },
          { group: 'Asian/Asian British', improvement: 12.7 },
          { group: 'Mixed/Multiple', improvement: 14.2 },
          { group: 'Lower income', improvement: 22.1 },
          { group: 'Female', improvement: 8.9 },
        ],
        equityMetrics: [
          { metric: 'Equal shortlisting opportunity', score: 87.3, change: 5.2 },
          { metric: 'Representation in hiring', score: 82.1, change: 7.8 },
          { metric: 'Skills-based selection', score: 91.4, change: 12.3 },
          { metric: 'Bias reduction', score: 88.7, change: 15.6 },
        ]
      }
    }
  });

  // Individual Applicant Stats
  const { data: applicantStats } = useQuery<ApplicantDetail[]>({
    queryKey: ["/api/analytics/applicants", timeFilter],
    initialData: [
      {
        id: 1,
        name: "Sarah Chen",
        joinDate: "2024-01-15",
        profileCompleteness: 95,
        applicationsSubmitted: 12,
        shortlistsReceived: 6,
        interviewsCompleted: 3,
        offersReceived: 1,
        averageSkillsScore: 87.3,
        behavioralType: "Social Butterfly",
        platformEngagement: {
          totalSessions: 34,
          averageSessionDuration: 23.5,
          lastActiveDate: "2024-06-20",
          assessmentsCompleted: 8,
        },
        progressMetrics: {
          skillsImprovement: 18.7,
          engagementTrend: 'increasing',
          successRate: 50.0,
        }
      },
      {
        id: 2,
        name: "Marcus Johnson",
        joinDate: "2024-02-03",
        profileCompleteness: 88,
        applicationsSubmitted: 8,
        shortlistsReceived: 4,
        interviewsCompleted: 2,
        offersReceived: 1,
        averageSkillsScore: 82.1,
        behavioralType: "Strategic Achiever",
        platformEngagement: {
          totalSessions: 28,
          averageSessionDuration: 19.2,
          lastActiveDate: "2024-06-18",
          assessmentsCompleted: 6,
        },
        progressMetrics: {
          skillsImprovement: 22.3,
          engagementTrend: 'stable',
          successRate: 50.0,
        }
      },
    ]
  });

  // Employer Analytics Data
  const { data: employerData } = useQuery<EmployerAnalytics>({
    queryKey: ["/api/analytics/employers", timeFilter],
    initialData: {
      companies: [
        {
          id: 1,
          name: "TechCorp Ltd",
          jobsPosted: 15,
          applicationsReceived: 234,
          candidatesShortlisted: 45,
          candidatesHired: 8,
          processMetrics: {
            averageTimeToShortlist: 5.2,
            averageTimeToHire: 18.7,
            feedbackResponseTime: 2.3,
            feedbackCompletionRate: 92.5,
          },
          diversityMetrics: {
            shortlistDiversityScore: 84.2,
            hiringDiversityScore: 78.9,
            diversityTrend: 'improving',
            representationGaps: [
              { group: 'Black/Black British', gap: -12.3 },
              { group: 'Lower income', gap: -8.7 },
            ]
          },
          candidateSatisfaction: 4.6,
        },
        {
          id: 2,
          name: "Creative Agency",
          jobsPosted: 8,
          applicationsReceived: 156,
          candidatesShortlisted: 28,
          candidatesHired: 5,
          processMetrics: {
            averageTimeToShortlist: 7.1,
            averageTimeToHire: 22.3,
            feedbackResponseTime: 4.7,
            feedbackCompletionRate: 76.2,
          },
          diversityMetrics: {
            shortlistDiversityScore: 91.7,
            hiringDiversityScore: 85.3,
            diversityTrend: 'stable',
            representationGaps: [
              { group: 'Male', gap: -5.4 },
            ]
          },
          candidateSatisfaction: 4.3,
        },
      ],
      aggregateMetrics: {
        averageTimeToShortlist: 6.2,
        averageTimeToHire: 20.5,
        averageFeedbackTime: 3.5,
        diversityImprovementRate: 12.8,
      }
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => setLocation('/admin')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Platform Analytics</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Comprehensive insights into diversity, engagement, and outcomes
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
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
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Analytics Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl">
            <TabsTrigger value="job-seekers">Job Seekers</TabsTrigger>
            <TabsTrigger value="diversity">Diversity Impact</TabsTrigger>
            <TabsTrigger value="applicants">Individual Stats</TabsTrigger>
            <TabsTrigger value="employers">Employers</TabsTrigger>
          </TabsList>

          {/* Job Seekers Analytics */}
          <TabsContent value="job-seekers" className="space-y-6">
            {/* Signup Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">New Signups Today</CardTitle>
                  <UserPlus className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{jobSeekerData?.signupMetrics.today}</div>
                  <Badge variant={jobSeekerData?.signupMetrics.trend === 'increasing' ? 'default' : 'secondary'}>
                    {jobSeekerData?.signupMetrics.trend}
                  </Badge>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">This Week</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{jobSeekerData?.signupMetrics.thisWeek}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">This Month</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{jobSeekerData?.signupMetrics.thisMonth}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Growth Trend</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={60}>
                    <RechartsLineChart data={jobSeekerData?.signupMetrics.weeklyData}>
                      <Line type="monotone" dataKey="signups" stroke="#E2007A" strokeWidth={2} dot={false} />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Demographics Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Age Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <RechartsPieChart>
                      <Pie
                        data={jobSeekerData?.demographics.ageGroups}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        label={({ range, percentage }) => `${range}: ${percentage}%`}
                      >
                        {jobSeekerData?.demographics.ageGroups.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Gender Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={jobSeekerData?.demographics.genderDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="gender" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#E2007A" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Location Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {jobSeekerData?.demographics.locationDistribution.map((location, index) => (
                      <div key={location.location} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{location.location}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-pink-500 to-yellow-400 h-2 rounded-full"
                              style={{ width: `${location.percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">{location.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Education Levels
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={jobSeekerData?.demographics.educationLevels}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="level" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#ffde59" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Job Search Profile */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Job Search Profile Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Search Duration</h4>
                    <div className="space-y-2">
                      {jobSeekerData?.jobSearchProfile.searchDuration.map((item) => (
                        <div key={item.duration} className="flex justify-between text-sm">
                          <span>{item.duration}</span>
                          <span className="font-medium">{item.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Industry Interests</h4>
                    <div className="space-y-2">
                      {jobSeekerData?.jobSearchProfile.industryInterests.map((item) => (
                        <div key={item.industry} className="flex justify-between text-sm">
                          <span>{item.industry}</span>
                          <span className="font-medium">{item.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Role Preferences</h4>
                    <div className="space-y-2">
                      {jobSeekerData?.jobSearchProfile.rolePreferences.map((item) => (
                        <div key={item.role} className="flex justify-between text-sm">
                          <span>{item.role}</span>
                          <span className="font-medium">{item.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Salary Expectations</h4>
                    <div className="space-y-2">
                      {jobSeekerData?.jobSearchProfile.salaryExpectations.map((item) => (
                        <div key={item.range} className="flex justify-between text-sm">
                          <span>{item.range}</span>
                          <span className="font-medium">{item.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Diversity Impact Analytics */}
          <TabsContent value="diversity" className="space-y-6">
            {/* Key Diversity Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Diversity Improvement</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    +{diversityData?.platformImpact.diversityImprovement}%
                  </div>
                  <p className="text-xs text-muted-foreground">Since platform launch</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Overall Shortlisting Rate</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{diversityData?.shortlistingRates.overall.rate}%</div>
                  <p className="text-xs text-muted-foreground">
                    {diversityData?.shortlistingRates.overall.shortlisted} of {diversityData?.shortlistingRates.overall.applied} applications
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Overall Hiring Rate</CardTitle>
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{diversityData?.hiringOutcomes.overall.rate}%</div>
                  <p className="text-xs text-muted-foreground">
                    {diversityData?.hiringOutcomes.overall.hired} of {diversityData?.hiringOutcomes.overall.shortlisted} shortlisted
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Diversity Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Diversity & Equity Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLineChart data={diversityData?.diversityTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="diversityScore" stroke="#E2007A" strokeWidth={2} name="Diversity Score" />
                    <Line type="monotone" dataKey="equityIndex" stroke="#8B5CF6" strokeWidth={2} name="Equity Index" />
                    <Line type="monotone" dataKey="representationImprovement" stroke="#10B981" strokeWidth={2} name="Representation Improvement" />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Shortlisting & Hiring Rates by Demographics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Shortlisting Rates by Ethnicity</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={diversityData?.shortlistingRates.byEthnicity}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="group" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value}%`, 'Shortlisting Rate']} />
                      <Bar dataKey="rate" fill="#E2007A" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Hiring Rates by Ethnicity</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={diversityData?.hiringOutcomes.byEthnicity}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="group" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value}%`, 'Hiring Rate']} />
                      <Bar dataKey="rate" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Shortlisting Rates by Socioeconomic Background</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={diversityData?.shortlistingRates.bySocioeconomic}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="group" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value}%`, 'Shortlisting Rate']} />
                      <Bar dataKey="rate" fill="#ffde59" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Impact on Representation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {diversityData?.platformImpact.representationGains.map((group) => (
                      <div key={group.group} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{group.group}</span>
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-bold text-green-600">+{group.improvement}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Individual Applicant Stats */}
          <TabsContent value="applicants" className="space-y-6">
            <div className="flex items-center gap-4 mb-4">
              <Select value={demographicFilter} onValueChange={setDemographicFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Applicants</SelectItem>
                  <SelectItem value="ethnicity">Filter by Ethnicity</SelectItem>
                  <SelectItem value="gender">Filter by Gender</SelectItem>
                  <SelectItem value="location">Filter by Location</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Search className="h-4 w-4 mr-2" />
                Search Applicants
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {applicantStats?.map((applicant) => (
                <Card key={applicant.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{applicant.name}</CardTitle>
                      <Badge variant="outline">{applicant.behavioralType}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Joined {new Date(applicant.joinDate).toLocaleDateString()}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Profile Completeness</span>
                        <span className="font-medium">{applicant.profileCompleteness}%</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Applications</div>
                          <div className="font-medium">{applicant.applicationsSubmitted}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Shortlists</div>
                          <div className="font-medium">{applicant.shortlistsReceived}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Interviews</div>
                          <div className="font-medium">{applicant.interviewsCompleted}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Offers</div>
                          <div className="font-medium">{applicant.offersReceived}</div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm">Skills Score</span>
                        <span className="font-medium">{applicant.averageSkillsScore}/100</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm">Success Rate</span>
                        <span className="font-medium">{applicant.progressMetrics.successRate}%</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm">Engagement Trend</span>
                        <Badge variant={
                          applicant.progressMetrics.engagementTrend === 'increasing' ? 'default' :
                          applicant.progressMetrics.engagementTrend === 'stable' ? 'secondary' : 'destructive'
                        }>
                          {applicant.progressMetrics.engagementTrend}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Employer Analytics */}
          <TabsContent value="employers" className="space-y-6">
            {/* Aggregate Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Time to Shortlist</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{employerData?.aggregateMetrics.averageTimeToShortlist} days</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Time to Hire</CardTitle>
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{employerData?.aggregateMetrics.averageTimeToHire} days</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Feedback Time</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{employerData?.aggregateMetrics.averageFeedbackTime} days</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Diversity Improvement</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">+{employerData?.aggregateMetrics.diversityImprovementRate}%</div>
                </CardContent>
              </Card>
            </div>

            {/* Individual Company Performance */}
            <div className="space-y-4">
              {employerData?.companies.map((company) => (
                <Card key={company.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        {company.name}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          company.diversityMetrics.diversityTrend === 'improving' ? 'default' :
                          company.diversityMetrics.diversityTrend === 'stable' ? 'secondary' : 'destructive'
                        }>
                          {company.diversityMetrics.diversityTrend}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400" />
                          <span className="text-sm font-medium">{company.candidateSatisfaction}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Hiring Metrics */}
                      <div>
                        <h4 className="font-medium mb-3">Hiring Metrics</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Jobs Posted</span>
                            <span className="font-medium">{company.jobsPosted}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Applications</span>
                            <span className="font-medium">{company.applicationsReceived}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Shortlisted</span>
                            <span className="font-medium">{company.candidatesShortlisted}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Hired</span>
                            <span className="font-medium">{company.candidatesHired}</span>
                          </div>
                        </div>
                      </div>

                      {/* Process Metrics */}
                      <div>
                        <h4 className="font-medium mb-3">Process Efficiency</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Time to Shortlist</span>
                            <span className="font-medium">{company.processMetrics.averageTimeToShortlist} days</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Time to Hire</span>
                            <span className="font-medium">{company.processMetrics.averageTimeToHire} days</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Feedback Response</span>
                            <span className="font-medium">{company.processMetrics.feedbackResponseTime} days</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Feedback Rate</span>
                            <span className="font-medium">{company.processMetrics.feedbackCompletionRate}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Diversity Metrics */}
                      <div>
                        <h4 className="font-medium mb-3">Diversity Performance</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Shortlist Diversity</span>
                            <span className="font-medium">{company.diversityMetrics.shortlistDiversityScore}/100</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Hiring Diversity</span>
                            <span className="font-medium">{company.diversityMetrics.hiringDiversityScore}/100</span>
                          </div>
                          <div className="mt-3">
                            <span className="font-medium text-sm">Representation Gaps:</span>
                            {company.diversityMetrics.representationGaps.map((gap) => (
                              <div key={gap.group} className="flex justify-between text-xs text-muted-foreground mt-1">
                                <span>{gap.group}</span>
                                <span className={gap.gap < 0 ? 'text-red-600' : 'text-green-600'}>
                                  {gap.gap > 0 ? '+' : ''}{gap.gap}%
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}