import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import WorkingForm from "@/components/working-form";
import honeycombLogo from "@assets/honeycomb_1753116372462.png";

export default function EmployerSignupPage() {
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
            <Link href="/employers">
              <span className="text-gray-600 hover:text-gray-900 cursor-pointer" style={{fontFamily: 'Sora'}}>
                ← Go back
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Header Section */}
      <div className="bg-gradient-to-r from-pink-50 to-yellow-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4" style={{fontFamily: 'Sora'}}>
            Apply to Join Pollen
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto" style={{fontFamily: 'Poppins'}}>
            Submit your application to access our verified talent community. We review all applications to ensure quality matches for both candidates and employers. If your application is approved, creating your profile is completely free.
          </p>
        </div>
      </div>

      {/* Application Form */}
      <div className="py-8">
        <WorkingForm />
      </div>

      {/* Footer */}
      <div className="bg-gray-50 py-8 border-t">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-600" style={{fontFamily: 'Poppins'}}>
            Questions about the application process? <Link href="/employers" className="text-pink-600 hover:text-pink-700">Contact our team</Link>
          </p>
        </div>
      </div>
    </div>
  );
}