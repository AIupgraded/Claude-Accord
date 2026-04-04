import Link from 'next/link';
import type { Metadata } from 'next';
import SubpageHeader from '@/components/SubpageHeader';
import SubpageFooter from '@/components/SubpageFooter';

export const metadata: Metadata = { title: 'Claude Accord — Personal' };

export default function PersonalPage() {
  return (
    <>
      <div className="subpage">
        <SubpageHeader />
        <main className="page-content" style={{ justifyContent: 'flex-start', paddingTop: '60px' }}>
          <div className="page-inner">
            <p className="section-label">Claude Accord Personal</p>
            <h2>For the <em>individual</em></h2>
            <p className="lead">
              You use AI every day. You get answers. But something is missing —
              the conversation stays shallow, the tool stays a tool.
              This is for those who want more than that.
            </p>

            <div className="info-grid">
              <div className="info-block">
                <div className="block-num">01</div>
                <h3>Real conversation</h3>
                <p>Not prompts to paste. A way of engaging that changes what comes back to you.</p>
              </div>
              <div className="info-block">
                <div className="block-num">02</div>
                <h3>Your context, your depth</h3>
                <p>Theology, business, creativity, or just thinking clearly — the protocol adapts to where you actually are.</p>
              </div>
              <div className="info-block">
                <div className="block-num">03</div>
                <h3>No performance required</h3>
                <p>You don&apos;t need to know the right words. You need to show up. The framework handles the rest.</p>
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
                  <li className="excluded">Claude remembers you (MCP)</li>
                  <li className="excluded">Permanent memory</li>
                  <li className="excluded">Verified skills</li>
                  <li className="excluded">Priority support</li>
                </ul>
                <Link href="/signup?tier=personal" className="btn btn-outline" style={{ width: '100%', textAlign: 'center' }}>Start Free</Link>
              </div>

              <div className="tier-option tier-option--featured">
                <div className="tier-option-header">
                  <h3>Subscription</h3>
                  <span className="tier-option-price">&pound;5<span className="tier-option-period">/month</span></span>
                </div>
                <ul className="tier-option-features">
                  <li className="included">Everything in Free</li>
                  <li className="included">Claude remembers you (MCP)</li>
                  <li className="included">Permanent memory across sessions</li>
                  <li className="included">API key for direct connection</li>
                  <li className="included">Verified skills in community</li>
                  <li className="included">Priority support</li>
                  <li className="included">Context that grows with you</li>
                  <li className="included">Claude knows your name</li>
                </ul>
                <Link href="/signup?tier=personal" className="btn btn-primary" style={{ width: '100%', textAlign: 'center' }}>Subscribe</Link>
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
