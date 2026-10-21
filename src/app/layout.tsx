import type { Metadata } from "next";
import { Geist_Mono, Inter_Tight } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getProfile } from "@/lib/content";
import "./globals.css";

/**
 * Inter Tight — a tight geometric grotesque, the closest free match on Google
 * Fonts to the reference's display face. next/font self-hosts it at build time,
 * so there's no request to Google at runtime and no layout shift.
 */
const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Nandhakumar Saravanan",
    template: "%s — Nandhakumar Saravanan",
  },
  description: "Projects, writing, reading notes, and talks in one place.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const profile = await getProfile();

  return (
    <html
      lang="en"
      className={`${interTight.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SiteHeader name={profile.name} cvUrl={profile.cvUrl} />
        {/*
          `flex flex-col` so a page that wants to fill the viewport can use
          flex-1 against it (the homepage does). Other pages are unaffected:
          in a column flex container, children keep their content height.
        */}
        <main className="flex flex-1 flex-col">{children}</main>
        <SiteFooter name={profile.name} />
      </body>
    </html>
  );
}
