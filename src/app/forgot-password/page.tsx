'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';
import SubpageHeader from '@/components/SubpageHeader';
import SubpageFooter from '@/components/SubpageFooter';
import SupabaseProvider from '@/components/SupabaseProvider';
import { useSupabase } from '@/lib/useSupabase';

export default function ForgotPasswordPage() {
  const supabase = useSupabase();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const email = emailRef.current?.value.trim();
    if (!email) { setError('Please enter your email.'); return; }

    setLoading(true);
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://getaccord.online/reset-password'
    });
    setLoading(false);

    if (err) { setError(err.message); return; }
    setSent(true);
  }

  return (
    <>
      <SupabaseProvider />
      <div className="subpage">
        <SubpageHeader />
        <main className="page-content">
          <div className="page-inner">
            {!sent ? (
              <div className="form-container" style={{ margin: '0 auto' }}>
                <h2>Reset password</h2>
                <p className="subtitle">Enter your email and we&apos;ll send you a reset link.</p>
                {error && <div className="alert alert-error visible">{error}</div>}
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="reset-email">Email</label>
                    <input type="email" id="reset-email" ref={emailRef} placeholder="you@email.com" required />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </form>
                <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Remember your password? <Link href="/login">Log in</Link>
                </p>
              </div>
            ) : (
              <div>
                <h2 style={{ color: 'var(--text-heading)', marginBottom: '16px' }}>Check your email</h2>
                <p className="lead">
                  If an account exists with that email, we&apos;ve sent a password reset link.
                  Check your inbox and spam folder.
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '16px', lineHeight: '1.6' }}>
                  The link expires in 1 hour. If you don&apos;t receive it within a few minutes,
                  wait 60 seconds before trying again.
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '24px' }}>
                  <a href="#" onClick={(e) => { e.preventDefault(); setSent(false); setError(''); }} style={{ color: 'var(--gold)' }}>Try again</a>
                  {' '} | {' '}
                  <Link href="/login" style={{ color: 'var(--gold)' }}>Back to login</Link>
                </p>
              </div>
            )}
          </div>
        </main>
        <SubpageFooter />
      </div>
    </>
  );
}
