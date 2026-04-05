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
  const activeWorlds: string[] = user?.user_metadata?.active_worlds || [user?.user_metadata?.tier || 'personal'];

  const isSubscribed = user?.user_metadata?.subscription_active;

  return (
    <div className="subpage">
      <SubpageHeader />
      <main className="page-content" style={{ justifyContent: 'flex-start', paddingTop: '60px' }}>
        <div className="page-inner">
          <p className="section-label">Your Account</p>
          <h2>This is your home, <em>{displayName}</em></h2>

          {!isSubscribed && (
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <Link href="/subscribe" className="btn btn-primary">Subscribe — unlock Claude&apos;s memory</Link>
            </div>
          )}

          <div className="dashboard-grid dashboard-grid--row">
            {/* Worlds */}
            {worlds.map(w => {
              const isActive = activeWorlds.includes(w.id);
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

            {/* MCP Connection */}
            <Link href={isSubscribed ? "/settings" : "/mcp"} className={`dashboard-world${isSubscribed ? ' active' : ''}`} style={isSubscribed ? {} : { borderColor: 'var(--border)' }}>
              <span className="dashboard-world-label">MCP</span>
              <span className="dashboard-world-desc">{isSubscribed ? 'Connected' : 'Connect to Claude'}</span>
            </Link>
          </div>
        </div>
      </main>
      <SubpageFooter />
    </div>
  );
}
