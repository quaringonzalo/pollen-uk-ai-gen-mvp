import { useState } from "react";
import { useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  ChevronLeft, Download, Upload, Clock, CheckCircle2, 
  AlertCircle, FileText, Star, Building2, Trophy,
  Eye, MessageCircle, User
} from "lucide-react";

interface CompanyChallengeData {
  id: string;
  title: string;
  description: string;
  company: {
    name: string;
    logo: string;
    rating: number;
  };
  jobTitle: string;
  timeLimit: string;
  submissionDeadline: string;
  reviewedBy: string;
  instructions: string[];
  deliverables: string[];
  evaluationCriteria: string[];
  resources?: {
    name: string;
    url: string;
    type: "document" | "spreadsheet" | "presentation";
  }[];
}

export default function CompanyChallengePage() {
  const { challengeId } = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [submissionText, setSubmissionText] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [challengeStarted, setChallengeStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState("2:47:33");
  const [challengeSubmitted, setChallengeSubmitted] = useState(false);

  // Mock challenge data
  const challengeData: CompanyChallengeData = {
    id: challengeId || "challenge-001",
    title: "CreativeMinds Media Planning Task",
    description: "Help us plan the media strategy for one of our current clients. You'll work with real brand guidelines and budget constraints to create a focused media plan that demonstrates your approach to this type of work.",
    company: {
      name: "CreativeMinds Agency",
      logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=50&h=50&fit=crop&crop=centre",
      rating: 4.6
    },
    jobTitle: "Media Planning Assistant",
    timeLimit: "90 minutes",
    submissionDeadline: "January 27, 2024 at 11:59 PM",
    reviewedBy: "Sarah Mitchell, Senior Media Planning Manager",
    instructions: [
      "Review the client brief for our sustainable fashion client",
      "Propose which 2-3 media channels you'd recommend and why",
      "Create a simple budget split showing your reasoning",
      "Identify what success would look like for this campaign",
      "Present your thinking in a simple, clear format"
    ],
    deliverables: [
      "One-page media recommendation (PDF or PowerPoint)",
      "Simple budget breakdown with your rationale",
      "3-5 bullet points explaining your channel choices"
    ],
    evaluationCriteria: [
      "Clear thinking about target audience and channels (40%)",
      "Logical budget allocation reasoning (30%)",
      "Understanding of the brand and its values (20%)",
      "Clear communication and presentation (10%)"
    ],
    resources: [
      {
        name: "Client Brief - Sustainable Fashion Brand",
        url: "#",
        type: "document"
      },
      {
        name: "Budget Planning Template",
        url: "#",
        type: "spreadsheet"
      }
    ]
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const startChallenge = () => {
    setChallengeStarted(true);
    setCurrentStep(2);
    // In real app, this would start the timer
  };

  const submitChallenge = () => {
    setChallengeSubmitted(true);
    // In real app, this would submit to API
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "document": return <FileText className="w-4 h-4" />;
      case "spreadsheet": return <FileText className="w-4 h-4" />;
      case "presentation": return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  if (challengeSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-2xl w-full mx-4">
          <CardContent className="text-center py-12">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Challenge Submitted!</h1>
            <p className="text-lg text-gray-600 mb-6">
              Your company challenge for <strong>{challengeData.jobTitle}</strong> at <strong>{challengeData.company.name}</strong> has been successfully submitted.
            </p>
            <div className="bg-purple-50 p-6 rounded-lg mb-6">
              <h3 className="font-semibold text-purple-900 mb-3">What happens next?</h3>
              <div className="space-y-2 text-sm text-purple-800">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>Your submission will be reviewed by {challengeData.reviewedBy}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Review typically takes 3-5 business days</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>You'll receive detailed feedback regardless of outcome</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>If successful, they'll contact you directly for interview</span>
                </div>
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => window.location.href = '/applications'}>
                View Applications
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/job-recommendations'}>
                Browse More Jobs
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => window.location.href = '/applications'}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Applications
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Company Challenge</h1>
                <p className="text-gray-600">{challengeData.jobTitle} at {challengeData.company.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="bg-purple-100 text-purple-800">
                <Trophy className="w-3 h-3 mr-1" />
                Premium Challenge
              </Badge>
              {challengeStarted && (
                <div className="text-right">
                  <div className="text-lg font-bold text-orange-600">{timeRemaining}</div>
                  <div className="text-xs text-gray-600">Time Remaining</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        {challengeStarted && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Step {currentStep} of 3: {currentStep === 2 ? "Working on Challenge" : "Submit Your Work"}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round((currentStep / 3) * 100)}% Complete
              </span>
            </div>
            <Progress value={(currentStep / 3) * 100} className="h-2" />
          </div>
        )}

        {/* Step 1: Challenge Overview */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Challenge Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <img
                    src={challengeData.company.logo}
                    alt={`${challengeData.company.name} logo`}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{challengeData.title}</h2>
                    <div className="flex items-center gap-4 text-gray-600 mb-4">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {challengeData.company.name}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{challengeData.company.rating}</span>
                      </div>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {challengeData.timeLimit} to complete
                      </span>
                    </div>
                    <p className="text-gray-700">{challengeData.description}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Challenge Instructions</h3>
                    <ol className="space-y-2">
                      {challengeData.instructions.map((instruction, index) => (
                        <li key={index} className="text-gray-600 flex items-start gap-2">
                          <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center justify-center font-medium">
                            {index + 1}
                          </span>
                          {instruction}
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Required Deliverables</h3>
                    <ul className="space-y-2">
                      {challengeData.deliverables.map((deliverable, index) => (
                        <li key={index} className="text-gray-600 flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {deliverable}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Evaluation Criteria</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {challengeData.evaluationCriteria.map((criteria, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-gray-700 text-sm">{criteria}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {challengeData.resources && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    Challenge Resources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {challengeData.resources.map((resource, index) => (
                      <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colours">
                        <div className="flex items-center gap-3">
                          {getFileIcon(resource.type)}
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{resource.name}</h4>
                            <p className="text-sm text-gray-600 capitalize">{resource.type}</p>
                          </div>
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Important:</strong> Download all resources before starting the challenge. 
                      You'll have {challengeData.timeLimit} to complete once you begin.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 justify-center mb-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                      <h3 className="font-semibold text-yellow-900">Ready to Start?</h3>
                    </div>
                    <p className="text-sm text-yellow-800">
                      Once you start the challenge, you'll have exactly {challengeData.timeLimit} to complete it. 
                      Make sure you have sufficient time and have downloaded all resources.
                    </p>
                  </div>
                  <Button 
                    onClick={startChallenge}
                    size="lg"
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Start Challenge
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Working on Challenge */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                {challengeData.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-900 mb-2">Challenge in Progress</h3>
                <p className="text-sm text-purple-800">
                  You have {timeRemaining} remaining. Work on your deliverables and submit when ready.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Quick Reference - Deliverables</h3>
                <div className="grid gap-2">
                  {challengeData.deliverables.map((deliverable, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      {deliverable}
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">
                  Work on your challenge using your preferred tools, then submit your completed work.
                </p>
                <Button onClick={() => setCurrentStep(3)}>
                  Ready to Submit
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Submit Work */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Submit Your Work
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Upload Files</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      Upload your presentation, spreadsheet, and any other deliverables
                    </p>
                    <Input
                      type="file"
                      multiple
                      accept=".pdf,.ppt,.pptx,.xlsx,.xls,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <Button variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
                      Choose Files
                    </Button>
                  </div>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="font-medium text-gray-900">Uploaded Files:</h4>
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">{file.name}</span>
                          <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(1)} MB)</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Summary & Reflection</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Briefly summarize your approach and key decisions (optional but recommended)
                </p>
                <Textarea
                  placeholder="Example: I focused on digital channels for Gen Z targeting, allocated 60% to social media based on audience research, and prioritized sustainability messaging to align with brand values..."
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Submission Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Challenge:</span>
                    <span className="font-medium">{challengeData.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Files Uploaded:</span>
                    <span className="font-medium">{uploadedFiles.length} files</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Submitted to:</span>
                    <span className="font-medium">{challengeData.reviewedBy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time Used:</span>
                    <span className="font-medium">{challengeData.timeLimit} - {timeRemaining} = 13 minutes</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(2)}>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back to Challenge
                </Button>
                <Button 
                  onClick={submitChallenge}
                  disabled={uploadedFiles.length === 0}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Submit Challenge
                  <CheckCircle2 className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}