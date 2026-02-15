import "./globals.css";
import Image from "next/image";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      <body className="bg-slate-100 text-slate-900">

        {/* HEADER */}
        <header className="w-full border-b bg-white shadow-sm">
          <div className="w-full px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/CompareMyMedication_logo.png"
                alt="CompareMyMedication"
                width={220}
                height={44}
                priority
              />
            </Link>

            <nav className="flex gap-6 text-sm font-medium">
              <Link href="/compare" className="hover:text-blue-600">
                Compare
              </Link>
              <Link href="/drug/wegovy" className="hover:text-blue-600">
                Browse Drugs
              </Link>
            </nav>
          </div>
        </header>

        {/* PAGE */}
        <main className="w-full">
          {children}
        </main>

      </body>
    </html>
  );
}
