type LogoProps = { size?: number; className?: string; title?: string; decorative?: boolean };
export function Logo({ size = 180, className = "", title = "Enoki", decorative = false }: LogoProps) { return <img src="/brand/logo-horizontal.svg" width={size} className={className} alt={decorative ? "" : title} aria-hidden={decorative || undefined} />; }
