'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import SubpageHeader from '@/components/SubpageHeader';
import SubpageFooter from '@/components/SubpageFooter';
import { useSupabase } from '@/lib/useSupabase';

export default function BlogPage() {
  const supabase = useSupabase();
  const [posts, setPosts] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [email, setEmail] = useState('');
  const [subMsg, setSubMsg] = useState('');

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('blog_posts')
        .select('title, slug, excerpt, published_at')
        .eq('status', 'published')
        .order('published_at', { ascending: false });
      setPosts(data || []);
      setLoaded(true);
    }
    load();
  }, [supabase]);

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    const { error } = await supabase.from('subscribers').insert([{ email: email.trim(), tier: 'personal' }] as any);
    if (error?.code === '23505') {
      setSubMsg('You are already subscribed.');
    } else if (error) {
      setSubMsg('Something went wrong. Try again.');
    } else {
      setSubMsg('Subscribed. You will hear from us.');
      setEmail('');
    }
  }

  return (
    <div className="subpage">
      <SubpageHeader activeNav="blog" />
      <main className="page-content" style={{ justifyContent: 'flex-start', paddingTop: '60px' }}>
        <div className="page-inner">
          <p className="section-label">Journal</p>
          <h2>The <em>Blog</em></h2>
          <p className="lead">
            Thinking out loud about human-AI collaboration, protocol design,
            and what happens when you stop treating AI as a search engine.
          </p>

          {loaded && posts.length > 0 ? (
            <div className="blog-list">
              {posts.map(post => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="blog-card">
                  <span className="blog-card-date">
                    {new Date(post.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                  <h3 className="blog-card-title">{post.title}</h3>
                  {post.excerpt && <p className="blog-card-excerpt">{post.excerpt}</p>}
                </Link>
              ))}
            </div>
          ) : loaded ? (
            <div className="blog-empty">
              <p>No posts yet. Subscribe to be notified when we publish.</p>
            </div>
          ) : null}

          {/* Subscribe */}
          <div className="blog-subscribe">
            <h3>Stay in the loop</h3>
            <p>Get notified when we publish. No spam. Just signal.</p>
            {subMsg ? (
              <p style={{ color: 'var(--gold)', marginTop: '12px' }}>{subMsg}</p>
            ) : (
              <form onSubmit={handleSubscribe} className="blog-subscribe-form">
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" required />
                <button type="submit" className="btn btn-primary">Subscribe</button>
              </form>
            )}
          </div>
        </div>
      </main>
      <SubpageFooter />
    </div>
  );
}
