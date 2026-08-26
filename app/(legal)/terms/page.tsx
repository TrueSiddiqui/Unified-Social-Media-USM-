import { Container } from '@/components/layouts/container'
import { PageHeader } from '@/components/layouts/page-header'
import Link from 'next/link'

export const metadata = {
  title: 'Terms of Service | Unified Social Media',
  description: 'Terms of Service for Unified Social Media (USM) Dashboard',
}

export default function TermsPage() {
  return (
    <Container className="py-8">
      <PageHeader
        title="Terms of Service"
        description="Last updated: August 26, 2026"
      />
      
      <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>
            These Terms of Service (&quot;Terms&quot;) govern your access to and use of Unified Social Media (&quot;USM&quot;, &quot;we&quot;, &quot;us&quot;, &quot;our&quot;),
            including our website, APIs, and services (collectively, the &quot;Service&quot;).
          </p>
          <p>
            By creating an account or using the Service, you agree to be bound by these Terms and our{' '}
            <Link href="/privacy">Privacy Policy</Link>. If you do not agree, do not use the Service.
          </p>
        </section>

        <section>
          <h2>2. Description of Service</h2>
          <p>
            USM is a unified dashboard platform that allows you to connect and manage multiple social media accounts
            (Facebook, Instagram, Threads, X/Twitter, LinkedIn, YouTube, TikTok) from a single interface.
          </p>
          <p>
            <strong>Important Disclaimers:</strong>
          </p>
          <ul>
            <li>USM is an <strong>independent, unofficial</strong> tool and is <strong>NOT affiliated with, endorsed by, or sponsored by</strong> any of the social media platforms it integrates with.</li>
            <li>We access these platforms via their official, publicly available APIs.</li>
            <li>Your use of each connected platform remains subject to that platform&apos;s own Terms of Service and Privacy Policy.</li>
            <li>We make no guarantees about API availability, uptime, or continuity of service from third-party platforms.</li>
          </ul>
        </section>

        <section>
          <h2>3. User Accounts</h2>
          
          <h3>3.1 Account Creation</h3>
          <p>To use USM, you must:</p>
          <ul>
            <li>Be at least 13 years old (or the age of digital consent in your jurisdiction)</li>
            <li>Provide accurate, complete, and current information</li>
            <li>Maintain the security of your account credentials</li>
            <li>Notify us immediately of any unauthorized access</li>
          </ul>

          <h3>3.2 Account Responsibility</h3>
          <p>
            You are solely responsible for all activity that occurs under your account. We are not liable for any loss or damage
            arising from unauthorized access to your account due to your failure to maintain adequate security.
          </p>
        </section>

        <section>
          <h2>4. Acceptable Use</h2>
          <p>You agree NOT to use the Service to:</p>
          <ul>
            <li>Violate any applicable laws, regulations, or third-party rights</li>
            <li>Post, transmit, or share illegal, harmful, threatening, abusive, harassing, defamatory, or obscene content</li>
            <li>Impersonate any person or entity, or falsely state or misrepresent your affiliation</li>
            <li>Interfere with or disrupt the Service, servers, or networks</li>
            <li>Attempt to gain unauthorized access to any systems, accounts, or data</li>
            <li>Scrape, crawl, or use automated means to access the Service beyond normal usage</li>
            <li>Reverse engineer, decompile, or attempt to extract source code</li>
            <li>Use the Service for any commercial purpose without our express written consent</li>
            <li>Violate the Terms of Service or API policies of any connected social media platform</li>
            <li>Spam, phish, or distribute malware</li>
          </ul>
        </section>

        <section>
          <h2>5. Social Media Platform Connections</h2>
          
          <h3>5.1 OAuth Authorization</h3>
          <p>
            When you connect a social media account, you grant USM permission to access your account via OAuth 2.0.
            The specific permissions (scopes) requested are clearly disclosed before you authorize.
          </p>

          <h3>5.2 Your Responsibilities</h3>
          <p>You represent and warrant that:</p>
          <ul>
            <li>You own or have authorization to connect each social media account</li>
            <li>You have read and agree to comply with each platform&apos;s Terms of Service and Developer Policies</li>
            <li>You understand that USM acts on your behalf when accessing platform data</li>
          </ul>

          <h3>5.3 Platform Compliance</h3>
          <p>
            We comply with all platform API policies. Your use is also subject to:
          </p>
          <ul>
            <li><strong>Meta (Facebook, Instagram, Threads):</strong> Meta Platform Terms and Developer Policies</li>
            <li><strong>X (Twitter):</strong> X Developer Agreement and API Restricted Use Rules</li>
            <li><strong>LinkedIn:</strong> LinkedIn API Terms of Use</li>
            <li><strong>Google/YouTube:</strong> YouTube API Services Terms and Google API Services User Data Policy</li>
            <li><strong>TikTok:</strong> TikTok Developer Terms of Service</li>
          </ul>

          <h3>5.4 Revoking Access</h3>
          <p>
            You may disconnect any platform or revoke USM&apos;s access at any time through USM Settings or each platform&apos;s security settings.
          </p>
        </section>

        <section>
          <h2>6. Intellectual Property</h2>
          
          <h3>6.1 USM Ownership</h3>
          <p>
            The Service, including its code, design, features, and branding (&quot;USM&quot;, &quot;Unified Social Media&quot;, &quot;One Social Media&quot; / &quot;OSM&quot;,
            &quot;The Social Media&quot; / &quot;TSM&quot;), is owned exclusively by TrueSiddiqui and protected by copyright and other intellectual property laws.
          </p>
          <p>
            The source code is licensed under the <strong>USM Source-Available Non-Commercial License</strong>. Commercial use is
            reserved exclusively to TrueSiddiqui. See the{' '}
            <a href="https://github.com/TrueSiddiqui/Unified-Social-Media-USM-/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">
              LICENSE file
            </a>{' '}
            for details.
          </p>

          <h3>6.2 Third-Party Trademarks</h3>
          <p>
            All social media platform names, logos, and trademarks are the property of their respective owners. See{' '}
            <a href="https://github.com/TrueSiddiqui/Unified-Social-Media-USM-/blob/main/TRADEMARKS.md" target="_blank" rel="noopener noreferrer">
              TRADEMARKS.md
            </a>{' '}
            for full attributions.
          </p>

          <h3>6.3 Your Content</h3>
          <p>
            You retain all rights to content you post or share via the Service. By using USM to post to connected platforms,
            you grant us a limited, non-exclusive license to transmit your content to those platforms on your behalf.
          </p>
        </section>

        <section>
          <h2>7. Privacy and Data</h2>
          <p>
            Our collection, use, and protection of your personal data are governed by our{' '}
            <Link href="/privacy">Privacy Policy</Link>, which is incorporated into these Terms by reference.
          </p>
          <p>Key points:</p>
          <ul>
            <li>We encrypt OAuth tokens at rest using AES-256-GCM</li>
            <li>We do NOT sell, rent, or license your personal data</li>
            <li>We do NOT use your data to train AI models</li>
            <li>You may request deletion of your data at any time</li>
          </ul>
        </section>

        <section>
          <h2>8. Disclaimers and Limitations of Liability</h2>
          
          <h3>8.1 &quot;AS IS&quot; Service</h3>
          <p>
            THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED,
            INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
          </p>

          <h3>8.2 Third-Party Platform Risks</h3>
          <p>
            USM depends on third-party APIs that may change or become unavailable at any time. We are not responsible for
            platform changes, interruptions, data loss, or actions taken by platforms against your account.
          </p>

          <h3>8.3 Limitation of Liability</h3>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL TRUESIDDIQUI OR USM BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
            SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, REVENUE, DATA, OR USE, ARISING OUT OF OR RELATED
            TO YOUR USE OF THE SERVICE.
          </p>
        </section>

        <section>
          <h2>9. Indemnification</h2>
          <p>
            You agree to indemnify, defend, and hold harmless TrueSiddiqui and USM from any claims, liabilities, damages, and
            expenses arising out of your use of the Service, your violation of these Terms, or your violation of any third-party rights.
          </p>
        </section>

        <section>
          <h2>10. Termination</h2>
          <p>
            You may terminate your account at any time. We reserve the right to suspend or terminate your access for any reason,
            including violation of these Terms. Upon termination, your data will be deleted within 30 days.
          </p>
        </section>

        <section>
          <h2>11. Contact</h2>
          <p>
            Questions about these Terms should be sent to{' '}
            <a href="https://github.com/TrueSiddiqui" target="_blank" rel="noopener noreferrer">
              github.com/TrueSiddiqui
            </a>.
          </p>
        </section>
      </div>
    </Container>
  )
}
