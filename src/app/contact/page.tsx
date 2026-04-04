'use client';

import { useState, useEffect, useRef } from 'react';
import SubpageHeader from '@/components/SubpageHeader';
import SubpageFooter from '@/components/SubpageFooter';

export default function ContactPage() {
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [loading, setLoading] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const msgRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const sbRef = useRef<any>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@supabase/supabase-js@2/dist/umd/supabase.min.js';
    script.onload = () => {
      const w = window as any;
      if (w.supabase) {
        sbRef.current = w.supabase.createClient(
          'https://ztwtavjfcinrojckhyai.supabase.co',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0d3RhdmpmY2lucm9qY2toeWFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNjY2MDIsImV4cCI6MjA4ODY0MjYwMn0.3O5N8SRond65onv1Y_LZgSkg6e7L9oR-TmY4XVUW3Ao'
        );
      }
    };
    document.head.appendChild(script);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    const name = nameRef.current?.value.trim();
    const email = emailRef.current?.value.trim();
    const msg = msgRef.current?.value.trim();
    if (!name || !email || !msg) { setMessage({ text: 'Please fill in all fields.', type: 'error' }); return; }
    if (!sbRef.current) { setMessage({ text: 'Loading... please try again in a moment.', type: 'error' }); return; }

    setLoading(true);
    const { error } = await sbRef.current.from('contacts').insert([{ name, email, message: msg }]);
    setLoading(false);

    if (error) { setMessage({ text: 'Something went wrong. Please try again.', type: 'error' }); return; }
    setMessage({ text: 'Message sent! We will get back to you soon.', type: 'success' });
    formRef.current?.reset();
  }

  return (
    <div className="subpage">
      <SubpageHeader activeNav="contact" />
      <main className="page-content">
        <div className="page-inner">
          <div className="form-container" style={{ maxWidth: '560px', margin: '0 auto' }}>
            <h2>Get in Touch</h2>
            <p className="subtitle">Have a question, suggestion, or partnership idea? We&apos;d love to hear from you.</p>
            {message && <div className={`alert alert-${message.type} visible`}>{message.text}</div>}
            <form onSubmit={handleSubmit} ref={formRef}>
              <div className="form-group">
                <label htmlFor="contact-name">Name</label>
                <input type="text" id="contact-name" ref={nameRef} placeholder="Your name" required />
              </div>
              <div className="form-group">
                <label htmlFor="contact-email">Email</label>
                <input type="email" id="contact-email" ref={emailRef} placeholder="you@email.com" required />
              </div>
              <div className="form-group">
                <label htmlFor="contact-message">Message</label>
                <textarea id="contact-message" ref={msgRef} placeholder="How can we help?" required></textarea>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </main>
      <SubpageFooter />
    </div>
  );
}
