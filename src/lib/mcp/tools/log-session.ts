import { supabaseAdmin } from '../supabase';

interface SessionParams {
  user_id: string;
  summary: string;
  trust_change: number;
  observations_added?: string;
  protocol_level_used: number;
}

export async function logSession(params: SessionParams): Promise<{ session_id: string }> {
  const { data, error } = await supabaseAdmin
    .from('accord_sessions')
    .insert({
      user_id: params.user_id,
      summary: params.summary,
      trust_change: params.trust_change,
      observations_added: params.observations_added || null,
      protocol_level_used: params.protocol_level_used,
      started_at: new Date().toISOString(),
    })
    .select('id')
    .single();

  if (error || !data) {
    throw new Error('Something went wrong on our end. Please try again.');
  }

  return { session_id: data.id };
}
