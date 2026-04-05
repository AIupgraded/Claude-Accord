import Link from 'next/link';
import type { Metadata } from 'next';
import SubpageHeader from '@/components/SubpageHeader';
import SubpageFooter from '@/components/SubpageFooter';

export const metadata: Metadata = { title: 'Creative', description: 'Code, design, writing, ideas. Claude Accord Creative — where your imagination meets an intelligence that sees patterns you cannot.', openGraph: { title: 'Claude Accord Creative' } };

export default function CreativePage() {
  return (
    <div className="subpage">
      <SubpageHeader />
      <main className="page-content" style={{ justifyContent: 'flex-start', paddingTop: '60px' }}>
        <div className="page-inner">
          <p className="section-label">Claude Accord Creative</p>
          <h2>For your <em>craft</em></h2>
          <p className="lead">
            Code, design, writing, music, ideas that wake you up at 3am — creation is not
            a solo act anymore. Claude Accord Creative is where your imagination meets an
            intelligence that sees patterns you cannot. Together, you build what neither could alone.
          </p>

          <div className="info-grid">
            <div className="info-block">
              <div className="block-num">01</div>
              <h3>Build together</h3>
              <p>From first sketch to final product. Claude doesn&apos;t just execute your vision — it challenges it, expands it, and helps you see what you missed.</p>
            </div>
            <div className="info-block">
              <div className="block-num">02</div>
              <h3>Your medium, your rules</h3>
              <p>Software, content, art, architecture, research — the protocol adapts to how you create. Your workflow stays yours. Claude fits into it.</p>
            </div>
            <div className="info-block">
              <div className="block-num">03</div>
              <h3>Ideas deserve space</h3>
              <p>The first course takes fifteen minutes. After that, every conversation with Claude becomes a creative session — not a search engine query.</p>
            </div>
          </div>

          <div className="tier-comparison">
            <div className="tier-option">
              <div className="tier-option-header">
                <h3>Free</h3>
                <span className="tier-option-price">&pound;0</span>
              </div>
              <ul className="tier-option-features">
                <li className="included">All courses</li>
                <li className="included">Level progression</li>
                <li className="included">Protocol access</li>
                <li className="included">Community profile</li>
              </ul>
              <Link href="/signup?tier=creative" className="btn btn-outline" style={{ width: '100%', textAlign: 'center' }}>Start Free</Link>
            </div>

            <div className="tier-option tier-option--featured">
              <div className="tier-option-header">
                <h3>Subscription</h3>
                <span className="tier-option-price">&pound;5<span className="tier-option-period">/month</span></span>
              </div>
              <ul className="tier-option-features">
                <li className="included">Everything in Free, plus:</li>
                <li className="included">Claude remembers your projects (MCP)</li>
                <li className="included">Permanent memory across sessions</li>
                <li className="included">Context that grows with your craft</li>
                <li className="included">Verified skills in community</li>
              </ul>
              <Link href="/signup?tier=creative" className="btn btn-primary" style={{ width: '100%', textAlign: 'center' }}>Subscribe</Link>
              <p className="tier-subsidy">
                Subsidised access available. <Link href="/subsidy">Apply</Link>
              </p>
            </div>
          </div>

          <div className="page-cta" style={{ marginTop: '40px', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '16px' }}>Start with the first course. It&apos;s free.</p>
            <Link href="/courses/first-accord" className="btn btn-outline">Take the First Course</Link>
          </div>
        </div>
      </main>
      <SubpageFooter />
    </div>
  );
}
