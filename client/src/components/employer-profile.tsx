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
import { Building, MapPin, Users, Globe, Award, Star, Calendar } from "lucide-react";

interface EmployerProfileProps {
  userId: number;
}

export default function EmployerProfile({ userId }: EmployerProfileProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: [`/api/employer-profiles/user/${userId}`],
    enabled: !!userId,
  });

  const [formData, setFormData] = useState({
    companyName: profile?.companyName || "",
    industry: profile?.industry || "",
    companySize: profile?.companySize || "",
    location: profile?.location || "",
    website: profile?.website || "",
    description: profile?.description || "",
    mission: profile?.mission || "",
    benefits: profile?.benefits || [],
    workCulture: profile?.workCulture || [],
    remoteWork: profile?.remoteWork || false,
    diversityCommitment: profile?.diversityCommitment || false,
    contactEmail: profile?.contactEmail || "",
    contactPhone: profile?.contactPhone || "",
    linkedinPage: profile?.linkedinPage || "",
    glassdoorRating: profile?.glassdoorRating || "",
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      if (profile?.id) {
        return apiRequest(`/api/employer-profiles/${profile.id}`, {
          method: "PATCH",
          body: JSON.stringify(data),
        });
      } else {
        return apiRequest("/api/employer-profiles", {
          method: "POST",
          body: JSON.stringify({ ...data, userId }),
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/employer-profiles/user/${userId}`] });
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your company profile has been successfully updated.",
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

  const addBenefit = (benefit: string) => {
    if (benefit && !formData.benefits.includes(benefit)) {
      setFormData(prev => ({
        ...prev,
        benefits: [...prev.benefits, benefit]
      }));
    }
  };

  const removeBenefit = (benefit: string) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter((b: string) => b !== benefit)
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
      {/* Company Header */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Building className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">
                {profile?.companyName || formData.companyName || "Company Name"}
              </CardTitle>
              <p className="text-muted-foreground flex items-center mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                {profile?.location || formData.location || "Location not set"}
              </p>
              <div className="flex items-center space-x-3 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {profile?.companySize || formData.companySize || "Size not set"}
                </div>
                <div className="flex items-center">
                  <Award className="w-4 h-4 mr-1" />
                  {profile?.industry || formData.industry || "Industry not set"}
                </div>
              </div>
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
          <div className="flex items-center space-x-4 text-sm">
            {profile?.website || formData.website ? (
              <a 
                href={profile?.website || formData.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <Globe className="w-4 h-4 mr-1" />
                Visit Website
              </a>
            ) : null}
            {(profile?.remoteWork || formData.remoteWork) && (
              <Badge variant="secondary">Remote-Friendly</Badge>
            )}
            {(profile?.diversityCommitment || formData.diversityCommitment) && (
              <Badge variant="secondary">Diversity Committed</Badge>
            )}
            {profile?.glassdoorRating && (
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-500 mr-1" />
                <span>{profile.glassdoorRating} Glassdoor</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Company Description */}
      <Card>
        <CardHeader>
          <CardTitle>About the Company</CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="description">Company Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your company, what you do, and what makes you unique..."
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="mission">Mission & Values</Label>
                <Textarea
                  id="mission"
                  value={formData.mission}
                  onChange={(e) => setFormData(prev => ({ ...prev, mission: e.target.value }))}
                  placeholder="Share your company's mission, values, and vision..."
                  rows={3}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Company Description</h4>
                <p className="text-gray-700">
                  {profile?.description || formData.description || "No company description provided yet."}
                </p>
              </div>
              {(profile?.mission || formData.mission) && (
                <div>
                  <h4 className="font-medium mb-2">Mission & Values</h4>
                  <p className="text-gray-700">
                    {profile?.mission || formData.mission}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Benefits & Culture */}
      <Card>
        <CardHeader>
          <CardTitle>Benefits & Culture</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Employee Benefits</h4>
              <div className="flex flex-wrap gap-2">
                {(profile?.benefits || formData.benefits || []).map((benefit: string) => (
                  <Badge key={benefit} variant="outline" className="text-sm">
                    {benefit}
                    {isEditing && (
                      <button
                        onClick={() => removeBenefit(benefit)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    )}
                  </Badge>
                ))}
                {(profile?.benefits || formData.benefits || []).length === 0 && !isEditing && (
                  <p className="text-sm text-muted-foreground">No benefits listed yet.</p>
                )}
              </div>
              {isEditing && (
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="Add a benefit (e.g., Health Insurance, Remote Work)"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addBenefit(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <Button 
                    size="sm" 
                    onClick={() => {
                      const input = document.querySelector('input[placeholder*="Add a benefit"]') as HTMLInputElement;
                      if (input?.value) {
                        addBenefit(input.value);
                        input.value = '';
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Details Form */}
      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>Company Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                  placeholder="Your Company Name"
                />
              </div>
              <div>
                <Label htmlFor="industry">Industry</Label>
                <Select value={formData.industry} onValueChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="consulting">Consulting</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="non-profit">Non-Profit</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="companySize">Company Size</Label>
                <Select value={formData.companySize} onValueChange={(value) => setFormData(prev => ({ ...prev, companySize: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10 employees</SelectItem>
                    <SelectItem value="11-50">11-50 employees</SelectItem>
                    <SelectItem value="51-200">51-200 employees</SelectItem>
                    <SelectItem value="201-500">201-500 employees</SelectItem>
                    <SelectItem value="501-1000">501-1000 employees</SelectItem>
                    <SelectItem value="1000+">1000+ employees</SelectItem>
                  </SelectContent>
                </Select>
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
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="https://yourcompany.com"
                />
              </div>
              <div>
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                  placeholder="hr@yourcompany.com"
                />
              </div>
              <div>
                <Label htmlFor="linkedinPage">LinkedIn Company Page</Label>
                <Input
                  id="linkedinPage"
                  value={formData.linkedinPage}
                  onChange={(e) => setFormData(prev => ({ ...prev, linkedinPage: e.target.value }))}
                  placeholder="https://linkedin.com/company/yourcompany"
                />
              </div>
              <div>
                <Label htmlFor="glassdoorRating">Glassdoor Rating</Label>
                <Input
                  id="glassdoorRating"
                  value={formData.glassdoorRating}
                  onChange={(e) => setFormData(prev => ({ ...prev, glassdoorRating: e.target.value }))}
                  placeholder="4.2/5.0"
                />
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remoteWork"
                  checked={formData.remoteWork}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, remoteWork: !!checked }))}
                />
                <Label htmlFor="remoteWork">Remote work friendly</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="diversityCommitment"
                  checked={formData.diversityCommitment}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, diversityCommitment: !!checked }))}
                />
                <Label htmlFor="diversityCommitment">Diversity & inclusion commitment</Label>
              </div>
            </div>

            <div className="pt-4">
              <Button 
                onClick={handleSave} 
                disabled={updateMutation.isPending}
                className="w-full"
              >
                {updateMutation.isPending ? "Saving..." : "Save Company Profile"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hiring Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Hiring Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">8</div>
              <div className="text-sm text-muted-foreground">Active Jobs</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">142</div>
              <div className="text-sm text-muted-foreground">Applications</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">23</div>
              <div className="text-sm text-muted-foreground">Interviews</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">6</div>
              <div className="text-sm text-muted-foreground">Hires</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}