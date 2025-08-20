import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Plus, X, User, Briefcase, MapPin, GraduationCap, Target } from "lucide-react";

const profileSchema = z.object({
  preferredRole: z.string().min(1, "Preferred role is required"),
  location: z.string().min(1, "Location is required"),
  experience: z.string().min(1, "Experience level is required"),
  education: z.string().min(1, "Education is required"),
  bio: z.string().min(50, "Bio must be at least 50 characters").max(500, "Bio must be less than 500 characters"),
  skills: z.array(z.string()).min(3, "At least 3 skills are required")
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfileBuilder({ profile: profileProp }: ProfileBuilderProps = {}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newSkill, setNewSkill] = useState("");

  const { data: profile, isLoading } = useQuery({
    queryKey: ["/api/job-seeker-profiles/user/1"],
    retry: false,
  });

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      preferredRole: (profile as any)?.preferredRole || "",
      location: (profile as any)?.location || "",
      experience: (profile as any)?.experience || "",
      education: (profile as any)?.education || "",
      bio: (profile as any)?.bio || "",
      skills: (profile as any)?.skills || []
    }
  });

  const createProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const response = await apiRequest("POST", "/api/job-seeker-profiles", {
        userId: 1,
        ...data
      });
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Profile created successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/job-seeker-profiles"] });
    },
    onError: (error) => {
      toast({ 
        title: "Error creating profile", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const response = await apiRequest("PATCH", `/api/job-seeker-profiles/${(profile as any)?.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Profile updated successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/job-seeker-profiles"] });
    },
    onError: (error) => {
      toast({ 
        title: "Error updating profile", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  const calculateProfileStrength = (data: ProfileFormData): number => {
    let strength = 0;
    if (data.preferredRole) strength += 20;
    if (data.location) strength += 15;
    if (data.experience) strength += 15;
    if (data.education) strength += 15;
    if (data.bio && data.bio.length >= 50) strength += 20;
    if (data.skills && data.skills.length >= 3) strength += 15;
    return Math.min(strength, 100);
  };

  const onSubmit = (data: ProfileFormData) => {
    if (profile) {
      updateProfileMutation.mutate(data);
    } else {
      createProfileMutation.mutate(data);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !form.getValues("skills").includes(newSkill.trim())) {
      const currentSkills = form.getValues("skills");
      form.setValue("skills", [...currentSkills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const currentSkills = form.getValues("skills");
    form.setValue("skills", currentSkills.filter(skill => skill !== skillToRemove));
  };

  const currentData = form.watch();
  const profileStrength = calculateProfileStrength(currentData);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Strength Indicator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-500" />
            Profile Strength: {profileStrength}%
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={profileStrength} className="h-3" />
          <p className="text-sm text-gray-600 mt-2">
            Complete your profile to increase visibility to employers
          </p>
        </CardContent>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-green-500" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="preferredRole"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Role</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Frontend Developer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., San Francisco, CA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experience Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select experience level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                          <SelectItem value="junior">Junior (2-4 years)</SelectItem>
                          <SelectItem value="mid">Mid Level (4-7 years)</SelectItem>
                          <SelectItem value="senior">Senior (7+ years)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="education"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Education</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select education level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="high_school">High School</SelectItem>
                          <SelectItem value="bootcamp">Coding Bootcamp</SelectItem>
                          <SelectItem value="associate">Associate Degree</SelectItem>
                          <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                          <SelectItem value="master">Master's Degree</SelectItem>
                          <SelectItem value="phd">PhD</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-purple-500" />
                  Skills
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a skill"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  />
                  <Button type="button" onClick={addSkill} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 min-h-[100px] p-3 border rounded-lg">
                  {currentData.skills?.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {(!currentData.skills || currentData.skills.length === 0) && (
                    <p className="text-gray-400 text-sm">Add skills to showcase your expertise</p>
                  )}
                </div>
                {form.formState.errors.skills && (
                  <p className="text-sm text-red-500">{form.formState.errors.skills.message}</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Bio */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-orange-500" />
                Professional Bio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tell employers about yourself</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your background, interests, and career goals..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <div className="flex justify-between">
                      <FormMessage />
                      <span className="text-sm text-gray-500">
                        {field.value?.length || 0}/500 characters
                      </span>
                    </div>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createProfileMutation.isPending || updateProfileMutation.isPending}
            >
              {createProfileMutation.isPending || updateProfileMutation.isPending ? 
                "Saving..." : profile ? "Update Profile" : "Create Profile"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}