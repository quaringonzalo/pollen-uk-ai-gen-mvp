import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Briefcase, Clock, PoundSterling, MapPin, Users, Award, Target, Zap } from "lucide-react";

interface JobCreatorProps {
  employerId: number;
  onJobCreated?: () => void;
}

export default function EmployerJobCreator({ employerId, onJobCreated }: JobCreatorProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeStep, setActiveStep] = useState("basics");

  const [jobData, setJobData] = useState({
    title: "",
    department: "",
    location: "",
    workType: "full-time",
    salaryMin: "",
    salaryMax: "",
    description: "",
    responsibilities: "",
    requirements: "",
    preferredSkills: [],
    requiredSkills: [],
    experienceLevel: "entry",
    remoteWork: false,
    benefits: [],
    serviceTier: "standard" as "standard" | "premium" | "white-glove",
    challengeIds: [] as number[],
    behaviouralProfile: "",
  });

  const createJobMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("/api/jobs", {
        method: "POST",
        body: JSON.stringify({ ...data, employerId }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/jobs/employer/${employerId}`] });
      toast({
        title: "Job Created",
        description: "Your job posting has been successfully created.",
      });
      onJobCreated?.();
      // Reset form
      setJobData({
        title: "",
        department: "",
        location: "",
        workType: "full-time",
        salaryMin: "",
        salaryMax: "",
        description: "",
        responsibilities: "",
        requirements: "",
        preferredSkills: [],
        requiredSkills: [],
        experienceLevel: "entry",
        remoteWork: false,
        benefits: [],
        serviceTier: "standard",
        challengeIds: [],
        behaviouralProfile: "",
      });
      setActiveStep("basics");
    },
    onError: (error) => {
      toast({
        title: "Creation Failed",
        description: "Failed to create job posting. Please try again.",
        variant: "destructive",
      });
    },
  });

  const addSkill = (skill: string, type: "required" | "preferred") => {
    if (skill && !jobData[`${type}Skills`].includes(skill)) {
      setJobData(prev => ({
        ...prev,
        [`${type}Skills`]: [...prev[`${type}Skills`], skill]
      }));
    }
  };

  const removeSkill = (skill: string, type: "required" | "preferred") => {
    setJobData(prev => ({
      ...prev,
      [`${type}Skills`]: prev[`${type}Skills`].filter((s: string) => s !== skill)
    }));
  };

  const availableChallenges = [
    { id: 1, title: "Strategic Media Planning", category: "Marketing", difficulty: "Intermediate" },
    { id: 2, title: "P&L Analysis", category: "Finance", difficulty: "Advanced" },
    { id: 3, title: "Office Administration", category: "Operations", difficulty: "Beginner" },
    { id: 4, title: "Social Media Campaign", category: "Digital Marketing", difficulty: "Beginner" },
  ];

  const serviceTiers = [
    {
      id: "standard",
      name: "Standard",
      price: "Free",
      features: [
        "Basic job posting",
        "Standard skills challenges",
        "Basic applicant filtering",
        "Email notifications"
      ],
      recommended: false
    },
    {
      id: "premium",
      name: "Premium",
      price: "£299/month",
      features: [
        "Enhanced job visibility",
        "Custom skills challenges",
        "Advanced filtering & matching",
        "Behavioral assessments",
        "Priority support"
      ],
      recommended: true
    },
    {
      id: "white-glove",
      name: "White Glove",
      price: "£799/month",
      features: [
        "Dedicated recruitment consultant",
        "Custom challenge development",
        "Interview scheduling assistance",
        "Candidate pre-screening",
        "Weekly progress reports"
      ],
      recommended: false
    }
  ];

  const handleSubmit = () => {
    createJobMutation.mutate(jobData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Create New Job Posting</h2>
          <p className="text-muted-foreground">Design your ideal candidate workflow</p>
        </div>
      </div>

      <Tabs value={activeStep} onValueChange={setActiveStep} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basics">Job Basics</TabsTrigger>
          <TabsTrigger value="skills">Skills & Requirements</TabsTrigger>
          <TabsTrigger value="challenges">Skills Assessment</TabsTrigger>
          <TabsTrigger value="service">Service Tier</TabsTrigger>
        </TabsList>

        <TabsContent value="basics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                Job Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    value={jobData.title}
                    onChange={(e) => setJobData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Frontend Developer, Marketing Manager"
                  />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={jobData.department}
                    onChange={(e) => setJobData(prev => ({ ...prev, department: e.target.value }))}
                    placeholder="e.g., Engineering, Marketing, Sales"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={jobData.location}
                    onChange={(e) => setJobData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g., San Francisco, CA or Remote"
                  />
                </div>
                <div>
                  <Label htmlFor="workType">Work Type</Label>
                  <Select value={jobData.workType} onValueChange={(value) => setJobData(prev => ({ ...prev, workType: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="salaryMin">Salary Range (Min)</Label>
                  <Input
                    id="salaryMin"
                    type="number"
                    value={jobData.salaryMin}
                    onChange={(e) => setJobData(prev => ({ ...prev, salaryMin: e.target.value }))}
                    placeholder="50000"
                  />
                </div>
                <div>
                  <Label htmlFor="salaryMax">Salary Range (Max)</Label>
                  <Input
                    id="salaryMax"
                    type="number"
                    value={jobData.salaryMax}
                    onChange={(e) => setJobData(prev => ({ ...prev, salaryMax: e.target.value }))}
                    placeholder="80000"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remoteWork"
                  checked={jobData.remoteWork}
                  onCheckedChange={(checked) => setJobData(prev => ({ ...prev, remoteWork: !!checked }))}
                />
                <Label htmlFor="remoteWork">Remote work available</Label>
              </div>

              <div>
                <Label htmlFor="description">Job Description</Label>
                <Textarea
                  id="description"
                  value={jobData.description}
                  onChange={(e) => setJobData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Provide a compelling overview of the role and your company..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="responsibilities">Key Responsibilities</Label>
                <Textarea
                  id="responsibilities"
                  value={jobData.responsibilities}
                  onChange={(e) => setJobData(prev => ({ ...prev, responsibilities: e.target.value }))}
                  placeholder="• Lead project initiatives&#10;• Collaborate with cross-functional teams&#10;• Develop and implement strategies"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={() => setActiveStep("skills")}>
              Next: Skills & Requirements
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Skills & Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="experienceLevel">Experience Level</Label>
                <Select value={jobData.experienceLevel} onValueChange={(value) => setJobData(prev => ({ ...prev, experienceLevel: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                    <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
                    <SelectItem value="senior">Senior Level (6+ years)</SelectItem>
                    <SelectItem value="lead">Lead/Principal (8+ years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Required Skills</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Essential skills candidates must have
                </p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {jobData.requiredSkills.map((skill: string) => (
                    <Badge key={skill} variant="default" className="text-sm">
                      {skill}
                      <button
                        onClick={() => removeSkill(skill, "required")}
                        className="ml-2 text-red-200 hover:text-red-100"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add required skill (e.g., JavaScript, Project Management)"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addSkill(e.currentTarget.value, "required");
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <Button 
                    size="sm" 
                    onClick={() => {
                      const input = document.querySelector('input[placeholder*="Add required skill"]') as HTMLInputElement;
                      if (input?.value) {
                        addSkill(input.value, "required");
                        input.value = '';
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>

              <div>
                <Label>Preferred Skills</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Nice-to-have skills that would be a bonus
                </p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {jobData.preferredSkills.map((skill: string) => (
                    <Badge key={skill} variant="outline" className="text-sm">
                      {skill}
                      <button
                        onClick={() => removeSkill(skill, "preferred")}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add preferred skill"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addSkill(e.currentTarget.value, "preferred");
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <Button 
                    size="sm" 
                    onClick={() => {
                      const input = document.querySelector('input[placeholder*="Add preferred skill"]') as HTMLInputElement;
                      if (input?.value) {
                        addSkill(input.value, "preferred");
                        input.value = '';
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="requirements">Additional Requirements</Label>
                <Textarea
                  id="requirements"
                  value={jobData.requirements}
                  onChange={(e) => setJobData(prev => ({ ...prev, requirements: e.target.value }))}
                  placeholder="• Bachelor's degree or equivalent experience&#10;• Strong communication skills&#10;• Ability to work in a fast-paced environment"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setActiveStep("basics")}>
              Previous
            </Button>
            <Button onClick={() => setActiveStep("challenges")}>
              Next: Skills Assessment
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="challenges" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Skills Assessment Setup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Skills Challenges</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Select challenges that align with the key skills for this role
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableChallenges.map((challenge) => (
                    <div 
                      key={challenge.id} 
                      className={`border rounded-lg p-4 cursor-pointer transition-colours ${
                        jobData.challengeIds.includes(challenge.id) 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => {
                        setJobData(prev => ({
                          ...prev,
                          challengeIds: prev.challengeIds.includes(challenge.id)
                            ? prev.challengeIds.filter(id => id !== challenge.id)
                            : [...prev.challengeIds, challenge.id]
                        }));
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{challenge.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {challenge.difficulty}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{challenge.category}</p>
                      {jobData.challengeIds.includes(challenge.id) && (
                        <div className="mt-2">
                          <Badge variant="default" className="text-xs">Selected</Badge>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="behaviouralProfile">Preferred Behavioral Profile</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  What personality traits would be ideal for this role?
                </p>
                <Select value={jobData.behaviouralProfile} onValueChange={(value) => setJobData(prev => ({ ...prev, behaviouralProfile: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select preferred profile" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dominant">Dominant (Results-oriented, direct, decisive)</SelectItem>
                    <SelectItem value="influential">Influential (People-oriented, optimistic, persuasive)</SelectItem>
                    <SelectItem value="steady">Steady (Patient, reliable, team-oriented)</SelectItem>
                    <SelectItem value="conscientious">Conscientious (Detail-oriented, analytical, quality-focused)</SelectItem>
                    <SelectItem value="balanced">Balanced (Adaptable to various work styles)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setActiveStep("skills")}>
              Previous
            </Button>
            <Button onClick={() => setActiveStep("service")}>
              Next: Service Tier
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="service" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Choose Your Service Tier
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {serviceTiers.map((tier) => (
                  <div
                    key={tier.id}
                    className={`border rounded-lg p-6 cursor-pointer transition-all ${
                      jobData.serviceTier === tier.id
                        ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${tier.recommended ? 'ring-2 ring-green-200 border-green-500' : ''}`}
                    onClick={() => setJobData(prev => ({ ...prev, serviceTier: tier.id as any }))}
                  >
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-semibold">{tier.name}</h3>
                      {tier.recommended && (
                        <Badge className="mt-1">Recommended</Badge>
                      )}
                      <div className="text-2xl font-bold text-blue-600 mt-2">{tier.price}</div>
                    </div>
                    <ul className="space-y-2 text-sm">
                      {tier.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setActiveStep("challenges")}>
              Previous
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={createJobMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {createJobMutation.isPending ? "Creating Job..." : "Create Job Posting"}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}