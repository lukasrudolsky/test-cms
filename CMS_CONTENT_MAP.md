# Mapa obsahu — co je kde

Web má jednu stránku (`/`). Přehled, který obsahový soubor patří ke které komponentě a co je v Pages CMS editovatelné.

## Domovská stránka (`/`)

Obsahový soubor: **`content/pages/home.json`**
Komponenta: `app/page.tsx`
V Pages CMS sekce: **„Domovská stránka"**

| Sekce v Pages CMS | Pole v JSON | Komponenta, kde se to zobrazí | Co klient vidí v administraci |
| --- | --- | --- | --- |
| SEO a sdílení | `seo.title` | `app/page.tsx` → `generateMetadata()` | SEO titulek stránky |
| SEO a sdílení | `seo.description` | `app/page.tsx` → `generateMetadata()` | Meta popis |
| SEO a sdílení | `seo.ogImage` | `app/page.tsx` → `generateMetadata()` | Obrázek pro sdílení (Open Graph) |
| Hero | `hero.title` | `components/hero/Hero.tsx` | Hlavní nadpis |
| Hero | `hero.description` | `components/hero/Hero.tsx` | Popisný text pod nadpisem |
| Hero | `hero.primaryCta` | `components/hero/Hero.tsx` | Text hlavního tlačítka |
| Hero | `hero.secondaryCta` | `components/hero/Hero.tsx` | Text vedlejšího tlačítka |
| Hero | `hero.image` | `components/hero/Hero.tsx` | Doplňkový obrázek za nadpisem |
| Hero | `hero.imageAlt` | `components/hero/Hero.tsx` | Alternativní text obrázku |
| Statistiky a čísla | `stats[]` (seznam) | `components/stats/StatsSection.tsx` | Ikona, číslo/nadpis, popisek — lze přidat/smazat/přeuspořádat kartu |
| Sekce Connect | `connect.eyebrow` | `components/connect/ConnectSection.tsx` | Krátký štítek nad nadpisem |
| Sekce Connect | `connect.title` | `components/connect/ConnectSection.tsx` | Nadpis sekce |
| Sekce Connect | `connect.description` | `components/connect/ConnectSection.tsx` | Popisný text |
| Sekce Connect | `connect.cta` | `components/connect/ConnectSection.tsx` | Text tlačítka |
| Sekce Connect | `connect.featureOne` | `components/connect/ConnectSection.tsx` | První vlastnost |
| Sekce Connect | `connect.featureTwo` | `components/connect/ConnectSection.tsx` | Druhá vlastnost |
| Sekce Connect | `connect.screenImage` | `components/connect/ConnectSection.tsx` | Obrázek náhledu obrazovky |
| Sekce Connect | `connect.screenImageAlt` | `components/connect/ConnectSection.tsx` | Alternativní text obrázku |
| Waitlist popup | `waitlist.title` | `components/waitlist/WaitlistModal.tsx` | Nadpis popupu |
| Waitlist popup | `waitlist.description` | `components/waitlist/WaitlistModal.tsx` | Popisný text |
| Waitlist popup | `waitlist.emailPlaceholder` | `components/waitlist/WaitlistModal.tsx` | Nápověda v poli pro e-mail |
| Waitlist popup | `waitlist.buttonText` | `components/waitlist/WaitlistModal.tsx` | Text tlačítka pro odeslání |
| Waitlist popup | `waitlist.successTitle` | `components/waitlist/WaitlistModal.tsx` | Nadpis po úspěšném odeslání |
| Waitlist popup | `waitlist.successMessage` | `components/waitlist/WaitlistModal.tsx` | Text po úspěšném odeslání |

Popup se otevře po kliknutí na tlačítko „Launch Portal" v navigaci (`components/hero/Navbar.tsx`) nebo v Hero sekci (`components/hero/Hero.tsx`). Odeslaný e-mail se validuje a pošle jako notifikace přes Telegram bota (`app/api/waitlist/route.ts`), pokud jsou nastavené proměnné `TELEGRAM_BOT_TOKEN` a `TELEGRAM_ALLOWED_CHAT_ID` — jinak formulář stále funguje (zobrazí úspěch), jen bez notifikace. E-maily se nikam trvale neukládají v repozitáři (na serverless hostingu jako Vercel by se soubor stejně neuchoval mezi requesty a e-maily by neměly patřit do veřejného gitu).

