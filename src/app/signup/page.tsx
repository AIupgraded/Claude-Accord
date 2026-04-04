'use client';

import Link from 'next/link';
import SubpageHeader from '@/components/SubpageHeader';
import SubpageFooter from '@/components/SubpageFooter';
import SupabaseProvider from '@/components/SupabaseProvider';
import Script from 'next/script';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SignupContent() {
  const searchParams = useSearchParams();
  const tierParam = searchParams.get('tier') || 'personal';
  const validTier = ['personal', 'business', 'creative'].includes(tierParam) ? tierParam : 'personal';
  return (
    <>
      <SupabaseProvider />
      <div className="subpage">
        <SubpageHeader />
        <main className="page-content">
          <div className="page-inner">
            <div className="form-container" style={{ maxWidth: '720px', margin: '0 auto' }}>
              <h2>Create your account</h2>
              <p className="subtitle">Choose your world. Begin.</p>
              <div className="alert" id="signup-alert"></div>

              <div className="tier-buttons" style={{ marginBottom: '28px' }} id="tier-selector">
                <button type="button" className={`tier-btn${validTier === 'personal' ? ' selected' : ''}`} data-tier="personal">Personal</button>
                <button type="button" className={`tier-btn${validTier === 'business' ? ' selected' : ''}`} data-tier="business">Business</button>
                <button type="button" className={`tier-btn${validTier === 'creative' ? ' selected' : ''}`} data-tier="creative">Creative</button>
              </div>

              <form id="signup-form">
                <input type="hidden" id="signup-tier" defaultValue={validTier} />
                <div className="form-group">
                  <label htmlFor="signup-email">Email</label>
                  <input type="email" id="signup-email" placeholder="you@email.com" required />
                </div>
                <div className="form-group">
                  <label htmlFor="signup-password">Password</label>
                  <input type="password" id="signup-password" placeholder="Min. 8 characters" required minLength={8} />
                  <div className="password-strength" id="password-strength">
                    <div className="strength-bars">
                      <span className="strength-bar" />
                      <span className="strength-bar" />
                      <span className="strength-bar" />
                      <span className="strength-bar" />
                    </div>
                    <span className="strength-label" id="strength-label"></span>
                  </div>
                  <ul className="password-rules" id="password-rules">
                    <li id="rule-length">At least 8 characters</li>
                    <li id="rule-upper">One uppercase letter</li>
                    <li id="rule-lower">One lowercase letter</li>
                    <li id="rule-number">One number</li>
                    <li id="rule-special">One special character</li>
                  </ul>
                </div>
                <div className="form-group">
                  <label htmlFor="signup-confirm">Confirm password</label>
                  <input type="password" id="signup-confirm" placeholder="Re-enter your password" required />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Create Account</button>
              </form>
              <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Already have an account? <Link href="/login">Log in</Link>
              </p>
            </div>
          </div>
        </main>
        <SubpageFooter />
      </div>
      <Script id="signup-handler" strategy="lazyOnload">
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

            var strengthLabels = ['', 'Weak', 'Weak', 'Fair', 'Good', 'Strong'];
            var strengthColors = ['', '#c0392b', '#c0392b', '#e67e22', '#f1c40f', '#27ae60'];

            function setup() {
              var form = document.getElementById('signup-form');
              if (!form) { setTimeout(setup, 100); return; }

              // Tier selector
              document.querySelectorAll('#tier-selector .tier-btn').forEach(function(btn) {
                btn.addEventListener('click', function() {
                  document.querySelectorAll('#tier-selector .tier-btn').forEach(function(b) { b.classList.remove('selected'); });
                  btn.classList.add('selected');
                  document.getElementById('signup-tier').value = btn.dataset.tier;
                });
              });

              // Password strength
              document.getElementById('signup-password').addEventListener('input', function(e) {
                var pw = e.target.value;
                var result = checkStrength(pw);
                var bars = document.querySelectorAll('.strength-bar');
                var label = document.getElementById('strength-label');
                bars.forEach(function(bar, i) {
                  bar.style.background = i < result.score - 1 ? strengthColors[result.score] : 'var(--border)';
                });
                label.textContent = pw.length > 0 ? strengthLabels[result.score] : '';
                label.style.color = strengthColors[result.score];
                var ruleMap = { length: 'rule-length', upper: 'rule-upper', lower: 'rule-lower', number: 'rule-number', special: 'rule-special' };
                Object.keys(ruleMap).forEach(function(key) {
                  var el = document.getElementById(ruleMap[key]);
                  el.className = result.checks[key] ? 'passed' : '';
                });
              });

              // Submit
              form.addEventListener('submit', async function(e) {
                e.preventDefault();
                var alertEl = document.getElementById('signup-alert');
                var email = document.getElementById('signup-email').value.trim();
                var password = document.getElementById('signup-password').value;
                var confirm = document.getElementById('signup-confirm').value;
                var tier = document.getElementById('signup-tier').value || 'personal';

                if (!email || !password || !confirm) { showA(alertEl, 'Please fill in all fields.', 'error'); return; }
                var result = checkStrength(password);
                if (result.score < 4) { showA(alertEl, 'Password is too weak. Please meet all requirements.', 'error'); return; }
                if (password !== confirm) { showA(alertEl, 'Passwords do not match.', 'error'); return; }

                var sb = await getSupabase();
                var authResult = await sb.auth.signUp({ email: email, password: password, options: { data: { tier: tier } } });
                if (authResult.error) { showA(alertEl, authResult.error.message, 'error'); return; }
                await sb.from('subscribers').insert([{ email: email, tier: tier }]);
                showA(alertEl, 'Account created! Check your email to confirm.', 'success');
                e.target.reset();
                document.querySelectorAll('.strength-bar').forEach(function(b) { b.style.background = 'var(--border)'; });
                document.getElementById('strength-label').textContent = '';
                document.querySelectorAll('#password-rules li').forEach(function(li) { li.className = ''; });
              });
            }
            setup();
          })();
        `}
      </Script>
    </>
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupContent />
    </Suspense>
  );
}
