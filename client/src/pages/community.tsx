import { Calendar, Users, BookOpen, Trophy, Mic, UserCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function CommunityPage() {
  console.log('Community page rendering...');
  
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Community Hub</h1>
        <p className="text-gray-600 text-lg">Connect, learn, and grow with fellow job seekers.</p>
      </div>

      {/* Join Slack Banner */}
      <Card className="mb-12 bg-green-50 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Badge className="bg-green-100 text-green-800 mb-3">Instant Access</Badge>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Join our Slack Community</h2>
              <p className="text-gray-700">
                Get instant support from the Pollen team and connect with other job seekers. This is the quickest way to get help, hear about new jobs, and make requests about what we offer.
              </p>
            </div>
            <Button 
              className="bg-[#E2007A] hover:bg-[#E2007A]/90 text-white px-6"
              onClick={() => window.open('https://join.slack.com/t/pollen-community/shared_invite/zt-2sfzxvumo-ol~HHOKcahOdgyFzjmAv9A', '_blank')}
            >
              <Users className="w-4 h-4 mr-2" />
              Join Slack
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Events & Workshops */}
        <Card className="bg-blue-50 border-blue-200 flex flex-col h-full">
          <CardContent className="p-8 text-center flex flex-col flex-1">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Events & Workshops</h3>
            <div className="flex-1">
              <p className="text-gray-700 mb-6">
                Join workshops, networking meetups, and masterclasses (online and in-person)
              </p>
            </div>
            <Button 
              className="w-full bg-[#E2007A] hover:bg-[#E2007A]/90 text-white mt-auto"
              onClick={() => window.open('https://www.eventbrite.co.uk/o/pollen-careers-73154712323', '_blank')}
            >
              View Events
            </Button>
          </CardContent>
        </Card>

        {/* Weekly Community Drop-in */}
        <Card className="bg-yellow-50 border-yellow-200 flex flex-col h-full">
          <CardContent className="p-8 text-center flex flex-col flex-1">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Weekly Community Drop-in</h3>
            <div className="flex-1">
              <p className="text-gray-700 mb-6">
                Meet the Pollen team every Monday in a relaxed, low-pressure environment for career support
              </p>
            </div>
            <Button 
              className="w-full bg-[#E2007A] hover:bg-[#E2007A]/90 text-white mt-auto"
              onClick={() => window.open('https://calendly.com/pollencareers/ask-us-anything', '_blank')}
            >
              Join Drop-In
            </Button>
          </CardContent>
        </Card>

        {/* Mentoring */}
        <Card className="bg-pink-50 border-pink-200 flex flex-col h-full">
          <CardContent className="p-8 text-center flex flex-col flex-1">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <UserCheck className="w-8 h-8 text-pink-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Mentoring</h3>
            <div className="flex-1">
              <p className="text-gray-700 mb-6">
                Connect with industry professionals for career guidance
              </p>
            </div>
            <Button 
              className="w-full bg-[#E2007A] hover:bg-[#E2007A]/90 text-white mt-auto"
              onClick={() => window.open('https://pollencareers.notion.site/ec2194fcfc714e8aa3e64e202ec82883?v=d353ebd20e104630856e4d69d3462615', '_blank')}
            >
              Find Mentors
            </Button>
          </CardContent>
        </Card>

        {/* Resource Hub */}
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Resource Hub</h3>
            <p className="text-gray-700 mb-6">
              Access career guides and professional development materials
            </p>
            <Button 
              className="w-full bg-[#E2007A] hover:bg-[#E2007A]/90 text-white"
              onClick={() => window.open('https://pollencareers.notion.site/pollencareers/Pollen-s-Resource-Hub-b5520f2ec199400bb3761dcfe31cab5f', '_blank')}
            >
              Browse Resources
            </Button>
          </CardContent>
        </Card>

        {/* Pollen Reboot */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Pollen Bootcamp</h3>
            <p className="text-gray-700 mb-6">
              Transform your career with our intensive 5-day programme
            </p>
            <Button 
              className="w-full bg-[#E2007A] hover:bg-[#E2007A]/90 text-white"
              onClick={() => window.open('https://pollen.co/reboot', '_blank')}
            >
              Learn More
            </Button>
          </CardContent>
        </Card>

        {/* Podcast */}
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mic className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Podcast</h3>
            <p className="text-gray-700 mb-6">
              Listen to career insights and expert interviews
            </p>
            <Button 
              className="w-full bg-[#E2007A] hover:bg-[#E2007A]/90 text-white"
              onClick={() => window.open('https://open.spotify.com/show/53iLe2ofx3LTzukiq9beUg', '_blank')}
            >
              Listen Now
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}