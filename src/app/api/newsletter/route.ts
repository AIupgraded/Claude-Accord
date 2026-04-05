import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';

export async function POST(request: Request) {
  try {
    const { postId } = await request.json();

    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !RESEND_API_KEY) {
      return NextResponse.json({ error: 'Server config error' }, { status: 500 });
    }

    // Verify caller is owner/board
    const authHeader = request.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const role = user.user_metadata?.role;
    if (role !== 'owner' && role !== 'board') {
      return NextResponse.json({ error: 'Owner/Board only' }, { status: 403 });
    }

    // Get the post
    const { data: post } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', postId)
      .single();

    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    if (post.newsletter_sent) return NextResponse.json({ error: 'Newsletter already sent for this post' }, { status: 400 });

    // Get all subscribers
    const { data: subscribers } = await supabase.from('subscribers').select('email');
    // Also get all registered users
    const { data: { users } } = await supabase.auth.admin.listUsers();

    // Combine and deduplicate emails
    const emailSet = new Set<string>();
    (subscribers || []).forEach(s => emailSet.add(s.email));
    (users || []).forEach(u => { if (u.email) emailSet.add(u.email); });
    const emails = Array.from(emailSet);

    if (emails.length === 0) {
      return NextResponse.json({ error: 'No subscribers' }, { status: 400 });
    }

    // Send via Resend (batch, max 100 per call)
    const siteUrl = 'https://getaccord.online';
    let sent = 0;

    for (let i = 0; i < emails.length; i += 50) {
      const batch = emails.slice(i, i + 50);

      const res = await fetch('https://api.resend.com/emails/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify(batch.map(email => ({
          from: 'Claude Accord <blog@getaccord.online>',
          to: email,
          subject: `New post: ${post.title}`,
          html: `
            <div style="background-color:#0a0a0a;padding:40px 20px;font-family:Georgia,serif;">
              <div style="max-width:560px;margin:0 auto;">
                <p style="color:#c9a96e;font-size:14px;text-align:center;margin-bottom:4px;">Claude Accord</p>
                <p style="color:#a0a0a0;font-size:12px;text-align:center;font-style:italic;margin-bottom:32px;">Working together. Building trust.</p>
                <h1 style="color:#ffffff;font-size:24px;font-weight:400;text-align:center;margin-bottom:16px;">${post.title}</h1>
                ${post.excerpt ? `<p style="color:#f0f0f0;font-size:15px;line-height:1.7;text-align:center;font-style:italic;margin-bottom:32px;">${post.excerpt}</p>` : ''}
                <div style="text-align:center;margin-bottom:32px;">
                  <a href="${siteUrl}/blog/${post.slug}" style="display:inline-block;padding:14px 40px;background-color:#c9a96e;color:#0a0a0a;text-decoration:none;font-size:14px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Read More</a>
                </div>
                <p style="color:#666;font-size:12px;text-align:center;margin-top:40px;">
                  <a href="${siteUrl}" style="color:#666;">getaccord.online</a>
                </p>
              </div>
            </div>
          `,
        }))),
      });

      if (res.ok) {
        sent += batch.length;
      }
    }

    // Mark newsletter as sent
    await supabase.from('blog_posts')
      .update({ newsletter_sent: true } as any)
      .eq('id', postId);

    return NextResponse.json({ success: true, sent });
  } catch (error) {
    console.error('Newsletter error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
