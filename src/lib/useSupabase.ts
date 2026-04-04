'use client';

import { useEffect, useRef, useState } from 'react';

const SUPABASE_URL = 'https://ztwtavjfcinrojckhyai.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0d3RhdmpmY2lucm9qY2toeWFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNjY2MDIsImV4cCI6MjA4ODY0MjYwMn0.3O5N8SRond65onv1Y_LZgSkg6e7L9oR-TmY4XVUW3Ao';

export function useSupabase() {
  const sbRef = useRef<any>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    function init() {
      const w = window as any;
      if (w.supabase && !sbRef.current) {
        sbRef.current = w.supabaseClient || w.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        w.supabaseClient = sbRef.current;
        setReady(true);
      }
    }

    // Already loaded from another page/component
    if ((window as any).supabase) {
      init();
      return;
    }

    // Check if script tag already exists
    const existing = document.querySelector('script[src*="supabase"]');
    if (existing) {
      // Script exists but maybe still loading
      existing.addEventListener('load', init);
      // Also poll in case load already fired
      const interval = setInterval(() => {
        if ((window as any).supabase) { init(); clearInterval(interval); }
      }, 100);
      return () => clearInterval(interval);
    }

    // Load fresh
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@supabase/supabase-js@2/dist/umd/supabase.min.js';
    script.onload = init;
    document.head.appendChild(script);
  }, []);

  return { sb: sbRef, ready };
}
