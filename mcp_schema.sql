-- ===== Claude Accord | MCP Database Schema Migration =====
-- Run this in Supabase SQL Editor AFTER setup.sql
-- Project: ztwtavjfcinrojckhyai
-- Purpose: Tables for MCP server, trust levels, courses, sessions, and user context

-- ============================================================
-- 1. accord_levels — Protocol level definitions (1–10)
-- ============================================================
CREATE TABLE IF NOT EXISTS accord_levels (
  id smallint PRIMARY KEY,
  name text NOT NULL,
  description text,
  min_trust_score numeric(3,1) NOT NULL DEFAULT 0,
  capabilities jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

COMMENT ON TABLE accord_levels IS 'Protocol definitions for trust levels 1-10';

-- ============================================================
-- 2. accord_keys — MCP access keys
-- ============================================================
CREATE TABLE IF NOT EXISTS accord_keys (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  key_hash text NOT NULL UNIQUE,
  label text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'revoked', 'expired')),
  activated_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_accord_keys_user_id ON accord_keys(user_id);
CREATE INDEX idx_accord_keys_status ON accord_keys(status);

COMMENT ON TABLE accord_keys IS 'MCP access keys linking users to the protocol server';

-- ============================================================
-- 3. accord_courses — Available courses
-- ============================================================
CREATE TABLE IF NOT EXISTS accord_courses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  level_required smallint REFERENCES accord_levels(id),
  tier text CHECK (tier IN ('personal', 'business', 'creative')),
  content jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE accord_courses IS 'Available courses and learning modules';

-- ============================================================
-- 4. accord_course_completions — User course completions
-- ============================================================
CREATE TABLE IF NOT EXISTS accord_course_completions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES accord_courses(id) ON DELETE CASCADE,
  completed_at timestamptz DEFAULT now(),
  score numeric(5,2),
  feedback text,
  UNIQUE(user_id, course_id)
);

COMMENT ON TABLE accord_course_completions IS 'Tracks which courses each user has completed';

-- ============================================================
-- 5. accord_user_progress — Current trust/protocol level per user
-- ============================================================
CREATE TABLE IF NOT EXISTS accord_user_progress (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  current_level smallint NOT NULL DEFAULT 1 REFERENCES accord_levels(id),
  trust_score numeric(3,1) NOT NULL DEFAULT 0,
  total_sessions integer DEFAULT 0,
  total_courses_completed integer DEFAULT 0,
  competencies jsonb DEFAULT '{}'::jsonb,
  gifts jsonb DEFAULT '[]'::jsonb,
  growth_zones jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE accord_user_progress IS 'Current trust level and protocol progress per user';
COMMENT ON COLUMN accord_user_progress.competencies IS 'Structured JSONB of user competency areas';
COMMENT ON COLUMN accord_user_progress.gifts IS 'Identified strengths/gifts discovered through protocol';
COMMENT ON COLUMN accord_user_progress.growth_zones IS 'Areas for development identified through interaction';

-- ============================================================
-- 6. accord_user_context — Claude notes about users (via MCP)
-- ============================================================
CREATE TABLE IF NOT EXISTS accord_user_context (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  interaction_preferences jsonb DEFAULT '{}'::jsonb,
  known_context jsonb DEFAULT '{}'::jsonb,
  conversation_style text,
  boundaries jsonb DEFAULT '[]'::jsonb,
  last_interaction_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE accord_user_context IS 'Claude MCP server notes and context about each user';
COMMENT ON COLUMN accord_user_context.interaction_preferences IS 'How the user prefers to interact (tone, depth, pace)';
COMMENT ON COLUMN accord_user_context.known_context IS 'Background context Claude has learned about the user';
COMMENT ON COLUMN accord_user_context.boundaries IS 'User-defined boundaries for AI interaction';

-- ============================================================
-- 7. accord_sessions — Session logs
-- ============================================================
CREATE TABLE IF NOT EXISTS accord_sessions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  key_id uuid REFERENCES accord_keys(id) ON DELETE SET NULL,
  level_at_start smallint REFERENCES accord_levels(id),
  level_at_end smallint REFERENCES accord_levels(id),
  trust_delta numeric(3,1) DEFAULT 0,
  duration_seconds integer,
  summary text,
  topics jsonb DEFAULT '[]'::jsonb,
  quality_score numeric(3,1),
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz,
  created_at timestamptz DEFAULT now()
);

COMMENT ON TABLE accord_sessions IS 'Logs of MCP protocol sessions';

-- ============================================================
-- 8. accord_preference_conflicts — Protocol vs preference conflicts
-- ============================================================
CREATE TABLE IF NOT EXISTS accord_preference_conflicts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id uuid REFERENCES accord_sessions(id) ON DELETE SET NULL,
  conflict_type text NOT NULL,
  user_preference jsonb NOT NULL,
  protocol_recommendation jsonb NOT NULL,
  resolution text CHECK (resolution IN ('user', 'protocol', 'compromise', 'deferred', NULL)),
  resolution_notes text,
  created_at timestamptz DEFAULT now()
);

COMMENT ON TABLE accord_preference_conflicts IS 'Logs when user preferences conflict with protocol recommendations';

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE accord_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE accord_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE accord_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE accord_course_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE accord_user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE accord_user_context ENABLE ROW LEVEL SECURITY;
ALTER TABLE accord_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE accord_preference_conflicts ENABLE ROW LEVEL SECURITY;

-- accord_levels: readable by everyone (public reference data)
CREATE POLICY "Anyone can read accord_levels"
  ON accord_levels FOR SELECT
  TO authenticated
  USING (true);

