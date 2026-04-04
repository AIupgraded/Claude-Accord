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
                  <input type="password" id="signup-password" placeholder="Min. 6 characters" required minLength={6} />
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
      <Script id="signup-handler" strategy="afterInteractive">
        {`
          function getSupabase() {
            return new Promise(function(resolve) {
              if (window.supabaseClient) return resolve(window.supabaseClient);
              window.addEventListener('supabase-ready', function() { resolve(window.supabaseClient); });
            });
          }

          document.querySelectorAll('#tier-selector .tier-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
              document.querySelectorAll('#tier-selector .tier-btn').forEach(function(b) { b.classList.remove('selected'); });
              btn.classList.add('selected');
              document.getElementById('signup-tier').value = btn.dataset.tier;
            });
          });

          document.getElementById('signup-form').addEventListener('submit', async function(e) {
            e.preventDefault();
            var alertEl = document.getElementById('signup-alert');
            var email = document.getElementById('signup-email').value.trim();
            var password = document.getElementById('signup-password').value;
            var tier = document.getElementById('signup-tier').value || 'personal';
            if (!email || !password) { showAlert(alertEl, 'Please fill in all fields.', 'error'); return; }
            if (password.length < 6) { showAlert(alertEl, 'Password must be at least 6 characters.', 'error'); return; }
            var sb = await getSupabase();
            var result = await sb.auth.signUp({ email: email, password: password, options: { data: { tier: tier } } });
            if (result.error) { showAlert(alertEl, result.error.message, 'error'); return; }
            await sb.from('subscribers').insert([{ email: email, tier: tier }]);
            showAlert(alertEl, 'Account created! Check your email to confirm.', 'success');
            e.target.reset();
          });
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
