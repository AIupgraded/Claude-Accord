import Link from 'next/link';
import type { Metadata } from 'next';
import SubpageHeader from '@/components/SubpageHeader';
import SubpageFooter from '@/components/SubpageFooter';

export const metadata: Metadata = { title: 'Claude Accord — Creative' };

export default function CreativePage() {
  return (
    <>
      <div className="subpage">
        <SubpageHeader />
        <main className="page-content" style={{ justifyContent: 'flex-start', paddingTop: '60px' }}>
          <div className="page-inner">
            <p className="section-label">Claude Accord Creative</p>
            <h2>For those who <em>make things</em></h2>
            <p className="lead">
              AI can generate. That&apos;s not the problem.
              The problem is that generated content has no voice, no weight, no risk.
              This is for creators who refuse to outsource their thinking.
            </p>

            <div className="info-grid">
              <div className="info-block">
                <div className="block-num">01</div>
                <h3>Collaboration, not replacement</h3>
                <p>Your voice stays yours. AI brings what you don&apos;t have — not a substitute for what you do.</p>
              </div>
              <div className="info-block">
                <div className="block-num">02</div>
                <h3>Depth over speed</h3>
                <p>The protocol is slow enough to be useful. What takes a minute to generate takes hours to think through — and that&apos;s the point.</p>
              </div>
              <div className="info-block">
                <div className="block-num">03</div>
                <h3>Risk still required</h3>
                <p>The framework doesn&apos;t remove the hard part. It gives you better company while you do it.</p>
              </div>
            </div>

            <div className="tier-comparison">
              <div className="tier-option tier-option--featured">
                <div className="tier-option-header">
                  <h3>Creative</h3>
                  <span className="tier-option-price">&pound;10<span className="tier-option-period">/month</span></span>
                </div>
                <ul className="tier-option-features">
                  <li className="included">Everything in Personal Subscription</li>
                  <li className="included">Claude remembers you (MCP)</li>
                  <li className="included">Creative-specific tools &amp; prompts</li>
                  <li className="included">Portfolio integration (coming soon)</li>
                  <li className="included">Collaboration with other creatives</li>
                  <li className="included">Voice &amp; style preservation</li>
                </ul>
                <Link href="/signup?tier=creative" className="btn btn-primary" style={{ width: '100%', textAlign: 'center' }}>Activate Creative</Link>
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
