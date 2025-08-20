import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Mail, 
  Bell,
  Shield,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Save
} from "lucide-react";

export default function PersonalSettings() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [personalData, setPersonalData] = useState({
    firstName: "Demo",
    lastName: "Employer",
    email: "demo@employer.com",
    pronouns: "they/them",
    phone: "",
    jobTitle: "Hiring Manager",
    notifications: {
      emailApplications: true,
      emailInterviews: true,
      emailMessages: true,
      emailWeeklyDigest: false,
      pushApplications: true,
      pushInterviews: true,
      pushMessages: false
    },
    privacy: {
      profileVisibility: "company_only",
      showEmail: false,
      showPhone: false
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings updated",
        description: "Your personal settings have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const pronounOptions = [
    "she/her",
    "he/him", 
    "they/them",
    "she/they",
    "he/they",
    "Prefer not to say"
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pt-8 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{fontFamily: 'Sora'}}>
            Personal Settings
          </h1>
          <p className="text-gray-600" style={{fontFamily: 'Poppins'}}>
            Manage your personal account information and preferences
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

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2" style={{fontFamily: 'Sora'}}>
            <User className="w-5 h-5 text-pink-600" />
            <span>Personal Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
              <Input
                id="firstName"
                value={personalData.firstName}
                onChange={(e) => setPersonalData({...personalData, firstName: e.target.value})}
                className="focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                style={{fontFamily: 'Poppins'}}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
              <Input
                id="lastName"
                value={personalData.lastName}
                onChange={(e) => setPersonalData({...personalData, lastName: e.target.value})}
                className="focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                style={{fontFamily: 'Poppins'}}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={personalData.email}
                onChange={(e) => setPersonalData({...personalData, email: e.target.value})}
                className="focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                style={{fontFamily: 'Poppins'}}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">Phone Number (Optional)</Label>
              <Input
                id="phone"
                type="tel"
                value={personalData.phone}
                onChange={(e) => setPersonalData({...personalData, phone: e.target.value})}
                className="focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                style={{fontFamily: 'Poppins'}}
                placeholder="+44 20 1234 5678"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pronouns" className="text-sm font-medium">Pronouns</Label>
              <Select 
                value={personalData.pronouns} 
                onValueChange={(value) => setPersonalData({...personalData, pronouns: value})}
              >
                <SelectTrigger className="focus:ring-2 focus:ring-pink-500 focus:border-pink-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pronounOptions.map((pronoun) => (
                    <SelectItem key={pronoun} value={pronoun}>{pronoun}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobTitle" className="text-sm font-medium">Job Title</Label>
              <Input
                id="jobTitle"
                value={personalData.jobTitle}
                onChange={(e) => setPersonalData({...personalData, jobTitle: e.target.value})}
                className="focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                style={{fontFamily: 'Poppins'}}
                placeholder="e.g. Hiring Manager, HR Director"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2" style={{fontFamily: 'Sora'}}>
            <Bell className="w-5 h-5 text-pink-600" />
            <span>Notification Preferences</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900" style={{fontFamily: 'Sora'}}>Email Notifications</h4>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">New Applications</Label>
                  <p className="text-xs text-gray-500">Get notified when candidates apply to your jobs</p>
                </div>
                <Switch
                  checked={personalData.notifications.emailApplications}
                  onCheckedChange={(checked) => 
                    setPersonalData({
                      ...personalData,
                      notifications: {...personalData.notifications, emailApplications: checked}
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Interview Scheduling</Label>
                  <p className="text-xs text-gray-500">Updates about interview confirmations and changes</p>
                </div>
                <Switch
                  checked={personalData.notifications.emailInterviews}
                  onCheckedChange={(checked) => 
                    setPersonalData({
                      ...personalData,
                      notifications: {...personalData.notifications, emailInterviews: checked}
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Direct Messages</Label>
                  <p className="text-xs text-gray-500">Messages from candidates and team members</p>
                </div>
                <Switch
                  checked={personalData.notifications.emailMessages}
                  onCheckedChange={(checked) => 
                    setPersonalData({
                      ...personalData,
                      notifications: {...personalData.notifications, emailMessages: checked}
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Weekly Digest</Label>
                  <p className="text-xs text-gray-500">Summary of hiring activity and platform updates</p>
                </div>
                <Switch
                  checked={personalData.notifications.emailWeeklyDigest}
                  onCheckedChange={(checked) => 
                    setPersonalData({
                      ...personalData,
                      notifications: {...personalData.notifications, emailWeeklyDigest: checked}
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h4 className="font-medium text-gray-900" style={{fontFamily: 'Sora'}}>Push Notifications</h4>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">New Applications</Label>
                  <p className="text-xs text-gray-500">Instant notifications for new candidate applications</p>
                </div>
                <Switch
                  checked={personalData.notifications.pushApplications}
                  onCheckedChange={(checked) => 
                    setPersonalData({
                      ...personalData,
                      notifications: {...personalData.notifications, pushApplications: checked}
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Interview Updates</Label>
                  <p className="text-xs text-gray-500">Confirmations, cancellations, and reschedules</p>
                </div>
                <Switch
                  checked={personalData.notifications.pushInterviews}
                  onCheckedChange={(checked) => 
                    setPersonalData({
                      ...personalData,
                      notifications: {...personalData.notifications, pushInterviews: checked}
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Messages</Label>
                  <p className="text-xs text-gray-500">New messages from candidates and team members</p>
                </div>
                <Switch
                  checked={personalData.notifications.pushMessages}
                  onCheckedChange={(checked) => 
                    setPersonalData({
                      ...personalData,
                      notifications: {...personalData.notifications, pushMessages: checked}
                    })
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2" style={{fontFamily: 'Sora'}}>
            <Shield className="w-5 h-5 text-pink-600" />
            <span>Privacy Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Profile Visibility</Label>
              <p className="text-xs text-gray-500 mb-3">
                Control who can see your profile information within your organisation
              </p>
              <Select 
                value={personalData.privacy.profileVisibility} 
                onValueChange={(value) => 
                  setPersonalData({
                    ...personalData,
                    privacy: {...personalData.privacy, profileVisibility: value}
                  })
                }
              >
                <SelectTrigger className="focus:ring-2 focus:ring-pink-500 focus:border-pink-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="company_only">Company Team Only</SelectItem>
                  <SelectItem value="admin_only">Administrators Only</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between pt-4">
              <div>
                <Label className="text-sm font-medium">Show Email Address</Label>
                <p className="text-xs text-gray-500">Allow team members to see your email address</p>
              </div>
              <Switch
                checked={personalData.privacy.showEmail}
                onCheckedChange={(checked) => 
                  setPersonalData({
                    ...personalData,
                    privacy: {...personalData.privacy, showEmail: checked}
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Show Phone Number</Label>
                <p className="text-xs text-gray-500">Allow team members to see your phone number</p>
              </div>
              <Switch
                checked={personalData.privacy.showPhone}
                onCheckedChange={(checked) => 
                  setPersonalData({
                    ...personalData,
                    privacy: {...personalData.privacy, showPhone: checked}
                  })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Information */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-gray-900" style={{fontFamily: 'Sora'}}>
              Personal Account Settings
            </h4>
            <p className="text-sm text-gray-700 mt-1" style={{fontFamily: 'Poppins'}}>
              Changes to your personal settings take effect immediately. 
              These preferences control how you interact with the Pollen platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}