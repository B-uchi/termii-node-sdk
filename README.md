# termii-node-sdk

A robust, fully-typed Node.js / TypeScript SDK for the [Termii](https://termii.com) messaging API.

Covers every product surface: **Messaging**, **Token/OTP**, **Phonebooks**, **Contacts**, **Campaigns**, **Sender IDs**, and **Insights**.

---

## Installation

```bash
npm install termii-node-sdk
# or
yarn add termii-node-sdk
```

---

## Quick Start

```typescript
import { Termii } from 'termii-node-sdk';

const termii = new Termii({
  apiKey: 'YOUR_API_KEY',
  baseUrl: 'https://YOUR_BASE_URL.termii.com', // found on your Termii dashboard
});

// Send an SMS
const result = await termii.messaging.send({
  to: '2347065250817',
  from: 'MyBrand',
  sms: 'Hello from Termii SDK!',
  type: 'plain',
  channel: 'generic',
});

console.log(result.message_id);
```

---

## Configuration

| Option    | Required | Default                         | Description                                    |
|-----------|----------|---------------------------------|------------------------------------------------|
| `apiKey`  | ✅        | —                               | Your Termii API key (from dashboard)           |
| `baseUrl` | ❌        | `https://v3.api.termii.com`     | Your account's regional base URL              |
| `timeout` | ❌        | `30000`                         | HTTP request timeout in milliseconds           |

---

## Error Handling

All methods throw a `TermiiError` on failure. It exposes `statusCode` and the raw `response` payload.

```typescript
import { Termii, TermiiError } from 'termii-node-sdk';

try {
  await termii.messaging.send({ ... });
} catch (err) {
  if (err instanceof TermiiError) {
    console.error(`[${err.statusCode}] ${err.message}`);
    console.error(err.response); // raw Termii error body
  }
}
```

---

## API Reference

### `termii.messaging`

#### `.send(params)` — Send a single message
```typescript
await termii.messaging.send({
  to: '2347065250817',          // or array: ['234...', '234...'] (max 100)
  from: 'MyBrand',
  sms: 'Your order has shipped.',
  type: 'plain',                // 'plain' | 'unicode' | 'encrypted' | 'voice'
  channel: 'dnd',              // 'generic' | 'dnd' | 'whatsapp' | 'voice'
});
```

#### `.sendBulk(params)` — Send to multiple numbers at once
```typescript
await termii.messaging.sendBulk({
  to: ['2347065250817', '2348109077743'],
  from: 'MyBrand',
  sms: 'Big sale today!',
  type: 'plain',
  channel: 'generic',
});
```

#### `.sendWithNumber(params)` — Use auto-generated Termii numbers
```typescript
await termii.messaging.sendWithNumber({
  to: '2347065250817',
  sms: 'Hi there!',
});
```

---

### `termii.token`

#### `.send(params)` — Send OTP via SMS
```typescript
const res = await termii.token.send({
  message_type: 'NUMERIC',
  to: '2347065250817',
  from: 'MyBrand',
  channel: 'dnd',
  pin_attempts: 3,
  pin_time_to_live: 5,   // minutes
  pin_length: 6,
  pin_placeholder: '< 000000 >',
  message_text: 'Your OTP is < 000000 >. Valid for 5 minutes.',
  pin_type: 'NUMERIC',
});

console.log(res.pinId); // save this to verify later
```

#### `.verify(params)` — Verify an OTP
```typescript
const res = await termii.token.verify({
  pin_id: 'b1f2242a-44c5-4eed-94bc-8d37b67ef219',
  pin: '495821',
});

if (res.verified === 'True') {
  console.log('OTP verified!');
}
```

#### `.sendVoice(params)` — Send OTP via voice call
```typescript
await termii.token.sendVoice({
  phone_number: '2347065250817',
  pin_attempts: 3,
  pin_time_to_live: 5,
  pin_length: 6,
});
```

#### `.sendVoiceCall(params)` — Send a text-to-speech voice message
```typescript
await termii.token.sendVoiceCall({
  to: '2347065250817',
  code: '4 9 5 8 2 1',  // add spaces for better TTS pronunciation
});
```

#### `.sendEmail(params)` — Send OTP to an email
```typescript
await termii.token.sendEmail({
  email_address: 'user@example.com',
  code: '495821',
  email_configuration_id: 'your-config-id',
});
```

#### `.generateInApp(params)` — Generate OTP without sending it
```typescript
const res = await termii.token.generateInApp({
  pin_type: 'NUMERIC',
  phone_number: '2347065250817',
  pin_attempts: 3,
  pin_time_to_live: 5,
  pin_length: 6,
});

console.log(res.otp);    // use in your own delivery
console.log(res.pin_id); // save for verification
```

#### `.sendWhatsApp(params)` — Send OTP via WhatsApp
```typescript
await termii.token.sendWhatsApp({
  to: '2347065250817',
  from: 'MyDevice',
  template_id: 'your-template-id',
  data: { otp: '495821' },
});
```

---

### `termii.senderId`

#### `.list(filters?)` — Fetch all Sender IDs
```typescript
const res = await termii.senderId.list();
// Filter by status:
const active = await termii.senderId.list({ status: 'active' });
```

#### `.request(params)` — Request a new Sender ID
```typescript
await termii.senderId.request({
  sender_id: 'MyBrand',
  use_case: 'Sending OTP codes to users',
  company: 'My Company Ltd',
});
```

---

### `termii.phonebooks`

```typescript
// List all phonebooks
const books = await termii.phonebooks.list();

// Create a new phonebook
await termii.phonebooks.create({
  phonebook_name: 'Premium Customers',
  description: 'All customers on the premium plan',
});

// Update a phonebook
await termii.phonebooks.update('phonebook-id', {
  phonebook_name: 'VIP Customers',
  description: 'Updated description',
});

// Delete a phonebook
await termii.phonebooks.delete('phonebook-id');
```

---

### `termii.contacts`

```typescript
// List contacts in a phonebook
const contacts = await termii.contacts.list('phonebook-id');

// Add a single contact
await termii.contacts.add('phonebook-id', {
  phone_number: '8123696237',
  country_code: '234',
  email_address: 'jane@example.com',
  first_name: 'Jane',
  last_name: 'Doe',
  company: 'Acme Corp',
});

// Bulk upload from a CSV file
await termii.contacts.upload({
  filePath: './contacts.csv',
  phonebookId: 'phonebook-id',
  country_code: '234',
});

// Delete a contact
await termii.contacts.delete('phonebook-id', 'contact-id');
```

---

### `termii.campaigns`

```typescript
// Send a campaign
const res = await termii.campaigns.send({
  country_code: '234',
  sender_id: 'MyBrand',
  message: 'Flash sale! 50% off everything today.',
  channel: 'generic',
  message_type: 'Plain',
  phonebook_id: 'phonebook-id',
  campaign_type: 'regular',
  schedule_sms_status: 'regular',
});

// Scheduled campaign
await termii.campaigns.send({
  // ... other params
  schedule_sms_status: 'scheduled',
  schedule_time: '30-06-2025 18:00',
});

// List all campaigns
const campaigns = await termii.campaigns.list();

// Get campaign delivery details
const history = await termii.campaigns.getHistory('C714360330258');

// Retry a failed campaign
await termii.campaigns.retry('C714360330258');
```

---

### `termii.insights`

```typescript
// Check account balance
const { balance, currency } = await termii.insights.balance();

// Check a number's DND status and network
const info = await termii.insights.search('2347065250817');
console.log(info.dnd_active, info.network);

// Verify if a number is real or ported
const status = await termii.insights.status('2347065250817', '234');

// Fetch message history
const history = await termii.insights.history();
```

---

## Project Structure

```
src/
├── index.ts              # Main Termii client + re-exports
├── http-client.ts        # Axios wrapper + TermiiError class
├── types/
│   └── index.ts          # All TypeScript interfaces and types
└── resources/
    ├── sender-id.ts
    ├── messaging.ts
    ├── token.ts
    ├── phonebooks.ts
    ├── contacts.ts
    ├── campaigns.ts
    └── insights.ts
```

---

## License

MIT
