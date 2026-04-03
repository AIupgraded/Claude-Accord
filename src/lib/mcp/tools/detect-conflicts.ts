import { supabaseAdmin } from '../supabase';

interface ConflictParams {
  user_id: string;
  conflict_description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export async function detectConflicts(params: ConflictParams): Promise<{ conflict_id: string; is_new: boolean }> {
  // Check for existing unresolved duplicate
  const { data: existing } = await supabaseAdmin
    .from('accord_preference_conflicts')
    .select('id')
    .eq('user_id', params.user_id)
    .eq('conflict_description', params.conflict_description)
    .neq('resolution_status', 'resolved')
    .maybeSingle();

  if (existing) {
    return { conflict_id: existing.id, is_new: false };
  }

  const { data, error } = await supabaseAdmin
    .from('accord_preference_conflicts')
    .insert({
      user_id: params.user_id,
      conflict_description: params.conflict_description,
      severity: params.severity,
      resolution_status: 'detected',
    })
    .select('id')
    .single();

  if (error || !data) {
    throw new Error('Something went wrong on our end. Please try again.');
  }

  return { conflict_id: data.id, is_new: true };
}
