'use client';

import Script from 'next/script';

export default function SupabaseProvider() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ztwtavjfcinrojckhyai.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0d3RhdmpmY2lucm9qY2toeWFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNjY2MDIsImV4cCI6MjA4ODY0MjYwMn0.3O5N8SRond65onv1Y_LZgSkg6e7L9oR-TmY4XVUW3Ao';

  return (
    <>
      <Script
        src="https://unpkg.com/@supabase/supabase-js@2/dist/umd/supabase.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          // This runs after the UMD script is fully loaded
          if (typeof window !== 'undefined' && (window as any).supabase) {
            (window as any).supabaseClient = (window as any).supabase.createClient(
              supabaseUrl,
              supabaseAnonKey
            );
            // Dispatch event so auth logic knows client is ready
            window.dispatchEvent(new Event('supabase-ready'));
          }
        }}
      />
      <Script id="auth-logic" strategy="afterInteractive">
        {`
          function initAuth() {
            if (!window.supabaseClient) return;

            // Update nav auth state
            window.supabaseClient.auth.getUser().then(function(result) {
              var user = result.data && result.data.user;
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
            });

            // Logout button
            var logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn && !logoutBtn._bound) {
              logoutBtn._bound = true;
              logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                window.supabaseClient.auth.signOut().then(function() {
                  window.location.href = '/';
                });
              });
            }
          }

          function showAlert(el, message, type) {
            if (!el) return;
            el.textContent = message;
            el.className = 'alert alert-' + type + ' visible';
          }

          // Try init immediately, and also listen for supabase-ready
          if (window.supabaseClient) {
            initAuth();
          }
          window.addEventListener('supabase-ready', initAuth);
        `}
      </Script>
    </>
  );
}
