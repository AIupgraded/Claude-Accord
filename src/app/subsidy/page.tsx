'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import SubpageHeader from '@/components/SubpageHeader';
import SubpageFooter from '@/components/SubpageFooter';
import { useSupabase } from '@/lib/useSupabase';

export default function SubsidyPage() {
  const supabase = useSupabase();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [subsidyType, setSubsidyType] = useState('personal');
  const messageRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      setUser(user);
      setLoading(false);
    }
    load();
  }, [supabase, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const message = messageRef.current?.value.trim();
    if (!message || message.length < 20) {
      setError('Please write a few sentences about yourself.');
      return;
    }

    const fullMessage = `[${subsidyType.toUpperCase()}] ${message}`;

    setSending(true);
    const { error: err } = await supabase.from('subsidy_requests').insert([{
      user_id: user.id,
      message: fullMessage,
    }] as any);
    setSending(false);

    if (err) { setError('Something went wrong. Please try again.'); return; }
    setSent(true);
  }

  if (loading) {
    return (
      <div className="subpage">
        <SubpageHeader />
        <main className="page-content"><div className="page-inner"><p className="lead">Loading...</p></div></main>
        <SubpageFooter />
      </div>
    );
  }

  return (
    <div className="subpage">
      <SubpageHeader />
      <main className="page-content">
        <div className="page-inner">
          {!sent ? (
            <div className="form-container" style={{ margin: '0 auto', maxWidth: '560px' }}>
              <h2>Subsidised Access</h2>
              <p className="subtitle">Tell us about yourself and why you&apos;d like subsidised access.</p>
              {error && <div className="alert alert-error visible">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>What are you applying for?</label>
                  <div className="tier-buttons" style={{ marginTop: '8px', marginBottom: '8px' }}>
                    <button type="button" className={`tier-btn${subsidyType === 'personal' ? ' selected' : ''}`} onClick={() => setSubsidyType('personal')}>Personal</button>
                    <button type="button" className={`tier-btn${subsidyType === 'student-business' ? ' selected' : ''}`} onClick={() => setSubsidyType('student-business')}>Student Business</button>
                    <button type="button" className={`tier-btn${subsidyType === 'student-creative' ? ' selected' : ''}`} onClick={() => setSubsidyType('student-creative')}>Student Creative</button>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {subsidyType === 'personal' && 'Personal subscription — up to 80% discount.'}
                    {subsidyType === 'student-business' && 'Student access to Business — 50% or 75% discount with valid student status.'}
                    {subsidyType === 'student-creative' && 'Student access to Creative — 50% or 75% discount with valid student status.'}
                  </p>
                </div>
                <div className="form-group">
                  <label>About you</label>
                  <textarea ref={messageRef} placeholder="A few sentences about your situation..." rows={6} required minLength={20} style={{ resize: 'vertical' }} />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={sending}>
                  {sending ? 'Sending...' : 'Send'}
                </button>
              </form>
            </div>
          ) : (
            <div>
              <h2 style={{ color: 'var(--text-heading)', marginBottom: '16px' }}>Thank you</h2>
              <p className="lead">We&apos;ll review your request and get back to you.</p>
              <div className="page-cta" style={{ marginTop: '24px' }}>
                <Link href="/account" className="btn btn-outline">Back to Dashboard</Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <SubpageFooter />
    </div>
  );
}
