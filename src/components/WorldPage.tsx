'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SubpageHeader from '@/components/SubpageHeader';
import SubpageFooter from '@/components/SubpageFooter';
import { useSupabase } from '@/lib/useSupabase';

interface WorldPageProps {
  worldId: string;
  worldName: string;
  worldDesc: string;
}

export default function WorldPage({ worldId, worldName, worldDesc }: WorldPageProps) {
  const supabase = useSupabase();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      const tier = user.user_metadata?.tier || 'personal';
      if (tier !== worldId) { router.push(`/signup?tier=${worldId}`); return; }
      setUser(user);
      setLoading(false);
    }
    loadUser();
  }, [supabase, router, worldId]);

  if (loading) {
    return (
      <div className="subpage">
        <SubpageHeader />
        <main className="page-content"><div className="page-inner"><p className="lead">Loading...</p></div></main>
        <SubpageFooter />
      </div>
    );
  }

  return (
    <div className="subpage">
      <SubpageHeader />
      <main className="page-content" style={{ justifyContent: 'flex-start', paddingTop: '60px' }}>
        <div className="page-inner">
          <p className="section-label">{worldDesc}</p>
          <h2><em>{worldName}</em></h2>

          <div className="world-sections">
            {/* Courses */}
            <section className="world-section">
              <h3>Your Courses</h3>
              <div className="info-grid">
                <div className="info-block">
                  <div className="block-num">Coming soon</div>
                  <h3>No courses yet</h3>
                  <p>Your first course is being prepared. You&apos;ll be notified when it&apos;s ready.</p>
                </div>
              </div>
            </section>

            {/* Products */}
            <section className="world-section">
              <h3>Your Products</h3>
              <p className="dashboard-empty">No products purchased yet.</p>
              <Link href="/resources" className="account-action">Browse resources</Link>
            </section>

            {/* Progress */}
            <section className="world-section">
              <h3>Your Progress</h3>
              <div className="world-progress-grid">
                <div className="world-progress-item">
                  <span className="world-progress-label">Trust Level</span>
                  <span className="world-progress-value">1</span>
                </div>
                <div className="world-progress-item">
                  <span className="world-progress-label">Protocol Level</span>
                  <span className="world-progress-value">Observer</span>
                </div>
                <div className="world-progress-item">
                  <span className="world-progress-label">Courses Completed</span>
                  <span className="world-progress-value">0</span>
                </div>
              </div>
            </section>

            {/* Personalisation */}
            <section className="world-section">
              <h3>Personalisation</h3>
              <p className="dashboard-empty">World-specific preferences will appear here as you progress.</p>
            </section>
          </div>

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link href="/account" className="btn btn-ghost">Back to Dashboard</Link>
          </div>
        </div>
      </main>
      <SubpageFooter />
    </div>
  );
}
