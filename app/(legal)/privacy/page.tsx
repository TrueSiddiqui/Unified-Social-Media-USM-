import { Container } from '@/components/layouts/container'
import { PageHeader } from '@/components/layouts/page-header'

export const metadata = {
  title: 'Privacy Policy | Unified Social Media',
  description: 'Privacy Policy for Unified Social Media (USM) Dashboard',
}

export default function PrivacyPage() {
  return (
    <Container className="py-8">
      <PageHeader
        title="Privacy Policy"
        description="Last updated: August 26, 2026"
      />
      
      <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
        <section>
          <h2>1. Introduction</h2>
          <p>
            Unified Social Media (&quot;USM&quot;, &quot;we&quot;, &quot;us&quot;, &quot;our&quot;) respects your privacy and is committed to protecting your personal data.
            This Privacy Policy explains how we collect, use, store, and share information when you use our social media dashboard platform.
          </p>
          <p>
            <strong>Important:</strong> USM is an independent tool and is NOT affiliated with, endorsed by, or sponsored by
            Facebook, Instagram, Threads, X (Twitter), LinkedIn, YouTube, or TikTok. We integrate with these platforms via their official APIs.
          </p>
        </section>

        <section>
          <h2>2. Information We Collect</h2>
          
          <h3>2.1 Account Information</h3>
          <p>When you create an account with USM, we collect:</p>
          <ul>
            <li>Email address</li>
            <li>Password (stored as a cryptographic hash)</li>
            <li>Name (optional)</li>
            <li>Profile picture (optional)</li>
          </ul>

          <h3>2.2 Social Media Platform Data</h3>
          <p>When you connect a social media account, we collect and store:</p>
          <ul>
            <li><strong>Platform Profile Information:</strong> Username, profile name, profile picture, user ID</li>
            <li><strong>Access Tokens:</strong> OAuth access tokens and refresh tokens (encrypted at rest using AES-256-GCM)</li>
            <li><strong>Platform-Specific Data:</strong> Depending on the permissions you grant, we may access your posts, feed content, profile details, and engagement metrics</li>
            <li><strong>Connection Metadata:</strong> Date of connection, last update timestamp, granted scopes/permissions</li>
          </ul>

          <h3>2.3 Usage Data</h3>
          <p>We automatically collect:</p>
          <ul>
            <li>IP address</li>
            <li>Browser type and version</li>
            <li>Device information</li>
            <li>Pages visited and actions performed within USM</li>
            <li>Date and time of access</li>
          </ul>
        </section>

        <section>
          <h2>3. How We Use Your Information</h2>
          <p>We use collected data to:</p>
          <ul>
            <li><strong>Provide Core Services:</strong> Display your unified social media feed, manage connected accounts, and facilitate cross-platform posting</li>
            <li><strong>Authentication:</strong> Verify your identity and maintain secure access to your account</li>
            <li><strong>Platform Integration:</strong> Connect to and retrieve data from third-party social media platforms on your behalf</li>
            <li><strong>Service Improvement:</strong> Analyze usage patterns to improve features and user experience</li>
            <li><strong>Communication:</strong> Send important service updates, security alerts, and account notifications</li>
            <li><strong>Legal Compliance:</strong> Comply with applicable laws, regulations, and legal processes</li>
          </ul>
          <p>
            <strong>We do NOT:</strong>
          </p>
          <ul>
            <li>Sell, rent, lease, or license your personal data to third parties</li>
            <li>Use your data for surveillance purposes</li>
            <li>Use your data to train AI or machine learning models (including foundation models)</li>
            <li>Use your data for credit, employment, housing, or insurance eligibility determinations</li>
            <li>Use your data to facilitate discrimination based on protected characteristics</li>
            <li>Display advertising or use your data for personalized advertising</li>
          </ul>
        </section>

        <section>
          <h2>4. Data Storage and Security</h2>
          <p>
            We implement industry-standard security measures to protect your data:
          </p>
          <ul>
            <li><strong>Encryption:</strong> All OAuth access tokens are encrypted at rest using AES-256-GCM encryption</li>
            <li><strong>Secure Transmission:</strong> All data transmission uses HTTPS/TLS encryption</li>
            <li><strong>Password Protection:</strong> Passwords are hashed using bcrypt with salt</li>
            <li><strong>Access Controls:</strong> Database access is restricted and authenticated</li>
          </ul>
          <p>
            <strong>Data Location:</strong> Your data is stored on secure servers. We use PostgreSQL databases with appropriate backup and recovery procedures.
          </p>
        </section>

        <section>
          <h2>5. Data Retention</h2>
          <p>We retain your data as follows:</p>
          <ul>
            <li><strong>Account Data:</strong> Retained for as long as your account is active</li>
            <li><strong>Social Media Tokens:</strong> Stored until you disconnect the platform or your account is deleted</li>
            <li><strong>Platform Content:</strong> We do NOT permanently store your social media posts or content. Content is retrieved dynamically from each platform when you view your feed and is not cached beyond the active session</li>
            <li><strong>Usage Logs:</strong> Retained for up to 90 days for security and troubleshooting purposes</li>
          </ul>
          <p>
            Some platforms impose specific retention limits that we strictly follow:
          </p>
          <ul>
            <li><strong>LinkedIn:</strong> Profile data deleted within 24 hours; social activity data within 48 hours</li>
            <li><strong>Meta Platforms (Facebook, Instagram, Threads):</strong> Comply with Meta Platform Terms regarding data retention</li>
          </ul>
        </section>

        <section>
          <h2>6. Third-Party Sharing</h2>
          <p>
            <strong>We do NOT sell or share your personal data with third parties for marketing purposes.</strong>
          </p>
          <p>We may share data only in the following limited circumstances:</p>
          <ul>
            <li><strong>Social Media Platforms:</strong> When you connect a platform, we share your OAuth authorization with that platform to retrieve your data. Your data is governed by each platform&apos;s own privacy policy</li>
            <li><strong>Service Providers:</strong> We may use trusted third-party service providers (e.g., hosting, database, security) who are contractually required to protect your data and use it only for providing services to us</li>
            <li><strong>Legal Requirements:</strong> We may disclose data if required by law, court order, or governmental authority</li>
            <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your data may be transferred (you will be notified)</li>
          </ul>
        </section>

        <section>
          <h2>7. Your Rights and Choices</h2>
          <p>You have the following rights regarding your personal data:</p>
          
          <h3>7.1 Access and Portability</h3>
          <p>You may access and export your account information at any time through your account settings.</p>

          <h3>7.2 Correction</h3>
          <p>You may update or correct your account information through your profile settings.</p>

          <h3>7.3 Deletion</h3>
          <p>You may request deletion of your personal data in the following ways:</p>
          <ul>
            <li><strong>Disconnect Individual Platforms:</strong> Go to Settings → Manage Connections and disconnect any platform. This will immediately delete all associated tokens and profile data for that platform</li>
            <li><strong>Delete Your Entire Account:</strong> Go to Settings → Delete Account. This will permanently delete your USM account and all associated data within 30 days</li>
            <li><strong>Data Deletion Request:</strong> Submit a deletion request at <a href="/api/data-deletion">/api/data-deletion</a></li>
          </ul>

          <h3>7.4 Revoke OAuth Access</h3>
          <p>
            You can revoke USM&apos;s access to your social media accounts at any time through each platform&apos;s security settings:
          </p>
          <ul>
            <li><strong>Facebook/Instagram/Threads:</strong> <a href="https://www.facebook.com/settings?tab=applications" target="_blank" rel="noopener noreferrer">facebook.com/settings?tab=applications</a></li>
            <li><strong>X (Twitter):</strong> <a href="https://twitter.com/settings/connected_apps" target="_blank" rel="noopener noreferrer">twitter.com/settings/connected_apps</a></li>
            <li><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/psettings/permitted-services" target="_blank" rel="noopener noreferrer">linkedin.com/psettings/permitted-services</a></li>
            <li><strong>Google/YouTube:</strong> <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer">myaccount.google.com/permissions</a></li>
            <li><strong>TikTok:</strong> TikTok app → Settings → Security → Manage apps</li>
          </ul>
        </section>

        <section>
          <h2>8. Cookies and Tracking</h2>
          <p>
            We use essential cookies and session storage to:
          </p>
          <ul>
            <li>Maintain your authenticated session</li>
            <li>Remember your theme preference (light/dark mode)</li>
            <li>Protect against Cross-Site Request Forgery (CSRF) attacks during OAuth flows</li>
          </ul>
          <p>
            We do NOT use tracking cookies, advertising cookies, or third-party analytics services.
          </p>
        </section>

        <section>
          <h2>9. Children&apos;s Privacy</h2>
          <p>
            USM is not intended for use by individuals under the age of 13 (or the applicable age of digital consent in your jurisdiction).
            We do not knowingly collect personal information from children. If we discover that we have inadvertently collected
            data from a child, we will delete it immediately.
          </p>
        </section>

        <section>
          <h2>10. International Data Transfers</h2>
          <p>
            Your data may be stored and processed in facilities located outside your country of residence. By using USM,
            you consent to the transfer of your data to these locations. We ensure appropriate safeguards are in place to
            protect your data in accordance with this Privacy Policy and applicable laws (including GDPR and CCPA where applicable).
          </p>
        </section>

        <section>
          <h2>11. Regional Privacy Rights</h2>
          
          <h3>11.1 European Economic Area (EEA), UK, and Switzerland (GDPR)</h3>
          <p>If you are located in the EEA, UK, or Switzerland, you have additional rights under GDPR:</p>
          <ul>
            <li>Right to access your personal data</li>
            <li>Right to rectification (correction)</li>
            <li>Right to erasure (&quot;right to be forgotten&quot;)</li>
            <li>Right to restrict processing</li>
            <li>Right to data portability</li>
            <li>Right to object to processing</li>
            <li>Right to lodge a complaint with your local data protection authority</li>
          </ul>
          <p><strong>Legal Basis:</strong> We process your data based on your consent (OAuth authorization) and/or our legitimate interests in providing the service.</p>

          <h3>11.2 California (CCPA)</h3>
          <p>California residents have the right to:</p>
          <ul>
            <li>Know what personal information is collected, used, shared, or sold</li>
            <li>Delete personal information held by us</li>
            <li>Opt-out of the sale of personal information (Note: We do NOT sell personal information)</li>
            <li>Non-discrimination for exercising CCPA rights</li>
          </ul>
        </section>

        <section>
          <h2>12. Third-Party Platform Policies</h2>
          <p>
            When you connect a social media platform, your use of that platform and the data we access from it are also governed by
            that platform&apos;s own Terms of Service and Privacy Policy:
          </p>
          <ul>
            <li><strong>Meta (Facebook, Instagram, Threads):</strong> <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer">Meta Privacy Policy</a></li>
            <li><strong>X (Twitter):</strong> <a href="https://twitter.com/en/privacy" target="_blank" rel="noopener noreferrer">X Privacy Policy</a></li>
            <li><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">LinkedIn Privacy Policy</a></li>
            <li><strong>Google/YouTube:</strong> <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a></li>
            <li><strong>TikTok:</strong> <a href="https://www.tiktok.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">TikTok Privacy Policy</a></li>
          </ul>
        </section>

        <section>
          <h2>13. Contact Us</h2>
          <p>
            If you have questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact:
          </p>
          <p>
            <strong>TrueSiddiqui</strong><br />
            GitHub: <a href="https://github.com/TrueSiddiqui" target="_blank" rel="noopener noreferrer">github.com/TrueSiddiqui</a>
          </p>
          <p>
            For data deletion requests, you may also use our automated endpoint at <a href="/api/data-deletion">/api/data-deletion</a>
          </p>
        </section>
      </div>
    </Container>
  )
}
