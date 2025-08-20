import { Switch, Route } from "wouter";
import { lazy, Suspense } from "react";
import WorkingChallenges from "./pages/working-challenges";
import ChallengeDemo from "./pages/challenge-demo";
import UserProfile from "./pages/user-profile";
import ProfilePrintView from "./pages/profile-print-view";
import CandidateProfilePrint from "./pages/candidate-profile-print";
import StandaloneCandidatePrint from "./pages/standalone-candidate-print";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import JobSeekerDashboard from "@/pages/job-seeker-dashboard";
import EmployerDashboard from "@/pages/employer-dashboard";
import AdminDashboard from "@/pages/admin-dashboard";
import JobSeekerOnboardingPage from "@/pages/job-seeker-onboarding-page";
import InteractiveSkillRadar from "@/components/interactive-skill-radar";
import EnhancedSkillsLibrary from "@/components/enhanced-skills-library";
import NotFound from "@/pages/not-found";
import EmployerApplication from "@/components/employer-application";
import JobSeekerSignup from "@/pages/job-seeker-signup-clean";
import ComprehensiveOnboardingV2 from "@/pages/comprehensive-onboarding-v2";
import JobRecommendations from "@/pages/job-recommendations";
import SavedItems from "@/pages/saved-items";
import JobApplication from "@/pages/job-application";
import JobApplicationPremiumPage from "@/pages/job-application-premium";
import SimplifiedJobApplication from "@/pages/simplified-job-application";
import SimplifiedJobSeekerDashboard from "@/pages/simplified-job-seeker-dashboard";
import ApplicationResponse from "@/pages/application-response";
import ApplicationTracker from "@/pages/application-tracker";
import Applications from "@/pages/applications";
import CompanyChallenge from "@/pages/company-challenge";
import Notifications from "@/pages/notifications";
import Mentoring from "@/pages/mentoring";
import MentorDirectory from "@/pages/mentor-directory";

import Chat from "@/pages/chat";
import Events from "@/pages/events";
import WeeklyDropIn from "@/pages/weekly-drop-in";
import JoinEvent from "@/pages/join-event";

import Messages from "@/pages/messages";
import Settings from "@/pages/settings";
import Companies from "@/pages/companies";
import CompanyProfile from "@/pages/company-profile";
import Community from "@/pages/community";
import SkillsChallenge from "@/pages/skills-challenge";
import ComprehensiveAssessment from "@/pages/comprehensive-assessment";
import JobMatchingAlgorithm from "@/pages/job-matching-algorithm";
import EnhancedOnboarding from "@/pages/enhanced-onboarding";
import EmployerProfileSetup from "@/pages/employer-profile-setup";
import EmployerTestimonials from "@/pages/employer-testimonials";
import EmployerRecognition from "@/pages/employer-recognition";
import EmployerProgrammes from "@/pages/employer-programmes";
import EmployerPhotos from "@/pages/employer-photos";
import EmployerProfileCheckpoints from "@/pages/employer-profile-checkpoints-simplified";
import EmployerProfileConsolidated from "@/pages/employer-profile-consolidated";
import EmployerContactSetup from "@/pages/employer-contact-setup";
import JobCandidateMatches from "@/pages/job-candidate-matches";
import CandidateNextSteps from "@/pages/candidate-next-steps";
import CandidateStatusSummary from "@/pages/candidate-status-summary";
import InterviewScheduleDetail from "@/pages/interview-schedule-detail";
import JobPostingView from "@/pages/job-posting-view";

