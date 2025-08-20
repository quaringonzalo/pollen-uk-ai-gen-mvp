import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ObjectUploader } from "@/components/ObjectUploader";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  User, 
  Upload, 
  Save, 
  UserPlus, 
  Mail, 
  Calendar, 
  Shield,
  X,
  CheckCircle
} from "lucide-react";
import type { UploadResult } from "@uppy/core";

interface AdminUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  profileImageUrl?: string;
  role: 'admin' | 'super_admin';
  createdAt: string;
  lastActive: string;
  status: 'active' | 'pending' | 'inactive';
}

interface TeamInvite {
  id: number;
  email: string;
  role: 'admin' | 'super_admin';
  status: 'pending' | 'accepted' | 'expired';
  invitedAt: string;
  invitedBy: string;
}

export default function AdminSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<'admin' | 'super_admin'>('admin');
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    profileImageUrl: ""
  });

  // Fetch current admin user
  const { data: currentUser } = useQuery<AdminUser>({
    queryKey: ["admin", "profile"],
    queryFn: async () => {
      const response = await fetch("/api/admin/profile");
      return response.json();
    },
    initialData: {
      id: 1,
      firstName: "Holly",
      lastName: "Saunders",
      email: "holly@pollen.co.uk",
      profileImageUrl: null,
      role: "super_admin",
      createdAt: "2024-01-15T00:00:00.000Z",
      lastActive: "2025-01-18T20:10:00.000Z",
      status: "active"
    }
  });

  // Fetch team members
  const { data: teamMembers } = useQuery<AdminUser[]>({
    queryKey: ["admin", "team-members"],
    queryFn: async () => {
      const response = await fetch("/api/admin/team-members");
      return response.json();
    },
    initialData: [
      {
        id: 2,
        firstName: "James",
        lastName: "Thompson",
        email: "james@pollen.co.uk",
        profileImageUrl: null,
        role: "admin",
        createdAt: "2024-02-01T00:00:00.000Z",
        lastActive: "2025-01-18T19:45:00.000Z",
        status: "active"
      },
      {
        id: 3,
        firstName: "Sarah",
        lastName: "Wilson",
        email: "sarah@pollen.co.uk",
        profileImageUrl: null,
        role: "admin",
        createdAt: "2024-02-15T00:00:00.000Z",
        lastActive: "2025-01-17T16:30:00.000Z",
        status: "active"
      }
    ]
  });

  // Fetch pending invites
  const { data: pendingInvites } = useQuery<TeamInvite[]>({
    queryKey: ["admin", "pending-invites"],
    queryFn: async () => {
      const response = await fetch("/api/admin/pending-invites");
      return response.json();
    },
    initialData: [
      {
        id: 1,
        email: "alex@pollen.co.uk",
        role: "admin",
        status: "pending",
        invitedAt: "2025-01-15T00:00:00.000Z",
        invitedBy: "Holly Saunders"
      }
    ]
  });

  // Profile update mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: Partial<AdminUser>) => 
      apiRequest("/api/admin/profile", { 
        method: "PATCH", 
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      } as RequestInit),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "profile"] });
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Team invite mutation
  const inviteTeamMemberMutation = useMutation({
    mutationFn: (data: { email: string; role: string }) => 
      apiRequest("/api/admin/invite-team-member", { 
        method: "POST", 
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      } as RequestInit),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "pending-invites"] });
      setInviteEmail("");
      setInviteRole("admin");
      toast({
        title: "Invitation sent",
        description: "Team member invitation has been sent successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send invitation. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Cancel invite mutation
  const cancelInviteMutation = useMutation({
    mutationFn: (inviteId: number) => 
      apiRequest(`/api/admin/cancel-invite/${inviteId}`, { 
        method: "DELETE" 
      } as RequestInit),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "pending-invites"] });
      toast({
        title: "Invitation cancelled",
        description: "The invitation has been cancelled.",
      });
    }
  });

  // Handle profile upload
  const handleGetUploadParameters = async () => {
    const response = await apiRequest("/api/objects/upload", { method: "POST" });
    return {
      method: "PUT" as const,
      url: response.uploadURL,
    };
  };

  const handleUploadComplete = async (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
    if (result.successful?.[0]?.uploadURL) {
      try {
        await apiRequest("/api/admin/profile-image", {
          method: "PUT",
          body: JSON.stringify({ profileImageURL: result.successful[0].uploadURL }),
          headers: { "Content-Type": "application/json" }
        } as RequestInit);
        queryClient.invalidateQueries({ queryKey: ["admin", "profile"] });
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

  // Initialize form data when editing starts
  const startEditing = () => {
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        profileImageUrl: currentUser.profileImageUrl || ""
      });
    }
    setIsEditing(true);
  };

  const handleSave = () => {
    updateProfileMutation.mutate(formData);
  };

  const handleInvite = () => {
    if (inviteEmail && inviteRole) {
      inviteTeamMemberMutation.mutate({
        email: inviteEmail,
        role: inviteRole
      });
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getRoleBadge = (role: string) => {
    return role === 'super_admin' ? (
      <Badge className="bg-purple-100 text-purple-800 border-purple-200">
        <Shield className="h-3 w-3 mr-1" />
        Super Admin
      </Badge>
    ) : (
      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
        <User className="h-3 w-3 mr-1" />
        Admin
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Inactive</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-xl font-bold text-gray-900">User Settings</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={currentUser.profileImageUrl || undefined} />
                  <AvatarFallback className="text-lg">
                    {getInitials(currentUser.firstName, currentUser.lastName)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <ObjectUploader
                    maxNumberOfFiles={1}
                    maxFileSize={5242880} // 5MB
                    onGetUploadParameters={handleGetUploadParameters}
                    onComplete={handleUploadComplete}
                    buttonClassName="mb-2"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload New Picture
                  </ObjectUploader>
                  <p className="text-sm text-gray-500">JPG, PNG up to 5MB</p>
                </div>
              </div>

              {/* Profile Form */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={isEditing ? formData.firstName : currentUser.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={isEditing ? formData.lastName : currentUser.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={isEditing ? formData.email : currentUser.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Role:</span>
                    {getRoleBadge(currentUser.role)}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500">
                      Joined {formatDate(currentUser.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  {!isEditing ? (
                    <Button onClick={startEditing}>
                      Edit Profile
                    </Button>
                  ) : (
                    <>
                      <Button onClick={handleSave} disabled={updateProfileMutation.isPending}>
                        <Save className="h-4 w-4 mr-2" />
                        {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserPlus className="h-5 w-5 mr-2" />
                Team Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Invite New Member */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-3">Invite New Team Member</h3>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="inviteEmail">Email Address</Label>
                    <Input
                      id="inviteEmail"
                      type="email"
                      placeholder="team-member@pollen.co.uk"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="inviteRole">Role</Label>
                    <select
                      id="inviteRole"
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value as 'admin' | 'super_admin')}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    >
                      <option value="admin">Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                  </div>
                  <Button 
                    onClick={handleInvite}
                    disabled={!inviteEmail || inviteTeamMemberMutation.isPending}
                    className="w-full"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    {inviteTeamMemberMutation.isPending ? "Sending..." : "Send Invitation"}
                  </Button>
                </div>
              </div>

              {/* Current Team Members */}
              <div>
                <h3 className="font-medium mb-3">Current Team Members ({teamMembers?.length || 0})</h3>
                <div className="space-y-3">
                  {teamMembers?.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.profileImageUrl || undefined} />
                          <AvatarFallback className="text-xs">
                            {getInitials(member.firstName, member.lastName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">
                            {member.firstName} {member.lastName}
                          </div>
                          <div className="text-xs text-gray-500">{member.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getRoleBadge(member.role)}
                        {getStatusBadge(member.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pending Invitations */}
              {pendingInvites && pendingInvites.length > 0 && (
                <div>
                  <h3 className="font-medium mb-3">Pending Invitations ({pendingInvites.length})</h3>
                  <div className="space-y-3">
                    {pendingInvites.map((invite) => (
                      <div key={invite.id} className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">{invite.email}</div>
                          <div className="text-xs text-gray-500">
                            Invited {formatDate(invite.invitedAt)} by {invite.invitedBy}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getRoleBadge(invite.role)}
                          <Badge variant="outline" className="text-xs">Pending</Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => cancelInviteMutation.mutate(invite.id)}
                            disabled={cancelInviteMutation.isPending}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}