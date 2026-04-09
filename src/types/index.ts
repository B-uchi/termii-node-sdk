// ─── Core ────────────────────────────────────────────────────────────────────

export interface TermiiConfig {
  /** Your Termii API key */
  apiKey: string;
  /** Your account's base URL (found on Termii dashboard). Defaults to https://v3.api.termii.com */
  baseUrl?: string;
  /** Request timeout in milliseconds. Defaults to 30000 */
  timeout?: number;
}

// ─── Common ──────────────────────────────────────────────────────────────────

export type MessageChannel = 'generic' | 'dnd' | 'whatsapp' | 'voice';
export type MessageType = 'plain' | 'unicode' | 'encrypted' | 'voice';
export type PinType = 'NUMERIC' | 'ALPHANUMERIC';

export interface PaginatedResponse<T> {
  content: T[];
  pageable: {
    sort: { empty: boolean; sorted: boolean; unsorted: boolean };
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  size: number;
  number: number;
  numberOfElements: number;
  empty: boolean;
  sort: { empty: boolean; sorted: boolean; unsorted: boolean };
}

// ─── Sender ID ───────────────────────────────────────────────────────────────

export interface SenderID {
  sender_id: string;
  status: 'active' | 'pending' | 'blocked';
  country: string;
  createdAt: string;
  company?: string;
  usecase?: string;
}

export type FetchSenderIDsResponse = PaginatedResponse<SenderID>;

export interface RequestSenderIDParams {
  sender_id: string;
  use_case: string;
  company: string;
}

export interface RequestSenderIDResponse {
  code: string;
  message: string;
}

// ─── Messaging ───────────────────────────────────────────────────────────────

export interface SendMessageParams {
  to: string | string[];
  from: string;
  sms: string;
  type: MessageType;
  channel: MessageChannel;
  media?: {
    url: string;
    caption?: string;
  };
}

export interface SendMessageResponse {
  code: string;
  balance: number;
  message_id: string;
  message_id_str: string;
  message: string;
  user: string;
}

export interface SendBulkMessageParams {
  to: string[];
  from: string;
  sms: string;
  type: MessageType;
  channel: Extract<MessageChannel, 'dnd' | 'generic'>;
}

export interface SendNumberMessageParams {
  to: string;
  sms: string;
}

export interface SendNumberMessageResponse {
  code: string;
  message_id: string;
  message: string;
  balance: number;
  user: string;
}

// ─── Templates ───────────────────────────────────────────────────────────────

export interface SendTemplateParams {
  phone_number: string;
  device_id: string;
  template_id: string;
  data: Record<string, string>;
}

export interface SendTemplateResponse {
  code: string;
  message_id: string;
  message: string;
  balance: number;
  user: string;
}

// ─── Token ───────────────────────────────────────────────────────────────────

export interface SendTokenParams {
  message_type: PinType;
  to: string;
  from: string;
  channel: Extract<MessageChannel, 'dnd' | 'generic'>;
  pin_attempts: number;
  pin_time_to_live: number;
  pin_length: number;
  pin_placeholder: string;
  message_text: string;
  pin_type: PinType;
}

export interface SendTokenResponse {
  smsStatus: string;
  phone_number: string;
  to: string;
  pinId: string;
  pin_id: string;
  message_id_str: string;
  status: string;
}

export interface VerifyTokenParams {
  pin_id: string;
  pin: string;
}

export interface VerifyTokenResponse {
  pinId: string;
  verified: 'True' | 'False';
  msisdn: string;
}

export interface SendVoiceTokenParams {
  phone_number: string;
  pin_attempts: number;
  pin_time_to_live: number;
  pin_length: number;
}

export interface SendVoiceTokenResponse {
  code: string;
  balance: number;
  message_id: string;
  pinId: string;
  message: string;
}

export interface SendVoiceCallParams {
  to: string;
  code: string;
}

export interface SendVoiceCallResponse {
  code: string;
  balance: number;
  message_id: string;
  user: string;
  message: string;
}

export interface SendEmailTokenParams {
  email_address: string;
  code: string;
  email_configuration_id: string;
}

export interface SendEmailTokenResponse {
  code: string;
  message_id: string;
  message: string;
  balance: number;
  user: string;
}

export interface GenerateInAppTokenParams {
  pin_type: PinType;
  phone_number: string;
  pin_attempts: number;
  pin_time_to_live: number;
  pin_length: number;
}

export interface GenerateInAppTokenResponse {
  phone_number_other: string;
  phone_number: string;
  otp: string;
  pin_id: string;
}

export interface SendWhatsAppTokenParams {
  to: string;
  from: string;
  template_id: string;
  data: Record<string, string>;
}

export interface SendWhatsAppTokenResponse {
  code: string;
  message_id: string;
  message: string;
  balance: number;
  user: string;
}

// ─── Phonebooks ──────────────────────────────────────────────────────────────

export interface Phonebook {
  id: string;
  name: string;
  total_number_of_contacts: number;
  date_created: string;
}

export type FetchPhonebooksResponse = PaginatedResponse<Phonebook>;

export interface CreatePhonebookParams {
  phonebook_name: string;
  description?: string;
}

export interface CreatePhonebookResponse {
  message: string;
  status: string;
}

export interface UpdatePhonebookParams {
  phonebook_name: string;
  description: string;
}

export interface UpdatePhonebookResponse {
  id: string;
  applicationId: number;
  uuid: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
  temp: boolean;
  numberOfContacts: number;
  numberOfCampaigns: number;
}

export interface DeletePhonebookResponse {
  message: string;
}

// ─── Contacts ────────────────────────────────────────────────────────────────

export interface Contact {
  id: string;
  pid: string;
  phone_number: string;
  contact_list_key_value: Array<{ key: string; value: string }>;
}

export interface FetchContactsResponse {
  headers: string[];
  phonebook: {
    id: string;
    applicationId: string;
    description: string;
    createdAt: string;
    phonebook_name: string;
    total_contact: number;
    total_campaign: number;
  };
  data: PaginatedResponse<Contact>;
}

export interface AddContactParams {
  phone_number: string;
  country_code?: string;
  email_address?: string;
  first_name?: string;
  last_name?: string;
  company?: string;
}

export interface AddContactResponse {
  'Contact added successfully': {
    id: string;
    company?: string;
    created_at: string;
    updated_at: string;
    phone_number: string;
    email_address?: string;
    first_name?: string;
    last_name?: string;
  };
}

export interface UploadContactsParams {
  /** Path to CSV file */
  filePath: string;
  phonebookId: string;
  country_code: string;
}

export interface UploadContactsResponse {
  message: string;
}

export interface DeleteContactResponse {
  code: number;
  data: { message: string };
  message: string;
  status: string;
}

// ─── Campaigns ───────────────────────────────────────────────────────────────

export interface SendCampaignParams {
  country_code: string;
  sender_id: string;
  message: string;
  channel: Extract<MessageChannel, 'dnd' | 'generic'>;
  message_type: 'Plain' | 'Unicode';
  phonebook_id: string;
  delimiter?: string;
  remove_duplicate?: 'yes' | 'no';
  enable_link_tracking?: boolean;
  campaign_type: 'personalized' | 'regular';
  schedule_sms_status: 'scheduled' | 'regular';
  schedule_time?: string;
}

export interface SendCampaignResponse {
  message: string;
  campaignId: string;
  status: string;
}

export interface Campaign {
  campaign_id: string;
  run_at: string;
  status: string;
  created_at: number;
  phone_book: string;
  camp_type: string;
  total_recipients: number;
}

export type FetchCampaignsResponse = PaginatedResponse<Campaign>;

export interface CampaignHistory {
  id: string;
  applicationId: number;
  uuid: string;
  createdAt: string;
  updatedAt: string;
  campaignId: string;
  phonebookId: string;
  phonebookName: string;
  sender: string;
  message: string;
  countryCode: string;
  smsType: string;
  campaignType: string;
  status: string;
  cost: number;
  totalRecipient: number;
  totalDelivered: number;
  totalFailed: number;
  sent: number;
  runAt: string;
  isLinkTrackingEnabled: boolean;
  rerun: boolean;
  sendBy: string;
  personalized: boolean;
}

export interface RetryCampaignResponse {
  message: string;
  status: string;
}

// ─── Insights ────────────────────────────────────────────────────────────────

export interface BalanceResponse {
  user: string;
  balance: number;
  currency: string;
}

export interface SearchResponse {
  number: string;
  status: string;
  network: string;
  network_code: string;
  message: string;
  dnd_active: boolean;
}

export interface PhoneStatusResponse {
  result: Array<{
    routeDetail: {
      number: string;
      ported: number;
    };
    countryDetail: {
      countryCode: string;
      mobileCountryCode: string;
      iso: string;
    };
    operatorDetail: {
      operatorCode: string;
      operatorName: string;
      mobileNumberCode: string;
      mobileRoutingCode: string;
      carrierIdentificationCode: string;
      lineType: string;
    };
    status: number;
  }>;
}

export interface HistoryResponse {
  data: Array<{
    sender: string;
    receiver: string;
    country_code: string;
    message: string;
    amount: number;
    reroute: number;
    status: string;
    sms_type: string;
    send_by: string;
    media_url: string | null;
    message_id: string;
    notify_url: string | null;
    notify_id: string | null;
    created_at: string;
  }>;
}

// ─── Error ───────────────────────────────────────────────────────────────────

export interface TermiiErrorResponse {
  code?: string;
  message: string;
  description?: string;
}
