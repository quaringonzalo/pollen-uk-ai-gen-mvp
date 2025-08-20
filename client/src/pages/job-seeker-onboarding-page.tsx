import { useState } from "react";
import JobSeekerOnboarding from "@/components/job-seeker-onboarding";

export default function JobSeekerOnboardingPage() {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleOnboardingComplete = (data: any) => {
    setIsCompleted(true);
    // Redirect to dashboard or show success message
    window.location.href = "/";
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-green-600 mb-4">Welcome to Pollen!</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Your profile has been created. You'll be redirected to your dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <JobSeekerOnboarding onComplete={handleOnboardingComplete} />
    </div>
  );
}