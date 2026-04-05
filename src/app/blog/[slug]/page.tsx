'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import SubpageHeader from '@/components/SubpageHeader';
import SubpageFooter from '@/components/SubpageFooter';
import { useSupabase } from '@/lib/useSupabase';

export default function BlogPostPage() {
  const supabase = useSupabase();
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<any>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();
      setPost(data);
      setLoaded(true);
    }
    if (slug) load();
  }, [supabase, slug]);

  if (!loaded) {
    return (
      <div className="subpage">
        <SubpageHeader activeNav="blog" />
        <main className="page-content"><div className="page-inner"><p className="lead">Loading...</p></div></main>
        <SubpageFooter />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="subpage">
        <SubpageHeader activeNav="blog" />
        <main className="page-content">
          <div className="page-inner">
            <h2>Post not found</h2>
            <div className="page-cta" style={{ marginTop: '24px' }}>
              <Link href="/blog" className="btn btn-outline">Back to Blog</Link>
            </div>
          </div>
        </main>
        <SubpageFooter />
      </div>
    );
  }

  return (
    <div className="subpage">
      <SubpageHeader activeNav="blog" />
      <main className="page-content" style={{ justifyContent: 'flex-start', paddingTop: '60px' }}>
        <div className="page-inner">
          <p className="section-label">
            {new Date(post.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <h2><em>{post.title}</em></h2>

          <div className="blog-article">
            {post.content.split('\n\n').map((paragraph: string, i: number) => {
              if (paragraph.startsWith('## ')) {
                return <h3 key={i}>{paragraph.replace('## ', '')}</h3>;
              }
              if (paragraph.startsWith('### ')) {
                return <h4 key={i}>{paragraph.replace('### ', '')}</h4>;
              }
              return <p key={i}>{paragraph}</p>;
            })}
          </div>

          <div className="page-cta" style={{ marginTop: '48px' }}>
            <Link href="/blog" className="btn btn-outline">Back to Blog</Link>
          </div>
        </div>
      </main>
      <SubpageFooter />
    </div>
  );
}
