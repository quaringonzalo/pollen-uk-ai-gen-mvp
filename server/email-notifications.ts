import { MailService } from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  console.warn("SENDGRID_API_KEY environment variable not set - email notifications will be disabled");
}

let mailService: MailService | null = null;

// Initialize SendGrid only if API key is available
if (process.env.SENDGRID_API_KEY) {
  mailService = new MailService();
  mailService.setApiKey(process.env.SENDGRID_API_KEY);
}

export interface EmailNotificationData {
  recipientEmail: string;
  recipientName: string;
  senderName: string;
  companyName: string;
  jobTitle: string;
  messagePreview: string;
  isInterview?: boolean;
  interviewDate?: string;
  interviewTime?: string;
}

export class EmailNotificationService {
  
  /**
   * Send email notification when user receives a new message
   */
  async sendNewMessageNotification(data: EmailNotificationData): Promise<boolean> {
    if (!mailService) {
      console.warn("SendGrid not configured - skipping email notification");
      return false;
    }

    try {
      const emailContent = this.generateMessageNotificationEmail(data);
      
      await mailService.send({
        to: data.recipientEmail,
        from: 'notifications@pollen.co.uk', // Replace with your verified sender
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text
      });

      console.log(`Message notification sent to ${data.recipientEmail}`);
      return true;
    } catch (error) {
      console.error('Failed to send message notification:', error);
      return false;
    }
  }

  /**
   * Send email notification for interview-related messages
   */
  async sendInterviewNotification(data: EmailNotificationData): Promise<boolean> {
    if (!mailService) {
      console.warn("SendGrid not configured - skipping interview notification");
      return false;
    }

    try {
      const emailContent = this.generateInterviewNotificationEmail(data);
      
      await mailService.send({
        to: data.recipientEmail,
        from: 'notifications@pollen.co.uk', // Replace with your verified sender
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text
      });

      console.log(`Interview notification sent to ${data.recipientEmail}`);
      return true;
    } catch (error) {
      console.error('Failed to send interview notification:', error);
      return false;
    }
  }

  /**
   * Send feedback request email to candidate
   */
  async sendFeedbackRequestEmail(
    recipientEmail: string,
    recipientName: string,
    jobTitle: string,
    companyName: string,
    feedbackUrl: string
  ): Promise<boolean> {
    if (!mailService) {
      console.warn("SendGrid not configured - skipping feedback request email");
      return false;
    }

    try {
      const emailContent = this.generateFeedbackRequestEmail(
        recipientName,
        jobTitle,
        companyName,
        feedbackUrl
      );
      
      await mailService.send({
        to: recipientEmail,
        from: 'notifications@pollen.co.uk', // Replace with your verified sender
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text
      });

      console.log(`Feedback request sent to ${recipientEmail}`);
      return true;
    } catch (error) {
      console.error('Failed to send feedback request:', error);
      return false;
    }
  }

  /**
   * Generate email content for general message notifications
   */
  private generateMessageNotificationEmail(data: EmailNotificationData) {
    const subject = `New message from ${data.senderName} at ${data.companyName}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Message - Pollen</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f8fafc; padding: 20px; border-radius: 0 0 8px 8px; }
          .message-box { background: white; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #2563eb; }
          .button { background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 16px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Message on Pollen</h1>
          </div>
          <div class="content">
            <p>Hi ${data.recipientName},</p>
            <p>You have a new message from <strong>${data.senderName}</strong> at <strong>${data.companyName}</strong> regarding your application for the <strong>${data.jobTitle}</strong> position.</p>
            
            <div class="message-box">
              <h3>Message Preview:</h3>
              <p>"${data.messagePreview}"</p>
            </div>
            
            <p>Quick responses show professionalism and keep employers engaged with your applications.</p>
            
            <a href="https://pollen.co.uk/messages" class="button">View and Reply</a>
            
            <p>Best regards,<br>The Pollen Team</p>
          </div>
          <div class="footer">
            <p>This email was sent because you have notifications enabled for new messages. You can adjust your notification preferences in your account settings.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Hi ${data.recipientName},

      You have a new message from ${data.senderName} at ${data.companyName} regarding your application for the ${data.jobTitle} position.

      Message Preview: "${data.messagePreview}"

      Quick responses show professionalism and keep employers engaged with your applications.

      View and reply: https://pollen.co.uk/messages

      Best regards,
      The Pollen Team
    `;

    return { subject, html, text };
  }

