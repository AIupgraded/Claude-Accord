'use client';

import { useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ztwtavjfcinrojckhyai.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0d3RhdmpmY2lucm9qY2toeWFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNjY2MDIsImV4cCI6MjA4ODY0MjYwMn0.3O5N8SRond65onv1Y_LZgSkg6e7L9oR-TmY4XVUW3Ao';

let client: ReturnType<typeof createClient> | null = null;

function getClient() {
  if (!client) {
    client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return client;
}

export function useSupabase() {
  const sb = useMemo(() => getClient(), []);
  return sb;
}
