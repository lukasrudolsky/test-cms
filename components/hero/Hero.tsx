"use client";

import BackgroundWireframe from "./BackgroundWireframe";
import ExchangeCarousel from "./ExchangeCarousel";
import ParticleTile from "./ParticleTile";
import { openWaitlist } from "@/lib/waitlistStore";

type HeroProps = {
  content: {
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
  };
  image?: string;
  imageAlt?: string;
};

function DotArrowIcon({ dark = false }: { dark?: boolean }) {
  return (
    <span
      className={`grid size-4 place-items-center rounded-full ${
        dark ? "bg-[#151518] text-white" : "bg-white text-[#7357ff]"
      }`}
      aria-hidden="true"
    >
      <svg className="size-2" viewBox="0 0 8 8" fill="none">
        <path
          d="M2 4h4M4.5 2 6.5 4 4.5 6"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.2"
        />
      </svg>
    </span>
  );
}

export default function Hero({ content, image, imageAlt }: HeroProps) {
  return (
    <section className="relative flex min-h-screen w-full flex-col items-center overflow-hidden bg-[#f4f4f6] px-5 pb-10 pt-[138px] text-center text-[#08090c]">
      {/* Color behind the navbar so its glass blur has something visible to distort */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[300px] bg-[radial-gradient(46%_82%_at_50%_0%,rgba(115,87,255,0.10),rgba(115,87,255,0)_72%)]"
      />
      <BackgroundWireframe />
      <div className="relative z-10">
        {image && (
          <img
            src={image}
            alt={imageAlt ?? ""}
            className="absolute left-1/2 top-1/2 h-[180px] w-[180px] -translate-x-1/2 -translate-y-1/2 rounded-[32px] object-cover opacity-80 blur-[1px] sm:h-[230px] sm:w-[230px] lg:h-[290px] lg:w-[290px]"
          />
        )}
        <ParticleTile />
      </div>

      <div className="relative z-10 mt-[58px] flex w-full flex-col items-center">
        <h1 className="max-w-[900px] text-balance text-[40px] font-medium leading-[0.96] tracking-[-0.05em] text-[#08090c] sm:text-[52px] sm:leading-[0.94] md:text-[64px] lg:text-[72px] lg:leading-[0.92] lg:tracking-[-0.07em]">
          {content.title.split("\n").map((line, index, lines) => (
            <span key={line}>
              {line}
              {index < lines.length - 1 && <br />}
            </span>
          ))}
        </h1>

        <p className="mt-8 max-w-[720px] text-balance text-[16px] font-medium leading-[1.45] tracking-[-0.02em] text-[#85858e]">
          {content.description.split("\n").map((line, index, lines) => (
            <span key={line}>
              {line}
              {index < lines.length - 1 && <br className="hidden sm:block" />}
            </span>
          ))}
        </p>

        <div className="mt-8 flex w-full max-w-[380px] flex-col items-stretch gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:items-center sm:gap-4">
          <button
            type="button"
            onClick={() => openWaitlist()}
            className="flex h-12 w-full items-center justify-center gap-2.5 rounded-full bg-[#7357ff] px-6 text-[14px] font-semibold tracking-[-0.02em] text-white shadow-[0_12px_24px_rgba(115,87,255,0.24)] transition-transform hover:-translate-y-px sm:w-[180px]"
          >
            {content.primaryCta}
            <DotArrowIcon />
          </button>
          <button className="flex h-12 w-full items-center justify-center rounded-full border border-black/[0.04] bg-white px-6 text-[14px] font-semibold tracking-[-0.02em] text-[#191a1e] shadow-[0_10px_22px_rgba(24,25,30,0.06)] transition-transform hover:-translate-y-px sm:w-[180px]">
            {content.secondaryCta}
          </button>
        </div>

        <ExchangeCarousel />
      </div>
    </section>
  );
}
