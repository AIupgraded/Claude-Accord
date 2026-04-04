'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import SubpageHeader from '@/components/SubpageHeader';
import SubpageFooter from '@/components/SubpageFooter';
import { useSupabase } from '@/lib/useSupabase';

export default function SettingsPage() {
  const supabase = useSupabase();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [saving, setSaving] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const displayNameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const welcomeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      setUser(user);
      setLoading(false);
    }
    loadUser();
  }, [supabase, router]);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setSaving(true);
    const { error } = await supabase.auth.updateUser({
      data: {
        first_name: firstNameRef.current?.value.trim(),
        last_name: lastNameRef.current?.value.trim(),
        display_name: displayNameRef.current?.value.trim(),
        phone: phoneRef.current?.value.trim(),
        welcome_message: welcomeRef.current?.value.trim(),
      }
    });
    setSaving(false);
    if (error) { setMessage({ text: error.message, type: 'error' }); return; }
    const { data: { user: updated } } = await supabase.auth.getUser();
    setUser(updated);
    setMessage({ text: 'Profile updated.', type: 'success' });
  }

  if (loading) {
    return (
      <div className="subpage">
        <SubpageHeader />
        <main className="page-content"><div className="page-inner"><p className="lead">Loading...</p></div></main>
        <SubpageFooter />
      </div>
    );
  }

  const meta = user?.user_metadata || {};
  const firstName = meta.first_name || '';
  const lastName = meta.last_name || '';
  const displayName = meta.display_name || '';
  const email = user?.email || '';
  const phone = meta.phone || '';
  const tier = meta.tier || 'personal';
  const welcomeMessage = meta.welcome_message || '';
  const createdAt = user?.created_at ? new Date(user.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
  const resolvedName = displayName || firstName || email.split('@')[0];

  return (
    <div className="subpage">
      <SubpageHeader />
      <main className="page-content" style={{ justifyContent: 'flex-start', paddingTop: '60px' }}>
        <div className="page-inner">
          <p className="section-label">Settings</p>
          <h2><em>Settings</em></h2>

          <div className="settings-sections">
            {message && (
              <div className={`alert alert-${message.type} visible`}>{message.text}</div>
            )}

            {/* Profile */}
            <section className="settings-section">
              <h3>Profile</h3>
              <form onSubmit={handleSaveProfile}>
                <div className="form-group">
                  <label htmlFor="s-firstname">First name</label>
                  <input type="text" id="s-firstname" ref={firstNameRef} defaultValue={firstName} placeholder="First name" />
                </div>
                <div className="form-group">
                  <label htmlFor="s-lastname">Last name</label>
                  <input type="text" id="s-lastname" ref={lastNameRef} defaultValue={lastName} placeholder="Last name" />
                </div>
                <div className="form-group">
                  <label htmlFor="s-displayname">Display name</label>
                  <input type="text" id="s-displayname" ref={displayNameRef} defaultValue={displayName} placeholder={firstName || 'How others see you'} />
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>This is the name shown across the site.</p>
                </div>
                <div className="form-group">
                  <label htmlFor="s-email">Email</label>
                  <input type="email" id="s-email" value={email} disabled style={{ opacity: 0.6 }} />
                </div>
                <div className="form-group">
                  <label htmlFor="s-phone">Phone</label>
                  <input type="tel" id="s-phone" ref={phoneRef} defaultValue={phone} placeholder="+40 ..." />
                </div>
                <div className="form-group">
                  <label>Member since</label>
                  <input type="text" value={createdAt} disabled style={{ opacity: 0.6 }} />
                </div>
                <div className="form-group">
                  <label htmlFor="s-welcome">Welcome message</label>
                  <input type="text" id="s-welcome" ref={welcomeRef} defaultValue={welcomeMessage} placeholder={`Glad to have you back, ${resolvedName}`} />
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>Shown in the header when you&apos;re logged in.</p>
                </div>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </section>

            {/* Your World */}
            <section className="settings-section">
              <h3>Your World</h3>
              <div className="settings-world-row">
                <span className="settings-world-active">{tier.charAt(0).toUpperCase() + tier.slice(1)}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem', fontStyle: 'italic' }}>
                  {tier === 'personal' && 'Everyday life'}
                  {tier === 'business' && 'Work and growth'}
                  {tier === 'creative' && 'Building and dreaming'}
                </span>
              </div>
            </section>

            {/* Security */}
            <section className="settings-section">
              <h3>Security</h3>
              <div className="account-row">
                <span className="account-label">Password</span>
                <Link href="/forgot-password" className="account-action">Change password</Link>
              </div>
            </section>

            {/* MCP */}
            <section className="settings-section">
              <h3>MCP Connection</h3>
              <div className="account-row">
                <span className="account-label">Status</span>
                <span className="account-value" style={{ color: 'var(--text-muted)' }}>Not connected</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '12px' }}>
                Complete your first course to receive your API key. <Link href="/mcp" className="account-action">Learn more</Link>
              </p>
            </section>

            {/* Danger Zone */}
            <section className="settings-section settings-danger">
              <h3>Danger Zone</h3>
              {!showDelete ? (
                <button className="btn btn-ghost" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }} onClick={() => setShowDelete(true)}>
                  Delete Account
                </button>
              ) : (
                <div>
                  <p style={{ color: 'var(--danger)', fontSize: '0.9rem', marginBottom: '16px' }}>
                    This action is permanent. All your data will be deleted. To proceed, contact us.
                  </p>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <Link href="/contact" className="btn btn-ghost" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}>Contact Support</Link>
                    <button className="btn btn-ghost" onClick={() => setShowDelete(false)}>Cancel</button>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
      <SubpageFooter />
    </div>
  );
}
