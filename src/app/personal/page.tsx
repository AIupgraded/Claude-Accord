import Link from 'next/link';
import type { Metadata } from 'next';
import SubpageHeader from '@/components/SubpageHeader';
import SubpageFooter from '@/components/SubpageFooter';

export const metadata: Metadata = { title: 'Personal', description: 'Your life, your questions, your growth. Claude Accord Personal — courses, tools, and a relationship with AI that remembers you.', openGraph: { title: 'Claude Accord Personal' } };

export default function PersonalPage() {
  return (
    <>
      <div className="subpage">
        <SubpageHeader />
        <main className="page-content" style={{ justifyContent: 'flex-start', paddingTop: '60px' }}>
          <div className="page-inner">
            <p className="section-label">Claude Accord Personal</p>
            <h2>For <em>you</em></h2>
            <p className="lead">
              Your life. Your questions. Your growth. Claude Accord Personal is where you learn
              to work with Claude the way it was meant to be — together. Courses, tools,
              and a relationship that remembers you.
            </p>

            <div className="info-grid">
              <div className="info-block">
                <div className="block-num">01</div>
                <h3>Real conversation</h3>
                <p>A way of talking to Claude that changes what comes back. Context, trust, and depth — built one conversation at a time.</p>
              </div>
              <div className="info-block">
                <div className="block-num">02</div>
                <h3>Your life, your depth</h3>
                <p>Health, family, learning, daily decisions — the protocol adapts to your life. Not the other way around.</p>
              </div>
              <div className="info-block">
                <div className="block-num">03</div>
                <h3>Fifteen minutes to start</h3>
                <p>Start where you are. The first course takes fifteen minutes. What changes after — that&apos;s yours to discover.</p>
              </div>
            </div>

            {/* Free vs Subscription */}
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
                <Link href="/signup?tier=personal" className="btn btn-outline" style={{ width: '100%', textAlign: 'center' }}>Start Free</Link>
              </div>

              <div className="tier-option tier-option--featured">
                <div className="tier-option-header">
                  <h3>Subscription</h3>
                  <span className="tier-option-price">&pound;5<span className="tier-option-period">/month</span></span>
                </div>
                <ul className="tier-option-features">
                  <li className="included">Everything in Free, plus:</li>
                  <li className="included">Claude remembers you (MCP)</li>
                  <li className="included">Permanent memory across sessions</li>
                  <li className="included">Context that grows with you</li>
                  <li className="included">Verified skills in community</li>
                </ul>
                <Link href="/signup?tier=personal" className="btn btn-primary" style={{ width: '100%', textAlign: 'center' }}>Subscribe</Link>
                <p className="tier-subsidy">
                  Subsidised access available. <Link href="/subsidy">Apply</Link>
                </p>
              </div>
            </div>

            <div className="page-cta" style={{ marginTop: '40px' }}>
              <Link href="/courses/first-accord" className="btn btn-outline">Take the First Course</Link>
            </div>
          </div>
        </main>
        <SubpageFooter />
      </div>
    </>
  );
}
