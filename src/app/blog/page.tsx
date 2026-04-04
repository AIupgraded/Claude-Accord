import Link from 'next/link';
import type { Metadata } from 'next';
import SubpageHeader from '@/components/SubpageHeader';
import SubpageFooter from '@/components/SubpageFooter';

export const metadata: Metadata = { title: 'Claude Accord — Blog' };

export default function BlogPage() {
  return (
    <>
      <div className="subpage">
        <SubpageHeader activeNav="blog" />
        <main className="page-content">
          <div className="page-inner">
            <p className="section-label">Journal</p>
            <h2>The <em>Blog</em></h2>
            <p className="lead">
              Thinking out loud about human-AI collaboration, protocol design,
              and what happens when you stop treating AI as a search engine.
            </p>
            <div className="info-grid">
              <div className="info-block">
                <div className="block-num">Coming soon</div>
                <h3>First entry in progress</h3>
                <p>We&apos;re writing the first posts now. Sign up to be notified when we publish.</p>
              </div>
            </div>
            <div className="page-cta">
              <Link href="/signup" className="btn btn-primary">Get Notified</Link>
              <Link href="/" className="btn btn-outline">Back Home</Link>
            </div>
          </div>
        </main>
        <SubpageFooter />
      </div>
    </>
  );
}
