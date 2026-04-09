import { HttpClient } from '../http-client';
import {
  SendMessageParams,
  SendMessageResponse,
  SendBulkMessageParams,
  SendNumberMessageParams,
  SendNumberMessageResponse,
  SendTemplateParams,
  SendTemplateResponse,
} from '../types/index';

export class MessagingResource {
  constructor(private readonly http: HttpClient) {}

  /**
   * Send a message to a single recipient (or up to 100) via SMS, WhatsApp, or Voice.
   * Pass `to` as a string for single, or array of strings for multiple (max 100).
   */
  async send(params: SendMessageParams): Promise<SendMessageResponse> {
    return this.http.post<SendMessageResponse>('/api/sms/send', params);
  }

  /**
   * Send a bulk SMS to an array of phone numbers (max 100).
   * Channel must be 'dnd' or 'generic'.
   */
  async sendBulk(params: SendBulkMessageParams): Promise<SendMessageResponse> {
    return this.http.post<SendMessageResponse>('/api/sms/send/bulk', params);
  }

  /**
   * Send a message using Termii's auto-generated messaging numbers.
   * No sender ID required — the number adapts to the customer's location.
   */
  async sendWithNumber(params: SendNumberMessageParams): Promise<SendNumberMessageResponse> {
    return this.http.post<SendNumberMessageResponse>('/api/sms/number/send', params);
  }

  /**
   * Send a WhatsApp template message.
   * The template must be pre-approved on your account.
   */
  async sendTemplate(params: SendTemplateParams): Promise<SendTemplateResponse> {
    return this.http.post<SendTemplateResponse>('/api/sms/send', {
      ...params,
      type: 'plain',
      channel: 'whatsapp',
    });
  }
}
