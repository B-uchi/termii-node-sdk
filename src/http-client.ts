import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { TermiiConfig, TermiiErrorResponse } from './types';

export class TermiiError extends Error {
  public readonly statusCode: number;
  public readonly response?: TermiiErrorResponse;

  constructor(message: string, statusCode: number, response?: TermiiErrorResponse) {
    super(message);
    this.name = 'TermiiError';
    this.statusCode = statusCode;
    this.response = response;
    Object.setPrototypeOf(this, TermiiError.prototype);
  }
}

export class HttpClient {
  private readonly client: AxiosInstance;
  public readonly apiKey: string;
  public readonly baseUrl: string;

  constructor(config: TermiiConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = (config.baseUrl ?? 'https://v3.api.termii.com').replace(/\/$/, '');

    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: config.timeout ?? 30_000,
      headers: { 'Content-Type': 'application/json' },
    });

    // Response interceptor — normalise errors
    this.client.interceptors.response.use(
      (res) => res,
      (error: AxiosError<TermiiErrorResponse>) => {
        const status = error.response?.status ?? 0;
        const data = error.response?.data;
        const message =
          data?.message ||
          data?.description ||
          error.message ||
          'An unknown error occurred';

        throw new TermiiError(message, status, data);
      },
    );
  }

  /** Inject api_key into every request body (POST/PATCH/DELETE) */
  private withKey<T extends object>(params: T): T & { api_key: string } {
    return { ...params, api_key: this.apiKey };
  }

  async get<T>(path: string, params?: Record<string, unknown>): Promise<T> {
    const config: AxiosRequestConfig = {
      params: { api_key: this.apiKey, ...params },
    };
    const res = await this.client.get<T>(path, config);
    return res.data;
  }

  async post<T>(path: string, body: object): Promise<T> {
    const res = await this.client.post<T>(path, this.withKey(body));
    return res.data;
  }

  async patch<T>(path: string, body: object): Promise<T> {
    const res = await this.client.patch<T>(path, this.withKey(body));
    return res.data;
  }

  async delete<T>(path: string, params?: Record<string, unknown>): Promise<T> {
    const config: AxiosRequestConfig = {
      params: { api_key: this.apiKey, ...params },
    };
    const res = await this.client.delete<T>(path, config);
    return res.data;
  }

  /** For multipart/form-data uploads */
  async postForm<T>(path: string, formData: FormData | import('form-data')): Promise<T> {
    const res = await this.client.post<T>(path, formData, {
      headers: (formData as any).getHeaders?.() ?? {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  }
}
