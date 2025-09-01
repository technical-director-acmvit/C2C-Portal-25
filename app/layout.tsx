import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ScrollSmootherProvider from "../components/scroll-smoother-provider";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Code2Create by ACM-VIT",
    template: "%s | Code2Create",
  },
  description:
    "Code2Create (C2C) is ACM-VIT's flagship 48-hour national hackathon hosted at VIT Vellore, India. Team up with peers, tackle real-world challenges with mentorship, and prototype impactful products across Build for Bharat, Art Attack, Game Over, I Can Do It Better, and AI Solutions — in partnership with RunPod and ElevenLabs.",
  applicationName: "Code2Create",
  authors: [{ name: "ACM-VIT" }],
  creator: "ACM-VIT",
  publisher: "ACM-VIT",
  category: "technology",
  referrer: "origin-when-cross-origin",
  keywords: [
    "Code2Create","C2C","Code 2 Create",
    "ACM-VIT","ACM VIT","ACM student chapter","VIT","VIT Vellore","Vellore Institute of Technology","Tamil Nadu","India",
    "hackathon","student hackathon","college hackathon","university hackathon","national hackathon India","national-level hackathon","48-hour hackathon","48 hour hackathon","coding marathon","programming competition","India free hackathon",
    "innovation","prototyping","prototype","real-world problems","mentorship","industry mentors","teamwork","collaboration","networking","prizes","showcase talent","demo",
    "Build for Bharat","Art Attack","Game Over","I Can Do It Better","AI Solutions",
    "AI","artificial intelligence","machine learning","ML","GPU","AI audio","text to speech","speech synthesis",
    "RunPod","ElevenLabs",
    "developer community","student developers","engineering students","open source","research",
    "web development","mobile app development","app development","game development","creative coding","product design",
  ],
  openGraph: {
    type: "website",
    url: "/",
    title: "Code2Create — ACM-VIT Hackathon",
    description:
      "ACM-VIT's flagship 48-hour national hackathon at VIT Vellore featuring tracks like Build for Bharat, Art Attack, Game Over, I Can Do It Better, and AI Solutions.",
    siteName: "Code2Create",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Code2Create by ACM-VIT",
      },
    ],
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Code2Create — ACM-VIT Hackathon",
    description:
      "Build across tracks like Build for Bharat, Art Attack, Game Over, I Can Do It Better, and AI Solutions — with partners RunPod and ElevenLabs.",
    images: ["/og.png"],
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
    <html lang="en" className="h-full overflow-x-hidden">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden min-h-screen`}
      >
        <ScrollSmootherProvider>
          {children}
        </ScrollSmootherProvider>
      </body>
    </html>
  );
}
