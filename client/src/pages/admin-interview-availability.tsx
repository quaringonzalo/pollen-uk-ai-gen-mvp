import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useLocation, useParams } from "wouter";
import { 
  ArrowLeft, Calendar, User, MapPin, Mail, 
  Video, Phone, Building, UserCheck, MessageSquare,
  Copy, CheckCircle, Link2
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function AdminInterviewAvailability() {
  const { candidateId } = useParams<{ candidateId: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [calendlyLinkCopied, setCalendlyLinkCopied] = useState(false);
  
  // Default Calendly link - in production this would come from settings
  const defaultCalendlyLink = "https://calendly.com/pollen-team/pollen-interview";
  
  const [availabilityForm, setAvailabilityForm] = useState({
    interviewType: 'video' as 'video' | 'phone' | 'in-person',
    interviewers: ['Holly Saunders'] as string[],
    calendlyLink: defaultCalendlyLink
  });

  const pollenTeamMembers = [
    'Holly Saunders',
    'Karen Whitelaw',
    'Sophie O\'Brien'
  ];

  // Function to copy Calendly link to clipboard
  const copyCalendlyLink = async () => {
    try {
      await navigator.clipboard.writeText(availabilityForm.calendlyLink);
      setCalendlyLinkCopied(true);
      toast({
        title: "Link Copied",
        description: "Calendly link has been copied to clipboard",
      });
      setTimeout(() => setCalendlyLinkCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Could not copy link to clipboard",
        variant: "destructive",
      });
    }
  };

  // Mock candidate data
  const getCandidateInfo = (id: string) => {
    if (id === "21") {
      return {
        name: "James Mitchell",
        email: "james.mitchell@email.com",
        location: "London, UK",
        pronouns: "He/Him",
        position: "Marketing Assistant",
        company: "BrightTech Solutions",
        profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
      };
    } else if (id === "22") {
      return {
        name: "Emma Thompson",
        email: "emma.thompson@email.com", 
        location: "Bristol, UK",
        pronouns: "She/Her",
        position: "Marketing Assistant",
        company: "BrightTech Solutions",
        profilePicture: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
      };
    } else {
      return {
        name: "Alex Chen",
        email: "alex.chen@email.com",
        location: "Birmingham, UK", 
        pronouns: "They/Them",
        position: "Marketing Assistant",
        company: "BrightTech Solutions",
        profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
      };
    }
  };

  const candidateInfo = getCandidateInfo(candidateId);

  // Submit availability mutation
  const submitAvailabilityMutation = useMutation({
    mutationFn: async (data: typeof availabilityForm) => {
      return await apiRequest("POST", `/api/admin/interviews/${candidateId}/availability`, {
        ...data,
        submittedBy: "Holly",
        submittedAt: new Date().toISOString(),
        candidateName: candidateInfo.name
      });
    },
    onSuccess: () => {
      toast({
        title: "Interview Invitation Sent",
        description: `Interview invitation has been sent to ${candidateInfo.name}`,
      });
      setTimeout(() => setLocation('/admin/job-applicants-grid/1'), 1500);
    },
  });

  const handleSubmitAvailability = () => {
    if (!availabilityForm.calendlyLink.trim()) {
      toast({
        title: "Please provide Calendly link",
        description: "Calendly link is required to send interview invitation",
        variant: "destructive"
      });
      return;
    }
    
    submitAvailabilityMutation.mutate(availabilityForm);
  };

  const getInterviewTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'phone':
        return <Phone className="w-4 h-4" />;
      case 'in-person':
        return <Building className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => setLocation('/admin/job-applicants-grid/1')}
                className="text-gray-600"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Candidates
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Schedule Pollen Interview</h1>
                <p className="text-gray-600">Send interview invitation to {candidateInfo.name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          
          {/* Candidate Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <img 
                  src={candidateInfo.profilePicture}
                  alt={candidateInfo.name}
                  className="w-12 h-12 rounded-full border"
                />
                <div>
                  <div className="font-semibold">{candidateInfo.name}</div>
                  <div className="text-sm text-gray-600 font-normal">
                    {candidateInfo.pronouns}
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  {candidateInfo.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {candidateInfo.location}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <User className="h-4 w-4 mr-2" />
                  Applied for: {candidateInfo.position} at {candidateInfo.company}
                </div>
                <div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLocation(`/admin/candidate-profile/${candidateId}`)}
                    className="w-full"
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    View Full Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

            {/* Calendly Scheduling */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link2 className="h-5 w-5 text-pink-600" />
                  Schedule Pollen Interview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Calendly Link
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={availabilityForm.calendlyLink}
                      onChange={(e) => setAvailabilityForm(prev => ({ ...prev, calendlyLink: e.target.value }))}
                      placeholder="https://calendly.com/your-username/interview"
                      className="flex-1"
                    />
                    <Button 
                      variant="outline" 
                      onClick={copyCalendlyLink}
                      className="shrink-0"
                    >
                      {calendlyLinkCopied ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Interviewer
                  </label>
                  <Select 
                    value={availabilityForm.interviewers[0]} 
                    onValueChange={(value) => 
                      setAvailabilityForm(prev => ({ ...prev, interviewers: [value] }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select interviewer" />
                    </SelectTrigger>
                    <SelectContent>
                      {pollenTeamMembers.map((member) => (
                        <SelectItem key={member} value={member}>
                          {member}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Email Template
                  </label>
                  <div className="bg-gray-50 border rounded-lg p-4">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      <strong>Hi {candidateInfo.name}</strong><br/><br/>
                      We're reaching out in relation to <strong>{candidateInfo.position}</strong> with <strong>{candidateInfo.company}</strong>. Thanks so much for your application! It would be great to have an informal chat to see if it's a good fit on both sides. Please use the following booking link:<br/><br/>
                      <span className="font-mono text-blue-600">{availabilityForm.calendlyLink}</span><br/><br/>
                      Look forward to speaking soon,<br/><br/>
                      Thanks<br/>
                      <strong>{availabilityForm.interviewers[0] || 'Pollen Team'}</strong>
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    This email will be sent to {candidateInfo.name} with the booking link
                  </p>
                </div>
              </CardContent>
            </Card>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-3 mt-8">
          <Button 
            variant="outline"
            onClick={() => setLocation('/admin/job-applicants-grid/1')}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmitAvailability}
            disabled={submitAvailabilityMutation.isPending}
            className="bg-pink-600 hover:bg-pink-700"
          >
            {submitAvailabilityMutation.isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sending...
              </>
            ) : (
              <>
                <MessageSquare className="w-4 h-4 mr-2" />
                Send Interview Invitation
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}