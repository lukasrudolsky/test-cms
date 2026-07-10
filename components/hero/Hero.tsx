import BackgroundWireframe from "./BackgroundWireframe";
import ExchangeCarousel from "./ExchangeCarousel";
import ParticleTile from "./ParticleTile";

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
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[340px] bg-[radial-gradient(52%_100%_at_50%_0%,rgba(115,87,255,0.28),rgba(115,87,255,0)_70%)]"
      />
      <BackgroundWireframe />
      <div className="relative z-10">
        {image && (
          <img
            src={image}
            alt={imageAlt ?? ""}
            className="absolute left-1/2 top-1/2 h-[290px] w-[290px] -translate-x-1/2 -translate-y-1/2 rounded-[32px] object-cover opacity-80 blur-[1px]"
          />
        )}
        <ParticleTile />
      </div>

      <div className="relative z-10 mt-[58px] flex w-full flex-col items-center">
        <h1 className="max-w-[900px] text-balance text-[72px] font-medium leading-[0.92] tracking-[-0.07em] text-[#08090c]">
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

        <div className="mt-8 flex items-center justify-center gap-4">
          <button className="flex h-12 w-[180px] items-center justify-center gap-2.5 rounded-full bg-[#7357ff] px-6 text-[14px] font-semibold tracking-[-0.02em] text-white shadow-[0_12px_24px_rgba(115,87,255,0.24)] transition-transform hover:-translate-y-px">
            {content.primaryCta}
            <DotArrowIcon />
          </button>
          <button className="flex h-12 w-[180px] items-center justify-center rounded-full border border-black/[0.04] bg-white px-6 text-[14px] font-semibold tracking-[-0.02em] text-[#191a1e] shadow-[0_10px_22px_rgba(24,25,30,0.06)] transition-transform hover:-translate-y-px">
            {content.secondaryCta}
          </button>
        </div>

        <ExchangeCarousel />
      </div>
    </section>
  );
}
