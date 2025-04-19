// src/services/meta.service.ts
import axios from 'axios';
import { hashEmail, hashName, hashPhone } from '../../utils/hashUtils';

// Constants
const META_ACCESS_TOKEN =
  import.meta.env.VITE_META_ACCESS_TOKEN ||
  'EAAJfMp7uZCxkBO4ml6XsC7Fg3dxZAZBhObPU0NFUvF9VCSijZCxBhTArha7ojR19I1ZC351BlMukVo7dmFKPX7lKxxQIjUgswoSojMX5ZCCy6DyGyxeh1ZAFBBEPW5SOyDYFNSHFocZAzaA7ZAoJ5OxPzfkcqiGsgSkQkiXOdewj8qfNsDxxmBXFLJtyx340c4QZBGQgZDZD';
const API_VERSION = 'v22.0';
const PIXEL_ID = '3079243202239861';

// Interfaces
export interface RawUserData {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  [key: string]: any;
}

export interface UserData {
  em?: string[];
  ph?: string[];
  fn?: string[];
  ln?: string[];
  client_user_agent?: string;
  fbp?: string; // Facebook browser ID
  fbc?: string; // Facebook click ID
  external_id?: string;
  [key: string]: any;
}

export interface EventData {
  event_name: string;
  event_time: number;
  event_source_url?: string;
  action_source: string;
  user_data: UserData;
  custom_data?: Record<string, any>;
}

export interface ConversionAPIPayload {
  data: EventData[];
}

/**
 * Process and hash user data for Facebook
 */
export const processUserData = async (userData: RawUserData): Promise<UserData> => {
  console.log('Processing user data:', userData);

  const processed: UserData = {
    client_user_agent: navigator.userAgent,
  };

  // Check if we have any PII to hash
  const hasPII = !!(userData.email || userData.phone || userData.firstName || userData.lastName);

  if (hasPII) {
    // Process actual user data if available
    if (userData.email) {
      processed.em = [await hashEmail(userData.email)];
      console.log(`Hashed email: ${processed.em[0]}`);
    }

    if (userData.phone) {
      processed.ph = [await hashPhone(userData.phone.toString())];
      console.log(`Hashed phone: ${processed.ph[0]}`);
    }

    if (userData.firstName) {
      processed.fn = [await hashName(userData.firstName)];
      console.log(`Hashed first name: ${processed.fn[0]}`);
    }

    if (userData.lastName) {
      processed.ln = [await hashName(userData.lastName)];
      console.log(`Hashed last name: ${processed.ln[0]}`);
    }
  } else {
    // No PII available, add Facebook cookies and other identifiers
    console.log('No PII data available, using anonymous identifiers');

    // Add Facebook browser cookie (if available)
    const fbpMatch = document.cookie.match(/_fbp=([^;]+)/);
    if (fbpMatch && fbpMatch[1]) {
      processed.fbp = fbpMatch[1];
      console.log(`Using fbp cookie: ${processed.fbp}`);
    }

    // Add Facebook click ID cookie (if available)
    const fbcMatch = document.cookie.match(/_fbc=([^;]+)/);
    if (fbcMatch && fbcMatch[1]) {
      processed.fbc = fbcMatch[1];
      console.log(`Using fbc cookie: ${processed.fbc}`);
    }

    // If still no identifiers, use a generic anonymous ID (not ideal but better than nothing)
    if (!processed.fbp && !processed.fbc) {
      // Create a constant hash for anonymous users
      // Use browser fingerprinting elements that don't change often
      const browserFingerprint = navigator.userAgent + navigator.language + window.screen.width + window.screen.height;
      processed.external_id = browserFingerprint;
      console.log('Using browser fingerprint as external_id');

      // For your testing needs only - send a constant email hash
      // This is a hashed version of "anonymous@example.com"
      processed.em = ['8eefff9fb3b1c8c1c3ce3c38afeb9969d5fded2adbc798cbf8c74f3d6b2f51cb'];
    }
  }

  console.log('Processed user data:', processed);
  return processed;
};

class MetaService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events`;
  }

  /**
   * Send events to Facebook Conversions API
   */
  async sendEvents(events: EventData[]): Promise<any> {
    try {
      const payload = { data: events };

      console.log('Sending payload to Meta:', JSON.stringify(payload, null, 2));

      const response = await axios.post(`${this.baseUrl}?access_token=${META_ACCESS_TOKEN}`, payload);

      console.log('Meta API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error sending events to Meta:', error);
      throw error;
    }
  }

  /**
   * Create a standard event with hashed user data
   */
  async createEvent(
    eventName: string,
    userData: RawUserData,
    eventSourceUrl?: string,
    customData?: Record<string, any>
  ): Promise<EventData> {
    // IMPORTANT: Process and hash user data
    const processedUserData = await processUserData(userData);

    return {
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_source_url: eventSourceUrl || window.location.href,
      action_source: 'website',
      user_data: processedUserData,
      custom_data: customData || {},
    };
  }

  /**
   * Track Complete Registration event
   */
  async trackCompleteRegistration(userData: RawUserData, customData?: Record<string, any>): Promise<any> {
    console.log('Tracking Complete Registration with user data:', userData);
    const event = await this.createEvent('CompleteRegistration', userData, window.location.href, customData);
    return this.sendEvents([event]);
  }

  /**
   * Track Contact event
   *
   * Can be called without user data - will use anonymous identifiers
   */
  async trackContact(userData: RawUserData = {}, customData?: Record<string, any>): Promise<any> {
    console.log('Tracking Contact with user data:', userData);
    // Even if userData is empty, the processUserData function will add anonymous identifiers
    const event = await this.createEvent('Contact', userData, window.location.href, customData);
    return this.sendEvents([event]);
  }

  /**
   * Track View Content event
   *
   * Can be called without user data - will use anonymous identifiers
   */
  async trackViewContent(userData: RawUserData = {}, customData?: Record<string, any>): Promise<any> {
    console.log('Tracking View Content with user data:', userData);
    // Even if userData is empty, the processUserData function will add anonymous identifiers
    const event = await this.createEvent('ViewContent', userData, window.location.href, customData);
    return this.sendEvents([event]);
  }
}

// Export a singleton instance
export const metaService = new MetaService();

// Also export the class for custom instantiation
export default metaService;
