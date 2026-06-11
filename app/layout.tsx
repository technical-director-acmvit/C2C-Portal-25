import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ModalProvider } from "@/components/register-modal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://c2c.acmvit.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Code2Create by ACM-VIT",
    template: "%s | Code2Create",
  },
  description:
    "Code2Create (C2C) is ACM-VIT's flagship 48-hour national hackathon hosted at VIT Vellore, India. Team up with peers, tackle real-world challenges with mentorship, and prototype impactful products across Digital Dawn, Art Attack, Game Over, I Can Do It Better, and AI Solutions — in partnership with RunPod and ElevenLabs.",
  applicationName: "Code2Create",
  authors: [{ name: "ACM-VIT" }],
  creator: "ACM-VIT",
  publisher: "ACM-VIT",
  category: "technology",
  referrer: "origin-when-cross-origin",
  keywords: [
    "Code2Create",
    "C2C",
    "Code 2 Create",
    "ACM-VIT",
    "ACM VIT",
    "ACM student chapter",
    "VIT",
    "VIT Vellore",
    "Vellore Institute of Technology",
    "Tamil Nadu",
    "India",
    "hackathon",
    "student hackathon",
    "college hackathon",
    "university hackathon",
    "national hackathon India",
    "national-level hackathon",
    "48-hour hackathon",
    "48 hour hackathon",
    "coding marathon",
    "programming competition",
    "India free hackathon",
    "innovation",
    "prototyping",
    "prototype",
    "real-world problems",
    "mentorship",
    "industry mentors",
    "teamwork",
    "collaboration",
    "networking",
    "prizes",
    "showcase talent",
    "demo",
    "Digital Dawn",
    "Art Attack",
    "Game Over",
    "I Can Do It Better",
    "AI Solutions",
    "AI",
    "artificial intelligence",
    "machine learning",
    "ML",
    "GPU",
    "AI audio",
    "text to speech",
    "speech synthesis",
    "RunPod",
    "ElevenLabs",
    "developer community",
    "student developers",
    "engineering students",
    "open source",
    "research",
    "web development",
    "mobile app development",
    "app development",
    "game development",
    "creative coding",
    "product design",
  ],
  openGraph: {
    type: "website",
    url: "/",
    title: "Code2Create - ACM-VIT Hackathon",
    description:
      "ACM-VIT's flagship 48-hour national hackathon at VIT Vellore featuring tracks like Digital Dawn, Art Attack, Game Over, I Can Do It Better, and AI Solutions.",
    siteName: "Code2Create",
    images: [
      {
        url: "/opengraph.png",
        width: 1200,
        height: 630,
        alt: "Code2Create by ACM-VIT",
      },
    ],
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Code2Create - ACM-VIT Hackathon",
    description:
      "Build across tracks like Digital Dawn, Art Attack, Game Over, I Can Do It Better, and AI Solutions - with partners RunPod and ElevenLabs.",
    images: ["/opengraph.png"],
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="min-h-full overflow-x-hidden overflow-y-auto">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-[100svh] overflow-x-hidden overflow-y-auto touch-pan-y`}
      >
        {/* Shared SVG distortion filter for the liquid-glass treatment used
         * by the navbar and the See upcoming / Pre-register CTAs. */}
        <svg
          aria-hidden="true"
          focusable="false"
          width="0"
          height="0"
          style={{ position: "absolute", width: 0, height: 0, pointerEvents: "none" }}
        >
          <defs>
            <filter id="c2c-liquid-glass" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.008 0.008"
                numOctaves="2"
                seed="92"
                result="noise"
              />
              <feGaussianBlur in="noise" stdDeviation="2" result="softNoise" />
              <feDisplacementMap
                in="SourceGraphic"
                in2="softNoise"
                scale="60"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
        </svg>
        <ModalProvider>{children}</ModalProvider>
      </body>
    </html>
  );
}
