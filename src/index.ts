import { TermiiConfig } from './types';
import { HttpClient, TermiiError } from './http-client';
import { SenderIdResource } from './resources/sender-id';
import { MessagingResource } from './resources/messaging';
import { TokenResource } from './resources/token';
import { PhonebooksResource } from './resources/phonebooks';
import { ContactsResource } from './resources/contacts';
import { CampaignsResource } from './resources/campaigns';
import { InsightsResource } from './resources/insights';

export class Termii {
  private readonly http: HttpClient;

  /** Sender ID management — list and request sender IDs */
  public readonly senderId: SenderIdResource;

  /** Messaging — send SMS, WhatsApp, Voice, and bulk messages */
  public readonly messaging: MessagingResource;

  /** Token / OTP — send, verify, and generate one-time passwords */
  public readonly token: TokenResource;

  /** Phonebooks — create, update, list, and delete phonebooks */
  public readonly phonebooks: PhonebooksResource;

  /** Contacts — manage individual contacts within phonebooks */
  public readonly contacts: ContactsResource;

  /** Campaigns — send and manage bulk campaigns to phonebooks */
  public readonly campaigns: CampaignsResource;

  /** Insights — balance, DND search, number status, message history */
  public readonly insights: InsightsResource;

  constructor(config: TermiiConfig) {
    if (!config.apiKey) {
      throw new Error('Termii SDK: apiKey is required');
    }

    this.http = new HttpClient(config);

    this.senderId = new SenderIdResource(this.http);
    this.messaging = new MessagingResource(this.http);
    this.token = new TokenResource(this.http);
    this.phonebooks = new PhonebooksResource(this.http);
    this.contacts = new ContactsResource(this.http);
    this.campaigns = new CampaignsResource(this.http);
    this.insights = new InsightsResource(this.http);
  }
}

// Named exports for advanced use
export { TermiiError } from './http-client';
export * from './types';
