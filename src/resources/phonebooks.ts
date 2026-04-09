import { HttpClient } from '../http-client';
import {
  FetchPhonebooksResponse,
  CreatePhonebookParams,
  CreatePhonebookResponse,
  UpdatePhonebookParams,
  UpdatePhonebookResponse,
  DeletePhonebookResponse,
} from '../types/index';

export class PhonebooksResource {
  constructor(private readonly http: HttpClient) {}

  /**
   * Fetch all phonebooks on your account (paginated).
   */
  async list(): Promise<FetchPhonebooksResponse> {
    return this.http.get<FetchPhonebooksResponse>('/api/phonebooks');
  }

  /**
   * Create a new phonebook tied to your account.
   */
  async create(params: CreatePhonebookParams): Promise<CreatePhonebookResponse> {
    return this.http.post<CreatePhonebookResponse>('/api/phonebooks', params);
  }

  /**
   * Update an existing phonebook's name and description.
   */
  async update(
    phonebookId: string,
    params: UpdatePhonebookParams,
  ): Promise<UpdatePhonebookResponse> {
    return this.http.patch<UpdatePhonebookResponse>(
      `/api/phonebooks/${phonebookId}`,
      params,
    );
  }

  /**
   * Permanently delete a phonebook from your account.
   */
  async delete(phonebookId: string): Promise<DeletePhonebookResponse> {
    return this.http.delete<DeletePhonebookResponse>(`/api/phonebooks/${phonebookId}`);
  }
}