  /**
   * Generate email content for interview-related notifications
   */
  private generateInterviewNotificationEmail(data: EmailNotificationData) {
    const subject = `Interview Update: ${data.jobTitle} at ${data.companyName}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Interview Update - Pollen</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #059669; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f0fdf4; padding: 20px; border-radius: 0 0 8px 8px; }
          .interview-box { background: white; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #059669; }
          .button { background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 16px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Interview Update</h1>
          </div>
          <div class="content">
            <p>Hi ${data.recipientName},</p>
            <p>You have an interview-related message from <strong>${data.senderName}</strong> at <strong>${data.companyName}</strong> for the <strong>${data.jobTitle}</strong> position.</p>
            
            ${data.interviewDate && data.interviewTime ? `
            <div class="interview-box">
              <h3>Interview Details:</h3>
              <p><strong>Date:</strong> ${data.interviewDate}</p>
              <p><strong>Time:</strong> ${data.interviewTime}</p>
            </div>
            ` : ''}
            
            <div class="interview-box">
              <h3>Message:</h3>
              <p>"${data.messagePreview}"</p>
            </div>
            
            <p>Please respond promptly to confirm your availability and show your professionalism.</p>
            
            <a href="https://pollen.co.uk/messages" class="button">View Details & Reply</a>
            
            <p>Best regards,<br>The Pollen Team</p>
          </div>
          <div class="footer">
            <p>This email was sent because you have notifications enabled for interview messages. You can adjust your notification preferences in your account settings.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Hi ${data.recipientName},

      You have an interview-related message from ${data.senderName} at ${data.companyName} for the ${data.jobTitle} position.

      ${data.interviewDate && data.interviewTime ? `
      Interview Details:
      Date: ${data.interviewDate}
      Time: ${data.interviewTime}
      ` : ''}

      Message: "${data.messagePreview}"

      Please respond promptly to confirm your availability and show your professionalism.

      View details and reply: https://pollen.co.uk/messages

      Best regards,
      The Pollen Team
    `;

    return { subject, html, text };
  }

  /**
   * Generate email content for feedback request
   */
  private generateFeedbackRequestEmail(
    recipientName: string,
    jobTitle: string,
    companyName: string,
    feedbackUrl: string
  ) {
    const subject = `Help us improve - feedback on your ${jobTitle} application`;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8fafc; padding: 20px; border-radius: 0 0 8px 8px; }
            .button { background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 16px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Share Your Experience</h2>
            </div>
            <div class="content">
              <p>Hi ${recipientName},</p>
              
              <p>Thank you for applying to the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong> through Pollen.</p>
              
              <p>We'd love to hear about your experience to help us improve our platform and ensure companies provide the best candidate experience.</p>
              
              <p>It takes just 2 minutes and helps other job seekers like you.</p>
              
              <p style="text-align: center;">
                <a href="${feedbackUrl}" class="button">Share Your Experience</a>
              </p>
              
              <p>Best regards,<br>The Pollen Team</p>
            </div>
            <div class="footer">
              <p>This is an automated message from Pollen. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
    Hi ${recipientName},
    
    Thank you for applying to the ${jobTitle} position at ${companyName} through Pollen.
    
    We'd love to hear about your experience to help us improve our platform and ensure companies provide the best candidate experience.
    
    It takes just 2 minutes and helps other job seekers like you.
    
    Share your experience: ${feedbackUrl}
    
    Best regards,
    The Pollen Team
    `;

    return { subject, html, text };
  }
}

export const emailNotificationService = new EmailNotificationService();