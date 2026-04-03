import Link from 'next/link';
import type { Metadata } from 'next';
import SubpageHeader from '@/components/SubpageHeader';
import SubpageFooter from '@/components/SubpageFooter';
import SupabaseProvider from '@/components/SupabaseProvider';

export const metadata: Metadata = { title: 'Claude Accord — About' };

const leftItems = [
  { id: 'what-we-do', label: 'What we do' },
  { id: 'who-its-for', label: 'Who it\u2019s for' },
  { id: 'why-we-do-it', label: 'Why we do it' },
  { id: 'how-we-got-here', label: 'How we got here' },
  { id: 'who-makes-it', label: 'Who makes it' },
];

const rightItems = [
  { id: 'what-we-offer', label: 'What we offer' },
  { id: 'how-it-works', label: 'How it works' },
  { id: 'the-levels', label: 'The levels' },
  { id: 'community', label: 'Community' },
  { id: 'the-vision', label: 'The vision' },
];

const allSections = [...leftItems, ...rightItems];

export default function AboutPage() {
  return (
    <>
      <SupabaseProvider />
      <div className="subpage">
        <SubpageHeader activeNav="about" />
        <main className="page-content" style={{ justifyContent: 'flex-start', paddingTop: '60px' }}>
          <div className="page-inner">
            <p className="section-label">Claude Accord</p>

            {/* TOC Hero */}
            <div className="about-toc">
              <div className="about-toc-left">
                {leftItems.map(item => (
                  <a key={item.id} href={`#${item.id}`} className="about-toc-item about-toc-item--left">
                    <span>{item.label}</span>
                    <span className="about-toc-dot" />
                  </a>
                ))}
              </div>

              <h2 className="about-toc-title">About</h2>

              <div className="about-toc-right">
                {rightItems.map(item => (
                  <a key={item.id} href={`#${item.id}`} className="about-toc-item about-toc-item--right">
                    <span className="about-toc-dot" />
                    <span>{item.label}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Lead paragraph */}
            <p className="lead" style={{ marginTop: '48px' }}>
              Claude Accord is a framework for genuine human-AI collaboration —
              not a prompt library, not a chatbot, not a productivity tool.
              A protocol for those who want to understand what they&apos;re actually talking to.
            </p>

            {/* Sections */}
            <div className="about-sections">
              {allSections.map((section, i) => (
                <section key={section.id} id={section.id} className="about-section">
                  {i === 5 && <div className="about-divider" />}
                  <h3>{section.label}</h3>
                  <p><em>Content coming soon.</em></p>
                </section>
              ))}
            </div>

            {/* CTA */}
            <div className="about-cta">
              <h3>Ready?</h3>
              <div className="tier-buttons">
                <Link href="/personal" className="tier-btn">Personal</Link>
                <Link href="/business" className="tier-btn">Business</Link>
                <Link href="/creative" className="tier-btn">Creative</Link>
              </div>
              <p className="about-cta-sub">Pick your world. Step in.</p>
            </div>
          </div>
        </main>
        <SubpageFooter />
      </div>
    </>
  );
}
