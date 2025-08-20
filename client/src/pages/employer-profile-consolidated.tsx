import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Building, 
  MapPin, 
  Users, 
  Calendar, 
  Globe, 
  Mail, 
  Phone, 
  Linkedin,
  Briefcase,
  Edit,
  Eye,
  Star,
  Quote,
  Award,
  Camera,
  GraduationCap,
  Settings,
  ArrowLeft,
  Clock,
  CheckCircle,
  Plus,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  TrendingUp,
  UserCheck,
  MessageSquare,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  X
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface EmployerProfile {
  id: number;
  userId: number;
  companyName: string;
  industry: string;
  industries?: string[];
  location: string;
  companySize: string;
  foundedYear: number | string;
  benefits?: string[];
  perks?: string[];
  workingModel?: string;
  workingModelTag?: string;
  about?: string;
  description?: string;
  values?: string[];
  benefits?: string[];
  perks?: string[];
  workOptions?: string[];
  workEnvironment?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  completionPercentage: number;
  website?: string;
  contactEmail?: string;
  contactPhone?: string;
  linkedinPage?: string;
  glassdoorUrl?: string;
  careersPage?: string;
  approvalStatus?: 'pending' | 'approved' | 'requires_changes';
  isComplete?: boolean;
  hasUnapprovedChanges?: boolean;
  lastUpdated?: string;
  testimonials?: any[];
  awards?: any[];
  programmes?: any[];
  gallery?: any[];
  companyStatement?: string;
}

