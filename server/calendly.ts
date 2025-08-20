import axios from 'axios';

interface CalendlyEvent {
  uri: string;
  name: string;
  status: string;
  start_time: string;
  end_time: string;
  invitee_email: string;
  invitee_name: string;
  event_type: string;
  location?: {
    type: string;
    location?: string;
  };
}

interface CalendlyWebhookPayload {
  event: string;
  time: string;
  payload: {
    event_type: string;
    event: CalendlyEvent;
  };
}

class CalendlyService {
  private readonly apiUrl = 'https://api.calendly.com';
  
  async getUserInfo(accessToken: string) {
    try {
      const response = await axios.get(`${this.apiUrl}/users/me`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching Calendly user info:', error);
      throw error;
    }
  }

  async getEventTypes(accessToken: string, userUri: string) {
    try {
      const response = await axios.get(`${this.apiUrl}/event_types`, {
        params: {
          user: userUri,
          active: true
        },
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching Calendly event types:', error);
      throw error;
    }
  }

  async createWebhookSubscription(accessToken: string, organizationUri: string, callbackUrl: string) {
    try {
      const response = await axios.post(`${this.apiUrl}/webhook_subscriptions`, {
        url: callbackUrl,
        events: [
          'invitee.created',
          'invitee.canceled'
        ],
        organization: organizationUri,
        scope: 'organization'
      }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating webhook subscription:', error);
      throw error;
    }
  }

  async getScheduledEvents(accessToken: string, userUri: string, minStartTime?: string) {
    try {
      const params: any = {
        user: userUri,
        status: 'active'
      };
      
      if (minStartTime) {
        params.min_start_time = minStartTime;
      }

      const response = await axios.get(`${this.apiUrl}/scheduled_events`, {
        params,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching scheduled events:', error);
      throw error;
    }
  }

  generateSchedulingUrl(eventTypeUrl: string, prefillData?: {
    name?: string;
    email?: string;
    customAnswers?: Record<string, string>;
  }): string {
    const url = new URL(eventTypeUrl);
    
    if (prefillData) {
      if (prefillData.name) {
        url.searchParams.set('name', prefillData.name);
      }
      if (prefillData.email) {
        url.searchParams.set('email', prefillData.email);
      }
      if (prefillData.customAnswers) {
        Object.entries(prefillData.customAnswers).forEach(([key, value]) => {
          url.searchParams.set(`a${key}`, value);
        });
      }
    }

    return url.toString();
  }
}

export const calendlyService = new CalendlyService();

// Types for database storage
export interface CalendlyIntegration {
  id: number;
  userId: number;
  accessToken: string;
  refreshToken: string;
  calendlyUserId: string;
  organizationUri: string;
  webhookUri?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ScheduledInterview {
  id: number;
  applicationId: string;
  calendlyEventUri: string;
  scheduledAt: Date;
  interviewerEmail: string;
  candidateEmail: string;
  eventTypeUri: string;
  status: 'scheduled' | 'completed' | 'canceled';
  createdAt: Date;
  updatedAt: Date;
}