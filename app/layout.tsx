import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Inter } from "next/font/google";
import { SITE_URL } from "@/lib/seo";
import { getSiteSettings } from "@/lib/content";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const brand = settings.brand || "Enoki";
  const title = settings.seoDefaults.title || brand;
  const description = settings.seoDefaults.description || settings.tagline;
  const ogImage = settings.seoDefaults.ogImage || "/og-image.png";

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: `%s | ${brand}`,
    },
    description,
    keywords: [
      "Enoki",
      "Sui",
      "blockchain infrastructure",
      "zkLogin",
      "gas-free transactions",
      "sponsored transactions",
      "web3 wallets",
      "Sui developer tools",
    ],
    authors: [{ name: brand }],
    creator: brand,
    publisher: brand,
    applicationName: brand,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      url: SITE_URL,
      siteName: brand,
      title,
      description,
      locale: "en_US",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    icons: {
      icon: [
        { url: "/icon.png?v=3", type: "image/png", sizes: "32x32" },
        { url: "/favicon-3d.png?v=3", type: "image/png", sizes: "512x512" },
      ],
      apple: "/apple-icon.png?v=3",
    },
    manifest: "/manifest.webmanifest",
    category: "technology",
  };
}

export const viewport: Viewport = {
  themeColor: "#08090c",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} ${inter.variable}`}>
      <body className="bg-[#f4f4f6] font-sans antialiased">{children}</body>
    </html>
  );
}
