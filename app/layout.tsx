import type { Metadata } from "next";
import { IBM_Plex_Sans_Thai } from "next/font/google";
import "./globals.css";

// GraphikTH (primary, DESIGN.md §6) is referenced by family name in --font-sans.
// When the licensed font files are available, load it with next/font/local here
// and expose it as --font-graphik, then prepend var(--font-graphik) to --font-sans.
const plexSansThai = IBM_Plex_Sans_Thai({
  variable: "--font-plex-thai",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Create Skill Dersign",
  description: "Next.js + shadcn/ui + Tailwind v4 with Figma design tokens",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${plexSansThai.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
