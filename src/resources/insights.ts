import { HttpClient } from '../http-client';
import {
  BalanceResponse,
  SearchResponse,
  PhoneStatusResponse,
  HistoryResponse,
} from '../types/index';

export class InsightsResource {
  constructor(private readonly http: HttpClient) {}

  /**
   * Retrieve your current wallet balance.
   */
  async balance(): Promise<BalanceResponse> {
    return this.http.get<BalanceResponse>('/api/get-balance');
  }

  /**
   * Verify a phone number and detect its DND status.
   * Returns network info and whether the number is on Do-Not-Disturb.
   */
  async search(phoneNumber: string): Promise<SearchResponse> {
    return this.http.get<SearchResponse>('/api/check/dnd', {
      phone_number: phoneNumber,
    });
  }

  /**
   * Detect if a phone number is real, ported, or potentially fake.
   * Returns carrier and routing details.
   */
  async status(
    phoneNumber: string,
    countryCode: string,
  ): Promise<PhoneStatusResponse> {
    return this.http.get<PhoneStatusResponse>('/api/insight/number/query', {
      phone_number: phoneNumber,
      country_code: countryCode,
    });
  }

  /**
   * Fetch the message history for your account.
   */
  async history(): Promise<HistoryResponse> {
    return this.http.get<HistoryResponse>('/api/sms/inbox');
  }
}
