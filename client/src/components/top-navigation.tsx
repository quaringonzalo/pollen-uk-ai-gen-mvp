import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Home, 
  Briefcase, 
  User, 
  Bell,
  MessageSquare,
  Calendar,
  Target,
  Building2,
  Settings,
  LogOut,
  Menu,
  X,
  Users,
  Trophy,
  Heart,
  FileText,
  TrendingUp,
  ChevronDown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavigationItem {
  label: string;
  path: string;
  icon: any;
  badge?: string | number;
  description?: string;
}

interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

const getJobSeekerNavigation = (): NavigationSection[] => [
  {
    title: "Main",
    items: [
      { label: "Home", path: "/home", icon: Home },
      { label: "Browse Jobs", path: "/jobs", icon: Briefcase },
      { label: "My Schedule", path: "/master-schedule", icon: Calendar },
      { label: "Saved Items", path: "/saved-items", icon: Heart },
      { label: "Companies", path: "/companies", icon: Users },
    ]
  },
  {
    title: "Profile & Growth",
    items: [
      { label: "My Profile", path: "/profile", icon: TrendingUp },
      { label: "Complete Profile", path: "/profile-checkpoints", icon: Target },
      { label: "Applications", path: "/applications", icon: FileText },
      { label: "Messages", path: "/messages", icon: MessageSquare },
    ]
  }
];

const employerNavigation: NavigationSection[] = [
  {
    title: "Main",
    items: [
      { label: "Dashboard", path: "/employer-dashboard", icon: Home },
      { label: "Applicants", path: "/candidates", icon: Users },
      { label: "Company Profile", path: "/employer-profile", icon: Building2 },
    ]
  }
];

const adminNavigation: NavigationSection[] = [
  {
    title: "Main",
    items: [
      { label: "Admin Dashboard", path: "/admin-dashboard", icon: Home },
      { label: "Applications", path: "/admin-applications", icon: FileText },
      { label: "Job Seekers", path: "/admin-job-seekers", icon: Users },
      { label: "Employers", path: "/admin-employers", icon: Building2 },
      { label: "Jobs", path: "/admin-jobs", icon: Briefcase },
      { label: "Hidden Jobs", path: "/admin-hidden-jobs", icon: Trophy },
      { label: "Analytics", path: "/admin-analytics", icon: TrendingUp },
    ]
  }
];

export default function TopNavigation() {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Check for unread counts to show notification dots
  const { data: notificationCount } = useQuery({
    queryKey: ['/api/notifications/unread-count'],
    queryFn: async () => {
      console.log('🔔 Fetching notification count...');
      const response = await fetch('/api/notifications/unread-count', {
        credentials: 'include'
      });
      const data = await response.json();
      console.log('🔔 Notification count data:', data);
      return data;
    },
    enabled: !!user,
    refetchInterval: 30000,
  });

  const { data: messageCount } = useQuery({
    queryKey: ['/api/messages/unread-count'],
    queryFn: async () => {
      console.log('💬 Fetching message count...');
      try {
        const response = await fetch('/api/messages/unread-count', {
          credentials: 'include'
        });
        console.log('💬 Message count response status:', response.status);
        const data = await response.json();
        console.log('💬 Message count data:', data);
        return data;
      } catch (error) {
        console.error('💬 Message count error:', error);
        return { count: 0 };
      }
    },
    enabled: true, // Force enable to see why it's not working
    refetchInterval: 30000,
    retry: 1,
  });

  if (!user) return null;

  const hasUnreadNotifications = (notificationCount as any)?.count > 0;
  const hasUnreadMessages = (messageCount as any)?.count > 0;

  // Debug logging (only when user exists)
  console.log('=== NOTIFICATION DOTS DEBUG ===');
  console.log('👤 user exists:', !!user);
  console.log('🔔 notificationCount object:', notificationCount);
  console.log('💬 messageCount object:', messageCount);
  console.log('🔔 hasUnreadNotifications:', hasUnreadNotifications, 'count:', (notificationCount as any)?.count);
  console.log('💬 hasUnreadMessages:', hasUnreadMessages, 'count:', (messageCount as any)?.count);
  console.log('================================');

  const getNavigationForRole = () => {
    switch (user.role) {
      case 'employer':
        return employerNavigation;
      case 'admin':
        return adminNavigation;
      default:
        return getJobSeekerNavigation();
    }
  };

  const navigation = getNavigationForRole();
  const allItems = navigation.flatMap(section => section.items);

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => {
                if (user.role === 'employer') {
                  setLocation('/employer-dashboard');
                } else if (user.role === 'admin') {
                  setLocation('/admin-dashboard');
                } else {
                  setLocation('/home');
                }
              }}
            >
              <div className="w-8 h-8 bg-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-xl font-bold text-gray-900" style={{fontFamily: 'Sora'}}>
                Pollen
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {allItems.slice(0, 6).map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              
              return (
                <Button
                  key={item.path}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setLocation(item.path)}
                  className={`flex items-center gap-2 ${
                    isActive ? 'bg-pink-600 text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden lg:inline">{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-1">
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              );
            })}

            {/* More Menu for additional items */}
            {allItems.length > 6 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <span>More</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {allItems.slice(6).map((item) => {
                    const Icon = item.icon;
                    return (
                      <DropdownMenuItem
                        key={item.path}
                        onClick={() => setLocation(item.path)}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Messages */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation('/messages')}
              className="relative p-2"
            >
              <MessageSquare className="w-6 h-6" />
              {/* Show blue dot only when there are unread messages */}
              {hasUnreadMessages && (
                <div className="absolute top-0 right-0 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
              )}
            </Button>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation('/notifications')}
              className="relative p-2"
            >
              <Bell className="w-6 h-6" />
              {/* Show red dot only when there are unread notifications */}
              {hasUnreadNotifications && (
                <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
              )}
            </Button>

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span className="hidden sm:inline">{user.firstName}</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  {user.firstName} {user.lastName}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setLocation('/settings')}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="flex items-center gap-2 cursor-pointer text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-2 space-y-1">
            {allItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              
              return (
                <Button
                  key={item.path}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    setLocation(item.path);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full justify-start flex items-center gap-3 ${
                    isActive ? 'bg-pink-600 text-white' : 'text-gray-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}