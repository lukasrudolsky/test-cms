# Nastavení Pages CMS

Tento dokument vysvětluje, jak klient (bez technických znalostí) upravuje obsah webu přes [Pages CMS](https://app.pagescms.org) — zdarma, přímo přes GitHub, bez nutnosti znát programování.

## Co bylo implementováno

- **`.pages.yml`** v kořeni projektu — konfigurace administrace pro Pages CMS. Určuje, jaká pole se klientovi zobrazí a jak se jmenují (česky, srozumitelně).
- **`content/pages/home.json`** — veškerý obsah domovské stránky (nadpisy, texty, tlačítka, statistiky, sekce Connect, SEO).
- **`content/settings/site.json`** — globální nastavení firmy (název, slogan, navigační menu, výchozí SEO).
- **`public/uploads/`** — složka, do které Pages CMS nahrává obrázky.
- Přehled toho, co je a není editovatelné, je v souboru **`CMS_CONTENT_MAP.md`**.

Podrobný popis polí najdeš v `CMS_CONTENT_MAP.md`.

## Jak to funguje (princip)

1. Klient se přihlásí na **app.pagescms.org** přes svůj GitHub účet.
2. Vybere repozitář tohoto webu.
3. Pages CMS načte `.pages.yml` a zobrazí klientovi hezký formulář (žádný kód, žádné JSON).
4. Klient upraví text/obrázek a klikne na „Uložit" (commit).
5. Pages CMS zapíše změnu přímo do GitHub repozitáře (do `content/pages/home.json` nebo `content/settings/site.json`).
6. Hosting (Vercel/Netlify/jiný), který je napojený na tento GitHub repozitář, automaticky spustí nový build a za pár desítek sekund je změna živě na webu.

Pages CMS **nemá přístup k žádnému jinému souboru** než k těm, které povoluje `.pages.yml` — nemůže tedy sáhnout na komponenty, styly, konfiguraci ani na `robots.txt`/`sitemap.xml`.

## Co je potřeba udělat ručně (mimo tento úkol)

Toto jsem já (Claude) neudělal a je potřeba to zařídit ručně, protože jde o kroky mimo repozitář nebo o kroky vyžadující přístupové údaje:

1. **Vytvořit GitHub repozitář a nahrát do něj tento projekt.**
   Lokálně jsem inicializoval git a udělal první commit (viz níže), ale repozitář **není napojený na žádný vzdálený GitHub repozitář** (žádný `origin` remote) a nic jsem nikam nepushoval. Je potřeba:
   ```bash
   git remote add origin https://github.com/<tvuj-ucet>/<nazev-repozitare>.git
   git branch -M main
   git push -u origin main
   ```

2. **Napojit hosting na GitHub repozitář** (pokud ještě není), aby se po každé změně z Pages CMS automaticky spustil nový build a nasazení (např. Vercel → „Import Git Repository").
   Protože appka čte obsah přes `fs.readFile` za běhu (ne při buildu) a má API route (`/api/telegram`), potřebuje **Node.js server runtime** (Vercel to zajišťuje automaticky) — nejde o čistě statický export.

3. **Nainstalovat GitHub aplikaci Pages CMS** do repozitáře:
   - Otevři [app.pagescms.org](https://app.pagescms.org).
   - Přihlas se přes GitHub.
   - Autorizuj přístup Pages CMS ke konkrétnímu repozitáři (doporučeno vybrat jen tento repozitář, ne všechny).

4. **(Volitelné) Nastavit vlastní doménu** v proměnné prostředí `NEXT_PUBLIC_SITE_URL` na hostingu, pokud web neběží na `https://enoki.dev`.

Nic z výše uvedeného jsem sám neprovedl (nepushoval jsem do žádného vzdáleného repozitáře, nenasazoval jsem web) — vyžaduje to tvoje přihlašovací údaje a rozhodnutí, kam přesně web nasadit.

## Jak se klient přihlásí a najde projekt

1. Klient jde na **https://app.pagescms.org**.
2. Klikne na „Sign in with GitHub" a přihlásí se svým GitHub účtem (musí mít přístup do repozitáře — buď je vlastník, nebo mu byl repozitář nasdílen jako spolupracovník).
3. Po přihlášení uvidí seznam repozitářů, ke kterým má Pages CMS přístup. Klikne na repozitář tohoto webu.
4. Zobrazí se administrace se dvěma sekcemi: **„Domovská stránka"** a **„Nastavení firmy"**.

## Jak upravit text

1. V administraci klikni na **„Domovská stránka"**.
2. Rozbal sekci, kterou chceš upravit (např. „Hero", „Sekce Connect").
3. Uprav text v poli — je to obyčejné textové pole jako ve Wordu.
4. U víceřádkových nadpisů (např. hlavní nadpis) vytvoří nový řádek v poli i nový řádek na webu.
5. Nahoře klikni na **„Save"** / **„Uložit"** — tím se změna commitne do GitHubu a spustí se nové nasazení webu.

## Jak změnit obrázek

1. Klikni na obrázkové pole (např. „Doplňkový obrázek za nadpisem").
2. Zvol „Upload" a vyber soubor ze svého počítače, nebo vyber už dříve nahraný obrázek ze seznamu.
3. Vyplň i pole „Alternativní text obrázku" — krátký popis obrázku pro nevidomé a pro vyhledávače.
4. Ulož změnu tlačítkem „Save".

Obrázky se ukládají do `public/uploads/` v repozitáři — cestu k souboru vyplňuje Pages CMS automaticky, klient nikdy nezadává žádnou technickou cestu ručně.

## Jak přidat/upravit/smazat statistiku (kartu s číslem)

1. V sekci „Domovská stránka" otevři „Statistiky a čísla".
2. Tlačítkem „Add item" přidáš novou kartu — vyplň ikonu, číslo (nebo nadpis) a popisek.
3. Existující kartu upravíš kliknutím na ni.
4. Přetažením za úchyt (obvykle ikona ≡ vlevo od položky) změníš pořadí karet.
5. Smažeš ji ikonou koše u dané položky.

Web je připravený na to, že prázdný nebo smazaný seznam statistik sekci prostě nezobrazí — nic se nerozbije.

## Jak publikovat změnu

Publikace se děje automaticky při kliknutí na „Save" v Pages CMS — commit jde rovnou do větve, na kterou je napojený hosting (typicky `main`). Během několika desítek sekund až pár minut (podle hostingu) se web sám přebuilduje a změna je vidět naživo. Žádný ruční krok navíc není potřeba.

## Jak se vrátit ke starší verzi

Protože Pages CMS ukládá každou změnu jako commit do GitHubu, historie je vždy dostupná v GitHub repozitáři:

1. Otevři repozitář na GitHub.com (přes prohlížeč).
2. Klikni na „Commits" (historie commitů) — buď na hlavní stránce repa, nebo u konkrétního souboru (`content/pages/home.json`).
3. Najdi commit před nechtěnou změnou a klikni na „..." → „Revert" (vrátí ho jako nový commit), nebo si zobraz starou verzi souboru a obsah zkopíruj zpět přes Pages CMS.

Pro netechnického klienta je nejjednodušší požádat o pomoc vývojáře při vracení verze — samotné psaní textu a nahrávání obrázků ale zvládne sám přes Pages CMS.

## Co klient nesmí upravovat

Pages CMS klientovi **vůbec nezobrazí** žádné jiné soubory než ty popsané v `.pages.yml` (obsah domovské stránky a nastavení firmy) — nemá tedy ani možnost omylem sáhnout na:

- zdrojový kód komponent (`components/`, `app/`),
- CSS a styly (`app/globals.css`, `tailwind.config.ts`),
- animace a layout,
- `robots.txt`, `sitemap.xml` (generují se automaticky ze `app/robots.ts` a `app/sitemap.ts`),
- konfiguraci buildu (`next.config.js` pokud vznikne, `package.json`),
- proměnné prostředí a přístupové údaje (ty nejsou v repozitáři vůbec).

Podrobný seznam viz `CMS_CONTENT_MAP.md`, sekce „Needitovatelný, technický obsah".