## Nastavení firmy (globální, platí pro celý web)

Obsahový soubor: **`content/settings/site.json`**
Používá se v: `app/layout.tsx`, `app/manifest.ts`, `app/page.tsx` (navigace a výchozí SEO)
V Pages CMS sekce: **„Nastavení firmy"**

| Sekce v Pages CMS | Pole v JSON | Kde se používá | Co klient vidí v administraci |
| --- | --- | --- | --- |
| — | `brand` | Navigace, titulek stránky, PWA manifest | Název firmy / značky |
| — | `tagline` | PWA manifest, výchozí popis | Slogan firmy |
| Navigační menu | `nav.links[]` | `components/hero/Navbar.tsx` | Položky menu (lze přidat/smazat/přeuspořádat) |
| Navigační menu | `nav.cta` | `components/hero/Navbar.tsx` | Text tlačítka v navigaci |
| Výchozí SEO | `seoDefaults.title` | `app/layout.tsx`, záložní hodnota pro stránku | Výchozí SEO titulek |
| Výchozí SEO | `seoDefaults.description` | `app/layout.tsx`, záložní hodnota pro stránku | Výchozí meta popis |
| Výchozí SEO | `seoDefaults.ogImage` | `app/layout.tsx`, záložní hodnota pro stránku | Výchozí Open Graph obrázek |

Pokud je pole `seo.title`/`seo.description`/`seo.ogImage` na stránce prázdné, použije se automaticky hodnota z „Nastavení firmy" — klient tedy nemusí SEO pole na stránce vyplňovat, pokud mu stačí výchozí hodnoty.

## Needitovatelný, technický obsah

Tyto části **nejsou** v Pages CMS a klient by je neměl ručně upravovat — jsou to zdrojový kód, design nebo bezpečnostně/technicky citlivé věci:

| Co | Kde | Proč není v CMS |
| --- | --- | --- |
| Struktura a styl komponent, animace, layout | `components/**/*.tsx`, `app/globals.css`, `tailwind.config.ts` | Design a kód, ne obsah |
| Ikony statistik (SVG) | `components/stats/StatsSection.tsx` (`Icon`) | Technická implementace, klient vybírá jen jméno ikony ze seznamu |
| Loga burz (Binance, Coinbase, OKX, Kraken) | `components/hero/ExchangeCarousel.tsx`, `public/exchanges/*.svg` | Přesná brand loga partnerů, riziko nahrání špatného/neoprávněného loga |
| Ukázkový kód v panelu sekce Connect | `components/connect/ConnectSection.tsx` (`CodePanel`) | Dekorativní technická ukázka, ne text pro čtenáře |
| `robots.txt` | `app/robots.ts` | Technické SEO, zásah by mohl vyřadit web z vyhledávání |
| `sitemap.xml` | `app/sitemap.ts` | Technické SEO, generuje se automaticky |
| PWA manifest (barvy, ikony, `start_url`) kromě názvu/sloganu | `app/manifest.ts` | Technická konfigurace prohlížeče |
| Favicony/ikony (`icon.png`, `apple-icon.png`, `og-image.png` jako výchozí soubor) | `public/` | Vyžadují přesné rozměry a formát, měnit jen přes vývojáře |
| Environment proměnné (`NEXT_PUBLIC_SITE_URL`, `TELEGRAM_*`) | prostředí nasazení (Vercel/hosting), ne v repozitáři | Bezpečnostně citlivé, nesmí být v gitu |
| `.pages.yml` | kořen projektu | Definuje, co CMS vůbec zobrazuje — úprava = úprava administrace |
| `lib/content.ts`, `types/content.ts`, `app/api/telegram/route.ts` | zdrojový kód | Logika načítání/ukládání obsahu |

## Existující Telegram bot

Web má navíc jednoduchý Telegram bot (`app/api/telegram/route.ts`, popsáno v `TELEGRAM_CMS.md`), který umí měnit pouze `content/pages/home.json` (ne nastavení firmy). Může fungovat souběžně s Pages CMS, ale doporučujeme používat jen jeden nástroj najednou, aby nedocházelo k přepsání změn druhého — pro netechnického klienta je vhodnější Pages CMS.
