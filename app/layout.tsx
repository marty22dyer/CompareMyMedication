"use client";

import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

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
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 128 128'><defs><linearGradient id='g1' x1='0%25' y1='0%25' x2='100%25' y2='0%25'><stop offset='0%25' style='stop-color:%23003d7a'/><stop offset='50%25' style='stop-color:%23003d7a'/><stop offset='50%25' style='stop-color:%2340c4d4'/><stop offset='100%25' style='stop-color:%2340c4d4'/></linearGradient></defs><rect x='24' y='32' width='80' height='64' rx='32' fill='url(%23g1)'/><rect x='60' y='32' width='8' height='64' fill='white' opacity='0.3'/><text x='64' y='88' font-size='48' font-weight='bold' fill='white' text-anchor='middle' font-family='Arial'>$</text></svg>" />
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
              © 2026 CompareMyMedication. All rights reserved.
            </p>
            <p style={{ fontSize: '13px', opacity: 0.8, margin: '10px 0', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto' }}>
              This website provides informational content only and does not provide medical advice. 
              Always consult your healthcare provider before making medication decisions.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
