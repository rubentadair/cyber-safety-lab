// app/layout.tsx
// Root layout — wraps every page with the ethics banner and footer.
//
// NEW IN THIS VERSION:
// 1. `title` is now a template. Pages that set their own title (like the
//    activity pages now do) render as e.g. "Spot the Phish — Cyber Safety
//    Lab" in the browser tab and in Google results. Pages that don't set
//    one fall back to the default.
// 2. `openGraph` metadata — when someone shares your link on WhatsApp,
//    Discord, LinkedIn etc., the preview card shows a proper title and
//    description instead of a bare URL.
// 3. Preconnect hints for Google Fonts — the browser opens its connection
//    to the font servers immediately, in parallel with loading the CSS,
//    instead of discovering the fonts late and fetching them in series.
//    Small change, faster first paint. (React 19 automatically hoists
//    these <link> tags into <head> for us.)

import type { Metadata } from "next";
import "./globals.css";
import EthicsBanner from "@/components/EthicsBanner";
import SiteFooter   from "@/components/SiteFooter";

const siteDescription =
  "Hands-on cybersecurity rooms. Investigate breaches, spot phishing, and think like a defender — all with fictional examples.";

export const metadata: Metadata = {
  title: {
    default: "Cyber Safety Lab",          // used by pages with no title of their own
    template: "%s — Cyber Safety Lab",    // %s is replaced by each page's title
  },
  description: siteDescription,
  openGraph: {
    title: "Cyber Safety Lab",
    description: siteDescription,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Font preconnects — hoisted to <head> by React automatically.
            crossOrigin is required for the font-file domain (gstatic). */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Thin responsible-use notice at the very top */}
        <EthicsBanner />

        {/* Page content — each route fills this */}
        <main>{children}</main>

        {/* Footer on every page */}
        <SiteFooter />
      </body>
    </html>
  );
}
