import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Users, 
  CheckCircle, 
  Clock,
  AlertCircle,
  Star,
  MessageSquare,
  Calendar,
  Award,
  ArrowLeft
} from "lucide-react";
import { Link } from "wouter";

// Mock data for demonstration
const applicationOutcomes = [
  {
    id: 1,
    jobTitle: "Marketing Assistant",
    companyName: "TechFlow Solutions",
    finalOutcome: "hired",
    outcomeStage: "offer",
    outcomeDate: "2024-01-15",
    daysToPlacer: 21,
    feedbackStatus: "completed",
    overallExperience: 5,
    recommendToFriend: 9,
    startDate: "2024-02-01",
    actualSalary: 28000,
    stillEmployed: true
  },
  {
    id: 2,
    jobTitle: "Content Writer",
    companyName: "CreativeHub",
    finalOutcome: "offer_declined",
    outcomeStage: "offer",
    outcomeDate: "2024-01-20",
    daysToPlacer: 18,
    feedbackStatus: "completed",
    overallExperience: 4,
    recommendToFriend: 7,
    declineReason: "Better offer elsewhere"
  },
  {
    id: 3,
    jobTitle: "Social Media Coordinator",
    companyName: "BrandStory",
    finalOutcome: "rejected",
    outcomeStage: "interview",
    outcomeDate: "2024-01-25",
    daysToPlacer: 14,
    feedbackStatus: "pending",
    overallExperience: 3,
    recommendToFriend: 5
  }
];

const companyRatingImpact = {
  totalFeedbackCollected: 156,
  averageResponseRate: 78,
  ratingsUpdated: 45,
  companiesImproved: 12,
  topIssues: [
    { issue: "Slow communication", frequency: 23 },
    { issue: "Unclear process", frequency: 18 },
    { issue: "Poor interview experience", frequency: 12 },
    { issue: "Lack of feedback", frequency: 15 }
  ]
};

const successStories = [
  {
    id: 1,
    candidateName: "Sarah Chen",
    jobTitle: "Marketing Assistant",
    companyName: "TechFlow Solutions",
    daysToPlacer: 21,
    salaryIncrease: 4000,
    candidateQuote: "Pollen made the process so smooth and the feedback was incredibly helpful for my development.",
    challengeOvercome: "First marketing role without prior experience",
    publishedOnWebsite: true
  },
  {
    id: 2,
    candidateName: "James Wilson",
    jobTitle: "Data Analyst",
    companyName: "DataCorp",
    daysToPlacer: 16,
    salaryIncrease: 6000,
    candidateQuote: "The skills-based approach helped me showcase my abilities despite being a career changer.",
    challengeOvercome: "Career transition from retail to tech",
    publishedOnWebsite: false
  }
];

export default function OutcomeTrackingPage() {
  const [activeTab, setActiveTab] = useState("outcomes");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/admin">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Admin Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Outcome Tracking & Impact Analysis
          </h1>
          <p className="text-gray-600">
            Monitor application outcomes, candidate feedback, and platform impact
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <Button
              variant={activeTab === "outcomes" ? "default" : "ghost"}
              onClick={() => setActiveTab("outcomes")}
              className="flex-1"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Application Outcomes
            </Button>
            <Button
              variant={activeTab === "feedback" ? "default" : "ghost"}
              onClick={() => setActiveTab("feedback")}
              className="flex-1"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Candidate Feedback
            </Button>
            <Button
              variant={activeTab === "success" ? "default" : "ghost"}
              onClick={() => setActiveTab("success")}
              className="flex-1"
            >
              <Award className="w-4 h-4 mr-2" />
              Success Stories
            </Button>
          </div>
        </div>

        {/* Overview Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Placements</p>
                  <p className="text-2xl font-bold text-gray-900">47</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Time to Hire</p>
                  <p className="text-2xl font-bold text-gray-900">18 days</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">6-Month Retention</p>
                  <p className="text-2xl font-bold text-gray-900">89%</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Feedback Rate</p>
                  <p className="text-2xl font-bold text-gray-900">78%</p>
                </div>
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Content */}
        {activeTab === "outcomes" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Application Outcomes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applicationOutcomes.map((outcome) => (
                    <div key={outcome.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">
                              {outcome.jobTitle}
                            </h3>
                            <Badge variant={
                              outcome.finalOutcome === "hired" ? "default" :
                              outcome.finalOutcome === "offer_declined" ? "secondary" :
                              "destructive"
                            }>
                              {outcome.finalOutcome.replace("_", " ")}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {outcome.companyName} • {outcome.daysToPlacer} days to outcome
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Applied: {outcome.outcomeDate}</span>
                            {outcome.actualSalary && (
                              <span>Salary: £{outcome.actualSalary.toLocaleString()}</span>
                            )}
                            {outcome.stillEmployed && (
                              <span className="text-green-600">Still employed</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={
                            outcome.feedbackStatus === "completed" ? "default" : "secondary"
                          }>
                            {outcome.feedbackStatus}
                          </Badge>
                          {outcome.overallExperience && (
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span className="text-sm">{outcome.overallExperience}/5</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "feedback" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Feedback Collection Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Feedback Collected</span>
                      <span className="font-semibold">{companyRatingImpact.totalFeedbackCollected}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Average Response Rate</span>
                      <span className="font-semibold">{companyRatingImpact.averageResponseRate}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Company Ratings Updated</span>
                      <span className="font-semibold">{companyRatingImpact.ratingsUpdated}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Companies Improved</span>
                      <span className="font-semibold text-green-600">{companyRatingImpact.companiesImproved}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Issues Identified</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {companyRatingImpact.topIssues.map((issue, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{issue.issue}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{issue.frequency}</span>
                          <div className="w-16 h-2 bg-gray-200 rounded-full">
                            <div 
                              className="h-2 bg-red-500 rounded-full"
                              style={{ width: `${(issue.frequency / 25) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Feedback Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {applicationOutcomes.filter(o => o.feedbackStatus === "pending").map((outcome) => (
                    <div key={outcome.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          {outcome.jobTitle} at {outcome.companyName}
                        </p>
                        <p className="text-sm text-gray-600">
                          Feedback requested 2 days ago
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Pending
                        </Badge>
                        <Button size="sm" variant="outline">
                          Send Reminder
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "success" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Success Stories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {successStories.map((story) => (
                    <div key={story.id} className="border rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {story.candidateName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {story.jobTitle} at {story.companyName}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={story.publishedOnWebsite ? "default" : "secondary"}>
                            {story.publishedOnWebsite ? "Published" : "Draft"}
                          </Badge>
                          <Button size="sm" variant="outline">
                            Edit Story
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-600">Time to Hire</p>
                          <p className="font-semibold">{story.daysToPlacer} days</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-600">Salary Increase</p>
                          <p className="font-semibold text-green-600">+£{story.salaryIncrease.toLocaleString()}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-600">Challenge Overcome</p>
                          <p className="font-semibold text-xs">{story.challengeOvercome}</p>
                        </div>
                      </div>
                      
                      <div className="border-l-4 border-blue-500 pl-4">
                        <p className="text-gray-700 italic">
                          "{story.candidateQuote}"
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}