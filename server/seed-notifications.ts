import { db } from "./db";
import { notifications } from "@shared/schema";

export async function seedNotifications() {
  try {
    // Demo notifications for user ID 1 (job seeker)
    const demoNotifications = [
      {
        userId: 1,
        type: "interview_reminder",
        title: "Interview tomorrow",
        message: "You have an interview with Holly Saunders (Pollen) tomorrow at 2:00 PM for Marketing Assistant at TechFlow Solutions",
        jobId: 1,
        jobTitle: "Marketing Assistant",
        isRead: false,
        priority: "high",
        actionRequired: true,
        actionUrl: "/interview-confirmation/1",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
      {
        userId: 1,
        type: "job_recommendation",
        title: "New job matches found",
        message: "We've found 3 new job opportunities that match your profile and skills",
        isRead: false,
        priority: "normal",
        actionRequired: true,
        actionUrl: "/jobs",
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      },
      {
        userId: 1,
        type: "application_update",
        title: "Application progressed",
        message: "Your application for Customer Support Specialist at StartupHub has moved to interview stage",
        jobId: 2,
        jobTitle: "Customer Support Specialist",
        isRead: true,
        priority: "normal",
        actionRequired: false,
        actionUrl: "/interview-confirmation/2",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        userId: 1,
        type: "message_received",
        title: "New message from Emma Wilson",
        message: "Emma Wilson from StartupHub has sent you a message about your application",
        isRead: true,
        priority: "normal",
        actionRequired: false,
        actionUrl: "/messages",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      },
      {
        userId: 1,
        type: "profile_incomplete",
        title: "Complete your profile",
        message: "Complete your behavioural assessment to unlock more job opportunities and improve your match quality",
        isRead: true,
        priority: "low",
        actionRequired: false,
        actionUrl: "/profile-checkpoints",
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      }
    ];

    // Clear existing notifications first
    await db.delete(notifications);
    
    // Insert demo notifications
    await db.insert(notifications).values(demoNotifications);
    
    console.log("✅ Demo notifications seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding notifications:", error);
  }
}