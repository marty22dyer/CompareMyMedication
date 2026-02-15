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
        <link rel="icon" href="/favicon.png" type="image/png" />
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
