"use client";

import { useState } from "react";
import { openWaitlist } from "@/lib/waitlistStore";
import { GLASS_NOISE_TEXTURE } from "@/lib/uiTextures";

type NavbarProps = {
  content: {
    brand: string;
    links: { label: string }[];
    cta: string;
  };
};

function LogoMark() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
      className="size-7 shrink-0"
    >
      <rect x="2.5" y="2.5" width="23" height="23" rx="8" fill="#10131F" />
      <rect x="3.5" y="3.5" width="21" height="21" rx="7" stroke="url(#logo-ring)" strokeWidth="2" />
      <path
        d="M7.4 9.35A2.35 2.35 0 0 1 9.75 7h9.05a2.35 2.35 0 1 1 0 4.7h-6.7v.9h5.05a2.35 2.35 0 1 1 0 4.7H12.1v.9h6.7a2.35 2.35 0 1 1 0 4.7H9.75a2.35 2.35 0 0 1-2.35-2.35V9.35Z"
        fill="url(#logo-mark)"
      />
      <circle cx="8.4" cy="14" r="1.95" fill="#7CF7D4" />
      <circle cx="19" cy="7" r="1.15" fill="#FFB66E" />
      <circle cx="19" cy="21" r="1.15" fill="#8F8CFF" />
      <defs>
        <linearGradient id="logo-ring" x1="4" y1="4" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7CF7D4" />
          <stop offset="0.5" stopColor="#8F8CFF" />
          <stop offset="1" stopColor="#FFB66E" />
        </linearGradient>
        <linearGradient id="logo-mark" x1="8" y1="8" x2="20" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="0.65" stopColor="#EAF0FF" />
          <stop offset="1" stopColor="#A7F3E5" />
        </linearGradient>
      </defs>
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
      <nav className="relative grid h-[64px] w-full max-w-[1120px] grid-cols-[1fr_auto_1fr] items-center overflow-hidden rounded-full border border-white/10 bg-black/40 px-4 shadow-[0_1px_2px_rgba(0,0,0,0.08),0_10px_24px_rgba(0,0,0,0.08)] backdrop-blur-2xl backdrop-saturate-150 sm:px-6">
        {/* Grain texture: sits above the blur, below the content */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.22] mix-blend-overlay"
          style={{ backgroundImage: GLASS_NOISE_TEXTURE }}
        />
        {/* Soft top highlight for extra glass depth */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.08] via-white/0 to-transparent" />

        <a
          href="#"
          className="relative flex h-full items-center gap-2 [grid-column:1]"
          aria-label={content.brand}
        >
          <LogoMark />
          <span className="text-[16px] font-semibold tracking-normal text-white sm:text-[20px]">
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
              aria-label={open ? "ZavĹ™Ă­t menu" : "OtevĹ™Ă­t menu"}
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
        <div className="relative mt-2 w-full max-w-[1120px] overflow-hidden rounded-3xl border border-white/10 bg-black/80 px-6 py-4 shadow-[0_1px_2px_rgba(0,0,0,0.08),0_10px_24px_rgba(0,0,0,0.08)] backdrop-blur-2xl backdrop-saturate-150 lg:hidden">
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
