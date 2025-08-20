import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, MessageCircle, Eye, Award, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface EmployerRatingProps {
  employerId: number;
  applicationId: number;
  onComplete: () => void;
}

export default function EmployerRatingSystem({ employerId, applicationId, onComplete }: EmployerRatingProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [ratings, setRatings] = useState({
    responseTimeRating: 0,
    interviewStyleRating: 0,
    communicationRating: 0,
    processTransparencyRating: 0,
    overallExperienceRating: 0,
  });
  const [submitted, setSubmitted] = useState(false);

  const form = useForm({
    defaultValues: {
      positiveAspects: "",
      improvementAreas: "",
      wouldRecommend: true,
      anonymousSubmission: true,
    }
  });

  const submitRating = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/employer-ratings", {
        employerId,
        applicationId,
        ...ratings,
        ...data,
      });
    },
    onSuccess: () => {
      setSubmitted(true);
      toast({
        title: "Feedback Submitted",
        description: "Thank you for helping improve the candidate experience!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/employer-ratings"] });
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleStarClick = (category: keyof typeof ratings, value: number) => {
    setRatings(prev => ({ ...prev, [category]: value }));
  };

  const onSubmit = (data: any) => {
    const allRated = Object.values(ratings).every(rating => rating > 0);
    if (!allRated) {
      toast({
        title: "Please Complete All Ratings",
        description: "Rate all aspects of your experience before submitting.",
        variant: "destructive",
      });
      return;
    }
    submitRating.mutate(data);
  };

  if (submitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold mb-2">Thank You!</h3>
          <p className="text-muted-foreground mb-6">
            Your feedback helps us maintain high standards and improve the candidate experience.
          </p>
          <div className="bg-primary/5 rounded-lg p-4">
            <h4 className="font-semibold mb-2">What happens next?</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Your anonymous feedback is shared with the employer</li>
              <li>• We use ratings to improve our platform and matching</li>
              <li>• Employers with consistent high ratings get featured placement</li>
              <li>• Those needing improvement receive targeted support resources</li>
            </ul>
          </div>
          <Button onClick={onComplete} className="mt-6">
            Continue to Dashboard
          </Button>
        </CardContent>
      </Card>
    );
  }

  const StarRating = ({ value, onChange, label, icon: Icon }: any) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-primary" />
        <Label className="font-medium">{label}</Label>
      </div>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`text-2xl transition-colours ${
              star <= value ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'
            }`}
          >
            <Star className={`h-6 w-6 ${star <= value ? 'fill-current' : ''}`} />
          </button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        {value === 0 ? 'Please rate this aspect' : 
         value === 1 ? 'Poor' :
         value === 2 ? 'Fair' :
         value === 3 ? 'Good' :
         value === 4 ? 'Very Good' : 'Excellent'}
      </p>
    </div>
  );

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-6 w-6" />
          Rate Your Experience
        </CardTitle>
        <p className="text-muted-foreground">
          Help us improve candidate experiences by rating this employer. Your feedback is anonymous and helps maintain our quality standards.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Rating Categories */}
          <div className="grid md:grid-cols-2 gap-6">
            <StarRating
              value={ratings.responseTimeRating}
              onChange={(value: number) => handleStarClick('responseTimeRating', value)}
              label="Response Time"
              icon={Clock}
            />
            <StarRating
              value={ratings.interviewStyleRating}
              onChange={(value: number) => handleStarClick('interviewStyleRating', value)}
              label="Interview Experience"
              icon={MessageCircle}
            />
            <StarRating
              value={ratings.communicationRating}
              onChange={(value: number) => handleStarClick('communicationRating', value)}
              label="Communication Quality"
              icon={MessageCircle}
            />
            <StarRating
              value={ratings.processTransparencyRating}
              onChange={(value: number) => handleStarClick('processTransparencyRating', value)}
              label="Process Transparency"
              icon={Eye}
            />
          </div>

          {/* Overall Experience */}
          <div className="border-t pt-6">
            <StarRating
              value={ratings.overallExperienceRating}
              onChange={(value: number) => handleStarClick('overallExperienceRating', value)}
              label="Overall Experience"
              icon={Award}
            />
          </div>

          {/* Written Feedback */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="positiveAspects">What went well?</Label>
              <Textarea
                id="positiveAspects"
                placeholder="Share positive aspects of your experience..."
                {...form.register("positiveAspects")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="improvementAreas">What could be improved?</Label>
              <Textarea
                id="improvementAreas"
                placeholder="Constructive feedback for improvement..."
                {...form.register("improvementAreas")}
              />
            </div>
          </div>

          {/* Recommendation */}
          <div className="space-y-4">
            <Label>Would you recommend this employer to other job seekers?</Label>
            <div className="flex gap-4">
              <Button
                type="button"
                variant={form.watch("wouldRecommend") ? "default" : "outline"}
                onClick={() => form.setValue("wouldRecommend", true)}
              >
                Yes, I'd recommend them
              </Button>
              <Button
                type="button"
                variant={!form.watch("wouldRecommend") ? "default" : "outline"}
                onClick={() => form.setValue("wouldRecommend", false)}
              >
                No, I wouldn't recommend
              </Button>
            </div>
          </div>

          {/* Privacy Options */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="anonymous"
                {...form.register("anonymousSubmission")}
              />
              <Label htmlFor="anonymous" className="text-sm">
                Submit this feedback anonymously
              </Label>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Anonymous feedback helps ensure honest responses and protects your privacy while helping improve the platform.
            </p>
          </div>

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onComplete}>
              Skip Feedback
            </Button>
            <Button 
              type="submit" 
              disabled={submitRating.isPending}
              className="min-w-32"
            >
              {submitRating.isPending ? "Submitting..." : "Submit Feedback"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}