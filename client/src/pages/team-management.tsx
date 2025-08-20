import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Plus, 
  Mail, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Settings2,
  MoreVertical,
  Send,
  Shield,
  UserCheck,
  User,
  AlertCircle
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface TeamMember {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  role: string;
  status: 'pending' | 'active' | 'suspended' | 'removed';
  permissions: {
    viewApplications: boolean;
    reviewCandidates: boolean;
    scheduleInterviews: boolean;
    provideFeedback: boolean;
    manageJobs: boolean;
    manageTeam: boolean;
    viewBilling: boolean;
    manageSettings: boolean;
  };
  invitedAt: string;
  activatedAt?: string;
  lastActiveAt?: string;
  personalMessage?: string;
}

const ROLE_TEMPLATES = {
  owner: {
    label: 'Owner',
    description: 'Full access to all features',
    permissions: {
      viewApplications: true,
      reviewCandidates: true,
      scheduleInterviews: true,
      provideFeedback: true,
      manageJobs: true,
      manageTeam: true,
      viewBilling: true,
      manageSettings: true,
    }
  },
  admin: {
    label: 'Administrator',
    description: 'Can manage most features except billing',
    permissions: {
      viewApplications: true,
      reviewCandidates: true,
      scheduleInterviews: true,
      provideFeedback: true,
      manageJobs: true,
      manageTeam: true,
      viewBilling: false,
      manageSettings: false,
    }
  },
  hiring_manager: {
    label: 'Hiring Manager',
    description: 'Can manage jobs and review candidates',
    permissions: {
      viewApplications: true,
      reviewCandidates: true,
      scheduleInterviews: true,
      provideFeedback: true,
      manageJobs: true,
      manageTeam: false,
      viewBilling: false,
      manageSettings: false,
    }
  },
  recruiter: {
    label: 'Recruiter',
    description: 'Can review candidates and schedule interviews',
    permissions: {
      viewApplications: true,
      reviewCandidates: true,
      scheduleInterviews: true,
      provideFeedback: true,
      manageJobs: false,
      manageTeam: false,
      viewBilling: false,
      manageSettings: false,
    }
  },
  interviewer: {
    label: 'Interviewer',
    description: 'Can view applications and provide feedback',
    permissions: {
      viewApplications: true,
      reviewCandidates: false,
      scheduleInterviews: false,
      provideFeedback: true,
      manageJobs: false,
      manageTeam: false,
      viewBilling: false,
      manageSettings: false,
    }
  }
};

