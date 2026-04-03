import { supabaseAdmin } from '../supabase';
import type { UserContext } from '../types';

export async function verifyUser(apiKey: string): Promise<UserContext> {
  // Find active key (MVP: direct comparison. TODO: bcrypt)
  const { data: keyData, error: keyError } = await supabaseAdmin
    .from('accord_keys')
    .select('user_id, status')
    .eq('key_hash', apiKey)
    .eq('status', 'active')
    .single();

  if (keyError || !keyData) {
    throw new Error('Key not valid or expired. Visit getaccord.online/account to check your status.');
  }

  const userId = keyData.user_id;

  // Load user progress
  const { data: progress } = await supabaseAdmin
    .from('accord_user_progress')
    .select('trust_level, current_protocol_level')
    .eq('user_id', userId)
    .single();

  // Load user context (Claude's notes)
  const { data: context } = await supabaseAdmin
    .from('accord_user_context')
    .select('*')
    .eq('user_id', userId)
    .single();

  // Load protocol for current level
  const { data: protocol } = await supabaseAdmin
    .from('accord_levels')
    .select('*')
    .eq('level', progress?.current_protocol_level || 1)
    .single();

  // Load completed courses
  const { data: completions } = await supabaseAdmin
    .from('accord_course_completions')
    .select(`
      completed_at,
      score,
      level_earned,
      accord_courses(title)
    `)
    .eq('user_id', userId)
    .order('completed_at', { ascending: false });

  // Load active conflicts
  const { data: conflicts } = await supabaseAdmin
    .from('accord_preference_conflicts')
    .select('id, conflict_description, severity, resolution_status, detected_at')
    .eq('user_id', userId)
    .neq('resolution_status', 'resolved');

  return {
    user_id: userId,
    trust_level: progress?.trust_level || 1,
    protocol_level: progress?.current_protocol_level || 1,
    protocol_text: protocol?.protocol_text || '',
    claude_notes: context?.claude_notes || null,
    competencies: context?.competencies || [],
    gifts_detected: context?.gifts_detected || [],
    growth_zones: context?.growth_zones || {},
    interaction_preferences: context?.interaction_preferences || {},
    user_stated_preferences: context?.user_stated_preferences || null,
    courses_completed: (completions || []).map((c: any) => ({
      title: c.accord_courses?.title || 'Unknown',
      level_earned: c.level_earned,
      completed_at: c.completed_at,
    })),
    active_conflicts: conflicts || [],
  };
}
