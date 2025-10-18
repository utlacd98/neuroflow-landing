import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FOCUSYNC - AI-Powered Focus & Brainwave Companion | Adaptive Soundscapes",
  description:
    "Boost focus, calm, and memory through adaptive AI soundscapes that respond to your typing rhythm and activity. Experience Flow Mode, Calm Mode, and Energize Mode for peak productivity.",
  keywords: [
    "focus app",
    "AI soundscapes",
    "productivity tool",
    "brainwave entrainment",
    "adaptive audio",
    "concentration app",
    "meditation app",
    "focus music",
    "work from home productivity",
    "deep work",
  ],
  authors: [{ name: "App Harbour Studios" }],
  creator: "App Harbour Studios",
  publisher: "FOCUSYNC",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://focusync.app",
    title: "FOCUSYNC - AI-Powered Focus & Brainwave Companion",
    description:
      "Boost focus, calm, and memory through adaptive AI soundscapes that respond to your typing rhythm and activity.",
    siteName: "FOCUSYNC",
    images: [
      {
        url: "/modern-dashboard-with-waveform-visualization-and-f.jpg",
        width: 1200,
        height: 630,
        alt: "FOCUSYNC Dashboard - AI-Powered Focus Technology",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FOCUSYNC - AI-Powered Focus & Brainwave Companion",
    description: "Boost focus, calm, and memory through adaptive AI soundscapes that respond to your typing rhythm.",
    images: ["/modern-dashboard-with-waveform-visualization-and-f.jpg"],
    creator: "@focusync",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
  alternates: {
    canonical: "https://focusync.app",
  },
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#14b8a6" />
      </head>
      <body className={`${inter.className} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
