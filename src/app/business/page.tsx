import Link from 'next/link';
import type { Metadata } from 'next';
import SubpageHeader from '@/components/SubpageHeader';
import SubpageFooter from '@/components/SubpageFooter';

export const metadata: Metadata = { title: 'Claude Accord — Business' };

export default function BusinessPage() {
  return (
    <div className="subpage">
      <SubpageHeader />
      <main className="page-content" style={{ justifyContent: 'flex-start', paddingTop: '60px' }}>
        <div className="page-inner">
          <p className="section-label">Claude Accord Business</p>
          <h2>For your <em>work</em></h2>
          <p className="lead">
            Your business runs on decisions. Strategy, communication, analysis, execution —
            every day, dozens of moments where the right thinking makes the difference.
            Claude Accord Business is where you and Claude work on what matters most.
          </p>

          <div className="info-grid">
            <div className="info-block">
              <div className="block-num">01</div>
              <h3>Strategic thinking</h3>
              <p>From market analysis to pitch decks, from hiring decisions to client communication — Claude brings pattern recognition you cannot have alone. You bring the judgment.</p>
            </div>
            <div className="info-block">
              <div className="block-num">02</div>
              <h3>Your business, your context</h3>
              <p>Accounting, operations, marketing, team management — the protocol learns your business and adapts. Every conversation builds on the last.</p>
            </div>
            <div className="info-block">
              <div className="block-num">03</div>
              <h3>From day one</h3>
              <p>Whether you run a company or just started freelancing. The first course takes fifteen minutes. The protocol scales with you.</p>
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
              <Link href="/signup?tier=business" className="btn btn-outline" style={{ width: '100%', textAlign: 'center' }}>Start Free</Link>
            </div>

            <div className="tier-option tier-option--featured">
              <div className="tier-option-header">
                <h3>Subscription</h3>
                <span className="tier-option-price">&pound;5<span className="tier-option-period">/month</span></span>
              </div>
              <ul className="tier-option-features">
                <li className="included">Everything in Free, plus:</li>
                <li className="included">Claude remembers your business context (MCP)</li>
                <li className="included">Permanent memory across sessions</li>
                <li className="included">Context that grows with your business</li>
                <li className="included">Verified skills in community</li>
              </ul>
              <Link href="/signup?tier=business" className="btn btn-primary" style={{ width: '100%', textAlign: 'center' }}>Subscribe</Link>
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
