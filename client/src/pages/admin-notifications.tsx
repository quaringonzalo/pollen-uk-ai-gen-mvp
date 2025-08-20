import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Bell, ArrowLeft, CheckCircle, AlertTriangle, Info,
  Clock, Eye, X, Calendar,
  Users, Building2, FileText, MessageSquare
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  type: 'urgent' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionRoute?: string;
  actionLabel?: string;
  category: 'jobs' | 'employers' | 'candidates' | 'system';
  relatedCount?: number;
}

export default function AdminNotifications() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: notifications } = useQuery<Notification[]>({
    queryKey: ["/api/admin/notifications"],
    initialData: [
      {
        id: "1",
        type: "urgent",
        title: "Candidates Awaiting Updates",
        message: "3 candidates for Marketing Assistant at K7 Media have been waiting 5+ days for status updates",
        timestamp: "2025-01-14T09:30:00Z",
        isRead: false,
        actionRoute: "/admin/job-applicants-kanban/1",
        actionLabel: "Review Now",
        category: "candidates",
        relatedCount: 3
      },
      {
        id: "2",
        type: "info",
        title: "New Employer Application",
        message: "TechFlow Solutions has completed their employer profile - review required",
        timestamp: "2025-01-14T08:45:00Z",
        isRead: false,
        actionRoute: "/admin/employers",
        actionLabel: "Review Profile",
        category: "employers",
        relatedCount: 1
      },
      {
        id: "3",
        type: "warning",
        title: "New Job Posting Created",
        message: "Creative Studios has created a new Social Media Coordinator role - awaiting approval",
        timestamp: "2025-01-14T08:15:00Z",
        isRead: false,
        actionRoute: "/admin/assigned-jobs",
        actionLabel: "Review Job",
        category: "jobs",
        relatedCount: 1
      },
      {
        id: "4",
        type: "info",
        title: "Interview Scheduled",
        message: "James Mitchell booked his Pollen interview slot for tomorrow at 2:00 PM",
        timestamp: "2025-01-14T07:30:00Z",
        isRead: false,
        actionRoute: "/admin/job-applicants-kanban/1",
        actionLabel: "View Details",
        category: "candidates",
        relatedCount: 1
      },
      {
        id: "5",
        type: "info",
        title: "Employer Profile Updated",
        message: "K7 Media Group has updated their company profile and job requirements",
        timestamp: "2025-01-13T16:20:00Z",
        isRead: false,
        actionRoute: "/admin/employers",
        actionLabel: "Review Changes",
        category: "employers",
        relatedCount: 1
      },
      {
        id: "6",
        type: "warning",
        title: "Application Deadline Approaching",
        message: "Marketing Assistant role at Creative Studios closes in 2 days - 8 candidates to review",
        timestamp: "2025-01-13T14:45:00Z",
        isRead: true,
        actionRoute: "/admin/job-applicants-kanban/2",
        actionLabel: "Review Candidates",
        category: "jobs",
        relatedCount: 8
      },
      {
        id: "7",
        type: "info",
        title: "New Employer Application",
        message: "Bright Digital Agency has submitted their application to join Pollen",
        timestamp: "2025-01-12T11:30:00Z",
        isRead: true,
        actionRoute: "/admin/employers",
        actionLabel: "Review Application",
        category: "employers",
        relatedCount: 1
      },
      {
        id: "8",
        type: "success",
        title: "Week Target Progress",
        message: "2 of 4 weekly placements completed - on track for weekly target",
        timestamp: "2025-01-12T09:00:00Z",
        isRead: true,
        category: "system",
        relatedCount: 2
      }
    ]
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      return await apiRequest("PUT", `/api/admin/notifications/${notificationId}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/notifications"] });
      toast({
        title: "Notification marked as read",
        description: "Notification status updated successfully",
      });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("PUT", "/api/admin/notifications/mark-all-read");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/notifications"] });
      toast({
        title: "All notifications marked as read",
        description: "All notifications have been marked as read",
      });
    },
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'urgent':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-600" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'jobs':
        return <FileText className="h-4 w-4" />;
      case 'employers':
        return <Building2 className="h-4 w-4" />;
      case 'candidates':
        return <Users className="h-4 w-4" />;
      case 'system':
        return <Bell className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

  return (
    <div className="min-h-screen bg-gray-50 admin-compact-mode">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                onClick={() => setLocation("/admin")}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-xl font-bold text-gray-900 flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notifications
                {unreadCount > 0 && (
                  <Badge className="ml-2 bg-red-100 text-red-800">{unreadCount} unread</Badge>
                )}
              </h1>
            </div>
            
            {unreadCount > 0 && (
              <Button 
                onClick={() => markAllAsReadMutation.mutate()}
                disabled={markAllAsReadMutation.isPending}
                size="sm"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark All Read
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-4">
          {notifications?.map((notification) => (
            <Card 
              key={notification.id} 
              className={`transition-all hover:shadow-md ${
                !notification.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50' : ''
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1">
                      <CardTitle className="text-base font-medium text-gray-900 flex items-center">
                        {notification.title}
                        {notification.relatedCount && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            {notification.relatedCount}
                          </Badge>
                        )}
                      </CardTitle>
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        {getCategoryIcon(notification.category)}
                        <span className="ml-1 capitalize">{notification.category}</span>
                        <span className="mx-2">•</span>
                        <Clock className="h-3 w-3 mr-1" />
                        {formatTimestamp(notification.timestamp)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {!notification.isRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsReadMutation.mutate(notification.id)}
                        disabled={markAsReadMutation.isPending}
                        className="text-xs"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Mark Read
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-gray-700 mb-3">{notification.message}</p>
                
                {notification.actionRoute && (
                  <Button 
                    size="sm"
                    onClick={() => {
                      // Mark as read when navigating
                      if (!notification.isRead) {
                        markAsReadMutation.mutate(notification.id);
                      }
                      setLocation(notification.actionRoute!);
                    }}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {notification.actionLabel || 'View Details'}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {(!notifications || notifications.length === 0) && (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-500">You're all caught up! Check back later for updates.</p>
          </div>
        )}
      </div>
    </div>
  );
}