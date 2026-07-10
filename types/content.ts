export type StatCardContent = {
  icon: "network" | "card" | "shield" | "scan" | "check" | "nodes";
  value?: string;
  title?: string;
  label: string;
};

export type SeoFields = {
  title?: string;
  description?: string;
  ogImage?: string;
};

export type WaitlistContent = {
  title: string;
  description: string;
  emailPlaceholder: string;
  buttonText: string;
  successTitle: string;
  successMessage: string;
};

export type HomeContent = {
  seo: SeoFields;
  hero: {
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    image?: string;
    imageAlt?: string;
  };
  stats: StatCardContent[];
  connect: {
    eyebrow: string;
    title: string;
    description: string;
    cta: string;
    featureOne: string;
    featureTwo: string;
    screenImage?: string;
    screenImageAlt?: string;
  };
  waitlist: WaitlistContent;
};

export type NavLink = {
  label: string;
};

export type SiteSettings = {
  brand: string;
  tagline: string;
  nav: {
    links: NavLink[];
    cta: string;
  };
  seoDefaults: {
    title: string;
    description: string;
    ogImage: string;
  };
};
