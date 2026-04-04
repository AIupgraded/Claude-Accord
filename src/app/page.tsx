'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSupabase } from '@/lib/useSupabase';

export default function HomePage() {
  const supabase = useSupabase();
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoaded(true);
    });
  }, [supabase]);

  const displayName = user?.user_metadata?.display_name || user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'friend';
  const welcomeMsg = user?.user_metadata?.welcome_message || `Glad to have you back, ${displayName}`;

  function handleTierClick(tier: string) {
    setSelectedTier(prev => prev === tier ? null : tier);
  }

  function handleStepIn() {
    const page = selectedTier || 'about';
    window.location.href = '/' + page;
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.reload();
  }

  return (
    <div className="landing" style={{ height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <header className="site-header">
        <div className="site-title-group">
          <h1 className="site-title">Claude <em>Accord</em></h1>
          <span className="site-slogan"><strong>Working</strong> together. <strong>Building</strong> trust.</span>
        </div>

        <div className="header-auth">
          {loaded && user ? (
            <div className="auth-logged-in" style={{ display: 'flex' }}>
              <div className="header-auth-buttons">
                <Link href="/account" className="btn-header">Dashboard</Link>
                <Link href="/settings" className="btn-header">Settings</Link>
                {['owner', 'board', 'admin'].includes(user?.user_metadata?.role) && (
                  <Link href="/admin" className="btn-header">Admin</Link>
                )}
                <button className="btn-header primary" onClick={handleSignOut}>Sign Out</button>
              </div>
              <span className="greeting">{welcomeMsg}</span>
            </div>
          ) : loaded ? (
            <div className="auth-logged-out" style={{ display: 'flex' }}>
              <Link href="/login" className="btn-header">Log In</Link>
              <Link href="/signup" className="btn-header primary">Sign Up</Link>
            </div>
          ) : null}
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
          <Link href="/contact">Contact</Link>
          <Link href="/gdpr">Privacy</Link>
        </footer>
      </section>
    </div>
  );
}
