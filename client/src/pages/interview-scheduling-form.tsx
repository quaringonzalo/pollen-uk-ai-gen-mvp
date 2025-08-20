import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Calendar, Clock, Video, MessageSquare, ExternalLink, CheckCircle, Monitor, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CalendlyIntegration } from "@/components/CalendlyIntegration";

export default function InterviewSchedulingForm() {
  const [match, params] = useRoute("/interview-schedule-form/:applicationId");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [schedulingUrl, setSchedulingUrl] = useState<string>("");

  const applicationId = params?.applicationId || "1";

  // Different interview details based on application ID
  const getInterviewDetails = (appId: string) => {
    switch(appId) {
      case "1":
        return {
          jobTitle: "Marketing Assistant",
          company: "TechFlow Solutions", 
          interviewer: {
            name: "Holly Saunders",
            role: "Pollen Team",
            avatar: "/attached_assets/Holly_1752681740688.jpg"
          },
          interviewType: "Pollen Screening",
          instructions: "Initial chat to see if it's a good fit on both sides.",
          estimatedDuration: "20 minutes",
          platform: "Video Call"
        };
      case "2":
        return {
          jobTitle: "Customer Support Specialist",
          company: "StartupHub",
          interviewer: {
            name: "Emma Wilson",
            role: "Hiring Manager",
            avatar: "/attached_assets/849d94d3-b598-4a6e-b124-4a4cdd2c1cf4 (3)_1753739060687.JPG"
          },
          interviewType: "Employer Interview", 
          instructions: "Face-to-face interview at our Manchester office to discuss the role and team fit.",
          estimatedDuration: "45 minutes",
          platform: "In-Person"
        };
      default:
        return {
          jobTitle: "Marketing Assistant",
          company: "TechFlow Solutions", 
          interviewer: {
            name: "Holly Saunders",
            role: "Pollen Team",
            avatar: "/attached_assets/Holly_1752681740688.jpg"
          },
          interviewType: "Pollen Screening",
          instructions: "Initial chat to see if it's a good fit on both sides.",
          estimatedDuration: "20 minutes",
          platform: "Video Call"
        };
    }
  };

  const interviewDetails = getInterviewDetails(applicationId);

  // Mock candidate details - in real app would fetch from application
  const candidateDetails = {
    name: "Sarah Chen",
    email: "sarah.chen@email.com"
  };

  // Different time slots based on application ID  
  const getTimeSlots = (appId: string) => {
    if (appId === "2") {
      // Emma Wilson's employer interview slots (in-person)
      return [
        {
          id: "tue-10",
          date: "Tuesday 21 January 2025",
          time: "10:00",
          duration: "45 minutes",
          platform: "In-Person (Manchester Office)"
        },
        {
          id: "tue-14",
          date: "Tuesday 21 January 2025", 
          time: "14:00",
          duration: "45 minutes",
          platform: "In-Person (Manchester Office)"
        },
        {
          id: "wed-11",
          date: "Wednesday 22 January 2025",
          time: "11:00", 
          duration: "45 minutes",
          platform: "In-Person (Manchester Office)"
        },
        {
          id: "thu-09",
          date: "Thursday 23 January 2025",
          time: "09:30",
          duration: "45 minutes", 
          platform: "In-Person (Manchester Office)"
        }
      ];
    } else {
      // Holly's Pollen screening slots (video call)
      return [
        {
          id: "sat-10",
          date: "Saturday 18 January 2025",
          time: "10:00",
          duration: "20 minutes",
          platform: "Video Call"
        },
        {
          id: "sat-14",
          date: "Saturday 18 January 2025", 
          time: "14:00",
          duration: "20 minutes",
          platform: "Video Call"
        },
        {
          id: "sun-11",
          date: "Sunday 19 January 2025",
          time: "11:00", 
          duration: "20 minutes",
          platform: "Video Call"
        },
        {
          id: "sun-15",
          date: "Sunday 19 January 2025",
          time: "15:30",
          duration: "20 minutes", 
          platform: "Video Call"
        }
      ];
    }
  };

  const timeSlots = getTimeSlots(applicationId);

  const handleScheduleInterview = async () => {
    if (!selectedSlot) {
      toast({
        title: "Please select a time slot",
        description: "Choose an available time slot to schedule your interview.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Interview scheduled!",
        description: "You'll receive a confirmation email with interview details.",
      });
      
      // Navigate to interview confirmation page
      setLocation(`/interview-confirmation/${applicationId}`);
    } catch (error) {
      toast({
        title: "Error scheduling interview",
        description: "Please try again or contact support if the problem persists.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-6 space-y-6">
      {/* Header with back navigation */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setLocation("/applications")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to My Applications
        </Button>
      </div>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Schedule Interview</h1>
          <p className="text-gray-600">{applicationId === "1" ? "Chat with Pollen" : `${interviewDetails.interviewType} with ${interviewDetails.company}`}</p>
        </div>

        {/* Interview Details Card */}
        <Card className="border-l-4 border-l-pink-500">
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Interview Details</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">{interviewDetails.jobTitle} application</span>
                    <span className="text-gray-600"> at {interviewDetails.company}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Interviewer:</span>
                    <span className="text-gray-600"> {interviewDetails.interviewer.name} at {applicationId === "1" ? "Pollen" : interviewDetails.company}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Next Step:</span>
                    <span className="text-gray-600"> {interviewDetails.platform === 'In-Person' ? 'Book your interview slot' : 'Book your call'}</span>
                  </div>
                </div>
              </div>

              {/* Interviewer Info with Avatar */}
              <div className="flex items-center gap-3 pt-3 border-t">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img 
                    src={interviewDetails.interviewer.avatar} 
                    alt="Holly Saunders"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{interviewDetails.interviewer.name}</div>
                  <div className="text-sm text-gray-600">{interviewDetails.interviewer.role}</div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {interviewDetails.estimatedDuration}
                  </span>
                  <span className="flex items-center gap-1">
                    {interviewDetails.platform === 'In-Person' ? (
                      <MessageSquare className="w-4 h-4" />
                    ) : (
                      <Video className="w-4 h-4" />
                    )}
                    {interviewDetails.platform}
                  </span>
                </div>
              </div>
              
              {/* Interview Instructions */}
              <div className={`mt-4 p-4 rounded-lg border ${
                applicationId === "1" ? 'bg-blue-50 border-blue-200' : 'bg-purple-50 border-purple-200'
              }`}>
                <h4 className="font-medium text-gray-900 mb-2">
                  {applicationId === "1" ? 'Instructions:' : 'What to Expect:'}
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {applicationId === "1" ? 
                    "This is an initial informal chat with the Pollen team." :
                    "This interview will focus on your customer service experience and problem-solving abilities. Emma will ask about your approach to handling customer inquiries, working with teams, and managing challenging situations. Come prepared with specific examples and questions about StartupHub's customer support processes."
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conditional Message Section */}
        {applicationId === "1" && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  <CardTitle className="text-lg text-blue-900">Message from Pollen</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLocation('/messages?conversation=holly')}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                >
                  View Full History
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Message from Holly */}
              <div className="flex justify-start">
                <div className="max-w-[70%]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <img 
                        src={interviewDetails.interviewer.avatar} 
                        alt="Holly Saunders"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Holly Saunders</div>
                      <div className="text-xs text-gray-500">16 Jan</div>
                    </div>
                  </div>
                  <div className="bg-gray-100 text-gray-900 rounded-lg p-3 mr-8">
                    <p className="text-sm leading-relaxed whitespace-pre-line">
                    {`Hi Zara,

We're reaching out in relation to the Marketing Assistant with TechFlow Solutions. Thanks so much for your application! It would be great to have an informal chat to see if it's a good fit on both sides. Please use the following booking link:

https://calendly.com/pollen-team/pollen-interview

Look forward to speaking soon,

Thanks
Holly`}
                  </p>
                </div>
              </div>
            </div>

            {/* Reply Input */}
            <div className="border-t pt-4">
              <div className="flex gap-2">
                <Textarea
                  placeholder="Type your reply to Holly..."
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  className="flex-1 min-h-[80px] resize-none"
                />
                <Button 
                  size="sm" 
                  className="bg-blue-600 hover:bg-blue-700 self-end"
                  onClick={() => {
                    console.log('Reply sent:', additionalNotes);
                    setAdditionalNotes('');
                  }}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Reply
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        )}

        {/* Available Time Slots or Booking Link */}
        {applicationId === "1" ? (
          // Holly's Pollen screening - Use Calendly link
          <div className="flex justify-center">
            <Button
              onClick={() => window.open("https://calendly.com/pollen-team/pollen-interview", '_blank')}
              className="bg-blue-600 hover:bg-blue-700 px-8"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Book Time Slot
            </Button>
          </div>
        ) : (
          // Emma's employer interview - Show detailed time slots
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Available Time Slots
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Emma's employer interview slots */}
              <>
                <div 
                  onClick={() => setSelectedSlot("mon-0930")}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedSlot === "mon-0930" 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Monitor className="w-4 h-4 text-gray-600 mr-3" />
                      <div>
                        <div className="font-medium">Monday 20 January 2025 <span className="text-gray-600">at 09:30</span></div>
                        <div className="text-sm text-gray-500">⏱ 45 minutes • Video Call</div>
                      </div>
                    </div>
                    {selectedSlot === "mon-0930" && (
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                </div>

                <div 
                  onClick={() => setSelectedSlot("mon-1400")}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedSlot === "mon-1400" 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Monitor className="w-4 h-4 text-gray-600 mr-3" />
                      <div>
                        <div className="font-medium">Monday 20 January 2025 <span className="text-gray-600">at 14:00</span></div>
                        <div className="text-sm text-gray-500">⏱ 45 minutes • Video Call</div>
                      </div>
                    </div>
                    {selectedSlot === "mon-1400" && (
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                </div>

                <div 
                  onClick={() => setSelectedSlot("tue-1000")}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedSlot === "tue-1000" 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Monitor className="w-4 h-4 text-gray-600 mr-3" />
                      <div>
                        <div className="font-medium">Tuesday 21 January 2025 <span className="text-gray-600">at 10:00</span></div>
                        <div className="text-sm text-gray-500">⏱ 45 minutes • Video Call</div>
                      </div>
                    </div>
                    {selectedSlot === "tue-1000" && (
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                </div>

                <div 
                  onClick={() => setSelectedSlot("wed-1130")}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedSlot === "wed-1130" 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Monitor className="w-4 h-4 text-gray-600 mr-3" />
                      <div>
                        <div className="font-medium">Wednesday 22 January 2025 <span className="text-gray-600">at 11:30</span></div>
                        <div className="text-sm text-gray-500">⏱ 45 minutes • Video Call</div>
                      </div>
                    </div>
                    {selectedSlot === "wed-1130" && (
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                </div>
              </>
            </CardContent>
          </Card>
        )}

        {/* Schedule Interview Button - Only show for employer interviews when slot is selected */}
        {applicationId !== "1" && selectedSlot && (
          <div className="flex justify-center pt-6">
            <Button
              onClick={handleScheduleInterview}
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg"
            >
              {isSubmitting ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Scheduling...
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Interview
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}