'use client';

import Link from 'next/link';
import SubpageHeader from '@/components/SubpageHeader';
import SubpageFooter from '@/components/SubpageFooter';
import SupabaseProvider from '@/components/SupabaseProvider';
import Script from 'next/script';

export default function SignupPage() {
  return (
    <>
      <SupabaseProvider />
      <div className="subpage">
        <SubpageHeader />
        <main className="page-content">
          <div className="page-inner">
            <div className="form-container" style={{ maxWidth: '560px', margin: '0 auto' }}>
              <h2>Create your account</h2>
              <p className="subtitle">Choose your tier and start exploring AI prompts.</p>
              <div className="alert" id="signup-alert"></div>

              <div className="tiers" style={{ marginBottom: '28px' }} id="tier-selector">
                <div className="tier-card selected" data-tier="personal">
                  <h3>&#127919; Personal</h3>
                  <p>Productivity, learning, everyday AI</p>
                  <div className="price">Free</div>
                </div>
                <div className="tier-card" data-tier="business">
                  <h3>&#128188; Business</h3>
                  <p>Marketing, sales, operations</p>
                  <div className="price">Free</div>
                </div>
                <div className="tier-card" data-tier="creative">
                  <h3>&#127912; Creative</h3>
                  <p>Writing, design, content creation</p>
                  <div className="price">Free</div>
                </div>
              </div>

              <form id="signup-form">
                <input type="hidden" id="signup-tier" defaultValue="personal" />
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
          document.querySelectorAll('#tier-selector .tier-card').forEach(function(card) {
            card.addEventListener('click', function() {
              document.querySelectorAll('#tier-selector .tier-card').forEach(function(c) { c.classList.remove('selected'); });
              card.classList.add('selected');
              document.getElementById('signup-tier').value = card.dataset.tier;
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
            if (!window.supabaseClient) { showAlert(alertEl, 'Service unavailable.', 'error'); return; }
            var result = await window.supabaseClient.auth.signUp({ email: email, password: password, options: { data: { tier: tier } } });
            if (result.error) { showAlert(alertEl, result.error.message, 'error'); return; }
            await window.supabaseClient.from('subscribers').insert([{ email: email, tier: tier }]);
            showAlert(alertEl, 'Account created! Check your email to confirm.', 'success');
            e.target.reset();
          });
        `}
      </Script>
    </>
  );
}
