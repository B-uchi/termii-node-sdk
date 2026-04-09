import { HttpClient } from '../http-client';
import {
  SendTokenParams,
  SendTokenResponse,
  VerifyTokenParams,
  VerifyTokenResponse,
  SendVoiceTokenParams,
  SendVoiceTokenResponse,
  SendVoiceCallParams,
  SendVoiceCallResponse,
  SendEmailTokenParams,
  SendEmailTokenResponse,
  GenerateInAppTokenParams,
  GenerateInAppTokenResponse,
  SendWhatsAppTokenParams,
  SendWhatsAppTokenResponse,
} from '../types/index';

export class TokenResource {
  constructor(private readonly http: HttpClient) {}

  /**
   * Send a one-time password (OTP) to a phone number via SMS.
   * The PIN is randomly generated and delivered with your custom message text.
   */
  async send(params: SendTokenParams): Promise<SendTokenResponse> {
    return this.http.post<SendTokenResponse>('/api/sms/otp/send', params);
  }

  /**
   * Verify a token/OTP previously sent via `token.send()`.
   * Returns whether the token is verified or expired.
   */
  async verify(params: VerifyTokenParams): Promise<VerifyTokenResponse> {
    return this.http.post<VerifyTokenResponse>('/api/sms/otp/verify', params);
  }

  /**
   * Generate and send an OTP via a voice call to the recipient's phone number.
   */
  async sendVoice(params: SendVoiceTokenParams): Promise<SendVoiceTokenResponse> {
    return this.http.post<SendVoiceTokenResponse>('/api/sms/otp/send/voice', params);
  }

  /**
   * Send a message from your application through the voice channel.
   * The text is converted to speech and delivered as a voice call.
   */
  async sendVoiceCall(params: SendVoiceCallParams): Promise<SendVoiceCallResponse> {
    return this.http.post<SendVoiceCallResponse>('/api/sms/otp/call', params);
  }

  /**
   * Send a one-time password to an email address.
   * Requires an email configuration ID set up on your Termii account.
   */
  async sendEmail(params: SendEmailTokenParams): Promise<SendEmailTokenResponse> {
    return this.http.post<SendEmailTokenResponse>('/api/email/otp/send', params);
  }

  /**
   * Generate an OTP in-app (returned in JSON) without sending it.
   * Useful for apps that handle their own delivery channel.
   */
  async generateInApp(params: GenerateInAppTokenParams): Promise<GenerateInAppTokenResponse> {
    return this.http.post<GenerateInAppTokenResponse>('/api/sms/otp/generate', params);
  }

  /**
   * Deliver a one-time password directly to a customer via WhatsApp.
   */
  async sendWhatsApp(params: SendWhatsAppTokenParams): Promise<SendWhatsAppTokenResponse> {
    return this.http.post<SendWhatsAppTokenResponse>('/api/sms/otp/send/whatsapp', params);
  }
}
