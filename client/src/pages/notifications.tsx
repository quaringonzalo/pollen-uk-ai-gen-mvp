import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Bell, 
  BellRing, 
  CheckCircle, 
  Clock, 
  Users, 
  Calendar, 
  MessageSquare,
  ArrowRight,
  AlertTriangle,
  X,
  Trash2,
  Eye,
  FileText
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import type { Notification } from "@shared/schema";

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead: (id: number) => void;
  onDelete: (id: number) => void;
}

function NotificationCard({ notification, onMarkAsRead, onDelete }: NotificationCardProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const getTypeIcon = () => {
    switch (notification.type) {
      case 'new_match':
      case 'job_recommendation':
        return <Users className="w-5 h-5 text-blue-600" />;
      case 'feedback_reminder':
      case 'profile_incomplete':
        return <MessageSquare className="w-5 h-5 text-orange-600" />;
      case 'interview_reminder':
        return <Calendar className="w-5 h-5 text-green-600" />;
      case 'urgent_action':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };



  const getActionButtonText = () => {
    switch (notification.type) {
      case 'new_match':
        return 'View Job';
      case 'feedback_reminder':
        return 'Complete Profile';
      case 'interview_reminder':
        return 'View Interview';
      case 'urgent_action':
        return 'Take Action';
      case 'new_application':
        return 'View Application';
      case 'interview_scheduled':
        return 'View Interview';
      case 'application_update':
        return 'View Application';
      case 'message_received':
        return 'View Message';
      case 'job_recommendation':
        return 'View Jobs';
      case 'profile_incomplete':
        return 'Complete Profile';
      default:
        return 'View Details';
    }
  };

  const getActionIcon = () => {
    switch (notification.type) {
      case 'new_match':
        return <Eye className="w-3 h-3 ml-1" />;
      case 'feedback_reminder':
        return <MessageSquare className="w-3 h-3 ml-1" />;
      case 'interview_reminder':
      case 'interview_scheduled':
        return <Calendar className="w-3 h-3 ml-1" />;
      case 'new_application':
      case 'application_update':
        return <FileText className="w-3 h-3 ml-1" />;
      case 'message_received':
        return <MessageSquare className="w-3 h-3 ml-1" />;
      default:
        return <ArrowRight className="w-3 h-3 ml-1" />;
    }
  };

  const handleActionClick = () => {
    let targetUrl = notification.actionUrl;
    
    // Route to specific pages based on notification type and content
    if (notification.type === 'interview_reminder' || notification.type === 'interview_scheduled') {
      // For interview notifications, route to interview confirmation pages
      if (notification.message.includes('Holly Saunders')) {
        targetUrl = '/interview-confirmation/1';
      } else if (notification.message.includes('Emma Wilson')) {
        targetUrl = '/interview-confirmation/2';
      } else {
        targetUrl = '/applications';
      }
    } else if (notification.type === 'job_recommendation' || notification.type === 'new_match') {
      targetUrl = '/jobs';
    } else if (notification.type === 'application_update') {
      targetUrl = '/applications';
    } else if (notification.type === 'message_received') {
      targetUrl = '/messages';
    } else if (notification.type === 'profile_incomplete' || notification.type === 'feedback_reminder') {
      targetUrl = '/profile-checkpoints';
    } else {
      // Default fallback
      targetUrl = notification.actionUrl || '/';
    }
    
    setLocation(targetUrl);
    
    toast({
      title: "Navigating...",
      description: `Opening ${getActionButtonText().toLowerCase()}`,
    });
  };

  const handleCardClick = () => {
    // Mark as read when clicked
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
    
    // Navigate to the relevant page
    if (notification.actionUrl) {
      handleActionClick();
    }
  };

  return (
    <Card 
      className={`transition-all duration-200 cursor-pointer hover:bg-gray-50 ${
        !notification.isRead ? 'bg-blue-50 border-blue-200' : 'bg-white'
      }`}
      onClick={handleCardClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            {getTypeIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className={`font-medium text-gray-900 ${
                !notification.isRead ? 'font-semibold' : ''
              }`}>
                {notification.title}
              </h3>
              
              <div className="flex items-center gap-2 flex-shrink-0">
                {!notification.isRead && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                )}
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mb-3 leading-relaxed">
              {notification.message}
            </p>
            
            {notification.jobTitle && (
              <div className="text-xs text-gray-500 mb-3">
                Related to: <span className="font-medium">{notification.jobTitle}</span>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                {formatDistanceToNow(new Date(notification.createdAt!), { addSuffix: true })}
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0 text-gray-400 hover:text-red-500"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click when deleting
                    onDelete(notification.id);
                  }}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function NotificationsPage() {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const queryClient = useQueryClient();
  
  // Check user role to ensure this is job seeker notifications, not employer
  const { data: userProfile } = useQuery({
    queryKey: ['/api/user-profile']
  });

  // Fetch notifications
  const { data: notifications = [], isLoading } = useQuery<Notification[]>({
    queryKey: ['/api/notifications'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Mark notification as read
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: number) => {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to mark as read');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
      queryClient.invalidateQueries({ queryKey: ['/api/notifications/unread-count'] });
    },
  });

  // Mark all as read
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/notifications/read-all', {
        method: 'PATCH',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to mark all as read');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
      queryClient.invalidateQueries({ queryKey: ['/api/notifications/unread-count'] });
    },
  });

  // Delete notification
  const deleteMutation = useMutation({
    mutationFn: async (notificationId: number) => {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to delete notification');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
      queryClient.invalidateQueries({ queryKey: ['/api/notifications/unread-count'] });
    },
  });

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.isRead;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-pink-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 notifications-page">
      <div className="max-w-4xl mx-auto px-4 py-4">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <BellRing className="w-8 h-8 text-pink-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Sora' }}>
                  Notifications
                </h1>
                <p className="text-gray-600 mt-1">
                  Stay updated on job matches, interviews, and application progress
                </p>
              </div>
            </div>

            {unreadCount > 0 && (
              <Button
                variant="outline"
                onClick={() => markAllAsReadMutation.mutate()}
                disabled={markAllAsReadMutation.isPending}
                className="flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Mark All Read
              </Button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-4 mb-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-pink-100 text-pink-700 border border-pink-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              All ({notifications.length})
            </button>
            
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                filter === 'unread'
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Unread ({unreadCount})
              {unreadCount > 0 && (
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
              )}
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-2">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {filter === 'all' ? 'No notifications yet' : 'All caught up!'}
                </h3>
                <p className="text-gray-600">
                  {filter === 'all' ? 
                    'We\'ll notify you when you have new job matches, interview invitations, and application updates.' :
                    'You\'ve read all your notifications. Great job staying on top of things!'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onMarkAsRead={(id) => markAsReadMutation.mutate(id)}
                onDelete={(id) => deleteMutation.mutate(id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}