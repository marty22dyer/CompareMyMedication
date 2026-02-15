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
        <link rel="icon" href="/CompareMyMedication Favicon.png" sizes="512x512" type="image/png" />
        <link rel="icon" href="/CompareMyMedication Favicon.png" sizes="256x256" type="image/png" />
        <link rel="icon" href="/CompareMyMedication Favicon.png" sizes="192x192" type="image/png" />
        <link rel="icon" href="/CompareMyMedication Favicon.png" sizes="128x128" type="image/png" />
        <link rel="icon" href="/CompareMyMedication Favicon.png" sizes="96x96" type="image/png" />
        <link rel="icon" href="/CompareMyMedication Favicon.png" sizes="64x64" type="image/png" />
        <link rel="icon" href="/CompareMyMedication Favicon.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/CompareMyMedication Favicon.png" sizes="512x512" type="image/png" />
        <link rel="apple-touch-icon" href="/CompareMyMedication Favicon.png" sizes="192x192" type="image/png" />
        <link rel="apple-touch-icon" href="/CompareMyMedication Favicon.png" sizes="180x180" type="image/png" />
      </head>
      <body>
        <header className="cmm-nav">
          <div className="cmm-nav__inner">
            <SiteLogo />
            <div className={`cmm-links ${isMobileMenuOpen ? 'mobile-active' : ''}`}>
              <Link href="/compare" className="cmm-link">Compare</Link>
              <Link href="/about" className="cmm-link">About</Link>
            </div>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
