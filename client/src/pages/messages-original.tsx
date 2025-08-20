import { MessageSquare, Search, AlertCircle, Calendar, CornerDownLeft, MoreHorizontal, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function MessagesPage() {
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
        <p className="text-gray-600">Direct communication with employers and hiring managers</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Messages</p>
                <p className="text-2xl font-bold text-gray-900">7</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unread Messages</p>
                <p className="text-2xl font-bold text-blue-600">5</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Need Response</p>
                <p className="text-2xl font-bold text-orange-600">5</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Response Alert */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
          <div>
            <p className="text-sm text-orange-800">
              <span className="font-semibold">You have 5 messages waiting for your response</span>
            </p>
            <p className="text-sm text-orange-700 mt-1">
              Quick responses show professionalism and keep employers engaged with your applications
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search messages by company, job title, or recruiter name..."
            className="pl-10"
          />
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {/* Sarah Chen - Pollen Community Mentor */}
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <img 
                src="https://images.unsplash.com/photo-1494790108755-2616b612b5c5?w=40&h=40&fit=crop&crop=face"
                alt="Sarah Chen"
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900">Sarah Chen</h3>
                    <Badge variant="outline" className="text-purple-700 border-purple-200 bg-purple-50">
                      Pollen Community
                    </Badge>
                    <Badge variant="outline" className="text-purple-700 border-purple-200 bg-purple-50">
                      Mentor
                    </Badge>
                    <Badge className="bg-orange-100 text-orange-800">
                      Response needed
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>16 Jan</span>
                    <Badge className="bg-blue-100 text-blue-800">NEW</Badge>
                  </div>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-900 mb-1">Mentor Connection</p>
                  <p className="text-sm text-gray-700">
                    Hey Zara! Thanks for reaching out - I'd love to help! Finance to marketing was such a journey for me too. ...
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Holly Saunders - Pollen Team Interview */}
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
                alt="Holly Saunders"
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900">Holly Saunders</h3>
                    <Badge variant="outline" className="text-pink-700 border-pink-200 bg-pink-50">
                      Pollen Team
                    </Badge>
                    <Badge variant="outline" className="text-blue-700 border-blue-200 bg-blue-50">
                      Interview
                    </Badge>
                    <Badge className="bg-orange-100 text-orange-800">
                      Response needed
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>16 Jan</span>
                    <Badge className="bg-blue-100 text-blue-800">NEW</Badge>
                  </div>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-900 mb-1">Marketing Assistant - TechFlow Solutions</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>Monday 20 January 2025 at 14:00</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    Hi Zara! I'm Holly from the Pollen team. I'd like to schedule a brief screening call to discuss your Marketin...
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emma Wilson - StartupHub Interview */}
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <img 
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face"
                alt="Emma Wilson"
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900">Emma Wilson</h3>
                    <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50">
                      StartupHub
                    </Badge>
                    <Badge variant="outline" className="text-blue-700 border-blue-200 bg-blue-50">
                      Interview
                    </Badge>
                    <Badge className="bg-orange-100 text-orange-800">
                      Response needed
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>14 Jan</span>
                    <Badge className="bg-blue-100 text-blue-800">NEW</Badge>
                  </div>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-900 mb-1">Customer Support Specialist</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>Saturday 25 January 2025 at 11:00</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    Thanks for completing the Pollen screening! We'd love to meet you in person. Can you come to our office...
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mike Chen - Creative Media Co Job Offer */}
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                alt="Mike Chen"
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900">Mike Chen</h3>
                    <Badge variant="outline" className="text-purple-700 border-purple-200 bg-purple-50">
                      Creative Media Co
                    </Badge>
                    <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50">
                      Job Offer
                    </Badge>
                    <Badge className="bg-orange-100 text-orange-800">
                      Response needed
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>12 Jan</span>
                    <Badge className="bg-blue-100 text-blue-800">NEW</Badge>
                  </div>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-900 mb-1">Content Writer</p>
                  <p className="text-sm text-gray-700">
                    Congratulations! We'd love to offer you the Content Writer position at Creative Media Co. Starting salary ...
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sarah Tech - Tech Startup Job Offer */}
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <img 
                src="https://images.unsplash.com/photo-1494790108755-2616b612b5c5?w=40&h=40&fit=crop&crop=face"
                alt="Sarah Tech"
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900">Sarah Tech</h3>
                    <Badge variant="outline" className="text-blue-700 border-blue-200 bg-blue-50">
                      Tech Startup
                    </Badge>
                    <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50">
                      Job Offer
                    </Badge>
                    <Badge className="bg-orange-100 text-orange-800">
                      Response needed
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>28 Dec</span>
                    <Badge className="bg-blue-100 text-blue-800">NEW</Badge>
                  </div>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-900 mb-1">Data Analyst</p>
                  <p className="text-sm text-gray-700">
                    Exciting news! We're pleased to offer you the Data Analyst position at Tech Startup. Starting salary is £32,...
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Holly Saunders - Previous Message */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
                alt="Holly Saunders"
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900">Holly Saunders</h3>
                    <Badge variant="outline" className="text-pink-700 border-pink-200 bg-pink-50">
                      Pollen Team
                    </Badge>
                    <Badge variant="outline" className="text-blue-700 border-blue-200 bg-blue-50">
                      Interview
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>15 Jan</span>
                  </div>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-900 mb-1">Social Media Coordinator - Creative Media Co</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>Wednesday 22 January 2025 at 10:30</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    Great to meet you! I've scheduled our screening call for Wednesday at 10:30 AM for your Creative Media Co applicat...
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sarah Chen - Previous Message */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <img 
                src="https://images.unsplash.com/photo-1494790108755-2616b612b5c5?w=40&h=40&fit=crop&crop=face"
                alt="Sarah Chen"
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900">Sarah Chen</h3>
                    <Badge variant="outline" className="text-blue-700 border-blue-200 bg-blue-50">
                      Digital Solutions Ltd
                    </Badge>
                    <Badge variant="outline" className="text-blue-700 border-blue-200 bg-blue-50">
                      Interview
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>13 Jan</span>
                  </div>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-900 mb-1">Junior Developer</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>Tuesday 28 January 2025 at 15:00</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    Perfect! Looking forward to our technical interview next Monday at 3 PM. I'll send you the Teams link and a brief over...
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}