import React, { useState } from "react";
import { useParams, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Star, 
  ThumbsUp, 
  MessageSquare, 
  Clock, 
  Users, 
  Shield,
  CheckCircle,
  ArrowLeft
} from "lucide-react";

interface FeedbackFormData {
  feedbackQuality: number;
  communicationSpeed: number;
  interviewExperience: number;
  processTransparency: number;
  overallExperience: number;
  recommendToFriend: number;
  bestAspect: string;
  worstAspect: string;
  additionalComments: string;
  wouldApplyAgain: boolean;
}

export default function FeedbackForm() {
  const { token } = useParams<{ token: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<FeedbackFormData>({
    feedbackQuality: 0,
    communicationSpeed: 0,
    interviewExperience: 0,
    processTransparency: 0,
    overallExperience: 0,
    recommendToFriend: 0,
    bestAspect: "",
    worstAspect: "",
    additionalComments: "",
    wouldApplyAgain: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleRatingChange = (field: keyof FeedbackFormData, value: number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleTextChange = (field: keyof FeedbackFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await apiRequest("POST", "/api/feedback", {
        token,
        ...formData
      });
      
      setIsSubmitted(true);
      
      toast({
        title: "Thank you for your feedback!",
        description: "Your experience helps us improve our platform and hold companies accountable.",
      });
      
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Error submitting feedback",
        description: "Please try again or contact support if the issue persists.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <Card className="text-center">
            <CardContent className="pt-12 pb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Thank You for Your Feedback!
              </h2>
              <p className="text-gray-600 mb-8">
                Your feedback helps us improve our platform and ensures companies 
                provide the best possible candidate experience.
              </p>
              <div className="space-y-4">
                <Button 
                  onClick={() => setLocation("/home")}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Return to Dashboard
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setLocation("/jobs")}
                  className="w-full"
                >
                  Browse More Jobs
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation("/home")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Share Your Experience
          </h1>
          <p className="text-gray-600">
            Your feedback helps us improve our platform and ensures companies 
            provide great candidate experiences.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating Questions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Feedback Quality
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                How helpful was the feedback you received?
              </Label>
              <StarRating
                value={formData.feedbackQuality}
                onChange={(value) => handleRatingChange("feedbackQuality", value)}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Communication Speed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                How quickly did the company respond to your application?
              </Label>
              <StarRating
                value={formData.communicationSpeed}
                onChange={(value) => handleRatingChange("communicationSpeed", value)}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Interview Experience
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                How was your interview experience with this company?
              </Label>
              <StarRating
                value={formData.interviewExperience}
                onChange={(value) => handleRatingChange("interviewExperience", value)}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Process Transparency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                How clear and transparent was the application process?
              </Label>
              <StarRating
                value={formData.processTransparency}
                onChange={(value) => handleRatingChange("processTransparency", value)}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ThumbsUp className="w-5 h-5" />
                Overall Experience
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                How would you rate your overall experience with this company?
              </Label>
              <StarRating
                value={formData.overallExperience}
                onChange={(value) => handleRatingChange("overallExperience", value)}
              />
            </CardContent>
          </Card>
          
          {/* NPS Question */}
          <Card>
            <CardHeader>
              <CardTitle>Likelihood to Recommend</CardTitle>
            </CardHeader>
            <CardContent>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                How likely are you to recommend this company to a friend? (0-10)
              </Label>
              <NPSRating
                value={formData.recommendToFriend}
                onChange={(value) => handleRatingChange("recommendToFriend", value)}
              />
            </CardContent>
          </Card>
          
          {/* Open-ended Questions */}
          <Card>
            <CardHeader>
              <CardTitle>What did you enjoy most about this experience?</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Tell us what went well..."
                value={formData.bestAspect}
                onChange={(e) => handleTextChange("bestAspect", e.target.value)}
                className="min-h-[100px]"
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>What could be improved?</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Tell us what could be better..."
                value={formData.worstAspect}
                onChange={(e) => handleTextChange("worstAspect", e.target.value)}
                className="min-h-[100px]"
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Additional Comments</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Any other feedback you'd like to share..."
                value={formData.additionalComments}
                onChange={(e) => handleTextChange("additionalComments", e.target.value)}
                className="min-h-[100px]"
              />
            </CardContent>
          </Card>
          
          {/* Would Apply Again */}
          <Card>
            <CardHeader>
              <CardTitle>Would you apply to this company again?</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={formData.wouldApplyAgain ? "yes" : "no"}
                onValueChange={(value) => handleTextChange("wouldApplyAgain", value === "yes")}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="yes" />
                  <Label htmlFor="yes">Yes, I would apply again</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="no" />
                  <Label htmlFor="no">No, I would not apply again</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
          
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </Button>
        </form>
      </div>
    </div>
  );
}

// Star Rating Component
function StarRating({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className={`w-8 h-8 ${
            star <= value ? "text-yellow-500" : "text-gray-300"
          } hover:text-yellow-500 transition-colours`}
        >
          <Star className="w-full h-full fill-current" />
        </button>
      ))}
    </div>
  );
}

// NPS Rating Component
function NPSRating({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <div className="flex gap-1 flex-wrap">
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
        <button
          key={score}
          type="button"
          onClick={() => onChange(score)}
          className={`w-10 h-10 rounded-md border-2 font-semibold ${
            score === value
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
          } transition-colours`}
        >
          {score}
        </button>
      ))}
    </div>
  );
}