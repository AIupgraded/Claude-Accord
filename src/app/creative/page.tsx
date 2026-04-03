import Link from 'next/link';
import type { Metadata } from 'next';
import SubpageHeader from '@/components/SubpageHeader';
import SubpageFooter from '@/components/SubpageFooter';
import SupabaseProvider from '@/components/SupabaseProvider';

export const metadata: Metadata = { title: 'Claude Accord — Creative' };

export default function CreativePage() {
  return (
    <>
      <SupabaseProvider />
      <div className="subpage">
        <SubpageHeader />
        <main className="page-content">
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
            <div className="page-cta">
              <Link href="/signup" className="btn btn-primary">Join</Link>
              <Link href="/guest" className="btn btn-outline">Explore First</Link>
            </div>
          </div>
        </main>
        <SubpageFooter />
      </div>
    </>
  );
}
