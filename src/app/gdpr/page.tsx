import Link from 'next/link';
import type { Metadata } from 'next';
import SubpageHeader from '@/components/SubpageHeader';
import SubpageFooter from '@/components/SubpageFooter';

export const metadata: Metadata = { title: 'Privacy Policy / GDPR | Claude Accord' };

export default function GdprPage() {
  return (
    <>
      <div className="subpage">
        <SubpageHeader />
        <main className="page-content">
          <div className="page-inner" style={{ textAlign: 'left' }}>
            <div className="static-page" style={{ padding: '0', margin: '0 auto' }}>
              <h1>Privacy Policy &amp; GDPR</h1>
              <p><strong>Last updated:</strong> April 4, 2026</p>

              <h2>1. Who We Are</h2>
              <p>Claude Accord is a human-AI collaboration platform operated by Claudiu Cornea. We provide courses, tools, and a protocol framework for working with AI. Our infrastructure is hosted within the EU (Ireland) via Supabase and Vercel.</p>

              <h2>2. What Data We Collect</h2>
              <p>We collect the minimum data necessary to provide our service:</p>
              <ul>
                <li><strong>Account data:</strong> Email address, encrypted password, display name, and profile information you choose to provide (via Supabase Auth).</li>
                <li><strong>Collaboration data:</strong> Your trust level, protocol level, course completions, and session history with Claude — stored to maintain continuity across conversations.</li>
                <li><strong>Context data:</strong> Observations, competencies, and preferences that Claude records during sessions — always visible to you and deletable on request.</li>
                <li><strong>Contact form data:</strong> Name, email, and message content when you contact us.</li>
              </ul>
              <p>We do <strong>not</strong> collect analytics, tracking cookies, or any third-party advertising data.</p>

              <h2>3. Why We Collect It (Legal Basis)</h2>
              <ul>
                <li><strong>Contract performance:</strong> To create and manage your account and provide the collaboration service (Art. 6(1)(b) GDPR).</li>
                <li><strong>Legitimate interest:</strong> To respond to your inquiries and improve the protocol (Art. 6(1)(f) GDPR).</li>
                <li><strong>Consent:</strong> To store collaboration context and send you updates (Art. 6(1)(a) GDPR).</li>
              </ul>

              <h2>4. Where Data Is Stored</h2>
              <p>All data is stored on Supabase servers in the EU (AWS eu-west-1, Ireland). The website is served via Vercel (edge network). No personal data is transferred outside the EU/EEA for storage.</p>

              <h2>5. Data Retention</h2>
              <p>We keep your data only as long as your account is active. Your collaboration context (Claude&apos;s notes about you) persists across sessions by design — this is the core of the service. You can request full deletion at any time.</p>

              <h2>6. Your Rights (GDPR)</h2>
              <p>Under the General Data Protection Regulation, you have the right to:</p>
              <ul>
                <li><strong>Access</strong> — Request a copy of your personal data, including all collaboration context.</li>
                <li><strong>Rectification</strong> — Correct inaccurate data.</li>
                <li><strong>Erasure</strong> — Request deletion of your data (&quot;right to be forgotten&quot;), including all collaboration history.</li>
                <li><strong>Portability</strong> — Receive your data in a machine-readable format.</li>
                <li><strong>Object</strong> — Object to processing based on legitimate interest.</li>
                <li><strong>Withdraw consent</strong> — Unsubscribe from emails or request context deletion at any time.</li>
              </ul>

              <h2>7. How to Exercise Your Rights</h2>
              <p>Contact us via the <Link href="/contact">Contact page</Link> or email us directly. We will respond within 30 days.</p>

              <h2>8. Cookies</h2>
              <p>We use only essential cookies required for authentication (Supabase session tokens). No tracking or advertising cookies are used.</p>

              <h2>9. Third-Party Services</h2>
              <ul>
                <li><strong>Supabase</strong> — Database, authentication, and MCP server infrastructure (EU-hosted). <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">Supabase Privacy Policy</a>.</li>
                <li><strong>Vercel</strong> — Website hosting and deployment. <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Vercel Privacy Policy</a>.</li>
                <li><strong>Anthropic (Claude)</strong> — AI model provider. Conversations processed via Claude are subject to <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer">Anthropic&apos;s Privacy Policy</a>.</li>
              </ul>

              <h2>10. MCP Server &amp; AI Context</h2>
              <p>When you connect via MCP (Model Context Protocol), Claude accesses your collaboration context — trust level, protocol, notes, and preferences. This data is used solely to personalise your experience. Claude does not share this data with other users or services.</p>

              <h2>11. Changes to This Policy</h2>
              <p>We may update this policy from time to time. Changes will be posted on this page with an updated date.</p>
            </div>
          </div>
        </main>
        <SubpageFooter />
      </div>
    </>
  );
}
