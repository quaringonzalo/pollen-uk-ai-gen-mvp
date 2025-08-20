import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExternalLink, Calendar, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface CalendlyIntegrationProps {
  onSchedulingLinkGenerated?: (url: string) => void;
  applicationId?: string;
  candidateName?: string;
  candidateEmail?: string;
}

export function CalendlyIntegration({
  onSchedulingLinkGenerated,
  applicationId,
  candidateName,
  candidateEmail
}: CalendlyIntegrationProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [accessToken, setAccessToken] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  
  // Check for existing integration
  const { data: eventTypes, isLoading: eventTypesLoading } = useQuery({
    queryKey: ['/api/calendly/event-types'],
    retry: false,
    enabled: false // We'll manually refetch after connecting
  });

  // Mutation to connect Calendly
  const connectCalendlyMutation = useMutation({
    mutationFn: async (token: string) => {
      const response = await fetch('/api/calendly/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken: token,
          refreshToken: null // For simplicity, not handling refresh tokens in this demo
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to connect Calendly');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Calendly Connected!",
        description: "Your Calendly account has been successfully integrated.",
      });
      
      // Refetch event types
      queryClient.invalidateQueries({ queryKey: ['/api/calendly/event-types'] });
      queryClient.refetchQueries({ queryKey: ['/api/calendly/event-types'] });
    },
    onError: (error: any) => {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect your Calendly account.",
        variant: "destructive",
      });
    },
  });

  // Mutation to generate scheduling link
  const generateLinkMutation = useMutation({
    mutationFn: async () => {
      if (!applicationId || !candidateName || !candidateEmail) {
        throw new Error('Missing required candidate information');
      }

      const response = await fetch('/api/interviews/generate-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicationId,
          candidateName,
          candidateEmail
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate scheduling link');
      }

      return response.json();
    },
    onSuccess: (data) => {
      if (onSchedulingLinkGenerated) {
        onSchedulingLinkGenerated(data.schedulingUrl);
      }
      
      toast({
        title: "Scheduling Link Generated",
        description: "The candidate can now schedule their interview using this link.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Link Generation Failed",
        description: error.message || "Failed to generate scheduling link.",
        variant: "destructive",
      });
    },
  });

  const handleConnect = async () => {
    if (!accessToken.trim()) {
      toast({
        title: "Access Token Required",
        description: "Please enter your Calendly access token.",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    try {
      await connectCalendlyMutation.mutateAsync(accessToken);
      setAccessToken(""); // Clear the token after successful connection
    } finally {
      setIsConnecting(false);
    }
  };

  const handleGenerateLink = () => {
    generateLinkMutation.mutate();
  };

  // Check if integration exists by trying to fetch event types
  useEffect(() => {
    queryClient.refetchQueries({ queryKey: ['/api/calendly/event-types'] });
  }, [queryClient]);

  const hasIntegration = eventTypes && !eventTypesLoading;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <CardTitle className="text-lg">Calendly Integration</CardTitle>
          {hasIntegration && (
            <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
              <CheckCircle className="w-3 h-3 mr-1" />
              Connected
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!hasIntegration ? (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Connect Your Calendly Account</h4>
                  <p className="text-sm text-blue-800 mb-3">
                    To use automated interview scheduling, connect your Calendly account with an access token.
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="calendly-token" className="text-sm font-medium text-blue-900">
                      Calendly Access Token
                    </Label>
                    <Input
                      id="calendly-token"
                      type="password"
                      placeholder="Enter your Calendly access token"
                      value={accessToken}
                      onChange={(e) => setAccessToken(e.target.value)}
                      className="bg-white border-blue-200"
                    />
                    <p className="text-xs text-blue-700">
                      Get your access token from your Calendly developer settings.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleConnect}
                disabled={isConnecting || !accessToken.trim()}
                className="flex-1"
              >
                {isConnecting ? "Connecting..." : "Connect Calendly"}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => window.open('https://calendly.com/integrations/api_webhooks', '_blank')}
                className="px-3"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="font-medium text-green-900">Calendly Connected</span>
              </div>
              <p className="text-sm text-green-800">
                Your Calendly account is connected and ready for interview scheduling.
              </p>
            </div>

            {applicationId && candidateName && candidateEmail && (
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Generate Scheduling Link</h4>
                <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Candidate:</span> {candidateName}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Email:</span> {candidateEmail}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Application ID:</span> {applicationId}
                  </p>
                </div>
                
                <Button
                  onClick={handleGenerateLink}
                  disabled={generateLinkMutation.isPending}
                  className="w-full"
                >
                  {generateLinkMutation.isPending ? "Generating Link..." : "Generate Scheduling Link"}
                </Button>
              </div>
            )}

            <div className="pt-2 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2">Available Event Types</h4>
              {eventTypesLoading ? (
                <p className="text-sm text-gray-500">Loading event types...</p>
              ) : (eventTypes as any)?.collection?.length > 0 ? (
                <div className="space-y-2">
                  {((eventTypes as any).collection || []).slice(0, 3).map((eventType: any, index: number) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">
                          {eventType.name || 'Event Type'}
                        </span>
                        <Badge variant={eventType.active ? "secondary" : "outline"} className="text-xs">
                          {eventType.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {eventType.duration || 30} minutes • {eventType.kind || 'One-on-One'}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No active event types found.</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}