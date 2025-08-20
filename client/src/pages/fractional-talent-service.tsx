import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, Clock, PoundSterling, Star, Award, CheckCircle,
  ArrowRight, ChevronLeft, Calendar, Target, Zap
} from "lucide-react";

export default function FractionalTalentService() {
  const [requirements, setRequirements] = useState({
    skillsNeeded: "",
    duration: "",
    startDate: "",
    budget: "",
    projectType: "",
    description: ""
  });

  const handleSubmit = () => {
    // Store requirements and proceed to matching
    localStorage.setItem('fractionalRequirements', JSON.stringify(requirements));
    window.location.href = '/fractional-talent-matching';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-blue-600 text-white">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Fractional Talent Service</h1>
            <p className="text-xl text-pink-100 mb-6">
              Access skilled bootcamped professionals for your projects
            </p>
            <div className="flex justify-center items-center gap-8 text-lg">
              <div className="flex items-center gap-2">
                <PoundSterling className="w-6 h-6" />
                <span>£250 per day</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-6 h-6" />
                <span>Flexible duration</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6" />
                <span>Bootcamp-trained</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Service Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-pink-600" />
                  How It Works
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-pink-600">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Tell us your needs</h4>
                      <p className="text-gray-600 text-sm">Describe your project, skills required, and timeline</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-pink-600">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">We match you with talent</h4>
                      <p className="text-gray-600 text-sm">Our bootcamped professionals are matched to your requirements</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-pink-600">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Start working together</h4>
                      <p className="text-gray-600 text-sm">Begin your project with ongoing Pollen support</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  What Makes Our Talent Special
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Bootcamp-trained with proven practical skills</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Employed and managed by Pollen for quality assurance</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Continuous learning and skill development</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Dedicated to fresh, innovative approaches</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Ongoing support and project management</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-green-900 mb-3">Perfect for Startups</h3>
                <div className="space-y-2 text-sm text-green-800">
                  <div>• Access senior-level skills without senior-level costs</div>
                  <div>• Scale your team up or down as needed</div>
                  <div>• Fresh perspectives from motivated career changers</div>
                  <div>• No recruitment fees or long-term commitments</div>
                  <div>• Immediate availability for urgent projects</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Requirements Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Requirements</CardTitle>
                <p className="text-gray-600">Tell us about your project and we'll match you with the right talent</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="skillsNeeded">Skills Needed *</Label>
                  <Textarea
                    id="skillsNeeded"
                    rows={3}
                    value={requirements.skillsNeeded}
                    onChange={(e) => setRequirements({...requirements, skillsNeeded: e.target.value})}
                    placeholder="e.g. React development, UI/UX design, data analysis, content creation..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="duration">Project Duration</Label>
                    <Select onValueChange={(value) => setRequirements({...requirements, duration: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-2-weeks">1-2 weeks</SelectItem>
                        <SelectItem value="1-month">1 month</SelectItem>
                        <SelectItem value="2-3-months">2-3 months</SelectItem>
                        <SelectItem value="3-6-months">3-6 months</SelectItem>
                        <SelectItem value="6-months-plus">6+ months</SelectItem>
                        <SelectItem value="ongoing">Ongoing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="startDate">Preferred Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={requirements.startDate}
                      onChange={(e) => setRequirements({...requirements, startDate: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="projectType">Project Type</Label>
                  <Select onValueChange={(value) => setRequirements({...requirements, projectType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="web-development">Web Development</SelectItem>
                      <SelectItem value="mobile-app">Mobile App Development</SelectItem>
                      <SelectItem value="design-ux">Design & UX</SelectItem>
                      <SelectItem value="data-analysis">Data Analysis</SelectItem>
                      <SelectItem value="marketing">Marketing & Content</SelectItem>
                      <SelectItem value="automation">Process Automation</SelectItem>
                      <SelectItem value="research">Research & Analysis</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="budget">Budget Range (optional)</Label>
                  <Select onValueChange={(value) => setRequirements({...requirements, budget: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-2500">Under £2,500</SelectItem>
                      <SelectItem value="2500-5000">£2,500 - £5,000</SelectItem>
                      <SelectItem value="5000-10000">£5,000 - £10,000</SelectItem>
                      <SelectItem value="25000-35000">£25,000 - £35,000</SelectItem>
                      <SelectItem value="35000-plus">£35,000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Project Description</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    value={requirements.description}
                    onChange={(e) => setRequirements({...requirements, description: e.target.value})}
                    placeholder="Describe your project, goals, and any specific requirements..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Pricing Summary */}
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold text-purple-900 mb-2">Simple, Transparent Pricing</h3>
                <div className="text-3xl font-bold text-purple-900 mb-2">£250</div>
                <div className="text-purple-700 mb-4">per day, per person</div>
                <div className="space-y-2 text-sm text-purple-800">
                  <div>• No setup fees or hidden costs</div>
                  <div>• Pay only for active working days</div>
                  <div>• Flexible scaling up or down</div>
                  <div>• Includes ongoing project support</div>
                </div>
              </CardContent>
            </Card>

            <Button 
              onClick={handleSubmit}
              disabled={!requirements.skillsNeeded}
              className="w-full bg-purple-600 hover:bg-purple-700"
              size="lg"
            >
              Find My Fractional Talent
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>

        {/* Back Navigation */}
        <div className="mt-8">
          <Button variant="outline" onClick={() => window.history.back()}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Hiring Options
          </Button>
        </div>
      </div>
    </div>
  );
}