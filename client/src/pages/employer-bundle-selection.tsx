import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight, Check, X, ArrowLeft, Home } from "lucide-react";

const PRICING_BUNDLES = [
  {
    id: 'temp',
    name: 'Temp Hire',
    price: '£1,000',
    description: 'Foundation-level challenges for short-term or contract roles',
    included: [
      'Candidates tested on core job skills',
      'Basic screening and candidate matching',
      'Standard candidate profiles provided',
      'Email support and regular updates',
      'Quick 48-hour turnaround time'
    ],
    notIncluded: [
      'You handle all interviews',
      'You manage candidate feedback',
      'You coordinate scheduling',
      'Basic support only'
    ],
    painPoints: ['Need quick temporary staff', 'Budget constraints', 'Short-term projects'],
    businessBenefits: ['Fast hiring for urgent needs', 'Cost-effective for temp roles', 'Verified basic competency'],
    popular: false,
    tier: 'temp',
    badge: 'For Temps & Contracts'
  },
  {
    id: 'standard',
    name: 'Quality Hire',
    price: '£2,000',
    description: 'Custom testing with expert oversight to shortlist top performers',
    included: [
      'Candidates tested on real job tasks',
      'Only top performers reach your shortlist',
      'Values and team fit analysis included',
      'Hiring insights dashboard included',
      'Detailed candidate evaluation reports',
      'Expert oversight of entire process'
    ],
    notIncluded: [
      'You conduct all interviews',
      'You provide candidate feedback',
      'You manage interview scheduling',
      'You handle candidate communication'
    ],
    painPoints: ['Generic assessments', 'Unverified skills', 'Poor candidate quality'],
    businessBenefits: ['Perfect role-fit matching', 'Verified skills competency', 'Reduce bad hires by 70%'],
    popular: false,
    tier: 'standard'
  },
  {
    id: 'enhanced',
    name: 'Human-Assisted Hire',
    price: '£2,500',
    description: 'Everything in Quality Hire plus we handle first-stage interviews and feedback',
    included: [
      'Everything in Quality Hire',
      'We conduct first-stage interviews for you',
      'Professional interview feedback and scoring',
      'All candidate communication handled',
      '✓ 100% feedback guarantee - we remove any admin burden',
      'Detailed reports with hiring recommendations'
    ],
    notIncluded: [
      'You handle final interviews',
      'You make final hiring decisions',
      'You manage salary negotiations',
      'You handle reference checks'
    ],
    painPoints: ['No time for initial interviews', 'Inconsistent interview quality', 'Poor candidate experience'],
    businessBenefits: ['Save 10+ hours per hire', 'Professional candidate experience', 'Better interview insights'],
    popular: true,
    tier: 'enhanced'
  },
  {
    id: 'managed',
    name: 'Fully Managed Service',
    price: '£3,500',
    description: 'Complete white-glove hiring service for busy leaders',
    included: [
      'Everything in Human-Assisted Hire',
      'Dedicated hiring manager assigned to you',
      'Complete hands-off hiring process',
      'All interview rounds managed for you',
      'Reference checking handled',
      'Salary negotiation support included',
      'Onboarding guidance provided'
    ],
    notIncluded: [
      'You make final hiring approval',
      'You set company-specific salary bands',
      'You define role start dates',
      'You handle internal onboarding'
    ],
    painPoints: ['No time for hiring process', 'Complex coordination', 'Leadership-level demands'],
    businessBenefits: ['Completely hands-off hiring', '80% time savings', 'Leadership-quality service'],
    popular: false,
    tier: 'managed'
  }
];

