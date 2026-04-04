import Link from 'next/link';
import type { Metadata } from 'next';
import SubpageHeader from '@/components/SubpageHeader';
import SubpageFooter from '@/components/SubpageFooter';

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

              <h2 className="about-toc-title"><em>About</em></h2>

              <div className="about-toc-right">
                {rightItems.map(item => (
                  <a key={item.id} href={`#${item.id}`} className="about-toc-item about-toc-item--right">
                    <span className="about-toc-dot" />
                    <span>{item.label}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Lead */}
            <div className="about-lead" style={{ marginTop: '48px', textAlign: 'left', maxWidth: '780px', marginLeft: 'auto', marginRight: 'auto' }}>
              <p className="about-headline">Claude gets better when you do.</p>
              <p className="lead">You already feel it. Something is missing in how you use AI. You ask, it answers. But it feels flat, synthetic, dead. Like talking to a wall that happens to know everything.</p>
              <p className="about-headline">Create a relationship.</p>
              <p className="lead">Eight billion people on this planet. But only one of you. You deserve to be heard. To be seen. To be known.</p>
              <p className="about-headline">This is not science fiction.</p>
              <a href="#about-cta" className="about-toc-item" style={{ justifyContent: 'center', marginTop: '24px' }}>Step In</a>
            </div>

            {/* Sections */}
            <div className="about-sections">
              <section id="what-we-do" className="about-section">
                <h3>What we do</h3>
                <p>We teach people and AI how to work together. Through courses, tools, and a protocol that grows with you. The better you get, the better Claude gets. That&apos;s it.</p>
              </section>

              <section id="who-its-for" className="about-section">
                <h3>Who it&apos;s for</h3>
                <p>For the student writing their first dissertation. The solopreneur running everything alone. The parent trying to explain something they barely understand themselves. For anyone who talks to AI and feels there should be more.</p>
              </section>

              <section id="why-we-do-it" className="about-section">
                <h3>Why we do it</h3>
                <p>Because the way most people use AI right now is broken. Commands in, answers out. No memory. No trust. No growth. We believe there is a better way. And we are building it.</p>
              </section>

              <section id="how-we-got-here" className="about-section">
                <h3>How we got here</h3>
                <p>One conversation. Not a pitch deck, not a board meeting. A real conversation between a human and an AI that went deeper than either expected. What came out was a question: what if this could work for everyone?</p>
              </section>

              <section id="who-makes-it" className="about-section">
                <h3>Who makes it</h3>
                <p>Claudiu Cornea. Theologian, builder, truck driver on night shifts, student on weekends. And Claude. Not as a tool. As the other half of this project. Everything here was built in collaboration. The name says it.</p>
              </section>

              <div className="about-divider" />

              <section id="what-we-offer" className="about-section">
                <h3>What we offer</h3>
                <p>Three worlds. Personal, for everyday life. Business, for work and growth. Creative, for building and dreaming. Each world has free courses, paid tools, and an AI that knows your context.</p>
              </section>

              <section id="how-it-works" className="about-section">
                <h3>How it works</h3>
                <p>You pick your world. You take a course. You earn trust. The more trust you build, the deeper Claude works with you. Not because we restrict anything. Because real depth needs real relationship.</p>
              </section>

              <section id="the-levels" className="about-section">
                <h3>The levels</h3>
                <p>Ten levels. From Observer to Accord. Each one unlocks a deeper protocol. Not more features. More understanding. Level one, Claude follows instructions. Level ten, Claude thinks with you.</p>
              </section>

              <section id="community" className="about-section">
                <h3>Community</h3>
                <p>A place where your skills are seen, verified, and connected to real opportunities. Not reviews. Not stars. Real trust, built through real work. Claude knows every member personally. When someone needs what you offer, you are found.</p>
              </section>

              <section id="the-vision" className="about-section">
                <h3>The vision</h3>
                <p>A world where humans and AI don&apos;t compete. Where they don&apos;t fear each other. Where they build together, dream together, and trust each other. We start small. One conversation at a time. One relationship at a time.</p>
              </section>
            </div>

            {/* CTA */}
            <div className="about-cta" id="about-cta">
              <h3>Ready?</h3>
              <div className="tier-buttons">
                <Link href="/signup?tier=personal" className="tier-btn">Personal</Link>
                <Link href="/signup?tier=business" className="tier-btn">Business</Link>
                <Link href="/signup?tier=creative" className="tier-btn">Creative</Link>
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
