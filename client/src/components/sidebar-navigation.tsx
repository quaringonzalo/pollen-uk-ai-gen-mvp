import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  ChevronLeft,
  Users,
  Bookmark,
  Trophy,
  Heart,
  FileText,
  Search,
  UserCheck,
  TrendingUp
} from "lucide-react";

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

const getJobSeekerNavigation = (messageCount?: { count: number }, notificationCount?: { count: number }): NavigationSection[] => [
  {
    title: "Main",
    items: [
      { label: "Home", path: "/home", icon: Home },
      { label: "Browse Jobs", path: "/jobs", icon: Briefcase },
      { label: "Saved Items", path: "/saved-items", icon: Heart },
      { label: "Companies", path: "/companies", icon: Users },
    ]
  },
  {
    title: "My Applications",
    items: [
      { label: "My Applications", path: "/applications", icon: FileText },
      { label: "Messages & Interviews", path: "/messages", icon: MessageSquare, badge: messageCount?.count || undefined },
    ]
  },
  {
    title: "Profile & Growth",
    items: [
      { label: "My Profile", path: "/profile", icon: TrendingUp },
      { label: "Complete Profile", path: "/profile-checkpoints", icon: Target },
      { label: "Pollen Reboot", path: "/bootcamp-interest", icon: Trophy },
    ]
  },
  {
    title: "Community",
    items: [
      { label: "Community", path: "/community", icon: Users },
      { label: "Leaderboard", path: "/leaderboard", icon: Trophy },
      { label: "Community Chat", path: "/chat", icon: MessageSquare },
      { label: "Events", path: "/events", icon: Calendar },
    ]
  },
  {
    title: "Account",
    items: [
      { label: "Settings", path: "/settings", icon: Settings },
    ]
  }
];

const getEmployerNavigation = (messageCount?: { count: number }, notificationCount?: { count: number }): NavigationSection[] => [
  {
    title: "Main",
    items: [
      { label: "Dashboard", path: "/employer-dashboard", icon: Home, description: "Your hiring overview" },
      { label: "Insights", path: "/employer-insights", icon: TrendingUp, description: "Hiring analytics and performance metrics" },
      { label: "Jobs", path: "/employer-jobs", icon: Briefcase, description: "Manage your job postings" },
      { label: "Applicants", path: "/applicants", icon: Users, description: "View and manage all applicants" },
    ]
  },
  {
    title: "Management",
    items: [
      { label: "Company Profile", path: "/employer-profile", icon: Building2, description: "View and manage company profile" },
      { label: "Interview Schedule", path: "/interview-schedule", icon: Calendar, description: "Manage upcoming and past interviews" },
      { label: "Messages", path: "/employer-messages", icon: MessageSquare, description: "Communicate with candidates", badge: messageCount?.count || undefined },
      { label: "Notifications", path: "/notifications", icon: Bell, description: "View application updates and alerts", badge: notificationCount?.count || undefined },
      { label: "Company Settings", path: "/account-settings", icon: Settings, description: "Company information and basic details" },
    ]
  }
];

const adminNavigation: NavigationSection[] = [
  {
    title: "Admin",
    items: [
      { label: "Dashboard", path: "/admin", icon: Home, description: "Admin overview and metrics" },
      { label: "Company Reviews", path: "/admin/company-reviews", icon: Building2, description: "Review employer applications" },
      { label: "User Management", path: "/admin/users", icon: Users, description: "Manage platform users" },
      { label: "Settings", path: "/settings", icon: Settings, description: "Platform and account settings" },
    ]
  }
];

