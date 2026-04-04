'use client';

import Link from 'next/link';
import SubpageHeader from '@/components/SubpageHeader';
import SubpageFooter from '@/components/SubpageFooter';
import SupabaseProvider from '@/components/SupabaseProvider';
import Script from 'next/script';

export default function ResetPasswordPage() {
  return (
    <>
      <SupabaseProvider />
      <div className="subpage">
        <SubpageHeader />
        <main className="page-content">
          <div className="page-inner">
            <div className="form-container" style={{ margin: '0 auto' }} id="reset-container">
              <h2>Set new password</h2>
              <p className="subtitle">Enter your new password below.</p>
              <div className="alert" id="newpw-alert"></div>
              <form id="newpw-form">
                <div className="form-group">
                  <label htmlFor="new-password">New password</label>
                  <input type="password" id="new-password" placeholder="Min. 8 characters" required minLength={8} />
                  <div className="password-strength" id="password-strength">
                    <div className="strength-bars">
                      <span className="strength-bar" />
                      <span className="strength-bar" />
                      <span className="strength-bar" />
                      <span className="strength-bar" />
                    </div>
                    <span className="strength-label" id="strength-label"></span>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="confirm-password">Confirm new password</label>
                  <input type="password" id="confirm-password" placeholder="Re-enter your password" required />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Update Password</button>
              </form>
            </div>
            <div id="reset-success" style={{ display: 'none' }}>
              <h2 style={{ color: 'var(--text-heading)', marginBottom: '16px' }}>Password updated</h2>
              <p className="lead">Your password has been changed successfully.</p>
              <div className="page-cta" style={{ marginTop: '24px' }}>
                <Link href="/login" className="btn btn-primary">Log In</Link>
              </div>
            </div>
            <div id="reset-error" style={{ display: 'none' }}>
              <h2 style={{ color: 'var(--text-heading)', marginBottom: '16px' }}>Invalid or expired link</h2>
              <p className="lead">This reset link is no longer valid. Please request a new one.</p>
              <div className="page-cta" style={{ marginTop: '24px' }}>
                <Link href="/forgot-password" className="btn btn-primary">Request New Link</Link>
              </div>
            </div>
          </div>
        </main>
        <SubpageFooter />
      </div>
      <Script id="reset-pw-handler" strategy="afterInteractive">
        {`
          function getSupabase() {
            return new Promise(function(resolve) {
              if (window.supabaseClient) return resolve(window.supabaseClient);
              window.addEventListener('supabase-ready', function() { resolve(window.supabaseClient); });
            });
          }

          function showAlertLocal(el, message, type) {
            if (!el) return;
            el.textContent = message;
            el.className = 'alert alert-' + type + ' visible';
          }

          function checkStrength(pw) {
            var score = 0;
            var checks = {
              length: pw.length >= 8,
              upper: /[A-Z]/.test(pw),
              lower: /[a-z]/.test(pw),
              number: /[0-9]/.test(pw),
              special: /[^A-Za-z0-9]/.test(pw)
            };
            Object.values(checks).forEach(function(v) { if (v) score++; });
            return { score: score, checks: checks };
          }

          var strengthColors = ['', '#c0392b', '#c0392b', '#e67e22', '#f1c40f', '#27ae60'];
          var strengthLabels = ['', 'Weak', 'Weak', 'Fair', 'Good', 'Strong'];

          // Check if we have a valid session from the reset link
          async function init() {
            var sb = await getSupabase();
            var session = await sb.auth.getSession();
            if (!session.data.session) {
              // Check URL hash for tokens (Supabase PKCE flow)
              var hash = window.location.hash;
              if (hash && hash.includes('access_token')) {
                // Let Supabase handle the hash
                await new Promise(function(resolve) { setTimeout(resolve, 1000); });
                session = await sb.auth.getSession();
              }
            }
            if (!session.data.session) {
              document.getElementById('reset-container').style.display = 'none';
              document.getElementById('reset-error').style.display = 'block';
            }
          }
          init();

          // Strength indicator
          var pwInput = document.getElementById('new-password');
          if (pwInput) {
            pwInput.addEventListener('input', function(e) {
              var pw = e.target.value;
              var result = checkStrength(pw);
              var bars = document.querySelectorAll('.strength-bar');
              var label = document.getElementById('strength-label');
              bars.forEach(function(bar, i) {
                bar.style.background = i < result.score - 1 ? strengthColors[result.score] : 'var(--border)';
              });
              label.textContent = pw.length > 0 ? strengthLabels[result.score] : '';
              label.style.color = strengthColors[result.score];
            });
          }

          // Submit new password
          document.getElementById('newpw-form').addEventListener('submit', async function(e) {
            e.preventDefault();
            var alertEl = document.getElementById('newpw-alert');
            var password = document.getElementById('new-password').value;
            var confirm = document.getElementById('confirm-password').value;

            if (!password || !confirm) { showAlertLocal(alertEl, 'Please fill in all fields.', 'error'); return; }
            var result = checkStrength(password);
            if (result.score < 4) { showAlertLocal(alertEl, 'Password is too weak.', 'error'); return; }
            if (password !== confirm) { showAlertLocal(alertEl, 'Passwords do not match.', 'error'); return; }

            var sb = await getSupabase();
            var updateResult = await sb.auth.updateUser({ password: password });
            if (updateResult.error) { showAlertLocal(alertEl, updateResult.error.message, 'error'); return; }

            document.getElementById('reset-container').style.display = 'none';
            document.getElementById('reset-success').style.display = 'block';
          });
        `}
      </Script>
    </>
  );
}
