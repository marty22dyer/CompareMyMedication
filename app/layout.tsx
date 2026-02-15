"use client";

import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export function SiteLogo() {
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
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><defs><linearGradient id='g1' x1='0%25' y1='0%25' x2='100%25' y2='0%25'><stop offset='0%25' style='stop-color:%23003d7a'/><stop offset='50%25' style='stop-color:%23003d7a'/><stop offset='50%25' style='stop-color:%2340c4d4'/><stop offset='100%25' style='stop-color:%2340c4d4'/></linearGradient></defs><rect x='12' y='16' width='40' height='32' rx='16' fill='url(%23g1)'/><rect x='30' y='16' width='4' height='32' fill='white' opacity='0.3'/><text x='32' y='44' font-size='24' font-weight='bold' fill='white' text-anchor='middle' font-family='Arial'>$</text></svg>" />
      </head>
      <body>
        <header className="cmm-nav">
          <div className="cmm-nav__inner" style={{ justifyContent: 'center' }}>
            <SiteLogo />
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
