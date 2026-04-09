/**
 * Termii SDK — Full Integration Test Script
 *
 * Usage:
 *   1. Fill in your credentials in the CONFIG block below
 *   2. node test.js                  → runs all tests
 *   3. node test.js messaging        → runs only the messaging suite
 *   4. node test.js token insights   → runs token + insights suites
 *
 * Available suites:
 *   senderId | messaging | token | phonebooks | contacts | campaigns | insights
 */

const { Termii, TermiiError } = require("./dist/index.js");

// ─── CONFIG — fill these in before running ────────────────────────────────────

const CONFIG = {
  apiKey: 'YOUR_API_KEY_HERE',
  baseUrl: 'https://YOUR_BASE_URL.termii.com', // from your Termii dashboard
 
  // Phone numbers to test with (international format, no +)
  testPhone: '2347065250817',
  testPhones: ['2347065250817', '2348109077743'],
 
  // Sender ID registered on your account
  senderId: 'YourSenderID',
 
  // A phonebook ID that already exists on your account (for contacts/campaign tests)
  // Leave blank — the phonebooks suite will create one and set this automatically
  phonebookId: '',
 
  // Email for email token test
  testEmail: 'test@example.com',
  emailConfigId: 'YOUR_EMAIL_CONFIG_ID', // from Termii dashboard
};

// ─── Setup ────────────────────────────────────────────────────────────────────

const termii = new Termii({
  apiKey: CONFIG.apiKey,
  baseUrl: CONFIG.baseUrl,
});

// State shared between test suites (e.g. pinId from send → verify)
const state = {
  pinId: null,
  phonebookId: CONFIG.phonebookId || null,
  contactId: null,
  campaignId: null,
};

// ─── Logger ───────────────────────────────────────────────────────────────────

const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
};

function header(title) {
  const line = "─".repeat(60);
  console.log(`\n${c.bold}${c.blue}${line}${c.reset}`);
  console.log(`${c.bold}${c.blue}  ${title}${c.reset}`);
  console.log(`${c.bold}${c.blue}${line}${c.reset}`);
}

function subheader(name) {
  console.log(`\n  ${c.bold}${c.cyan}▶ ${name}${c.reset}`);
}

function pass(label, data) {
  console.log(`  ${c.green}✔ PASS${c.reset} ${c.bold}${label}${c.reset}`);
  console.log(`    ${c.dim}Response:${c.reset}`);
  console.log(
    JSON.stringify(data, null, 2)
      .split("\n")
      .map((l) => `    ${c.dim}${l}${c.reset}`)
      .join("\n"),
  );
}

function fail(label, err) {
  console.log(`  ${c.red}✖ FAIL${c.reset} ${c.bold}${label}${c.reset}`);
  if (err instanceof TermiiError) {
    console.log(
      `    ${c.red}TermiiError [${err.statusCode}]: ${err.message}${c.reset}`,
    );
    if (err.response) {
      console.log(
        `    ${c.dim}${JSON.stringify(err.response, null, 2)}${c.reset}`,
      );
    }
  } else {
    console.log(`    ${c.red}${err.message}${c.reset}`);
  }
}

function skip(label, reason) {
  console.log(
    `  ${c.yellow}⊘ SKIP${c.reset} ${c.bold}${label}${c.reset} ${c.dim}— ${reason}${c.reset}`,
  );
}

async function run(label, fn) {
  try {
    const result = await fn();
    pass(label, result);
    return result;
  } catch (err) {
    fail(label, err);
    return null;
  }
}

// ─── Test Suites ──────────────────────────────────────────────────────────────

async function testSenderId() {
  header("SENDER ID");

  subheader("List Sender IDs");
  await run("senderId.list()", () => termii.senderId.list());

  subheader("List Sender IDs — filtered by status");
  await run('senderId.list({ status: "active" })', () =>
    termii.senderId.list({ status: "active" }),
  );

  subheader("Request a new Sender ID");
  await run("senderId.request()", () =>
    termii.senderId.request({
      sender_id: "TestSDK",
      use_case:
        "Sending OTP and transactional messages to users via the Termii Node SDK.",
      company: "My Company Ltd",
    }),
  );
}

// ─────────────────────────────────────────────────────────────────────────────

async function testMessaging() {
  header("MESSAGING");

  subheader("Send single SMS (generic)");
  await run("messaging.send() — generic", () =>
    termii.messaging.send({
      to: CONFIG.testPhone,
      from: CONFIG.senderId,
      sms: "Hello from the Termii Node SDK! This is a test message.",
      type: "plain",
      channel: "generic",
    }),
  );

  subheader("Send single SMS (dnd)");
  await run("messaging.send() — dnd", () =>
    termii.messaging.send({
      to: CONFIG.testPhone,
      from: CONFIG.senderId,
      sms: "Transactional test from the Termii Node SDK.",
      type: "plain",
      channel: "dnd",
    }),
  );

  subheader("Send bulk SMS");
  await run("messaging.sendBulk()", () =>
    termii.messaging.sendBulk({
      to: CONFIG.testPhones,
      from: CONFIG.senderId,
      sms: "Bulk test message from the Termii Node SDK.",
      type: "plain",
      channel: "generic",
    }),
  );

  subheader("Send via auto-generated number");
  await run("messaging.sendWithNumber()", () =>
    termii.messaging.sendWithNumber({
      to: CONFIG.testPhone,
      sms: "Auto-number test from the Termii Node SDK.",
    }),
  );
}

