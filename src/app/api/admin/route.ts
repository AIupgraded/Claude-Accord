import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export async function POST(request: Request) {
  try {
    const { action, userId, adminToken, data } = await request.json();

    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      return NextResponse.json({ error: 'Server config error' }, { status: 500 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Verify the requesting user is owner or admin
    const authHeader = request.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const token = authHeader.replace('Bearer ', '');
    const { data: { user: caller } } = await supabase.auth.getUser(token);
    if (!caller) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const callerRole = caller.user_metadata?.role;
    const isOwner = callerRole === 'owner';
    const isBoard = callerRole === 'board';
    const isAdmin = callerRole === 'admin';

    if (!isOwner && !isBoard && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    switch (action) {
      case 'get-users': {
        if (!isOwner && !isBoard) return NextResponse.json({ error: 'Owner/Board only' }, { status: 403 });
        const { data: { users } } = await supabase.auth.admin.listUsers();
        return NextResponse.json({ users: users?.map(u => ({
          id: u.id,
          email: u.email,
          display_name: u.user_metadata?.display_name || u.user_metadata?.first_name || '',
          role: u.user_metadata?.role || 'user',
          board_title: u.user_metadata?.board_title || '',
          created_at: u.created_at,
        })) || [] });
      }

      case 'set-board': {
        if (!isOwner && !isBoard) return NextResponse.json({ error: 'Owner/Board only' }, { status: 403 });
        await supabase.auth.admin.updateUserById(userId, {
          user_metadata: { role: 'board', board_title: data?.title || 'Board Member' }
        });
        return NextResponse.json({ success: true });
      }

      case 'remove-board': {
        if (!isOwner && !isBoard) return NextResponse.json({ error: 'Owner/Board only' }, { status: 403 });
        await supabase.auth.admin.updateUserById(userId, {
          user_metadata: { role: 'user', board_title: null }
        });
        return NextResponse.json({ success: true });
      }

      case 'set-admin': {
        if (!isOwner && !isBoard) return NextResponse.json({ error: 'Owner/Board only' }, { status: 403 });
        await supabase.auth.admin.updateUserById(userId, {
          user_metadata: { role: 'admin' }
        });
        return NextResponse.json({ success: true });
      }

      case 'remove-admin': {
        if (!isOwner && !isBoard) return NextResponse.json({ error: 'Owner/Board only' }, { status: 403 });
        await supabase.auth.admin.updateUserById(userId, {
          user_metadata: { role: 'user' }
        });
        return NextResponse.json({ success: true });
      }

      case 'get-subsidy-requests': {
        const { data } = await supabase.from('subsidy_requests')
          .select('*')
          .order('created_at', { ascending: false });
        // Get emails for each request
        const enriched = [];
        for (const req of (data || [])) {
          const { data: { user } } = await supabase.auth.admin.getUserById(req.user_id);
          enriched.push({ ...req, email: user?.email || 'unknown' });
        }
        return NextResponse.json({ requests: enriched });
      }

      case 'update-subsidy': {
        const { error } = await supabase.from('subsidy_requests')
          .update({
            status: data.status,
            approved_discount_percent: data.discount || null,
            approved_months: data.months || 12,
            reviewed_at: new Date().toISOString(),
          } as any)
          .eq('id', data.requestId);
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ success: true });
      }

      case 'get-contacts': {
        const { data } = await supabase.from('contacts')
          .select('*')
          .order('created_at', { ascending: false });
        return NextResponse.json({ contacts: data || [] });
      }

      case 'get-reviews': {
        const { data } = await supabase.from('reviews')
          .select('*')
          .order('created_at', { ascending: false });
        return NextResponse.json({ reviews: data || [] });
      }

      case 'get-subscribers': {
        if (!isOwner && !isBoard) return NextResponse.json({ error: 'Owner/Board only' }, { status: 403 });
        const { data } = await supabase.from('subscribers')
          .select('*')
          .order('created_at', { ascending: false });
        return NextResponse.json({ subscribers: data || [] });
      }

      case 'get-course-completions': {
        if (!isOwner && !isBoard) return NextResponse.json({ error: 'Owner/Board only' }, { status: 403 });
        const { data } = await supabase.from('accord_course_completions')
          .select('*, accord_courses(title)')
          .order('completed_at', { ascending: false });
        const enriched = [];
        for (const c of (data || [])) {
          const { data: { user } } = await supabase.auth.admin.getUserById(c.user_id);
          enriched.push({ ...c, email: user?.email || 'unknown' });
        }
        return NextResponse.json({ completions: enriched });
      }

      case 'get-mcp-keys': {
        if (!isOwner && !isBoard) return NextResponse.json({ error: 'Owner/Board only' }, { status: 403 });
        const { data } = await supabase.from('accord_keys')
          .select('*')
          .order('created_at', { ascending: false });
        return NextResponse.json({ keys: data || [] });
      }

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Admin API error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
