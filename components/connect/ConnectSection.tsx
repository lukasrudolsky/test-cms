"use client";

import { useEffect, useRef, useState } from "react";

type ConnectContent = {
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  featureOne: string;
  featureTwo: string;
};

function ArrowCircle() {
  return (
    <span className="grid size-4 place-items-center rounded-full bg-white text-[#342d4d]">
      <svg className="size-2" viewBox="0 0 8 8" fill="none" aria-hidden="true">
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

function TinyIcon({ variant }: { variant: "wallet" | "support" }) {
  return (
    <div className="grid size-10 place-items-center rounded-lg bg-[#191722] text-white shadow-[0_10px_24px_rgba(0,0,0,0.22)]">
      <svg className="size-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        {variant === "wallet" ? (
          <>
            <rect x="5" y="6" width="14" height="12" rx="3" stroke="currentColor" strokeWidth="2" />
            <path d="M9 10.5h5M16.5 12.5h.01" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
          </>
        ) : (
          <>
            <rect x="6" y="5" width="12" height="14" rx="2" fill="currentColor" />
            <path d="M9 9h6M9 13h4" stroke="#191722" strokeLinecap="round" strokeWidth="2" />
          </>
        )}
      </svg>
    </div>
  );
}

function CarouselArrow({ direction }: { direction: "left" | "right" }) {
  const path = direction === "left" ? "M14 6 8 12l6 6" : "m10 6 6 6-6 6";

  return (
    <svg className="size-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={path} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
    </svg>
  );
}

function CodePanel() {
  const rows = Array.from({ length: 21 }, (_, index) => index + 1);

  return (
    <div className="absolute bottom-0 left-8 top-8 w-[55%] overflow-hidden rounded-[24px] bg-white shadow-[0_26px_80px_rgba(24,18,62,0.3)] animate-connect-code-float">
      <div className="grid grid-cols-[40px_1fr] gap-2 px-6 py-6 font-mono text-[12px] leading-[1.72]">
        <div className="select-none text-right text-[#d7d7df]">
          {rows.map((row) => (
            <div key={row}>{row}</div>
          ))}
        </div>
        <pre className="overflow-hidden whitespace-pre-wrap text-[#bbb9c6]">
          <span>{`// Initializing the Connect component\n\n`}</span>
          <span className="text-[#ff68ca]">import</span>
          <span>{` { `}</span>
          <span className="text-[#738fff]">registerEnokiConnectWallets</span>
          <span>{` } `}</span>
          <span className="text-[#ff68ca]">from</span>
          <span className="text-[#ffad6e]">{` '@mysten/enoki-connect';\n\n`}</span>
          <span className="text-[#ffad6e]">{`registerEnokiConnectWallets({\n`}</span>
          <span>{`  publicAppSlugs: [`}</span>
          <span className="text-[#ffad6e]">{`'Replace_With_Source_Public_App_Slug'`}</span>
          <span>{`],\n  dappName: `}</span>
          <span className="text-[#ffad6e]">{`'Your DApp name'`}</span>
          <span>{`,\n});`}</span>
        </pre>
      </div>
    </div>
  );
}

function PurpleScreen({
  content,
  screenImage,
  screenImageAlt,
}: {
  content: ConnectContent;
  screenImage?: string;
  screenImageAlt?: string;
}) {
  return (
    <div className="absolute inset-[18px] overflow-hidden rounded-[14px] bg-[#120926]">
      <div className="absolute inset-0 scale-110 bg-[radial-gradient(circle_at_23%_8%,rgba(128,54,255,0.98),transparent_32%),radial-gradient(circle_at_80%_44%,rgba(236,55,255,0.88),transparent_39%),radial-gradient(circle_at_70%_92%,rgba(74,20,148,0.98),transparent_48%),linear-gradient(115deg,#5e20e2_0%,#9b19db_43%,#6516b8_100%)] animate-connect-purple-flow" />
      <div className="absolute inset-0 opacity-70 mix-blend-screen bg-[radial-gradient(ellipse_at_17%_2%,rgba(255,255,255,0.24),transparent_30%),radial-gradient(ellipse_at_74%_62%,rgba(255,119,242,0.34),transparent_31%),radial-gradient(ellipse_at_88%_24%,rgba(255,255,255,0.12),transparent_24%)]" />
      {screenImage && (
        <img
          src={screenImage}
          alt={screenImageAlt ?? ""}
          className="absolute inset-0 h-full w-full object-cover opacity-45 mix-blend-screen"
        />
      )}
      <div className="absolute inset-y-[-18%] left-[-22%] w-[44%] bg-white/20 blur-2xl animate-connect-sheen" />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#21104f]/85 to-transparent" />
      <div className="absolute right-[-80px] top-[-40px] h-[330px] w-[330px] rounded-full bg-[#f24dff]/25 blur-3xl" />
      <CodePanel />

      <div className="absolute right-10 top-[102px] w-[230px] text-white">
        <TinyIcon variant="wallet" />
        <h3 className="mt-5 text-[18px] font-semibold leading-[0.93] tracking-[-0.045em]">
          {content.featureOne}
        </h3>

        <div className="mt-9">
          <TinyIcon variant="support" />
          <h3 className="mt-5 text-[18px] font-semibold leading-[0.93] tracking-[-0.045em]">
            {content.featureTwo}
          </h3>
        </div>
      </div>
    </div>
  );
}

