'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';

type Consent = 'granted' | 'denied' | null;

export default function CookieConsent() {
  const [consent, setConsent] = useState<Consent>(null);
  const [show, setShow] = useState(false);
  const gaId = process.env.NEXT_PUBLIC_GA_ID || '';

  useEffect(() => {
    const stored = localStorage.getItem('cookie-consent');
    if (stored === 'granted' || stored === 'denied') {
      setConsent(stored);
    } else {
      setShow(true);
    }
  }, []);

  function handleAccept() {
    localStorage.setItem('cookie-consent', 'granted');
    setConsent('granted');
    setShow(false);
    // Update consent mode
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      });
    }
  }

  function handleReject() {
    localStorage.setItem('cookie-consent', 'denied');
    setConsent('denied');
    setShow(false);
  }

  return (
    <>
      {/* Consent Mode default - must load before gtag */}
      <Script id="consent-default" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            analytics_storage: '${consent === 'granted' ? 'granted' : 'denied'}',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            wait_for_update: 500,
          });
        `}
      </Script>

      {/* GA4 - loads regardless, respects consent mode */}
      {gaId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `}
          </Script>
        </>
      )}

      {/* Banner */}
      {show && (
        <div className="consent-banner">
          <div className="consent-inner">
            <p>We use cookies for analytics to understand how you use our site. No advertising. No tracking across sites.</p>
            <div className="consent-buttons">
              <button className="consent-btn consent-btn--accept" onClick={handleAccept}>Accept</button>
              <button className="consent-btn consent-btn--reject" onClick={handleReject}>Reject</button>
            </div>
            <a href="/gdpr" className="consent-link">Privacy Policy</a>
          </div>
        </div>
      )}
    </>
  );
}
