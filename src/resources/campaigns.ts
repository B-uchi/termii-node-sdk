import { HttpClient } from '../http-client';
import {
  SendCampaignParams,
  SendCampaignResponse,
  FetchCampaignsResponse,
  CampaignHistory,
  RetryCampaignResponse,
} from '../types/index';

export class CampaignsResource {
  constructor(private readonly http: HttpClient) {}

  /**
   * Send a campaign to all contacts in a specified phonebook.
   * Supports both immediate and scheduled delivery.
   */
  async send(params: SendCampaignParams): Promise<SendCampaignResponse> {
    return this.http.post<SendCampaignResponse>('/api/sms/campaigns/send', params);
  }

  /**
   * Fetch a paginated list of all campaigns sent from your account.
   */
  async list(): Promise<FetchCampaignsResponse> {
    return this.http.get<FetchCampaignsResponse>('/api/sms/campaigns');
  }

  /**
   * Fetch the full details and delivery stats for a specific campaign.
   */
  async getHistory(campaignId: string): Promise<CampaignHistory> {
    return this.http.get<CampaignHistory>(
      `/api/sms/campaigns/${campaignId}`,
    );
  }

  /**
   * Retry a previously failed campaign.
   */
  async retry(campaignId: string): Promise<RetryCampaignResponse> {
    return this.http.patch<RetryCampaignResponse>(
      `/api/sms/campaigns/${campaignId}`,
      {},
    );
  }
}
