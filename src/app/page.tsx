'use client';

import Link from 'next/link';
import { useState } from 'react';
import SupabaseProvider from '@/components/SupabaseProvider';
import Script from 'next/script';

export default function HomePage() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  function handleTierClick(tier: string) {
    setSelectedTier(prev => prev === tier ? null : tier);
  }

  function handleStepIn() {
    const page = selectedTier || 'info';
    window.location.href = '/' + page;
  }

  return (
    <>
      <SupabaseProvider />
      <div className="landing" style={{ height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <header className="site-header">
          <div className="site-title-group">
            <h1 className="site-title">Claude <em>Accord</em></h1>
            <span className="site-slogan"><strong>Working</strong> together. <strong>Building</strong> trust.</span>
          </div>

          <div className="header-auth">
            <div className="auth-logged-out">
              <Link href="/login" className="btn-header">Log In</Link>
              <Link href="/signup" className="btn-header primary">Sign Up</Link>
            </div>
            <div className="auth-logged-in">
              <span className="greeting" id="headerGreeting"></span>
              <button className="btn-header ghost-small" id="logoutBtn">Sign out</button>
            </div>
          </div>
        </header>

        <section className="hero">
          <div className="hero-content">
            <p className="tagline"><strong>Stop</strong> scrolling. <strong>Start</strong> thinking.</p>

            <div className="tier-buttons">
              {['personal', 'business', 'creative'].map(tier => (
                <button
                  key={tier}
                  className={`tier-btn${selectedTier === tier ? ' selected' : ''}`}
                  onClick={() => handleTierClick(tier)}
                >
                  {tier.charAt(0).toUpperCase() + tier.slice(1)}
                </button>
              ))}
            </div>

            <div className="cta-wrapper">
              <button className="cta-btn" onClick={handleStepIn}>
                Step In<span className="cta-sub">click here</span>
              </button>
            </div>
          </div>

          <footer className="hero-footer">
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/gdpr">Privacy</Link>
          </footer>
        </section>
      </div>
    </>
  );
}
