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
        <main className="page-content">
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
            <div className="products-section">
              <p className="section-label">Available Now</p>
              <div className="product-card">
                <div className="product-card-inner">
                  <div className="product-label">Personal &middot; Fundamentals</div>
                  <h3 className="product-title">Academic Email Pack</h3>
                  <p className="product-desc">3 structured prompts for academic communication. Email to professor, formal application, follow-up. Built for collaboration — not commands.</p>
                  <div className="product-footer">
                    <span className="product-price">&pound;0.10</span>
                    <a href="https://payhip.com/b/tA9wp" className="btn btn-primary" target="_blank" rel="noopener noreferrer">Get This Pack</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="page-cta">
              <Link href="/signup" className="btn btn-primary">Get Started</Link>
              <Link href="/about" className="btn btn-outline">Learn More</Link>
            </div>
          </div>
        </main>
        <SubpageFooter />
      </div>
    </>
  );
}
