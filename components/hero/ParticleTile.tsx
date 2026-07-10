"use client";

import { useRef } from "react";
import ParticleMorph from "./ParticleMorph";

export default function ParticleTile() {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const resetTilt = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty("--tilt-x", "0deg");
    card.style.setProperty("--tilt-y", "0deg");
  };

  const updateTilt = (event: React.PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    card.style.setProperty("--tilt-x", `${(-y * 8).toFixed(2)}deg`);
    card.style.setProperty("--tilt-y", `${(x * 8).toFixed(2)}deg`);
  };

  return (
    <div className="relative [perspective:900px]">
      <div
        ref={cardRef}
        className="relative h-[260px] w-[260px] rounded-[46px] bg-[#06070b] p-[10px] shadow-[0_42px_105px_rgba(20,22,28,0.24)] ring-1 ring-black/10 transition-transform duration-300 ease-out [transform:rotateX(var(--tilt-x,0deg))_rotateY(var(--tilt-y,0deg))] [transform-style:preserve-3d]"
        onPointerLeave={resetTilt}
        onPointerMove={updateTilt}
      >
        <div className="absolute -inset-[34px] -z-10 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.96)_0%,rgba(236,237,239,0.88)_44%,rgba(244,244,246,0)_72%)]" />
        <div className="relative h-full w-full overflow-hidden rounded-[37px] border border-white/10 bg-[#05060a] [transform:translateZ(14px)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(116,88,255,0.22),rgba(6,7,11,0)_42%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0)_28%)]" />
          <ParticleMorph className="relative z-10 h-full w-full" />
        </div>
      </div>
    </div>
  );
}
