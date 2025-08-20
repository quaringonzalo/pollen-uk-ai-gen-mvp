import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import BehavioralAssessment from "@/components/behavioral-assessment";

export default function BehavioralAssessmentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Discover Your Work Style
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Take our behavioural assessment to understand your personality, work preferences, and ideal career matches. 
              This fun quiz helps build your profile and improves job matching.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <BehavioralAssessment type="enhanced" showResults={true} />
        </div>

        <div className="mt-12 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-500" />
                About This Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">What We Measure</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• <strong>Dominant (Red):</strong> Direct, results-focused leaders</li>
                    <li>• <strong>Influential (Yellow):</strong> People-oriented communicators</li>
                    <li>• <strong>Steady (Green):</strong> Supportive, reliable team players</li>
                    <li>• <strong>Conscientious (Blue):</strong> Detail-oriented analysers</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">How It Helps</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Understand your natural work style</li>
                    <li>• Discover compatible career paths</li>
                    <li>• Improve job matching accuracy</li>
                    <li>• Enhance team collaboration</li>
                    <li>• Build a comprehensive profile</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> This assessment is designed for profile enrichment and career guidance. 
                  Results are used to enhance job matching and provide insights, not for screening or evaluation purposes.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}