import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, GraduationCap, Users, Briefcase, Trash2, Building2, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Programme {
  id: string;
  name: string;
  type: "internship" | "graduate" | "apprenticeship" | "development" | "mentorship";
  duration: string;
  description: string;
  eligibility: string;
  benefits: string[];
  applicationPeriod: string;
  active: boolean;
}

const programmeTypes = [
  { value: "internship", label: "Internship Programme" },
  { value: "graduate", label: "Graduate Programme" },
  { value: "apprenticeship", label: "Apprenticeship Scheme" },
  { value: "development", label: "Development Programme" },
  { value: "mentorship", label: "Mentorship Programme" }
];

export default function EmployerProgrammes() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [programmes, setProgrammes] = useState<Programme[]>([
    {
      id: "1",
      name: "Summer Internship Programme",
      type: "internship",
      duration: "3 months",
      description: "A comprehensive internship experience offering hands-on learning across different departments",
      eligibility: "Current university students in their penultimate year",
      benefits: ["Mentorship", "Real project work", "Networking opportunities", "Potential graduate offer"],
      applicationPeriod: "January - March",
      active: true
    }
  ]);

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newProgramme, setNewProgramme] = useState({
    name: "",
    type: "internship" as const,
    duration: "",
    description: "",
    eligibility: "",
    benefits: [""],
    applicationPeriod: "",
    active: true
  });

  const handleAddProgramme = () => {
    if (!newProgramme.name || !newProgramme.description || !newProgramme.eligibility) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const programme: Programme = {
      id: Date.now().toString(),
      ...newProgramme,
      benefits: newProgramme.benefits.filter(b => b.trim() !== "")
    };

    setProgrammes([...programmes, programme]);
    setNewProgramme({
      name: "",
      type: "internship",
      duration: "",
      description: "",
      eligibility: "",
      benefits: [""],
      applicationPeriod: "",
      active: true
    });
    setIsAddingNew(false);

    toast({
      title: "Programme Added",
      description: "The programme has been added to your company profile"
    });
  };

  const handleDeleteProgramme = (id: string) => {
    setProgrammes(programmes.filter(p => p.id !== id));
    toast({
      title: "Programme Removed",
      description: "The programme has been removed from your profile"
    });
  };

  const toggleProgrammeStatus = (id: string) => {
    setProgrammes(programmes.map(p => 
      p.id === id ? { ...p, active: !p.active } : p
    ));
  };

  const updateBenefit = (index: number, value: string) => {
    const newBenefits = [...newProgramme.benefits];
    newBenefits[index] = value;
    setNewProgramme({ ...newProgramme, benefits: newBenefits });
  };

  const addBenefit = () => {
    setNewProgramme({ ...newProgramme, benefits: [...newProgramme.benefits, ""] });
  };

  const removeBenefit = (index: number) => {
    const newBenefits = newProgramme.benefits.filter((_, i) => i !== index);
    setNewProgramme({ ...newProgramme, benefits: newBenefits });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "internship":
        return <Clock className="w-5 h-5" />;
      case "graduate":
        return <GraduationCap className="w-5 h-5" />;
      case "apprenticeship":
        return <Building2 className="w-5 h-5" />;
      case "development":
        return <Users className="w-5 h-5" />;
      case "mentorship":
        return <Users className="w-5 h-5" />;
      default:
        return <Briefcase className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "internship":
        return "bg-blue-100 text-blue-800";
      case "graduate":
        return "bg-purple-100 text-purple-800";
      case "apprenticeship":
        return "bg-green-100 text-green-800";
      case "development":
        return "bg-orange-100 text-orange-800";
      case "mentorship":
        return "bg-pink-100 text-pink-800";
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
                <h1 className="text-2xl font-bold" style={{fontFamily: 'Sora'}}>Entry-Level Programmes</h1>
                <p className="text-gray-600" style={{fontFamily: 'Poppins'}}>
                  Showcase your internships, graduate schemes, and development programmes
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
              <GraduationCap className="w-5 h-5 text-pink-600" />
              Manage Entry-Level Programmes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4" style={{fontFamily: 'Poppins'}}>
              Highlight your commitment to developing early talent by showcasing structured programmes 
              for interns, graduates, and apprentices. This helps attract motivated entry-level candidates.
            </p>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-green-800" style={{fontFamily: 'Poppins'}}>
                <strong>Benefits:</strong> Companies with structured entry-level programmes receive 40% more applications 
                from high-quality candidates seeking career development opportunities.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Add New Programme */}
        {!isAddingNew ? (
          <Card className="mb-8">
            <CardContent className="p-6">
              <Button 
                onClick={() => setIsAddingNew(true)}
                className="w-full bg-pink-600 hover:bg-pink-700"
                style={{fontFamily: 'Sora'}}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Programme
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle style={{fontFamily: 'Sora'}}>Add New Programme</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Programme Name *</Label>
                  <Input
                    id="name"
                    value={newProgramme.name}
                    onChange={(e) => setNewProgramme({...newProgramme, name: e.target.value})}
                    placeholder="e.g. Summer Internship Programme"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Programme Type</Label>
                  <Select value={newProgramme.type} onValueChange={(value: any) => setNewProgramme({...newProgramme, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {programmeTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={newProgramme.duration}
                    onChange={(e) => setNewProgramme({...newProgramme, duration: e.target.value})}
                    placeholder="e.g. 3 months, 12 months"
                  />
                </div>
                <div>
                  <Label htmlFor="applicationPeriod">Application Period</Label>
                  <Input
                    id="applicationPeriod"
                    value={newProgramme.applicationPeriod}
                    onChange={(e) => setNewProgramme({...newProgramme, applicationPeriod: e.target.value})}
                    placeholder="e.g. January - March"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Programme Description *</Label>
                <Textarea
                  id="description"
                  value={newProgramme.description}
                  onChange={(e) => setNewProgramme({...newProgramme, description: e.target.value})}
                  placeholder="Describe what the programme offers and what participants will learn..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="eligibility">Eligibility Criteria *</Label>
                <Textarea
                  id="eligibility"
                  value={newProgramme.eligibility}
                  onChange={(e) => setNewProgramme({...newProgramme, eligibility: e.target.value})}
                  placeholder="Who can apply for this programme? Include education requirements, experience level, etc."
                  rows={2}
                />
              </div>

              <div>
                <Label>Programme Benefits</Label>
                <div className="space-y-2">
                  {newProgramme.benefits.map((benefit, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={benefit}
                        onChange={(e) => updateBenefit(index, e.target.value)}
                        placeholder="e.g. Mentorship, Training, Networking"
                      />
                      {newProgramme.benefits.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeBenefit(index)}
                          className="px-3"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addBenefit}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Benefit
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={handleAddProgramme}
                  className="bg-pink-600 hover:bg-pink-700"
                  style={{fontFamily: 'Sora'}}
                >
                  Add Programme
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

        {/* Existing Programmes */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold" style={{fontFamily: 'Sora'}}>
            Current Programmes ({programmes.length})
          </h3>
          
          {programmes.map((programme) => (
            <Card key={programme.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${getTypeColor(programme.type)}`}>
                      {getTypeIcon(programme.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-lg" style={{fontFamily: 'Sora'}}>{programme.name}</h4>
                        <Badge className={programme.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                          {programme.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <span><strong>Duration:</strong> {programme.duration}</span>
                        <span><strong>Applications:</strong> {programme.applicationPeriod}</span>
                      </div>
                      <p className="text-gray-700 mb-3" style={{fontFamily: 'Poppins'}}>
                        {programme.description}
                      </p>
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-900 mb-1">Eligibility:</p>
                        <p className="text-sm text-gray-600">{programme.eligibility}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-1">Benefits:</p>
                        <div className="flex flex-wrap gap-1">
                          {programme.benefits.map((benefit, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {benefit}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleProgrammeStatus(programme.id)}
                      style={{fontFamily: 'Sora'}}
                    >
                      {programme.active ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteProgramme(programme.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {programmes.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="font-medium text-gray-900 mb-2" style={{fontFamily: 'Sora'}}>No programmes added yet</h4>
                <p className="text-gray-600 mb-4" style={{fontFamily: 'Poppins'}}>
                  Start attracting top early talent by showcasing your structured development programmes.
                </p>
                <Button 
                  onClick={() => setIsAddingNew(true)}
                  variant="outline"
                  style={{fontFamily: 'Sora'}}
                >
                  Add Your First Programme
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}