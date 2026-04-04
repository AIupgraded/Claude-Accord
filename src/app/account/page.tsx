'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SubpageHeader from '@/components/SubpageHeader';
import SubpageFooter from '@/components/SubpageFooter';
import { useSupabase } from '@/lib/useSupabase';

const worlds = [
  { id: 'personal', label: 'Personal', desc: 'Everyday life' },
  { id: 'business', label: 'Business', desc: 'Work and growth' },
  { id: 'creative', label: 'Creative', desc: 'Building and dreaming' },
];

export default function AccountPage() {
  const supabase = useSupabase();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      setUser(user);
      setLoading(false);
    }
    loadUser();
  }, [supabase, router]);

  if (loading) {
    return (
      <div className="subpage">
        <SubpageHeader />
        <main className="page-content"><div className="page-inner"><p className="lead">Loading...</p></div></main>
        <SubpageFooter />
      </div>
    );
  }

  const displayName = user?.user_metadata?.display_name || user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'friend';
  const activeTier = user?.user_metadata?.tier || 'personal';

  return (
    <div className="subpage">
      <SubpageHeader />
      <main className="page-content" style={{ justifyContent: 'flex-start', paddingTop: '60px' }}>
        <div className="page-inner">
          <p className="section-label">Your Account</p>
          <h2>Hello, <em>{displayName}</em></h2>

          <div className="dashboard-grid">
            {/* Card 1: Your World */}
            <div className="dashboard-card dashboard-card--wide">
              <h3>Your World</h3>
              <div className="dashboard-worlds">
                {worlds.map(w => {
                  const isActive = w.id === activeTier;
                  return isActive ? (
                    <Link key={w.id} href={`/world/${w.id}`} className="dashboard-world active">
                      <span className="dashboard-world-label">{w.label}</span>
                      <span className="dashboard-world-desc">{w.desc}</span>
                    </Link>
                  ) : (
                    <Link key={w.id} href={`/signup?tier=${w.id}`} className="dashboard-world inactive">
                      <span className="dashboard-world-label">{w.label}</span>
                      <span className="dashboard-world-desc">{w.desc}</span>
                      <span className="dashboard-world-activate">Activate</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Card 2: Your Courses */}
            <div className="dashboard-card">
              <h3>Your Courses</h3>
              <p className="dashboard-empty">No courses completed yet.</p>
              <Link href="/about" className="account-action">Start your first course</Link>
            </div>

            {/* Card 3: MCP Connection */}
            <Link href="/mcp" className="dashboard-card dashboard-card--link">
              <h3>MCP Connection</h3>
              <p className="dashboard-mcp-text">
                Claude remembers you. Your growth, your skills, your story.
                Connect and step into a relationship that never resets.
              </p>
              <span className="account-action">Connect</span>
            </Link>
          </div>
        </div>
      </main>
      <SubpageFooter />
    </div>
  );
}
