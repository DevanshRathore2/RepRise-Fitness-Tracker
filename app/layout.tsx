import type { Metadata } from "next";
import { Space_Grotesk, Plus_Jakarta_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { CloudSyncManager } from "@/components/auth/CloudSyncManager";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "RepRise | Precision Calorie, Macro & Workout Intelligence",
  description:
    "Master your body composition with calibrated nutrition tracking, smart macro breakdowns, and progressive strength logs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`dark ${spaceGrotesk.variable} ${plusJakartaSans.variable}`}
      >
        <body className="min-h-screen bg-canvas text-ink font-sans antialiased overflow-x-hidden selection:bg-primary/30 selection:text-white">
          <CloudSyncManager />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
