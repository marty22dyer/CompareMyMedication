"use client";

import "./globals.css";
import "./homepage-styles.css";
import "./compare-styles.css";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import CookieConsent from "../components/CookieConsent";
import GoogleAnalytics from "../components/GoogleAnalytics";

function SiteLogo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Image
        src="/CompareMyMedication_logo.png"
        alt="CompareMyMedication"
        width={320}
        height={64}
        priority
      />
    </Link>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <html lang="en">
      <head>
        <meta name="impact-site-verification" content="59d46921-987d-46c9-baaa-658e9360b1e5" />
        <GoogleAnalytics />
      </head>
      <body>
        <header className="cmm-nav">
          <div className="cmm-nav__inner" style={{ justifyContent: 'center' }}>
            <SiteLogo />
          </div>
        </header>
        {children}
        <footer style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '40px 20px',
          marginTop: '80px',
          textAlign: 'center'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              justifyContent: 'center', 
              gap: '30px',
              marginBottom: '20px'
            }}>
              <Link href="/privacy" style={{ color: 'white', textDecoration: 'none', fontSize: '16px' }}>
                Privacy Policy
              </Link>
              <Link href="/terms" style={{ color: 'white', textDecoration: 'none', fontSize: '16px' }}>
                Terms of Service
              </Link>
              <Link href="/disclaimer" style={{ color: 'white', textDecoration: 'none', fontSize: '16px' }}>
                Medical Disclaimer
              </Link>
              <Link href="/contact" style={{ color: 'white', textDecoration: 'none', fontSize: '16px' }}>
                Contact Us
              </Link>
            </div>
            <p style={{ fontSize: '14px', opacity: 0.9, margin: '10px 0' }}>
              © 2026 CompareMyMedication by MAD Designs LLC. All rights reserved.
            </p>
            <p style={{ fontSize: '13px', opacity: 0.8, margin: '10px 0', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto' }}>
              This website provides informational content only and does not provide medical advice. 
              Always consult your healthcare provider before making medication decisions.
            </p>
          </div>
        </footer>
        <CookieConsent />
      </body>
    </html>
  );
}
