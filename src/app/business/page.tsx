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
        <main className="page-content">
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
            <div className="page-cta">
              <Link href="/contact" className="btn btn-primary">Talk to Us</Link>
              <Link href="/about" className="btn btn-outline">Learn More</Link>
            </div>
          </div>
        </main>
        <SubpageFooter />
      </div>
    </>
  );
}
