import * as fs from 'fs';
import * as path from 'path';
import FormData from 'form-data';
import { HttpClient } from '../http-client';
import {
  FetchContactsResponse,
  AddContactParams,
  AddContactResponse,
  UploadContactsParams,
  UploadContactsResponse,
  DeleteContactResponse,
} from '../types/index';

export class ContactsResource {
  constructor(private readonly http: HttpClient) {}

  /**
   * Fetch all contacts within a specific phonebook (paginated).
   */
  async list(phonebookId: string): Promise<FetchContactsResponse> {
    return this.http.get<FetchContactsResponse>(
      `/api/phonebooks/${phonebookId}/contacts`,
    );
  }

  /**
   * Add a single contact to an existing phonebook.
   */
  async add(
    phonebookId: string,
    params: AddContactParams,
  ): Promise<AddContactResponse> {
    return this.http.post<AddContactResponse>(
      `/api/phonebooks/${phonebookId}/contacts`,
      params,
    );
  }

  /**
   * Bulk-upload contacts from a CSV file to a phonebook.
   * The CSV should have a column containing phone numbers.
   * Processing happens asynchronously in the background.
   */
  async upload(params: UploadContactsParams): Promise<UploadContactsResponse> {
    const resolvedPath = path.resolve(params.filePath);

    if (!fs.existsSync(resolvedPath)) {
      throw new Error(`CSV file not found at path: ${resolvedPath}`);
    }

    const form = new FormData();
    form.append('file', fs.createReadStream(resolvedPath));
    form.append(
      'contact',
      JSON.stringify({
        pid: params.phonebookId,
        country_code: params.country_code,
        api_key: this.http.apiKey,
      }),
      { contentType: 'application/json' },
    );

    return this.http.postForm<UploadContactsResponse>(
      '/api/phonebooks/contacts/upload',
      form,
    );
  }

  /**
   * Delete a specific contact from a phonebook.
   */
  async delete(
    phonebookId: string,
    contactId: string,
  ): Promise<DeleteContactResponse> {
    return this.http.delete<DeleteContactResponse>(
      `/api/phonebooks/${phonebookId}/contacts`,
      { contact_id: contactId },
    );
  }
}
