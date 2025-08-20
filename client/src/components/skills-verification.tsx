import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Shield, Star, Award, Trophy, Zap, Target, CheckCircle, Clock, AlertCircle } from "lucide-react";

export default function SkillsVerification() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Mock data for demo
  const profile = {
    skills: ["JavaScript", "React", "Node.js", "Python", "SQL", "HTML/CSS"]
  };

  const verifiedSkills = [
    { skillName: "JavaScript", score: 85, status: "verified" },
    { skillName: "React", score: 92, status: "verified" },
    { skillName: "Python", score: 75, status: "verified" }
  ];

  const availableChallenges = [
    { id: 1, skills: ["JavaScript"], title: "JavaScript Fundamentals" },
    { id: 2, skills: ["React"], title: "React Component Challenge" },
    { id: 3, skills: ["Node.js"], title: "Backend API Development" },
    { id: 4, skills: ["Python"], title: "Python Data Structures" },
    { id: 5, skills: ["SQL"], title: "Database Query Optimization" }
  ];

  // Skills status: unverified, pending, verified, failed
  const getSkillStatus = (skill: string) => {
    const verification = verifiedSkills.find((v: any) => v.skillName === skill);
    if (!verification) return 'unverified';
    return verification.status;
  };

  const getSkillScore = (skill: string) => {
    const verification = verifiedSkills.find((v: any) => v.skillName === skill);
    return verification?.score || 0;
  };

  const getVerificationLevel = (score: number) => {
    if (score >= 90) return { level: 'Expert', colour: 'text-purple-600', bg: 'bg-purple-100' };
    if (score >= 80) return { level: 'Advanced', colour: 'text-blue-600', bg: 'bg-blue-100' };
    if (score >= 70) return { level: 'Intermediate', colour: 'text-green-600', bg: 'bg-green-100' };
    if (score >= 60) return { level: 'Beginner', colour: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { level: 'Needs Practice', colour: 'text-gray-600', bg: 'bg-gray-100' };
  };

  const claimedSkills = (profile as any)?.skills || [];
  const verificationProgress = verifiedSkills.length / Math.max(claimedSkills.length, 1) * 100;

  return (
    <div className="space-y-6">
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-500" />
            Skills Verification Center
          </CardTitle>
          <p className="text-muted-foreground">
            Prove your abilities through our verified challenges. Employers trust skills that are tested, not just claimed.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Shield className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h4 className="font-semibold">Verified Skills</h4>
              <p className="text-2xl font-bold text-blue-600">{verifiedSkills.length}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Target className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h4 className="font-semibold">Progress</h4>
              <p className="text-2xl font-bold text-green-600">{Math.round(verificationProgress)}%</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Trophy className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <h4 className="font-semibold">Avg Score</h4>
              <p className="text-2xl font-bold text-purple-600">
                {verifiedSkills.length > 0 
                  ? Math.round(verifiedSkills.reduce((sum: number, v: any) => sum + v.score, 0) / verifiedSkills.length)
                  : '--'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {claimedSkills.map((skill: string) => {
          const status = getSkillStatus(skill);
          const score = getSkillScore(skill);
          const verification = getVerificationLevel(score);
          const challenge = availableChallenges.find((c: any) => c.skills?.includes(skill));

          return (
            <Card key={skill} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-medium">{skill}</h4>
                  {status === 'verified' ? (
                    <Badge className={`${verification.bg} ${verification.colour} border-0`}>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {verification.level}
                    </Badge>
                  ) : status === 'pending' ? (
                    <Badge variant="secondary">
                      <Clock className="h-3 w-3 mr-1" />
                      Pending
                    </Badge>
                  ) : status === 'failed' ? (
                    <Badge variant="destructive">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Retry
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      Unverified
                    </Badge>
                  )}
                </div>

                {status === 'verified' && (
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Skill Level</span>
                      <span className="font-medium">{score}%</span>
                    </div>
                    <Progress value={score} className="h-2" />
                  </div>
                )}

                {status === 'unverified' && (
                  <div className="mb-3 p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-yellow-800">
                      <AlertCircle className="h-4 w-4" />
                      <span>Skill claimed but not verified</span>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  {challenge ? (
                    <Button 
                      size="sm" 
                      className="w-full"
                      variant={status === 'failed' ? "default" : status === 'verified' ? "outline" : "default"}
                    >
                      {status === 'failed' ? 'Retry Challenge' : 
                       status === 'verified' ? 'View Results' : 
                       'Take Challenge'}
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" className="w-full" disabled>
                      Challenge Coming Soon
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Verification Benefits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-6 w-6 text-primary" />
            Why Verify Your Skills?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold">For Job Seekers</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Stand out from other candidates
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Get matched with higher-quality roles
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Receive priority consideration from employers
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Build confidence in your abilities
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">For Employers</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  Reduce hiring risks and mishires
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  Find candidates with proven abilities
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  Save time on technical screening
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  Discover hidden talent fairly
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}