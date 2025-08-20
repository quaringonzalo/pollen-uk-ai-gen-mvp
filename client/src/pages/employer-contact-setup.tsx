import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { 
  Mail, 
  Phone, 
  User, 
  UserPlus, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Trash2
} from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: {
    viewApplications: boolean;
    reviewCandidates: boolean;
    scheduleInterviews: boolean;
    provideFeedback: boolean;
  };
}

export default function EmployerContactSetup() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  
  const [primaryContact, setPrimaryContact] = useState({
    name: user?.firstName + " " + user?.lastName || "",
    email: user?.email || "",
    phone: "",
    jobTitle: "",
    department: ""
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    role: "",
    permissions: {
      viewApplications: true,
      reviewCandidates: false,
      scheduleInterviews: false,
      provideFeedback: false
    }
  });

  const [showTeamAccess, setShowTeamAccess] = useState(false);

  const handleSavePrimaryContact = () => {
    if (!primaryContact.name || !primaryContact.email) {
      toast({
        title: "Missing information",
        description: "Please provide at least name and email for the primary contact.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Contact information saved",
      description: "Primary hiring contact details have been updated successfully."
    });
  };

  const handleAddTeamMember = () => {
    if (!newMember.name || !newMember.email || !newMember.role) {
      toast({
        title: "Missing information", 
        description: "Please provide name, email, and role for the team member.",
        variant: "destructive"
      });
      return;
    }

    const member: TeamMember = {
      id: Date.now().toString(),
      ...newMember
    };

    setTeamMembers([...teamMembers, member]);
    setNewMember({
      name: "",
      email: "",
      role: "",
      permissions: {
        viewApplications: true,
        reviewCandidates: false,
        scheduleInterviews: false,
        provideFeedback: false
      }
    });

    toast({
      title: "Team member added",
      description: `${member.name} has been granted access to review applications.`
    });
  };

  const handleRemoveTeamMember = (id: string) => {
    setTeamMembers(teamMembers.filter(m => m.id !== id));
    toast({
      title: "Team member removed",
      description: "Access has been revoked successfully."
    });
  };

  const handleSaveAndContinue = () => {
    handleSavePrimaryContact();
    setTimeout(() => {
      setLocation("/employer-profile-checkpoints");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost"
                onClick={() => setLocation("/employer-profile-checkpoints")}
                style={{fontFamily: 'Sora'}}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold" style={{fontFamily: 'Sora'}}>Contact Information</h1>
                <p className="text-gray-600 mt-1" style={{fontFamily: 'Poppins'}}>
                  Set up your hiring contact details and team access
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Primary Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{fontFamily: 'Sora'}}>
              <User className="w-5 h-5 text-pink-600" />
              Primary Hiring Contact
            </CardTitle>
            <p className="text-gray-600 text-sm" style={{fontFamily: 'Poppins'}}>
              This person will be the main point of contact for candidate communications and hiring decisions.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contact-name" style={{fontFamily: 'Sora'}}>Full Name *</Label>
                <Input
                  id="contact-name"
                  value={primaryContact.name}
                  onChange={(e) => setPrimaryContact({...primaryContact, name: e.target.value})}
                  placeholder="Enter full name"
                  style={{fontFamily: 'Poppins'}}
                />
              </div>
              <div>
                <Label htmlFor="contact-email" style={{fontFamily: 'Sora'}}>Email Address *</Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={primaryContact.email}
                  onChange={(e) => setPrimaryContact({...primaryContact, email: e.target.value})}
                  placeholder="Enter email address"
                  style={{fontFamily: 'Poppins'}}
                />
              </div>
              <div>
                <Label htmlFor="contact-phone" style={{fontFamily: 'Sora'}}>Phone Number</Label>
                <Input
                  id="contact-phone"
                  type="tel"
                  value={primaryContact.phone}
                  onChange={(e) => setPrimaryContact({...primaryContact, phone: e.target.value})}
                  placeholder="Enter phone number"
                  style={{fontFamily: 'Poppins'}}
                />
              </div>
              <div>
                <Label htmlFor="contact-title" style={{fontFamily: 'Sora'}}>Job Title</Label>
                <Input
                  id="contact-title"
                  value={primaryContact.jobTitle}
                  onChange={(e) => setPrimaryContact({...primaryContact, jobTitle: e.target.value})}
                  placeholder="e.g. HR Manager, Talent Acquisition"
                  style={{fontFamily: 'Poppins'}}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="contact-department" style={{fontFamily: 'Sora'}}>Department</Label>
              <Input
                id="contact-department"
                value={primaryContact.department}
                onChange={(e) => setPrimaryContact({...primaryContact, department: e.target.value})}
                placeholder="e.g. Human Resources, Operations"
                style={{fontFamily: 'Poppins'}}
              />
            </div>
            <Button 
              onClick={handleSavePrimaryContact}
              className="bg-pink-600 hover:bg-pink-700"
              style={{fontFamily: 'Sora'}}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Save Contact Information
            </Button>
          </CardContent>
        </Card>

        {/* Team Access */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2" style={{fontFamily: 'Sora'}}>
                  <UserPlus className="w-5 h-5 text-blue-600" />
                  Team Member Access
                  <Badge variant="outline" className="ml-2">Optional</Badge>
                </CardTitle>
                <p className="text-gray-600 text-sm mt-1" style={{fontFamily: 'Poppins'}}>
                  Allow colleagues to help review applications and provide candidate feedback.
                </p>
              </div>
              <Switch
                checked={showTeamAccess}
                onCheckedChange={setShowTeamAccess}
              />
            </div>
          </CardHeader>
          {showTeamAccess && (
            <CardContent className="space-y-6">
              {/* Add New Team Member */}
              <div className="border rounded-lg p-4 bg-blue-50">
                <h4 className="font-medium text-blue-900 mb-3" style={{fontFamily: 'Sora'}}>
                  Add Team Member
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <Input
                    placeholder="Full name"
                    value={newMember.name}
                    onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                    style={{fontFamily: 'Poppins'}}
                  />
                  <Input
                    placeholder="Email address"
                    type="email"
                    value={newMember.email}
                    onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                    style={{fontFamily: 'Poppins'}}
                  />
                  <Input
                    placeholder="Role/Title"
                    value={newMember.role}
                    onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                    style={{fontFamily: 'Poppins'}}
                  />
                </div>
                
                <div className="space-y-3 mb-4">
                  <Label style={{fontFamily: 'Sora'}}>Permissions</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="view-applications"
                        checked={newMember.permissions.viewApplications}
                        onCheckedChange={(checked) => 
                          setNewMember({
                            ...newMember, 
                            permissions: {...newMember.permissions, viewApplications: checked}
                          })
                        }
                      />
                      <Label htmlFor="view-applications" className="text-sm" style={{fontFamily: 'Poppins'}}>
                        View Applications
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="review-candidates"
                        checked={newMember.permissions.reviewCandidates}
                        onCheckedChange={(checked) => 
                          setNewMember({
                            ...newMember, 
                            permissions: {...newMember.permissions, reviewCandidates: checked}
                          })
                        }
                      />
                      <Label htmlFor="review-candidates" className="text-sm" style={{fontFamily: 'Poppins'}}>
                        Review Candidates
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="schedule-interviews"
                        checked={newMember.permissions.scheduleInterviews}
                        onCheckedChange={(checked) => 
                          setNewMember({
                            ...newMember, 
                            permissions: {...newMember.permissions, scheduleInterviews: checked}
                          })
                        }
                      />
                      <Label htmlFor="schedule-interviews" className="text-sm" style={{fontFamily: 'Poppins'}}>
                        Schedule Interviews
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="provide-feedback"
                        checked={newMember.permissions.provideFeedback}
                        onCheckedChange={(checked) => 
                          setNewMember({
                            ...newMember, 
                            permissions: {...newMember.permissions, provideFeedback: checked}
                          })
                        }
                      />
                      <Label htmlFor="provide-feedback" className="text-sm" style={{fontFamily: 'Poppins'}}>
                        Provide Feedback
                      </Label>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleAddTeamMember}
                  variant="outline"
                  className="border-blue-300 text-blue-700 hover:bg-blue-100"
                  style={{fontFamily: 'Sora'}}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Team Member
                </Button>
              </div>

              {/* Existing Team Members */}
              {teamMembers.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3" style={{fontFamily: 'Sora'}}>
                    Team Members ({teamMembers.length})
                  </h4>
                  <div className="space-y-3">
                    {teamMembers.map((member) => (
                      <div key={member.id} className="border rounded-lg p-4 bg-white">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-gray-600" />
                              </div>
                              <div>
                                <h5 className="font-medium" style={{fontFamily: 'Sora'}}>
                                  {member.name}
                                </h5>
                                <p className="text-sm text-gray-600" style={{fontFamily: 'Poppins'}}>
                                  {member.email} • {member.role}
                                </p>
                              </div>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {Object.entries(member.permissions).map(([key, value]) => 
                                value && (
                                  <Badge key={key} variant="secondary" className="text-xs">
                                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                                  </Badge>
                                )
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveTeamMember(member.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Team Access Benefits */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-2" style={{fontFamily: 'Sora'}}>
                  <Shield className="w-4 h-4 inline mr-2" />
                  Team Access Benefits
                </h4>
                <ul className="text-sm text-green-800 space-y-1" style={{fontFamily: 'Poppins'}}>
                  <li>• Distribute hiring workload across your team</li>
                  <li>• Get diverse perspectives on candidates</li>
                  <li>• Maintain hiring momentum even when you're unavailable</li>
                  <li>• Secure access controls with granular permissions</li>
                </ul>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <Button 
            variant="outline"
            onClick={() => setLocation("/employer-profile")}
            style={{fontFamily: 'Sora'}}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </Button>
          <Button 
            onClick={handleSaveAndContinue}
            className="bg-pink-600 hover:bg-pink-700"
            style={{fontFamily: 'Sora'}}
          >
            Save & Continue
            <CheckCircle className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}