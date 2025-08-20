import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle, ArrowRight, Clock, FileText, Settings, Users, Eye, UserCheck, Target, ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';
import ConsolidatedAssessmentConfig from '@/components/employer/ConsolidatedAssessmentConfig';

interface HiringStep {
  id: number;
  title: string;
  description: string;
  time: string;
  completed: boolean;
  current: boolean;
  icon: any;
}

export default function HiringProcessDashboard() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedBundle, setSelectedBundle] = useState<any>(null);
  const [stepData, setStepData] = useState<any>({});
  const [location, navigate] = useLocation();

  useEffect(() => {
    // Load payment data from simplified system
    const paymentData = localStorage.getItem('paymentComplete');
    const checkoutData = localStorage.getItem('checkoutData');
    const stepProgress = localStorage.getItem('hiringProcessStep');
    const jobFormData = localStorage.getItem('completeJobFormData');
    
    // Create bundle data from payment information
    if (paymentData) {
      const payment = JSON.parse(paymentData);
      const bundle = {
        contractType: payment.contractType || 'permanent',
        price: payment.price || 2000,
        tier: 'standard', // Simplified system has single tier
        serviceType: 'self-managed' // Default for simplified system
      };
      setSelectedBundle(bundle);
    } else if (checkoutData) {
      // Fallback to checkout data if payment data not available
      const checkout = JSON.parse(checkoutData);
      const bundle = {
        contractType: checkout.contractType || 'permanent',
        price: checkout.price || 2000,
        tier: 'standard',
        serviceType: 'self-managed'
      };
      setSelectedBundle(bundle);
    } else {
      // Fallback bundle for when no payment data is available
      const fallbackBundle = {
        contractType: 'permanent',
        price: 2000,
        tier: 'standard',
        serviceType: 'self-managed'
      };
      setSelectedBundle(fallbackBundle);
    }
    
    // Check if job posting is completed
    const initialStepData: any = {};
    if (jobFormData) {
      initialStepData.jobPosting = true;
    }
    setStepData(initialStepData);
    
    if (stepProgress) {
      setCurrentStep(0); // Always show dashboard initially
    }
  }, []);

  const getStepsForBundle = (bundle: any): HiringStep[] => {
    const isEnhancedOrManaged = bundle?.tier === 'enhanced' || bundle?.tier === 'managed';
    
    return [
      {
        id: 1,
        title: 'Compatibility Check',
        description: 'Talent analysis and compatibility assessment',
        time: 'Complete',
        completed: true,
        current: false,
        icon: CheckCircle
      },
      {
        id: 2,
        title: 'Payment',
        description: 'Package purchase and confirmation',
        time: 'Complete',
        completed: true,
        current: false,
        icon: CheckCircle
      },
      {
        id: 3,
        title: 'Job Description Creation',
        description: 'Define role requirements and create compelling job posting',
        time: '10-15 min',
        completed: !!stepData.jobPosting,
        current: !stepData.jobPosting,
        icon: FileText
      },
      {
        id: 4,
        title: 'Design Your Process',
        description: 'Configure assessment parameters and challenge generation',
        time: '20-25 min',
        completed: !!stepData.assessmentConfig,
        current: !!stepData.jobPosting && !stepData.assessmentConfig,
        icon: Settings
      },
      {
        id: 5,
        title: 'Review Generated Persona and Customised Challenges',
        description: 'Review generated persona and customise challenges',
        time: '4-5 min',
        completed: !!stepData.personaReview,
        current: !!stepData.assessmentConfig && !stepData.personaReview,
        icon: Users
      },
      {
        id: 6,
        title: 'Quality Check & Launch',
        description: 'Final review and assessment activation',
        time: '24 hours',
        completed: !!stepData.adminReview,
        current: !!stepData.personaReview && !stepData.adminReview,
        icon: Eye
      },
      ...(isEnhancedOrManaged ? [{
        id: 7,
        title: 'Interviews & Shortlist',
        description: 'Expert-led candidate interviews and shortlist creation',
        time: '3-5 days',
        completed: !!stepData.professionalInterviews,
        current: !!stepData.adminReview && !stepData.professionalInterviews,
        icon: UserCheck
      }] : []),
      {
        id: isEnhancedOrManaged ? 8 : 7,
        title: 'Receive Your Matches',
        description: 'Curated shortlist of top-performing candidates',
        time: '1-2 weeks',
        completed: !!stepData.finalMatches,
        current: false,
        icon: Target
      }
    ];
  };

  const steps = selectedBundle ? getStepsForBundle(selectedBundle) : [];
  const completedSteps = steps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  const handleStepClick = (stepId: number) => {
    if (stepId === 3 && !stepData.jobPosting) {
      navigate('/comprehensive-job-posting');
    } else if (stepId === 4 && stepData.jobPosting && !stepData.assessmentConfig) {
      setCurrentStep(4);
    } else if (stepId <= 6 && steps.find(s => s.id === stepId)?.completed) {
      // Allow reviewing completed steps
      setCurrentStep(stepId);
    }
  };

  const handleStepComplete = (stepId: number, data: any) => {
    setStepData((prev: any) => ({ ...prev, [`step${stepId}`]: data }));
    setCurrentStep(0); // Return to dashboard
  };

  const handleBackToDashboard = () => {
    navigate('/employer-dashboard');
  };

  const renderCurrentStep = () => {
    if (currentStep === 4) {
      return (
        <ConsolidatedAssessmentConfig
          onBack={() => setCurrentStep(0)}
          onComplete={(data) => {
            setStepData((prev: any) => ({ ...prev, assessmentConfig: data }));
            setCurrentStep(0);
          }}
          initialData={stepData.assessmentConfig}
        />
      );
    }

    // Add other step renderers here as needed
    return null;
  };

  if (currentStep > 0) {
    return renderCurrentStep();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900" style={{fontFamily: 'Sora'}}>
                Your Hiring Process
              </h1>
              <p className="text-gray-600 mt-1" style={{fontFamily: 'Poppins'}}>
                Complete your setup to start receiving quality candidates
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={handleBackToDashboard} 
              className="flex items-center gap-2"
              style={{fontFamily: 'Sora'}}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Current Step Action Card */}
        {steps.find(s => s.current) && (
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-6 mb-8 border border-pink-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                  {(() => {
                    const currentStep = steps.find(s => s.current);
                    const Icon = currentStep?.icon;
                    return Icon ? <Icon className="w-5 h-5 text-pink-600" /> : null;
                  })()}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900" style={{fontFamily: 'Sora'}}>
                    Next: {steps.find(s => s.current)?.title}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {steps.find(s => s.current)?.description}
                  </p>
                </div>
              </div>
              <Button 
                onClick={() => handleStepClick(steps.find(s => s.current)!.id)}
                className="bg-pink-600 hover:bg-pink-700"
                style={{fontFamily: 'Sora'}}
              >
                Continue <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <div className="text-xs text-gray-500">
              Estimated time: {steps.find(s => s.current)?.time}
            </div>
          </div>
        )}

        {/* Progress Overview */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900" style={{fontFamily: 'Sora'}}>
              Setup Progress
            </h3>
            <span className="text-sm text-gray-600">
              {completedSteps} of {steps.length} steps completed
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
            <div 
              className="bg-pink-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-sm text-gray-600">
            {progressPercentage === 100 
              ? 'Setup complete! Your job is now live and receiving applications.'
              : `${Math.round(progressPercentage)}% complete - continue to activate your job posting.`
            }
          </p>
        </div>

        {/* Steps List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{fontFamily: 'Sora'}}>
            Setup Steps
          </h3>
          {steps.map((step, index) => {
            const Icon = step.icon;
            const canAccess = step.completed || step.current || step.id <= 2;
            
            return (
              <div 
                key={step.id} 
                className={`bg-white rounded-lg border border-gray-200 p-4 transition-all duration-200 ${
                  canAccess ? 'hover:shadow-sm cursor-pointer' : 'cursor-not-allowed opacity-60'
                }`}
                onClick={() => canAccess && handleStepClick(step.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        step.completed 
                          ? 'bg-green-100' 
                          : step.current 
                          ? 'bg-pink-100' 
                          : 'bg-gray-100'
                      }`}>
                        <Icon className={`w-5 h-5 ${
                          step.completed 
                            ? 'text-green-600' 
                            : step.current 
                            ? 'text-pink-600' 
                            : 'text-gray-400'
                        }`} />
                      </div>
                      <div className="text-sm font-medium text-gray-500" style={{fontFamily: 'Sora'}}>
                        Step {step.id}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900" style={{fontFamily: 'Sora'}}>
                        {step.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {step.description}
                      </p>
                      <div className="text-xs text-gray-500 mt-1">
                        {step.completed ? 'Completed' : `Estimated time: ${step.time}`}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {step.completed && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-green-600" style={{fontFamily: 'Sora'}}>
                          Complete
                        </span>
                      </div>
                    )}
                    {step.current && (
                      <Button 
                        size="sm"
                        className="bg-pink-600 hover:bg-pink-700"
                        style={{fontFamily: 'Sora'}}
                      >
                        Continue
                      </Button>
                    )}
                    {!step.completed && !step.current && (
                      <span className="text-sm text-gray-400" style={{fontFamily: 'Sora'}}>
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Help Section */}
        <div className="mt-12 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{fontFamily: 'Sora'}}>
            Need Help?
          </h3>
          <p className="text-gray-600 mb-4">
            Our team is here to support you through the setup process. If you have any questions or need assistance, don't hesitate to reach out.
          </p>
          <Button variant="outline" style={{fontFamily: 'Sora'}}>
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}