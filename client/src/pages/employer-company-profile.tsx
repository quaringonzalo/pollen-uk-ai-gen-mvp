import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { 
  Building2, 
  MapPin, 
  Users, 
  Globe, 
  Calendar,
  Phone,
  Mail,
  Edit,
  Settings,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  ExternalLink
} from "lucide-react";

interface EmployerProfile {
  id: number;
  userId: number;
  companyName: string;
  industry: string;
  companySize: string;
  location: string;
  website: string;
  about: string;
  mission: string;
  values: string[];
  culture: string;
  workEnvironment: string;
  diversityCommitment: string;
  benefits: string[];
  perks: string[];
  contactEmail: string;
  contactPhone: string;
  linkedinPage?: string;
  foundedYear: string;
  remotePolicy: string;
  careersPage?: string;
  techStack: string[];
  logoUrl?: string;
  coverImageUrl?: string;
  companyPhotos: string[];
  isComplete: boolean;
  completionPercentage: number;
}

export default function EmployerCompanyProfile() {
  const [, setLocation] = useLocation();

  const { data: profile, isLoading } = useQuery<EmployerProfile>({
    queryKey: ['/api/employer-profile/current'],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2" style={{fontFamily: 'Sora'}}>
              No Company Profile Found
            </h3>
            <p className="text-gray-600 mb-4" style={{fontFamily: 'Poppins'}}>
              Create your company profile to start attracting top talent.
            </p>
            <Button 
              onClick={() => setLocation("/employer-profile-setup")}
              className="bg-pink-600 hover:bg-pink-700"
              style={{fontFamily: 'Sora'}}
            >
              Create Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const completionStatus = profile.completionPercentage >= 80 ? 'complete' : 
                          profile.completionPercentage >= 50 ? 'in-progress' : 'incomplete';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Cover Image */}
      <div className="relative h-48 bg-gradient-to-r from-pink-600 to-yellow-400">
        {profile.coverImageUrl && (
          <img 
            src={profile.coverImageUrl} 
            alt={`${profile.companyName} cover`}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Profile Header Content */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-end justify-between">
            <div className="flex items-end gap-4">
              <div className="w-20 h-20 bg-white rounded-lg shadow-lg flex items-center justify-center">
                {profile.logoUrl ? (
                  <img 
                    src={profile.logoUrl} 
                    alt={`${profile.companyName} logo`}
                    className="w-16 h-16 object-contain rounded"
                  />
                ) : (
                  <Building2 className="w-10 h-10 text-gray-600" />
                )}
              </div>
              <div className="text-white">
                <h1 className="text-2xl font-bold" style={{fontFamily: 'Sora'}}>
                  {profile.companyName}
                </h1>
                <p className="text-white/90" style={{fontFamily: 'Poppins'}}>
                  {profile.industry} • {profile.companySize}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => setLocation("/employer-profile-setup")}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                style={{fontFamily: 'Sora'}}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Completion Status */}
            {completionStatus !== 'complete' && (
              <Card className="border-l-4 border-l-pink-600">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-pink-600 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900" style={{fontFamily: 'Sora'}}>
                          Complete Your Profile
                        </h3>
                        <p className="text-gray-600 text-sm mt-1" style={{fontFamily: 'Poppins'}}>
                          Your profile is {profile.completionPercentage}% complete. 
                          Finish your setup to attract more qualified candidates.
                        </p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => setLocation("/employer-profile-checkpoints")}
                      className="bg-pink-600 hover:bg-pink-700"
                      style={{fontFamily: 'Sora'}}
                    >
                      Continue Setup
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle style={{fontFamily: 'Sora'}}>About {profile.companyName}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed" style={{fontFamily: 'Poppins'}}>
                  {profile.about}
                </p>
                {profile.mission && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2" style={{fontFamily: 'Sora'}}>Our Mission</h4>
                    <p className="text-gray-700" style={{fontFamily: 'Poppins'}}>
                      {profile.mission}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Company Values */}
            {profile.values && profile.values.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle style={{fontFamily: 'Sora'}}>Our Values</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profile.values.map((value, index) => (
                      <Badge 
                        key={index} 
                        variant="outline"
                        className="bg-pink-50 text-pink-700 border-pink-200"
                      >
                        {value}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Work Environment */}
            {profile.workEnvironment && (
              <Card>
                <CardHeader>
                  <CardTitle style={{fontFamily: 'Sora'}}>Work Environment</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700" style={{fontFamily: 'Poppins'}}>
                    {profile.workEnvironment}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Benefits & Perks */}
            {(profile.benefits?.length > 0 || profile.perks?.length > 0) && (
              <Card>
                <CardHeader>
                  <CardTitle style={{fontFamily: 'Sora'}}>Benefits & Perks</CardTitle>
                </CardHeader>
                <CardContent>
                  {profile.benefits && profile.benefits.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2" style={{fontFamily: 'Sora'}}>Benefits</h4>
                      <div className="flex flex-wrap gap-2">
                        {profile.benefits.map((benefit, index) => (
                          <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {profile.perks && profile.perks.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2" style={{fontFamily: 'Sora'}}>Perks</h4>
                      <div className="flex flex-wrap gap-2">
                        {profile.perks.map((perk, index) => (
                          <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {perk}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Details */}
            <Card>
              <CardHeader>
                <CardTitle style={{fontFamily: 'Sora'}}>Company Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span style={{fontFamily: 'Poppins'}}>{profile.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span style={{fontFamily: 'Poppins'}}>{profile.companySize}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span style={{fontFamily: 'Poppins'}}>Founded {profile.foundedYear}</span>
                </div>
                {profile.website && (
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <a 
                      href={profile.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-pink-600 hover:text-pink-700 flex items-center gap-1"
                      style={{fontFamily: 'Poppins'}}
                    >
                      Company Website
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
                {profile.remotePolicy && (
                  <div className="flex items-center gap-2 text-sm">
                    <Settings className="w-4 h-4 text-gray-500" />
                    <span style={{fontFamily: 'Poppins'}}>{profile.remotePolicy}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle style={{fontFamily: 'Sora'}}>Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <a 
                    href={`mailto:${profile.contactEmail}`}
                    className="text-pink-600 hover:text-pink-700"
                    style={{fontFamily: 'Poppins'}}
                  >
                    {profile.contactEmail}
                  </a>
                </div>
                {profile.contactPhone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <a 
                      href={`tel:${profile.contactPhone}`}
                      className="text-pink-600 hover:text-pink-700"
                      style={{fontFamily: 'Poppins'}}
                    >
                      {profile.contactPhone}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle style={{fontFamily: 'Sora'}}>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => setLocation("/employer-profile-checkpoints")}
                  variant="outline" 
                  className="w-full justify-start"
                  style={{fontFamily: 'Sora'}}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Continue Profile Setup
                </Button>
                <Button 
                  onClick={() => setLocation("/employer-photos")}
                  variant="outline" 
                  className="w-full justify-start"
                  style={{fontFamily: 'Sora'}}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Add Photos
                </Button>
                <Button 
                  onClick={() => setLocation("/employer-testimonials")}
                  variant="outline" 
                  className="w-full justify-start"
                  style={{fontFamily: 'Sora'}}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Manage Testimonials
                </Button>
              </CardContent>
            </Card>

            {/* Profile Status */}
            <Card>
              <CardHeader>
                <CardTitle style={{fontFamily: 'Sora'}}>Profile Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-2">
                  {completionStatus === 'complete' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                  )}
                  <span className="font-medium" style={{fontFamily: 'Sora'}}>
                    {profile.completionPercentage}% Complete
                  </span>
                </div>
                <p className="text-sm text-gray-600" style={{fontFamily: 'Poppins'}}>
                  {completionStatus === 'complete' 
                    ? "Your profile is complete and ready to attract candidates."
                    : "Complete your profile to increase visibility to job seekers."
                  }
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}