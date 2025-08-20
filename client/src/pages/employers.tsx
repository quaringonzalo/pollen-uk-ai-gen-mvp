import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Users, Target, Briefcase, Heart, Star } from "lucide-react";
import { useEffect } from "react";
import honeycombLogo from "@assets/honeycomb_1753116372462.png";
import octopusLogo from "@assets/image_1753359166464.png";
import royalFoundationLogo from "@assets/image_1753359213457.png";
import fourmostLogo from "@assets/image_1753359238238.png";
import handInHandLogo from "@assets/image_1753359252586.png";
import monzoLogo from "@assets/image_1753359312365.png";
import cawstonLogo from "@assets/image_1753359325185.png";
import december19Logo from "@assets/image_1753359349125.png";
import encoreLogo from "@assets/image_1753359364751.png";
import reptLogo from "@assets/image_1753359383996.png";
import ospreyLogo from "@assets/image_1753359421354.png";
import clearChannelLogo from "@assets/image_1753359442682.png";
import k7mediaLogo from "@assets/image_1753360445491.png";
import myBigCareerLogo from "@assets/image_1753360420836.png";
import cubittsLogo from "@assets/image_1753360492825.png";
import intouniversityLogo from "@assets/image_1753360536562.png";
import bbcLogo from "@assets/image_1753303879889.png";
import timesLogo from "@assets/image_1753303894280.png";
import fastCompanyLogo from "@assets/image_1753303914295.png";
import businessInsiderLogo from "@assets/image_1753303943999.png";
import stylistLogo from "@assets/image_1753303963933.png";
import nyPostLogo from "@assets/image_1753303981878.png";
import davidGrahamPhoto from "@assets/David Graham_1753361582133.jpg";
import pollenEventPhoto from "@assets/pollen-event-photo.jpg";

