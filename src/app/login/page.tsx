'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import SubpageHeader from '@/components/SubpageHeader';
import SubpageFooter from '@/components/SubpageFooter';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
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
    const password = passwordRef.current?.value;
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    if (!sbRef.current) { setError('Loading... please try again in a moment.'); return; }

    setLoading(true);
    const { error: err } = await sbRef.current.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (err) { setError(err.message); return; }
    window.location.href = '/';
  }

  return (
    <div className="subpage">
      <SubpageHeader />
      <main className="page-content">
        <div className="page-inner">
          <div className="form-container" style={{ margin: '0 auto' }}>
            <h2>Welcome back</h2>
            <p className="subtitle">Log in to access your prompt library.</p>
            {error && <div className="alert alert-error visible">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="login-email">Email</label>
                <input type="email" id="login-email" ref={emailRef} placeholder="you@email.com" required />
              </div>
              <div className="form-group">
                <label htmlFor="login-password">Password</label>
                <input type="password" id="login-password" ref={passwordRef} placeholder="Your password" required />
              </div>
              <p style={{ textAlign: 'right', marginBottom: '20px' }}>
                <Link href="/forgot-password" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Forgot password?</Link>
              </p>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                {loading ? 'Logging in...' : 'Log In'}
              </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Don&apos;t have an account? <Link href="/signup">Sign up</Link>
            </p>
          </div>
        </div>
      </main>
      <SubpageFooter />
    </div>
  );
}
