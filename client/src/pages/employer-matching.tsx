import { useState, useEffect } from "react";
import NewEmployerMatchingDashboard from "@/components/employer/NewEmployerMatchingDashboard";

export default function EmployerMatching() {
  const [jobData, setJobData] = useState<any>(null);

  useEffect(() => {
    // Load job posting data from comprehensive job posting flow
    const savedJobData = localStorage.getItem('completeJobFormData');
    if (savedJobData) {
      const jobInfo = JSON.parse(savedJobData);
      setJobData(jobInfo);
    }
  }, []);

  const handleComplete = (finalData: any) => {
    // Save the complete matching configuration
    localStorage.setItem('employerMatchingConfig', JSON.stringify(finalData));
    
    // Navigate to admin review waiting page or dashboard
    window.location.href = '/employer-dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NewEmployerMatchingDashboard
        jobData={jobData}
        onComplete={handleComplete}
      />
    </div>
  );
}