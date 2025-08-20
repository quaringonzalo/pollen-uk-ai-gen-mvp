import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, CheckCircle, Users } from "lucide-react";

export function JobMatchingSetup() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Post Submitted Successfully!</h1>
          <p className="text-lg text-gray-600 mb-4">
            We're now ready to help you find the perfect candidates through our matching process.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-800">Now Under Review</span>
            </div>
            <p className="text-sm text-blue-700 mt-1">
              Your job posting is currently being reviewed by our team. If approved we'll usually activate it within 4 hours. A member of the Pollen team will be in touch if we have any questions.
            </p>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-6 h-6 mr-2 text-blue-500" />
              Next Steps: Candidate Matching
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              To provide you with the best possible candidates, we need to collect some additional information 
              about your team culture, values, and skills requirements. This helps us match not just skills, 
              but also values fit.
            </p>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">What happens next:</h3>
              <ul className="space-y-2 text-blue-800">
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
                  Complete team culture and values assessment (10-15 minutes)
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
                  Our system creates custom skills challenges based on your job requirements
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
                  Matched candidates are invited to complete your skills challenge
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">4</span>
                  The Pollen team review applications and speak to top scoring candidates
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">5</span>
                  You receive your curated shortlist of qualified candidates
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">Continue Now</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Complete the matching setup now to get your shortlist as quickly as possible.
              </p>
              <Button className="w-full" onClick={() => window.location.href = '/behavioural-assessment'}>
                Continue Setup
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-blue-600">Resume Later</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Save your progress and complete the matching setup from your dashboard when convenient.
              </p>
              <div className="space-y-2">
                <Button variant="outline" className="w-full" onClick={() => window.location.href = '/employer-dashboard'}>
                  <Clock className="w-4 h-4 mr-2" />
                  Go to Dashboard
                </Button>
                <p className="text-sm text-gray-500 text-center">
                  You can resume this process anytime from your dashboard
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact our team at <a href="mailto:support@pollen.co.uk" className="text-blue-600 hover:underline">support@pollen.co.uk</a>
          </p>
        </div>
      </div>
    </div>
  );
}