import AdminCompanyReviews from "@/pages/admin-company-reviews";
import AdminEmployers from "@/pages/admin-employers";
import AdminEmployerReview from "@/pages/admin-employer-review";
import AdminJobs from "@/pages/admin-jobs";
import AdminJobReview from "@/pages/admin-job-review";
import AdminJobApplicantsGrid from "@/pages/admin-job-applicants-grid";
import AdminJobApplicantsKanban from "@/pages/admin-job-applicants-kanban";
import AdminAssignedJobs from "@/pages/admin-assigned-jobs";
import AdminAssessmentReview from "@/pages/admin-assessment-review-simple";
import AdminCandidateProfile from "@/pages/admin-candidate-profile";
import AdminAnalytics from "@/pages/admin-analytics";
import ComprehensiveAnalytics from "@/pages/comprehensive-analytics";
import HiddenJobs from "@/pages/hidden-jobs";
import Jobs from "@/pages/jobs";
import AdminHiddenJobs from "@/pages/admin-hidden-jobs";
import AdminNotifications from "@/pages/admin-notifications";
import AdminMessages from "@/pages/admin-messages";
import AdminInterviewDetails from "@/pages/admin-interview-details";
import AdminCandidateTimeline from "@/pages/admin-candidate-timeline";
import AdminInterviewAvailability from "@/pages/admin-interview-availability";
import AdminCandidateActionTimeline from "@/pages/admin-candidate-action-timeline";
import AdminProvideUpdate from "@/pages/admin-provide-update";
import AdminAllJobSeekers from "@/pages/admin-all-job-seekers";
import AdminCalendly from "@/pages/admin-calendly";
import JobPosting from "@/pages/job-posting";
import EmployerBundleSelection from "@/pages/employer-bundle-selection";
import ComprehensiveJobPosting from "@/pages/comprehensive-job-posting";
import { JobMatchingSetup } from "@/pages/job-matching-setup";
import BehaviouralAssessment from "@/pages/behavioral-assessment";
import TempHiringRedirect from "@/pages/temp-hiring-redirect";
import PackageCheckout from "@/pages/package-checkout";
import FullyManagedConsultation from "@/pages/fully-managed-consultation";
import PaymentComplete from "@/pages/payment-complete";
import EmployerBundleDetails from "@/pages/employer-bundle-details";
import ApplicantsPage from "@/pages/applicants";
import EmployerMessagesPage from "@/pages/employer-messages";
import JobPostingDetailPage from "@/pages/job-posting-detail";
import CandidateManagement from "@/pages/candidate-management";
import CandidateManagementStandalone from "@/pages/candidate-management-standalone";
import EmployerAddonSelection from "@/pages/employer-addon-selection";
import FractionalTalentService from "@/pages/fractional-talent-service";
import FreelanceConsultation from "@/pages/freelance-consultation";
import ProfileCheckpoints from "@/pages/profile-checkpoints";
import EmployerMatching from "@/pages/employer-matching";
import HiringProcessDashboard from "@/pages/hiring-process-dashboard";

import ApplicationFeedback from "@/pages/application-feedback";
import ApplicationDetail from "@/pages/application-detail";
import ApplicationSuccess from "@/components/application-success";
import SimplifiedServiceSelection from "@/pages/simplified-service-selection";
import PaymentCheckout from "@/pages/payment-checkout";
import InterviewSchedule from "@/pages/interview-schedule";
import InterviewDetails from "@/pages/interview-details";
import InterviewSchedulingForm from "@/pages/interview-scheduling-form";
import EmployersPage from "@/pages/employers";
import EmployerSignupPage from "@/pages/employer-signup";

import InterviewScheduleOverview from "@/pages/interview-schedule-overview";
import InterviewConfirmation from "@/pages/interview-confirmation";
import FeedbackForm from "@/pages/feedback-form";
import OutcomeTrackingPage from "@/pages/outcome-tracking";
import EmployerMessages from "@/pages/employer-messages";
import EmployerCandidateMessages from "@/pages/employer-candidate-messages";
import JobAcceptance from "@/pages/job-acceptance";
import EmployerAccountSettings from "@/pages/employer-account-settings";
import PersonalSettings from "@/pages/personal-settings";

import Layout from "@/components/layout";
import { BootcampInterest } from "@/pages/bootcamp-interest";
import EmployerInsights from "@/pages/employer-insights";
import Applicants from "@/pages/applicants";
import CandidateListView from "@/pages/candidate-list-view";
import CandidateDetailView from "@/pages/candidate-detail-view";

import ProvideInterviewUpdate from "@/pages/provide-interview-update";
import MonitorOffer from "@/pages/monitor-offer";
import SendMessage from "@/pages/send-message";

