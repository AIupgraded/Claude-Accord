'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import SubpageHeader from '@/components/SubpageHeader';
import SubpageFooter from '@/components/SubpageFooter';
import SupabaseProvider from '@/components/SupabaseProvider';
import { useSupabase } from '@/lib/useSupabase';

function checkStrength(pw: string) {
  const checks = {
    length: pw.length >= 8,
    upper: /[A-Z]/.test(pw),
    lower: /[a-z]/.test(pw),
    number: /[0-9]/.test(pw),
    special: /[^A-Za-z0-9]/.test(pw),
  };
  const score = Object.values(checks).filter(Boolean).length;
  return { score, checks };
}

const strengthLabels = ['', 'Weak', 'Weak', 'Fair', 'Good', 'Strong'];
const strengthColors = ['', '#c0392b', '#c0392b', '#e67e22', '#f1c40f', '#27ae60'];

export default function ResetPasswordPage() {
  const { sb, ready } = useSupabase();
  const [state, setState] = useState<'loading' | 'form' | 'success' | 'error'>('loading');
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const confirmRef = useRef<HTMLInputElement>(null);

  const strength = checkStrength(password);

  useEffect(() => {
    if (!ready) return;
    async function checkSession() {
      await new Promise(r => setTimeout(r, 500));
      const { data } = await sb.current.auth.getSession();
      setState(data.session ? 'form' : 'error');
    }
    checkSession();
  }, [ready, sb]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const confirm = confirmRef.current?.value;
    if (!password || !confirm) { setError('Please fill in all fields.'); return; }
    if (strength.score < 4) { setError('Password is too weak.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }

    setSubmitting(true);
    const { error: err } = await sb.current.auth.updateUser({ password });
    setSubmitting(false);

    if (err) { setError(err.message); return; }
    setState('success');
  }

  return (
    <>
      <SupabaseProvider />
      <div className="subpage">
        <SubpageHeader />
        <main className="page-content">
          <div className="page-inner">
            {state === 'loading' && <p className="lead">Loading...</p>}

            {state === 'form' && (
              <div className="form-container" style={{ margin: '0 auto' }}>
                <h2>Set new password</h2>
                <p className="subtitle">Enter your new password below.</p>
                {error && <div className="alert alert-error visible">{error}</div>}
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="new-password">New password</label>
                    <input type="password" id="new-password" placeholder="Min. 8 characters" required minLength={8} value={password} onChange={e => setPassword(e.target.value)} />
                    <div className="password-strength">
                      <div className="strength-bars">
                        {[0, 1, 2, 3].map(i => (
                          <span key={i} className="strength-bar" style={{ background: i < strength.score - 1 ? strengthColors[strength.score] : 'var(--border)' }} />
                        ))}
                      </div>
                      <span className="strength-label" style={{ color: strengthColors[strength.score] }}>
                        {password.length > 0 ? strengthLabels[strength.score] : ''}
                      </span>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="confirm-password">Confirm new password</label>
                    <input type="password" id="confirm-password" ref={confirmRef} placeholder="Re-enter your password" required />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={submitting}>
                    {submitting ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </div>
            )}

            {state === 'success' && (
              <div>
                <h2 style={{ color: 'var(--text-heading)', marginBottom: '16px' }}>Password updated</h2>
                <p className="lead">Your password has been changed successfully.</p>
                <div className="page-cta" style={{ marginTop: '24px' }}>
                  <Link href="/login" className="btn btn-primary">Log In</Link>
                </div>
              </div>
            )}

            {state === 'error' && (
              <div>
                <h2 style={{ color: 'var(--text-heading)', marginBottom: '16px' }}>Invalid or expired link</h2>
                <p className="lead">This reset link is no longer valid. Please request a new one.</p>
                <div className="page-cta" style={{ marginTop: '24px' }}>
                  <Link href="/forgot-password" className="btn btn-primary">Request New Link</Link>
                </div>
              </div>
            )}
          </div>
        </main>
        <SubpageFooter />
      </div>
    </>
  );
}
