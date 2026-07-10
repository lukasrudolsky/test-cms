import { promises as fs } from "fs";
import path from "path";
import type { HomeContent, SiteSettings } from "@/types/content";

const homeContentPath = path.join(process.cwd(), "content", "pages", "home.json");
const siteSettingsPath = path.join(process.cwd(), "content", "settings", "site.json");

const DEFAULT_HOME_CONTENT: HomeContent = {
  seo: {},
  hero: { title: "", description: "", primaryCta: "", secondaryCta: "" },
  stats: [],
  connect: { eyebrow: "", title: "", description: "", cta: "", featureOne: "", featureTwo: "" },
};

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  brand: "",
  tagline: "",
  nav: { links: [], cta: "" },
  seoDefaults: { title: "", description: "", ogImage: "" },
};

export async function getHomeContent(): Promise<HomeContent> {
  try {
    const raw = await fs.readFile(homeContentPath, "utf8");
    const parsed = JSON.parse(raw) as Partial<HomeContent>;
    return {
      ...DEFAULT_HOME_CONTENT,
      ...parsed,
      seo: { ...DEFAULT_HOME_CONTENT.seo, ...parsed.seo },
      hero: { ...DEFAULT_HOME_CONTENT.hero, ...parsed.hero },
      stats: Array.isArray(parsed.stats) ? parsed.stats : [],
      connect: { ...DEFAULT_HOME_CONTENT.connect, ...parsed.connect },
    };
  } catch {
    return DEFAULT_HOME_CONTENT;
  }
}

export async function saveHomeContent(content: HomeContent) {
  await fs.writeFile(homeContentPath, `${JSON.stringify(content, null, 2)}\n`, "utf8");
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const raw = await fs.readFile(siteSettingsPath, "utf8");
    const parsed = JSON.parse(raw) as Partial<SiteSettings>;
    return {
      ...DEFAULT_SITE_SETTINGS,
      ...parsed,
      nav: {
        links: Array.isArray(parsed.nav?.links) ? parsed.nav.links : [],
        cta: parsed.nav?.cta ?? "",
      },
      seoDefaults: { ...DEFAULT_SITE_SETTINGS.seoDefaults, ...parsed.seoDefaults },
    };
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}

export function getField(content: HomeContent, key: string): unknown {
  return key.split(".").reduce<unknown>((current, segment) => {
    if (current == null) return undefined;
    if (Array.isArray(current)) return current[Number(segment)];
    if (typeof current !== "object") return undefined;
    return (current as Record<string, unknown>)[segment];
  }, content);
}

export function setField(content: HomeContent, key: string, value: string): boolean {
  const parts = key.split(".");
  const last = parts.pop();
  if (!last) return false;

  let target: unknown = content;
  for (const segment of parts) {
    if (target == null) return false;
    target = Array.isArray(target)
      ? target[Number(segment)]
      : (target as Record<string, unknown>)[segment];
  }

  if (target == null || typeof target !== "object") return false;

  const container = target as Record<string, unknown>;
  if (!(last in container)) return false;

  const current = container[last];
  if (Array.isArray(current)) {
    container[last] = value
      .split("|")
      .map((item) => item.trim())
      .filter(Boolean);
    return true;
  }

  if (typeof current !== "string") return false;
  container[last] = value.replaceAll("\\n", "\n");
  return true;
}

export function listEditableFields(content: HomeContent) {
  const fields: string[] = [];

  function walk(value: unknown, prefix: string) {
    if (Array.isArray(value)) {
      value.forEach((item, index) => walk(item, `${prefix}.${index}`));
      return;
    }

    if (value && typeof value === "object") {
      for (const [key, child] of Object.entries(value)) {
        walk(child, prefix ? `${prefix}.${key}` : key);
      }
      return;
    }

    if (typeof value === "string") fields.push(prefix);
  }

  walk(content, "");
  return fields;
}