export default function EmployerProfileConsolidated() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editedValues, setEditedValues] = useState<any>({});
  const [pendingApproval, setPendingApproval] = useState(false);
  const [showApprovalNotification, setShowApprovalNotification] = useState(false);

  const [selectedReview, setSelectedReview] = useState<{
    author: string;
    position: string;
    rating: number;
    date: string;
    feedbackQuality: number;
    communicationSpeed: number;
    interviewExperience: number;
    processTransparency: number;
  } | null>(null);

  const { data: profile, isLoading, error } = useQuery<EmployerProfile>({
    queryKey: ['/api/employer-profile/current'],
  });

  // Override status based on URL parameter for demo purposes
  const urlParams = new URLSearchParams(window.location.search);
  const statusOverride = urlParams.get('status');
  const modifiedProfile = profile ? {
    ...profile,
    approvalStatus: statusOverride || profile.approvalStatus,
    hasUnapprovedChanges: statusOverride === 'changes_pending' ? true : profile.hasUnapprovedChanges,
    industries: profile.industries || ["Marketing & Advertising", "Creative Services", "Digital Media"]
  } : profile;

  // Determine dynamic status messaging
  const getStatusInfo = () => {
    if (!modifiedProfile) return null;
    
    if (modifiedProfile.approvalStatus === 'pending') {
      return {
        type: 'review',
        icon: Clock,
        title: 'Profile Under Review',
        message: 'Our team will review your profile and it\'s usually approved within 24 hours. You can continue adding enhancements below.',
        bgColor: 'bg-blue-50',
        borderColor: 'border-l-blue-500',
        textColor: 'text-blue-900',
        iconColor: 'text-blue-600'
      };
    }
    
    if (modifiedProfile.hasUnapprovedChanges) {
      return {
        type: 'changes_pending',
        icon: AlertCircle,
        title: 'Changes Pending Approval',
        message: 'Your recent edits are being reviewed and will be live within 24 hours. Your current live profile remains visible to candidates.',
        bgColor: 'bg-orange-50',
        borderColor: 'border-l-orange-500',
        textColor: 'text-orange-900',
        iconColor: 'text-orange-600'
      };
    }
    
    if (modifiedProfile.approvalStatus === 'approved') {
      return {
        type: 'live',
        icon: CheckCircle,
        title: 'Profile Live',
        message: 'Your company profile is live and visible to candidates. Any edits will need approval before going live.',
        bgColor: 'bg-green-50',
        borderColor: 'border-l-green-500',
        textColor: 'text-green-900',
        iconColor: 'text-green-600'
      };
    }
    
    if (modifiedProfile.approvalStatus === 'requires_changes') {
      return {
        type: 'requires_changes',
        icon: AlertCircle,
        title: 'Changes Required',
        message: 'Your profile requires some updates before it can go live. Please review the feedback below and make the necessary changes. Changes usually take effect within 24 hours.',
        bgColor: 'bg-red-50',
        borderColor: 'border-l-red-500',
        textColor: 'text-red-900',
        iconColor: 'text-red-600',
        feedback: 'Hi there! We\'ve reviewed your profile and it looks great overall. However, we need you to update the company description to be more specific about the services you offer and your target clients. Also, please add at least 2-3 employee testimonials to help candidates understand your company culture better. Once these changes are made, we\'ll approve your profile within 24 hours. Thanks! - The Pollen Team'
      };
    }
    
    // Default fallback
    return {
      type: 'review',
      icon: Clock,
      title: 'Profile Under Review',
      message: 'Our team will review your profile and it\'s usually approved within 24 hours. You can continue adding enhancements below.',
      bgColor: 'bg-blue-50',
      borderColor: 'border-l-blue-500',
      textColor: 'text-blue-900',
      iconColor: 'text-blue-600'
    };
  };

  const statusInfo = getStatusInfo();



  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-pink-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !modifiedProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2" style={{fontFamily: 'Sora'}}>Demo Access Required</h3>
          <p className="text-gray-600 mb-4" style={{fontFamily: 'Poppins'}}>
            This is the employer profile management interface. Click below to access the demo.
          </p>
          <Button 
            onClick={async () => {
              try {
                const response = await fetch('/api/demo-login', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  credentials: 'include',
                  body: JSON.stringify({ role: 'employer' })
                });
                if (response.ok) {
                  window.location.reload();
                }
              } catch (err) {
                console.error('Demo login failed:', err);
              }
            }}
            style={{fontFamily: 'Sora'}}
            className="bg-pink-600 hover:bg-pink-700 text-white"
          >
            <Building className="w-4 h-4 mr-2" />
            Access Demo Profile
          </Button>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold" style={{fontFamily: 'Sora'}}>Company Profile</h1>
              <p className="text-gray-600 mt-1" style={{fontFamily: 'Poppins'}}>
                Manage the information shared with our talent community
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline"
                onClick={() => window.open("/company-profile/2", "_blank")}
                style={{fontFamily: 'Sora'}}
              >
                <Eye className="w-4 h-4 mr-2" />
                Public View
              </Button>
              <div className="flex gap-2">
                {/* Development Status Switch (remove in production) */}
                {modifiedProfile.approvalStatus === 'pending' && (
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Simulate status change for demo purposes
                      window.location.href = window.location.href + '?status=approved';
                    }}
                    className="text-xs"
                  >
                    Demo: Set Live
                  </Button>
                )}
                {modifiedProfile.approvalStatus === 'approved' && !modifiedProfile.hasUnapprovedChanges && (
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Simulate status change for demo purposes
                      window.location.href = window.location.href.split('?')[0] + '?status=changes_pending';
                    }}
                    className="text-xs"
                  >
                    Demo: Edit & Pending
                  </Button>
                )}
                {modifiedProfile.hasUnapprovedChanges && (
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Simulate status change for demo purposes
                      window.location.href = window.location.href.split('?')[0] + '?status=approved';
                    }}
                    className="text-xs"
                  >
                    Demo: Approve Changes
                  </Button>
                )}
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Simulate status change for demo purposes
                    window.location.href = window.location.href.split('?')[0] + '?status=requires_changes';
                  }}
                  className="text-xs"
                >
                  Demo: Requires Changes
                </Button>

              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Dynamic Profile Status Banner */}
        {statusInfo && (
          <Card className={`mb-6 border-l-4 ${statusInfo.borderColor} ${statusInfo.bgColor}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <statusInfo.icon className={`w-5 h-5 ${statusInfo.iconColor}`} />
                <div>
                  <h3 className={`font-semibold ${statusInfo.textColor}`} style={{fontFamily: 'Sora'}}>
                    {statusInfo.title}
                  </h3>
                  <p className={`${statusInfo.textColor} text-sm`} style={{fontFamily: 'Poppins'}}>
                    {statusInfo.message}
                  </p>
                  {statusInfo.feedback && (
                    <div className="bg-white border border-red-200 rounded-lg p-4 mt-3">
                      <h4 className="font-semibold text-red-900 mb-2 flex items-center gap-2" style={{fontFamily: 'Sora'}}>
                        <MessageCircle className="w-4 h-4" />
                        Feedback from Pollen Team
                      </h4>
                      <button
                        onClick={() => setLocation('/employer-messages?conversation=pollen-team&feedback=profile-review')}
                        className="text-pink-600 hover:text-pink-700 text-sm underline flex items-center gap-2"
                        style={{fontFamily: 'Poppins'}}
                      >
                        <MessageSquare className="w-4 h-4" />
                        View detailed feedback message
                      </button>
                    </div>
                  )}
                  {modifiedProfile?.lastUpdated && statusInfo.type === 'changes_pending' && (
                    <p className={`${statusInfo.textColor} text-xs mt-1 opacity-75`} style={{fontFamily: 'Poppins'}}>
                      Last updated: {new Date(modifiedProfile.lastUpdated).toLocaleDateString('en-GB', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Cover Image & Company Header - Exact Match to Job Seeker View */}
        <Card className="overflow-hidden mb-6">
          <div className="relative mb-0 rounded-t-xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80"
              alt="CreativeMinds Agency office"
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/70 flex items-end">
              <div className="p-6 text-white">
                <h1 className="text-4xl font-bold" style={{
                  fontFamily: 'Sora', 
                  textShadow: '4px 4px 8px rgba(0,0,0,1), 2px 2px 4px rgba(0,0,0,0.9), 0 0 10px rgba(0,0,0,0.8)',
                  filter: 'contrast(1.3) brightness(1.1)',
                  color: '#ffffff'
                }}>CreativeMinds Agency</h1>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-4 right-4 bg-white/90 hover:bg-white"
              onClick={() => setExpandedSection('cover-photo')}
            >
              <Camera className="w-4 h-4 mr-2" />
              Edit Cover
            </Button>
          </div>
          
          {/* Company details section below cover photo */}
          <div className="p-6 bg-white">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-6">
                {/* Editable Logo - Hover to edit */}
                <div 
                  className="flex-shrink-0 w-16 h-16 bg-pink-600 rounded-lg flex items-center justify-center cursor-pointer hover:bg-pink-700 transition-colors group relative"
                  onClick={() => setExpandedSection('logo')}
                  title="Click to edit logo"
                >
                  <span className="text-white text-2xl font-bold" style={{fontFamily: 'Sora'}}>C</span>
                  {/* Edit overlay on hover */}
                  <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Edit className="w-4 h-4 text-white" />
                  </div>
                </div>
              
                {/* Company info and rating */}
                <div className="flex-1">
                {/* Industry Tags - Colorful and integrated */}
                {modifiedProfile?.industries && modifiedProfile.industries.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {modifiedProfile.industries.map((industry, index) => {
                      // Define colorful industry tag styles
                      const getIndustryStyle = (industry: string) => {
                        const styles: {[key: string]: string} = {
                          'Marketing & Advertising': 'bg-purple-100 text-purple-800 border-purple-200',
                          'Creative Services': 'bg-pink-100 text-pink-800 border-pink-200',
                          'Digital Media': 'bg-blue-100 text-blue-800 border-blue-200',
                          'Technology & Software': 'bg-green-100 text-green-800 border-green-200',
                          'Finance & Banking': 'bg-indigo-100 text-indigo-800 border-indigo-200',
                          'Healthcare': 'bg-red-100 text-red-800 border-red-200',
                          'Education': 'bg-yellow-100 text-yellow-800 border-yellow-200',
                          'Retail & E-commerce': 'bg-orange-100 text-orange-800 border-orange-200',
                          'Manufacturing': 'bg-gray-100 text-gray-800 border-gray-200',
                          'Consulting': 'bg-teal-100 text-teal-800 border-teal-200',
                          'Media & Entertainment': 'bg-violet-100 text-violet-800 border-violet-200',
                          'Non-Profit': 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        };
                        return styles[industry] || 'bg-blue-100 text-blue-800 border-blue-200';
                      };
                      
                      return (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className={`${getIndustryStyle(industry)} font-medium px-3 py-1 text-xs border hover:shadow-sm transition-all`}
                        >
                          {industry}
                        </Badge>
                      );
                    })}
                  </div>
                )}
                
                <div className="flex items-center gap-8 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{modifiedProfile.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{modifiedProfile.companySize}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Founded {modifiedProfile.foundedYear}</span>
                  </div>
                </div>
                
                {/* Rating and Reviews Row - matches attachment */}
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1,2,3,4,5].map((star) => (
                        <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="font-semibold text-gray-700">4.6</span>
                    <button 
                      onClick={() => {
                        setSelectedReview({
                          author: "Emma Wilson",
                          position: "Junior Marketing Executive", 
                          rating: 5,
                          date: "2 months ago",
                          feedbackQuality: 4.8,
                          communicationSpeed: 4.6, 
                          interviewExperience: 4.7,
                          processTransparency: 4.5
                        });
                        setShowReviewModal(true);
                      }}
                      className="text-gray-500 text-sm hover:text-gray-700 cursor-pointer"
                    >
                      Candidate Experience (4.6)
                    </button>
                  </div>
                  <button 
                    onClick={() => {
                      window.open("https://www.glassdoor.co.uk/Reviews/CreativeMinds-Agency-Reviews-E12345.htm", "_blank", "noopener,noreferrer");
                    }}
                    className="text-green-600 hover:text-green-700 hover:underline cursor-pointer text-sm flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Glassdoor Reviews
                  </button>
                </div>
                

                </div>
              </div>
            </div>
          </div>
        </Card>



        {/* Tabbed Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* Tab Navigation - Always visible */}
          <div className="sticky top-0 z-10 bg-gray-50 pb-6">
            <TabsList className="grid w-full grid-cols-5 bg-white border rounded-lg p-1 shadow-sm h-12">
                <TabsTrigger 
                  value="overview"
                  className="data-[state=active]:bg-pink-50 data-[state=active]:text-pink-700 data-[state=active]:border-pink-200 data-[state=active]:shadow-sm transition-all duration-200 rounded-md border border-transparent px-2 py-2 mx-1 h-10 flex items-center justify-center text-sm"
                >
                  <span className="font-medium">Overview</span>
                  {(!modifiedProfile.about && !modifiedProfile.description) && (
                    <span className="ml-1 text-xs text-gray-500">+</span>
                  )}
                </TabsTrigger>
                <TabsTrigger 
                  value="testimonials"
                  className="data-[state=active]:bg-pink-50 data-[state=active]:text-pink-700 data-[state=active]:border-pink-200 data-[state=active]:shadow-sm transition-all duration-200 rounded-md border border-transparent px-2 py-2 mx-1 h-10 flex items-center justify-center text-sm"
                >
                  <span className="font-medium">Testimonials</span>
                  {!modifiedProfile.testimonials?.length && (
                    <span className="ml-1 text-xs text-gray-500">+</span>
                  )}
                </TabsTrigger>
                <TabsTrigger 
                  value="recognition"
                  className="data-[state=active]:bg-pink-50 data-[state=active]:text-pink-700 data-[state=active]:border-pink-200 data-[state=active]:shadow-sm transition-all duration-200 rounded-md border border-transparent px-2 py-2 mx-1 h-10 flex items-center justify-center text-sm"
                >
                  <span className="font-medium">Recognition</span>
                  {!modifiedProfile.awards?.length && (
                    <span className="ml-1 text-xs text-gray-500">+</span>
                  )}
                </TabsTrigger>
                <TabsTrigger 
                  value="programmes"
                  className="data-[state=active]:bg-pink-50 data-[state=active]:text-pink-700 data-[state=active]:border-pink-200 data-[state=active]:shadow-sm transition-all duration-200 rounded-md border border-transparent px-2 py-2 mx-1 h-10 flex items-center justify-center text-sm"
                >
                  <span className="font-medium">Initiatives</span>
                  {!modifiedProfile.programmes?.length && (
                    <span className="ml-1 text-xs text-gray-500">+</span>
                  )}
                </TabsTrigger>
                <TabsTrigger 
                  value="gallery"
                  className="data-[state=active]:bg-pink-50 data-[state=active]:text-pink-700 data-[state=active]:border-pink-200 data-[state=active]:shadow-sm transition-all duration-200 rounded-md border border-transparent px-2 py-2 mx-1 h-10 flex items-center justify-center text-sm"
                >
                  <span className="font-medium">Gallery</span>
                  {!modifiedProfile.gallery?.length ? (
                    <span className="ml-1 text-xs text-gray-500">+</span>
                  ) : (
                    <span className="ml-1 text-xs text-green-600">✓</span>
                  )}
                </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab - Main Profile Content */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Company Description */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle style={{fontFamily: 'Sora'}}>About {modifiedProfile.companyName}</CardTitle>
                    {editingSection !== 'about' && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setEditingSection('about');
                          setEditedValues({about: modifiedProfile.about || modifiedProfile.description || ''});
                        }}
                        className="hover:bg-gray-100"
                      >
                        <Edit className="w-4 h-4" />
                        <span className="ml-1 text-sm">Edit</span>
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent>
                    {editingSection === 'about' ? (
                      <div className="space-y-4">
                        <textarea
                          value={editedValues.about || ''}
                          onChange={(e) => setEditedValues({...editedValues, about: e.target.value})}
                          className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                          rows={4}
                          placeholder="Describe your company..."
                          style={{fontFamily: 'Poppins'}}
                        />
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => {
                              setPendingApproval(true);
                              setEditingSection(null);
                              setShowApprovalNotification(true);
                              setTimeout(() => setShowApprovalNotification(false), 5000);
                              // Here you would typically call an API to save changes
                            }}
                            className="bg-pink-600 hover:bg-pink-700 text-white"
                            style={{fontFamily: 'Sora'}}
                          >
                            Submit for Approval
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => {
                              setEditingSection(null);
                              setEditedValues({});
                            }}
                            style={{fontFamily: 'Sora'}}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-gray-700 leading-relaxed" style={{fontFamily: 'Poppins'}}>
                          {modifiedProfile.about || modifiedProfile.description || "No description available"}
                        </p>
                        {(statusInfo?.type === 'live' || pendingApproval) && (
                          <p className="text-xs text-gray-500 mt-2 italic" style={{fontFamily: 'Poppins'}}>
                            {pendingApproval ? 'Changes submitted for approval' : 'Changes will require approval before going live'}
                          </p>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Mission Statement */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle style={{fontFamily: 'Sora'}}>Our Mission</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setEditingSection('mission');
                        setEditedValues({ mission: modifiedProfile?.about || '' });
                      }}
                      className="hover:bg-gray-100"
                    >
                      <Edit className="w-4 h-4" />
                      <span className="ml-1 text-sm">Edit</span>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {editingSection === 'mission' ? (
                      <div className="space-y-4">
                        <textarea
                          value={editedValues.mission || ''}
                          onChange={(e) => setEditedValues({...editedValues, mission: e.target.value})}
                          className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                          rows={4}
                          placeholder="Describe your company mission..."
                          style={{fontFamily: 'Poppins'}}
                        />
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => {
                              setPendingApproval(true);
                              setEditingSection(null);
                              setShowApprovalNotification(true);
                              setTimeout(() => setShowApprovalNotification(false), 5000);
                            }}
                            className="bg-pink-600 hover:bg-pink-700 text-white"
                            style={{fontFamily: 'Sora'}}
                          >
                            Submit for Approval
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => setEditingSection(null)}
                            style={{fontFamily: 'Sora'}}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-gray-700 leading-relaxed" style={{fontFamily: 'Poppins'}}>
                          To empower brands through innovative creative solutions that drive meaningful connections and deliver exceptional results for our clients.
                        </p>
                        {statusInfo?.type === 'live' && (
                          <p className="text-xs text-gray-500 mt-2 italic" style={{fontFamily: 'Poppins'}}>
                            Changes will require approval before going live
                          </p>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Our Culture - Moved below Mission */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle style={{fontFamily: 'Sora'}}>Our Culture</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setEditingSection('culture');
                        setEditedValues({ culture: modifiedProfile?.workEnvironment || '' });
                      }}
                      className="hover:bg-gray-100"
                    >
                      <Edit className="w-4 h-4" />
                      <span className="ml-1 text-sm">Edit</span>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {editingSection === 'culture' ? (
                      <div className="space-y-4">
                        <textarea
                          value={editedValues.culture || ''}
                          onChange={(e) => setEditedValues({...editedValues, culture: e.target.value})}
                          className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                          rows={4}
                          placeholder="Describe your company culture..."
                          style={{fontFamily: 'Poppins'}}
                        />
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => {
                              setPendingApproval(true);
                              setEditingSection(null);
                              setShowApprovalNotification(true);
                              setTimeout(() => setShowApprovalNotification(false), 5000);
                            }}
                            className="bg-pink-600 hover:bg-pink-700 text-white"
                            style={{fontFamily: 'Sora'}}
                          >
                            Submit for Approval
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => setEditingSection(null)}
                            style={{fontFamily: 'Sora'}}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-gray-700 leading-relaxed" style={{fontFamily: 'Poppins'}}>
                          {modifiedProfile.workEnvironment || "We foster a collaborative, creative environment where every team member can thrive and grow their skills."}
                        </p>
                        {statusInfo?.type === 'live' && (
                          <p className="text-xs text-gray-500 mt-2 italic" style={{fontFamily: 'Poppins'}}>
                            Changes will require approval before going live
                          </p>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Diversity & Inclusion */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle style={{fontFamily: 'Sora'}}>Diversity & Inclusion</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setEditingSection('diversity');
                        setEditedValues({ diversity: modifiedProfile?.description || '' });
                      }}
                      className="hover:bg-gray-100"
                    >
                      <Edit className="w-4 h-4" />
                      <span className="ml-1 text-sm">Edit</span>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {editingSection === 'diversity' ? (
                      <div className="space-y-4">
                        <textarea
                          value={editedValues.diversity || 'We\'re committed to building a diverse team that reflects the communities we serve. We actively encourage applications from underrepresented groups and provide equal opportunities for career growth.'}
                          onChange={(e) => setEditedValues({...editedValues, diversity: e.target.value})}
                          className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                          rows={4}
                          placeholder="Describe your diversity & inclusion commitment..."
                          style={{fontFamily: 'Poppins'}}
                        />
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => {
                              setPendingApproval(true);
                              setEditingSection(null);
                              setShowApprovalNotification(true);
                              setTimeout(() => setShowApprovalNotification(false), 5000);
                            }}
                            className="bg-pink-600 hover:bg-pink-700 text-white"
                            style={{fontFamily: 'Sora'}}
                          >
                            Submit for Approval
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => setEditingSection(null)}
                            style={{fontFamily: 'Sora'}}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-gray-700 leading-relaxed" style={{fontFamily: 'Poppins'}}>
                          We're committed to building a diverse team that reflects the communities we serve. We actively encourage applications from underrepresented groups and provide equal opportunities for career growth.
                        </p>
                        {statusInfo?.type === 'live' && (
                          <p className="text-xs text-gray-500 mt-2 italic" style={{fontFamily: 'Poppins'}}>
                            Changes will require approval before going live
                          </p>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Company Values */}
                {modifiedProfile.values && modifiedProfile.values.length > 0 && (
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle style={{fontFamily: 'Sora'}}>Our Values</CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setEditingSection('values');
                          setEditedValues({ values: modifiedProfile?.values?.join(', ') || '' });
                        }}
                        className="hover:bg-gray-100"
                      >
                        <Edit className="w-4 h-4" />
                        <span className="ml-1 text-sm">Edit</span>
                      </Button>
                    </CardHeader>
                    <CardContent>
                      {editingSection === 'values' ? (
                        <div className="space-y-4">
                          <input
                            type="text"
                            value={editedValues.values || ''}
                            onChange={(e) => setEditedValues({...editedValues, values: e.target.value})}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                            placeholder="Enter values separated by commas (e.g. Innovation, Collaboration, Excellence)"
                            style={{fontFamily: 'Poppins'}}
                          />
                          <div className="flex gap-2">
                            <Button 
                              onClick={() => {
                                setPendingApproval(true);
                                setEditingSection(null);
                                setShowApprovalNotification(true);
                                setTimeout(() => setShowApprovalNotification(false), 5000);
                              }}
                              className="bg-pink-600 hover:bg-pink-700 text-white"
                              style={{fontFamily: 'Sora'}}
                            >
                              Submit for Approval
                            </Button>
                            <Button 
                              variant="outline"
                              onClick={() => setEditingSection(null)}
                              style={{fontFamily: 'Sora'}}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex flex-wrap gap-2">
                            {modifiedProfile.values.map((value, index) => (
                              <Badge key={index} variant="secondary" className="bg-yellow-100 text-yellow-800">
                                {value}
                              </Badge>
                            ))}
                          </div>
                          {statusInfo?.type === 'live' && (
                            <p className="text-xs text-gray-500 mt-2 italic" style={{fontFamily: 'Poppins'}}>
                              Changes will require approval before going live
                            </p>
                          )}
                        </>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Benefits & Perks */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle style={{fontFamily: 'Sora'}}>What We Offer</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setEditingSection('benefits');
                        setEditedValues({ benefits: modifiedProfile?.benefits?.join('\n') || 'Comprehensive health insurance\nFlexible working arrangements\nProfessional development budget (£2,000 annually)\n25 days annual leave plus bank holidays\nPension scheme with company contribution\nWellness programme including mental health support\nHome office setup allowance\nSeason ticket loan' });
                      }}
                      className="hover:bg-gray-100"
                    >
                      <Edit className="w-4 h-4" />
                      <span className="ml-1 text-sm">Edit</span>
                    </Button>
                  </CardHeader>
                    <CardContent className="space-y-4">
                      {editingSection === 'benefits' ? (
                        <div className="space-y-4">
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Benefits</label>
                              <textarea
                                value={editedValues.benefits || 'Comprehensive health insurance\nFlexible working arrangements\nProfessional development budget (£2,000 annually)\n25 days annual leave plus bank holidays'}
                                onChange={(e) => setEditedValues({...editedValues, benefits: e.target.value})}
                                className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                rows={4}
                                placeholder="List your benefits, one per line..."
                                style={{fontFamily: 'Poppins'}}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Perks</label>
                              <textarea
                                value={editedValues.perks || 'Wellness programme including mental health support\nHome office setup allowance\nSeason ticket loan\nFree snacks and drinks'}
                                onChange={(e) => setEditedValues({...editedValues, perks: e.target.value})}
                                className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                rows={4}
                                placeholder="List your perks, one per line..."
                                style={{fontFamily: 'Poppins'}}
                              />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              onClick={() => {
                                setPendingApproval(true);
                                setEditingSection(null);
                                setShowApprovalNotification(true);
                                setTimeout(() => setShowApprovalNotification(false), 5000);
                              }}
                              className="bg-pink-600 hover:bg-pink-700 text-white"
                              style={{fontFamily: 'Sora'}}
                            >
                              Submit for Approval
                            </Button>
                            <Button 
                              variant="outline"
                              onClick={() => setEditingSection(null)}
                              style={{fontFamily: 'Sora'}}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="space-y-4">
                            {modifiedProfile.benefits && modifiedProfile.benefits.length > 0 && (
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2" style={{fontFamily: 'Sora'}}>Benefits</h4>
                                <div className="space-y-2">
                                  {modifiedProfile.benefits.map((benefit, index) => (
                                    <div key={index} className="flex items-start space-x-2">
                                      <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                                      <span className="text-gray-700" style={{fontFamily: 'Poppins'}}>{benefit}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            {modifiedProfile.perks && modifiedProfile.perks.length > 0 && (
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2" style={{fontFamily: 'Sora'}}>Perks</h4>
                                <div className="space-y-2">
                                  {modifiedProfile.perks.map((perk, index) => (
                                    <div key={index} className="flex items-start space-x-2">
                                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                      <span className="text-gray-700" style={{fontFamily: 'Poppins'}}>{perk}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            {(!modifiedProfile.benefits || modifiedProfile.benefits.length === 0) && (!modifiedProfile.perks || modifiedProfile.perks.length === 0) && (
                              <div className="space-y-2">
                                <h4 className="font-medium text-gray-900 mb-2" style={{fontFamily: 'Sora'}}>Benefits & Perks</h4>
                                <div className="space-y-2">
                                  {('Comprehensive health insurance\nFlexible working arrangements\nProfessional development budget (£2,000 annually)\n25 days annual leave plus bank holidays\nPension scheme with company contribution\nWellness programme including mental health support\nHome office setup allowance\nSeason ticket loan').split('\n').map((benefit, index) => (
                                    <div key={index} className="flex items-start space-x-2">
                                      <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                                      <span className="text-gray-700" style={{fontFamily: 'Poppins'}}>{benefit}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          {statusInfo?.type === 'live' && (
                            <p className="text-xs text-gray-500 mt-4 italic" style={{fontFamily: 'Poppins'}}>
                              Changes will require approval before going live
                            </p>
                          )}
                        </>
                      )}
                    </CardContent>
                  </Card>
              </div>

              {/* Right Column - Contact & Details */}
              <div className="space-y-6">
                {/* Contact Information - Email and phone removed */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle style={{fontFamily: 'Sora'}}>Company Information</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setLocation("/account-settings")}
                      className="hover:bg-gray-100"
                    >
                      <Edit className="w-4 h-4" />
                      <span className="ml-1 text-sm">Edit</span>
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {modifiedProfile.website && (
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <a href={modifiedProfile.website} target="_blank" rel="noopener noreferrer" 
                           className="text-pink-600 hover:underline">
                          {modifiedProfile.website}
                        </a>
                      </div>
                    )}
                    {modifiedProfile.linkedinPage && (
                      <div className="flex items-center gap-2 text-sm">
                        <Linkedin className="w-4 h-4 text-gray-400" />
                        <a href={modifiedProfile.linkedinPage} target="_blank" rel="noopener noreferrer" 
                           className="text-pink-600 hover:underline">
                          LinkedIn
                        </a>
                      </div>
                    )}
                    <button 
                      onClick={() => window.open("/company-profile/2", "_blank")}
                      className="flex items-center gap-2 text-sm text-pink-600 hover:underline"
                    >
                      <UserCheck className="w-4 h-4 text-gray-400" />
                      View Careers Page
                    </button>
                  </CardContent>
                </Card>

                {/* Working Model */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle style={{fontFamily: 'Sora'}}>Working Model</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setEditingSection('workingModel');
                        setEditedValues({ 
                          workingModel: modifiedProfile?.workingModel || 'We offer a hybrid working model with 3 days in our London office and 2 days working from home. Our core office hours are 9:00 AM - 5:30 PM, with flexible start times between 8:00 AM - 10:00 AM.',
                          workingModelTag: modifiedProfile?.workingModelTag || 'Hybrid'
                        });
                      }}
                      className="hover:bg-gray-100"
                    >
                      <Edit className="w-4 h-4" />
                      <span className="ml-1 text-sm">Edit</span>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {editingSection === 'workingModel' ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Working Model</label>
                          <select
                            value={editedValues.workingModelTag || 'Hybrid'}
                            onChange={(e) => setEditedValues({...editedValues, workingModelTag: e.target.value})}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                            style={{fontFamily: 'Poppins'}}
                          >
                            <option value="Remote">Remote</option>
                            <option value="Hybrid">Hybrid</option>
                            <option value="In-Office">In-Office</option>
                            <option value="Variable">Variable</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Working Model Description</label>
                          <textarea
                            value={editedValues.workingModel || ''}
                            onChange={(e) => setEditedValues({...editedValues, workingModel: e.target.value})}
                            className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                            rows={4}
                            placeholder="Describe your working arrangements and office policies..."
                            style={{fontFamily: 'Poppins'}}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => {
                              setPendingApproval(true);
                              setEditingSection(null);
                              setShowApprovalNotification(true);
                              setTimeout(() => setShowApprovalNotification(false), 5000);
                            }}
                            className="bg-pink-600 hover:bg-pink-700 text-white"
                            style={{fontFamily: 'Sora'}}
                          >
                            Submit for Approval
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => setEditingSection(null)}
                            style={{fontFamily: 'Sora'}}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                            {modifiedProfile?.workingModelTag || 'Hybrid'}
                          </Badge>
                        </div>
                        <p className="text-gray-700" style={{fontFamily: 'Poppins'}}>
                          {modifiedProfile?.workingModel || 'We offer a hybrid working model with 3 days in our London office and 2 days working from home. Our core office hours are 9:00 AM - 5:30 PM, with flexible start times between 8:00 AM - 10:00 AM.'}
                        </p>
                        {statusInfo?.type === 'live' && (
                          <p className="text-xs text-gray-500 mt-2 italic" style={{fontFamily: 'Poppins'}}>
                            Changes will require approval before going live
                          </p>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>


              </div>
            </div>
          </TabsContent>

          {/* Testimonials Tab */}
          <TabsContent value="testimonials">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle style={{fontFamily: 'Sora'}}>Employee Testimonials</CardTitle>
                  <Button 
                    onClick={() => setExpandedSection(expandedSection === 'testimonials' ? null : 'testimonials')}
                    variant="outline"
                    style={{fontFamily: 'Sora'}}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Testimonials
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Company Statement Section - Always Visible */}
                <div className="mb-6 pb-6 border-b">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900" style={{fontFamily: 'Sora'}}>
                      What Makes You a Great Place to Work?
                    </h3>
                    {editingSection !== 'company-statement' && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setEditingSection('company-statement');
                          setEditedValues({companyStatement: modifiedProfile.companyStatement || ''});
                        }}
                        className="hover:bg-gray-100"
                      >
                        <Edit className="w-4 h-4" />
                        <span className="ml-1 text-sm">Edit</span>
                      </Button>
                    )}
                  </div>
                  
                  {editingSection === 'company-statement' ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Company Statement</label>
                        <textarea
                          value={editedValues.companyStatement || ''}
                          onChange={(e) => setEditedValues({...editedValues, companyStatement: e.target.value})}
                          className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                          rows={4}
                          placeholder="In your own words, what makes your company a brilliant place to work? This will appear in the 'Pollen Insights' section that candidates see. Focus on your culture, development opportunities, and what sets you apart as an employer..."
                          style={{fontFamily: 'Poppins'}}
                        />

                      </div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => {
                            setPendingApproval(true);
                            setEditingSection(null);
                            setShowApprovalNotification(true);
                            setTimeout(() => setShowApprovalNotification(false), 5000);
                            // Here you would typically call an API to save changes
                          }}
                          className="bg-pink-600 hover:bg-pink-700 text-white"
                          style={{fontFamily: 'Sora'}}
                        >
                          Submit for Approval
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => {
                            setEditingSection(null);
                            setEditedValues({});
                          }}
                          style={{fontFamily: 'Sora'}}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      {modifiedProfile.companyStatement ? (
                        <p className="text-gray-700" style={{fontFamily: 'Poppins'}}>
                          {modifiedProfile.companyStatement}
                        </p>
                      ) : (
                        <div className="text-center py-4">
                          <MessageSquare className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                          <p className="text-gray-600 text-sm" style={{fontFamily: 'Poppins'}}>
                            Use this as an opportunity to express in your own words what makes your business special. Share your mission, values, growth opportunities, and what sets you apart - whether you're an established team or just starting your hiring journey.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {expandedSection === 'testimonials' ? (
                  <div className="space-y-4">
                    {/* Email Request Section - Central CTA */}
                    <div className="bg-pink-50 p-6 rounded-lg border border-pink-200">
                      <div className="text-center mb-4">
                        <Mail className="w-12 h-12 text-pink-600 mx-auto mb-3" />
                        <h4 className="text-lg font-semibold text-pink-900 mb-2" style={{fontFamily: 'Sora'}}>
                          Request Employee Testimonials
                        </h4>
                        <p className="text-pink-800 text-sm" style={{fontFamily: 'Poppins'}}>
                          We'll help you collect authentic testimonials from your team. Junior employee testimonials are especially valuable for peer-led insights.
                        </p>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Team Member Email Addresses</label>
                          <textarea 
                            className="w-full p-3 border border-gray-300 rounded-md h-20" 
                            placeholder="Enter email addresses separated by commas&#10;e.g. sarah@company.com, james@company.com, emma@company.com"
                          ></textarea>
                          <p className="text-xs text-gray-500 mt-1" style={{fontFamily: 'Poppins'}}>
                            Junior employees (first 2-3 years) are preferred for peer-led testimonials
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Custom Message (Optional)</label>
                          <textarea 
                            className="w-full p-3 border border-gray-300 rounded-md h-16" 
                            placeholder="Add a personal message about your company's commitment to developing junior talent..."
                          ></textarea>
                        </div>
                        <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white" style={{fontFamily: 'Sora'}}>
                          <Mail className="w-4 h-4 mr-2" />
                          Send Testimonial Requests
                        </Button>
                      </div>
                    </div>
                    
                    {/* Manual Entry Option */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-3" style={{fontFamily: 'Sora'}}>Add Testimonial Manually</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Employee Name</label>
                          <input type="text" className="w-full p-2 border border-gray-300 rounded-md" placeholder="e.g. Sarah Johnson" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                          <input type="text" className="w-full p-2 border border-gray-300 rounded-md" placeholder="e.g. Junior Marketing Executive" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Testimonial</label>
                          <textarea className="w-full p-2 border border-gray-300 rounded-md h-24" placeholder="Share what makes working here special..."></textarea>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" style={{fontFamily: 'Sora'}}>Save Testimonial</Button>
                          <Button size="sm" variant="outline" onClick={() => setExpandedSection(null)} style={{fontFamily: 'Sora'}}>Cancel</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Quote className="w-16 h-16 text-pink-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{fontFamily: 'Sora'}}>
                      Share Employee Success Stories
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto" style={{fontFamily: 'Poppins'}}>
                      Build trust with candidates by highlighting authentic testimonials from your team about their career development experience.
                    </p>
                    <Button 
                      onClick={() => setExpandedSection('testimonials')}
                      className="bg-pink-600 hover:bg-pink-700 text-white"
                      style={{fontFamily: 'Sora'}}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Request Team Testimonials
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recognition Tab */}
          <TabsContent value="recognition">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle style={{fontFamily: 'Sora'}}>Awards & Recognition</CardTitle>
                  <Button 
                    onClick={() => setExpandedSection(expandedSection === 'recognition' ? null : 'recognition')}
                    variant="outline"
                    style={{fontFamily: 'Sora'}}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Recognition
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {expandedSection === 'recognition' ? (
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-3" style={{fontFamily: 'Sora'}}>Add New Recognition</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Award/Recognition Title</label>
                          <input type="text" className="w-full p-2 border border-gray-300 rounded-md" placeholder="e.g. Best Places to Work 2024" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Awarding Organisation</label>
                          <input type="text" className="w-full p-2 border border-gray-300 rounded-md" placeholder="e.g. Great Place to Work Institute" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Year Received</label>
                          <input type="number" className="w-full p-2 border border-gray-300 rounded-md" placeholder="2024" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                          <textarea className="w-full p-2 border border-gray-300 rounded-md h-20" placeholder="Brief description of the recognition..."></textarea>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" style={{fontFamily: 'Sora'}}>Save Recognition</Button>
                          <Button size="sm" variant="outline" onClick={() => setExpandedSection(null)} style={{fontFamily: 'Sora'}}>Cancel</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Award className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600" style={{fontFamily: 'Poppins'}}>
                      Highlight your company awards, certifications, and industry recognition to stand out to candidates.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Initiatives Tab */}
          <TabsContent value="programmes">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle style={{fontFamily: 'Sora'}}>Development Initiatives</CardTitle>
                  <Button 
                    onClick={() => setExpandedSection(expandedSection === 'programmes' ? null : 'programmes')}
                    variant="outline"
                    style={{fontFamily: 'Sora'}}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {expandedSection === 'programmes' ? 'Cancel' : 'Configure Initiatives'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {expandedSection === 'programmes' ? (
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-4" style={{fontFamily: 'Sora'}}>Entry-Level Development Initiatives</h4>
                      <p className="text-sm text-gray-600 mb-4">Describe the specific development initiatives you offer to entry-level hires. Start with one and add more as needed:</p>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Initiative 1</label>
                          <div className="space-y-2">
                            <input
                              type="text"
                              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                              placeholder="e.g. Graduate Mentorship Initiative"
                            />
                            <textarea
                              className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                              rows={3}
                              placeholder="Describe this initiative, its duration, key components, and what new hires can expect..."
                            />
                          </div>
                        </div>
                        
                      </div>
                      
                      <Button 
                        type="button"
                        variant="outline" 
                        size="sm" 
                        className="mt-3 border-dashed border-pink-300 text-pink-600 hover:bg-pink-50"
                        onClick={() => {
                          // Add new initiative functionality would go here
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Another Initiative
                      </Button>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-4" style={{fontFamily: 'Sora'}}>Additional Growth Opportunities</h4>
                      <p className="text-sm text-gray-600 mb-4">Select the additional growth opportunities you offer (displayed as simple statements to job seekers):</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <label className="flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-white transition-colors">
                          <input type="checkbox" className="text-pink-600 focus:ring-pink-500" />
                          <span className="text-sm font-medium text-gray-900">Clear career progression paths</span>
                        </label>
                        
                        <label className="flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-white transition-colors">
                          <input type="checkbox" className="text-pink-600 focus:ring-pink-500" />
                          <span className="text-sm font-medium text-gray-900">Leadership development initiatives</span>
                        </label>
                        
                        <label className="flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-white transition-colors">
                          <input type="checkbox" className="text-pink-600 focus:ring-pink-500" />
                          <span className="text-sm font-medium text-gray-900">Cross-functional project opportunities</span>
                        </label>
                        
                        <label className="flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-white transition-colors">
                          <input type="checkbox" className="text-pink-600 focus:ring-pink-500" />
                          <span className="text-sm font-medium text-gray-900">Conference speaking opportunities</span>
                        </label>
                        
                        <label className="flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-white transition-colors">
                          <input type="checkbox" className="text-pink-600 focus:ring-pink-500" />
                          <span className="text-sm font-medium text-gray-900">External training and certifications</span>
                        </label>
                        
                        <label className="flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-white transition-colors">
                          <input type="checkbox" className="text-pink-600 focus:ring-pink-500" />
                          <span className="text-sm font-medium text-gray-900">Industry networking support</span>
                        </label>
                        
                        <label className="flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-white transition-colors">
                          <input type="checkbox" className="text-pink-600 focus:ring-pink-500" />
                          <span className="text-sm font-medium text-gray-900">International assignment opportunities</span>
                        </label>
                        
                        <label className="flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-white transition-colors">
                          <input type="checkbox" className="text-pink-600 focus:ring-pink-500" />
                          <span className="text-sm font-medium text-gray-900">Innovation project participation</span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-4">
                      <Button size="sm" style={{fontFamily: 'Sora'}}>Save Initiatives</Button>
                      <Button size="sm" variant="outline" onClick={() => setExpandedSection(null)} style={{fontFamily: 'Sora'}}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600" style={{fontFamily: 'Poppins'}}>
                      Configure your development initiatives and growth opportunities to attract top entry-level talent.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle style={{fontFamily: 'Sora'}}>Company Gallery</CardTitle>
                  <Button 
                    onClick={() => setExpandedSection(expandedSection === 'gallery' ? null : 'gallery')}
                    variant="outline"
                    style={{fontFamily: 'Sora'}}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Photos
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {expandedSection === 'gallery' ? (
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-3" style={{fontFamily: 'Sora'}}>Upload Photos</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Photo Category</label>
                          <select className="w-full p-2 border border-gray-300 rounded-md">
                            <option>Office Space</option>
                            <option>Team Events</option>
                            <option>Work Environment</option>
                            <option>Company Culture</option>
                            <option>Social Activities</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Upload Images</label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-600 text-sm">Drag & drop images here or click to browse</p>
                            <input type="file" multiple accept="image/*" className="hidden" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Caption (optional)</label>
                          <input type="text" className="w-full p-2 border border-gray-300 rounded-md" placeholder="Add a caption for these photos..." />
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" style={{fontFamily: 'Sora'}}>Upload Photos</Button>
                          <Button size="sm" variant="outline" onClick={() => setExpandedSection(null)} style={{fontFamily: 'Sora'}}>Cancel</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Camera className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600" style={{fontFamily: 'Poppins'}}>
                      Share authentic photos of your team, office space, and company events to give candidates a feel for your culture.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Enhanced Review Modal with 4-Criteria Breakdown */}
        {showReviewModal && selectedReview && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-pink-50 to-yellow-50 p-6 rounded-t-2xl border-b">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-800 mb-3" style={{fontFamily: 'Sora'}}>
                      Candidate Experience at {modifiedProfile.companyName}
                    </h3>
                  </div>
                  <button 
                    onClick={() => setShowReviewModal(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-full transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              {/* Modal Content */}
              <div className="p-6">
                {/* 4-Criteria Breakdown - Match Attachment 1 Design Exactly */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {/* Feedback Quality */}
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">Feedback Quality</h4>
                      <span className="text-2xl font-bold text-pink-600">4.8/5</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full mb-3">
                      <div 
                        className="h-2 bg-pink-600 rounded-full" 
                        style={{ width: `${(4.8 / 5) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Candidates receive detailed, constructive feedback regardless of the outcome. 
                      Reviews highlight specific strengths and areas for development.
                    </p>
                  </div>

                  {/* Interview Experience */}
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">Interview Experience</h4>
                      <span className="text-2xl font-bold text-pink-600">4.7/5</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full mb-3">
                      <div 
                        className="h-2 bg-pink-600 rounded-full" 
                        style={{ width: `${(4.7 / 5) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Structured interviews that focus on potential and growth mindset. 
                      Interviewers are well-prepared and create a welcoming environment.
                    </p>
                  </div>

                  {/* Communication Speed */}
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">Communication Speed</h4>
                      <span className="text-2xl font-bold text-pink-600">4.6/5</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full mb-3">
                      <div 
                        className="h-2 bg-pink-600 rounded-full" 
                        style={{ width: `${(4.6 / 5) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Average response time is 2-3 business days. Candidates are kept informed 
                      at each stage of the process with clear next steps.
                    </p>
                  </div>

                  {/* Process Transparency */}
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">Process Transparency</h4>
                      <span className="text-2xl font-bold text-pink-600">4.5/5</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full mb-3">
                      <div 
                        className="h-2 bg-pink-600 rounded-full" 
                        style={{ width: `${(4.5 / 5) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Clear information about role expectations, company culture, and career 
                      growth opportunities shared upfront.
                    </p>
                  </div>
                </div>

                {/* Overall Experience Rating - Match Attachment Design */}
                <div className="text-center py-4 border-t">
                  <h4 className="font-semibold text-gray-900 mb-2">Overall Experience Rating</h4>
                  <p className="text-sm text-gray-600 mb-3">Based on feedback from 39 recent candidates</p>
                  <div className="flex items-center justify-center gap-3">
                    <div className="flex">
                      {[1,2,3,4,5].map((star) => (
                        <Star key={star} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-3xl font-bold text-pink-600">4.6/5</span>
                  </div>
                </div>


              </div>
            </div>
          </div>
        )}

        {/* Approval Notification Popup */}
        {showApprovalNotification && (
          <div className="fixed top-4 right-4 z-50 bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-lg max-w-sm">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-900" style={{fontFamily: 'Sora'}}>
                  Profile Under Review
                </h4>
                <p className="text-sm text-blue-800" style={{fontFamily: 'Poppins'}}>
                  Your changes have been submitted and will be reviewed within 24 hours.
                </p>
              </div>
              <button
                onClick={() => setShowApprovalNotification(false)}
                className="flex-shrink-0 text-blue-400 hover:text-blue-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}