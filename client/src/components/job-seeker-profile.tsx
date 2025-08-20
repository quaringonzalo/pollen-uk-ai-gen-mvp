import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { User, MapPin, Briefcase, GraduationCap, Award, Clock, Star } from "lucide-react";

interface JobSeekerProfileProps {
  userId: number;
}

export default function JobSeekerProfile({ userId }: JobSeekerProfileProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: [`/api/job-seeker-profiles/user/${userId}`],
    enabled: !!userId,
  });

  const [formData, setFormData] = useState({
    firstName: profile?.firstName || "",
    lastName: profile?.lastName || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
    location: profile?.location || "",
    bio: profile?.bio || "",
    experience: profile?.experience || "entry",
    education: profile?.education || "",
    skills: profile?.skills || [],
    interests: profile?.interests || [],
    availability: profile?.availability || "full-time",
    remoteWork: profile?.remoteWork || false,
    portfolio: profile?.portfolio || "",
    linkedin: profile?.linkedin || "",
    github: profile?.github || "",
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      if (profile?.id) {
        return apiRequest(`/api/job-seeker-profiles/${profile.id}`, {
          method: "PATCH",
          body: JSON.stringify(data),
        });
      } else {
        return apiRequest("/api/job-seeker-profiles", {
          method: "POST",
          body: JSON.stringify({ ...data, userId }),
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/job-seeker-profiles/user/${userId}`] });
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    updateMutation.mutate(formData);
  };

  const addSkill = (skill: string) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">
                {profile?.firstName || formData.firstName || "Zara"} {profile?.lastName || formData.lastName || "Williams"}
              </CardTitle>
              <p className="text-muted-foreground flex items-center mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                {profile?.location || formData.location || "Manchester, UK"}
              </p>
            </div>
          </div>
          <Button 
            onClick={() => setIsEditing(!isEditing)}
            variant={isEditing ? "outline" : "default"}
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Briefcase className="w-4 h-4 mr-1" />
              {profile?.experience || formData.experience || "Entry Level"}
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {profile?.availability || formData.availability || "Full-time"}
            </div>
            {(profile?.remoteWork || formData.remoteWork) && (
              <Badge variant="secondary">Remote Available</Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bio Section */}
      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <Textarea
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Tell us about yourself, your career goals, and what you're passionate about..."
              rows={4}
            />
          ) : (
            <p className="text-gray-700">
              {profile?.bio || formData.bio || "Recent psychology graduate with a passion for helping others and strong analytical skills. Experienced in research, data collection, and client interaction through university projects and volunteer work. Eager to start my career in a supportive environment where I can apply my communication skills and grow professionally while making a meaningful impact."}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Skills Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="w-5 h-5 mr-2" />
            Skills
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {(profile?.skills || formData.skills || ["Communication", "Problem Solving", "Team Collaboration", "Microsoft Office", "Customer Service", "Data Analysis", "Social Media Marketing", "Project Coordination"]).map((skill: string) => (
                <Badge key={skill} variant="outline" className="text-sm">
                  {skill}
                  {isEditing && (
                    <button
                      onClick={() => removeSkill(skill)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  )}
                </Badge>
              ))}
            </div>
            {isEditing && (
              <div className="flex gap-2">
                <Input
                  placeholder="Add a skill (e.g., React, Python, Design)"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addSkill(e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <Button 
                  size="sm" 
                  onClick={() => {
                    const input = document.querySelector('input[placeholder*="Add a skill"]') as HTMLInputElement;
                    if (input?.value) {
                      addSkill(input.value);
                      input.value = '';
                    }
                  }}
                >
                  Add
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Contact & Details */}
      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>Contact & Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="City, Country"
                />
              </div>
              <div>
                <Label htmlFor="experience">Experience Level</Label>
                <Select value={formData.experience} onValueChange={(value) => setFormData(prev => ({ ...prev, experience: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                    <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
                    <SelectItem value="senior">Senior Level (6+ years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="availability">Availability</Label>
                <Select value={formData.availability} onValueChange={(value) => setFormData(prev => ({ ...prev, availability: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="education">Education</Label>
                <Input
                  id="education"
                  value={formData.education}
                  onChange={(e) => setFormData(prev => ({ ...prev, education: e.target.value }))}
                  placeholder="Degree, Institution"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remoteWork"
                checked={formData.remoteWork}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, remoteWork: !!checked }))}
              />
              <Label htmlFor="remoteWork">Available for remote work</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="portfolio">Portfolio URL</Label>
              <Input
                id="portfolio"
                value={formData.portfolio}
                onChange={(e) => setFormData(prev => ({ ...prev, portfolio: e.target.value }))}
                placeholder="https://your-portfolio.com"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="linkedin">LinkedIn Profile</Label>
                <Input
                  id="linkedin"
                  value={formData.linkedin}
                  onChange={(e) => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
                  placeholder="https://linkedin.com/in/yourname"
                />
              </div>
              <div>
                <Label htmlFor="github">GitHub Profile</Label>
                <Input
                  id="github"
                  value={formData.github}
                  onChange={(e) => setFormData(prev => ({ ...prev, github: e.target.value }))}
                  placeholder="https://github.com/yourname"
                />
              </div>
            </div>

            <div className="pt-4">
              <Button 
                onClick={handleSave} 
                disabled={updateMutation.isPending}
                className="w-full"
              >
                {updateMutation.isPending ? "Saving..." : "Save Profile"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Challenge Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Star className="w-5 h-5 mr-2" />
            Challenge Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">8</div>
              <div className="text-sm text-muted-foreground">Challenges Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">92%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">Silver</div>
              <div className="text-sm text-muted-foreground">Current Badge</div>
            </div>
          </div>
          
          <div className="mt-4 space-y-2">
            <h4 className="font-semibold text-sm">Recent Achievements</h4>
            <div className="space-y-1">
              <div className="text-sm text-gray-600">✓ Communication Skills Challenge - 95%</div>
              <div className="text-sm text-gray-600">✓ Data Analysis Fundamentals - 88%</div>
              <div className="text-sm text-gray-600">✓ Customer Service Scenario - 94%</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}