// ─────────────────────────────────────────────────────────────────────────────

async function testToken() {
  header("TOKEN / OTP");

  subheader("Send OTP via SMS");
  const sendResult = await run("token.send()", () =>
    termii.token.send({
      message_type: "NUMERIC",
      to: CONFIG.testPhone,
      from: CONFIG.senderId,
      channel: "dnd",
      pin_attempts: 3,
      pin_time_to_live: 10,
      pin_length: 6,
      pin_placeholder: "< 000000 >",
      message_text:
        "Your verification code is < 000000 >. Valid for 10 minutes.",
      pin_type: "NUMERIC",
    }),
  );

  if (sendResult?.pinId) {
    state.pinId = sendResult.pinId;
  }

  subheader("Verify OTP");
  if (!state.pinId) {
    skip(
      "token.verify()",
      "no pinId available — token.send() must succeed first",
    );
  } else {
    // Deliberately test with wrong PIN to see the "not verified" response
    await run("token.verify() — wrong PIN (expect unverified)", () =>
      termii.token.verify({
        pin_id: state.pinId,
        pin: "000000",
      }),
    );
  }

  subheader("Send OTP via Voice");
  await run("token.sendVoice()", () =>
    termii.token.sendVoice({
      phone_number: CONFIG.testPhone,
      pin_attempts: 3,
      pin_time_to_live: 5,
      pin_length: 6,
    }),
  );

  subheader("Send Voice Call (text-to-speech)");
  await run("token.sendVoiceCall()", () =>
    termii.token.sendVoiceCall({
      phone_number: CONFIG.testPhone,
      code: "4 9 5 8 2 1",
    }),
  );

  subheader("Send OTP via Email");
  if (CONFIG.emailConfigId === "YOUR_EMAIL_CONFIG_ID") {
    skip("token.sendEmail()", "emailConfigId not configured in CONFIG");
  } else {
    await run("token.sendEmail()", () =>
      termii.token.sendEmail({
        email_address: CONFIG.testEmail,
        code: "495821",
        email_configuration_id: CONFIG.emailConfigId,
      }),
    );
  }

  subheader("Generate In-App OTP (no delivery)");
  const inAppResult = await run("token.generateInApp()", () =>
    termii.token.generateInApp({
      pin_type: "NUMERIC",
      phone_number: CONFIG.testPhone,
      pin_attempts: 3,
      pin_time_to_live: 5,
      pin_length: 6,
    }),
  );

  if (inAppResult) {
    console.log(
      `\n    ${c.magenta}→ In-App OTP generated: ${c.bold}${inAppResult.otp}${c.reset} ${c.dim}(pin_id: ${inAppResult.pin_id})${c.reset}`,
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────

async function testPhonebooks() {
  header("PHONEBOOKS");

  subheader("List all phonebooks");
  await run("phonebooks.list()", () => termii.phonebooks.list());

  subheader("Create a phonebook");
  const created = await run("phonebooks.create()", () =>
    termii.phonebooks.create({
      phonebook_name: `SDK Test Phonebook ${Date.now()}`,
      description: "Created by the Termii Node SDK test script",
    }),
  );

  // Try to get the created phonebook's ID for subsequent tests
  if (!state.phonebookId) {
    const books = await termii.phonebooks.list().catch(() => null);
    if (books?.content?.length) {
      state.phonebookId = books.content[0].id;
      console.log(
        `\n    ${c.magenta}→ Using phonebook ID: ${c.bold}${state.phonebookId}${c.reset}`,
      );
    }
  }

  subheader("Update a phonebook");
  if (!state.phonebookId) {
    skip("phonebooks.update()", "no phonebookId available");
  } else {
    await run("phonebooks.update()", () =>
      termii.phonebooks.update(state.phonebookId, {
        phonebook_name: `SDK Test Phonebook (Updated)`,
        description: "Updated by the Termii Node SDK test script",
      }),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────

async function testContacts() {
  header("CONTACTS");

  if (!state.phonebookId) {
    console.log(
      `  ${c.yellow}⚠ No phonebookId in state. Run the phonebooks suite first, or set CONFIG.phonebookId.${c.reset}`,
    );
    return;
  }

  subheader("List contacts in phonebook");
  await run("contacts.list()", () => termii.contacts.list(state.phonebookId));

  subheader("Add a single contact");
  const addResult = await run("contacts.add()", () =>
    termii.contacts.add(state.phonebookId, {
      phone_number: CONFIG.testPhone,
      country_code: "234",
      first_name: "SDK",
      last_name: "Test",
      email_address: "sdk-test@example.com",
      company: "Termii SDK",
    }),
  );

  if (addResult) {
    const added = addResult["Contact added successfully"];
    if (added?.id) {
      state.contactId = added.id;
      console.log(
        `\n    ${c.magenta}→ Contact ID: ${c.bold}${state.contactId}${c.reset}`,
      );
    }
  }

  subheader("Delete a contact");
  if (!state.contactId) {
    skip(
      "contacts.delete()",
      "no contactId — contacts.add() must succeed first",
    );
  } else {
    await run("contacts.delete()", () =>
      termii.contacts.delete(state.phonebookId, state.contactId),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────

async function testCampaigns() {
  header("CAMPAIGNS");

  subheader("List all campaigns");
  await run("campaigns.list()", () => termii.campaigns.list());

  subheader("Send a campaign");
  if (!state.phonebookId) {
    skip(
      "campaigns.send()",
      "no phonebookId — run phonebooks suite first or set CONFIG.phonebookId",
    );
  } else {
    const sendResult = await run("campaigns.send()", () =>
      termii.campaigns.send({
        country_code: "234",
        sender_id: CONFIG.senderId,
        message: "Hello! This is a test campaign sent via the Termii Node SDK.",
        channel: "generic",
        message_type: "Plain",
        phonebook_id: state.phonebookId,
        campaign_type: "regular",
        schedule_sms_status: "regular",
        remove_duplicate: "yes",
      }),
    );

    if (sendResult?.campaignId) {
      state.campaignId = sendResult.campaignId;
      console.log(
        `\n    ${c.magenta}→ Campaign ID: ${c.bold}${state.campaignId}${c.reset}`,
      );
    }
  }

  subheader("Fetch campaign history");
  if (!state.campaignId) {
    // Try to fetch history of the most recent campaign if one exists
    const list = await termii.campaigns.list().catch(() => null);
    if (list?.content?.length) {
      state.campaignId = list.content[0].campaign_id;
    }
  }

  if (!state.campaignId) {
    skip("campaigns.getHistory()", "no campaignId available");
  } else {
    await run(`campaigns.getHistory(${state.campaignId})`, () =>
      termii.campaigns.getHistory(state.campaignId),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────

async function testInsights() {
  header("INSIGHTS");

  subheader("Check account balance");
  await run("insights.balance()", () => termii.insights.balance());

  subheader("Search / DND status for a number");
  await run("insights.search()", () =>
    termii.insights.search(CONFIG.testPhone),
  );

  subheader("Phone number status (real/ported detection)");
  await run("insights.status()", () =>
    termii.insights.status(CONFIG.testPhone, "234"),
  );

  subheader("Message history");
  await run("insights.history()", () => termii.insights.history());
}

// ─── Suite Registry ───────────────────────────────────────────────────────────

const SUITES = {
  senderId: testSenderId,
  messaging: testMessaging,
  token: testToken,
  phonebooks: testPhonebooks,
  contacts: testContacts,
  campaigns: testCampaigns,
  insights: testInsights,
};

// ─── Entry Point ──────────────────────────────────────────────────────────────

async function main() {
  console.log(
    `\n${c.bold}${c.magenta}╔══════════════════════════════════════════════════════════╗${c.reset}`,
  );
  console.log(
    `${c.bold}${c.magenta}║         TERMII NODE SDK — INTEGRATION TEST RUNNER        ║${c.reset}`,
  );
  console.log(
    `${c.bold}${c.magenta}╚══════════════════════════════════════════════════════════╝${c.reset}`,
  );
  console.log(`  Base URL : ${c.cyan}${CONFIG.baseUrl}${c.reset}`);
  console.log(
    `  API Key  : ${c.cyan}${CONFIG.apiKey.slice(0, 8)}${"*".repeat(Math.max(0, CONFIG.apiKey.length - 8))}${c.reset}`,
  );
  console.log(`  Phone    : ${c.cyan}${CONFIG.testPhone}${c.reset}`);
  console.log(`  Sender   : ${c.cyan}${CONFIG.senderId}${c.reset}`);

  // Determine which suites to run
  const args = process.argv.slice(2).map((a) => a.toLowerCase());
  const selected = args.length
    ? args.filter((a) => SUITES[a])
    : Object.keys(SUITES);

  const unknown = args.filter((a) => !SUITES[a]);
  if (unknown.length) {
    console.log(
      `\n  ${c.yellow}⚠ Unknown suites ignored: ${unknown.join(", ")}${c.reset}`,
    );
    console.log(
      `  ${c.dim}Available: ${Object.keys(SUITES).join(", ")}${c.reset}`,
    );
  }

  console.log(`\n  ${c.dim}Running suites: ${selected.join(", ")}${c.reset}`);

  const startTime = Date.now();

  // Run suites sequentially so shared state flows correctly
  for (const name of selected) {
    await SUITES[name]();
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`\n${c.bold}${c.green}${"─".repeat(62)}${c.reset}`);
  console.log(
    `${c.bold}${c.green}  All suites completed in ${elapsed}s${c.reset}`,
  );
  console.log(`${c.bold}${c.green}${"─".repeat(62)}${c.reset}\n`);
}

main().catch((err) => {
  console.error(`\n${c.red}${c.bold}Fatal error:${c.reset} ${err.message}`);
  process.exit(1);
});
