import { HttpClient } from '../http-client';
import {
  FetchSenderIDsResponse,
  RequestSenderIDParams,
  RequestSenderIDResponse,
} from '../types/index';

export class SenderIdResource {
  constructor(private readonly http: HttpClient) {}

  /**
   * Fetch all Sender IDs associated with your account.
   * Optionally filter by name and/or status.
   */
  async list(filters?: { name?: string; status?: string }): Promise<FetchSenderIDsResponse> {
    return this.http.get<FetchSenderIDsResponse>('/api/sender-id', filters);
  }

  /**
   * Submit a new Sender ID for registration.
   * The request is reviewed and approved by the Termii admin team.
   */
  async request(params: RequestSenderIDParams): Promise<RequestSenderIDResponse> {
    return this.http.post<RequestSenderIDResponse>('/api/sender-id/request', params);
  }
}
