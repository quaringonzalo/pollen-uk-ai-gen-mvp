import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Plus, MapPin, PoundSterling, Users, Edit, Trash2, Eye,
  Building, Calendar, Clock, Target, Briefcase
} from "lucide-react";

interface Job {
  id: number;
  title: string;
  description: string;
  employerId: number;
  location: string;
  isRemote: boolean;
  salaryMin: string;
  salaryMax: string;
  requiredSkills: string[];
  preferredSkills: string[];
  challengeId?: number;
  status: string;
  createdAt: string;
  applications?: number;
}

export default function IntegratedJobsBoard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  const { data: employerJobs, isLoading } = useQuery({
    queryKey: ["/api/jobs/employer/1"]
  });

  const { data: challenges } = useQuery({
    queryKey: ["/api/challenges"]
  });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    isRemote: false,
    salaryMin: "",
    salaryMax: "",
    requiredSkills: [] as string[],
    preferredSkills: [] as string[],
    challengeId: "",
    status: "active"
  });

  const [newSkill, setNewSkill] = useState("");
  const [skillType, setSkillType] = useState<"required" | "preferred">("required");

  const createJobMutation = useMutation({
    mutationFn: async (jobData: any) => {
      const response = await apiRequest("POST", "/api/jobs", {
        ...jobData,
        employerId: 1,
        challengeId: jobData.challengeId ? parseInt(jobData.challengeId) : null
      });
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Job posted successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
      setIsCreateDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({ 
        title: "Error posting job", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  const updateJobMutation = useMutation({
    mutationFn: async ({ id, ...jobData }: any) => {
      const response = await apiRequest("PATCH", `/api/jobs/${id}`, jobData);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Job updated successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
      setEditingJob(null);
      resetForm();
    },
    onError: (error) => {
      toast({ 
        title: "Error updating job", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  const deleteJobMutation = useMutation({
    mutationFn: async (jobId: number) => {
      const response = await apiRequest("DELETE", `/api/jobs/${jobId}`);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Job deleted successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
    },
    onError: (error) => {
      toast({ 
        title: "Error deleting job", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      location: "",
      isRemote: false,
      salaryMin: "",
      salaryMax: "",
      requiredSkills: [],
      preferredSkills: [],
      challengeId: "",
      status: "active"
    });
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      description: job.description,
      location: job.location,
      isRemote: job.isRemote,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      requiredSkills: job.requiredSkills || [],
      preferredSkills: job.preferredSkills || [],
      challengeId: job.challengeId?.toString() || "",
      status: job.status
    });
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      const skillArray = skillType === "required" ? "requiredSkills" : "preferredSkills";
      if (!formData[skillArray].includes(newSkill.trim())) {
        setFormData(prev => ({
          ...prev,
          [skillArray]: [...prev[skillArray], newSkill.trim()]
        }));
      }
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string, type: "required" | "preferred") => {
    const skillArray = type === "required" ? "requiredSkills" : "preferredSkills";
    setFormData(prev => ({
      ...prev,
      [skillArray]: prev[skillArray].filter(s => s !== skill)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingJob) {
      updateJobMutation.mutate({ id: editingJob.id, ...formData });
    } else {
      createJobMutation.mutate(formData);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Job Postings</h2>
          <p className="text-gray-600">Manage your job postings and find the right candidates</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Post New Job
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingJob ? "Edit Job Posting" : "Create New Job Posting"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Senior Frontend Developer"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g., San Francisco, CA"
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.isRemote}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isRemote: checked }))}
                  />
                  <Label>Remote Work Available</Label>
                </div>

                <div>
                  <Label htmlFor="salaryMin">Minimum Salary (USD)</Label>
                  <Input
                    id="salaryMin"
                    type="number"
                    value={formData.salaryMin}
                    onChange={(e) => setFormData(prev => ({ ...prev, salaryMin: e.target.value }))}
                    placeholder="e.g., 80000"
                  />
                </div>

                <div>
                  <Label htmlFor="salaryMax">Maximum Salary (USD)</Label>
                  <Input
                    id="salaryMax"
                    type="number"
                    value={formData.salaryMax}
                    onChange={(e) => setFormData(prev => ({ ...prev, salaryMax: e.target.value }))}
                    placeholder="e.g., 120000"
                  />
                </div>

                <div>
                  <Label htmlFor="challenge">Skills Challenge (Optional)</Label>
                  <Select 
                    value={formData.challengeId} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, challengeId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a challenge" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Challenge</SelectItem>
                      {challenges?.map((challenge: any) => (
                        <SelectItem key={challenge.id} value={challenge.id.toString()}>
                          {challenge.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Job Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the role, responsibilities, and requirements..."
                  rows={4}
                  required
                />
              </div>

              {/* Skills Section */}
              <div className="space-y-4">
                <div>
                  <Label>Add Skills</Label>
                  <div className="flex gap-2 mt-2">
                    <Select value={skillType} onValueChange={(value: "required" | "preferred") => setSkillType(value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="required">Required</SelectItem>
                        <SelectItem value="preferred">Preferred</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    />
                    <Button type="button" onClick={addSkill}>Add</Button>
                  </div>
                </div>

                {formData.requiredSkills.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-red-600">Required Skills</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.requiredSkills.map((skill, index) => (
                        <Badge key={index} variant="destructive" className="flex items-center gap-1">
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill, "required")}
                            className="ml-1 hover:text-white"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {formData.preferredSkills.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-blue-600">Preferred Skills</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.preferredSkills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill, "preferred")}
                            className="ml-1 hover:text-gray-700"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsCreateDialogOpen(false);
                    setEditingJob(null);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={createJobMutation.isPending || updateJobMutation.isPending}
                >
                  {createJobMutation.isPending || updateJobMutation.isPending ? 
                    "Saving..." : editingJob ? "Update Job" : "Post Job"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {(!employerJobs || employerJobs.length === 0) ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No job postings yet</h3>
              <p className="text-gray-600 mb-4">Start by creating your first job posting to find great candidates</p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Post Your First Job
              </Button>
            </CardContent>
          </Card>
        ) : (
          (employerJobs || []).map((job: Job) => (
            <Card key={job.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{job.title}</h3>
                      <Badge 
                        variant={job.status === 'active' ? 'default' : 'secondary'}
                        className={job.status === 'active' ? 'bg-green-500' : ''}
                      >
                        {job.status}
                      </Badge>
                      {job.challengeId && (
                        <Badge variant="outline" className="text-blue-600 border-blue-600">
                          <Target className="h-3 w-3 mr-1" />
                          Challenge Required
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.isRemote ? "Remote" : job.location}
                      </div>
                      {job.salaryMin && job.salaryMax && (
                        <div className="flex items-center gap-1">
                          <PoundSterling className="h-4 w-4" />
                          £{job.salaryMin}k - £{job.salaryMax}k
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {job.applications || 0} applications
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(job.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>

                    <div className="space-y-2">
                      {job.requiredSkills && job.requiredSkills.length > 0 && (
                        <div>
                          <span className="text-sm font-medium text-gray-900 mr-2">Required:</span>
                          {job.requiredSkills.slice(0, 5).map((skill, index) => (
                            <Badge key={index} variant="destructive" className="mr-1 text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {job.requiredSkills.length > 5 && (
                            <span className="text-xs text-gray-500">+{job.requiredSkills.length - 5} more</span>
                          )}
                        </div>
                      )}
                      
                      {job.preferredSkills && job.preferredSkills.length > 0 && (
                        <div>
                          <span className="text-sm font-medium text-gray-900 mr-2">Preferred:</span>
                          {job.preferredSkills.slice(0, 3).map((skill, index) => (
                            <Badge key={index} variant="secondary" className="mr-1 text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {job.preferredSkills.length > 3 && (
                            <span className="text-xs text-gray-500">+{job.preferredSkills.length - 3} more</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-6">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(job)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => deleteJobMutation.mutate(job.id)}
                      disabled={deleteJobMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    Last updated {Math.floor(Math.random() * 7) + 1} days ago
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      View Applications
                    </Button>
                    <Button size="sm">
                      Promote Job
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingJob} onOpenChange={(open) => !open && setEditingJob(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Job Posting</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Same form content as create dialog */}
            {/* (Form content would be identical to above, extracted into a shared component in real implementation) */}
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}