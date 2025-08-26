import { useAuth } from "@/hooks/useAuth";
import TopNavigation from "./top-navigation";
import { JobSeekerSidebar } from "./JobSeekerSidebar";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { Bell, MessageSquare, ChevronDown, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LayoutProps {
  children: React.ReactNode;
}

function JobSeekerHeader({ onLogout }: { onLogout: () => void }) {
  const [, setLocation] = useLocation();
  
  // Get unread notification count
  const { data: notificationCount } = useQuery({
    queryKey: ['/api/notifications/unread-count'],
    queryFn: async () => {
      console.log('🔔 JobSeeker: Fetching notification count...');
      const response = await fetch('/api/notifications/unread-count', {
        credentials: 'include'
      });
      const data = await response.json();
      console.log('🔔 JobSeeker: Notification count data:', data);
      return data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchInterval: 30000,
  });

  // Get unread message count
  const { data: messageCount } = useQuery({
    queryKey: ['/api/messages/unread-count'],
    queryFn: async () => {
      console.log('💬 JobSeeker: Fetching message count...');
      try {
        const response = await fetch('/api/messages/unread-count', {
          credentials: 'include'
        });
        console.log('💬 JobSeeker: Message count response status:', response.status);
        const data = await response.json();
        console.log('💬 JobSeeker: Message count data:', data);
        return data;
      } catch (error) {
        console.error('💬 JobSeeker: Message count error:', error);
        return { count: 0 };
      }
    },
    refetchInterval: 30000,
    retry: 1,
  });

  // Get user profile for display
  const { data: userProfile } = useQuery({
    queryKey: ['/api/user-profile']
  }) as { data: any };

  const hasUnreadNotifications = (notificationCount as any)?.count > 0;
  const hasUnreadMessages = (messageCount as any)?.count > 0;



  return (
    <header className="bg-white px-4 py-3">
      <div className="flex items-center justify-end gap-3">
        {/* Messages */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation('/messages')}
          className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          <MessageSquare className="w-6 h-6" />
          {hasUnreadMessages && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-white"></div>
          )}
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation('/notifications')}
          className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          <Bell className="w-6 h-6" />
          {hasUnreadNotifications && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
          )}
        </Button>

        {/* User Profile Dropdown */}
        {userProfile && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-3 px-3 py-2 h-auto text-left hover:bg-gray-100"
              >
                <div className="user-avatar w-8 h-8 text-sm">
                  <span className="text-white font-bold">
                    {userProfile.firstName ? userProfile.firstName.charAt(0) : userProfile.email?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="font-medium text-gray-900 truncate text-sm">
                    {userProfile.firstName ? `${userProfile.firstName} ${userProfile.lastName || ''}`.trim() : userProfile.email}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {userProfile.email}
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuItem onClick={() => setLocation('/profile')}>
                <span className="font-medium">View Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setLocation('/settings')}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout} className="text-red-600">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}

export default function Layout({ children }: LayoutProps) {
  const { user } = useAuth();
  const [location] = useLocation();
  
  // Check if this is a print page
  const isPrintPage = location.startsWith('/profile-print');
  
  // Check if this is the landing page or employer signup
  const isLandingPage = location === '/';
  const isEmployerSignup = location === '/employer-signup';
  const isEmployersPage = location === '/employers';
  const isAdminPage = location.startsWith('/admin');
  
  // Print pages get minimal layout without navigation
  if (isPrintPage) {
    return (
      <main className="min-h-screen bg-white">
        {children}
      </main>
    );
  }

  // Landing page, employer pages, admin pages, or unauthenticated users get minimal layout without navigation
  if (!user || isLandingPage || isEmployerSignup || isEmployersPage || isAdminPage) {
    return (
      <main className="min-h-screen bg-gray-50">
        {children}
      </main>
    );
  }

  // Handle logout for sidebar
  const handleLogout = async () => {
    try {
      await apiRequest('/api/logout', "POST");
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
      // Force redirect even if API call fails
      window.location.href = '/';
    }
  };

  // Job seekers get sidebar navigation with header, other roles get top navigation
  if (user?.role === 'job_seeker') {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <JobSeekerSidebar onLogout={handleLogout} />
        <div className="flex-1 flex flex-col">
          <JobSeekerHeader onLogout={handleLogout} />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    );
  }

  // All other authenticated pages use top navigation
  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation />
      <main className="pt-0">
        {children}
      </main>
    </div>
  );
}