"use client";

import { useState } from "react";
import { openWaitlist } from "@/lib/waitlistStore";
import { GLASS_NOISE_TEXTURE } from "@/lib/uiTextures";

type NavbarVariant = "lightSurface" | "darkSurface";

type NavbarProps = {
  content: {
    brand: string;
    links: { label: string }[];
    cta: string;
  };
  variant?: NavbarVariant;
};

function cn(...classes: Array<string | false>) {
  return classes.filter(Boolean).join(" ");
}

function LogoMark({ variant }: { variant: NavbarVariant }) {
  return (
    <img
      src={variant === "darkSurface" ? "/brand/logo-light.svg" : "/brand/logo-mark.svg"}
      width="32"
      height="32"
      alt=""
      aria-hidden="true"
      className="size-7 shrink-0 sm:size-8"
    />
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

export default function Navbar({ content, variant = "darkSurface" }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const links = content.links ?? [];
  const isDarkSurface = variant === "darkSurface";

  return (
    <header className="fixed inset-x-0 top-5 z-50 flex flex-col items-center px-4 sm:px-6">
      <nav
        className={cn(
          "relative grid h-[56px] w-full max-w-[1120px] grid-cols-[1fr_auto_1fr] items-center overflow-hidden rounded-full px-4 shadow-[0_12px_36px_rgba(0,0,0,0.12)] sm:h-[58px] sm:px-5",
          isDarkSurface
            ? "border border-white/10 bg-[#0a0a0a]"
            : "border border-black/10 bg-white/85 backdrop-blur-2xl"
        )}
      >
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 mix-blend-overlay",
            isDarkSurface ? "opacity-[0.22]" : "opacity-[0.08]"
          )}
          style={{ backgroundImage: GLASS_NOISE_TEXTURE }}
        />
        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-gradient-to-b via-transparent to-transparent",
            isDarkSurface ? "from-white/[0.08]" : "from-white/70"
          )}
        />

        <a
          href="#"
          className="relative flex h-full items-center gap-2 [grid-column:1]"
          aria-label={content.brand}
        >
          <LogoMark variant={variant} />
          <span
            className={cn(
              "text-[16px] font-semibold tracking-normal sm:text-[19px]",
              isDarkSurface ? "text-white" : "text-[#08090c]"
            )}
          >
            {content.brand}
          </span>
        </a>

        <div className="absolute left-1/2 top-1/2 hidden h-full -translate-x-1/2 -translate-y-1/2 items-center gap-8 lg:flex">
          {links.map((link, index) => (
            <a
              key={`${link.label}-${index}`}
              href="#"
              className={cn(
                "text-[14px] font-semibold leading-[1] tracking-[-0.015em] transition-colors",
                isDarkSurface ? "text-white/65 hover:text-white" : "text-[#5b5b66] hover:text-[#08090c]"
              )}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="relative ml-auto flex items-center gap-1 [grid-column:3] sm:gap-2">
          {links.length > 0 && (
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((value) => !value)}
              className={cn(
                "grid size-10 shrink-0 place-items-center rounded-full transition-colors lg:hidden",
                isDarkSurface ? "text-white hover:bg-white/10" : "text-[#08090c] hover:bg-black/5"
              )}
            >
              <MenuIcon open={open} />
            </button>
          )}
          <button
            type="button"
            onClick={() => openWaitlist()}
            className={cn(
              "relative flex h-10 shrink-0 items-center justify-center whitespace-nowrap rounded-full px-3 text-center text-[13px] font-semibold leading-[1] tracking-[-0.015em] transition-[transform,box-shadow] duration-200 sm:px-5 sm:text-[14px]",
              isDarkSurface
                ? "btn-plastic-light bg-white text-[#18191c]"
                : "bg-[#08090c] text-white shadow-[0_10px_24px_rgba(0,0,0,0.16)] hover:-translate-y-px"
            )}
          >
            <span className="relative z-10">{content.cta}</span>
          </button>
        </div>
      </nav>

      {open && links.length > 0 && (
        <div
          className={cn(
            "relative mt-2 w-full max-w-[1120px] overflow-hidden rounded-3xl px-6 py-4 shadow-[0_1px_2px_rgba(0,0,0,0.08),0_10px_24px_rgba(0,0,0,0.08)] backdrop-blur-2xl backdrop-saturate-150 lg:hidden",
            isDarkSurface ? "border border-white/10 bg-black/80" : "border border-black/10 bg-white/90"
          )}
        >
          <div className="flex flex-col gap-1">
            {links.map((link, index) => (
              <a
                key={`${link.label}-${index}`}
                href="#"
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-xl px-2 py-2.5 text-[15px] font-semibold tracking-[-0.015em] transition-colors",
                  isDarkSurface
                    ? "text-white/80 hover:bg-white/10 hover:text-white"
                    : "text-[#4c4c56] hover:bg-black/5 hover:text-[#08090c]"
                )}
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
