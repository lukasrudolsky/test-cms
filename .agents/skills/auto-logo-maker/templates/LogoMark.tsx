import type { SVGProps } from "react";

export type LogoMarkProps = SVGProps<SVGSVGElement> & {
  title?: string;
  decorative?: boolean;
};

export default function LogoMark({
  title = "Logo mark",
  decorative = false,
  ...props
}: LogoMarkProps) {
  const titleId = props.id ? `${props.id}-title` : undefined;

  return (
    <svg
      viewBox="0 0 32 32"
      role={decorative ? "presentation" : "img"}
      aria-hidden={decorative ? true : undefined}
      aria-labelledby={!decorative && titleId ? titleId : undefined}
      fill="none"
      {...props}
    >
      {!decorative && titleId ? <title id={titleId}>{title}</title> : null}
      <path d="M16 4L26 10V22L16 28L6 22V10L16 4Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <path d="M11 16H21M16 11V21" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
