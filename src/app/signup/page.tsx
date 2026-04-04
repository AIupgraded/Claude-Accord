'use client';

import Link from 'next/link';
import { useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import SubpageHeader from '@/components/SubpageHeader';
import SubpageFooter from '@/components/SubpageFooter';
import { useSupabase } from '@/lib/useSupabase';

function checkStrength(pw: string) {
  const checks = {
    length: pw.length >= 8,
    upper: /[A-Z]/.test(pw),
    lower: /[a-z]/.test(pw),
    number: /[0-9]/.test(pw),
    special: /[^A-Za-z0-9]/.test(pw),
  };
  const score = Object.values(checks).filter(Boolean).length;
  return { score, checks };
}

const strengthLabels = ['', 'Weak', 'Weak', 'Fair', 'Good', 'Strong'];
const strengthColors = ['', '#c0392b', '#c0392b', '#e67e22', '#f1c40f', '#27ae60'];

function SignupContent() {
  const searchParams = useSearchParams();
  const tierParam = searchParams.get('tier') || 'personal';
  const validTier = ['personal', 'business', 'creative'].includes(tierParam) ? tierParam : 'personal';

  const supabase = useSupabase();
  const [tier, setTier] = useState(validTier);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const emailRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const strength = checkStrength(password);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    const email = emailRef.current?.value.trim();
    const confirm = confirmRef.current?.value;

    if (!email || !password || !confirm) { setError('Please fill in all fields.'); return; }
    if (strength.score < 4) { setError('Password is too weak. Please meet all requirements.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }

    setLoading(true);
    const { error: err } = await supabase.auth.signUp({ email, password, options: { data: { tier } } });
    if (!err) await supabase.from('subscribers').insert([{ email, tier }] as any);
    setLoading(false);

    if (err) { setError(err.message); return; }
    setSuccess('Account created! Check your email to confirm.');
    formRef.current?.reset();
    setPassword('');
  }

  return (
    <>
      <div className="subpage">
        <SubpageHeader />
        <main className="page-content">
          <div className="page-inner">
            <div className="form-container" style={{ maxWidth: '720px', margin: '0 auto' }}>
              <h2>Create your account</h2>
              <p className="subtitle">Choose your world. Begin.</p>
              {error && <div className="alert alert-error visible">{error}</div>}
              {success && <div className="alert alert-success visible">{success}</div>}

              <div className="tier-buttons" style={{ marginBottom: '28px' }}>
                {(['personal', 'business', 'creative'] as const).map(t => (
                  <button key={t} type="button" className={`tier-btn${tier === t ? ' selected' : ''}`} onClick={() => setTier(t)}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} ref={formRef}>
                <div className="form-group">
                  <label htmlFor="signup-email">Email</label>
                  <input type="email" id="signup-email" ref={emailRef} placeholder="you@email.com" required />
                </div>
                <div className="form-group">
                  <label htmlFor="signup-password">Password</label>
                  <input type="password" id="signup-password" placeholder="Min. 8 characters" required minLength={8} value={password} onChange={e => setPassword(e.target.value)} />
                  <div className="password-strength">
                    <div className="strength-bars">
                      {[0, 1, 2, 3].map(i => (
                        <span key={i} className="strength-bar" style={{ background: i < strength.score - 1 ? strengthColors[strength.score] : 'var(--border)' }} />
                      ))}
                    </div>
                    <span className="strength-label" style={{ color: strengthColors[strength.score] }}>
                      {password.length > 0 ? strengthLabels[strength.score] : ''}
                    </span>
                  </div>
                  <ul className="password-rules">
                    <li className={strength.checks.length ? 'passed' : ''}>At least 8 characters</li>
                    <li className={strength.checks.upper ? 'passed' : ''}>One uppercase letter</li>
                    <li className={strength.checks.lower ? 'passed' : ''}>One lowercase letter</li>
                    <li className={strength.checks.number ? 'passed' : ''}>One number</li>
                    <li className={strength.checks.special ? 'passed' : ''}>One special character</li>
                  </ul>
                </div>
                <div className="form-group">
                  <label htmlFor="signup-confirm">Confirm password</label>
                  <input type="password" id="signup-confirm" ref={confirmRef} placeholder="Re-enter your password" required />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                  {loading ? 'Creating...' : 'Create Account'}
                </button>
              </form>
              <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Already have an account? <Link href="/login">Log in</Link>
              </p>
            </div>
          </div>
        </main>
        <SubpageFooter />
      </div>
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
