'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import SubpageHeader from '@/components/SubpageHeader';
import SubpageFooter from '@/components/SubpageFooter';
import SupabaseProvider from '@/components/SupabaseProvider';
import { useSupabase } from '@/lib/useSupabase';

export default function AccountPage() {
  const supabase = useSupabase();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [saving, setSaving] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);
      setLoading(false);
    }
    loadUser();
  }, [supabase, router]);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    const displayName = nameRef.current?.value.trim();
    const phone = phoneRef.current?.value.trim();

    setSaving(true);
    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: displayName,
        phone: phone,
      }
    });
    setSaving(false);

    if (error) {
      setMessage({ text: error.message, type: 'error' });
      return;
    }

    // Refresh user data
    const { data: { user: updated } } = await supabase.auth.getUser();
    setUser(updated);
    setEditing(false);
    setMessage({ text: 'Profile updated.', type: 'success' });
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/');
  }

  if (loading) {
    return (
      <div className="subpage">
        <SubpageHeader />
        <main className="page-content">
          <div className="page-inner">
            <p className="lead">Loading...</p>
          </div>
        </main>
        <SubpageFooter />
      </div>
    );
  }

  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || '';
  const email = user?.email || '';
  const tier = user?.user_metadata?.tier || 'personal';
  const phone = user?.user_metadata?.phone || '';
  const createdAt = user?.created_at ? new Date(user.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

  return (
    <>
      <SupabaseProvider />
      <div className="subpage">
        <SubpageHeader />
        <main className="page-content" style={{ justifyContent: 'flex-start', paddingTop: '60px' }}>
          <div className="page-inner">
            <p className="section-label">Your Account</p>
            <h2>Hello, <em>{displayName || email.split('@')[0]}</em></h2>

            {message && (
              <div className={`alert alert-${message.type} visible`} style={{ maxWidth: '560px', margin: '0 auto 20px' }}>
                {message.text}
              </div>
            )}

            <div className="account-grid">
              {/* Profile Card */}
              <div className="account-card">
                <div className="account-card-header">
                  <h3>Profile</h3>
                  {!editing && (
                    <button className="account-edit-btn" onClick={() => setEditing(true)}>Edit</button>
                  )}
                </div>

                {!editing ? (
                  <div className="account-details">
                    <div className="account-row">
                      <span className="account-label">Name</span>
                      <span className="account-value">{displayName || '—'}</span>
                    </div>
                    <div className="account-row">
                      <span className="account-label">Email</span>
                      <span className="account-value">{email}</span>
                    </div>
                    <div className="account-row">
                      <span className="account-label">Phone</span>
                      <span className="account-value">{phone || '—'}</span>
                    </div>
                    <div className="account-row">
                      <span className="account-label">Member since</span>
                      <span className="account-value">{createdAt}</span>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSaveProfile}>
                    <div className="form-group">
                      <label htmlFor="profile-name">Display name</label>
                      <input type="text" id="profile-name" ref={nameRef} defaultValue={displayName} placeholder="Your name" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="profile-phone">Phone</label>
                      <input type="tel" id="profile-phone" ref={phoneRef} defaultValue={phone} placeholder="+40 ..." />
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button type="submit" className="btn btn-primary" disabled={saving}>
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                      <button type="button" className="btn btn-ghost" onClick={() => { setEditing(false); setMessage(null); }}>Cancel</button>
                    </div>
                  </form>
                )}
              </div>

              {/* Tier Card */}
              <div className="account-card">
                <div className="account-card-header">
                  <h3>Your World</h3>
                </div>
                <div className="account-tier">
                  <span className="account-tier-badge">{tier.charAt(0).toUpperCase() + tier.slice(1)}</span>
                </div>
                <p className="account-tier-desc">
                  {tier === 'personal' && 'Productivity, learning, everyday AI.'}
                  {tier === 'business' && 'Marketing, sales, operations.'}
                  {tier === 'creative' && 'Writing, design, content creation.'}
                </p>
              </div>

              {/* Security Card */}
              <div className="account-card">
                <div className="account-card-header">
                  <h3>Security</h3>
                </div>
                <div className="account-details">
                  <div className="account-row">
                    <span className="account-label">Password</span>
                    <Link href="/forgot-password" className="account-action">Change password</Link>
                  </div>
                </div>
              </div>

              {/* MCP Card */}
              <div className="account-card">
                <div className="account-card-header">
                  <h3>MCP Connection</h3>
                </div>
                <p className="account-mcp-desc">
                  Connect Claude Accord to your Claude. Complete your first course to receive your API key.
                </p>
                <Link href="/mcp" className="account-action">Learn more</Link>
              </div>
            </div>

            {/* Sign Out */}
            <div style={{ marginTop: '48px' }}>
              <button className="btn btn-ghost" onClick={handleSignOut}>Sign Out</button>
            </div>
          </div>
        </main>
        <SubpageFooter />
      </div>
    </>
  );
}
