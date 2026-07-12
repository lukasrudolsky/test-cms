import type { SVGProps } from "react";
import LogoMark from "./LogoMark";

export type LogoVariant = "default" | "light" | "dark" | "monochrome";
export type LogoSize = "sm" | "md" | "lg";

export type LogoProps = SVGProps<HTMLDivElement> & {
  variant?: LogoVariant;
  size?: LogoSize;
  title?: string;
  decorative?: boolean;
  wordmark?: string;
};

const sizeClass: Record<LogoSize, string> = {
  sm: "h-6",
  md: "h-8",
  lg: "h-10",
};

const variantClass: Record<LogoVariant, string> = {
  default: "text-current",
  light: "text-white",
  dark: "text-black",
  monochrome: "text-current",
};

export default function Logo({
  variant = "default",
  size = "md",
  title = "Logo",
  decorative = false,
  wordmark,
  className,
  ...props
}: LogoProps) {
  return (
    <div
      className={[variantClass[variant], "inline-flex items-center gap-2", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <LogoMark className={sizeClass[size]} title={title} decorative={decorative} />
      {wordmark ? (
        <span className="text-sm font-semibold tracking-[-0.02em]">{wordmark}</span>
      ) : null}
    </div>
  );
}
