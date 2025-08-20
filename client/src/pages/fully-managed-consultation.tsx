import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowLeft, Calendar, Phone, MessageSquare, Shield, Users, Clock, Target } from "lucide-react";

export default function FullyManagedConsultation() {
  const [selectedBundle, setSelectedBundle] = useState<any>(null);

  useEffect(() => {
    const bundleData = localStorage.getItem('selectedBundle');
    if (bundleData) {
      setSelectedBundle(JSON.parse(bundleData));
    }
  }, []);

  const handleBookConsultation = () => {
    // This would integrate with a booking system (Calendly, etc.)
    alert('Booking consultation - this would integrate with your preferred booking system');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Fully Managed Hiring Service</h1>
          <p className="text-lg text-gray-600">
            Let's discuss your specific needs and create a custom solution
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Service Overview */}
          <Card className="border-2 border-green-500">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-6 h-6 text-green-600" />
                <CardTitle className="text-xl">Complete White-Glove Service</CardTitle>
              </div>
              <div className="text-3xl font-bold text-green-600">£3,500</div>
              <p className="text-gray-600">Custom pricing available based on your specific requirements</p>
            </CardHeader>
            
            <CardContent>
              <h4 className="font-semibold text-gray-900 mb-3">What's included:</h4>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Dedicated hiring manager assigned to you</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Complete hands-off hiring process</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">All interview rounds managed for you</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Reference checking handled</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Salary negotiation support</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Onboarding guidance provided</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">90-day hire guarantee</span>
                </li>
              </ul>
              
              <div className="bg-green-50 rounded-lg p-4">
                <h5 className="font-semibold text-green-900 mb-2">Perfect for:</h5>
                <ul className="space-y-1">
                  <li className="text-sm text-green-700">• Completely hands-off hiring</li>
                  <li className="text-sm text-green-700">• 80% time savings</li>
                  <li className="text-sm text-green-700">• Leadership-quality service</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Consultation Booking */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Book Your Strategy Call
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">
                  Fully Managed Hiring Consultation
                </h3>
                <p className="text-sm text-blue-800">
                  We'll design a completely custom hiring solution tailored to your business needs, 
                  team dynamics, and leadership requirements.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm">30-minute strategy session</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm">Custom hiring plan creation</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm">Dedicated manager assignment</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm">Custom timeline development</span>
                </div>
              </div>

              <Button 
                onClick={handleBookConsultation}
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Book Strategy Call
              </Button>

              <p className="text-xs text-gray-500 text-center">
                No commitment required - we'll create a custom solution for your needs
              </p>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              How Our Fully Managed Service Works
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-600">
              In your strategy call, we'll design a complete hiring solution covering:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-blue-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Role Requirements</h4>
                    <p className="text-sm text-gray-600">Define exact skills, experience, and cultural requirements</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-pink-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Process Design</h4>
                    <p className="text-sm text-gray-600">Custom interview stages and evaluation criteria</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-orange-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Timeline Planning</h4>
                    <p className="text-sm text-gray-600">Realistic timelines that fit your business needs</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Quality Assurance</h4>
                    <p className="text-sm text-gray-600">Multiple quality checkpoints and candidate validation</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-red-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Communication Plan</h4>
                    <p className="text-sm text-gray-600">Regular updates and transparent progress reporting</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-indigo-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Success Metrics</h4>
                    <p className="text-sm text-gray-600">Clear KPIs and success guarantees</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Guarantees */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <Shield className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-900 mb-1">90-Day Guarantee*</h4>
                <p className="text-sm text-gray-600">
                  Complete satisfaction guarantee with replacement support
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  *Subject to adherence to fair hiring standards and T&Cs
                </p>
              </div>
              <div>
                <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-900 mb-1">Dedicated Support</h4>
                <p className="text-sm text-gray-600">
                  Your assigned hiring manager available throughout the process
                </p>
              </div>
              <div>
                <Target className="w-8 h-8 text-pink-500 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-900 mb-1">Custom Solution</h4>
                <p className="text-sm text-gray-600">
                  Tailored approach designed specifically for your requirements
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-center">
          <Button 
            variant="outline"
            onClick={() => window.location.href = '/employer-bundle-selection'}
            className="text-gray-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Package Selection
          </Button>
        </div>
      </div>
    </div>
  );
}