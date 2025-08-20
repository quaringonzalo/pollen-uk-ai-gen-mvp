import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import AccountDeletionDialog from "@/components/account-deletion-dialog";
import { 
  Building, 
  MapPin, 
  Users, 
  Calendar, 
  Globe, 
  Linkedin,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Save,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Bell,
  Lock,
  Shield
} from "lucide-react";

export default function EmployerAccountSettings() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [companyData, setCompanyData] = useState({
    companyName: "NextGen Marketing Solutions",
    industries: ["Marketing & Advertising", "Creative Services"],
    customIndustry: "",
    location: "London, UK",
    companySize: "51-200 employees", 
    foundedYear: "2018",
    website: "https://nextgenmarketing.co.uk",
    linkedinUrl: "https://linkedin.com/company/nextgen-marketing-solutions",
    careersPageUrl: "https://nextgenmarketing.co.uk/careers",
    glassdoorUrl: "https://glassdoor.co.uk/Overview/Working-at-NextGen-Marketing"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isIndustriesExpanded, setIsIndustriesExpanded] = useState(false);
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Notification settings for employers
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    applicationUpdates: true,
    interviewReminders: true,
    messageNotifications: true,
    teamUpdates: true,
    platformUpdates: true,
    marketingEmails: false,
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Team management state
  const [teamMembers, setTeamMembers] = useState([
    {
      id: 1,
      email: "sarah.johnson@techflow.com",
      firstName: "Sarah",
      lastName: "Johnson",
      jobTitle: "Head of Talent",
      role: "admin",
      status: "active",
      invitedAt: "2024-01-15",
      activatedAt: "2024-01-15",
      lastActiveAt: "2024-07-28"
    },
    {
      id: 2,
      email: "mike.davies@techflow.com",
      firstName: "Mike", 
      lastName: "Davies",
      jobTitle: "Hiring Manager",
      role: "hiring_manager",
      status: "active",
      invitedAt: "2024-02-10",
      activatedAt: "2024-02-12",
      lastActiveAt: "2024-07-27"
    },
    {
      id: 3,
      email: "emma.wilson@techflow.com",
      status: "pending",
      role: "hiring_manager",
      invitedAt: "2024-07-25"
    }
  ]);

  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [newInvite, setNewInvite] = useState({
    email: "",
    role: "hiring_manager",
    personalMessage: ""
  });

  // Simplified role templates
  const roleTemplates = {
    admin: {
      label: 'Administrator',
      description: 'Full access to hiring and team management'
    },
    hiring_manager: {
      label: 'Hiring Manager', 
      description: 'Can manage jobs and review candidates'
    },
    team_member: {
      label: 'Team Member',
      description: 'Can view and interview candidates'
    }
  };

  // Team management handlers
  const handleInviteTeamMember = () => {
    if (!newInvite.email) {
      toast({
        title: "Email required",
        description: "Please enter an email address for the invitation.",
        variant: "destructive"
      });
      return;
    }

    const newMember = {
      id: teamMembers.length + 1,
      email: newInvite.email,
      role: newInvite.role,
      status: "pending" as const,
      invitedAt: new Date().toISOString().split('T')[0],
      personalMessage: newInvite.personalMessage
    };

    setTeamMembers([...teamMembers, newMember]);
    setNewInvite({ email: "", role: "hiring_manager", personalMessage: "" });
    setShowInviteDialog(false);

    toast({
      title: "Invitation sent",
      description: `Team invitation sent to ${newInvite.email}`,
    });
  };

  const handleRemoveTeamMember = (memberId: number) => {
    setTeamMembers(teamMembers.filter(member => member.id !== memberId));
    toast({
      title: "Team member removed",
      description: "The team member has been removed from your account.",
    });
  };

  const industryOptions = [
    "Marketing & Advertising",
    "Creative Services", 
    "Digital Media",
    "Technology & Software",
    "Finance & Banking",
    "Healthcare",
    "Education",
    "Retail & E-commerce",
    "Manufacturing",
    "Consulting",
    "Media & Entertainment",
    "Non-Profit",
    "Professional Services",
    "Real Estate",
    "Construction",
    "Transportation & Logistics",
    "Energy & Utilities",
    "Food & Beverage",
    "Travel & Tourism",
    "Sports & Recreation",
    "Government & Public Sector",
    "Legal Services",
    "Insurance",
    "Telecommunications",
    "Pharmaceuticals",
    "Automotive",
    "Agriculture",
    "Fashion & Beauty",
    "Other"
  ];

  const companySizeOptions = [
    "1-10 employees",
    "11-50 employees", 
    "51-200 employees",
    "201-500 employees",
    "501-1000 employees",
    "1000+ employees"
  ];

  const handleSave = async () => {
    setIsSubmitting(true);
    
    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Account Updated",
        description: "Your account information has been saved and is now live.",
      });
      
      // Return to profile
      setLocation('/employer-profile');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleIndustryToggle = (industry: string) => {
    if (industry === "Other") {
      setShowOtherInput(true);
      return;
    }
    
    const currentIndustries = companyData.industries || [];
    const isSelected = currentIndustries.includes(industry);
    
    if (isSelected) {
      setCompanyData({
        ...companyData,
        industries: currentIndustries.filter(i => i !== industry)
      });
    } else {
      setCompanyData({
        ...companyData,
        industries: [...currentIndustries, industry]
      });
    }
  };

  const handleCustomIndustryAdd = () => {
    if (companyData.customIndustry.trim() && !companyData.industries?.includes(companyData.customIndustry.trim())) {
      setCompanyData({
        ...companyData, 
        industries: [...(companyData.industries || []), companyData.customIndustry.trim()],
        customIndustry: ""
      });
    }
    setShowOtherInput(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pt-8 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{fontFamily: 'Sora'}}>
            Company Settings
          </h1>
          <p className="text-gray-600" style={{fontFamily: 'Poppins'}}>
            Manage your company information and basic details
          </p>
        </div>
        
        <Button 
          onClick={handleSave}
          disabled={isSubmitting}
          className="bg-pink-600 hover:bg-pink-700 text-white"
          style={{fontFamily: 'Sora'}}
        >
          {isSubmitting ? (
            <>
              <AlertCircle className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2" style={{fontFamily: 'Sora'}}>
            <Building className="w-5 h-5 text-pink-600" />
            <span>Company Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-sm font-medium">Company Name</Label>
              <Input
                id="companyName"
                value={companyData.companyName}
                onChange={(e) => setCompanyData({...companyData, companyName: e.target.value})}
                className="focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                style={{fontFamily: 'Poppins'}}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium">Location</Label>
              <Input
                id="location"
                value={companyData.location}
                onChange={(e) => setCompanyData({...companyData, location: e.target.value})}
                className="focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                style={{fontFamily: 'Poppins'}}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companySize" className="text-sm font-medium">Company Size</Label>
              <Select 
                value={companyData.companySize} 
                onValueChange={(value) => setCompanyData({...companyData, companySize: value})}
              >
                <SelectTrigger className="focus:ring-2 focus:ring-pink-500 focus:border-pink-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {companySizeOptions.map((size) => (
                    <SelectItem key={size} value={size}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="foundedYear" className="text-sm font-medium">Founded Year</Label>
              <Input
                id="foundedYear"
                value={companyData.foundedYear}
                onChange={(e) => setCompanyData({...companyData, foundedYear: e.target.value})}
                className="focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                style={{fontFamily: 'Poppins'}}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website" className="text-sm font-medium">Website</Label>
              <Input
                id="website"
                type="url"
                value={companyData.website}
                onChange={(e) => setCompanyData({...companyData, website: e.target.value})}
                className="focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                style={{fontFamily: 'Poppins'}}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedinUrl" className="text-sm font-medium">LinkedIn URL</Label>
              <Input
                id="linkedinUrl"
                type="url"
                value={companyData.linkedinUrl}
                onChange={(e) => setCompanyData({...companyData, linkedinUrl: e.target.value})}
                className="focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                style={{fontFamily: 'Poppins'}}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="careersPageUrl" className="text-sm font-medium">Careers Page URL</Label>
              <Input
                id="careersPageUrl"
                type="url"
                value={companyData.careersPageUrl}
                onChange={(e) => setCompanyData({...companyData, careersPageUrl: e.target.value})}
                className="focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                style={{fontFamily: 'Poppins'}}
                placeholder="https://yourcompany.com/careers"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="glassdoorUrl" className="text-sm font-medium">Glassdoor URL</Label>
              <Input
                id="glassdoorUrl"
                type="url"
                value={companyData.glassdoorUrl}
                onChange={(e) => setCompanyData({...companyData, glassdoorUrl: e.target.value})}
                className="focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                style={{fontFamily: 'Poppins'}}
                placeholder="https://glassdoor.co.uk/Overview/Working-at-Your-Company"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Industries</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsIndustriesExpanded(!isIndustriesExpanded)}
                className="text-pink-600 hover:text-pink-700 hover:bg-pink-50"
              >
                {isIndustriesExpanded ? (
                  <>
                    <ChevronUp className="w-4 h-4 mr-1" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 mr-1" />
                    Show All Industries
                  </>
                )}
              </Button>
            </div>
            
            <p className="text-xs text-gray-500 mb-3">
              Select all industries that apply to your company. These help job seekers find relevant opportunities.
            </p>

            {/* Currently Selected Industries */}
            {companyData.industries && companyData.industries.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                <Label className="text-xs text-gray-500">Selected:</Label>
                {companyData.industries.map((industry) => (
                  <Badge 
                    key={industry} 
                    variant="outline" 
                    className="border-pink-200 text-pink-700 bg-pink-50"
                  >
                    {industry}
                    <button
                      onClick={() => handleIndustryToggle(industry)}
                      className="ml-1 text-pink-500 hover:text-pink-700"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Expandable Industry Grid */}
            {isIndustriesExpanded && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {industryOptions.slice(0, -1).map((industry) => {
                  const isSelected = companyData.industries?.includes(industry);
                  return (
                    <button
                      key={industry}
                      onClick={() => handleIndustryToggle(industry)}
                      className={`p-3 text-sm text-left border rounded-lg transition-colors ${
                        isSelected
                          ? 'border-pink-500 bg-pink-50 text-pink-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                      style={{fontFamily: 'Poppins'}}
                    >
                      {industry}
                    </button>
                  );
                })}
                
                {/* Other Option */}
                <button
                  onClick={() => handleIndustryToggle("Other")}
                  className="p-3 text-sm text-left border border-gray-200 hover:border-gray-300 text-gray-700 rounded-lg transition-colors flex items-center"
                  style={{fontFamily: 'Poppins'}}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Custom Industry
                </button>
              </div>
            )}

            {/* Custom Industry Input */}
            {showOtherInput && (
              <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <Label className="text-sm font-medium mb-2 block">Add Custom Industry</Label>
                <div className="flex gap-2">
                  <Input
                    value={companyData.customIndustry}
                    onChange={(e) => setCompanyData({...companyData, customIndustry: e.target.value})}
                    placeholder="Enter your industry"
                    className="flex-1"
                    style={{fontFamily: 'Poppins'}}
                  />
                  <Button
                    type="button"
                    onClick={handleCustomIndustryAdd}
                    size="sm"
                    className="bg-pink-600 hover:bg-pink-700"
                    disabled={!companyData.customIndustry.trim()}
                  >
                    Add
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowOtherInput(false);
                      setCompanyData({...companyData, customIndustry: ""});
                    }}
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{fontFamily: 'Sora'}}>
            <Bell className="w-5 h-5 text-pink-600" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Email Notifications</Label>
                <p className="text-xs text-gray-500" style={{fontFamily: 'Poppins'}}>
                  Receive notifications via email
                </p>
              </div>
              <Switch
                checked={notificationSettings.emailNotifications}
                onCheckedChange={(checked) => 
                  setNotificationSettings(prev => ({...prev, emailNotifications: checked}))
                }
              />
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Application Updates</Label>
                <Switch
                  checked={notificationSettings.applicationUpdates}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({...prev, applicationUpdates: checked}))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">Interview Reminders</Label>
                <Switch
                  checked={notificationSettings.interviewReminders}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({...prev, interviewReminders: checked}))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">Message Notifications</Label>
                <Switch
                  checked={notificationSettings.messageNotifications}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({...prev, messageNotifications: checked}))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">Team Updates</Label>
                <Switch
                  checked={notificationSettings.teamUpdates}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({...prev, teamUpdates: checked}))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">Platform Updates</Label>
                <Switch
                  checked={notificationSettings.platformUpdates}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({...prev, platformUpdates: checked}))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">Marketing Emails</Label>
                <Switch
                  checked={notificationSettings.marketingEmails}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({...prev, marketingEmails: checked}))
                  }
                />
              </div>
            </div>
          </div>
          
          <Button 
            className="bg-pink-600 hover:bg-pink-700"
            style={{fontFamily: 'Sora'}}
          >
            <Save className="w-4 h-4 mr-2" />
            Update Notification Preferences
          </Button>
        </CardContent>
      </Card>

      {/* Password Change */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{fontFamily: 'Sora'}}>
            <Lock className="w-5 h-5 text-pink-600" />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="currentPassword" className="text-sm font-medium">
                Current Password
              </Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                className="mt-1"
                style={{fontFamily: 'Poppins'}}
              />
            </div>
            <div>
              <Label htmlFor="newPassword" className="text-sm font-medium">
                New Password
              </Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                className="mt-1"
                style={{fontFamily: 'Poppins'}}
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm New Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                className="mt-1"
                style={{fontFamily: 'Poppins'}}
              />
            </div>
          </div>
          
          <Button 
            className="bg-pink-600 hover:bg-pink-700"
            style={{fontFamily: 'Sora'}}
            disabled={!passwordData.currentPassword || !passwordData.newPassword || passwordData.newPassword !== passwordData.confirmPassword}
          >
            <Lock className="w-4 h-4 mr-2" />
            Update Password
          </Button>
        </CardContent>
      </Card>

      {/* Team Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between" style={{fontFamily: 'Sora'}}>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-pink-600" />
              Team Management
            </div>
            <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-pink-600 hover:bg-pink-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Invite Team Member
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle style={{fontFamily: 'Sora'}}>Invite Team Member</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newInvite.email}
                      onChange={(e) => setNewInvite({...newInvite, email: e.target.value})}
                      placeholder="colleague@company.com"
                      className="mt-1"
                      style={{fontFamily: 'Poppins'}}
                    />
                  </div>
                  <div>
                    <Label htmlFor="role" className="text-sm font-medium">Role</Label>
                    <Select 
                      value={newInvite.role} 
                      onValueChange={(value) => setNewInvite({...newInvite, role: value})}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(roleTemplates).map(([key, template]) => (
                          <SelectItem key={key} value={key}>
                            <div>
                              <div className="font-medium">{template.label}</div>
                              <div className="text-xs text-gray-500">{template.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="message" className="text-sm font-medium">Personal Message (Optional)</Label>
                    <Textarea
                      id="message"
                      value={newInvite.personalMessage}
                      onChange={(e) => setNewInvite({...newInvite, personalMessage: e.target.value})}
                      placeholder="Add a personal message to the invitation..."
                      className="mt-1"
                      style={{fontFamily: 'Poppins'}}
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button 
                      onClick={handleInviteTeamMember}
                      className="bg-pink-600 hover:bg-pink-700 flex-1"
                      style={{fontFamily: 'Sora'}}
                    >
                      Send Invitation
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowInviteDialog(false)}
                      style={{fontFamily: 'Sora'}}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                      {member.firstName ? (
                        <span className="text-pink-600 font-medium text-sm">
                          {member.firstName[0]}{member.lastName?.[0] || ''}
                        </span>
                      ) : (
                        <Users className="w-5 h-5 text-pink-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium" style={{fontFamily: 'Sora'}}>
                          {member.firstName && member.lastName 
                            ? `${member.firstName} ${member.lastName}`
                            : member.email
                          }
                        </span>
                        <Badge 
                          variant={member.status === 'active' ? 'default' : 'secondary'}
                          className={member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}
                        >
                          {member.status === 'pending' ? 'Invitation Pending' : 'Active'}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-4" style={{fontFamily: 'Poppins'}}>
                        <span>{member.email}</span>
                        <span>•</span>
                        <span>{roleTemplates[member.role as keyof typeof roleTemplates]?.label}</span>
                        {member.jobTitle && (
                          <>
                            <span>•</span>
                            <span>{member.jobTitle}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveTeamMember(member.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            
            {teamMembers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p style={{fontFamily: 'Poppins'}}>No team members yet. Invite colleagues to collaborate on hiring.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-gray-900" style={{fontFamily: 'Sora'}}>
              Account Settings
            </h4>
            <p className="text-sm text-gray-700 mt-1" style={{fontFamily: 'Poppins'}}>
              Changes to your company information take effect immediately. 
              Notification and password changes help secure your account and keep you informed.
            </p>
          </div>
        </div>
      </div>

      {/* Account Deletion */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700" style={{fontFamily: 'Sora'}}>
            <Trash2 className="w-5 h-5" />
            Delete Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600 mb-4" style={{fontFamily: 'Poppins'}}>
            Once you delete your account, there is no going back. All your company profile, 
            job postings, and application data will be permanently deleted.
          </p>
          <Button 
            variant="destructive" 
            onClick={() => setShowDeleteDialog(true)}
            style={{fontFamily: 'Sora'}}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Account
          </Button>
        </CardContent>
      </Card>

      <AccountDeletionDialog 
        open={showDeleteDialog} 
        onOpenChange={setShowDeleteDialog} 
      />
    </div>
  );
}