export default function SidebarNavigation() {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Fetch unread counts
  const { data: notificationCount } = useQuery({
    queryKey: ['/api/notifications/unread-count'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/notifications/unread-count');
      return response.json();
    },
    enabled: !!user,
  });

  const { data: messageCount } = useQuery({
    queryKey: ['/api/messages/unread-count'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/messages/unread-count');
      return response.json();
    },
    enabled: !!user,
  });

  // Add debugging for deployment
  console.log("🔵 Sidebar render - User:", !!user, user?.role);

  // Only show sidebar for authenticated users
  if (!user) {
    console.log("🔵 Sidebar not rendered - no user");
    return null;
  }
  
  const currentUser = user;

  const getNavigationForRole = () => {
    switch (currentUser.role) {
      case 'employer':
        return getEmployerNavigation(messageCount, notificationCount);
      case 'admin':
        return adminNavigation;
      default:
        return getJobSeekerNavigation(messageCount, notificationCount);
    }
  };

  const navigation = getNavigationForRole();

  const NavigationContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <button 
              onClick={() => setLocation(currentUser.role === 'employer' ? '/employer-dashboard' : '/home')}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <img 
                src="/attached_assets/Copy of Signatures (4)_1753114100311.png" 
                alt="Pollen" 
                className="w-8 h-8 flex-shrink-0"
              />
              <div className="flex items-center h-8">
                <h1 className="font-sora font-bold text-base text-gray-900">Pollen</h1>
              </div>
            </button>
          )}
          {isCollapsed && (
            <button 
              onClick={() => setLocation(currentUser.role === 'employer' ? '/employer-dashboard' : '/home')}
              className="hover:opacity-80 transition-opacity"
            >
              <img 
                src="/attached_assets/Copy of Signatures (4)_1753114100311.png" 
                alt="Pollen" 
                className="w-8 h-8 mx-auto"
              />
            </button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex"
          >
            <Menu className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        {navigation.map((section) => (
          <div key={section.title}>
            {!isCollapsed && (
              <h3 className="sidebar-section-label">
                {section.title}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const IconComponent = item.icon;
                const isActive = location === item.path;
                
                return (
                  <Button
                    key={item.path}
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start ${isCollapsed ? 'px-2' : 'px-3'} h-auto py-2`}
                    onClick={() => {
                      setLocation(item.path);
                      setIsMobileOpen(false);
                    }}
                  >
                    <IconComponent className={`w-4 h-4 ${isCollapsed ? '' : 'mr-3'} flex-shrink-0`} />
                    {!isCollapsed && (
                      <div className="flex-1 text-left">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-normal">{item.label}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </Button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t">
        <div className="space-y-2">
          <Button
            variant="ghost"
            className={`w-full justify-start ${isCollapsed ? 'px-2' : 'px-3'} text-red-600 hover:text-red-700 hover:bg-red-50`}
            onClick={() => {
              console.log('Logout button clicked');
              console.log('Logout function available:', !!logout);
              if (logout) {
                logout();
              } else {
                console.log('No logout function available');
              }
            }}
          >
            <LogOut className={`w-4 h-4 ${isCollapsed ? '' : 'mr-3'}`} />
            {!isCollapsed && <span className="text-sm font-normal">Logout</span>}
          </Button>
        </div>
        
        {!isCollapsed && (
          <div className="mt-4 pt-4 border-t">
            <Button
              variant="ghost"
              className="w-full p-0 h-auto hover:bg-gray-50"
              onClick={() => {
                setLocation(currentUser.role === 'employer' ? '/personal-settings' : '/profile');
                setIsMobileOpen(false);
              }}
            >
              <div className="flex items-center gap-3 w-full p-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: '#E2007A', fontFamily: 'Sora' }}>
                  {currentUser.username?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-normal text-gray-900 truncate">
                    {currentUser.username || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {currentUser.email}
                  </p>
                </div>
              </div>
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-white shadow-lg border border-gray-200 hover:bg-gray-50"
      >
        <Menu className="w-5 h-5 text-gray-700" />
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <div className={`hidden lg:flex flex-col bg-white border-r border-gray-200 transition-all duration-300 fixed inset-y-0 left-0 z-30 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}>
        <NavigationContent />
      </div>

      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 lg:hidden ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <NavigationContent />
      </div>
    </>
  );
}