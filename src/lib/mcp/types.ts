export interface UserContext {
  user_id: string;
  trust_level: number;
  protocol_level: number;
  protocol_text: string;
  claude_notes: string | null;
  competencies: Competency[];
  gifts_detected: Gift[];
  growth_zones: GrowthZones;
  interaction_preferences: Record<string, unknown>;
  user_stated_preferences: string | null;
  courses_completed: CourseCompletion[];
  active_conflicts: Conflict[];
}

export interface Competency {
  skill: string;
  verified: boolean;
  evidence: string;
  detected_at: string;
}

export interface Gift {
  gift: string;
  confidence: 'low' | 'medium' | 'high';
  first_observed: string;
  notes: string;
}

export interface GrowthZones {
  current_focus?: string;
  progressing?: string[];
  regressing?: string[];
  last_assessed?: string;
}

export interface CourseCompletion {
  title: string;
  level_earned: number;
  completed_at: string;
}

export interface Conflict {
  id: string;
  conflict_description: string;
  severity: string;
  resolution_status: string;
  detected_at: string;
}

export interface ProtocolLevel {
  level: number;
  name: string;
  description: string;
  protocol_text: string;
}
