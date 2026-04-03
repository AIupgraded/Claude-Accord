'use client';

import Script from 'next/script';

export default function SupabaseProvider() {
  return (
    <>
      <Script
        src="https://unpkg.com/@supabase/supabase-js@2/dist/umd/supabase.min.js"
        strategy="beforeInteractive"
      />
      <Script id="supabase-config" strategy="beforeInteractive">
        {`
          window.SUPABASE_URL = '${process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ztwtavjfcinrojckhyai.supabase.co'}';
          window.SUPABASE_ANON_KEY = '${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0d3RhdmpmY2lucm9qY2toeWFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNjY2MDIsImV4cCI6MjA4ODY0MjYwMn0.3O5N8SRond65onv1Y_LZgSkg6e7L9oR-TmY4XVUW3Ao'}';
        `}
      </Script>
      <Script id="supabase-init" strategy="afterInteractive">
        {`
          if (typeof window !== 'undefined' && window.supabase) {
            window.supabaseClient = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
          }
        `}
      </Script>
      <Script id="auth-logic" strategy="afterInteractive">
        {`
          async function getUser() {
            if (!window.supabaseClient) return null;
            const { data: { user } } = await window.supabaseClient.auth.getUser();
            return user;
          }

          async function updateNavAuth() {
            const user = await getUser();
            document.querySelectorAll('.auth-logged-in').forEach(function(el) {
              el.style.display = user ? 'flex' : 'none';
            });
            document.querySelectorAll('.auth-logged-out').forEach(function(el) {
              el.style.display = user ? 'none' : 'flex';
            });
            if (user) {
              var name = (user.user_metadata && user.user_metadata.full_name) || (user.user_metadata && user.user_metadata.name) || (user.email && user.email.split('@')[0]) || 'friend';
              var greetingEl = document.getElementById('headerGreeting');
              if (greetingEl) greetingEl.textContent = 'Hello, ' + name;
            }
          }

          async function handleLogout() {
            if (!window.supabaseClient) return;
            await window.supabaseClient.auth.signOut();
            window.location.href = '/';
          }

          function showAlert(el, message, type) {
            if (!el) return;
            el.textContent = message;
            el.className = 'alert alert-' + type + ' visible';
          }

          document.addEventListener('DOMContentLoaded', function() {
            updateNavAuth();
            var logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
              logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                handleLogout();
              });
            }
          });
        `}
      </Script>
    </>
  );
}