export default function EmployerBundleSelection() {
  const [jobData, setJobData] = useState<any>(null);
  const [employerProfile, setEmployerProfile] = useState<any>(null);
  const [showTempHire, setShowTempHire] = useState(false);

  useEffect(() => {
    // Load job data from localStorage
    const savedData = localStorage.getItem('jobFormData');
    if (savedData) {
      const data = JSON.parse(savedData);
      setJobData(data);
      
      // Check if they indicated temp/contract hiring in their form
      const isTemp = data?.employmentType === 'fixed-term' || 
                    data?.employmentType === 'internship' ||
                    data?.workingHours === 'part-time' ||
                    data?.contractType === 'outsourced' ||
                    data?.duration === 'under-6-months' ||
                    (data?.hiringTimeframe && data.hiringTimeframe.includes('temp')) ||
                    (data?.roleType && data.roleType.includes('temp'));
      setShowTempHire(isTemp);
    }
    
    // Load employer profile data
    const fetchEmployerProfile = async () => {
      try {
        const response = await fetch('/api/employer-profile/current');
        if (response.ok) {
          const profile = await response.json();
          setEmployerProfile(profile);
        }
      } catch (error) {
        console.error('Failed to fetch employer profile:', error);
      }
    };
    
    fetchEmployerProfile();
  }, []);

  // Filter bundles based on whether temp hiring should be shown
  const visibleBundles = showTempHire ? PRICING_BUNDLES : PRICING_BUNDLES.filter(bundle => bundle.id !== 'temp');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/comprehensive-job-posting'}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
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

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Hiring Service</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Get quality candidates faster with our skills-first approach. Choose the level of support that works for your team.
          </p>
          
          {/* Feedback Guarantee Banner */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div className="text-left">
                <p className="font-semibold text-green-900">100% Satisfaction Guarantee*</p>
                <p className="text-sm text-green-700">
                  By working with Pollen, you agree to our commitment to provide every candidate with professional feedback. With Human-Assisted Hire, we'll manage this entire process on your behalf.
                </p>
                <p className="text-xs text-green-600 mt-1">
                  *Refunds available when employers adhere to fair hiring standards and T&Cs
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className={`grid gap-8 mb-12 ${showTempHire ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-3'}`}>
          {visibleBundles.map((bundle) => (
            <Card 
              key={bundle.id}
              className={`relative cursor-pointer hover:shadow-xl transition-all duration-300 ${
                bundle.popular ? 'border-2 border-blue-500 scale-105' : 'border border-gray-200'
              }`}
              onClick={() => {
                if (bundle.id === 'managed') {
                  // Fully Managed goes to consultation booking
                  localStorage.setItem('selectedBundle', JSON.stringify(bundle));
                  window.location.href = '/fully-managed-consultation';
                } else {
                  // Other packages go to checkout
                  localStorage.setItem('selectedBundle', JSON.stringify(bundle));
                  window.location.href = '/package-checkout';
                }
              }}
            >
              {bundle.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white px-4 py-1">Most Popular</Badge>
                </div>
              )}
              {bundle.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-green-500 text-white px-4 py-1">{bundle.badge}</Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900">{bundle.name}</CardTitle>
                <div className="text-4xl font-bold text-blue-600 mb-2">{bundle.price}</div>
                <p className="text-gray-600">{bundle.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Perfect for:</h4>
                  <ul className="space-y-1">
                    {bundle.businessBenefits.map((benefit, index) => (
                      <li key={index} className="text-sm text-blue-700">• {benefit}</li>
                    ))}
                  </ul>
                </div>
                
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  {bundle.id === 'managed' ? 'Book Consultation' : `Select ${bundle.name}`}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Service Comparison</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Service</th>
                  {showTempHire && (
                    <th className="text-center py-4 px-4 font-semibold text-gray-900">Temp Hire<br/><span className="text-sm font-normal text-gray-600">£1,000</span></th>
                  )}
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">Quality Hire<br/><span className="text-sm font-normal text-gray-600">£2,000</span></th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">Human-Assisted<br/><span className="text-sm font-normal text-gray-600">£2,500</span></th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">Fully Managed<br/><span className="text-sm font-normal text-gray-600">£3,500</span></th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900">Skills Testing</td>
                  {showTempHire && (
                    <td className="py-3 px-4 text-center text-gray-600">Foundation level</td>
                  )}
                  <td className="py-3 px-4 text-center text-green-600">✓ Custom tests</td>
                  <td className="py-3 px-4 text-center text-green-600">✓ Custom tests</td>
                  <td className="py-3 px-4 text-center text-green-600">✓ Custom tests</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900">Candidate Shortlisting</td>
                  {showTempHire && (
                    <td className="py-3 px-4 text-center text-green-600">✓ Basic</td>
                  )}
                  <td className="py-3 px-4 text-center text-green-600">✓ Expert curated</td>
                  <td className="py-3 px-4 text-center text-green-600">✓ Expert curated</td>
                  <td className="py-3 px-4 text-center text-green-600">✓ Expert curated</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900">Hiring Insights Dashboard</td>
                  {showTempHire && (
                    <td className="py-3 px-4 text-center text-green-600">✓ Basic</td>
                  )}
                  <td className="py-3 px-4 text-center text-green-600">✓ Included</td>
                  <td className="py-3 px-4 text-center text-green-600">✓ Included</td>
                  <td className="py-3 px-4 text-center text-green-600">✓ Included</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900">First-Stage Interviews</td>
                  {showTempHire && (
                    <td className="py-3 px-4 text-center text-gray-400">You handle</td>
                  )}
                  <td className="py-3 px-4 text-center text-gray-400">You handle</td>
                  <td className="py-3 px-4 text-center text-green-600">✓ We conduct</td>
                  <td className="py-3 px-4 text-center text-green-600">✓ We conduct</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900">Candidate Feedback</td>
                  {showTempHire && (
                    <td className="py-3 px-4 text-center text-gray-400">You provide</td>
                  )}
                  <td className="py-3 px-4 text-center text-gray-400">You provide</td>
                  <td className="py-3 px-4 text-center text-green-600">✓ We provide</td>
                  <td className="py-3 px-4 text-center text-green-600">✓ We provide</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900">Pollen Testimonial</td>
                  {showTempHire && (
                    <td className="py-3 px-4 text-center text-gray-400">Not included</td>
                  )}
                  <td className="py-3 px-4 text-center text-gray-400">Not included</td>
                  <td className="py-3 px-4 text-center text-green-600">✓ After consultation</td>
                  <td className="py-3 px-4 text-center text-green-600">✓ After consultation</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900">Interview Scheduling</td>
                  {showTempHire && (
                    <td className="py-3 px-4 text-center text-gray-400">You handle</td>
                  )}
                  <td className="py-3 px-4 text-center text-gray-400">You handle</td>
                  <td className="py-3 px-4 text-center text-gray-400">You handle</td>
                  <td className="py-3 px-4 text-center text-green-600">✓ We manage</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900">Reference Checking</td>
                  {showTempHire && (
                    <td className="py-3 px-4 text-center text-gray-400">You handle</td>
                  )}
                  <td className="py-3 px-4 text-center text-gray-400">You handle</td>
                  <td className="py-3 px-4 text-center text-gray-400">You handle</td>
                  <td className="py-3 px-4 text-center text-green-600">✓ We handle</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900">Dedicated Manager</td>
                  {showTempHire && (
                    <td className="py-3 px-4 text-center text-gray-400">Email support</td>
                  )}
                  <td className="py-3 px-4 text-center text-gray-400">Email support</td>
                  <td className="py-3 px-4 text-center text-gray-400">Email support</td>
                  <td className="py-3 px-4 text-center text-green-600">✓ Assigned</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-gray-900">Guarantee Period</td>
                  {showTempHire && (
                    <td className="py-3 px-4 text-center text-gray-600">30 days</td>
                  )}
                  <td className="py-3 px-4 text-center text-gray-600">60 days</td>
                  <td className="py-3 px-4 text-center text-gray-600">75 days</td>
                  <td className="py-3 px-4 text-center text-gray-600">90 days</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>



        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Need help choosing the right service level? Our team can help you select the perfect package for your needs.
          </p>
          <Button 
            variant="outline"
            onClick={() => window.location.href = '/freelance-consultation'}
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            Get Free Consultation
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}