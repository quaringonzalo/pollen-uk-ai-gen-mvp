import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Edit2, Trash2, Eye, Users, ExternalLink, Calendar, MapPin, Building2, X, Shield, ArrowLeft } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const INDUSTRY_OPTIONS = [
  "Technology", "Healthcare", "Finance", "Education", "Retail", "Manufacturing", 
  "Marketing & Advertising", "Sales", "Customer Service", "Human Resources", 
  "Legal", "Consulting", "Real Estate", "Media & Communications", 
  "Non-Profit", "Government", "Transportation", "Energy", "Hospitality", 
  "Construction", "Arts & Entertainment", "Sports & Recreation"
];

const CONTRACT_TYPE_OPTIONS = [
  "Full Time", "Part Time", "Contract", "Internship", "Apprenticeship"
];

const hiddenJobSchema = z.object({
  role: z.string().min(1, "Role is required"),
  company: z.string().min(1, "Company is required"),
  companyPage: z.string().optional(),
  industries: z.array(z.string()).min(1, "At least one industry is required"),
  location: z.string().min(1, "Location is required"),
  contractTypes: z.array(z.string()).min(1, "At least one contract type is required"),
  salary: z.string().optional(),
  applicationDeadline: z.string().optional(),
  applicationLink: z.string().optional(),
  isActive: z.boolean().default(true),
});

type HiddenJobFormData = z.infer<typeof hiddenJobSchema>;

interface HiddenJob extends HiddenJobFormData {
  id: number;
  clicks?: number;
  createdAt: string;
}

