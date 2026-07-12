"use client";

import { useEffect, useMemo, useRef, useState } from "react";

function parseMetric(value: string) {
  const trimmed = value.trim();
  const match = trimmed.match(/^(\d+(?:\.\d+)?)(.*)$/);

  if (!match) {
    return { target: 0, suffix: trimmed, decimals: 0 };
  }

  const numeric = Number(match[1]);
  const decimals = match[1].includes(".") ? match[1].split(".")[1].length : 0;

  return {
    target: Number.isFinite(numeric) ? numeric : 0,
    suffix: match[2] ?? "",
    decimals,
  };
}

export default function CountUpValue({ value }: { value: string }) {
  const { target, suffix, decimals } = useMemo(() => parseMetric(value), [value]);
  const [current, setCurrent] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setCurrent(target);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.45 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [target]);

  useEffect(() => {
    if (!hasStarted) return;

    let frame = 0;
    const duration = 1250;
    const start = performance.now();

    const tick = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setCurrent(target * eased);

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setCurrent(target);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [hasStarted, target]);

  const formatted = current.toFixed(decimals);

  return (
    <span ref={ref} aria-label={value}>
      {formatted}
      {suffix}
    </span>
  );
}
