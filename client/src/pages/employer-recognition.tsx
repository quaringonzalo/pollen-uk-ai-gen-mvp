import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, Award, Trophy, Star, Trash2, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Recognition {
  id: string;
  title: string;
  organization: string;
  year: string;
  type: "award" | "certification" | "ranking" | "accreditation";
  description: string;
  link?: string;
  verified: boolean;
}

const recognitionTypes = [
  { value: "award", label: "Award" },
  { value: "certification", label: "Certification" },
  { value: "ranking", label: "Industry Ranking" },
  { value: "accreditation", label: "Professional Accreditation" }
];

export default function EmployerRecognition() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [recognitions, setRecognitions] = useState<Recognition[]>([
    {
      id: "1",
      title: "Best Places to Work 2024",
      organization: "Great Place to Work UK",
      year: "2024",
      type: "award",
      description: "Recognised for outstanding employee satisfaction and workplace culture",
      link: "https://example.com/award",
      verified: true
    }
  ]);

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newRecognition, setNewRecognition] = useState({
    title: "",
    organization: "",
    year: new Date().getFullYear().toString(),
    type: "award" as const,
    description: "",
    link: ""
  });

  const handleAddRecognition = () => {
    if (!newRecognition.title || !newRecognition.organization || !newRecognition.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const recognition: Recognition = {
      id: Date.now().toString(),
      ...newRecognition,
      verified: false
    };

    setRecognitions([...recognitions, recognition]);
    setNewRecognition({
      title: "",
      organization: "",
      year: new Date().getFullYear().toString(),
      type: "award",
      description: "",
      link: ""
    });
    setIsAddingNew(false);

    toast({
      title: "Recognition Added",
      description: "The recognition has been added and will be reviewed by our team"
    });
  };

  const handleDeleteRecognition = (id: string) => {
    setRecognitions(recognitions.filter(r => r.id !== id));
    toast({
      title: "Recognition Removed",
      description: "The recognition has been removed from your profile"
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "award":
        return <Award className="w-5 h-5" />;
      case "certification":
        return <Star className="w-5 h-5" />;
      case "ranking":
        return <Trophy className="w-5 h-5" />;
      case "accreditation":
        return <Award className="w-5 h-5" />;
      default:
        return <Award className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "award":
        return "bg-yellow-100 text-yellow-800";
      case "certification":
        return "bg-blue-100 text-blue-800";
      case "ranking":
        return "bg-purple-100 text-purple-800";
      case "accreditation":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => setLocation("/employer-profile-setup")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Profile Setup
              </Button>
              <div>
                <h1 className="text-2xl font-bold" style={{fontFamily: 'Sora'}}>Company Recognition</h1>
                <p className="text-gray-600" style={{fontFamily: 'Poppins'}}>
                  Showcase awards, certifications, and industry recognition
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Overview Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{fontFamily: 'Sora'}}>
              <Award className="w-5 h-5 text-pink-600" />
              Manage Recognition & Awards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4" style={{fontFamily: 'Poppins'}}>
              Add awards, certifications, industry rankings, and other forms of recognition to build credibility 
              and show job seekers that your company is a trusted and reputable employer.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800" style={{fontFamily: 'Poppins'}}>
                <strong>Tip:</strong> Include links to verification pages where possible. This helps build trust with potential candidates.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Add New Recognition */}
        {!isAddingNew ? (
          <Card className="mb-8">
            <CardContent className="p-6">
              <Button 
                onClick={() => setIsAddingNew(true)}
                className="w-full bg-pink-600 hover:bg-pink-700"
                style={{fontFamily: 'Sora'}}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Recognition
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle style={{fontFamily: 'Sora'}}>Add New Recognition</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Recognition Title *</Label>
                  <Input
                    id="title"
                    value={newRecognition.title}
                    onChange={(e) => setNewRecognition({...newRecognition, title: e.target.value})}
                    placeholder="e.g. Best Places to Work 2024"
                  />
                </div>
                <div>
                  <Label htmlFor="organization">Issuing Organisation *</Label>
                  <Input
                    id="organization"
                    value={newRecognition.organization}
                    onChange={(e) => setNewRecognition({...newRecognition, organization: e.target.value})}
                    placeholder="e.g. Great Place to Work UK"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Recognition Type</Label>
                  <Select value={newRecognition.type} onValueChange={(value: any) => setNewRecognition({...newRecognition, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {recognitionTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="year">Year Received</Label>
                  <Input
                    id="year"
                    value={newRecognition.year}
                    onChange={(e) => setNewRecognition({...newRecognition, year: e.target.value})}
                    placeholder="2024"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={newRecognition.description}
                  onChange={(e) => setNewRecognition({...newRecognition, description: e.target.value})}
                  placeholder="Brief description of what this recognition represents..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="link">Verification Link (Optional)</Label>
                <Input
                  id="link"
                  value={newRecognition.link}
                  onChange={(e) => setNewRecognition({...newRecognition, link: e.target.value})}
                  placeholder="https://example.com/award-verification"
                />
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={handleAddRecognition}
                  className="bg-pink-600 hover:bg-pink-700"
                  style={{fontFamily: 'Sora'}}
                >
                  Add Recognition
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setIsAddingNew(false)}
                  style={{fontFamily: 'Sora'}}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Existing Recognition */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold" style={{fontFamily: 'Sora'}}>
            Current Recognition ({recognitions.length})
          </h3>
          
          {recognitions.map((recognition) => (
            <Card key={recognition.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${getTypeColor(recognition.type)}`}>
                      {getTypeIcon(recognition.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-lg" style={{fontFamily: 'Sora'}}>{recognition.title}</h4>
                        {recognition.link && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(recognition.link, '_blank')}
                            className="p-1 h-auto"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <p className="text-gray-600 mb-1" style={{fontFamily: 'Poppins'}}>
                        <strong>{recognition.organization}</strong> • {recognition.year}
                      </p>
                      <p className="text-gray-700" style={{fontFamily: 'Poppins'}}>
                        {recognition.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={recognitionTypes.find(t => t.value === recognition.type)?.label ? "bg-gray-100 text-gray-800" : ""}>
                      {recognitionTypes.find(t => t.value === recognition.type)?.label}
                    </Badge>
                    {recognition.verified ? (
                      <Badge className="bg-green-100 text-green-800">Verified</Badge>
                    ) : (
                      <Badge className="bg-yellow-100 text-yellow-800">Under Review</Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteRecognition(recognition.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {recognitions.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="font-medium text-gray-900 mb-2" style={{fontFamily: 'Sora'}}>No recognition added yet</h4>
                <p className="text-gray-600 mb-4" style={{fontFamily: 'Poppins'}}>
                  Showcase your company's awards and recognition to build trust with potential candidates.
                </p>
                <Button 
                  onClick={() => setIsAddingNew(true)}
                  variant="outline"
                  style={{fontFamily: 'Sora'}}
                >
                  Add Your First Recognition
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}