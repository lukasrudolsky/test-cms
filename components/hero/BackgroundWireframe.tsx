const DOT_SIZE = "24px 24px";
const BASE_DOTS = "radial-gradient(rgba(8,9,12,0.09) 1.8px, transparent 1.8px)";
const GLOW_DOTS = "radial-gradient(rgba(115,87,255,0.55) 1.8px, transparent 1.8px)";

export default function BackgroundWireframe() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0" style={{ backgroundImage: BASE_DOTS, backgroundSize: DOT_SIZE }} />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#f4f4f6] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#f4f4f6] to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_38%,rgba(244,244,246,0.95)_0%,rgba(244,244,246,0.75)_36%,rgba(244,244,246,0.22)_66%,rgba(244,244,246,0)_100%)]" />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: GLOW_DOTS,
          backgroundSize: DOT_SIZE,
          maskImage:
            "radial-gradient(circle 190px at var(--mx, 50%) var(--my, 50%), black 0%, rgba(0,0,0,0.75) 35%, rgba(0,0,0,0.28) 65%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(circle 190px at var(--mx, 50%) var(--my, 50%), black 0%, rgba(0,0,0,0.75) 35%, rgba(0,0,0,0.28) 65%, transparent 100%)",
          opacity: "var(--glow-opacity, 0)",
          transition: "opacity var(--glow-duration, 300ms) ease-out",
        }}
      />
    </div>
  );
}
