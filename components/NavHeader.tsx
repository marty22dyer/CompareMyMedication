"use client";

import Link from "next/link";
import Image from "next/image";

export default function NavHeader() {
  return (
    <header className="cmm-nav">
      <div className="cmm-nav__inner" style={{ justifyContent: "center" }}>
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/CompareMyMedication_logo.png"
            alt="CompareMyMedication - Compare Prescription Drug Prices"
            width={320}
            height={64}
            priority
          />
        </Link>
      </div>
    </header>
  );
}
