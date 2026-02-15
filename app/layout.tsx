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
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 128 128'><defs><linearGradient id='g1' x1='0%25' y1='0%25' x2='100%25' y2='0%25'><stop offset='0%25' style='stop-color:%23003d7a'/><stop offset='50%25' style='stop-color:%23003d7a'/><stop offset='50%25' style='stop-color:%2340c4d4'/><stop offset='100%25' style='stop-color:%2340c4d4'/></linearGradient></defs><rect x='24' y='32' width='80' height='64' rx='32' fill='url(%23g1)'/><rect x='60' y='32' width='8' height='64' fill='white' opacity='0.3'/><text x='64' y='88' font-size='48' font-weight='bold' fill='white' text-anchor='middle' font-family='Arial'>$</text></svg>" />
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