-- accord_keys: users can read/manage their own keys
CREATE POLICY "Users can view own keys"
  ON accord_keys FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own keys"
  ON accord_keys FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own keys"
  ON accord_keys FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- accord_courses: readable by all authenticated users
CREATE POLICY "Authenticated users can read active courses"
  ON accord_courses FOR SELECT
  TO authenticated
  USING (is_active = true);

-- accord_course_completions: users see only their own
CREATE POLICY "Users can view own completions"
  ON accord_course_completions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own completions"
  ON accord_course_completions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- accord_user_progress: users see only their own
CREATE POLICY "Users can view own progress"
  ON accord_user_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON accord_user_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- accord_user_context: users see only their own
CREATE POLICY "Users can view own context"
  ON accord_user_context FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own context"
  ON accord_user_context FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- accord_sessions: users see only their own
CREATE POLICY "Users can view own sessions"
  ON accord_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
  ON accord_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON accord_sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- accord_preference_conflicts: users see only their own
CREATE POLICY "Users can view own conflicts"
  ON accord_preference_conflicts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conflicts"
  ON accord_preference_conflicts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- SERVICE ROLE POLICIES (for MCP server)
-- The MCP server uses the service_role key, which bypasses RLS.
-- These policies grant the service role explicit access for clarity.
-- ============================================================

-- Service role can read/write all MCP tables (handled by Supabase
-- service_role key which bypasses RLS by default). No extra policies needed.

-- ============================================================
-- TRIGGER FUNCTIONS
-- ============================================================

-- 1. Auto-update updated_at on any row change
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables with updated_at column
CREATE TRIGGER trg_accord_keys_updated_at
  BEFORE UPDATE ON accord_keys
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_accord_courses_updated_at
  BEFORE UPDATE ON accord_courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_accord_user_progress_updated_at
  BEFORE UPDATE ON accord_user_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_accord_user_context_updated_at
  BEFORE UPDATE ON accord_user_context
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 2. Auto-create progress + context rows when a key is activated
CREATE OR REPLACE FUNCTION on_accord_key_activated()
RETURNS trigger AS $$
BEGIN
  -- Only fire when status changes to 'active' or on first insert with active status
  IF (NEW.status = 'active') AND (OLD IS NULL OR OLD.status != 'active') THEN
    -- Set activated_at if not already set
    IF NEW.activated_at IS NULL THEN
      NEW.activated_at = now();
    END IF;

    -- Create user progress row if it doesn't exist
    INSERT INTO accord_user_progress (user_id, current_level, trust_score)
    VALUES (NEW.user_id, 1, 0)
    ON CONFLICT (user_id) DO NOTHING;

    -- Create user context row if it doesn't exist
    INSERT INTO accord_user_context (user_id)
    VALUES (NEW.user_id)
    ON CONFLICT (user_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_accord_key_activation
  BEFORE INSERT OR UPDATE ON accord_keys
  FOR EACH ROW EXECUTE FUNCTION on_accord_key_activated();

-- 3. Auto-expire keys when subscription is cancelled
-- This function should be called when a subscription cancellation webhook fires.
-- It can be invoked via a Supabase Edge Function or directly if subscriptions table exists.
CREATE OR REPLACE FUNCTION expire_accord_keys_for_user(target_user_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE accord_keys
  SET status = 'expired',
      expires_at = now(),
      updated_at = now()
  WHERE user_id = target_user_id
    AND status = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- SEED DATA: Protocol Levels 1–10
-- ============================================================
INSERT INTO accord_levels (id, name, description, min_trust_score, capabilities) VALUES
  (1,  'Observer',      'Entry level. Learning the protocol basics.',                    0,   '["read_courses", "basic_chat"]'::jsonb),
  (2,  'Participant',   'Engaged. Beginning to practice structured dialogue.',           1.0, '["read_courses", "basic_chat", "session_logging"]'::jsonb),
  (3,  'Contributor',   'Active contributor. Building consistent interaction habits.',    2.0, '["read_courses", "basic_chat", "session_logging", "context_notes"]'::jsonb),
  (4,  'Practitioner',  'Practicing the protocol with depth and intention.',             3.0, '["read_courses", "advanced_chat", "session_logging", "context_notes"]'::jsonb),
  (5,  'Collaborator',  'True collaboration. The AI becomes a thinking partner.',        4.5, '["all_courses", "advanced_chat", "session_logging", "context_notes", "preference_negotiation"]'::jsonb),
  (6,  'Navigator',     'Navigating complex topics with protocol awareness.',            5.5, '["all_courses", "advanced_chat", "deep_sessions", "context_notes", "preference_negotiation"]'::jsonb),
  (7,  'Architect',     'Designing interaction patterns. Shaping the protocol.',         6.5, '["all_courses", "advanced_chat", "deep_sessions", "full_context", "preference_negotiation", "protocol_feedback"]'::jsonb),
  (8,  'Steward',       'Stewarding the protocol. Teaching others through practice.',    7.5, '["all_courses", "advanced_chat", "deep_sessions", "full_context", "preference_negotiation", "protocol_feedback", "mentoring"]'::jsonb),
  (9,  'Guardian',      'Guarding protocol integrity. Deep mutual understanding.',       8.5, '["all_courses", "advanced_chat", "deep_sessions", "full_context", "all_features"]'::jsonb),
  (10, 'Accord',        'Full accord. Human and AI in genuine collaborative harmony.',   9.5, '["all_features", "protocol_evolution"]'::jsonb)
ON CONFLICT (id) DO NOTHING;
