import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";

export default function ApplicationSuccess() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl mx-auto text-center">
        <CardHeader className="pb-6">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Application Submitted Successfully!
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 dark:text-gray-300">
            Well done on completing your job application and skills assessment.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">What happens next?</h3>
            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">1</div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Review & Shortlisting</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Applications are reviewed and shortlisted by our team</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">2</div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Professional Feedback</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">You'll receive detailed feedback on your assessment within 1 week</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">3</div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Interview Opportunities</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">If shortlisted, you'll be contacted for interviews</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <Button 
              onClick={() => setLocation('/applications')}
              className="w-full sm:w-auto px-8 py-3 text-lg font-medium"
            >
              View My Applications
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}