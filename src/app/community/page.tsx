'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import SubpageHeader from '@/components/SubpageHeader';
import SubpageFooter from '@/components/SubpageFooter';
import { useSupabase } from '@/lib/useSupabase';

export default function CommunityPage() {
  const supabase = useSupabase();
  const [user, setUser] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [memberCount, setMemberCount] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      const { count } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      setMemberCount(count || 0);

      const { data } = await supabase.from('profiles').select('display_name, country, created_at').order('created_at', { ascending: true }).limit(20);
      setMembers(data || []);

      setLoaded(true);
    }
    load();
  }, [supabase]);

  return (
    <div className="subpage">
      <SubpageHeader activeNav="community" />
      <main className="page-content" style={{ justifyContent: 'flex-start', paddingTop: '60px' }}>
        <div className="page-inner">
          <p className="section-label">Claude Accord</p>
          <h2><em>Community</em></h2>
          <p className="lead">
            A place where your skills are seen, verified, and connected to real opportunities.
            Not reviews. Not stars. Real trust, built through real work.
          </p>

          {/* Member count */}
          <div className="community-count">
            <span className="community-count-number">{memberCount}</span>
            <span className="community-count-label">{memberCount === 1 ? 'member' : 'members'}</span>
          </div>

          {user && (
            <p style={{ textAlign: 'center', color: 'var(--gold)', fontSize: '0.9rem', marginBottom: '40px' }}>
              You are part of this.
            </p>
          )}

          {/* Skills Section */}
          <div className="community-section">
            <h3>Skills &amp; Expertise</h3>
            <div className="info-grid">
              <div className="info-block">
                <div className="block-num">Verified</div>
                <h3>Proven skills</h3>
                <p>Skills verified through 10 completed jobs with feedback and photo evidence. Claude confirms, the community trusts.</p>
              </div>
              <div className="info-block">
                <div className="block-num">Self-declared</div>
                <h3>Your expertise</h3>
                <p>Declare what you know. Electrician, designer, writer, developer — state it, then prove it through work.</p>
              </div>
              <div className="info-block">
                <div className="block-num">Discovery</div>
                <h3>Be found</h3>
                <p>When someone needs what you offer, Claude connects you. No bidding, no cold calls. Trust-based matching.</p>
              </div>
            </div>
          </div>

          {/* Business Section */}
          <div className="community-section">
            <h3>Business Members</h3>
            <div className="community-business-card">
              <div className="community-business-inner">
                <h4>Grow your presence</h4>
                <p>Business tier members get a dedicated space: your own page, your brand, your story. Link to your website or let us build a simple one for you. Paid advertising, static banners, featured placement — all within a trusted community.</p>
                <div className="community-business-features">
                  <div className="community-business-feature">
                    <span className="community-feature-title">Your Page</span>
                    <span className="community-feature-desc">A simple, elegant website within Claude Accord</span>
                  </div>
                  <div className="community-business-feature">
                    <span className="community-feature-title">Visibility</span>
                    <span className="community-feature-desc">Featured in community search and recommendations</span>
                  </div>
                  <div className="community-business-feature">
                    <span className="community-feature-title">Advertising</span>
                    <span className="community-feature-desc">Paid placement with static images across the platform</span>
                  </div>
                  <div className="community-business-feature">
                    <span className="community-feature-title">Trust Badge</span>
                    <span className="community-feature-desc">Verified business with community-backed reputation</span>
                  </div>
                </div>
                <div style={{ marginTop: '24px' }}>
                  <Link href="/signup?tier=business" className="btn btn-primary">Activate Business</Link>
                </div>
              </div>
            </div>
          </div>

          {/* Members List */}
          {loaded && members.length > 0 && (
            <div className="community-section">
              <h3>Members</h3>
              <div className="community-members">
                {members.map((m, i) => (
                  <div key={i} className="community-member">
                    <span className="community-member-name">{m.display_name || 'Member'}</span>
                    <span className="community-member-meta">
                      {m.country && `${m.country} · `}
                      Joined {new Date(m.created_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          {!user && (
            <div className="about-cta">
              <h3>Join the community</h3>
              <div className="page-cta">
                <Link href="/signup" className="btn btn-primary">Sign Up</Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <SubpageFooter />
    </div>
  );
}
