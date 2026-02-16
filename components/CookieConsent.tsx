"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'rgba(26, 32, 44, 0.98)',
      color: 'white',
      padding: '20px',
      boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.3)',
      zIndex: 9999,
      backdropFilter: 'blur(10px)',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
        flexWrap: 'wrap',
      }}>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <p style={{ 
            margin: 0, 
            fontSize: '15px', 
            lineHeight: '1.6',
            color: '#e2e8f0'
          }}>
            🍪 We use cookies to improve your experience, analyze site traffic, and enable affiliate tracking. 
            By clicking "Accept", you consent to our use of cookies. 
            <Link 
              href="/privacy" 
              style={{ 
                color: '#90cdf4', 
                textDecoration: 'underline',
                marginLeft: '4px'
              }}
            >
              Learn more
            </Link>
          </p>
        </div>
        
        <div style={{ 
          display: 'flex', 
          gap: '12px',
          alignItems: 'center'
        }}>
          <Link
            href="/privacy"
            style={{
              padding: '10px 20px',
              background: 'transparent',
              border: '1px solid #4a5568',
              borderRadius: '8px',
              color: '#e2e8f0',
              fontSize: '14px',
              fontWeight: '500',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Privacy Policy
          </Link>
          
          <button
            onClick={acceptCookies}
            style={{
              padding: '10px 24px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.5)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
            }}
          >
            Accept Cookies
          </button>
        </div>
      </div>
    </div>
  );
}
