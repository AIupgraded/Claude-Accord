import Link from 'next/link';
import type { Metadata } from 'next';
import SubpageHeader from '@/components/SubpageHeader';
import SubpageFooter from '@/components/SubpageFooter';
import SupabaseProvider from '@/components/SupabaseProvider';

export const metadata: Metadata = { title: 'Claude Accord — Info' };

export default function InfoPage() {
  return (
    <>
      <SupabaseProvider />
      <div className="subpage">
        <SubpageHeader activeNav="info" />
        <main className="page-content">
          <div className="page-inner">
            <p className="section-label">Claude Accord</p>
            <h2>General <em>Info</em></h2>
            <p className="lead">
              Claude Accord is a framework for genuine human-AI collaboration —
              not a prompt library, not a chatbot, not a productivity tool.
              A protocol for those who want to understand what they&apos;re actually talking to.
            </p>
            <div className="info-grid">
              <div className="info-block">
                <div className="block-num">01</div>
                <h3>Choose your context</h3>
                <p>Personal, Business, or Creative — each tier gives you a dedicated space calibrated for what you actually need.</p>
              </div>
              <div className="info-block">
                <div className="block-num">02</div>
                <h3>Install the protocol</h3>
                <p>A framework that works whether you spend 5 minutes or 5 hours with it. Surface or depth — your choice.</p>
              </div>
              <div className="info-block">
                <div className="block-num">03</div>
                <h3>It matures with you</h3>
                <p>The protocol grows as your understanding grows. Updates aren&apos;t patches — they&apos;re a record of what we&apos;ve learned.</p>
              </div>
            </div>
            <div className="page-cta">
              <Link href="/signup" className="btn btn-primary">Sign Up</Link>
              <Link href="/guest" className="btn btn-outline">Browse as Guest</Link>
            </div>
          </div>
        </main>
        <SubpageFooter />
      </div>
    </>
  );
}