export default function TeamManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  
  // Invite form state
  const [inviteForm, setInviteForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    jobTitle: '',
    role: '',
    personalMessage: ''
  });

  // Fetch team members
  const { data: teamMembers = [], isLoading } = useQuery<TeamMember[]>({
    queryKey: ['/api/team-members'],
    enabled: !!user && user.role === 'employer',
  });

  // Invite team member mutation
  const inviteTeamMember = useMutation({
    mutationFn: async (data: typeof inviteForm) => {
      const response = await fetch('/api/team-members/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to invite team member');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/team-members'] });
      setIsInviteDialogOpen(false);
      setInviteForm({
        email: '',
        firstName: '',
        lastName: '',
        jobTitle: '',
        role: '',
        personalMessage: ''
      });
      toast({ 
        title: 'Team member invited',
        description: 'An invitation has been sent to their email address.'
      });
    },
    onError: (error) => {
      toast({ 
        title: 'Failed to send invitation',
        description: error instanceof Error ? error.message : 'Please try again later.',
        variant: 'destructive'
      });
    }
  });

  // Update team member permissions
  const updatePermissions = useMutation({
    mutationFn: async ({ memberId, permissions }: { memberId: number; permissions: any }) => {
      const response = await fetch(`/api/team-members/${memberId}/permissions`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ permissions }),
      });
      if (!response.ok) throw new Error('Failed to update permissions');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/team-members'] });
      toast({ 
        title: 'Permissions updated',
        description: 'Team member permissions have been updated successfully.'
      });
    }
  });

  // Deactivate team member
  const deactivateTeamMember = useMutation({
    mutationFn: async (memberId: number) => {
      const response = await fetch(`/api/team-members/${memberId}/deactivate`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to deactivate team member');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/team-members'] });
      toast({ 
        title: 'Team member deactivated',
        description: 'The team member no longer has access to your company account.'
      });
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800 border-red-200"><XCircle className="w-3 h-3 mr-1" />Suspended</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Shield className="w-4 h-4 text-purple-600" />;
      case 'admin':
        return <Settings2 className="w-4 h-4 text-blue-600" />;
      case 'hiring_manager':
        return <UserCheck className="w-4 h-4 text-green-600" />;
      default:
        return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleInvite = () => {
    if (!inviteForm.email || !inviteForm.role) {
      toast({
        title: 'Missing information',
        description: 'Please fill in email and role fields.',
        variant: 'destructive'
      });
      return;
    }
    inviteTeamMember.mutate(inviteForm);
  };

  const handleRoleChange = (role: string) => {
    setInviteForm(prev => ({
      ...prev,
      role,
    }));
  };

  const handleDemoLogin = () => {
    // Demo login to simulate employer session
    window.location.href = '/api/auth/demo-login?role=employer&returnTo=' + encodeURIComponent(window.location.pathname);
  };

  if (!user || user.role !== 'employer') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-semibold mb-2">Access Required</h2>
            <p className="text-gray-600 mb-4">You need to be logged in as an employer to access team management.</p>
            <Button 
              onClick={handleDemoLogin}
              style={{ backgroundColor: '#E2007A', fontFamily: 'Sora' }}
              className="text-white hover:bg-pink-700"
            >
              Demo Login as Employer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Sora' }}>
              Team Management
            </h1>
            <p className="mt-2 text-gray-600">
              Manage your hiring team and collaborate on recruiting with role-based permissions.
            </p>
          </div>
          
          <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
            <DialogTrigger asChild>
              <Button style={{ backgroundColor: '#E2007A', fontFamily: 'Sora' }} className="text-white hover:bg-pink-700">
                <Plus className="w-4 h-4 mr-2" />
                Invite Team Member
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle style={{ fontFamily: 'Sora' }}>Invite Team Member</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={inviteForm.firstName}
                      onChange={(e) => setInviteForm(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={inviteForm.lastName}
                      onChange={(e) => setInviteForm(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Smith"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={inviteForm.email}
                    onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="john.smith@company.com"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    value={inviteForm.jobTitle}
                    onChange={(e) => setInviteForm(prev => ({ ...prev, jobTitle: e.target.value }))}
                    placeholder="Senior Hiring Manager"
                  />
                </div>
                
                <div>
                  <Label htmlFor="role">Role & Permissions *</Label>
                  <Select value={inviteForm.role} onValueChange={handleRoleChange} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(ROLE_TEMPLATES).map(([key, template]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            {getRoleIcon(key)}
                            <div>
                              <div className="font-medium">{template.label}</div>
                              <div className="text-xs text-gray-500">{template.description}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="personalMessage">Personal Message (Optional)</Label>
                  <Textarea
                    id="personalMessage"
                    value={inviteForm.personalMessage}
                    onChange={(e) => setInviteForm(prev => ({ ...prev, personalMessage: e.target.value }))}
                    placeholder="Hi John, I'd like to invite you to join our hiring team on Pollen..."
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleInvite}
                  disabled={inviteTeamMember.isPending}
                  style={{ backgroundColor: '#E2007A', fontFamily: 'Sora' }}
                  className="text-white hover:bg-pink-700"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {inviteTeamMember.isPending ? 'Sending...' : 'Send Invitation'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Team Members List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Sora' }}>
              <Users className="w-5 h-5" />
              Team Members ({teamMembers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-32"></div>
                        </div>
                      </div>
                      <div className="w-20 h-6 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : teamMembers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No team members yet</h3>
                <p className="text-gray-600 mb-4">
                  Invite your hiring team to collaborate on candidate reviews and interviews.
                </p>
                <Button 
                  onClick={() => setIsInviteDialogOpen(true)}
                  style={{ backgroundColor: '#E2007A', fontFamily: 'Sora' }}
                  className="text-white hover:bg-pink-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Invite Your First Team Member
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {teamMembers.map((member: TeamMember) => (
                  <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: '#E2007A', fontFamily: 'Sora' }}>
                        {member.firstName?.charAt(0) || member.email.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-gray-900">
                            {member.firstName && member.lastName 
                              ? `${member.firstName} ${member.lastName}`
                              : member.email
                            }
                          </h3>
                          <div className="flex items-center gap-1">
                            {getRoleIcon(member.role)}
                            <span className="text-sm text-gray-600 capitalize">
                              {ROLE_TEMPLATES[member.role as keyof typeof ROLE_TEMPLATES]?.label || member.role}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {member.email}
                          </span>
                          {member.jobTitle && (
                            <span>{member.jobTitle}</span>
                          )}
                          {member.lastActiveAt && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Last active {new Date(member.lastActiveAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {getStatusBadge(member.status)}
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            Edit Permissions
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            Resend Invitation
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => deactivateTeamMember.mutate(member.id)}
                          >
                            Remove Access
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}