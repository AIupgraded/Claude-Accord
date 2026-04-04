'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import SubpageHeader from '@/components/SubpageHeader';
import SubpageFooter from '@/components/SubpageFooter';
import { useSupabase } from '@/lib/useSupabase';

type Tab = 'users' | 'subsidy' | 'contacts' | 'reviews' | 'courses' | 'keys' | 'subscribers';

export default function AdminPage() {
  const supabase = useSupabase();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string>('');
  const [tab, setTab] = useState<Tab>('subsidy');
  const [data, setData] = useState<any>(null);
  const [fetching, setFetching] = useState(false);
  const [token, setToken] = useState('');

  const isOwner = role === 'owner';
  const isBoard = role === 'board';

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      const r = user.user_metadata?.role;
      if (r !== 'owner' && r !== 'board' && r !== 'admin') { router.push('/account'); return; }
      setRole(r);
      const { data: { session } } = await supabase.auth.getSession();
      setToken(session?.access_token || '');
      setLoading(false);
    }
    load();
  }, [supabase, router]);

  const fetchData = useCallback(async (action: string) => {
    setFetching(true);
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ action }),
      });
      const d = await res.json();
      setData(d);
    } catch { setData({ error: 'Failed to fetch' }); }
    setFetching(false);
  }, [token]);

  useEffect(() => {
    if (!token) return;
    const actionMap: Record<Tab, string> = {
      users: 'get-users', subsidy: 'get-subsidy-requests', contacts: 'get-contacts',
      reviews: 'get-reviews', courses: 'get-course-completions', keys: 'get-mcp-keys',
      subscribers: 'get-subscribers',
    };
    fetchData(actionMap[tab]);
  }, [tab, token, fetchData]);

  async function adminAction(action: string, payload: any) {
    await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ action, ...payload }),
    });
    // Refresh current tab
    const actionMap: Record<Tab, string> = {
      users: 'get-users', subsidy: 'get-subsidy-requests', contacts: 'get-contacts',
      reviews: 'get-reviews', courses: 'get-course-completions', keys: 'get-mcp-keys',
      subscribers: 'get-subscribers',
    };
    fetchData(actionMap[tab]);
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

  const ownerTabs: Tab[] = ['users', 'subsidy', 'contacts', 'reviews', 'courses', 'keys', 'subscribers'];
  const boardTabs: Tab[] = ['users', 'subsidy', 'contacts', 'reviews', 'courses', 'keys', 'subscribers'];
  const adminTabs: Tab[] = ['subsidy', 'contacts', 'reviews'];
  const tabs = isOwner ? ownerTabs : isBoard ? boardTabs : adminTabs;

  return (
    <div className="subpage">
      <SubpageHeader />
      <main className="page-content" style={{ justifyContent: 'flex-start', paddingTop: '40px' }}>
        <div className="page-inner" style={{ maxWidth: '900px' }}>
          <p className="section-label">{isOwner ? 'Owner Panel' : isBoard ? 'Board Panel' : 'Admin Panel'}</p>
          <h2><em>Admin</em></h2>

          {/* Tabs */}
          <div className="admin-tabs">
            {tabs.map(t => (
              <button key={t} className={`admin-tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="admin-content">
            {fetching ? <p style={{ color: 'var(--text-muted)' }}>Loading...</p> : null}

            {/* USERS (owner only) */}
            {tab === 'users' && data?.users && (
              <div className="admin-table">
                {data.users.map((u: any) => (
                  <div key={u.id} className="admin-row">
                    <div>
                      <span className="admin-row-main">{u.display_name || u.email}</span>
                      <span className="admin-row-sub">{u.email}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span className={`admin-badge admin-badge--${u.role}`}>
                        {u.role === 'board' ? (u.board_title || 'Board') : u.role}
                      </span>
                      {/* Owner can make/remove board */}
                      {isOwner && u.role === 'user' && (
                        <>
                          <button className="admin-action-btn" onClick={() => {
                            const title = prompt('Board title (CEO, CFO, CTO, etc.):');
                            if (title) adminAction('set-board', { userId: u.id, data: { title } });
                          }}>Make Board</button>
                          <button className="admin-action-btn" onClick={() => adminAction('set-admin', { userId: u.id })}>Make Admin</button>
                        </>
                      )}
                      {isOwner && u.role === 'board' && (
                        <button className="admin-action-btn admin-action-btn--danger" onClick={() => adminAction('remove-board', { userId: u.id })}>Remove Board</button>
                      )}
                      {isOwner && u.role === 'admin' && (
                        <button className="admin-action-btn admin-action-btn--danger" onClick={() => adminAction('remove-admin', { userId: u.id })}>Remove Admin</button>
                      )}
                      {/* Board can make/remove admin */}
                      {isBoard && u.role === 'user' && (
                        <button className="admin-action-btn" onClick={() => adminAction('set-admin', { userId: u.id })}>Make Admin</button>
                      )}
                      {isBoard && u.role === 'admin' && (
                        <button className="admin-action-btn admin-action-btn--danger" onClick={() => adminAction('remove-admin', { userId: u.id })}>Remove Admin</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SUBSIDY */}
            {tab === 'subsidy' && data?.requests && (
              <div className="admin-table">
                {data.requests.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No requests yet.</p>}
                {data.requests.map((r: any) => (
                  <div key={r.id} className="admin-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <span className="admin-row-main">{r.email}</span>
                      <span className={`admin-badge admin-badge--${r.status}`}>{r.status}</span>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text)', lineHeight: '1.6' }}>{r.message}</p>
                    <span className="admin-row-sub">{new Date(r.created_at).toLocaleDateString('en-GB')}</span>
                    {r.status === 'pending' && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="admin-action-btn" onClick={() => adminAction('update-subsidy', { data: { requestId: r.id, status: 'approved', discount: 100, months: 12 } })}>Approve 100%</button>
                        <button className="admin-action-btn" onClick={() => adminAction('update-subsidy', { data: { requestId: r.id, status: 'approved', discount: 50, months: 12 } })}>Approve 50%</button>
                        <button className="admin-action-btn admin-action-btn--danger" onClick={() => adminAction('update-subsidy', { data: { requestId: r.id, status: 'denied' } })}>Deny</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* CONTACTS */}
            {tab === 'contacts' && data?.contacts && (
              <div className="admin-table">
                {data.contacts.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No messages yet.</p>}
                {data.contacts.map((c: any) => (
                  <div key={c.id} className="admin-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <span className="admin-row-main">{c.name}</span>
                      <span className="admin-row-sub">{new Date(c.created_at).toLocaleDateString('en-GB')}</span>
                    </div>
                    <span className="admin-row-sub">{c.email}</span>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text)', lineHeight: '1.6' }}>{c.message}</p>
                  </div>
                ))}
              </div>
            )}

            {/* REVIEWS */}
            {tab === 'reviews' && data?.reviews && (
              <div className="admin-table">
                {data.reviews.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No reviews yet.</p>}
                {data.reviews.map((r: any) => (
                  <div key={r.id} className="admin-row">
                    <div>
                      <span className="admin-row-main">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                      <span className="admin-row-sub">{r.comment || 'No comment'}</span>
                    </div>
                    <span className="admin-row-sub">{new Date(r.created_at).toLocaleDateString('en-GB')}</span>
                  </div>
                ))}
              </div>
            )}

            {/* COURSES (owner only) */}
            {tab === 'courses' && data?.completions && (
              <div className="admin-table">
                {data.completions.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No completions yet.</p>}
                {data.completions.map((c: any) => (
                  <div key={c.id} className="admin-row">
                    <div>
                      <span className="admin-row-main">{c.email}</span>
                      <span className="admin-row-sub">{c.accord_courses?.title || 'Unknown course'}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className="admin-row-sub">Level {c.level_earned}</span>
                      <span className="admin-row-sub">{new Date(c.completed_at).toLocaleDateString('en-GB')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* MCP KEYS (owner only) */}
            {tab === 'keys' && data?.keys && (
              <div className="admin-table">
                {data.keys.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No keys generated yet.</p>}
                {data.keys.map((k: any) => (
                  <div key={k.id} className="admin-row">
                    <div>
                      <span className="admin-row-main" style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{k.key_hash?.slice(0, 20)}...</span>
                      <span className={`admin-badge admin-badge--${k.status}`}>{k.status}</span>
                    </div>
                    <span className="admin-row-sub">{new Date(k.created_at).toLocaleDateString('en-GB')}</span>
                  </div>
                ))}
              </div>
            )}

            {/* SUBSCRIBERS (owner only) */}
            {tab === 'subscribers' && data?.subscribers && (
              <div className="admin-table">
                {data.subscribers.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No subscribers yet.</p>}
                {data.subscribers.map((s: any) => (
                  <div key={s.id} className="admin-row">
                    <div>
                      <span className="admin-row-main">{s.email}</span>
                      <span className="admin-row-sub">{s.tier}</span>
                    </div>
                    <span className="admin-row-sub">{new Date(s.created_at).toLocaleDateString('en-GB')}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <SubpageFooter />
    </div>
  );
}
