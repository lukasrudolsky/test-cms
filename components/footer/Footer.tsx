import { SITE_URL } from "@/lib/seo";

const NAV_LINKS = ["Features", "For Devs", "Platform", "Usecases", "Pricing"];
const SOCIAL_LINKS = ["Twitter/X", "Discord", "GitHub"];
const PAGE_LINKS = ["Docs", "Terms of Service", "Privacy Policy"];

function DiscordIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8.5 15.5c3 1.4 4 1.4 7 0M8.8 9.3c2.6-.7 3.8-.7 6.4 0M6.5 6.8C10 5.1 14 5.1 17.5 6.8c1.7 3 2 6.7 1.5 10-1.6.8-3.2 1.3-4.8 1.6l-.7-1.4M6.5 6.8c-1.7 3-2 6.7-1.5 10 1.6.8 3.2 1.3 4.8 1.6l.7-1.4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9.2" cy="12.3" r="1" fill="currentColor" />
      <circle cx="14.8" cy="12.3" r="1" fill="currentColor" />
    </svg>
  );
}

function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h3 className="text-[14px] font-semibold text-[#08090c]">{title}</h3>
      <ul className="mt-4 flex flex-col gap-2.5">
        {links.map((label) => (
          <li key={label}>
            <a
              href="#"
              className="text-[14px] text-[#5b5b66] transition-colors hover:text-[#7357ff]"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer({ brand = "Enoki" }: { brand?: string }) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-white pt-20">
      <div className="mx-auto flex w-full max-w-[1120px] flex-wrap justify-between gap-16 px-5">
        <div className="max-w-[320px]">
          <div className="flex items-center gap-2.5">
            <img src="/brand/logo-mark.svg" alt="" width={36} height={36} className="size-9 shrink-0" />
            <span className="text-[19px] font-extrabold uppercase tracking-tight text-[#08090c]">
              {brand}
            </span>
          </div>

          <div className="mt-5 h-px w-full bg-black/10" />

          <p className="mt-5 text-[14px] leading-[1.6] text-[#5b5b66]">
            Simple APIs to add wallets, gas-free transactions and zkLogin to any Sui
            application.
          </p>

          <div className="mt-6 flex items-center gap-2.5">
            <a
              href={SITE_URL}
              className="flex h-11 items-center gap-1.5 rounded-full bg-[#08090c] px-5 text-[14px] font-semibold text-white transition-transform hover:-translate-y-px"
            >
              Become a Creator
              <svg className="size-3.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M7 17 17 7M9 7h8v8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a
              href="#"
              aria-label="Discord"
              className="grid size-11 shrink-0 place-items-center rounded-full bg-[#08090c] text-white transition-transform hover:-translate-y-px"
            >
              <DiscordIcon />
            </a>
          </div>
        </div>

        <div className="flex flex-wrap gap-16">
          <FooterColumn title="Navigation" links={NAV_LINKS} />
          <FooterColumn title="Socials" links={SOCIAL_LINKS} />
          <FooterColumn title="Pages" links={PAGE_LINKS} />
        </div>
      </div>

      <div className="footer-gradient relative mt-0 h-[300px] overflow-hidden rounded-b-[6px]">
        <div className="pointer-events-none absolute inset-x-0 bottom-[78px] flex justify-center overflow-hidden">
          <span
            aria-hidden="true"
            className="select-none whitespace-nowrap text-[92px] font-extrabold uppercase leading-none tracking-tight text-white/35 sm:text-[124px] lg:text-[148px]"
          >
            {brand}
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10">
          <div className="mx-auto max-w-[1120px] border-t border-white/20 px-5 py-6">
            <div className="flex flex-wrap items-center justify-between gap-2 text-[13px] text-white/80">
              <span>
                {brand} &copy; {year}
              </span>
              <span>All rights reserved.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
