import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Building2, Users, Star, Clock, CheckCircle, AlertTriangle, 
  Eye, MessageSquare, Award, TrendingUp, MapPin, Globe,
  Calendar, Phone, Mail, ExternalLink, Edit, Save, X
} from "lucide-react";

interface CompanyProfile {
  id: number;
  companyName: string;
  industry: string;
  location: string;
  website: string;
  about: string;
  culture: string;
  benefits: string[];
  logo: string;
  contactEmail: string;
  createdAt: string;
  observationsCompleted: boolean;
  overallRating: number;
  cultureRating: number;
  benefitsRating: number;
  managementRating: number;
  glassdoorRating: number;
  glassdoorUrl: string;
  pollenObservations: string;
  workLifeBalance: number;
  careerGrowth: number;
  compensationRating: number;
  diversityScore: number;
  innovationScore: number;
  stabilityScore: number;
}

interface CompanyObservations {
  overallRating: number;
  cultureRating: number;
  benefitsRating: number;
  managementRating: number;
  workLifeBalance: number;
  careerGrowth: number;
  compensationRating: number;
  diversityScore: number;
  innovationScore: number;
  stabilityScore: number;
  pollenObservations: string;
  glassdoorRating: number;
  glassdoorUrl: string;
}

export default function AdminCompanyReviews() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCompany, setSelectedCompany] = useState<CompanyProfile | null>(null);
  const [editingObservations, setEditingObservations] = useState(false);
  const [observationsData, setObservationsData] = useState<CompanyObservations>({
    overallRating: 0,
    cultureRating: 0,
    benefitsRating: 0,
    managementRating: 0,
    workLifeBalance: 0,
    careerGrowth: 0,
    compensationRating: 0,
    diversityScore: 0,
    innovationScore: 0,
    stabilityScore: 0,
    pollenObservations: "",
    glassdoorRating: 0,
    glassdoorUrl: ""
  });

  // Fetch companies needing review
  const { data: companies, isLoading } = useQuery({
    queryKey: ["/api/admin/companies-needing-review"],
  });

  // Fetch company details
  const { data: companyDetails } = useQuery({
    queryKey: ["/api/admin/companies", selectedCompany?.id],
    enabled: !!selectedCompany?.id,
  });

  // Submit observations mutation
  const submitObservationsMutation = useMutation({
    mutationFn: async (data: CompanyObservations & { companyId: number }) => {
      return await apiRequest(`/api/admin/companies/${data.companyId}/observations`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: "Observations Saved",
        description: "Company observations have been updated successfully.",
      });
      setEditingObservations(false);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/companies-needing-review"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/companies", selectedCompany?.id] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save observations. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleEditObservations = (company: CompanyProfile) => {
    setSelectedCompany(company);
    setObservationsData({
      overallRating: company.overallRating || 0,
      cultureRating: company.cultureRating || 0,
      benefitsRating: company.benefitsRating || 0,
      managementRating: company.managementRating || 0,
      workLifeBalance: company.workLifeBalance || 0,
      careerGrowth: company.careerGrowth || 0,
      compensationRating: company.compensationRating || 0,
      diversityScore: company.diversityScore || 0,
      innovationScore: company.innovationScore || 0,
      stabilityScore: company.stabilityScore || 0,
      pollenObservations: company.pollenObservations || "",
      glassdoorRating: company.glassdoorRating || 0,
      glassdoorUrl: company.glassdoorUrl || ""
    });
    setEditingObservations(true);
  };

  const handleSaveObservations = () => {
    if (!selectedCompany) return;
    
    submitObservationsMutation.mutate({
      ...observationsData,
      companyId: selectedCompany.id
    });
  };

  const RatingInput = ({ label, value, onChange }: { 
    label: string; 
    value: number; 
    onChange: (value: number) => void; 
  }) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            onClick={() => onChange(rating)}
            className={`w-8 h-8 rounded-full border-2 transition-colours ${
              value >= rating 
                ? 'bg-yellow-400 border-yellow-500 text-white' 
                : 'border-gray-300 hover:border-yellow-400'
            }`}
          >
            <Star className={`w-4 h-4 mx-auto ${value >= rating ? 'fill-current' : ''}`} />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">{value}/5</span>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading companies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Company Review Portal</h1>
          <p className="text-gray-600">
            Complete observations and ratings for companies that have set up their profiles
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Companies List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  Companies Needing Review
                  {companies && (
                    <Badge variant="secondary" className="ml-auto">
                      {companies.filter((c: CompanyProfile) => !c.observationsCompleted).length}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {companies?.map((company: CompanyProfile) => (
                  <div
                    key={company.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colours ${
                      selectedCompany?.id === company.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedCompany(company)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{company.companyName}</h3>
                        <p className="text-sm text-gray-600">{company.industry}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {company.location}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {company.observationsCompleted ? (
                          <Badge variant="default" className="bg-green-600">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Complete
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <Clock className="w-3 h-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                        <span className="text-xs text-gray-500">
                          {new Date(company.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {companies?.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No companies need review at this time</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Company Details & Review Form */}
          <div className="lg:col-span-2">
            {selectedCompany ? (
              <div className="space-y-6">
                {/* Company Overview */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="w-5 h-5" />
                        {selectedCompany.companyName}
                      </CardTitle>
                      <div className="flex gap-2">
                        {selectedCompany.website && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={selectedCompany.website} target="_blank" rel="noopener noreferrer">
                              <Globe className="w-4 h-4 mr-1" />
                              Website
                            </a>
                          </Button>
                        )}
                        <Button 
                          variant={editingObservations ? "secondary" : "default"}
                          size="sm"
                          onClick={() => editingObservations ? setEditingObservations(false) : handleEditObservations(selectedCompany)}
                        >
                          {editingObservations ? (
                            <>
                              <X className="w-4 h-4 mr-1" />
                              Cancel
                            </>
                          ) : (
                            <>
                              <Edit className="w-4 h-4 mr-1" />
                              {selectedCompany.observationsCompleted ? 'Edit Review' : 'Add Review'}
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2">Company Info</h4>
                        <div className="space-y-2 text-sm">
                          <p><span className="font-medium">Industry:</span> {selectedCompany.industry}</p>
                          <p><span className="font-medium">Location:</span> {selectedCompany.location}</p>
                          <p><span className="font-medium">Contact:</span> {selectedCompany.contactEmail}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Current Ratings</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Overall Rating:</span>
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              {selectedCompany.overallRating || 'Not rated'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Culture:</span>
                            <span>{selectedCompany.cultureRating || 'Not rated'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Benefits:</span>
                            <span>{selectedCompany.benefitsRating || 'Not rated'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {selectedCompany.about && (
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">About</h4>
                        <p className="text-sm text-gray-700">{selectedCompany.about}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Review Form */}
                {editingObservations && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Star className="w-5 h-5" />
                        Company Observations & Ratings
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="ratings" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="ratings">Ratings</TabsTrigger>
                          <TabsTrigger value="observations">Observations</TabsTrigger>
                        </TabsList>

                        <TabsContent value="ratings" className="space-y-6">
                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <RatingInput
                                label="Overall Rating"
                                value={observationsData.overallRating}
                                onChange={(value) => setObservationsData(prev => ({ ...prev, overallRating: value }))}
                              />
                              <RatingInput
                                label="Company Culture"
                                value={observationsData.cultureRating}
                                onChange={(value) => setObservationsData(prev => ({ ...prev, cultureRating: value }))}
                              />
                              <RatingInput
                                label="Benefits & Perks"
                                value={observationsData.benefitsRating}
                                onChange={(value) => setObservationsData(prev => ({ ...prev, benefitsRating: value }))}
                              />
                              <RatingInput
                                label="Management Quality"
                                value={observationsData.managementRating}
                                onChange={(value) => setObservationsData(prev => ({ ...prev, managementRating: value }))}
                              />
                              <RatingInput
                                label="Work-Life Balance"
                                value={observationsData.workLifeBalance}
                                onChange={(value) => setObservationsData(prev => ({ ...prev, workLifeBalance: value }))}
                              />
                            </div>
                            <div className="space-y-4">
                              <RatingInput
                                label="Career Growth"
                                value={observationsData.careerGrowth}
                                onChange={(value) => setObservationsData(prev => ({ ...prev, careerGrowth: value }))}
                              />
                              <RatingInput
                                label="Compensation"
                                value={observationsData.compensationRating}
                                onChange={(value) => setObservationsData(prev => ({ ...prev, compensationRating: value }))}
                              />
                              <RatingInput
                                label="Diversity & Inclusion"
                                value={observationsData.diversityScore}
                                onChange={(value) => setObservationsData(prev => ({ ...prev, diversityScore: value }))}
                              />
                              <RatingInput
                                label="Innovation"
                                value={observationsData.innovationScore}
                                onChange={(value) => setObservationsData(prev => ({ ...prev, innovationScore: value }))}
                              />
                              <RatingInput
                                label="Job Security"
                                value={observationsData.stabilityScore}
                                onChange={(value) => setObservationsData(prev => ({ ...prev, stabilityScore: value }))}
                              />
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                            <div>
                              <Label htmlFor="glassdoorRating">Glassdoor Rating</Label>
                              <Input
                                id="glassdoorRating"
                                type="number"
                                min="1"
                                max="5"
                                step="0.1"
                                value={observationsData.glassdoorRating}
                                onChange={(e) => setObservationsData(prev => ({ 
                                  ...prev, 
                                  glassdoorRating: parseFloat(e.target.value) || 0 
                                }))}
                                placeholder="4.2"
                              />
                            </div>
                            <div>
                              <Label htmlFor="glassdoorUrl">Glassdoor URL</Label>
                              <Input
                                id="glassdoorUrl"
                                value={observationsData.glassdoorUrl}
                                onChange={(e) => setObservationsData(prev => ({ 
                                  ...prev, 
                                  glassdoorUrl: e.target.value 
                                }))}
                                placeholder="https://glassdoor.com/company/..."
                              />
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="observations" className="space-y-4">
                          <div>
                            <Label htmlFor="observations">Pollen Team Observations</Label>
                            <Textarea
                              id="observations"
                              value={observationsData.pollenObservations}
                              onChange={(e) => setObservationsData(prev => ({ 
                                ...prev, 
                                pollenObservations: e.target.value 
                              }))}
                              placeholder="Add detailed observations about the company culture, work environment, management style, growth opportunities, and any other insights that would help job seekers understand what it's like to work there..."
                              rows={8}
                            />
                          </div>
                        </TabsContent>
                      </Tabs>

                      <div className="flex justify-end gap-4 pt-6 border-t">
                        <Button 
                          variant="outline"
                          onClick={() => setEditingObservations(false)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleSaveObservations}
                          disabled={submitObservationsMutation.isPending}
                        >
                          {submitObservationsMutation.isPending ? (
                            "Saving..."
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              Save Observations
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Eye className="w-12 h-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Company</h3>
                  <p className="text-gray-600 text-center">
                    Choose a company from the list to view details and complete observations
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}