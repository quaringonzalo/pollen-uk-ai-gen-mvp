import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Star, User, Building2, Quote, Trash2, Mail, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface Testimonial {
  id: string;
  name: string;
  position: string;
  company?: string;
  rating: number;
  content: string;
  date: string;
  verified: boolean;
}

export default function EmployerTestimonials() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    {
      id: "1",
      name: "Sarah Johnson",
      position: "Marketing Coordinator",
      company: "Previous Role",
      rating: 5,
      content: "Working with this company was an incredible experience. The support and mentorship I received helped me grow professionally in ways I never expected.",
      date: "2024-12-15",
      verified: true
    }
  ]);

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [showEmailRequest, setShowEmailRequest] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({
    name: "",
    position: "",
    company: "",
    rating: 5,
    content: ""
  });
  const [emailRequest, setEmailRequest] = useState({
    recipientEmail: "",
    recipientName: "",
    recipientRole: "",
    customMessage: ""
  });

  const handleAddTestimonial = () => {
    if (!newTestimonial.name || !newTestimonial.position || !newTestimonial.content) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const testimonial: Testimonial = {
      id: Date.now().toString(),
      ...newTestimonial,
      date: new Date().toISOString().split('T')[0],
      verified: false
    };

    setTestimonials([...testimonials, testimonial]);
    setNewTestimonial({ name: "", position: "", company: "", rating: 5, content: "" });
    setIsAddingNew(false);

    toast({
      title: "Testimonial Added",
      description: "The testimonial has been added and will be reviewed by our team"
    });
  };

  const handleDeleteTestimonial = (id: string) => {
    setTestimonials(testimonials.filter(t => t.id !== id));
    toast({
      title: "Testimonial Removed",
      description: "The testimonial has been removed from your profile"
    });
  };

  // Email testimonial request mutation
  const sendTestimonialRequestMutation = useMutation({
    mutationFn: async (data: typeof emailRequest) => {
      return apiRequest("POST", "/api/testimonial-request", data);
    },
    onSuccess: () => {
      toast({
        title: "Request Sent Successfully",
        description: "The testimonial request has been sent via email"
      });
      setEmailRequest({
        recipientEmail: "",
        recipientName: "",
        recipientRole: "",
        customMessage: ""
      });
      setShowEmailRequest(false);
    },
    onError: () => {
      toast({
        title: "Failed to Send Request",
        description: "Please check the email address and try again",
        variant: "destructive"
      });
    }
  });

  const handleSendEmailRequest = () => {
    if (!emailRequest.recipientEmail || !emailRequest.recipientName) {
      toast({
        title: "Missing Information",
        description: "Please provide recipient email and name",
        variant: "destructive"
      });
      return;
    }

    sendTestimonialRequestMutation.mutate(emailRequest);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => setLocation("/profile-checkpoints")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Profile Checkpoints
              </Button>
              <div>
                <h1 className="text-2xl font-bold" style={{fontFamily: 'Sora'}}>Company Testimonials</h1>
                <p className="text-gray-600" style={{fontFamily: 'Poppins'}}>
                  Showcase positive feedback from employees and candidates
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Overview Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{fontFamily: 'Sora'}}>
              <Quote className="w-5 h-5 text-pink-600" />
              Manage Testimonials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4" style={{fontFamily: 'Poppins'}}>
              Testimonials help job seekers understand your company culture and what it's like to work with you. 
              Add testimonials from current employees, former employees, or candidates who've been through your hiring process.
            </p>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-800" style={{fontFamily: 'Poppins'}}>
                <strong>Note:</strong> All testimonials are reviewed by our team to ensure authenticity before appearing on your company profile.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Add New Testimonial */}
        {!isAddingNew && !showEmailRequest ? (
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  onClick={() => setIsAddingNew(true)}
                  className="bg-pink-600 hover:bg-pink-700"
                  style={{fontFamily: 'Sora'}}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Testimonial
                </Button>
                <Button 
                  onClick={() => setShowEmailRequest(true)}
                  variant="outline"
                  className="border-pink-600 text-pink-600 hover:bg-pink-50"
                  style={{fontFamily: 'Sora'}}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Request via Email
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : showEmailRequest ? (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle style={{fontFamily: 'Sora'}}>Request Testimonial via Email</CardTitle>
              <p className="text-gray-600" style={{fontFamily: 'Poppins'}}>
                Send a testimonial request to a current or former employee
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="recipientEmail">Email Address *</Label>
                  <Input
                    id="recipientEmail"
                    type="email"
                    value={emailRequest.recipientEmail}
                    onChange={(e) => setEmailRequest({...emailRequest, recipientEmail: e.target.value})}
                    placeholder="colleague@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="recipientName">Full Name *</Label>
                  <Input
                    id="recipientName"
                    value={emailRequest.recipientName}
                    onChange={(e) => setEmailRequest({...emailRequest, recipientName: e.target.value})}
                    placeholder="e.g. Sarah Johnson"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="recipientRole">Their Role (Optional)</Label>
                <Input
                  id="recipientRole"
                  value={emailRequest.recipientRole}
                  onChange={(e) => setEmailRequest({...emailRequest, recipientRole: e.target.value})}
                  placeholder="e.g. Marketing Coordinator"
                />
              </div>

              <div>
                <Label htmlFor="customMessage">Personal Message (Optional)</Label>
                <Textarea
                  id="customMessage"
                  value={emailRequest.customMessage}
                  onChange={(e) => setEmailRequest({...emailRequest, customMessage: e.target.value})}
                  placeholder="Add a personal message to include with the testimonial request..."
                  rows={3}
                />
                <p className="text-xs text-gray-500 mt-1">
                  This will be included with the standard testimonial request email.
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800" style={{fontFamily: 'Poppins'}}>
                  <strong>What happens next:</strong> We'll send a professional email on your behalf requesting a testimonial. 
                  The recipient will receive a secure link to submit their feedback directly.
                </p>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={handleSendEmailRequest}
                  disabled={sendTestimonialRequestMutation.isPending}
                  className="bg-pink-600 hover:bg-pink-700"
                  style={{fontFamily: 'Sora'}}
                >
                  <Send className="w-4 h-4 mr-2" />
                  {sendTestimonialRequestMutation.isPending ? "Sending..." : "Send Request"}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setShowEmailRequest(false)}
                  style={{fontFamily: 'Sora'}}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle style={{fontFamily: 'Sora'}}>Add New Testimonial</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Person's Name *</Label>
                  <Input
                    id="name"
                    value={newTestimonial.name}
                    onChange={(e) => setNewTestimonial({...newTestimonial, name: e.target.value})}
                    placeholder="e.g. Sarah Johnson"
                  />
                </div>
                <div>
                  <Label htmlFor="position">Position/Role *</Label>
                  <Input
                    id="position"
                    value={newTestimonial.position}
                    onChange={(e) => setNewTestimonial({...newTestimonial, position: e.target.value})}
                    placeholder="e.g. Marketing Coordinator"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="company">Company (Optional)</Label>
                <Input
                  id="company"
                  value={newTestimonial.company}
                  onChange={(e) => setNewTestimonial({...newTestimonial, company: e.target.value})}
                  placeholder="e.g. Previous Role, Current Employee"
                />
              </div>

              <div>
                <Label htmlFor="rating">Rating</Label>
                <div className="flex items-center gap-2 mt-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setNewTestimonial({...newTestimonial, rating: i + 1})}
                      className="focus:outline-none"
                    >
                      <Star 
                        className={`w-6 h-6 ${i < newTestimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    </button>
                  ))}
                  <span className="text-sm text-gray-600 ml-2">{newTestimonial.rating}/5</span>
                </div>
              </div>

              <div>
                <Label htmlFor="content">Testimonial Content *</Label>
                <Textarea
                  id="content"
                  value={newTestimonial.content}
                  onChange={(e) => setNewTestimonial({...newTestimonial, content: e.target.value})}
                  placeholder="Share their positive experience working with your company..."
                  rows={4}
                />
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={handleAddTestimonial}
                  className="bg-pink-600 hover:bg-pink-700"
                  style={{fontFamily: 'Sora'}}
                >
                  Add Testimonial
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setIsAddingNew(false)}
                  style={{fontFamily: 'Sora'}}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Existing Testimonials */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold" style={{fontFamily: 'Sora'}}>
            Current Testimonials ({testimonials.length})
          </h3>
          
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-medium" style={{fontFamily: 'Sora'}}>{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.position}</p>
                      {testimonial.company && (
                        <p className="text-sm text-gray-500">{testimonial.company}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {testimonial.verified ? (
                      <Badge className="bg-green-100 text-green-800">Verified</Badge>
                    ) : (
                      <Badge className="bg-yellow-100 text-yellow-800">Under Review</Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTestimonial(testimonial.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  {renderStars(testimonial.rating)}
                  <span className="text-sm text-gray-600">({testimonial.rating}/5)</span>
                </div>

                <blockquote className="text-gray-700 italic mb-3" style={{fontFamily: 'Poppins'}}>
                  "{testimonial.content}"
                </blockquote>

                <p className="text-sm text-gray-500">Added on {new Date(testimonial.date).toLocaleDateString()}</p>
              </CardContent>
            </Card>
          ))}

          {testimonials.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Quote className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="font-medium text-gray-900 mb-2" style={{fontFamily: 'Sora'}}>No testimonials yet</h4>
                <p className="text-gray-600 mb-4" style={{fontFamily: 'Poppins'}}>
                  Start building trust with job seekers by adding testimonials from employees and candidates.
                </p>
                <Button 
                  onClick={() => setIsAddingNew(true)}
                  variant="outline"
                  style={{fontFamily: 'Sora'}}
                >
                  Add Your First Testimonial
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}