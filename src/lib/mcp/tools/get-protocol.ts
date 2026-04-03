import { supabaseAdmin } from '../supabase';
import type { ProtocolLevel } from '../types';

export async function getProtocol(level: number): Promise<ProtocolLevel> {
  if (level < 1 || level > 10) {
    throw new Error('Level must be between 1 and 10.');
  }

  const { data, error } = await supabaseAdmin
    .from('accord_levels')
    .select('level, name, description, protocol_text')
    .eq('level', level)
    .single();

  if (error || !data) {
    throw new Error(`Protocol level ${level} not found.`);
  }

  return data;
}
