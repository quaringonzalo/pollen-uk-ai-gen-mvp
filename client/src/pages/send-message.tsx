import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLocation } from 'wouter';
import { ArrowLeft, Send, MessageSquare, Clock, User, CheckCircle } from 'lucide-react';

interface CandidateData {
  id: number;
  name: string;
  pronouns: string;
  jobTitle: string;
  status: string;
  email: string;
}

interface MessageTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
}

export default function SendMessage() {
  const [location, setLocation] = useLocation();
  const candidateId = location.split('/').pop();
  
  const [messageType, setMessageType] = useState<string>('');
  const [messageSubject, setMessageSubject] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock candidate data - in real app, fetch from API
  const candidateData: CandidateData = {
    id: parseInt(candidateId || '23'),
    name: candidateId === '23' ? 'Priya Singh' : candidateId === '20' ? 'Sarah Chen' : 'James Wilson',
    pronouns: candidateId === '23' ? 'she/her' : candidateId === '20' ? 'she/her' : 'he/him',
    jobTitle: 'Digital Marketing Assistant',
    status: candidateId === '24' ? 'hired' : 'complete',
    email: candidateId === '23' ? 'priya.singh@email.com' : candidateId === '20' ? 'sarah.chen@email.com' : 'james.wilson@email.com'
  };

  const messageTemplates: MessageTemplate[] = [
    {
      id: 'feedback_thanks',
      name: 'Thank You for Application',
      subject: 'Thank you for your application - Digital Marketing Assistant',
      content: `Hi ${candidateData.name},\n\nThank you for taking the time to apply for the Digital Marketing Assistant position with us. We were impressed by your application and enjoyed learning more about your background.\n\nWhile we've decided not to move forward with your application for this particular role, we encourage you to apply for future opportunities that match your skills and interests.\n\nWe wish you all the best in your job search.\n\nBest regards,\nThe Hiring Team`
    },
    {
      id: 'keep_in_touch',
      name: 'Keep in Touch for Future Roles',
      subject: 'Future opportunities - Digital Marketing Assistant',
      content: `Hi ${candidateData.name},\n\nThank you for your interest in the Digital Marketing Assistant role. While this particular position wasn't the right fit, we were impressed by your profile and would like to keep you in mind for future opportunities.\n\nWe'll reach out if a suitable role becomes available that matches your skills and career goals.\n\nBest regards,\nThe Hiring Team`
    },
    {
      id: 'congratulations',
      name: 'Congratulations Message',
      subject: 'Congratulations on your new role!',
      content: `Hi ${candidateData.name},\n\nCongratulations on successfully completing the hiring process! We're thrilled to welcome you to the team.\n\nYour start date and onboarding details will be shared separately. We're looking forward to working with you.\n\nWelcome aboard!\n\nBest regards,\nThe Hiring Team`
    },
    {
      id: 'custom',
      name: 'Custom Message',
      subject: '',
      content: ''
    }
  ];

  const handleTemplateChange = (templateId: string) => {
    setMessageType(templateId);
    const template = messageTemplates.find(t => t.id === templateId);
    if (template) {
      setMessageSubject(template.subject);
      setMessageContent(template.content);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Sending message:', {
      candidateId,
      messageType,
      messageSubject,
      messageContent,
      recipientEmail: candidateData.email
    });
    
    setIsSubmitting(false);
    
    // Navigate back to candidates list
    setLocation('/candidates');
  };

  const isFormValid = messageType !== '' && 
                     messageSubject.trim() !== '' && 
                     messageContent.trim() !== '';

  const getStatusInfo = (status: string) => {
    switch(status) {
      case 'complete':
        return { 
          badge: <Badge className="bg-red-100 text-red-800">Not Progressing</Badge>,
          context: 'Send follow-up message or feedback'
        };
      case 'hired':
        return { 
          badge: <Badge className="bg-emerald-100 text-emerald-800">Hired</Badge>,
          context: 'Send congratulations or check-in message'
        };
      default:
        return { 
          badge: <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>,
          context: 'Send message to candidate'
        };
    }
  };

  const statusInfo = getStatusInfo(candidateData.status);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setLocation('/candidates')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Candidates
          </Button>
          <div>
            <h1 className="text-2xl font-bold" style={{fontFamily: 'Sora'}}>
              Send Message
            </h1>
            <p className="text-gray-600" style={{fontFamily: 'Poppins'}}>
              Communicate with {candidateData.name}
            </p>
          </div>
        </div>

        {/* Candidate Summary */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold" style={{fontFamily: 'Sora'}}>
                  {candidateData.name} <span className="text-gray-500 font-normal">({candidateData.pronouns})</span>
                </h2>
                <p className="text-gray-600 mt-1">Applied for: {candidateData.jobTitle}</p>
                <p className="text-sm text-gray-600 mt-1">Email: {candidateData.email}</p>
                <div className="flex items-center gap-4 mt-3">
                  {statusInfo.badge}
                  <span className="text-sm text-gray-600">{statusInfo.context}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium">Direct Communication</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Message Composition */}
        <Card>
          <CardHeader>
            <CardTitle style={{fontFamily: 'Sora'}}>Compose Message</CardTitle>
            <p className="text-sm text-gray-600">Choose a template or write a custom message</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Message Template Selection */}
            <div>
              <Label className="text-base font-medium">Message Template</Label>
              <Select value={messageType} onValueChange={handleTemplateChange}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Choose a message template..." />
                </SelectTrigger>
                <SelectContent>
                  {messageTemplates.map(template => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Subject Line */}
            {messageType && (
              <div>
                <Label className="text-base font-medium">Subject Line</Label>
                <input
                  type="text"
                  value={messageSubject}
                  onChange={(e) => setMessageSubject(e.target.value)}
                  className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Enter email subject..."
                />
              </div>
            )}

            {/* Message Content */}
            {messageType && (
              <div>
                <Label className="text-base font-medium">Message Content</Label>
                <Textarea
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  className="mt-2"
                  rows={12}
                  placeholder="Write your message..."
                />
                <p className="text-xs text-gray-500 mt-2">
                  This message will be sent to {candidateData.email} and saved to the candidate's communication history.
                </p>
              </div>
            )}

            {/* Preview */}
            {messageType && messageSubject && messageContent && (
              <div className="bg-gray-50 border rounded-lg p-4">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Message Preview
                </h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">To:</span> {candidateData.email}</div>
                  <div><span className="font-medium">Subject:</span> {messageSubject}</div>
                  <div className="border-t pt-3">
                    <div className="whitespace-pre-wrap bg-white p-3 rounded border">
                      {messageContent}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            className="flex-1 bg-pink-600 hover:bg-pink-700"
            style={{fontFamily: 'Sora'}}
          >
            {isSubmitting ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Sending Message...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => setLocation('/candidates')}
            disabled={isSubmitting}
            style={{fontFamily: 'Sora'}}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}