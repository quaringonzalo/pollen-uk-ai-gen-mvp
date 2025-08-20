import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight, ArrowLeft, Clock, Users, FileText, Target, FileCheck } from "lucide-react";

export default function PackageCheckout() {
  const [selectedBundle, setSelectedBundle] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Load selected bundle from localStorage
    const bundleData = localStorage.getItem('selectedBundle');
    if (bundleData) {
      setSelectedBundle(JSON.parse(bundleData));
    }
  }, []);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      // Navigate to payment complete page
      window.location.href = '/payment-complete';
    }, 2000);
  };

  const getProcessSteps = () => {
    const baseSteps = [
      {
        icon: <FileText className="w-5 h-5" />,
        title: "Job Details & Requirements",
        description: "Define your role, requirements, and hiring criteria",
        timeframe: "5-10 minutes"
      },
      {
        icon: <Target className="w-5 h-5" />,
        title: "Skills Testing Setup",
        description: selectedBundle?.tier === 'temp' 
          ? "Foundation skills tests deployed within 24 hours"
          : "Custom skills challenges created - step by step process takes ~15 minutes",
        timeframe: selectedBundle?.tier === 'temp' ? "24 hours" : "15 minutes"
      },
      {
        icon: <Users className="w-5 h-5" />,
        title: "Candidate Matching",
        description: "Candidates get invited to complete assessment within given deadline",
        timeframe: "3-5 business days"
      },
      {
        icon: <FileCheck className="w-5 h-5" />,
        title: "Review Applications",
        description: "We review completed applications and assessments",
        timeframe: "1-2 business days"
      }
    ];

    if (selectedBundle?.tier === 'enhanced' || selectedBundle?.tier === 'managed') {
      baseSteps.push({
        icon: <CheckCircle className="w-5 h-5" />,
        title: "First-Stage Interviews",
        description: "Our team conducts professional interviews with top candidates",
        timeframe: "3-5 business days"
      });
    }

    baseSteps.push({
      icon: <CheckCircle className="w-5 h-5" />,
      title: "Shortlist Delivery",
      description: selectedBundle?.tier === 'temp' 
        ? "Receive your curated shortlist with detailed reports"
        : "Complete process typically takes 1-2 weeks total (we'll keep you updated if any delays)",
      timeframe: selectedBundle?.tier === 'temp' ? "1 week total" : "1-2 weeks total"
    });

    return baseSteps;
  };

  if (!selectedBundle) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Package Selected</h1>
          <Button onClick={() => window.location.href = '/employer-bundle-selection'}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Choose Package
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Purchase</h1>
          <p className="text-lg text-gray-600">
            Review your selection and understand what happens next
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-8">
          {/* Package Summary */}
          <Card className="border-2 border-blue-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{selectedBundle.name}</CardTitle>
                {selectedBundle.popular && (
                  <Badge className="bg-blue-500 text-white">Most Popular</Badge>
                )}
                {selectedBundle.badge && (
                  <Badge className="bg-green-500 text-white">{selectedBundle.badge}</Badge>
                )}
              </div>
              <div className="text-3xl font-bold text-blue-600">{selectedBundle.price}</div>
              <p className="text-gray-600">{selectedBundle.description}</p>
            </CardHeader>
            
            <CardContent>
              <h4 className="font-semibold text-gray-900 mb-3">What's included:</h4>
              <ul className="space-y-2 mb-6">
                {selectedBundle.included?.map((feature: string, index: number) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="bg-blue-50 rounded-lg p-4">
                <h5 className="font-semibold text-blue-900 mb-2">Perfect for:</h5>
                <ul className="space-y-1">
                  {selectedBundle.businessBenefits?.map((benefit: string, index: number) => (
                    <li key={index} className="text-sm text-blue-700">• {benefit}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Guarantees & Support */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-900 mb-1">Quality Guarantee</h4>
                <p className="text-sm text-gray-600">
                  {selectedBundle.tier === 'temp' ? '30-day' : 
                   selectedBundle.tier === 'standard' ? '60-day' :
                   selectedBundle.tier === 'enhanced' ? '75-day' : '90-day'} satisfaction guarantee*
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  *Refunds available when employers adhere to fair hiring standards and T&Cs
                </p>
              </div>
              <div>
                <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-900 mb-1">Expert Support</h4>
                <p className="text-sm text-gray-600">
                  {selectedBundle.tier === 'managed' ? 'Dedicated hiring manager' : 'Email support and guidance'}
                </p>
              </div>
              <div>
                <Target className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-900 mb-1">Skills-First</h4>
                <p className="text-sm text-gray-600">
                  Only candidates who pass our testing reach your shortlist
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Section */}
        <Card>
          <CardHeader>
            <CardTitle>Complete Purchase</CardTitle>
            <p className="text-gray-600">Secure payment processing via Stripe</p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-900 mb-2">Important:</h4>
              <p className="text-yellow-800 text-sm">
                Payment is required upfront to begin the hiring process. This allows us to immediately 
                start creating your custom skills tests and sourcing candidates.
              </p>
            </div>

            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total Amount:</span>
              <span className="text-2xl text-blue-600">{selectedBundle.price}</span>
            </div>

            <div className="flex gap-4">
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/employer-bundle-selection'}
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Packages
              </Button>
              
              <Button 
                onClick={handlePayment}
                disabled={isProcessing}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    Complete Purchase
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}