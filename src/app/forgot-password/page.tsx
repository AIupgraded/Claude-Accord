'use client';

import Link from 'next/link';
import SubpageHeader from '@/components/SubpageHeader';
import SubpageFooter from '@/components/SubpageFooter';
import SupabaseProvider from '@/components/SupabaseProvider';
import Script from 'next/script';

export default function ForgotPasswordPage() {
  return (
    <>
      <SupabaseProvider />
      <div className="subpage">
        <SubpageHeader />
        <main className="page-content">
          <div className="page-inner">
            <div className="form-container" style={{ margin: '0 auto' }}>
              <h2>Reset password</h2>
              <p className="subtitle">Enter your email and we&apos;ll send you a reset link.</p>
              <div className="alert" id="reset-alert"></div>
              <form id="reset-form">
                <div className="form-group">
                  <label htmlFor="reset-email">Email</label>
                  <input type="email" id="reset-email" placeholder="you@email.com" required />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Send Reset Link</button>
              </form>
              <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Remember your password? <Link href="/login">Log in</Link>
              </p>
            </div>
          </div>
        </main>
        <SubpageFooter />
      </div>
      <Script id="reset-handler" strategy="afterInteractive">
        {`
          function getSupabase() {
            return new Promise(function(resolve) {
              if (window.supabaseClient) return resolve(window.supabaseClient);
              window.addEventListener('supabase-ready', function() { resolve(window.supabaseClient); });
            });
          }

          document.getElementById('reset-form').addEventListener('submit', async function(e) {
            e.preventDefault();
            var alertEl = document.getElementById('reset-alert');
            var email = document.getElementById('reset-email').value.trim();
            if (!email) { showAlert(alertEl, 'Please enter your email.', 'error'); return; }
            var sb = await getSupabase();
            var result = await sb.auth.resetPasswordForEmail(email, {
              redirectTo: window.location.origin + '/login'
            });
            if (result.error) { showAlert(alertEl, result.error.message, 'error'); return; }
            showAlert(alertEl, 'Check your email for the reset link.', 'success');
            e.target.reset();
          });
        `}
      </Script>
    </>
  );
}
