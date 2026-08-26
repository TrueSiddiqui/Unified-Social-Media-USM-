# Platform API Compliance Guide

This document outlines how Unified Social Media (USM) complies with the developer policies and terms of service of all integrated social media platforms.

## Overview

USM is an independent, unofficial tool that integrates with social media platforms via their official public APIs. We are committed to full compliance with all platform policies.

**Last Updated:** August 26, 2026

---

## Platform Compliance Summary

| Platform | Policy Compliance | Key Requirements |
|----------|-------------------|------------------|
| Facebook, Instagram, Threads | ✅ Meta Platform Terms | Privacy policy, data deletion, no selling data |
| X (Twitter) | ✅ X Developer Agreement | No AI training, no iframe embedding |
| LinkedIn | ✅ LinkedIn API Terms | 24-48hr data retention, no scraping |
| YouTube | ✅ Google API User Data Policy | Limited Use, user revocation |
| TikTok | ✅ TikTok Developer Terms | Privacy policy, secure storage |

---

## General Compliance Measures

### 1. Privacy Policy ✅
- **Location:** `/privacy`
- **Requirement:** All platforms require a publicly accessible privacy policy
- **Our Policy Covers:**
  - Data collection and usage
  - Third-party sharing (only OAuth to platforms)
  - Data retention and deletion
  - User rights (access, correction, deletion)
  - Security measures (AES-256-GCM encryption)

### 2. Terms of Service ✅
- **Location:** `/terms`
- **Covers:** User obligations, acceptable use, disclaimers, liability limitations

### 3. Data Deletion ✅
- **Endpoint:** `/api/data-deletion`
- **Functionality:** Users can request complete deletion of their data
- **Timeline:** Data deleted within 30 days

### 4. User Consent ✅
- Clear disclosure before OAuth authorization
- Explicit permission scopes shown to users
- Links to Privacy Policy and Terms before connection

### 5. Data Security ✅
- OAuth tokens encrypted at rest (AES-256-GCM)
- Passwords hashed with bcrypt
- HTTPS/TLS for all data transmission
- CSRF protection for OAuth flows

---

## Platform-Specific Compliance

### Meta Platforms (Facebook, Instagram, Threads)

