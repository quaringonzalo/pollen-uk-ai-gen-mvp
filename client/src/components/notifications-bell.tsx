import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bell, BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import type { Notification } from "@shared/schema";

interface NotificationsBellProps {
  onNavigateToNotifications?: () => void;
}

export function NotificationsBell({ onNavigateToNotifications }: NotificationsBellProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Fetch unread count
  const { data: unreadData } = useQuery<{ count: number }>({
    queryKey: ['/api/notifications/unread-count'],
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 1000 * 60, // 1 minute
  });

  // Fetch recent notifications for dropdown preview
  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ['/api/notifications'],
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  const unreadCount = unreadData?.count || 0;
  const recentNotifications = notifications.slice(0, 5); // Show latest 5

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'new_match':
        return '👥';
      case 'feedback_reminder':
        return '💬';
      case 'interview_reminder':
        return '📅';
      case 'urgent_action':
        return '⚡';
      default:
        return '🔔';
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative p-2 text-gray-600 hover:text-gray-900"
        >
          {unreadCount > 0 ? (
            <BellRing className="w-5 h-5" />
          ) : (
            <Bell className="w-5 h-5" />
          )}
          
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {unreadCount} unread
            </Badge>
          )}
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        {recentNotifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p>No notifications yet</p>
            <p className="text-xs text-gray-400 mt-1">
              We'll notify you about candidate matches and updates
            </p>
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            {recentNotifications.map((notification) => (
              <DropdownMenuItem 
                key={notification.id}
                className={`p-3 cursor-pointer ${
                  !notification.isRead ? 'bg-blue-50' : ''
                }`}
                onClick={() => {
                  setIsOpen(false);
                  if (onNavigateToNotifications) {
                    onNavigateToNotifications();
                  }
                }}
              >
                <div className="flex items-start gap-3 w-full">
                  <span className="text-base flex-shrink-0 mt-0.5">
                    {getTypeIcon(notification.type)}
                  </span>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className={`text-sm font-medium text-gray-900 leading-tight ${
                        !notification.isRead ? 'font-semibold' : ''
                      }`}>
                        {notification.title}
                      </h4>
                      
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
                      )}
                    </div>
                    
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(notification.createdAt!), { addSuffix: true })}
                      </span>
                      
                      {notification.priority === 'urgent' && (
                        <Badge variant="destructive" className="text-xs h-4">
                          Urgent
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          className="p-3 text-center cursor-pointer text-pink-600 hover:text-pink-700 font-medium"
          onClick={() => {
            setIsOpen(false);
            if (onNavigateToNotifications) {
              onNavigateToNotifications();
            }
          }}
        >
          View All Notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}