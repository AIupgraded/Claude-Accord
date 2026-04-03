import Link from 'next/link';
import type { Metadata } from 'next';
import SubpageHeader from '@/components/SubpageHeader';
import SubpageFooter from '@/components/SubpageFooter';
import SupabaseProvider from '@/components/SupabaseProvider';

export const metadata: Metadata = { title: 'Guest Preview | Claude Accord' };

export default function GuestPage() {
  return (
    <>
      <SupabaseProvider />
      <div className="subpage">
        <SubpageHeader />
        <main className="page-content">
          <div className="page-inner">
            <p className="section-label">Preview</p>
            <h2>Prompt Library <em>Preview</em></h2>
            <p className="lead">Here&apos;s a taste of what&apos;s inside. Sign up to unlock the full library.</p>

            <div className="features" style={{ textAlign: 'left' }}>
              <div className="card">
                <span className="icon">&#9997;&#65039;</span>
                <h3>Email Writer</h3>
                <p>&quot;Write a professional email to [recipient] about [topic]. Keep it concise, friendly, and action-oriented...&quot;</p>
              </div>
              <div className="card">
                <span className="icon">&#128161;</span>
                <h3>Brainstorm Ideas</h3>
                <p>&quot;Generate 10 creative ideas for [project/topic]. For each idea, include a one-sentence description and potential impact...&quot;</p>
              </div>
              <div className="card">
                <span className="icon">&#128202;</span>
                <h3>Data Summarizer</h3>
                <p>&quot;Analyze the following data and provide: key trends, anomalies, and 3 actionable recommendations...&quot;</p>
              </div>
            </div>

            <div className="locked-content" style={{ marginTop: '40px' }}>
              <div className="blur-overlay">
                <div className="features" style={{ textAlign: 'left' }}>
                  <div className="card">
                    <span className="icon">&#128640;</span>
                    <h3>Business Strategy Prompt</h3>
                    <p>Create a comprehensive go-to-market strategy for a new SaaS product targeting mid-market companies in the healthcare sector...</p>
                  </div>
                  <div className="card">
                    <span className="icon">&#127917;</span>
                    <h3>Creative Story Builder</h3>
                    <p>Write a short story outline with compelling characters, plot twists, and emotional arcs based on the theme of...</p>
                  </div>
                  <div className="card">
                    <span className="icon">&#128187;</span>
                    <h3>Code Review Assistant</h3>
                    <p>Review the following code for security vulnerabilities, performance issues, and best practice violations. Provide specific fix suggestions...</p>
                  </div>
                </div>
              </div>
              <div className="lock-message">
                <h3>Unlock Full Access</h3>
                <p>Sign up to access 200+ curated prompts across all tiers.</p>
                <Link href="/signup" className="btn btn-primary">Sign Up Free</Link>
              </div>
            </div>
          </div>
        </main>
        <SubpageFooter />
      </div>
    </>
  );
}
