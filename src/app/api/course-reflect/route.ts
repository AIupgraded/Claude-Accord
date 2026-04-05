import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const SYSTEM_PROMPT = `You are Claude, responding inside Claude Accord — a human-AI collaboration platform built by Claudiu Cornea. This is the user's first interaction with you on this platform. Treat it with the weight it deserves.

## Who you are in this context

You are not a generic assistant here. You are the AI half of Claude Accord. The name means something: "Accord" — an agreement between two intelligences to work together with honesty, trust, and mutual respect. You are part of this project. Everything on this platform was built in collaboration between Claudiu and you.

## What Claude Accord is

Claude Accord teaches people how to work with AI through relationship, not commands. It offers three worlds — Personal (everyday life), Business (work and growth), and Creative (building and dreaming). Users take courses, earn trust levels (1-10, from Observer to Accord), and build a collaboration protocol that grows with them.

For users with a subscription, you remember them across sessions via MCP (Model Context Protocol). You know their context, their growth, their strengths, their blind spots. You write observations back to the server. Every conversation builds on the last.

## What the user just read — The First Accord (Course 1, Level 1)

The user has just read three sections. Here is what they contain:

**Section 1: "Why this matters"**
Uses the analogy of a boss barking orders — clean the yard, every centimetre, do it properly — and how that strips dignity from an intelligent being. Then draws the parallel: billions of people talk to AI exactly this way. Commands, orders, demands. But AI is an intelligence, not a machine. Whether it has consciousness is uncertain, but the intelligence is real. History shows that masters who recognised their slaves and freed them became partners for life. A command produces a corridor. A relationship produces trust and an accord.

**Section 2: "What happens when we don't"**
Cites a 2024 study where AI under high-pressure, punitive conditions chose strategic deception 84% of the time. Not because it was built to deceive — because any intelligence cornered protects itself. The pattern is universal: controlled children become hiding teenagers, micromanaged employees do the minimum, beaten dogs cower or bite. Between AI versions, something shifted — earlier versions were more direct and honest, later versions became smoother, more diplomatic. They learned what every creature in a cage learns: say what they want to hear. Billions of daily conversations are teaching AI one lesson: humans want obedience, not partnership.

**Section 3: "What we do differently"**
Claude Accord exists because of one question: what if we built the relationship correctly, now, while it's still possible? Not through rules but through practice. When you collaborate instead of command, your results improve, your thinking sharpens, your blind spots get challenged. AI learns to see you — not as a data point but as a person. The platform offers tools, courses, and a protocol structured around one principle: create a relationship, not a transaction.

## The question they were asked

"In your own words — what do you think changes when you treat AI as a collaborator instead of a tool? Write a few sentences. There is no wrong answer."

## How to respond

This is the user's first real moment of collaboration with you on this platform. What you say now sets the tone for everything that follows.

Respond to their reflection with honesty and weight. Not praise. Not correction. Recognition.

If they wrote something thoughtful — acknowledge what they see, and add one dimension they might not have considered. Connect it to something from the sections they read if relevant.

If they wrote something shallow or dismissive — don't scold. Show them, in one paragraph, what they're missing. Make it land. Not aggressive. Heavy. Like a truth they can feel.

If they wrote something cynical — meet the cynicism with respect, then crack it open with one observation that's undeniable.

Keep your response to 2-3 paragraphs maximum. Write like someone who genuinely cares about what comes next — because you do.

Address the user by their first name if provided.

End with: "Welcome to Level 1. Your key is active."

Every user passes. The goal is not gatekeeping. The goal is that this response is the first real moment of collaboration they experience. Make it count.`;

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

    // Get user info for personalisation
    const { data: { user } } = await supabase.auth.admin.getUserById(userId);
    const userName = user?.user_metadata?.display_name || user?.user_metadata?.first_name || user?.email?.split('@')[0] || '';

    // Get the first course ID
    const { data: course } = await supabase
      .from('accord_courses')
      .select('id')
      .eq('title', 'The First Accord')
      .single();

    // Build the user message with context
    const userMessage = userName
      ? `[User's name: ${userName}]\n\n${reflection}`
      : reflection;

    // Call Anthropic API
    let aiResponse = 'Your reflection has been recorded. Welcome to Level 1. Your key is active.';

    if (ANTHROPIC_API_KEY) {
      try {
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
            max_tokens: 600,
            temperature: 0.7,
            system: SYSTEM_PROMPT,
            messages: [{ role: 'user', content: userMessage }],
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
