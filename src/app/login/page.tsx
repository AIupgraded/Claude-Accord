'use client';

import Link from 'next/link';
import SubpageHeader from '@/components/SubpageHeader';
import SubpageFooter from '@/components/SubpageFooter';
import SupabaseProvider from '@/components/SupabaseProvider';
import Script from 'next/script';

export default function LoginPage() {
  return (
    <>
      <SupabaseProvider />
      <div className="subpage">
        <SubpageHeader />
        <main className="page-content">
          <div className="page-inner">
            <div className="form-container" style={{ margin: '0 auto' }}>
              <h2>Welcome back</h2>
              <p className="subtitle">Log in to access your prompt library.</p>
              <div className="alert" id="login-alert"></div>
              <form id="login-form">
                <div className="form-group">
                  <label htmlFor="login-email">Email</label>
                  <input type="email" id="login-email" placeholder="you@email.com" required />
                </div>
                <div className="form-group">
                  <label htmlFor="login-password">Password</label>
                  <input type="password" id="login-password" placeholder="Your password" required />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Log In</button>
              </form>
              <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Don&apos;t have an account? <Link href="/signup">Sign up</Link>
              </p>
            </div>
          </div>
        </main>
        <SubpageFooter />
      </div>
      <Script id="login-handler" strategy="afterInteractive">
        {`
          document.getElementById('login-form').addEventListener('submit', async function(e) {
            e.preventDefault();
            var alertEl = document.getElementById('login-alert');
            var email = document.getElementById('login-email').value.trim();
            var password = document.getElementById('login-password').value;
            if (!email || !password) { showAlert(alertEl, 'Please fill in all fields.', 'error'); return; }
            if (!window.supabaseClient) { showAlert(alertEl, 'Service unavailable.', 'error'); return; }
            var result = await window.supabaseClient.auth.signInWithPassword({ email: email, password: password });
            if (result.error) { showAlert(alertEl, result.error.message, 'error'); return; }
            window.location.href = '/';
          });
        `}
      </Script>
    </>
  );
}
