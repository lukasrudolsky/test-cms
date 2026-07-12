"use client";

import { useRef } from "react";
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

export default function Hero({ content, image, imageAlt }: HeroProps) {
  const sectionRef = useRef<HTMLElement | null>(null);

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const section = sectionRef.current;
    if (!section) return;
    const rect = section.getBoundingClientRect();
    section.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    section.style.setProperty("--my", `${event.clientY - rect.top}px`);

    const target = event.target as HTMLElement;
    const overContent = !!target.closest("h1, p, a, button, img, svg, nav");
    section.style.setProperty("--glow-duration", overContent ? "0ms" : "300ms");
    section.style.setProperty("--glow-opacity", overContent ? "0" : "1");
  };

  const hideGlow = () => {
    const section = sectionRef.current;
    if (!section) return;
    section.style.setProperty("--glow-duration", "300ms");
    section.style.setProperty("--glow-opacity", "0");
  };

  return (
    <section
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={hideGlow}
      className="hero-glow-tracker relative flex min-h-screen w-full flex-col items-center overflow-hidden bg-[#f4f4f6] px-5 pb-4 pt-[124px] text-center text-[#08090c]"
    >
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
            className="btn-plastic-primary relative flex h-[61px] w-full items-center justify-center rounded-full bg-[#7357ff] px-6 font-[family-name:var(--font-inter)] text-[18px] font-semibold text-white transition-[transform,box-shadow] duration-200 sm:w-[201px]"
          >
            <span className="relative z-10">{content.primaryCta}</span>
          </button>
          <button
            type="button"
            className="btn-plastic-light relative flex h-[61px] w-full items-center justify-center rounded-full bg-white px-6 font-[family-name:var(--font-inter)] text-[18px] font-semibold text-[#191a1e] transition-[transform,box-shadow] duration-200 sm:w-[201px]"
          >
            <span className="relative z-10">{content.secondaryCta}</span>
          </button>
        </div>

        <ExchangeCarousel />
      </div>
    </section>
  );
}
