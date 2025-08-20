import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useLocation } from 'wouter';
import { ArrowLeft, CheckCircle, XCircle, Clock, MessageSquare, Calendar, Send } from 'lucide-react';

interface CandidateData {
  id: number;
  name: string;
  pronouns: string;
  jobTitle: string;
  interviewDate: string;
  interviewType: string;
  interviewers: string[];
}

interface FeedbackScores {
  communication: number;
  roleUnderstanding: number;
  valuesAlignment: number;
}

export default function ProvideInterviewUpdate() {
  const [location, setLocation] = useLocation();
  const candidateId = location.split('/').pop();
  
  const [decision, setDecision] = useState<'not_proceeding' | 'further_interview' | 'offer_job' | ''>('');
  const [feedbackScores, setFeedbackScores] = useState<FeedbackScores>({
    communication: 0,
    roleUnderstanding: 0,
    valuesAlignment: 0
  });
  const [feedbackComments, setFeedbackComments] = useState('');
  const [nextInterviewNotes, setNextInterviewNotes] = useState('');
  const [offerMessage, setOfferMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock candidate data - in real app, fetch from API
  const candidateData: CandidateData = {
    id: parseInt(candidateId || '23'),
    name: candidateId === '23' ? 'Priya Singh' : candidateId === '20' ? 'Sarah Chen' : 'James Wilson',
    pronouns: candidateId === '23' ? 'she/her' : candidateId === '20' ? 'she/her' : 'he/him',
    jobTitle: 'Digital Marketing Assistant',
    interviewDate: '2025-01-28',
    interviewType: 'Initial Interview',
    interviewers: ['Holly Saunders', 'Marcus Chen']
  };

  const handleScoreChange = (category: keyof FeedbackScores, value: number) => {
    setFeedbackScores(prev => ({ ...prev, [category]: value }));
  };

  const getScoreLabel = (score: number) => {
    switch(score) {
      case 0: return 'Not Rated';
      case 1: return 'Poor';
      case 2: return 'Below Average';
      case 3: return 'Average';
      case 4: return 'Strong';
      case 5: return 'Excellent';
      default: return 'Not Rated';
    }
  };

  const getScoreColor = (score: number) => {
    if (score === 0) return 'text-gray-400';
    if (score >= 4) return 'text-green-600';
    if (score >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Update candidate status based on decision
    const newStatus = decision === 'not_proceeding' ? 'complete' : 
                     decision === 'further_interview' ? 'in_progress' : 'job_offered';
    
    // In real app: API call to update candidate status and save feedback
    console.log('Submitting to Pollen team for review:', {
      candidateId,
      decision,
      newStatus,
      feedbackScores,
      feedbackComments,
      nextInterviewNotes,
      offerMessage,
      submittedForReview: true,
      reviewStatus: 'pending_pollen_approval'
    });
    
    setIsSubmitting(false);
    
    // Navigate back to candidates list
    setLocation('/candidates');
  };

  const isFormValid = decision !== '' && 
    // Only require feedback scores and comments for "not_proceeding"
    (decision === 'not_proceeding' ? 
      (Object.values(feedbackScores).every(score => score > 0) &&
       feedbackComments.trim() !== '' &&
       feedbackComments.trim().length >= 50) : true) &&
    // Specific requirements for each decision type
    (decision !== 'further_interview' || nextInterviewNotes.trim() !== '') &&
    (decision !== 'offer_job' || offerMessage.trim() !== '');

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
              Interview Update
            </h1>
            <p className="text-gray-600" style={{fontFamily: 'Poppins'}}>
              Provide feedback and next steps for {candidateData.name}
            </p>
            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg mt-2">
              <p className="text-sm text-yellow-800">
                <strong>Important:</strong> All feedback will be reviewed by the Pollen team before being shared with the candidate.
              </p>
            </div>
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
                  <Badge className="bg-orange-100 text-orange-800">Interview Complete</Badge>
                  <span className="text-sm text-gray-600">
                    {candidateData.interviewType} • {candidateData.interviewDate}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Interviewed by: {candidateData.interviewers.join(', ')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interview Feedback Scores - Only required for "not proceeding" */}
        {decision === 'not_proceeding' && (
          <Card>
            <CardHeader>
              <CardTitle style={{fontFamily: 'Sora'}}>Interview Assessment</CardTitle>
              <p className="text-sm text-gray-600">Rate performance across key areas (1-5 scale) - All ratings required</p>
            </CardHeader>
          <CardContent className="space-y-6">
            {[
              { key: 'communication' as keyof FeedbackScores, label: 'Communication & Rapport' },
              { key: 'roleUnderstanding' as keyof FeedbackScores, label: 'Role Understanding' },
              { key: 'valuesAlignment' as keyof FeedbackScores, label: 'Values Alignment' }
            ].map(({ key, label }) => (
              <div key={key} className="space-y-3">
                <Label className="text-base font-medium">{label}</Label>
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(score => (
                      <button
                        key={score}
                        onClick={() => handleScoreChange(key, score)}
                        className={`w-8 h-8 rounded-full border-2 text-sm font-medium transition-colors ${
                          feedbackScores[key] === score
                            ? 'border-pink-600 bg-pink-600 text-white'
                            : feedbackScores[key] === 0 && score === 0
                            ? 'border-red-300 bg-red-50 text-red-600'
                            : 'border-gray-300 hover:border-pink-300'
                        }`}
                      >
                        {score}
                      </button>
                    ))}
                  </div>
                  <span className={`font-medium ${getScoreColor(feedbackScores[key])}`}>
                    {getScoreLabel(feedbackScores[key])}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
          </Card>
        )}

        {/* Decision Section */}
        <Card>
          <CardHeader>
            <CardTitle style={{fontFamily: 'Sora'}}>Next Steps Decision</CardTitle>
            <p className="text-sm text-gray-600">Choose the appropriate next step for this candidate</p>
          </CardHeader>
          <CardContent>
            <RadioGroup value={decision} onValueChange={(value) => setDecision(value as 'not_proceeding' | 'further_interview' | 'offer_job' | '')} className="space-y-4">
              {/* Not Proceeding */}
              <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="not_proceeding" id="not_proceeding" />
                  <div className="flex-1">
                    <label htmlFor="not_proceeding" className="flex items-center gap-3 cursor-pointer">
                      <XCircle className="w-5 h-5 text-red-500" />
                      <div>
                        <p className="font-medium">Not Proceeding</p>
                        <p className="text-sm text-gray-600">Provide feedback and close application</p>
                      </div>
                    </label>
                  </div>
                </div>
                
                {decision === 'not_proceeding' && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="mb-4">
                      <Label className="text-base font-medium mb-3 block">Feedback Summary</Label>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <p className="text-sm text-gray-600">Communication</p>
                            <p className={`text-2xl font-bold ${getScoreColor(feedbackScores.communication)}`}>
                              {feedbackScores.communication || '?'}/5
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Role Understanding</p>
                            <p className={`text-2xl font-bold ${getScoreColor(feedbackScores.roleUnderstanding)}`}>
                              {feedbackScores.roleUnderstanding || '?'}/5
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Values Alignment</p>
                            <p className={`text-2xl font-bold ${getScoreColor(feedbackScores.valuesAlignment)}`}>
                              {feedbackScores.valuesAlignment || '?'}/5
                            </p>
                          </div>
                        </div>
                        <div className="text-center mt-3 pt-3 border-t">
                          <p className="text-sm text-gray-600">Overall Average</p>
                          <p className="text-xl font-bold text-gray-800">
                            {(feedbackScores.communication && feedbackScores.roleUnderstanding && feedbackScores.valuesAlignment) 
                              ? ((feedbackScores.communication + feedbackScores.roleUnderstanding + feedbackScores.valuesAlignment) / 3).toFixed(1) 
                              : 'Incomplete'}/5
                          </p>
                        </div>
                      </div>
                    </div>
                    <Label className="text-red-600">Constructive Feedback (Required - Minimum 50 characters)</Label>
                    <Textarea
                      placeholder="Provide specific, actionable feedback. This will be reviewed by the Pollen team before being shared with the candidate. Focus on specific areas for improvement and constructive guidance for future opportunities."
                      value={feedbackComments}
                      onChange={(e) => setFeedbackComments(e.target.value)}
                      className={`mt-2 ${feedbackComments.trim().length > 0 && feedbackComments.trim().length < 50 ? 'border-red-400' : ''}`}
                      rows={4}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>This feedback will be reviewed by Pollen team before sending to candidate</span>
                      <span className={feedbackComments.trim().length < 50 ? 'text-red-500' : 'text-green-600'}>
                        {feedbackComments.trim().length}/50 minimum
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Further Interview */}
              <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="further_interview" id="further_interview" />
                  <div className="flex-1">
                    <label htmlFor="further_interview" className="flex items-center gap-3 cursor-pointer">
                      <Calendar className="w-5 h-5 text-yellow-500" />
                      <div>
                        <p className="font-medium">Request Further Interview</p>
                        <p className="text-sm text-gray-600">Schedule additional interview round</p>
                      </div>
                    </label>
                  </div>
                </div>
                
                {decision === 'further_interview' && (
                  <div className="mt-4 pt-4 border-t space-y-4">
                    <div>
                      <Label>Next Interview Focus (Required)</Label>
                      <Textarea
                        placeholder="What will the next interview cover? Who should attend? Any specific preparation needed?"
                        value={nextInterviewNotes}
                        onChange={(e) => setNextInterviewNotes(e.target.value)}
                        className="mt-2"
                        rows={4}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Offer Job */}
              <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="offer_job" id="offer_job" />
                  <div className="flex-1">
                    <label htmlFor="offer_job" className="flex items-center gap-3 cursor-pointer">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-medium">Offer Job</p>
                        <p className="text-sm text-gray-600">Extend job offer to candidate</p>
                      </div>
                    </label>
                  </div>
                </div>
                
                {decision === 'offer_job' && (
                  <div className="mt-4 pt-4 border-t space-y-4">
                    <div>
                      <Label>Offer Message (Required)</Label>
                      <Textarea
                        placeholder="Congratulations message and any important offer details to include..."
                        value={offerMessage}
                        onChange={(e) => setOfferMessage(e.target.value)}
                        className="mt-2"
                        rows={4}
                      />
                    </div>
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
                Submitting for Pollen Team Review...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit for Pollen Team Review
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