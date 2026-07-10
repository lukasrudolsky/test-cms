import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/content";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await getSiteSettings();
  const brand = settings.brand || "Enoki";
  const tagline = settings.tagline || "";

  return {
    name: tagline ? `${brand} — ${tagline}` : brand,
    short_name: brand,
    description: tagline,
    start_url: "/",
    display: "standalone",
    background_color: "#f4f4f6",
    theme_color: "#08090c",
    icons: [
      { src: "/icon.png", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
