'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSupabase } from '@/lib/useSupabase';

interface SubpageHeaderProps {
  activeNav?: string;
}

export default function SubpageHeader({ activeNav }: SubpageHeaderProps) {
  const supabase = useSupabase();
  const [menuOpen, setMenuOpen] = useState(false);
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

  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.href = '/';
  }

  return (
    <header className="site-header">
      <div className="site-title-group">
        <h1 className="site-title">
          <Link href="/">Claude <em>Accord</em></Link>
        </h1>
        <span className="site-slogan"><strong>Working</strong> together. <strong>Building</strong> trust.</span>
      </div>

      <nav className={`nav-menu${menuOpen ? ' open' : ''}`}>
        <Link href="/" className={activeNav === 'home' ? 'active' : ''}>Home</Link>
        <Link href="/about" className={activeNav === 'about' ? 'active' : ''}>About</Link>
        <Link href="/mcp" className={activeNav === 'mcp' ? 'active' : ''}>MCP</Link>
        <Link href="/blog" className={activeNav === 'blog' ? 'active' : ''}>Blog</Link>
        <Link href="/resources" className={activeNav === 'resources' ? 'active' : ''}>Resources</Link>
        <Link href="/contact" className={activeNav === 'contact' ? 'active' : ''}>Contact</Link>
      </nav>

      <div className="header-auth">
        {loaded && user ? (
          <div className="auth-logged-in" style={{ display: 'flex' }}>
            <div className="header-auth-buttons">
              <Link href="/settings" className="btn-header">Settings</Link>
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
      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>&#9776;</button>
    </header>
  );
}
