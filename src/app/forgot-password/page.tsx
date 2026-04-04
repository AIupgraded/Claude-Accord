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
            <div className="form-container" style={{ margin: '0 auto' }} id="forgot-container">
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
            <div id="forgot-success" style={{ display: 'none' }}>
              <h2 style={{ color: 'var(--text-heading)', marginBottom: '16px' }}>Check your email</h2>
              <p className="lead">
                We&apos;ve sent a password reset link to your email address.
                Click the link in the email to set a new password.
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '24px' }}>
                Didn&apos;t receive it? Check your spam folder or{' '}
                <a href="#" id="try-again-link" style={{ color: 'var(--gold)' }}>try again</a>.
              </p>
            </div>
          </div>
        </main>
        <SubpageFooter />
      </div>
      <Script id="reset-handler" strategy="lazyOnload">
        {`
          (function() {
            function getSupabase() {
              return new Promise(function(resolve) {
                if (window.supabaseClient) return resolve(window.supabaseClient);
                window.addEventListener('supabase-ready', function() { resolve(window.supabaseClient); });
              });
            }

            function showA(el, msg, type) {
              if (!el) return;
              el.textContent = msg;
              el.className = 'alert alert-' + type + ' visible';
            }

            function setup() {
              var form = document.getElementById('reset-form');
              if (!form) { setTimeout(setup, 100); return; }

              form.addEventListener('submit', async function(e) {
                e.preventDefault();
                var alertEl = document.getElementById('reset-alert');
                var email = document.getElementById('reset-email').value.trim();
                if (!email) { showA(alertEl, 'Please enter your email.', 'error'); return; }
                var sb = await getSupabase();
                var result = await sb.auth.resetPasswordForEmail(email, {
                  redirectTo: window.location.origin + '/reset-password'
                });
                if (result.error) { showA(alertEl, result.error.message, 'error'); return; }
                document.getElementById('forgot-container').style.display = 'none';
                document.getElementById('forgot-success').style.display = 'block';
              });

              var tryAgain = document.getElementById('try-again-link');
              if (tryAgain) {
                tryAgain.addEventListener('click', function(e) {
                  e.preventDefault();
                  document.getElementById('forgot-container').style.display = 'block';
                  document.getElementById('forgot-success').style.display = 'none';
                  var al = document.getElementById('reset-alert');
                  if (al) al.className = 'alert';
                });
              }
            }
            setup();
          })();
        `}
      </Script>
    </>
  );
}
