import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft, Clock, Users, CheckCircle } from "lucide-react";

export default function TempHiringRedirect() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <Clock className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Looking for Temporary Staff?</h1>
          <p className="text-lg text-gray-600">
            We have a specialised solution for short-term and contract hiring needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Temp Hire Package */}
          <Card className="border-2 border-green-500">
            <CardHeader className="text-center pb-4">
              <Badge className="bg-green-500 text-white px-4 py-1 mx-auto mb-2">Perfect for Temps</Badge>
              <CardTitle className="text-2xl font-bold text-gray-900">Temp Hire</CardTitle>
              <div className="text-4xl font-bold text-green-600 mb-2">£1,000</div>
              <p className="text-gray-600">Foundation-level challenges for short-term roles</p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-2">Ideal for:</h4>
                <ul className="space-y-1 text-sm text-green-700">
                  <li>• Contracts under 6 months</li>
                  <li>• Temporary project cover</li>
                  <li>• Seasonal hiring</li>
                  <li>• Budget-conscious hiring</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">What's included:</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Foundation skills challenges (pre-built)</li>
                  <li>• Basic candidate screening</li>
                  <li>• 48-hour turnaround</li>
                  <li>• Email support</li>
                  <li>• 30-day satisfaction guarantee</li>
                </ul>
              </div>
              
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={() => {
                  localStorage.setItem('selectedBundle', JSON.stringify({
                    id: 'temp',
                    name: 'Temp Hire',
                    price: '£1,000',
                    tier: 'temp',
                    included: [
                      'Candidates tested on core job skills',
                      'Basic screening and candidate matching',
                      'Standard candidate profiles provided',
                      'Email support and regular updates',
                      'Quick 48-hour turnaround time'
                    ],
                    businessBenefits: ['Fast hiring for urgent needs', 'Cost-effective for temp roles', 'Verified basic competency']
                  }));
                  window.location.href = '/package-checkout';
                }}
              >
                Select Temp Hire
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Permanent Hiring Option */}
          <Card className="border border-gray-200">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-gray-900">Permanent Hiring?</CardTitle>
              <p className="text-gray-600">Looking for long-term team members instead?</p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Our permanent hiring packages include:</h4>
                <ul className="space-y-1 text-sm text-blue-700">
                  <li>• Bespoke skills challenges</li>
                  <li>• Expert assessment oversight</li>
                  <li>• Behavioral profiling</li>
                  <li>• Extended guarantees</li>
                </ul>
              </div>

              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-blue-600">Starting from £2,000</div>
                <p className="text-sm text-gray-600">Quality Hire, Human-Assisted, or Fully Managed</p>
              </div>
              
              <Button 
                variant="outline"
                className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                onClick={() => window.location.href = '/employer-bundle-selection'}
              >
                View Permanent Hiring Options
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <div className="flex items-start space-x-4">
            <Users className="w-6 h-6 text-yellow-600 mt-1" />
            <div>
              <h3 className="font-semibold text-yellow-900 mb-2">Not sure which option fits your needs?</h3>
              <p className="text-yellow-800 mb-4">
                Our team can help you determine whether temp or permanent hiring is right for your situation.
              </p>
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/freelance-consultation'}
                className="border-yellow-600 text-yellow-600 hover:bg-yellow-50"
              >
                Get Free Consultation
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button 
            variant="ghost"
            onClick={() => window.history.back()}
            className="text-gray-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Previous Page
          </Button>
        </div>
      </div>
    </div>
  );
}