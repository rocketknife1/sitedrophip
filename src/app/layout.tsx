import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Schibsted_Grotesk } from "next/font/google";

import { CartSheet } from "@/components/cart/cart-sheet";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { DemoBanner } from "@/components/layout/demo-banner";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { site } from "@/data/site";
import "./globals.css";

const schibsted = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name}: desk and home-office gear`, template: `%s | ${site.name}` },
  description: site.description,
  openGraph: { siteName: site.name, type: "website" },
  // Keep the demo store out of search results.
  robots: site.demoMode ? { index: false, follow: false } : undefined,
};

export const viewport: Viewport = {
  themeColor: "#143427",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${schibsted.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-card focus:px-3 focus:py-2"
        >
          Skip to content
        </a>
        <AnnouncementBar />
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <CartSheet />
        {site.demoMode && <DemoBanner />}
        {process.env.NEXT_PUBLIC_STATIC_PREVIEW !== "true" && <Analytics />}
      </body>
    </html>
  );
}
