import Link from 'next/link';
import type { Metadata } from 'next';
import SubpageHeader from '@/components/SubpageHeader';
import SubpageFooter from '@/components/SubpageFooter';

export const metadata: Metadata = { title: 'Resources', description: 'Guides, references, and materials for working with the Claude Accord protocol.', openGraph: { title: 'Claude Accord Resources' } };

export default function ResourcesPage() {
  return (
    <>
      <div className="subpage">
        <SubpageHeader activeNav="resources" />
        <main className="page-content">
          <div className="page-inner">
            <p className="section-label">Library</p>
            <h2><em>Resources</em></h2>
            <p className="lead">
              Guides, references, and materials for working with the Claude Accord protocol.
              Built for practitioners, not spectators.
            </p>
            <div className="info-grid">
              <div className="info-block">
                <div className="block-num">Coming soon</div>
                <h3>Resource library in development</h3>
                <p>We&apos;re building the resource collection now. The protocol comes first — the library follows.</p>
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
