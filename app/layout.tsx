import "./globals.css";
import "./homepage-styles.css";
import "./compare-styles.css";
import type { Metadata } from "next";
import Link from "next/link";
import NavHeader from "../components/NavHeader";
import CookieConsent from "../components/CookieConsent";
import GoogleAnalytics from "../components/GoogleAnalytics";

export const metadata: Metadata = {
  metadataBase: new URL("https://comparemymedication.com"),
  title: {
    default: "Compare Prescription Drug Prices & Alternatives | CompareMyMedication",
    template: "%s | CompareMyMedication",
  },
  description:
    "Compare 238+ prescription medications side-by-side. Find cheaper alternatives, check real prices, review side effects and effectiveness — all backed by FDA data. Free, no sign-up required.",
  keywords: [
    "compare medications",
    "prescription drug prices",
    "drug alternatives",
    "medication comparison",
    "cheap prescriptions",
    "generic drugs",
    "FDA drug information",
    "drug side effects",
    "prescription savings",
  ],
  authors: [{ name: "CompareMyMedication" }],
  creator: "MAD Designs LLC",
  publisher: "CompareMyMedication",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    siteName: "CompareMyMedication",
    title: "Compare Prescription Drug Prices & Alternatives",
    description:
      "Compare 238+ prescription medications side-by-side. Find cheaper alternatives, check real prices — backed by FDA data.",
    url: "https://comparemymedication.com",
    images: [{ url: "/CompareMyMedication_logo.png", width: 320, height: 64, alt: "CompareMyMedication" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Compare Prescription Drug Prices & Alternatives",
    description: "Compare 238+ medications side-by-side. Find cheaper alternatives backed by FDA data.",
  },
  alternates: {
    canonical: "https://comparemymedication.com",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="impact-site-verification" content="59d46921-987d-46c9-baaa-658e9360b1e5" />
        <GoogleAnalytics />
      </head>
      <body>
        <NavHeader />
        {children}
        <footer style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          padding: "40px 20px",
          marginTop: "80px",
          textAlign: "center",
        }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "30px", marginBottom: "20px" }}>
              <Link href="/privacy" style={{ color: "white", textDecoration: "none", fontSize: "16px" }}>Privacy Policy</Link>
              <Link href="/terms" style={{ color: "white", textDecoration: "none", fontSize: "16px" }}>Terms of Service</Link>
              <Link href="/disclaimer" style={{ color: "white", textDecoration: "none", fontSize: "16px" }}>Medical Disclaimer</Link>
              <Link href="/contact" style={{ color: "white", textDecoration: "none", fontSize: "16px" }}>Contact Us</Link>
            </div>
            <p style={{ fontSize: "14px", opacity: 0.9, margin: "10px 0" }}>
              © 2026 CompareMyMedication by MAD Designs LLC. All rights reserved.
            </p>
            <p style={{ fontSize: "13px", opacity: 0.8, margin: "10px 0", maxWidth: "800px", marginLeft: "auto", marginRight: "auto" }}>
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