export default function EmployersPage() {
  const handleBookCall = () => {
    // Redirect to booking consultation page
    window.location.href = '/book-consultation';
  };

  const handleJoinCommunity = () => {
    // Redirect to employer community signup
    window.location.href = '/employer-signup';
  };

  // Load Senja widget
  useEffect(() => {
    const loadSenjaWidget = () => {
      // Create and load the Senja script
      const script = document.createElement('script');
      script.src = 'https://widget.senja.io/widget/ad1896d2-bb54-4413-b0d5-17932cc74751/platform.js';
      script.type = 'text/javascript';
      script.async = true;
      script.id = 'senja-widget-script';
      
      script.onload = () => {
        console.log('Senja widget script loaded successfully');
        // Force widget to render
        setTimeout(() => {
          const embedElement = document.querySelector('.senja-embed');
          if (embedElement && window.SenjaEmbed) {
            window.SenjaEmbed.render(embedElement);
          }
        }, 1000);
      };
      
      script.onerror = () => {
        console.error('Failed to load Senja widget script');
      };

      // Only add if not already present
      if (!document.getElementById('senja-widget-script')) {
        document.head.appendChild(script);
      }
    };

    loadSenjaWidget();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center p-1">
                <img src={honeycombLogo} alt="Pollen" className="w-full h-full object-contain" />
              </div>
              <span className="text-xl font-bold" style={{fontFamily: 'Sora', color: '#272727'}}>Pollen</span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/">
              <span className="text-gray-600 hover:text-gray-900 text-sm hidden sm:inline cursor-pointer">
                Job Seekers? <span className="text-pink-600">Learn More →</span>
              </span>
            </Link>
            <Button 
              onClick={() => window.location.href = '/employer-dashboard'}
              variant="outline"
              className="border-pink-600 text-pink-600 hover:bg-pink-50"
              style={{fontFamily: 'Sora'}}
            >
              View Demo
            </Button>
            <Button 
              onClick={handleJoinCommunity}
              className="bg-pink-600 hover:bg-pink-700 text-white"
              style={{fontFamily: 'Sora'}}
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6" style={{fontFamily: 'Sora'}}>
            🎉 Finally — a smarter way to hire early career talent.
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto" style={{fontFamily: 'Poppins'}}>
            Reduce bias, improve retention, and hire the talent your CV screen ignores. Pollen helps you find early-career candidates who are verified, values-aligned, and ready to grow.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              onClick={handleJoinCommunity}
              size="lg" 
              className="bg-pink-600 hover:bg-pink-700 text-white px-12 py-4 text-lg"
              style={{fontFamily: 'Sora'}}
            >
              Get Started
            </Button>
            <Link href="/employer-dashboard">
              <Button 
                size="lg" 
                variant="outline"
                className="border-pink-600 text-pink-600 hover:bg-pink-50 px-12 py-4 text-lg"
                style={{fontFamily: 'Sora'}}
              >
                View Demo
              </Button>
            </Link>
          </div>
        </div>

        {/* Success Story */}
        <div className="bg-yellow-50 py-16 rounded-2xl mb-16 shadow-xl border-2 border-yellow-200">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="mb-8">
              <div className="w-16 h-1 bg-pink-600 mx-auto mb-6"></div>
              <blockquote className="text-lg md:text-xl font-medium text-gray-900 mb-8 leading-relaxed" style={{fontFamily: 'Poppins'}}>
                "Pollen fundamentally changed our hiring process. We've flipped our org chart, created development programmes, and built future plans around this new mindset. The interns we hired are now permanent and game-changing team members 12 months later."
              </blockquote>
            </div>
            <div className="flex items-center justify-center gap-4">
              <img 
                src={davidGrahamPhoto} 
                alt="David Graham" 
                className="w-16 h-16 rounded-full object-cover border-3 border-pink-600 shadow-lg"
              />
              <div className="text-left">
                <div className="font-bold text-gray-900 text-lg" style={{fontFamily: 'Sora'}}>David Graham</div>
                <div className="text-pink-600 font-semibold" style={{fontFamily: 'Poppins'}}>COO, Mobsta</div>
              </div>
            </div>
          </div>
        </div>

        {/* As Featured In */}
        <div className="py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-gray-600 mb-6" style={{fontFamily: 'Poppins'}}>As Featured In</p>
              <div className="flex flex-nowrap justify-center items-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 opacity-100 max-w-5xl mx-auto">
                <img src={bbcLogo} alt="BBC" className="h-5 sm:h-6 md:h-7 object-contain flex-shrink-0" />
                <img src={timesLogo} alt="The Times" className="h-12 sm:h-16 md:h-20 object-contain flex-shrink-0" />
                <img src={fastCompanyLogo} alt="FastCompany" className="h-5 sm:h-6 md:h-7 object-contain flex-shrink-0" />
                <img src={businessInsiderLogo} alt="Business Insider" className="h-5 sm:h-6 md:h-7 object-contain flex-shrink-0" />
                <img src={stylistLogo} alt="Stylist" className="h-5 sm:h-6 md:h-7 object-contain flex-shrink-0" />
                <img src={nyPostLogo} alt="New York Post" className="h-5 sm:h-6 md:h-7 object-contain flex-shrink-0" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Stats */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-pink-600">
              <div className="text-4xl font-bold text-pink-600 mb-3" style={{fontFamily: 'Sora'}}>99%</div>
              <p className="text-gray-700 font-medium" style={{fontFamily: 'Poppins'}}>of Pollen hires pass their probationary period</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-pink-600">
              <div className="text-4xl font-bold text-pink-600 mb-3" style={{fontFamily: 'Sora'}}>9x</div>
              <p className="text-gray-700 font-medium" style={{fontFamily: 'Poppins'}}>faster shortlisting process compared to traditional hiring</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-pink-600">
              <div className="text-4xl font-bold text-pink-600 mb-3" style={{fontFamily: 'Sora'}}>50%+</div>
              <p className="text-gray-700 font-medium" style={{fontFamily: 'Poppins'}}>of talent identify with underrepresented groups</p>
            </div>
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

          <div className="grid md:grid-cols-3 gap-16 lg:gap-20">
            <div className="text-center px-4">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-pink-600" style={{fontFamily: 'Sora'}}>1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4" style={{fontFamily: 'Sora'}}>
                Tell us what you're<br />looking for
              </h3>
              <p className="text-gray-600" style={{fontFamily: 'Poppins'}}>
                We help you to define the ideal candidate profile, discovering what truly matters for success in the role.
              </p>
            </div>

            <div className="text-center px-4">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-yellow-600" style={{fontFamily: 'Sora'}}>2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4" style={{fontFamily: 'Sora'}}>
                We shortlist verified talent
              </h3>
              <p className="text-gray-600" style={{fontFamily: 'Poppins'}}>
                All candidates complete hands-on challenges and a behavioural assessment before your team sees them.
              </p>
            </div>

            <div className="text-center px-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-green-600" style={{fontFamily: 'Sora'}}>3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4" style={{fontFamily: 'Sora'}}>
                You hire with confidence
              </h3>
              <p className="text-gray-600" style={{fontFamily: 'Poppins'}}>
                Your team interviews only those who've proven potential and fit while we handle the admin.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Why Employers Work With Us */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4" style={{fontFamily: 'Sora'}}>
              Why Employers Work With Us
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-12 w-12 text-pink-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2" style={{fontFamily: 'Sora'}}>
                  Verified Skills
                </h3>
                <p className="text-gray-600 text-sm" style={{fontFamily: 'Poppins'}}>
                  Candidates complete role-specific skills tasks before you're ever introduced.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <Target className="h-12 w-12 text-pink-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2" style={{fontFamily: 'Sora'}}>
                  Values Alignment
                </h3>
                <p className="text-gray-600 text-sm" style={{fontFamily: 'Poppins'}}>
                  Our behavioural assessment ensures values and work style compatibility.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-pink-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2" style={{fontFamily: 'Sora'}}>
                  Diverse Pipeline
                </h3>
                <p className="text-gray-600 text-sm" style={{fontFamily: 'Poppins'}}>
                  We focus on potential, not pedigree. We're on a mission to change who gets hired, and how.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <Briefcase className="h-12 w-12 text-pink-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2" style={{fontFamily: 'Sora'}}>
                  Flexible Solutions
                </h3>
                <p className="text-gray-600 text-sm" style={{fontFamily: 'Poppins'}}>
                  Our community of 10,000 are looking for full-time, part-time, or internship opportunities.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <Heart className="h-12 w-12 text-pink-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2" style={{fontFamily: 'Sora'}}>
                  Human Support
                </h3>
                <p className="text-gray-600 text-sm" style={{fontFamily: 'Poppins'}}>
                  Our team works with you directly to ensure the process is seamless and values-led.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Trusted by Employers */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8" style={{fontFamily: 'Sora'}}>
              Trusted by Employers Like:
            </h2>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 items-center opacity-90">
              {/* Actual company logos */}
              <div className="flex justify-center items-center h-16">
                <img src={octopusLogo} alt="Octopus Electric Vehicles" className="max-h-12 max-w-full object-contain" />
              </div>
              <div className="flex justify-center items-center h-16">
                <img src={royalFoundationLogo} alt="Royal Foundation" className="max-h-12 max-w-full object-contain" />
              </div>
              <div className="flex justify-center items-center h-16">
                <img src={fourmostLogo} alt="4most Analytics" className="max-h-12 max-w-full object-contain" />
              </div>
              <div className="flex justify-center items-center h-16">
                <img src={handInHandLogo} alt="Hand in Hand International" className="max-h-12 max-w-full object-contain" />
              </div>
              <div className="flex justify-center items-center h-16">
                <img src={monzoLogo} alt="Monzo" className="max-h-12 max-w-full object-contain" />
              </div>
              <div className="flex justify-center items-center h-16">
                <img src={cawstonLogo} alt="Cawston Press" className="max-h-12 max-w-full object-contain" />
              </div>
              <div className="flex justify-center items-center h-16">
                <img src={december19Logo} alt="December19" className="max-h-12 max-w-full object-contain" />
              </div>
              <div className="flex justify-center items-center h-16">
                <img src={encoreLogo} alt="Encore" className="max-h-12 max-w-full object-contain" />
              </div>
              <div className="flex justify-center items-center h-16">
                <img src={reptLogo} alt="REPT" className="max-h-12 max-w-full object-contain" />
              </div>
              <div className="flex justify-center items-center h-16">
                <img src={ospreyLogo} alt="Osprey" className="max-h-12 max-w-full object-contain" />
              </div>
              <div className="flex justify-center items-center h-16">
                <img src={clearChannelLogo} alt="Clear Channel" className="max-h-12 max-w-full object-contain" />
              </div>
              <div className="flex justify-center items-center h-16">
                <img src={k7mediaLogo} alt="K7 Media" className="max-h-12 max-w-full object-contain" />
              </div>
              <div className="flex justify-center items-center h-16">
                <img src={myBigCareerLogo} alt="MyBigCareer" className="max-h-12 max-w-full object-contain" />
              </div>
              <div className="flex justify-center items-center h-16">
                <img src={cubittsLogo} alt="Cubitts" className="max-h-12 max-w-full object-contain" />
              </div>
              <div className="flex justify-center items-center h-16">
                <img src={intouniversityLogo} alt="IntoUniversity" className="max-h-12 max-w-full object-contain" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Stories */}
      <div className="bg-yellow-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8" style={{fontFamily: 'Sora'}}>
              What Employers Say
            </h2>
            <div className="mb-6">
              <div className="senja-embed" data-id="ad1896d2-bb54-4413-b0d5-17932cc74751" data-mode="shadow" data-lazyload="false" style={{display: 'block', width: '100%', minHeight: '400px'}}></div>
            </div>
          </div>
        </div>
      </div>

      {/* What Makes Pollen Different */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6" style={{fontFamily: 'Sora'}}>
                We don't just help you hire faster or cheaper — we help you hire better.
              </h2>
              <div className="space-y-4 text-gray-700" style={{fontFamily: 'Poppins'}}>
                <p className="leading-relaxed">
                  Every candidate we put forward has been skills-tested, personally supported, and chosen for their potential to thrive in your environment. No endless CV trawling. No AI-generated cover letters. Just real people, ready to add real value.
                </p>
                <p className="leading-relaxed">
                  We're tech-enabled, but proudly human-first. Every job seeker speaks to a member of our team, receives feedback on their application, and builds trust with the process — so by the time they meet you, they're engaged, informed, and ready to perform.
                </p>
                <p className="leading-relaxed font-medium text-gray-900">
                  We're not here to flood your inbox with applicants — we're here to raise the bar on what a shortlist should look like.
                </p>
              </div>
            </div>

            {/* Image */}
            <div className="order-first lg:order-last">
              <div className="relative">
                <img 
                  src={pollenEventPhoto} 
                  alt="Pollen community event with panel discussion and engaged audience" 
                  className="w-full h-auto rounded-2xl shadow-xl object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6" style={{fontFamily: 'Sora'}}>
            Ready to hire for potential?
          </h2>
          <p className="text-lg text-gray-600 mb-8" style={{fontFamily: 'Poppins'}}>
            Explore our platform with a full demo experience, or get started with your enquiry.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              onClick={() => window.location.href = '/employer-dashboard'}
              size="lg" 
              variant="outline"
              className="border-pink-600 text-pink-600 hover:bg-pink-50 px-12 py-4 text-lg"
              style={{fontFamily: 'Sora'}}
            >
              View Demo
            </Button>
            <Button 
              onClick={handleJoinCommunity}
              size="lg" 
              className="bg-pink-600 hover:bg-pink-700 text-white px-12 py-4 text-lg"
              style={{fontFamily: 'Sora'}}
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center p-1">
                  <img src={honeycombLogo} alt="Pollen" className="w-full h-full object-contain" />
                </div>
                <span className="text-xl font-bold" style={{fontFamily: 'Sora'}}>Pollen</span>
              </div>
              <p className="text-gray-400 text-sm" style={{fontFamily: 'Poppins'}}>
                Skills-first hiring for inclusive employers.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4" style={{fontFamily: 'Sora'}}>For Employers</h4>
              <ul className="space-y-2 text-sm text-gray-400" style={{fontFamily: 'Poppins'}}>
                <li><a href="/employer-enquiry" className="hover:text-white">Complete Enquiry Form</a></li>
                <li><a href="/employer-signup" className="hover:text-white">Join Community</a></li>
                <li><a href="/pricing" className="hover:text-white">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4" style={{fontFamily: 'Sora'}}>For Job Seekers</h4>
              <ul className="space-y-2 text-sm text-gray-400" style={{fontFamily: 'Poppins'}}>
                <li><Link href="/" className="hover:text-white">Explore Demo</Link></li>
                <li><a href="/community" className="hover:text-white">Community</a></li>
                <li><a href="/bootcamp-interest" className="hover:text-white">Pollen Reboot</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4" style={{fontFamily: 'Sora'}}>Company</h4>
              <ul className="space-y-2 text-sm text-gray-400" style={{fontFamily: 'Poppins'}}>
                <li><a href="/about" className="hover:text-white">About</a></li>
                <li><a href="/contact" className="hover:text-white">Contact</a></li>
                <li><a href="/privacy" className="hover:text-white">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm" style={{fontFamily: 'Poppins'}}>
              © 2025 Pollen. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}