function Router() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [location] = useLocation();

  // Check if this is a print route that should bypass Layout completely
  const isPrintRoute = location.startsWith('/candidate-profile-print') || 
                       location.startsWith('/standalone-candidate-print') ||
                       location === '/profile-print' || 
                       location === '/profile-print-view';
  
  console.log('🔍 Router Debug:', { location, isPrintRoute });

  if (isPrintRoute) {
    return (
      <Switch>
        <Route path="/candidate-profile-print/:candidateId" component={CandidateProfilePrint} />
        <Route path="/standalone-candidate-print/:candidateId" component={StandaloneCandidatePrint} />
        <Route path="/profile-print" component={ProfilePrintView} />
        <Route path="/profile-print-view" component={ProfilePrintView} />
      </Switch>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Layout>
      <Switch>
        {/* Public routes */}
        <Route path="/job-seeker-signup" component={JobSeekerSignup} />
        <Route path="/job-seeker-dashboard" component={JobSeekerDashboard} />
        <Route path="/employer-application">
          <EmployerApplication onComplete={() => setLocation('/employer-dashboard')} />
        </Route>
        <Route path="/job-posting" component={JobPosting} />
        <Route path="/employer-bundle-selection" component={EmployerBundleSelection} />
        <Route path="/simplified-service-selection" component={SimplifiedServiceSelection} />
        <Route path="/payment-checkout" component={PaymentCheckout} />
        <Route path="/package-checkout" component={PackageCheckout} />
        <Route path="/fully-managed-consultation" component={FullyManagedConsultation} />
        <Route path="/payment-complete" component={PaymentComplete} />
        <Route path="/comprehensive-job-posting" component={ComprehensiveJobPosting} />
        <Route path="/job-posting-view/:jobId" component={JobPostingView} />
        <Route path="/job-candidate-matches/:id" component={JobCandidateMatches} />
        <Route path="/candidate-next-steps/:candidateId" component={CandidateNextSteps} />
        <Route path="/candidate-status/:candidateId" component={CandidateStatusSummary} />
        <Route path="/interview-schedule-detail/:candidateId" component={InterviewScheduleDetail} />
        <Route path="/employer-bundle-details" component={EmployerBundleDetails} />
        <Route path="/employer-addon-selection" component={EmployerAddonSelection} />
        <Route path="/fractional-talent-service" component={FractionalTalentService} />
        <Route path="/freelance-consultation" component={FreelanceConsultation} />
        <Route path="/job-matching-setup" component={JobMatchingSetup} />
        <Route path="/employer-matching" component={EmployerMatching} />
        <Route path="/hiring-process-dashboard" component={HiringProcessDashboard} />
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/company-reviews" component={AdminCompanyReviews} />
        <Route path="/admin/employers" component={AdminEmployers} />
        <Route path="/admin/employer-review/:applicationId" component={AdminEmployerReview} />
        <Route path="/admin/jobs" component={AdminJobs} />
        <Route path="/admin/job-review/:jobId" component={AdminJobReview} />
        <Route path="/admin/job-applicants-grid/:jobId" component={AdminJobApplicantsKanban} />
        <Route path="/admin/job-applicants-kanban/:jobId" component={AdminJobApplicantsKanban} />
        <Route path="/admin/assessment-review/:candidateId" component={AdminAssessmentReview} />
        <Route path="/admin/assessment-review-simple/:candidateId" component={AdminAssessmentReview} />
        <Route path="/admin/candidate-profile/:candidateId" component={AdminCandidateProfile} />
        <Route path="/admin/interview-details/:candidateId" component={AdminInterviewDetails} />
        <Route path="/admin/candidate-timeline/:candidateId" component={AdminCandidateTimeline} />
        <Route path="/admin/interview-availability/:candidateId" component={AdminInterviewAvailability} />
        <Route path="/admin/candidate-action-timeline/:candidateId" component={AdminCandidateActionTimeline} />
        <Route path="/admin/provide-update/:candidateId" component={AdminProvideUpdate} />
        <Route path="/admin/assigned-jobs" component={AdminAssignedJobs} />
        <Route path="/admin/all-job-seekers" component={AdminAllJobSeekers} />
        <Route path="/admin/calendly" component={AdminCalendly} />
        <Route path="/admin/analytics" component={AdminAnalytics} />
        <Route path="/admin/comprehensive-analytics" component={ComprehensiveAnalytics} />
        <Route path="/admin/hidden-jobs" component={AdminHiddenJobs} />
        <Route path="/jobs" component={Jobs} />
        <Route path="/hidden-jobs" component={HiddenJobs} />
        <Route path="/admin/notifications" component={AdminNotifications} />
        <Route path="/admin/messages" component={AdminMessages} />
        <Route path="/admin/candidate-message/:candidateId" component={AdminMessages} />
        <Route path="/admin/settings" component={lazy(() => import("./pages/admin-settings-simple"))} />
        <Route path="/home" component={Home} />
        <Route path="/community" component={Community} />
        <Route path="/onboarding" component={ComprehensiveOnboardingV2} />
        <Route path="/job-recommendations" component={JobRecommendations} />
        <Route path="/saved-items" component={SavedItems} />
        <Route path="/job-application/:jobId" component={JobApplication} />
        <Route path="/job-application-premium/:jobId" component={JobApplicationPremiumPage} />
        <Route path="/jobs/:jobId/apply" component={SimplifiedJobApplication} />
        <Route path="/jobs" component={SimplifiedJobSeekerDashboard} />
        <Route path="/application-response/:applicationId" component={ApplicationResponse} />
        <Route path="/applications" component={Applications} />
        <Route path="/application-success" component={ApplicationSuccess} />
        <Route path="/application-feedback/:applicationId" component={ApplicationFeedback} />
        <Route path="/application-detail/:applicationId" component={ApplicationDetail} />
        <Route path="/job-acceptance/:applicationId" component={JobAcceptance} />
        <Route path="/interview-schedule-form/:applicationId" component={InterviewSchedulingForm} />
        <Route path="/interview-scheduling-form" component={InterviewSchedulingForm} />
        <Route path="/interview-schedule/:applicationId" component={InterviewSchedule} />
        <Route path="/interview-schedule" component={InterviewSchedule} />
        <Route path="/interview-details/:id" component={InterviewDetails} />

        <Route path="/interview-confirmation/:applicationId" component={InterviewConfirmation} />
        <Route path="/messages" component={Messages} />
        <Route path="/company-challenge/:challengeId" component={CompanyChallenge} />
        <Route path="/notifications" component={Notifications} />
        <Route path="/mentoring" component={Mentoring} />
        <Route path="/mentor-directory" component={MentorDirectory} />
        <Route path="/events" component={Events} />
        <Route path="/weekly-drop-in" component={WeeklyDropIn} />
        <Route path="/join-event/:eventId" component={JoinEvent} />

        <Route path="/chat" component={Chat} />
        <Route path="/companies" component={Companies} />
        <Route path="/company-profile/:id" component={CompanyProfile} />
        <Route path="/company/:slug" component={CompanyProfile} />
        <Route path="/skills-challenge" component={SkillsChallenge} />
        <Route path="/skills-challenges" component={WorkingChallenges} />
        <Route path="/challenge-demo" component={ChallengeDemo} />
        <Route path="/profile" component={UserProfile} />
        <Route path="/profile-print-view" component={ProfilePrintView} />
        <Route path="/candidate-profile-print/:candidateId" component={CandidateProfilePrint} />
        <Route path="/standalone-candidate-print/:candidateId" component={StandaloneCandidatePrint} />
        <Route path="/formatted-candidate-profile/:candidateId" component={lazy(() => import("./pages/formatted-candidate-profile"))} />
        <Route path="/candidate-profile/:candidateId" component={lazy(() => import("./pages/enhanced-candidate-profile"))} />
        <Route path="/challenge-results/:submissionId" component={lazy(() => import("./pages/challenge-results"))} />
        <Route path="/comprehensive-assessment" component={ComprehensiveAssessment} />
        <Route path="/job-matching-demo" component={JobMatchingAlgorithm} />
        <Route path="/enhanced-onboarding" component={EnhancedOnboarding} />
        <Route path="/behavioural-assessment" component={BehaviouralAssessment} />
        <Route path="/behavioral-assessment" component={BehaviouralAssessment} />
        <Route path="/profile-checkpoints" component={ProfileCheckpoints} />
        <Route path="/bootcamp-interest" component={BootcampInterest} />
        <Route path="/feedback/:token" component={FeedbackForm} />
        <Route path="/outcome-tracking" component={OutcomeTrackingPage} />
        <Route path="/settings" component={Settings} />
        <Route path="/account-settings" component={EmployerAccountSettings} />
        <Route path="/personal-settings" component={PersonalSettings} />

        
        {/* Employers page */}
        <Route path="/employers" component={EmployersPage} />
        <Route path="/employer-signup" component={EmployerSignupPage} />
        
        {/* Employer demo routes - accessible without authentication */}
        <Route path="/employer-dashboard" component={EmployerDashboard} />
        <Route path="/employer-insights" component={EmployerInsights} />
        <Route path="/employer-jobs/create">
          <ComprehensiveJobPosting />
        </Route>
        {/* New full-screen candidate management approach */}
        <Route path="/candidates" component={CandidateListView} />
        <Route path="/candidates/:id" component={CandidateDetailView} />
        <Route path="/applicants/:jobId" component={CandidateListView} />
        <Route path="/applicants" component={Applicants} />
        <Route path="/job-candidate-matches/:jobId" component={CandidateListView} />
        <Route path="/provide-update/:candidateId" component={ProvideInterviewUpdate} />
        <Route path="/monitor-offer/:candidateId" component={MonitorOffer} />
        <Route path="/send-message/:candidateId" component={SendMessage} />
        
        <Route path="/employer-profile-setup" component={EmployerProfileSetup} />
        <Route path="/employer-testimonials" component={EmployerTestimonials} />
        <Route path="/employer-recognition" component={EmployerRecognition} />
        <Route path="/employer-programmes" component={EmployerProgrammes} />
        <Route path="/employer-photos" component={EmployerPhotos} />
        <Route path="/employer-profile-checkpoints" component={EmployerProfileCheckpoints} />
        <Route path="/employer-profile" component={EmployerProfileConsolidated} />
        <Route path="/employer-contact-setup" component={EmployerContactSetup} />
        <Route path="/employer-messages" component={EmployerMessagesPage} />
        <Route path="/job-posting-detail/:jobId" component={JobPostingDetailPage} />
        
        {/* Root route - always show Landing page */}
        <Route path="/" component={Landing} />
        
        {/* Protected routes */}
        {user && (
          <>
            <Route path="/admin" component={AdminDashboard} />
          </>
        )}
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div></div>}>
          <Router />
        </Suspense>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
