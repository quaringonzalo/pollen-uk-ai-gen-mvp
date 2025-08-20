import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useLocation } from 'wouter';
import { ArrowLeft, CheckCircle, XCircle, Clock, MessageSquare, Send, Gift } from 'lucide-react';

interface CandidateData {
  id: number;
  name: string;
  pronouns: string;
  jobTitle: string;
  offerDate: string;
  offerSentDate: string;
}

export default function MonitorOffer() {
  const [location, setLocation] = useLocation();
  const candidateId = location.split('/').pop();
  
  const [offerStatus, setOfferStatus] = useState<'pending' | 'accepted' | 'declined' | 'counter' | ''>('');
  const [responseNotes, setResponseNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock candidate data - in real app, fetch from API
  const candidateData: CandidateData = {
    id: parseInt(candidateId || '23'),
    name: candidateId === '23' ? 'Priya Singh' : candidateId === '20' ? 'Sarah Chen' : 'James Wilson',
    pronouns: candidateId === '23' ? 'she/her' : candidateId === '20' ? 'she/her' : 'he/him',
    jobTitle: 'Digital Marketing Assistant',
    offerDate: '2025-01-30',
    offerSentDate: '2025-01-29'
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Update candidate status based on offer response
    const newStatus = offerStatus === 'accepted' ? 'hired' : 'complete';
    
    console.log('Updating offer status:', {
      candidateId,
      offerStatus,
      newStatus,
      responseNotes
    });
    
    setIsSubmitting(false);
    
    // Navigate back to candidates list
    setLocation('/candidates');
  };

  const isFormValid = offerStatus !== '' && 
    (offerStatus === 'pending' || responseNotes.trim() !== '');

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'accepted': return 'text-green-600';
      case 'declined': return 'text-red-600';
      case 'counter': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

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
              Monitor Job Offer
            </h1>
            <p className="text-gray-600" style={{fontFamily: 'Poppins'}}>
              Track offer response from {candidateData.name}
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
                <div className="flex items-center gap-4 mt-3">
                  <Badge className="bg-green-100 text-green-800">Job Offered</Badge>
                  <span className="text-sm text-gray-600">
                    Offer sent: {candidateData.offerSentDate}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-2">
                  <Gift className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium">Offer Status</span>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">Awaiting Response</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Offer Timeline */}
        <Card>
          <CardHeader>
            <CardTitle style={{fontFamily: 'Sora'}}>Offer Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium">Job offer sent</p>
                  <p className="text-sm text-gray-600">{candidateData.offerSentDate} • via email and Pollen platform</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 bg-yellow-50 rounded-lg">
                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <p className="font-medium">Awaiting candidate response</p>
                  <p className="text-sm text-gray-600">Standard response timeframe: 5-7 business days</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Update Offer Status */}
        <Card>
          <CardHeader>
            <CardTitle style={{fontFamily: 'Sora'}}>Update Offer Status</CardTitle>
            <p className="text-sm text-gray-600">Record the candidate's response to the job offer</p>
          </CardHeader>
          <CardContent>
            <RadioGroup value={offerStatus} onValueChange={(value) => setOfferStatus(value as 'pending' | 'accepted' | 'declined' | 'counter' | '')} className="space-y-4">
              {/* Pending */}
              <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="pending" id="pending" />
                  <div className="flex-1">
                    <label htmlFor="pending" className="flex items-center gap-3 cursor-pointer">
                      <Clock className="w-5 h-5 text-yellow-500" />
                      <div>
                        <p className="font-medium">Still Pending</p>
                        <p className="text-sm text-gray-600">No response received yet</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Accepted */}
              <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="accepted" id="accepted" />
                  <div className="flex-1">
                    <label htmlFor="accepted" className="flex items-center gap-3 cursor-pointer">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-medium">Offer Accepted</p>
                        <p className="text-sm text-gray-600">Candidate accepted the job offer</p>
                      </div>
                    </label>
                  </div>
                </div>
                
                {offerStatus === 'accepted' && (
                  <div className="mt-4 pt-4 border-t">
                    <Label>Start Date & Onboarding Notes</Label>
                    <Textarea
                      placeholder="Record agreed start date, onboarding details, or next steps..."
                      value={responseNotes}
                      onChange={(e) => setResponseNotes(e.target.value)}
                      className="mt-2"
                      rows={3}
                    />
                  </div>
                )}
              </div>

              {/* Declined */}
              <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="declined" id="declined" />
                  <div className="flex-1">
                    <label htmlFor="declined" className="flex items-center gap-3 cursor-pointer">
                      <XCircle className="w-5 h-5 text-red-500" />
                      <div>
                        <p className="font-medium">Offer Declined</p>
                        <p className="text-sm text-gray-600">Candidate declined the job offer</p>
                      </div>
                    </label>
                  </div>
                </div>
                
                {offerStatus === 'declined' && (
                  <div className="mt-4 pt-4 border-t">
                    <Label>Reason for Decline (Optional)</Label>
                    <Textarea
                      placeholder="Record any feedback about why the offer was declined..."
                      value={responseNotes}
                      onChange={(e) => setResponseNotes(e.target.value)}
                      className="mt-2"
                      rows={3}
                    />
                  </div>
                )}
              </div>

              {/* Counter Offer */}
              <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="counter" id="counter" />
                  <div className="flex-1">
                    <label htmlFor="counter" className="flex items-center gap-3 cursor-pointer">
                      <MessageSquare className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="font-medium">Counter Offer/Negotiation</p>
                        <p className="text-sm text-gray-600">Candidate requested changes to the offer</p>
                      </div>
                    </label>
                  </div>
                </div>
                
                {offerStatus === 'counter' && (
                  <div className="mt-4 pt-4 border-t">
                    <Label>Counter Offer Details</Label>
                    <Textarea
                      placeholder="Record the candidate's counter offer or requested changes..."
                      value={responseNotes}
                      onChange={(e) => setResponseNotes(e.target.value)}
                      className="mt-2"
                      rows={4}
                    />
                  </div>
                )}
              </div>
            </RadioGroup>
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
                Updating Status...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Update Offer Status
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