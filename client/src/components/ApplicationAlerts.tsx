import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { X, Clock, AlertTriangle, Calendar } from "lucide-react";

interface ApplicationAlert {
  id: string;
  type: "incomplete" | "deadline";
  title: string;
  message: string;
  actionText: string;
  actionUrl: string;
  priority: "high" | "medium" | "low";
}

export function ApplicationAlerts() {
  const [alerts, setAlerts] = useState<ApplicationAlert[]>([]);
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  useEffect(() => {
    // Check for incomplete applications
    const checkIncompleteApplications = () => {
      const savedDrafts = localStorage.getItem('applicationDrafts');
      if (savedDrafts) {
        const drafts = JSON.parse(savedDrafts);
        const incompleteAlerts = Object.keys(drafts).map(jobId => ({
          id: `incomplete-${jobId}`,
          type: "incomplete" as const,
          title: "Incomplete Application",
          message: `You started applying for ${drafts[jobId].jobTitle} but haven't submitted yet.`,
          actionText: "Complete Application",
          actionUrl: `/job-application/${jobId}`,
          priority: "medium" as const
        }));
        return incompleteAlerts;
      }
      return [];
    };

    // Check for approaching deadlines on saved jobs
    const checkDeadlines = () => {
      const mockDeadlines = [
        {
          id: "deadline-job-001",
          type: "deadline" as const,
          title: "Application Deadline Approaching",
          message: "Marketing Coordinator at Growth Partners closes in 2 days.",
          actionText: "Apply Now",
          actionUrl: "/job-application/job-001",
          priority: "high" as const
        }
      ];
      return mockDeadlines;
    };

    const allAlerts = [
      ...checkIncompleteApplications(),
      ...checkDeadlines()
    ].filter(alert => !dismissedAlerts.includes(alert.id));

    setAlerts(allAlerts);
  }, [dismissedAlerts]);

  const dismissAlert = (alertId: string) => {
    setDismissedAlerts(prev => [...prev, alertId]);
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "incomplete": return <Clock className="w-4 h-4" />;
      case "deadline": return <AlertTriangle className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const getAlertVariant = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "default";
      default: return "default";
    }
  };

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-3 mb-6">
      {alerts.map((alert) => (
        <Alert key={alert.id} variant={getAlertVariant(alert.priority)}>
          <div className="flex items-center gap-2">
            {getAlertIcon(alert.type)}
            <div className="flex-1">
              <div className="font-semibold">{alert.title}</div>
              <AlertDescription className="mt-1">
                {alert.message}
              </AlertDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={alert.priority === "high" ? "default" : "outline"}
                onClick={() => window.location.href = alert.actionUrl}
              >
                {alert.actionText}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => dismissAlert(alert.id)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Alert>
      ))}
    </div>
  );
}