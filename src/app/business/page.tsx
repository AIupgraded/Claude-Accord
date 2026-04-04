import Link from 'next/link';
import type { Metadata } from 'next';
import SubpageHeader from '@/components/SubpageHeader';
import SubpageFooter from '@/components/SubpageFooter';

export const metadata: Metadata = { title: 'Claude Accord — Business' };

export default function BusinessPage() {
  return (
    <>
      <div className="subpage">
        <SubpageHeader />
        <main className="page-content" style={{ justifyContent: 'flex-start', paddingTop: '60px' }}>
          <div className="page-inner">
            <p className="section-label">Claude Accord Business</p>
            <h2>For <em>organizations</em></h2>
            <p className="lead">
              Your team uses AI. Some well, most poorly, some not at all.
              The gap between them isn&apos;t tools — it&apos;s protocol.
              One framework, installed once, changes how everyone works.
            </p>

            <div className="info-grid">
              <div className="info-block">
                <div className="block-num">01</div>
                <h3>Consistent quality</h3>
                <p>When everyone operates from the same framework, the output stops depending on who asked the question.</p>
              </div>
              <div className="info-block">
                <div className="block-num">02</div>
                <h3>No resistance, no fear</h3>
                <p>The protocol removes friction for the skeptics and gives depth to the enthusiasts. Both win.</p>
              </div>
              <div className="info-block">
                <div className="block-num">03</div>
                <h3>Built for scale</h3>
                <p>From solo operator to full team. The architecture supports where you are and where you&apos;re going.</p>
              </div>
            </div>

            <div className="tier-comparison">
              <div className="tier-option tier-option--featured">
                <div className="tier-option-header">
                  <h3>Business</h3>
                  <span className="tier-option-price">&pound;15<span className="tier-option-period">/month</span></span>
                </div>
                <ul className="tier-option-features">
                  <li className="included">Everything in Personal Subscription</li>
                  <li className="included">Claude remembers you (MCP)</li>
                  <li className="included">Your own business page</li>
                  <li className="included">Public reviews from clients</li>
                  <li className="included">Community visibility &amp; advertising</li>
                  <li className="included">Featured placement</li>
                  <li className="included">Trust badge — verified business</li>
                  <li className="included">Team access (coming soon)</li>
                </ul>
                <Link href="/signup?tier=business" className="btn btn-primary" style={{ width: '100%', textAlign: 'center' }}>Activate Business</Link>
              </div>
            </div>

            {/* Reviews Feature */}
            <div className="mcp-details" style={{ marginTop: '48px' }}>
              <h3>Public Reviews</h3>
              <div className="info-grid">
                <div className="info-block">
                  <div className="block-num">Trust</div>
                  <h3>Real feedback</h3>
                  <p>Clients leave reviews directly on your business profile. Visible to everyone. No fake stars, no paid reviews — real trust from real work.</p>
                </div>
                <div className="info-block">
                  <div className="block-num">Verified</div>
                  <h3>Claude confirms</h3>
                  <p>Reviews from users who completed verified jobs carry a trust badge. Claude knows who did the work and who reviewed it.</p>
                </div>
                <div className="info-block">
                  <div className="block-num">Growth</div>
                  <h3>Reputation builds</h3>
                  <p>Every positive review increases your visibility in the community. Your reputation is your advertising.</p>
                </div>
              </div>
            </div>

            <div className="page-cta" style={{ marginTop: '40px' }}>
              <Link href="/courses/first-accord" className="btn btn-outline">Take the First Course</Link>
              <Link href="/contact" className="btn btn-ghost">Talk to Us</Link>
            </div>
          </div>
        </main>
        <SubpageFooter />
      </div>
    </>
  );
}
