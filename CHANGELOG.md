# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-04-09

### Added
- Initial release
- `messaging` — send single, bulk, and number-based SMS; WhatsApp and Voice
- `token` — send, verify, and generate OTPs across SMS, Voice, Email, WhatsApp, and In-App
- `senderId` — list and request Sender IDs
- `phonebooks` — full CRUD for phonebooks
- `contacts` — add single contacts, bulk CSV upload, list, and delete
- `campaigns` — send, schedule, list, fetch history, and retry campaigns
- `insights` — balance, DND search, number status, and message history
- Full TypeScript types for every request and response
- `TermiiError` class with `statusCode` and raw response access
- Automatic API key injection — set once, never repeat
