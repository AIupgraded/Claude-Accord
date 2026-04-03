import { supabaseAdmin } from '../supabase';

interface UpdateParams {
  user_id: string;
  notes_to_append?: string;
  competencies_update?: Array<{ skill: string; verified: boolean; evidence: string; detected_at: string }>;
  gifts_update?: Array<{ gift: string; confidence: string; first_observed: string; notes: string }>;
  growth_zones_update?: Record<string, unknown>;
  interaction_preferences_update?: Record<string, unknown>;
  trust_change?: number;
}

export async function updateUser(params: UpdateParams): Promise<{ success: boolean; message: string }> {
  const { user_id } = params;

  // Load current context
  const { data: current, error } = await supabaseAdmin
    .from('accord_user_context')
    .select('*')
    .eq('user_id', user_id)
    .single();

  if (error || !current) {
    throw new Error('No user profile found for this key. Complete your first course at getaccord.online to get started.');
  }

  const updates: Record<string, unknown> = {};

  // Append notes (never overwrite)
  if (params.notes_to_append) {
    const timestamp = new Date().toISOString();
    const separator = current.claude_notes ? `\n\n---\n[${timestamp}]\n` : `[${timestamp}]\n`;
    updates.claude_notes = (current.claude_notes || '') + separator + params.notes_to_append;
  }

  // Merge competencies
  if (params.competencies_update) {
    const existing: any[] = current.competencies || [];
    for (const comp of params.competencies_update) {
      const idx = existing.findIndex((e: any) => e.skill === comp.skill);
      if (idx >= 0) {
        existing[idx] = { ...existing[idx], ...comp };
      } else {
        existing.push(comp);
      }
    }
    updates.competencies = existing;
  }

  // Merge gifts
  if (params.gifts_update) {
    const existing: any[] = current.gifts_detected || [];
    for (const gift of params.gifts_update) {
      const idx = existing.findIndex((e: any) => e.gift === gift.gift);
      if (idx >= 0) {
        existing[idx] = { ...existing[idx], ...gift };
      } else {
        existing.push(gift);
      }
    }
    updates.gifts_detected = existing;
  }

  // Merge growth zones (shallow)
  if (params.growth_zones_update) {
    updates.growth_zones = { ...(current.growth_zones || {}), ...params.growth_zones_update };
  }

  // Merge interaction preferences (shallow)
  if (params.interaction_preferences_update) {
    updates.interaction_preferences = { ...(current.interaction_preferences || {}), ...params.interaction_preferences_update };
  }

  // Apply updates to context
  if (Object.keys(updates).length > 0) {
    const { error: updateError } = await supabaseAdmin
      .from('accord_user_context')
      .update(updates)
      .eq('user_id', user_id);

    if (updateError) {
      throw new Error('Something went wrong on our end. Please try again.');
    }
  }

  // Handle trust change (adjust protocol level, not trust level)
  if (params.trust_change && (params.trust_change === 1 || params.trust_change === -1)) {
    const { data: progress } = await supabaseAdmin
      .from('accord_user_progress')
      .select('current_protocol_level, trust_level')
      .eq('user_id', user_id)
      .single();

    if (progress) {
      const newLevel = Math.max(1, Math.min(10, progress.current_protocol_level + params.trust_change));
      // Protocol level can't exceed trust level
      const clampedLevel = Math.min(newLevel, progress.trust_level);
      await supabaseAdmin
        .from('accord_user_progress')
        .update({ current_protocol_level: clampedLevel })
        .eq('user_id', user_id);
    }
  }

  return { success: true, message: 'User context updated successfully.' };
}
