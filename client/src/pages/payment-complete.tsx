import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Home, FileText, Clock, Mail } from "lucide-react";
import { formatPrice } from "@shared/pricing";

export default function PaymentComplete() {
  const [paymentData, setPaymentData] = useState<any>(null);

  useEffect(() => {
    const paymentComplete = localStorage.getItem('paymentComplete');
    if (paymentComplete) {
      setPaymentData(JSON.parse(paymentComplete));
    }
  }, []);

  const handleStartProcess = () => {
    // Mark payment as completed and proceed to comprehensive job posting
    localStorage.setItem('paymentCompleted', 'true');
    localStorage.setItem('hiringProcessStep', '3'); // Starting at step 3 (job creation)
    window.location.href = '/comprehensive-job-posting';
  };

  const handleGoHome = () => {
    // Mark payment as completed but return to employer dashboard
    localStorage.setItem('paymentCompleted', 'true');
    window.location.href = '/employer-dashboard';
  };

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-lg text-gray-600">
            Your {paymentData.contractType === 'temporary' ? 'Fixed-Term' : 'Permanent'} hiring package has been purchased
          </p>
        </div>

        {/* Order Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">
                  {paymentData.contractType === 'temporary' ? 'Fixed-Term Contract Hiring' : 'Permanent Role Hiring'}
                </h3>
                <p className="text-gray-600">{paymentData.jobTitle}</p>
                {paymentData.contractType === 'temporary' && paymentData.contractDuration && (
                  <p className="text-sm text-gray-500">
                    Duration: {(() => {
                      const duration = paymentData.contractDuration;
                      if (duration === 'under_3_months') return '3 months or less';
                      if (duration === '3_6_months') return '3-6 months';
                      if (duration === '6_12_months') return '6-12 months';
                      if (duration === 'over_12_months') return 'Over 12 months';
                      return duration;
                    })()}
                  </p>
                )}
              </div>
              <div className="text-2xl font-bold text-green-600">£{paymentData.price.toLocaleString()}</div>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-green-900">Payment Confirmed</p>
                  <p className="text-green-700 text-sm">
                    Your payment has been processed successfully. You'll receive a confirmation email shortly.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hiring Process Dashboard Introduction */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <CheckCircle className="w-5 h-5" />
              Your Hiring Process Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700">
                We've created a structured 7-step process to guide you from payment to finding your perfect candidate. 
                Your progress is tracked, and you can return anytime to continue where you left off.
              </p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">Step 1: Compatibility Check - Complete</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">Step 2: Payment - Complete</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700 font-medium">Step 3: Job Description Creation - Ready</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                  <span className="text-gray-500">Step 4: Design Your Process - Pending</span>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-gray-900 mb-2">Next Steps Preview</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Step 5: Skills & Tools</li>
                  <li>• Step 6: Working Style</li>
                  <li>• Step 7: Admin Review & Activation</li>
                  <li>• Step 8: Receive Your Matches</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid gap-4 md:grid-cols-2">
          <Button 
            onClick={handleStartProcess}
            size="lg"
            className="h-16 text-base"
          >
            <ArrowRight className="w-5 h-5 mr-2" />
            Start Your Hiring Process
          </Button>
          
          <Button 
            onClick={handleGoHome}
            variant="outline"
            size="lg"
            className="h-16 text-base"
          >
            <Home className="w-5 h-5 mr-2" />
            Return to Dashboard
          </Button>
        </div>

        {/* Contact Info */}
        <Card className="mt-8">
          <CardContent className="p-6 text-center">
            <Mail className="w-6 h-6 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 text-sm">
              Questions about your order? Contact us at support@pollen.com or check your dashboard for updates.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}