function MacBookShowcase({
  content,
  screenImage,
  screenImageAlt,
}: {
  content: ConnectContent;
  screenImage?: string;
  screenImageAlt?: string;
}) {
  return (
    <div className="absolute left-1/2 top-0 w-[900px] -translate-x-1/2">
      <div className="relative mx-auto h-[514px] animate-connect-laptop-float">
        <div className="absolute left-1/2 top-0 h-[456px] w-[796px] -translate-x-1/2 rounded-t-[32px] border border-[#73737a] bg-gradient-to-b from-[#bfc0c5] via-[#4f5157] to-[#18191d] p-[6px] shadow-[0_34px_90px_rgba(0,0,0,0.42)]">
          <div className="relative h-full overflow-hidden rounded-t-[28px] border border-black bg-black p-[14px]">
            <div className="absolute left-1/2 top-0 z-20 h-[30px] w-[108px] -translate-x-1/2 rounded-b-[12px] bg-black">
              <span className="absolute left-1/2 top-2 grid size-3 -translate-x-1/2 place-items-center rounded-full bg-[#111824]">
                <span className="size-1.5 rounded-full bg-[#25364d]" />
              </span>
            </div>
            <div className="relative h-full overflow-hidden rounded-[10px] bg-black">
              <PurpleScreen content={content} screenImage={screenImage} screenImageAlt={screenImageAlt} />
            </div>
          </div>
        </div>

        <div className="absolute bottom-2 left-1/2 h-[62px] w-[900px] -translate-x-1/2 rounded-b-[32px] rounded-t-[4px] bg-[linear-gradient(180deg,#eceef0_0%,#b7babf_30%,#777a7e_58%,#f0f1f2_100%)] shadow-[0_22px_36px_rgba(0,0,0,0.36)]">
          <div className="absolute left-1/2 top-0 h-[20px] w-[162px] -translate-x-1/2 rounded-b-[18px] bg-[linear-gradient(180deg,#d9dbde,#f8f9fa_72%,#b5b7bb)] shadow-[inset_0_1px_4px_rgba(0,0,0,0.25)]" />
          <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-white/70 to-black/10" />
          <div className="absolute bottom-0 left-10 h-4 w-32 rounded-t-full bg-black/18 blur-sm" />
          <div className="absolute bottom-0 right-10 h-4 w-32 rounded-t-full bg-black/18 blur-sm" />
        </div>
      </div>
    </div>
  );
}

export default function ConnectSection({
  content,
  screenImage,
  screenImageAlt,
}: {
  content: ConnectContent;
  screenImage?: string;
  screenImageAlt?: string;
}) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setActive(true);
      },
      { rootMargin: "-25% 0px -25% 0px", threshold: 0.2 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`relative overflow-hidden px-5 pb-24 pt-9 transition-colors duration-1000 ease-out ${
        active ? "bg-[#15141c]" : "bg-[#f4f4f6]"
      }`}
    >
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          active ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      >
        <div className="absolute left-[-7%] top-[-18px] h-36 w-[30%] rounded-full border-[46px] border-[#201d2b]/45" />
        <div className="absolute right-[-5%] top-[-2px] h-36 w-[31%] rounded-full border-[46px] border-[#201d2b]/45" />
        <div className="absolute bottom-16 left-[7%] h-36 w-[36%] rounded-full border-[46px] border-[#201d2b]/45" />
        <div className="absolute bottom-12 right-[4%] h-36 w-[36%] rounded-full border-[46px] border-[#201d2b]/45" />
      </div>

      <div className="relative mx-auto max-w-[930px]">
        <div className="mb-9 grid grid-cols-1 items-start gap-6 sm:grid-cols-[1fr_auto]">
          <div>
            <div className="mb-5 inline-flex h-11 items-center rounded-lg border border-white/10 bg-white/[0.04] px-4 text-[14px] font-semibold text-white">
              {content.eyebrow}
            </div>
            <h2 className="max-w-[760px] text-[28px] font-medium leading-[1.02] tracking-[-0.04em] text-white sm:text-[34px] lg:text-[40px] lg:leading-[0.98] lg:tracking-[-0.055em]">
              {content.title}
            </h2>
            <p className="mt-4 max-w-[470px] text-[18px] font-medium leading-[1.35] tracking-[-0.03em] text-[#7f7b8d]">
              {content.description}
            </p>
          </div>

          <button className="mt-0 flex h-12 items-center gap-3 self-start rounded-full bg-[#332c4b] px-6 text-[14px] font-semibold text-white shadow-[0_14px_36px_rgba(0,0,0,0.18)]">
            {content.cta}
            <ArrowCircle />
          </button>
        </div>

        <div className="relative h-[225px] overflow-hidden sm:h-[294px] md:h-[401px] lg:h-[535px] lg:overflow-visible">
          <div className="origin-top scale-[0.42] sm:scale-[0.55] md:scale-[0.75] lg:scale-100">
            <div className="absolute left-[-470px] top-7 h-[456px] w-[455px] rounded-[16px] border border-dashed border-[#514a69]" />
            <div className="absolute right-[-470px] top-7 h-[456px] w-[455px] rounded-[16px] border border-dashed border-[#514a69]" />
            <button className="absolute left-[-125px] top-[256px] grid size-9 -translate-y-1/2 place-items-center text-[#827b91]">
              <CarouselArrow direction="left" />
            </button>
            <button className="absolute right-[-125px] top-[256px] grid size-9 -translate-y-1/2 place-items-center text-[#827b91]">
              <CarouselArrow direction="right" />
            </button>

            <MacBookShowcase content={content} screenImage={screenImage} screenImageAlt={screenImageAlt} />
          </div>
        </div>

        <div className="mt-10 flex justify-center gap-7">
          <span className="h-px w-8 bg-[#5c556d]" />
          <span className="h-0.5 w-8 bg-white" />
          <span className="h-px w-8 bg-[#5c556d]" />
        </div>
      </div>
    </section>
  );
}
