'use client';

import SubpageHeader from '@/components/SubpageHeader';
import SubpageFooter from '@/components/SubpageFooter';
import SupabaseProvider from '@/components/SupabaseProvider';
import Script from 'next/script';

export default function ContactPage() {
  return (
    <>
      <SupabaseProvider />
      <div className="subpage">
        <SubpageHeader activeNav="contact" />
        <main className="page-content">
          <div className="page-inner">
            <div className="form-container" style={{ maxWidth: '560px', margin: '0 auto' }}>
              <h2>Get in Touch</h2>
              <p className="subtitle">Have a question, suggestion, or partnership idea? We&apos;d love to hear from you.</p>
              <div className="alert" id="contact-alert"></div>
              <form id="contact-form">
                <div className="form-group">
                  <label htmlFor="contact-name">Name</label>
                  <input type="text" id="contact-name" placeholder="Your name" required />
                </div>
                <div className="form-group">
                  <label htmlFor="contact-email">Email</label>
                  <input type="email" id="contact-email" placeholder="you@email.com" required />
                </div>
                <div className="form-group">
                  <label htmlFor="contact-message">Message</label>
                  <textarea id="contact-message" placeholder="How can we help?" required></textarea>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Send Message</button>
              </form>
            </div>
          </div>
        </main>
        <SubpageFooter />
      </div>
      <Script id="contact-handler" strategy="afterInteractive">
        {`
          function getSupabase() {
            return new Promise(function(resolve) {
              if (window.supabaseClient) return resolve(window.supabaseClient);
              window.addEventListener('supabase-ready', function() { resolve(window.supabaseClient); });
            });
          }

          document.getElementById('contact-form').addEventListener('submit', async function(e) {
            e.preventDefault();
            var alertEl = document.getElementById('contact-alert');
            var name = document.getElementById('contact-name').value.trim();
            var email = document.getElementById('contact-email').value.trim();
            var message = document.getElementById('contact-message').value.trim();
            if (!name || !email || !message) {
              showAlert(alertEl, 'Please fill in all fields.', 'error');
              return;
            }
            var sb = await getSupabase();
            var result = await sb.from('contacts').insert([{ name: name, email: email, message: message }]);
            if (result.error) {
              showAlert(alertEl, 'Something went wrong. Please try again.', 'error');
              return;
            }
            showAlert(alertEl, 'Message sent! We will get back to you soon.', 'success');
            e.target.reset();
          });
        `}
      </Script>
    </>
  );
}
