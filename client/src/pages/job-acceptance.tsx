import { useState } from "react";
import { useRoute } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  CheckCircle, 
  ArrowLeft, 
  Trophy, 
  Calendar, 
  PoundSterling,
  Building2,
  MapPin,
  Clock
} from "lucide-react";

interface JobAcceptanceData {
  applicationId: string;
  acceptedOffer: boolean;
  startDate: string;
  actualSalary: number;
  employmentType: string;
  additionalNotes?: string;
}

export default function JobAcceptance() {
  const [, params] = useRoute("/job-acceptance/:applicationId");
  const applicationId = params?.applicationId;
  const { toast } = useToast();

  const [formData, setFormData] = useState<JobAcceptanceData>({
    applicationId: applicationId || '',
    acceptedOffer: true,
    startDate: '',
    actualSalary: 0,
    employmentType: '',
    additionalNotes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock application data - in production this would come from API
  const applicationData = {
    id: '7',
    jobTitle: 'Data Analyst',
    companyName: 'Tech Startup',
    location: 'Remote (UK)',
    appliedDate: '2024-12-15',
    offerDetails: {
      offeredSalary: 32000,
      employmentType: 'Full-time',
      startDate: '2025-02-01',
      benefits: ['Health insurance', 'Pension scheme', 'Flexible working', 'Learning budget']
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Submit job acceptance data
      const response = await fetch('/api/job-acceptance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit job acceptance');
      }

      // Trigger outcome tracking
      await fetch('/api/application-outcome', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicationId: parseInt(applicationId || '0'),
          finalOutcome: 'hired',
          outcomeStage: 'offer',
          outcomeDate: new Date(),
          jobAccepted: true,
          startDate: new Date(formData.startDate),
          actualSalary: formData.actualSalary,
          employmentType: formData.employmentType
        }),
      });

      toast({
        title: "Congratulations!",
        description: "Your job acceptance has been recorded. We'll follow up with you in 6 months to track your progress.",
      });

      // Redirect to applications page
      window.location.href = '/applications';
    } catch (error) {
      console.error('Error submitting job acceptance:', error);
      toast({
        title: "Error",
        description: "Failed to submit job acceptance. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDecline = async () => {
    try {
      // Submit job decline data
      await fetch('/api/application-outcome', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicationId: parseInt(applicationId || '0'),
          finalOutcome: 'offer_declined',
          outcomeStage: 'offer',
          outcomeDate: new Date(),
          jobAccepted: false
        }),
      });

      toast({
        title: "Offer Declined",
        description: "Your decision has been recorded. Thank you for using Pollen.",
      });

      // Redirect to applications page
      window.location.href = '/applications';
    } catch (error) {
      console.error('Error declining offer:', error);
      toast({
        title: "Error",
        description: "Failed to record your decision. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Job Offer Decision</h1>
          <p className="text-gray-600 mt-1">Complete your job acceptance details for outcome tracking</p>
        </div>
        <Button 
          variant="ghost" 
          onClick={() => window.location.href = '/applications'}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Applications
        </Button>
      </div>

      {/* Job Offer Summary */}
      <Card className="mb-6 bg-pink-50 border-pink-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Sora', color: '#E2007A' }}>
            <Trophy className="w-5 h-5" style={{ color: '#E2007A' }} />
            Job Offer Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">{applicationData.jobTitle}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <Building2 className="w-4 h-4" />
                  {applicationData.companyName}
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin className="w-4 h-4" />
                  {applicationData.location}
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <PoundSterling className="w-4 h-4" />
                  £{applicationData.offerDetails.offeredSalary.toLocaleString()} per year
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="w-4 h-4" />
                  Start Date: {applicationData.offerDetails.startDate}
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Clock className="w-4 h-4" />
                  {applicationData.offerDetails.employmentType}
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Benefits Package</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                {applicationData.offerDetails.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Job Acceptance Form */}
      <Card>
        <CardHeader>
          <CardTitle>Job Acceptance Details</CardTitle>
          <p className="text-sm text-gray-600">
            Help us track your success by providing details about your job acceptance. 
            This data helps us improve our platform and support other job seekers.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="startDate">Actual Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="actualSalary">Actual Salary (£)</Label>
                <Input
                  id="actualSalary"
                  type="number"
                  placeholder="32000"
                  value={formData.actualSalary || ''}
                  onChange={(e) => setFormData({...formData, actualSalary: parseInt(e.target.value) || 0})}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="employmentType">Employment Type</Label>
              <Select 
                value={formData.employmentType} 
                onValueChange={(value) => setFormData({...formData, employmentType: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select employment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="temporary">Temporary</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalNotes">Additional Notes (Optional)</Label>
              <Textarea
                id="additionalNotes"
                placeholder="Any changes to the original offer or additional details..."
                value={formData.additionalNotes}
                onChange={(e) => setFormData({...formData, additionalNotes: e.target.value})}
                rows={3}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? 'Processing...' : 'Accept Job Offer'}
                <CheckCircle className="w-4 h-4 ml-2" />
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleDecline}
                className="flex-1 border-red-200 text-red-700 hover:bg-red-50"
              >
                Decline Offer
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* What Happens Next */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">What Happens Next?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Immediate confirmation</p>
                <p className="text-gray-600">We'll record your job acceptance and notify the employer</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Success story opportunity</p>
                <p className="text-gray-600">With your permission, we may feature your success to inspire other job seekers</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">6-month follow-up</p>
                <p className="text-gray-600">We'll check in to see how you're settling in and track retention rates</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}