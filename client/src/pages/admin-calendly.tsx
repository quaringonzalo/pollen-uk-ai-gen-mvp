import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Clock, ExternalLink, Plus, Settings } from "lucide-react";
import { CalendlyIntegration } from "@/components/CalendlyIntegration";
import { useQuery } from "@tanstack/react-query";

export default function AdminCalendlyPage() {
  const [showSetup, setShowSetup] = useState(false);

  // Fetch scheduled interviews
  const { data: scheduledInterviews, isLoading: interviewsLoading } = useQuery({
    queryKey: ['/api/interviews/scheduled'],
    retry: false
  });

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Calendly Integration</h1>
          <p className="text-gray-600">Manage interview scheduling and Calendly connections</p>
        </div>
        
        <Button onClick={() => setShowSetup(!showSetup)} variant="outline">
          <Settings className="w-4 h-4 mr-2" />
          {showSetup ? 'Hide Setup' : 'Setup Integration'}
        </Button>
      </div>

      {/* Setup Section */}
      {showSetup && (
        <CalendlyIntegration />
      )}

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-base">Scheduled Interviews</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {scheduledInterviews?.length || 0}
            </div>
            <p className="text-sm text-gray-600 mt-1">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-green-600" />
              <CardTitle className="text-base">Candidates Interviewed</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {scheduledInterviews?.filter((i: any) => i.status === 'completed').length || 0}
            </div>
            <p className="text-sm text-gray-600 mt-1">Completed interviews</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <CardTitle className="text-base">Average Response Time</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">2.4h</div>
            <p className="text-sm text-gray-600 mt-1">From invite to booking</p>
          </CardContent>
        </Card>
      </div>

      {/* Scheduled Interviews */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Upcoming Interviews</CardTitle>
            <Badge variant="secondary">{scheduledInterviews?.length || 0} scheduled</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {interviewsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (scheduledInterviews as any[])?.length > 0 ? (
            <div className="space-y-4">
              {((scheduledInterviews as any[]) || []).slice(0, 5).map((interview: any, index: number) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="font-medium text-gray-900">
                        {interview.candidateName || 'Unnamed Candidate'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {interview.candidateEmail}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(interview.scheduledAt).toLocaleDateString('en-GB', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant={interview.status === 'scheduled' ? 'secondary' : 
                                interview.status === 'completed' ? 'default' : 'outline'}
                      >
                        {interview.status}
                      </Badge>
                      
                      {interview.meetingUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(interview.meetingUrl, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {interview.notes && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-sm text-gray-600">{interview.notes}</p>
                    </div>
                  )}
                </div>
              ))}
              
              {((scheduledInterviews as any[])?.length || 0) > 5 && (
                <div className="text-center pt-4">
                  <Button variant="outline" size="sm">
                    View All {(scheduledInterviews as any[])?.length || 0} Interviews
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-medium text-gray-900 mb-2">No Scheduled Interviews</h3>
              <p className="text-gray-600 mb-4">
                Once candidates book interviews through Calendly, they'll appear here.
              </p>
              {!showSetup && (
                <Button onClick={() => setShowSetup(true)} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Set Up Calendly Integration
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="justify-start h-auto p-4"
              onClick={() => window.open('https://calendly.com/event_types/manage', '_blank')}
            >
              <Settings className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Manage Event Types</div>
                <div className="text-sm text-gray-600">Configure interview slots and availability</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="justify-start h-auto p-4"
              onClick={() => window.open('https://calendly.com/integrations/api_webhooks', '_blank')}
            >
              <ExternalLink className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Webhook Settings</div>
                <div className="text-sm text-gray-600">Configure automatic notifications</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}