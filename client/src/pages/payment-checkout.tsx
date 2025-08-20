import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Home, CreditCard, CheckCircle, Users, Calendar, Briefcase, HeadphonesIcon, Phone } from "lucide-react";
import { formatPrice } from "@shared/pricing";

interface CheckoutData {
  jobTitle: string;
  companySize: string;
  employeeCount: number;
  contractDuration: string;
  contractType: 'temporary' | 'permanent';
  price: number;
  basePrice: number;
  hiringVolume: string;
  location: string;
  employmentType: string;
}

export default function PaymentCheckout() {
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem('checkoutData');
    if (data) {
      setCheckoutData(JSON.parse(data));
    }
  }, []);

  const handlePayment = async () => {
    if (!checkoutData) return;

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      // Save successful payment data
      localStorage.setItem('paymentComplete', JSON.stringify({
        ...checkoutData,
        paymentDate: new Date().toISOString(),
        paymentStatus: 'completed'
      }));
      
      setIsProcessing(false);
      window.location.href = '/payment-complete';
    }, 2000);
  };

  const handleConsultation = () => {
    window.location.href = '/freelance-consultation';
  };

  if (!checkoutData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Loading Checkout...</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Please wait while we prepare your checkout...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/simplified-service-selection'}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Service Selection
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/employer-dashboard'}
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Dashboard
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Complete Your Order</h1>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{checkoutData.jobTitle}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{checkoutData.contractType} position</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{checkoutData.location}</span>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    Complete Solution
                  </Badge>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-2xl font-bold text-primary">{formatPrice(checkoutData.price)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    One-time payment for unlimited hires in this role
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Service Details */}
            <Card>
              <CardHeader>
                <CardTitle>What's Included</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm">Bespoke skills challenge creation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm">Candidate matching and shortlisting</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm">Application review dashboard</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm">Interview scheduling tools</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm">Direct candidate communication</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm">Unlimited hires for this role</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Form */}
          <div className="space-y-6">
            {/* Alternative: Book Consultation */}
            <Card className="bg-amber-50 border-amber-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-amber-600" />
                  <span className="text-amber-900">Prefer Human Help?</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-amber-800 text-sm mb-4">
                  Rather have our team handle everything? Book a consultation call and we'll set up your hiring process personally.
                </p>
                <Button 
                  onClick={handleConsultation}
                  variant="outline"
                  className="w-full bg-amber-100 border-amber-300 text-amber-900 hover:bg-amber-200"
                >
                  <HeadphonesIcon className="w-4 h-4 mr-2" />
                  Book Consultation Call
                </Button>
              </CardContent>
            </Card>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">or pay online</span>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Secure Payment Processing</h4>
                  <p className="text-sm text-blue-800">
                    Your payment information is encrypted and secure. We use industry-standard SSL encryption 
                    to protect your data.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVC
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Smith"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
                
                <Button 
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full py-3 text-lg"
                  size="lg"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                      Processing Payment...
                    </div>
                  ) : (
                    `Complete Payment - ${formatPrice(checkoutData.price)}`
                  )}
                </Button>
                
                <p className="text-xs text-gray-500 text-center">
                  By completing this purchase, you agree to our Terms of Service and Privacy Policy
                </p>
              </CardContent>
            </Card>
            
            {/* Money-back Guarantee */}
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-900">100% Satisfaction Guarantee</span>
                </div>
                <p className="text-sm text-green-800">
                  If you're not completely satisfied with our service, we'll provide a full refund within 30 days.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}