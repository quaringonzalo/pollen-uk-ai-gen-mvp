import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  Calendar, 
  CheckCircle, 
  ArrowLeft,
  Users,
  Clock,
  Target,
  Star,
  MessageSquare,
  Zap,
  Building
} from "lucide-react";

interface JobFormData {
  jobTitle: string;
  keyJobFunctions: string[];
  placeOfWork: string;
  workingHours: string;
  employmentType: string;
  contractType: string;
  hiringVolume: string;
  workArrangement: string;
  urgencyOfHire: string;
  keySkills: string[];
}

export default function FreelanceConsultation() {
  const [formData, setFormData] = useState<JobFormData | null>(null);

  useEffect(() => {
    const savedData = localStorage.getItem('jobFormData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const handleBookConsultation = () => {
    // This would integrate with a booking system (Calendly, etc.)
    alert('Booking consultation - this would integrate with your preferred booking system');
  };

  const handleBackToForm = () => {
    window.location.href = '/job-posting';
  };

  if (!formData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={handleBackToForm}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to job posting
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Freelance & Outsourced Talent
          </h1>
          <p className="text-gray-600">
            Let's discuss your flexible hiring needs
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Job Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Your Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900">{formData.jobTitle}</h3>
                <p className="text-gray-600">{formData.placeOfWork}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700">Job Functions</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {formData.keyJobFunctions.map((func) => (
                    <Badge key={func} variant="secondary" className="text-xs">
                      {func}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700">Key Skills</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {formData.keySkills.slice(0, 5).map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {formData.keySkills.length > 5 && (
                    <Badge variant="outline" className="text-xs">
                      +{formData.keySkills.length - 5} more
                    </Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-sm font-medium text-gray-700">Working Hours</p>
                  <p className="text-sm text-gray-600 capitalize">{formData.workingHours}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Urgency</p>
                  <p className="text-sm text-gray-600 capitalize">{formData.urgencyOfHire}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Consultation Booking */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Book Your Consultation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">
                  Freelance & Outsourced Hiring
                </h3>
                <p className="text-sm text-blue-800">
                  For flexible work and outsourced roles, we provide a personalised 
                  consultation to understand your specific needs and match you with the 
                  right talent from our pool of bootcamped community members.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm">15-minute discovery call</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm">Custom talent matching</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm">Project scoping & pricing</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm">Flexible engagement models</span>
                </div>
              </div>

              <Button 
                onClick={handleBookConsultation}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Book Free Consultation
              </Button>

              <p className="text-xs text-gray-500 text-center">
                No commitment required - we'll help you explore your options
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Flexible Support Information */}
        <div className="mt-8 space-y-6">
          {/* Value Proposition */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Flexible Support Solutions
              </h2>
              <p className="text-gray-700 mb-4">
                Whether you need flexible support or ongoing assistance, we provide skilled professionals 
                who can integrate seamlessly with your team. No long-term commitments, no HR hassle.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Project Work</h3>
                  <p className="text-sm text-gray-600">
                    Specific deliverables with clear timelines. Perfect for campaigns, 
                    one-off projects, or temporary capacity needs.
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Ongoing Support</h3>
                  <p className="text-sm text-gray-600">
                    Regular assistance with daily operations. Ideal for growing teams 
                    that need consistent help without permanent hires.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How It Works */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                How Our Consultation Works
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                We'll discuss your specific needs in a brief 15-minute call to understand:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <span className="text-sm">What tasks need to be completed</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <span className="text-sm">Timeline and urgency</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <span className="text-sm">Team integration requirements</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <span className="text-sm">Budget and duration</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <span className="text-sm">Skills needed</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What We Offer */}
          <Card>
            <CardHeader>
              <CardTitle>What We Provide</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Pre-trained professionals</p>
                      <p className="text-sm text-gray-600">All candidates complete our skills bootcamp</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Complete admin handling</p>
                      <p className="text-sm text-gray-600">Contracts, payroll, and compliance managed for you</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Flexible engagement</p>
                      <p className="text-sm text-gray-600">Scale up or down with just one week's notice</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Quality matching</p>
                      <p className="text-sm text-gray-600">We match for skills, culture, and working style</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Transparent pricing</p>
                      <p className="text-sm text-gray-600">Clear day rates with no hidden fees</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Ongoing support</p>
                      <p className="text-sm text-gray-600">Regular check-ins to ensure success</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Testimonial */}
          <Card className="bg-gray-50">
            <CardContent className="p-6 text-center">
              <p className="text-lg italic text-gray-700 mb-3">
                "Having flexible support has been game-changing for our growth. We get the skills we need 
                exactly when we need them, without the overhead of permanent hiring."
              </p>
              <p className="text-gray-600 font-medium">— Startup Founder</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}