export default function AdminHiddenJobs() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<HiddenJob | null>(null);
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const { data: hiddenJobs = [], isLoading } = useQuery<HiddenJob[]>({
    queryKey: ["/api/admin/hidden-jobs"],
  });

  const createJobMutation = useMutation({
    mutationFn: (data: HiddenJobFormData) => apiRequest("POST", "/api/admin/hidden-jobs", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/hidden-jobs"] });
      setIsCreateDialogOpen(false);
    },
  });

  const updateJobMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: HiddenJobFormData }) => 
      apiRequest("PUT", `/api/admin/hidden-jobs/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/hidden-jobs"] });
      setEditingJob(null);
    },
  });

  const deleteJobMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/hidden-jobs/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/hidden-jobs"] });
    },
  });

  const form = useForm<HiddenJobFormData>({
    resolver: zodResolver(hiddenJobSchema),
    defaultValues: {
      role: "",
      company: "",
      companyPage: "",
      industries: [],
      location: "",
      contractTypes: [],
      salary: "",
      applicationDeadline: "",
      applicationLink: "",
      isActive: true,
    },
  });

  const onSubmit = (data: HiddenJobFormData) => {
    if (editingJob) {
      updateJobMutation.mutate({ id: editingJob.id, data });
    } else {
      createJobMutation.mutate(data);
    }
  };

  const startEdit = (job: HiddenJob) => {
    setEditingJob(job);
    form.reset({
      role: job.role,
      company: job.company,
      companyPage: job.companyPage || "",
      industries: job.industries || [],
      location: job.location,
      contractTypes: job.contractTypes || [],
      salary: job.salary || "",
      applicationDeadline: job.applicationDeadline || "",
      applicationLink: job.applicationLink || "",
      isActive: job.isActive,
    });
  };

  const resetForm = () => {
    setEditingJob(null);
    form.reset({
      role: "",
      company: "",
      companyPage: "",
      industries: [],
      location: "",
      contractTypes: [],
      salary: "",
      applicationDeadline: "",
      applicationLink: "",
      isActive: true,
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation('/admin')}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Dashboard
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Hidden Jobs Board</h1>
          <p className="text-gray-600 mt-2">Manage exclusive job opportunities for Pollen users</p>
        </div>
        <Dialog open={isCreateDialogOpen || !!editingJob} onOpenChange={(open) => {
          if (!open) {
            setIsCreateDialogOpen(false);
            resetForm();
          } else if (!editingJob) {
            setIsCreateDialogOpen(true);
          }
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Hidden Job
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingJob ? "Edit Hidden Job" : "Create New Hidden Job"}</DialogTitle>
              <DialogDescription>
                Add exclusive job opportunities that are only visible to Pollen users.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Role *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Marketing Assistant" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Foster Group" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="companyPage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Page URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://company.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="industries"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Industries * (Select multiple)</FormLabel>
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-2">
                            {field.value.map((industry: string) => (
                              <Badge key={industry} variant="secondary" className="flex items-center gap-1">
                                {industry}
                                <X 
                                  className="w-3 h-3 cursor-pointer" 
                                  onClick={() => {
                                    const newValue = field.value.filter((i: string) => i !== industry);
                                    field.onChange(newValue);
                                  }}
                                />
                              </Badge>
                            ))}
                          </div>
                          <Select 
                            onValueChange={(value) => {
                              if (!field.value.includes(value)) {
                                field.onChange([...field.value, value]);
                              }
                            }}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select industries" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {INDUSTRY_OPTIONS.filter(option => !field.value.includes(option)).map((industry) => (
                                <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. London, Newcastle" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contractTypes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contract Types * (Select multiple)</FormLabel>
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-2">
                            {field.value.map((contractType: string) => (
                              <Badge key={contractType} variant="secondary" className="flex items-center gap-1">
                                {contractType}
                                <X 
                                  className="w-3 h-3 cursor-pointer" 
                                  onClick={() => {
                                    const newValue = field.value.filter((c: string) => c !== contractType);
                                    field.onChange(newValue);
                                  }}
                                />
                              </Badge>
                            ))}
                          </div>
                          <Select 
                            onValueChange={(value) => {
                              if (!field.value.includes(value)) {
                                field.onChange([...field.value, value]);
                              }
                            }}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select contract types" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {CONTRACT_TYPE_OPTIONS.filter(option => !field.value.includes(option)).map((contractType) => (
                                <SelectItem key={contractType} value={contractType}>{contractType}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="salary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Salary</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. £25,000 - £30,000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="applicationDeadline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Application Deadline</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="applicationLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Application Link</FormLabel>
                        <FormControl>
                          <Input placeholder="https://company.com/apply" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex flex-wrap gap-6">
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Active</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsCreateDialogOpen(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createJobMutation.isPending || updateJobMutation.isPending}
                  >
                    {createJobMutation.isPending || updateJobMutation.isPending ? "Saving..." : editingJob ? "Update Job" : "Create Job"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600">
          Showing {(hiddenJobs as HiddenJob[]).length} hidden job{(hiddenJobs as HiddenJob[]).length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Jobs Table */}
      {(hiddenJobs as HiddenJob[]).length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hidden jobs yet</h3>
            <p className="text-gray-600 mb-4">Create your first hidden job to get started.</p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Hidden Job
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 font-medium text-gray-900 w-[280px]">Role</th>
                <th className="text-left p-4 font-medium text-gray-900 w-[180px]">Company</th>
                <th className="text-left p-4 font-medium text-gray-900 w-[160px]">Industries</th>
                <th className="text-left p-4 font-medium text-gray-900 w-[140px]">Location</th>
                <th className="text-left p-4 font-medium text-gray-900 w-[100px]">Type</th>
                <th className="text-left p-4 font-medium text-gray-900 w-[120px]">Salary</th>
                <th className="text-left p-4 font-medium text-gray-900 w-[100px]">Status</th>
                <th className="text-left p-4 font-medium text-gray-900 w-[180px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(hiddenJobs as HiddenJob[]).map((job: HiddenJob) => (
                <tr key={job.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Building2 className="w-4 h-4 text-gray-600 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-gray-900 text-sm">{job.role}</h3>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-left">
                      {job.companyPage ? (
                        <a
                          href={job.companyPage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-900 font-medium hover:text-blue-600 hover:underline cursor-pointer text-sm"
                        >
                          {job.company}
                        </a>
                      ) : (
                        <span className="text-gray-900 font-medium text-sm">{job.company}</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {job.industries?.slice(0, 2).map((industry: string) => (
                        <Badge key={industry} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                          {industry}
                        </Badge>
                      ))}
                      {job.industries && job.industries.length > 2 && (
                        <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                          +{job.industries.length - 2}
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-gray-600">
                      <MapPin className="w-3 h-3" />
                      <span className="text-sm">{job.location}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {job.contractTypes?.slice(0, 1).map((contractType: string) => (
                        <Badge key={contractType} variant="outline" className="text-xs">
                          {contractType}
                        </Badge>
                      ))}
                      {job.contractTypes && job.contractTypes.length > 1 && (
                        <Badge variant="outline" className="text-xs">
                          +{job.contractTypes.length - 1}
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-gray-900">
                      {job.salary || "Not specified"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1">
                        {job.isActive ? (
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        ) : (
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        )}
                        <span className="text-xs text-gray-600">
                          {job.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      {job.clicks && (
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-600">{job.clicks}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {job.applicationLink && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(job.applicationLink, '_blank')}
                          className="text-gray-600 hover:text-blue-600"
                          title="Open application link"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEdit(job)}
                        className="text-gray-600 hover:text-[#E2007A]"
                        title="Edit job"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this job?")) {
                            deleteJobMutation.mutate(job.id);
                          }
                        }}
                        className="text-gray-600 hover:text-red-600"
                        title="Delete job"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}