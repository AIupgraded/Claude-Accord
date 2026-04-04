'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import SubpageHeader from '@/components/SubpageHeader';
import SubpageFooter from '@/components/SubpageFooter';

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const sbRef = useRef<any>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@supabase/supabase-js@2/dist/umd/supabase.min.js';
    script.onload = () => {
      const w = window as any;
      if (w.supabase) {
        sbRef.current = w.supabase.createClient(
          'https://ztwtavjfcinrojckhyai.supabase.co',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0d3RhdmpmY2lucm9qY2toeWFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNjY2MDIsImV4cCI6MjA4ODY0MjYwMn0.3O5N8SRond65onv1Y_LZgSkg6e7L9oR-TmY4XVUW3Ao'
        );
      }
    };
    document.head.appendChild(script);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const email = emailRef.current?.value.trim();
    if (!email) { setError('Please enter your email.'); return; }
    if (!sbRef.current) { setError('Loading... please try again in a moment.'); return; }

    setLoading(true);
    const { error: err } = await sbRef.current.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password'
    });
    setLoading(false);

    if (err) { setError(err.message); return; }
    setSent(true);
  }

  return (
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
                We&apos;ve sent a password reset link to your email address.
                Click the link in the email to set a new password.
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '24px' }}>
                Didn&apos;t receive it? Check your spam folder or{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); setSent(false); setError(''); }} style={{ color: 'var(--gold)' }}>try again</a>.
              </p>
            </div>
          )}
        </div>
      </main>
      <SubpageFooter />
    </div>
  );
}
