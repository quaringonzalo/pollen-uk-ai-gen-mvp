import { Home, Users, Briefcase, Building2, Heart, FileText, Calendar, Menu, ChevronLeft, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

interface JobSeekerSidebarProps {
  onLogout: () => void;
}

export function JobSeekerSidebar({ onLogout }: JobSeekerSidebarProps) {
  const [location, setLocation] = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);





  const navigationItems = [
    {
      icon: Home,
      label: 'Home',
      path: '/home',
      isActive: location === '/home' || location === '/'
    },
    {
      icon: Briefcase,
      label: 'Jobs',
      path: '/jobs',
      isActive: location === '/jobs'
    },
    {
      icon: Building2,
      label: 'Companies',
      path: '/companies',
      isActive: location === '/companies'
    },
    {
      icon: Users,
      label: 'Community',
      path: '/community',
      isActive: location === '/community'
    }
  ];

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 flex flex-col h-screen transition-all duration-300`}>
      {/* Logo/Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#E2007A] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="font-bold text-xl text-gray-900">Pollen</h1>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 h-8 w-8 hover:bg-gray-100"
          >
            {isCollapsed ? <Menu className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>
      </div>



      {/* Navigation Items */}
      <nav className="p-3 space-y-4">
        {/* Main Navigation */}
        <div>
          {!isCollapsed && (
            <h3 className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-2 px-3">
              Main
            </h3>
          )}
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.path}
                  variant={item.isActive ? "default" : "ghost"}
                  className={`w-full ${isCollapsed ? 'justify-center px-2' : 'justify-start gap-3'} h-9 text-sm ${
                    item.isActive 
                      ? 'bg-[#E2007A] text-white hover:bg-[#E2007A]/90' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setLocation(item.path)}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className="w-5 h-5" />
                  {!isCollapsed && (
                    <>
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {item.badge > 9 ? '9+' : item.badge}
                        </span>
                      )}
                    </>
                  )}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Secondary Navigation */}
        <div>
          {!isCollapsed && (
            <h3 className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-2 px-3">
              My Activity
            </h3>
          )}
          <div className="space-y-1">
            <Button
              variant={location === '/profile' ? 'default' : 'ghost'}
              className={`w-full ${isCollapsed ? 'justify-center px-2' : 'justify-start gap-3'} h-9 text-sm ${
                location === '/profile' 
                  ? 'bg-[#E2007A] text-white hover:bg-[#E2007A]/90' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setLocation('/profile')}
              title={isCollapsed ? 'My Profile' : undefined}
            >
              <User className="w-5 h-5" />
              {!isCollapsed && <span>My Profile</span>}
            </Button>
            <Button
              variant={location === '/saved-items' ? 'default' : 'ghost'}
              className={`w-full ${isCollapsed ? 'justify-center px-2' : 'justify-start gap-3'} h-9 text-sm ${
                location === '/saved-items' 
                  ? 'bg-[#E2007A] text-white hover:bg-[#E2007A]/90' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setLocation('/saved-items')}
              title={isCollapsed ? 'Saved Items' : undefined}
            >
              <Heart className="w-5 h-5" />
              {!isCollapsed && <span>Saved Items</span>}
            </Button>
            <Button
              variant={location === '/applications' ? 'default' : 'ghost'}
              className={`w-full ${isCollapsed ? 'justify-center px-2' : 'justify-start gap-3'} h-9 text-sm ${
                location === '/applications' 
                  ? 'bg-[#E2007A] text-white hover:bg-[#E2007A]/90' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setLocation('/applications')}
              title={isCollapsed ? 'My Applications' : undefined}
            >
              <FileText className="w-5 h-5" />
              {!isCollapsed && <span>My Applications</span>}
            </Button>
            <Button
              variant={location === '/interview-schedule' ? 'default' : 'ghost'}
              className={`w-full ${isCollapsed ? 'justify-center px-2' : 'justify-start gap-3'} h-9 text-sm ${
                location === '/interview-schedule' 
                  ? 'bg-[#E2007A] text-white hover:bg-[#E2007A]/90' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setLocation('/interview-schedule')}
              title={isCollapsed ? 'Interview Schedule' : undefined}
            >
              <Calendar className="w-5 h-5" />
              {!isCollapsed && <span>Interview Schedule</span>}
            </Button>
          </div>
        </div>
      </nav>

    </div>
  );
}