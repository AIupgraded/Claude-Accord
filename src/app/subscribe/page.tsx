'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SubpageHeader from '@/components/SubpageHeader';
import SubpageFooter from '@/components/SubpageFooter';
import { useSupabase } from '@/lib/useSupabase';

const tiers = [
  { id: 'personal', name: 'Personal', price: '£5', desc: 'Your life, your growth' },
  { id: 'creative', name: 'Creative', price: '£10', desc: 'Your craft, your vision' },
  { id: 'business', name: 'Business', price: '£15', desc: 'Your work, your impact' },
];

export default function SubscribePage() {
  const supabase = useSupabase();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      setUser(user);
      setLoading(false);
    }
    load();
  }, [supabase, router]);

  async function handleSubscribe(tier: string) {
    setError('');
    setProcessing(tier);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ tier, userId: user.id }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || 'Something went wrong.');
        setProcessing(null);
      }
    } catch {
      setError('Something went wrong. Please try again.');
      setProcessing(null);
    }
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

  const isSubscribed = user?.user_metadata?.subscription_active;

  return (
    <div className="subpage">
      <SubpageHeader />
      <main className="page-content" style={{ justifyContent: 'flex-start', paddingTop: '60px' }}>
        <div className="page-inner">
          <p className="section-label">Claude Accord</p>
          <h2><em>Subscribe</em></h2>
          <p className="lead">
            Claude remembers you. Your growth, your context, your story.
            Every session builds on the last. Choose your world.
          </p>

          {isSubscribed ? (
            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <p style={{ color: 'var(--gold)', fontSize: '1.1rem', marginBottom: '16px' }}>You have an active subscription.</p>
              <Link href="/account" className="btn btn-primary">Go to Dashboard</Link>
            </div>
          ) : (
            <>
              {error && <div className="alert alert-error visible" style={{ maxWidth: '560px', margin: '0 auto 20px' }}>{error}</div>}

              <div className="tier-comparison" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                {tiers.map(t => (
                  <div key={t.id} className="tier-option tier-option--featured">
                    <div className="tier-option-header">
                      <h3>{t.name}</h3>
                      <span className="tier-option-price">{t.price}<span className="tier-option-period">/month</span></span>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.9rem', marginBottom: '20px' }}>{t.desc}</p>
                    <ul className="tier-option-features">
                      <li className="included">Claude remembers you (MCP)</li>
                      <li className="included">Permanent memory</li>
                      <li className="included">Context that grows with you</li>
                      <li className="included">Verified skills in community</li>
                    </ul>
                    <button
                      className="btn btn-primary"
                      style={{ width: '100%' }}
                      onClick={() => handleSubscribe(t.id)}
                      disabled={processing !== null}
                    >
                      {processing === t.id ? 'Redirecting...' : 'Subscribe'}
                    </button>
                    <p className="tier-subsidy">
                      <Link href="/subsidy">Subsidised access available</Link>
                    </p>
                  </div>
                ))}
              </div>

              <p style={{ textAlign: 'center', marginTop: '32px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Cancel anytime. One click. No questions.
              </p>
            </>
          )}
        </div>
      </main>
      <SubpageFooter />
    </div>
  );
}
