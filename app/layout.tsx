import type { Metadata } from "next";
import Link from "next/link";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk"
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono"
});

export const metadata: Metadata = {
  title: "Poker Coach Trainer",
  description: "Interactive No-Limit Hold'em tournament decision trainer"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
        <div className="page-shell">
          <header className="topbar">
            <div>
              <p className="brand-kicker">Tournament Learning Lab</p>
              <Link href="/" className="brand-link">
                Poker Coach Trainer
              </Link>
            </div>
            <nav className="topnav">
              <Link href="/">Dashboard</Link>
              <Link href="/learn">Learn</Link>
              <Link href="/play">Free Play</Link>
              <Link href="/review">Review</Link>
              <Link href="/library">Library</Link>
            </nav>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
