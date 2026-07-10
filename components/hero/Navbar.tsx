"use client";

import { useState } from "react";
import { openWaitlist } from "@/lib/waitlistStore";

type NavbarProps = {
  content: {
    brand: string;
    links: { label: string }[];
    cta: string;
  };
};

// Frosted-glass grain: a faint fractal-noise texture that reads as fine
// grain once blended over the blurred glass, instead of a flat smooth blur.
const NOISE_TEXTURE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

function LogoMark() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 19 19"
      fill="none"
      aria-hidden="true"
      className="size-6 shrink-0"
    >
      <rect x="6.4" y="1.6" width="8.2" height="3.2" rx="1.6" fill="#fff" />
      <rect x="3.1" y="5.8" width="11.5" height="3.2" rx="1.6" fill="#fff" />
      <rect x="6.4" y="10" width="8.2" height="3.2" rx="1.6" fill="#fff" />
      <circle cx="3.9" cy="3.2" r="1.55" fill="#fff" />
      <circle cx="3.9" cy="11.6" r="1.55" fill="#fff" />
      <circle cx="14.8" cy="15.8" r="1.55" fill="#fff" />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg className="size-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {open ? (
        <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
      ) : (
        <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
      )}
    </svg>
  );
}

export default function Navbar({ content }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const links = content.links ?? [];

  return (
    <header className="fixed inset-x-0 top-5 z-50 flex flex-col items-center px-4 sm:px-6">
      <nav className="relative grid h-[64px] w-full max-w-[1120px] grid-cols-[1fr_auto_1fr] items-center overflow-hidden rounded-full border border-white/10 bg-black/40 px-4 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-2xl backdrop-saturate-150 sm:px-6">
        {/* Grain texture: sits above the blur, below the content */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.22] mix-blend-overlay"
          style={{ backgroundImage: NOISE_TEXTURE }}
        />
        {/* Soft top highlight for extra glass depth */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.08] via-white/0 to-transparent" />

        <a
          href="#"
          className="relative flex h-full items-center gap-2 [grid-column:1]"
          aria-label="Enoki"
        >
          <LogoMark />
          <span className="text-[16px] font-semibold tracking-[-0.035em] text-white sm:text-[20px]">
            {content.brand}
          </span>
        </a>

        <div className="relative hidden h-full items-center justify-center gap-9 [grid-column:2] lg:flex">
          {links.map((link, index) => (
            <a
              key={`${link.label}-${index}`}
              href="#"
              className="text-[15px] font-semibold leading-[1] tracking-[-0.015em] text-white/65 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="relative ml-auto flex items-center gap-1 [grid-column:3] sm:gap-2">
          {links.length > 0 && (
            <button
              type="button"
              aria-label={open ? "Zavřít menu" : "Otevřít menu"}
              aria-expanded={open}
              onClick={() => setOpen((value) => !value)}
              className="grid size-10 shrink-0 place-items-center rounded-full text-white transition-colors hover:bg-white/10 sm:size-11 lg:hidden"
            >
              <MenuIcon open={open} />
            </button>
          )}
          <button
            type="button"
            onClick={() => openWaitlist()}
            className="flex h-10 shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-white px-3 text-[13px] font-semibold leading-[1] tracking-[-0.015em] text-[#18191c] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)] transition-colors hover:bg-white/90 sm:h-11 sm:px-6 sm:text-[15px]"
          >
            {content.cta}
          </button>
        </div>
      </nav>

      {open && links.length > 0 && (
        <div className="relative mt-2 w-full max-w-[1120px] overflow-hidden rounded-3xl border border-white/10 bg-black/80 px-6 py-4 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-2xl backdrop-saturate-150 lg:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link, index) => (
              <a
                key={`${link.label}-${index}`}
                href="#"
                onClick={() => setOpen(false)}
                className="rounded-xl px-2 py-2.5 text-[15px] font-semibold tracking-[-0.015em] text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
