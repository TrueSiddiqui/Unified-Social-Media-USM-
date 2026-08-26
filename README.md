# Unified Social Media Dashboard (USM)

A unified social media dashboard that lets you connect and manage multiple social platforms from a single place — **Facebook, Instagram, Threads, X (Twitter), LinkedIn, YouTube, and TikTok**.

Built with **Next.js (App Router)**, **NextAuth**, **Prisma**, **PostgreSQL**, and **Tailwind CSS**.

## Features

- 🔐 Email/password authentication (NextAuth + credentials provider)
- 🔗 Connect social accounts via OAuth 2.0 (with CSRF-protected state flow)
- 🗂️ Unified dashboard showing connection status per platform
- 📰 Unified feed view aggregating posts from connected platforms
- ⚙️ Settings page to manage and disconnect accounts
- 🔒 Access/refresh tokens encrypted at rest (AES-256-GCM)
- 🌗 Light/dark theme

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Framework  | Next.js (App Router, TypeScript)    |
| Auth       | NextAuth.js                         |
| Database   | PostgreSQL + Prisma ORM             |
| Styling    | Tailwind CSS + shadcn/ui components |
| Animations | Framer Motion                       |

## Getting Started

### 1. Install dependencies

```bash
yarn install
```

### 2. Configure environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

At minimum you need `DATABASE_URL`, `NEXTAUTH_SECRET`, and `AUTH_SECRET`.
Add OAuth credentials for each platform you want to enable (see `.env.example`).

### 3. Set up the database

```bash
yarn prisma generate
yarn prisma db push
yarn prisma db seed   # optional: seeds initial data
```

### 4. Run the development server

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

See [`.env.example`](./.env.example) for the full list. Each platform requires
a client ID/secret pair obtained from that platform's developer portal.

> **Note:** Instagram, Facebook, and Threads require a Meta Developer app with
> the appropriate permissions/approval for full API access. Other platforms have
> their own API tiers and limits.

## Project Structure

```
app/            Next.js routes (auth, dashboard, feed, settings, API)
components/     UI + layout components
lib/            Prisma client, auth config, platform config, crypto utils
prisma/         Database schema
scripts/        Seed script
```

## License

This project is licensed under the **Unified Social Media (USM) Source-Available Non-Commercial License (v1.2)** — see the [LICENSE](./LICENSE) file for the full terms.

In short:

- ✅ Anyone may use, study, modify, and build upon this project for **non-commercial** purposes.
- ✅ You may distribute your changes, as long as it stays non-commercial and keeps this license.
- ❌ **No one may make money** from this project or works derived from it — **all commercial rights are reserved exclusively and perpetually to TrueSiddiqui**.
- 👤 **Sole ownership:** TrueSiddiqui is the sole owner. Using, forking, or contributing does **not** give anyone ownership or any commercial claim, and no one may claim the project (no loopholes).
- ® **Reserved names:** "Unified Social Media" / "USM", "One Social Media" / "OSM", and "The Social Media" / "TSM" are exclusively reserved by TrueSiddiqui and may not be used, registered, or claimed by anyone else.
- 🤝 **Contributors:** Contributions are welcome and are assigned to the project owner. If and when the project starts generating revenue, TrueSiddiqui intends in good faith to fairly compensate contributors/developers — payable only after revenue is received and under a separate written agreement.

> Note: This license is a custom, source-available non-commercial license, not an OSI-approved open-source license. It is provided as-is and is not legal advice; consult a lawyer for enforceability in your jurisdiction.

For commercial licensing inquiries or contributor agreements, please contact TrueSiddiqui.

## Trademarks & Attributions

This project is an **independent, unofficial** tool and is **not affiliated with, endorsed by, or sponsored by** any of the social media platforms it integrates with. All product names, logos, and brands are the property of their respective owners, used here for identification and interoperability purposes only.

| Platform | Owner |
|--------------------|------------------------------------------------|
| Facebook, Instagram, Threads | Meta Platforms, Inc. |
| X (Twitter) | X Corp. |
| LinkedIn | LinkedIn Corporation (a Microsoft subsidiary) |
| YouTube | Google LLC (a subsidiary of Alphabet Inc.) |
| TikTok | ByteDance Ltd. |

See [TRADEMARKS.md](./TRADEMARKS.md) for full attributions and details.

## Platform API Compliance

USM is fully compliant with all integrated platform developer policies and terms of service:

- ✅ **Privacy Policy** and **Terms of Service** - Publicly accessible at `/privacy` and `/terms`
- ✅ **Data Deletion** - Users can request deletion via `/api/data-deletion` or account settings
- ✅ **Secure Storage** - OAuth tokens encrypted with AES-256-GCM, passwords hashed with bcrypt
- ✅ **User Consent** - Clear disclosure before OAuth authorization
- ✅ **No Data Selling** - We never sell, rent, or license user data
- ✅ **No AI Training** - User data is not used to train AI/ML models
- ✅ **Platform-Specific Compliance**:
  - **Meta (Facebook/Instagram/Threads):** Meta Platform Terms & Developer Policies
  - **X (Twitter):** X Developer Agreement, no iframe embedding, no AI training
  - **LinkedIn:** API Terms of Use, 24-48hr data retention limits
  - **YouTube:** Google API User Data Policy, Limited Use compliance
  - **TikTok:** Developer Terms, secure storage, privacy disclosure

See [COMPLIANCE.md](./COMPLIANCE.md) for detailed compliance documentation and developer guidelines.
