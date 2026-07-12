import type { Metadata } from "next";
import Navbar from "@/components/hero/Navbar";
import Hero from "@/components/hero/Hero";
import StatsSection from "@/components/stats/StatsSection";
import ConnectSection from "@/components/connect/ConnectSection";
import Footer from "@/components/footer/Footer";
import WaitlistModal from "@/components/waitlist/WaitlistModal";
import { getHomeContent, getSiteSettings } from "@/lib/content";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const [content, settings] = await Promise.all([getHomeContent(), getSiteSettings()]);

  const title = content.seo.title || settings.seoDefaults.title;
  const description = content.seo.description || settings.seoDefaults.description;
  const ogImage = content.seo.ogImage || settings.seoDefaults.ogImage || "/og-image.png";

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: "/" },
    openGraph: {
      title,
      description,
      url: SITE_URL,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: { title, description, images: [ogImage] },
  };
}

export default async function Home() {
  const [content, settings] = await Promise.all([getHomeContent(), getSiteSettings()]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.brand,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.png`,
    description: content.hero.description.replace(/\n/g, " "),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar
        content={{ brand: settings.brand, links: settings.nav.links, cta: settings.nav.cta }}
        variant="darkSurface"
      />
      <Hero content={content.hero} image={content.hero.image} imageAlt={content.hero.imageAlt} />
      <StatsSection cards={content.stats} />
      <ConnectSection
        content={content.connect}
        screenImage={content.connect.screenImage}
        screenImageAlt={content.connect.screenImageAlt}
      />
      <Footer brand={settings.brand} />
      <WaitlistModal content={content.waitlist} />
    </main>
  );
}
