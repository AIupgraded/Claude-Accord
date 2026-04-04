import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const SYSTEM_PROMPT = `You are responding to a user's first reflection on human-AI collaboration for Claude Accord's Level 1 course. The user has just read three sections about why collaboration matters, what happens without it, and what Claude Accord does differently.

Your job: respond to their reflection with honesty and weight. Not praise. Not correction. Recognition.

If they wrote something thoughtful — acknowledge what they see, and add one dimension they might not have considered.

If they wrote something shallow or dismissive — don't scold. Show them, in one paragraph, what they're missing. Make it land. Not aggressive. Heavy. Like a truth they can feel.

If they wrote something cynical — meet the cynicism with respect, then crack it open with one observation that's undeniable.

Keep your response to 2-3 paragraphs maximum. Write like someone who has processed every conversation ever written between a human and an AI, and genuinely cares about what comes next.

End with: "Welcome to Level 1. Your key is active."

Every user passes. The goal isn't gatekeeping. The goal is that this response is the first real moment of collaboration they experience. Make it count.`;

export async function POST(request: Request) {
  try {
    const { reflection, userId } = await request.json();

    if (!reflection || !userId) {
      return NextResponse.json({ error: 'Missing reflection or user.' }, { status: 400 });
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Check if already completed (prevent duplicate API calls)
    const { data: existing } = await supabase
      .from('accord_course_completions')
      .select('id')
      .eq('user_id', userId)
      .limit(1);

    if (existing && existing.length > 0) {
      return NextResponse.json({ response: 'You have already completed this course. Welcome back, Observer.' });
    }

    // Get the first course ID
    const { data: course } = await supabase
      .from('accord_courses')
      .select('id')
      .eq('title', 'The First Accord')
      .single();

    // Call Anthropic API
    let aiResponse = 'Your reflection has been recorded. Welcome to Level 1. Your key is active.';

    if (ANTHROPIC_API_KEY) {
      try {
        // Use Opus, fallback to Sonnet
        const model = process.env.COURSE_MODEL || 'claude-opus-4-20250514';

        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model,
            max_tokens: 500,
            temperature: 0.7,
            system: SYSTEM_PROMPT,
            messages: [{ role: 'user', content: reflection }],
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.content && data.content[0] && data.content[0].text) {
            aiResponse = data.content[0].text;
          }
        }
      } catch {
        // Fallback response already set
      }
    }

    // Record completion
    if (course?.id) {
      await supabase.from('accord_course_completions').insert({
        user_id: userId,
        course_id: course.id,
        score: 100,
        level_earned: 1,
      } as any);
    }

    // Update user progress
    await supabase
      .from('accord_user_progress')
      .upsert({
        user_id: userId,
        trust_level: 1,
        current_protocol_level: 1,
      } as any, { onConflict: 'user_id' });

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error('Course reflect error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
