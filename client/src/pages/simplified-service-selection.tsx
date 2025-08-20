import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Home, Check, Briefcase, HeadphonesIcon, AlertCircle, Shield, Phone, FileText } from "lucide-react";
import { 
  getSimplifiedPricing, 
  getPricingDisplayText, 
  shouldRedirectToConsultation, 
  getConsultationMessage,
  SIMPLIFIED_PRICING,
  formatPrice,
  validateContractDuration
} from "@shared/pricing";

interface JobData {
  jobTitle: string;
  companySize: string;
  employeeCount: number;
  contractDuration: string;
  contractType: string;
  employmentType: string;
  location: string;
  hiringVolume: string;
}

export default function SimplifiedServiceSelection() {
  const [jobData, setJobData] = useState<JobData | null>(null);
  const [contractType, setContractType] = useState<'temporary' | 'permanent'>('temporary');
  const [basePrice, setBasePrice] = useState<number>(0);
  const [shouldShowConsultation, setShouldShowConsultation] = useState(false);
  const [consultationMessage, setConsultationMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    // Load job posting data
    const savedJobData = localStorage.getItem('completeJobFormData');
    console.log('Saved job data:', savedJobData); // Debug log
    
    if (savedJobData) {
      try {
        const data = JSON.parse(savedJobData);
        console.log('Parsed job data:', data); // Debug log
        setJobData(data);
        
        // Determine contract type from duration
        if (data.contractDuration) {
          const durationValidation = validateContractDuration(data.contractDuration);
          console.log('Duration validation:', durationValidation); // Debug log
          
          if (durationValidation.isValid) {
            setContractType(durationValidation.contractType);
            const pricing = getSimplifiedPricing(durationValidation.contractType, durationValidation.months);
            console.log('Calculated pricing:', pricing); // Debug log
            setBasePrice(pricing);
          } else {
            console.error('Invalid contract duration:', data.contractDuration);
            // Fallback to permanent if duration is invalid
            setContractType('permanent');
            setBasePrice(getSimplifiedPricing('permanent'));
          }
        } else {
          console.error('No contract duration found in data');
          // Fallback to permanent if no duration
          setContractType('permanent');
          setBasePrice(getSimplifiedPricing('permanent'));
        }
        
        // Check if should redirect to consultation
        if (shouldRedirectToConsultation(data.hiringVolume, data.companySize, data.employeeCount)) {
          setShouldShowConsultation(true);
          setConsultationMessage(getConsultationMessage(data.hiringVolume, data.employeeCount));
        }
      } catch (error) {
        console.error('Error parsing job data:', error);
        // Redirect back to job posting if data is corrupted
        window.location.href = '/comprehensive-job-posting';
      }
    } else {
      console.error('No saved job data found');
      // Redirect back to job posting if no data
      window.location.href = '/comprehensive-job-posting';
    }
  }, []);

  const handleProceedToCheckout = () => {
    if (!jobData || !basePrice) return;

    const checkoutData = {
      ...jobData,
      price: basePrice,
      contractType,
      basePrice
    };

    localStorage.setItem('checkoutData', JSON.stringify(checkoutData));
    window.location.href = '/payment-checkout';
  };

  const handleConsultation = () => {
    window.location.href = '/freelance-consultation';
  };

  // Redirect to consultation if freelancer/contractor selected
  if (jobData?.employmentType === 'freelancer') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Freelancer/Contractor Hiring</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              For freelancer and contractor positions, we use a different pricing model.
            </p>
            <Button onClick={handleConsultation} className="w-full">
              Book Consultation Call
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!jobData || !basePrice) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your pricing...</p>
        </div>
      </div>
    );
  }

  const pricingDisplay = getPricingDisplayText(contractType, jobData.contractType === 'internship', jobData.contractDuration ? validateContractDuration(jobData.contractDuration).months : undefined);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Navigation Header */}
        <div className="flex items-center justify-end mb-8">
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/employer-dashboard'}
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Dashboard
          </Button>
        </div>

        {/* Job Summary */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Fixed Price {(() => {
              if (jobData.contractDuration === 'internship') return 'Internship';
              return contractType === 'temporary' ? 'Temporary' : 'Permanent';
            })()} Hiring
          </h1>
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-900">{jobData.jobTitle}</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {jobData.contractDuration === 'internship' ? 'internship' : `${contractType} position`}
                </Badge>
                <span className="text-blue-800">
                  {pricingDisplay.description}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* High-value consultation recommendation */}
        {shouldShowConsultation && (
          <Card className="mb-8 bg-amber-50 border-amber-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-amber-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-amber-900 mb-2">Recommended: Speak to Our Team</h3>
                  <p className="text-amber-800 mb-4">{consultationMessage}</p>
                  <Button 
                    onClick={handleConsultation}
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    <HeadphonesIcon className="w-4 h-4 mr-2" />
                    Book Consultation Call
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* General Consultation Option */}
        <Card className="mb-8 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Phone className="w-8 h-8 text-amber-600 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-amber-900 mb-2">Prefer to Talk to a Human?</h3>
                <p className="text-amber-800 text-sm mb-4">
                  Skip the online process and let our team handle your hiring setup personally. 
                  We'll create your job posting, set up assessments, and manage the entire process for you.
                </p>
                <Button 
                  onClick={handleConsultation}
                  variant="outline"
                  className="bg-amber-100 border-amber-300 text-amber-900 hover:bg-amber-200"
                >
                  <HeadphonesIcon className="w-4 h-4 mr-2" />
                  Book Consultation Call
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-50 text-gray-500">or continue with self-service</span>
          </div>
        </div>

        {/* Main Pricing Card */}
        <Card className="mb-8 bg-white border-2 border-blue-200">
          <CardHeader className="pb-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">{formatPrice(basePrice)}</div>
              <div className="text-lg text-gray-600">Complete Hiring Solution</div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900 text-lg">What's Included:</h4>
                <ul className="text-sm space-y-2">
                  {SIMPLIFIED_PRICING.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">No Hidden Fees</h4>
                <p className="text-green-800 text-sm">
                  One fixed price per role type, no additional charges ever - hire as many people as you need for this position.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>



        {/* Money-Back Guarantee */}
        <Card className="mb-8 bg-purple-50 border-purple-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <Shield className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-purple-900 mb-2">Money-Back Guarantee*</h3>
              <p className="text-purple-800 text-sm">
                Full refund if no suitable candidates are found.
              </p>
              <p className="text-xs text-purple-700 mt-1">
                *Subject to adherence to fair hiring standards and Terms & Conditions
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Terms and Conditions */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <Checkbox 
                id="terms" 
                checked={termsAccepted}
                onCheckedChange={setTermsAccepted}
                className="mt-1"
              />
              <div className="flex-1">
                <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer">
                  I agree to uphold{' '}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="link" className="p-0 h-auto text-blue-600 underline">
                        Fair Hiring Standards
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Shield className="w-5 h-5" />
                          Fair Hiring Standards
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 text-sm">
                        <p className="mb-3">By using Pollen's services, you commit to:</p>
                        <ul className="space-y-2 ml-4">
                          <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span><strong>Fair Pay:</strong> Offering salaries meeting or exceeding the real living wage for all roles</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span><strong>Transparency:</strong> Providing clear information about remuneration, role expectations, and hiring timelines</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span><strong>Background:</strong> Eliminating educational attainment as a screening requirement unless required for technical or regulatory reasons</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span><strong>Efficiency:</strong> Responding promptly upon receipt of candidate profiles and arranging next-stage interviews within one week where feasible</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span><strong>Communication:</strong> Maintaining open communication with Pollen and candidates throughout the process</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span><strong>Feedback:</strong> Offering constructive feedback for all candidates introduced and interviewed</span>
                          </li>
                        </ul>
                      </div>
                    </DialogContent>
                  </Dialog>
                  {' '}and accept Pollen's{' '}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="link" className="p-0 h-auto text-blue-600 underline">
                        Terms and Conditions
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <FileText className="w-5 h-5" />
                          Terms and Conditions
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 text-sm">
                        <div>
                          <h4 className="font-semibold mb-2">Service Terms</h4>
                          <ul className="space-y-2 ml-4">
                            <li>• Payment covers unlimited hires for the specified role</li>
                            <li>• Money-back guarantee if no suitable candidates are found, subject to adherence to fair hiring standards and Terms & Conditions</li>
                            <li>• No hidden fees or additional charges</li>
                            <li>• Service includes bespoke skills assessment creation and candidate matching</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Employer Responsibilities</h4>
                          <p>You acknowledge that providing feedback to candidates is your responsibility as an employer and part of professional hiring practices.</p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Proceed to Checkout */}
        <div className="flex justify-center">
          <Button 
            onClick={handleProceedToCheckout}
            className="px-8 py-3 text-lg"
            disabled={isLoading || !termsAccepted}
          >
            {isLoading ? 'Processing...' : `Proceed to Payment - ${formatPrice(basePrice)}`}
          </Button>
        </div>
      </div>
    </div>
  );
}