**Governing Policies:**
- [Meta Platform Terms](https://developers.facebook.com/terms)
- [Meta Developer Policies](https://developers.facebook.com/devpolicy/)

**Compliance Checklist:**
- ✅ Publicly accessible Privacy Policy
- ✅ Data deletion endpoint
- ✅ No selling, licensing, or renting user data
- ✅ No surveillance or discriminatory use
- ✅ No profile augmentation without consent
- ✅ Encrypted token storage
- ✅ CSRF state protection

**Prohibited Activities We Avoid:**
- ❌ Selling Platform Data
- ❌ Surveillance
- ❌ Discrimination based on protected characteristics
- ❌ Credit/employment/housing eligibility determinations

---

### X (Twitter)

**Governing Policies:**
- [X Developer Agreement](https://docs.x.com/developer-terms/agreement)
- [API Restricted Use Rules](https://developer.twitter.com/en/developer-terms/agreement-and-policy)

**Compliance Checklist:**
- ✅ No use of X data to train foundation/AI models
- ✅ No iframe embedding of X content
- ✅ Delete X content within 24 hours if requested by user or X
- ✅ Rate limit compliance
- ✅ Security measures for API credentials

**Prohibited Activities We Avoid:**
- ❌ Training AI models with X data
- ❌ Framing/embedding X content in iframes
- ❌ Using X data for ad targeting outside X
- ❌ Sharing API credentials

---

### LinkedIn

**Governing Policies:**
- [LinkedIn API Terms of Use](https://www.linkedin.com/legal/l/api-terms-of-use)

**Compliance Checklist:**
- ✅ Privacy policy at least as strong as LinkedIn's
- ✅ Strict data retention limits:
  - Profile data: deleted within 24 hours
  - Member social activity: deleted within 48 hours
- ✅ Immediate deletion upon user request
- ✅ No scraping or unauthorized data access
- ✅ No selling or sublicensing LinkedIn data

**Prohibited Activities We Avoid:**
- ❌ Scraping LinkedIn content
- ❌ Selling, renting, or leasing LinkedIn data
- ❌ Credit/insurance/housing/employment eligibility decisions
- ❌ Discrimination or surveillance
- ❌ Combining LinkedIn data with unauthorized third-party sources

**Data Retention Implementation:**
- LinkedIn profile data is NOT stored permanently
- Data retrieved dynamically on-demand
- No caching beyond active user session

---

### YouTube (Google APIs)

**Governing Policies:**
- [YouTube API Services Terms](https://developers.google.com/youtube/terms/api-services-terms-of-service)
- [Google API Services User Data Policy](https://developers.google.com/terms/api-services-user-data-policy)

**Compliance Checklist:**
- ✅ Clear privacy policy disclosure
- ✅ **Limited Use** compliance for sensitive scopes:
  - No selling user data to third parties
  - No use for personalized advertising
  - No use for creditworthiness determination
- ✅ User control and revocation via Google security settings
- ✅ Data deletion within 30 days of user request
- ✅ Security controls (encrypted storage)
- ✅ Minimum permissions requested

**Prohibited Activities We Avoid:**
- ❌ Selling or transferring user data to data brokers
- ❌ Using data for personalized advertising
- ❌ Surveillance
- ❌ Misrepresenting identity or purpose
- ❌ Cloning YouTube's user experience

**User Revocation:**
Users can revoke access at: [myaccount.google.com/permissions](https://myaccount.google.com/permissions)

---

### TikTok

**Governing Policies:**
- [TikTok Developer Terms of Service](https://www.tiktok.com/legal/page/global/tik-tok-developer-terms-of-service/en)
- [TikTok Developer Data Sharing Agreement](https://www.tiktok.com/legal/page/global/tiktok-data-sharing-agreement/en)

**Compliance Checklist:**
- ✅ Complete and accurate privacy disclosure
- ✅ Industry-standard security safeguards
- ✅ Stable and navigable application
- ✅ Compliance with data protection laws (GDPR, etc.)
- ✅ URL ownership verification for privacy policy
- ✅ No promotional watermarks on shared content

**Prohibited Activities We Avoid:**
- ❌ Scraping or reverse-engineering TikTok
- ❌ Competing with or replicating TikTok's core offering
- ❌ Adding promotional watermarks to content

---

## Developer Setup Requirements

To use USM with all platforms, developers need to:

1. **Create developer accounts** on each platform:
   - [Meta for Developers](https://developers.facebook.com/)
   - [X Developer Portal](https://developer.twitter.com/)
   - [LinkedIn Developers](https://www.linkedin.com/developers/)
   - [Google Cloud Console](https://console.cloud.google.com/) (for YouTube)
   - [TikTok for Developers](https://developers.tiktok.com/)

2. **Register your application** and obtain:
   - Client ID
   - Client Secret
   - Configure OAuth redirect URIs

3. **Pass App Review** (where required):
   - Meta: App Review for public use
   - TikTok: Manual app review process

4. **Configure environment variables** in `.env`:
   ```bash
   FACEBOOK_APP_ID=your_app_id
   FACEBOOK_APP_SECRET=your_secret
   # ... (repeat for each platform)
   ```

5. **Set up callback URLs** in each platform's developer dashboard:
   - Facebook: `https://yourdomain.com/api/auth/facebook/callback`
   - Instagram: `https://yourdomain.com/api/auth/instagram/callback`
   - (etc.)

---

## API Rate Limits and Quotas

Each platform imposes rate limits. USM respects these limits:

| Platform | Free Tier Limit | Notes |
|----------|----------------|-------|
| X (Twitter) | 2M post reads/month | Pay-per-use model |
| LinkedIn | Varies by endpoint | Monitor via Developer Portal |
| YouTube | 10,000 quota units/day | Standard project quota |
| Meta | Varies | Subject to app review level |
| TikTok | Varies | Production access requires review |

---

## User Rights and Data Control

Users can:

1. **View connected accounts** in Settings
2. **Disconnect any platform** (deletes tokens immediately)
3. **Request data deletion** via Settings or `/api/data-deletion`
4. **Revoke OAuth access** on each platform:
   - [Facebook Apps](https://www.facebook.com/settings?tab=applications)
   - [X Connected Apps](https://twitter.com/settings/connected_apps)
   - [LinkedIn Apps](https://www.linkedin.com/psettings/permitted-services)
   - [Google Permissions](https://myaccount.google.com/permissions)
   - TikTok: Settings → Security → Manage apps

---

## Ongoing Compliance

We maintain compliance by:

1. **Regular policy reviews** - Monitoring platform policy updates
2. **Security audits** - Annual security assessments
3. **User communication** - Notifying users of material changes
4. **Immediate response** - Addressing platform compliance requests promptly
5. **Documentation** - Keeping this compliance guide updated

---

## Contact for Compliance Questions

For compliance inquiries or platform policy questions:

**Project Owner:** TrueSiddiqui  
**GitHub:** [github.com/TrueSiddiqui](https://github.com/TrueSiddiqui)  
**Repository:** [USM GitHub Repo](https://github.com/TrueSiddiqui/Unified-Social-Media-USM-)

---

## References

- [Meta Platform Terms](https://developers.facebook.com/terms)
- [X Developer Agreement](https://docs.x.com/developer-terms/agreement)
- [LinkedIn API Terms](https://www.linkedin.com/legal/l/api-terms-of-use)
- [Google API User Data Policy](https://developers.google.com/terms/api-services-user-data-policy)
- [TikTok Developer Terms](https://www.tiktok.com/legal/page/global/tik-tok-developer-terms-of-service/en)

