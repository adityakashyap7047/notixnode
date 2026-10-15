import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ToastProvider } from "@/components/ui/Toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://notixnode.com"),
  title: {
    default: "NOTIXNODE — Premium Minecraft Server Development Resources",
    template: "%s | NOTIXNODE",
  },
  description: "Professional Minecraft server development resources, plugin configurations, graphics, maps, developer tools, and tutorials. Build better servers with NOTIXNODE.",
  keywords: [
    "Minecraft server",
    "plugin configurations",
    "server development",
    "Minecraft resources",
    "server admin tools",
    "LuckPerms",
    "PaperMC",
    "Spigot",
    "server optimization",
  ],
  authors: [{ name: "NOTIXNODE" }],
  creator: "NOTIXNODE",
  publisher: "NOTIXNODE",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://notixnode.com",
    siteName: "NOTIXNODE",
    title: "NOTIXNODE — Premium Minecraft Server Development Resources",
    description: "Professional Minecraft server development resources, plugin configurations, graphics, maps, developer tools, and tutorials.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NOTIXNODE - Minecraft Server Development Resources",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NOTIXNODE — Premium Minecraft Server Development Resources",
    description: "Professional Minecraft server development resources, plugin configurations, graphics, maps, developer tools, and tutorials.",
    images: ["/og-image.png"],
    creator: "@notixnode",
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0B0F19" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0F19" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ToastProvider>
          <Header />
          <main id="main-content" className="flex-1 pt-16">
            {children}
          </main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}