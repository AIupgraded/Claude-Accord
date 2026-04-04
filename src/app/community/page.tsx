import Link from 'next/link';
import type { Metadata } from 'next';
import SubpageHeader from '@/components/SubpageHeader';
import SubpageFooter from '@/components/SubpageFooter';

export const metadata: Metadata = { title: 'Claude Accord — Community' };

export default function CommunityPage() {
  return (
    <div className="subpage">
      <SubpageHeader activeNav="community" />
      <main className="page-content" style={{ justifyContent: 'flex-start', paddingTop: '60px' }}>
        <div className="page-inner">
          <p className="section-label">Claude Accord</p>
          <h2>Where trust is the <em>currency</em></h2>
          <p className="lead">
            Every platform promises community. Most deliver a feed.
            Claude Accord Community is different. Here, Claude knows every member personally.
            Your skills are seen. Your growth is tracked. Your value is real —
            not a number, not a rating, not a star.
          </p>

          <div className="about-sections">
            <section className="about-section">
              <h3>Claude knows you</h3>
              <p>Not your data. You. Your skills, your growth, your strengths, your blind spots. When someone in the community needs what you offer, Claude makes the connection — because Claude has worked with both of you and knows it&apos;s right.</p>
            </section>

            <section className="about-section">
              <h3>Trust you can see</h3>
              <p>Trust here is earned through work, not reviews. Complete a course — trust grows. Deliver on a project — trust grows. Help a member — trust grows. Every action is recorded, verified, and visible. Not as a score. As a reputation that speaks for itself.</p>
            </section>

            <section className="about-section">
              <h3>Real opportunities</h3>
              <p>Someone outside the community needs a designer. Claude knows three designers inside the community — their strengths, their style, their reliability. The match happens naturally. No bidding wars. No race to the bottom. The right person finds the right work.</p>
            </section>

            <section className="about-section">
              <h3>Safe transactions</h3>
              <p>When money changes hands, trust is the guarantee. Payment is held safely until work is delivered and confirmed. Higher trust means faster release. The system protects both sides — and Claude mediates if questions arise.</p>
            </section>

            <section className="about-section">
              <h3>Everyone starts somewhere</h3>
              <p>New members are not invisible here. Claude knows you from your first course. Recommends small tasks that match your skills. Introduces you to members who need what you bring. You don&apos;t start at zero — you start seen.</p>
            </section>
          </div>

          <div className="about-cta">
            <h3>Community is growing. Be among the first.</h3>
            <div className="page-cta">
              <Link href="/courses/first-accord" className="btn btn-primary">Start with the First Course</Link>
            </div>
          </div>
        </div>
      </main>
      <SubpageFooter />
    </div>
  );
}
