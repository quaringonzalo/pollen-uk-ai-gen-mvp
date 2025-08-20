import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { User, JobSeekerProfile, Application } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { Sprout, LogOut, Star, Clock, TrendingUp, MapPin, PoundSterling, Users, Award, Trophy, User as UserIcon, Home, MessageCircle, Send, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ProfileBuilder from "@/components/profile-builder";
import JobSeekerProfile from "@/components/job-seeker-profile";
import ChallengeLibrary from "@/components/challenge-library";
import JobOpportunities from "@/components/job-opportunities";
import BehavioralAssessment from "@/components/behavioral-assessment";
import CandidateProfileGenerator from "@/components/candidate-profile-generator";
import CommunityHub from "@/components/community-hub";
import IntegratedJobsBoard from "@/components/integrated-jobs-board";
import SkillsVerification from "@/components/skills-verification";
import GamificationSystem from "@/components/gamification-system";
import ChallengeGamification from "@/components/challenge-gamification";
import ChallengeViewer from "@/components/challenge-viewer";

export default function JobSeekerDashboard() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      type: "bot",
      message: "Hi! I'm your Pollen assistant. Ask me about your applications, job matches, or next steps in your career journey."
    }
  ]);

  // Mock data for demo
  const profile = {
    id: 1,
    name: "Demo Job Seeker",
    skills: ["JavaScript", "React", "Node.js"],
    assessmentCompleted: true
  };

  const applications = [];
  const jobMatches = [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <Sprout className="text-primary text-2xl mr-2" />
                <span className="text-xl font-bold text-gray-900">Pollen</span>
              </div>
              <div className="hidden md:flex space-x-6">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`px-3 py-2 text-sm font-medium ${
                    activeTab === "profile"
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-700 hover:text-primary"
                  }`}
                >
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab("challenges")}
                  className={`px-3 py-2 text-sm font-medium ${
                    activeTab === "challenges"
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-700 hover:text-primary"
                  }`}
                >
                  Challenges
                </button>
                <button
                  onClick={() => setActiveTab("opportunities")}
                  className={`px-3 py-2 text-sm font-medium ${
                    activeTab === "opportunities"
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-700 hover:text-primary"
                  }`}
                >
                  Opportunities
                </button>
                <button
                  onClick={() => setActiveTab("assessment")}
                  className={`px-3 py-2 text-sm font-medium ${
                    activeTab === "assessment"
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-700 hover:text-primary"
                  }`}
                >
                  Assessment
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Role Switcher */}
              <div className="hidden md:flex bg-gray-100 rounded-lg p-1">
                <button 
                  className="px-3 py-1 text-sm font-medium rounded-md bg-white text-primary shadow-sm"
                >
                  Job Seeker
                </button>
                <button 
                  onClick={() => window.location.href = "/employer-dashboard"}
                  className="px-3 py-1 text-sm font-medium rounded-md text-gray-500 hover:text-gray-700"
                >
                  Employer
                </button>
                <button 
                  onClick={() => {
                    const demoUser = { id: 1, email: "admin@demo.com", role: "admin", name: "Admin Demo" };
                    localStorage.setItem("demo_user", JSON.stringify(demoUser));
                    window.location.reload();
                  }}
                  className="px-3 py-1 text-sm font-medium rounded-md text-gray-500 hover:text-gray-700"
                >
                  Admin
                </button>
              </div>
              <Button variant="outline" size="sm" onClick={() => window.location.href = "/home"}>
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>

            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, Demo Job Seeker!
          </h1>
          <p className="text-gray-600">Track your progress and discover new opportunities</p>
        </div>

        {/* Application Support Chatbot */}
        <div className="fixed bottom-6 right-6 z-50">
          <Dialog open={showChatbot} onOpenChange={setShowChatbot}>
            <DialogTrigger asChild>
              <Button size="lg" className="rounded-full h-14 w-14 shadow-lg bg-blue-600 hover:bg-blue-700">
                <MessageCircle className="w-6 h-6" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Application Support</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Hi! I'm here to help with questions about your applications. Ask me about:</p>
                  <ul className="text-xs space-y-1 text-gray-600">
                    <li>• Application status updates</li>
                    <li>• Next steps in the process</li>
                    <li>• Interview preparation</li>
                    <li>• Feedback on submissions</li>
                  </ul>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  <div className="bg-blue-50 p-2 rounded text-sm">
                    <strong>Bot:</strong> What would you like to know about your applications?
                  </div>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {chatHistory.map((msg, index) => (
                    <div key={index} className={`p-2 rounded text-sm ${
                      msg.type === 'bot' ? 'bg-blue-50' : 'bg-gray-50'
                    }`}>
                      <strong>{msg.type === 'bot' ? 'Assistant:' : 'You:'}</strong> {msg.message}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Ask about your applications..." 
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && chatMessage.trim()) {
                        setChatHistory(prev => [...prev, 
                          { type: 'user', message: chatMessage },
                          { type: 'bot', message: 'Thanks for your question! Our team will respond within 24 hours.' }
                        ]);
                        setChatMessage('');
                      }
                    }}
                    className="flex-1" />
                  <Button 
                    size="sm"
                    onClick={() => {
                      if (chatMessage.trim()) {
                        setChatHistory(prev => [...prev, 
                          { type: 'user', message: chatMessage },
                          { type: 'bot', message: 'Thanks for your question! Our team will respond within 24 hours.' }
                        ]);
                        setChatMessage('');
                      }
                    }}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Profile Strength</p>
                  <p className="text-2xl font-bold text-gray-900">{(profile as any)?.profileStrength || 72}%</p>
                </div>
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <UserIcon className="w-4 h-4 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{applications?.length || 0}</p>
                </div>
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Job Matches</p>
                  <p className="text-2xl font-bold text-gray-900">{jobMatches?.length || 0}</p>
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Star className="w-4 h-4 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Skills Verified</p>
                  <p className="text-2xl font-bold text-gray-900">{profile?.skills?.length || 0}</p>
                </div>
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Content */}
        {activeTab === "assessment" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Enhanced Behavioral Assessment</CardTitle>
                <p className="text-muted-foreground">
                  Complete our research-backed 28-question assessment to unlock better job matching.
                </p>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => window.location.href = "/behavioural-assessment"}
                  size="lg"
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white"
                >
                  Start Assessment
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="space-y-6">
            {/* Show behavioural assessment if not completed */}
            {profile && !profile.assessmentCompleted ? (
              <Card>
                <CardHeader>
                  <CardTitle>Complete Your Behavioral Profile</CardTitle>
                  <p className="text-muted-foreground">
                    Take our enhanced assessment to improve job matching accuracy.
                  </p>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => window.location.href = "/behavioural-assessment"}
                    size="lg"
                    className="bg-pink-600 hover:bg-pink-700 text-white"
                  >
                    Start Assessment
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {/* Profile Builder and Status */}
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <ProfileBuilder profile={profile} />
                  </div>
                  <div>
                    {/* Candidate Profile Preview */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <UserIcon className="h-5 w-5" />
                          Your Profile
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Profile Strength</span>
                            <Badge variant="default">{(profile as any)?.profileStrength || 72}%</Badge>
                          </div>
                          
                          {profile && (profile as any).assessmentCompleted && (
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium">Behavioral Profile</h4>
                              <div className="text-sm">
                                <p className="font-medium text-green-600">
                                  {(profile as any).primaryProfile || "Green - Steady"}
                                </p>
                                <p className="text-muted-foreground">
                                  {(profile as any).secondaryProfile || "Blue - Analytical"}
                                </p>
                              </div>
                            </div>
                          )}
                          
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => setActiveTab("full-profile")}
                          >
                            View Full Profile
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                {/* Application Status */}
                {applications && (applications as any).length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        My Applications
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {(applications as any).map((application: any) => (
                          <div key={application.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                              <div className="space-y-2">
                                <h4 className="font-medium">Application #{application.id}</h4>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  <span className="flex items-center gap-1">
                                    <Star className="h-4 w-4" />
                                    Match: {application.matchScore}%
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {new Date(application.submittedAt).toLocaleDateString()}
                                  </span>
                                </div>
                                {application.notes && (
                                  <p className="text-sm italic text-gray-700 bg-gray-50 p-2 rounded">
                                    "{application.notes}"
                                  </p>
                                )}
                              </div>
                              <Badge variant={
                                application.status === 'challenge_completed' ? 'default' :
                                application.status === 'pending' ? 'secondary' : 'outline'
                              }>
                                {application.status.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        )}
        {activeTab === "skills" && <SkillsVerification />}
        {activeTab === "challenges" && <ChallengeLibrary />}
        {activeTab === "gamification" && <ChallengeGamification />}
        {activeTab === "opportunities" && <IntegratedJobsBoard />}
        {activeTab === "community" && <CommunityHub />}
        {activeTab === "achievements" && <GamificationSystem />}
        {activeTab === "full-profile" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Your Complete Profile</h2>
              <Button variant="outline" onClick={() => setActiveTab("profile")}>
                Back to Dashboard
              </Button>
            </div>
            <CandidateProfileGenerator isEditable={true} />
          </div>
        )}
      </div>
    </div>
  );
}
