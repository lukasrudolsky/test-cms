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

export default function Navbar({ content }: NavbarProps) {
  return (
    <header className="fixed inset-x-0 top-5 z-50 flex justify-center px-6">
      <nav className="relative grid h-[64px] w-full max-w-[1120px] grid-cols-[1fr_auto_1fr] items-center overflow-hidden rounded-full border border-white/10 bg-black/40 px-6 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-2xl backdrop-saturate-150">
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
          <span className="text-[20px] font-semibold tracking-[-0.035em] text-white">{content.brand}</span>
        </a>

        <div className="relative hidden h-full items-center justify-center gap-9 [grid-column:2] lg:flex">
          {(content.links ?? []).map((link, index) => (
            <a
              key={`${link.label}-${index}`}
              href="#"
              className="text-[15px] font-semibold leading-[1] tracking-[-0.015em] text-white/65 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        <button className="relative ml-auto flex h-11 items-center justify-center rounded-full bg-white px-6 text-[15px] font-semibold leading-[1] tracking-[-0.015em] text-[#18191c] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)] transition-colors hover:bg-white/90 [grid-column:3]">
          {content.cta}
        </button>
      </nav>
    </header>
  );
}
