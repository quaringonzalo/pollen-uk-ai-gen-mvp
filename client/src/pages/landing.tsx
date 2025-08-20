import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Trophy, Briefcase, Code, CheckCircle, Target, Heart, Lightbulb } from "lucide-react";
import honeycombLogo from "@assets/honeycomb_1753116372462.png";
import platformScreenshot from "@assets/image_1753357343185.png";
import bbcLogo from "@assets/image_1753303879889.png";
import timesLogo from "@assets/image_1753303894280.png";
import fastCompanyLogo from "@assets/image_1753303914295.png";
import businessInsiderLogo from "@assets/image_1753303943999.png";
import stylistLogo from "@assets/image_1753303963933.png";
import nyPostLogo from "@assets/image_1753303981878.png";

export default function Landing() {
  const handleExploreDemo = async () => {
    try {
      // Call the demo login API endpoint for job seeker
      const response = await fetch("/api/demo-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: "job_seeker" }),
      });

      if (response.ok) {
        window.location.href = "/home";
      } else {
        console.error("Demo login failed");
      }
    } catch (error) {
      console.error("Error during demo login:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center p-1">
              <img src={honeycombLogo} alt="Pollen" className="w-full h-full object-contain" />
            </div>
            <span className="text-xl font-bold" style={{fontFamily: 'Sora', color: '#272727'}}>Pollen</span>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href="/employers" 
              className="text-gray-600 hover:text-gray-900 text-sm hidden sm:inline"
            >
              Employers? <span className="text-pink-600">Learn More →</span>
            </a>
            <Button 
              onClick={handleExploreDemo}
              className="bg-pink-600 hover:bg-pink-700 text-white"
              style={{fontFamily: 'Sora'}}
            >
              Explore Demo
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6" style={{fontFamily: 'Sora'}}>
            👋 Your career starts here —<br />
            no CV required.
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto" style={{fontFamily: 'Poppins'}}>
            Discover your strengths and connect with inclusive employers who look beyond the CV. 
            Pollen helps you get hired through real skills, behavioural insights, and community support.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              onClick={handleExploreDemo}
              size="lg" 
              className="bg-pink-600 hover:bg-pink-700 text-white px-12 py-4 text-lg"
              style={{fontFamily: 'Sora'}}
            >
              Explore Demo
            </Button>
          </div>

          {/* Secondary CTA for employers */}
          <div className="bg-yellow-50 rounded-lg p-6 max-w-md mx-auto mb-16">
            <p className="text-gray-700 mb-3" style={{fontFamily: 'Poppins'}}>
              <strong>Want to hire more inclusively?</strong>
            </p>
            <a 
              href="/employers"
              className="text-pink-600 hover:text-pink-700 font-medium"
            >
              Join our employer community →
            </a>
          </div>

          {/* Platform Screenshot - Enhanced Laptop Mockup */}
          <div className="max-w-4xl mx-auto px-4 mb-8">
            <div className="relative perspective-1000">
              {/* Laptop Shadow */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-black/20 blur-2xl transform translate-y-8 scale-110"></div>
              
              {/* Main Laptop Container */}
              <div className="relative">
                {/* Laptop Screen */}
                <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-t-2xl p-3 shadow-2xl border border-gray-600">
                  {/* Screen Bezel */}
                  <div className="bg-black rounded-lg p-4 relative overflow-hidden">
                    {/* Subtle Screen Reflection */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none"></div>
                    
                    {/* Browser Chrome */}
                    <div className="flex items-center justify-between mb-3 bg-gray-100 rounded-t-md px-4 py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <div className="flex-1 mx-4">
                        <div className="bg-white rounded-md px-3 py-1 text-xs text-gray-600 border border-gray-200">
                          pollen.careers
                        </div>
                      </div>
                      <div className="w-16"></div>
                    </div>
                    
                    {/* Screen Content */}
                    <div className="bg-white rounded-b-md overflow-hidden shadow-inner" style={{aspectRatio: '16/10'}}>
                      <img 
                        src={platformScreenshot} 
                        alt="Pollen Platform Demo" 
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Laptop Base */}
                <div className="bg-gradient-to-b from-gray-700 to-gray-800 h-6 rounded-b-2xl border-x border-b border-gray-600 relative">
                  {/* Keyboard Area */}
                  <div className="absolute inset-x-2 top-1 bottom-2 bg-gray-800 rounded-lg"></div>
                  {/* Trackpad */}
                  <div className="absolute left-1/2 top-2 transform -translate-x-1/2 w-16 h-3 bg-gray-700 rounded border border-gray-600"></div>
                </div>
                
                {/* Laptop Stand/Hinge */}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-3 bg-gradient-to-b from-gray-600 to-gray-700 rounded-full shadow-md"></div>
              </div>
              
              {/* Desktop Surface Reflection */}
              <div className="absolute inset-x-0 -bottom-8 h-32 bg-gradient-to-t from-gray-100/30 to-transparent blur-sm"></div>
            </div>
          </div>
        </div>
      </div>

      {/* As Featured In */}
      <div className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600 mb-6" style={{fontFamily: 'Poppins'}}>As Featured In</p>
            <div className="flex flex-nowrap justify-center items-center gap-6 md:gap-8 opacity-100 overflow-x-auto">
              <img src={bbcLogo} alt="BBC" className="h-8 object-contain flex-shrink-0" />
              <img src={timesLogo} alt="The Times" className="h-20 object-contain flex-shrink-0" />
              <img src={fastCompanyLogo} alt="FastCompany" className="h-8 object-contain flex-shrink-0" />
              <img src={businessInsiderLogo} alt="Business Insider" className="h-8 object-contain flex-shrink-0" />
              <img src={stylistLogo} alt="Stylist" className="h-8 object-contain flex-shrink-0" />
              <img src={nyPostLogo} alt="New York Post" className="h-8 object-contain flex-shrink-0" />
            </div>
          </div>
        </div>
      </div>

      {/* Feature Cards - 4 across */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-pink-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2" style={{fontFamily: 'Sora'}}>
                  Community Support
                </h3>
                <p className="text-gray-600 text-sm" style={{fontFamily: 'Poppins'}}>
                  Get access to events, resources, and actual humans who want to help you grow.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <Code className="h-12 w-12 text-pink-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2" style={{fontFamily: 'Sora'}}>
                  Skills Verification
                </h3>
                <p className="text-gray-600 text-sm" style={{fontFamily: 'Poppins'}}>
                  Prove your strengths with hands-on challenges designed to show—not just tell.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <Trophy className="h-12 w-12 text-pink-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2" style={{fontFamily: 'Sora'}}>
                  Behavioural Insights
                </h3>
                <p className="text-gray-600 text-sm" style={{fontFamily: 'Poppins'}}>
                  Understand your unique work style and what environments help you thrive.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <Briefcase className="h-12 w-12 text-pink-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2" style={{fontFamily: 'Sora'}}>
                  Inclusive Employers
                </h3>
                <p className="text-gray-600 text-sm" style={{fontFamily: 'Poppins'}}>
                  Be seen by entry-level friendly companies committed to fair hiring and potential-driven growth.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4" style={{fontFamily: 'Sora'}}>
              How It Works
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-pink-600" style={{fontFamily: 'Sora'}}>1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3" style={{fontFamily: 'Sora'}}>
                Create Your Profile
              </h3>
              <p className="text-gray-600" style={{fontFamily: 'Poppins'}}>
                Assess your strengths, tell us about your interests, and we'll help you discover what makes you unique.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-yellow-600" style={{fontFamily: 'Sora'}}>2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3" style={{fontFamily: 'Sora'}}>
                Prove What You're Great At
              </h3>
              <p className="text-gray-600" style={{fontFamily: 'Poppins'}}>
                Complete skills-based challenges designed to help you learn, with guaranteed feedback along the way.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600" style={{fontFamily: 'Sora'}}>3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3" style={{fontFamily: 'Sora'}}>
                Get Matched with Jobs
              </h3>
              <p className="text-gray-600" style={{fontFamily: 'Poppins'}}>
                Receive opportunities from employers who hire for potential and value what you bring.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Stories */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4" style={{fontFamily: 'Sora'}}>
              Success Stories
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <blockquote className="text-gray-700 mb-4" style={{fontFamily: 'Poppins'}}>
                  "From the very first task-based assignment, I knew I had found something special. The team's feedback and communication were exceptional, and their friendliness and supportiveness made the experience even better. Thanks to Pollen, my confidence during my job search has significantly improved. In fact, I found my current job advertised through Pollen. I can't recommend Pollen enough – they truly are a game-changer."
                </blockquote>
                <cite className="text-pink-600 font-medium" style={{fontFamily: 'Sora'}}>— Gabby</cite>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <blockquote className="text-gray-700 mb-4" style={{fontFamily: 'Poppins'}}>
                  "During an interview, I was once told that my CV poorly reflected who I am as a person and the value I could bring to a role. It became clear that the issue wasn't my skills or the demand for someone like me – it was miscommunication. That's where Pollen made a difference for me. They gave me an opportunity to show my potential in real-life scenarios directly relevant to the role."
                </blockquote>
                <cite className="text-pink-600 font-medium" style={{fontFamily: 'Sora'}}>— Sanelisa</cite>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Start Your Journey CTA */}
      <div className="bg-pink-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4" style={{fontFamily: 'Sora'}}>
            Ready to explore what you're capable of?
          </h2>
          <p className="text-pink-100 mb-8 text-lg" style={{fontFamily: 'Poppins'}}>
            💡 No CVs. No pressure. Just your skills and potential.
          </p>
          
          <Button 
            onClick={handleExploreDemo}
            size="lg"
            className="bg-white text-pink-600 hover:bg-gray-100 px-12 py-4 text-lg"
            style={{fontFamily: 'Sora'}}
          >
            Explore Demo
          </Button>
        </div>
      </div>

      {/* Employers Section */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4" style={{fontFamily: 'Sora'}}>
            Employers – Learn More
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto" style={{fontFamily: 'Poppins'}}>
            Want to hire more inclusively and access top early-career talent with verified skills? 
            Pollen helps you reduce bias, improve retention, and make hiring more human.
          </p>
          
          <div className="flex justify-center">
            <Button 
              onClick={() => window.location.href = "/employers"}
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg border-gray-300"
              style={{fontFamily: 'Sora'}}
            >
              Go to Employer Page →
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center md:relative">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center p-1">
                <img src={honeycombLogo} alt="Pollen" className="w-full h-full object-contain" />
              </div>
              <span className="text-xl font-bold" style={{fontFamily: 'Sora'}}>Pollen</span>
            </div>
            <div className="text-center md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
              <p className="text-gray-400" style={{fontFamily: 'Poppins'}}>
                Find where you belong.
              </p>
            </div>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}