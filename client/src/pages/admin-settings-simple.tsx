import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ObjectUploader } from "@/components/ObjectUploader";
import { useToast } from "@/hooks/use-toast";
import { Edit2, Save, X, UserPlus, Trash2, Upload } from "lucide-react";
import type { UploadResult } from "@uppy/core";

export default function AdminSettings() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<'admin' | 'super_admin'>('admin');
  
  // Static profile data to avoid loading issues
  const currentUser = {
    id: 1,
    firstName: "Holly",
    lastName: "Saunders",
    email: "holly@pollen.co.uk",
    profileImageUrl: null,
    role: "super_admin" as const,
    createdAt: "2024-01-15T00:00:00.000Z",
    lastActive: "2025-01-18T20:10:00.000Z",
    status: "active" as const
  };

  // Form state
  const [formData, setFormData] = useState({
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    email: currentUser.email,
    profileImageUrl: currentUser.profileImageUrl || ""
  });

  // Static team members data
  const teamMembers = [
    {
      id: 2,
      firstName: "James",
      lastName: "Thompson",
      email: "james@pollen.co.uk",
      profileImageUrl: null,
      role: "admin" as const,
      createdAt: "2024-02-01T00:00:00.000Z",
      lastActive: "2025-01-18T19:45:00.000Z",
      status: "active" as const
    },
    {
      id: 3,
      firstName: "Sarah",
      lastName: "Wilson",
      email: "sarah@pollen.co.uk",
      profileImageUrl: null,
      role: "admin" as const,
      createdAt: "2024-02-15T00:00:00.000Z",
      lastActive: "2025-01-17T16:30:00.000Z",
      status: "active" as const
    }
  ];

  // Static pending invites
  const pendingInvites = [
    {
      id: 1,
      email: "alex@pollen.co.uk",
      role: "admin" as const,
      status: "pending" as const,
      invitedAt: "2025-01-15T00:00:00.000Z",
      invitedBy: "Holly Saunders"
    }
  ];

  const handleGetUploadParameters = async () => {
    try {
      const response = await fetch("/api/objects/upload", { method: "POST" });
      const data = await response.json();
      return {
        method: "PUT" as const,
        url: data.uploadURL,
      };
    } catch (error) {
      console.error("Upload parameter error:", error);
      throw error;
    }
  };

  const handleUploadComplete = async (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
    if (result.successful?.[0]?.uploadURL) {
      try {
        await fetch("/api/admin/profile-image", {
          method: "PUT",
          body: JSON.stringify({ profileImageURL: result.successful[0].uploadURL }),
          headers: { "Content-Type": "application/json" }
        });
        toast({
          title: "Profile picture updated",
          description: "Your profile picture has been updated successfully.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update profile picture. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleSave = async () => {
    try {
      await fetch("/api/admin/profile", {
        method: "PATCH",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" }
      });
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleInvite = async () => {
    if (inviteEmail && inviteRole) {
      try {
        await fetch("/api/admin/invite-team-member", {
          method: "POST",
          body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
          headers: { "Content-Type": "application/json" }
        });
        setInviteEmail("");
        setInviteRole("admin");
        toast({
          title: "Invitation sent",
          description: "Team member invitation has been sent successfully.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to send invitation. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleCancelInvite = async (inviteId: number) => {
    try {
      await fetch(`/api/admin/cancel-invite/${inviteId}`, { method: "DELETE" });
      toast({
        title: "Invitation cancelled",
        description: "The invitation has been cancelled.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel invitation. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatLastActive = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-1">Manage your profile and team settings</p>
          </div>
        </div>

        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Profile Settings
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button onClick={handleSave} size="sm">
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </CardTitle>
            <CardDescription>
              Update your personal information and profile picture
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start space-x-6">
              <div className="flex flex-col items-center space-y-3">
                <Avatar className="h-20 w-20">
                  {currentUser.profileImageUrl ? (
                    <AvatarImage src={currentUser.profileImageUrl} alt="Profile" />
                  ) : (
                    <AvatarFallback className="text-lg bg-purple-500 text-white">
                      {currentUser.firstName[0]}{currentUser.lastName[0]}
                    </AvatarFallback>
                  )}
                </Avatar>
                <ObjectUploader
                  maxNumberOfFiles={1}
                  maxFileSize={5 * 1024 * 1024} // 5MB
                  onGetUploadParameters={handleGetUploadParameters}
                  onComplete={handleUploadComplete}
                  buttonClassName="text-xs"
                >
                  <Upload className="h-3 w-3 mr-1" />
                  Upload
                </ObjectUploader>
              </div>

              <div className="flex-1 grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  {isEditing ? (
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                  ) : (
                    <p className="py-2 text-gray-900">{currentUser.firstName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  {isEditing ? (
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                  ) : (
                    <p className="py-2 text-gray-900">{currentUser.lastName}</p>
                  )}
                </div>

                <div className="col-span-2 space-y-2">
                  <Label htmlFor="email">Email</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  ) : (
                    <p className="py-2 text-gray-900">{currentUser.email}</p>
                  )}
                </div>

                <div className="col-span-2 space-y-2">
                  <Label>Role</Label>
                  <div className="py-2">
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      {currentUser.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                    </Badge>
                  </div>
                </div>

                <div className="col-span-2 space-y-2">
                  <Label>Member Since</Label>
                  <p className="py-2 text-gray-600">
                    {new Date(currentUser.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Management */}
        <Card>
          <CardHeader>
            <CardTitle>Team Management</CardTitle>
            <CardDescription>
              Manage team members and send invitations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Current Team Members */}
            <div>
              <h3 className="font-semibold mb-3">Team Members ({teamMembers.length + 1})</h3>
              <div className="space-y-3">
                {/* Current user */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-purple-500 text-white">
                        {currentUser.firstName[0]}{currentUser.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{currentUser.firstName} {currentUser.lastName}</p>
                      <p className="text-sm text-gray-600">{currentUser.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      Super Admin
                    </Badge>
                    <span className="text-sm text-gray-500">You</span>
                  </div>
                </div>

                {/* Other team members */}
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gray-400 text-white">
                          {member.firstName[0]}{member.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.firstName} {member.lastName}</p>
                        <p className="text-sm text-gray-600">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline">
                        {member.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        Active {formatLastActive(member.lastActive)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Pending Invitations */}
            {pendingInvites.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Pending Invitations ({pendingInvites.length})</h3>
                <div className="space-y-3">
                  {pendingInvites.map((invite) => (
                    <div key={invite.id} className="flex items-center justify-between p-3 border rounded-lg border-orange-200 bg-orange-50">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-orange-400 text-white">
                            {invite.email[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{invite.email}</p>
                          <p className="text-sm text-gray-600">
                            Invited by {invite.invitedBy} on {new Date(invite.invitedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="border-orange-300 text-orange-700">
                          {invite.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                        </Badge>
                        <Badge className="bg-orange-100 text-orange-800">
                          Pending
                        </Badge>
                        <Button
                          onClick={() => handleCancelInvite(invite.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Invite New Team Member */}
            <div>
              <h3 className="font-semibold mb-3">Invite Team Member</h3>
              <div className="flex space-x-3">
                <Input
                  placeholder="Email address"
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="flex-1"
                />
                <Select value={inviteRole} onValueChange={(value: 'admin' | 'super_admin') => setInviteRole(value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleInvite} disabled={!inviteEmail}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Send Invite
                </Button>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Team members will receive an email invitation to join the admin panel.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}